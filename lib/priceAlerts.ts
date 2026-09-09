import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { observedMarketRange } from "@/lib/marketChecks";
import { absoluteUrl } from "@/lib/site";
import { php } from "@/lib/utils";

function escapeHtml(value:string){
  return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]||char));
}

export function priceAlertsConfigured(){
  return Boolean(
    process.env.PRICE_ALERTS_ENABLED==="true" &&
    process.env.PRICE_ALERT_CRON_CONFIGURED==="true" &&
    process.env.RESEND_API_KEY &&
    process.env.PRICE_ALERT_FROM_EMAIL &&
    process.env.PRICE_ALERT_CRON_SECRET &&
    databaseConfigured()
  );
}

export function priceAlertConfigStatus(){
  return {
    enabled:process.env.PRICE_ALERTS_ENABLED==="true",
    cronConfigured:process.env.PRICE_ALERT_CRON_CONFIGURED==="true",
    database:databaseConfigured(),
    resend:Boolean(process.env.RESEND_API_KEY),
    fromEmail:Boolean(process.env.PRICE_ALERT_FROM_EMAIL),
    cronSecret:Boolean(process.env.PRICE_ALERT_CRON_SECRET),
    ready:priceAlertsConfigured()
  };
}

export function currentModelAlertPrice(modelId:string){
  const model=getModelById(modelId);
  if(!model||model.marketStatus==="previous"||model.marketStatus==="discontinued")return null;
  const range=observedMarketRange(model);
  return {
    model,
    pricePhp:range.from,
    checkedAt:model.marketPriceCheckedAt||model.verifiedAt
  };
}

async function sendEmail({to,subject,text,html}:{to:string;subject:string;text:string;html:string}){
  const apiKey=process.env.RESEND_API_KEY;
  const from=process.env.PRICE_ALERT_FROM_EMAIL;
  if(!apiKey||!from)throw new Error("Email delivery is not configured.");

  const response=await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${apiKey}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      from,
      to:[to],
      subject,
      text,
      html,
      ...(process.env.PRICE_ALERT_REPLY_TO?{reply_to:process.env.PRICE_ALERT_REPLY_TO}:{})
    })
  });

  if(!response.ok){
    const message=await response.text().catch(()=>"");
    throw new Error(`Email delivery failed (${response.status})${message?`: ${message.slice(0,160)}`:""}`);
  }
}

export async function sendPriceAlertConfirmation(input:{
  email:string;
  modelLabel:string;
  targetPricePhp:number;
  confirmToken:string;
}){
  const confirmUrl=absoluteUrl(`/price-alerts/confirm/${input.confirmToken}`);
  const label=escapeHtml(input.modelLabel);
  const target=php(input.targetPricePhp);
  await sendEmail({
    to:input.email,
    subject:`Confirm your ${input.modelLabel} price alert`,
    text:`Confirm your MotoIndex price alert for ${input.modelLabel} at ${target} or lower: ${confirmUrl}\n\nIf you did not request this alert, ignore this email.`,
    html:`<p>Confirm your MotoIndex price alert for <strong>${label}</strong> at <strong>${target}</strong> or lower.</p><p><a href="${confirmUrl}">Confirm price alert</a></p><p>If you did not request this alert, ignore this email.</p>`
  });
}

async function sendThresholdEmail(input:{
  email:string;
  modelLabel:string;
  modelHref:string;
  currentPricePhp:number;
  targetPricePhp:number;
  checkedAt:string;
  unsubscribeToken:string;
}){
  const modelUrl=absoluteUrl(input.modelHref);
  const unsubscribeUrl=absoluteUrl(`/price-alerts/unsubscribe/${input.unsubscribeToken}`);
  const label=escapeHtml(input.modelLabel);
  const current=php(input.currentPricePhp);
  const target=php(input.targetPricePhp);
  await sendEmail({
    to:input.email,
    subject:`${input.modelLabel} reached your MotoIndex price target`,
    text:`${input.modelLabel} is now referenced from ${current}, meeting your target of ${target} or lower. Price checked ${input.checkedAt}. Review the current sources: ${modelUrl}\n\nPrices can change. Confirm the final dealer quote before buying.\n\nUnsubscribe: ${unsubscribeUrl}`,
    html:`<p><strong>${label}</strong> is now referenced from <strong>${current}</strong>, meeting your target of <strong>${target}</strong> or lower.</p><p>Price checked ${escapeHtml(input.checkedAt)}. <a href="${modelUrl}">Review the current price sources</a>.</p><p>Prices can change. Confirm the final dealer quote before buying.</p><p><a href="${unsubscribeUrl}">Unsubscribe from this alert</a></p>`
  });
}

export async function runPriceAlertCheck(limit=200){
  if(!priceAlertsConfigured())throw new Error("Price alerts are not fully configured.");
  const subscriptions=await prisma.priceAlertSubscription.findMany({
    where:{status:"active",confirmedAt:{not:null}},
    orderBy:{updatedAt:"asc"},
    take:Math.max(1,Math.min(limit,500))
  });

  let checked=0;
  let sent=0;
  let errors=0;
  const now=new Date();

  for(const subscription of subscriptions){
    const current=currentModelAlertPrice(subscription.entityId);
    if(!current)continue;
    checked+=1;
    const target=Number(subscription.targetPricePhp);
    const thresholdMet=current.pricePhp<=target;

    try{
      if(thresholdMet&&!subscription.thresholdWasMet){
        await sendThresholdEmail({
          email:subscription.email,
          modelLabel:`${current.model.make} ${current.model.model}`,
          modelHref:`/motorcycles/${current.model.makeSlug}/${current.model.slug}`,
          currentPricePhp:current.pricePhp,
          targetPricePhp:target,
          checkedAt:current.checkedAt,
          unsubscribeToken:subscription.unsubscribeToken
        });
        sent+=1;
        await prisma.priceAlertSubscription.update({
          where:{id:subscription.id},
          data:{
            thresholdWasMet:true,
            lastCheckedAt:now,
            lastObservedPricePhp:current.pricePhp,
            lastAlertedPricePhp:current.pricePhp,
            lastSentAt:now
          }
        });
      }else{
        await prisma.priceAlertSubscription.update({
          where:{id:subscription.id},
          data:{
            thresholdWasMet:thresholdMet?subscription.thresholdWasMet:false,
            lastCheckedAt:now,
            lastObservedPricePhp:current.pricePhp
          }
        });
      }
    }catch{
      errors+=1;
      await prisma.priceAlertSubscription.update({
        where:{id:subscription.id},
        data:{lastCheckedAt:now,lastObservedPricePhp:current.pricePhp}
      }).catch(()=>{});
    }
  }

  return {checked,sent,errors};
}

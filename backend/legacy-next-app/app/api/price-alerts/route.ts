import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { currentModelAlertPrice, priceAlertsConfigured, sendPriceAlertConfirmation } from "@/lib/priceAlerts";

export const runtime="nodejs";

function clean(value:unknown,max=160){
  return typeof value==="string"?value.trim().slice(0,max):"";
}

export async function POST(request:Request){
  if(!priceAlertsConfigured()||!databaseConfigured()){
    return NextResponse.json({ok:false,error:"Price alerts are not fully configured yet."},{status:503,headers:{"Cache-Control":"no-store"}});
  }

  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}

  const modelId=clean(body.modelId,100);
  const email=clean(body.email,160).toLowerCase();
  const consent=body.consent===true;
  const target=Number(body.targetPricePhp);
  const current=currentModelAlertPrice(modelId);

  if(!current)return NextResponse.json({ok:false,error:"Choose a current motorcycle with a published price reference."},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({ok:false,error:"Enter a valid email address."},{status:400});
  if(!consent)return NextResponse.json({ok:false,error:"Consent is required before creating a price alert."},{status:400});
  if(!Number.isFinite(target)||target<1000||target>20_000_000)return NextResponse.json({ok:false,error:"Enter a valid target price in PHP."},{status:400});
  if(target>=current.pricePhp)return NextResponse.json({ok:false,error:`Set a target below the current published starting-price reference of ₱${current.pricePhp.toLocaleString("en-PH")}.`},{status:400});

  const active=await prisma.priceAlertSubscription.findFirst({
    where:{entityType:"motorcycle",entityId:modelId,email,status:"active"}
  });
  if(active){
    return NextResponse.json({ok:true,alreadyActive:true,message:"An active alert already exists for this email and motorcycle. Use its unsubscribe link before creating a replacement target."});
  }

  const confirmToken=randomBytes(32).toString("hex");
  const unsubscribeToken=randomBytes(32).toString("hex");
  const recentPending=await prisma.priceAlertSubscription.findFirst({
    where:{entityType:"motorcycle",entityId:modelId,email,status:"pending"},
    orderBy:{updatedAt:"desc"}
  });

  const subscription=recentPending
    ? await prisma.priceAlertSubscription.update({
        where:{id:recentPending.id},
        data:{
          targetPricePhp:Math.round(target),
          confirmToken,
          unsubscribeToken,
          confirmedAt:null,
          thresholdWasMet:false,
          lastCheckedAt:null,
          lastObservedPricePhp:null,
          lastAlertedPricePhp:null,
          lastSentAt:null
        }
      })
    : await prisma.priceAlertSubscription.create({
        data:{
          entityType:"motorcycle",
          entityId:modelId,
          email,
          targetPricePhp:Math.round(target),
          status:"pending",
          confirmToken,
          unsubscribeToken
        }
      });

  try{
    await sendPriceAlertConfirmation({
      email,
      modelLabel:`${current.model.make} ${current.model.model}`,
      targetPricePhp:Number(subscription.targetPricePhp),
      confirmToken
    });
  }catch{
    return NextResponse.json({ok:false,error:"We saved the alert but could not send the confirmation email. Try again later."},{status:503});
  }

  return NextResponse.json({
    ok:true,
    message:`Check ${email} and confirm the alert before it can send notifications.`
  },{status:201,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
}

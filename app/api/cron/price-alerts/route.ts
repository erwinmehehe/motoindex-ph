import { NextResponse } from "next/server";
import { garageRemindersConfigured, runGarageReminderCheck } from "@/lib/garageReminders";
import { priceAlertsConfigured, runPriceAlertCheck } from "@/lib/priceAlerts";

export const runtime="nodejs";
export const dynamic="force-dynamic";

function authorized(request:Request){
  const expected=process.env.PRICE_ALERT_CRON_SECRET;
  const header=request.headers.get("authorization")||"";
  return Boolean(expected&&header===`Bearer ${expected}`);
}

async function run(request:Request){
  if(!authorized(request))return NextResponse.json({ok:false,error:"Unauthorized."},{status:401,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  const priceReady=priceAlertsConfigured();
  const garageReady=garageRemindersConfigured();
  if(!priceReady&&!garageReady)return NextResponse.json({ok:false,error:"Scheduled notification services are not fully configured."},{status:503,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  try{
    const result=priceReady?await runPriceAlertCheck(500):{checked:0,sent:0,errors:0};
    const garageReminders=garageReady?await runGarageReminderCheck(500):{checked:0,sent:0,errors:0,skipped:true};
    return NextResponse.json({ok:true,...result,garageReminders},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }catch{
    return NextResponse.json({ok:false,error:"Scheduled notification check failed."},{status:500,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
}

export const GET=run;
export const POST=run;

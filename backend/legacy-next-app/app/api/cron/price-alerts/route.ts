import { NextResponse } from "next/server";
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
  if(!priceAlertsConfigured())return NextResponse.json({ok:false,error:"Price alerts are not fully configured."},{status:503,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  try{
    const result=await runPriceAlertCheck(500);
    return NextResponse.json({ok:true,...result},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }catch{
    return NextResponse.json({ok:false,error:"Price alert check failed."},{status:500,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});
  }
}

export const GET=run;
export const POST=run;

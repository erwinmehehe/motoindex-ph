import { NextResponse } from "next/server";
import { priceAlertsConfigured, runPriceAlertCheck } from "@/lib/priceAlerts";

export const runtime="nodejs";

export async function POST(){
  if(!priceAlertsConfigured())return NextResponse.json({ok:false,error:"Price alerts are not fully configured."},{status:503});
  try{
    const result=await runPriceAlertCheck(500);
    return NextResponse.json({ok:true,...result},{headers:{"Cache-Control":"no-store"}});
  }catch{
    return NextResponse.json({ok:false,error:"Price alert check failed."},{status:500});
  }
}

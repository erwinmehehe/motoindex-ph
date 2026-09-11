import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

export async function POST(_request:Request,{params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Price alert service unavailable."},{status:503});
  const {token}=await params;
  const subscription=await prisma.priceAlertSubscription.findUnique({where:{unsubscribeToken:token}});
  if(!subscription)return NextResponse.json({ok:false,error:"Price alert not found."},{status:404});

  if(subscription.status!=="unsubscribed"){
    await prisma.priceAlertSubscription.update({
      where:{id:subscription.id},
      data:{status:"unsubscribed",confirmToken:null,thresholdWasMet:false}
    });
  }

  return NextResponse.json({ok:true,status:"unsubscribed"},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"}});
}

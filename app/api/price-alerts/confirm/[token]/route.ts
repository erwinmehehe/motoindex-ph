import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

export async function POST(_request:Request,{params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Price alert service unavailable."},{status:503});
  const {token}=await params;
  const subscription=await prisma.priceAlertSubscription.findUnique({where:{confirmToken:token}});
  if(!subscription||subscription.status!=="pending")return NextResponse.json({ok:false,error:"This confirmation link is invalid or already used."},{status:404});
  if(Date.now()-subscription.updatedAt.getTime()>24*60*60*1000)return NextResponse.json({ok:false,error:"This confirmation link has expired. Create the alert again."},{status:410});

  await prisma.priceAlertSubscription.update({
    where:{id:subscription.id},
    data:{status:"active",confirmedAt:new Date(),confirmToken:null,thresholdWasMet:false}
  });

  return NextResponse.json({ok:true,status:"active"},{headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"}});
}

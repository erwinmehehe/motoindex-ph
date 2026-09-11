import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string;deliveryId:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});
  const {id,deliveryId}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const action=body.action==="ready"?"ready":body.action==="cancel"?"cancel":"";
  if(!action)return NextResponse.json({ok:false,error:"Invalid delivery action."},{status:400});

  const delivery=await prisma.dealerLeadDelivery.findFirst({where:{id:deliveryId,leadId:id}});
  if(!delivery)return NextResponse.json({ok:false,error:"Delivery not found."},{status:404});
  if(delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"This secure lead link has expired."},{status:410});

  if(action==="cancel"){
    const updated=await prisma.dealerLeadDelivery.update({where:{id:delivery.id},data:{status:"cancelled"}});
    return NextResponse.json({ok:true,status:updated.status});
  }

  const updated=await prisma.dealerLeadDelivery.update({
    where:{id:delivery.id},
    data:{status:delivery.status==="pending"?"ready":delivery.status,sharedAt:delivery.sharedAt||new Date()}
  });
  return NextResponse.json({ok:true,status:updated.status,sharedAt:updated.sharedAt?.toISOString()});
}

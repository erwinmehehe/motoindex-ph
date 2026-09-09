import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";
const allowed=new Set(["opened","contacted","closed"]);

export async function PATCH(request:Request,{params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Lead service unavailable."},{status:503});
  const {token}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const action=typeof body.action==="string"?body.action:"";
  if(!allowed.has(action))return NextResponse.json({ok:false,error:"Invalid action."},{status:400});

  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{deliveryToken:token},include:{lead:true}});
  if(!delivery||delivery.status==="pending"||delivery.status==="cancelled")return NextResponse.json({ok:false,error:"Secure lead link is not active."},{status:404});
  if(delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"Secure lead link has expired."},{status:410});

  const now=new Date();
  const status=action==="opened"?(delivery.status==="ready"?"opened":delivery.status):action;
  await prisma.$transaction([
    prisma.dealerLeadDelivery.update({
      where:{id:delivery.id},
      data:{status,openedAt:action==="opened"?(delivery.openedAt||now):delivery.openedAt}
    }),
    ...(action==="contacted"||action==="closed"?[prisma.dealerLead.update({where:{id:delivery.leadId},data:{status:action}})]:[])
  ]);

  return NextResponse.json({ok:true,status});
}

import { NextResponse } from "next/server";
import { getDealerSession, dealerRequestOriginAllowed } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
const allowed=new Set(["opened","contacted","closed"]);

export async function PATCH(request:Request,{params}:{params:Promise<{deliveryId:string}>}){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403});
  const session=await getDealerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to Dealer Portal."},{status:401});
  const {deliveryId}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const action=typeof body.action==="string"?body.action:"";
  if(!allowed.has(action))return NextResponse.json({ok:false,error:"Invalid action."},{status:400});

  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{id:deliveryId}});
  if(!delivery||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"Buyer request is unavailable."},{status:404});
  const authorized=session.account.memberships.some(item=>item.seller.slug===delivery.sellerSlug&&item.seller.status==="verified");
  if(!authorized)return NextResponse.json({ok:false,error:"You cannot manage this buyer request."},{status:403});

  const now=new Date();
  const status=action==="opened"?(delivery.status==="ready"?"opened":delivery.status):action;
  await prisma.$transaction([
    prisma.dealerLeadDelivery.update({where:{id:delivery.id},data:{status,openedAt:action==="opened"?(delivery.openedAt||now):delivery.openedAt}}),
    ...(action==="contacted"||action==="closed"?[prisma.dealerLead.update({where:{id:delivery.leadId},data:{status:action}})]:[])
  ]);
  return NextResponse.json({ok:true,status});
}

import { NextResponse } from "next/server";
import { getDealerSession, dealerRequestOriginAllowed } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};

async function authorizedDelivery(deliveryId:string){
  const session=await getDealerSession();
  if(!session)return null;
  const slugs=new Set(session.account.memberships.filter(item=>item.seller.status==="verified").map(item=>item.seller.slug));
  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{id:deliveryId},include:{lead:true,quoteResponse:true}});
  return delivery&&slugs.has(delivery.sellerSlug)?delivery:null;
}

export async function GET(_request:Request,{params}:{params:Promise<{deliveryId:string}>}){
  const {deliveryId}=await params;
  const delivery=await authorizedDelivery(deliveryId);
  if(!delivery||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"Lead not found."},{status:404,headers});
  return NextResponse.json({ok:true,delivery:{
    id:delivery.id,status:delivery.status,sellerName:delivery.sellerName,expiresAt:delivery.expiresAt.toISOString(),
    lead:{make:delivery.lead.make,model:delivery.lead.model,variant:delivery.lead.variant,cityProvince:delivery.lead.cityProvince,purchaseType:delivery.lead.purchaseType,downPaymentBudget:delivery.lead.downPaymentBudget,fullName:delivery.lead.fullName,mobile:delivery.lead.mobile,email:delivery.lead.email,createdAt:delivery.lead.createdAt.toISOString()},
    quote:delivery.quoteResponse?{id:delivery.quoteResponse.id,cashPricePhp:delivery.quoteResponse.cashPricePhp?Number(delivery.quoteResponse.cashPricePhp):null,downPaymentPhp:delivery.quoteResponse.downPaymentPhp?Number(delivery.quoteResponse.downPaymentPhp):null,monthlyPhp:delivery.quoteResponse.monthlyPhp?Number(delivery.quoteResponse.monthlyPhp):null,termMonths:delivery.quoteResponse.termMonths,availability:delivery.quoteResponse.availability,validUntil:delivery.quoteResponse.validUntil?.toISOString()||null,dealerNote:delivery.quoteResponse.dealerNote||""}:null
  }},{headers});
}

export async function PATCH(request:Request,{params}:{params:Promise<{deliveryId:string}>}){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const {deliveryId}=await params;
  const delivery=await authorizedDelivery(deliveryId);
  if(!delivery||delivery.status==="cancelled"||delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"Lead not found."},{status:404,headers});
  let body:Record<string,unknown>;try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  const action=body.action==="opened"?"opened":body.action==="contacted"?"contacted":body.action==="closed"?"closed":"";
  if(!action)return NextResponse.json({ok:false,error:"Invalid action."},{status:400,headers});
  const now=new Date();
  const status=action==="opened"?(delivery.status==="ready"?"opened":delivery.status):action;
  await prisma.$transaction([
    prisma.dealerLeadDelivery.update({where:{id:delivery.id},data:{status,openedAt:action==="opened"?(delivery.openedAt||now):delivery.openedAt}}),
    ...(action==="contacted"||action==="closed"?[prisma.dealerLead.update({where:{id:delivery.leadId},data:{status:action}})]:[])
  ]);
  return NextResponse.json({ok:true,status},{headers});
}

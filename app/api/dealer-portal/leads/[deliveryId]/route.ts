import { NextResponse } from "next/server";
import { getDealerSession, dealerRequestOriginAllowed } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};
const allowed=new Set(["opened","contacted","closed"]);

export async function PATCH(request:Request,{params}:{params:Promise<{deliveryId:string}>}){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const session=await getDealerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to Dealer Portal."},{status:401,headers});
  const {deliveryId}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  const action=typeof body.action==="string"?body.action:"";
  if(!allowed.has(action))return NextResponse.json({ok:false,error:"Invalid action."},{status:400,headers});

  const slugs=new Set(session.account.memberships.map(item=>item.seller.slug));
  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{id:deliveryId},include:{lead:true}});
  if(!delivery||!slugs.has(delivery.sellerSlug))return NextResponse.json({ok:false,error:"Lead not found."},{status:404,headers});
  if(delivery.status==="cancelled"||delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"This lead is no longer active."},{status:410,headers});

  const now=new Date();
  const status=action==="opened"?(delivery.status==="ready"||delivery.status==="pending"?"opened":delivery.status):action;
  await prisma.$transaction([
    prisma.dealerLeadDelivery.update({where:{id:delivery.id},data:{status,openedAt:action==="opened"?(delivery.openedAt||now):delivery.openedAt}}),
    ...(action==="contacted"||action==="closed"?[prisma.dealerLead.update({where:{id:delivery.leadId},data:{status:action}})]:[])
  ]);
  return NextResponse.json({ok:true,status},{headers});
}

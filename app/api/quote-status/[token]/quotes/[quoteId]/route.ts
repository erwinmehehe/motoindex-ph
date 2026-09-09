import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";
const allowed=new Set(["interested","declined"]);

export async function PATCH(request:Request,{params}:{params:Promise<{token:string;quoteId:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Quote status service unavailable."},{status:503});
  const {token,quoteId}=await params;

  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const decision=typeof body.decision==="string"?body.decision:"";
  if(!allowed.has(decision))return NextResponse.json({ok:false,error:"Invalid quote response."},{status:400});

  const lead=await prisma.dealerLead.findUnique({
    where:{buyerAccessToken:token},
    select:{id:true,buyerAccessExpiresAt:true}
  });
  if(!lead||!lead.buyerAccessExpiresAt||lead.buyerAccessExpiresAt<=new Date())return NextResponse.json({ok:false,error:"Private quote-status link is unavailable or expired."},{status:404});

  const quote=await prisma.dealerQuoteResponse.findFirst({
    where:{id:quoteId,delivery:{leadId:lead.id,status:{not:"cancelled"}}},
    select:{id:true}
  });
  if(!quote)return NextResponse.json({ok:false,error:"Dealer quote not found."},{status:404});

  const now=new Date();
  await prisma.$transaction([
    prisma.dealerQuoteResponse.update({
      where:{id:quote.id},
      data:{buyerDecision:decision,buyerDecisionAt:now}
    }),
    ...(decision==="interested"?[
      prisma.dealerLead.update({where:{id:lead.id},data:{status:"buyer_interested"}})
    ]:[])
  ]);

  return NextResponse.json({
    ok:true,
    decision,
    message:decision==="interested"?"Marked as interested. The dealer can see this signal in MotoIndex operations.":"Marked as not for me."
  });
}

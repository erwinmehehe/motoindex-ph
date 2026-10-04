import { NextResponse } from "next/server";
import { getDealerSession, dealerRequestOriginAllowed } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";

export const runtime="nodejs";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};
function clean(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}
function money(value:unknown){const number=Number(value);return Number.isFinite(number)&&number>0&&number<=20_000_000?Math.round(number*100)/100:null;}

export async function PUT(request:Request,{params}:{params:Promise<{deliveryId:string}>}){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const session=await getDealerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to Dealer Portal."},{status:401,headers});
  const {deliveryId}=await params;
  const slugs=new Set(session.account.memberships.map(item=>item.seller.slug));
  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{id:deliveryId},include:{lead:true}});
  if(!delivery||!slugs.has(delivery.sellerSlug))return NextResponse.json({ok:false,error:"Lead not found."},{status:404,headers});
  if(delivery.status==="cancelled"||delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"This lead is no longer active."},{status:410,headers});

  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  const cashPricePhp=money(body.cashPricePhp);
  const downPaymentPhp=money(body.downPaymentPhp);
  const monthlyPhp=money(body.monthlyPhp);
  const termRaw=Number(body.termMonths);
  const termMonths=Number.isFinite(termRaw)&&termRaw>=1&&termRaw<=84?Math.round(termRaw):null;
  const availability=clean(body.availability,80);
  const dealerNote=clean(body.dealerNote,1200);
  const validUntilRaw=clean(body.validUntil,20);
  const validUntil=validUntilRaw?new Date(`${validUntilRaw}T23:59:59+08:00`):null;
  if(!cashPricePhp&&!monthlyPhp)return NextResponse.json({ok:false,error:"Enter a cash price or a monthly installment amount."},{status:400,headers});
  if(monthlyPhp&&(!downPaymentPhp||!termMonths))return NextResponse.json({ok:false,error:"Installment quotes require down payment and term."},{status:400,headers});
  if(!availability)return NextResponse.json({ok:false,error:"Choose the current availability."},{status:400,headers});
  if(validUntil&&(!Number.isFinite(validUntil.getTime())||validUntil<=new Date()))return NextResponse.json({ok:false,error:"Quote validity date must be in the future."},{status:400,headers});

  const saved=await prisma.$transaction(async tx=>{
    const quote=await tx.dealerQuoteResponse.upsert({
      where:{deliveryId:delivery.id},
      update:{cashPricePhp,downPaymentPhp,monthlyPhp,termMonths,availability,validUntil,dealerNote:dealerNote||null,submittedAt:new Date()},
      create:{deliveryId:delivery.id,cashPricePhp,downPaymentPhp,monthlyPhp,termMonths,availability,validUntil,dealerNote:dealerNote||null}
    });
    await tx.dealerLeadDelivery.update({where:{id:delivery.id},data:{status:"quoted",openedAt:delivery.openedAt||new Date()}});
    await tx.dealerLead.update({where:{id:delivery.leadId},data:{status:"quoted"}});
    return quote;
  });
  return NextResponse.json({ok:true,status:"quoted",quote:{
    cashPricePhp:saved.cashPricePhp?Number(saved.cashPricePhp):null,
    downPaymentPhp:saved.downPaymentPhp?Number(saved.downPaymentPhp):null,
    monthlyPhp:saved.monthlyPhp?Number(saved.monthlyPhp):null,
    termMonths:saved.termMonths,availability:saved.availability,validUntil:saved.validUntil?.toISOString()||null,dealerNote:saved.dealerNote||""
  }},{headers});
}

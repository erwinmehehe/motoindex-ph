import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

function clean(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}
function money(value:unknown){
  const number=Number(value);
  return Number.isFinite(number)&&number>0&&number<=20_000_000?Math.round(number*100)/100:null;
}

export async function PUT(request:Request,{params}:{params:Promise<{token:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Quote service unavailable."},{status:503});
  const {token}=await params;

  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}

  const delivery=await prisma.dealerLeadDelivery.findUnique({where:{deliveryToken:token},include:{lead:true}});
  if(!delivery||delivery.status==="pending"||delivery.status==="cancelled")return NextResponse.json({ok:false,error:"Secure lead link is not active."},{status:404});
  if(delivery.expiresAt<=new Date())return NextResponse.json({ok:false,error:"Secure lead link has expired."},{status:410});

  const cashPricePhp=money(body.cashPricePhp);
  const downPaymentPhp=money(body.downPaymentPhp);
  const monthlyPhp=money(body.monthlyPhp);
  const termRaw=Number(body.termMonths);
  const termMonths=Number.isFinite(termRaw)&&termRaw>=1&&termRaw<=84?Math.round(termRaw):null;
  const availability=clean(body.availability,80);
  const dealerNote=clean(body.dealerNote,1200);
  const validUntilRaw=clean(body.validUntil,20);
  const validUntil=validUntilRaw?new Date(`${validUntilRaw}T23:59:59+08:00`):null;

  if(!cashPricePhp&&!monthlyPhp)return NextResponse.json({ok:false,error:"Enter a cash price or a monthly installment amount."},{status:400});
  if(monthlyPhp&&(!downPaymentPhp||!termMonths))return NextResponse.json({ok:false,error:"Installment quotes require down payment and term."},{status:400});
  if(!availability)return NextResponse.json({ok:false,error:"Choose the current availability."},{status:400});
  if(validUntil&&(!Number.isFinite(validUntil.getTime())||validUntil<=new Date()))return NextResponse.json({ok:false,error:"Quote validity date must be in the future."},{status:400});

  const response=await prisma.$transaction(async tx=>{
    const saved=await tx.dealerQuoteResponse.upsert({
      where:{deliveryId:delivery.id},
      update:{cashPricePhp,downPaymentPhp,monthlyPhp,termMonths,availability,validUntil,dealerNote:dealerNote||null,submittedAt:new Date()},
      create:{deliveryId:delivery.id,cashPricePhp,downPaymentPhp,monthlyPhp,termMonths,availability,validUntil,dealerNote:dealerNote||null}
    });
    await tx.dealerLeadDelivery.update({
      where:{id:delivery.id},
      data:{status:"quoted",openedAt:delivery.openedAt||new Date()}
    });
    await tx.dealerLead.update({
      where:{id:delivery.leadId},
      data:{status:"quoted"}
    });
    return saved;
  });

  return NextResponse.json({
    ok:true,
    status:"quoted",
    quote:{
      cashPricePhp:response.cashPricePhp?Number(response.cashPricePhp):null,
      downPaymentPhp:response.downPaymentPhp?Number(response.downPaymentPhp):null,
      monthlyPhp:response.monthlyPhp?Number(response.monthlyPhp):null,
      termMonths:response.termMonths,
      availability:response.availability,
      validUntil:response.validUntil?.toISOString()||null,
      dealerNote:response.dealerNote||""
    }
  });
}

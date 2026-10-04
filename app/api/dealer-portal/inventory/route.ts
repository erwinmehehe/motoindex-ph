import { NextResponse } from "next/server";
import { getDealerSession, dealerRequestOriginAllowed } from "@/lib/dealerAuth";
import { prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const headers={"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow, noarchive"};

function clean(value:unknown,max=180){return typeof value==="string"?value.trim().slice(0,max):"";}
function money(value:unknown){const n=Number(value);return Number.isFinite(n)&&n>0&&n<=20_000_000?Math.round(n*100)/100:null;}
function allowedUrl(value:string){if(!value)return true;try{const u=new URL(value);return u.protocol==="https:"||u.protocol==="http:";}catch{return false;}}

export async function POST(request:Request){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const session=await getDealerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to Dealer Portal."},{status:401,headers});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}

  const sellerId=clean(body.sellerId,80);
  const entityId=clean(body.entityId,100);
  const membership=session.account.memberships.find(item=>item.sellerId===sellerId&&item.seller.status==="verified");
  if(!membership)return NextResponse.json({ok:false,error:"This branch is not available to your dealer account."},{status:403,headers});
  const model=getModelById(entityId);
  if(!model||model.marketStatus==="previous"||model.marketStatus==="discontinued")return NextResponse.json({ok:false,error:"Choose a current MotoIndex motorcycle."},{status:400,headers});

  const pricePhp=money(body.pricePhp);
  const downPaymentPhp=money(body.downPaymentPhp);
  const monthlyPhp=money(body.monthlyPhp);
  const termRaw=Number(body.termMonths);
  const termMonths=Number.isFinite(termRaw)&&termRaw>=1&&termRaw<=84?Math.round(termRaw):null;
  if(!pricePhp)return NextResponse.json({ok:false,error:"Enter the current cash price."},{status:400,headers});
  if(monthlyPhp&&(!downPaymentPhp||!termMonths))return NextResponse.json({ok:false,error:"Installment offers require down payment and term."},{status:400,headers});

  const availability=clean(body.availability,40);
  if(!["in_stock","limited","preorder","out_of_stock","confirm"].includes(availability))return NextResponse.json({ok:false,error:"Choose a valid availability status."},{status:400,headers});
  const expiresRaw=clean(body.expiresAt,20);
  const expiresAt=new Date(`${expiresRaw}T23:59:59+08:00`);
  if(!expiresRaw||!Number.isFinite(expiresAt.getTime())||expiresAt<=new Date())return NextResponse.json({ok:false,error:"Choose a future inventory expiry date."},{status:400,headers});
  if(expiresAt.getTime()>Date.now()+45*24*60*60*1000)return NextResponse.json({ok:false,error:"Dealer inventory must be re-confirmed at least every 45 days."},{status:400,headers});
  const targetUrl=clean(body.targetUrl,300);
  if(!allowedUrl(targetUrl))return NextResponse.json({ok:false,error:"Dealer URL must be a valid web address."},{status:400,headers});

  const now=new Date();
  const variantLabel=clean(body.variantLabel,80)||null;
  const colorLabel=clean(body.colorLabel,80)||null;
  const existing=await prisma.sellerOffer.findFirst({
    where:{sellerId,entityType:"motorcycle",entityId,publicationSource:"dealer_portal",status:"dealer_published",variantLabel,colorLabel},
    orderBy:{updatedAt:"desc"}
  });
  const data={
    sellerId,entityType:"motorcycle",entityId,pricePhp,downPaymentPhp,monthlyPhp,termMonths,
    availability,status:"dealer_published",observedAt:now,verifiedAt:null,publicationSource:"dealer_portal",
    dealerPublishedAt:now,variantLabel,colorLabel,
    promoLabel:clean(body.promoLabel,120)||null,expiresAt,targetUrl:targetUrl||membership.seller.website||null,affiliateUrl:null
  };
  const offer=existing
    ? await prisma.sellerOffer.update({where:{id:existing.id},data})
    : await prisma.sellerOffer.create({data});
  await prisma.offerPriceObservation.create({data:{offerId:offer.id,pricePhp,observedAt:now,status:"dealer_published"}});
  return NextResponse.json({ok:true,id:offer.id},{status:existing?200:201,headers});
}

export async function DELETE(request:Request){
  if(!dealerRequestOriginAllowed(request))return NextResponse.json({ok:false,error:"Invalid request origin."},{status:403,headers});
  const session=await getDealerSession();
  if(!session)return NextResponse.json({ok:false,error:"Sign in to Dealer Portal."},{status:401,headers});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400,headers});}
  const id=clean(body.id,100);
  const offer=await prisma.sellerOffer.findUnique({where:{id}});
  if(!offer||offer.publicationSource!=="dealer_portal")return NextResponse.json({ok:false,error:"Inventory entry not found."},{status:404,headers});
  if(!session.account.memberships.some(item=>item.sellerId===offer.sellerId))return NextResponse.json({ok:false,error:"You cannot manage this inventory entry."},{status:403,headers});
  await prisma.sellerOffer.update({where:{id},data:{status:"expired",expiresAt:new Date()}});
  return NextResponse.json({ok:true},{headers});
}

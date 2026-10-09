import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { validateRuntimeAffiliateUrl } from "@/lib/runtimeAffiliate";
import { getAffiliateLink } from "@/lib/affiliate";

export const runtime="nodejs";

function clean(value:unknown,max=500){
  return typeof value==="string"?value.trim().slice(0,max):"";
}

export async function PUT(request:Request,{params}:{params:Promise<{productId:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Production database is not configured."},{status:503});
  const {productId}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}

  let url=clean(body.url,1200);
  const status=body.status==="disabled"?"disabled":"active";
  const reviewNote=clean(body.reviewNote,1000);
  const destinationUrl=clean(body.destinationUrl,1200);
  if(reviewNote.length<5)return NextResponse.json({ok:false,error:"Add a short review note before saving the affiliate destination."},{status:400});

  // Let administrators disable an invalid old shortcut without first
  // certifying the obsolete link as a product-specific destination.
  if(status==="disabled"){
    const existing=await prisma.affiliateProductLink.findUnique({where:{productId}});
    if(existing){
      const row=await prisma.affiliateProductLink.update({
        where:{productId},data:{status:"disabled",approvedAt:null,reviewNote}
      });
      return NextResponse.json({ok:true,productId:row.productId,merchant:row.merchant,network:row.network,status:row.status,approvedAt:null});
    }
    const fallback=getAffiliateLink(productId);
    if(!fallback)return NextResponse.json({ok:false,error:"There is no active affiliate link to disable for this product."},{status:404});
    url=fallback.url;
  }
  const checked=validateRuntimeAffiliateUrl(productId,url,destinationUrl||undefined);
  if(!checked.ok)return NextResponse.json({ok:false,error:checked.error},{status:400});

  let row;
  try{
    row=await prisma.affiliateProductLink.upsert({
    where:{productId},
    update:{
      merchant:"shopee",
      network:checked.network,
      url:checked.url,
      destinationUrl:checked.destinationUrl,
      status,
      reviewNote,
      approvedAt:status==="active"?new Date():null
    },
    create:{
      productId,
      merchant:"shopee",
      network:checked.network,
      url:checked.url,
      destinationUrl:checked.destinationUrl,
      status,
      reviewNote,
      approvedAt:status==="active"?new Date():null
    }
  });
  }catch{
    return NextResponse.json({ok:false,error:"Affiliate runtime table is unavailable. Apply the latest Prisma migration first."},{status:503});
  }

  return NextResponse.json({
    ok:true,
    productId:row.productId,
    merchant:row.merchant,
    network:row.network,
    status:row.status,
    approvedAt:row.approvedAt?.toISOString()||null
  });
}

export async function DELETE(_request:Request,{params}:{params:Promise<{productId:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Production database is not configured."},{status:503});
  const {productId}=await params;
  const existing=await prisma.affiliateProductLink.findUnique({where:{productId}});
  if(!existing)return NextResponse.json({ok:true,removed:false});
  await prisma.affiliateProductLink.delete({where:{productId}});
  return NextResponse.json({ok:true,removed:true});
}

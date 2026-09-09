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
  if(!url&&status==="disabled"){
    const existing=await prisma.affiliateProductLink.findUnique({where:{productId}});
    url=existing?.url||getAffiliateLink(productId)?.url||"";
  }
  const checked=validateRuntimeAffiliateUrl(productId,url);
  if(!checked.ok)return NextResponse.json({ok:false,error:status==="disabled"&&!url?"No existing affiliate destination is available to disable.":checked.error},{status:400});
  if(reviewNote.length<5)return NextResponse.json({ok:false,error:"Add a short review note before saving the affiliate destination."},{status:400});

  let row;
  try{
    row=await prisma.affiliateProductLink.upsert({
    where:{productId},
    update:{
      merchant:"shopee",
      network:checked.network,
      url:checked.url,
      status,
      reviewNote,
      approvedAt:status==="active"?new Date():null
    },
    create:{
      productId,
      merchant:"shopee",
      network:checked.network,
      url:checked.url,
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

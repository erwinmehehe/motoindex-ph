import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { validateRuntimeAffiliateUrl } from "@/lib/runtimeAffiliate";

export const runtime="nodejs";

function clean(value:unknown,max=1000){return typeof value==="string"?value.trim().slice(0,max):"";}

export async function POST(request:Request){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Production database is not configured."},{status:503});
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  if(!Array.isArray(body.rows)||body.rows.length===0)return NextResponse.json({ok:false,error:"Add at least one affiliate row."},{status:400});
  if(body.rows.length>100)return NextResponse.json({ok:false,error:"Bulk import is limited to 100 rows at a time."},{status:400});

  const prepared=[];
  const issues:string[]=[];
  for(let index=0;index<body.rows.length;index++){
    const raw=body.rows[index];
    if(!raw||typeof raw!=="object"||Array.isArray(raw)){issues.push(`Row ${index+1}: invalid row.`);continue;}
    const row=raw as Record<string,unknown>;
    const productId=clean(row.productId,120);
    const url=clean(row.url,1200);
    const reviewNote=clean(row.reviewNote,1000);
    const checked=validateRuntimeAffiliateUrl(productId,url);
    if(!checked.ok){issues.push(`Row ${index+1} (${productId||"no product ID"}): ${checked.error}`);continue;}
    if(reviewNote.length<5){issues.push(`Row ${index+1} (${productId}): review note is too short.`);continue;}
    prepared.push({productId,url:checked.url,network:checked.network,reviewNote});
  }

  if(issues.length)return NextResponse.json({ok:false,error:"Bulk validation failed.",issues},{status:400});

  try{
    await prisma.$transaction(prepared.map(row=>prisma.affiliateProductLink.upsert({
      where:{productId:row.productId},
      update:{merchant:"shopee",network:row.network,url:row.url,status:"active",reviewNote:row.reviewNote,approvedAt:new Date()},
      create:{productId:row.productId,merchant:"shopee",network:row.network,url:row.url,status:"active",reviewNote:row.reviewNote,approvedAt:new Date()}
    })));
  }catch{
    return NextResponse.json({ok:false,error:"Bulk affiliate write failed. Apply the latest Prisma migration and try again."},{status:503});
  }

  return NextResponse.json({ok:true,activated:prepared.length});
}

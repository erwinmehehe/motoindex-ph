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
    const destinationUrl=clean(row.destinationUrl,1200);
    const checked=validateRuntimeAffiliateUrl(productId,url,destinationUrl||undefined);
    if(!checked.ok){issues.push(`Row ${index+1} (${productId||"no product ID"}): ${checked.error}`);continue;}
    if(reviewNote.length<5){issues.push(`Row ${index+1} (${productId}): review note is too short.`);continue;}
    prepared.push({productId,url:checked.url,destinationUrl:checked.destinationUrl,network:checked.network,reviewNote});
  }

  const targetOwners=new Map<string,string>();
  for(const row of prepared){
    for(const value of [row.url,row.destinationUrl]){
      const previous=targetOwners.get(value);
      if(previous&&previous!==row.productId)issues.push(`The same tracking or destination URL is assigned to both ${previous} and ${row.productId}.`);
      else targetOwners.set(value,row.productId);
    }
  }
  if(issues.length)return NextResponse.json({ok:false,error:"Bulk validation failed.",issues},{status:400});

  try{
    const existing=await prisma.affiliateProductLink.findMany({
      where:{status:"active",OR:[
        {url:{in:prepared.map(row=>row.url)}},
        {destinationUrl:{in:prepared.map(row=>row.destinationUrl)}}
      ]},
      select:{productId:true,url:true,destinationUrl:true}
    });
    for(const row of prepared){
      const conflict=existing.find(entry=>entry.productId!==row.productId &&
        (entry.url===row.url||entry.destinationUrl===row.destinationUrl||entry.url===row.destinationUrl||entry.destinationUrl===row.url));
      if(conflict)issues.push(`Product ${row.productId}: exact item or tracking URL already belongs to ${conflict.productId}.`);
    }
    if(issues.length)return NextResponse.json({ok:false,error:"Bulk destination conflict.",issues},{status:409});

    await prisma.$transaction(prepared.map(row=>prisma.affiliateProductLink.upsert({
      where:{productId:row.productId},
      update:{merchant:"shopee",network:row.network,url:row.url,destinationUrl:row.destinationUrl,status:"active",reviewNote:row.reviewNote,approvedAt:new Date()},
      create:{productId:row.productId,merchant:"shopee",network:row.network,url:row.url,destinationUrl:row.destinationUrl,status:"active",reviewNote:row.reviewNote,approvedAt:new Date()}
    })));
  }catch{
    return NextResponse.json({ok:false,error:"Bulk affiliate write failed. Apply the latest Prisma migration and try again."},{status:503});
  }

  return NextResponse.json({ok:true,activated:prepared.length});
}

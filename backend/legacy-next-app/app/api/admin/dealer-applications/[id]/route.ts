import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { sellerSlug } from "@/lib/persistentSellers";

export const runtime="nodejs";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});
  const {id}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const action=body.action==="approve"?"approve":body.action==="reject"?"reject":"";
  const reviewNote=typeof body.reviewNote==="string"?body.reviewNote.trim().slice(0,1000):"";
  if(!action)return NextResponse.json({ok:false,error:"Choose approve or reject."},{status:400});
  if(reviewNote.length<10)return NextResponse.json({ok:false,error:"A review note is required."},{status:400});

  const application=await prisma.dealerApplication.findUnique({where:{id}});
  if(!application)return NextResponse.json({ok:false,error:"Application not found."},{status:404});

  if(action==="reject"){
    await prisma.dealerApplication.update({where:{id},data:{status:"rejected",reviewNote,reviewedAt:new Date()}});
    return NextResponse.json({ok:true,status:"rejected",message:"Application rejected. No public seller was created."});
  }

  if(!application.officialSourceUrl)return NextResponse.json({ok:false,error:"Add an official verification source before approval."},{status:400});
  const approvedBrands=application.brands.map(brand=>brand.trim()).filter(Boolean);
  if(!approvedBrands.length)return NextResponse.json({ok:false,error:"At least one named motorcycle brand is required before approval."},{status:400});

  const baseName=application.branchName?`${application.businessName} - ${application.branchName}`:application.businessName;
  const baseSlug=sellerSlug([application.businessName,application.branchName,application.city].filter(Boolean).join("-"))||`dealer-${application.id.slice(-8)}`;
  let slug=baseSlug;
  const collision=await prisma.seller.findUnique({where:{slug}});
  if(collision&&collision.id!==application.publishedSellerId)slug=`${baseSlug}-${application.id.slice(-6).toLowerCase()}`;

  const sellerData={
    name:baseName,
    slug,
    type:"dealer",
    city:application.city,
    province:application.province,
    region:application.region||application.province,
    addressLabel:application.addressLabel,
    website:application.website,
    phone:application.phone,
    brands:approvedBrands,
    categories:["Motorcycles","Dealer partner"],
    description:`${baseName} in ${application.city}, ${application.province}. This branch was submitted to MotoIndex and approved after its dealer evidence was reviewed.`,
    sourceLabel:"Dealer partner verification source",
    sourceUrl:application.officialSourceUrl,
    lastChecked:new Date(),
    verificationNote:reviewNote,
    leadContactName:application.contactName,
    leadEmail:application.contactEmail,
    leadMobile:application.contactMobile,
    status:"verified"
  };

  const seller=application.publishedSellerId
    ? await prisma.seller.update({where:{id:application.publishedSellerId},data:sellerData})
    : await prisma.seller.create({data:sellerData});

  await prisma.dealerApplication.update({
    where:{id},
    data:{status:"approved",reviewNote,reviewedAt:new Date(),publishedSellerId:seller.id}
  });

  return NextResponse.json({ok:true,status:"approved",sellerSlug:seller.slug,message:"Dealer approved and published to the verified seller database."});
}

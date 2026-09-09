import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

function clean(value:unknown,max=180){return typeof value==="string"?value.trim().slice(0,max):"";}
function phone(value:string){return value.replace(/[^0-9+]/g,"");}
function validUrl(value:string){if(!value)return true;try{const url=new URL(value);return url.protocol==="https:"||url.protocol==="http:";}catch{return false;}}

export async function POST(request:Request){
  const contentLength=Number(request.headers.get("content-length")||0);
  if(contentLength>30_000)return NextResponse.json({ok:false,error:"Request too large."},{status:413});
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Dealer applications are temporarily unavailable while the production database is being configured."},{status:503});

  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  if(clean(body.websiteCheck,80))return NextResponse.json({ok:true,message:"Application received."});

  const businessName=clean(body.businessName,120);
  const branchName=clean(body.branchName,120);
  const addressLabel=clean(body.addressLabel,220);
  const city=clean(body.city,100);
  const province=clean(body.province,100);
  const region=clean(body.region,100);
  const website=clean(body.website,240);
  const officialSourceUrl=clean(body.officialSourceUrl,240);
  const branchPhone=phone(clean(body.phone,40));
  const contactName=clean(body.contactName,100);
  const contactEmail=clean(body.contactEmail,140).toLowerCase();
  const contactMobile=phone(clean(body.contactMobile,40));
  const notes=clean(body.notes,1000);
  const consent=body.consent===true;
  const brands=Array.isArray(body.brands)?body.brands.map(item=>clean(item,60)).filter(Boolean).slice(0,20):[];

  if(businessName.length<2||addressLabel.length<6||city.length<2||province.length<2)return NextResponse.json({ok:false,error:"Complete the business name, branch address, city and province."},{status:400});
  if(branchPhone.length<7||contactMobile.length<10)return NextResponse.json({ok:false,error:"Enter valid branch and contact phone numbers."},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))return NextResponse.json({ok:false,error:"Enter a valid contact email."},{status:400});
  if(!validUrl(website)||!validUrl(officialSourceUrl))return NextResponse.json({ok:false,error:"Website and verification-source URLs must be valid web addresses."},{status:400});
  if(!consent)return NextResponse.json({ok:false,error:"Authorization and consent are required."},{status:400});

  const recent=await prisma.dealerApplication.findFirst({
    where:{contactEmail,businessName,createdAt:{gte:new Date(Date.now()-24*60*60*1000)}},
    orderBy:{createdAt:"desc"}
  });
  if(recent)return NextResponse.json({ok:true,message:"A recent application for this business is already in the review queue."});

  const application=await prisma.dealerApplication.create({data:{
    businessName,branchName:branchName||null,addressLabel,city,province,region:region||null,brands,
    website:website||null,phone:branchPhone,contactName,contactEmail,contactMobile,
    officialSourceUrl:officialSourceUrl||null,notes:notes||null,consentedAt:new Date(),status:"new"
  }});

  return NextResponse.json({ok:true,applicationId:application.id,message:"Application saved for verification. MotoIndex will not publish the branch or route buyer leads to it until a reviewer approves the dealer evidence."},{status:201});
}

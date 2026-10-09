import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess";
import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const denied=await requirePrivilegedApiAccess(request);if(denied)return denied;

  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});
  const {id}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const action=body.action==="publish"?"publish":body.action==="reject"?"reject":"";
  const moderatorNote=typeof body.moderatorNote==="string"?body.moderatorNote.trim().slice(0,1000):"";
  if(!action)return NextResponse.json({ok:false,error:"Choose publish or reject."},{status:400});
  if(moderatorNote.length<10)return NextResponse.json({ok:false,error:"A moderation note is required."},{status:400});

  const review=await prisma.ownerReview.findUnique({where:{id}});
  if(!review)return NextResponse.json({ok:false,error:"Owner review not found."},{status:404});
  const now=new Date();

  if(action==="reject"){
    await prisma.ownerReview.update({where:{id},data:{status:"rejected",moderatorNote,reviewedAt:now,publishedAt:null}});
    return NextResponse.json({ok:true,status:"rejected",message:"Owner review rejected and kept off public model pages."});
  }

  await prisma.ownerReview.update({where:{id},data:{status:"published",moderatorNote,reviewedAt:now,publishedAt:now}});
  return NextResponse.json({ok:true,status:"published",message:"Owner review published."});
}

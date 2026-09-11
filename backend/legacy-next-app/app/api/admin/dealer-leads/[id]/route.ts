import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";

export const runtime="nodejs";
const allowed=new Set(["new","matched","contacted","closed"]);

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!databaseConfigured())return NextResponse.json({ok:false,error:"Database unavailable."},{status:503});
  const {id}=await params;
  let body:Record<string,unknown>;
  try{body=await request.json();}catch{return NextResponse.json({ok:false,error:"Invalid request."},{status:400});}
  const status=typeof body.status==="string"?body.status:"";
  if(!allowed.has(status))return NextResponse.json({ok:false,error:"Invalid status."},{status:400});
  try{
    await prisma.dealerLead.update({where:{id},data:{status}});
    return NextResponse.json({ok:true,status});
  }catch{
    return NextResponse.json({ok:false,error:"Lead not found."},{status:404});
  }
}

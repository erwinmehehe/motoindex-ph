import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess";
import { NextResponse } from "next/server"; import { publishApprovedBatch } from "@/lib/persistentOffers";
export const runtime="nodejs";
export async function POST(_req:Request,{params}:{params:Promise<{id:string}>}){const denied=await requirePrivilegedApiAccess(_req);if(denied)return denied;
try{const {id}=await params;return NextResponse.json({ok:true,...await publishApprovedBatch(id)});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Publish failed"},{status:400});}}

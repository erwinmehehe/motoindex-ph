import { requirePrivilegedApiAccess } from "@/lib/privilegedApiAccess";
import { NextResponse } from "next/server"; import { stageOfferBatch } from "@/lib/persistentOffers";
export const runtime="nodejs";
export async function POST(req:Request){const denied=await requirePrivilegedApiAccess(req);if(denied)return denied;
try{const body=await req.json();const batch=await stageOfferBatch(body);return NextResponse.json({ok:true,batch});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Unable to stage batch"},{status:400});}}

import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { getVerifiedUsedListings } from "@/lib/persistentUsedListings";

export const runtime="nodejs";

export async function GET(request:Request){
  if(!databaseConfigured())return NextResponse.json({ok:true,databaseConfigured:false,listings:[]},{headers:{"Cache-Control":"no-store"}});
  const url=new URL(request.url);
  const modelId=url.searchParams.get("modelId")?.trim()||undefined;
  const rawLimit=Number(url.searchParams.get("limit")||50);
  const limit=Number.isFinite(rawLimit)?Math.min(Math.max(Math.round(rawLimit),1),100):50;
  const listings=await getVerifiedUsedListings({modelId,limit});
  return NextResponse.json({ok:true,databaseConfigured:true,listings},{headers:{"Cache-Control":"public, max-age=60, stale-while-revalidate=300"}});
}

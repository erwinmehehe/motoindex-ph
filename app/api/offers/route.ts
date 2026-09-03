import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { getVerifiedOffers } from "@/lib/persistentOffers";
import type { OfferEntityType } from "@/lib/types";
export const runtime="nodejs";
const types=new Set(["motorcycle","helmet","tire","topbox"]);
export async function GET(req:Request){
  if(!databaseConfigured()) return NextResponse.json({ok:false,error:"Seller offers are not enabled until the production database is configured."},{status:410,headers:{"Cache-Control":"no-store"}});
  const url=new URL(req.url),type=url.searchParams.get("entityType")||undefined,entityId=url.searchParams.get("entityId")||undefined;
  if(type&&!types.has(type))return NextResponse.json({error:"invalid entityType"},{status:400});
  const offers=await getVerifiedOffers({entityType:type as OfferEntityType|undefined,entityId});
  return NextResponse.json({ok:true,databaseConfigured:databaseConfigured(),offers},{headers:{"Cache-Control":"public, max-age=60, stale-while-revalidate=300"}});
}

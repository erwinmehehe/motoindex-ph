import { NextResponse } from "next/server"; import { getPriceHistory } from "@/lib/persistentOffers"; import type { OfferEntityType } from "@/lib/types";
export const runtime="nodejs";
const valid=new Set(["motorcycle","helmet","tire","topbox"]);
export async function GET(req:Request){const u=new URL(req.url),type=u.searchParams.get("entityType")||"",id=u.searchParams.get("entityId")||"";if(!valid.has(type)||!id)return NextResponse.json({error:"entityType and entityId required"},{status:400});return NextResponse.json({ok:true,history:await getPriceHistory(type as OfferEntityType,id)});}

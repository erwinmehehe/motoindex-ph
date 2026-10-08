import { NextResponse } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { matchQuoteEligibleDealers } from "@/lib/persistentSellers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

// Buyer-facing availability only: never return partner email addresses or lead-routing identifiers.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const make = (url.searchParams.get("make") || "").trim().slice(0, 60);
  const cityProvince = (url.searchParams.get("cityProvince") || "").trim().slice(0, 120);
  if (!make || cityProvince.length < 3) {
    return NextResponse.json({ ok: false, error: "Choose a motorcycle brand and enter a city or province." }, { status: 400, headers });
  }
  if (!databaseConfigured()) return NextResponse.json({ ok: true, available: false }, { headers });
  try {
    const available = (await matchQuoteEligibleDealers(make, cityProvince, 1)).length > 0;
    return NextResponse.json({ ok: true, available }, { headers });
  } catch {
    return NextResponse.json({ ok: false, error: "Dealer coverage is temporarily unavailable." }, { status: 503, headers });
  }
}

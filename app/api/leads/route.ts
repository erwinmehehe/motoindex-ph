import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { publicSellersByType } from "@/lib/sellers";

export const runtime = "nodejs";

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, "");
}

export async function POST(request: Request) {
  if (!databaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Dealer requests are temporarily unavailable while the production database is being configured." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (clean(body.website, 80)) {
    return NextResponse.json({ ok: true, queued: true, matchedDealers: 0 });
  }

  const modelExternalId = clean(body.modelId, 80);
  const model = getModelById(modelExternalId);
  if (!model || model.marketStatus === "previous" || model.marketStatus === "discontinued") {
    return NextResponse.json({ ok: false, error: "This motorcycle is not available for dealer requests." }, { status: 400 });
  }

  const fullName = clean(body.fullName, 100);
  const mobile = normalizePhone(clean(body.mobile, 40));
  const email = clean(body.email, 120).toLowerCase();
  const cityProvince = clean(body.cityProvince, 120);
  const variant = clean(body.variant, 80);
  const purchaseType = clean(body.purchaseType, 20);
  const consent = body.consent === true;
  const downPaymentRaw = Number(body.downPaymentBudget || 0);
  const downPaymentBudget = Number.isFinite(downPaymentRaw) && downPaymentRaw > 0
    ? Math.min(Math.round(downPaymentRaw), 10_000_000)
    : null;

  if (fullName.length < 2) return NextResponse.json({ ok: false, error: "Enter your name." }, { status: 400 });
  if (mobile.length < 10 || mobile.length > 15) return NextResponse.json({ ok: false, error: "Enter a valid mobile number." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address or leave it blank." }, { status: 400 });
  if (cityProvince.length < 3) return NextResponse.json({ ok: false, error: "Enter your city or province." }, { status: 400 });
  if (!["cash", "installment"].includes(purchaseType)) return NextResponse.json({ ok: false, error: "Choose cash or installment." }, { status: 400 });
  if (!consent) return NextResponse.json({ ok: false, error: "Consent is required before we can save and match your request." }, { status: 400 });

  const location = cityProvince.toLowerCase();
  const matched = publicSellersByType("dealer").filter((seller) => {
    const brandMatch = seller.brands.some((brand) => brand.toLowerCase() === model.make.toLowerCase());
    const locationMatch = location.includes(seller.city.toLowerCase()) || location.includes(seller.region.toLowerCase());
    return brandMatch && locationMatch;
  });

  const lead = await prisma.dealerLead.create({
    data: {
      modelExternalId: model.id,
      make: model.make,
      model: model.model,
      variant: variant || null,
      cityProvince,
      purchaseType,
      downPaymentBudget,
      fullName,
      mobile,
      email: email || null,
      consentedAt: new Date(),
      matchedSellerSlugs: matched.map((seller) => seller.slug),
      status: matched.length ? "matched" : "new",
      sourcePath: clean(body.sourcePath, 180) || `/get-quote/${model.makeSlug}/${model.slug}`,
    }
  });

  return NextResponse.json({
    ok: true,
    queued: true,
    leadId: lead.id,
    matchedDealers: matched.length,
    message: matched.length
      ? `Request saved and matched with ${matched.length} verified dealer${matched.length === 1 ? "" : "s"} covering your area.`
      : "Request saved. No verified dealer match is available for your area yet, so your details have not been shared with a dealer."
  }, { status: 201 });
}

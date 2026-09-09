// @ts-nocheck
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { databaseConfigured, prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { matchQuoteEligibleDealers } from "@/lib/persistentSellers";

export const runtime = "nodejs";

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizePhone(value: string) {
  return value.replace(/[^0-9+]/g, "");
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });

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

  const matched = await matchQuoteEligibleDealers(model.make, cityProvince, 3);

  const duplicateSince = new Date(Date.now() - 15 * 60 * 1000);
  const duplicate = await prisma.dealerLead.findFirst({
    where: { modelExternalId: model.id, mobile, createdAt: { gte: duplicateSince } },
    orderBy: { createdAt: "desc" }
  });
  if (duplicate) {
    let buyerAccessToken = duplicate.buyerAccessToken;
    let buyerAccessExpiresAt = duplicate.buyerAccessExpiresAt;
    if (!buyerAccessToken || !buyerAccessExpiresAt || buyerAccessExpiresAt <= new Date()) {
      buyerAccessToken = randomBytes(32).toString("hex");
      buyerAccessExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await prisma.dealerLead.update({
        where: { id: duplicate.id },
        data: { buyerAccessToken, buyerAccessExpiresAt }
      });
    }
    return NextResponse.json({
      ok: true,
      queued: true,
      leadId: duplicate.id,
      statusPath: `/quote-status/${buyerAccessToken}`,
      matchedDealers: duplicate.matchedSellerSlugs.length,
      message: duplicate.matchedSellerSlugs.length
        ? `Your recent request is already saved and matched with ${duplicate.matchedSellerSlugs.length} verified dealer partner${duplicate.matchedSellerSlugs.length === 1 ? "" : "s"}.`
        : "Your recent request is already saved. No verified dealer match is available for your area yet."
    });
  }

  const buyerAccessToken = randomBytes(32).toString("hex");
  const buyerAccessExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

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
      buyerAccessToken,
      buyerAccessExpiresAt,
    }
  });

  if (matched.length) {
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await prisma.dealerLeadDelivery.createMany({
      data: matched.map((seller) => ({
        leadId: lead.id,
        sellerSlug: seller.slug,
        sellerName: seller.name,
        dealerEmail: seller.leadEmail,
        deliveryToken: randomBytes(32).toString("hex"),
        expiresAt
      })),
      skipDuplicates: true
    });
  }

  return NextResponse.json({
    ok: true,
    queued: true,
    leadId: lead.id,
    statusPath: `/quote-status/${buyerAccessToken}`,
    matchedDealers: matched.length,
    message: matched.length
      ? `Request saved and matched with ${matched.length} verified dealer partner${matched.length === 1 ? "" : "s"} covering your area. MotoIndex reviews the handoff before any buyer details are shared.`
      : "Request saved. No verified dealer partner is currently available to receive this request in your area, so your details have not been shared with a dealer."
  }, { status: 201 });
}

import { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { ownerRequestOriginAllowed } from "@/lib/ownerAuth";
import { sendUsedListingInquiry, usedMarketplaceEmailConfigured } from "@/lib/usedMarketplace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!ownerRequestOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  }
  if (!databaseConfigured() || !usedMarketplaceEmailConfigured()) {
    return NextResponse.json({ ok: false, error: "Seller inquiries are temporarily unavailable." }, { status: 503, headers });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid inquiry." }, { status: 400, headers });
  }

  if (text(body.company, 200)) {
    return NextResponse.json({ ok: true, message: "Inquiry received." }, { headers });
  }

  const buyerName = text(body.name, 80);
  const buyerEmail = text(body.email, 160).toLowerCase();
  const buyerMobile = text(body.mobile, 30);
  const message = text(body.message, 1000);
  const consent = body.consent === true;

  if (buyerName.length < 2 || !validEmail(buyerEmail) || message.length < 10 || !consent) {
    return NextResponse.json({ ok: false, error: "Complete your name, email, message and consent before sending." }, { status: 400, headers });
  }

  const { id } = await context.params;
  const listing = await prisma.usedListing.findFirst({
    where: { id, status: "verified", ownerId: { not: null } },
    include: { owner: { select: { email: true } } },
  });
  if (!listing?.owner?.email) {
    return NextResponse.json({ ok: false, error: "This seller is not accepting MotoIndex inquiries." }, { status: 404, headers });
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.usedListingInquiry.count({
    where: { listingId: listing.id, buyerEmail, createdAt: { gte: oneHourAgo } },
  });
  if (recentCount >= 5) {
    return NextResponse.json({ ok: false, error: "Too many recent inquiries for this listing. Try again later." }, { status: 429, headers: { ...headers, "Retry-After": "3600" } });
  }

  const inquiry = await prisma.usedListingInquiry.create({
    data: {
      listingId: listing.id,
      buyerName,
      buyerEmail,
      buyerMobile: buyerMobile || null,
      message,
      consentedAt: new Date(),
      status: "pending_delivery",
    },
  });

  try {
    await sendUsedListingInquiry({
      sellerEmail: listing.owner.email,
      listingId: listing.id,
      listingTitle: listing.title,
      buyerName,
      buyerEmail,
      buyerMobile: buyerMobile || undefined,
      message,
    });
    await prisma.usedListingInquiry.update({ where: { id: inquiry.id }, data: { status: "sent" } });
  } catch (error) {
    await prisma.usedListingInquiry.update({ where: { id: inquiry.id }, data: { status: "delivery_failed" } }).catch(() => {});
    console.error("Used listing inquiry delivery failed", error);
    return NextResponse.json({ ok: false, error: "The inquiry could not be delivered. Try again later." }, { status: 502, headers });
  }

  return NextResponse.json({ ok: true, message: "Inquiry sent." }, { status: 201, headers });
}

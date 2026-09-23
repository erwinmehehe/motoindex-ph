import { NextResponse } from "next/server";
import { publicMotorcycles } from "@/lib/data";
import { prisma } from "@/lib/db";
import { parseGarageState } from "@/lib/garage";
import { getOwnerSession, ownerAuthConfigured, ownerRequestOriginAllowed } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const allowedConditions = new Set(["fair", "good", "excellent"]);

async function ownerOr401() {
  if (!ownerAuthConfigured()) {
    return { error: NextResponse.json({ ok: false, error: "MotoIndex owner accounts are not enabled." }, { status: 503, headers }) };
  }
  const session = await getOwnerSession();
  if (!session) {
    return { error: NextResponse.json({ ok: false, error: "Sign in to My Garage before submitting a listing." }, { status: 401, headers }) };
  }
  return { session };
}

export async function GET() {
  const auth = await ownerOr401();
  if ("error" in auth) return auth.error;
  const listings = await prisma.usedListing.findMany({
    where: { ownerId: auth.session.ownerId },
    orderBy: { updatedAt: "desc" },
    take: 25,
    select: {
      id: true,
      title: true,
      askingPricePhp: true,
      mileageKm: true,
      condition: true,
      location: true,
      status: true,
      postedAt: true,
      verifiedAt: true,
    },
  });
  return NextResponse.json({
    ok: true,
    listings: listings.map((item) => ({
      ...item,
      askingPricePhp: item.askingPricePhp.toNumber(),
      postedAt: item.postedAt.toISOString(),
      verifiedAt: item.verifiedAt?.toISOString() || null,
    })),
  }, { headers });
}

export async function POST(request: Request) {
  if (!ownerRequestOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  }
  const auth = await ownerOr401();
  if ("error" in auth) return auth.error;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid listing request." }, { status: 400, headers });
  }

  const garageMotorcycleLocalId = typeof body.garageMotorcycleLocalId === "string"
    ? body.garageMotorcycleLocalId.trim().slice(0, 120)
    : "";
  const condition = typeof body.condition === "string" ? body.condition.trim().toLowerCase() : "";
  const location = typeof body.location === "string" ? body.location.trim().slice(0, 120) : "";
  const askingPricePhp = Number(body.askingPricePhp);

  if (!garageMotorcycleLocalId || !allowedConditions.has(condition) || location.length < 2) {
    return NextResponse.json({ ok: false, error: "Complete the motorcycle, condition and location before submitting." }, { status: 400, headers });
  }
  if (!Number.isFinite(askingPricePhp) || askingPricePhp < 3_000 || askingPricePhp > 5_000_000) {
    return NextResponse.json({ ok: false, error: "Enter a realistic asking price before submitting." }, { status: 400, headers });
  }

  const snapshot = await prisma.garageSnapshot.findUnique({ where: { ownerId: auth.session.ownerId } });
  if (!snapshot) {
    return NextResponse.json({ ok: false, error: "Save this Garage to your private cloud copy before submitting a listing." }, { status: 409, headers });
  }

  const garage = parseGarageState(JSON.stringify(snapshot.payload));
  const bike = garage.motorcycles.find((item) => item.id === garageMotorcycleLocalId);
  if (!bike) {
    return NextResponse.json({ ok: false, error: "This motorcycle is not in your latest cloud Garage. Save My Garage again, then retry." }, { status: 409, headers });
  }
  if (!bike.catalogModelId || !bike.year) {
    return NextResponse.json({ ok: false, error: "Match this motorcycle to a MotoIndex model and add its model year before submitting." }, { status: 400, headers });
  }

  const model = publicMotorcycles.find((item) => item.id === bike.catalogModelId);
  if (!model) {
    return NextResponse.json({ ok: false, error: "The matched MotoIndex model is not available for public listings." }, { status: 400, headers });
  }

  const title = `${bike.year} ${model.make} ${model.model}${bike.variant ? ` ${bike.variant}` : ""}`.slice(0, 180);
  const existing = await prisma.usedListing.findFirst({
    where: { ownerId: auth.session.ownerId, garageMotorcycleLocalId },
    orderBy: { updatedAt: "desc" },
  });

  const data = {
    modelExternalId: model.id,
    title,
    modelYear: bike.year,
    mileageKm: Math.max(0, Math.round(bike.odometerKm || 0)),
    askingPricePhp: Math.round(askingPricePhp),
    condition,
    sellerType: "private owner",
    location,
    sourceLabel: "MotoIndex owner submission",
    sourceUrl: null,
    status: "submitted",
    postedAt: new Date(),
    verifiedAt: null,
    ownerId: auth.session.ownerId,
    garageMotorcycleLocalId,
  };

  const listing = existing
    ? await prisma.usedListing.update({ where: { id: existing.id }, data })
    : await prisma.usedListing.create({ data });

  return NextResponse.json({
    ok: true,
    listing: {
      id: listing.id,
      title: listing.title,
      status: listing.status,
      askingPricePhp: listing.askingPricePhp.toNumber(),
      mileageKm: listing.mileageKm,
      location: listing.location,
      postedAt: listing.postedAt.toISOString(),
    },
    message: "Listing submitted for MotoIndex review.",
  }, { status: existing ? 200 : 201, headers });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ownerRequestOriginAllowed } from "@/lib/ownerAuth";
import { ownerListingUrl } from "@/lib/usedMarketplace";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const actions = new Set(["verify", "reject", "expire"]);

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!ownerRequestOriginAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403, headers });
  }

  const form = await request.formData();
  const action = String(form.get("action") || "");
  if (!actions.has(action)) {
    return NextResponse.json({ ok: false, error: "Unknown listing review action." }, { status: 400, headers });
  }

  const { id } = await context.params;
  const listing = await prisma.usedListing.findUnique({ where: { id } });
  if (!listing) {
    return NextResponse.json({ ok: false, error: "Listing not found." }, { status: 404, headers });
  }

  if (action === "verify") {
    await prisma.usedListing.update({
      where: { id },
      data: {
        status: "verified",
        verifiedAt: new Date(),
        sourceUrl: listing.ownerId ? ownerListingUrl(id) : listing.sourceUrl,
      },
    });
  } else if (action === "reject") {
    await prisma.usedListing.update({
      where: { id },
      data: { status: "rejected", verifiedAt: null },
    });
  } else {
    await prisma.usedListing.update({
      where: { id },
      data: { status: "expired", verifiedAt: null },
    });
  }

  return NextResponse.redirect(new URL("/admin/used-listings", request.url), 303);
}

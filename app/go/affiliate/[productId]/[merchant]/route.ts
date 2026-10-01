import { NextResponse } from "next/server";
import { getRuntimeAffiliateLinks } from "@/lib/runtimeAffiliate";
import { databaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ productId: string; merchant: string }> }) {
  const { productId, merchant } = await params;
  const links = await getRuntimeAffiliateLinks(productId);
  const affiliate = links.find((link) => link.merchant === merchant);
  if (!affiliate) {
    return NextResponse.json({ error: "Affiliate link is not configured for this product and merchant." }, { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  }
  if (databaseConfigured()) {
    try {
      await prisma.outboundClickEvent.create({ data: {
        sourceOfferId: `${productId}:${merchant}`,
        entityType: "affiliate_product",
        entityId: productId,
        merchant: `${merchant}:${affiliate.network}`,
      } });
    } catch {
      // Click logging must never block a valid merchant redirect.
    }
  }
  const response = NextResponse.redirect(affiliate.url, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

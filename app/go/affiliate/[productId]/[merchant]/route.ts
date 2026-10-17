import { NextResponse } from "next/server";
import { getRuntimeAffiliateLinks } from "@/lib/runtimeAffiliate";
import { databaseConfigured, prisma } from "@/lib/db";
import { sourcedShopeeProductListing } from "@/lib/affiliateDestinations";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ productId: string; merchant: string }> }) {
  const { productId, merchant } = await params;
  const links = await getRuntimeAffiliateLinks(productId);
  const affiliate = links.find((link) => link.merchant === merchant);
  if (!affiliate) {
    // Preserve old saved URLs without representing an editorial listing as a
    // commissioned referral. The product source must contain an exact item ID.
    const source = merchant === "shopee" ? sourcedShopeeProductListing(productId) : undefined;
    if (source) {
      const redirect = NextResponse.redirect(source.url, 302);
      redirect.headers.set("Cache-Control", "no-store");
      redirect.headers.set("X-Robots-Tag", "noindex, nofollow");
      redirect.headers.set("X-MotoIndex-Link-Type", "non-affiliate-product-source");
      return redirect;
    }
    return NextResponse.json({ error: "Exact product affiliate link is not configured." }, { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
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

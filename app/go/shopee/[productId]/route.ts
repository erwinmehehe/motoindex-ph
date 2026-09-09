import { NextResponse } from "next/server";
import { getRuntimeAffiliateLink } from "@/lib/runtimeAffiliate";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const affiliate = await getRuntimeAffiliateLink(productId);
  if (!affiliate) {
    return NextResponse.json({ error: "Affiliate link is not configured for this product." }, { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
  }
  const response = NextResponse.redirect(affiliate.url, 302);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

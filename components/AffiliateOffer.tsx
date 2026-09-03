import Link from "next/link";
import { getAffiliateLink } from "@/lib/affiliate";
import { AffiliateLink } from "@/components/AffiliateLink";

export function AffiliateOffer({ productId, productName, compact = false }: { productId: string; productName: string; compact?: boolean }) {
  const affiliate = getAffiliateLink(productId);
  if (!affiliate) return null;
  if (compact) return <div className="affiliate-card-action"><AffiliateLink productId={productId} productName={productName} network={affiliate.network} compact /></div>;
  return <aside className="affiliate-offer" aria-label="Affiliate offer">
    <div><h2>Check current price on Shopee</h2><p>Open the current listing to check the seller, exact size or variant, stock, shipping and final checkout price.</p></div>
    <div className="affiliate-offer-action"><AffiliateLink productId={productId} productName={productName} network={affiliate.network} /><small>MotoIndex may earn a commission from qualifying purchases at no extra cost to you. The tracking destination may use Shopee directly or an approved affiliate network such as Involve Asia. <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.</small></div>
  </aside>;
}

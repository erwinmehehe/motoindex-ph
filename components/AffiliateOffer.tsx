import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";
import { snapshotAffiliateLink } from "@/lib/publicSnapshot";

export function AffiliateOffer({ productId, productName, compact = false }: { productId: string; productName: string; compact?: boolean }) {
  const status = snapshotAffiliateLink(productId);
  const network = status?.network === "shopee_direct" || status?.network === "involve_asia" ? status.network : undefined;

  if (!network) return null;
  if (compact) return <div className="affiliate-card-action"><AffiliateLink productId={productId} productName={productName} network={network} compact /></div>;
  return <aside className="affiliate-offer" aria-label="Affiliate offer">
    <div><h2>Check current price on Shopee</h2><p>Open the current listing to check the seller, exact size or variant, stock, shipping and final checkout price.</p></div>
    <div className="affiliate-offer-action"><AffiliateLink productId={productId} productName={productName} network={network} /><small>MotoIndex may earn a commission from qualifying purchases at no extra cost to you. The tracking destination may use Shopee directly or an approved affiliate network such as Involve Asia. <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.</small></div>
  </aside>;
}

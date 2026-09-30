import Link from "next/link";
import { AffiliateOffer } from "@/components/AffiliateOffer";
import { OfferOutboundLink } from "@/components/OfferOutboundLink";
import {
  commerceOfferDestination,
  commerceOfferFreshness,
  compareCommerceOffers,
  getSourceBackedCommerceOffers,
  merchantOfferKey,
} from "@/lib/commerceOffers";
import { databaseConfigured } from "@/lib/db";
import { isHttpsUrl } from "@/lib/commercePolicy";
import { getVerifiedOffers } from "@/lib/persistentOffers";
import type { OfferEntityType, SellerOffer } from "@/lib/types";
import { php } from "@/lib/utils";

function uniqueOffers(offers: SellerOffer[]) {
  const seen = new Set<string>();
  return offers.filter((offer) => {
    const key = merchantOfferKey(offer);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function safeDatabaseOffers(entityType: OfferEntityType, entityId: string) {
  if (!databaseConfigured()) return [];
  try {
    return await getVerifiedOffers({ entityType, entityId });
  } catch (error) {
    console.error("Commerce database lookup failed; using catalog offer fallback.", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function CommercePriceComparison({ entityType, entityId, productName }: {
  entityType: OfferEntityType;
  entityId: string;
  productName: string;
}) {
  const now = new Date();
  const sourceOffers = getSourceBackedCommerceOffers(entityType, entityId, now);
  const databaseOffers = await safeDatabaseOffers(entityType, entityId);
  const offers = uniqueOffers([...databaseOffers, ...sourceOffers])
    .filter((offer) => Boolean(commerceOfferDestination(offer)))
    .sort((a, b) => compareCommerceOffers(a, b, now));

  if (!offers.length) {
    return <div className="commerce-price-comparison commerce-price-comparison-empty" aria-label={`Retailer availability for ${productName}`}>
      <div className="market-price-source-card">
        <div className="market-price-source-top"><span className="market-price-source-type">Retailer availability</span></div>
        <div className="market-price-source-value">No verified merchant price yet</div>
        <p className="market-price-source-note">MotoIndex only publishes an exact-product merchant row after a recent listing or retailer offer has been checked.</p>
      </div>
      <AffiliateOffer productId={entityId} productName={productName} />
    </div>;
  }

  return <div className="commerce-price-comparison" aria-label={`Price comparison for ${productName}`}>
    <div className="section-head compact market-price-sources-head">
      <div>
        <span className="section-kicker">Verified commerce</span>
        <h3>Compare current merchant checks</h3>
        <p>Each row is tied to the exact product listing we checked. Confirm size, graphic, visor bundle, shipping and final checkout total before paying.</p>
      </div>
      <Link href="/affiliate-disclosure">How commercial links work →</Link>
    </div>

    <div className="market-price-source-grid">
      {offers.map((offer) => {
        const freshness = commerceOfferFreshness(offer, now);
        const affiliate = Boolean(offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl));
        return <article className="market-price-source-card" key={offer.id}>
          <div className="market-price-source-top">
            <span className="market-price-source-type">{offer.sellerName}</span>
            <time>{freshness.label}</time>
          </div>
          <div className="market-price-source-value">{offer.pricePhp ? php(offer.pricePhp) : "Check merchant"}</div>
          <p className="market-price-source-note">{offer.sellerType} · {offer.availability}. Observed {offer.observedAt}.</p>
          <div className="market-price-source-footer">
            <span>Exact-product merchant check</span>
            <OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={affiliate} />
          </div>
        </article>;
      })}
    </div>

    <p className="market-price-source-disclaimer"><b>Price and stock can change after our check.</b> Compare the exact size/SKU, certification, bundle, shipping and checkout total. Affiliate relationships never change MotoIndex rankings or factual conclusions.</p>
    <AffiliateOffer productId={entityId} productName={productName} />
  </div>;
}

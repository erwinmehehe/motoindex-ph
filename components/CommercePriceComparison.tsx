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
  const hasOffers = offers.length > 0;

  return <div className="commerce-price-comparison" aria-label={`${hasOffers ? "Retailer price comparison" : "Retailer availability"} for ${productName}`}>
    <div className="commerce-price-head">
      <div><span>Verified commerce</span><h3>{hasOffers ? "Compare verified retailer prices" : `Where to buy ${productName}`}</h3><p>{hasOffers ? "Recent checks appear first, then lower observed prices. Every row must refer to this exact product." : "MotoIndex only shows a retailer here when an offer for this exact product passes the commerce checks."}</p></div>
      <Link href="/affiliate-disclosure">How commercial links work →</Link>
    </div>

    {hasOffers ? <div className="commerce-offer-list">
      {offers.map((offer) => {
        const freshness = commerceOfferFreshness(offer, now);
        const affiliate = Boolean(offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl));
        return <article className="commerce-offer-row" key={offer.id}>
          <div className="commerce-merchant"><strong>{offer.sellerName}</strong><small>{offer.sellerType} · {offer.availability}</small></div>
          <div className="commerce-price"><strong>{offer.pricePhp ? php(offer.pricePhp) : "Check merchant"}</strong><small>Observed starting price</small></div>
          <div className={`commerce-freshness ${freshness.tone}`}><strong>Checked</strong><small>{offer.observedAt}</small></div>
          <OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={affiliate} />
        </article>;
      })}
    </div> : <div className="commerce-empty"><strong>Retailer pricing currently unavailable.</strong><span>No current retailer offer has passed MotoIndex verification for this exact product. Similar products belong in the Alternatives section, not in this price area.</span></div>}

    <div className="commerce-disclosure"><b>Price and stock can change after our check.</b> Compare the exact size/SKU, certification, bundle, shipping and checkout total. Affiliate relationships never change MotoIndex rankings or factual conclusions.</div>
    <AffiliateOffer productId={entityId} productName={productName} />
  </div>;
}

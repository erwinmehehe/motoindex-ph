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
      <div className="commerce-empty">
        <strong>Retailer pricing not currently verified.</strong>
        <span>MotoIndex will show exact-product seller rows here after a recent listing or retailer offer has been checked. We do not substitute unrelated products just to fill the comparison.</span>
      </div>
      <AffiliateOffer productId={entityId} productName={productName} />
    </div>;
  }

  return <div className="commerce-price-comparison" aria-label={`Price comparison for ${productName}`}>
    <div className="section-head compact">
      <div>
        <span className="section-kicker">Verified commerce</span>
        <h3>Compare verified seller prices</h3>
        <p>Fresh checks appear first, then lower observed prices. We only show exact-product offers we have actually checked.</p>
      </div>
      <Link className="text-link" href="/affiliate-disclosure">How commercial links work →</Link>
    </div>

    <div className="commerce-offer-list" style={{ display: "grid", gap: "12px" }}>
      {offers.map((offer) => {
        const freshness = commerceOfferFreshness(offer, now);
        const affiliate = Boolean(offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl));
        return <article
          className="commerce-offer-row ui-info-panel"
          data-commerce-offer
          key={offer.id}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,160px),1fr))",
            gap: "16px",
            alignItems: "end",
          }}
        >
          <div className="commerce-merchant" style={{ display: "grid", gap: "4px" }}>
            <span className="section-kicker">Seller</span>
            <strong>{offer.sellerName}</strong>
            <small>{offer.sellerType} · {offer.availability}</small>
          </div>
          <div className="commerce-price" style={{ display: "grid", gap: "4px" }}>
            <span className="section-kicker">Observed price</span>
            <strong>{offer.pricePhp ? php(offer.pricePhp) : "Check merchant"}</strong>
            <small>Starting price when checked</small>
          </div>
          <div className={`commerce-freshness ${freshness.tone}`} style={{ display: "grid", gap: "4px" }}>
            <span className="section-kicker">Freshness</span>
            <strong>{freshness.label}</strong>
            <small>{offer.observedAt}</small>
          </div>
          <OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={affiliate} />
        </article>;
      })}
    </div>

    <div className="commerce-disclosure ui-info-panel ui-info-panel--subtle" style={{ marginTop: "12px" }}>
      <strong>Price and stock can change after our check.</strong>
      <p>Compare the exact size/SKU, certification, bundle, shipping and checkout total. Affiliate relationships never change MotoIndex rankings or factual conclusions.</p>
    </div>
    <AffiliateOffer productId={entityId} productName={productName} />
  </div>;
}

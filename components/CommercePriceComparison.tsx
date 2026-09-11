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
import { isHttpsUrl } from "@/lib/commercePolicy";
import { getVerifiedOffers } from "@/lib/publicOffers";
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

export async function CommercePriceComparison({ entityType, entityId, productName }: {
  entityType: OfferEntityType;
  entityId: string;
  productName: string;
}) {
  const now = new Date();
  const sourceOffers = getSourceBackedCommerceOffers(entityType, entityId, now);
  const snapshotOffers = await getVerifiedOffers({ entityType, entityId }, now);
  const offers = uniqueOffers([...snapshotOffers, ...sourceOffers])
    .filter((offer) => Boolean(commerceOfferDestination(offer)))
    .sort((a, b) => compareCommerceOffers(a, b, now));

  return <div className="commerce-price-comparison" aria-label={`Price comparison for ${productName}`}>
    <div className="commerce-price-head">
      <div><span>Verified commerce</span><h3>Compare prices</h3><p>Fresh checks appear first, then lower observed prices. MotoIndex does not create extra merchants to make this table look fuller.</p></div>
      <Link href="/affiliate-disclosure">How commercial links work →</Link>
    </div>

    {offers.length ? <div className="commerce-offer-list">
      {offers.map((offer) => {
        const freshness = commerceOfferFreshness(offer, now);
        const affiliate = Boolean(offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl));
        return <article className="commerce-offer-row" key={offer.id}>
          <div className="commerce-merchant"><strong>{offer.sellerName}</strong><small>{offer.sellerType} · {offer.availability}</small></div>
          <div className="commerce-price"><strong>{offer.pricePhp ? php(offer.pricePhp) : "Check merchant"}</strong><small>Observed starting price</small></div>
          <div className={`commerce-freshness ${freshness.tone}`}><strong>{freshness.label}</strong><small>{offer.observedAt}</small></div>
          <OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={affiliate} />
        </article>;
      })}
    </div> : <div className="commerce-empty"><strong>No fresh verified retailer offer yet.</strong><span>The research page stays useful without inventing a shopping destination. Only recent HTTPS product/listing sources are eligible for this comparison.</span></div>}

    <div className="commerce-disclosure"><b>Price and stock can change after our check.</b> Compare the exact size/SKU, certification, bundle, shipping and checkout total. Affiliate relationships never change MotoIndex rankings or factual conclusions.</div>
    <AffiliateOffer productId={entityId} productName={productName} />
  </div>;
}

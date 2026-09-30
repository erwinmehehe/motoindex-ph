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

  return <div className="commerce-price-comparison" style={{marginTop:14,padding:20,border:"1px solid var(--mi-color-line)",borderRadius:18,background:"var(--mi-color-surface)"}} aria-label={`Price comparison for ${productName}`}>
    <div className="commerce-price-head" style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:18,marginBottom:14,flexWrap:"wrap"}}>
      <div><span>Verified commerce</span><h3>Compare prices</h3><p>Fresh checks appear first, then lower observed prices. MotoIndex does not create extra merchants to make this table look fuller.</p></div>
      <Link href="/affiliate-disclosure">How commercial links work →</Link>
    </div>

    <div className="commerce-offer-list" style={{display:"grid",gap:8}}>
      {offers.map((offer) => {
        const freshness = commerceOfferFreshness(offer, now);
        const affiliate = Boolean(offer.affiliateUrl && isHttpsUrl(offer.affiliateUrl));
        return <article className="commerce-offer-row" style={{gap:12,alignItems:"center",padding:"14px 16px",border:"1px solid var(--mi-color-line-soft)",borderRadius:14,background:"var(--mi-color-surface-subtle)"}} key={offer.id}>
          <div className="commerce-merchant"><strong>{offer.sellerName}</strong><small>{offer.sellerType} · {offer.availability}</small></div>
          <div className="commerce-price"><strong>{offer.pricePhp ? php(offer.pricePhp) : "Check merchant"}</strong><small>Observed starting price</small></div>
          <div className={`commerce-freshness ${freshness.tone}`}><strong>{freshness.label}</strong><small>{offer.observedAt}</small></div>
          <OfferOutboundLink offerId={offer.id} entityType={offer.entityType} entityId={offer.entityId} sellerName={offer.sellerName} affiliate={affiliate} />
        </article>;
      })}
    </div>

    <div className="commerce-disclosure" style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--mi-color-line-soft)",color:"var(--mi-color-copy)",fontSize:9,lineHeight:1.45}}><b>Price and stock can change after our check.</b> Compare the exact size/SKU, certification, bundle, shipping and checkout total. Affiliate relationships never change MotoIndex rankings or factual conclusions.</div>
    <AffiliateOffer productId={entityId} productName={productName} />
  </div>;
}

import Link from "next/link";
import type { SellerOffer } from "@/lib/types";
import { php } from "@/lib/utils";

function availabilityLabel(value:string){
  if(value==="in_stock")return "In stock";
  if(value==="limited")return "Limited stock";
  if(value==="preorder")return "Pre-order / reservation";
  if(value==="out_of_stock")return "Out of stock";
  return "Confirm with branch";
}

export function DealerInventoryOffers({offers,makeSlug,modelSlug}:{offers:SellerOffer[];makeSlug:string;modelSlug:string}){
  if(!offers.length)return null;
  return <section id="dealer-inventory" className="motorcycle-entity-section dealer-inventory-section" aria-labelledby="dealer-inventory-heading">
    <div className="section-head compact"><div><span className="section-kicker">Current dealer inventory & promos</span><h2 id="dealer-inventory-heading">Check fresh dealer availability before requesting a quote</h2><p>These rows passed MotoIndex freshness rules. Dealer-published rows come from an authenticated verified dealer account; the branch remains responsible for exact stock, color, promo terms and final price.</p></div></div>
    <div className="current-offer-list">
      {offers.map(offer=><article className="current-offer-card" key={offer.id}>
        <div className="current-offer-copy">
          <span>{offer.sourceKind==="dealer-published"?"Dealer-published":"MotoIndex-reviewed"}</span>
          <h3>{offer.sellerName}</h3>
          <p>{[offer.variantLabel,offer.colorLabel,availabilityLabel(offer.availability)].filter(Boolean).join(" · ")}</p>
          {offer.promoLabel&&<strong>{offer.promoLabel}</strong>}
          <div className="current-offer-meta"><small>Updated {offer.observedAt}</small>{offer.expiresAt&&<small>Re-confirm by {offer.expiresAt}</small>}</div>
        </div>
        <div className="current-offer-price">
          <strong>{offer.pricePhp?php(offer.pricePhp):"Ask dealer"}</strong>
          {offer.monthlyPhp?<small>{php(offer.monthlyPhp)}/mo · {offer.termMonths||"—"} months{offer.downpaymentPhp?` · DP ${php(offer.downpaymentPhp)}`:""}</small>:<small>Finance terms not listed</small>}
        </div>
        <div className="current-offer-actions">
          <Link className="button ghost small" href={`/go/${offer.id}`}>View dealer ↗</Link>
          <Link className="button small" href={`/get-quote/${makeSlug}/${modelSlug}`}>Request quote</Link>
        </div>
      </article>)}
    </div>
    <p className="muted-note">Inventory can change after publication. Confirm the exact variant, color, complete cash price, fees, financing terms and release timing with the branch before paying a reservation or deposit.</p>
  </section>;
}

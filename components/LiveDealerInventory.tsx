import Link from "next/link";
import type { Motorcycle, SellerOffer } from "@/lib/types";
import { php } from "@/lib/utils";

function availability(value:string){
  if(value==="in_stock")return "In stock";
  if(value==="limited")return "Limited stock";
  if(value==="preorder")return "Pre-order / reservation";
  if(value==="out_of_stock")return "Out of stock";
  return "Confirm with dealer";
}

export function LiveDealerInventory({model,offers}:{model:Motorcycle;offers:SellerOffer[]}){
  const dealerOffers=offers.filter(offer=>offer.sellerType==="dealer");
  if(!dealerOffers.length)return null;
  return <section className="live-dealer-inventory" aria-labelledby="live-dealer-inventory-heading">
    <div className="section-head compact"><div><span className="section-kicker">Dealer inventory</span><h3 id="live-dealer-inventory-heading">Current {model.make} {model.model} stock and promos</h3><p>Fresh dealer-published availability matched to this exact MotoIndex model. MotoIndex verifies the dealer profile; the branch is responsible for its listed price, stock, color and promotion.</p></div></div>
    <div className="current-offer-list">
      {dealerOffers.map(offer=><article className="current-offer-card" key={offer.id}>
        <div className="current-offer-copy">
          <span>{offer.sellerName}</span>
          <h4>{[offer.variantLabel,offer.colorLabel].filter(Boolean).join(" · ")||model.make+" "+model.model}</h4>
          <p>{availability(offer.availability)}{offer.promoLabel?" · "+offer.promoLabel:""}</p>
          <div className="current-offer-meta"><small>Dealer-published</small><small>Updated {offer.observedAt}</small>{offer.expiresAt&&<small>Reconfirm by {offer.expiresAt.slice(0,10)}</small>}</div>
        </div>
        <div className="current-offer-price">
          <strong>{offer.pricePhp?php(offer.pricePhp):"Ask dealer"}</strong>
          {offer.monthlyPhp?<small>{php(offer.monthlyPhp)}/mo · {offer.termMonths||"—"} months{offer.downpaymentPhp?" · DP "+php(offer.downpaymentPhp):""}</small>:<small>Finance terms not listed</small>}
        </div>
        <div className="current-offer-actions">
          {offer.sellerSlug&&<Link className="button ghost small" href={"/sellers/"+offer.sellerSlug}>Dealer profile</Link>}
          <Link className="button small" href={"/get-quote/"+model.makeSlug+"/"+model.slug}>Request quotes</Link>
        </div>
      </article>)}
    </div>
    <p className="entity-section-note">Inventory can change between checks. Confirm the exact variant, final on-road price, registration, insurance, financing assumptions and release timing directly with the dealer.</p>
  </section>;
}

import Link from "next/link";
import { getDealerPublishedInventory } from "@/lib/persistentOffers";
import { php } from "@/lib/utils";

function availability(value:string){
  if(value==="in_stock")return "In stock";
  if(value==="limited")return "Limited stock";
  if(value==="preorder")return "Pre-order / reservation";
  if(value==="out_of_stock")return "Out of stock";
  return "Confirm with branch";
}

export async function DealerInventoryPanel({modelId,makeSlug,modelSlug}:{modelId:string;makeSlug:string;modelSlug:string}){
  const inventory=await getDealerPublishedInventory(modelId);
  if(!inventory.length)return null;
  return <section className="motorcycle-entity-section dealer-live-inventory" id="dealer-inventory">
    <div className="section-head compact">
      <div><span className="section-kicker">Dealer inventory</span><h2>Current dealer-published stock and promos</h2><p>These entries come directly from verified dealer accounts and pass MotoIndex freshness rules. The dealer—not MotoIndex—is responsible for the stock, price, color and promotion shown.</p></div>
      <Link className="button small" href={`/get-quote/${makeSlug}/${modelSlug}`}>Request dealer quotes</Link>
    </div>
    <div className="current-offer-list">
      {inventory.map(item=><article className="current-offer-card" key={item.id}>
        <div className="current-offer-copy">
          <span>{item.sellerName}{item.city?` · ${item.city}`:""}{item.province?`, ${item.province}`:""}</span>
          <h3>{[item.variantLabel,item.colorLabel].filter(Boolean).join(" · ")||"Current motorcycle inventory"}</h3>
          <p>{availability(item.availability)}{item.promoLabel?` · ${item.promoLabel}`:""}</p>
          <div className="current-offer-meta"><small>Dealer updated {item.observedAt}</small>{item.expiresAt&&<small>Reconfirm by {item.expiresAt}</small>}</div>
        </div>
        <div className="current-offer-price">
          <strong>{item.pricePhp?php(item.pricePhp):"Ask dealer"}</strong>
          {item.monthlyPhp?<small>{item.downPaymentPhp?`${php(item.downPaymentPhp)} down · `:""}{php(item.monthlyPhp)}/mo{item.termMonths?` · ${item.termMonths} months`:""}</small>:<small>Financing terms not listed</small>}
        </div>
        <div className="current-offer-actions">
          <Link className="button ghost small" href={`/sellers/${item.sellerSlug}`}>Dealer profile</Link>
          <Link className="button small" href={`/get-quote/${makeSlug}/${modelSlug}`}>Request quote</Link>
        </div>
      </article>)}
    </div>
    <small className="buyer-private-link-note">Always confirm the exact unit, fees, registration, insurance, financing conditions and availability before paying a reservation.</small>
  </section>;
}

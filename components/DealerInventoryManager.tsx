"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Branch={id:string;name:string};
type Model={id:string;label:string};
type Offer={
  id:string;sellerId:string;sellerName:string;modelLabel:string;variantLabel?:string|null;colorLabel?:string|null;
  pricePhp?:number|null;downPaymentPhp?:number|null;monthlyPhp?:number|null;termMonths?:number|null;
  availability:string;promoLabel?:string|null;expiresAt?:string|null;observedAt:string;
};

export function DealerInventoryManager({branches,models,offers}:{branches:Branch[];models:Model[];offers:Offer[]}){
  const router=useRouter();
  const [working,setWorking]=useState(false);
  const [message,setMessage]=useState("");

  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setWorking(true);setMessage("");
    const form=new FormData(event.currentTarget);
    const payload=Object.fromEntries(form.entries());
    try{
      const response=await fetch("/api/dealer-portal/inventory",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok){setMessage(data.error||"Inventory could not be saved.");return;}
      setMessage("Inventory saved. Public visibility still follows freshness and dealer verification rules.");
      event.currentTarget.reset();
      router.refresh();
    }catch{
      setMessage("Inventory could not be saved.");
    }finally{
      setWorking(false);
    }
  }

  async function expire(id:string){
    setWorking(true);setMessage("");
    try{
      const response=await fetch("/api/dealer-portal/inventory",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok){setMessage(data.error||"Inventory could not be removed.");return;}
      setMessage("Inventory entry expired.");
      router.refresh();
    }finally{setWorking(false);}
  }

  return <section className="dealer-portal-inventory">
    <div className="section-head compact"><div><span className="section-kicker">Inventory and promos</span><h2>Publish current motorcycle availability</h2><p>Dealer-published entries are timestamped and kept separate from MotoIndex editorial price verification.</p></div></div>
    <form className="lead-form" onSubmit={submit}>
      <div className="lead-form-grid">
        <label><span>Branch</span><select name="sellerId" required>{branches.map(branch=><option value={branch.id} key={branch.id}>{branch.name}</option>)}</select></label>
        <label><span>Motorcycle</span><select name="entityId" required defaultValue=""><option value="" disabled>Select model</option>{models.map(model=><option value={model.id} key={model.id}>{model.label}</option>)}</select></label>
        <label><span>Variant <small>optional</small></span><input name="variantLabel" maxLength={80}/></label>
        <label><span>Color <small>optional</small></span><input name="colorLabel" maxLength={80}/></label>
        <label><span>Cash price</span><input name="pricePhp" type="number" min="1" step="100" required/></label>
        <label><span>Availability</span><select name="availability" required defaultValue="in_stock"><option value="in_stock">In stock</option><option value="limited">Limited stock</option><option value="preorder">Pre-order / reservation</option><option value="out_of_stock">Out of stock</option><option value="confirm">Confirm with branch</option></select></label>
        <label><span>Down payment <small>optional</small></span><input name="downPaymentPhp" type="number" min="1" step="100"/></label>
        <label><span>Monthly <small>optional</small></span><input name="monthlyPhp" type="number" min="1" step="1"/></label>
        <label><span>Term months</span><input name="termMonths" type="number" min="1" max="84"/></label>
        <label><span>Promo label <small>optional</small></span><input name="promoLabel" maxLength={120} placeholder="e.g. October cash promo"/></label>
        <label><span>Expires</span><input name="expiresAt" type="date" required/></label>
        <label className="lead-form-wide"><span>Dealer page or inventory URL <small>optional</small></span><input name="targetUrl" type="url" placeholder="https://..."/></label>
      </div>
      <button className="button" disabled={working}>{working?"Saving…":"Publish inventory"}</button>
      {message&&<p className="muted-note" role="status">{message}</p>}
    </form>

    <div className="current-offer-list">
      {offers.map(offer=><article className="current-offer-card" key={offer.id}>
        <div className="current-offer-copy"><span>{offer.sellerName}</span><h3>{offer.modelLabel}</h3><p>{[offer.variantLabel,offer.colorLabel,offer.promoLabel].filter(Boolean).join(" · ")||offer.availability}</p><small>Updated {offer.observedAt}</small></div>
        <div className="current-offer-price"><strong>{offer.pricePhp?new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(offer.pricePhp):"Ask branch"}</strong>{offer.monthlyPhp&&<small>{new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(offer.monthlyPhp)}/mo</small>}</div>
        <div className="current-offer-actions"><button className="button ghost small" type="button" onClick={()=>expire(offer.id)} disabled={working}>Expire entry</button></div>
      </article>)}
      {!offers.length&&<div className="note-box"><h3>No dealer-published inventory yet</h3><p>Add current stock only when the branch can stand behind the price and availability shown.</p></div>}
    </div>
  </section>;
}

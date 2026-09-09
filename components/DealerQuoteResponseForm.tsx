"use client";

import { useState } from "react";

type InitialQuote={
  cashPricePhp?:number|null;
  downPaymentPhp?:number|null;
  monthlyPhp?:number|null;
  termMonths?:number|null;
  availability?:string;
  validUntil?:string|null;
  dealerNote?:string;
};

export function DealerQuoteResponseForm({token,initial}:{token:string;initial?:InitialQuote}){
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [quoted,setQuoted]=useState(Boolean(initial));

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    setSaving(true);setMessage("");
    try{
      const response=await fetch(`/api/dealer-lead/${token}/quote`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          cashPricePhp:String(form.get("cashPricePhp")||""),
          downPaymentPhp:String(form.get("downPaymentPhp")||""),
          monthlyPhp:String(form.get("monthlyPhp")||""),
          termMonths:String(form.get("termMonths")||""),
          availability:String(form.get("availability")||""),
          validUntil:String(form.get("validUntil")||""),
          dealerNote:String(form.get("dealerNote")||"")
        })
      });
      const result=await response.json();
      if(!response.ok||!result.ok){setMessage(result.error||"Could not save this quote.");return;}
      setQuoted(true);
      setMessage("Quote saved privately for this buyer request.");
    }catch{
      setMessage("Could not save this quote.");
    }finally{
      setSaving(false);
    }
  }

  return <form className="dealer-quote-response" onSubmit={submit}>
    <div className="section-head compact"><div><span className="section-kicker">Dealer response</span><h2>{quoted?"Update your quote":"Send a structured quote"}</h2><p>This response is private to this buyer request. It is not published as a MotoIndex public price.</p></div></div>

    <div className="lead-form-grid">
      <label><span>Cash price <small>optional if installment only</small></span><input name="cashPricePhp" type="number" min="1" step="100" defaultValue={initial?.cashPricePhp||""} placeholder="e.g. 155900"/></label>
      <label><span>Availability</span><select name="availability" required defaultValue={initial?.availability||"in_stock"}><option value="in_stock">In stock</option><option value="limited">Limited stock</option><option value="preorder">Pre-order / reservation</option><option value="out_of_stock">Out of stock</option><option value="confirm">Confirm with branch</option></select></label>
      <label><span>Down payment <small>for installment</small></span><input name="downPaymentPhp" type="number" min="1" step="100" defaultValue={initial?.downPaymentPhp||""}/></label>
      <label><span>Monthly payment <small>for installment</small></span><input name="monthlyPhp" type="number" min="1" step="1" defaultValue={initial?.monthlyPhp||""}/></label>
      <label><span>Term in months</span><input name="termMonths" type="number" min="1" max="84" step="1" defaultValue={initial?.termMonths||""}/></label>
      <label><span>Quote valid until <small>optional</small></span><input name="validUntil" type="date" defaultValue={initial?.validUntil?.slice(0,10)||""}/></label>
      <label className="lead-form-wide"><span>Dealer note <small>optional</small></span><textarea name="dealerNote" rows={4} defaultValue={initial?.dealerNote||""} placeholder="Included fees, registration notes, color/variant availability, or financing conditions."/></label>
    </div>

    <div className="dealer-quote-submit"><button className="button" type="submit" disabled={saving}>{saving?"Saving quote…":quoted?"Update private quote":"Save private quote"}</button><small>{message}</small></div>
  </form>;
}

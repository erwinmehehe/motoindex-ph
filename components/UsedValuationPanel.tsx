"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/garage";
import type { UsedMotorcycleValuation, ValuationCondition } from "@/lib/usedValuation";

type Comparable={
  id:string;
  title:string;
  modelYear:number;
  mileageKm:number;
  askingPricePhp:number;
  condition:string;
  location:string;
  sellerType:string;
  postedAt:string;
  sourceUrl:string|null;
};

export function UsedValuationPanel({
  modelId,
  modelYear,
  mileageKm,
  condition,
  location,
  onUseEstimate,
  excludeListingId,
}:{
  modelId:string;
  modelYear:number;
  mileageKm:number;
  condition:ValuationCondition;
  location:string;
  onUseEstimate?:(value:number)=>void;
  excludeListingId?:string;
}){
  const [valuation,setValuation]=useState<UsedMotorcycleValuation|null>(null);
  const [comparables,setComparables]=useState<Comparable[]>([]);
  const [status,setStatus]=useState("Calculating from verified market data…");

  useEffect(()=>{
    let cancelled=false;
    const timer=window.setTimeout(async()=>{
      setStatus("Calculating from verified market data…");
      const response=await fetch("/api/used-valuation",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({modelId,modelYear,mileageKm,condition,location,excludeListingId})
      }).catch(()=>null);
      if(cancelled)return;
      if(!response?.ok){
        const data=await response?.json().catch(()=>({}));
        setValuation(null);
        setComparables([]);
        setStatus(data?.error||"Valuation is unavailable right now.");
        return;
      }
      const data=await response.json();
      setValuation(data.valuation||null);
      setComparables(Array.isArray(data.comparables)?data.comparables:[]);
      setStatus("");
    },300);
    return()=>{cancelled=true;window.clearTimeout(timer);};
  },[modelId,modelYear,mileageKm,condition,location,excludeListingId]);

  if(!valuation)return <section className="note-box"><strong>Used motorcycle valuation</strong><p>{status}</p></section>;

  return <section className="info-card used-valuation-panel">
    <div className="section-head compact">
      <div>
        <span className="field-label">MotoIndex used value</span>
        <h2>{money(valuation.privateSale.lowPhp)}–{money(valuation.privateSale.highPhp)}</h2>
        <p>Estimated private-sale range · midpoint {money(valuation.privateSale.midpointPhp)} · {valuation.confidence} confidence.</p>
      </div>
      {onUseEstimate&&<button className="button small" type="button" onClick={()=>onUseEstimate(valuation.privateSale.midpointPhp)}>Use midpoint as asking price</button>}
    </div>

    <div className="spec-grid">
      <div><span>Verified comparables</span><strong>{valuation.comparableCount}</strong><small>{valuation.sameRegionComparableCount} same-region</small></div>
      <div><span>Comparable baseline</span><strong>{money(valuation.baselinePhp)}</strong><small>Median active asking price before subject adjustments</small></div>
      <div><span>Dealer / trade planning band</span><strong>{money(valuation.dealerTrade.lowPhp)}–{money(valuation.dealerTrade.highPhp)}</strong><small>Planning range only — not observed dealer bids</small></div>
      <div><span>Generated</span><strong>{new Date(valuation.generatedAt).toLocaleDateString("en-PH")}</strong><small>Recalculate when mileage, condition or location changes</small></div>
    </div>

    {valuation.adjustments.length>0&&<div className="buyer-quote-list">
      {valuation.adjustments.map(item=><div className="buyer-quote-card" key={item.label}>
        <div><strong>{item.label}</strong><p>{item.basis}</p></div>
        <div className="buyer-quote-meta"><strong>{item.amountPhp>=0?"+":""}{money(item.amountPhp)}</strong></div>
      </div>)}
    </div>}

    {comparables.length>0&&<details className="note-box">
      <summary><strong>View the {comparables.length} comparable listing{comparables.length===1?"":"s"} used</strong></summary>
      <div className="buyer-quote-list">
        {comparables.slice(0,12).map(item=><div className="buyer-quote-card" key={item.id}>
          <div><strong>{item.title}</strong><p>{item.modelYear} · {item.mileageKm.toLocaleString("en-PH")} km · {item.condition} · {item.location}</p><small>{item.sellerType}</small></div>
          <div className="buyer-quote-meta"><strong>{money(item.askingPricePhp)}</strong>{item.sourceUrl&&<a href={item.sourceUrl}>Open listing →</a>}</div>
        </div>)}
      </div>
    </details>}

    <div className="note-box">
      <strong>How to read this estimate</strong>
      {valuation.assumptions.map(item=><p key={item}>• {item}</p>)}
    </div>
  </section>;
}

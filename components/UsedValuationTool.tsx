"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UsedValuationPanel } from "@/components/UsedValuationPanel";
import type { ValuationCondition } from "@/lib/usedValuation";

type ModelOption={id:string;make:string;model:string;makeSlug:string;slug:string;srp:number};

export function UsedValuationTool({models}:{models:ModelOption[]}){
  const [modelId,setModelId]=useState(models[0]?.id||"");
  const [modelYear,setModelYear]=useState(new Date().getFullYear());
  const [mileageKm,setMileageKm]=useState(10000);
  const [condition,setCondition]=useState<ValuationCondition>("good");
  const [location,setLocation]=useState("");
  const selected=useMemo(()=>models.find(model=>model.id===modelId),[models,modelId]);

  if(!selected)return <section className="note-box"><p>No current MotoIndex motorcycles are available for valuation.</p></section>;

  return <div className="garage-workspace used-valuation-tool">
    <section className="info-card">
      <div className="section-head compact"><div><span className="field-label">Your motorcycle</span><h2>Describe the bike you want to value</h2><p>MotoIndex compares it with verified active used listings for the same model. Location is optional, but it can improve regional context when enough nearby comps exist.</p></div></div>
      <form className="lead-form" onSubmit={event=>event.preventDefault()}>
        <div className="lead-form-grid">
          <label className="lead-form-wide">Motorcycle
            <select value={modelId} onChange={event=>setModelId(event.target.value)}>
              {models.map(model=><option value={model.id} key={model.id}>{model.make} {model.model}</option>)}
            </select>
          </label>
          <label>Model year<input type="number" min="1980" max={new Date().getFullYear()+1} value={modelYear} onChange={event=>setModelYear(Number(event.target.value))}/></label>
          <label>Mileage (km)<input type="number" min="0" max="500000" step="100" value={mileageKm} onChange={event=>setMileageKm(Math.max(0,Number(event.target.value)||0))}/></label>
          <label>Condition<select value={condition} onChange={event=>setCondition(event.target.value as ValuationCondition)}><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option></select></label>
          <label>City / province <small>optional</small><input value={location} onChange={event=>setLocation(event.target.value)} placeholder="e.g. Quezon City or Cebu"/></label>
        </div>
      </form>
      <p className="muted-note">Condition is self-selected. The estimate is a market-planning reference, not an inspection, appraisal, guaranteed sale price or dealer offer.</p>
    </section>

    <UsedValuationPanel
      modelId={selected.id}
      modelYear={modelYear}
      mileageKm={mileageKm}
      condition={condition}
      location={location}
    />

    <section className="note-box">
      <strong>Want a stronger resale record?</strong>
      <p>My Garage can pair this market estimate with your service, mileage and document history, then prepare a seller-ready Resale Pack.</p>
      <div className="hero-actions">
        <Link className="button small" href="/garage">Open My Garage</Link>
        <Link className="button small ghost" href={`/motorcycles/${selected.makeSlug}/${selected.slug}`}>Research {selected.make} {selected.model}</Link>
      </div>
    </section>
  </div>;
}

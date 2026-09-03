"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Motorcycle, UsedListing } from "@/lib/types";

export function UsedMarketExplorer({listings,models}:{listings:UsedListing[];models:Motorcycle[]}){
  const [make,setMake]=useState("all"); const [modelId,setModelId]=useState("all"); const [maxPrice,setMaxPrice]=useState(200000); const [maxKm,setMaxKm]=useState(50000);
  const makeOptions=[...new Set(models.map(m=>m.make))].sort();
  const filtered=useMemo(()=>listings.filter(x=>{const m=models.find(mm=>mm.id===x.modelId);if(!m)return false;return (make==="all"||m.make===make)&&(modelId==="all"||m.id===modelId)&&x.askingPricePhp<=maxPrice&&x.mileageKm<=maxKm;}),[listings,models,make,modelId,maxPrice,maxKm]);
  const modelOptions=models.filter(m=>make==="all"||m.make===make);
  return <div className="used-explorer">
    <div className="used-filter-bar">
      <label>Make<select value={make} onChange={e=>{setMake(e.target.value);setModelId("all")}}><option value="all">All makes</option>{makeOptions.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Model<select value={modelId} onChange={e=>setModelId(e.target.value)}><option value="all">All models</option>{modelOptions.map(m=><option value={m.id} key={m.id}>{m.model}</option>)}</select></label>
      <label>Max price <b>₱{maxPrice.toLocaleString()}</b><input type="range" min="60000" max="400000" step="5000" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/></label>
      <label>Max mileage <b>{maxKm.toLocaleString()} km</b><input type="range" min="5000" max="80000" step="5000" value={maxKm} onChange={e=>setMaxKm(Number(e.target.value))}/></label>
    </div>
    <div className="used-explorer-head"><strong>{filtered.length} listing samples</strong><span>Sample data only — these are not live marketplace listings.</span></div>
    <div className="used-listing-cards">{filtered.map(x=>{const m=models.find(mm=>mm.id===x.modelId)!;return <Link href={`/motorcycles/${m.makeSlug}/${m.slug}#used`} key={x.id}><span>{x.year} · {x.condition}</span><h3>{m.make} {m.model}</h3><strong>₱{x.askingPricePhp.toLocaleString()}</strong><small>{x.mileageKm.toLocaleString()} km · {x.location}</small></Link>})}</div>
  </div>;
}

"use client";
import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { commuteMonthlyCosts, DEFAULT_FUEL_PRICE_PHP } from "@/lib/commuteMath";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { efficiencyEvidence } from "@/lib/efficiency";

export function CommuteCostCalculator({models,initialId}:{models:Motorcycle[];initialId?:string}){
  const first=models.find(m=>m.id===initialId)||models[0];
  const [id,setId]=useState(first?.id||"");
  useEffect(()=>{
    if(initialId||typeof window==="undefined")return;
    const bike=new URLSearchParams(window.location.search).get("bike");
    if(bike&&models.some(m=>m.id===bike))setId(bike);
  },[initialId,models]);
  const [dailyKm,setDailyKm]=useState(20),[days,setDays]=useState(22),[fuel,setFuel]=useState(DEFAULT_FUEL_PRICE_PHP),[parking,setParking]=useState(0),[maintenance,setMaintenance]=useState<number|undefined>(undefined),[currentSpend,setCurrentSpend]=useState(0);
  const model=models.find(m=>m.id===id)||first;
  const result=useMemo(()=>model?commuteMonthlyCosts(model,dailyKm,days,fuel,parking,maintenance):null,[model,dailyKm,days,fuel,parking,maintenance]);
  if(!model||!result)return null;
  const efficiency=efficiencyEvidence(model);
  const currentMonthly=Math.max(0,currentSpend)*days;
  const operatingDifference=result.total-currentMonthly;
  return <div className="commute-calculator"><div className="commute-calculator-copy"><h2>{model.make} {model.model}</h2><p>{observedMarketPriceLabel(model)} · fuel and maintenance are estimates, not a dealer or service quote.</p><div className="commute-total"><small>Estimated commute operating cost</small><strong>₱{Math.round(result.total).toLocaleString("en-PH")}/month</strong><span>Cost per commute day: ₱{Math.round(result.perWorkday).toLocaleString("en-PH")}</span></div></div><div className="commute-fields"><label>Motorcycle<select value={id} onChange={e=>{setId(e.target.value);setMaintenance(undefined)}}>{models.map(m=><option key={m.id} value={m.id}>{m.make} {m.model}</option>)}</select></label><label>Round trip / day <b>{dailyKm} km</b><input type="range" min="2" max="120" step="2" value={dailyKm} onChange={e=>setDailyKm(Number(e.target.value))}/></label><label>Commute days / month <b>{days}</b><input type="range" min="5" max="30" step="1" value={days} onChange={e=>setDays(Number(e.target.value))}/></label><label>Gasoline assumption <b>₱{fuel}/L</b><input type="range" min="40" max="100" step="1" value={fuel} onChange={e=>setFuel(Number(e.target.value))}/></label><label>Parking / day <b>₱{parking}</b><input type="range" min="0" max="300" step="10" value={parking} onChange={e=>setParking(Number(e.target.value))}/></label><label>Maintenance reserve / month <input type="number" min="0" step="100" placeholder="Use MotoIndex default" value={maintenance??""} onChange={e=>setMaintenance(e.target.value===""?undefined:Number(e.target.value))}/></label><label>Current commute spend / day <b>{currentSpend?`₱${currentSpend}`:"Optional"}</b><input type="number" min="0" step="10" value={currentSpend||""} placeholder="e.g. 120" onChange={e=>setCurrentSpend(Number(e.target.value)||0)}/></label></div><div className="commute-breakdown"><span><small>Distance</small><b>{result.monthlyKm.toLocaleString()} km/mo</b></span><span><small>Economy basis</small><b>{efficiency.kmPerL} km/L {efficiency.status === "planning-estimate" ? "estimated" : "listed"}</b></span><span><small>Fuel</small><b>₱{Math.round(result.fuel).toLocaleString("en-PH")}</b></span><span><small>Maintenance reserve</small><b>₱{Math.round(result.maintenance).toLocaleString("en-PH")}</b></span><span><small>Parking</small><b>₱{Math.round(result.parking).toLocaleString("en-PH")}</b></span>{currentSpend>0&&<span><small>Vs current commute*</small><b>{operatingDifference<=0?"−":"+"}₱{Math.abs(Math.round(operatingDifference)).toLocaleString("en-PH")}/mo</b></span>}</div>{currentSpend>0&&<div className="note-box compact-note"><p>*Comparison is operating cost only. It excludes motorcycle purchase/finance, registration, insurance and other ownership costs. Use the total ownership calculator before deciding.</p></div>}</div>;
}

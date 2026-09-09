"use client";

import { useMemo, useState } from "react";
import { electricMotorcycles } from "@/lib/electricMotorcycles";

export function ElectricRangeCalculator() {
  const [slug,setSlug]=useState(electricMotorcycles[0]?.slug||"");
  const [batterySetup,setBatterySetup]=useState<"one"|"two">("two");
  const [rangeFactor,setRangeFactor]=useState(80);
  const [dailyKm,setDailyKm]=useState(30);
  const model=electricMotorcycles.find(item=>item.slug===slug)||electricMotorcycles[0];

  const result=useMemo(()=>{
    if(!model)return null;
    const claimed=batterySetup==="two"?model.rangeTwoKm:model.rangeOneKm;
    const adjusted=Math.round(claimed*(rangeFactor/100));
    const dailyShare=adjusted>0?Math.min(999,Math.round((dailyKm/adjusted)*100)):0;
    const ridingDays= dailyKm>0 ? Math.max(0,Math.floor(adjusted/dailyKm)) : 0;
    return {claimed,adjusted,dailyShare,ridingDays};
  },[model,batterySetup,rangeFactor,dailyKm]);

  if(!model||!result)return null;

  return <div className="calculator-card electric-range-calculator">
    <div className="calculator-grid">
      <label><span>Motorcycle</span><select value={slug} onChange={e=>setSlug(e.target.value)}>{electricMotorcycles.map(item=><option key={item.slug} value={item.slug}>{item.make} {item.model}</option>)}</select></label>
      <label><span>Battery setup</span><select value={batterySetup} onChange={e=>setBatterySetup(e.target.value as "one"|"two")}><option value="one">One battery</option><option value="two">Two batteries</option></select></label>
      <label><span>Planning range factor</span><select value={rangeFactor} onChange={e=>setRangeFactor(Number(e.target.value))}><option value="100">100% of claimed range</option><option value="90">90%</option><option value="80">80%</option><option value="70">70%</option><option value="60">60%</option></select></label>
      <label><span>Daily riding distance</span><input type="number" min="1" max="300" value={dailyKm} onChange={e=>setDailyKm(Math.max(1,Number(e.target.value)||1))}/><small>km per day</small></label>
    </div>
    <div className="calculator-results">
      <article><span>Manufacturer claim</span><strong>{result.claimed} km</strong><small>{batterySetup==="two"?"Two batteries":"One battery"}</small></article>
      <article><span>Planning range</span><strong>{result.adjusted} km</strong><small>At {rangeFactor}% of the published claim</small></article>
      <article><span>Daily range used</span><strong>{result.dailyShare}%</strong><small>At {dailyKm} km/day</small></article>
      <article><span>Whole riding days</span><strong>{result.ridingDays}</strong><small>Before the planned range is used</small></article>
    </div>
    <p className="calculator-note">This is a planning tool, not a guaranteed real-world range. Speed, passenger/load, terrain, tire pressure, temperature and battery condition can materially change the distance available.</p>
  </div>;
}

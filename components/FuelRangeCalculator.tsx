"use client";
import { useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { efficiencyEvidence, fuelCostForDistance, planningRangeKm, theoreticalRangeKm } from "@/lib/efficiency";
import { php } from "@/lib/utils";

export function FuelRangeCalculator({ model }: { model: Motorcycle }) {
  const evidence=efficiencyEvidence(model);
  const [distance,setDistance]=useState(900);
  const [fuelPrice,setFuelPrice]=useState(65);
  const cost=useMemo(()=>fuelCostForDistance(model,distance,fuelPrice),[model,distance,fuelPrice]);
  const liters=distance/evidence.kmPerL;
  return <div className="fuel-tool">
    <div className="fuel-kpis"><div><span>Economy basis</span><strong>{evidence.kmPerL} km/L</strong><small>{evidence.status==="listed"?"Listed figure":"Estimated figure"}</small></div><div><span>Theoretical full-tank range</span><strong>{theoreticalRangeKm(model)} km</strong><small>{model.fuelTankL} L × economy basis</small></div><div><span>85% range estimate</span><strong>{planningRangeKm(model)} km</strong><small>85% of theoretical range</small></div></div>
    <div className="fuel-controls"><label>Distance / month <b>{distance.toLocaleString()} km</b><input type="range" min="100" max="3000" step="100" value={distance} onChange={e=>setDistance(Number(e.target.value))}/></label><label>Fuel price assumption <b>{php(fuelPrice)}/L</b><input type="range" min="40" max="100" step="1" value={fuelPrice} onChange={e=>setFuelPrice(Number(e.target.value))}/></label></div>
    <div className="fuel-result"><span>Estimated fuel / month</span><strong>{liters.toFixed(1)} L · {php(cost)}</strong><small>Estimated figure only. Riding style, traffic, load, road, weather and maintenance can materially change consumption.</small></div>
  </div>;
}

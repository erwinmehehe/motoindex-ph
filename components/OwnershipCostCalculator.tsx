"use client";
import { useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { ownershipDefaults, estimatedUsedValue } from "@/lib/ownership";
import { observedMarketRange } from "@/lib/marketChecks";
import { efficiencyEvidence } from "@/lib/efficiency";
import { php } from "@/lib/utils";

function monthlyPayment(principal:number, annualRatePct:number, months:number){if(principal<=0||months<=0)return 0;const r=Math.max(0,annualRatePct)/100/12;if(!r)return principal/months;return principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1)}

export function OwnershipCostCalculator({ model }: { model: Motorcycle }) {
  const d = ownershipDefaults(model);
  const market=observedMarketRange(model);
  const efficiency=efficiencyEvidence(model);
  const [purchasePrice,setPurchasePrice]=useState(market.from||model.srp);
  const [mode,setMode]=useState<"cash"|"finance">("finance");
  const [downPct,setDownPct]=useState(20);
  const [apr,setApr]=useState(12);
  const [term,setTerm]=useState(36);
  const [km, setKm] = useState(d.kmPerMonth);
  const [kmpl, setKmpl] = useState(model.fuelConsumptionKmL||d.estimatedKmPerL);
  const [fuel, setFuel] = useState(d.fuelPricePerL);
  const [maintenance, setMaintenance] = useState(d.maintenancePerMonth);
  const [insurance, setInsurance] = useState(d.annualInsurance);
  const [registration, setRegistration] = useState(d.annualRegistration);
  const [tires, setTires] = useState(d.tiresPerYear);
  const values = useMemo(() => {
    const fuelMonthly = Math.max(0, km) / Math.max(1, kmpl) * Math.max(0, fuel);
    const runningMonthly = fuelMonthly + Math.max(0, maintenance) + Math.max(0, insurance)/12 + Math.max(0, registration)/12 + Math.max(0, tires)/12;
    const down = mode==="finance"?purchasePrice*Math.max(0,Math.min(100,downPct))/100:purchasePrice;
    const financed = mode==="finance"?Math.max(0,purchasePrice-down):0;
    const payment=mode==="finance"?monthlyPayment(financed,apr,term):0;
    const acquisitionYear1=mode==="cash"?purchasePrice:down+payment*Math.min(12,term);
    const acquisitionThreeYears=mode==="cash"?purchasePrice:down+payment*term;
    const year1=acquisitionYear1+runningMonthly*12;
    const threeYearCash=acquisitionThreeYears+runningMonthly*36;
    const resale=estimatedUsedValue(model,3,"good");
    const threeYearNet=Math.max(0,threeYearCash-resale);
    return {fuelMonthly,runningMonthly,down,financed,payment,year1,threeYearCash,resale,threeYearNet,threeYearMonthly:threeYearNet/36,financeCost:Math.max(0,acquisitionThreeYears-purchasePrice)};
  }, [km, kmpl, fuel, maintenance, insurance, registration, tires, purchasePrice, mode, downPct, apr, term, model]);
  return <div className="ownership-calculator v18">
    <div className="ownership-calculator-copy"><h2>Estimate the 1-year + 3-year cost to own {model.model}</h2><p>Purchase, financing and running costs are shown separately so you can replace the default assumptions with your own numbers.</p><div className="ownership-total"><small>3-year net ownership estimate</small><strong>{php(values.threeYearNet)}</strong><span>{php(values.threeYearMonthly)}/month blended after estimated 3-year resale</span></div></div>
    <div className="ownership-fields wide">
      <label>Purchase price <b>{php(purchasePrice)}</b><input type="number" min="10000" step="100" value={purchasePrice} onChange={e=>setPurchasePrice(Number(e.target.value)||0)}/></label>
      <label>Purchase method <select value={mode} onChange={e=>setMode(e.target.value as "cash"|"finance")}><option value="finance">Financing</option><option value="cash">Cash</option></select></label>
      {mode==="finance"&&<><label>Down payment <b>{downPct}% · {php(values.down)}</b><input type="range" min="0" max="60" step="5" value={downPct} onChange={e=>setDownPct(Number(e.target.value))}/></label><label>APR assumption <b>{apr}%</b><input type="range" min="0" max="36" step="1" value={apr} onChange={e=>setApr(Number(e.target.value))}/></label><label>Loan term <select value={term} onChange={e=>setTerm(Number(e.target.value))}><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option></select></label></>}
      <label>Distance / month <b>{km.toLocaleString()} km</b><input type="range" min="100" max="3000" step="100" value={km} onChange={e=>setKm(Number(e.target.value))}/></label>
      <label>Fuel economy <b>{kmpl} km/L</b><input type="range" min="15" max="70" step="1" value={kmpl} onChange={e=>setKmpl(Number(e.target.value))}/><small>{efficiency.status==="listed"?"Starts from the listed model figure":"Starts from an estimate"}</small></label>
      <label>Fuel assumption <b>{php(fuel)}/L</b><input type="range" min="40" max="100" step="1" value={fuel} onChange={e=>setFuel(Number(e.target.value))}/></label>
      <label>Maintenance / month <b>{php(maintenance)}</b><input type="range" min="0" max="5000" step="100" value={maintenance} onChange={e=>setMaintenance(Number(e.target.value))}/></label>
      <label>Insurance / year <b>{php(insurance)}</b><input type="range" min="0" max="30000" step="500" value={insurance} onChange={e=>setInsurance(Number(e.target.value))}/></label>
      <label>Registration / year <b>{php(registration)}</b><input type="range" min="0" max="6000" step="100" value={registration} onChange={e=>setRegistration(Number(e.target.value))}/></label>
      <label>Tire reserve / year <b>{php(tires)}</b><input type="range" min="0" max="25000" step="500" value={tires} onChange={e=>setTires(Number(e.target.value))}/></label>
    </div>
    <div className="ownership-breakdown expanded"><span><small>Running cost / month</small><b>{php(values.runningMonthly)}</b></span><span><small>{mode==="finance"?"Finance payment / month":"Cash purchase"}</small><b>{mode==="finance"?php(values.payment):php(purchasePrice)}</b></span><span><small>1-year cash outflow</small><b>{php(values.year1)}</b></span><span><small>3-year cash outflow</small><b>{php(values.threeYearCash)}</b></span><span><small>3-year resale estimate</small><b>− {php(values.resale)}</b></span>{mode==="finance"&&<span><small>Estimated finance cost</small><b>{php(values.financeCost)}</b></span>}</div>
    <div className="note-box compact-note"><p><b>Estimate, not a quote.</b> Financing uses a standard amortization formula and the APR you enter. The resale value is MotoIndex&apos;s generic depreciation estimate, not a guaranteed market value. Dealer fees, accessories, parking, tolls, repairs and opportunity cost are not included.</p></div>
  </div>;
}

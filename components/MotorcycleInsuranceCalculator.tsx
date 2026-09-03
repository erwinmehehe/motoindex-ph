"use client";

import { useEffect, useMemo, useState } from "react";

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}
function clamp(value: number, min: number, max: number, fallback: number) { return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback; }

type Props={initialValue?:number;modelLabel?:string;initialRate?:number;initialCtpl?:number};
export function MotorcycleInsuranceCalculator({ initialValue = 100000, modelLabel, initialRate=1.4, initialCtpl=0 }: Props) {
  const initialSafeValue=clamp(initialValue,10000,10000000,100000), initialSafeRate=clamp(initialRate,0,20,1.4), initialSafeCtpl=clamp(initialCtpl,0,100000,0);
  const [bikeValue, setBikeValue] = useState(initialSafeValue);
  const [premiumRate, setPremiumRate] = useState(initialSafeRate);
  const [ctpl, setCtpl] = useState(initialSafeCtpl);
  const [copied,setCopied]=useState(false);

  const result = useMemo(() => {
    const value = clamp(bikeValue, 10000, 10000000, 100000);
    const rate = clamp(premiumRate, 0, 20, 1.4);
    const ctplAmount = clamp(ctpl, 0, 100000, 0);
    const ownDamageTheft = value * rate / 100;
    const deductibleReference = Math.max(500, value * 0.01);
    return { value, rate, ctplAmount, ownDamageTheft, deductibleReference, annualBudget: ownDamageTheft + ctplAmount };
  }, [bikeValue, premiumRate, ctpl]);

  useEffect(()=>{const p=new URLSearchParams();p.set("value",String(Math.round(result.value)));if(result.rate!==1.4)p.set("rate",String(result.rate));if(result.ctplAmount)p.set("ctpl",String(result.ctplAmount));if(modelLabel)p.set("model",modelLabel);window.history.replaceState(null,"",`${window.location.pathname}?${p.toString()}`)},[result.value,result.rate,result.ctplAmount,modelLabel]);
  function reset(){setBikeValue(initialSafeValue);setPremiumRate(initialSafeRate);setCtpl(initialSafeCtpl);}
  async function copy(){const text=`${modelLabel?`${modelLabel}: `:""}insurance planning budget ${peso(result.annualBudget)}/year at ${result.rate}% own-damage/theft reference plus ${peso(result.ctplAmount)} CTPL. ${window.location.href}`;await navigator.clipboard?.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}

  return <section className="insurance-tool">
    <div className="insurance-copy"><h2>{modelLabel ? `Estimate insurance for ${modelLabel}` : "Estimate a motorcycle insurance budget"}</h2><p>The editable percentage starts at the Insurance Commission motor tariff's 1.40% own-damage-and-theft reference for motorcycles. Treat it only as a comparison starting point and replace it with the rate or premium in a current insurer quote.</p><div className="insurance-primary" aria-live="polite"><span>Annual planning budget</span><strong>{peso(result.annualBudget)}</strong><small>Own-damage/theft estimate plus the CTPL amount you enter.</small></div></div>
    <div className="insurance-fields"><label>Motorcycle insured value <b>{peso(result.value)}</b><input type="number" min="10000" max="10000000" step="500" value={bikeValue} onChange={(event)=>setBikeValue(Number(event.target.value))}/></label><label>Own-damage + theft rate <b>{result.rate}%</b><input type="range" min="0" max="10" step="0.1" value={premiumRate} onChange={(event)=>setPremiumRate(Number(event.target.value))}/></label><div className="calc-presets" aria-label="Rate presets">{[1.4,2,3].map(v=><button type="button" key={v} className={result.rate===v?"active":""} onClick={()=>setPremiumRate(v)}>{v}%</button>)}</div><label>Current CTPL quote <b>{peso(result.ctplAmount)}</b><input type="number" min="0" max="100000" step="50" value={ctpl} onChange={(event)=>setCtpl(Number(event.target.value))}/></label><div className="calc-actions"><button type="button" className="button ghost small" onClick={reset}>Reset</button><button type="button" className="button small" onClick={copy}>{copied?"Copied ✓":"Copy calculation"}</button></div></div>
    <div className="insurance-breakdown"><span><small>Own damage + theft estimate</small><b>{peso(result.ownDamageTheft)}</b></span><span><small>Reference deductible floor</small><b>{peso(result.deductibleReference)}</b></span><span><small>CTPL input</small><b>{peso(result.ctplAmount)}</b></span></div>
  </section>;
}

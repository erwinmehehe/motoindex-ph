"use client";

import { useEffect, useMemo, useState } from "react";
import { monthlyPayment } from "@/lib/utils";

function peso(value: number) { return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value); }
function clamp(value: number, min: number, max: number, fallback: number) { return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback; }

type Props={initialPrice?:number;modelLabel?:string;initialDownPct?:number;initialMonths?:number;initialRate?:number;syncUrl?:boolean};
export function LoanCalculator({ initialPrice = 100000, modelLabel, initialDownPct=20, initialMonths=36, initialRate=12, syncUrl=true }: Props) {
  const safeInitial = clamp(initialPrice, 1000, 10000000, 100000);
  const initialDown=clamp(initialDownPct,0,95,20), initialTerm=Math.round(clamp(initialMonths,1,84,36)), initialApr=clamp(initialRate,0,60,12);
  const [price, setPrice] = useState(safeInitial);
  const [downPct, setDownPct] = useState(initialDown);
  const [months, setMonths] = useState(initialTerm);
  const [annualRate, setAnnualRate] = useState(initialApr);
  const [copied,setCopied]=useState(false);
  const result = useMemo(() => {
    const safePrice = clamp(price, 1000, 10000000, safeInitial); const safeDown = clamp(downPct, 0, 95, 20); const safeMonths = Math.round(clamp(months, 1, 84, 36)); const safeRate = clamp(annualRate, 0, 60, 12);
    const downAmount = safePrice * safeDown / 100; const financed = safePrice - downAmount; const monthly = monthlyPayment(safePrice, safeDown, safeMonths, safeRate); const loanPayments = monthly * safeMonths; const interest = Math.max(0, loanPayments - financed);
    return { safePrice, safeDown, safeMonths, safeRate, downAmount, financed, monthly, interest, totalCash: downAmount + loanPayments };
  }, [price, downPct, months, annualRate, safeInitial]);
  useEffect(()=>{if(!syncUrl)return;const p=new URLSearchParams(window.location.search);p.set("price",String(Math.round(result.safePrice)));p.set("down",String(result.safeDown));p.set("term",String(result.safeMonths));p.set("rate",String(result.safeRate));if(modelLabel)p.set("model",modelLabel);window.history.replaceState(null,"",`${window.location.pathname}?${p.toString()}`)},[result.safePrice,result.safeDown,result.safeMonths,result.safeRate,modelLabel,syncUrl]);
  function reset(){setPrice(safeInitial);setDownPct(initialDown);setMonths(initialTerm);setAnnualRate(initialApr);}
  async function copy(){const url=window.location.href;const summary=`${modelLabel?`${modelLabel}: `:""}${peso(result.safePrice)}, ${result.safeDown}% down, ${result.safeMonths} months at ${result.safeRate}% APR ≈ ${peso(result.monthly)}/month. ${url}`;await navigator.clipboard?.writeText(summary);setCopied(true);window.setTimeout(()=>setCopied(false),1800);}
  return <section className="loan-tool">
    <div className="loan-copy"><h2>{modelLabel ? `Estimate payments for ${modelLabel}` : "Estimate a motorcycle loan"}</h2><p>Change the cash price, down payment, term and annual rate. This is a planning estimate, not a dealer financing quote; processing fees, insurance and add-ons can change the actual amount due.</p><div className="loan-primary" aria-live="polite"><span>Estimated monthly</span><strong>{peso(result.monthly)}</strong><small>{result.safeMonths} months at {result.safeRate}% annual rate</small></div></div>
    <div className="loan-fields">
      <label>Motorcycle price <b>{peso(result.safePrice)}</b><input type="number" min="1000" max="10000000" step="500" value={price} onChange={(event)=>setPrice(Number(event.target.value))}/></label>
      <label>Down payment <b>{result.safeDown}%</b><input type="range" min="0" max="95" step="5" value={downPct} onChange={(event)=>setDownPct(Number(event.target.value))}/></label><div className="calc-presets" aria-label="Down payment presets">{[10,20,30].map(v=><button type="button" key={v} className={downPct===v?"active":""} onClick={()=>setDownPct(v)}>{v}% down</button>)}</div>
      <label>Loan term <b>{result.safeMonths} months</b><input type="range" min="6" max="84" step="6" value={months} onChange={(event)=>setMonths(Number(event.target.value))}/></label><div className="calc-presets" aria-label="Loan term presets">{[12,24,36,48].map(v=><button type="button" key={v} className={months===v?"active":""} onClick={()=>setMonths(v)}>{v} mo</button>)}</div>
      <label>Annual interest rate <b>{result.safeRate}%</b><input type="range" min="0" max="60" step="0.5" value={annualRate} onChange={(event)=>setAnnualRate(Number(event.target.value))}/></label>
      <div className="calc-actions"><button type="button" className="button ghost small" onClick={reset}>Reset</button><button type="button" className="button small" onClick={copy}>{copied?"Copied ✓":"Copy calculation"}</button></div>
    </div>
    <div className="loan-breakdown"><span><small>Down payment</small><b>{peso(result.downAmount)}</b></span><span><small>Amount financed</small><b>{peso(result.financed)}</b></span><span><small>Estimated interest</small><b>{peso(result.interest)}</b></span><span><small>Total cash paid</small><b>{peso(result.totalCash)}</b></span></div>
  </section>;
}

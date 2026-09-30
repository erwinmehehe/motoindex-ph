"use client";

import { useMemo, useState } from "react";
import { estimateMonthlyPayment } from "@/lib/financing";

function peso(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
}

type PriceOption = { label: string; price: number };

export function InstallmentCalculator({ price, priceOptions = [] }: { price: number; priceOptions?: PriceOption[] }) {
  const [purchasePrice, setPurchasePrice] = useState(price);
  const [selectedOption, setSelectedOption] = useState("");
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(12);
  const safePrice = Number.isFinite(purchasePrice) ? Math.max(1_000, Math.min(10_000_000, purchasePrice)) : price;
  const result = useMemo(() => {
    const estimate = estimateMonthlyPayment(safePrice, down, months, rate);
    return { principal: estimate.financedPhp, payment: estimate.monthlyPhp };
  }, [safePrice, down, months, rate]);

  function chooseVariant(value: string) {
    setSelectedOption(value);
    const option = priceOptions.find((item) => item.label === value);
    if (option) setPurchasePrice(option.price);
  }

  return (
    <section className="calculator" data-calculator="installment">
      <div><h2>Estimate your monthly payment</h2><p>The purchase price starts from MotoIndex&apos;s displayed market-price basis and is editable. When current trim SRPs are available, you can load one directly. Dealer financing, fees and effective rates vary.</p></div>
      {priceOptions.length > 1 && <div className="variant-price-picker"><label>Trim SRP<select value={selectedOption} onChange={(e)=>chooseVariant(e.target.value)}><option value="">Use displayed market basis</option>{priceOptions.map((option)=><option key={`${option.label}-${option.price}`} value={option.label}>{option.label} · {peso(option.price)}</option>)}</select></label><small>Trim SRPs are dated references. The purchase-price field stays editable for an actual dealer quote.</small></div>}
      <div className="finance-presets" style={{margin:"14px 0 2px",padding:"12px 14px",border:"1px solid var(--mi-color-line-soft)",borderRadius:14,background:"var(--mi-color-surface-subtle)"}} aria-label="Quick finance presets"><span style={{display:"block",marginBottom:8,color:"var(--mi-color-muted)",fontSize:8,fontWeight:850,letterSpacing:".08em",textTransform:"uppercase"}}>Quick planning</span><div style={{display:"flex",gap:7,flexWrap:"wrap"}}><button type="button" style={{minHeight:32,padding:"0 11px",border:${down===10?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${down===10?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${down===10?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setDown(10)}>10% down</button><button type="button" style={{minHeight:32,padding:"0 11px",border:${down===20?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${down===20?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${down===20?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setDown(20)}>20% down</button><button type="button" style={{minHeight:32,padding:"0 11px",border:${down===30?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${down===30?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${down===30?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setDown(30)}>30% down</button><button type="button" style={{minHeight:32,padding:"0 11px",border:${months===24?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${months===24?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${months===24?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setMonths(24)}>24 months</button><button type="button" style={{minHeight:32,padding:"0 11px",border:${months===36?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${months===36?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${months===36?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setMonths(36)}>36 months</button><button type="button" style={{minHeight:32,padding:"0 11px",border:${months===48?"\"1px solid var(--mi-color-primary)\"":"\"1px solid var(--mi-color-line)\""},borderRadius:999,background:${months===48?"\"var(--mi-color-primary)\"":"\"var(--mi-color-surface)\""},color:${months===48?"\"var(--mi-color-surface)\"":"\"var(--mi-color-slate-700)\""},fontSize:9,fontWeight:800,cursor:"pointer"}} onClick={()=>setMonths(48)}>48 months</button></div></div>
      <div className="calc-grid">
        <label>Purchase price <strong>{peso(safePrice)}</strong><input type="number" min="1000" max="10000000" step="100" value={purchasePrice} onChange={(e) => { setSelectedOption(""); setPurchasePrice(Number(e.target.value)); }} /></label>
        <label>Down payment <strong>{down}%</strong><input type="range" min="0" max="50" step="5" value={down} onChange={(e) => setDown(Number(e.target.value))} /></label>
        <label>Term <strong>{months} months</strong><input type="range" min="12" max="60" step="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} /></label>
        <label>Annual rate <strong>{rate}%</strong><input type="range" min="0" max="30" step="1" value={rate} onChange={(e) => setRate(Number(e.target.value))} /></label>
      </div>
      <div className="calc-result"><span>Estimated monthly</span><strong>{peso(result.payment)}</strong><small>Estimated financed amount {peso(result.principal)}</small></div>
    </section>
  );
}

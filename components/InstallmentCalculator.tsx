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
    <section className="calculator">
      <div><h2>Estimate your monthly payment</h2><p>The purchase price starts from MotoIndex&apos;s displayed market-price basis and is editable. When current trim SRPs are available, you can load one directly. Dealer financing, fees and effective rates vary.</p></div>
      {priceOptions.length > 1 && <div className="variant-price-picker"><label>Trim SRP<select value={selectedOption} onChange={(e)=>chooseVariant(e.target.value)}><option value="">Use displayed market basis</option>{priceOptions.map((option)=><option key={`${option.label}-${option.price}`} value={option.label}>{option.label} · {peso(option.price)}</option>)}</select></label><small>Trim SRPs are dated references. The purchase-price field stays editable for an actual dealer quote.</small></div>}
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

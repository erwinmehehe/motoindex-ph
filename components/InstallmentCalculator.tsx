"use client";

import { useMemo, useState } from "react";
import { estimateMonthlyPayment } from "@/lib/financing";

function peso(n: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
}

type PriceOption = { label: string; price: number };

const DOWN_PRESETS = [10, 20, 30];
const TERM_PRESETS = [24, 36, 48];

export function InstallmentCalculator({ price, priceOptions = [] }: { price: number; priceOptions?: PriceOption[] }) {
  const [purchasePrice, setPurchasePrice] = useState(price);
  const [selectedOption, setSelectedOption] = useState("");
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(12);
  const safePrice = Number.isFinite(purchasePrice) ? Math.max(1_000, Math.min(10_000_000, purchasePrice)) : price;

  const result = useMemo(() => {
    const estimate = estimateMonthlyPayment(safePrice, down, months, rate);
    return {
      downPayment: safePrice * (down / 100),
      principal: estimate.financedPhp,
      payment: estimate.monthlyPhp,
      totalPayments: estimate.monthlyPhp * months,
    };
  }, [safePrice, down, months, rate]);

  function chooseVariant(value: string) {
    setSelectedOption(value);
    const option = priceOptions.find((item) => item.label === value);
    if (option) setPurchasePrice(option.price);
  }

  return (
    <section className="finance-planner" data-calculator="installment">
      <div className="finance-planner-result">
        <div className="finance-planner-result-head">
          <div>
            <span>Estimated monthly</span>
            <strong>{peso(result.payment)}</strong>
            <small>for {months} months · {rate}% annual rate assumption</small>
          </div>
          <span className="finance-planner-badge">Planning estimate</span>
        </div>

        <dl className="finance-summary">
          <div><dt>Purchase price</dt><dd>{peso(safePrice)}</dd></div>
          <div><dt>Down payment</dt><dd>{peso(result.downPayment)} <small>({down}%)</small></dd></div>
          <div><dt>Amount financed</dt><dd>{peso(result.principal)}</dd></div>
          <div><dt>Estimated loan payments</dt><dd>{peso(result.totalPayments)}</dd></div>
        </dl>

        <p className="finance-planner-note">Planning only. Dealer fees, insurance, rebates, required minimum downpayment and the lender&apos;s effective rate can change the actual monthly payment.</p>
      </div>

      <div className="finance-planner-controls">
        <div className="finance-planner-intro">
          <span>Adjust the estimate</span>
          <h3>Build a monthly payment that fits your budget.</h3>
          <p>Start from MotoIndex&apos;s displayed price, then match the exact dealer quote before deciding.</p>
        </div>

        {priceOptions.length > 1 && <label className="finance-field finance-field-select">
          <span>Variant / price basis</span>
          <select value={selectedOption} onChange={(e)=>chooseVariant(e.target.value)}>
            <option value="">Displayed market price · {peso(price)}</option>
            {priceOptions.map((option)=><option key={`${option.label}-${option.price}`} value={option.label}>{option.label} · {peso(option.price)}</option>)}
          </select>
          <small>Select a recorded SRP or keep the editable market-price basis.</small>
        </label>}

        <label className="finance-field">
          <span>Purchase price <strong>{peso(safePrice)}</strong></span>
          <input className="finance-price-input" type="number" min="1000" max="10000000" step="100" value={purchasePrice} onChange={(e) => { setSelectedOption(""); setPurchasePrice(Number(e.target.value)); }} />
        </label>

        <div className="finance-field">
          <span>Down payment <strong>{down}% · {peso(result.downPayment)}</strong></span>
          <div className="finance-presets" aria-label="Down payment presets">
            {DOWN_PRESETS.map((value)=><button type="button" key={value} className={down===value ? "is-active" : ""} onClick={()=>setDown(value)}>{value}%</button>)}
          </div>
          <input aria-label="Down payment percentage" type="range" min="0" max="50" step="5" value={down} onChange={(e) => setDown(Number(e.target.value))} />
        </div>

        <div className="finance-field">
          <span>Loan term <strong>{months} months</strong></span>
          <div className="finance-presets" aria-label="Loan term presets">
            {TERM_PRESETS.map((value)=><button type="button" key={value} className={months===value ? "is-active" : ""} onClick={()=>setMonths(value)}>{value} mo</button>)}
          </div>
          <input aria-label="Loan term in months" type="range" min="12" max="60" step="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        </div>

        <label className="finance-field">
          <span>Annual rate assumption <strong>{rate}%</strong></span>
          <input aria-label="Annual rate percentage" type="range" min="0" max="30" step="1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </label>
      </div>
    </section>
  );
}

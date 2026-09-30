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
    const repaymentTotal = estimate.monthlyPhp * months;
    return {
      downPayment: estimate.downPaymentPhp,
      principal: estimate.financedPhp,
      payment: estimate.monthlyPhp,
      repaymentTotal,
      interestEstimate: Math.max(0, repaymentTotal - estimate.financedPhp)
    };
  }, [safePrice, down, months, rate]);

  function chooseVariant(value: string) {
    setSelectedOption(value);
    const option = priceOptions.find((item) => item.label === value);
    if (option) setPurchasePrice(option.price);
  }

  return (
    <section className="calculator finance-planner" data-calculator="installment">
      <div className="finance-planner-head">
        <div>
          <span className="finance-kicker">Interactive estimate</span>
          <h2>Build a monthly payment that fits your budget</h2>
          <p>Start from the published price, then replace it with the exact dealer quote. Adjust the cash downpayment, term and annual rate before comparing offers.</p>
        </div>
        <span className="finance-estimate-badge">Planning estimate</span>
      </div>

      <div className="finance-planner-layout">
        <div className="finance-controls">
          {priceOptions.length > 1 && <div className="variant-price-picker">
            <label>
              <span>Choose variant</span>
              <select value={selectedOption} onChange={(e)=>chooseVariant(e.target.value)}>
                <option value="">Displayed market price</option>
                {priceOptions.map((option)=><option key={`${option.label}-${option.price}`} value={option.label}>{option.label} · {peso(option.price)}</option>)}
              </select>
            </label>
            <small>Verified trim SRPs are shortcuts. You can still type the dealer&apos;s actual cash price below.</small>
          </div>}

          <div className="finance-price-input">
            <label htmlFor="finance-purchase-price">Purchase price</label>
            <div className="finance-price-field">
              <span>₱</span>
              <input id="finance-purchase-price" type="number" min="1000" max="10000000" step="100" value={purchasePrice} onChange={(e) => { setSelectedOption(""); setPurchasePrice(Number(e.target.value)); }} />
            </div>
          </div>

          <div className="finance-preset-row" aria-label="Quick financing presets">
            <div>
              <span>Downpayment</span>
              {[10,20,30].map(value=><button type="button" className={down===value?"is-active":""} aria-pressed={down===value} key={value} onClick={()=>setDown(value)}>{value}%</button>)}
            </div>
            <div>
              <span>Term</span>
              {[24,36,48].map(value=><button type="button" className={months===value?"is-active":""} aria-pressed={months===value} key={value} onClick={()=>setMonths(value)}>{value} mo</button>)}
            </div>
          </div>

          <div className="calc-grid finance-slider-grid">
            <label>
              <span>Downpayment</span>
              <strong>{down}% · {peso(result.downPayment)}</strong>
              <input type="range" min="0" max="50" step="5" value={down} onChange={(e) => setDown(Number(e.target.value))} />
            </label>
            <label>
              <span>Loan term</span>
              <strong>{months} months</strong>
              <input type="range" min="12" max="60" step="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
            </label>
            <label>
              <span>Annual rate</span>
              <strong>{rate}%</strong>
              <input type="range" min="0" max="30" step="1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
            </label>
          </div>
        </div>

        <aside className="calc-result finance-result" aria-live="polite">
          <span>Estimated monthly</span>
          <strong>{peso(result.payment)}</strong>
          <small>for {months} months at {rate}% annual interest</small>
          <div className="finance-result-facts">
            <div><span>Cash down</span><strong>{peso(result.downPayment)}</strong></div>
            <div><span>Amount financed</span><strong>{peso(result.principal)}</strong></div>
            <div><span>Estimated interest</span><strong>{peso(result.interestEstimate)}</strong></div>
          </div>
          <p>Dealer fees, insurance, registration, add-ons and lender-specific charges are not included unless they are already inside the purchase price you entered.</p>
        </aside>
      </div>
    </section>
  );
}

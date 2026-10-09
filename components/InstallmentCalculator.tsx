"use client";

import { useMemo, useState } from "react";
import "@/app/installment-experience.css";
import { calculateInstallmentPlan } from "@/lib/installmentPlan";

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const peso = (value: number) => money.format(value);
const PRESET_DOWNS = [10, 20, 30];
const PRESET_TERMS = [24, 36, 48];
type PriceOption = { label: string; price: number };

/** Shared by the standalone installment landing pages and motorcycle research pages. */
export function InstallmentCalculator({ price, priceOptions = [] }: { price: number; priceOptions?: PriceOption[] }) {
  const [purchasePrice, setPurchasePrice] = useState(price);
  const [selectedOption, setSelectedOption] = useState("");
  const [down, setDown] = useState(20);
  const [months, setMonths] = useState(36);
  const [rate, setRate] = useState(12);
  const [upfrontFees, setUpfrontFees] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");

  const invalidPrice = !Number.isFinite(purchasePrice) || purchasePrice < 1_000 || purchasePrice > 10_000_000;
  const invalidFees = !Number.isFinite(upfrontFees) || upfrontFees < 0 || upfrontFees > 1_000_000;

  const result = useMemo(() => calculateInstallmentPlan({
    pricePhp: purchasePrice, downPaymentPct: down, months, annualRatePct: rate, upfrontFeesPhp: upfrontFees
  }), [purchasePrice, down, months, rate, upfrontFees]);

  function chooseVariant(value: string) {
    setSelectedOption(value);
    const option = priceOptions.find((item) => item.label === value);
    setPurchasePrice(option ? option.price : price);
    setCopyStatus("");
  }

  function reset() {
    setPurchasePrice(price);
    setSelectedOption("");
    setDown(20);
    setMonths(36);
    setRate(12);
    setUpfrontFees(0);
    setCopyStatus("");
  }

  async function copyEstimate() {
    const rows = [
      "MotoIndex motorcycle installment estimate - planning only, not a dealer quote",
      "Purchase price: " + peso(result.pricePhp),
      "Downpayment: " + result.downPaymentPct + "% (" + peso(result.downPaymentPhp) + ")",
      "Loan term: " + result.months + " months",
      "Annual amortizing rate assumption: " + result.annualRatePct + "%",
      "Monthly estimate: " + peso(result.monthlyPhp),
      "Upfront fees (entered separately): " + peso(result.upfrontFeesPhp),
      "Initial cash required: " + peso(result.cashNeededUpfrontPhp),
      "Total estimated paid: " + peso(result.totalCashOutlayPhp),
      "Dealer rates, flat/add-on methods, taxes, insurance and approval can differ."
    ];
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(rows.join("\n"));
      setCopyStatus("Estimate copied. Check dealer terms before relying on it.");
    } catch {
      setCopyStatus("Copy unavailable on this browser. You can still note the figures above.");
    }
  }

  return <section className="finance-planner" data-calculator="installment" aria-label="Editable motorcycle installment estimate">
    <div className="finance-planner-head">
      <div>
        <span className="finance-kicker">Interactive payment planner</span>
        <h2>Build your monthly estimate</h2>
        <p>Choose the motorcycle price and adjust the downpayment, term and annual amortizing rate. All figures update together.</p>
      </div>
      <span className="finance-estimate-badge">No loan application</span>
    </div>

    <div className="finance-planner-layout">
      <div className="finance-controls">
        <div className="finance-step-heading">
          <span className="finance-step-number" aria-hidden="true">01</span>
          <div><h3>Start with the cash price</h3><p>Use the exact variant or a written dealer quotation.</p></div>
        </div>
        {priceOptions.length > 1 && <div className="variant-price-picker">
          <label htmlFor="finance-variant"><span>Motorcycle variant</span></label>
          <select id="finance-variant" value={selectedOption} onChange={event => chooseVariant(event.target.value)}>
            <option value="">Published starting-price reference</option>
            {priceOptions.map(option => <option key={option.label + "-" + option.price} value={option.label}>{option.label} - {peso(option.price)}</option>)}
          </select>
          <small>Verified variant SRPs are reference shortcuts, not guaranteed dealer cash prices.</small>
        </div>}
        <div className="finance-price-input">
          <label htmlFor="finance-purchase-price">Cash purchase price</label>
          <div className="finance-price-field">
            <span aria-hidden="true">₱</span>
            <input id="finance-purchase-price" type="number" inputMode="numeric" min="1000" max="10000000" step="100" value={purchasePrice} aria-invalid={invalidPrice} onBlur={() => setPurchasePrice(result.pricePhp)} onChange={event => { setSelectedOption(""); setPurchasePrice(Number(event.target.value)); setCopyStatus(""); }} />
          </div>
          {invalidPrice && <small className="finance-input-warning" role="status">Enter ₱1,000–₱10,000,000. The calculation temporarily uses {peso(result.pricePhp)}.</small>}
        </div>

        <div className="finance-step-heading finance-step-divider">
          <span className="finance-step-number" aria-hidden="true">02</span>
          <div><h3>Set downpayment and term</h3><p>Compare how more cash upfront changes the monthly amount.</p></div>
        </div>
        <div className="finance-preset-groups">
          <div className="finance-preset-block">
            <span className="finance-preset-label">Downpayment</span>
            <div className="calc-presets" aria-label="Quick downpayment percentages">
              {PRESET_DOWNS.map(value => <button type="button" key={value} className={down === value ? "active" : ""} aria-pressed={down === value} onClick={() => { setDown(value); setCopyStatus(""); }}>{value}%</button>)}
            </div>
          </div>
          <div className="finance-preset-block">
            <span className="finance-preset-label">Loan term</span>
            <div className="calc-presets" aria-label="Quick loan terms">
              {PRESET_TERMS.map(value => <button type="button" key={value} className={months === value ? "active" : ""} aria-pressed={months === value} onClick={() => { setMonths(value); setCopyStatus(""); }}>{value} mo</button>)}
            </div>
          </div>
        </div>
        <div className="calc-grid finance-slider-grid">
          <label htmlFor="finance-down-slider">
            <span>Downpayment</span><strong>{down}% · {peso(result.downPaymentPhp)}</strong>
            <input id="finance-down-slider" type="range" min="0" max="50" step="5" value={down} onChange={event => { setDown(Number(event.target.value)); setCopyStatus(""); }} />
          </label>
          <label htmlFor="finance-month-slider">
            <span>Term</span><strong>{months} months</strong>
            <input id="finance-month-slider" type="range" min="12" max="60" step="12" value={months} onChange={event => { setMonths(Number(event.target.value)); setCopyStatus(""); }} />
          </label>
        </div>

        <div className="finance-step-heading finance-step-divider">
          <span className="finance-step-number" aria-hidden="true">03</span>
          <div><h3>Set the interest assumption and fees</h3><p>A flat or add-on dealer rate cannot be entered as an equivalent amortizing rate.</p></div>
        </div>
        <div className="finance-extra-grid">
          <div className="finance-rate-block">
            <label htmlFor="finance-rate-slider">Annual amortizing interest</label>
            <div className="finance-rate-value"><strong>{rate}%</strong><input type="number" aria-label="Enter annual amortizing interest percentage" min="0" max="30" step="0.5" inputMode="decimal" value={rate} onChange={event => { setRate(Math.min(30, Math.max(0, Number(event.target.value)))); setCopyStatus(""); }} /><span>%</span></div>
            <input id="finance-rate-slider" type="range" min="0" max="30" step="0.5" value={rate} onChange={event => { setRate(Number(event.target.value)); setCopyStatus(""); }} />
          </div>
          <div className="finance-fee-block">
            <label htmlFor="finance-upfront-fees">Fees paid upfront <small>(optional)</small></label>
            <div className="finance-price-field">
              <span aria-hidden="true">₱</span>
              <input id="finance-upfront-fees" type="number" inputMode="numeric" min="0" max="1000000" step="100" value={upfrontFees} aria-invalid={invalidFees} onBlur={() => setUpfrontFees(result.upfrontFeesPhp)} onChange={event => { setUpfrontFees(Number(event.target.value)); setCopyStatus(""); }} />
            </div>
            <small>Only include fees you will pay in cash, not fees added to the loan.</small>
            {invalidFees && <small className="finance-input-warning" role="status">Fees must be between ₱0 and ₱1,000,000; the calculation uses {peso(result.upfrontFeesPhp)}.</small>}
          </div>
        </div>
        <div className="finance-controls-footer">
          <button type="button" className="finance-reset" onClick={reset}>Reset estimate</button>
          <span>No personal information required</span>
        </div>
      </div>

      <aside className="calc-result finance-result" aria-label="Calculated motorcycle financing estimate">
        <span>Estimated monthly payment</span>
        <strong aria-live="polite" aria-atomic="true">{peso(result.monthlyPhp)}</strong>
        <small>{result.months} payments · {result.annualRatePct}% annual amortizing interest</small>
        <div className="finance-result-upfront"><span>Cash to prepare upfront</span><strong>{peso(result.cashNeededUpfrontPhp)}</strong><small>Downpayment + entered upfront fees</small></div>
        <div className="finance-result-facts">
          <div><span>Downpayment</span><strong>{peso(result.downPaymentPhp)}</strong></div>
          <div><span>Amount financed</span><strong>{peso(result.financedPhp)}</strong></div>
          <div><span>Estimated interest</span><strong>{peso(result.interestPhp)}</strong></div>
          <div><span>Entered upfront fees</span><strong>{peso(result.upfrontFeesPhp)}</strong></div>
        </div>
        <div className="finance-result-total">
          <span>Total estimated cash paid</span>
          <strong>{peso(result.totalCashOutlayPhp)}</strong>
          <small>Upfront cash + {months} monthly payments</small>
          <span className="finance-result-difference">Estimated financing interest and entered fees: {peso(result.additionalCostPhp)}</span>
        </div>
        <p>Illustrative amortizing-loan math, <strong>not a dealer offer or approval</strong>. Flat/add-on rates, insurance, taxes and other charges may differ.</p>
        <button type="button" className="finance-copy-button" onClick={copyEstimate}>Copy payment summary <span aria-hidden="true">↗</span></button>
        {copyStatus && <small className="finance-copy-status" role="status">{copyStatus}</small>}
      </aside>
    </div>
  </section>;
}

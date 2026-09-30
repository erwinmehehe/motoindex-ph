import { defaultFinancingExamples, financingScenario } from "@/lib/financing";
import { php } from "@/lib/utils";

type PriceOption = { label: string; price: number };

export function FinancingSnapshot({ modelName, price, priceOptions = [] }: { modelName: string; price: number; priceOptions?: PriceOption[] }) {
  const variants = priceOptions
    .filter((option) => Number.isFinite(option.price) && option.price > 0)
    .filter((option, index, all) => all.findIndex((item) => item.label === option.label && item.price === option.price) === index);
  const variantScenarios = variants.length > 1
    ? variants.map((option) => ({ option, scenario: financingScenario(option.price, 20, 36, 12) }))
    : [];
  const examples = defaultFinancingExamples(price);

  return <div className="financing-snapshot" data-financing-snapshot={variantScenarios.length ? "variants" : "standard"}>
    <div className="section-head compact"><div>
      <h3>{modelName} down payment and monthly payment examples</h3>
      <p>{variantScenarios.length
        ? "Each verified variant uses its own recorded SRP with the same 20% down, 36-month and 12% annual amortizing-interest assumptions so the trim difference is visible."
        : "These examples use the displayed purchase-price basis, a 36-month term and a 12% annual interest assumption."} These are planning estimates, not dealer or lender quotations.</p>
    </div></div>

    <div className="market-price-source-grid financing-option-grid">
      {variantScenarios.length ? variantScenarios.map(({ option, scenario }) => <article className="market-price-source-card" key={`${option.label}-${option.price}`} data-financing-variant={option.label}>
        <div className="market-price-source-top"><span className="market-price-source-type">{option.label}</span><time>{php(option.price)} SRP</time></div>
        <div className="market-price-source-value">{php(Math.round(scenario.downPaymentPhp))} down</div>
        <p className="market-price-source-note"><strong>{php(Math.round(scenario.monthlyPhp))}/month</strong> planning estimate for {scenario.termMonths} months at {scenario.annualRatePct}% annual interest.</p>
        <div className="market-price-source-footer"><span>20% downpayment</span><span>Planning estimate, not a lender quote</span></div>
      </article>) : examples.map((example) => <article className="market-price-source-card" key={example.downPaymentPct}>
        <div className="market-price-source-top"><span className="market-price-source-type">{example.downPaymentPct}% down</span><time>36-month example</time></div>
        <div className="market-price-source-value">{php(Math.round(example.downPaymentPhp))}</div>
        <p className="market-price-source-note"><strong>{php(Math.round(example.monthlyPhp))}/month</strong> planning estimate for {example.termMonths} months at {example.annualRatePct}% annual interest.</p>
        <div className="market-price-source-footer"><span>Adjust the assumptions below</span><span>Not a dealer quotation</span></div>
      </article>)}
    </div>
  </div>;
}

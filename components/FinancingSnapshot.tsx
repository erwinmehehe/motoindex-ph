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

    <div className="entity-price-grid motorcycle-price-grid">
      {variantScenarios.length ? variantScenarios.map(({ option, scenario }) => <article key={`${option.label}-${option.price}`} data-financing-variant={option.label}>
        <span>{option.label} · {php(option.price)} SRP</span>
        <strong>{php(Math.round(scenario.downPaymentPhp))} down</strong>
        <small>About {php(Math.round(scenario.monthlyPhp))}/month for {scenario.termMonths} months at {scenario.annualRatePct}% annual interest.</small>
      </article>) : examples.map((example) => <article key={example.downPaymentPct}>
        <span>{example.downPaymentPct}% down payment</span>
        <strong>{php(Math.round(example.downPaymentPhp))}</strong>
        <small>About {php(Math.round(example.monthlyPhp))}/month for {example.termMonths} months at {example.annualRatePct}% annual interest.</small>
      </article>)}
    </div>
  </div>;
}

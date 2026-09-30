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

  return <section className="finance-scenarios" data-financing-snapshot={variantScenarios.length ? "variants" : "standard"}>
    <div className="finance-scenarios-head">
      <div>
        <span>Quick comparison</span>
        <h3>{variantScenarios.length ? `${modelName} variant payment examples` : `${modelName} downpayment examples`}</h3>
      </div>
      <p>{variantScenarios.length
        ? "Same 20% down, 36-month and 12% annual assumptions across each recorded variant SRP."
        : "Same 36-month and 12% annual assumptions, with different downpayment levels."}</p>
    </div>

    <div className="finance-scenario-grid">
      {variantScenarios.length ? variantScenarios.map(({ option, scenario }) => <article key={`${option.label}-${option.price}`} data-financing-variant={option.label}>
        <span>{option.label}</span>
        <strong>{php(Math.round(scenario.monthlyPhp))}<small>/mo</small></strong>
        <dl>
          <div><dt>SRP</dt><dd>{php(option.price)}</dd></div>
          <div><dt>20% down</dt><dd>{php(Math.round(scenario.downPaymentPhp))}</dd></div>
          <div><dt>Term</dt><dd>{scenario.termMonths} months</dd></div>
        </dl>
      </article>) : examples.map((example) => <article key={example.downPaymentPct}>
        <span>{example.downPaymentPct}% down</span>
        <strong>{php(Math.round(example.monthlyPhp))}<small>/mo</small></strong>
        <dl>
          <div><dt>Cash down</dt><dd>{php(Math.round(example.downPaymentPhp))}</dd></div>
          <div><dt>Term</dt><dd>{example.termMonths} months</dd></div>
          <div><dt>Rate</dt><dd>{example.annualRatePct}% assumed</dd></div>
        </dl>
      </article>)}
    </div>

    <small className="finance-scenarios-disclaimer">Planning estimates only, not dealer or lender quotations.</small>
  </section>;
}

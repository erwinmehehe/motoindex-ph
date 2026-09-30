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

  return <div className="financing-snapshot finance-scenario-section" data-financing-snapshot={variantScenarios.length ? "variants" : "standard"}>
    <div className="finance-scenario-head">
      <div>
        <span className="finance-kicker">Quick comparison</span>
        <h3>{variantScenarios.length ? `${modelName} monthly estimate by variant` : "How the downpayment changes the monthly estimate"}</h3>
        <p>{variantScenarios.length
          ? "Same 20% downpayment, 36-month term and 12% annual rate so you can see the variant price difference."
          : "Same 36-month term and 12% annual rate. Change the assumptions in the calculator above for your actual quote."}</p>
      </div>
    </div>

    <div className="finance-scenario-strip">
      {variantScenarios.length ? variantScenarios.map(({ option, scenario }) => <article className="finance-scenario-card" key={`${option.label}-${option.price}`} data-financing-variant={option.label}>
        <span>{option.label}</span>
        <strong>{php(Math.round(scenario.monthlyPhp))}<small>/mo</small></strong>
        <p>{php(Math.round(scenario.downPaymentPhp))} cash down · {php(option.price)} SRP</p>
      </article>) : examples.map((example) => <article className={`finance-scenario-card${example.downPaymentPct === 20 ? " is-featured" : ""}`} key={example.downPaymentPct}>
        <span>{example.downPaymentPct}% down</span>
        <strong>{php(Math.round(example.monthlyPhp))}<small>/mo</small></strong>
        <p>{php(Math.round(example.downPaymentPhp))} cash down</p>
      </article>)}
    </div>

    <p className="finance-scenario-note">Planning examples only, not a dealer or lender quotation. Final monthly payment depends on the financed amount, fees, rate method, lender and approved term.</p>
  </div>;
}

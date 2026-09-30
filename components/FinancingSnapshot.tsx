import { defaultFinancingExamples, financingScenario } from "@/lib/financing";
import { php } from "@/lib/utils";
import { SectionHeader, StatRow } from "@/components/ui";

type PriceOption = { label: string; price: number };

export function FinancingSnapshot({ modelName, price, priceOptions = [] }: { modelName: string; price: number; priceOptions?: PriceOption[] }) {
  const variants = priceOptions
    .filter((option) => Number.isFinite(option.price) && option.price > 0)
    .filter((option, index, all) => all.findIndex((item) => item.label === option.label && item.price === option.price) === index);
  const variantScenarios = variants.length > 1
    ? variants.map((option) => ({ option, scenario: financingScenario(option.price, 20, 36, 12) }))
    : [];
  const examples = defaultFinancingExamples(price);

  const items = variantScenarios.length
    ? variantScenarios.map(({ option, scenario }) => ({
        label: <span data-financing-variant={option.label}>{option.label}</span>,
        value: `${php(Math.round(scenario.monthlyPhp))}/mo`,
        note: `${php(Math.round(scenario.downPaymentPhp))} down · ${php(option.price)} SRP`
      }))
    : examples.map((example) => ({
        label: `${example.downPaymentPct}% down`,
        value: `${php(Math.round(example.monthlyPhp))}/mo`,
        note: `${php(Math.round(example.downPaymentPhp))} cash down`
      }));

  return <div className="financing-snapshot finance-scenario-section" data-financing-snapshot={variantScenarios.length ? "variants" : "standard"}>
    <SectionHeader
      kicker="Quick comparison"
      title={variantScenarios.length ? `${modelName} monthly estimate by variant` : "How the downpayment changes the monthly estimate"}
      description={variantScenarios.length
        ? "Same 20% downpayment, 36-month term and 12% annual rate so you can see the variant price difference."
        : "Same 36-month term and 12% annual rate. Change the assumptions in the calculator above for your actual quote."}
    />
    <StatRow className="finance-scenario-row" items={items} />
    <p className="muted-copy">Planning examples only, not a dealer or lender quotation. Final payment depends on the financed amount, fees, rate method, lender and approved term.</p>
  </div>;
}

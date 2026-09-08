import { defaultFinancingExamples } from "@/lib/financing";
import { php } from "@/lib/utils";

export function FinancingSnapshot({ modelName, price }: { modelName: string; price: number }) {
  const examples = defaultFinancingExamples(price);
  return <div className="financing-snapshot">
    <div className="section-head compact"><div><h3>{modelName} down payment and monthly payment examples</h3><p>These examples use the displayed purchase-price basis, a 36-month term and a 12% annual interest assumption. They are planning estimates, not dealer or lender quotations.</p></div></div>
    <div className="entity-price-grid motorcycle-price-grid">
      {examples.map((example)=><article key={example.downPaymentPct}>
        <span>{example.downPaymentPct}% down payment</span>
        <strong>{php(Math.round(example.downPaymentPhp))}</strong>
        <small>About {php(Math.round(example.monthlyPhp))}/month for {example.termMonths} months at {example.annualRatePct}% annual interest.</small>
      </article>)}
    </div>
  </div>;
}

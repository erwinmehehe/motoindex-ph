import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Down Payment Calculator Philippines",
  description: "Calculate motorcycle down payment in the Philippines by cash price and down-payment percentage, then continue to a monthly payment estimate.",
  path: "/tools/motorcycle-down-payment-calculator"
});

function one(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }
function number(value: string | undefined, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export default async function MotorcycleDownPaymentCalculatorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const price = number(one(query.price), 1000, 10000000, 100000);
  const down = number(one(query.down), 0, 95, 20);
  const downPayment = price * down / 100;
  const balance = price - downPayment;

  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Down payment calculator" }]} />
    <div className="page-head">
      <span className="entity-kicker">Purchase planning</span>
      <h1>Motorcycle down payment calculator Philippines</h1>
      <p>Enter a motorcycle cash price and down-payment percentage to see the cash down payment and remaining balance. Use the result as a planning figure, then replace it with the actual dealer or lender quote.</p>
    </div>

    <form className="calculator" method="get">
      <div className="calc-grid">
        <label>Motorcycle cash price <input name="price" type="number" min="1000" max="10000000" step="100" defaultValue={price} /></label>
        <label>Down payment percentage <input name="down" type="number" min="0" max="95" step="1" defaultValue={down} /></label>
      </div>
      <button className="button primary" type="submit">Calculate down payment</button>
      <div className="calc-result"><span>{down}% down payment</span><strong>{php(Math.round(downPayment))}</strong><small>Remaining balance before financing charges: {php(Math.round(balance))}</small></div>
    </form>

    <section className="section split" aria-labelledby="down-payment-examples">
      <div><span className="section-kicker">Quick comparison</span><h2 id="down-payment-examples">10%, 20% and 30% down on {php(price)}</h2><p>A larger cash down payment reduces the amount left to finance. It does not by itself tell you the final monthly payment because the term, rate basis and fees still matter.</p></div>
      <div className="info-card"><h3>Down-payment examples</h3><ul className="checklist"><li>10%: {php(Math.round(price * .10))}</li><li>20%: {php(Math.round(price * .20))}</li><li>30%: {php(Math.round(price * .30))}</li></ul></div>
    </section>

    <section className="section">
      <div className="section-head compact"><div><h2>Continue from down payment to monthly payment</h2><p>Carry this exact cash price and down-payment percentage into the full motorcycle loan calculator.</p></div></div>
      <div className="tool-crosslinks">
        <Link href={{ pathname: "/tools/motorcycle-loan-calculator", query: { price, down, term: 36, rate: 12 } }}><b>Estimate monthly payment</b><small>Adjust term and annual rate for the same purchase price.</small></Link>
        <Link href="/research/motorcycle-financing-index-philippines"><b>Compare financing by motorcycle</b><small>See one standardized scenario across the current MotoIndex catalog.</small></Link>
        <Link href="/ownership/cost-calculator"><b>Estimate full ownership cost</b><small>Add fuel, maintenance, insurance, registration, tires and resale.</small></Link>
      </div>
    </section>

    <div className="source-panel"><h2>What counts as the real down payment?</h2><p>The percentage calculation is straightforward, but an advertised low down payment can exclude insurance, registration, documentation, processing fees or other amounts due at release. Ask for the total cash required before taking the motorcycle home and the total amount payable across the financing term.</p></div>

    <FaqSection title="Motorcycle down-payment questions" items={[
      { question: "How do I calculate a motorcycle down payment?", answer: "Multiply the motorcycle cash price by the down-payment percentage. For example, 20% of ₱100,000 is ₱20,000, leaving ₱80,000 before financing charges and fees." },
      { question: "Is 20% down required for every motorcycle?", answer: "No. Down-payment requirements vary by dealer, lender, motorcycle, promotion and borrower. The calculator lets you test percentages rather than assuming one required amount." },
      { question: "Does the down payment include registration and insurance?", answer: "Not necessarily. Ask the dealer or lender which charges are included and what total cash is due before release." }
    ]} />
  </section>;
}

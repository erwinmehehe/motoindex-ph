import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LoanCalculator } from "@/components/LoanCalculator";
import { FaqSection } from "@/components/FaqSection";
import { pageMetadata } from "@/lib/site";
import { monthlyPayment, php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Loan Calculator Philippines",
  description: "Estimate motorcycle monthly payments in the Philippines by cash price, down payment, loan term and annual interest rate.",
  path: "/tools/motorcycle-loan-calculator"
});

function one(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }
function number(value: string | undefined, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

const examplePrice = 150000;
const exampleDownPct = 20;
const exampleMonths = 36;
const exampleRate = 12;
const exampleMonthly = monthlyPayment(examplePrice, exampleDownPct, exampleMonths, exampleRate);
const exampleDown = examplePrice * exampleDownPct / 100;
const exampleFinanced = examplePrice - exampleDown;
const exampleRepayment = exampleDown + exampleMonthly * exampleMonths;

export default async function MotorcycleLoanCalculatorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const price = number(one(query.price), 1000, 10000000, 100000);
  const down = number(one(query.down), 0, 95, 20);
  const term = number(one(query.term), 1, 84, 36);
  const rate = number(one(query.rate), 0, 60, 12);
  const safeModel = one(query.model)?.slice(0, 80);

  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Loan calculator" }]} />
    <div className="page-head">
      <h1>Motorcycle loan calculator Philippines</h1>
      <p>Estimate a monthly motorcycle payment from the purchase price, down payment, term and annual rate. Every input is editable and saved in the URL so you can return to or share the exact scenario.</p>
    </div>

    <LoanCalculator initialPrice={price} initialDownPct={down} initialMonths={term} initialRate={rate} modelLabel={safeModel} />

    <section className="split section" aria-labelledby="loan-method">
      <div>
        <span className="section-kicker">Method</span>
        <h2 id="loan-method">How the motorcycle loan estimate works</h2>
        <p>The calculator subtracts your down payment from the cash price, then applies the annual rate as a monthly rate across the selected term. The payment formula is a standard amortizing-loan calculation, so the interest portion falls as principal is repaid.</p>
        <p>Dealer motorcycle financing can use a different rate basis, including add-on interest, bundled insurance, processing charges or other fees. If a dealer gives you a monthly figure, compare the total amount payable rather than matching only the advertised monthly payment.</p>
      </div>
      <div className="info-card">
        <h3>Inputs that change the result</h3>
        <ul className="checklist">
          <li>Actual cash price of the exact motorcycle and variant</li>
          <li>Cash down payment, not only the advertised minimum</li>
          <li>Loan term in months</li>
          <li>The lender&apos;s stated rate and how that rate is calculated</li>
          <li>Processing fees, insurance and other charges outside this formula</li>
        </ul>
      </div>
    </section>

    <section className="split section" aria-labelledby="loan-example">
      <div>
        <span className="section-kicker">Worked example</span>
        <h2 id="loan-example">Example: {php(examplePrice)} motorcycle with 20% down</h2>
        <p>For a {php(examplePrice)} cash price, a 20% down payment is {php(exampleDown)}, leaving {php(exampleFinanced)} financed. At a 12% annual amortizing rate over 36 months, the calculator estimates about <strong>{php(exampleMonthly)} per month</strong>.</p>
        <p>The estimated cash outlay across the down payment and 36 calculated payments is about {php(exampleRepayment)}. This is an illustration of the calculator&apos;s formula, not a current dealer or lender offer.</p>
      </div>
      <div className="info-card">
        <h3>Before accepting a quote</h3>
        <ul className="checklist">
          <li>Ask for the cash price and financed principal separately.</li>
          <li>Confirm whether the quoted rate is add-on, effective or another basis.</li>
          <li>Ask for the total amount payable across the full term.</li>
          <li>Identify insurance, documentation and processing fees.</li>
          <li>Compare an early-payoff or pre-termination rule if it matters to you.</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="loan-limitations">
      <div className="section-head compact"><div><h2 id="loan-limitations">Assumptions and limitations</h2><p>The output is for budgeting and comparison. It does not predict approval, dealer promotions, credit assessment, add-on packages, late fees or lender-specific payment rules. Replace every default with the numbers from the quote you are actually considering.</p></div></div>
      <div className="tool-crosslinks">
        <Link href="/tools/motorcycle-down-payment-calculator"><b>Down payment calculator</b><small>Calculate cash down and remaining balance before choosing a term.</small></Link>\n        <Link href="/ownership/cost-calculator"><b>Full ownership cost</b><small>Add fuel, maintenance, insurance, registration, tires and resale.</small></Link>
        <Link href="/tools/lto-registration-fee-calculator"><b>LTO registration budget</b><small>Add registration-related costs to your purchase plan.</small></Link>
        <Link href="/tools/motorcycle-insurance-calculator"><b>Insurance budget</b><small>Estimate CTPL and comprehensive planning costs separately.</small></Link>
      </div>
    </section>

    <section className="section" aria-labelledby="loan-related-models">
      <div className="section-head compact"><div><h2 id="loan-related-models">Related motorcycles to price</h2><p>Open the motorcycle&apos;s main research page first, verify the exact variant and current price, then return to the calculator with that figure.</p></div></div>
      <div className="guide-strip">
        <Link href="/motorcycles/yamaha/aerox-v3"><strong>Yamaha Aerox V3</strong><small>Compare Standard and SP pricing before financing.</small></Link>
        <Link href="/motorcycles/honda/adv-160"><strong>Honda ADV160</strong><small>Check ABS and RoadSync variant differences.</small></Link>
        <Link href="/motorcycles/kawasaki/ninja-500"><strong>Kawasaki Ninja 500</strong><small>Budget sport-bike insurance and ownership costs with the purchase price.</small></Link>
      </div>
    </section>

    <div className="source-panel">
      <h2>How to use the estimate</h2>
      <p>Use the calculator for side-by-side planning, then ask the lender for the cash price, down payment, financed principal, effective interest or add-on rate, loan term, processing fees, insurance and total amount payable. A lower advertised monthly amount can still cost more overall if the term or fees are higher.</p>
    </div>

    <FaqSection title="Motorcycle financing questions" items={[
      { question: "What numbers should I copy from a dealer loan quote?", answer: "Use the actual cash price, down payment, financed principal, annual rate or equivalent rate basis, term and all required fees. Compare total amount payable as well as the monthly payment." },
      { question: "Does a lower monthly payment mean a cheaper motorcycle loan?", answer: "Not necessarily. A longer term can reduce the monthly payment while increasing the total amount paid. Compare the full repayment amount and fees." },
      { question: "Is this calculator a lender approval or quotation?", answer: "No. It is an estimate for planning and comparison. Approval, rates, fees and final payment schedules come from the lender or dealer." }
    ]} />
  </section>;
}

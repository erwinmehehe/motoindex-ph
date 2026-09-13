import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OwnershipCostCalculator } from "@/components/OwnershipCostCalculator";
import { forClient } from "@/lib/competitors";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Total Cost of Ownership Calculator Philippines",
  description: "Estimate 1-year and 3-year motorcycle purchase, financing, fuel, maintenance, insurance, registration, tire and resale costs.",
  path: "/ownership/cost-calculator",
  index: true
});

export default async function CostCalculatorPage({ searchParams }: { searchParams: Promise<{ bike?: string }> }) {
  const { bike } = await searchParams;
  const model = publicMotorcycles.find((item) => item.id === bike) ?? publicMotorcycles[0];
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Ownership", href: "/ownership" }, { label: "Cost calculator" }]} />
    <div className="page-head">
      <span className="section-kicker">Ownership calculator</span>
      <h1>Estimate what a motorcycle really costs over three years</h1>
      <p>Start with a current model, then replace purchase, finance, fuel, maintenance, insurance, registration and tire assumptions with your own numbers.</p>
    </div>

    {model && <OwnershipCostCalculator model={forClient(model)} />}

    <section className="split section" aria-labelledby="ownership-calculation-method">
      <div>
        <h2 id="ownership-calculation-method">How the ownership estimate works</h2>
        <p>The calculator combines the costs that can sit outside a motorcycle&apos;s advertised price: purchase or finance cost, fuel, scheduled maintenance reserve, insurance, registration, tires and an estimated resale value.</p>
        <p>The useful number is not a generic national average. It is the total after you replace the editable assumptions with the quote, riding distance and maintenance expectations that apply to the motorcycle you are actually considering.</p>
      </div>
      <div className="info-card">
        <h3>Replace these before deciding</h3>
        <ul className="checklist">
          <li>Dealer cash price or your exact financed amount</li>
          <li>Interest rate, term and down payment from the real offer</li>
          <li>Your expected fuel use and local pump price</li>
          <li>Insurance and registration costs that apply to you</li>
          <li>Tire, service and resale assumptions for the exact model</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="ownership-comparison-use">
      <div className="section-head compact"><div><h2 id="ownership-comparison-use">Use total cost to compare motorcycles, not just monthly payment</h2><p>A cheaper installment can still produce a higher ownership total if financing, fuel, tires, service or resale differ. Run the same realistic assumptions across every bike on your shortlist.</p></div></div>
      <div className="guide-strip">
        <Link href="/motorcycles"><strong>Choose a motorcycle</strong><small>Start from current Philippine price and specification records.</small></Link>
        <Link href="/compare"><strong>Compare shortlisted models</strong><small>Check price, dimensions and specifications side by side.</small></Link>
        <Link href="/commute/cost-calculator"><strong>Estimate commute cost</strong><small>Separate day-to-day work travel from full ownership cost.</small></Link>
        <Link href="/dealers"><strong>Check dealer options</strong><small>Use a current quote before replacing calculator assumptions.</small></Link>
      </div>
    </section>

    <div className="note-box">
      <h2>Before you use the estimate</h2>
      <p>This is an estimate, not a dealer quote, insurance quote or official government-fee calculator. Finance APR, resale, maintenance and operating assumptions are editable and should be replaced with your real figures.</p>
    </div>
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "Motorcycle Calculators Philippines", description: "Free Philippine motorcycle calculators for loan payments, LTO registration budgeting, insurance and ownership costs.", path: "/tools" });

export default function ToolsPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Tools"}]}/>
    <div className="page-head"><span className="entity-kicker">Plan before you buy</span><h1>Motorcycle tools for the Philippines</h1><p>Start with the decision you are making now. Use the deeper calculators only when the basic shortlist is already clear.</p></div>

    <div className="section-head compact"><div><span className="section-kicker">Most useful first</span><h2>Purchase and ownership calculators</h2><p>These four tools cover the decisions most riders need before paying for a motorcycle.</p></div></div>
    <div className="commute-tool-grid">
      <Link href="/ownership/cost-calculator"><span>Ownership</span><h3>Total cost to own</h3><p>Combine purchase, financing, fuel, maintenance, registration, insurance, tires and resale.</p></Link>
      <Link href="/tools/motorcycle-loan-calculator"><span>Financing</span><h3>Motorcycle loan calculator</h3><p>Estimate monthly payment, financed amount, interest and total cash paid.</p></Link>
      <Link href="/tools/lto-registration-fee-calculator"><span>Registration</span><h3>LTO registration fee calculator</h3><p>Plan MVUC, inspection, CTPL and transaction-specific charges.</p></Link>
      <Link href="/tools/motorcycle-insurance-calculator"><span>Insurance</span><h3>Motorcycle insurance calculator</h3><p>Build an editable planning estimate before replacing it with a real insurer quote.</p></Link>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">Use-specific planning</span><h2>Daily riding and electric tools</h2><p>Use these when commute distance, monthly affordability or electric range is part of the decision.</p></div></div>
    <div className="commute-tool-grid">
      <Link href="/commute/cost-calculator"><span>Daily use</span><h3>Commute cost calculator</h3><p>Estimate fuel, maintenance reserve and parking for your own route and workdays.</p></Link>
      <Link href="/commute/affordability"><span>Budget</span><h3>Motorcycle affordability</h3><p>Turn a realistic monthly budget into a purchase-price ceiling and a shorter candidate list.</p></Link>
      <Link href="/tools/electric-motorcycle-charging-cost"><span>Electric</span><h3>Charging-cost calculator</h3><p>Estimate a full charge, cost per 100 km and monthly electricity use.</p></Link>
      <Link href="/tools/electric-motorcycle-range-calculator"><span>Electric</span><h3>Electric range calculator</h3><p>Adjust published range for battery setup, daily distance and a conservative planning factor.</p></Link>
    </div>
  </section>;
}

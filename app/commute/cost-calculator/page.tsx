import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CommuteCostCalculator } from "@/components/CommuteCostCalculator";
import { forClient } from "@/lib/competitors";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Commute Cost Calculator Philippines",
  description: "Estimate monthly motorcycle fuel, maintenance reserve, parking and cost per workday for commuting in the Philippines.",
  path: "/commute/cost-calculator",
  index: true
});

export default async function Page({ searchParams }: { searchParams: Promise<{ bike?: string }> }) {
  const { bike } = await searchParams;
  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Commuting", href: "/commute" }, { label: "Cost calculator" }]} />
    <div className="page-head">
      <span className="section-kicker">Commute calculator</span>
      <h1>What will your daily motorcycle commute cost?</h1>
      <p>Use your real round-trip distance, workdays, gasoline price and parking. The model-specific fuel-economy basis is source-listed where available and otherwise clearly treated as an estimate.</p>
    </div>

    <CommuteCostCalculator models={forClient(publicMotorcycles)} initialId={bike} />

    <section className="split section" aria-labelledby="commute-cost-method">
      <div>
        <h2 id="commute-cost-method">What the commute estimate includes</h2>
        <p>The calculator turns your round-trip distance and work schedule into a monthly riding distance, then combines fuel use with the maintenance reserve and parking assumptions you enter.</p>
        <p>Use it to compare the same commute across different motorcycles. Keep distance, workdays and parking constant, then change the motorcycle and fuel-economy basis so the result reflects the decision you are actually making.</p>
      </div>
      <div className="info-card">
        <h3>Use your own inputs</h3>
        <ul className="checklist">
          <li>Your actual home-to-work round trip</li>
          <li>The number of days you normally commute each month</li>
          <li>A current pump price from the area where you buy fuel</li>
          <li>Your real parking cost, including days when parking is free</li>
          <li>A maintenance reserve that matches the motorcycle and your mileage</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="commute-next-step">
      <div className="section-head compact"><div><h2 id="commute-next-step">Turn the commute number into a buying decision</h2><p>Daily running cost is only one part of the decision. Check the motorcycle&apos;s current price, fit, full ownership cost and alternatives before treating a fuel-saving result as the final answer.</p></div></div>
      <div className="guide-strip">
        <Link href="/commute"><strong>Commuter motorcycle research</strong><small>Compare bikes and practical factors for everyday Philippine riding.</small></Link>
        <Link href="/motorcycles"><strong>Check current models</strong><small>Review price, dimensions, tank capacity and specifications.</small></Link>
        <Link href="/ownership/cost-calculator"><strong>Calculate full ownership cost</strong><small>Add financing, insurance, registration, tires and resale.</small></Link>
        <Link href="/recommendations#commuting"><strong>See commuting recommendations</strong><small>Continue into the consolidated buyer guide instead of another thin page.</small></Link>
      </div>
    </section>

    <div className="source-panel">
      <h2>Fuel-price source</h2>
      <p>Use the Department of Energy&apos;s current regional or pump-price monitors to replace the default gasoline assumption with a number that matches where you actually buy fuel.</p>
      <a className="text-link" href="https://new.doe.gov.ph/prices" target="_blank" rel="noreferrer">Open DOE Energy Prices →</a>
    </div>
  </section>;
}

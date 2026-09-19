import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ElectricRangeCalculator } from "@/components/ElectricRangeCalculator";
import { FaqSection } from "@/components/FaqSection";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Electric Motorcycle Range Calculator Philippines",
  description: "Estimate practical electric motorcycle range from Philippine model claims, battery setup, your daily distance and a conservative planning factor.",
  path: "/tools/electric-motorcycle-range-calculator"
});

const exampleModel = electricMotorcycles.find((model) => model.slug === "vinfast-evo") ?? electricMotorcycles[0];
const exampleFactor = 80;
const exampleDailyKm = 30;
const exampleClaim = exampleModel?.rangeOneKm ?? 85;
const examplePlanningRange = Math.round(exampleClaim * exampleFactor / 100);
const exampleDailyShare = Math.round(exampleDailyKm / examplePlanningRange * 100);

export default function Page() {
  return <section className="page shell" data-calculator-page>
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Electric range calculator" }]} />
    <div className="page-head">
      <span className="entity-kicker">Electric motorcycle tool</span>
      <h1>Electric motorcycle range calculator</h1>
      <p>Start from the published one-battery or two-battery range, then reduce it to a planning figure that fits your riding conditions.</p>
    </div>

    <ElectricRangeCalculator />

    <section className="split section" aria-labelledby="ev-range-method">
      <div>
        <span className="section-kicker">Method</span>
        <h2 id="ev-range-method">How the planning range is calculated</h2>
        <p>The tool starts with the selected motorcycle&apos;s published range for one or two batteries. It then multiplies that claim by the planning factor you choose, such as 80%, to create a more conservative distance for trip planning.</p>
        <p>Your daily riding distance is compared with that adjusted range to show how much of the planned battery range a normal day would use. This does not replace a real-world range test.</p>
      </div>
      <div className="info-card">
        <h3>Choose a lower planning factor when</h3>
        <ul className="checklist">
          <li>Your route includes faster roads or sustained high speed.</li>
          <li>You regularly carry a passenger or heavy load.</li>
          <li>Your route has long climbs or demanding stop-start traffic.</li>
          <li>You want a larger reserve before reaching low battery.</li>
          <li>The battery is older or conditions are different from the published test.</li>
        </ul>
      </div>
    </section>

    <section className="split section" aria-labelledby="ev-range-example">
      <div>
        <span className="section-kicker">Worked example</span>
        <h2 id="ev-range-example">Example: {exampleModel ? `${exampleModel.make} ${exampleModel.model}` : "85 km published range"}</h2>
        <p>With a published one-battery range of {exampleClaim} km, an 80% planning factor gives about <strong>{examplePlanningRange} km</strong>. A 30 km riding day would use roughly {exampleDailyShare}% of that conservative planning range.</p>
        <p>This is intentionally more cautious than treating the published claim as guaranteed. Riders should preserve enough reserve for route changes, traffic and changing battery conditions.</p>
      </div>
      <div className="info-card">
        <h3>Range is sensitive to</h3>
        <ul className="checklist">
          <li>Speed and acceleration</li>
          <li>Traffic and route elevation</li>
          <li>Passenger and cargo weight</li>
          <li>Tire pressure and mechanical condition</li>
          <li>Battery temperature, age and state of health</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="ev-range-limitations">
      <div className="section-head compact"><div><h2 id="ev-range-limitations">Assumptions and limitations</h2><p>The planning factor is a user-selected safety margin, not a measured efficiency correction. The calculator does not model weather, gradients, speed profile or battery degradation directly. Use the same factor when comparing motorcycles, then adjust it after you have route-specific riding data.</p></div></div>
      <div className="tool-crosslinks">
        <Link href="/tools/electric-motorcycle-charging-cost"><b>Charging-cost calculator</b><small>Turn battery capacity and electricity rate into running-cost estimates.</small></Link>
        <Link href="/motorcycles/electric/range-comparison"><b>Published range comparison</b><small>Compare one-battery and two-battery records side by side.</small></Link>
        <Link href="/motorcycles/electric"><b>Electric motorcycle guide</b><small>Review prices, LTO references and verified model records.</small></Link>
      </div>
    </section>

    <section className="section" aria-labelledby="ev-range-related-models">
      <div className="section-head compact"><div><h2 id="ev-range-related-models">Related electric motorcycles</h2><p>Open each canonical model record to confirm the battery setup and source-check date before relying on the published claim.</p></div></div>
      <div className="guide-strip">
        {electricMotorcycles.slice(0, 3).map((model) => <Link href={`/motorcycles/electric/${model.slug}`} key={model.slug}><strong>{model.make} {model.model}</strong><small>{model.rangeOneKm} km one battery · {model.rangeTwoKm} km two batteries · from {php(model.priceFromPhp)}</small></Link>)}
      </div>
    </section>

    <div className="note-box">
      <h2>Use range and charging cost together</h2>
      <p>A range estimate tells you how often you may need to charge. The charging-cost calculator estimates what that charging can cost at your electricity rate.</p>
      <div className="hero-actions"><Link className="button small" href="/tools/electric-motorcycle-charging-cost">Charging-cost calculator</Link><Link className="button ghost small" href="/motorcycles/electric/range-comparison">Compare published ranges</Link></div>
    </div>

    <FaqSection title="Electric motorcycle range questions" items={[
      { question: "Why should I use less than 100% of the published range for planning?", answer: "Published range is a useful comparison point, but real riding can include higher speed, hills, traffic, passenger weight and other conditions that reduce distance. A planning factor adds reserve instead of assuming the full claim will always be available." },
      { question: "Does adding a second battery always double the range?", answer: "No. Use the model-specific published one-battery and two-battery figures. The relationship can differ by motorcycle, power mode and manufacturer test conditions." },
      { question: "Is the calculated planning range guaranteed?", answer: "No. It is a conservative planning estimate based on the published claim and the factor you select. Actual range still depends on the motorcycle, battery condition and how and where you ride." }
    ]} />
  </section>;
}

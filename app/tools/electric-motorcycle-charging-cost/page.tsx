import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ElectricChargingCalculator } from "@/components/ElectricChargingCalculator";
import { FaqSection } from "@/components/FaqSection";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Electric Motorcycle Charging Cost Calculator",
  description: "Estimate electric motorcycle charging cost in the Philippines from battery capacity, electricity rate, claimed range and daily distance.",
  path: "/tools/electric-motorcycle-charging-cost"
});

const exampleModel = electricMotorcycles.find((model) => model.slug === "vinfast-feliz-ii") ?? electricMotorcycles[0];
const exampleElectricityRate = 12;
const exampleDailyKm = 30;
const exampleCapacity = exampleModel?.twoBatteryKwh ?? 3;
const exampleRange = exampleModel?.rangeTwoKm ?? 145;
const exampleCharge = exampleCapacity * exampleElectricityRate;
const examplePer100 = exampleCharge / exampleRange * 100;
const exampleMonthly = exampleDailyKm * 30 / exampleRange * exampleCharge;

export default function ElectricChargingCostPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Tools", href: "/tools" }, { label: "Electric charging cost" }]} />
    <div className="page-head">
      <span className="entity-kicker">Editable electricity estimate</span>
      <h1>Electric motorcycle charging-cost calculator</h1>
      <p>Enter the usable battery capacity, your electricity rate and expected range to estimate the cost of a full charge, 100 km and one month of riding.</p>
    </div>

    <ElectricChargingCalculator />

    <section className="split section" aria-labelledby="charging-method">
      <div>
        <span className="section-kicker">Method</span>
        <h2 id="charging-method">How electric motorcycle charging cost is calculated</h2>
        <p>A simple full-charge estimate multiplies battery capacity in kilowatt-hours by your electricity rate per kilowatt-hour. Cost per 100 km then divides that charge cost by the range you enter and scales it to 100 km.</p>
        <p>The monthly estimate uses your daily distance across 30 days. It is a planning comparison, not a utility-bill prediction, because wall-to-battery charging losses and real-world range can move the result.</p>
      </div>
      <div className="info-card">
        <h3>Use your real inputs</h3>
        <ul className="checklist">
          <li>Battery capacity for the setup you actually charge</li>
          <li>Your current residential or charging-location electricity rate</li>
          <li>A range figure appropriate to one or two batteries</li>
          <li>Your normal daily riding distance</li>
          <li>Any subscription, swapping or parking cost added separately</li>
        </ul>
      </div>
    </section>

    <section className="split section" aria-labelledby="charging-example">
      <div>
        <span className="section-kicker">Worked example</span>
        <h2 id="charging-example">Example: {exampleModel ? `${exampleModel.make} ${exampleModel.model}` : "3 kWh electric motorcycle"}</h2>
        <p>Using {exampleCapacity} kWh of listed two-battery capacity, an example electricity rate of ₱{exampleElectricityRate}/kWh gives about <strong>₱{exampleCharge.toFixed(2)} for a full charge</strong>. With a published {exampleRange} km two-battery range, that is about ₱{examplePer100.toFixed(2)} per 100 km before charging losses.</p>
        <p>At {exampleDailyKm} km per day for 30 days, the same inputs produce about <strong>₱{exampleMonthly.toFixed(2)}</strong> in modeled electricity use. The ₱{exampleElectricityRate}/kWh rate is only an example. Replace it with the rate that applies where you charge.</p>
      </div>
      <div className="info-card">
        <h3>What can move the real cost</h3>
        <ul className="checklist">
          <li>Charging efficiency and energy lost as heat</li>
          <li>Speed, traffic, hills, load and tire pressure</li>
          <li>Battery age, temperature and usable capacity</li>
          <li>Electricity tariff changes</li>
          <li>Battery rental, swapping or subscription fees if applicable</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="charging-limitations">
      <div className="section-head compact"><div><h2 id="charging-limitations">Assumptions and limitations</h2><p>The calculator treats the battery-capacity figure as the energy basis for a charge and does not add a fixed charging-loss percentage. It also uses the range you enter rather than claiming a guaranteed real-world distance. Use it to compare scenarios consistently, then validate the actual electricity consumption after you own or test the motorcycle.</p></div></div>
      <div className="tool-crosslinks">
        <Link href="/tools/electric-motorcycle-range-calculator"><b>EV range calculator</b><small>Apply a conservative planning factor to published range.</small></Link>
        <Link href="/motorcycles/electric/range-comparison"><b>Electric range comparison</b><small>Compare battery capacity and published model ranges.</small></Link>
        <Link href="/motorcycles/electric"><b>Electric motorcycles</b><small>Review verified Philippine electric motorcycle records.</small></Link>
      </div>
    </section>

    <section className="section" aria-labelledby="charging-related-models">
      <div className="section-head compact"><div><h2 id="charging-related-models">Related electric motorcycles</h2><p>Use each model&apos;s checked battery configuration and range as the starting point, then replace the electricity rate with your own.</p></div></div>
      <div className="guide-strip">
        {electricMotorcycles.slice(0, 3).map((model) => <Link href={`/motorcycles/electric/${model.slug}`} key={model.slug}><strong>{model.make} {model.model}</strong><small>{model.twoBatteryKwh} kWh two-battery capacity · up to {model.rangeTwoKm} km published range · from {php(model.priceFromPhp)}</small></Link>)}
      </div>
    </section>

    <div className="source-panel">
      <h2>Use the battery setup you will actually ride</h2>
      <p>A motorcycle with two 1.5 kWh batteries has 3 kWh of listed capacity. Use 1.5 kWh when riding with one battery and 3 kWh when charging both. The estimate does not include charging losses or a battery-subscription fee.</p>
      {exampleModel && <a href={exampleModel.sourceUrl} target="_blank" rel="noreferrer">Open {exampleModel.make} {exampleModel.model} manufacturer source ↗</a>}
    </div>

    <FaqSection title="Electric motorcycle charging questions" items={[
      { question: "How do I calculate the cost of charging an electric motorcycle?", answer: "Multiply battery capacity in kWh by the electricity rate per kWh. Actual wall consumption can be higher because charging is not perfectly efficient." },
      { question: "Does the calculator include battery subscription fees?", answer: "No. It estimates electricity only. Add any battery subscription, swapping, parking or service fees separately." },
      { question: "Why is actual range lower than the published figure?", answer: "Range changes with speed, traffic, hills, rider and cargo weight, tire pressure, temperature and battery condition." }
    ]} />
  </section>;
}

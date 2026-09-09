import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Electric Motorcycles Philippines: Prices & Range",
  description: "Compare verified electric motorcycles in the Philippines by price, battery capacity, claimed range, charging time, speed and LTO classification.",
  path: "/motorcycles/electric"
});

export default function ElectricMotorcyclesPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Electric motorcycles"}]}/>
    <div className="page-head">
      <span className="entity-kicker">Philippine electric motorcycles</span>
      <h1>Electric motorcycles in the Philippines</h1>
      <p>Compare locally launched electric motorcycles with published prices, battery configurations, claimed range, charging time and LTO registration classification.</p>
    </div>

    <div className="seller-stats">
      <div><strong>{electricMotorcycles.length}</strong><span>Verified local models</span></div>
      <div><strong>{php(Math.min(...electricMotorcycles.map(m=>m.priceFromPhp)))}</strong><span>Lowest starting price</span></div>
      <div><strong>145–150 km</strong><span>Claimed two-battery range</span></div>
      <div><strong>L3</strong><span>LTO motorcycle category</span></div>
    </div>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Compare electric motorcycle models</h2><p>Prices shown are starting prices. Battery ownership and subscription choices can change the amount paid.</p></div></div>
      <div className="catalog-grid">
        {electricMotorcycles.map(model=><Link className="catalog-card" href={`/motorcycles/electric/${model.slug}`} key={model.slug}>
          <div className="catalog-media"><img src={model.imageUrl} alt={`${model.make} ${model.model} electric motorcycle`} loading="lazy"/></div>
          <span className="catalog-status">LTO L3</span>
          <h3>{model.make} {model.model}</h3>
          <strong>{php(model.priceFromPhp)}</strong>
          <p>{model.rangeTwoKm} km claimed range with two batteries · {model.topSpeedKph} km/h maximum speed</p>
          <small>{model.twoBatteryKwh} kWh · {model.chargeTwoHours} hour full-charge specification</small>
        </Link>)}
      </div>
    </section>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><h2>Electric motorcycle guides and tools</h2></div></div>
      <div className="commute-tool-grid">
        <Link href="/guides/electric-scooters-philippines"><span>Buying guide</span><h3>Electric scooters Philippines</h3><p>Compare the verified local models and their battery choices.</p></Link>
        <Link href="/guides/e-bike-vs-motorcycle"><span>Classification</span><h3>E-bike versus motorcycle</h3><p>Understand why speed and vehicle category affect registration.</p></Link>
        <Link href="/guides/electric-motorcycle-registration-philippines"><span>LTO</span><h3>Registration requirements</h3><p>Check how L3 electric motorcycles differ from lighter electric vehicles.</p></Link>
        <Link href="/tools/electric-motorcycle-charging-cost"><span>Calculator</span><h3>Charging cost calculator</h3><p>Estimate charging cost from battery capacity and electricity rate.</p></Link>
        <Link href="/motorcycles/electric/range-comparison"><span>Comparison</span><h3>Electric motorcycle range</h3><p>Compare one-battery and two-battery manufacturer claims.</p></Link>
      </div>
    </section>

    <FaqSection title="Electric motorcycle questions" items={[
      {question:"Do electric motorcycles need LTO registration in the Philippines?",answer:"The VinFast Evo, Feliz II and Viper are classified by LTO as L3 motorcycles without sidecars and follow the normal motorcycle registration process. Registration rules differ for lighter electric vehicle categories."},
      {question:"How much does an electric motorcycle cost in the Philippines?",answer:`The verified models compared here start at ${php(Math.min(...electricMotorcycles.map(m=>m.priceFromPhp)))}. Battery subscription, one-battery and two-battery purchase options can result in different final prices.`},
      {question:"How far can an electric motorcycle travel on one charge?",answer:"The current VinFast Philippine pages claim 82–85 km with one 1.5 kWh battery and 145–150 km with two batteries. Actual range changes with speed, load, traffic, terrain and battery condition."}
    ]}/>
  </section>;
}

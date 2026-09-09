import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { electricMotorcycles, php } from "@/lib/electricMotorcycles";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Electric Motorcycles Philippines: One Buying Guide",
  description: "One Philippine electric motorcycle guide covering prices, battery plans, claimed range, charging, LTO registration, e-bike classification and electric vs gas ownership.",
  path: "/motorcycles/electric"
});

export default function ElectricMotorcyclesPage() {
  const byPrice=[...electricMotorcycles].sort((a,b)=>a.priceFromPhp-b.priceFromPhp);
  const byRange=[...electricMotorcycles].sort((a,b)=>b.rangeTwoKm-a.rangeTwoKm);
  const bySpeed=[...electricMotorcycles].sort((a,b)=>b.topSpeedKph-a.topSpeedKph);
  const checkedDates=electricMotorcycles.map(m=>m.checkedAt);

  const schema=articleSchema({
    headline:"Electric motorcycle buying guide for the Philippines",
    description:"One guide to Philippine electric motorcycles covering models, prices, battery options, claimed range, charging, registration, classification and ownership trade-offs.",
    path:"/motorcycles/electric",
    about:"electric motorcycles Philippines",
    keywords:["electric motorcycle Philippines","electric scooter Philippines","electric motorcycle price Philippines","electric motorcycle registration Philippines","e-bike vs motorcycle Philippines"],
    checkedDates
  });

  return <section className="page shell electric-master-page">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:"Electric motorcycles"}]}/>
    <div className="page-head">
      <span className="entity-kicker">Electric motorcycle buying guide</span>
      <h1>Electric motorcycles in the Philippines: prices, range, charging and registration</h1>
      <p>Use one page for current Philippine electric motorcycle models, battery options, claimed range, charging time, LTO classification and the practical differences between electric and gasoline ownership.</p>
      <div className="hero-actions">
        <a className="button" href="#models">Compare electric models</a>
        <Link className="button secondary" href="/tools/electric-motorcycle-charging-cost">Calculate charging cost</Link>
      </div>
    </div>

    <div className="seller-stats">
      <div><strong>{electricMotorcycles.length}</strong><span>Current verified models</span></div>
      <div><strong>{php(Math.min(...electricMotorcycles.map(m=>m.priceFromPhp)))}</strong><span>Lowest starting price</span></div>
      <div><strong>{byRange[0].rangeTwoKm} km</strong><span>Longest two-battery claim</span></div>
      <div><strong>L3</strong><span>LTO motorcycle category</span></div>
    </div>

    <nav className="product-entity-nav" aria-label="Electric motorcycle guide sections">
      <a href="#models">Models</a>
      <a href="#battery-price">Battery & price</a>
      <a href="#range">Range</a>
      <a href="#classification">E-bike vs motorcycle</a>
      <a href="#registration">Registration</a>
      <a href="#electric-vs-gas">Electric vs gas</a>
      <a href="#tools">Tools</a>
      <a href="#faq">FAQ</a>
    </nav>

    <section id="models" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Current models</span><h2>Electric motorcycles to compare in the Philippines</h2><p>These are models with Philippine price, battery, range, charging and LTO-classification evidence in the current MotoIndex data.</p></div></div>
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

    <section id="battery-price" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Battery and purchase price</span><h2>Subscription price versus battery ownership</h2><p>The lowest advertised motorcycle price can use a battery-subscription arrangement. Buying one or two batteries changes the upfront cost and the ownership structure.</p></div></div>
      <div className="guide-table-wrap">
        <table className="guide-comparison-table">
          <thead><tr><th>Model</th><th>Starting price</th><th>One battery</th><th>Two batteries</th><th>Battery type</th></tr></thead>
          <tbody>{electricMotorcycles.map(m=><tr key={m.slug}><th><Link href={`/motorcycles/electric/${m.slug}`}>{m.make} {m.model}</Link></th><td>{php(m.priceFromPhp)}</td><td>{m.oneBatteryPricePhp?php(m.oneBatteryPricePhp):"Check seller"}</td><td>{m.twoBatteryPricePhp?php(m.twoBatteryPricePhp):"Check seller"}</td><td>{m.batteryType}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="note-box"><h3>Do not compare only the headline price</h3><p>Read the written battery-subscription or battery-purchase terms, warranty, charging arrangement and recurring cost before deciding which price is actually cheaper for your use.</p></div>
    </section>

    <section id="range" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Battery and range</span><h2>Electric motorcycle range comparison</h2><p>Compare one-battery claims with one-battery claims and two-battery claims with two-battery claims. These are manufacturer claims, not guaranteed commuting distances.</p></div></div>
      <div className="comparison-table-wrap" role="region" aria-label="Electric motorcycle range comparison" tabIndex={0}>
        <table className="comparison-table"><thead><tr><th>Model</th><th>One battery</th><th>Two batteries</th><th>One-battery range</th><th>Two-battery range</th><th>Charge time</th><th>Maximum speed</th></tr></thead>
        <tbody>{electricMotorcycles.map(model=><tr key={model.slug}><th><Link href={`/motorcycles/electric/${model.slug}`}>{model.make} {model.model}</Link></th><td>{model.batteryKwh} kWh</td><td>{model.twoBatteryKwh} kWh</td><td>{model.rangeOneKm} km</td><td>{model.rangeTwoKm} km</td><td>{model.chargeOneHours}/{model.chargeTwoHours} hours</td><td>{model.topSpeedKph} km/h</td></tr>)}</tbody></table>
      </div>
      <div className="topic-grid">
        <article><h3>Longest current claim</h3><p>{byRange[0].make} {byRange[0].model} has the longest two-battery manufacturer claim in the current set at {byRange[0].rangeTwoKm} km.</p></article>
        <article><h3>Highest listed speed</h3><p>{bySpeed[0].make} {bySpeed[0].model} reaches the highest listed maximum speed in the current set at {bySpeed[0].topSpeedKph} km/h.</p></article>
        <article><h3>Plan with reserve</h3><p>Traffic, speed, rider and cargo weight, hills, tire pressure, temperature and battery condition can reduce real-world range.</p></article>
      </div>
    </section>

    <section id="classification" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Vehicle classification</span><h2>E-bike versus electric motorcycle in the Philippines</h2><p>The seller's product label does not determine the legal category. Vehicle design and performance affect registration, licensing and road-use requirements.</p></div></div>
      <div className="comparison-table-wrap"><table className="comparison-table"><thead><tr><th>Question</th><th>Light electric vehicle</th><th>L3 electric motorcycle</th></tr></thead><tbody>
        <tr><th>Typical role</th><td>Lower-speed personal mobility</td><td>Road-going motorcycle</td></tr>
        <tr><th>Speed category</th><td>Depends on the exact LTO subclass</td><td>Capable of more than 50 km/h</td></tr>
        <tr><th>Registration</th><td>Depends on the exact category and current rules</td><td>Registered as a motorcycle</td></tr>
        <tr><th>Driver requirement</th><td>Depends on category and operating rules</td><td>Applicable motorcycle driving licence</td></tr>
        <tr><th>Current examples here</th><td>Confirm the exact model classification</td><td>VinFast Evo, Feliz II and Viper</td></tr>
      </tbody></table></div>
      <div className="source-panel"><h3>Check the exact LTO classification before paying</h3><p>A vehicle advertised broadly as an “e-bike” can still fall into a regulated motorcycle category.</p><a href="https://lto.gov.ph/wp-content/uploads/2023/09/AO_2021-039.pdf" target="_blank" rel="nofollow noopener noreferrer">Read LTO Administrative Order 2021-039 ↗</a></div>
    </section>

    <section id="registration" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">LTO registration</span><h2>Do electric motorcycles need registration?</h2><p>The current VinFast Evo, Feliz II and Viper records are classified by LTO as L3 motorcycles without sidecars and follow motorcycle registration requirements.</p></div></div>
      <div className="topic-grid">
        <article><h3>Ask for the exact model documents</h3><p>Request the written sales invoice, exact model and battery configuration, model-classification documents and registration-processing details.</p></article>
        <article><h3>Check the battery arrangement</h3><p>Make sure the sales and registration documents match whether the motorcycle is sold with battery subscription, one battery or two batteries.</p></article>
        <article><h3>Confirm current fees and process</h3><p>Registration fees and procedures can change. Use the current LTO assessment rather than relying on an old fixed amount.</p></article>
      </div>
      <div className="source-ladder">{electricMotorcycles.map(m=><article key={m.slug}><span>{m.make} {m.model}</span><h3>LTO model-classification source</h3><div><a href={m.ltoSourceUrl} target="_blank" rel="nofollow noopener noreferrer">Open LTO circular ↗</a><small>Checked {m.checkedAt}</small></div></article>)}</div>
    </section>

    <section id="electric-vs-gas" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Ownership choice</span><h2>Electric motorcycle versus gas motorcycle</h2><p>The better choice depends on your daily distance, charging access, purchase price, route flexibility and how often you make longer trips.</p></div></div>
      <div className="guide-topic-grid">
        <article><h3>Energy cost</h3><p>Electric motorcycles replace gasoline with electricity. Compare your actual electricity rate with a gas motorcycle's km/L and local fuel price rather than assuming one is always cheaper.</p></article>
        <article><h3>Range and refueling</h3><p>Gas motorcycles can usually refuel quickly. Electric ownership works best when your daily route sits comfortably inside practical range and charging is dependable.</p></article>
        <article><h3>Maintenance</h3><p>Electric drivetrains remove engine-oil changes and some combustion-engine service items, but tires, brakes, suspension, bearings and battery-related checks remain.</p></article>
        <article><h3>Long trips</h3><p>For provincial or longer rides, map realistic charging options and keep a reserve instead of planning around the full advertised range.</p></article>
      </div>
    </section>

    <section id="tools" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Use your numbers</span><h2>Electric motorcycle calculators</h2><p>Tools stay separate because they perform a real task rather than repeating another editorial page.</p></div></div>
      <div className="commute-tool-grid">
        <Link href="/tools/electric-motorcycle-charging-cost"><span>Calculator</span><h3>Charging cost</h3><p>Estimate full-charge cost, cost per 100 km and monthly electricity use from your own rate.</p></Link>
        <Link href="/tools/electric-motorcycle-range-calculator"><span>Calculator</span><h3>Usable range planning</h3><p>Apply a conservative reserve to the published one-battery or two-battery range claim.</p></Link>
      </div>
    </section>

    <JsonLd data={schema}/>
    <div id="faq"><FaqSection title="Electric motorcycle questions" items={[
      {question:"Do electric motorcycles need LTO registration in the Philippines?",answer:"The VinFast Evo, Feliz II and Viper in the current MotoIndex set are classified by LTO as L3 motorcycles without sidecars and follow motorcycle registration requirements. Rules differ for other electric vehicle categories."},
      {question:"How much does an electric motorcycle cost in the Philippines?",answer:`The current verified models start at ${php(byPrice[0].priceFromPhp)}. Battery subscription, one-battery and two-battery purchase options can produce different final prices.`},
      {question:"How far can an electric motorcycle travel on one charge?",answer:`The current model pages list manufacturer claims of ${Math.min(...electricMotorcycles.map(m=>m.rangeOneKm))}–${Math.max(...electricMotorcycles.map(m=>m.rangeOneKm))} km with one battery and ${Math.min(...electricMotorcycles.map(m=>m.rangeTwoKm))}–${Math.max(...electricMotorcycles.map(m=>m.rangeTwoKm))} km with two batteries. Real range can be lower.`},
      {question:"Is an e-bike the same as an electric motorcycle?",answer:"No. The legal category depends on the exact vehicle classification and performance, not only the seller's label. Check the LTO classification before buying."},
      {question:"Is an electric motorcycle always cheaper to run?",answer:"No. Electricity can cost less per kilometer in many scenarios, but purchase price, battery plan, charging losses, financing, maintenance and resale also affect total ownership cost."}
    ]}/></div>
    <AuthorBox/>
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { commuteGuides, commuteGuideModels } from "@/lib/commute";
import { publicMotorcycles } from "@/lib/data";
import { CommuteRankCard } from "@/components/CommuteRankCard";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";

export const metadata:Metadata=pageMetadata({
  title:"Motorcycle Commuting Philippines: Traffic, Cost & Daily Use",
  description:"One Philippine motorcycle commuting guide covering heavy traffic, budget, delivery use, passenger use, rainy season and daily ownership costs.",
  path:"/commute",
  index:true
});

export default function CommutePage(){
  const schema=articleSchema({
    headline:"Motorcycle commuting guide for the Philippines",
    description:"One guide for choosing and budgeting a motorcycle for heavy traffic, daily commuting, delivery work and passenger use in the Philippines.",
    path:"/commute",
    about:"motorcycle commuting Philippines",
    keywords:["motorcycle for heavy traffic","commuter motorcycle Philippines","delivery motorcycle Philippines","motorcycle commute cost"],
    checkedDates:publicMotorcycles.map(m=>m.marketPriceCheckedAt||m.verifiedAt)
  });

  return <section className="page shell commute-master-page">
    <div className="page-head">
      <span className="entity-kicker">Daily motorcycle use</span>
      <h1>Motorcycle commuting in the Philippines: traffic, cost and daily use</h1>
      <p>Use one guide for stop-go traffic, budget, delivery work, passenger use and wet-season planning. Then use the calculators or Motorcycle Finder with your own distance, budget and rider needs.</p>
      <div className="hero-actions"><Link className="button" href="/commute/cost-calculator">Calculate commute cost</Link><Link className="button secondary" href="/finder">Build a shortlist</Link></div>
    </div>

    <div className="commute-hero-grid">
      <div className="commute-context">
        <h2>Traffic changes which motorcycle traits matter most.</h2>
        <p>Lower weight, automatic transmission and good fuel economy can make daily use easier, but they do not prove one motorcycle is safer or faster through traffic. Fit, route, maintenance access and rider skill still matter.</p>
        <div className="source-links"><a href="https://legacy.senate.gov.ph/lisdata/4774243764%21.pdf" target="_blank" rel="noreferrer">Senate / traffic source ↗</a><a href="https://new.doe.gov.ph/prices" target="_blank" rel="noreferrer">DOE fuel-price monitors ↗</a></div>
      </div>
      <div className="commute-stat-stack"><span><small>Current motorcycles</small><b>{publicMotorcycles.length}</b></span><span><small>Default calculator distance</small><b>20 km/day · 22 days</b></span><span><small>Fuel price</small><b>Editable</b></span></div>
    </div>

    <nav className="product-entity-nav commute-master-nav" aria-label="Commuting guide sections">
      {commuteGuides.map(g=><a href={`#${g.slug}`} key={g.slug}>{g.kicker}</a>)}
      <a href="#tools">Tools</a>
      <a href="#rain">Rainy season</a>
    </nav>

    {commuteGuides.map(g=>{
      const ordered=commuteGuideModels(g.slug).slice(0,6);
      return <section id={g.slug} className="commute-master-section" key={g.slug}>
        <div className="section-head compact"><div><span className="section-kicker">{g.kicker}</span><h2>{g.title}</h2><p>{g.description}</p></div></div>
        <div className="method-card compact-method"><strong>What this shortlist uses</strong><ul>{g.criteria.map(c=><li key={c}>{c}</li>)}</ul><small>These are measurable filters, not a crash-risk or comfort score.</small></div>
        <div className="commute-rank-list">{ordered.map(r=><CommuteRankCard key={r.model.id} model={r.model} reasons={r.reasons}/>)}</div>
      </section>;
    })}

    <section id="tools" className="commute-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Use your numbers</span><h2>Commute calculators and finder</h2><p>Tools stay separate because they perform a real task rather than repeating editorial content.</p></div></div>
      <div className="commute-tool-grid">
        <Link href="/commute/cost-calculator"><span>01</span><h3>Daily commute cost</h3><p>Estimate fuel, maintenance reserve, parking and cost per workday for any current motorcycle.</p></Link>
        <Link href="/commute/affordability"><span>02</span><h3>Affordability ceiling</h3><p>Set take-home pay, monthly cap, running-cost reserve, down payment, APR and term.</p></Link>
        <Link href="/finder"><span>03</span><h3>Motorcycle Finder</h3><p>Change budget, inseam, traffic, passenger use, luggage and road needs.</p></Link>
      </div>
    </section>

    <section id="rain" className="commute-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Wet season</span><h2>Rainy-season commuting</h2><p>Visibility, tire condition, braking, waterproof gear and water exposure matter more than one ground-clearance number.</p></div><Link href="/commute/rainy-season">Open rainy-season checklist →</Link></div>
      <div className="topic-grid">
        <article><h3>Visibility first</h3><p>Keep visor and lights clear, use suitable rain gear and avoid anything that reduces your ability to see or be seen.</p></article>
        <article><h3>Tires and braking</h3><p>Check tread, pressure and braking condition. Wet-road grip depends on more than tire width or motorcycle category.</p></article>
        <article><h3>Standing water</h3><p>Do not treat ground clearance as a safe water-depth rating. Hidden potholes, current, intake height and electrical components can all create risk.</p></article>
      </div>
    </section>

    <div className="note-box"><h2>Specs do not equal safety</h2><p>Use the measurable data to narrow the shortlist, then test ergonomics in person, get proper training and ride within road and traffic rules.</p></div>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}

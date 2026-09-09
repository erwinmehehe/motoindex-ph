import type { Metadata } from "next";
import Link from "next/link";
import { ownershipGuides } from "@/lib/ownershipGuides";
import { safetyResources } from "@/lib/safety";
import { pageMetadata } from "@/lib/site";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Ownership Philippines: Cost, Registration & Safety",
  description:"One Philippine motorcycle ownership hub for cost, maintenance, registration, transfer, insurance, recalls and official service resources.",
  path:"/ownership",
  index:true
});

export default function OwnershipPage(){
  const schema=articleSchema({
    headline:"Motorcycle ownership guide for the Philippines",
    description:"One ownership hub covering motorcycle cost, maintenance, registration, transfer, insurance and official safety-campaign resources.",
    path:"/ownership",
    about:"motorcycle ownership Philippines",
    keywords:["motorcycle ownership Philippines","motorcycle registration Philippines","motorcycle maintenance Philippines","motorcycle insurance Philippines","motorcycle transfer ownership"],
    checkedDates:[...ownershipGuides.map(g=>g.lastChecked),...safetyResources.map(r=>r.lastChecked)]
  });

  return <section className="page shell ownership-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle ownership</span>
      <h1>Motorcycle ownership in the Philippines: cost, maintenance, paperwork and safety checks</h1>
      <p>Use one ownership hub after choosing the motorcycle. Estimate total cost, open exact maintenance schedules, check manufacturer safety campaigns and follow the current registration, transfer and insurance guides.</p>
    </div>

    <nav className="product-entity-nav" aria-label="Motorcycle ownership sections">
      <a href="#cost">Cost</a>
      <a href="#maintenance">Maintenance</a>
      <a href="#safety-campaigns">Safety campaigns</a>
      <a href="#paperwork">Registration & transfer</a>
    </nav>

    <section id="cost" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Total cost</span><h2>What a motorcycle costs after purchase</h2><p>Purchase price is only the start. Financing, fuel, maintenance, insurance, registration, tires and resale all affect the real cost of ownership.</p></div></div>
      <div className="ownership-feature-grid">
        <Link href="/ownership/cost-calculator"><span>Calculator</span><h3>1-year + 3-year total cost</h3><p>Change purchase, finance, fuel, maintenance, insurance, registration, tire and resale assumptions.</p><b>Calculate cost →</b></Link>
        <Link href="/commute/cost-calculator"><span>Daily use</span><h3>Commute cost</h3><p>Estimate fuel, maintenance reserve and parking for your own route and workdays.</p><b>Calculate commute →</b></Link>
        <Link href="/tools/motorcycle-insurance-calculator"><span>Insurance</span><h3>Insurance planning</h3><p>Estimate an insured-value scenario, then replace it with a real insurer quote.</p><b>Estimate insurance →</b></Link>
      </div>
    </section>

    <section id="maintenance" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Maintenance</span><h2>Use the exact motorcycle schedule</h2><p>Oil, coolant, battery, CVT, chain, sprocket and service intervals are model-specific. The main maintenance guide keeps generic system advice separate from exact owner-manual schedules.</p></div></div>
      <div className="topic-grid">
        <Link href="/maintenance"><h3>Motorcycle maintenance guide</h3><p>Oil, coolant, batteries, CVT, sprockets and parts in one reference.</p><b>Open maintenance guide →</b></Link>
        <Link href="/maintenance#model-schedules"><h3>Exact model schedules</h3><p>Open owner-manual-derived service intervals where the exact motorcycle source has been parsed.</p><b>View model schedules →</b></Link>
        <Link href="/maintenance#official-resources"><h3>Manufacturer service resources</h3><p>Use official brand maintenance planners and service-network references when an exact schedule is not available.</p><b>Open official resources →</b></Link>
      </div>
    </section>

    <section id="safety-campaigns" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Recalls and service campaigns</span><h2>Check the motorcycle at the manufacturer</h2><p>Campaign eligibility can be frame- or VIN-specific. An empty public notice list does not prove a motorcycle is unaffected.</p></div></div>
      <div className="source-ladder">{safetyResources.map(resource=><article key={resource.makeSlug}>
        <span>{resource.hasVehicleChecker?"Vehicle checker":"Official support"}</span>
        <div><h3>{resource.label}</h3><small>Checked {resource.lastChecked}</small></div>
        <div><p>{resource.method}</p><a className="text-link" href={resource.url} target="_blank" rel="noreferrer">Open official resource ↗</a></div>
      </article>)}</div>
    </section>

    <section id="paperwork" className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Government and insurance guides</span><h2>Registration, ownership transfer and insurance</h2><p>These remain separate because each is a different legal or transaction task with its own official sources and requirements.</p></div></div>
      <div className="topic-grid ownership-guide-grid">{ownershipGuides.map(guide=><Link className="ownership-guide-card" href={`/ownership/${guide.slug}`} key={guide.slug}><h3>{guide.title}</h3><p>{guide.description}</p><small className="verified-pill">Sources checked {guide.lastChecked}</small></Link>)}</div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}

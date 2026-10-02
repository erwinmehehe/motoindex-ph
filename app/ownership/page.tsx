import type { Metadata } from "next";
import Link from "next/link";
import { ownershipGuides } from "@/lib/ownershipGuides";
import { safetyResources } from "@/lib/safety";
import { pageMetadata } from "@/lib/site";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";
import hubStyles from "../styles/decision-hub.module.css";

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Ownership Philippines: Cost, Registration & Safety",
  description:"One Philippine motorcycle ownership hub for cost, maintenance, registration, transfer, insurance, recalls and official service resources.",
  path:"/ownership",
  index:true
});

const costDecisions=[
  {href:"/garage",label:"My Garage",title:"Track the motorcycle you own",description:"Keep odometer, registration, insurance, PMS, fuel, repairs, expenses and resale records together on this device.",meta:"Open My Garage →"},
  {href:"/ownership/cost-calculator",label:"Total cost",title:"1-year + 3-year ownership cost",description:"Change purchase, finance, fuel, maintenance, insurance, registration, tire and resale assumptions.",meta:"Calculate cost →"},
  {href:"/commute/cost-calculator",label:"Daily use",title:"Commute cost",description:"Estimate fuel, maintenance reserve and parking for your own route and workdays.",meta:"Calculate commute →"},
  {href:"/tools/motorcycle-insurance-calculator",label:"Insurance",title:"Insurance planning",description:"Build an editable insured-value scenario, then replace it with a real insurer quote.",meta:"Estimate insurance →"}
];

const maintenanceDecisions=[
  {href:"/maintenance",label:"Reference",title:"Motorcycle maintenance guide",description:"Oil, coolant, batteries, CVT, sprockets and common service systems in one reference.",meta:"Open guide →"},
  {href:"/maintenance#model-schedules",label:"Exact model",title:"Owner-manual service schedules",description:"Open parsed service intervals where MotoIndex has an exact motorcycle source.",meta:"View schedules →"},
  {href:"/maintenance#official-resources",label:"Official",title:"Manufacturer service resources",description:"Use official maintenance planners and service-network references when an exact schedule is unavailable.",meta:"Open resources →"}
];

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
    <div className={hubStyles.heroGrid}>
      <PageHero
        kicker="Motorcycle ownership"
        title="Motorcycle ownership in the Philippines"
        description="After choosing the motorcycle, use this hub for ownership cost, maintenance, registration, transfer, insurance and manufacturer safety checks."
        actions={<CTAGroup><Link className="button" href="/ownership/cost-calculator">Calculate ownership cost</Link><Link className="button secondary" href="/maintenance">Open maintenance guide</Link></CTAGroup>}
      />
      <aside className={hubStyles.heroPanel}>
        <div><span className={hubStyles.panelKicker}>Ownership path</span><h2 className={hubStyles.panelTitle}>What do you need to solve next?</h2><p className={hubStyles.panelCopy}>Use the next task, not a generic ownership checklist, to choose the right guide or calculator.</p></div>
        <div className={hubStyles.panelLinks}><a href="#cost">Plan the cost <span>→</span></a><a href="#maintenance">Maintain the bike <span>→</span></a><a href="#safety-campaigns">Check safety campaigns <span>→</span></a><a href="#paperwork">Handle paperwork <span>→</span></a></div>
      </aside>
    </div>

    <StatRow items={[
      {label:"Cost tools",value:"3",note:"Ownership, commute and insurance"},
      {label:"Ownership guides",value:String(ownershipGuides.length),note:"Registration, transfer and insurance"},
      {label:"Safety resources",value:String(safetyResources.length),note:"Checked manufacturer sources"}
    ]}/>

    <nav className="product-entity-nav" aria-label="Motorcycle ownership sections">
      <a href="#cost">Cost</a>
      <a href="#maintenance">Maintenance</a>
      <a href="#safety-campaigns">Safety campaigns</a>
      <a href="#paperwork">Registration & transfer</a>
    </nav>

    <section id="cost" className={styles.section} data-ownership-decision-section>
      <SectionHeader
        kicker="Total cost"
        title="What a motorcycle costs after purchase"
        description="Purchase price is only the start. Financing, fuel, maintenance, insurance, registration, tires and resale all affect the real cost of ownership."
      />
      <div className={hubStyles.cardGrid}>
        {costDecisions.map(item=><Link className={hubStyles.card} href={item.href} key={item.href}>
          <span className={hubStyles.cardLabel}>{item.label}</span>
          <span ><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={hubStyles.cardMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <section id="maintenance" className={styles.section}>
      <SectionHeader
        kicker="Maintenance"
        title="Use the exact motorcycle schedule"
        description="Generic system advice is useful, but oil, coolant, battery, CVT, chain, sprocket and service intervals are model-specific."
      />
      <div className={hubStyles.cardGrid}>
        {maintenanceDecisions.map(item=><Link className={hubStyles.card} href={item.href} key={item.href}>
          <span className={hubStyles.cardLabel}>{item.label}</span>
          <span ><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={hubStyles.cardMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <section id="safety-campaigns" className={styles.section}>
      <SectionHeader
        kicker="Recalls and service campaigns"
        title="Check the motorcycle at the manufacturer"
        description="Campaign eligibility can be frame- or VIN-specific. An empty public notice list does not prove a motorcycle is unaffected."
      />
      <details className={styles.compactDetails}>
        <summary><span>Manufacturer safety resources</span><span>{safetyResources.length} checked sources</span></summary>
        <div className={hubStyles.cardGrid}>
          {safetyResources.map(resource=><a className={hubStyles.card} key={resource.makeSlug} href={resource.url} target="_blank" rel="noreferrer">
            <span className={hubStyles.cardLabel}>{resource.hasVehicleChecker?"Vehicle checker":"Official support"}</span>
            <span ><h3>{resource.label}</h3><p>{resource.method}</p></span>
            <span className={hubStyles.cardMeta}>Open official source ↗</span>
          </a>)}
        </div>
      </details>
    </section>

    <section id="paperwork" className={styles.section}>
      <SectionHeader
        kicker="Government and insurance guides"
        title="Registration, ownership transfer and insurance"
        description="Each task has its own official sources and requirements, so these remain separate focused guides."
      />
      <div className={hubStyles.cardGrid} data-ownership-guide-list>
        {ownershipGuides.map(guide=><Link className={hubStyles.card} href={`/ownership/${guide.slug}`} key={guide.slug}>
          <span className={hubStyles.cardLabel}>Guide</span>
          <span ><h3>{guide.title}</h3><p>{guide.description}</p></span>
          <span className={hubStyles.cardMeta}>Checked {guide.lastChecked}</span>
        </Link>)}
      </div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}

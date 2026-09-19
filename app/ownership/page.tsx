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

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Ownership Philippines: Cost, Registration & Safety",
  description:"One Philippine motorcycle ownership hub for cost, maintenance, registration, transfer, insurance, recalls and official service resources.",
  path:"/ownership",
  index:true
});

const costDecisions=[
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
    <PageHero
      kicker="Motorcycle ownership"
      title="Motorcycle ownership in the Philippines"
      description="After choosing the motorcycle, use this hub for ownership cost, maintenance, registration, transfer, insurance and manufacturer safety checks."
      actions={<CTAGroup><Link className="button" href="/ownership/cost-calculator">Calculate ownership cost</Link><Link className="button secondary" href="/maintenance">Open maintenance guide</Link></CTAGroup>}
    />

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
      <div className={styles.decisionList}>
        {costDecisions.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <section id="maintenance" className={styles.section}>
      <SectionHeader
        kicker="Maintenance"
        title="Use the exact motorcycle schedule"
        description="Generic system advice is useful, but oil, coolant, battery, CVT, chain, sprocket and service intervals are model-specific."
      />
      <div className={styles.decisionList}>
        {maintenanceDecisions.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
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
        <div className={styles.decisionList}>
          {safetyResources.map(resource=><a className={styles.decisionRow} key={resource.makeSlug} href={resource.url} target="_blank" rel="noreferrer">
            <span className={styles.decisionLabel}>{resource.hasVehicleChecker?"Vehicle checker":"Official support"}</span>
            <span className={styles.decisionCopy}><h3>{resource.label}</h3><p>{resource.method}</p></span>
            <span className={styles.decisionMeta}>Open official source ↗</span>
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
      <div className={styles.decisionList} data-ownership-guide-list>
        {ownershipGuides.map(guide=><Link className={styles.decisionRow} href={`/ownership/${guide.slug}`} key={guide.slug}>
          <span className={styles.decisionLabel}>Guide</span>
          <span className={styles.decisionCopy}><h3>{guide.title}</h3><p>{guide.description}</p></span>
          <span className={styles.decisionMeta}>Checked {guide.lastChecked}</span>
        </Link>)}
      </div>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}

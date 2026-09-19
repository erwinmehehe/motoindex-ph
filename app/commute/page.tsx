import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { commuteGuides, commuteGuideModels } from "@/lib/commute";
import { publicMotorcycles } from "@/lib/data";
import { commuteMonthlyCosts } from "@/lib/commuteMath";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata:Metadata=pageMetadata({
  title:"Motorcycle Commuting Philippines: Traffic, Cost & Daily Use",
  description:"One Philippine motorcycle commuting guide covering heavy traffic, budget, delivery use, passenger use, rainy season and daily ownership costs.",
  path:"/commute",
  index:true
});

const commuteTools=[
  {href:"/commute/cost-calculator",label:"Daily use",title:"Commute cost calculator",description:"Estimate fuel, maintenance reserve, parking and cost per workday for your own route.",meta:"Calculate cost →"},
  {href:"/commute/affordability",label:"Budget",title:"Motorcycle affordability",description:"Set take-home pay, a monthly cap, running-cost reserve, down payment, APR and term.",meta:"Set budget →"},
  {href:"/finder",label:"Shortlist",title:"Motorcycle Finder",description:"Change budget, inseam, traffic, passenger use, luggage and road needs.",meta:"Build shortlist →"}
];

const rainySeason=[
  {label:"Visibility",title:"See and be seen",description:"Keep the visor and lights clear and use rain gear that does not reduce visibility or movement."},
  {label:"Grip",title:"Tires and braking",description:"Check tread, pressure and braking condition. Wet-road grip depends on more than tire width or motorcycle category."},
  {label:"Water",title:"Standing water",description:"Do not treat ground clearance as a safe water-depth rating. Hidden potholes, current, intake height and electrical components all matter."}
];

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
    <PageHero
      kicker="Daily motorcycle use"
      title="Motorcycle commuting in the Philippines"
      description="Compare measurable traits for traffic, budget, delivery work, passenger use and wet-season riding, then use your own route and budget in the calculators."
      actions={<CTAGroup><Link className="button" href="/commute/cost-calculator">Calculate commute cost</Link><Link className="button secondary" href="/finder">Build a shortlist</Link></CTAGroup>}
    />

    <StatRow items={[
      {label:"Current motorcycles",value:String(publicMotorcycles.length),note:"Catalog candidates"},
      {label:"Default distance",value:"20 km/day",note:"22 workdays in calculators"},
      {label:"Fuel price",value:"Editable",note:"Use your current local price"}
    ]}/>

    <InfoPanel subtle>
      <h3>Traffic changes which traits matter</h3>
      <p>Lower weight, automatic transmission and fuel economy can make daily use easier, but they do not prove one motorcycle is safer or faster through traffic. Fit, route, maintenance access and rider skill still matter.</p>
    </InfoPanel>

    <nav className="product-entity-nav commute-master-nav" aria-label="Commuting guide sections">
      {commuteGuides.map(g=><a href={`#${g.slug}`} key={g.slug}>{g.kicker}</a>)}
      <a href="#tools">Tools</a>
      <a href="#rain">Rainy season</a>
    </nav>

    {commuteGuides.map(g=>{
      const ordered=commuteGuideModels(g.slug).slice(0,4);
      return <section id={g.slug} className={styles.section} key={g.slug} data-commute-use-case>
        <SectionHeader kicker={g.kicker} title={g.title} description={g.description} />
        <details className={styles.compactDetails}>
          <summary><span>What this shortlist uses</span><span>{g.criteria.length} measurable filters</span></summary>
          <ul>{g.criteria.map(c=><li key={c}>{c}</li>)}</ul>
        </details>
        <div className={styles.candidateGrid}>
          {ordered.map(r=>{
            const costs=commuteMonthlyCosts(r.model);
            return <Link className={styles.candidateRow} key={r.model.id} href={`/motorcycles/${r.model.makeSlug}/${r.model.slug}`}>
              <span>
                <h3>{r.model.make} {r.model.model}</h3>
                <p>{r.model.summary}</p>
                <span className={styles.candidateReasons}>{r.reasons.slice(0,3).map(reason=><span key={reason}>{reason}</span>)}</span>
              </span>
              <span className={styles.candidateMetrics}>
                <span><small>Market price</small><strong>{observedMarketPriceLabel(r.model)}</strong></span>
                <span><small>Fuel + maintenance*</small><strong>₱{Math.round(costs.total).toLocaleString("en-PH")}/mo</strong></span>
              </span>
            </Link>;
          })}
        </div>
      </section>;
    })}

    <section id="tools" className={styles.section}>
      <SectionHeader
        kicker="Use your numbers"
        title="Commute calculators and finder"
        description="Use these when your own distance, budget or riding needs should drive the decision."
      />
      <div className={styles.decisionList}>
        {commuteTools.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <section id="rain" className={styles.section}>
      <SectionHeader
        kicker="Wet season"
        title="Rainy-season commuting"
        description="Visibility, tire condition, braking, waterproof gear and water exposure matter more than one ground-clearance number."
        aside={<Link href="/commute/rainy-season">Open full checklist →</Link>}
      />
      <div className={styles.decisionList}>
        {rainySeason.map(item=><article className={styles.decisionRow} key={item.label}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>Daily-use check</span>
        </article>)}
      </div>
      <InfoPanel subtle className={styles.notice}>
        <h3>Specs do not equal safety</h3>
        <p>Use measurable data to narrow the shortlist, then test ergonomics in person, get proper training and ride within road and traffic rules.</p>
      </InfoPanel>
    </section>

    <JsonLd data={schema}/>
    <AuthorBox/>
  </section>;
}

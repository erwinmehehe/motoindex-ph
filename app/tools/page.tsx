import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Calculators Philippines",
  description: "Free Philippine motorcycle calculators for loan payments, LTO registration budgeting, insurance and ownership costs.",
  path: "/tools"
});

const coreTools=[
  {href:"/ownership/cost-calculator",label:"Ownership",title:"Total cost to own",description:"Combine purchase, financing, fuel, maintenance, registration, insurance, tires and resale.",meta:"Full ownership view →"},
  {href:"/tools/motorcycle-loan-calculator",label:"Financing",title:"Motorcycle loan calculator",description:"Estimate monthly payment, financed amount, interest and total cash paid.",meta:"Calculate loan →"},
  {href:"/tools/lto-registration-fee-calculator",label:"Registration",title:"LTO registration fee calculator",description:"Plan MVUC, inspection, CTPL and transaction-specific charges.",meta:"Estimate fees →"},
  {href:"/tools/motorcycle-insurance-calculator",label:"Insurance",title:"Motorcycle insurance calculator",description:"Build an editable planning estimate before replacing it with a real insurer quote.",meta:"Estimate insurance →"}
];

const planningTools=[
  {href:"/commute/cost-calculator",label:"Daily use",title:"Commute cost calculator",description:"Estimate fuel, maintenance reserve and parking for your own route and workdays.",meta:"Calculate commute →"},
  {href:"/commute/affordability",label:"Budget",title:"Motorcycle affordability",description:"Turn a realistic monthly budget into a purchase-price ceiling and a shorter candidate list.",meta:"Set affordability →"},
  {href:"/tools/electric-motorcycle-charging-cost",label:"Electric",title:"Charging-cost calculator",description:"Estimate a full charge, cost per 100 km and monthly electricity use.",meta:"Estimate charging →"},
  {href:"/tools/electric-motorcycle-range-calculator",label:"Electric",title:"Electric range calculator",description:"Adjust published range for battery setup, daily distance and a conservative planning factor.",meta:"Estimate range →"}
];

export default function ToolsPage() {
  return <section className="page shell tools-master-page">
    <PageHero
      kicker="Plan before you buy"
      title="Motorcycle tools for the Philippines"
      description="Start with the decision you are making now, then open the calculator that uses the numbers you can realistically provide."
    />

    <StatRow items={[
      {label:"Planning tools",value:"8",note:"Purchase, ownership and daily use"},
      {label:"Core cost tools",value:"4",note:"Ownership, loan, LTO and insurance"},
      {label:"Electric tools",value:"2",note:"Charging cost and range"}
    ]}/>

    <section className={styles.section} data-tools-core>
      <SectionHeader
        kicker="Most useful first"
        title="Purchase and ownership calculators"
        description="These four tools cover the decisions most riders need before paying for a motorcycle."
      />
      <div className={styles.decisionList}>
        {coreTools.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <section className={styles.section} data-tools-planning>
      <SectionHeader
        kicker="Use-specific planning"
        title="Daily riding and electric tools"
        description="Use these when commute distance, monthly affordability or electric range is part of the decision."
      />
      <div className={styles.decisionList}>
        {planningTools.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>
  </section>;
}

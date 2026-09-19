import type { Metadata } from "next";
import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { pageMetadata } from "@/lib/site";
import { latestResearchCheck, researchMotorcycles } from "@/lib/researchData";
import { InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Philippine Motorcycle Data & Research | MotoIndex PH",
  description: "MotoIndex Philippine motorcycle datasets for current prices, seat heights, down payments and monthly financing estimates, with dated source checks.",
  path: "/research"
});

const datasets=[
  {
    href:"/research/motorcycle-price-index-philippines",
    label:"Price",
    title:"Motorcycle price index",
    description:"Compare published starting prices across current Philippine motorcycle records, including median price and budget-band counts.",
    meta:"Open price index →"
  },
  {
    href:"/research/motorcycle-seat-height-database",
    label:"Fit",
    title:"Seat-height database",
    description:"Sort current motorcycles by published seat height, then compare curb weight, category and price before an in-person fit check.",
    meta:"Open database →"
  },
  {
    href:"/research/motorcycle-financing-index-philippines",
    label:"Financing",
    title:"Down payment & monthly index",
    description:"Compare one consistent financing scenario using 20% down, 36 months and a 12% annual amortizing-rate assumption.",
    meta:"Open financing index →"
  }
];

export default function ResearchPage() {
  const checkedAt = latestResearchCheck();

  return <section className="page shell research-master-page">
    <PageHero
      kicker="MotoIndex data research"
      title="Philippine motorcycle data built for comparison"
      description="Explore source-led datasets generated from the current public MotoIndex motorcycle catalog, with model-level links back to price context, specifications and source dates."
    />

    <StatRow items={[
      {label:"Current models",value:String(researchMotorcycles.length),note:"Current indexable records"},
      {label:"Latest source check",value:checkedAt,note:"Newest represented check"},
      {label:"Method",value:"Source-led",note:"No dealer or lender quote implied"}
    ]}/>

    <section className={styles.section} aria-labelledby="research-datasets" data-research-dataset-section>
      <SectionHeader
        kicker="Original datasets"
        title="Use the dataset that matches your decision"
        description="Each dataset works from the same verified motorcycle entities used across MotoIndex buying tools instead of creating thin duplicates."
      />
      <div className={styles.decisionList} data-research-dataset-list>
        {datasets.map(item=><Link className={styles.decisionRow} href={item.href} key={item.href}>
          <span className={styles.decisionLabel}>{item.label}</span>
          <span className={styles.decisionCopy}><h3>{item.title}</h3><p>{item.description}</p></span>
          <span className={styles.decisionMeta}>{item.meta}</span>
        </Link>)}
      </div>
    </section>

    <InfoPanel subtle className={styles.notice}>
      <h3>What this research is, and what it is not</h3>
      <p>MotoIndex uses dated Philippine price and specification references to make motorcycles easier to compare. These datasets are research tools, not complete manufacturer catalogs, live dealer inventories, lender quotations or guarantees that every recorded model is in stock near you.</p>
      <Link className="text-link" href="/methodology">Read the MotoIndex methodology →</Link>
    </InfoPanel>

    <AuthorBox />
  </section>;
}

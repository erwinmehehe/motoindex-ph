import type { Metadata } from "next";
import Link from "next/link";
import { CompareBuilder } from "@/components/CompareBuilder";
import { DecisionPath } from "@/components/DecisionPath";
import { comparisons, getComparison, isIndexableComparison, publicMotorcycles } from "@/lib/data";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { forClient } from "@/lib/competitors";
import { pageMetadata } from "@/lib/site";
import { siteStats } from "@/lib/siteStats";
import styles from "./ComparePage.module.css";

const compareModels=publicMotorcycles;
const publicComparisons=comparisons.filter(c=>isIndexableComparison(c.slug));
export const dynamic="force-static";
export const metadata: Metadata = pageMetadata({ title: "Compare Motorcycles Philippines", description: "Compare two or three current Philippine motorcycles for market price, engine, weight, seat height, fuel tank, tires and brakes.", path: "/compare", index: compareModels.length>=2 });

export default function CompareIndex(){
  return <section className={styles.page}>
    <div className={styles.head}>
      <span className="entity-kicker">{siteStats.currentMotorcycles} current models</span>
      <h1>Compare motorcycles side by side.</h1>
      <p>Choose two or three current motorcycles and compare prices, engine, rider fit, fuel, tires and braking from the same model records used across MotoIndex.</p>
    </div>

    <div className={styles.workspace}>
      {compareModels.length>=2?<CompareBuilder models={forClient(compareModels)}/>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}
    </div>

    {publicComparisons.length>0&&<section className={styles.popular}>
      <div className={styles.popularHead}><div><span>Popular comparisons</span><h2>Start with a common pair</h2></div></div>
      <div className={styles.popularList}>{publicComparisons.map(c=>{const data=getComparison(c.slug);if(!data)return null;const brief=getComparisonEditorialBrief(c.slug);return <Link key={c.slug} href={`/compare/${c.slug}`}><span><strong>{brief?.primaryKeyword||`${data.a.model} vs ${data.b.model}`}</strong><small>{brief?.intent||c.summary}</small></span><b>Compare →</b></Link>})}</div>
    </section>}

    <DecisionPath stage="compare" />
  </section>
}

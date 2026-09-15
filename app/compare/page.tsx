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
const featuredComparisons=publicComparisons.slice(0,6);
const remainingComparisons=publicComparisons.slice(6);
export const dynamic="force-static";
export const metadata: Metadata = pageMetadata({ title: "Compare Motorcycles Philippines", description: "Compare two or three current Philippine motorcycles for market price, engine, weight, seat height, fuel tank, tires and brakes.", path: "/compare", index: compareModels.length>=2 });

function ComparisonLink({ slug, summary }: { slug: string; summary: string }) {
  const data=getComparison(slug);
  if(!data)return null;
  const brief=getComparisonEditorialBrief(slug);
  const category=data.a.category===data.b.category?data.a.category:"Buyer comparison";
  return <Link className={styles.comparisonCard} href={`/compare/${slug}`}>
    <div className={styles.cardTop}><span>{category}</span><b>Compare →</b></div>
    <div className={styles.pairModels}>
      <div><small>{data.a.make}</small><strong>{data.a.model}</strong></div>
      <em>VS</em>
      <div><small>{data.b.make}</small><strong>{data.b.model}</strong></div>
    </div>
    <h3>{brief?.primaryKeyword||`${data.a.model} vs ${data.b.model}`}</h3>
    <p>{brief?.intent||summary}</p>
  </Link>;
}

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

    {featuredComparisons.length>0&&<section className={styles.popular}>
      <div className={styles.popularHead}><div><span>Popular comparisons</span><h2>Start with a common pair</h2><p>Choose a proven cross-shop pair, then open the full side-by-side decision view.</p></div></div>
      <div className={styles.popularList}>{featuredComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div>
      {remainingComparisons.length>0&&<details className="compare-more-pairs"><summary>View all comparisons ({publicComparisons.length})</summary><div className={styles.popularList}>{remainingComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div></details>}
    </section>}

    <DecisionPath stage="compare" />
  </section>
}

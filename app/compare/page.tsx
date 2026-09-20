import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CompareBuilder } from "@/components/CompareBuilder";
import { DecisionPath } from "@/components/DecisionPath";
import { comparisons, getComparison, isIndexableComparison, publicMotorcycles } from "@/lib/data";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { forClient } from "@/lib/competitors";
import { pageMetadata } from "@/lib/site";
import { siteStats } from "@/lib/siteStats";
import { PageHero, SectionHeader } from "@/components/ui";
import styles from "./ComparePage.module.css";

const compareModels=publicMotorcycles;
const publicComparisons=comparisons.filter(c=>isIndexableComparison(c.slug));
const featuredComparisons=publicComparisons.slice(0,6);
const remainingComparisons=publicComparisons.slice(6);
export const dynamic="force-static";
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Comparison Philippines | Compare Bikes",
  description: "Compare motorcycles in the Philippines side by side by price, engine, weight, seat height, fuel tank, tires and brakes. Compare 2 or 3 bikes before buying.",
  path: "/compare",
  index: compareModels.length>=2
});

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
  return <section className={styles.page} data-compare-index>
    <PageHero
      kicker={`${siteStats.currentMotorcycles} current models`}
      title="Compare motorcycles in the Philippines side by side"
      description="Pick two or three current motorcycles, then compare price, engine, rider fit, weight, fuel, tires and braking without opening multiple tabs."
    />

    <div className={styles.workspace}>
      {compareModels.length>=2?<Suspense fallback={<div className="note-box"><h2>Loading comparison builder</h2><p>Preparing the current motorcycle list.</p></div>}><CompareBuilder models={forClient(compareModels)}/></Suspense>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}
    </div>

    {featuredComparisons.length>0&&<section className={styles.popular}>
      <SectionHeader
        kicker="Popular comparisons"
        title="Start with common motorcycle matchups"
        description="Open a ready-made comparison or build your own above."
      />
      <div className={styles.popularList}>{featuredComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div>
      {remainingComparisons.length>0&&<details className={styles.morePairs}><summary>View all comparisons ({publicComparisons.length})</summary><div className={styles.popularList}>{remainingComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div></details>}
    </section>}

    <DecisionPath stage="compare" />
  </section>
}

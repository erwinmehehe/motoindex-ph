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
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
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
  const pick=(make:string,slug:string)=>compareModels.find((m)=>m.makeSlug===make&&m.slug.toLowerCase().includes(slug));
  const defaults=[pick("yamaha","nmax"),pick("honda","adv"),pick("suzuki","burgman")].filter((m):m is (typeof compareModels)[number]=>Boolean(m));
  return <section className={styles.page} data-compare-index>
    <div className={styles.heroHead}>
      <span>Home · Compare</span>
      <h1>Compare Motorcycles</h1>
      <p>Compare up to 3 motorcycles side by side.</p>
    </div>

    {defaults.length===3&&<section className={styles.referenceCompare} aria-label="Popular three-motorcycle comparison">
      <div className={styles.compareModels}>
        {defaults.map((model)=><article className={styles.compareModel} key={model.id}>
          <span className={styles.removeIcon}>×</span>
          <EntityMedia entityType="motorcycle" entityId={model.id} className={styles.compareMedia} showCredit={false} sizes="30vw" fallback={<EntityVerificationFallback brand={model.make} model={model.model}/>} />
          <small>{model.make}</small><h2>{model.model}</h2><strong>{observedMarketPriceLabel(model)}</strong>
        </article>)}
      </div>
      <div className={styles.matrix}>
        <div className={styles.matrixTitle}>Engine & Performance <span>⌄</span></div>
        {[
          ["Displacement",...defaults.map((m)=>m.engineCc+" cc")],
          ["Max Power",...defaults.map((m)=>m.powerHp+" hp")],
          ["Max Torque",...defaults.map((m)=>m.torqueNm+" Nm")],
          ["Transmission",...defaults.map((m)=>m.transmission||"—")]
        ].map((row)=><div className={styles.matrixRow} key={row[0]}>{row.map((cell,index)=><span key={index}>{cell}</span>)}</div>)}
        <div className={styles.matrixTitle}>Dimensions & Weight <span>⌄</span></div>
        {[
          ["Seat Height",...defaults.map((m)=>m.seatHeightMm+" mm")],
          ["Fuel Tank",...defaults.map((m)=>m.fuelTankL+" liters")],
          ["Curb Weight",...defaults.map((m)=>m.curbWeightKg+" kg")]
        ].map((row)=><div className={styles.matrixRow} key={row[0]}>{row.map((cell,index)=><span key={index}>{cell}</span>)}</div>)}
        <div className={styles.matrixTitle}>Braking & Equipment <span>⌄</span></div>
        <div className={styles.matrixRow}><span>ABS</span>{defaults.map((m)=><span key={m.id}>{m.abs}</span>)}</div>
      </div>
      <div className={styles.compareActions}><button type="button">Clear all</button><Link href={"/compare/selection?bikes="+encodeURIComponent(defaults.map((m)=>m.slug).join(","))}>Share comparison →</Link></div>
    </section>}

    <details className={styles.builderToggle}>
      <summary>Change motorcycles</summary>
      <div className={styles.workspace}>
        {compareModels.length>=2?<Suspense fallback={<div className="note-box"><h2>Loading comparison builder</h2><p>Preparing the current motorcycle list.</p></div>}><CompareBuilder models={forClient(compareModels)}/></Suspense>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}
      </div>
    </details>

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

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
const defaultCompare=[
  compareModels.find(m=>m.makeSlug==="yamaha"&&m.slug.toLowerCase().includes("nmax")),
  compareModels.find(m=>m.makeSlug==="honda"&&m.slug.toLowerCase().includes("adv-160")),
  compareModels.find(m=>m.makeSlug==="suzuki"&&m.slug.toLowerCase().includes("burgman-street"))
].filter((m):m is NonNullable<typeof m>=>Boolean(m));
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
      className={styles.compactHero}
      kicker={`${siteStats.currentMotorcycles} current models`}
      title="Compare Motorcycles"
      description="Compare up to 3 motorcycles side by side."
    />

    {defaultCompare.length===3&&<section className={styles.mockupCompare} aria-label="Example three motorcycle comparison">
      <div className={styles.mockupCards}>{defaultCompare.map(model=><article key={model.id}>
        <EntityMedia entityType="motorcycle" entityId={model.id} className={styles.mockupMedia} showCredit={false} fallback={<EntityVerificationFallback brand={model.make} model={model.model}/>} />
        <small>{model.make}</small><h2>{model.model}</h2><strong>{observedMarketPriceLabel(model)}</strong>
      </article>)}</div>
      <div className={styles.specGroup}><h3>Engine & Performance</h3>
        <div className={styles.specRow}><b>Displacement</b>{defaultCompare.map(m=><span key={m.id}>{m.engineCc} cc</span>)}</div>
        <div className={styles.specRow}><b>Max Power</b>{defaultCompare.map(m=><span key={m.id}>{m.powerHp} hp</span>)}</div>
        <div className={styles.specRow}><b>Max Torque</b>{defaultCompare.map(m=><span key={m.id}>{m.torqueNm} Nm</span>)}</div>
        <div className={styles.specRow}><b>Transmission</b>{defaultCompare.map(m=><span key={m.id}>{m.transmission||"—"}</span>)}</div>
      </div>
      <div className={styles.specGroup}><h3>Dimensions & Weight</h3>
        <div className={styles.specRow}><b>Seat Height</b>{defaultCompare.map(m=><span key={m.id}>{m.seatHeightMm} mm</span>)}</div>
        <div className={styles.specRow}><b>Fuel Tank</b>{defaultCompare.map(m=><span key={m.id}>{m.fuelTankL} L</span>)}</div>
        <div className={styles.specRow}><b>Curb Weight</b>{defaultCompare.map(m=><span key={m.id}>{m.curbWeightKg} kg</span>)}</div>
      </div>
      <div className={styles.mockupActions}><button type="button">Clear all</button><Link href="/compare/selection">Share comparison →</Link></div>
    </section>}

    <details className={styles.builderDisclosure}>
      <summary>Choose different motorcycles</summary>
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

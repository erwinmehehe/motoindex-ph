import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CompareBuilder } from "@/components/CompareBuilder";
import { DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { DecisionPath } from "@/components/DecisionPath";
import { comparisons, getComparison, isIndexableComparison, publicMotorcycles } from "@/lib/data";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { forClient } from "@/lib/competitors";
import { pageMetadata } from "@/lib/site";
import { siteStats } from "@/lib/siteStats";
import { PageHero, SectionHeader } from "@/components/ui";


const COMPARE_MOCKUP_CSS=`
.compare-page{max-width:var(--mi-page-max);margin:auto;padding:0 var(--mi-space-5) var(--mi-space-20);box-sizing:border-box}
.compare-hero{max-width:880px;padding-bottom:var(--mi-space-5)}
.compare-preview{margin-top:var(--mi-space-2);padding:var(--mi-space-4);border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-sm);background:var(--mi-color-surface);box-shadow:var(--mi-shadow-xs)}
.compare-preview-head{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--mi-space-5);margin-bottom:var(--mi-space-3)}
.compare-preview-head span{display:block;margin-bottom:var(--mi-space-1);color:var(--mi-color-primary);font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
.compare-preview-head h2{margin:0;color:var(--mi-color-ink);font-size:var(--mi-type-xl);letter-spacing:var(--mi-tracking-tight)}
.compare-preview-head>a{flex:0 0 auto;color:var(--mi-color-primary);font-size:var(--mi-type-xs);font-weight:850}
.compare-builder-section{margin-top:var(--mi-space-7);padding-top:var(--mi-space-6);border-top:1px solid var(--mi-color-line-soft)}
.compare-workspace{margin-top:var(--mi-space-3);padding:var(--mi-space-4);border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-sm);background:var(--mi-color-surface);box-shadow:var(--mi-shadow-xs)}
.compare-popular{margin-top:var(--mi-space-10);padding-top:var(--mi-space-7);border-top:1px solid var(--mi-color-line-soft)}
.compare-popular-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--mi-space-2)}
.compare-card{display:flex;min-width:0;flex-direction:column;padding:var(--mi-space-3);border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface);box-shadow:none;text-decoration:none}
.compare-card:hover{border-color:var(--mi-color-primary);box-shadow:var(--mi-shadow-sm)}
.compare-card-top{display:flex;justify-content:space-between;gap:var(--mi-space-2);margin-bottom:var(--mi-space-2)}
.compare-card-top span{overflow:hidden;color:var(--mi-color-copy);font-size:9px;font-weight:800;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}
.compare-card-top b{color:var(--mi-color-primary);font-size:9px}
.compare-pair{display:grid;grid-template-columns:1fr auto 1fr;gap:var(--mi-space-2);align-items:center}
.compare-pair>div{min-width:0;padding:var(--mi-space-2);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface-subtle)}
.compare-pair small{display:block;overflow:hidden;color:var(--mi-color-muted);font-size:8px;font-weight:800;text-overflow:ellipsis;text-transform:uppercase;white-space:nowrap}
.compare-pair strong{display:block;overflow:hidden;margin-top:var(--mi-space-1);color:var(--mi-color-ink);font-size:11px;text-overflow:ellipsis;white-space:nowrap}
.compare-pair em{color:var(--mi-color-muted);font-size:9px;font-style:normal;font-weight:850}
.compare-card h3{margin:var(--mi-space-3) 0 var(--mi-space-1);color:var(--mi-color-ink);font-size:var(--mi-type-sm)}
.compare-card p{margin:0;color:var(--mi-color-copy);font-size:10px;line-height:1.5}
.compare-more{margin-top:var(--mi-space-4)}
.compare-more>summary{cursor:pointer;color:var(--mi-color-slate-700);font-size:var(--mi-type-xs);font-weight:800}
.compare-more[open]>.compare-popular-list{margin-top:var(--mi-space-3)}
@media(max-width:1000px){.compare-popular-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:900px){.compare-page{padding-inline:var(--mi-space-4)}.compare-preview-head{align-items:flex-start;flex-direction:column;gap:var(--mi-space-2)}}
@media(max-width:620px){.compare-page{padding-inline:var(--mi-space-3);padding-bottom:var(--mi-space-16)}.compare-workspace,.compare-preview{padding:var(--mi-space-3)}.compare-popular{margin-top:var(--mi-space-8)}.compare-popular-list{grid-template-columns:1fr}.compare-card{padding:var(--mi-space-3)}}
`;

const compareModels=publicMotorcycles;
const publicComparisons=comparisons.filter(c=>isIndexableComparison(c.slug));
const featuredComparisons=publicComparisons.slice(0,6);
const remainingComparisons=publicComparisons.slice(6);
const mockupPreferredSlugs=["nmax-v3","adv-160","burgman-street"] as const;
const mockupPreferred=mockupPreferredSlugs.map(slug=>compareModels.find(model=>model.slug===slug)).filter((model):model is NonNullable<typeof model>=>Boolean(model));
const previewModels=(mockupPreferred.length>=3?mockupPreferred:compareModels.slice(0,3));
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
  return <Link className={"compare-card"} href={`/compare/${slug}`}>
    <div className={"compare-card-top"}><span>{category}</span><b>Compare →</b></div>
    <div className={"compare-pair"}>
      <div><small>{data.a.make}</small><strong>{data.a.model}</strong></div>
      <em>VS</em>
      <div><small>{data.b.make}</small><strong>{data.b.model}</strong></div>
    </div>
    <h3>{brief?.primaryKeyword||`${data.a.model} vs ${data.b.model}`}</h3>
    <p>{brief?.intent||summary}</p>
  </Link>;
}

export default function CompareIndex(){
  return <section className={"compare-page"} data-compare-index>
    <PageHero
      className={"compare-hero"}
      kicker={`${siteStats.currentMotorcycles} current models`}
      title="Compare motorcycles side by side"
      description="Compare price, engine, dimensions, braking and everyday fit across current Philippine-market motorcycles."
    />

    {previewModels.length>=2&&<section className={"compare-preview"} aria-labelledby="compare-preview-title">
      <div className={"compare-preview"Head}>
        <div><span>Popular side-by-side</span><h2 id="compare-preview-title">Compare key specifications at a glance</h2></div>
        <Link href="/compare/selection?bikes=nmax-v3,adv-160,burgman-street">Open comparison →</Link>
      </div>
      <DetailedMotorcycleCompare models={forClient(previewModels)} />
    </section>}

    <section className={"compare-builder-section"}>
      <SectionHeader kicker="Build your own" title="Choose two or three motorcycles" description="Use the full current catalog to create a comparison around the bikes already on your shortlist." />
      <div className={"compare-workspace"}>
      {compareModels.length>=2?<Suspense fallback={<div className="note-box"><h2>Loading comparison builder</h2><p>Preparing the current motorcycle list.</p></div>}><CompareBuilder models={forClient(compareModels)}/></Suspense>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}
      </div>
    </section>

    {featuredComparisons.length>0&&<section className={"compare-popular"}>
      <SectionHeader
        kicker="Popular comparisons"
        title="Start with common motorcycle matchups"
        description="Open a ready-made comparison or build your own above."
      />
      <div className={"compare-popular"List}>{featuredComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div>
      {remainingComparisons.length>0&&<details className={"compare-more"}><summary>View all comparisons ({publicComparisons.length})</summary><div className={"compare-popular"List}>{remainingComparisons.map(c=><ComparisonLink key={c.slug} slug={c.slug} summary={c.summary}/>)}</div></details>}
    </section>}

    <DecisionPath stage="compare" />
  </section>
}

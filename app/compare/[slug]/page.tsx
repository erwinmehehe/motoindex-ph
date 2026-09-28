import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparisons, getComparison, isIndexableComparison } from "@/lib/data";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { pageMetadata } from "@/lib/site";
import { ComparisonProductCards, DetailedMotorcycleCompare } from "@/components/DetailedMotorcycleCompare";
import { ComparisonHighlights } from "@/components/ComparisonHighlights";
import { ComparisonEditorial } from "@/components/ComparisonEditorial";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ComparisonDecisionMatrix } from "@/components/ComparisonDecisionMatrix";
import { ComparisonDecisionWorkbench } from "@/components/ComparisonDecisionWorkbench";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { InfoPanel } from "@/components/ui";
import { observedMarketRange } from "@/lib/marketChecks";
import { php } from "@/lib/utils";
import styles from "./ComparisonDetailPage.module.css";

export function generateStaticParams(){return comparisons.map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;const c=getComparison(slug);if(!c)return {};
  const brief=getComparisonEditorialBrief(slug);
  return pageMetadata({
    title: brief?.h1 || `${c.a.model} vs ${c.b.model} Philippines`,
    description: brief?.opening || `Compare ${c.a.make} ${c.a.model} vs ${c.b.make} ${c.b.model}: checked price sources, variants, engine, dimensions, fuel, tires and braking.`,
    path:`/compare/${slug}`,
    index:isIndexableComparison(slug)
  });
}
export default async function ComparisonPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const c=getComparison(slug);if(!c)return notFound();const brief=getComparisonEditorialBrief(slug);
  const aPrice=observedMarketRange(c.a).from;
  const bPrice=observedMarketRange(c.b).from;
  const deltas=[
    {label:"Starting price",value:php(Math.abs(aPrice-bPrice)),lead:aPrice<=bPrice?c.a.model:c.b.model,note:"lower"},
    {label:"Curb weight",value:`${Math.abs(c.a.curbWeightKg-c.b.curbWeightKg)} kg`,lead:c.a.curbWeightKg<=c.b.curbWeightKg?c.a.model:c.b.model,note:"lighter"},
    {label:"Seat height",value:`${Math.abs(c.a.seatHeightMm-c.b.seatHeightMm)} mm`,lead:c.a.seatHeightMm<=c.b.seatHeightMm?c.a.model:c.b.model,note:"lower"},
    {label:"Power",value:`${Math.abs(c.a.powerHp-c.b.powerHp).toFixed(1)} hp`,lead:c.a.powerHp>=c.b.powerHp?c.a.model:c.b.model,note:"more"},
    {label:"Fuel tank",value:`${Math.abs(c.a.fuelTankL-c.b.fuelTankL).toFixed(1)} L`,lead:c.a.fuelTankL>=c.b.fuelTankL?c.a.model:c.b.model,note:"larger"},
  ];
  const links=[
    {href:`/motorcycles/${c.a.makeSlug}/${c.a.slug}`,title:`${c.a.make} ${c.a.model}`,eyebrow:"Model",description:`${c.a.engineCc} cc · ${c.a.seatHeightMm} mm seat`},
    {href:`/motorcycles/${c.b.makeSlug}/${c.b.slug}`,title:`${c.b.make} ${c.b.model}`,eyebrow:"Model",description:`${c.b.engineCc} cc · ${c.b.seatHeightMm} mm seat`},
    {href:`/motorcycles/${c.a.makeSlug}/${c.a.slug}#tires-fitment`,title:`${c.a.model} tire size`,eyebrow:"Fitment",description:`${c.a.frontTire} / ${c.a.rearTire}`},
    {href:`/motorcycles/${c.b.makeSlug}/${c.b.slug}#tires-fitment`,title:`${c.b.model} tire size`,eyebrow:"Fitment",description:`${c.b.frontTire} / ${c.b.rearTire}`},
    {href:"/compare",title:"Compare other motorcycles",eyebrow:"Compare",description:"Build another side-by-side comparison."}
  ];
  const compareArticle=articleSchema({headline:`${c.a.make} ${c.a.model} vs ${c.b.make} ${c.b.model}`,description:brief?.opening||`Compare the ${c.a.make} ${c.a.model} and ${c.b.make} ${c.b.model} on checked Philippine prices, engine, dimensions, fuel and tires.`,path:`/compare/${c.slug}`,about:`${c.a.model} vs ${c.b.model} Philippines`,keywords:[`${c.a.model} vs ${c.b.model}`,`${c.a.model} or ${c.b.model}`,"motorcycle comparison Philippines"],checkedDates:[c.a.marketPriceCheckedAt||c.a.verifiedAt,c.b.marketPriceCheckedAt||c.b.verifiedAt]});return <section className={`page shell comparison-page ${styles.page}`}><Breadcrumbs items={[{label:"Compare",href:"/compare"},{label:`${c.a.model} vs ${c.b.model}`}]} />
    <header className={styles.hero}>
      <div className={styles.heroCopy}><span>Motorcycle comparison · Philippines</span><h1>{brief?.h1||`${c.a.make} ${c.a.model} vs ${c.b.make} ${c.b.model}`}</h1><p>{brief?.opening||`${c.summary}. Compare the current motorcycles with their prices, fit and grouped specifications.`}</p></div>
      <div className={styles.heroActions}><Link className={styles.primaryAction} href={`/get-quote/${c.a.makeSlug}/${c.a.slug}`}>Get {c.a.model} price</Link><Link className={styles.secondaryAction} href={`/get-quote/${c.b.makeSlug}/${c.b.slug}`}>Get {c.b.model} price</Link></div>
    </header>
    {!isIndexableComparison(slug)&&<InfoPanel subtle><h2>Custom comparison</h2><p>Check the dated price and specification sources on each motorcycle page before buying.</p></InfoPanel>}
    <ComparisonProductCards models={[c.a,c.b]}/>
    <div className={styles.deltaRail} aria-label="Key measurable differences">{deltas.map(item=><article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.lead} {item.note}</small></article>)}</div>
    <div className={styles.contentFlow}>
      <ComparisonDecisionWorkbench a={c.a} b={c.b}/>
      <ComparisonDecisionMatrix a={c.a} b={c.b}/>
      {brief?<><ComparisonEditorial a={c.a} b={c.b} brief={brief} phase="pre"/><DetailedMotorcycleCompare models={[c.a,c.b]} showProducts={false}/><ComparisonEditorial a={c.a} b={c.b} brief={brief} phase="post"/></>:<><ComparisonHighlights a={c.a} b={c.b}/><DetailedMotorcycleCompare models={[c.a,c.b]} showProducts={false}/></>}
      <RelatedLinks title="Open the model pages and sources" links={links}/>
    </div>
    <JsonLd data={compareArticle} />
  </section>;
}

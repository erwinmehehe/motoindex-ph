import type { Metadata } from "next";
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
  const links=[
    {href:`/motorcycles/${c.a.makeSlug}/${c.a.slug}`,title:`${c.a.make} ${c.a.model}`,eyebrow:"Model",description:`${c.a.engineCc} cc · ${c.a.seatHeightMm} mm seat`},
    {href:`/motorcycles/${c.b.makeSlug}/${c.b.slug}`,title:`${c.b.make} ${c.b.model}`,eyebrow:"Model",description:`${c.b.engineCc} cc · ${c.b.seatHeightMm} mm seat`},
    {href:`/motorcycles/${c.a.makeSlug}/${c.a.slug}#tires-fitment`,title:`${c.a.model} tire size`,eyebrow:"Fitment",description:`${c.a.frontTire} / ${c.a.rearTire}`},
    {href:`/motorcycles/${c.b.makeSlug}/${c.b.slug}#tires-fitment`,title:`${c.b.model} tire size`,eyebrow:"Fitment",description:`${c.b.frontTire} / ${c.b.rearTire}`},
    {href:"/compare",title:"Compare other motorcycles",eyebrow:"Compare",description:"Build another side-by-side comparison."}
  ];
  return <section className="page shell comparison-page"><Breadcrumbs items={[{label:"Compare",href:"/compare"},{label:`${c.a.model} vs ${c.b.model}`}]} />
    <div className="page-head comparison-page-head"><h1>{brief?.h1||`${c.a.make} ${c.a.model} vs ${c.b.make} ${c.b.model}`}</h1><p>{brief?.opening||`${c.summary}. Compare the current checked models with their images, price context and grouped specifications.`}</p></div>
    {!isIndexableComparison(slug)&&<div className="note-box"><h2>Custom comparison</h2><p>Check the dated price and specification sources on each motorcycle page before buying.</p></div>}
    <ComparisonProductCards models={[c.a,c.b]}/><ComparisonDecisionMatrix a={c.a} b={c.b}/>{brief?<><ComparisonEditorial a={c.a} b={c.b} brief={brief} phase="pre"/><DetailedMotorcycleCompare models={[c.a,c.b]} showProducts={false}/><ComparisonEditorial a={c.a} b={c.b} brief={brief} phase="post"/></>:<><ComparisonHighlights a={c.a} b={c.b}/><DetailedMotorcycleCompare models={[c.a,c.b]} showProducts={false}/></>}<RelatedLinks title="Open the model pages and sources" links={links}/>
  </section>;
}

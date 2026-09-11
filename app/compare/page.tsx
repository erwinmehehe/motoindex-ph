import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { comparisons, getComparison, isIndexableComparison, publicMotorcycles } from "@/lib/data";
import { CompareBuilder } from "@/components/CompareBuilder";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";
import { forClient } from "@/lib/competitors";

const compareModels=publicMotorcycles;
const publicComparisons=comparisons.filter(c=>isIndexableComparison(c.slug));
export const metadata: Metadata = pageMetadata({ title: 'Compare Motorcycles Philippines', description: 'Compare two or three current Philippine motorcycles for market price, engine, weight, seat height, fuel tank, tires and brakes.', path: '/compare', index: compareModels.length>=2 });
export default function CompareIndex(){return <section className="page shell"><div className="page-head"><span className="entity-kicker">Motorcycle comparison</span><h1>Compare motorcycles side by side.</h1><p>Choose two or three current motorcycles and compare prices, engine, rider fit, fuel, tires and braking from the same model records used across MotoIndex.</p></div>{compareModels.length>=2?<CompareBuilder models={forClient(compareModels)}/>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}{publicComparisons.length>0&&<><div className="section-head compact compare-popular-head"><div><span className="section-kicker">Popular comparisons</span><h2>Start with a common pair</h2></div></div><div className="list-cards">{publicComparisons.map(c=>{const data=getComparison(c.slug);if(!data)return null;const brief=getComparisonEditorialBrief(c.slug);return <Link key={c.slug} href={`/compare/${c.slug}`}><span><strong>{brief?.primaryKeyword||`${data.a.model} vs ${data.b.model}`}</strong><small>{brief?.intent||c.summary}</small></span><b>Compare →</b></Link>})}</div></>}</section>}

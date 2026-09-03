import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { comparisons, getComparison, isIndexableComparison, publicMotorcycles } from "@/lib/data";
import { CompareBuilder } from "@/components/CompareBuilder";
import { getComparisonEditorialBrief } from "@/lib/comparisonEditorial";

const compareModels=publicMotorcycles;
const publicComparisons=comparisons.filter(c=>isIndexableComparison(c.slug));
export const metadata: Metadata = pageMetadata({ title: 'Compare Motorcycles Philippines', description: 'Compare two or three current Philippine motorcycles for market price, engine, weight, seat height, fuel tank, tires and brakes.', path: '/compare', index: compareModels.length>=2 });
export default function CompareIndex(){return <section className="page shell"><div className="page-head"><h1>Compare two or three motorcycles.</h1><p>Put current prices and core specifications side by side. Where several price sources exist, the table shows the observed range instead of averaging them into one figure.</p></div>{compareModels.length>=2?<CompareBuilder models={compareModels}/>:<div className="note-box"><h2>Not enough current models</h2><p>At least two current motorcycle records are needed to build a comparison.</p></div>}{publicComparisons.length>0&&<><div className="section-head compact compare-popular-head"><div><h2>Start with these pairs</h2></div></div><div className="list-cards">{publicComparisons.map(c=>{const data=getComparison(c.slug);if(!data)return null;const brief=getComparisonEditorialBrief(c.slug);return <Link key={c.slug} href={`/compare/${c.slug}`}><span><strong>{brief?.primaryKeyword||`${data.a.model} vs ${data.b.model}`}</strong><small>{brief?.intent||c.summary}</small></span><b>Compare →</b></Link>})}</div></>}</section>}

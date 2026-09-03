import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { recommendationGuides, getRecommendationModels, isIndexableRecommendation } from "@/lib/data";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
const publicGuides = recommendationGuides.filter(g=>isIndexableRecommendation(g.slug));
export const metadata: Metadata = pageMetadata({ title: 'Motorcycle Buying Guides Philippines', description: 'Compare current Philippine motorcycles by budget, seat height, weight, fuel economy, ABS and riding use.', path: '/recommendations', index: publicGuides.length>0 });
export default function RecommendationsPage(){return <section className="page shell"><div className="page-head"><h1>Compare motorcycles by budget, size and use.</h1><p>Each guide uses current motorcycle records and states the factors used to order the list.</p></div>{publicGuides.length===0?<div className="note-box"><h2>Guides are being updated</h2><p>There are not enough current records to publish these lists yet.</p></div>:<div className="guide-grid">{publicGuides.map(g=>{const models=getRecommendationModels(g.slug);return <Link key={g.slug} href={`/recommendations/${g.slug}`} className="guide-card"><h2>{g.title}</h2><p>{g.description}</p><div className="guide-preview">{models.slice(0,3).map(m=><span key={m.id}>{m.make} {m.model} <b>{observedMarketPriceLabel(m)}</b></span>)}</div><strong className="guide-link">Open guide →</strong></Link>})}</div>}</section>}

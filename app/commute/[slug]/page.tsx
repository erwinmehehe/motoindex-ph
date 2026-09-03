import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/site";
import { commuteGuides, commuteGuideModels, getCommuteGuide, isIndexableCommuteGuide } from "@/lib/commute";
import { CommuteRankCard } from "@/components/CommuteRankCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams(){return commuteGuides.map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const guide=getCommuteGuide(slug);return guide?pageMetadata({title:guide.title,description:guide.description,path:`/commute/${slug}`,index:isIndexableCommuteGuide(slug)}):{};}
export default async function CommuteGuidePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const guide=getCommuteGuide(slug);if(!guide)return notFound();const ordered=commuteGuideModels(slug);return <section className="page shell"><Breadcrumbs items={[{label:"Commuting",href:"/commute"},{label:guide.title}]}/><div className="page-head"><h1>{guide.title}</h1><p>{guide.description}</p></div><div className="method-card"><div><h2>The factors used</h2></div><ul>{guide.criteria.map(c=><li key={c}>{c}</li>)}</ul><small>The order uses only the fields listed above. It does not measure crash risk, real passenger comfort, lane-filtering ability, delivery-platform eligibility or actual travel time.</small></div><div className="commute-rank-list">{ordered.map(r=><CommuteRankCard key={r.model.id} model={r.model} reasons={r.reasons}/>)}</div><div className="note-box"><h2>Monthly cost shown on these cards</h2><p>The estimate uses 20 km/day, 22 commute days, ₱65/L fuel and a maintenance reserve. Change those assumptions in the commute calculator.</p></div></section>}

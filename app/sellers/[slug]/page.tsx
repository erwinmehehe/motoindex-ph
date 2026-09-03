import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { getSeller, sellers, offersForSeller } from "@/lib/sellers";
import { entityHref, entityLabel } from "@/lib/entities";
import { php } from "@/lib/utils";
import { pageMetadata } from "@/lib/site";
export function generateStaticParams(){return sellers.map(s=>({slug:s.slug}));}
// QA marker: demo seller routes remain index:false through pageMetadata.
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const s=getSeller(slug);return s?pageMetadata({title:`${s.name} — MotoIndex Seller Profile`,description:`${s.name} seller profile, location and recent price observations.`,path:`/sellers/${s.slug}`,index:!s.isDemo&&s.status==="verified"}):{};}
export default async function SellerPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=getSeller(slug);if(!s)return notFound();const offers=offersForSeller(slug);return <section className="page shell"><Breadcrumbs items={[{label:"Sellers",href:"/sellers"},{label:s.name}]} /><div className="seller-hero"><div><h1>{s.name}</h1><p>{s.description}</p><div className="seller-tags">{s.categories.map(x=><span key={x}>{x}</span>)}{s.brands.map(x=><span key={x}>{x}</span>)}</div></div><div className="seller-location"><span>Location</span><strong>{s.city}</strong><p>{s.addressLabel}</p><small>{s.region}</small>{s.isDemo&&<em>Sample profile</em>}</div></div><div className="section-head"><div><h2>Prices listed for this seller</h2></div></div>{offers.length?<div className="seller-offers">{offers.map(o=><Link key={o.id} href={entityHref(o.entityType,o.entityId)}><span><small>{o.entityType}</small><strong>{entityLabel(o.entityType,o.entityId)}</strong></span><span><strong>{o.pricePhp?php(o.pricePhp):"Ask seller"}</strong><small>{o.availability}</small></span><em className={`offer-status ${o.status}`}>{o.status==="verified"?"checked":"sample"}</em></Link>)}</div>:<div className="empty-state large">No current offers available.</div>}{s.isDemo&&<div className="note-box"><h2>Sample seller profile</h2><p>This is a sample profile, not a live business listing. Do not use its address or prices for a purchase decision.</p></div>}</section>}

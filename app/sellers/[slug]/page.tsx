import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { getPublicSeller, publicSellers, offersForSeller } from "@/lib/sellers";
import { entityHref, entityLabel } from "@/lib/entities";
import { php } from "@/lib/utils";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams(){return publicSellers().map(s=>({slug:s.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const s=getPublicSeller(slug);
  return s?pageMetadata({title:`${s.name} — MotoIndex Seller Profile`,description:`${s.name} seller profile, location and recent price observations.`,path:`/sellers/${s.slug}`,index:true}):{};
}

export default async function SellerPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=getPublicSeller(slug);
  if(!s)return notFound();
  const offers=offersForSeller(slug).filter(o=>o.status==="verified");
  const parent = s.type === "dealer" ? {label:"Dealers",href:"/dealers"} : {label:"Sellers"};
  return <section className="page shell">
    <Breadcrumbs items={[parent,{label:s.name}]} />
    <div className="seller-hero"><div><span className="entity-kicker">Verified seller</span><h1>{s.name}</h1><p>{s.description}</p><div className="seller-tags">{s.categories.map(x=><span key={x}>{x}</span>)}{s.brands.map(x=><span key={x}>{x}</span>)}</div></div><div className="seller-location"><span>Location</span><strong>{s.city}</strong><p>{s.addressLabel}</p><small>{s.region}</small></div></div>
    <div className="section-head"><div><h2>Checked prices from this seller</h2></div></div>
    {offers.length?<div className="seller-offers">{offers.map(o=><Link key={o.id} href={entityHref(o.entityType,o.entityId)}><span><small>{o.entityType}</small><strong>{entityLabel(o.entityType,o.entityId)}</strong></span><span><strong>{o.pricePhp?php(o.pricePhp):"Ask seller"}</strong><small>{o.availability}</small></span><em className="offer-status verified">checked</em></Link>)}</div>:<div className="empty-state large">No current verified offers available.</div>}
  </section>;
}

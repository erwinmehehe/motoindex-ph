import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { getPublicSeller, publicSellers, offersForSeller } from "@/lib/sellers";
import { entityHref, entityLabel } from "@/lib/entities";
import { php } from "@/lib/utils";
import { absoluteUrl, pageMetadata } from "@/lib/site";

export function generateStaticParams(){return publicSellers().map(s=>({slug:s.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const s=getPublicSeller(slug);
  return s?pageMetadata({
    title:`${s.name}: Dealer Details & Contact`,
    description:`${s.name} in ${s.city}: checked address, phone, supported motorcycle brands and official dealer-source details.`,
    path:`/sellers/${s.slug}`,
    index:true
  }):{};
}

function phoneHref(phone:string){return `tel:${phone.replace(/[^+\d]/g,"")}`;}

export default async function SellerPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const s=getPublicSeller(slug);
  if(!s)return notFound();
  const offers=offersForSeller(slug).filter(o=>o.status==="verified");
  const parent = s.type === "dealer" ? {label:"Dealers",href:"/dealers"} : {label:"Sellers"};

  const localBusinessSchema={
    "@context":"https://schema.org",
    "@type":"LocalBusiness",
    name:s.name,
    url:absoluteUrl(`/sellers/${s.slug}`),
    telephone:s.phoneLabel,
    address:{
      "@type":"PostalAddress",
      streetAddress:s.addressLabel,
      addressLocality:s.city,
      addressRegion:s.province||s.region,
      addressCountry:"PH"
    },
    sameAs:s.sourceUrl?[s.sourceUrl]:undefined
  };

  return <section className="page shell">
    <JsonLd data={localBusinessSchema} />
    <Breadcrumbs items={[parent,{label:s.name}]} />
    <div className="seller-hero">
      <div>
        <span className="entity-kicker">Official listing checked</span>
        <h1>{s.name}</h1>
        <p>{s.description}</p>
        <div className="seller-tags">{s.categories.map(x=><span key={x}>{x}</span>)}{s.brands.map(x=><span key={x}>{x}</span>)}</div>
      </div>
      <div className="seller-location">
        <span>Location</span>
        <strong>{s.city}</strong>
        <p>{s.addressLabel}</p>
        <small>{s.province||s.region}</small>
        {s.phoneLabel?<a className="seller-phone" href={phoneHref(s.phoneLabel)}>{s.phoneLabel}</a>:null}
      </div>
    </div>

    <section className="dealer-profile-trust">
      <div>
        <span className="section-kicker">Listing check</span>
        <h2>Branch appears in an official dealer source</h2>
        <p>{s.verificationNote||"This public profile has an official source on file for its business details."}</p>
      </div>
      {s.sourceUrl?<a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">Open official dealer listing ↗</a>:null}
    </section>

    <div className="section-head"><div>
      <h2>Checked prices from this dealer</h2>
      <p>Dealer profile verification does not automatically verify stock or pricing. Price offers appear here only after a separate current price check.</p>
    </div></div>
    {offers.length?<div className="seller-offers">{offers.map(o=><Link key={o.id} href={entityHref(o.entityType,o.entityId)}><span><small>{o.entityType}</small><strong>{entityLabel(o.entityType,o.entityId)}</strong></span><span><strong>{o.pricePhp?php(o.pricePhp):"Ask seller"}</strong><small>{o.availability}</small></span><em className="offer-status verified">checked</em></Link>)}</div>:<div className="empty-state large">No current checked price offers from this branch.</div>}
  </section>;
}

import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { helmetProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EntityMedia } from "@/components/EntityMedia";
import { HelmetComparePicker } from "@/components/HelmetComparePicker";
import { AffiliateOffer } from "@/components/AffiliateOffer";
import { forClient } from "@/lib/competitors";

export const metadata:Metadata=pageMetadata({title:"Compare Motorcycle Helmets Philippines: Side by Side",description:"Compare motorcycle helmet prices, sizing, shell construction, visor equipment, certification and intercom provision side by side.",path:"/gear/helmets/compare",index:true});
const php=(n?:number)=>n?`₱${n.toLocaleString("en-PH")}`:"Not published";
type Product=(typeof helmetProducts)[number];
type Row={label:string;get:(p:Product)=>string;note?:string};
const sections:{title:string;rows:Row[]}[]=[
  {title:"Price & identity",rows:[
    {label:"Observed price",get:p=>php(p.priceFromPhp),note:"Starting price from the checked source; seller, size and graphic can change it."},
    {label:"Helmet type",get:p=>p.helmetType},
    {label:"Availability",get:p=>p.stockStatus||"Check current seller stock"},
    {label:"Variants / graphics",get:p=>p.variants?.length?p.variants.join(" · "):"Check product page"},
  ]},
  {title:"Fit & construction",rows:[
    {label:"Sizes listed",get:p=>p.sizes.length?p.sizes.join(" · "):"Check current size chart"},
    {label:"Weight",get:p=>p.weightG?`${p.weightG.toLocaleString("en-PH")} g`:"Not published"},
    {label:"Shell",get:p=>p.shell||"Not confirmed"},
    {label:"Intercom provision",get:p=>p.intercomReady?"Listed":"Not listed / confirm clearance"},
  ]},
  {title:"Visor & equipment",rows:[
    {label:"Visor",get:p=>p.visor||"Not published"},
    {label:"Pinlock",get:p=>p.pinlock||"Not listed"},
    {label:"Replacement visors",get:p=>p.replacementVisors?.length?p.replacementVisors.join(" · "):"Check current parts availability"},
    {label:"Colors listed",get:p=>p.colors?.length?p.colors.join(" · "):"Check current variants"},
  ]},
  {title:"Certification & checks",rows:[
    {label:"Certification evidence",get:p=>p.certification||"Check exact local unit",note:"Always inspect the conformity marking on the exact helmet sold in the Philippines."},
    {label:"Product source",get:p=>p.sourceLabel||"Source page"},
    {label:"Last checked",get:p=>p.lastChecked||"Date pending"},
  ]},
];

export default async function HelmetComparePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const params=await searchParams;
  const ids=[params.a,params.b,params.c].filter((v):v is string=>typeof v==="string");
  const products=helmetProducts.filter(p=>p.status==="verified");
  const selected=ids.map(id=>products.find(p=>p.id===id)).filter(Boolean) as Product[];
  return <section className="page shell"><Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Compare"}]}/><div className="page-head"><h1>Compare checked helmets side by side</h1><p>Choose two or three verified products. The comparison keeps the selected helmet images visible and groups the checked price, fit, construction, visor and certification data for faster scanning.</p></div><HelmetComparePicker products={forClient(products)} selected={selected.map(p=>p.id)}/>
  <div className="section-head inline-head"><div><h2>How to compare helmets properly</h2><p>Choose exact models instead of comparing brands as if every helmet under one badge is the same.</p></div></div>
  <div className="topic-grid">
    <article><h2>Fit first</h2><p>Compare the exact size chart and shell shape. A feature-rich helmet is still the wrong choice if it does not fit securely.</p></article>
    <article><h2>Then compare equipment</h2><p>Look at shell construction, visor, Pinlock support, weight, intercom provision and replacement-parts availability.</p></article>
    <article><h2>Verify certification</h2><p>Certification belongs to the exact model and market. For Philippine use, inspect the actual helmet for the applicable PS or ICC conformity marking.</p></article>
  </div>
  {selected.length<2?<div className="empty-state"><h2>Choose at least two helmets</h2><p>Use the selectors above or start in the Helmet Finder and select products there.</p><Link className="button" href="/gear/helmets/finder">Open Helmet Finder</Link></div>:<>
    <div className={`helmet-comparison-grid cols-${selected.length}`}>{selected.map(p=><article key={p.id}><EntityMedia entityType="helmet" entityId={p.id} className="helmet-compare-media" fallback={<div className="product-art"><span>Image unavailable</span></div>} showCredit={false}/><span className="compare-product-brand">{p.brand}</span><h2>{p.model}</h2><strong>{php(p.priceFromPhp)}</strong><small>{p.helmetType} · checked {p.lastChecked||"date pending"}</small><Link href={`/gear/helmets/${p.brandSlug}/${p.slug}`}>View full details →</Link><AffiliateOffer productId={p.id} productName={`${p.brand} ${p.model}`} compact/></article>)}</div>
    <div className="compare-difference-key"><span className="difference-swatch" aria-hidden="true"/> <strong>Different values are highlighted</strong><span>without declaring a universal winner.</span></div>
    <div className="helmet-compare-wrap" role="region" aria-label="Helmet specification comparison" tabIndex={0}><table className="helmet-spec-table detailed-helmet-table"><thead><tr><th scope="col">Specification</th>{selected.map(p=><th scope="col" key={p.id}>{p.brand}<strong>{p.model}</strong></th>)}</tr></thead><tbody>{sections.map(section=><Fragment key={section.title}><tr className="compare-section-row"><th colSpan={selected.length+1}>{section.title}</th></tr>{section.rows.map(row=>{const values=selected.map(row.get);const differs=new Set(values.map(v=>v.trim().toLowerCase())).size>1;return <tr className={differs?"has-difference":""} key={`${section.title}-${row.label}`}><th scope="row"><span>{row.label}</span>{row.note&&<small>{row.note}</small>}</th>{selected.map((p,index)=><td className={differs?"compare-diff":""} key={p.id}>{values[index]}</td>)}</tr>})}</Fragment>)}</tbody></table></div>
    <div className="note-box"><h2>Use the exact checked product, not a brand assumption</h2><p>Certification, shell, visor and accessories can vary by model, market and variant. For a Philippine purchase, inspect the exact helmet received for the required PS or ICC conformity marking and verify the seller&apos;s current listing.</p></div>
  </>}</section>;
}

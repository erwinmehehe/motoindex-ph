"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { HelmetProduct } from "@/lib/types";
import { EntityMedia } from "@/components/EntityMedia";
import { AffiliateOffer } from "@/components/AffiliateOffer";

const php=(n?:number)=>n?`₱${n.toLocaleString("en-PH")}`:"Not published";
type Product=HelmetProduct;
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

export function HelmetCompareClient({products}:{products:HelmetProduct[]}){
  const [selectedIds,setSelectedIds]=useState<string[]>([]);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const ids=[params.get("a"),params.get("b"),params.get("c")].filter((id):id is string=>Boolean(id));
    const valid=[...new Set(ids)].filter(id=>products.some(p=>p.id===id)).slice(0,3);
    setSelectedIds(valid);
  },[products]);

  const values=[selectedIds[0]||"",selectedIds[1]||"",selectedIds[2]||""];
  const selected=useMemo(()=>selectedIds.map(id=>products.find(p=>p.id===id)).filter((p):p is HelmetProduct=>Boolean(p)),[selectedIds,products]);

  function setAt(index:number,value:string){
    const next=[...values];next[index]=value;
    const unique=next.filter((id,i)=>id&&next.indexOf(id)===i);
    setSelectedIds(unique);
    const q=new URLSearchParams();unique.forEach((id,i)=>q.set(["a","b","c"][i],id));
    window.history.replaceState(null,"",`/gear/helmets/compare${q.toString()?`?${q}`:""}`);
  }

  return <>
    <div className="helmet-compare-picker"><div className="helmet-compare-picks">{values.map((value,i)=><label key={i}><span>{i===0?"Helmet A":i===1?"Helmet B":"Optional helmet C"}</span><select value={value} onChange={e=>setAt(i,e.target.value)}><option value="">Choose a helmet</option>{products.map(p=><option key={p.id} value={p.id} disabled={values.some((v,j)=>j!==i&&v===p.id)}>{p.brand} {p.model}</option>)}</select></label>)}</div></div>

    <div className="section-head inline-head"><div><h2>How to compare helmets properly</h2><p>Choose exact models instead of comparing brands as if every helmet under one badge is the same.</p></div></div>
    <div className="topic-grid">
      <article><h2>Fit first</h2><p>Compare the exact size chart and shell shape. A feature-rich helmet is still the wrong choice if it does not fit securely.</p></article>
      <article><h2>Then compare equipment</h2><p>Look at shell construction, visor, Pinlock support, weight, intercom provision and replacement-parts availability.</p></article>
      <article><h2>Verify certification</h2><p>Certification belongs to the exact model and market. For Philippine use, inspect the actual helmet for the applicable PS or ICC conformity marking.</p></article>
    </div>

    {selected.length<2?<div className="empty-state"><h2>Choose at least two helmets</h2><p>Use the selectors above or start in the Helmet Finder and select products there.</p><Link className="button" href="/gear/helmets/finder">Open Helmet Finder</Link></div>:<>
      <div className={`helmet-comparison-grid cols-${selected.length}`}>{selected.map(p=><article key={p.id}><EntityMedia entityType="helmet" entityId={p.id} className="helmet-compare-media" fallback={<div className="product-art"><span>Image unavailable</span></div>} showCredit={false}/><span className="compare-product-brand">{p.brand}</span><h2>{p.model}</h2><strong>{php(p.priceFromPhp)}</strong><small>{p.helmetType} · checked {p.lastChecked||"date pending"}</small><Link href={`/gear/helmets/${p.brandSlug}/${p.slug}`}>View full details →</Link><AffiliateOffer productId={p.id} productName={`${p.brand} ${p.model}`} compact/></article>)}</div>
      <div className="compare-difference-key"><span className="difference-swatch" aria-hidden="true"/> <strong>Different values are highlighted</strong><span>without declaring a universal winner.</span></div>
      <div className="helmet-compare-wrap" role="region" aria-label="Helmet specification comparison" tabIndex={0}><table className="helmet-spec-table detailed-helmet-table"><thead><tr><th scope="col">Specification</th>{selected.map(p=><th scope="col" key={p.id}>{p.brand}<strong>{p.model}</strong></th>)}</tr></thead><tbody>{sections.map(section=><Fragment key={section.title}><tr className="compare-section-row"><th colSpan={selected.length+1}>{section.title}</th></tr>{section.rows.map(row=>{const values=row.get?selected.map(row.get):[];const differs=new Set(values.map(v=>v.trim().toLowerCase())).size>1;return <tr className={differs?"has-difference":""} key={`${section.title}-${row.label}`}><th scope="row"><span>{row.label}</span>{row.note&&<small>{row.note}</small>}</th>{selected.map((p,index)=><td className={differs?"compare-diff":""} key={p.id}>{values[index]}</td>)}</tr>})}</Fragment>)}</tbody></table></div>
      <div className="note-box"><h2>Use the exact checked product, not a brand assumption</h2><p>Certification, shell, visor and accessories can vary by model, market and variant. For a Philippine purchase, inspect the exact helmet received for the required PS or ICC conformity marking and verify the seller&apos;s current listing.</p></div>
    </>}
  </>;
}

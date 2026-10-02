"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PriceListBike = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  category: string;
  engineCc: number;
  transmission?: string;
  srp: number;
};

const priorityBrands = ["all","honda","yamaha","suzuki","kawasaki","ktm","cfmoto"] as const;
const PAGE_SIZE = 16;
const columns = { gridTemplateColumns: "minmax(180px,1.4fr) minmax(100px,.8fr) minmax(140px,1fr) minmax(100px,.7fr) minmax(120px,.8fr) minmax(110px,.8fr)" };

export function PriceListExplorer({ bikes }: { bikes: PriceListBike[] }) {
  const [brand,setBrand]=useState("all");
  const [query,setQuery]=useState("");
  const [sort,setSort]=useState<"model"|"price-asc"|"price-desc"|"cc">("model");
  const [page,setPage]=useState(1);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    const rows=bikes.filter((bike)=>
      (brand==="all"||bike.makeSlug===brand) &&
      (!q||[bike.make,bike.model,bike.category,String(bike.engineCc)].some(v=>v.toLowerCase().includes(q)))
    );
    rows.sort((a,b)=>{
      if(sort==="price-asc") return a.srp-b.srp;
      if(sort==="price-desc") return b.srp-a.srp;
      if(sort==="cc") return a.engineCc-b.engineCc||a.model.localeCompare(b.model);
      return a.make.localeCompare(b.make)||a.model.localeCompare(b.model);
    });
    return rows;
  },[bikes,brand,query,sort]);

  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
  const safePage=Math.min(page,pages);
  const visible=filtered.slice((safePage-1)*PAGE_SIZE,safePage*PAGE_SIZE);

  function chooseBrand(next:string){setBrand(next);setPage(1)}
  function updateQuery(next:string){setQuery(next);setPage(1)}

  return <>
    <div className="finder-toolbar">
      <div style={{display:"flex",flexWrap:"wrap",gap:8}} aria-label="Filter price list by brand">
        {priorityBrands.map((slug)=>{
          const label=slug==="all"?"All brands":slug==="cfmoto"?"CFMOTO":slug[0].toUpperCase()+slug.slice(1);
          return <button type="button" key={slug} className={brand===slug?"button small":"button ghost small"} aria-pressed={brand===slug} onClick={()=>chooseBrand(slug)}>{label}</button>;
        })}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        <input type="search" value={query} onChange={e=>updateQuery(e.target.value)} placeholder="Search models, brands or engine cc" aria-label="Search motorcycle price list" style={{minHeight:44,minWidth:240,padding:"0 12px"}}/>
        <select value={sort} onChange={e=>{setSort(e.target.value as typeof sort);setPage(1)}} aria-label="Sort motorcycle price list" style={{minHeight:44,padding:"0 12px"}}>
          <option value="model">Brand & model</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="cc">Engine CC</option>
        </select>
        <button className="button small" type="button" onClick={()=>window.print()}>Save price list PDF</button>
      </div>
    </div>

    <div className="ui-data-table" role="table" aria-label="Motorcycle price list Philippines">
      <div className="ui-data-table__inner">
        <div className="head" role="row" style={columns}><span>Model</span><span>Brand</span><span>Category</span><span>Displacement</span><span>Transmission</span><span>SRP</span></div>
        {visible.map(bike=><div role="row" style={columns} key={bike.id}>
          <strong><Link href={`/motorcycles/${bike.makeSlug}/${bike.slug}`}>{bike.model}</Link></strong>
          <span><Link href={`/motorcycles/${bike.makeSlug}`}>{bike.make}</Link></span>
          <span>{bike.category}</span><span>{bike.engineCc} cc</span><span>{bike.transmission||"—"}</span><strong>₱{bike.srp.toLocaleString("en-PH")}</strong>
        </div>)}
        {!visible.length&&<div role="row"><span>No motorcycles match these filters.</span></div>}
      </div>
    </div>

    <div className="finder-toolbar" style={{marginTop:16}}>
      <p>Showing {visible.length?((safePage-1)*PAGE_SIZE)+1:0}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length} motorcycles</p>
      <div>
        <button type="button" className="button ghost small" disabled={safePage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page">Previous</button>
        {Array.from({length:Math.min(5,pages)},(_,i)=>{
          let n=i+1;
          if(pages>5&&safePage>3) n=Math.min(pages-4,safePage-2)+i;
          return <button type="button" key={n} className={safePage===n?"button small":"button ghost small"} onClick={()=>setPage(n)} aria-current={safePage===n?"page":undefined}>{n}</button>
        })}
        <button type="button" className="button ghost small" disabled={safePage>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} aria-label="Next page">Next</button>
      </div>
    </div>
  </>;
}

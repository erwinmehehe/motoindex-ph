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
    <div className="price-list-toolbar">
      <div className="price-list-filter-row" aria-label="Filter price list by brand">
        {priorityBrands.map((slug)=>{
          const label=slug==="all"?"All brands":slug==="cfmoto"?"CFMOTO":slug[0].toUpperCase()+slug.slice(1);
          return <button type="button" key={slug} className={`price-filter ${brand===slug?"active":""}`} aria-pressed={brand===slug} onClick={()=>chooseBrand(slug)}>{label}</button>;
        })}
      </div>
      <input className="price-list-search" type="search" value={query} onChange={e=>updateQuery(e.target.value)} placeholder="Search models, brands or engine cc" aria-label="Search motorcycle price list"/>
      <select className="price-filter" value={sort} onChange={e=>{setSort(e.target.value as typeof sort);setPage(1)}} aria-label="Sort motorcycle price list">
        <option value="model">Brand & model</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="cc">Engine CC</option>
      </select>
      <button className="button small" type="button" onClick={()=>window.print()}>Save price list PDF</button>
    </div>

    <div className="price-list-table-wrap">
      <table className="price-list-table">
        <thead><tr><th>Model</th><th>Brand</th><th>Category</th><th>Displacement</th><th>Transmission</th><th>SRP</th></tr></thead>
        <tbody>
          {visible.map(bike=><tr key={bike.id}>
            <td><Link href={`/motorcycles/${bike.makeSlug}/${bike.slug}`}>{bike.model}</Link></td>
            <td><Link href={`/motorcycles/${bike.makeSlug}`}>{bike.make}</Link></td>
            <td>{bike.category}</td><td>{bike.engineCc} cc</td><td>{bike.transmission||"—"}</td><td className="price-cell">₱{bike.srp.toLocaleString("en-PH")}</td>
          </tr>)}
          {!visible.length&&<tr><td colSpan={6}>No motorcycles match these filters.</td></tr>}
        </tbody>
      </table>
    </div>

    <div className="price-list-footer">
      <span>Showing {visible.length?((safePage-1)*PAGE_SIZE)+1:0}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length} motorcycles</span>
      <div className="price-pagination" aria-label="Price list pages">
        <button type="button" disabled={safePage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page">‹</button>
        {Array.from({length:Math.min(5,pages)},(_,i)=>{
          let n=i+1;
          if(pages>5&&safePage>3) n=Math.min(pages-4,safePage-2)+i;
          return <button type="button" key={n} className={safePage===n?"active":""} onClick={()=>setPage(n)} aria-current={safePage===n?"page":undefined}>{n}</button>
        })}
        <button type="button" disabled={safePage>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} aria-label="Next page">›</button>
      </div>
    </div>
  </>;
}

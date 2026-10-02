"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./PriceListExplorer.module.css";

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
  function downloadCsv(){
    const header=["Model","Brand","Category","Displacement","Transmission","SRP"];
    const rows=filtered.map(bike=>[
      bike.model,bike.make,bike.category,`${bike.engineCc} cc`,bike.transmission||"",String(bike.srp)
    ]);
    const csv=[header,...rows].map(row=>row.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const href=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=href;
    link.download="motoindex-ph-motorcycle-price-list.csv";
    link.click();
    URL.revokeObjectURL(href);
  }

  return <div className={styles.explorer}>
    <div className={styles.toolbar}>
      <div className={styles.brandFilters} aria-label="Filter price list by brand">
        {priorityBrands.map((slug)=>{
          const label=slug==="all"?"All brands":slug==="cfmoto"?"CFMOTO":slug[0].toUpperCase()+slug.slice(1);
          return <button type="button" key={slug} className={styles.brandButton} aria-pressed={brand===slug} onClick={()=>chooseBrand(slug)}>{label}</button>;
        })}
      </div>
      <div className={styles.controls}>
        <label className={styles.searchWrap}>
          <span aria-hidden="true">⌕</span>
          <input className={styles.search} type="search" value={query} onChange={e=>updateQuery(e.target.value)} placeholder="Search models or brands" aria-label="Search motorcycle price list"/>
        </label>
        <select className={styles.sort} value={sort} onChange={e=>{setSort(e.target.value as typeof sort);setPage(1)}} aria-label="Sort motorcycle price list">
          <option value="model">Brand & model</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="cc">Engine CC</option>
        </select>
        <button className={styles.download} type="button" onClick={downloadCsv}>Download CSV</button>
      </div>
    </div>

    <div className={styles.tableShell}>
      <table className={styles.table}>
        <caption className="sr-only">Current motorcycle price list in the Philippines</caption>
        <thead>
          <tr><th scope="col">Model</th><th scope="col">Brand</th><th scope="col">Category</th><th scope="col">Displacement</th><th scope="col">Transmission</th><th scope="col">SRP</th></tr>
        </thead>
        <tbody>
          {visible.map(bike=><tr key={bike.id}>
            <th scope="row" className={styles.modelCell}><Link href={`/motorcycles/${bike.makeSlug}/${bike.slug}`}>{bike.model}</Link><small>{bike.category}</small></th>
            <td><Link className={styles.brandLink} href={`/motorcycles/${bike.makeSlug}`}>{bike.make}</Link></td>
            <td>{bike.category}</td>
            <td>{bike.engineCc} cc</td>
            <td>{bike.transmission||"—"}</td>
            <td><strong className={styles.price}>₱{bike.srp.toLocaleString("en-PH")}</strong></td>
          </tr>)}
          {!visible.length&&<tr><td className={styles.empty} colSpan={6}>No motorcycles match these filters.</td></tr>}
        </tbody>
      </table>
    </div>

    <div className={styles.footer}>
      <p>Showing {visible.length?((safePage-1)*PAGE_SIZE)+1:0}–{Math.min(safePage*PAGE_SIZE,filtered.length)} of {filtered.length} motorcycles</p>
      <div className={styles.pagination}>
        <button type="button" className={styles.pageButton} disabled={safePage<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page">Previous</button>
        {Array.from({length:Math.min(5,pages)},(_,i)=>{
          let n=i+1;
          if(pages>5&&safePage>3) n=Math.min(pages-4,safePage-2)+i;
          return <button type="button" key={n} className={styles.pageButton} onClick={()=>setPage(n)} aria-current={safePage===n?"page":undefined}>{n}</button>
        })}
        <button type="button" className={styles.pageButton} disabled={safePage>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} aria-label="Next page">Next</button>
      </div>
    </div>
  </div>;
}

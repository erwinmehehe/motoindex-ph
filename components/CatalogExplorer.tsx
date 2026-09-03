"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Item = { id:string; category:string; brand:string; model:string; slug:string; detail:string; status:"research"|"verified" };
export function CatalogExplorer({ items }: { items: Item[] }) {
  const [q,setQ]=useState(""); const [category,setCategory]=useState("All"); const [brand,setBrand]=useState("All");
  const categories=["All",...Array.from(new Set(items.map(i=>i.category)))];
  const brands=["All",...Array.from(new Set(items.map(i=>i.brand))).sort()];
  const filtered=useMemo(()=>items.filter(i => (category==="All"||i.category===category) && (brand==="All"||i.brand===brand) && `${i.brand} ${i.model} ${i.detail}`.toLowerCase().includes(q.toLowerCase())),[items,q,category,brand]);
  return <>
    <div className="catalog-filter"><input aria-label="Search catalog" placeholder="Search helmet, tire, top box..." value={q} onChange={e=>setQ(e.target.value)}/><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={brand} onChange={e=>setBrand(e.target.value)}>{brands.map(b=><option key={b}>{b}</option>)}</select></div>
    <div className="result-meta"><b>{filtered.length}</b> catalog records · verify fitment and current price before purchase</div>
    <div className="catalog-list">{filtered.map(i=><Link key={i.id} href={i.slug}><span className="catalog-letter">{i.category[0]}</span><span><small>{i.category} · {i.brand}</small><strong>{i.model}</strong><em>{i.detail}</em></span><span className={`catalog-status ${i.status}`}>{i.status}</span><b>Open →</b></Link>)}</div>
  </>;
}

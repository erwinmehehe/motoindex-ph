"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ReviewedHelmetItem = { id: string; brand: string; model: string; href: string; type: string; price?: number; image: string; alt: string };

export function ReviewedHelmetExplorer({ items }: { items: ReviewedHelmetItem[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("price");
  const [limit, setLimit] = useState(24);
  const filtered = useMemo(() => items.filter(item => (!brand || item.brand === brand) && (!type || item.type === type) && `${item.brand} ${item.model}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => sort === "name" ? `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`) : (a.price ?? Infinity) - (b.price ?? Infinity)), [items,query,brand,type,sort]);
  return <section className="reviewed-helmet-explorer" aria-label="Browse helmets">
    <div className="reviewed-helmet-filters"><input aria-label="Search helmets" type="search" placeholder="Search helmets…" value={query} onChange={e => {setQuery(e.target.value);setLimit(24);}} /><select aria-label="Helmet brand" value={brand} onChange={e => {setBrand(e.target.value);setLimit(24);}}><option value="">All brands</option>{[...new Set(items.map(item => item.brand))].sort().map(value => <option key={value}>{value}</option>)}</select><select aria-label="Helmet type" value={type} onChange={e => {setType(e.target.value);setLimit(24);}}><option value="">All types</option>{[...new Set(items.map(item => item.type))].sort().map(value => <option key={value}>{value}</option>)}</select><select aria-label="Sort helmets" value={sort} onChange={e => setSort(e.target.value)}><option value="price">Price: low to high</option><option value="name">Name</option></select></div>
    <p>{filtered.length} helmets · showing {Math.min(limit,filtered.length)}</p>
    <div className="reviewed-helmet-grid">{filtered.slice(0,limit).map(item => <Link className="reviewed-helmet-card" key={item.id} href={item.href}><div><img src={item.image} alt={item.alt} loading="lazy" width={320} height={220} /></div><span>{item.type}</span><h2>{item.brand} {item.model}</h2><strong>{item.price ? `From ₱${item.price.toLocaleString("en-PH")}` : "Check product price"}</strong><small>View helmet →</small></Link>)}</div>
    {!filtered.length && <p>No helmets match. Try a different brand, type or search.</p>}
    {filtered.length > limit && <button className="button" type="button" onClick={() => setLimit(value => value + 24)}>Load more helmets</button>}
  </section>;
}

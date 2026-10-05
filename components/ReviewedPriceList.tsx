"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type PriceRow = { id: string; name: string; brand: string; category: string; cc: number; price: string; href: string };
export function ReviewedPriceList({ items }: { items: PriceRow[] }) {
  const [brand, setBrand] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const rows = useMemo(() => items.filter(item => (!brand || item.brand === brand) && item.name.toLowerCase().includes(query.toLowerCase())), [items,brand,query]);
  const pages = Math.max(1,Math.ceil(rows.length/20));
  const currentPage = Math.min(page,pages-1);
  function download() {
    const cell = (value: string | number) => `"${String(value).replaceAll('"','""')}"`;
    const csv = [["Model","Brand","Category","Engine cc","Published PHP price"],...rows.map(row=>[row.name,row.brand,row.category,row.cc,row.price])].map(row=>row.map(cell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff",csv],{type:"text/csv;charset=utf-8"}));
    const link = document.createElement("a");link.href=url;link.download="motoindex-motorcycle-price-list.csv";link.click();URL.revokeObjectURL(url);
  }
  return <section className="reviewed-price-list" id="price-list"><span className="entity-kicker">Current Philippine prices</span><h2>Motorcycle price list</h2><p>Published reference prices. Open each model for its checked date, source and variant details.</p>
    <div className="reviewed-price-controls"><input aria-label="Search price list" placeholder="Search model…" value={query} onChange={event=>{setQuery(event.target.value);setPage(0);}} /><select aria-label="Price list brand" value={brand} onChange={event=>{setBrand(event.target.value);setPage(0);}}><option value="">All brands</option>{[...new Set(items.map(item=>item.brand))].sort().map(value=><option key={value}>{value}</option>)}</select><button type="button" className="button secondary" onClick={download}>Download price list</button></div>
    <div className="reviewed-price-table"><table><caption className="sr-only">Current motorcycle prices in the Philippines</caption><thead><tr><th scope="col">Model</th><th scope="col">Brand</th><th scope="col">Category</th><th scope="col">Engine</th><th scope="col">Published price</th></tr></thead><tbody>{rows.slice(currentPage*20,(currentPage+1)*20).map(row=><tr key={row.id}><th scope="row"><Link href={row.href}>{row.name}</Link></th><td>{row.brand}</td><td>{row.category}</td><td>{row.cc} cc</td><td>{row.price}</td></tr>)}</tbody></table></div>
    {!rows.length && <p>No matching motorcycles.</p>}
    <div className="reviewed-price-pagination"><small>{rows.length} models · Page {currentPage+1} of {pages}</small><button type="button" disabled={currentPage===0} onClick={()=>setPage(value=>value-1)}>Previous</button><button type="button" disabled={currentPage>=pages-1} onClick={()=>setPage(value=>value+1)}>Next</button></div>
  </section>;
}

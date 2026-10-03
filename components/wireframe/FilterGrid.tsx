"use client";
import { Children, useMemo, useState, type ReactNode } from "react";
export type FilterRow = { id: string; title: string; category: string; brand?: string; price?: number; engine?: number };
/** Children are rendered by the server. Filtering never removes their HTML. */
export function FilterGrid({ rows, children, label, facets = false, pageSize = 12 }: { rows: FilterRow[]; children: ReactNode; label: string; facets?: boolean; pageSize?: number }) {
  const cards = Children.toArray(children);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [engine, setEngine] = useState("");
  const [sort, setSort] = useState("");
  const [limit, setLimit] = useState(rows.length);
  const categoryOptions = [...new Set(rows.map(row => row.category))];
  const brands = [...new Set(rows.map(row => row.brand).filter(Boolean))].sort();
  const filtered = useMemo(() => rows.map((row, index) => ({ row, index })).filter(({ row }) => {
    if (!`${row.title} ${row.brand || ""} ${row.category}`.toLowerCase().includes(query.trim().toLowerCase())) return false;
    if (categories.length && !categories.includes(row.category)) return false;
    if (brand && row.brand !== brand) return false;
    if (budget && (row.price === undefined || row.price > Number(budget))) return false;
    if (engine === "small" && (!row.engine || row.engine > 160)) return false;
    if (engine === "medium" && (!row.engine || row.engine <= 160 || row.engine >= 400)) return false;
    if (engine === "big" && (!row.engine || row.engine < 400)) return false;
    return true;
  }).sort((a,b) => sort === "price-asc" ? (a.row.price ?? Infinity) - (b.row.price ?? Infinity) : sort === "price-desc" ? (b.row.price ?? 0) - (a.row.price ?? 0) : sort === "name" ? a.row.title.localeCompare(b.row.title) : a.index - b.index), [rows, query, categories, brand, budget, engine, sort]);
  const visible = new Set(filtered.slice(0, limit).map(item => item.index));
  const positions = new Map(filtered.map((item, index) => [item.index, index]));
  function reset() { setQuery(""); setCategories([]); setBrand(""); setBudget(""); setEngine(""); setSort(""); setLimit(rows.length); }
  return <div className="wf-filter-grid">
    <div className="wf-controls"><label className="wf-search"><span className="sr-only">Search {label}</span><input type="search" placeholder={`Search ${label.toLowerCase()}...`} value={query} onChange={e => {setQuery(e.target.value); setLimit(pageSize);}} /></label>
      {facets && <><label><span className="sr-only">Brand</span><select value={brand} onChange={e=>{setBrand(e.target.value);setLimit(pageSize);}}><option value="">All brands</option>{brands.map(value=><option key={value}>{value}</option>)}</select></label><label><span className="sr-only">Maximum price</span><select value={budget} onChange={e=>{setBudget(e.target.value);setLimit(pageSize);}}><option value="">Any price</option>{[5000,10000,100000,150000,200000,400000].map(value=><option value={value} key={value}>Under ₱{value.toLocaleString("en-PH")}</option>)}</select></label>{rows.some(row=>row.engine) && <label><span className="sr-only">Engine displacement</span><select value={engine} onChange={e=>{setEngine(e.target.value);setLimit(pageSize);}}><option value="">All engine sizes</option><option value="small">Up to 160 cc</option><option value="medium">161–399 cc</option><option value="big">400 cc and above</option></select></label>}</>}
      <label><span className="sr-only">Sort results</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="">Original order</option><option value="name">Name A–Z</option>{rows.some(row=>row.price !== undefined) && <><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></>}</select></label><button className="wf-reset" type="button" onClick={reset}>Reset</button></div>
    <div className="wf-filter-tabs" role="group" aria-label={`Filter ${label} by category`}><button type="button" aria-pressed={!categories.length} onClick={()=>{setCategories([]);setLimit(pageSize);}}>All ({rows.length})</button>{categoryOptions.map(value=><button type="button" key={value} aria-pressed={categories.includes(value)} onClick={()=>{setCategories(current=>current.includes(value)?current.filter(c=>c!==value):[...current,value]);setLimit(pageSize);}}>{value} ({rows.filter(row=>row.category===value).length})</button>)}</div>
    <p className="wf-result-count" role="status">{filtered.length} {label.toLowerCase()} · showing {Math.min(limit,filtered.length)}</p>
    <div className="wf-catalog grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map((card,index)=><div key={rows[index]?.id || index} hidden={!visible.has(index)} style={{order: positions.get(index) ?? rows.length}}>{card}</div>)}</div>
    {!filtered.length && <div className="wf-empty"><h3>No results match your filters</h3><p>Try another search or reset your filters.</p><button type="button" className="button" onClick={reset}>Reset filters</button></div>}
    {limit >= filtered.length && filtered.length > pageSize && <div className="wf-more"><button type="button" className="button secondary" onClick={()=>setLimit(pageSize)}>Show {pageSize} at a time</button></div>}
    {limit < filtered.length && <div className="wf-more"><button type="button" className="button secondary" onClick={()=>setLimit(current=>current+pageSize)}>Load more {label.toLowerCase()}</button></div>}
  </div>;
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PriceListRow = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  category: string;
  engineCc: number;
  srp: number;
  priceLabel: string;
};

type SortMode = "price-asc" | "price-desc" | "brand" | "engine";

function engineBand(cc: number) {
  if (cc <= 125) return "125cc & below";
  if (cc <= 200) return "126–200cc";
  if (cc < 400) return "201–399cc";
  return "400cc+";
}

export function PriceListExplorer({ rows }: { rows: PriceListRow[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState("All");
  const [engine, setEngine] = useState("All");
  const [sort, setSort] = useState<SortMode>("price-asc");

  const brands = useMemo(() => [...new Set(rows.map((row) => row.make))].sort(), [rows]);
  const categories = useMemo(() => [...new Set(rows.map((row) => row.category))].sort(), [rows]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows
      .filter((row) => brand === "All" || row.make === brand)
      .filter((row) => category === "All" || row.category === category)
      .filter((row) => engine === "All" || engineBand(row.engineCc) === engine)
      .filter((row) => !needle || `${row.make} ${row.model} ${row.category}`.toLowerCase().includes(needle))
      .sort((a, b) => {
        if (sort === "price-desc") return b.srp - a.srp;
        if (sort === "brand") return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
        if (sort === "engine") return a.engineCc - b.engineCc || a.srp - b.srp;
        return a.srp - b.srp;
      });
  }, [brand, category, engine, query, rows, sort]);

  return <div className="wire-price-explorer">
    <div className="wire-filter-bar">
      <label className="wire-filter-search">
        <span className="sr-only">Search price list</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model or brand..." />
      </label>
      <label><span>Brand</span><select value={brand} onChange={(event) => setBrand(event.target.value)}><option>All</option>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Engine</span><select value={engine} onChange={(event) => setEngine(event.target.value)}><option>All</option><option>125cc & below</option><option>126–200cc</option><option>201–399cc</option><option>400cc+</option></select></label>
      <label><span>Sort</span><select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="brand">Brand & model</option><option value="engine">Engine CC</option></select></label>
    </div>

    <div className="wire-price-count"><strong>{visible.length}</strong> motorcycles shown</div>

    <div className="wire-price-table-wrap">
      <table className="wire-price-table">
        <thead><tr><th>Model</th><th>Brand</th><th>Category</th><th>Displacement</th><th>SRP / published price</th></tr></thead>
        <tbody>{visible.map((row) => <tr key={row.id}>
          <td><Link href={`/motorcycles/${row.makeSlug}/${row.slug}`}><strong>{row.model}</strong></Link></td>
          <td>{row.make}</td>
          <td>{row.category}</td>
          <td>{row.engineCc} cc</td>
          <td><strong>{row.priceLabel}</strong></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

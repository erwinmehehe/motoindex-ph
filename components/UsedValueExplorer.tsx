"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type UsedValueModel = {
  id: string;
  make: string;
  model: string;
  href: string;
  oneYear: number;
  threeYear: number;
  fiveYear: number;
};

const PAGE_SIZE = 18;
const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export function UsedValueExplorer({ models }: { models: UsedValueModel[] }) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const makes = useMemo(() => [...new Set(models.map((model) => model.make))].sort((a, b) => a.localeCompare(b)), [models]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return models.filter((model) => (make === "all" || model.make === make) && (!needle || `${model.make} ${model.model}`.toLowerCase().includes(needle)));
  }, [models, query, make]);
  const visible = filtered.slice(0, limit);
  const resetLimit = () => setLimit(PAGE_SIZE);

  return <section className="used-value-explorer" aria-label="Used motorcycle value estimator directory">
    <div className="used-value-toolbar">
      <label><span>Find a motorcycle</span><input type="search" value={query} placeholder="Search NMAX, Click, ADV..." onChange={(event) => { setQuery(event.target.value); resetLimit(); }} /></label>
      <label><span>Brand</span><select value={make} onChange={(event) => { setMake(event.target.value); resetLimit(); }}><option value="all">All brands</option>{makes.map((name) => <option value={name} key={name}>{name}</option>)}</select></label>
    </div>
    <div className="used-value-result-meta"><div><strong>{filtered.length}</strong><span>models with estimates</span></div>{(query || make !== "all") && <button type="button" onClick={() => { setQuery(""); setMake("all"); resetLimit(); }}>Clear filters</button>}</div>
    {visible.length ? <div className="used-value-grid used-value-grid-v2">{visible.map((model) => <Link className="used-value-card" key={model.id} href={model.href}>
      <span>{model.make}</span><h2>{model.model}</h2>
      <div className="used-value-years"><div><small>1 year</small><strong>{peso.format(model.oneYear)}</strong></div><div><small>3 years</small><strong>{peso.format(model.threeYear)}</strong></div><div><small>5 years</small><strong>{peso.format(model.fiveYear)}</strong></div></div>
      <b>Used value & listings →</b>
    </Link>)}</div> : <div className="fitment-empty"><h2>No matching model</h2><p>Try another motorcycle name or brand.</p></div>}
    {visible.length < filtered.length && <div className="used-value-load-more"><button type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>Show more estimates</button><small>Showing {visible.length} of {filtered.length}</small></div>}
  </section>;
}

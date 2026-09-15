"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type FitmentExplorerModel = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  category: string;
  frontTire: string;
  rearTire: string;
};

const PAGE_SIZE = 12;

export function FitmentExplorer({ models }: { models: FitmentExplorerModel[] }) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const makes = useMemo(() => [...new Set(models.map((model) => model.make))].sort((a, b) => a.localeCompare(b)), [models]);
  const active = Boolean(query.trim() || make !== "all");
  const filtered = useMemo(() => {
    if (!active) return [];
    const needle = query.trim().toLowerCase();
    return models.filter((model) => {
      if (make !== "all" && model.make !== make) return false;
      if (!needle) return true;
      return `${model.make} ${model.model} ${model.category} ${model.frontTire} ${model.rearTire}`.toLowerCase().includes(needle);
    });
  }, [active, models, query, make]);
  const visible = filtered.slice(0, limit);

  function resetLimit() {
    setLimit(PAGE_SIZE);
  }

  return <section className="fitment-explorer" aria-label="Motorcycle fitment search">
    <div className="fitment-explorer-toolbar">
      <label className="fitment-search-field">
        <span>Choose motorcycle or enter tire size</span>
        <input
          type="search"
          value={query}
          placeholder="Try NMAX, Click 160 or 110/80-14"
          onChange={(event) => { setQuery(event.target.value); resetLimit(); }}
        />
      </label>
      <label>
        <span>Make</span>
        <select value={make} onChange={(event) => { setMake(event.target.value); resetLimit(); }}>
          <option value="all">Choose a make</option>
          {makes.map((name) => <option value={name} key={name}>{name}</option>)}
        </select>
      </label>
    </div>

    {!active ? <div className="fitment-empty fitment-start-state"><h2>Start with your motorcycle.</h2><p>Search a model name or choose a make. MotoIndex will show the recorded front and rear sizes only after you narrow the catalog.</p></div> : <>
      <div className="fitment-result-meta">
        <div><strong>{filtered.length}</strong><span>matching motorcycle{filtered.length === 1 ? "" : "s"}</span></div>
        <button type="button" onClick={() => { setQuery(""); setMake("all"); resetLimit(); }}>Clear search</button>
      </div>

      {visible.length ? <div className="fitment-model-grid fitment-model-grid-v2">
        {visible.map((model) => <Link className="fitment-model-card" key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}#tires-fitment`}>
          <div className="fitment-model-heading"><span>{model.make}</span><small>{model.category}</small></div>
          <h2>{model.model}</h2>
          <div className="fitment-tire-pair"><div><small>Front</small><strong>{model.frontTire}</strong></div><div><small>Rear</small><strong>{model.rearTire}</strong></div></div>
          <b>Open exact fitment →</b>
        </Link>)}
      </div> : <div className="fitment-empty"><h2>No matching motorcycle</h2><p>Try a model name, brand or a different tire-size format.</p></div>}

      {visible.length < filtered.length && <div className="fitment-load-more">
        <button type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>Show more motorcycles</button>
        <small>Showing {visible.length} of {filtered.length}</small>
      </div>}
    </>}
  </section>;
}

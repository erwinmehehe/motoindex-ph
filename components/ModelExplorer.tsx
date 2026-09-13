"use client";

import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { ModelCard } from "@/components/ModelCard";
import { observedMarketRange } from "@/lib/marketChecks";

type ExplorerFilters = { q?: string; make?: string; category?: string; budget?: string; sort?: string; maxPrice?: number };
const allowedBudgets = new Set(["all","under100","100to150","150to200","over200"]);
const allowedSorts = new Set(["recommended","price-asc","price-desc","engine-desc","seat-asc"]);

const budgetChips = [
  ["all", "Any budget"],
  ["under100", "Under ₱100K"],
  ["100to150", "₱100K–₱150K"],
  ["150to200", "₱150K–₱200K"],
  ["over200", "₱200K+"]
] as const;

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

export function ModelExplorer({ models, initialFilters = {} }: { models: Motorcycle[]; initialFilters?: ExplorerFilters }) {
  const prices = useMemo(() => models.map((model) => observedMarketRange(model).from), [models]);
  const catalogMax = Math.ceil((Math.max(...prices, 100000) + 25000) / 25000) * 25000;
  const catalogMin = Math.floor(Math.min(...prices, 0) / 25000) * 25000;
  const [q, setQ] = useState(initialFilters.q || "");
  const [make, setMake] = useState(initialFilters.make || "all");
  const [category, setCategory] = useState(initialFilters.category || "all");
  const [budget, setBudget] = useState(allowedBudgets.has(initialFilters.budget || "") ? initialFilters.budget! : "all");
  const [sort, setSort] = useState(allowedSorts.has(initialFilters.sort || "") ? initialFilters.sort! : "recommended");
  const [maxPrice, setMaxPrice] = useState(Math.min(initialFilters.maxPrice || catalogMax, catalogMax));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const makes = [...new Set(models.map(m=>m.make))].sort();
  const categories = [...new Set(models.map(m=>m.category))].sort();

  useEffect(()=>{
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (make !== "all") params.set("make", make);
    if (category !== "all") params.set("type", category);
    if (budget !== "all") params.set("budget", budget);
    if (sort !== "recommended") params.set("sort", sort);
    if (maxPrice < catalogMax) params.set("max", String(maxPrice));
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [q, make, category, budget, sort, maxPrice, catalogMax]);

  const filtered = useMemo(()=>{
    const rows = models.filter((m)=>{
      const text = `${m.make} ${m.model} ${m.category}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (make !== "all" && m.make !== make) return false;
      if (category !== "all" && m.category !== category) return false;
      const price=observedMarketRange(m).from;
      if (price > maxPrice) return false;
      if (budget === "under100" && price >= 100000) return false;
      if (budget === "100to150" && (price < 100000 || price > 150000)) return false;
      if (budget === "150to200" && (price <= 150000 || price > 200000)) return false;
      if (budget === "over200" && price < 200000) return false;
      return true;
    });
    if (sort === "price-asc") return [...rows].sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from);
    if (sort === "price-desc") return [...rows].sort((a,b)=>observedMarketRange(b).from-observedMarketRange(a).from);
    if (sort === "engine-desc") return [...rows].sort((a,b)=>b.engineCc-a.engineCc || a.model.localeCompare(b.model));
    if (sort === "seat-asc") return [...rows].sort((a,b)=>a.seatHeightMm-b.seatHeightMm || a.model.localeCompare(b.model));
    return rows;
  },[models,q,make,category,budget,sort,maxPrice]);

  const dirty = Boolean(q || make!=="all" || category!=="all" || budget!=="all" || sort!=="recommended" || maxPrice<catalogMax);
  function reset(){setQ("");setMake("all");setCategory("all");setBudget("all");setSort("recommended");setMaxPrice(catalogMax);}
  function chooseBudget(value: string){setBudget(value);if(value==="under100")setMaxPrice(Math.min(100000,catalogMax));else if(value==="100to150")setMaxPrice(Math.min(150000,catalogMax));else if(value==="150to200")setMaxPrice(Math.min(200000,catalogMax));else setMaxPrice(catalogMax);}

  const filterPanel = <div className="model-filter-panel">
    <div className="model-filter-panel-head"><div><span>Shopping filters</span><strong>Narrow the catalog</strong></div>{dirty&&<button type="button" onClick={reset}>Reset</button>}</div>
    <label className="model-filter-search"><span>Search</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Aerox, Honda, adventure..." /></label>
    <label><span>Brand</span><select value={make} onChange={e=>setMake(e.target.value)}><option value="all">All brands</option>{makes.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <fieldset className="model-filter-group"><legend>Body type</legend><div className="model-filter-chips"><button type="button" className={category==="all"?"active":""} onClick={()=>setCategory("all")}>All</button>{categories.map(v=><button type="button" key={v} className={category===v?"active":""} onClick={()=>setCategory(v)}>{v}</button>)}</div></fieldset>
    <fieldset className="model-filter-group"><legend>Budget</legend><div className="model-budget-stack">{budgetChips.map(([value,label])=><button key={value} type="button" className={budget===value?"active":""} aria-pressed={budget===value} onClick={()=>chooseBudget(value)}>{label}</button>)}</div></fieldset>
    <label className="model-price-range"><span>Maximum price <b>{peso(maxPrice)}</b></span><input type="range" min={Math.max(25000,catalogMin)} max={catalogMax} step="25000" value={maxPrice} onChange={(e)=>{setMaxPrice(Number(e.target.value));setBudget("all");}} /><small>Move the slider to set a custom ceiling.</small></label>
    <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">Recommended order</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="engine-desc">Largest engine first</option><option value="seat-asc">Lowest seat first</option></select></label>
  </div>;

  return <div className="model-explorer-v400">
    <div className="model-explorer-mobile-bar"><button type="button" onClick={()=>setMobileFiltersOpen(true)}>Filters <span>{dirty ? "•" : ""}</span></button><label><span className="sr-only">Sort motorcycles</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price-asc">Lowest price</option><option value="price-desc">Highest price</option><option value="engine-desc">Largest engine</option><option value="seat-asc">Lowest seat</option></select></label></div>
    {mobileFiltersOpen&&<div className="model-filter-drawer" role="dialog" aria-modal="true" aria-label="Motorcycle filters"><button className="model-filter-drawer-backdrop" type="button" aria-label="Close filters" onClick={()=>setMobileFiltersOpen(false)} /><div className="model-filter-drawer-panel"><div className="model-filter-drawer-title"><strong>Filter motorcycles</strong><button type="button" onClick={()=>setMobileFiltersOpen(false)}>Done</button></div>{filterPanel}</div></div>}
    <div className="model-explorer-layout">
      <aside className="model-explorer-rail">{filterPanel}</aside>
      <div className="model-explorer-results">
        <div className="result-meta" aria-live="polite"><div><span><b>{filtered.length}</b> motorcycles</span><small>{dirty ? "Filtered to your current shopping criteria" : "All published current model records"}</small></div>{dirty&&<button type="button" className="text-button" onClick={reset}>Clear all</button>}</div>
        {filtered.length ? <div className="card-grid motorcycle-catalog-grid">{filtered.map(m=><ModelCard key={m.id} model={m}/>)}</div> : <div className="empty-state large"><strong>No motorcycles match every filter.</strong><span>Try a higher price ceiling, another body type or clear the brand filter.</span><button type="button" className="button small" onClick={reset}>Reset filters</button></div>}
      </div>
    </div>
  </div>;
}

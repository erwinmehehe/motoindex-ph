"use client";

import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { observedMarketRange } from "@/lib/marketChecks";

type ExplorerFilters = { q?: string; make?: string; category?: string; budget?: string; sort?: string; maxPrice?: number };
const allowedBudgets = new Set(["all","under100","100to150","150to200","over200"]);
const allowedSorts = new Set(["recommended","price-asc","price-desc","engine-desc","seat-asc"]);
const pageSize = 18;

const budgetChips = [
  ["all", "Any budget"],
  ["under100", "Under ₱100K"],
  ["100to150", "₱100K–₱150K"],
  ["150to200", "₱150K–₱200K"],
  ["over200", "₱200K+"]
] as const;

const buyerCategoryOptions = [
  ["scooter", "Scooter"],
  ["underbone", "Underbone / utility"],
  ["naked", "Naked / street"],
  ["sport", "Sport"],
  ["adventure", "Adventure / dual-sport"],
  ["cruiser", "Cruiser"],
  ["classic", "Classic / retro"],
  ["touring", "Touring"],
] as const;

type BuyerCategory = typeof buyerCategoryOptions[number][0];

function buyerCategoryFor(category: string): BuyerCategory | "other" {
  const value = category.toLowerCase();
  if (value.includes("scooter")) return "scooter";
  if (value.includes("underbone") || value.includes("business motorcycle") || value.includes("mini street bike")) return "underbone";
  if (value.includes("touring")) return "touring";
  if (value.includes("adventure") || value.includes("dual-sport") || value.includes("dual-purpose") || value.includes("scrambler")) return "adventure";
  if (value.includes("cruiser")) return "cruiser";
  if (value.includes("classic") || value.includes("retro") || value.includes("cafe")) return "classic";
  if (value.includes("naked") || value.includes("street") || value.includes("roadster")) return "naked";
  if (value.includes("sport") || value.includes("hypersport")) return "sport";
  return "other";
}

function normalizeCategoryFilter(value?: string) {
  if (!value || value === "all") return "all";
  const normalized = value.toLowerCase();
  const direct = buyerCategoryOptions.find(([key]) => key === normalized)?.[0];
  return direct || buyerCategoryFor(value);
}

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

function makeSlug(value: string) {
  return value.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}

export function ModelExplorer({ models, initialFilters = {} }: { models: Motorcycle[]; initialFilters?: ExplorerFilters }) {
  const prices = useMemo(() => models.map((model) => observedMarketRange(model).from), [models]);
  const catalogMax = Math.ceil((Math.max(...prices, 100000) + 25000) / 25000) * 25000;
  const catalogMin = Math.floor(Math.min(...prices, 0) / 25000) * 25000;
  const makes = useMemo(()=>[...new Set(models.map(m=>m.make))].sort(),[models]);
  const categories = useMemo(()=>buyerCategoryOptions.filter(([value])=>models.some(model=>buyerCategoryFor(model.category)===value)),[models]);
  const [q, setQ] = useState(initialFilters.q || "");
  const [make, setMake] = useState(initialFilters.make || "all");
  const [category, setCategory] = useState(normalizeCategoryFilter(initialFilters.category));
  const [budget, setBudget] = useState(allowedBudgets.has(initialFilters.budget || "") ? initialFilters.budget! : "all");
  const [sort, setSort] = useState(allowedSorts.has(initialFilters.sort || "") ? initialFilters.sort! : "recommended");
  const [maxPrice, setMaxPrice] = useState(Math.min(initialFilters.maxPrice || catalogMax, catalogMax));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [urlReady,setUrlReady]=useState(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const requestedMake=params.get("make")||initialFilters.make||"all";
    const resolvedMake=requestedMake==="all"?"all":makes.find(value=>value===requestedMake||makeSlug(value)===requestedMake)||"all";
    const requestedBudget=params.get("budget")||initialFilters.budget||"all";
    const requestedSort=params.get("sort")||initialFilters.sort||"recommended";
    const requestedMax=Number(params.get("max")||initialFilters.maxPrice||catalogMax);
    const requestedCategory=normalizeCategoryFilter(params.get("type")||initialFilters.category);
    setQ(params.get("q")||initialFilters.q||"");
    setMake(resolvedMake);
    setCategory(categories.some(([value])=>value===requestedCategory)?requestedCategory:"all");
    setBudget(allowedBudgets.has(requestedBudget)?requestedBudget:"all");
    setSort(allowedSorts.has(requestedSort)?requestedSort:"recommended");
    setMaxPrice(Number.isFinite(requestedMax)&&requestedMax>0?Math.min(requestedMax,catalogMax):catalogMax);
    setUrlReady(true);
    // URL state is intentionally read once so /motorcycles can remain a static route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(()=>{
    if(!urlReady)return;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (make !== "all") params.set("make", makeSlug(make));
    if (category !== "all") params.set("type", category);
    if (budget !== "all") params.set("budget", budget);
    if (sort !== "recommended") params.set("sort", sort);
    if (maxPrice < catalogMax) params.set("max", String(maxPrice));
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [q, make, category, budget, sort, maxPrice, catalogMax, urlReady]);

  useEffect(()=>setVisibleCount(pageSize),[q,make,category,budget,sort,maxPrice]);

  const filtered = useMemo(()=>{
    const rows = models.filter((m)=>{
      const text = `${m.make} ${m.model} ${m.category}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (make !== "all" && m.make !== make) return false;
      if (category !== "all" && buyerCategoryFor(m.category) !== category) return false;
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

  const visible = filtered.slice(0,visibleCount);
  const hasMore = visible.length < filtered.length;
  const dirty = Boolean(q || make!=="all" || category!=="all" || budget!=="all" || sort!=="recommended" || maxPrice<catalogMax);
  function reset(){setQ("");setMake("all");setCategory("all");setBudget("all");setSort("recommended");setMaxPrice(catalogMax);setVisibleCount(pageSize);}
  function chooseBudget(value: string){setBudget(value);if(value==="under100")setMaxPrice(Math.min(100000,catalogMax));else if(value==="100to150")setMaxPrice(Math.min(150000,catalogMax));else if(value==="150to200")setMaxPrice(Math.min(200000,catalogMax));else setMaxPrice(catalogMax);}

  const filterPanel = <div className="model-filter-panel">
    <div className="model-filter-panel-head"><div><span>Shopping filters</span><strong>Narrow the catalog</strong></div>{dirty&&<button type="button" onClick={reset}>Reset</button>}</div>
    <label className="model-filter-search"><span>Search</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Aerox, Honda, adventure..." /></label>
    <label><span>Brand</span><select value={make} onChange={e=>setMake(e.target.value)}><option value="all">All brands</option>{makes.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <fieldset className="model-filter-group"><legend>Body type</legend><div className="model-filter-chips"><button type="button" className={category==="all"?"active":""} onClick={()=>setCategory("all")}>All</button>{categories.map(([value,label])=><button type="button" key={value} className={category===value?"active":""} onClick={()=>setCategory(value)}>{label}</button>)}</div></fieldset>
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
        <div className="result-meta" aria-live="polite"><div><span><b>{filtered.length}</b> motorcycles</span><small>{dirty ? "Filtered to your current shopping criteria" : `Showing ${visible.length} of ${filtered.length} current motorcycles`}</small></div>{dirty&&<button type="button" className="text-button" onClick={reset}>Clear all</button>}</div>
        {filtered.length ? <><div className="card-grid motorcycle-catalog-grid">{visible.map(m=><MotorcycleCard key={m.id} model={m} variant="standard"/>)}</div>{hasMore&&<div className="catalog-load-more"><button type="button" onClick={()=>setVisibleCount((count)=>Math.min(count+pageSize,filtered.length))}>Show {Math.min(pageSize,filtered.length-visible.length)} more motorcycles</button><small>{visible.length} of {filtered.length} shown</small></div>}</> : <div className="empty-state large"><strong>No motorcycles match every filter.</strong><span>Try a higher price ceiling, another body type or clear the brand filter.</span><button type="button" className="button small" onClick={reset}>Reset filters</button></div>}
      </div>
    </div>
  </div>;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { ModelCard } from "@/components/ModelCard";
import { observedMarketRange } from "@/lib/marketChecks";

type ExplorerFilters = { q?: string; make?: string; category?: string; budget?: string; sort?: string; maxPrice?: number };
type BuyerType = "Scooter" | "Underbone" | "Naked" | "Sport" | "Adventure" | "Cruiser" | "Classic/Retro" | "Touring";

const buyerTypes: BuyerType[] = ["Scooter", "Underbone", "Naked", "Sport", "Adventure", "Cruiser", "Classic/Retro", "Touring"];
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

function peso(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}
function makeSlug(value: string) {
  return value.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function buyerTypeFor(category: string): BuyerType {
  const value = category.toLowerCase();
  if (/scooter/.test(value)) return "Scooter";
  if (/underbone|moped/.test(value)) return "Underbone";
  if (/adventure|dual[- ]?sport|enduro|off[- ]?road/.test(value)) return "Adventure";
  if (/cruiser|bobber/.test(value)) return "Cruiser";
  if (/touring|tourer/.test(value)) return "Touring";
  if (/classic|retro|heritage|scrambler|cafe/.test(value)) return "Classic/Retro";
  if (/sport|supersport|race/.test(value)) return "Sport";
  return "Naked";
}
function isBuyerType(value: string): value is BuyerType {
  return buyerTypes.includes(value as BuyerType);
}

export function ModelExplorer({ models, initialFilters = {} }: { models: Motorcycle[]; initialFilters?: ExplorerFilters }) {
  const prices = useMemo(() => models.map((model) => observedMarketRange(model).from), [models]);
  const catalogMax = Math.ceil((Math.max(...prices, 100000) + 25000) / 25000) * 25000;
  const catalogMin = Math.floor(Math.min(...prices, 0) / 25000) * 25000;
  const makes = useMemo(()=>[...new Set(models.map(m=>m.make))].sort(),[models]);
  const detailedCategories = useMemo(()=>[...new Set(models.map(m=>m.category))].sort(),[models]);
  const [q, setQ] = useState(initialFilters.q || "");
  const [make, setMake] = useState(initialFilters.make || "all");
  const [category, setCategory] = useState<"all" | BuyerType>(isBuyerType(initialFilters.category || "") ? initialFilters.category as BuyerType : "all");
  const [detailCategory, setDetailCategory] = useState("all");
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
    const requestedType=params.get("type")||initialFilters.category||"all";
    const requestedDetail=params.get("detail")||"all";
    setQ(params.get("q")||initialFilters.q||"");
    setMake(resolvedMake);
    if (requestedType === "all") setCategory("all");
    else if (isBuyerType(requestedType)) setCategory(requestedType);
    else if (detailedCategories.includes(requestedType)) {
      setCategory(buyerTypeFor(requestedType));
      setDetailCategory(requestedType);
    }
    if (requestedDetail === "all" || detailedCategories.includes(requestedDetail)) setDetailCategory(requestedDetail);
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
    if (detailCategory !== "all") params.set("detail", detailCategory);
    if (budget !== "all") params.set("budget", budget);
    if (sort !== "recommended") params.set("sort", sort);
    if (maxPrice < catalogMax) params.set("max", String(maxPrice));
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [q, make, category, detailCategory, budget, sort, maxPrice, catalogMax, urlReady]);

  useEffect(()=>setVisibleCount(pageSize),[q,make,category,detailCategory,budget,sort,maxPrice]);

  const filtered = useMemo(()=>{
    const rows = models.filter((m)=>{
      const text = `${m.make} ${m.model} ${m.category}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (make !== "all" && m.make !== make) return false;
      if (category !== "all" && buyerTypeFor(m.category) !== category) return false;
      if (detailCategory !== "all" && m.category !== detailCategory) return false;
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
  },[models,q,make,category,detailCategory,budget,sort,maxPrice]);

  const visible = filtered.slice(0,visibleCount);
  const hasMore = visible.length < filtered.length;
  const dirty = Boolean(q || make!=="all" || category!=="all" || detailCategory!=="all" || budget!=="all" || sort!=="recommended" || maxPrice<catalogMax);
  function reset(){setQ("");setMake("all");setCategory("all");setDetailCategory("all");setBudget("all");setSort("recommended");setMaxPrice(catalogMax);setVisibleCount(pageSize);}
  function chooseBudget(value: string){setBudget(value);if(value==="under100")setMaxPrice(Math.min(100000,catalogMax));else if(value==="100to150")setMaxPrice(Math.min(150000,catalogMax));else if(value==="150to200")setMaxPrice(Math.min(200000,catalogMax));else setMaxPrice(catalogMax);}

  const filterPanel = <div className="model-filter-panel">
    <div className="model-filter-panel-head"><div><span>Find a motorcycle</span><strong>{models.length} current motorcycles</strong></div>{dirty&&<button type="button" onClick={reset}>Reset</button>}</div>
    <label className="model-filter-search"><span>Search</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Aerox, Honda, ADV..." /></label>
    <label><span>Make</span><select value={make} onChange={e=>setMake(e.target.value)}><option value="all">All makes</option>{makes.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
    <fieldset className="model-filter-group"><legend>Type</legend><div className="model-filter-chips"><button type="button" className={category==="all"?"active":""} onClick={()=>{setCategory("all");setDetailCategory("all");}}>All</button>{buyerTypes.map(v=><button type="button" key={v} className={category===v?"active":""} onClick={()=>{setCategory(v);setDetailCategory("all");}}>{v}</button>)}</div></fieldset>
    <fieldset className="model-filter-group"><legend>Budget</legend><div className="model-budget-stack">{budgetChips.map(([value,label])=><button key={value} type="button" className={budget===value?"active":""} aria-pressed={budget===value} onClick={()=>chooseBudget(value)}>{label}</button>)}</div></fieldset>
    <details className="model-more-filters">
      <summary>More filters</summary>
      <div className="model-more-filters-body">
        <label><span>Detailed body style</span><select value={detailCategory} onChange={e=>setDetailCategory(e.target.value)}><option value="all">Any detailed style</option>{detailedCategories.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
        <label className="model-price-range"><span>Maximum price <b>{peso(maxPrice)}</b></span><input type="range" min={Math.max(25000,catalogMin)} max={catalogMax} step="25000" value={maxPrice} onChange={(e)=>{setMaxPrice(Number(e.target.value));setBudget("all");}} /><small>Set a custom ceiling only when the budget bands are too broad.</small></label>
        <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">Recommended order</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="engine-desc">Largest engine first</option><option value="seat-asc">Lowest seat first</option></select></label>
      </div>
    </details>
  </div>;

  return <div className="model-explorer-v400">
    <div className="model-explorer-mobile-bar"><button type="button" onClick={()=>setMobileFiltersOpen(true)}>Filters <span>{dirty ? "•" : ""}</span></button><label><span className="sr-only">Sort motorcycles</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price-asc">Lowest price</option><option value="price-desc">Highest price</option><option value="engine-desc">Largest engine</option><option value="seat-asc">Lowest seat</option></select></label></div>
    {mobileFiltersOpen&&<div className="model-filter-drawer" role="dialog" aria-modal="true" aria-label="Motorcycle filters"><button className="model-filter-drawer-backdrop" type="button" aria-label="Close filters" onClick={()=>setMobileFiltersOpen(false)} /><div className="model-filter-drawer-panel"><div className="model-filter-drawer-title"><strong>Filter motorcycles</strong><button type="button" onClick={()=>setMobileFiltersOpen(false)}>Done</button></div>{filterPanel}</div></div>}
    <div className="model-explorer-layout">
      <aside className="model-explorer-rail">{filterPanel}</aside>
      <div className="model-explorer-results">
        <div className="result-meta" aria-live="polite"><div><span><b>{filtered.length}</b> motorcycles</span><small>{dirty ? "Filtered to your current shopping criteria" : `Showing ${visible.length} of ${filtered.length} current motorcycles`}</small></div>{dirty&&<button type="button" className="text-button" onClick={reset}>Clear all</button>}</div>
        {filtered.length ? <><div className="card-grid motorcycle-catalog-grid">{visible.map(m=><ModelCard key={m.id} model={m}/>)}</div>{hasMore&&<div className="catalog-load-more"><button type="button" onClick={()=>setVisibleCount((count)=>Math.min(count+pageSize,filtered.length))}>Show {Math.min(pageSize,filtered.length-visible.length)} more motorcycles</button><small>{visible.length} of {filtered.length} shown</small></div>}</> : <div className="empty-state large"><strong>No motorcycles match every filter.</strong><span>Try a higher price ceiling, another type or clear the make filter.</span><button type="button" className="button small" onClick={reset}>Reset filters</button></div>}
      </div>
    </div>
  </div>;
}

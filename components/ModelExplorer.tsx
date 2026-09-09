"use client";

import { useEffect, useMemo, useState } from "react";
import type { Motorcycle } from "@/lib/types";
import { ModelCard } from "@/components/ModelCard";
import { observedMarketRange } from "@/lib/marketChecks";

type ExplorerFilters = { q?: string; make?: string; category?: string; budget?: string };
const allowedBudgets = new Set(["all","under100","100to150","150to200","over200"]);

export function ModelExplorer({ models, initialFilters = {} }: { models: Motorcycle[]; initialFilters?: ExplorerFilters }) {
  const [q, setQ] = useState(initialFilters.q || "");
  const [make, setMake] = useState(initialFilters.make || "all");
  const [category, setCategory] = useState(initialFilters.category || "all");
  const [budget, setBudget] = useState(allowedBudgets.has(initialFilters.budget || "") ? initialFilters.budget! : "all");
  const makes = [...new Set(models.map(m=>m.make))].sort();
  const categories = [...new Set(models.map(m=>m.category))].sort();

  useEffect(()=>{
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (make !== "all") params.set("make", make);
    if (category !== "all") params.set("type", category);
    if (budget !== "all") params.set("budget", budget);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", next);
  }, [q, make, category, budget]);

  const filtered = useMemo(()=>models.filter((m)=>{
    const text = `${m.make} ${m.model} ${m.category}`.toLowerCase();
    if (q && !text.includes(q.toLowerCase())) return false;
    if (make !== "all" && m.make !== make) return false;
    if (category !== "all" && m.category !== category) return false;
    const price=observedMarketRange(m).from;
    if (budget === "under100" && price >= 100000) return false;
    if (budget === "100to150" && (price < 100000 || price > 150000)) return false;
    if (budget === "150to200" && (price <= 150000 || price > 200000)) return false;
    if (budget === "over200" && price < 200000) return false;
    return true;
  }),[models,q,make,category,budget]);

  const dirty = Boolean(q || make!=="all" || category!=="all" || budget!=="all");
  function reset(){setQ("");setMake("all");setCategory("all");setBudget("all");}

  return <div className="model-explorer-v300">
    <div className="model-explorer-toolbar"><div><span>Filter motorcycles</span><strong>Search the current catalog</strong></div>{dirty&&<button type="button" className="filter-reset" onClick={reset}>Reset filters</button>}</div>
    <div className="filter-bar">
      <label className="filter-search"><span>Search models</span><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Aerox, Honda, sport scooter..." /></label>
      <label><span>Make</span><select value={make} onChange={e=>setMake(e.target.value)}><option value="all">All makes</option>{makes.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label><span>Type</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All types</option>{categories.map(v=><option key={v} value={v}>{v}</option>)}</select></label>
      <label><span>Budget</span><select value={budget} onChange={e=>setBudget(e.target.value)}><option value="all">Any</option><option value="under100">Under ₱100K</option><option value="100to150">₱100K–₱150K</option><option value="150to200">₱150K–₱200K</option><option value="over200">₱200K and above</option></select></label>
    </div>
    <div className="result-meta" aria-live="polite"><span><b>{filtered.length}</b> motorcycles match your filters</span><small>{dirty ? "Filtered view" : "All published model records"}</small></div>
    {filtered.length ? <div className="card-grid motorcycle-catalog-grid">{filtered.map(m=><ModelCard key={m.id} model={m}/>)}</div> : <div className="empty-state large">No motorcycles match these filters. <button type="button" className="text-button" onClick={reset}>Clear filters</button></div>}
  </div>;
}

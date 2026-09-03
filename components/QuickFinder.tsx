"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Motorcycle } from "@/lib/types";
import { observedMarketRange, observedMarketPriceLabel } from "@/lib/marketChecks";

export function QuickFinder({ models }: { models: Motorcycle[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("all");
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return models
      .filter((m) => !q || `${m.make} ${m.model} ${m.category}`.toLowerCase().includes(q))
      .filter((m) => {
        const price = observedMarketRange(m).from;
        if (budget === "under100") return price < 100000;
        if (budget === "100to150") return price >= 100000 && price <= 150000;
        if (budget === "150to200") return price > 150000 && price <= 200000;
        if (budget === "over200") return price >= 200000;
        return true;
      });
  }, [models, query, budget]);
  const visibleMatches = matches.slice(0, 8);

  return (
    <div className="finder-card">
      <div className="finder-top">
        <div><span className="panel-label">Quick motorcycle finder</span><h2>What are you looking for?</h2></div>
        <span className="finder-count">{matches.length} matches</span>
      </div>
      <div className="finder-controls">
        <label className="finder-input"><span>Search</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Aerox, ADV, scooter..." /></label>
        <label className="finder-input"><span>Budget</span><select value={budget} onChange={(e)=>setBudget(e.target.value)}><option value="all">Any budget</option><option value="under100">Under ₱100K</option><option value="100to150">₱100K–₱150K</option><option value="150to200">₱150K–₱200K</option><option value="over200">₱200K and above</option></select></label>
      </div>
      <div className="finder-results">
        {visibleMatches.length ? visibleMatches.map((m)=><button key={m.id} onClick={()=>router.push(`/motorcycles/${m.makeSlug}/${m.slug}`)}><span><small>{m.make} · {m.category}</small><strong>{m.model}</strong></span><b>{observedMarketPriceLabel(m)}</b></button>) : <div className="empty-state">No matching motorcycle found. Try another make or model.</div>}
      </div>
      {matches.length>visibleMatches.length&&<p className="finder-showing">Showing {visibleMatches.length} of {matches.length} matching motorcycles.</p>}
      <button className="finder-all" onClick={()=>router.push("/finder")}>Open all {matches.length || models.length} motorcycles →</button>
    </div>
  );
}

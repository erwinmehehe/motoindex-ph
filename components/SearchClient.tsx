"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/searchQuery";
import { searchItemMatches, searchItemScore } from "@/lib/searchQuery";
import { trackEvent } from "@/lib/track";

const shortcuts = [
  ["Browse motorcycles", "/motorcycles"],
  ["Motorcycle finder", "/finder"],
  ["Compare motorcycles", "/compare"],
  ["Helmet brands", "/gear/helmets/brands"],
  ["Tire sizes", "/tires"],
  ["Maintenance", "/maintenance"]
] as const;

export function SearchClient({ items, initialQuery = "" }: { items: SearchItem[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const q = query.trim();
  const matches = useMemo(() => {
    const term = query.trim();
    if (!term) return [];
    return items.filter(item=>searchItemMatches(item,term)).sort((a,b)=>searchItemScore(b,term)-searchItemScore(a,term)).slice(0,40);
  }, [items, query]);
  const groups = matches.reduce<Record<string, SearchItem[]>>((acc,item)=>{(acc[item.category] ||= []).push(item);return acc;},{});
  return <div>
    <form className="search-box" action="/search" method="get" onSubmit={()=>{if(!q)return;const capture=process.env.NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS==="true";trackEvent("site_search",{...(capture?{query:q.slice(0,80)}:{}),query_length:q.length,results:matches.length,zero_results:matches.length===0})}}><input name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try Honda under 120k ABS, 160cc scooter, low seat…" aria-label="Search MotoIndex" autoComplete="off"/><span className="search-result-count" aria-live="polite" role="status">{q?`${matches.length} results`:"Start typing"}</span><button type="submit" disabled={!q}>Search</button></form>
    <div className="search-intent-help"><span>Try:</span><b>under 100k</b><b>160cc</b><b>automatic</b><b>ABS</b><b>low seat</b><b>fuel efficient</b><b>heavy traffic</b><b>delivery rider</b></div>
    {!q ? <div className="search-start"><h2>Popular places to start</h2><p>Search when you know what you want, or jump into a core MotoIndex section.</p><div className="search-shortcuts">{shortcuts.map(([label,href])=><Link key={href} href={href}>{label}<span>→</span></Link>)}</div></div> : <div className="search-groups">{Object.entries(groups).map(([category, group])=><section key={category}><h2>{category}</h2><div className="search-results">{group.map(item=><Link key={item.href} href={item.href}><span><strong>{item.title}</strong><small>{item.meta}</small></span><b>Open →</b></Link>)}</div></section>)}{!matches.length && <div className="empty-state large">No match. Try a broader model, brand, budget or feature term.</div>}</div>}
  </div>;
}

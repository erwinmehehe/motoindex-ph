import type { Metadata } from "next";
import Link from "next/link";
import { SearchClient } from "@/components/SearchClient";
import { getSearchItems } from "@/lib/search";
import { pageMetadata } from "@/lib/site";
import hubStyles from "../styles/decision-hub.module.css";

export const metadata: Metadata = pageMetadata({ title: "Search Motorcycles, Helmets & Gear", description: "Search MotoIndex PH motorcycles, helmet models, brands, accessories, buying guides and tools.", path: "/search", index: false });

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const initialQuery = (rawQuery || "").slice(0, 160);

  return <section className="page shell">
    <div className={hubStyles.heroGrid}>
      <div className="page-head"><span className="entity-kicker">MotoIndex search</span><h1>Find the bike, gear or answer you need</h1><p>Search motorcycles, helmets, accessories, comparison pages and ownership tools from one place.</p></div>
      <aside className={hubStyles.heroPanel}>
        <div><span className={hubStyles.panelKicker}>Search by intent</span><h2 className={hubStyles.panelTitle}>You can search the problem, not just the product name.</h2><p className={hubStyles.panelCopy}>Try a budget, displacement, feature or use case when you do not know the exact model yet.</p></div>
        <div className={hubStyles.panelLinks}><Link href="/motorcycles">Browse motorcycles <span>→</span></Link><Link href="/finder">Use the Finder <span>→</span></Link><Link href="/compare">Compare models <span>→</span></Link><Link href="/guides">Open rider guides <span>→</span></Link></div>
      </aside>
    </div>
    <SearchClient items={getSearchItems()} initialQuery={initialQuery}/>
  </section>;
}

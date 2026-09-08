import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelExplorer } from "@/components/ModelExplorer";
import { modelFamilies } from "@/lib/families";
import { getPhBrandPriority } from "@/lib/phBrandPriority";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { forClient } from "@/lib/competitors";

const publicModels = motorcycles.filter(isIndexableModel);
const publicIds = new Set(publicModels.map((m) => m.id));
const publicFamilies = modelFamilies.filter((f) => f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
export const metadata: Metadata = pageMetadata({ title: "Motorcycle Prices Philippines", description: "Compare current Philippine motorcycle prices, specifications, tire sizes and ownership information across core, value, enthusiast and premium brands.", path: "/motorcycles", index: publicModels.length > 0 });
function one(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }

export default async function MotorcyclesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; make?: string | string[]; type?: string | string[]; budget?: string | string[] }> }) {
  const query = await searchParams;
  const makes = [...new Map(publicModels.map((m) => [m.makeSlug, m.make])).entries()];
  const initialFilters = { q: one(query.q) || "", make: one(query.make) || "all", category: one(query.type) || "all", budget: one(query.budget) || "all" };
  const expansionMakes = makes
    .map(([slug, name]) => ({ slug, name, priority: getPhBrandPriority(slug), count: publicModels.filter((m) => m.makeSlug === slug && m.marketStatus !== "previous").length }))
    .filter((item) => item.priority && item.priority.tier >= 2)
    .sort((a, b) => (a.priority?.tier || 9) - (b.priority?.tier || 9) || a.name.localeCompare(b.name));
  const establishedMakes = makes.filter(([slug]) => !expansionMakes.some((item) => item.slug === slug));
  const authorityModels = publicModels.filter((model) => Boolean(modelAuthorityProfile(model.id)));

  return <section className="page shell motorcycles-index-v261">
    <div className="page-head"><span className="entity-kicker">Philippines-first motorcycle database</span><h1>Motorcycle prices and specs in the Philippines</h1><p>Browse motorcycles with dated price references, specifications, tire sizes and ownership tools. We are expanding deliberately into high-demand value, enthusiast and premium Philippine-market brands.</p></div>

    {publicModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
      {expansionMakes.length > 0 && <section className="ph-expansion-panel" aria-labelledby="ph-expansion-title">
        <div className="section-head compact"><div><span className="section-kicker">More brands to compare</span><h2 id="ph-expansion-title">Philippine motorcycle brand guides</h2><p>These brand pages start with models that already have dated Philippine price/specification sources and useful buyer context. Coverage expands as more models are verified rather than filling the catalog with thin placeholder pages.</p></div></div>
        <div className="ph-expansion-depth"><div><span>Brands covered</span><strong>{expansionMakes.length}</strong><small>Value, enthusiast and premium brands</small></div><div><span>Detailed model guides</span><strong>{authorityModels.length}</strong><small>Models with expanded buyer briefs</small></div><div><span>Price data</span><strong>Dated</strong><small>Source dates stay visible on model pages</small></div><div><span>Approach</span><strong>Verify first</strong><small>More models are added as evidence improves</small></div></div>
        <div className="ph-expansion-grid">{expansionMakes.map(({ slug, name, priority, count }) => <Link href={`/motorcycles/${slug}`} key={slug}><span>{priority?.tier === 3 ? "Premium / enthusiast" : "Philippine market"}</span><strong>{name}</strong><small>{count} current {count === 1 ? "model" : "models"} covered · Open brand guide →</small></Link>)}</div>
      </section>}

      <section className="ph-established-brands">
        <div className="section-head compact"><div><h2>All motorcycle brands</h2><p>Browse each brand for its current MotoIndex model coverage, dated prices and specifications.</p></div></div>
        <div className="guide-strip">{establishedMakes.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><span>Price list</span><strong>{name}</strong><small>Browse {name} motorcycles →</small></Link>)}{publicFamilies.map((f) => <Link key={`${f.makeSlug}-${f.slug}`} href={`/motorcycles/${f.makeSlug}/${f.slug}`}><span>Model generations</span><strong>{f.make} {f.name}</strong><small>Compare generations →</small></Link>)}</div>
      </section>

      <div className="section-head compact"><div><h2>Browse motorcycles</h2><p>Filter across the full published catalog. Each result leads to one complete model page that keeps price, specs, fitment and ownership research together.</p></div></div>
      <ModelExplorer models={forClient(publicModels)} initialFilters={initialFilters} />
    </>}
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelExplorer } from "@/components/ModelExplorer";
import { modelFamilies } from "@/lib/families";
import { getPhBrandPriority } from "@/lib/phBrandPriority";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { modelAuthorityQuality } from "@/lib/modelQuality";

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
  const strongAuthorityCount = authorityModels.filter((model) => modelAuthorityQuality(model).grade === "strong").length;
  const publishableAuthorityCount = authorityModels.filter((model) => modelAuthorityQuality(model).grade === "publishable").length;

  return <section className="page shell motorcycles-index-v261">
    <div className="page-head"><span className="entity-kicker">Philippines-first motorcycle database</span><h1>Motorcycle prices and specs in the Philippines</h1><p>Browse motorcycles with dated price references, specifications, tire sizes and ownership tools. We are expanding deliberately into high-demand value, enthusiast and premium Philippine-market brands.</p></div>

    {publicModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
      {expansionMakes.length > 0 && <section className="ph-expansion-panel" aria-labelledby="ph-expansion-title">
        <div className="section-head compact"><div><span className="section-kicker">Tier 2 + Tier 3 rollout</span><h2 id="ph-expansion-title">New Philippine-market brand hubs</h2><p>Fifteen priority brands now start with two authority-anchor models each. Every Tier 2/3 model must meet a source, specification, buyer-analysis and local-support threshold; missing second-price-source, media or maintenance evidence is shown openly instead of being padded with generic filler.</p></div></div>
        <div className="ph-expansion-depth"><div><span>Authority anchors</span><strong>{authorityModels.length}</strong><small>Unique PH buyer briefs</small></div><div><span>Strong</span><strong>{strongAuthorityCount}</strong><small>85+ authority score</small></div><div><span>Publishable</span><strong>{publishableAuthorityCount}</strong><small>65–84 with visible gaps</small></div><div><span>Policy</span><strong>Depth first</strong><small>No thin model permutations</small></div></div>
        <div className="ph-expansion-grid">{expansionMakes.map(({ slug, name, priority, count }) => <Link href={`/motorcycles/${slug}`} key={slug}><span>Tier {priority?.tier}</span><strong>{name}</strong><small>{count} current authority anchors · Open brand hub →</small></Link>)}</div>
      </section>}

      <section className="ph-established-brands">
        <div className="section-head compact"><div><h2>All motorcycle brands</h2><p>Core brands remain fully discoverable alongside the new expansion hubs.</p></div></div>
        <div className="guide-strip">{establishedMakes.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><span>Price list</span><strong>{name}</strong><small>Browse {name} motorcycles →</small></Link>)}{publicFamilies.map((f) => <Link key={`${f.makeSlug}-${f.slug}`} href={`/motorcycles/${f.makeSlug}/${f.slug}`}><span>Model generations</span><strong>{f.make} {f.name}</strong><small>Compare generations →</small></Link>)}</div>
      </section>

      <div className="section-head compact"><div><h2>Browse motorcycles</h2><p>Filter across the full published catalog. Each result leads to one complete model page that keeps price, specs, fitment and ownership research together.</p></div></div>
      <ModelExplorer models={publicModels} initialFilters={initialFilters} />
    </>}
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelExplorer } from "@/components/ModelExplorer";
import { modelFamilies } from "@/lib/families";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { forClient } from "@/lib/competitors";
import { observedMarketRange } from "@/lib/marketChecks";
import { php } from "@/lib/utils";

const publicModels = motorcycles.filter(isIndexableModel);
const publicIds = new Set(publicModels.map((m) => m.id));
const publicFamilies = modelFamilies.filter((f) => f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
const currentModels = publicModels.filter((m) => !["previous","uncertain","discontinued"].includes(m.marketStatus || ""));
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices Philippines",
  description: "Compare current Philippine motorcycle prices, specifications, tire sizes and ownership information across major motorcycle brands.",
  path: "/motorcycles",
  index: publicModels.length > 0
});
function one(value?: string | string[]) { return Array.isArray(value) ? value[0] : value; }

export default async function MotorcyclesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; make?: string | string[]; type?: string | string[]; budget?: string | string[] }> }) {
  const query = await searchParams;
  const initialFilters = { q: one(query.q) || "", make: one(query.make) || "all", category: one(query.type) || "all", budget: one(query.budget) || "all" };
  const makes = [...new Map(currentModels.map((m) => [m.makeSlug, m.make])).entries()];
  const authorityModels = currentModels.filter((model) => Boolean(modelAuthorityProfile(model.id)));
  const categories = [...new Set(currentModels.map((model) => model.category))].sort();
  const overallLow = currentModels.length ? Math.min(...currentModels.map((m) => observedMarketRange(m).from)) : undefined;
  const overallHigh = currentModels.length ? Math.max(...currentModels.map((m) => observedMarketRange(m).to || observedMarketRange(m).from)) : undefined;
  const brandDirectory = makes.map(([slug, name]) => {
    const models = currentModels.filter((m) => m.makeSlug === slug);
    const low = Math.min(...models.map((m) => observedMarketRange(m).from));
    const high = Math.max(...models.map((m) => observedMarketRange(m).to || observedMarketRange(m).from));
    return { slug, name, count: models.length, low, high };
  }).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name));

  return <section className="motorcycles-index-v300">
    <div className="motorcycle-index-hero">
      <div className="shell">
        <div className="motorcycle-index-hero-grid">
          <div className="motorcycle-index-hero-copy">
            <span className="entity-kicker">Philippines motorcycle database</span>
            <h1>Motorcycle prices and specs in the Philippines</h1>
            <p>Start with the bike, budget or category you actually care about. Every published model keeps its price context, specifications, fitment and ownership research on one page.</p>
            <div className="motorcycle-index-actions">
              <a className="button" href="#browse-models">Browse motorcycles</a>
              <Link className="button secondary" href="/finder">Use motorcycle finder</Link>
              <Link className="button secondary" href="/compare">Compare models</Link>
            </div>
          </div>
          <aside className="motorcycle-index-overview" aria-label="MotoIndex motorcycle catalog overview">
            <div><span>Current models</span><strong>{currentModels.length}</strong><small>Published Philippine-market records</small></div>
            <div><span>Brands</span><strong>{makes.length}</strong><small>With current model coverage</small></div>
            <div><span>Price span</span><strong>{overallLow && overallHigh ? `${php(overallLow)}–${php(overallHigh)}` : "Updating"}</strong><small>Dated model-level references</small></div>
            <div><span>Buyer briefs</span><strong>{authorityModels.length}</strong><small>Expanded ownership and alternatives context</small></div>
          </aside>
        </div>
        <div className="motorcycle-index-quicklinks">
          <Link href={{ pathname:"/motorcycles", query:{ budget:"under100" } }}><span>Budget</span><strong>Under ₱100K</strong><small>Start with affordable current models →</small></Link>
          <Link href={{ pathname:"/motorcycles", query:{ budget:"100to150" } }}><span>Budget</span><strong>₱100K–₱150K</strong><small>Compare popular commuter price bands →</small></Link>
          <Link href="/recommendations/scooters-under-150k-philippines"><span>Guide</span><strong>Scooters under ₱150K</strong><small>Open the focused buying guide →</small></Link>
          <Link href="/recommendations"><span>Buying guides</span><strong>Shop by riding need</strong><small>Commuting, beginners, touring and more →</small></Link>
        </div>
      </div>
    </div>

    <div className="shell motorcycle-index-body">
      {publicModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
        <section id="browse-models" className="motorcycle-catalog-section">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse the catalog</span><h2>Find a motorcycle that fits your budget and use</h2><p>Search and filter the published catalog first. Open a model only when you want the deeper price, financing, rider-fit, tire, maintenance and ownership details.</p></div></div>
          <ModelExplorer models={forClient(publicModels)} initialFilters={initialFilters} />
        </section>

        <section className="motorcycle-brand-directory">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse by brand</span><h2>Motorcycle brands in the Philippines</h2><p>Jump into a brand hub for its current MotoIndex coverage, price list, categories and after-sales links.</p></div></div>
          <div className="motorcycle-brand-directory-grid">{brandDirectory.map((brand) => <Link href={`/motorcycles/${brand.slug}`} key={brand.slug}><div className="motorcycle-brand-mark" aria-hidden="true">{brand.name.slice(0,2).toUpperCase()}</div><div><strong>{brand.name}</strong><small>{brand.count} current {brand.count === 1 ? "model" : "models"}</small></div><span>{php(brand.low)}{brand.high > brand.low ? `–${php(brand.high)}` : ""}</span></Link>)}</div>
        </section>

        {publicFamilies.length > 0 && <section className="motorcycle-family-strip">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Model families</span><h2>Compare generations without mixing prices</h2><p>Family hubs are for searches like Click, NMAX and Aerox where the generation matters as much as the name.</p></div></div>
          <div className="motorcycle-family-card-grid">{publicFamilies.map((family) => <Link key={`${family.makeSlug}-${family.slug}`} href={`/motorcycles/${family.makeSlug}/${family.slug}`}><span>{family.make}</span><strong>{family.name}</strong><small>{family.generationIds.length} generations covered · Compare generations →</small></Link>)}</div>
        </section>}

        <section className="motorcycle-index-method">
          <div><span className="section-kicker">How to use MotoIndex</span><h2>Price is the start of the decision, not the end.</h2><p>Use catalog filters to narrow the shortlist, then use the model page to check source dates, fit, financing, tires, maintenance and alternatives before paying a reservation.</p></div>
          <div className="motorcycle-index-method-grid">
            <article><b>01</b><strong>Shortlist</strong><small>Filter by brand, category and budget.</small></article>
            <article><b>02</b><strong>Verify</strong><small>Open the model and check its dated price sources.</small></article>
            <article><b>03</b><strong>Compare</strong><small>Check fit, ownership cost and alternatives side by side.</small></article>
          </div>
        </section>
      </>}
    </div>
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelExplorer } from "@/components/ModelExplorer";
import { RecentlyViewedRail } from "@/components/RecentlyViewed";
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

export default async function MotorcyclesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[]; make?: string | string[]; type?: string | string[]; budget?: string | string[]; sort?: string | string[]; max?: string | string[] }> }) {
  const query = await searchParams;
  const parsedMax = Number(one(query.max));
  const initialFilters = { q: one(query.q) || "", make: one(query.make) || "all", category: one(query.type) || "all", budget: one(query.budget) || "all", sort: one(query.sort) || "recommended", maxPrice: Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : undefined };
  const makes = [...new Map(currentModels.map((m) => [m.makeSlug, m.make])).entries()];
  const authorityModels = currentModels.filter((model) => Boolean(modelAuthorityProfile(model.id)));
  const overallLow = currentModels.length ? Math.min(...currentModels.map((m) => observedMarketRange(m).from)) : undefined;
  const overallHigh = currentModels.length ? Math.max(...currentModels.map((m) => observedMarketRange(m).to || observedMarketRange(m).from)) : undefined;
  const brandDirectory = makes.map(([slug, name]) => {
    const models = currentModels.filter((m) => m.makeSlug === slug);
    const low = Math.min(...models.map((m) => observedMarketRange(m).from));
    const high = Math.max(...models.map((m) => observedMarketRange(m).to || observedMarketRange(m).from));
    return { slug, name, count: models.length, low, high };
  }).sort((a,b) => b.count - a.count || a.name.localeCompare(b.name));
  const recentModels = currentModels.map(({ id, make, model, makeSlug, slug }) => ({ id, make, model, makeSlug, slug }));

  return <section className="motorcycles-index-v300">
    <div className="motorcycle-index-hero">
      <div className="shell">
        <div className="motorcycle-index-hero-grid">
          <div className="motorcycle-index-hero-copy">
            <span className="entity-kicker">Philippines motorcycle database</span>
            <h1>Shop motorcycles with the numbers that actually matter.</h1>
            <p>Filter current Philippine motorcycles by price, brand and body type, then compare fit, financing and ownership costs without losing your place.</p>
            <div className="motorcycle-index-actions">
              <a className="button" href="#browse-models">Browse motorcycles</a>
              <Link className="button secondary" href="/finder">Find my match</Link>
              <Link className="button secondary" href="/compare">Compare models</Link>
            </div>
          </div>
          <aside className="motorcycle-index-overview" aria-label="MotoIndex motorcycle catalog overview">
            <div><span>Verified models</span><strong>{currentModels.length}</strong><small>Published Philippine-market records</small></div>
            <div><span>Brands researched</span><strong>{makes.length}</strong><small>With verified current model records</small></div>
            <div><span>Price span</span><strong>{overallLow && overallHigh ? `${php(overallLow)}–${php(overallHigh)}` : "Updating"}</strong><small>Dated model-level references</small></div>
            <div><span>Buyer briefs</span><strong>{authorityModels.length}</strong><small>Expanded ownership and alternatives context</small></div>
          </aside>
        </div>
        <div className="motorcycle-index-quicklinks">
          <Link href={{ pathname:"/motorcycles", query:{ budget:"under100" } }}><span>Budget</span><strong>Under ₱100K</strong><small>Affordable current models →</small></Link>
          <Link href={{ pathname:"/motorcycles", query:{ budget:"100to150" } }}><span>Budget</span><strong>₱100K–₱150K</strong><small>Popular commuter price band →</small></Link>
          <Link href="/recommendations#scooters"><span>Body type</span><strong>Scooters</strong><small>Automatic city-focused choices →</small></Link>
          <Link href="/recommendations#400cc"><span>Displacement</span><strong>400cc+</strong><small>Bigger bikes and expressway-planning research →</small></Link>
          <Link href="/motorcycles/electric"><span>Electric</span><strong>Electric motorcycles</strong><small>Battery, range and charging research →</small></Link>
        </div>
      </div>
    </div>

    <div className="shell motorcycle-index-body">
      {publicModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
        <RecentlyViewedRail models={recentModels} />
        <section id="browse-models" className="motorcycle-catalog-section">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Main shopping experience</span><h2>Filter the catalog without opening twenty tabs</h2><p>Your filters stay in the URL, the compare tray stays persistent, and recently viewed motorcycles remain available when you come back.</p></div></div>
          <ModelExplorer models={forClient(publicModels)} initialFilters={initialFilters} />
        </section>

        <section className="motorcycle-brand-directory">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse by brand</span><h2>Verified brand coverage.</h2><p>Counts show the current Philippine models already checked by MotoIndex. Coverage expands as local availability, pricing and core specifications are verified.</p></div></div>
          <div className="motorcycle-brand-directory-grid">{brandDirectory.map((brand) => <Link href={`/motorcycles/${brand.slug}`} key={brand.slug}><div className="motorcycle-brand-mark" aria-hidden="true">{brand.name.slice(0,2).toUpperCase()}</div><div><strong>{brand.name}</strong><small>{brand.count} researched {brand.count === 1 ? "model" : "models"}</small></div><span>{php(brand.low)}{brand.high > brand.low ? `–${php(brand.high)}` : ""}</span></Link>)}</div>
        </section>

        {publicFamilies.length > 0 && <section className="motorcycle-family-strip">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Model families</span><h2>Compare generations without mixing prices</h2><p>Family hubs are for searches like Click, NMAX and Aerox where the generation matters as much as the name.</p></div></div>
          <div className="motorcycle-family-card-grid">{publicFamilies.map((family) => <Link key={`${family.makeSlug}-${family.slug}`} href={`/motorcycles/${family.makeSlug}/${family.slug}`}><span>{family.make}</span><strong>{family.name}</strong><small>{family.generationIds.length} generations covered · Compare generations →</small></Link>)}</div>
        </section>}

        <section className="motorcycle-index-method">
          <div><span className="section-kicker">A simpler decision path</span><h2>Shortlist first. Verify the details before paying.</h2><p>Use catalog filters to get down to a handful of motorcycles, then use the model page for dated prices, fit, financing and ownership context.</p></div>
          <div className="motorcycle-index-method-grid">
            <article><b>01</b><strong>Filter</strong><small>Budget, brand, body type and price ceiling.</small></article>
            <article><b>02</b><strong>Compare</strong><small>Keep up to three motorcycles in the persistent tray.</small></article>
            <article><b>03</b><strong>Verify</strong><small>Open the model and check price dates, fit and ownership cost.</small></article>
          </div>
        </section>
      </>}
    </div>
  </section>;
}

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
import styles from "./motorcycles.module.css";

const publicModels = motorcycles.filter(isIndexableModel);
const publicIds = new Set(publicModels.map((m) => m.id));
const publicFamilies = modelFamilies.filter((f) => f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
const currentModels = publicModels.filter((m) => !["previous","uncertain","discontinued"].includes(m.marketStatus || ""));
const CATALOG_FILTER_PARAMS = ["q", "make", "type", "budget", "sort", "max"] as const;

function hasCatalogFilters(params: Record<string, string | string[] | undefined>) {
  return CATALOG_FILTER_PARAMS.some((key) => {
    const value = params[key];
    return Array.isArray(value) ? value.some(Boolean) : Boolean(value);
  });
}

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasActiveFilters = hasCatalogFilters(params);
  return pageMetadata({
    title: "Motorcycle Prices, Specs & Models | MotoIndex",
    description: "Compare motorcycle prices, specifications, tire sizes and ownership research across Philippine-market bikes and globally searched motorcycle models.",
    path: "/motorcycles",
    index: currentModels.length > 0 && !hasActiveFilters
  });
}

export default function MotorcyclesPage() {
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

  return <section className={`${styles.page} motorcycles-index-v300`}>
    <div className="motorcycle-index-hero">
      <div className="shell">
        <div className={`motorcycle-index-hero-grid ${styles.heroGrid}`}>
          <div className={`motorcycle-index-hero-copy ${styles.heroCopy}`}>
            <span className="entity-kicker">Motorcycle research database</span>
            <h1>Motorcycle prices, specs and model research</h1>
            <p>Compare motorcycles by price, brand, body type and specifications. MotoIndex covers Philippine-market bikes plus globally searched models riders research across countries.</p>
            <div className="motorcycle-index-actions">
              <a className="button" href="#browse-models">Browse motorcycles</a>
              <Link className="button secondary" href="/finder">Find my match</Link>
              <Link className="button secondary" href="/compare">Compare models</Link>
            </div>
          </div>
          <aside className="motorcycle-index-overview" aria-label="MotoIndex motorcycle catalog overview">
            <div><span>Researched models</span><strong>{currentModels.length}</strong><small>Motorcycle records with checked references</small></div>
            <div><span>Brands researched</span><strong>{makes.length}</strong><small>Philippine and global-interest coverage</small></div>
            <div><span>Price span</span><strong>{overallLow && overallHigh ? `${php(overallLow)}–${php(overallHigh)}` : "Updating"}</strong><small>PHP reference prices where available</small></div>
            <div><span>Buyer briefs</span><strong>{authorityModels.length}</strong><small>Expanded ownership and alternatives context</small></div>
          </aside>
        </div>
        <div className="motorcycle-index-quicklinks">
          <Link href="/recommendations#budget"><span>Budget</span><strong>Under ₱100K</strong><small>Affordable current models →</small></Link>
          <Link href="/recommendations#budget"><span>Budget</span><strong>₱100K–₱150K</strong><small>Popular commuter price band →</small></Link>
          <Link href="/recommendations#scooters"><span>Body type</span><strong>Scooters</strong><small>Automatic city-focused choices →</small></Link>
          <Link href="/recommendations#400cc"><span>Displacement</span><strong>400cc+</strong><small>Bigger bikes and performance research →</small></Link>
          <Link href="/motorcycles/electric"><span>Electric</span><strong>Electric motorcycles</strong><small>Battery, range and charging research →</small></Link>
        </div>
      </div>
    </div>

    <div className="shell motorcycle-index-body">
      {currentModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
        <RecentlyViewedRail models={recentModels} />
        <section id="browse-models" className="motorcycle-catalog-section">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Main shopping experience</span><h2>Filter the catalog without opening twenty tabs</h2><p>Your filters stay in the URL, the compare tray stays persistent, and recently viewed motorcycles remain available when you come back.</p></div></div>
          <ModelExplorer models={forClient(currentModels)} />
        </section>

        <section className="motorcycle-brand-directory">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse by brand</span><h2>Verified brand coverage.</h2><p>Counts include Philippine-market motorcycles and widely researched models from other markets. Prices and core specifications are checked before a model is published.</p></div></div>
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

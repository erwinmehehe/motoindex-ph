import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelExplorer } from "@/components/ModelExplorer";
import { RecentlyViewedRail } from "@/components/RecentlyViewed";
import { SectionHeader, StatRow } from "@/components/ui";
import { modelFamilies } from "@/lib/families";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { forClient } from "@/lib/competitors";
import { observedMarketRange } from "@/lib/marketChecks";
import {
  currentPublicMotorcycles,
  marketBrandCount,
  marketMedianPrice,
  marketPriceSpan
} from "@/lib/motorcycleMarket";
import { php } from "@/lib/utils";
import styles from "./motorcycles.module.css";

const publicModels = motorcycles.filter(isIndexableModel);
const publicIds = new Set(publicModels.map((m) => m.id));
const publicFamilies = modelFamilies.filter((f) => f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
const currentModels = currentPublicMotorcycles;
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
    title: "Motorcycle Price List Philippines 2026 | MotoIndex",
    description: "Compare current motorcycle prices in the Philippines by brand, category, engine size and budget, with checked specs, model research and ownership tools.",
    path: "/motorcycles",
    index: currentModels.length > 0 && !hasActiveFilters
  });
}

export default function MotorcyclesPage() {
  const makes = [...new Map(currentModels.map((m) => [m.makeSlug, m.make])).entries()];
  const authorityModels = currentModels.filter((model) => Boolean(modelAuthorityProfile(model.id)));
  const priceSpan = marketPriceSpan(currentModels);
  const medianPrice = marketMedianPrice(currentModels);
  const under100k = currentModels.filter((model) => observedMarketRange(model).from < 100000).length;
  const automatic = currentModels.filter((model) => model.transmission === "Automatic").length;
  const scooters = currentModels.filter((model) => /scooter/i.test(model.category)).length;
  const fourHundredPlus = currentModels.filter((model) => model.engineCc >= 400).length;
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
            <span className="entity-kicker">Philippine motorcycle price list</span>
            <h1>Motorcycle prices in the Philippines</h1>
            <p>Compare current motorcycle prices, specifications and model research by brand, category, engine size and budget. Every published model keeps its own source and verification date.</p>
            <div className="motorcycle-index-actions">
              <a className="button" href="#browse-models">Browse motorcycles</a>
              <Link className="button secondary" href="/finder">Find my match</Link>
              <Link className="button secondary" href="/compare">Compare models</Link>
            </div>
          </div>
          <aside className="motorcycle-index-overview" aria-label="MotoIndex motorcycle market overview">
            <div><span>Current models</span><strong>{currentModels.length}</strong><small>Indexable current motorcycle records</small></div>
            <div><span>Brands researched</span><strong>{marketBrandCount(currentModels)}</strong><small>Brands with current published models</small></div>
            <div><span>Observed price span</span><strong>{priceSpan.low && priceSpan.high ? `${php(priceSpan.low)}–${php(priceSpan.high)}` : "Updating"}</strong><small>Starting-to-high observed PHP prices</small></div>
            <div><span>Buyer briefs</span><strong>{authorityModels.length}</strong><small>Models with expanded decision context</small></div>
          </aside>
        </div>
        <div className="motorcycle-index-quicklinks">
          <Link href="/recommendations/motorcycles-under-100k"><span>Budget</span><strong>Under ₱100K</strong><small>Current affordable models →</small></Link>
          <Link href="/recommendations/motorcycles-100k-to-150k"><span>Budget</span><strong>₱100K–₱150K</strong><small>Compare the middle price band →</small></Link>
          <Link href="/motorcycles/scooters"><span>Category</span><strong>Scooters</strong><small>National scooter price list →</small></Link>
          <Link href="/recommendations/motorcycles-400cc-plus-philippines"><span>Displacement</span><strong>400cc+</strong><small>Big-bike research →</small></Link>
          <Link href="/motorcycles/electric"><span>Electric</span><strong>Electric motorcycles</strong><small>Battery, range and charging research →</small></Link>
        </div>
      </div>
    </div>

    <div className="shell motorcycle-index-body">
      {currentModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
        <RecentlyViewedRail models={recentModels} />

        <section className={styles.marketSnapshot}>
          <SectionHeader
            kicker="Market snapshot"
            title="What the current MotoIndex dataset shows"
            description="These figures are calculated from current indexable motorcycle records and observed starting prices. They update with the underlying model data."
          />
          <StatRow items={[
            { label: "Median starting price", value: medianPrice ? php(medianPrice) : "Updating", note: "Median observed entry price" },
            { label: "Below ₱100K", value: under100k, note: "Current models" },
            { label: "Automatic", value: automatic, note: "Current automatic records" },
            { label: "Scooters", value: scooters, note: "Current scooter categories" },
            { label: "400cc+", value: fourHundredPlus, note: "Current larger-displacement models" }
          ]} />
        </section>

        <section id="browse-models" className="motorcycle-catalog-section">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Full price list</span><h2>Browse and filter current motorcycle models</h2><p>Use filters to narrow the market, then open a model page for dated prices, specifications, financing context, fitment and ownership information.</p></div></div>
          <ModelExplorer models={forClient(currentModels)} />
        </section>

        <section className="motorcycle-brand-directory">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse by brand</span><h2>Motorcycle brands and current price ranges</h2><p>Each brand hub keeps its current models, observed price span and model-family context on one canonical destination.</p></div></div>
          <div className="motorcycle-brand-directory-grid">{brandDirectory.map((brand) => <Link href={`/motorcycles/${brand.slug}`} key={brand.slug}><div className="motorcycle-brand-mark" aria-hidden="true">{brand.name.slice(0,2).toUpperCase()}</div><div><strong>{brand.name}</strong><small>{brand.count} current {brand.count === 1 ? "model" : "models"}</small></div><span>{php(brand.low)}{brand.high > brand.low ? `–${php(brand.high)}` : ""}</span></Link>)}</div>
        </section>

        {publicFamilies.length > 0 && <section className="motorcycle-family-strip">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Model families</span><h2>Compare generations without mixing prices</h2><p>Family hubs are for searches like Click, NMAX and Aerox where the generation matters as much as the name.</p></div></div>
          <div className="motorcycle-family-card-grid">{publicFamilies.map((family) => <Link key={`${family.makeSlug}-${family.slug}`} href={`/motorcycles/${family.makeSlug}/${family.slug}`}><span>{family.make}</span><strong>{family.name}</strong><small>{family.generationIds.length} generations covered · Compare generations →</small></Link>)}</div>
        </section>}

        <section className="motorcycle-index-method">
          <div><span className="section-kicker">A simpler decision path</span><h2>Shortlist first. Verify the details before paying.</h2><p>Use category and budget hubs to narrow the market, then use the model page for dated prices, fit, financing and ownership context.</p></div>
          <div className="motorcycle-index-method-grid">
            <article><b>01</b><strong>Explore</strong><small>Start with category, budget, brand or displacement.</small></article>
            <article><b>02</b><strong>Compare</strong><small>Keep up to three motorcycles in the persistent tray.</small></article>
            <article><b>03</b><strong>Verify</strong><small>Open the model and check price dates, fit and ownership cost.</small></article>
          </div>
        </section>
      </>}
    </div>
  </section>;
}

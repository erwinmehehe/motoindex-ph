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
const availabilityToVerify = publicModels.filter((m) => m.marketStatus === "uncertain");
const previousModels = publicModels.filter((m) => m.marketStatus === "previous" || m.marketStatus === "discontinued");

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices Philippines",
  description: "Compare current Philippine motorcycle prices, specifications, tire sizes and ownership information across major motorcycle brands.",
  path: "/motorcycles",
  index: currentModels.length > 0
});

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
            <span className="entity-kicker">Philippines motorcycle research</span>
            <h1>Motorcycle prices in the Philippines</h1>
            <p>Compare current Philippine motorcycles by price, brand and buyer-friendly body type, then use the model page for fit, financing and ownership details.</p>
            <div className="motorcycle-index-actions">
              <a className="button" href="#browse-models">Browse motorcycles</a>
              <Link className="button secondary" href="/finder">Find my match</Link>
              <Link className="button secondary" href="/compare">Compare models</Link>
            </div>
          </div>
          <aside className="motorcycle-index-overview" aria-label="MotoIndex motorcycle catalog overview">
            <div><span>Current motorcycles</span><strong>{currentModels.length}</strong><small>Current, indexable Philippine-market records</small></div>
            <div><span>Brands researched</span><strong>{makes.length}</strong><small>With checked current model records</small></div>
            <div><span>Price span</span><strong>{overallLow && overallHigh ? `${php(overallLow)}–${php(overallHigh)}` : "Updating"}</strong><small>Current-model published references</small></div>
            <div><span>Buyer briefs</span><strong>{authorityModels.length}</strong><small>Expanded ownership and alternatives context</small></div>
          </aside>
        </div>
        <div className="motorcycle-index-quicklinks">
          <Link href="/recommendations#budget"><span>Budget</span><strong>Under ₱100K</strong><small>Affordable current models →</small></Link>
          <Link href={{ pathname:"/motorcycles", query:{ budget:"100to150" } }}><span>Budget</span><strong>₱100K–₱150K</strong><small>Popular commuter price band →</small></Link>
          <Link href={{ pathname:"/motorcycles", query:{ type:"Scooter" } }}><span>Body type</span><strong>Scooters</strong><small>Automatic city-focused choices →</small></Link>
          <Link href="/recommendations#400cc"><span>Displacement</span><strong>400cc+</strong><small>Bigger bikes and expressway-planning research →</small></Link>
          <Link href="/motorcycles/electric"><span>Electric</span><strong>Electric motorcycles</strong><small>Battery, range and charging research →</small></Link>
        </div>
      </div>
    </div>

    <div className="shell motorcycle-index-body">
      {currentModels.length === 0 ? <div className="note-box"><h2>Motorcycle data is being updated</h2><p>Prices and specifications are still being checked. Gear and ownership tools remain available in the meantime.</p></div> : <>
        <RecentlyViewedRail models={recentModels} />
        <section id="browse-models" className="motorcycle-catalog-section">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Current motorcycles</span><h2>Search, filter, then open the bikes that matter</h2><p>The default catalog contains current motorcycles only. Previous generations stay available lower on the page for owners and used-bike research.</p></div></div>
          <ModelExplorer models={forClient(currentModels)} />
        </section>

        <section className="motorcycle-brand-directory">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Browse by brand</span><h2>Current brand coverage</h2><p>Counts below use the same current-model set as the catalog above.</p></div></div>
          <div className="motorcycle-brand-directory-grid">{brandDirectory.map((brand) => <Link href={`/motorcycles/${brand.slug}`} key={brand.slug}><div className="motorcycle-brand-mark" aria-hidden="true">{brand.name.slice(0,2).toUpperCase()}</div><div><strong>{brand.name}</strong><small>{brand.count} current {brand.count === 1 ? "model" : "models"}</small></div><span>{php(brand.low)}{brand.high > brand.low ? `–${php(brand.high)}` : ""}</span></Link>)}</div>
        </section>

        {publicFamilies.length > 0 && <section className="motorcycle-family-strip">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Model families</span><h2>Compare generations without mixing prices</h2><p>Family hubs are for searches like Click, NMAX and Aerox where the generation matters as much as the name.</p></div></div>
          <div className="motorcycle-family-card-grid">{publicFamilies.map((family) => <Link key={`${family.makeSlug}-${family.slug}`} href={`/motorcycles/${family.makeSlug}/${family.slug}`}><span>{family.make}</span><strong>{family.name}</strong><small>{family.generationIds.length} generations covered · Compare generations →</small></Link>)}</div>
        </section>}

        {(availabilityToVerify.length > 0 || previousModels.length > 0) && <section className="motorcycle-family-strip">
          <div className="section-head compact motorcycle-section-heading"><div><span className="section-kicker">Other motorcycle records</span><h2>Availability questions and previous generations</h2><p>These records are intentionally separated from the current shopping catalog so historical or uncertain availability never inflates the current-model count.</p></div></div>
          {availabilityToVerify.length > 0 && <div className="motorcycle-family-card-grid">{availabilityToVerify.map((model) => <Link key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}`}><span>Availability needs verification</span><strong>{model.make} {model.model}</strong><small>Open the research record before relying on current new-bike availability →</small></Link>)}</div>}
          {previousModels.length > 0 && <details className="motorcycle-history-list"><summary>Previous generations ({previousModels.length})</summary><div className="motorcycle-family-card-grid">{previousModels.map((model) => <Link key={model.id} href={`/motorcycles/${model.makeSlug}/${model.slug}`}><span>Previous generation</span><strong>{model.make} {model.model}</strong><small>Historical price and ownership research →</small></Link>)}</div></details>}
        </section>}

        <section className="motorcycle-index-method">
          <div><span className="section-kicker">A simpler decision path</span><h2>Shortlist first. Verify the details before paying.</h2><p>Use catalog filters to get down to a handful of motorcycles, then use the model page for dated prices, fit, financing and ownership context.</p></div>
          <div className="motorcycle-index-method-grid">
            <article><b>01</b><strong>Filter</strong><small>Budget, brand and buyer-friendly body type.</small></article>
            <article><b>02</b><strong>Compare</strong><small>Keep up to three motorcycles in the persistent tray.</small></article>
            <article><b>03</b><strong>Verify</strong><small>Open the model and check price evidence, fit and ownership cost.</small></article>
          </div>
        </section>
      </>}
    </div>
  </section>;
}

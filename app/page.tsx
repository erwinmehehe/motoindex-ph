import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import {
  currentMotorcycles,
  comparisons,
  isIndexableModel,
  isIndexableComparison,
} from "@/lib/data";
import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ModelCard } from "@/components/ModelCard";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { siteStats } from "@/lib/siteStats";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices, Specs & Gear Philippines",
  description: "Compare motorcycle prices, specifications, helmets, tires and ownership costs in the Philippines.",
  path: "/",
});

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];
const startPoints = [
  ["01", "Daily commute", "Practical motorcycles for traffic, errands and frequent riding.", "/recommendations#commuting"],
  ["02", "Scooters", "Automatic choices built around easy city use.", "/recommendations#scooters"],
  ["03", "Beginner friendly", "Approachable choices with fit and weight kept in view.", "/recommendations#rider-fit"],
  ["04", "Under ₱100K", "Current models that fit an entry-level purchase budget.", "/motorcycles?budget=under100"],
  ["05", "400cc and above", "Bigger-displacement options with the important numbers side by side.", "/recommendations#400cc"],
  ["06", "Electric", "Battery, range, charging and registration research.", "/motorcycles/electric"],
] as const;

export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 8);
  const heroModel = verifiedModels.find((model) => model.makeSlug === "yamaha" && model.slug.toLowerCase().includes("aerox")) ?? featured[0];
  const hasComparisons = comparisons.some((comparison) => isIndexableComparison(comparison.slug));

  const brandMap = new Map<string, string>();
  for (const model of verifiedModels) brandMap.set(model.makeSlug, model.make);
  const featuredBrands = [...brandMap.entries()]
    .sort(([aSlug, aName], [bSlug, bName]) => {
      const ai = brandPriority.indexOf(aSlug);
      const bi = brandPriority.indexOf(bSlug);
      return ai === bi ? aName.localeCompare(bName) : (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    })
    .slice(0, 6);

  return (
    <div className="mi-home">
      <section className="mi-hero" aria-labelledby="mi-home-title">
        <div className="mi-grid-bg" aria-hidden="true" />
        <div className="mi-glow mi-glow-red" aria-hidden="true" />
        <div className="mi-glow mi-glow-blue" aria-hidden="true" />
        <div className="shell mi-hero-layout">
          <div className="mi-hero-copy">
            <div className="mi-badge"><b>Motorcycle prices, specs and ownership tools</b><em>Philippines</em></div>
            <h1 id="mi-home-title">Your next <span>motorcycle</span><br />starts here.</h1>
            <p>Compare current motorcycles, published prices, rider fit and ownership costs before you narrow the shortlist.</p>
            <form className="mi-search" action="/motorcycles" method="get" role="search">
              <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand or model</label>
              <input id="mi-home-search" type="search" name="q" placeholder="Search Aerox, ADV, Click, Honda..." />
              <button type="submit">Search bikes</button>
            </form>
            <div className="mi-popular"><b>Popular:</b><Link href="/recommendations#scooters">Scooters</Link><Link href="/recommendations#commuting">Daily commute</Link><Link href="/recommendations#400cc">400cc+</Link><Link href="/motorcycles?budget=under100">Under ₱100K ↗</Link></div>
            <div className="mi-trust"><span>✓ {siteStats.currentMotorcycles} current models</span><span>✓ Compare up to 3</span><span>✓ Save a shortlist</span></div>
          </div>

          <div className="mi-hero-visual">
            <div className="mi-bike-frame">
              {heroModel ? <EntityMedia entityType="motorcycle" entityId={heroModel.id} className="mi-bike-media" priority sizes="(max-width: 900px) 90vw, 44vw" showCredit={false} fallback={<div className="mi-bike-fallback">MotoIndex PH</div>} /> : <div className="mi-bike-fallback">MotoIndex PH</div>}
            </div>
            <div className="mi-float mi-current">● Current model research</div>
            {heroModel && <><div className="mi-float mi-specs"><small>{heroModel.make} {heroModel.model}</small><b>{heroModel.engineCc} cc</b><b>{heroModel.powerHp} hp</b><b>{heroModel.seatHeightMm} mm seat</b></div><div className="mi-float mi-price"><small>Published price</small><strong>{observedMarketPriceLabel(heroModel)}</strong></div></>}
          </div>
        </div>
      </section>

      {featuredBrands.length > 0 && <section className="mi-brand-shelf"><div className="shell"><div className="mi-section-head compact"><div><span className="mi-eyebrow">Browse by brand</span><h2>Start with the names you know.</h2></div><Link href="/motorcycles">All motorcycles →</Link></div><nav className="mi-brand-grid" aria-label="Featured motorcycle brands">{featuredBrands.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><strong>{name}</strong><span>Models and prices ↗</span></Link>)}</nav></div></section>}

      {featured.length > 0 && <section className="mi-section mi-models"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Current motorcycles</span><h2>Open a model. <em>See the whole picture.</em></h2><p>Price context, key specs, rider fit and ownership research stay together on one model page.</p></div><Link href="/motorcycles">Explore all motorcycles →</Link></div><div className="mi-model-grid">{featured.map((model) => <ModelCard key={model.id} model={model} />)}</div><div className="mi-showcase-cta"><div><span>Need a shorter list?</span><strong>Tell the Finder how you actually ride.</strong></div><Link className="mi-btn dark" href="/finder">Find my motorcycle</Link>{hasComparisons && <Link className="mi-btn light" href="/compare">Compare models</Link>}</div></div></section>}

      <section className="mi-section mi-categories"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Choose your starting point</span><h2>Start with what <em>matters to you.</em></h2><p>Budget, daily use and rider fit are usually more useful than scrolling every motorcycle in the catalog.</p></div><Link href="/recommendations">Buying guides →</Link></div><div className="mi-category-grid">{startPoints.map(([number, title, copy, href]) => <Link key={title} href={href} className="mi-category-card"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><small>Explore →</small></Link>)}</div></div></section>

      <section className="mi-tools"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><div className="mi-section-head dark-head"><div><span className="mi-eyebrow">Before you buy</span><h2>Do the math <em>before the dealership.</em></h2><p>Compare the motorcycle, the monthly cost and the budget you actually want to live with.</p></div><Link href="/tools">All tools →</Link></div><div className="mi-tool-grid">{hasComparisons && <Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specs and rider fit side by side.</p><b>Compare →</b></Link>}<Link href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link><Link href="/commute/affordability"><span>03</span><h3>Affordability</h3><p>Set a monthly ceiling before a payment looks deceptively cheap.</p><b>Plan budget →</b></Link></div></div></section>

      <section className="mi-section mi-gear"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">After the motorcycle</span><h2>Sort the <em>essentials.</em></h2><p>Verified helmet, tire and storage records for the gear decisions that come next.</p></div><Link href="/gear/helmets">Browse gear →</Link></div><div className="mi-product-grid">{helmetProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{tireProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{topBoxProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}} />)}</div></div></section>

      <section className="mi-final"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><span>Start with the shortlist</span><h2>Find the right bike. <em>Then verify it.</em></h2><p>Browse the catalog when you already have a few models in mind. Use the Finder when you only know what the motorcycle needs to do.</p><div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles</Link><Link className="mi-btn glass" href="/finder">Find my motorcycle</Link></div></div></section>
    </div>
  );
}

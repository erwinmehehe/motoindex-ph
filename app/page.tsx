import type { Metadata } from "next";
import Image from "next/image";
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
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { siteStats } from "@/lib/siteStats";
import { HomeMotoSearch } from "@/components/HomeMotoSearch";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";

export const dynamic = "force-static";
export const revalidate = false;

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
  ["04", "Under ₱100K", "Current models that fit an entry-level purchase budget.", "/recommendations#budget"],
  ["05", "400cc and above", "Bigger-displacement options with the important numbers side by side.", "/recommendations#400cc"],
  ["06", "Electric", "Battery, range, charging and registration research.", "/motorcycles/electric"],
] as const;

export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 4);
  const heroModel = verifiedModels.find((model) => model.makeSlug === "yamaha" && model.slug.toLowerCase().includes("aerox")) ?? featured[0];
  const hasComparisons = comparisons.some((comparison) => isIndexableComparison(comparison.slug));
  const featuredHelmets = helmetProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);
  const featuredTires = tireProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);
  const featuredTopBoxes = topBoxProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);

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
            <div className="mi-badge"><b>The complete Philippine motorcycle guide</b><em>{siteStats.currentMotorcycles} current models</em></div>
            <h1 id="mi-home-title">Find the right motorcycle <span>for your next ride.</span></h1>
            <p><strong>Compare motorcycle prices and specs in the Philippines.</strong> Research current published prices, rider fit, key specifications and ownership costs in one place.</p>
            <HomeMotoSearch models={verifiedModels.map((model) => ({
              id: model.id,
              make: model.make,
              makeSlug: model.makeSlug,
              model: model.model,
              slug: model.slug,
              category: model.category,
              engineCc: model.engineCc,
              priceLabel: observedMarketPriceLabel(model)
            }))} />
            <div className="wire-quick-features" aria-label="MotoIndex research shortcuts">
              {hasComparisons && <Link href="/compare"><span>01</span><b>Compare</b><small>Up to 3 motorcycles</small></Link>}
              <Link href="/price-list"><span>02</span><b>Latest prices</b><small>Current PH references</small></Link>
              <Link href="/motorcycles"><span>03</span><b>Detailed specs</b><small>Engine, fit and dimensions</small></Link>
              <Link href="/guides"><span>04</span><b>Rider guides</b><small>Buying and ownership</small></Link>
            </div>
          </div>

          <div className="mi-hero-visual mi-hero-product-visual">
            {heroModel ? <article className="wire-hero-bike-card">
              <div className="wire-hero-bike-copy">
                <span>Featured model</span>
                <h2>{heroModel.make} {heroModel.model}</h2>
                <p>{heroModel.summary}</p>
                <strong>{observedMarketPriceLabel(heroModel)}</strong>
              </div>
              <EntityMedia
                entityType="motorcycle"
                entityId={heroModel.id}
                className="wire-hero-bike-media"
                priority
                showCredit={false}
                sizes="(max-width: 820px) 92vw, 44vw"
                fallback={<EntityVerificationFallback brand={heroModel.make} model={heroModel.model} className="wire-hero-bike-fallback" />}
              />
              <div className="wire-hero-bike-specs" aria-label={`${heroModel.make} ${heroModel.model} featured specifications`}>
                <span><small>Engine</small><b>{heroModel.engineCc} cc</b></span>
                <span><small>Power</small><b>{heroModel.powerHp} hp</b></span>
                <span><small>Seat</small><b>{heroModel.seatHeightMm} mm</b></span>
              </div>
              <div className="wire-hero-bike-actions">
                <Link className="mi-btn dark" href={`/motorcycles/${heroModel.makeSlug}/${heroModel.slug}`}>View model →</Link>
                {hasComparisons && <Link className="mi-btn light" href="/compare">Compare</Link>}
              </div>
            </article> : <div className="mi-research-empty"><strong>Research motorcycles with the numbers that matter.</strong><Link href="/motorcycles">Explore motorcycles →</Link></div>}
          </div>
          </div>
        </div>
      </section>

      {featuredBrands.length > 0 && <section className="mi-brand-shelf"><div className="shell"><div className="mi-section-head compact"><div><span className="mi-eyebrow">Browse by brand</span><h2>Start with the names you know.</h2></div><Link href="/motorcycles">All motorcycles →</Link></div><nav className="mi-brand-grid" aria-label="Featured motorcycle brands">{featuredBrands.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><span className="mi-brand-mark" aria-hidden="true"><Image src={`/brand/motorcycle/${slug}.svg`} alt="" width={120} height={40} unoptimized /></span><strong>{name}</strong><span>{verifiedModels.filter((model) => model.makeSlug === slug).length} models</span></Link>)}</nav></div></section>}

      {featured.length > 0 && <section className="mi-section mi-models"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Current motorcycles</span><h2>Open a model. <em>See the whole picture.</em></h2><p>Price context, key specs, rider fit and ownership research stay together on one model page.</p></div><Link href="/motorcycles">Explore all motorcycles →</Link></div><div className="mi-model-grid">{featured.map((model) => <MotorcycleCard key={model.id} model={model} variant="standard" />)}</div><div className="mi-showcase-cta"><div><span>Need a shorter list?</span><strong>Tell the Finder how you actually ride.</strong></div><Link className="mi-btn dark" href="/finder">Find my motorcycle</Link>{hasComparisons && <Link className="mi-btn light" href="/compare">Compare models</Link>}</div></div></section>}

      <section className="mi-section mi-categories"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Choose your starting point</span><h2>Start with what <em>matters to you.</em></h2><p>Budget, daily use and rider fit are usually more useful than scrolling every motorcycle in the catalog.</p></div><Link href="/recommendations">Buying guides →</Link></div><div className="mi-category-grid">{startPoints.map(([number, title, copy, href]) => <Link key={title} href={href} className="mi-category-card"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><small>Explore →</small></Link>)}</div></div></section>

      <section className="mi-tools"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><div className="mi-section-head dark-head"><div><span className="mi-eyebrow">Before you buy</span><h2>Do the math <em>before the dealership.</em></h2><p>Compare the motorcycle, the monthly cost and the budget you actually want to live with.</p></div><Link href="/tools">All tools →</Link></div><div className="mi-tool-grid">{hasComparisons && <Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specs and rider fit side by side.</p><b>Compare →</b></Link>}<Link href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link><Link href="/commute/affordability"><span>03</span><h3>Affordability</h3><p>Set a monthly ceiling before a payment looks deceptively cheap.</p><b>Plan budget →</b></Link></div></div></section>

      <section className="mi-section mi-gear"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">After the motorcycle</span><h2>Sort the <em>essentials.</em></h2><p>Only priced, verified helmet, tire and storage records appear on this homepage shelf.</p></div><Link href="/gear/helmets">Browse gear →</Link></div><div className="mi-product-grid">{featuredHelmets.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{featuredTires.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{featuredTopBoxes.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}} />)}</div></div></section>

      <section className="mi-final"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><span>Start with the shortlist</span><h2>Find the right bike. <em>Then verify it.</em></h2><p>Browse the catalog when you already have a few models in mind. Use the Finder when you only know what the motorcycle needs to do.</p><div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles</Link><Link className="mi-btn glass" href="/finder">Find my motorcycle</Link></div></div></section>
    </div>
  );
}

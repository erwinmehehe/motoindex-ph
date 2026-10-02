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
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { siteStats } from "@/lib/siteStats";

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices, Specs & Gear Philippines",
  description: "Compare motorcycle prices, specifications, helmets, tires and ownership costs in the Philippines.",
  path: "/",
});

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];

const categoryShortcuts = [
  ["Scooter", "/motorcycles/scooters", "🛵"],
  ["Underbone", "/recommendations#commuting", "◒"],
  ["Naked", "/recommendations", "◆"],
  ["Sports", "/recommendations", "🏁"],
  ["Adventure", "/recommendations", "△"],
  ["Big Bike", "/recommendations#400cc", "⬡"],
  ["Electric", "/motorcycles/electric", "⚡"],
] as const;

const startPoints = [
  ["01", "Daily commute", "Practical motorcycles for traffic, errands and frequent riding.", "/recommendations#commuting"],
  ["02", "Scooters", "Automatic choices built around easy city use.", "/motorcycles/scooters"],
  ["03", "Beginner friendly", "Approachable choices with fit and weight kept in view.", "/recommendations#rider-fit"],
  ["04", "Under ₱100K", "Current models that fit an entry-level purchase budget.", "/recommendations#budget"],
  ["05", "400cc and above", "Bigger-displacement options with the important numbers side by side.", "/recommendations#400cc"],
  ["06", "Electric", "Battery, range, charging and registration research.", "/motorcycles/electric"],
] as const;

const featureLinks = [
  ["Compare", "Up to 3 motorcycles", "/compare"],
  ["Latest Prices", "Updated for PH market", "/motorcycles"],
  ["Detailed Specs", "Engine, features, dimensions", "/motorcycles"],
  ["Rider Guides", "Tips, reviews and more", "/guides"],
] as const;

export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 4);
  const heroModel =
    verifiedModels.find((model) => model.makeSlug === "yamaha" && /nmax/i.test(model.slug)) ??
    verifiedModels.find((model) => model.makeSlug === "yamaha" && /aerox/i.test(model.slug)) ??
    featured[0];
  const hasComparisons = comparisons.some((comparison) => isIndexableComparison(comparison.slug));
  const featuredHelmets = helmetProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);
  const featuredTires = tireProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);
  const featuredTopBoxes = topBoxProducts.filter((p) => p.status === "verified" && typeof p.priceFromPhp === "number").slice(0, 2);

  const brandMap = new Map<string, { name: string; count: number }>();
  for (const model of verifiedModels) {
    const existing = brandMap.get(model.makeSlug);
    brandMap.set(model.makeSlug, { name: model.make, count: (existing?.count || 0) + 1 });
  }
  const featuredBrands = [...brandMap.entries()]
    .sort(([aSlug, a], [bSlug, b]) => {
      const ai = brandPriority.indexOf(aSlug);
      const bi = brandPriority.indexOf(bSlug);
      return ai === bi ? a.name.localeCompare(b.name) : (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    })
    .slice(0, 6);

  return (
    <div className="mi-home">
      <section className="mi-market-hero" aria-labelledby="mi-home-title">
        <div className="shell">
          <div className="mi-market-hero-grid">
            <div className="mi-market-hero-copy">
              <span className="mi-market-eyebrow">Find the right motorcycle for your next ride.</span>
              <h1 id="mi-home-title">Compare <span>motorcycle prices</span><br />and specs in the Philippines.</h1>
              <p>Compare current prices, specifications and features across motorcycles available in the Philippines, from scooters and commuter bikes to big bikes.</p>
            </div>

            {heroModel && <div className="mi-market-hero-bike">
              <div className="mi-market-brand">
                <Image src={"/brand/motorcycle/" + heroModel.makeSlug + ".svg"} alt={heroModel.make + " logo"} width={118} height={34} unoptimized />
                <small>{heroModel.model}</small>
              </div>
              <EntityMedia
                entityType="motorcycle"
                entityId={heroModel.id}
                className="mi-market-hero-media"
                priority
                showCredit={false}
                sizes="(max-width: 780px) 100vw, 48vw"
                fallback={<EntityVerificationFallback brand={heroModel.make} model={heroModel.model} />}
              />
              <Link className="mi-market-bike-caption" href={"/motorcycles/" + heroModel.makeSlug + "/" + heroModel.slug}>
                <span>{heroModel.make} {heroModel.model}</span>
                <strong>{observedMarketPriceLabel(heroModel)}</strong>
              </Link>
            </div>}
          </div>

          <form className="mi-market-search" action="/motorcycles" method="get" role="search">
            <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand or model</label>
            <span aria-hidden="true" className="mi-search-icon">⌕</span>
            <input id="mi-home-search" type="search" name="q" placeholder="Search motorcycles (e.g. NMAX, Click, ADV 160...)" />
            <button type="submit" aria-label="Search motorcycles">Search</button>
          </form>

          <nav className="mi-category-shortcuts" aria-label="Popular motorcycle categories">
            {categoryShortcuts.map(([label, href, icon]) => <Link href={href} key={label}>
              <span className="mi-category-icon" aria-hidden="true">{icon}</span>
              <strong>{label}</strong>
            </Link>)}
          </nav>
        </div>
      </section>

      {featuredBrands.length > 0 && <section className="mi-market-section mi-market-brands">
        <div className="shell">
          <div className="mi-market-section-head">
            <h2>Popular Brands</h2>
            <Link href="/motorcycles">View all brands →</Link>
          </div>
          <nav className="mi-market-brand-grid" aria-label="Featured motorcycle brands">
            {featuredBrands.map(([slug, brand]) => <Link key={slug} href={"/motorcycles/" + slug}>
              <span className="mi-market-brand-logo"><Image src={"/brand/motorcycle/" + slug + ".svg"} alt="" width={108} height={36} unoptimized /></span>
              <strong>{brand.name}</strong>
              <small>{brand.count} {brand.count === 1 ? "model" : "models"}</small>
            </Link>)}
          </nav>
        </div>
      </section>}

      {featured.length > 0 && <section className="mi-market-section mi-market-latest">
        <div className="shell">
          <div className="mi-market-section-head">
            <h2>Latest Motorcycles</h2>
            <Link href="/motorcycles">View all →</Link>
          </div>
          <div className="mi-market-model-grid">
            {featured.map((model) => <MotorcycleCard key={model.id} model={model} variant="standard" />)}
          </div>
        </div>
      </section>}

      <section className="mi-market-features" aria-label="MotoIndex research features">
        <div className="shell mi-market-feature-grid">
          {featureLinks.map(([title, copy, href], index) => {
            if (title === "Compare" && !hasComparisons) return null;
            return <Link href={href} key={title}>
              <span className="mi-market-feature-icon" aria-hidden="true">{index + 1}</span>
              <div><strong>{title}</strong><small>{copy}</small></div>
            </Link>;
          })}
        </div>
      </section>

      <section className="mi-section mi-categories">
        <div className="shell">
          <div className="mi-section-head">
            <div><span className="mi-eyebrow">Choose your starting point</span><h2>Start with what <em>matters to you.</em></h2><p>Budget, daily use and rider fit are usually more useful than scrolling every motorcycle in the catalog.</p></div>
            <Link href="/recommendations">Buying guides →</Link>
          </div>
          <div className="mi-category-grid">{startPoints.map(([number, title, copy, href]) => <Link key={title} href={href} className="mi-category-card"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><small>Explore →</small></Link>)}</div>
        </div>
      </section>

      <section className="mi-tools">
        <div className="shell">
          <div className="mi-section-head dark-head">
            <div><span className="mi-eyebrow">Before you buy</span><h2>Do the math <em>before the dealership.</em></h2><p>Compare the motorcycle, the monthly cost and the budget you actually want to live with.</p></div>
            <Link href="/tools">All tools →</Link>
          </div>
          <div className="mi-tool-grid">
            {hasComparisons && <Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specs and rider fit side by side.</p><b>Compare →</b></Link>}
            <Link href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link>
            <Link href="/commute/affordability"><span>03</span><h3>Affordability</h3><p>Set a monthly ceiling before a payment looks deceptively cheap.</p><b>Plan budget →</b></Link>
          </div>
        </div>
      </section>

      <section className="mi-section mi-gear">
        <div className="shell">
          <div className="mi-section-head">
            <div><span className="mi-eyebrow">After the motorcycle</span><h2>Sort the <em>essentials.</em></h2><p>Only priced, verified helmet, tire and storage records appear on this homepage shelf.</p></div>
            <Link href="/gear/helmets">Browse gear →</Link>
          </div>
          <div className="mi-product-grid">
            {featuredHelmets.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/gear/helmets/" + p.brandSlug + "/" + p.slug,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
            {featuredTires.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/tires/" + p.brandSlug + "/" + p.slug,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
            {featuredTopBoxes.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/accessories/top-box/" + p.slug,category:"Top box",brand:p.brand,model:p.model,meta:p.capacityL + "L " + p.shell,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
          </div>
        </div>
      </section>

      <section className="mi-final">
        <div className="shell">
          <span>Start with the shortlist</span>
          <h2>Find the right bike. <em>Then verify it.</em></h2>
          <p>Browse the catalog when you already have a few models in mind. Use the Finder when you only know what the motorcycle needs to do.</p>
          <div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles</Link><Link className="mi-btn glass" href="/finder">Find my motorcycle</Link></div>
        </div>
      </section>
    </div>
  );
}

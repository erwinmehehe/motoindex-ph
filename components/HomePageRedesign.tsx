import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
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
import styles from "@/app/HomePage.module.css";

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];
const startPoints = [
  ["01", "Daily commute", "Practical motorcycles for traffic, errands and frequent riding.", "/recommendations#commuting"],
  ["02", "Scooters", "Automatic choices built around easy city use.", "/motorcycles/scooters"],
  ["03", "Beginner friendly", "Approachable choices with fit and weight kept in view.", "/recommendations#rider-fit"],
  ["04", "Under ₱100K", "Current models that fit an entry-level purchase budget.", "/recommendations#budget"],
  ["05", "400cc and above", "Bigger-displacement options with the important numbers side by side.", "/recommendations#400cc"],
  ["06", "Electric", "Battery, range, charging and registration research.", "/motorcycles/electric"],
] as const;

const featureLinks = [
  ["01", "Compare motorcycles", "Put up to three bikes side by side.", "/compare"],
  ["02", "Latest prices", "Browse the current Philippine price list.", "/price-list"],
  ["03", "Detailed specs", "Open model-level specifications and research.", "/motorcycles"],
  ["04", "Rider guides", "Buying, ownership and maintenance guidance.", "/guides"],
] as const;

export function HomePageRedesign({ heading }: { heading: ReactNode }) {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 4);
  const heroModel = verifiedModels.find((model) => model.makeSlug === "yamaha" && model.slug.toLowerCase().includes("aerox")) ?? featured[0];
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

  return <div className={styles.page}>
    <section className={styles.hero} data-home-hero aria-labelledby="mi-home-title">
      <div className={["shell", styles.heroInner].join(" ")} data-home-layout>
        <div className={styles.copy}>
          <span className={styles.eyebrow}>Philippine motorcycle research</span>
          {heading}
          <p className={styles.lede}>Find the right motorcycle for your next ride with current price references, specifications, rider-fit data, ownership tools and practical buying guides.</p>

          <form className={styles.search} data-home-search action="/motorcycles" method="get" role="search">
            <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand or model</label>
            <input id="mi-home-search" type="search" name="q" placeholder="Search Aerox, ADV160, Click, Honda..." />
            <button type="submit">Search motorcycles</button>
          </form>

          <nav className={styles.pills} aria-label="Popular motorcycle categories">
            <Link href="/motorcycles/scooters">Scooter</Link>
            <Link href="/recommendations#commuting">Underbone</Link>
            <Link href="/recommendations">Naked</Link>
            <Link href="/recommendations">Sports</Link>
            <Link href="/recommendations">Adventure</Link>
            <Link href="/recommendations#400cc">Big Bike</Link>
          </nav>

          <div className={styles.trust}>
            <span>{siteStats.currentMotorcycles} current models</span>
            <span>Compare up to 3</span>
            <span>Save a shortlist</span>
          </div>
        </div>

        <div className={styles.visual}>
          {heroModel ? <div className={styles.bikeStage} data-home-visual>
            <div className={styles.modelLabel}>
              <Image src={"/brand/motorcycle/" + heroModel.makeSlug + ".svg"} alt={heroModel.make + " logo"} width={110} height={30} unoptimized />
              <span>{heroModel.model}</span>
            </div>
            <EntityMedia
              entityType="motorcycle"
              entityId={heroModel.id}
              className={styles.bikeMedia}
              priority
              showCredit={false}
              sizes="(max-width: 820px) 100vw, 52vw"
              fallback={<EntityVerificationFallback brand={heroModel.make} model={heroModel.model} />}
            />
            <div className={styles.priceCard}>
              <span>Published Philippine price</span>
              <strong>{observedMarketPriceLabel(heroModel)}</strong>
              <div className={styles.metrics} aria-label={heroModel.make + " " + heroModel.model + " quick specifications"}>
                <div><small>Engine</small><b>{heroModel.engineCc} cc</b></div>
                <div><small>Power</small><b>{heroModel.powerHp} hp</b></div>
                <div><small>Seat</small><b>{heroModel.seatHeightMm} mm</b></div>
              </div>
              <Link className={styles.openModel} href={"/motorcycles/" + heroModel.makeSlug + "/" + heroModel.slug}>Open full model guide →</Link>
            </div>
          </div> : <div className={styles.bikeStage} data-home-visual />}
        </div>
      </div>
    </section>

    <section className={styles.featureStrip} aria-label="MotoIndex research tools">
      <div className={["shell", styles.featureGrid].join(" ")}>
        {featureLinks.map(([number, title, copy, href]) => <Link href={href} key={title}>
          <span className={styles.featureNumber}>{number}</span>
          <div><strong>{title}</strong><small>{copy}</small></div>
        </Link>)}
      </div>
    </section>

    {featuredBrands.length > 0 && <section className={styles.section}>
      <div className="shell">
        <div className={styles.sectionHead}>
          <div><span className={styles.sectionKicker}>Popular brands</span><h2>Start with the manufacturers riders already know.</h2></div>
          <Link href="/motorcycles">Browse all motorcycles →</Link>
        </div>
        <nav className={styles.brandGrid} aria-label="Featured motorcycle brands">
          {featuredBrands.map(([slug, brand]) => <Link className={styles.brandCard} key={slug} href={"/motorcycles/" + slug}>
            <span className={styles.brandLogo}><Image src={"/brand/motorcycle/" + slug + ".svg"} alt="" width={120} height={40} unoptimized /></span>
            <div><strong>{brand.name}</strong><small>{brand.count} current {brand.count === 1 ? "model" : "models"} · Prices & specs →</small></div>
          </Link>)}
        </nav>
      </div>
    </section>}

    {featured.length > 0 && <section className={[styles.section, styles.alt].join(" ")}>
      <div className="shell">
        <div className={styles.sectionHead}>
          <div><span className={styles.sectionKicker}>Current motorcycles</span><h2>Open a model and see the whole ownership picture.</h2><p>Price, key specifications, rider fit, financing context and ownership research stay together on the model page.</p></div>
          <Link href="/motorcycles">Explore all motorcycles →</Link>
        </div>
        <div className={styles.modelGrid}>{featured.map((model) => <MotorcycleCard key={model.id} model={model} variant="standard" />)}</div>
      </div>
    </section>}

    <section className={styles.section}>
      <div className="shell">
        <div className={styles.sectionHead}>
          <div><span className={styles.sectionKicker}>Choose your starting point</span><h2>Start with what matters to you.</h2><p>Budget, everyday use and rider fit are usually more useful than scrolling the entire motorcycle market.</p></div>
          <Link href="/recommendations">Open buying guides →</Link>
        </div>
        <div className={styles.categoryGrid}>{startPoints.map(([number, title, copy, href]) => <Link key={title} href={href} className={styles.categoryCard}>
          <span>{number}</span><h3>{title}</h3><p>{copy}</p><small>Explore →</small>
        </Link>)}</div>
      </div>
    </section>

    <section className={[styles.section, styles.alt].join(" ")}>
      <div className="shell">
        <div className={styles.sectionHead}>
          <div><span className={styles.sectionKicker}>Before you buy</span><h2>Do the math before the dealership.</h2><p>Compare the motorcycle, the monthly cost and the budget you actually want to live with.</p></div>
          <Link href="/tools">All tools →</Link>
        </div>
        <div className={styles.toolGrid}>
          {hasComparisons && <Link className={styles.toolCard} href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specifications and rider fit side by side.</p><b>Compare →</b></Link>}
          <Link className={styles.toolCard} href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link>
          <Link className={styles.toolCard} href="/commute/affordability"><span>03</span><h3>Affordability</h3><p>Set a monthly ceiling before a payment starts to look deceptively cheap.</p><b>Plan budget →</b></Link>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className="shell">
        <div className={styles.sectionHead}>
          <div><span className={styles.sectionKicker}>Helmets, tires and storage</span><h2>Sort the essentials after the motorcycle.</h2><p>Only priced, verified gear records appear on this homepage shelf.</p></div>
          <Link href="/gear/helmets">Browse gear →</Link>
        </div>
        <div className={styles.productGrid}>
          {featuredHelmets.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/gear/helmets/" + p.brandSlug + "/" + p.slug,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
          {featuredTires.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/tires/" + p.brandSlug + "/" + p.slug,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
          {featuredTopBoxes.map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:"/accessories/top-box/" + p.slug,category:"Top box",brand:p.brand,model:p.model,meta:p.capacityL + "L " + p.shell,status:p.status,priceFromPhp:p.priceFromPhp}} />)}
        </div>
      </div>
    </section>

    <section className={styles.final}>
      <div className={["shell", styles.finalInner].join(" ")}>
        <span>Start with the shortlist</span>
        <h2>Find the right bike. Then verify the exact unit.</h2>
        <p>Browse the catalog when you already have models in mind. Use the Finder when you only know what the motorcycle needs to do.</p>
        <div className={styles.finalActions}><Link className="button" href="/motorcycles">Explore motorcycles</Link><Link className="button secondary" href="/finder">Find my motorcycle</Link></div>
      </div>
    </section>
  </div>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import {
  accessoryCategories,
  helmetBrands,
  currentMotorcycles,
  recommendationGuides,
  comparisons,
  isIndexableModel,
  isIndexableRecommendation,
  isIndexableComparison,
} from "@/lib/data";
import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ModelCard } from "@/components/ModelCard";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices, Specs & Gear Philippines",
  description: "Compare motorcycle prices, specifications, helmets, tires and ownership costs in the Philippines.",
  path: "/",
});

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];
const startPoints = [
  ["01", "Scooters", "Automatic choices for traffic, errands and everyday commuting.", "/recommendations/scooters-under-150k-philippines"],
  ["02", "Daily commuters", "Practical motorcycles for frequent Philippine road use.", "/recommendations/best-motorcycles-for-daily-commute-philippines"],
  ["03", "Beginner friendly", "Approachable choices before stepping into more bike than you need.", "/recommendations/beginner-friendly-motorcycles-philippines"],
  ["04", "400cc and above", "Bigger-displacement options with the specs that matter side by side.", "/recommendations/motorcycles-400cc-plus-philippines"],
  ["05", "Under ₱100K", "Current models that fit an entry-level purchase budget.", "/motorcycles?budget=under100"],
  ["06", "₱100K–₱150K", "A popular price band for scooters and everyday motorcycles.", "/motorcycles?budget=100to150"],
  ["07", "₱150K–₱200K", "Upper mid-range models with ownership cost kept in view.", "/motorcycles?budget=150to200"],
  ["08", "Electric", "Battery, range, charging and registration research.", "/motorcycles/electric"],
] as const;

const faqs = [
  ["Are MotoIndex prices live dealer quotations?", "No. MotoIndex keeps price references and market context for research. Confirm final cash price, fees, promos and availability with the seller before paying."],
  ["Can I compare motorcycles side by side?", "Yes. Compare puts price, engine, dimensions, power and rider-fit details next to each other so the trade-offs are easier to see."],
  ["Can MotoIndex help me choose by height or daily use?", "Yes. The Finder and fitment tools narrow choices using budget, seat height, traffic, daily distance, passenger needs and luggage."],
  ["Does MotoIndex include ownership costs?", "Yes. Ownership tools help plan financing, fuel, maintenance, insurance, registration and other recurring costs."],
  ["What if I find outdated information?", "Use the corrections page to flag it. Motorcycle data changes, so MotoIndex keeps its research and correction process visible."],
] as const;

export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 8);
  const heroModel = verifiedModels.find((model) => model.makeSlug === "yamaha" && model.slug.toLowerCase().includes("aerox")) ?? featured[0];
  const safeGuides = recommendationGuides.filter((guide) => isIndexableRecommendation(guide.slug));
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
            <div className="mi-badge"><span>New</span><b>The independent motorcycle decision engine</b><em>Philippines</em></div>
            <h1 id="mi-home-title">Your next <span>motorcycle</span><br />starts here.</h1>
            <p>Research current motorcycles in the Philippines, compare specs and published prices, model ownership costs, and find the bike that fits your life, budget and riding needs.</p>
            <form className="mi-search" action="/motorcycles" method="get" role="search">
              <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand or model</label>
              <input id="mi-home-search" type="search" name="q" placeholder="Search by brand or model, e.g. Aerox, ADV, Click" />
              <button type="submit">Search bikes</button>
            </form>
            <div className="mi-popular"><b>Popular:</b><Link href="/recommendations/scooters-under-150k-philippines">Automatic scooters</Link><Link href="/recommendations/best-motorcycles-for-daily-commute-philippines">Daily commuters</Link><Link href="/recommendations/motorcycles-400cc-plus-philippines">400cc+</Link><Link href="/motorcycles?budget=under100">Under ₱100K ↗</Link></div>
            <div className="mi-trust"><span>✓ No signup needed</span><span>✓ {verifiedModels.length} current models</span><span>✓ Save your shortlist</span></div>
          </div>

          <div className="mi-hero-visual">
            <div className="mi-bike-frame">
              {heroModel ? <EntityMedia entityType="motorcycle" entityId={heroModel.id} className="mi-bike-media" priority sizes="(max-width: 900px) 90vw, 44vw" showCredit={false} fallback={<div className="mi-bike-fallback">MotoIndex PH</div>} /> : <div className="mi-bike-fallback">MotoIndex PH</div>}
            </div>
            <div className="mi-float mi-current">● Current model research</div>
            <div className="mi-float mi-stars">★★★★★<small>Built for faster shortlisting</small></div>
            {heroModel && <><div className="mi-float mi-specs"><small>{heroModel.make} {heroModel.model}</small><b>{heroModel.engineCc} cc</b><b>{heroModel.powerHp} hp</b><b>{heroModel.seatHeightMm} mm seat</b></div><div className="mi-float mi-price"><small>Published price context</small><strong>{observedMarketPriceLabel(heroModel)}</strong></div></>}
          </div>
        </div>
      </section>

      {featuredBrands.length > 0 && <section className="mi-brand-shelf"><div className="shell"><div className="mi-section-head compact"><div><span className="mi-eyebrow">Start with a name you know</span><h2>Your favourite brands, properly researched.</h2></div><Link href="/motorcycles">Browse all brands →</Link></div><nav className="mi-brand-grid" aria-label="Featured motorcycle brands">{featuredBrands.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><strong>{name}</strong><span>Models, prices & buying context ↗</span></Link>)}</nav></div></section>}

      <section className="mi-section mi-categories"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Browse by need</span><h2>Eight ways to start. <em>One catalog.</em></h2><p>Begin with the riding style, budget or displacement that matters to you, then move into the real model data.</p></div><Link href="/recommendations">All buying guides →</Link></div><div className="mi-category-grid">{startPoints.map(([number, title, copy, href]) => <Link key={title} href={href} className="mi-category-card"><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><small>Explore →</small></Link>)}</div></div></section>

      {featured.length > 0 && <section className="mi-section mi-models"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Featured motorcycles</span><h2>Current models. Clearer choices. <em>Your next ride.</em></h2><p>Open a model for its price context, core specs, fitment and ownership research.</p></div><Link href="/motorcycles">Explore all motorcycles →</Link></div><div className="mi-model-grid">{featured.map((model) => <ModelCard key={model.id} model={model} />)}</div><div className="mi-showcase-cta"><div><span>Not sure where to start?</span><strong>Use your actual constraints instead of guessing from a list.</strong></div><Link className="mi-btn dark" href="/finder">Find my motorcycle</Link>{hasComparisons && <Link className="mi-btn light" href="/compare">Compare models</Link>}</div></div></section>}

      <section className="mi-section mi-why"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Why MotoIndex</span><h2>Find it, understand it, <em>compare it.</em></h2><p>Research the motorcycle, then check the practical Philippine details that affect ownership after the spec sheet.</p></div></div><div className="mi-feature-grid"><Link className="feature main" href={hasComparisons ? "/compare" : "/finder"}><span>⇄</span><h3>Compare without tab overload</h3><p>Put price, engine, seat height, power and fit context side by side.</p><b>Open comparison →</b></Link><Link className="feature" href="/ownership/cost-calculator"><span>₱</span><h3>Know what it costs after you buy it</h3><p>Model financing and recurring ownership costs before a monthly payment looks deceptively cheap.</p><b>Estimate ownership cost →</b></Link><Link className="feature" href="/fitment"><span>↕</span><h3>Use rider-fit context</h3><p>Seat height and fitment tools help narrow the shortlist.</p><b>Check fitment →</b></Link></div></div></section>

      {safeGuides.length > 0 && <section className="mi-section mi-guides"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Rider knowledge</span><h2>Guides that help you <em>make the call.</em></h2></div><Link href="/recommendations">All guides →</Link></div><div className="mi-guide-grid">{safeGuides.slice(0, 4).map((guide, index) => <Link key={guide.slug} href={`/recommendations/${guide.slug}`}><span>0{index + 1}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read guide →</b></Link>)}</div></div></section>}

      <section className="mi-tools"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><div className="mi-section-head dark-head"><div><span className="mi-eyebrow">Free planning tools</span><h2>Turn the spec sheet into <em>real-life math.</em></h2><p>Use the tools before you commit, then keep them around after you buy.</p></div><Link href="/tools">View all tools →</Link></div><div className="mi-tool-grid">{hasComparisons && <Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specs and rider fit side by side.</p><b>Open tool →</b></Link>}<Link href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link><Link href="/commute/affordability"><span>03</span><h3>Affordability planner</h3><p>Set a monthly cap, reserve and financing assumptions.</p><b>Plan budget →</b></Link><Link href="/commute/cost-calculator"><span>04</span><h3>Commute cost</h3><p>Estimate the recurring cost of the route you actually ride.</p><b>Calculate →</b></Link></div></div></section>

      <section className="mi-section mi-gear"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">After the motorcycle</span><h2>Helmets, tires and <em>useful gear.</em></h2><p>{helmetBrands.length} helmet brands and {accessoryCategories.length} accessory categories connected to rider research.</p></div><Link href="/gear/helmets">Browse gear →</Link></div><div className="mi-product-grid">{helmetProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{tireProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}} />)}{topBoxProducts.filter((p) => p.status === "verified").slice(0, 2).map((p) => <ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}} />)}</div></div></section>

      <section className="mi-section mi-faq"><div className="shell mi-faq-layout"><div><span className="mi-eyebrow">Good questions</span><h2>Honest answers, <em>no fine print.</em></h2><p>Motorcycle data changes. MotoIndex shows context instead of hiding that reality.</p><Link className="mi-correction" href="/corrections"><b>Spot something off?</b><span>Submit a correction →</span></Link></div><div className="mi-faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="mi-final"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><span>Ready when you are</span><h2>Find the right bike. <em>Not just the shiniest one.</em></h2><p>Start with the catalog if you know what you want. Use the Finder if you only know what the motorcycle needs to do.</p><div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles</Link><Link className="mi-btn glass" href="/finder">Find my motorcycle match</Link></div></div></section>
    </div>
  );
}

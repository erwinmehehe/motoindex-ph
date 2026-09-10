import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import {
  currentMotorcycles,
  comparisons,
  isIndexableModel,
  isIndexableComparison,
} from "@/lib/data";
import { ModelCard } from "@/components/ModelCard";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { HomeDecisionEngine, HomeKnowledgeHub, HomeLoanPlanner } from "@/components/HomeInteractiveSections";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Prices, Specs & Gear Philippines",
  description: "Compare motorcycle prices, specifications, ownership costs, rider fit and buying guides in the Philippines.",
  path: "/",
});

const brandPriority = ["honda", "yamaha", "suzuki", "kawasaki", "ktm", "cfmoto"];
const categories = [
  ["Scooters", "Automatic motorcycles for traffic, errands and everyday commuting.", "/motorcycles?category=Scooter", "◒"],
  ["Underbone", "Light, practical motorcycles built around everyday mobility.", "/motorcycles?category=Underbone", "◇"],
  ["Naked", "Upright street motorcycles with performance kept visible.", "/motorcycles?category=Naked", "△"],
  ["Sport", "Faired motorcycles for riders who want sharper road performance.", "/motorcycles?category=Sport", "◢"],
  ["Adventure", "Touring-focused motorcycles for longer rides and mixed roads.", "/motorcycles?category=Adventure", "⌁"],
  ["Cruiser", "Relaxed ergonomics, low-slung styling and road-first comfort.", "/motorcycles?category=Cruiser", "◉"],
  ["Off-road", "Trail and dual-purpose motorcycles for rougher surfaces.", "/motorcycles?category=Off-road", "✣"],
  ["Electric", "Battery, range, charging and registration research.", "/motorcycles/electric", "⚡"],
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

  const matchModels = verifiedModels.slice(0, 36).map((model) => ({
    id: model.id,
    make: model.make,
    model: model.model,
    makeSlug: model.makeSlug,
    slug: model.slug,
    srp: model.srp,
    category: model.category,
    engineCc: model.engineCc,
    powerHp: model.powerHp,
    seatHeightMm: model.seatHeightMm,
    transmission: model.transmission,
  }));

  return (
    <div className="mi-home">
      <section className="mi-hero" aria-labelledby="mi-home-title">
        <div className="mi-grid-bg" aria-hidden="true" />
        <div className="mi-glow mi-glow-red" aria-hidden="true" />
        <div className="mi-glow mi-glow-blue" aria-hidden="true" />
        <div className="mi-glow mi-glow-warm" aria-hidden="true" />
        <div className="shell mi-hero-layout">
          <div className="mi-hero-copy">
            <div className="mi-badge"><span>⚡ New</span><b>The independent motorcycle decision engine</b><em>🇵🇭 Philippines</em></div>
            <h1 id="mi-home-title">Your next <span>motorcycle</span><br />starts here.</h1>
            <p>Research current motorcycles in the Philippines. Compare specs and published prices, model the real cost of ownership, and find the bike that fits your life, budget and rider fit.</p>
            <form className="mi-search" action="/motorcycles" method="get" role="search">
              <label className="sr-only" htmlFor="mi-home-search">Search motorcycles by brand, model or type</label>
              <span aria-hidden="true">⌕</span>
              <input id="mi-home-search" type="search" name="q" placeholder="Search by brand, model, or type - e.g. Aerox, ADV, scooter" />
              <button type="submit">⌕ Search bikes</button>
            </form>
            <div className="mi-popular"><b>Popular:</b><Link href="/motorcycles?transmission=Automatic">Automatic scooters</Link><Link href="/recommendations/best-motorcycles-for-daily-commute-philippines">Daily commuters</Link><Link href="/motorcycles?category=Sport">Sport & naked</Link><Link href="/motorcycles?category=Adventure">Adventure & off-road</Link><Link className="dashed" href="/motorcycles?budget=under100">Under ₱100K ↗</Link></div>
            <div className="mi-trust"><span>✓ No signup needed</span><span>✓ Source-linked model records</span><span>✓ Save your shortlist</span></div>
          </div>

          <div className="mi-hero-visual">
            <div className="mi-hero-halo" aria-hidden="true" />
            <div className="mi-bike-frame">
              {heroModel ? <EntityMedia entityType="motorcycle" entityId={heroModel.id} className="mi-bike-media" priority sizes="(max-width: 900px) 92vw, 44vw" showCredit={false} fallback={<div className="mi-bike-fallback">MotoIndex PH</div>} /> : <div className="mi-bike-fallback">MotoIndex PH</div>}
            </div>
            <div className="mi-float mi-current"><i /> Current model research</div>
            <div className="mi-float mi-stars"><b>★★★★★</b><small>Most-researched maxi-scooter</small></div>
            {heroModel && <><div className="mi-float mi-specs"><small>{heroModel.make} {heroModel.model}</small><div><b>{heroModel.engineCc} cc</b><i /><b>{heroModel.powerHp} hp</b><i /><b>{heroModel.seatHeightMm} mm</b></div></div><div className="mi-float mi-price"><small>Published price context</small><strong>{observedMarketPriceLabel(heroModel)}</strong></div></>}
          </div>
        </div>
        <a className="mi-scroll-cue" href="#brands" aria-label="Continue to motorcycle brands"><span>Scroll to explore</span><i /></a>
      </section>

      {featuredBrands.length > 0 && <section className="mi-brand-shelf" id="brands"><div className="shell"><div className="mi-section-head compact"><div><span className="mi-eyebrow">Start with a name you know</span><h2>Your favourite brands, properly researched.</h2></div><Link href="/motorcycles">Browse all brands →</Link></div><nav className="mi-brand-grid" aria-label="Featured motorcycle brands">{featuredBrands.map(([slug, name]) => <Link key={slug} href={`/motorcycles/${slug}`}><strong>{name}</strong><span>Models, prices & buying guide ↗</span></Link>)}</nav></div></section>}

      <section className="mi-section mi-categories"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Browse by category</span><h2>Eight ways to ride. <em>One catalog.</em></h2><p>Start with the kind of riding you actually do, then move into current model data, fitment and ownership context.</p></div><Link href="/motorcycles">Browse all motorcycles →</Link></div><div className="mi-category-grid">{categories.map(([title, copy, href, icon]) => <Link key={title} href={href} className="mi-category-card"><span className="mi-category-icon">{icon}</span><div><h3>{title}<small>↗</small></h3><p>{copy}</p></div><b>Explore the guide</b></Link>)}</div></div></section>

      {featured.length > 0 && <section className="mi-section mi-models" id="bikes"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Featured motorcycles</span><h2>Current models. Clearer choices. <em>Your next ride.</em></h2><p>Explore published facts, save a contender, and take the same shortlist into a detailed side-by-side comparison.</p></div></div><div className="mi-bike-tabs"><Link className="active" href="/motorcycles">All featured bikes</Link><Link href="/motorcycles?transmission=Automatic">Automatic</Link><Link href="/motorcycles?category=Commuter">Commuter</Link><Link href="/motorcycles?category=Sport">Sport & naked</Link><Link href="/motorcycles?category=Adventure">Adventure</Link></div><div className="mi-model-grid">{featured.map((model) => <ModelCard key={model.id} model={model} />)}</div><div className="mi-model-footer"><Link className="mi-btn red" href="/motorcycles">Explore the motorcycle index →</Link><p>Published price references. Exact variants and source dates are shown on model pages.</p></div></div></section>}

      <HomeDecisionEngine models={matchModels} />

      <section className="mi-section mi-why"><div className="shell"><div className="mi-section-head"><div><span className="mi-eyebrow">Why MotoIndex</span><h2>Three great experiences. <em>Find it, understand it, compare it.</em></h2><p>Everything a rider needs between “I want a bike” and “I’ll take this one”, built around structured motorcycle research for the Philippines.</p></div></div>
        <div className="mi-feature-showcase">
          <Link className="mi-road-card" href="/commute"><div className="mi-road-media">{heroModel && <EntityMedia entityType="motorcycle" entityId={heroModel.id} className="mi-road-bike" sizes="(max-width: 900px) 92vw, 50vw" showCredit={false} fallback={<span />} />}</div><div className="mi-road-overlay"><span>⌖ Built for Philippine roads</span><h3>From EDSA queues to weekend provincial roads</h3><p>Fuel, registration, rain-season commuting and everyday ownership math belong in the decision.</p><div><b>Fuel & maintenance</b><b>LTO & insurance</b><b>Traffic & fit</b></div></div></Link>
          <div className="mi-feature-stack">
            <Link className="mi-compare-card" href={hasComparisons ? "/compare" : "/finder"}><span>⇄</span><h3>Compare without tab overload</h3><p>Put price, engine, seat height, power and rider-fit context side by side.</p><div><b>Seat</b><strong>764 - 790 mm</strong><em>differs</em><b>Power</b><strong>15.1 - 15.8 hp</strong><b>Weight</b><strong>115 - 133 kg</strong><em>differs</em></div></Link>
            <Link className="mi-cost-card" href="/ownership/cost-calculator"><span>₱</span><div><h3>Know what it costs after you buy it</h3><p>Term, down payment and recurring costs stay visible instead of hiding behind one monthly number.</p><strong>₱3,030 <small>/mo example planning view</small></strong></div></Link>
          </div>
        </div>
        <div className="mi-feature-grid mi-feature-grid-small"><Link className="feature" href="/fitment"><span>↕</span><h3>Rider fit context</h3><p>Seat height and fitment tools help narrow the shortlist.</p></Link><Link className="feature" href="/corrections"><span>✓</span><h3>Visible corrections</h3><p>Flag changed pricing or specifications when a record needs another look.</p></Link><Link className="feature" href="/maintenance"><span>⌁</span><h3>Ownership research</h3><p>Keep maintenance and recurring needs in the buying decision.</p></Link><Link className="feature" href="/dealers"><span>⌖</span><h3>Dealer context</h3><p>Move from research to a local seller without pretending a published price is a quote.</p></Link></div>
      </div></section>

      <HomeLoanPlanner />
      <HomeKnowledgeHub />

      <section className="mi-section mi-faq"><div className="shell mi-faq-layout"><div><span className="mi-eyebrow">Good questions</span><h2>Honest answers, <em>no fine print.</em></h2><p>Motorcycle data changes. MotoIndex shows context instead of hiding that reality.</p><Link className="mi-correction" href="/corrections"><b>Spot something off?</b><span>Submit a correction →</span></Link></div><div className="mi-faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></section>

      <section className="mi-final"><div className="mi-grid-bg" aria-hidden="true" /><div className="shell"><span>Ready when you are</span><h2>Find the right bike.<br /><em>Not just the shiniest one.</em></h2><p>Compare your contenders, plan your ownership budget, and walk into a dealer with the right questions and a clearer shortlist.</p><div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles ↗</Link><Link className="mi-btn glass" href="/finder">✦ Find my motorcycle match</Link></div><form className="mi-final-search" action="/search" method="get"><label className="sr-only" htmlFor="mi-final-search">Search the rider knowledge library</label><input id="mi-final-search" type="search" name="q" placeholder="Helmet fit, financing, rainy-season riding..."/><button type="submit">Find a guide</button></form><div className="mi-final-meta"><span>⌖ Metro Manila · Cebu · Davao and nationwide research</span><Link href="/dealers/join">Are you a dealer? Join the directory →</Link></div></div></section>
    </div>
  );
}

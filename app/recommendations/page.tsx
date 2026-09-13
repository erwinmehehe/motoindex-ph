import type { Metadata } from "next";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { observedMarketPriceLabel, observedMarketRange } from "@/lib/marketChecks";
import { AuthorBox } from "@/components/AuthorBox";
import { EntityMedia } from "@/components/EntityMedia";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { FaqSection, type FaqItem } from "@/components/FaqSection";

export const metadata: Metadata = pageMetadata({
  title: "Best Motorcycles Philippines 2026: Buying Guide",
  description: "Choose a motorcycle in the Philippines by budget, riding use, rider fit, ABS, fuel economy and long-distance needs using verified model data.",
  path: "/recommendations",
  index: true
});

function hasConfirmedAbs(value: string) {
  const normalized = value.toLowerCase();
  if (!normalized.includes("abs")) return false;
  if (/no abs|without abs|not confirmed|not stated|not listed|confirm exact abs|abs equipment is not confirmed/.test(normalized)) return false;
  return true;
}

function modelHref(model: Motorcycle) {
  return `/motorcycles/${model.makeSlug}/${model.slug}`;
}

function BikeRail({ models }: { models: Motorcycle[] }) {
  return <div className="rec-bike-rail">{models.map((model) => {
    const href = modelHref(model);
    return <article className="rec-bike-card" key={model.id}>
      <EntityMedia
        entityType="motorcycle"
        entityId={model.id}
        className="rec-bike-media"
        linkHref={href}
        sizes="(max-width: 700px) 78vw, 340px"
        fallback={<Link href={href} className="rec-bike-fallback" aria-label={`View ${model.make} ${model.model}`}><span>{model.engineCc} cc</span><strong>{model.make}</strong><b>{model.model}</b></Link>}
      />
      <Link className="rec-bike-copy" href={href}>
        <span>{model.make}</span>
        <h3>{model.model}</h3>
        <strong>{observedMarketPriceLabel(model)}</strong>
        <small>{model.engineCc} cc · {model.curbWeightKg} kg · {model.seatHeightMm} mm seat{model.transmission ? ` · ${model.transmission}` : ""}</small>
        <em>Open model research →</em>
      </Link>
    </article>;
  })}</div>;
}

function RankedList({ models, metric }: { models: Motorcycle[]; metric: (model: Motorcycle) => string }) {
  return <div className="rec-ranked-list">{models.map((model, index) => <Link href={modelHref(model)} key={model.id}>
    <b>{String(index + 1).padStart(2, "0")}</b>
    <div><span>{model.make}</span><strong>{model.model}</strong><small>{metric(model)}</small></div>
    <em>{observedMarketPriceLabel(model)}</em>
  </Link>)}</div>;
}

export default function RecommendationsPage() {
  const current = [...publicMotorcycles].sort((a, b) => observedMarketRange(a).from - observedMarketRange(b).from);
  const under100 = current.filter((m) => observedMarketRange(m).from < 100000).slice(0, 6);
  const scooters = current.filter((m) => /scooter/i.test(m.category) && m.transmission === "Automatic").slice(0, 6);
  const shortRider = [...current].sort((a, b) => a.seatHeightMm - b.seatHeightMm || a.curbWeightKg - b.curbWeightKg).slice(0, 5);
  const lightweight = [...current].sort((a, b) => a.curbWeightKg - b.curbWeightKg).slice(0, 5);
  const efficient = current.filter((m) => m.fuelConsumptionKmL).sort((a, b) => (b.fuelConsumptionKmL || 0) - (a.fuelConsumptionKmL || 0)).slice(0, 5);
  const absModels = current.filter((m) => hasConfirmedAbs(m.abs)).slice(0, 5);
  const longRide = [...current].filter((m) => m.fuelTankL >= 12).sort((a, b) => b.fuelTankL - a.fuelTankL).slice(0, 5);
  const bigBikes = current.filter((m) => m.engineCc >= 400).slice(0, 5);
  const categories = [...new Map(current.map((m) => [m.category, m])).entries()]
    .map(([category]) => ({ category, count: current.filter((m) => m.category === category).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  const brands = [...new Map(current.map((m) => [m.makeSlug, m.make])).entries()].sort((a, b) => a[1].localeCompare(b[1]));

  const faqs: FaqItem[] = [
    { question: "What is the best motorcycle in the Philippines?", answer: "There is no single best motorcycle for every rider. Start with budget and intended use, then compare physical fit, transmission, weight, braking, fuel use, dealer support and the exact current price." },
    { question: "What motorcycle is best for beginners?", answer: "A beginner shortlist should prioritize manageable weight and fit, predictable controls, braking equipment and proper training rather than choosing by engine displacement alone." },
    { question: "What motorcycle is good for daily commuting?", answer: "For daily commuting, compare fuel use, weight, transmission, seat height, storage needs, traffic conditions and maintenance access. Automatic scooters can reduce shifting workload, but they are not automatically better for every route." },
    { question: "What motorcycle is good for short riders?", answer: "Published seat height is a useful starting point, but seat width, suspension sag, motorcycle weight and your inseam also affect actual ground reach. Sit on the exact motorcycle before buying when possible." },
    { question: "Should I buy based on the lowest price?", answer: "No. The lowest purchase price can narrow a shortlist, but ownership cost, fit, braking, fuel use, parts access and the exact variant can matter more over time." }
  ];

  const schema = articleSchema({
    headline: "Motorcycle buying guide for the Philippines",
    description: "A buyer-focused guide to choosing a motorcycle in the Philippines by budget, use, fit, fuel economy, braking and category.",
    path: "/recommendations",
    about: "motorcycle buying guide Philippines",
    keywords: ["best motorcycles Philippines", "motorcycle buying guide Philippines", "best scooter Philippines", "motorcycle for commuting", "motorcycle for beginners"],
    checkedDates: current.map((m) => m.marketPriceCheckedAt || m.verifiedAt)
  });

  return <section className="recommendations-v2">
    <header className="rec-hero">
      <div className="shell rec-hero-grid">
        <div className="rec-hero-copy">
          <span className="rec-kicker">2026 Philippine buying guide</span>
          <h1>Choose the bike for <em>your actual ride.</em></h1>
          <p>Forget one-size-fits-all rankings. Start with the constraint that matters most, then compare verified Philippine prices, physical fit and ownership tradeoffs.</p>
          <div className="rec-hero-actions">
            <Link className="rec-primary" href="/finder">Find my motorcycle →</Link>
            <Link className="rec-secondary" href="/compare">Compare models</Link>
          </div>
          <div className="rec-hero-proof"><span><b>{current.length}</b> researched current models</span><span><b>{brands.length}</b> brands covered</span><span><b>Traceable</b> price sources</span></div>
        </div>
        <aside className="rec-start-card">
          <span>Start with one constraint</span>
          <a href="#budget"><b>01</b><div><strong>I have a budget</strong><small>Start with purchase price</small></div><em>→</em></a>
          <a href="#commuting"><b>02</b><div><strong>I ride every day</strong><small>Traffic, fuel and ease of use</small></div><em>→</em></a>
          <a href="#rider-fit"><b>03</b><div><strong>I need the right fit</strong><small>Seat height and weight</small></div><em>→</em></a>
          <a href="#long-rides"><b>04</b><div><strong>I ride farther</strong><small>Tank, comfort and displacement</small></div><em>→</em></a>
        </aside>
      </div>
    </header>

    <div className="rec-nav-wrap">
      <nav className="shell rec-nav" aria-label="Buying guide sections">
        <a href="#budget">Budget</a><a href="#commuting">Daily ride</a><a href="#rider-fit">Rider fit</a><a href="#safety-efficiency">Safety & fuel</a><a href="#long-rides">Long rides</a><a href="#explore">Explore</a>
      </nav>
    </div>

    <main className="shell rec-content">
      <section className="rec-principles">
        <div className="rec-section-intro"><span>Make a better shortlist</span><h2>Four filters matter more than a generic “best” list.</h2></div>
        <div className="rec-principle-grid">
          <article><b>01</b><h3>Real budget</h3><p>Include registration, insurance, financing, fuel, maintenance and proper riding gear.</p></article>
          <article><b>02</b><h3>Actual use</h3><p>Stop-go traffic, weekend touring and passenger use reward different motorcycles.</p></article>
          <article><b>03</b><h3>Physical fit</h3><p>Seat height and curb weight are measurable. Confidence still needs an in-person sit test.</p></article>
          <article><b>04</b><h3>Exact variant</h3><p>ABS, connectivity and price can change by trim. Verify the exact unit before paying.</p></article>
        </div>
      </section>

      <section id="budget" className="rec-section rec-section-light">
        <div className="rec-section-head"><div><span>Budget first</span><h2>Start under ₱100K, then inspect the tradeoffs.</h2><p>These are current researched models below the price threshold, not a universal ranking.</p></div><Link href="/finder">Set a custom budget →</Link></div>
        <BikeRail models={under100} />
      </section>

      <section id="commuting" className="rec-section rec-editorial-split">
        <div className="rec-editorial-copy"><span>Daily riding</span><h2>Traffic changes what “good” means.</h2><p>For city use, manageable weight, predictable low-speed behavior and easy controls often matter more than peak power.</p><div className="rec-editorial-points"><div><b>Stop-go</b><small>Automatic transmission can reduce workload.</small></div><div><b>Parking</b><small>Lighter motorcycles are easier to move around tight spaces.</small></div><div><b>Running cost</b><small>Fuel economy only matters alongside service and parts access.</small></div></div><Link className="rec-text-link" href="/finder">Build a commuting shortlist →</Link></div>
        <div className="rec-editorial-rail"><div className="rec-section-head compact"><div><span>Automatic options</span><h3>Scooters worth comparing</h3></div></div><BikeRail models={scooters} /></div>
      </section>

      <section id="rider-fit" className="rec-section rec-data-section">
        <div className="rec-section-head"><div><span>Physical fit</span><h2>Start with dimensions you can compare.</h2><p>Seat height and curb weight narrow the field. Neither guarantees that a motorcycle will fit your body.</p></div></div>
        <div className="rec-two-column">
          <div><div className="rec-list-title"><span>Lower seat</span><h3>Published seat heights</h3></div><RankedList models={shortRider} metric={(m) => `${m.seatHeightMm} mm seat · ${m.curbWeightKg} kg`} /></div>
          <div><div className="rec-list-title"><span>Lower weight</span><h3>Manageable curb weights</h3></div><RankedList models={lightweight} metric={(m) => `${m.curbWeightKg} kg · ${m.seatHeightMm} mm seat`} /></div>
        </div>
      </section>

      <section id="safety-efficiency" className="rec-section rec-data-section rec-dark-panel">
        <div className="rec-section-head"><div><span>Equipment & running cost</span><h2>Separate safety equipment from fuel claims.</h2><p>ABS availability is only included here when the source text positively confirms it. Fuel-economy figures remain planning references, not guarantees.</p></div></div>
        <div className="rec-two-column">
          <div><div className="rec-list-title"><span>Braking</span><h3>Confirmed ABS availability</h3></div><RankedList models={absModels} metric={(m) => m.abs} /></div>
          <div><div className="rec-list-title"><span>Efficiency</span><h3>Higher published km/L</h3></div><RankedList models={efficient} metric={(m) => `${m.fuelConsumptionKmL} km/L published · ${m.engineCc} cc`} /></div>
        </div>
      </section>

      <section id="long-rides" className="rec-section rec-data-section">
        <div className="rec-section-head"><div><span>Longer rides</span><h2>Range and displacement are only the start.</h2><p>Tank size can reduce fuel stops. Real touring suitability also depends on ergonomics, wind protection, luggage, passenger needs and service access.</p></div></div>
        <div className="rec-two-column">
          <div><div className="rec-list-title"><span>Fuel capacity</span><h3>Larger-tank comparisons</h3></div><RankedList models={longRide} metric={(m) => `${m.fuelTankL} L tank · ${m.engineCc} cc`} /></div>
          <div><div className="rec-list-title"><span>Displacement</span><h3>400cc+ starting points</h3></div><RankedList models={bigBikes} metric={(m) => `${m.engineCc} cc · ${m.powerHp} hp`} /></div>
        </div>
      </section>

      <section id="explore" className="rec-explore">
        <div className="rec-explore-copy"><span>Keep exploring</span><h2>Browse by type or go straight to a brand.</h2><p>Use these as navigation, not as another wall of SEO pages.</p><Link className="rec-primary" href="/motorcycles">Browse all motorcycles →</Link></div>
        <div className="rec-explore-links"><div><span>Popular categories</span>{categories.map((item) => <Link href={`/finder?category=${encodeURIComponent(item.category)}`} key={item.category}><strong>{item.category}</strong><small>{item.count}</small></Link>)}</div><div><span>Brands</span><div className="rec-brand-cloud">{brands.map(([slug, name]) => <Link href={`/motorcycles/${slug}`} key={slug}>{name}</Link>)}</div></div></div>
      </section>

      <section className="rec-final-cta">
        <div><span>Skip the generic list</span><h2>Tell MotoIndex how you actually ride.</h2><p>Set your budget, traffic, passenger use, preferred transmission and fit priorities. The Finder explains why each result matches.</p></div>
        <Link className="rec-primary" href="/finder">Open Motorcycle Finder →</Link>
      </section>

      <div className="rec-editorial-footer">
        <JsonLd data={schema} />
        <FaqSection title="Motorcycle buying questions" items={faqs} />
        <AuthorBox />
      </div>
    </main>
  </section>;
}

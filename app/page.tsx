import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { accessoryCategories, helmetBrands, currentMotorcycles, recommendationGuides, comparisons, isIndexableModel, isIndexableRecommendation, isIndexableComparison } from "@/lib/data";
import { helmetProducts, tireProducts, topBoxProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ModelCard } from "@/components/ModelCard";
import { QuickFinder } from "@/components/QuickFinder";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { forClient } from "@/lib/competitors";

export const metadata: Metadata = pageMetadata({ title: "Motorcycle Prices, Specs & Gear Philippines", description: "Compare motorcycle prices, specifications, helmets, tires and ownership costs in the Philippines.", path: "/" });
export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 9);
  const safeGuides = recommendationGuides.filter(g=>isIndexableRecommendation(g.slug));
  const decisionGuidePriority = ["best-motorcycles-for-daily-commute-philippines","beginner-friendly-motorcycles-philippines","motorcycles-400cc-plus-philippines"];
  const featuredGuides = [...safeGuides].sort((a,b)=>{const ai=decisionGuidePriority.indexOf(a.slug),bi=decisionGuidePriority.indexOf(b.slug);return (ai<0?99:ai)-(bi<0?99:bi);});
  const hasComparisons = comparisons.some(c=>isIndexableComparison(c.slug));
  return (
    <>
      <section className="hero homepage-hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <h1>Compare motorcycle prices and specs in the Philippines.</h1>
            <p>Research current motorcycles, prices, specifications, tire sizes, ownership costs and riding gear in one place.</p>
            <div className="hero-actions"><Link className="button" href="/motorcycles">Browse motorcycles</Link><Link className="button ghost" href={hasComparisons?"/compare":"/ownership/cost-calculator"}>{hasComparisons?"Compare models":"Estimate ownership cost"}</Link></div>
            {featured[0]&&<Link className="mobile-hero-bike" href={`/motorcycles/${featured[0].makeSlug}/${featured[0].slug}`}><EntityMedia entityType="motorcycle" entityId={featured[0].id} className="mobile-hero-bike-media" priority sizes="120px" showCredit={false} fallback={<span className="mobile-hero-bike-fallback"/>}/><span><small>Featured current model</small><strong>{featured[0].make} {featured[0].model}</strong><b>{observedMarketPriceLabel(featured[0])}</b></span></Link>}
            <div className="proof"><span><b>{verifiedModels.length}</b> current motorcycles</span><span><b>{helmetBrands.length}</b> helmet brands</span><span><b>{accessoryCategories.length}</b> accessory categories</span></div>
          </div>
          <QuickFinder models={forClient(verifiedModels)} />
        </div>
      </section>

      {verifiedModels.length>=4&&<section className="section shell home-price-bands">
        <div className="section-head"><div><h2>Start with your budget</h2></div><Link href="/motorcycles">Open all filters →</Link></div>
        <div className="budget-grid">
          <Link href="/motorcycles?budget=under100"><span>Price band</span><strong>Under ₱100K</strong><small>See current motorcycles priced below ₱100,000.</small></Link>
          <Link href="/motorcycles?budget=100to150"><span>Price band</span><strong>₱100K–₱150K</strong><small>Compare models in a common Philippine-market range.</small></Link>
          <Link href="/motorcycles?budget=150to200"><span>Price band</span><strong>₱150K–₱200K</strong><small>See models in the upper mid-price range.</small></Link>
          <Link href="/motorcycles?budget=over200"><span>Price band</span><strong>₱200K and above</strong><small>Browse motorcycles priced from ₱200,000 upward.</small></Link>
        </div>
      </section>}


      {verifiedModels.length>=3&&<section className="section shell decision-home-strip">
        <div className="decision-home-copy"><span>Decision engine</span><h2>Don&apos;t start with a list. Start with your life.</h2><p>Set budget, inseam, traffic, daily distance, passenger and luggage needs, then compare a transparent monthly ownership-planning estimate across the current catalog.</p><div><Link className="button" href="/finder">Find my motorcycle</Link><Link className="button ghost" href="/compare">Compare two bikes</Link></div></div>
        <div className="decision-home-steps"><article><b>01</b><strong>Set your constraints</strong><span>Budget, fit, traffic and daily use.</span></article><article><b>02</b><strong>See why each bike ranks</strong><span>Visible factor scores and watch-outs.</span></article><article><b>03</b><strong>Check monthly reality</strong><span>Loan planning plus modeled running cost.</span></article></div>
      </section>}

      {featured.length>0&&<section className="section shell home-browse-models">
        <div className="section-head"><div><h2>Browse prices and specs</h2></div><Link href="/motorcycles">All motorcycles →</Link></div>
        <div className="card-grid">{featured.map((m) => <ModelCard key={m.id} model={m} />)}</div>
      </section>}

      {safeGuides.length>0&&<section className="section shell">
        <div className="section-head"><div><h2>Choose by budget, height or riding style</h2></div><Link href="/recommendations">All guides →</Link></div>
        <div className="guide-strip">{featuredGuides.slice(0,4).map(g=><Link key={g.slug} href={`/recommendations/${g.slug}`}><strong>{g.title}</strong><small>{g.description}</small></Link>)}</div>
      </section>}

      <section className="section shell">
        <div className="section-head"><div><h2>Helmets, tires and top boxes</h2></div><Link href="/gear/helmets">Browse gear →</Link></div>
        <div className="product-grid">
          {helmetProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
          {tireProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
          {topBoxProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
        </div>
      </section>

      <section className="section shell commute-home">
        <div className="section-head"><div><h2>Traffic and affordability tools</h2></div><Link href="/commute">Open commute hub →</Link></div>
        <div className="commute-tool-grid"><Link href="/commute/heavy-traffic"><span>Traffic</span><h3>Heavy traffic</h3><p>Compare lighter current motorcycles for stop-go riding.</p></Link><Link href="/commute/cost-calculator"><span>Running cost</span><h3>Daily commute cost</h3><p>Estimate fuel, maintenance reserve and parking for your route.</p></Link><Link href="/commute/affordability"><span>Budget</span><h3>Affordability</h3><p>Set a monthly cap and see which current motorcycles fit it.</p></Link></div>
      </section>

      <section className="section dark-section">
        <div className="shell">
          <div className="section-head light"><div><h2>Useful tools before and after you buy</h2></div><Link href="/tools">View all tools →</Link></div>
          <div className="tool-grid home-tool-grid">
            {hasComparisons&&<Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Compare price, engine, dimensions, power and rider fit side by side.</p></Link>}
            <Link href="/ownership/cost-calculator"><span>02</span><h3>Estimate cost to own</h3><p>Plan fuel, maintenance, insurance, registration, tires and financing.</p></Link>
            <Link href="/maintenance"><span>03</span><h3>Maintenance and parts</h3><p>Oil, battery, coolant, CVT, sprocket and model-specific service guidance.</p></Link>
            <Link href="/ownership/registration-renewal"><span>04</span><h3>Registration renewal</h3><p>Review current LTO renewal requirements and fee-planning guidance.</p></Link>
            <Link href="/used-motorcycles/repo"><span>05</span><h3>Repo motorcycle prices</h3><p>Compare seller-published repo asking prices and buying checks.</p></Link>
          </div>
        </div>
      </section>
    </>
  );
}

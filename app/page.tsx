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

const section = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const sectionHead = "mb-6 flex items-end justify-between gap-5";
const textLink = "text-sm font-extrabold text-moto-ink transition hover:text-moto-accent";

export default function HomePage() {
  const verifiedModels = currentMotorcycles.filter(isIndexableModel);
  const featured = verifiedModels.slice(0, 9);
  const safeGuides = recommendationGuides.filter(g=>isIndexableRecommendation(g.slug));
  const decisionGuidePriority = ["best-motorcycles-for-daily-commute-philippines","beginner-friendly-motorcycles-philippines","motorcycles-400cc-plus-philippines"];
  const featuredGuides = [...safeGuides].sort((a,b)=>{const ai=decisionGuidePriority.indexOf(a.slug),bi=decisionGuidePriority.indexOf(b.slug);return (ai<0?99:ai)-(bi<0?99:bi);});
  const hasComparisons = comparisons.some(c=>isIndexableComparison(c.slug));

  return (
    <>
      <section className="overflow-hidden border-b border-moto-line bg-moto-paper">
        <div className={`${section} grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,.95fr)] lg:items-center lg:py-20`}>
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex rounded-full border border-moto-line bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-moto-accent">Motorcycle research for the Philippines</span>
            <h1 className="max-w-3xl text-balance text-4xl font-black leading-[.98] tracking-[-.045em] text-moto-ink sm:text-5xl lg:text-6xl">Compare motorcycle prices and specs in the Philippines.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-moto-muted sm:text-lg">Research current motorcycles, prices, specifications, tire sizes, ownership costs and riding gear in one place.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-xl bg-moto-ink px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5" href="/motorcycles">Browse motorcycles</Link>
              <Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-moto-line bg-white px-5 text-sm font-extrabold text-moto-ink transition hover:border-moto-ink" href={hasComparisons?"/compare":"/ownership/cost-calculator"}>{hasComparisons?"Compare models":"Estimate ownership cost"}</Link>
            </div>
            {featured[0]&&<Link className="mt-8 grid max-w-md grid-cols-[104px_1fr] items-center gap-4 rounded-2xl border border-moto-line bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:hidden" href={`/motorcycles/${featured[0].makeSlug}/${featured[0].slug}`}><EntityMedia entityType="motorcycle" entityId={featured[0].id} className="mobile-hero-bike-media" priority sizes="104px" showCredit={false} fallback={<span className="mobile-hero-bike-fallback"/>}/><span><small className="block text-[10px] font-black uppercase tracking-[.12em] text-moto-accent">Featured current model</small><strong className="mt-1 block text-base text-moto-ink">{featured[0].make} {featured[0].model}</strong><b className="mt-1 block text-sm text-moto-ink">{observedMarketPriceLabel(featured[0])}</b></span></Link>}
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-moto-line bg-white p-3 sm:p-4"><b className="block text-xl font-black text-moto-ink sm:text-2xl">{verifiedModels.length}</b><span className="mt-1 block text-[11px] leading-4 text-moto-muted sm:text-xs">current motorcycles</span></div>
              <div className="rounded-2xl border border-moto-line bg-white p-3 sm:p-4"><b className="block text-xl font-black text-moto-ink sm:text-2xl">{helmetBrands.length}</b><span className="mt-1 block text-[11px] leading-4 text-moto-muted sm:text-xs">helmet brands</span></div>
              <div className="rounded-2xl border border-moto-line bg-white p-3 sm:p-4"><b className="block text-xl font-black text-moto-ink sm:text-2xl">{accessoryCategories.length}</b><span className="mt-1 block text-[11px] leading-4 text-moto-muted sm:text-xs">accessory categories</span></div>
            </div>
          </div>
          <div className="rounded-[28px] border border-moto-line bg-white p-2 shadow-[0_24px_70px_rgba(16,19,23,.10)] sm:p-3"><QuickFinder models={forClient(verifiedModels)} /></div>
        </div>
      </section>

      {verifiedModels.length>=4&&<section className={`${section} py-12 sm:py-16`}>
        <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-moto-accent">Shop by price</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-moto-ink sm:text-4xl">Start with your budget</h2></div><Link className={textLink} href="/motorcycles">Open all filters →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link className="group rounded-2xl border border-moto-line bg-white p-5 transition hover:-translate-y-1 hover:border-moto-ink hover:shadow-lg" href="/motorcycles?budget=under100"><span className="text-[10px] font-black uppercase tracking-[.12em] text-moto-muted">Price band</span><strong className="mt-2 block text-xl text-moto-ink">Under ₱100K</strong><small className="mt-2 block text-sm leading-5 text-moto-muted">See current motorcycles priced below ₱100,000.</small></Link>
          <Link className="group rounded-2xl border border-moto-line bg-white p-5 transition hover:-translate-y-1 hover:border-moto-ink hover:shadow-lg" href="/motorcycles?budget=100to150"><span className="text-[10px] font-black uppercase tracking-[.12em] text-moto-muted">Price band</span><strong className="mt-2 block text-xl text-moto-ink">₱100K–₱150K</strong><small className="mt-2 block text-sm leading-5 text-moto-muted">Compare models in a common Philippine-market range.</small></Link>
          <Link className="group rounded-2xl border border-moto-line bg-white p-5 transition hover:-translate-y-1 hover:border-moto-ink hover:shadow-lg" href="/motorcycles?budget=150to200"><span className="text-[10px] font-black uppercase tracking-[.12em] text-moto-muted">Price band</span><strong className="mt-2 block text-xl text-moto-ink">₱150K–₱200K</strong><small className="mt-2 block text-sm leading-5 text-moto-muted">See models in the upper mid-price range.</small></Link>
          <Link className="group rounded-2xl border border-moto-line bg-white p-5 transition hover:-translate-y-1 hover:border-moto-ink hover:shadow-lg" href="/motorcycles?budget=over200"><span className="text-[10px] font-black uppercase tracking-[.12em] text-moto-muted">Price band</span><strong className="mt-2 block text-xl text-moto-ink">₱200K and above</strong><small className="mt-2 block text-sm leading-5 text-moto-muted">Browse motorcycles priced from ₱200,000 upward.</small></Link>
        </div>
      </section>}

      {verifiedModels.length>=3&&<section className={`${section} pb-12 sm:pb-16`}>
        <div className="grid overflow-hidden rounded-[30px] bg-moto-ink text-white lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-7 sm:p-9 lg:p-11"><span className="text-xs font-black uppercase tracking-[.14em] text-[#ffcf3f]">Decision engine</span><h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-.04em] sm:text-4xl">Don&apos;t start with a list. Start with your life.</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">Set budget, inseam, traffic, daily distance, passenger and luggage needs, then compare a transparent monthly ownership-planning estimate across the current catalog.</p><div className="mt-6 flex flex-wrap gap-3"><Link className="inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-extrabold text-moto-ink" href="/finder">Find my motorcycle</Link><Link className="inline-flex min-h-11 items-center rounded-xl border border-white/25 px-4 text-sm font-extrabold text-white" href="/compare">Compare two bikes</Link></div></div>
          <div className="grid gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-1"><article className="bg-white/[.04] p-6"><b className="text-sm text-[#ffcf3f]">01</b><strong className="mt-3 block text-lg">Set your constraints</strong><span className="mt-1 block text-sm text-white/65">Budget, fit, traffic and daily use.</span></article><article className="bg-white/[.04] p-6"><b className="text-sm text-[#ffcf3f]">02</b><strong className="mt-3 block text-lg">See why each bike ranks</strong><span className="mt-1 block text-sm text-white/65">Visible factor scores and watch-outs.</span></article><article className="bg-white/[.04] p-6"><b className="text-sm text-[#ffcf3f]">03</b><strong className="mt-3 block text-lg">Check monthly reality</strong><span className="mt-1 block text-sm text-white/65">Loan planning plus modeled running cost.</span></article></div>
        </div>
      </section>}

      {featured.length>0&&<section className={`${section} py-12 sm:py-16`}>
        <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-moto-accent">Current catalog</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-moto-ink sm:text-4xl">Browse prices and specs</h2></div><Link className={textLink} href="/motorcycles">All motorcycles →</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featured.map((m) => <ModelCard key={m.id} model={m} />)}</div>
      </section>}

      {safeGuides.length>0&&<section className={`${section} py-12 sm:py-16`}>
        <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-moto-accent">Buying guides</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-moto-ink sm:text-4xl">Choose by budget, height or riding style</h2></div><Link className={textLink} href="/recommendations">All guides →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{featuredGuides.slice(0,4).map(g=><Link className="rounded-2xl border border-moto-line bg-moto-paper p-5 transition hover:-translate-y-1 hover:border-moto-ink" key={g.slug} href={`/recommendations/${g.slug}`}><strong className="block text-lg leading-6 text-moto-ink">{g.title}</strong><small className="mt-3 block text-sm leading-5 text-moto-muted">{g.description}</small></Link>)}</div>
      </section>}

      <section className={`${section} py-12 sm:py-16`}>
        <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-moto-accent">Riding gear</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-moto-ink sm:text-4xl">Helmets, tires and top boxes</h2></div><Link className={textLink} href="/gear/helmets">Browse gear →</Link></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {helmetProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:"Helmet",brand:p.brand,model:p.model,meta:p.helmetType,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
          {tireProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/tires/${p.brandSlug}/${p.slug}`,category:"Tire",brand:p.brand,model:p.model,meta:p.useCase,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
          {topBoxProducts.filter(p=>p.status==="verified").slice(0,2).map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/accessories/top-box/${p.slug}`,category:"Top box",brand:p.brand,model:p.model,meta:`${p.capacityL}L ${p.shell}`,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}
        </div>
      </section>

      <section className={`${section} py-12 sm:py-16`}>
        <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-moto-accent">Daily riding</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] text-moto-ink sm:text-4xl">Traffic and affordability tools</h2></div><Link className={textLink} href="/commute">Open commute hub →</Link></div>
        <div className="grid gap-3 md:grid-cols-3"><Link className="rounded-2xl border border-moto-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg" href="/commute/heavy-traffic"><span className="text-xs font-black uppercase tracking-[.12em] text-moto-accent">Traffic</span><h3 className="mt-2 text-xl font-black text-moto-ink">Heavy traffic</h3><p className="mt-2 text-sm leading-6 text-moto-muted">Compare lighter current motorcycles for stop-go riding.</p></Link><Link className="rounded-2xl border border-moto-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg" href="/commute/cost-calculator"><span className="text-xs font-black uppercase tracking-[.12em] text-moto-accent">Running cost</span><h3 className="mt-2 text-xl font-black text-moto-ink">Daily commute cost</h3><p className="mt-2 text-sm leading-6 text-moto-muted">Estimate fuel, maintenance reserve and parking for your route.</p></Link><Link className="rounded-2xl border border-moto-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg" href="/commute/affordability"><span className="text-xs font-black uppercase tracking-[.12em] text-moto-accent">Budget</span><h3 className="mt-2 text-xl font-black text-moto-ink">Affordability</h3><p className="mt-2 text-sm leading-6 text-moto-muted">Set a monthly cap and see which current motorcycles fit it.</p></Link></div>
      </section>

      <section className="mt-8 bg-moto-ink py-14 text-white sm:py-20">
        <div className={section}>
          <div className={sectionHead}><div><span className="text-xs font-black uppercase tracking-[.14em] text-[#ffcf3f]">Ownership</span><h2 className="mt-2 text-3xl font-black tracking-[-.035em] sm:text-4xl">Useful tools before and after you buy</h2></div><Link className="text-sm font-extrabold text-white/80 hover:text-white" href="/tools">View all tools →</Link></div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {hasComparisons&&<Link className="bg-moto-ink p-5 transition hover:bg-white/[.06]" href="/compare"><span className="text-xs font-black text-[#ffcf3f]">01</span><h3 className="mt-3 text-lg font-black">Compare motorcycles</h3><p className="mt-2 text-sm leading-5 text-white/60">Compare price, engine, dimensions, power and rider fit side by side.</p></Link>}
            <Link className="bg-moto-ink p-5 transition hover:bg-white/[.06]" href="/ownership/cost-calculator"><span className="text-xs font-black text-[#ffcf3f]">02</span><h3 className="mt-3 text-lg font-black">Estimate cost to own</h3><p className="mt-2 text-sm leading-5 text-white/60">Plan fuel, maintenance, insurance, registration, tires and financing.</p></Link>
            <Link className="bg-moto-ink p-5 transition hover:bg-white/[.06]" href="/maintenance"><span className="text-xs font-black text-[#ffcf3f]">03</span><h3 className="mt-3 text-lg font-black">Maintenance and parts</h3><p className="mt-2 text-sm leading-5 text-white/60">Oil, battery, coolant, CVT, sprocket and model-specific service guidance.</p></Link>
            <Link className="bg-moto-ink p-5 transition hover:bg-white/[.06]" href="/ownership/registration-renewal"><span className="text-xs font-black text-[#ffcf3f]">04</span><h3 className="mt-3 text-lg font-black">Registration renewal</h3><p className="mt-2 text-sm leading-5 text-white/60">Review current LTO renewal requirements and fee-planning guidance.</p></Link>
            <Link className="bg-moto-ink p-5 transition hover:bg-white/[.06]" href="/used-motorcycles/repo"><span className="text-xs font-black text-[#ffcf3f]">05</span><h3 className="mt-3 text-lg font-black">Repo motorcycle prices</h3><p className="mt-2 text-sm leading-5 text-white/60">Compare seller-published repo asking prices and buying checks.</p></Link>
          </div>
        </div>
      </section>
    </>
  );
}

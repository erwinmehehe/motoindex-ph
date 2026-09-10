import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { currentMotorcycles,recommendationGuides,comparisons,isIndexableModel,isIndexableRecommendation,isIndexableComparison } from "@/lib/data";
import { ModelCard } from "@/components/ModelCard";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";

export const metadata: Metadata = pageMetadata({title:"Motorcycle Prices, Specs & Gear Philippines",description:"Compare motorcycle prices, specifications, ownership costs and riding gear in the Philippines.",path:"/"});

const starts=[
  ["01","Scooters","Automatic choices for traffic, errands and everyday commuting.","/recommendations/scooters-under-150k-philippines"],
  ["02","Daily commuters","Practical motorcycles for frequent Philippine road use.","/recommendations/best-motorcycles-for-daily-commute-philippines"],
  ["03","Beginner friendly","Approachable choices for newer riders.","/recommendations/beginner-friendly-motorcycles-philippines"],
  ["04","400cc and above","Bigger-displacement options with the specs that matter.","/recommendations/motorcycles-400cc-plus-philippines"],
  ["05","Under ₱100K","Current models that fit an entry-level purchase budget.","/motorcycles?budget=under100"],
  ["06","₱100K–₱150K","A popular range for scooters and practical commuters.","/motorcycles?budget=100to150"],
  ["07","₱150K–₱200K","Upper mid-range motorcycles with ownership context.","/motorcycles?budget=150to200"],
  ["08","Electric","Battery, range, charging and registration research.","/motorcycles/electric"],
] as const;
const faqs=[
  ["Are MotoIndex prices live dealer quotations?","No. MotoIndex shows published price references and market context for research. Confirm final cash price, fees, promos and availability with the seller before paying."],
  ["Can I compare motorcycles side by side?","Yes. Compare current motorcycle records by price, engine, dimensions, power, rider fit and other decision-making details."],
  ["Can MotoIndex help me choose by budget or daily use?","Yes. The Finder and recommendation guides narrow choices using practical needs instead of forcing you through a huge catalog."],
  ["Does MotoIndex include ownership costs?","Yes. Use the ownership and commute tools to plan financing, fuel, maintenance, insurance and registration beyond the sticker price."],
] as const;

export default function HomePage(){
  const models=currentMotorcycles.filter(isIndexableModel);
  const featured=models.slice(0,8);
  const hero=models.find(m=>m.makeSlug==="yamaha"&&m.slug.toLowerCase().includes("aerox"))??featured[0];
  const guides=recommendationGuides.filter(g=>isIndexableRecommendation(g.slug)).slice(0,4);
  const hasCompare=comparisons.some(c=>isIndexableComparison(c.slug));
  const brands=[...new Map(models.map(m=>[m.makeSlug,m.make])).entries()].slice(0,6);
  return <div className="mi-home">
    <section className="mi-hero">
      <div className="mi-grid"/><div className="mi-glow mi-red"/><div className="mi-glow mi-blue"/>
      <div className="shell mi-hero-layout">
        <div className="mi-hero-copy">
          <div className="mi-badge"><span>New</span><b>The independent motorcycle decision engine</b><em>Philippines</em></div>
          <h1>Your next <span>motorcycle</span><br/>starts here.</h1>
          <p>Research current motorcycles in the Philippines, compare specs and published prices, model ownership costs, and find the bike that fits your life, budget and riding needs.</p>
          <form className="mi-search" action="/motorcycles" method="get"><input aria-label="Search motorcycles" name="q" type="search" placeholder="Search by brand or model, e.g. Aerox, ADV, Click"/><button>Search bikes</button></form>
          <div className="mi-chips"><b>Popular:</b><Link href="/recommendations/scooters-under-150k-philippines">Automatic scooters</Link><Link href="/recommendations/best-motorcycles-for-daily-commute-philippines">Daily commuters</Link><Link href="/recommendations/motorcycles-400cc-plus-philippines">400cc+</Link><Link href="/motorcycles?budget=under100">Under ₱100K ↗</Link></div>
          <div className="mi-trust"><span>✓ No signup needed</span><span>✓ {models.length} current models</span><span>✓ Save your shortlist</span></div>
        </div>
        <div className="mi-visual">
          <div className="mi-bike-wrap">{hero?<EntityMedia entityType="motorcycle" entityId={hero.id} className="mi-bike-media" priority sizes="(max-width:900px) 90vw,44vw" showCredit={false} fallback={<div className="mi-bike-fallback">MotoIndex PH</div>}/>:<div className="mi-bike-fallback">MotoIndex PH</div>}<div className="mi-shade"/></div>
          <div className="mi-float mi-live">● Current model research</div>
          {hero&&<><div className="mi-float mi-spec"><small>{hero.make} {hero.model}</small><b>{hero.engineCc} cc</b><b>{hero.seatHeightMm} mm seat</b></div><div className="mi-float mi-price"><small>Published price context</small><strong>{observedMarketPriceLabel(hero)}</strong></div></>}
        </div>
      </div>
    </section>

    {brands.length>0&&<section className="mi-brands"><div className="shell"><div className="mi-head compact"><div><span>Start with a name you know</span><h2>Your favourite brands, properly researched.</h2></div><Link href="/motorcycles">Browse all brands →</Link></div><div className="mi-brand-grid">{brands.map(([slug,name])=><Link key={slug} href={`/motorcycles/${slug}`}><strong>{name}</strong><small>Models, prices & buying context ↗</small></Link>)}</div></div></section>}

    <section className="mi-section"><div className="shell"><div className="mi-head"><div><span>Browse by need</span><h2>Eight ways to start. <em>One catalog.</em></h2><p>Begin with the riding style, budget or displacement that matters to you, then move into real model data.</p></div><Link href="/recommendations">All buying guides →</Link></div><div className="mi-start-grid">{starts.map(([n,t,c,h])=><Link className="mi-start" key={n} href={h}><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div><small>Explore →</small></Link>)}</div></div></section>

    {featured.length>0&&<section className="mi-section mi-models"><div className="shell"><div className="mi-head"><div><span>Featured motorcycles</span><h2>Current models. Clearer choices. <em>Your next ride.</em></h2><p>Open a model for price context, specs, fitment and ownership research.</p></div><Link href="/motorcycles">Explore all motorcycles →</Link></div><div className="mi-model-grid">{featured.map(m=><ModelCard key={m.id} model={m}/>)}</div><div className="mi-banner"><div><span>Not sure where to start?</span><strong>Use your actual constraints instead of guessing from a list.</strong></div><Link className="mi-btn dark" href="/finder">Find my motorcycle</Link>{hasCompare&&<Link className="mi-btn light" href="/compare">Compare models</Link>}</div></div></section>}

    <section className="mi-section mi-why"><div className="shell"><div className="mi-head"><div><span>Why MotoIndex</span><h2>Find it, understand it, <em>compare it.</em></h2><p>Research the motorcycle and the practical costs that shape ownership in the Philippines.</p></div></div><div className="mi-feature-grid"><Link className="mi-feature big" href="/finder"><b>01</b><h3>Start with your life, not a random list</h3><p>Budget, fit, traffic and daily use help narrow the catalog.</p><strong>Find my motorcycle →</strong></Link><Link className="mi-feature darkcard" href="/compare"><b>02</b><h3>Compare without tab overload</h3><p>Put price and the core decision specs side by side.</p><strong>Compare motorcycles →</strong></Link><Link className="mi-feature" href="/ownership/cost-calculator"><b>03</b><h3>Know the cost after you buy</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><strong>Estimate ownership →</strong></Link></div></div></section>

    {guides.length>0&&<section className="mi-section mi-guides"><div className="shell"><div className="mi-head"><div><span>Rider knowledge</span><h2>Guides that help you <em>make the call.</em></h2><p>Focused research for decisions that do not fit neatly inside a spec table.</p></div><Link href="/recommendations">All guides →</Link></div><div className="mi-guide-grid">{guides.map((g,i)=><Link key={g.slug} href={`/recommendations/${g.slug}`}><span>0{i+1}</span><h3>{g.title}</h3><p>{g.description}</p><strong>Read guide →</strong></Link>)}</div></div></section>}

    <section className="mi-tools"><div className="mi-grid"/><div className="shell"><div className="mi-head inverse"><div><span>Free planning tools</span><h2>Turn the spec sheet into <em>real-life math.</em></h2><p>Use the tools before you commit to a bike, then keep them around after you buy.</p></div><Link href="/tools">View all tools →</Link></div><div className="mi-tool-grid">{hasCompare&&<Link href="/compare"><span>01</span><h3>Compare motorcycles</h3><p>Price, specs and rider-fit context side by side.</p><b>Open tool →</b></Link>}<Link href="/ownership/cost-calculator"><span>02</span><h3>Cost to own</h3><p>Plan fuel, maintenance, insurance, registration and financing.</p><b>Calculate →</b></Link><Link href="/commute/affordability"><span>03</span><h3>Affordability planner</h3><p>Set a monthly cap and compare motorcycles against it.</p><b>Plan budget →</b></Link><Link href="/commute/cost-calculator"><span>04</span><h3>Commute cost</h3><p>Estimate the recurring cost of the route you actually ride.</p><b>Calculate →</b></Link></div></div></section>

    <section className="mi-section mi-faq"><div className="shell mi-faq-layout"><div><span className="mi-kicker">Good questions</span><h2>Honest answers, <em>no fine print.</em></h2><p>Motorcycle data changes. MotoIndex shows context instead of hiding that reality.</p></div><div className="mi-faq-list">{faqs.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></div></section>

    <section className="mi-final"><div className="mi-grid"/><div className="shell"><span>Ready when you are</span><h2>Find the right bike. <em>Not just the shiniest one.</em></h2><p>Start with the catalog if you know what you want. Use the Finder if you only know what the motorcycle needs to do.</p><div><Link className="mi-btn red" href="/motorcycles">Explore motorcycles</Link><Link className="mi-btn glass" href="/finder">Find my motorcycle match</Link></div></div></section>
  </div>;
}

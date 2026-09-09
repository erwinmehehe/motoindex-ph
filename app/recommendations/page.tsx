import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { publicMotorcycles } from "@/lib/data";
import { observedMarketPriceLabel, observedMarketRange } from "@/lib/marketChecks";
import { AuthorBox } from "@/components/AuthorBox";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { FaqSection, type FaqItem } from "@/components/FaqSection";

export const metadata: Metadata = pageMetadata({
  title: "Best Motorcycles Philippines 2026: One Buying Guide",
  description: "One Philippine motorcycle buying guide covering budget, scooters, commuting, rider fit, ABS, fuel economy, 400cc+ models and how to choose.",
  path: "/recommendations",
  index: true
});

function hasAbs(value:string){return /\bABS\b/i.test(value)&&!/^No ABS/i.test(value);}

function BikeList({models}:{models:typeof publicMotorcycles}){
  return <div className="guide-master-bike-grid">{models.map(model=><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id}>
    <span>{model.make}</span>
    <h3>{model.model}</h3>
    <strong>{observedMarketPriceLabel(model)}</strong>
    <small>{model.engineCc} cc · {model.curbWeightKg} kg · {model.seatHeightMm} mm seat{model.transmission?` · ${model.transmission}`:""}</small>
  </Link>)}</div>;
}

export default function RecommendationsPage(){
  const current=[...publicMotorcycles].sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from);
  const under100=current.filter(m=>observedMarketRange(m).from<100000).slice(0,8);
  const scooters=current.filter(m=>/scooter/i.test(m.category)).slice(0,8);
  const automatic=current.filter(m=>m.transmission==="Automatic").slice(0,8);
  const shortRider=[...current].sort((a,b)=>a.seatHeightMm-b.seatHeightMm||a.curbWeightKg-b.curbWeightKg).slice(0,8);
  const lightweight=[...current].sort((a,b)=>a.curbWeightKg-b.curbWeightKg).slice(0,8);
  const efficient=current.filter(m=>m.fuelConsumptionKmL).sort((a,b)=>(b.fuelConsumptionKmL||0)-(a.fuelConsumptionKmL||0)).slice(0,8);
  const absModels=current.filter(m=>hasAbs(m.abs)).slice(0,8);
  const longRide=[...current].sort((a,b)=>b.fuelTankL-a.fuelTankL).slice(0,8);
  const bigBikes=current.filter(m=>m.engineCc>=400).slice(0,8);
  const categories=[...new Map(current.map(m=>[m.category,m])).entries()]
    .map(([category])=>({category,count:current.filter(m=>m.category===category).length}))
    .sort((a,b)=>b.count-a.count)
    .slice(0,12);
  const brands=[...new Map(current.map(m=>[m.makeSlug,m.make])).entries()].sort((a,b)=>a[1].localeCompare(b[1]));

  const faqs:FaqItem[]=[
    {question:"What is the best motorcycle in the Philippines?",answer:"There is no single best motorcycle for every rider. Start with budget and intended use, then compare physical fit, transmission, weight, braking, fuel use, dealer support and the exact current price."},
    {question:"What motorcycle is best for beginners?",answer:"A beginner shortlist should prioritize manageable weight and fit, predictable controls, braking equipment and proper training rather than choosing by engine displacement alone."},
    {question:"What motorcycle is good for daily commuting?",answer:"For daily commuting, compare fuel use, weight, transmission, seat height, storage needs, traffic conditions and maintenance access. Automatic scooters can reduce shifting workload, but they are not automatically better for every route."},
    {question:"What motorcycle is good for short riders?",answer:"Published seat height is a useful starting point, but seat width, suspension sag, motorcycle weight and your inseam also affect actual ground reach. Sit on the exact motorcycle before buying when possible."},
    {question:"Should I buy based on the lowest price?",answer:"No. The lowest purchase price can be useful for narrowing a shortlist, but ownership cost, fit, braking, fuel use, parts access and the exact variant can matter more over time."}
  ];

  const schema=articleSchema({
    headline:"Motorcycle buying guide for the Philippines",
    description:"One buyer-focused guide to choosing a motorcycle in the Philippines by budget, use, fit, fuel economy, braking and category.",
    path:"/recommendations",
    about:"motorcycle buying guide Philippines",
    keywords:["best motorcycles Philippines","motorcycle buying guide Philippines","best scooter Philippines","motorcycle for commuting","motorcycle for beginners"],
    checkedDates:current.map(m=>m.marketPriceCheckedAt||m.verifiedAt)
  });

  return <section className="page shell guide-master-page">
    <div className="page-head">
      <span className="entity-kicker">Motorcycle buying guide</span>
      <h1>How to choose the right motorcycle in the Philippines</h1>
      <p>Instead of dozens of separate “best motorcycle” pages, this guide brings the main buying decisions together. Start with budget and use, narrow by physical fit and equipment, then open the exact model for current prices, specs, financing, ownership cost and sources.</p>
      <div className="hero-actions">
        <Link className="button" href="/finder">Use Motorcycle Finder</Link>
        <Link className="button secondary" href="/compare">Compare exact models</Link>
      </div>
    </div>

    <nav className="product-entity-nav guide-master-nav" aria-label="Motorcycle buying guide sections">
      <a href="#budget">Budget</a>
      <a href="#scooters">Scooters</a>
      <a href="#commuting">Commuting</a>
      <a href="#rider-fit">Rider fit</a>
      <a href="#safety-efficiency">ABS & fuel</a>
      <a href="#long-rides">Long rides</a>
      <a href="#400cc">400cc+</a>
      <a href="#categories">Categories</a>
      <a href="#brands">Brands</a>
    </nav>

    <section className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Start with the decision</span><h2>Do not choose a motorcycle from one ranking</h2><p>A useful shortlist changes when your budget, inseam, traffic, passenger use, luggage needs or road type changes. Use rankings as filters, not as a universal verdict.</p></div></div>
      <div className="topic-grid">
        <article><h3>1. Set the real budget</h3><p>Include registration, insurance, financing, fuel, maintenance and riding gear instead of using the sticker price alone.</p></article>
        <article><h3>2. Match the use</h3><p>City commuting, delivery work, weekend touring and expressway use reward different engine, weight, transmission and fuel-tank tradeoffs.</p></article>
        <article><h3>3. Check physical fit</h3><p>Seat height and curb weight are measurable starting points. Actual confidence also depends on seat width, balance, controls and your proportions.</p></article>
        <article><h3>4. Verify the exact variant</h3><p>ABS, connectivity, colors and price can change by trim. Open the exact model page before assuming every version has the same equipment.</p></article>
      </div>
    </section>

    <section id="budget" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Budget</span><h2>Motorcycles under ₱100,000</h2><p>Use price as the first filter, then compare weight, transmission, braking and fuel use. A cheaper motorcycle is not automatically the cheapest one to own.</p></div><Link href="/finder">Set a custom budget →</Link></div>
      <BikeList models={under100}/>
    </section>

    <section id="scooters" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Scooters and automatics</span><h2>Scooters and automatic motorcycles</h2><p>Automatic scooters reduce clutch and shifting workload in traffic. Compare seat height, curb weight, storage, wheel size, fuel tank and the exact variant before deciding.</p></div></div>
      <BikeList models={scooters}/>
      <div className="guide-master-subsection"><h3>Lowest-price automatic options</h3><BikeList models={automatic}/></div>
    </section>

    <section id="commuting" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Daily use</span><h2>Choosing a motorcycle for daily commuting</h2><p>Heavy traffic rewards manageable weight, easy controls and predictable low-speed behavior. Fuel economy matters, but so do parking, weather, maintenance access and the roads you actually use.</p></div></div>
      <div className="topic-grid">
        <article><h3>Stop-go traffic</h3><p>Automatic transmission can reduce workload, while a lighter bike can make parking and repeated low-speed movement easier.</p></article>
        <article><h3>Long daily distance</h3><p>Compare fuel tank, published economy, seat comfort, weather protection and service intervals rather than choosing only by engine size.</p></article>
        <article><h3>Passenger use</h3><p>Check passenger space, braking, suspension behavior and actual two-up fit in person. A specification table cannot measure passenger comfort.</p></article>
        <article><h3>Delivery or work use</h3><p>Prioritize running cost, service access, cargo mounting, stability and parts availability over styling.</p></article>
      </div>
      <Link className="button small" href="/finder">Build a commuting shortlist</Link>
    </section>

    <section id="rider-fit" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Physical fit</span><h2>Motorcycles to compare for lower seat height and lower weight</h2><p>These are measurable starting points, not guarantees that a motorcycle will fit you. Sit on the exact bike when possible.</p></div></div>
      <div className="guide-master-two-col"><div><h3>Lower published seat heights</h3><BikeList models={shortRider}/></div><div><h3>Lower curb weights</h3><BikeList models={lightweight}/></div></div>
    </section>

    <section id="safety-efficiency" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Equipment and running cost</span><h2>ABS and fuel economy</h2><p>ABS and fuel economy answer different questions. Check the exact trim because braking equipment can vary, and treat published km/L as a planning reference rather than a guarantee.</p></div></div>
      <div className="guide-master-two-col"><div><h3>Models with ABS listed</h3><BikeList models={absModels}/></div><div><h3>Higher published fuel-economy figures</h3><BikeList models={efficient}/></div></div>
    </section>

    <section id="long-rides" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Touring</span><h2>Motorcycles to compare for longer rides</h2><p>A larger tank can reduce fuel stops, but long-distance suitability also depends on ergonomics, wind protection, luggage, passenger needs, service access and real-world comfort.</p></div></div>
      <BikeList models={longRide}/>
    </section>

    <section id="400cc" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Larger motorcycles</span><h2>400cc+ motorcycles</h2><p>Use engine displacement as a category filter, not as proof of expressway eligibility, rider suitability or performance. Confirm registration details and current tollway rules separately.</p></div></div>
      <BikeList models={bigBikes}/>
    </section>

    <section id="categories" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Motorcycle type</span><h2>Browse by motorcycle category</h2><p>Use the category label to narrow the field, then compare exact models. Category names do not guarantee the same weight, seat height, power or equipment.</p></div></div>
      <div className="guide-master-link-grid">{categories.map(item=><Link href={`/finder?category=${encodeURIComponent(item.category)}`} key={item.category}><strong>{item.category}</strong><small>{item.count} current model{item.count===1?"":"s"} in the catalog</small></Link>)}</div>
    </section>

    <section id="brands" className="guide-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Brands</span><h2>Browse motorcycles by brand</h2><p>Brand pages remain separate because they represent real manufacturer lineups, not keyword variations.</p></div></div>
      <div className="guide-master-link-grid">{brands.map(([slug,name])=><Link href={`/motorcycles/${slug}`} key={slug}><strong>{name}</strong><small>Current models, prices and specifications</small></Link>)}</div>
    </section>

    <section className="cta-panel">
      <div><span className="section-kicker">Personalize the shortlist</span><h2>The Finder is better than another “best” list</h2><p>Change budget, inseam, traffic, passenger use, luggage and road needs to get a shortlist based on your actual situation.</p></div>
      <Link className="button" href="/finder">Open Motorcycle Finder</Link>
    </section>

    <JsonLd data={schema}/>
    <FaqSection title="Motorcycle buying questions" items={faqs}/>
    <AuthorBox/>
  </section>;
}

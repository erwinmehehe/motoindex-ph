import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ModelCard } from "@/components/ModelCard";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { observedMarketRange } from "@/lib/marketChecks";
import { pageMetadata } from "@/lib/site";
import { phpRange } from "@/lib/utils";

const supported = new Set(["honda", "yamaha", "suzuki"]);

function scooterModels(make: string) {
  return motorcycles
    .filter((m) => m.makeSlug === make && /scooter/i.test(m.category) && isIndexableModel(m));
}

export function generateStaticParams() {
  return [...supported].map((make) => ({ make }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  if (!supported.has(make)) return {};
  const models = scooterModels(make);
  if (!models.length) return {};
  const brand = models[0].make;
  const current = models.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued");
  const prices = current.map((m) => observedMarketRange(m)).filter(Boolean);
  const low = prices.length ? Math.min(...prices.map((p) => p.from)) : undefined;
  const high = prices.length ? Math.max(...prices.map((p) => p.to || p.from)) : undefined;
  return pageMetadata({
    title: `${brand} Scooters Philippines: Prices & Models 2026`,
    description: `Compare ${brand} scooters in the Philippines by current price, engine size, seat height, weight and scooter type${low && high ? `, with tracked prices from ${phpRange(low, high)}` : ""}.`,
    path: `/motorcycles/${make}/scooters`,
    index: current.length >= 3
  });
}

export default async function BrandScootersPage({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  if (!supported.has(make)) return notFound();
  const models = scooterModels(make);
  if (!models.length) return notFound();

  const brand = models[0].make;
  const current = models
    .filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued")
    .sort((a,b)=>observedMarketRange(a).from-observedMarketRange(b).from);
  const uncertain = models.filter((m) => m.marketStatus === "uncertain");
  const prices = current.map((m) => observedMarketRange(m));
  const low = Math.min(...prices.map((p) => p.from));
  const high = Math.max(...prices.map((p) => p.to || p.from));
  const cheapest = current[0];
  const engineMin = Math.min(...current.map((m)=>m.engineCc));
  const engineMax = Math.max(...current.map((m)=>m.engineCc));
  const automatic = current.filter((m)=>m.transmission === "Automatic").length;
  const latest = current.map((m)=>m.marketPriceCheckedAt || m.verifiedAt).sort().at(-1) || "";

  const faq = [
    {
      question: `How much are ${brand} scooters in the Philippines?`,
      answer: `Among the current ${brand} scooters published by MotoIndex, tracked model-level prices run from ${phpRange(low, high)}. Dealer cash prices, promotions, registration and financing can differ.`
    },
    {
      question: `What is the cheapest ${brand} scooter currently tracked?`,
      answer: `${cheapest.make} ${cheapest.model} is the lowest-priced current ${brand} scooter in this checked set at ${phpRange(observedMarketRange(cheapest).from, observedMarketRange(cheapest).to)}.`
    },
    {
      question: `What ${brand} scooter engine sizes are covered here?`,
      answer: `The current checked ${brand} scooter set spans ${engineMin}cc to ${engineMax}cc. Open each model page for its exact engine, weight, seat height, tire size and price-source date.`
    },
    {
      question: `Are all ${brand} scooters automatic?`,
      answer: `${automatic} of ${current.length} current scooters in this MotoIndex set are recorded as automatic. Always verify the exact Philippine model and trim before buying.`
    }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${brand} scooters in the Philippines`,
      url: `/motorcycles/${make}/scooters`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: current.length,
        itemListElement: current.map((m,index)=>({
          "@type":"ListItem",
          position:index+1,
          name:`${m.make} ${m.model}`,
          url:`/motorcycles/${m.makeSlug}/${m.slug}`
        }))
      }
    },
    {
      "@context":"https://schema.org",
      "@type":"FAQPage",
      mainEntity:faq.map((item)=>({
        "@type":"Question",
        name:item.question,
        acceptedAnswer:{"@type":"Answer",text:item.answer}
      }))
    }
  ];

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Motorcycles",href:"/motorcycles"},{label:brand,href:`/motorcycles/${make}`},{label:"Scooters"}]} />
    <div className="page-head">
      <span className="entity-kicker">Philippines scooter guide · checked {latest}</span>
      <h1>{brand} scooters in the Philippines: prices and models</h1>
      <p>Compare the current {brand} scooters MotoIndex can substantiate with dated Philippine price and specification records. This hub groups the scooter lineup by model instead of mixing it with underbones, sport bikes and other {brand} categories.</p>
      <div className="hero-actions"><Link className="button" href="/finder">Use motorcycle finder</Link><Link className="button ghost" href={`/motorcycles/${make}`}>All {brand} motorcycles</Link></div>
    </div>

    <div className="entity-price-grid motorcycle-price-grid">
      <article><span>Published scooters</span><strong>{current.length}</strong><small>Current models passing the evidence gate</small></article>
      <article><span>Tracked price span</span><strong>{phpRange(low, high)}</strong><small>Model-level dated references</small></article>
      <article><span>Engine range</span><strong>{engineMin}–{engineMax} cc</strong><small>Across the current checked scooter set</small></article>
    </div>

    <div className="section-head compact"><div><h2>Current {brand} scooter models and prices</h2><p>Cards open the canonical model page with price sources, installment examples, specs, fitment and ownership tools.</p></div></div>
    <div className="card-grid">{current.map((m)=><ModelCard key={m.id} model={m}/>)}</div>

    <div className="section-head compact"><div><h2>{brand} scooter price list</h2><p>Price order is for quick comparison only. It is not a quality ranking.</p></div></div>
    <div className="ph-brand-price-table" role="table" aria-label={`${brand} scooter price list`}>
      <div className="head" role="row"><span>Model</span><span>Price reference</span><span>Engine</span><span>Seat</span><span>Weight</span></div>
      {current.map((m)=>{const p=observedMarketRange(m);return <Link role="row" key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}`}><strong>{m.model}<small>{m.category}</small></strong><span>{phpRange(p.from,p.to)}</span><span>{m.engineCc} cc</span><span>{m.seatHeightMm} mm</span><span>{m.curbWeightKg} kg →</span></Link>})}
    </div>

    {uncertain.length>0&&<section className="ph-brand-section"><div className="section-head compact"><div><span className="section-kicker">Availability to verify</span><h2>{brand} scooter references not in the current discovery set</h2><p>These model pages remain useful for search and ownership research, but current official-lineup availability needs direct confirmation.</p></div></div><div className="card-grid">{uncertain.map((m)=><ModelCard key={m.id} model={m}/>)}</div></section>}

    <section className="ph-brand-section"><div className="section-head compact"><div><h2>{brand} scooter FAQ</h2></div></div><div className="ph-brand-faq">{faq.map((item)=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>
    <JsonLd data={schema}/>
  </section>;
}

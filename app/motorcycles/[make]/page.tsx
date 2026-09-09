import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelCard } from "@/components/ModelCard";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { modelFamilies } from "@/lib/families";
import { observedMarketRange } from "@/lib/marketChecks";
import { getPhBrandPriority } from "@/lib/phBrandPriority";
import { phBrandSupportFor } from "@/lib/phBrandSupport";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { php, phpRange } from "@/lib/utils";

export function generateStaticParams() {
  return [...new Set(motorcycles.map((m) => m.makeSlug))].map((make) => ({ make }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const models = motorcycles.filter((m) => m.makeSlug === make);
  if (!models.length) return {};
  const brand = models[0].make;
  const publicModels = models.filter(isIndexableModel);
  const current = publicModels.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued");
  const low = current.length ? Math.min(...current.map((m) => observedMarketRange(m).from)) : undefined;
  const high = current.length ? Math.max(...current.map((m) => observedMarketRange(m).to || observedMarketRange(m).from)) : undefined;
  const range = low && high ? ` Published prices currently run from ${php(low)} to ${php(high)}.` : "";
  return pageMetadata({
    title: `${brand} Motorcycle Prices & Models Philippines`,
    description: `Compare current ${brand} motorcycles in the Philippines with prices, specs, seat heights, tire sizes and model-by-model research.${range}`,
    path: `/motorcycles/${make}`,
    index: publicModels.length > 0
  });
}

export default async function BrandPage({ params }: { params: Promise<{ make: string }> }) {
  const { make } = await params;
  const models = motorcycles.filter((m) => m.makeSlug === make);
  if (!models.length) return notFound();

  const brand = models[0].make;
  const publicModels = models.filter(isIndexableModel);
  const publicIds = new Set(publicModels.map((m) => m.id));
  const current = publicModels.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued").sort((a, b) => a.srp - b.srp || a.model.localeCompare(b.model));
  const uncertain = publicModels.filter((m) => m.marketStatus === "uncertain").sort((a, b) => a.model.localeCompare(b.model));
  const previous = publicModels.filter((m) => m.marketStatus === "previous").sort((a, b) => a.model.localeCompare(b.model));
  const families = modelFamilies.filter((f) => f.makeSlug === make && f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
  const priority = getPhBrandPriority(make);
  const support = phBrandSupportFor(make);
  const collectionLinks: Record<string, { label: string; href: string; note: string }[]> = {
    honda: [
      { label: "Honda scooters", href: "/recommendations/honda-scooters-philippines", note: "Compare current automatic Honda models" },
      { label: "Honda ADV", href: "/recommendations/honda-adv-motorcycles-philippines", note: "ADV160, ADV350 and X-ADV comparison" },
    ],
    yamaha: [
      { label: "Yamaha scooters", href: "/recommendations/yamaha-scooters-philippines", note: "Compare Yamaha automatic models" },
      { label: "Yamaha Mio", href: "/recommendations/yamaha-mio-motorcycles-philippines", note: "Mio-family price and spec comparison" },
    ],
    suzuki: [
      { label: "Suzuki Burgman", href: "/recommendations/suzuki-burgman-motorcycles-philippines", note: "Burgman Street, Street EX and 400" },
      { label: "Suzuki Raider", href: "/recommendations/suzuki-raider-motorcycles-philippines", note: "Compare current Raider models" },
    ],
    kawasaki: [
      { label: "Kawasaki Ninja", href: "/recommendations/kawasaki-ninja-motorcycles-philippines", note: "Compare the current Ninja range" },
    ],
    ktm: [
      { label: "KTM Duke", href: "/recommendations/ktm-duke-motorcycles-philippines", note: "200, 390 and 790 Duke comparison" },
    ],
    cfmoto: [
      { label: "CFMOTO SR", href: "/recommendations/cfmoto-sr-motorcycles-philippines", note: "300SR, 450SR and 675SR-R comparison" },
    ],
  };
  const collections = collectionLinks[make] || [];

  if (!publicModels.length) {
    return <section className="page shell"><Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: brand }]} /><div className="page-head"><h1>{brand} motorcycles in the Philippines</h1><p>Model data is being checked before publication.</p></div><div className="note-box"><h2>{brand} model data is being updated</h2><p>Current prices and specifications still need checking before this list is published.</p></div></section>;
  }

  const ranges = current.map((model) => ({ model, ...observedMarketRange(model) }));
  const low = Math.min(...ranges.map((row) => row.from));
  const high = Math.max(...ranges.map((row) => row.to || row.from));
  const engines = current.map((m) => m.engineCc);
  const minEngine = Math.min(...engines);
  const maxEngine = Math.max(...engines);
  const categories = [...new Set(current.map((m) => m.category))].sort();
  const automatic = current.filter((m) => m.transmission === "Automatic").length;
  const scooters = current.filter((m) => /scooter/i.test(m.category));
  const manual = current.filter((m) => m.transmission === "Manual").length;
  const cheapest = ranges.reduce((best, row) => row.from < best.from ? row : best, ranges[0]);
  const latestChecked = current.map((m) => m.verifiedAt).sort().at(-1) || "";
  const authorityModels = current.filter((m) => Boolean(modelAuthorityProfile(m.id)));

  const faq = [
    {
      question: `Is this the complete ${brand} motorcycle lineup in the Philippines?`,
      answer: `Not necessarily. This page includes ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} with checked Philippine price and specification sources. The full manufacturer lineup can be broader and can change over time.`
    },
    {
      question: `How many ${brand} motorcycles are covered on this page?`,
      answer: `There are ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} covered here${previous.length ? `, plus ${previous.length} previous-generation ${previous.length === 1 ? "model" : "models"} kept for reference` : ""}.`
    },
    {
      question: `How much are ${brand} motorcycles in the Philippines?`,
      answer: `Across the current ${brand} models on this page, published pricing runs from ${php(low)} to ${php(high)}. Variant, dealer, location and financing differences can change the amount paid.`
    },
    {
      question: `What is the cheapest ${brand} motorcycle currently tracked?`,
      answer: `${cheapest.model.make} ${cheapest.model.model} is the lowest-priced current ${brand} model in this published set at ${phpRange(cheapest.from, cheapest.to)}. Recheck the linked dated source before purchase because pricing can change.`
    },
    {
      question: `Are these ${brand} prices official dealer quotes?`,
      answer: `No. The prices are dated reference points, not guaranteed transaction quotes. Open a model page to see the source date, then confirm the current cash price, fees and promotions with the seller.`
    }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${brand} motorcycles in the Philippines`,
      description: `Current ${brand} motorcycle prices, specifications and research for the Philippines.`,
      url: absoluteUrl(`/motorcycles/${make}`),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: current.length,
        itemListElement: current.map((m, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${m.make} ${m.model}`,
          url: absoluteUrl(`/motorcycles/${m.makeSlug}/${m.slug}`)
        }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ];

  return <section className="ph-brand-page">
    <div className="ph-brand-hero">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: brand }]} />
        <div className="ph-brand-hero-grid">
          <div>
            <span className="entity-kicker">Philippines · Prices · Specs · Buyer guide</span>
            <h1>{brand} motorcycles in the Philippines</h1>
            <p>Compare current {brand} motorcycle prices, engine specs, seat heights and ownership details in one place. Open any model for financing estimates, fitment, maintenance and alternatives.</p>
            <div className="ph-brand-actions">
              <Link className="button" href="#models">Browse {brand} models</Link>
              <Link className="button secondary" href={{ pathname: "/compare", query: { make } }}>Compare motorcycles</Link>
            </div>
            <small className="ph-brand-checked">Latest price/spec source check: {latestChecked}</small>
          </div>
          <aside className="ph-brand-overview" aria-label={`${brand} catalog overview`}>
            <div><span>Models covered</span><strong>{current.length}</strong><small>Current models on MotoIndex</small></div>
            <div><span>Price range</span><strong>{php(low)}–{php(high)}</strong><small>Published prices across current models</small></div>
            <div><span>Engine range</span><strong>{minEngine}–{maxEngine} cc</strong><small>Across models covered here</small></div>
            <div><span>Transmission</span><strong>{automatic} auto · {manual} manual</strong><small>Across models covered here</small></div>
            {authorityModels.length > 0 && <div><span>Buyer guides</span><strong>{authorityModels.length}</strong><small>Expanded decision briefs with alternatives and Philippine ownership context</small></div>}
          </aside>
        </div>
      </div>
    </div>

    <div className="shell">
      <nav className="ph-brand-nav" aria-label={`${brand} page sections`}>
        <a href="#models">Models</a><a href="#price-list">Price list</a><a href="#categories">Categories</a>{support && <a href="#support">After-sales</a>}<a href="#research">How to use data</a><a href="#faq">FAQ</a>
      </nav>

      {priority && <section className="ph-brand-context">
        <div><span>{brand} buying guide</span><h2>Choosing a {brand} motorcycle</h2></div>
        <p>Start with your budget and intended use, then compare engine size, seat height, transmission and local ownership support. Open a model for prices, financing estimates, fitment and alternatives.</p>
      </section>}

      {families.length > 0 && <div className="guide-strip ph-brand-families">{families.map((f) => <Link key={f.slug} href={`/motorcycles/${f.makeSlug}/${f.slug}`}><span>Model family</span><strong>{f.make} {f.name}</strong><small>Compare generations</small></Link>)}</div>}
      {collections.length > 0 && <div className="guide-strip ph-brand-families">{collections.map((item) => <Link key={item.href} href={item.href}><span>Popular collection</span><strong>{item.label}</strong><small>{item.note}</small></Link>)}</div>}

      <section id="models" className={`ph-brand-section ph-brand-models-section${current.length <= 2 ? " is-sparse" : ""}`}>
        <div className="section-head compact"><div><span className="section-kicker">Current motorcycles</span><h2>Compare {brand} motorcycles</h2><p>{current.length <= 2 ? `Compare the ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} on this page by price and key specifications.` : `Compare ${current.length} ${brand} models by price, engine, seat height and transmission, then open a model for financing, fitment and ownership details.`}</p></div></div>
        <div className="card-grid ph-brand-model-grid">{current.map((m) => <ModelCard key={m.id} model={m} />)}</div>
      </section>

      <section id="price-list" className="ph-brand-section">
        <div className="section-head compact"><div><span className="section-kicker">Decision table</span><h2>{brand} motorcycle price list</h2><p>Use this as a dated comparison starting point, then open the model page to inspect source context, variant range and financing tools.</p></div></div>
        <div className="ph-brand-price-table" role="table" aria-label={`${brand} motorcycle price list`}>
          <div className="head" role="row"><span>Model</span><span>Price reference</span><span>Engine</span><span>Seat</span><span>Transmission</span></div>
          {ranges.map(({ model, from, to }) => <Link role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id}>
            <strong>{model.model}<small>{model.category}</small></strong><span>{phpRange(from, to)}</span><span>{model.engineCc} cc</span><span>{model.seatHeightMm} mm</span><span>{model.transmission || "—"} →</span>
          </Link>)}
        </div>
      </section>

      <section id="categories" className="ph-brand-section ph-brand-two-col">
        <div>
          <span className="section-kicker">Shop by use</span><h2>Categories in the current {brand} coverage</h2>
          {scooters.length >= 3 && <Link className="button small" href={`/motorcycles/${make}/scooters`}>See all {brand} scooters →</Link>}
          <div className="ph-brand-category-grid">{categories.map((category) => <Link key={category} href={{ pathname: "/motorcycles", query: { make, type: category } }}><strong>{category}</strong><span>{current.filter((m) => m.category === category).length} covered</span></Link>)}</div>
        </div>
        <aside className="ph-brand-start-card"><span>Need a faster answer?</span><h3>Start with fit, budget or a side-by-side comparison.</h3><p>The catalog is most useful when you narrow the choice by real constraints rather than by brand alone.</p><div><Link href={{ pathname: "/finder", query: { make } }}>Use motorcycle finder →</Link><Link href="/compare">Open comparison tool →</Link><Link href="/recommendations">Browse PH recommendations →</Link></div></aside>
      </section>

      {support && <section id="support" className="ph-brand-section ph-brand-support-section">
        <div className="section-head compact"><div><span className="section-kicker">Philippine ownership support</span><h2>{brand} dealers, service and owner resources</h2><p>The buying decision does not end at the spec sheet. These brand-level links help riders check the actual local network before paying a reservation.</p></div></div>
        <div className="ph-brand-support-panel">
          <article><span>Official resource</span><h3>{support.officialName}</h3><p>{support.supportNote}</p><small>Resource check: {support.checkedAt}</small></article>
          <div><a href={support.officialUrl} target="_blank" rel="noreferrer">Official Philippine brand site ↗</a>{support.dealerUrl && <a href={support.dealerUrl} target="_blank" rel="noreferrer">Find a dealer ↗</a>}{support.serviceUrl && <a href={support.serviceUrl} target="_blank" rel="noreferrer">Service / after-sales ↗</a>}{support.ownerUrl && <a href={support.ownerUrl} target="_blank" rel="noreferrer">Owner resources ↗</a>}{support.recallUrl && <a href={support.recallUrl} target="_blank" rel="noreferrer">Safety / recall resource ↗</a>}</div>
        </div>
      </section>}

      <section id="research" className="ph-brand-section">
        <div className="section-head compact"><div><span className="section-kicker">How to use the data</span><h2>Before choosing a {brand} motorcycle</h2><p>Dated price references and specifications stay visible so you can compare models without treating the page as a guaranteed dealer quote or a complete manufacturer catalog.</p></div></div>
        <div className="ph-brand-method-grid"><article><span>01</span><h3>Check the price date</h3><p>Prices are dated reference points. Open the model page to see the source and confirm the current cash price, fees and variant with the seller.</p></article><article><span>02</span><h3>Compare fit and use</h3><p>Engine size, seat height, weight, transmission and tire data help narrow the shortlist, but actual rider fit and comfort still need an in-person check.</p></article><article><span>03</span><h3>Confirm local support</h3><p>Dealer reach, parts, service intervals and warranty support matter after purchase. Use the official brand resources linked on this page when available.</p></article></div>
      </section>

      {uncertain.length > 0 && <section className="ph-brand-section"><div className="section-head compact"><div><span className="section-kicker">Availability to verify</span><h2>{brand} models needing a current lineup check</h2><p>These model pages remain available for research, but they stay outside the current lineup until present-day official availability is confirmed.</p></div></div><div className="card-grid">{uncertain.map((m) => <ModelCard key={m.id} model={m} />)}</div></section>}

      {previous.length > 0 && <section className="ph-brand-section"><div className="section-head compact"><div><span className="section-kicker">Archive</span><h2>Older {brand} models</h2><p>Previous-generation references are kept separate from the current lineup so historical launch pricing is not mistaken for today&apos;s price.</p></div></div><div className="card-grid">{previous.map((m) => <ModelCard key={m.id} model={m} />)}</div></section>}

      <section id="faq" className="ph-brand-section">
        <div className="section-head compact"><div><span className="section-kicker">Quick answers</span><h2>{brand} motorcycles FAQ</h2></div></div>
        <div className="ph-brand-faq">{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>
    <JsonLd data={schema} />
  </section>;
}

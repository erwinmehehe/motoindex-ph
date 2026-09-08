import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { ModelCard } from "@/components/ModelCard";
import { pageMetadata } from "@/lib/site";
import { modelFamilies } from "@/lib/families";
import { observedMarketRange } from "@/lib/marketChecks";
import { getPhBrandPriority } from "@/lib/phBrandPriority";
import { phBrandSupportFor } from "@/lib/phBrandSupport";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { modelAuthorityQuality } from "@/lib/modelQuality";
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
  const range = low && high ? ` Current tracked prices run from ${php(low)} to ${php(high)}.` : "";
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
  const qualityRows = authorityModels.map((m) => modelAuthorityQuality(m));
  const averageAuthorityScore = qualityRows.length ? Math.round(qualityRows.reduce((sum, row) => sum + row.score, 0) / qualityRows.length) : undefined;

  const faq = [
    {
      question: `Is this the complete ${brand} motorcycle lineup in the Philippines?`,
      answer: `No. This hub publishes only the ${brand} models that currently pass MotoIndex's evidence and page-depth gate. ${current.length} current ${brand} ${current.length === 1 ? "model is" : "models are"} published here today; the real Philippine lineup may be broader, and additional models are added only after their records are researched.`
    },
    {
      question: `How many ${brand} motorcycles does MotoIndex currently track in the Philippines?`,
      answer: `MotoIndex currently publishes ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} on this Philippines brand hub${previous.length ? `, plus ${previous.length} previous-generation reference ${previous.length === 1 ? "model" : "models"}` : ""}. The catalog expands when we can attach a dated price reference and a usable specification record to the model.`
    },
    {
      question: `How much are ${brand} motorcycles in the Philippines?`,
      answer: `Across the current ${brand} models tracked here, observed model-level pricing runs from ${php(low)} to ${php(high)}. Variant, dealer, location and financing differences can change the amount paid.`
    },
    {
      question: `What is the cheapest ${brand} motorcycle currently tracked?`,
      answer: `${cheapest.model.make} ${cheapest.model.model} is the lowest-priced current ${brand} model in this published set at ${phpRange(cheapest.from, cheapest.to)}. Recheck the linked dated source before purchase because pricing can change.`
    },
    {
      question: `Are these ${brand} prices official dealer quotes?`,
      answer: `No. MotoIndex treats prices as dated reference points, not guaranteed transaction quotes. Each model page shows its source and verification date so buyers can recheck the current Philippine offer.`
    }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${brand} motorcycles in the Philippines`,
      description: `Current ${brand} motorcycle prices, specifications and research for the Philippines.`,
      url: `/motorcycles/${make}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: current.length,
        itemListElement: current.map((m, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${m.make} ${m.model}`,
          url: `/motorcycles/${m.makeSlug}/${m.slug}`
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
            <span className="entity-kicker">Philippines {priority ? `· ${priority.label}` : "· Brand guide"}</span>
            <h1>{brand} motorcycles: prices, specs and models in the Philippines</h1>
            <p>One research hub for the {brand} models we can substantiate now: buyer verdicts, dated price/spec references, ownership context, after-sales links and full model pages. This is a researched coverage set, not a claim that every Philippine-market {brand} is already indexed.</p>
            <div className="ph-brand-actions">
              <Link className="button" href="#models">Browse {brand} models</Link>
              <Link className="button secondary" href={{ pathname: "/compare", query: { make } }}>Compare motorcycles</Link>
            </div>
            <small className="ph-brand-checked">Latest model-source check in this hub: {latestChecked}</small>
          </div>
          <aside className="ph-brand-overview" aria-label={`${brand} catalog overview`}>
            <div><span>Current models</span><strong>{current.length}</strong><small>Models with dated research</small></div>
            <div><span>Tracked price span</span><strong>{php(low)}–{php(high)}</strong><small>Model-level observed references</small></div>
            <div><span>Engine range</span><strong>{minEngine}–{maxEngine} cc</strong><small>Across the current catalog</small></div>
            <div><span>Transmission mix</span><strong>{automatic} auto · {manual} manual</strong><small>Current tracked models</small></div>
            {averageAuthorityScore !== undefined && <div><span>Authority depth</span><strong>{averageAuthorityScore}/100</strong><small>{authorityModels.length} buyer-researched anchor {authorityModels.length === 1 ? "model" : "models"}</small></div>}
          </aside>
        </div>
      </div>
    </div>

    <div className="shell">
      <nav className="ph-brand-nav" aria-label={`${brand} page sections`}>
        <a href="#models">Models</a><a href="#price-list">Price list</a><a href="#categories">Categories</a>{support && <a href="#support">After-sales</a>}<a href="#research">Research method</a><a href="#faq">FAQ</a>
      </nav>

      {priority && <section className="ph-brand-context">
        <div><span>Why MotoIndex is expanding this brand</span><h2>{priority.reason}</h2></div>
        <p>Depth comes before breadth: every expansion model needs a dated source, a complete core-spec record, a unique Philippine buyer brief and a usable after-sales path before it can pass the publication gate.</p>
      </section>}

      {families.length > 0 && <div className="guide-strip ph-brand-families">{families.map((f) => <Link key={f.slug} href={`/motorcycles/${f.makeSlug}/${f.slug}`}><span>Model family</span><strong>{f.make} {f.name}</strong><small>Compare generations</small></Link>)}</div>}

      <section id="models" className="ph-brand-section">
        <div className="section-head compact"><div><span className="section-kicker">Published coverage</span><h2>{brand} motorcycles we have researched now</h2><p>This is deliberately not labeled the complete lineup. Every card must meet the model-page publication standard and opens one consolidated research page rather than splitting the same motorcycle across repetitive pages.</p></div></div>
        <div className="card-grid">{current.map((m) => <ModelCard key={m.id} model={m} />)}</div>
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
          <span className="section-kicker">Shop by use</span><h2>Categories in the {brand} lineup</h2>
          {scooters.length >= 3 && <Link className="button small" href={`/motorcycles/${make}/scooters`}>See all {brand} scooters →</Link>}
          <div className="ph-brand-category-grid">{categories.map((category) => <Link key={category} href={{ pathname: "/motorcycles", query: { make, type: category } }}><strong>{category}</strong><span>{current.filter((m) => m.category === category).length} tracked</span></Link>)}</div>
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
        <div className="section-head compact"><div><span className="section-kicker">Evidence first</span><h2>How this {brand} hub stays useful</h2><p>A useful brand page needs enough real decision detail to earn its place. Expansion models are scored for source quality, core specs, unique buyer analysis, direct competitors and Philippine support resources. Missing media, maintenance schedules or independent price checks stay visible as research gaps.</p></div></div>
        <div className="ph-brand-method-grid"><article><span>01</span><h3>Research threshold first</h3><p>A dated model source, complete core specs, unique buyer analysis and a local ownership/support path are required before a Tier 2/3 model is published.</p></article><article><span>02</span><h3>One complete model page</h3><p>Price, specs, buyer verdict, financing, fitment, maintenance, support links and ownership research live together so buyers do not chase fragments.</p></article><article><span>03</span><h3>Gaps stay visible</h3><p>If media, model-year maintenance, variant mapping or a second price source is missing, the page says so instead of filling the hole with generic filler.</p></article></div>
      </section>

      {uncertain.length > 0 && <section className="ph-brand-section"><div className="section-head compact"><div><span className="section-kicker">Availability to verify</span><h2>{brand} models needing a current lineup check</h2><p>These source-backed model pages remain available for research, but they are kept outside the current lineup until present-day official availability is confirmed.</p></div></div><div className="card-grid">{uncertain.map((m) => <ModelCard key={m.id} model={m} />)}</div></section>}

      {previous.length > 0 && <section className="ph-brand-section"><div className="section-head compact"><div><span className="section-kicker">Archive</span><h2>Older {brand} models</h2><p>Previous-generation references are kept separate from the current lineup so historical launch pricing is not mistaken for today&apos;s price.</p></div></div><div className="card-grid">{previous.map((m) => <ModelCard key={m.id} model={m} />)}</div></section>}

      <section id="faq" className="ph-brand-section">
        <div className="section-head compact"><div><span className="section-kicker">Quick answers</span><h2>{brand} motorcycles FAQ</h2></div></div>
        <div className="ph-brand-faq">{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>
    <JsonLd data={schema} />
  </section>;
}

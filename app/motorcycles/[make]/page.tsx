import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { notFound } from "next/navigation";
import { motorcycles, isIndexableModel } from "@/lib/data";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { modelFamilies } from "@/lib/families";
import { observedMarketRange } from "@/lib/marketChecks";
import { getPhBrandPriority } from "@/lib/phBrandPriority";
import { phBrandSupportFor } from "@/lib/phBrandSupport";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { php, phpRange } from "@/lib/utils";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { brandSeoGrowthProfile } from "@/lib/brandSeoGrowth";

export function generateStaticParams() {
  return [...new Set(motorcycles.map((m) => m.makeSlug))].map((make) => ({ make }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string }> }): Promise<Metadata> {
  const { make } = await params;
  const models = motorcycles.filter((m) => m.makeSlug === make);
  if (!models.length) return {};
  const brand = models[0].make;
  const publicModels = models.filter(isIndexableModel);
  const brandGrowth = brandSeoGrowthProfile(make);
  const current = publicModels.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued");
  const low = current.length ? Math.min(...current.map((m) => observedMarketRange(m).from)) : undefined;
  const high = current.length ? Math.max(...current.map((m) => observedMarketRange(m).to || observedMarketRange(m).from)) : undefined;
  const priceContext = low && high ? ` Current prices run from ${php(low)} to ${php(high)}.` : "";
  return pageMetadata({
    title: brandGrowth?.seoTitle || `${brand} Motorcycle Philippines Price List`,
    description: brandGrowth?.seoDescription || `See the ${brand} motorcycle Philippines price list with current model prices, specs, engine sizes, seat heights and key buying details.${priceContext}`,
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
  const brandGrowth = brandSeoGrowthProfile(make);
  const publicIds = new Set(publicModels.map((m) => m.id));
  const current = publicModels.filter((m) => m.marketStatus !== "previous" && m.marketStatus !== "uncertain" && m.marketStatus !== "discontinued").sort((a, b) => a.srp - b.srp || a.model.localeCompare(b.model));
  const uncertain = publicModels.filter((m) => m.marketStatus === "uncertain").sort((a, b) => a.model.localeCompare(b.model));
  const previous = publicModels.filter((m) => m.marketStatus === "previous").sort((a, b) => a.model.localeCompare(b.model));
  const families = modelFamilies.filter((f) => f.makeSlug === make && f.generationIds.length > 0 && f.generationIds.every((id) => publicIds.has(id)));
  const priority = getPhBrandPriority(make);
  const support = phBrandSupportFor(make);
  if (!publicModels.length) {
    return <section className="page shell">
      <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: brand }]} />
      <PageHero kicker="Philippines motorcycle price list" title={`${brand} Motorcycle Philippines Price List`} description="Model prices and specifications are being checked before publication." />
      <InfoPanel subtle><h2>{brand} price list data is being updated</h2><p>Current prices and specifications still need checking before this list is published.</p></InfoPanel>
    </section>;
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
  const authorityModels = current.filter((m) => Boolean(modelAuthorityProfile(m.id)));

  const faq = [
    {
      question: `What is the current ${brand} motorcycle Philippines price list?`,
      answer: `Across the current ${brand} models covered on MotoIndex, published pricing runs from ${php(low)} to ${php(high)}. Open the price list below for model-by-model prices, then confirm the current dealer quote before purchase.`
    },
    {
      question: `Is this the complete ${brand} motorcycle lineup in the Philippines?`,
      answer: `Not necessarily. This page includes ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} with checked Philippine price and specification sources. The full manufacturer lineup can be broader and can change over time.`
    },
    {
      question: `How many ${brand} motorcycles are covered on this page?`,
      answer: `There are ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} covered here${previous.length ? `, plus ${previous.length} previous-generation ${previous.length === 1 ? "model" : "models"} kept for reference` : ""}.`
    },
    {
      question: `What is the cheapest ${brand} motorcycle currently tracked?`,
      answer: `${cheapest.model.make} ${cheapest.model.model} is the lowest-priced current ${brand} model in this published set at ${phpRange(cheapest.from, cheapest.to)}. Confirm the current dealer quote before purchase because pricing can change.`
    },
    {
      question: `Are these ${brand} prices official dealer quotes?`,
      answer: `No. The prices are reference points, not guaranteed transaction quotes. Confirm the current cash price, fees and promotions with the seller before purchase.`
    }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${brand} Motorcycle Philippines Price List`,
      description: `${brand} motorcycle Philippines price list with current model prices, specifications and buying research.`,
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
        <PageHero
          kicker="Philippines · Price list · Models · Specs"
          title={brandGrowth?.heroTitle || `${brand} Motorcycle Philippines Price List`}
          description={brandGrowth?.heroDescription || `Compare the current ${brand} motorcycle Philippines price list by model, published price, engine size, seat height and transmission. Open any motorcycle for detailed specs, financing estimates, fitment, maintenance and alternatives.`}
          actions={<><CTAGroup><Link className="button" href="#price-list">View {brand} price list</Link><Link className="button secondary" href={{ pathname: "/compare", query: { make } }}>Compare {brand} motorcycles</Link></CTAGroup></>}
        />
        {brandGrowth ? <InfoPanel subtle><p>{brandGrowth.intentNote}</p></InfoPanel> : null}
        <StatRow items={[
          {label:"Models covered",value:current.length,note:"Current models on MotoIndex"},
          {label:"Price range",value:`${php(low)}–${php(high)}`,note:"Published prices across current models"},
          {label:"Engine range",value:`${minEngine}–${maxEngine} cc`,note:"Across models covered here"},
          {label:"Transmission",value:`${automatic} auto · ${manual} manual`,note:"Across models covered here"},
          ...(authorityModels.length > 0 ? [{label:"Buyer guides",value:authorityModels.length,note:"Expanded decision briefs with Philippine ownership context"}] : [])
        ]}/>
      </div>
    </div>

    <div className="shell">
      <nav className="ph-brand-nav" aria-label={`${brand} page sections`}>
        <a href="#price-list">Price list</a><a href="#models">Models</a><a href="#categories">Categories</a>{support && <a href="#support">After-sales</a>}<a href="#research">How to use data</a><a href="#faq">FAQ</a>
      </nav>

      {priority && <section className="ph-brand-context">
        <div><span>{brand} buying guide</span><h2>How to choose from the {brand} motorcycle price list</h2></div>
        <p>Use the price list to narrow your budget first, then compare engine size, seat height, transmission and local ownership support. Open a model for detailed specifications, financing estimates, fitment and alternatives.</p>
      </section>}

      {families.length > 0 && <div className="guide-strip ph-brand-families">{families.map((f) => <Link key={f.slug} href={`/motorcycles/${f.makeSlug}/${f.slug}`}><span>Model family</span><strong>{f.make} {f.name}</strong><small>Compare generations</small></Link>)}</div>}

      <section id="models" className={`ph-brand-section ph-brand-models-section${current.length <= 2 ? " is-sparse" : ""}`}>
        <SectionHeader kicker="Current motorcycles" title={`Compare ${brand} motorcycle models in the Philippines`} description={current.length <= 2 ? `Compare the ${current.length} current ${brand} ${current.length === 1 ? "model" : "models"} by price and key specifications.` : `Compare ${current.length} current ${brand} motorcycle models by price, engine, seat height and transmission, then open a model for financing, fitment and ownership details.`} />
        <div className="card-grid ph-brand-model-grid">{current.map((m) => <MotorcycleCard key={m.id} model={m} variant="standard" />)}</div>
      </section>

      <section id="price-list" className="ph-brand-section">
        <SectionHeader kicker="Current model prices" title={`${brand} Motorcycle Philippines Price List`} description={`Compare current ${brand} motorcycle prices in one table. Use these dated price references as a starting point, then open the exact model to check source context, variants and financing details.`} />
        <DataTable className="ph-brand-price-table" label={`${brand} motorcycle Philippines price list`}>
          <div className="head" role="row"><span>Model</span><span>Price reference</span><span>Engine</span><span>Seat</span><span>Transmission</span></div>
          {ranges.map(({ model, from, to }) => <Link role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id}>
            <strong>{model.model}<small>{model.category}</small></strong><span>{phpRange(from, to)}</span><span>{model.engineCc} cc</span><span>{model.seatHeightMm} mm</span><span>{model.transmission || "—"} →</span>
          </Link>)}
        </DataTable>
      </section>

      <section id="categories" className="ph-brand-section ph-brand-two-col">
        <div>
          <SectionHeader kicker="Shop by use" title={`${brand} motorcycle models by category`} />
          {scooters.length >= 3 && <div id="scooters" className="ph-brand-scooter-strip"><strong>{brand} scooters</strong><div>{scooters.map((m) => <Link key={m.id} href={`/motorcycles/${m.makeSlug}/${m.slug}`}><span>{m.model}</span><small>{phpRange(observedMarketRange(m).from, observedMarketRange(m).to)}</small></Link>)}</div></div>}
          <div className="ph-brand-category-grid">{categories.map((category) => <Link key={category} href={{ pathname: "/motorcycles", query: { make, type: category } }}><strong>{category}</strong><span>{current.filter((m) => m.category === category).length} covered</span></Link>)}</div>
        </div>
        <InfoPanel className="ph-brand-start-card"><span>Need a faster answer?</span><h3>Start with price, fit or a side-by-side comparison.</h3><p>Use the {brand} price list to set a realistic budget, then narrow the choice by engine, seat height, transmission and intended use.</p><div><Link href={{ pathname: "/finder", query: { make } }}>Use motorcycle finder →</Link><Link href="/compare">Open comparison tool →</Link><Link href="/recommendations">Browse PH recommendations →</Link></div></InfoPanel>
      </section>

      {support && <section id="support" className="ph-brand-section ph-brand-support-section">
        <SectionHeader kicker="Philippine ownership support" title={`${brand} dealers, service and owner resources`} description="The price list is only the starting point. Check dealer reach, parts, service and warranty support before paying a reservation." />
        <div className="ph-brand-support-panel">
          <article><span>Official resource</span><h3>{support.officialName}</h3><p>{support.supportNote}</p><small>Resource check: {support.checkedAt}</small></article>
          <div><a href={support.officialUrl} target="_blank" rel="noreferrer">Official Philippine brand site ↗</a>{support.dealerUrl && <a href={support.dealerUrl} target="_blank" rel="noreferrer">Find a dealer ↗</a>}{support.serviceUrl && <a href={support.serviceUrl} target="_blank" rel="noreferrer">Service / after-sales ↗</a>}{support.ownerUrl && <a href={support.ownerUrl} target="_blank" rel="noreferrer">Owner resources ↗</a>}{support.recallUrl && <a href={support.recallUrl} target="_blank" rel="noreferrer">Safety / recall resource ↗</a>}</div>
        </div>
      </section>}

      <section id="research" className="ph-brand-section">
        <SectionHeader kicker="How to use the data" title={`How to use this ${brand} motorcycle price list`} description="Prices are dated reference points, not guaranteed dealer quotes. Compare the model and specification differences here, then open the exact motorcycle page to verify the source date and current selling price." />
        <div className="ph-brand-method-grid"><article><span>01</span><h3>Check the price date</h3><p>Prices are dated reference points. Open the model page to see the source and confirm the current cash price, fees and variant with the seller.</p></article><article><span>02</span><h3>Compare specs and rider fit</h3><p>Engine size, seat height, weight, transmission and tire data help narrow the shortlist, but actual rider fit and comfort still need an in-person check.</p></article><article><span>03</span><h3>Confirm local support</h3><p>Dealer reach, parts, service intervals and warranty support matter after purchase. Use the official brand resources linked on this page when available.</p></article></div>
      </section>

      {uncertain.length > 0 && <section className="ph-brand-section"><SectionHeader kicker="Availability to verify" title={`${brand} models needing a current lineup check`} description="These model pages remain available for research, but they stay outside the current price list until present-day official availability is confirmed." /><div className="card-grid">{uncertain.map((m) => <MotorcycleCard key={m.id} model={m} variant="standard" />)}</div></section>}

      {previous.length > 0 && <section className="ph-brand-section"><SectionHeader kicker="Archive" title={`Previous ${brand} motorcycle models and prices`} description="Previous-generation references are kept separate from the current price list so historical launch pricing is not mistaken for today&apos;s price." /><div className="card-grid">{previous.map((m) => <MotorcycleCard key={m.id} model={m} variant="standard" />)}</div></section>}

      <section id="faq" className="ph-brand-section">
        <SectionHeader kicker="Quick answers" title={`${brand} Motorcycle Philippines Price List FAQ`} />
        <div className="ph-brand-faq">{faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>
    <JsonLd data={schema} />
  </section>;
}
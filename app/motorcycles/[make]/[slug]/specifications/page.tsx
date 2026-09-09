import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ModelCard } from "@/components/ModelCard";
import { SourceRef } from "@/components/SourceRef";
import { motorcycles, getModel, isIndexableModel } from "@/lib/data";
import { efficiencyEvidence } from "@/lib/efficiency";
import { observedMarketRange } from "@/lib/marketChecks";
import { getVerifiedVariantsForModel } from "@/lib/variants";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { phpRange } from "@/lib/utils";

export function generateStaticParams() {
  return motorcycles.filter(isIndexableModel).map((m) => ({ make: m.makeSlug, slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  return pageMetadata({
    title: `${model.make} ${model.model} Specifications Philippines 2026`,
    description: `${model.make} ${model.model} specifications in the Philippines: ${model.engineCc}cc engine, ${model.powerHp} hp, ${model.torqueNm} Nm, ${model.curbWeightKg} kg weight, ${model.seatHeightMm} mm seat, tires and ABS.`,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/specifications`,
    index: isIndexableModel(model)
  });
}

export default async function MotorcycleSpecificationsPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();

  const efficiency = efficiencyEvidence(model);
  const range = observedMarketRange(model);
  const variants = getVerifiedVariantsForModel(model.id);
  const alternatives = motorcycles
    .filter((m) => m.id !== model.id && m.category === model.category && m.marketStatus !== "previous" && isIndexableModel(m))
    .sort((a, b) => Math.abs(observedMarketRange(a).from - range.from) - Math.abs(observedMarketRange(b).from - range.from))
    .slice(0, 4);

  const rows = [
    ["Engine displacement", `${model.engineCc} cc`],
    ["Maximum power", `${model.powerHp} hp`],
    ["Maximum torque", `${model.torqueNm} Nm`],
    ["Transmission", model.transmission || "Check current source"],
    ["Curb weight", `${model.curbWeightKg} kg`],
    ["Seat height", `${model.seatHeightMm} mm`],
    ["Fuel tank", `${model.fuelTankL} L`],
    ["Fuel economy", `${efficiency.kmPerL} km/L · ${efficiency.status === "listed" ? "published" : "planning estimate"}`],
    ["Ground clearance", model.groundClearanceMm ? `${model.groundClearanceMm} mm` : "Not published in the stored record"],
    ["Front tire", model.frontTire],
    ["Rear tire", model.rearTire],
    ["Brakes / ABS", model.abs],
    ["Generation", model.generation],
    ["Category", model.category]
  ];

  const faq = [
    { q: `What is the engine size of the ${model.make} ${model.model}?`, a: `The ${model.make} ${model.model} has a ${model.engineCc} cc engine producing ${model.powerHp} hp and ${model.torqueNm} Nm of torque.` },
    { q: `What is the seat height of the ${model.make} ${model.model}?`, a: `Seat height is ${model.seatHeightMm} mm. Actual ground reach also depends on your inseam, seat width, suspension sag and footwear.` },
    { q: `How much does the ${model.make} ${model.model} weigh?`, a: `Curb weight is ${model.curbWeightKg} kg. Check the exact model year if your motorcycle or local specification differs.` },
    { q: `What tire sizes does the ${model.make} ${model.model} use?`, a: `It uses ${model.frontTire} at the front and ${model.rearTire} at the rear. Match the full size, load rating, speed rating and front/rear application when buying replacements.` }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${model.make} ${model.model}`,
      url: absoluteUrl(`/motorcycles/${model.makeSlug}/${model.slug}/specifications`),
      brand: { "@type": "Brand", name: model.make },
      category: `Motorcycle — ${model.category}`,
      additionalProperty: rows.map(([name, value]) => ({ "@type": "PropertyValue", name, value }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    }
  ];

  return <section className="page shell">
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: `/motorcycles/${model.makeSlug}/${model.slug}` },
      { label: "Specifications" }
    ]} />

    <div className="page-head">
      <span className="entity-kicker">Philippines specifications · checked {model.verifiedAt}</span>
      <h1>{model.make} {model.model} specifications</h1>
      <p>Engine, power, torque, dimensions, seat height, weight, fuel capacity, tire sizes and braking data for the {model.make} {model.model}. The figures below match the specifications shown in the main motorcycle guide.</p>
      <div className="hero-actions">
        <Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Full {model.model} guide</Link>
        {model.colors.length > 0 && <Link className="button secondary" href={`/motorcycles/${model.makeSlug}/${model.slug}/colors`}>View colors</Link>}
      </div>
    </div>

    <div className="entity-price-grid motorcycle-price-grid">
      <article><span>Engine</span><strong>{model.engineCc} cc</strong><small>{model.powerHp} hp · {model.torqueNm} Nm</small></article>
      <article><span>Seat / weight</span><strong>{model.seatHeightMm} mm</strong><small>{model.curbWeightKg} kg curb weight</small></article>
      <article><span>Price context</span><strong>{phpRange(range.from, range.to)}</strong><small>Open the main model page for dated price sources.</small></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">Technical data</span><h2>{model.make} {model.model} specs table</h2><p>Use the complete specification, not one number in isolation, when comparing fit, performance or replacement parts.</p></div></div>
    <div className="entity-spec-table motorcycle-spec-table" role="table" aria-label={`${model.make} ${model.model} specifications`}>
      {rows.map(([label, value]) => <div role="row" key={label}><span role="cell">{label}</span><strong role="cell">{value}</strong></div>)}
    </div>

    {variants.length > 0 && <section className="ph-brand-section">
      <div className="section-head compact"><div><span className="section-kicker">Variants</span><h2>Variant differences to check</h2><p>Some equipment and colors vary by trim even when the core engine specification is shared.</p></div></div>
      <div className="topic-grid">{variants.map((variant) => <article key={variant.id}><span>{variant.name}</span><h3>{phpRange(variant.srpPhp)}</h3><p>{variant.featureSummary}</p><small>{variant.differentiators.join(" · ")}</small></article>)}</div>
    </section>}

    <section className="ph-brand-section">
      <div className="section-head compact"><div><span className="section-kicker">How to read the numbers</span><h2>What matters beyond engine displacement</h2></div></div>
      <div className="topic-grid">
        <article><h3>Seat height + weight</h3><p>A low seat can help at a stop, but curb weight, seat width and suspension sag also affect low-speed confidence.</p></article>
        <article><h3>Power + torque</h3><p>Peak output does not describe the whole riding experience. Gearing, throttle response, rider aids and where the torque arrives also matter.</p></article>
        <article><h3>Tires + brakes</h3><p>Match the full tire specification and confirm the exact ABS/braking equipment on the Philippine-market model or variant.</p></article>
      </div>
    </section>

    <section className="ph-brand-section">
      <div className="note-box">
        <h2>Specification source</h2>
        <p>{model.sourceLabel}</p>
        <SourceRef url={model.sourceUrl} label="Open specification source" />
        <small>Record checked {model.verifiedAt}. Manufacturers can revise specifications and equipment by model year or market.</small>
      </div>
    </section>

    {alternatives.length > 0 && <section className="ph-brand-section">
      <div className="section-head compact"><div><span className="section-kicker">Cross-shop</span><h2>Similar {model.category.toLowerCase()} motorcycles</h2><p>Compare nearby alternatives using the same core specification fields.</p></div></div>
      <div className="card-grid">{alternatives.map((m) => <ModelCard key={m.id} model={m} />)}</div>
    </section>}

    <section className="ph-brand-section">
      <div className="section-head compact"><div><h2>{model.make} {model.model} specifications FAQ</h2></div></div>
      <div className="ph-brand-faq">{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>
    <JsonLd data={schema} />
  </section>;
}

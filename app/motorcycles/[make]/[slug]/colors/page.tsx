import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SourceRef } from "@/components/SourceRef";
import { motorcycles, getModel, isIndexableModel } from "@/lib/data";
import { getVerifiedVariantsForModel } from "@/lib/variants";
import { absoluteUrl, pageMetadata } from "@/lib/site";

function colorsForModel(modelId: string, baseColors: string[]) {
  const variants = getVerifiedVariantsForModel(modelId);
  return [...new Set([...baseColors, ...variants.flatMap((variant) => variant.colors || [])])];
}

export function generateStaticParams() {
  return motorcycles
    .filter((m) => isIndexableModel(m) && colorsForModel(m.id, m.colors).length > 0)
    .map((m) => ({ make: m.makeSlug, slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const colors = colorsForModel(model.id, model.colors);
  return pageMetadata({
    title: `${model.make} ${model.model} Colors Philippines 2026`,
    description: `See the ${model.make} ${model.model} colors recorded for the Philippines, including current variant-specific color information and the source date used by MotoIndex.`,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/colors`,
    index: isIndexableModel(model) && colors.length > 0
  });
}

export default async function MotorcycleColorsPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();

  const variants = getVerifiedVariantsForModel(model.id);
  const colors = colorsForModel(model.id, model.colors);
  if (!colors.length) return notFound();

  const variantRows = variants
    .filter((variant) => (variant.colors || []).length > 0)
    .map((variant) => ({ name: variant.name, colors: variant.colors || [], sourceLabel: variant.sourceLabel, sourceUrl: variant.sourceUrl, checkedAt: variant.checkedAt }));

  const faq = [
    { q: `What colors does the ${model.make} ${model.model} come in?`, a: `Available color references include ${colors.join(", ")}. Actual availability can vary by model year, variant and dealer stock.` },
    { q: `Are all ${model.model} colors available on every variant?`, a: variantRows.length ? "Not necessarily. Some colors are tied to specific variants, so check the exact trim before choosing a finish." : "Not necessarily. Color availability can vary by trim, model year and seller even when the core motorcycle is the same." },
    { q: "Will the actual paint look exactly like it does on a screen?", a: "No. Screens, lighting, camera processing and compression can change how a finish looks. Inspect the actual motorcycle before choosing a color." }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${model.make} ${model.model}`,
      url: absoluteUrl(`/motorcycles/${model.makeSlug}/${model.slug}/colors`),
      brand: { "@type": "Brand", name: model.make },
      category: `Motorcycle — ${model.category}`,
      additionalProperty: [{ "@type": "PropertyValue", name: "Recorded color options", value: colors.join(", ") }]
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
      { label: "Colors" }
    ]} />

    <div className="page-head">
      <span className="entity-kicker">Philippines color guide · checked {model.verifiedAt}</span>
      <h1>{model.make} {model.model} colors</h1>
      <p>These are the color names MotoIndex can tie to the {model.make} {model.model} or its verified Philippine variants. Color availability can change by model year, trim and dealer inventory.</p>
      <div className="hero-actions">
        <Link className="button" href={`/motorcycles/${model.makeSlug}/${model.slug}`}>Full {model.model} guide</Link>
        <Link className="button secondary" href={`/motorcycles/${model.makeSlug}/${model.slug}/specifications`}>View specifications</Link>
      </div>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">Recorded finishes</span><h2>{colors.length} {colors.length === 1 ? "color" : "colors"} currently recorded</h2><p>The labels below are names, not digital paint swatches. MotoIndex does not invent hex values for manufacturer finishes.</p></div></div>
    <div className="topic-grid">
      {colors.map((color) => <article key={color}><span>Color option</span><h3>{color}</h3><p>Confirm this finish on the exact Philippine model year and variant before placing a reservation.</p></article>)}
    </div>

    {variantRows.length > 0 && <section className="ph-brand-section">
      <div className="section-head compact"><div><span className="section-kicker">Variant mapping</span><h2>Colors by variant</h2><p>Where the source identifies trim-specific finishes, they stay separated instead of being flattened into one list.</p></div></div>
      <div className="entity-spec-table motorcycle-spec-table">
        {variantRows.map((row) => <div key={row.name}><span>{row.name}</span><strong>{row.colors.join(" · ")}</strong></div>)}
      </div>
      <div className="topic-grid">{variantRows.map((row) => <article key={row.name}><h3>{row.name} source</h3><p>{row.sourceLabel}</p><SourceRef url={row.sourceUrl} label="Open variant source" /><small>Checked {row.checkedAt}</small></article>)}</div>
    </section>}

    <section className="ph-brand-section">
      <div className="note-box">
        <h2>Color source and availability</h2>
        <p>{model.sourceLabel}</p>
        <SourceRef url={model.sourceUrl} label="Open model source" />
        <small>Base record checked {model.verifiedAt}. Dealer stock, graphics and paint names can change without notice.</small>
      </div>
    </section>

    <section className="ph-brand-section">
      <div className="section-head compact"><div><h2>{model.make} {model.model} color FAQ</h2></div></div>
      <div className="ph-brand-faq">{faq.map((item) => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
    </section>
    <JsonLd data={schema} />
  </section>;
}

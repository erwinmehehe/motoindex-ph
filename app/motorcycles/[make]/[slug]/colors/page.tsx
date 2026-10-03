import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { colorIntentLandingProfile, colorIntentLandingProfiles } from "@/lib/modelColorLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { getVerifiedVariantsForModel } from "@/lib/variants";

export function generateStaticParams() {
  return colorIntentLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = colorIntentLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/colors`,
    index: isIndexableModel(model)
  });
}

export default async function ModelColorsPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  if (!isIndexableModel(model)) return notFound();
  const profile = colorIntentLandingProfile(model.id);
  if (!profile) permanentRedirect(`/motorcycles/${model.makeSlug}/${model.slug}#colors`);

  const variants = getVerifiedVariantsForModel(model.id);
  const allColors = [...new Set([...model.colors, ...variants.flatMap((variant) => variant.colors || [])])];
  if (!allColors.length) return notFound();

  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/colors`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const modelName = `${model.make} ${model.model}`;
  const variantColorRows = variants
    .filter((variant) => (variant.colors || []).length > 0)
    .map((variant) => ({
      variant,
      colors: variant.colors || []
    }));
  const mappedColors = new Set(variantColorRows.flatMap((row) => row.colors));
  const sharedOrUnmappedColors = allColors.filter((color) => !mappedColors.has(color));

  const faqs: FaqItem[] = [
    {
      question: `What colors are available for the ${modelName} in the Philippines?`,
      answer: `Current MotoIndex coverage lists ${allColors.join(", ")}. Color availability can vary by variant, production batch and dealer stock, so confirm the exact unit before reserving.`
    },
    {
      question: `Are all ${modelName} colors available on every variant?`,
      answer: variantColorRows.length > 1
        ? `No. MotoIndex has variant-specific color mapping for ${variantColorRows.map(({ variant, colors }) => `${variant.name}: ${colors.join(", ")}`).join("; ")}. Dealer stock can still differ from the published lineup.`
        : "Not necessarily. Paint availability can change by trim, model year, production batch and branch stock. Confirm the exact variant and color combination before paying a reservation."
    },
    {
      question: `Can a dealer have a ${modelName} color that is not listed here?`,
      answer: "Yes. A dealer can still hold older model-year inventory or limited allocations. Check the model code, year and official color name so older stock is not confused with the current published lineup."
    },
    {
      question: `Does the ${modelName} color change the price?`,
      answer: variants.length > 1
        ? "The motorcycle's variant can change the price, and some colors are variant-specific. Do not assume a price difference is caused by paint alone; match the color to the exact trim and published SRP."
        : "MotoIndex does not assume a price premium from paint alone. Dealer promotions, stock age, accessories and the exact model year can change the transaction price."
    }
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: profile.heading,
    url: absoluteUrl(canonicalPath),
    description: profile.description,
    about: {
      "@type": "Product",
      name: modelName,
      brand: { "@type": "Brand", name: model.make },
      color: allColors
    }
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(`${canonicalPath}#faq`),
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return <main className="shell">
    <JsonLd data={[webPageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: modelPath },
      { label: "Colors" }
    ]} />

    <PageHero
      kicker="Philippines color guide"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#color-list">See all colors</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Listed colors", value: String(allColors.length), note: "Current MotoIndex color coverage" },
      { label: "Verified variants", value: String(variants.length), note: variants.length > 1 ? "Check trim-specific paint mapping" : "Single/unsplit trim coverage" },
      { label: "Model status", value: model.marketStatus === "uncertain" ? "Availability to verify" : model.marketStatus === "previous" ? "Previous generation" : "Current", note: model.generation },
      { label: "Color source check", value: model.verifiedAt, note: model.sourceLabel }
    ]} />

    <section className="section" id="color-list" aria-labelledby="color-list-heading">
      <SectionHeader
        kicker="Current color names"
        titleId="color-list-heading"
        title={`${modelName} color options`}
        description="These are text-verified paint names. MotoIndex does not invent color swatches from names because screen rendering can misrepresent metallic, pearl and matte finishes."
      />
      <div className="entity-color-grid">
        {allColors.map((color) => <article key={color}>
          <strong>{color}</strong>
          <small>{mappedColors.has(color) ? "Mapped to a verified variant below" : "Listed on the model record"}</small>
        </article>)}
      </div>
    </section>

    {variantColorRows.length > 0 && <section className="section" aria-labelledby="variant-colors-heading">
      <SectionHeader
        kicker="Variant mapping"
        titleId="variant-colors-heading"
        title={`Which ${model.model} variant gets which colors?`}
        description="Use the trim mapping to avoid matching a paint option to the wrong SRP or equipment package."
      />
      <div className="ui-content-grid">
        {variantColorRows.map(({ variant, colors }) => <article className="ui-content-card" key={variant.id}>
          <span>{variant.name}</span>
          <h3>{colors.join(" · ")}</h3>
          <p>{variant.featureSummary}</p>
          <small>Checked {variant.checkedAt} · <a href={variant.sourceUrl} target="_blank" rel="noreferrer">{variant.sourceLabel}</a></small>
        </article>)}
      </div>
    </section>}

    {sharedOrUnmappedColors.length > 0 && variantColorRows.length > 0 && <section className="section split" aria-labelledby="unmapped-colors-heading">
      <div>
        <span className="section-kicker">Mapping caveat</span>
        <h2 id="unmapped-colors-heading">Some model colors are not assigned to a verified trim</h2>
        <p>{sharedOrUnmappedColors.join(", ")} {sharedOrUnmappedColors.length === 1 ? "is" : "are"} present in the model-level color record but not assigned to one of the verified trim records. MotoIndex keeps that uncertainty visible rather than guessing the trim.</p>
      </div>
      <div className="info-card">
        <h3>Confirm before reserving</h3>
        <ul className="checklist">
          <li>Exact variant or trim name</li>
          <li>Official paint/color name</li>
          <li>Model year or model code</li>
          <li>Branch stock and unit availability</li>
          <li>Whether accessories or graphics are factory equipment</li>
        </ul>
      </div>
    </section>}

    <section className="section split" aria-labelledby="color-buying-checks">
      <div>
        <span className="section-kicker">Dealer-stock check</span>
        <h2 id="color-buying-checks">A listed color is not a stock guarantee</h2>
        <p>Manufacturer and model records describe available paint choices, but branch inventory changes. Ask the dealer to identify the exact unit, variant and model year before choosing based on color.</p>
        <p>For metallic, pearl and matte finishes, inspect the actual motorcycle when possible. Screen photos and generated swatches are not reliable enough to represent the finish precisely.</p>
      </div>
      <div className="info-card">
        <h3>Primary model reference</h3>
        <p>{model.sourceLabel}</p>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open source reference →</a>
        <small>Checked {model.verifiedAt}</small>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} color FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Compare the color with the exact motorcycle variant"
        description="Return to the full model guide for price, specifications, variant equipment, rider fit, ownership and financing."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href={`${modelPath}#price`}>Compare price and variants</Link>
      </CTAGroup>
    </section>
  </main>;
}

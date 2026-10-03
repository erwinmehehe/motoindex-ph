import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { specsIntentLandingProfile, specsIntentLandingProfiles } from "@/lib/modelSpecsLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return specsIntentLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = specsIntentLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/specs`,
    index: isIndexableModel(model)
  });
}

export default async function ModelSpecsPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = specsIntentLandingProfile(model.id);
  if (!profile || !isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/specs`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const powerToWeight = model.curbWeightKg > 0 ? (model.powerHp / model.curbWeightKg) * 100 : 0;

  const faqs: FaqItem[] = [
    {
      question: `What are the ${modelName} specifications?`,
      answer: `MotoIndex currently records a ${model.engineCc} cc engine, ${model.powerHp} hp, ${model.torqueNm} Nm, ${model.curbWeightKg} kg curb weight, ${model.seatHeightMm} mm seat, ${model.fuelTankL} L fuel tank, ${model.frontTire} front tire and ${model.rearTire} rear tire for this model.`
    },
    {
      question: `How much does the ${modelName} weigh?`,
      answer: `Recorded curb weight is ${model.curbWeightKg} kg. Curb weight is more useful than engine size alone for parking, low-speed handling and rider confidence.`
    },
    {
      question: `What is the ${modelName} seat height?`,
      answer: `Recorded seat height is ${model.seatHeightMm} mm. Seat width, suspension sag, footwear and rider technique can change how easy it feels to reach the ground.`
    },
    {
      question: `What tire sizes does the ${modelName} use?`,
      answer: `The stock MotoIndex record lists ${model.frontTire} at the front and ${model.rearTire} at the rear. Confirm the exact model year and tire specification before buying replacement tires.`
    },
    {
      question: `Does the ${modelName} have ABS?`,
      answer: `The current MotoIndex braking record is “${model.abs}”. Variant equipment can differ, so verify the exact unit before purchase.`
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
      category: model.category
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

  const specRows = [
    ["Engine", `${model.engineCc} cc`],
    ["Power", `${model.powerHp} hp`],
    ["Torque", `${model.torqueNm} Nm`],
    ["Transmission", model.transmission || "Not listed"],
    ["Curb weight", `${model.curbWeightKg} kg`],
    ["Seat height", `${model.seatHeightMm} mm`],
    ["Fuel tank", `${model.fuelTankL} L`],
    ["Ground clearance", typeof model.groundClearanceMm === "number" ? `${model.groundClearanceMm} mm` : "Not listed"],
    ["Front tire", model.frontTire],
    ["Rear tire", model.rearTire],
    ["Brakes / ABS", model.abs],
    ["Category", model.category],
    ["Generation", model.generation]
  ];

  return <main className="shell">
    <JsonLd data={[webPageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: modelPath },
      { label: "Specs" }
    ]} />

    <PageHero
      kicker="Technical specifications"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#spec-sheet">View spec sheet</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Engine", value: `${model.engineCc} cc`, note: `${model.powerHp} hp · ${model.torqueNm} Nm` },
      { label: "Curb weight", value: `${model.curbWeightKg} kg`, note: `${powerToWeight.toFixed(1)} hp per 100 kg` },
      { label: "Seat height", value: `${model.seatHeightMm} mm`, note: "Check rider fit in person" },
      { label: "Fuel tank", value: `${model.fuelTankL} L`, note: typeof model.groundClearanceMm === "number" ? `${model.groundClearanceMm} mm ground clearance` : "Ground clearance not listed" }
    ]} />

    <section className="section" id="spec-sheet" aria-labelledby="spec-sheet-heading">
      <SectionHeader
        kicker="Specification sheet"
        titleId="spec-sheet-heading"
        title={`${modelName} technical specifications`}
        description="MotoIndex keeps this page focused on the technical record. Price, colors, financing, availability and ownership research stay on their dedicated or main model pages."
      />
      <div className="spec-table">
        {specRows.map(([label, value]) => <div className="spec-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
      </div>
    </section>

    <section className="section" aria-labelledby="spec-context-heading">
      <SectionHeader
        kicker="How to read the numbers"
        titleId="spec-context-heading"
        title="Which specifications matter most in real use?"
        description="A specification is useful when it changes fit, handling, range, replacement-part choice or the kind of riding the motorcycle suits."
      />
      <div className="ui-content-grid">
        <article className="ui-content-card"><span>Fit</span><h3>Seat height + curb weight</h3><p>{model.seatHeightMm} mm seat height and {model.curbWeightKg} kg curb weight should be considered together. Width, suspension sag and technique affect actual reach.</p></article>
        <article className="ui-content-card"><span>Performance</span><h3>Power + torque + weight</h3><p>{model.powerHp} hp and {model.torqueNm} Nm describe engine output, while the {model.curbWeightKg} kg curb weight changes how that output feels in acceleration and low-speed handling.</p></article>
        <article className="ui-content-card"><span>Range</span><h3>Fuel tank</h3><p>The {model.fuelTankL} L tank tells you capacity, not real-world range by itself. Fuel consumption, traffic, load and riding style still matter.</p></article>
        <article className="ui-content-card"><span>Consumables</span><h3>Stock tire sizes</h3><p>{model.frontTire} front and {model.rearTire} rear are the stock-size references stored by MotoIndex. Match the exact model year before buying replacements.</p></article>
      </div>
    </section>

    <section className="section split" aria-labelledby="source-heading">
      <div>
        <span className="section-kicker">Specification source</span>
        <h2 id="source-heading">Specifications stay tied to the checked model record</h2>
        <p>MotoIndex does not merge specifications from different generations just because the model name is similar. Use the generation and source date below when comparing another website, dealer listing or owner manual.</p>
      </div>
      <div className="info-card">
        <h3>{model.sourceLabel}</h3>
        <p>Generation: {model.generation}</p>
        <p>Checked: {model.verifiedAt}</p>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open source reference →</a>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} specs FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Use the main model guide for the buying decision"
        description="Technical specifications are only one part of the decision. Continue to current price, colors, financing, rider fit, ownership and alternatives on the main model page."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href={{ pathname: "/compare", query: { make: model.makeSlug } }}>Compare {model.make} motorcycles</Link>
      </CTAGroup>
    </section>
  </main>;
}

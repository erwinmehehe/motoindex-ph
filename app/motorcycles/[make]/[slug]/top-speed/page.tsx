import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { topSpeedLandingProfile, topSpeedLandingProfiles } from "@/lib/modelTopSpeedLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";

const mph = (kph: number) => Math.round(kph * 0.621371);

export function generateStaticParams() {
  return topSpeedLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = topSpeedLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/top-speed`,
    index: isIndexableModel(model)
  });
}

export default async function ModelTopSpeedPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = topSpeedLandingProfile(model.id);
  if (!profile || !isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/top-speed`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const powerToWeight = model.curbWeightKg > 0 ? (model.powerHp / model.curbWeightKg) * 100 : 0;

  const faqs: FaqItem[] = [
    {
      question: `What is the ${modelName} top speed?`,
      answer: profile.answer
    },
    {
      question: `Is ${profile.observedTopSpeedKph} km/h the official ${modelName} top speed?`,
      answer: `No. MotoIndex labels ${profile.observedTopSpeedKph} km/h as ${profile.evidenceLabel.toLowerCase()} from the cited evidence. It should not be presented as a manufacturer-guaranteed result unless the manufacturer explicitly publishes that figure.`
    },
    {
      question: `Why can ${modelName} top-speed results differ?`,
      answer: "Rider size and tuck, wind, altitude, road gradient, tire pressure and condition, gearing, model year, ECU calibration, speedometer error and GPS/test method can all change a maximum-speed result."
    },
    {
      question: `Does horsepower alone determine the ${modelName} top speed?`,
      answer: `No. The ${modelName} is listed at ${model.powerHp} hp, but maximum speed also depends heavily on aerodynamic drag, gearing, rev limits, available run length and electronic restrictions.`
    },
    {
      question: "Should top speed be tested on public roads?",
      answer: "No. Maximum-speed testing requires a closed course or controlled test environment with appropriate safety equipment and permissions. Public-road speed limits and traffic conditions still apply."
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

  return <main className="shell">
    <JsonLd data={[webPageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: modelPath },
      { label: "Top speed" }
    ]} />

    <PageHero
      kicker="Performance evidence"
      title={profile.heading}
      description={profile.answer}
      actions={<CTAGroup>
        <a className="button" href="#evidence">See the evidence</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Observed / reported", value: `${profile.observedTopSpeedKph} km/h`, note: `≈ ${mph(profile.observedTopSpeedKph)} mph` },
      { label: "Evidence type", value: profile.evidenceLabel, note: "Not automatically an official manufacturer claim" },
      { label: "Published power", value: `${model.powerHp} hp`, note: `${powerToWeight.toFixed(1)} hp per 100 kg` },
      { label: "Evidence checked", value: profile.checkedAt, note: profile.sourceLabel }
    ]} />

    <section className="section" id="evidence" aria-labelledby="top-speed-evidence-heading">
      <SectionHeader
        kicker="What the number means"
        titleId="top-speed-evidence-heading"
        title={`${profile.observedTopSpeedKph} km/h is evidence, not a universal guarantee`}
        description="MotoIndex separates a measured or reported performance result from the manufacturer's normal technical specifications."
      />
      <div className="info-card">
        <h3>{profile.sourceLabel}</h3>
        <p>{profile.answer}</p>
        <p>{profile.caution}</p>
        <a className="text-link" href={profile.sourceUrl} target="_blank" rel="noreferrer">Open performance reference →</a>
      </div>
    </section>

    <section className="section" aria-labelledby="top-speed-factors-heading">
      <SectionHeader
        kicker="Why results vary"
        titleId="top-speed-factors-heading"
        title="What changes a motorcycle top-speed result?"
        description="A single dashboard screenshot is not enough. The result only becomes useful when the motorcycle, test method and conditions are clear."
      />
      <div className="ui-content-grid">
        <article className="ui-content-card"><span>Aerodynamics</span><h3>Rider tuck and wind</h3><p>At high speed, aerodynamic drag dominates. A smaller rider in a full tuck can record a different result from an upright rider on the same motorcycle.</p></article>
        <article className="ui-content-card"><span>Drivetrain</span><h3>Gearing and rev limit</h3><p>Final-drive gearing, ECU limits and the engine's usable rev range determine whether the bike is power-limited, gearing-limited or electronically limited.</p></article>
        <article className="ui-content-card"><span>Measurement</span><h3>GPS vs speedometer</h3><p>Dashboard readings can differ from true road speed. Instrumented or GPS-backed testing is more useful than an isolated indicated maximum.</p></article>
        <article className="ui-content-card"><span>Conditions</span><h3>Road, altitude and load</h3><p>Gradient, wind direction, altitude, rider mass, tire pressure and available run length can materially change the measured result.</p></article>
      </div>
    </section>

    <section className="section split" aria-labelledby="model-context-heading">
      <div>
        <span className="section-kicker">Model context</span>
        <h2 id="model-context-heading">{modelName} specifications that affect performance</h2>
        <p>The MotoIndex record lists a {model.engineCc} cc engine, {model.powerHp} hp, {model.torqueNm} Nm and {model.curbWeightKg} kg curb weight. Those figures help explain acceleration and power-to-weight, but they do not independently prove maximum speed.</p>
      </div>
      <div className="info-card">
        <h3>Stock specification context</h3>
        <ul className="checklist">
          <li>{model.engineCc} cc engine</li>
          <li>{model.powerHp} hp · {model.torqueNm} Nm</li>
          <li>{model.curbWeightKg} kg curb weight</li>
          <li>{model.transmission || "Transmission not listed"}</li>
          <li>{model.frontTire} front · {model.rearTire} rear</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="generation-check-heading">
      <SectionHeader
        kicker="Generation check"
        titleId="generation-check-heading"
        title="Match a top-speed claim to the exact model year"
        description="Motorcycle names can stay the same while gearing, aerodynamics, electronics, emissions calibration and engine output change."
      />
      <p className="entity-lede">{profile.caution}</p>
      <p className="entity-section-note">MotoIndex model context: {model.generation} · {model.marketStatus === "uncertain" ? "Philippine availability to verify" : model.marketStatus === "previous" ? "previous generation" : "current model record"}.</p>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} top-speed FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Top speed is only one part of the motorcycle"
        description="Return to the full model guide for Philippine price, specifications, rider fit, tires, ownership costs, variants and alternatives."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href="/compare">Compare motorcycles</Link>
      </CTAGroup>
    </section>
  </main>;
}

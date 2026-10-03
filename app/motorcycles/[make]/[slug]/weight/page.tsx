import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel, publicMotorcycles } from "@/lib/data";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { median } from "@/lib/researchData";
import { weightIntentLandingProfile, weightIntentLandingProfiles } from "@/lib/modelWeightLandingPages";

export function generateStaticParams() {
  return weightIntentLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = weightIntentLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/weight`,
    index: isIndexableModel(model)
  });
}

export default async function ModelWeightPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = weightIntentLandingProfile(model.id);
  if (!profile) permanentRedirect(`${modelPath}#rider-fit`);
  if (!isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/weight`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const pounds = Math.round(model.curbWeightKg * 2.2046226218);
  const currentMedian = Math.round(median(publicMotorcycles.map((item) => item.curbWeightKg)));
  const delta = model.curbWeightKg - currentMedian;
  const nearby = [...publicMotorcycles]
    .filter((item) => item.id !== model.id)
    .sort((a, b) => Math.abs(a.curbWeightKg - model.curbWeightKg) - Math.abs(b.curbWeightKg - model.curbWeightKg))
    .slice(0, 5);

  const faqs: FaqItem[] = [
    {
      question: `How much does the ${modelName} weigh?`,
      answer: `MotoIndex records ${model.curbWeightKg} kg, about ${pounds} lb, as the published curb-weight figure for this model. Always match the figure to the exact model year and specification source.`
    },
    {
      question: `Is ${model.curbWeightKg} kg the dry weight of the ${modelName}?`,
      answer: "No. MotoIndex stores this value as curb weight based on the checked model record. Manufacturers can define curb/wet/running mass differently, so do not substitute it for dry weight or payload capacity."
    },
    {
      question: `How does ${modelName} weight affect low-speed handling?`,
      answer: `Curb weight changes how much mass you manage while parking, reversing, balancing at stops and recovering from a lean. Weight distribution, seat height, steering geometry and rider technique also matter, so ${model.curbWeightKg} kg alone is not a handling score.`
    },
    {
      question: `Does ${model.curbWeightKg} kg tell me how much the ${modelName} can carry?`,
      answer: "No. Curb weight describes the motorcycle, not its payload limit. Use the owner's manual or manufacturer load-limit specification for rider, passenger and luggage capacity."
    }
  ];

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: profile.heading,
    url: absoluteUrl(canonicalPath),
    description: profile.description,
    about: {
      "@type": "Product",
      name: modelName,
      brand: { "@type": "Brand", name: model.make },
      weight: { "@type": "QuantitativeValue", value: model.curbWeightKg, unitCode: "KGM" }
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
    <JsonLd data={[pageSchema, faqSchema]} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: modelPath },
      { label: "Weight" }
    ]} />

    <PageHero
      kicker="Motorcycle weight guide"
      title={profile.heading}
      description={`The checked model record lists ${model.curbWeightKg} kg curb weight. Use that number with seat height and balance context rather than treating motorcycle weight as a standalone quality score.`}
      actions={<CTAGroup>
        <a className="button" href="#weight-context">See weight context</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Curb weight", value: `${model.curbWeightKg} kg`, note: "Published model record" },
      { label: "Pounds", value: `${pounds} lb`, note: "Metric conversion" },
      { label: "Seat height", value: `${model.seatHeightMm} mm`, note: "Weight and reach interact at stops" },
      { label: "Vs current median", value: `${delta >= 0 ? "+" : ""}${delta} kg`, note: `Current MotoIndex median: ${currentMedian} kg` }
    ]} />

    <section id="weight-context" className="section split" aria-labelledby="weight-context-heading">
      <div>
        <span className="section-kicker">What the number means</span>
        <h2 id="weight-context-heading">Curb weight matters most when you have to manage the motorcycle</h2>
        <p>Parking, reversing, pushing the bike, stop-go traffic and catching a small lean are situations where motorcycle mass is easy to notice. Once moving, chassis balance, geometry, suspension and weight distribution change how that mass feels.</p>
        <p>The current MotoIndex motorcycle dataset has a median curb weight of {currentMedian} kg. The {modelName} is {Math.abs(delta)} kg {delta >= 0 ? "above" : "below"} that dataset median. This is descriptive context, not a value or handling ranking.</p>
      </div>
      <div className="info-card">
        <h3>Do not confuse these measurements</h3>
        <ul className="checklist">
          <li>Curb/wet/running weight: motorcycle prepared for use under the source's definition.</li>
          <li>Dry weight: excludes some or all operating fluids depending on the source.</li>
          <li>Payload/load limit: allowable rider, passenger and luggage load.</li>
          <li>GVWR: maximum total loaded vehicle weight where published.</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="nearby-weight-heading">
      <SectionHeader
        kicker="Current-market context"
        titleId="nearby-weight-heading"
        title="Motorcycles with nearby curb weights"
        description="These are the closest current MotoIndex records by published curb weight. They are context points, not recommended alternatives."
      />
      <DataTable label="Current motorcycles with curb weights near this model">
        <div className="head" role="row"><span>Motorcycle</span><span>Weight</span><span>Difference</span><span>Seat</span><span>Engine</span></div>
        {nearby.map((item) => <Link role="row" href={`/motorcycles/${item.makeSlug}/${item.slug}`} key={item.id}>
          <strong>{item.make} {item.model}</strong>
          <span>{item.curbWeightKg} kg</span>
          <span>{item.curbWeightKg - model.curbWeightKg >= 0 ? "+" : ""}{item.curbWeightKg - model.curbWeightKg} kg</span>
          <span>{item.seatHeightMm} mm</span>
          <span>{item.engineCc} cc →</span>
        </Link>)}
      </DataTable>
    </section>

    <section className="section split" aria-labelledby="weight-fit-heading">
      <div>
        <span className="section-kicker">Rider-fit connection</span>
        <h2 id="weight-fit-heading">Seat height can change how manageable the same weight feels</h2>
        <p>A lower seat can make it easier to put a foot down, while a taller or wider seat can reduce ground reach. That is why MotoIndex keeps {model.curbWeightKg} kg curb weight beside the {model.seatHeightMm} mm seat-height figure instead of judging fit from weight alone.</p>
        <p>Sit on the exact motorcycle where possible. Fuel level, luggage, accessories, suspension sag and passenger load can also change how the motorcycle feels at low speed.</p>
      </div>
      <div className="info-card">
        <h3>Source reference</h3>
        <p>{model.sourceLabel}</p>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open checked model source →</a>
        <small>Checked {model.verifiedAt}</small>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} weight FAQs`} items={faqs} />
    </section>

    <section className="section">
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href="/research/motorcycle-seat-height-database">Compare seat height and curb weight</Link>
      </CTAGroup>
    </section>
  </main>;
}

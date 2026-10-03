import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { RiderFitCalculator } from "@/components/RiderFitCalculator";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { forClient } from "@/lib/competitors";
import { getModel, getModelById, isIndexableModel, publicMotorcycles } from "@/lib/data";
import { median } from "@/lib/researchData";
import { seatHeightIntentLandingProfile, seatHeightIntentLandingProfiles } from "@/lib/modelSeatHeightLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return seatHeightIntentLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = seatHeightIntentLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/seat-height`,
    index: isIndexableModel(model)
  });
}

export default async function ModelSeatHeightPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = seatHeightIntentLandingProfile(model.id);
  if (!profile) permanentRedirect(`${modelPath}#rider-fit`);
  if (!isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/seat-height`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const seatInches = model.seatHeightMm / 25.4;
  const medianSeat = Math.round(median(publicMotorcycles.map((item) => item.seatHeightMm)));
  const delta = model.seatHeightMm - medianSeat;
  const nearby = [...publicMotorcycles]
    .filter((item) => item.id !== model.id)
    .sort((a, b) => Math.abs(a.seatHeightMm - model.seatHeightMm) - Math.abs(b.seatHeightMm - model.seatHeightMm))
    .slice(0, 5);

  const faqs: FaqItem[] = [
    {
      question: `What is the ${modelName} seat height?`,
      answer: `The checked MotoIndex model record lists ${model.seatHeightMm} mm, about ${seatInches.toFixed(1)} inches, for the ${modelName}. Match this figure to the exact model year and trim before purchase.`
    },
    {
      question: `Is a ${model.seatHeightMm} mm seat height suitable for a short rider?`,
      answer: "Seat height alone cannot determine fit. Inseam, seat width, suspension sag, footwear, curb weight and riding technique all affect ground reach. Use the calculator on this page, then sit on the exact motorcycle if possible."
    },
    {
      question: `Does the ${modelName} curb weight affect rider fit?`,
      answer: `Yes. The ${modelName} is listed at ${model.curbWeightKg} kg curb weight. Weight does not change the published seat height, but it can affect confidence while balancing, parking, reversing and stopping on uneven ground.`
    },
    {
      question: "Is seat height the same as ground clearance?",
      answer: "No. Seat height measures the seat's published height from the ground; ground clearance measures the space under the motorcycle. They answer different rider-fit and obstacle-clearance questions."
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
      additionalProperty: [
        { "@type": "PropertyValue", name: "Seat height", value: `${model.seatHeightMm} mm` },
        { "@type": "PropertyValue", name: "Curb weight", value: `${model.curbWeightKg} kg` }
      ]
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
      { label: "Seat height" }
    ]} />

    <PageHero
      kicker="Rider-fit measurement"
      title={profile.heading}
      description={`The checked model record lists a ${model.seatHeightMm} mm seat. Use your inseam with curb-weight and seat-shape context before deciding whether the motorcycle will feel manageable.`}
      actions={<CTAGroup>
        <a className="button" href="#inseam-calculator">Check your inseam</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Seat height", value: `${model.seatHeightMm} mm`, note: `${seatInches.toFixed(1)} inches` },
      { label: "Curb weight", value: `${model.curbWeightKg} kg`, note: "Affects low-speed confidence" },
      { label: "Vs current median", value: `${delta >= 0 ? "+" : ""}${delta} mm`, note: `Current MotoIndex median: ${medianSeat} mm` },
      { label: "Model status", value: model.marketStatus === "uncertain" ? "Availability to verify" : model.marketStatus === "previous" ? "Previous generation" : "Current", note: model.generation }
    ]} />

    <section id="inseam-calculator" className="section" aria-labelledby="inseam-heading">
      <SectionHeader
        kicker="Interactive rider fit"
        titleId="inseam-heading"
        title={`Compare your inseam with the ${model.model} seat height`}
        description="The calculator compares published seat height with your selected inseam and adds weight/use-case context. It is a screening tool, not a guarantee that both feet will reach the ground."
      />
      <RiderFitCalculator model={forClient(model)} />
    </section>

    <section className="section split" aria-labelledby="seat-shape-context">
      <div>
        <span className="section-kicker">Why the number is not enough</span>
        <h2 id="seat-shape-context">Two motorcycles with the same seat height can feel different</h2>
        <p>Seat width and shape change how far your legs travel around the motorcycle. Suspension sag changes the loaded height, while footwear, road camber and how much of one or both feet you place down also affect reach.</p>
        <p>The {modelName} sits {Math.abs(delta)} mm {delta >= 0 ? "above" : "below"} the current MotoIndex seat-height median of {medianSeat} mm. That is market context only, not a fit verdict.</p>
      </div>
      <div className="info-card">
        <h3>Check these together</h3>
        <ul className="checklist">
          <li>Your measured inseam</li>
          <li>{model.seatHeightMm} mm published seat height</li>
          <li>{model.curbWeightKg} kg curb weight</li>
          <li>Seat width and shape</li>
          <li>Suspension sag and preload</li>
          <li>Footwear and low-speed technique</li>
        </ul>
      </div>
    </section>

    <section className="section" aria-labelledby="nearby-seat-heading">
      <SectionHeader
        kicker="Current-market context"
        titleId="nearby-seat-heading"
        title="Motorcycles with nearby seat heights"
        description="These are the closest current MotoIndex records by published seat height. They help put the number in context but are not overall recommendations."
      />
      <DataTable label="Current motorcycles with seat heights near this model">
        <div className="head" role="row"><span>Motorcycle</span><span>Seat</span><span>Difference</span><span>Weight</span><span>Engine</span></div>
        {nearby.map((item) => <Link role="row" href={`/motorcycles/${item.makeSlug}/${item.slug}`} key={item.id}>
          <strong>{item.make} {item.model}</strong>
          <span>{item.seatHeightMm} mm</span>
          <span>{item.seatHeightMm - model.seatHeightMm >= 0 ? "+" : ""}{item.seatHeightMm - model.seatHeightMm} mm</span>
          <span>{item.curbWeightKg} kg</span>
          <span>{item.engineCc} cc →</span>
        </Link>)}
      </DataTable>
    </section>

    <section className="section split" aria-labelledby="seat-source-heading">
      <div>
        <span className="section-kicker">Measurement source</span>
        <h2 id="seat-source-heading">Use the exact model-year figure</h2>
        <p>Seat height can change between generations and trims. MotoIndex ties this page to the same dated model record used by the canonical motorcycle page instead of carrying one number across every generation.</p>
        <p>For broader comparisons, the MotoIndex seat-height database sorts current motorcycles by seat height and curb weight.</p>
      </div>
      <div className="info-card">
        <h3>{model.sourceLabel}</h3>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open checked model source →</a>
        <small>Checked {model.verifiedAt}</small>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} seat-height FAQs`} items={faqs} />
    </section>

    <section className="section">
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href="/research/motorcycle-seat-height-database">Compare all seat heights</Link>
      </CTAGroup>
    </section>
  </main>;
}

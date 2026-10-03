import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel, motorcycles } from "@/lib/data";
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

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export default async function ModelSeatHeightPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = seatHeightIntentLandingProfile(model.id);
  if (!profile || !isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/seat-height`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;

  const categoryPeers = motorcycles
    .filter((item) => item.id !== model.id && isIndexableModel(item))
    .filter((item) => item.category === model.category)
    .sort((a, b) => Math.abs(a.seatHeightMm - model.seatHeightMm) - Math.abs(b.seatHeightMm - model.seatHeightMm));

  const fallbackPeers = motorcycles
    .filter((item) => item.id !== model.id && isIndexableModel(item) && !categoryPeers.some((peer) => peer.id === item.id))
    .sort((a, b) => Math.abs(a.seatHeightMm - model.seatHeightMm) - Math.abs(b.seatHeightMm - model.seatHeightMm));

  const comparisonRows = [...categoryPeers, ...fallbackPeers].slice(0, 6);
  const categorySet = [model, ...categoryPeers];
  const categoryMedianSeat = median(categorySet.map((item) => item.seatHeightMm));
  const deltaFromMedian = Math.round(model.seatHeightMm - categoryMedianSeat);
  const lowerSeatPeer = comparisonRows
    .filter((item) => item.seatHeightMm < model.seatHeightMm)
    .sort((a, b) => b.seatHeightMm - a.seatHeightMm)[0];
  const lighterPeer = comparisonRows
    .filter((item) => item.curbWeightKg < model.curbWeightKg)
    .sort((a, b) => b.curbWeightKg - a.curbWeightKg)[0];

  const faqs: FaqItem[] = [
    {
      question: `What is the ${modelName} seat height?`,
      answer: `MotoIndex stores the ${modelName} at ${model.seatHeightMm} mm seat height from the checked model record. Seat height is one fit input; seat width, suspension sag, footwear, inseam and how the rider places their feet also affect actual reach.`
    },
    {
      question: `Is ${model.seatHeightMm} mm a low seat height for the ${model.category.toLowerCase()} class?`,
      answer: `The median stored seat height in the current MotoIndex ${model.category.toLowerCase()} comparison set used on this page is ${Math.round(categoryMedianSeat)} mm. The ${modelName} is ${Math.abs(deltaFromMedian)} mm ${deltaFromMedian > 0 ? "above" : deltaFromMedian < 0 ? "below" : "equal to"} that median. This is comparison context, not a rider-fit guarantee.`
    },
    {
      question: `Can a shorter rider flat-foot the ${modelName}?`,
      answer: `Seat height alone cannot answer that reliably. The ${model.seatHeightMm} mm published figure does not capture seat width, suspension sag, inseam, boot sole thickness, body proportions or whether the rider uses one-foot-down technique. Sit on the exact motorcycle before buying when reach is important.`
    },
    {
      question: `Does motorcycle weight matter together with seat height?`,
      answer: `Yes. The ${modelName} has a stored curb weight of ${model.curbWeightKg} kg. A lower seat can help footing, but curb weight still matters when pushing, parking, reversing, making tight U-turns or catching the motorcycle from a lean.`
    },
    {
      question: "Does suspension sag reduce the effective seat height?",
      answer: "The suspension can settle under rider load, but the amount depends on spring rate, preload, rider weight and setup. MotoIndex does not convert static published seat height into a guaranteed loaded seat height without model-specific measured sag data."
    }
  ];

  const schema = [
    {
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
          { "@type": "PropertyValue", name: "Seat height", value: model.seatHeightMm, unitText: "mm" },
          { "@type": "PropertyValue", name: "Curb weight", value: model.curbWeightKg, unitText: "kg" }
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      url: absoluteUrl(`${canonicalPath}#faq`),
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer }
      }))
    }
  ];

  return <main className="shell">
    <JsonLd data={schema} />
    <Breadcrumbs items={[
      { label: "Motorcycles", href: "/motorcycles" },
      { label: model.make, href: `/motorcycles/${model.makeSlug}` },
      { label: model.model, href: modelPath },
      { label: "Seat height" }
    ]} />

    <PageHero
      kicker="Philippines rider-fit guide"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#comparison">Compare seat height</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Seat height", value: `${model.seatHeightMm} mm`, note: "Published model specification" },
      { label: "Curb weight", value: `${model.curbWeightKg} kg`, note: "Low-speed context matters" },
      { label: "Category median", value: `${Math.round(categoryMedianSeat)} mm`, note: `${categorySet.length} indexable ${model.category.toLowerCase()} records` },
      { label: "Engine", value: `${model.engineCc} cc`, note: model.category }
    ]} />

    <section className="section split" aria-labelledby="seat-height-meaning-heading">
      <div>
        <span className="section-kicker">What the number means</span>
        <h2 id="seat-height-meaning-heading">Seat height is not the same as minimum rider height or inseam</h2>
        <p>A published seat-height figure measures the motorcycle, not the rider. Two motorcycles with the same seat height can feel different because of seat width, floorboards or footpegs, suspension sag and the shape of the seat near the tank.</p>
        <p>Use the {model.seatHeightMm} mm figure as a comparison starting point. If foot reach matters, sit on the exact model with normal riding footwear and test both feet-down and one-foot-down stops.</p>
      </div>
      <div className="info-card">
        <h3>Checked model source</h3>
        <p>{model.sourceLabel}</p>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open source reference →</a>
        <small>Checked {model.verifiedAt}</small>
      </div>
    </section>

    <section className="section" id="comparison" aria-labelledby="seat-height-comparison-heading">
      <SectionHeader
        kicker="Rider-fit context"
        titleId="seat-height-comparison-heading"
        title={`How the ${model.model} seat height compares`}
        description={`The first comparison priority is other ${model.category.toLowerCase()} motorcycles. The table adds curb weight because easy footing and easy low-speed handling are not the same thing.`}
      />
      <DataTable label={`${modelName} seat-height comparison`}>
        <div className="head" role="row"><span>Motorcycle</span><span>Seat height</span><span>Curb weight</span><span>Engine</span><span>Category</span></div>
        {[model, ...comparisonRows].map((item) => <Link role="row" href={`/motorcycles/${item.makeSlug}/${item.slug}`} key={item.id}>
          <strong>{item.make} {item.model}</strong>
          <span>{item.seatHeightMm} mm</span>
          <span>{item.curbWeightKg} kg</span>
          <span>{item.engineCc} cc</span>
          <span>{item.category}</span>
        </Link>)}
      </DataTable>
      <p className="entity-section-note">This table compares published dimensions only. A lower seat does not automatically mean easier handling, and a taller seat does not automatically rule out a rider.</p>
    </section>

    <section className="section split" aria-labelledby="seat-weight-heading">
      <div>
        <span className="section-kicker">Seat height + weight</span>
        <h2 id="seat-weight-heading">Low-speed confidence depends on more than getting both feet flat</h2>
        <p>The {modelName} combines a {model.seatHeightMm} mm seat with {model.curbWeightKg} kg curb weight. That pairing matters most during parking, reversing, tight turns, uneven stops and slow traffic.</p>
        <p>{lowerSeatPeer ? `${lowerSeatPeer.make} ${lowerSeatPeer.model} has a nearby lower published seat at ${lowerSeatPeer.seatHeightMm} mm, so it is useful if seat height is your main comparison variable.` : "The current comparison set does not provide a clearly lower nearby seat, so an in-person fit test is especially important."}</p>
      </div>
      <div className="info-card">
        <h3>Weight can change the decision</h3>
        <p>{lighterPeer ? `${lighterPeer.make} ${lighterPeer.model} is lighter in the nearby comparison set at ${lighterPeer.curbWeightKg} kg. Compare both numbers rather than choosing only from seat height.` : "No nearby comparison model is materially lighter in the current set. Test the exact motorcycle at walking pace before deciding from dimensions alone."}</p>
        <Link className="text-link" href="/recommendations/best-motorcycles-for-short-riders">Compare motorcycles by published seat height →</Link>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} seat-height FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Use seat height with the full motorcycle specification"
        description="Return to the model page for price, weight, tires, ownership, variants and the interactive rider-fit calculator."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href="/recommendations/best-motorcycles-for-short-riders">Compare low-seat motorcycles</Link>
      </CTAGroup>
    </section>
  </main>;
}

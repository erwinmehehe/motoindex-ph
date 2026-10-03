import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel, motorcycles } from "@/lib/data";
import { weightIntentLandingProfile, weightIntentLandingProfiles } from "@/lib/modelWeightLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";

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

function median(values: number[]) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export default async function ModelWeightPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = weightIntentLandingProfile(model.id);
  if (!profile || !isIndexableModel(model)) return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/weight`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const powerToWeight = model.curbWeightKg > 0 ? (model.powerHp / model.curbWeightKg) * 100 : 0;

  const peers = motorcycles
    .filter((item) => item.id !== model.id && isIndexableModel(item))
    .filter((item) => item.engineCc >= 600 && item.engineCc <= 700)
    .sort((a, b) => Math.abs(a.curbWeightKg - model.curbWeightKg) - Math.abs(b.curbWeightKg - model.curbWeightKg));

  const peerSet = [model, ...peers];
  const peerMedianWeight = median(peerSet.map((item) => item.curbWeightKg));
  const deltaFromMedian = Math.round(model.curbWeightKg - peerMedianWeight);
  const lightest = [...peerSet].sort((a, b) => a.curbWeightKg - b.curbWeightKg)[0];
  const heaviest = [...peerSet].sort((a, b) => b.curbWeightKg - a.curbWeightKg)[0];
  const comparisonRows = peers.slice(0, 6);

  const faqs: FaqItem[] = [
    {
      question: `How much does the ${modelName} weigh?`,
      answer: `MotoIndex stores the ${modelName} at ${model.curbWeightKg} kg curb weight from the checked model specification. Keep the source definition in mind: manufacturers can use slightly different kerb/curb or ready-to-ride conventions.`
    },
    {
      question: `Is ${model.curbWeightKg} kg heavy for a motorcycle?`,
      answer: `Within the current MotoIndex 600–700cc comparison set used on this page, the median curb weight is ${Math.round(peerMedianWeight)} kg. The ${modelName} is ${Math.abs(deltaFromMedian)} kg ${deltaFromMedian >= 0 ? "above" : "below"} that median. That is useful context, but category, steering geometry, center of mass and rider technique also change how a motorcycle feels.`
    },
    {
      question: `Does the ${modelName} seat height make the weight easier to manage?`,
      answer: `The stored seat height is ${model.seatHeightMm} mm. Lower seat height can make it easier for some riders to get a secure foot down, but it does not remove the mass during pushing, parking, U-turns or recovery from a lean.`
    },
    {
      question: `What is the ${modelName} power-to-weight ratio?`,
      answer: `Using the stored ${model.powerHp} hp output and ${model.curbWeightKg} kg curb weight, the simple MotoIndex calculation is about ${powerToWeight.toFixed(1)} hp per 100 kg. This is a planning comparison, not a measured acceleration result.`
    },
    {
      question: `Does curb weight include the rider, luggage or accessories?`,
      answer: "No. MotoIndex does not add rider, passenger, luggage, crash bars, top boxes or aftermarket accessories to the stored curb-weight figure. Added equipment can materially change the total mass you manage at low speed."
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
        weight: {
          "@type": "QuantitativeValue",
          value: model.curbWeightKg,
          unitCode: "KGM"
        }
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
      { label: "Weight" }
    ]} />

    <PageHero
      kicker="Philippines weight guide"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#comparison">Compare weight</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Curb weight", value: `${model.curbWeightKg} kg`, note: "Stored model specification" },
      { label: "Seat height", value: `${model.seatHeightMm} mm`, note: "Footing matters at low speed" },
      { label: "Power-to-weight", value: `${powerToWeight.toFixed(1)} hp / 100 kg`, note: "Simple spec-based comparison" },
      { label: "650-class median", value: `${Math.round(peerMedianWeight)} kg`, note: `${peerSet.length} current/indexable 600–700cc records` }
    ]} />

    <section className="section split" aria-labelledby="weight-definition-heading">
      <div>
        <span className="section-kicker">What the number means</span>
        <h2 id="weight-definition-heading">Curb weight is more useful than quoting “dry weight” without context</h2>
        <p>MotoIndex uses the stored curb-weight value for this model because it is closer to the motorcycle as prepared for normal use than a stripped dry-weight figure. Manufacturer conventions can still differ, so compare figures from consistent specification sources whenever possible.</p>
        <p>The number does not include your body weight, passenger, luggage or accessories. A top box, crash protection and touring equipment can add meaningful mass high or far from the bike's center.</p>
      </div>
      <div className="info-card">
        <h3>Checked model source</h3>
        <p>{model.sourceLabel}</p>
        <a className="text-link" href={model.sourceUrl} target="_blank" rel="noreferrer">Open source reference →</a>
        <small>Checked {model.verifiedAt}</small>
      </div>
    </section>

    <section className="section" id="comparison" aria-labelledby="weight-comparison-heading">
      <SectionHeader
        kicker="600–700cc context"
        titleId="weight-comparison-heading"
        title={`How the ${model.model} weight compares with nearby-displacement motorcycles`}
        description="This is a specification comparison, not a handling ranking. Different categories distribute their mass differently."
      />
      <DataTable label={`${modelName} curb-weight comparison`}>
        <div className="head" role="row"><span>Motorcycle</span><span>Engine</span><span>Curb weight</span><span>Seat</span><span>Power / 100 kg</span></div>
        {[model, ...comparisonRows].map((item) => {
          const ratio = item.curbWeightKg > 0 ? (item.powerHp / item.curbWeightKg) * 100 : 0;
          return <Link role="row" href={`/motorcycles/${item.makeSlug}/${item.slug}`} key={item.id}>
            <strong>{item.make} {item.model}<small>{item.category}</small></strong>
            <span>{item.engineCc} cc</span>
            <span>{item.curbWeightKg} kg</span>
            <span>{item.seatHeightMm} mm</span>
            <span>{ratio.toFixed(1)} hp</span>
          </Link>;
        })}
      </DataTable>
      <p className="entity-section-note">In this comparison set, {lightest.make} {lightest.model} is the lightest at {lightest.curbWeightKg} kg and {heaviest.make} {heaviest.model} is the heaviest at {heaviest.curbWeightKg} kg. Those figures alone do not determine low-speed feel or cornering behavior.</p>
    </section>

    <section className="section split" aria-labelledby="weight-rider-heading">
      <div>
        <span className="section-kicker">Rider-use context</span>
        <h2 id="weight-rider-heading">Where motorcycle weight matters most in everyday use</h2>
        <p>Mass is most noticeable when pushing the motorcycle, backing out of parking, making tight U-turns, balancing on uneven ground or catching a lean at walking pace. Once moving, steering geometry, suspension, tire profile and center of mass strongly influence how heavy the bike feels.</p>
        <p>The {model.seatHeightMm} mm seat is part of the same decision. Secure footing can make a heavier motorcycle easier to manage for one rider even when another motorcycle is lighter on paper.</p>
      </div>
      <div className="info-card">
        <h3>Do not infer payload capacity</h3>
        <p>Curb weight is not the same as maximum payload or gross vehicle weight rating. MotoIndex does not calculate passenger/luggage capacity from curb weight when an official load limit is not stored.</p>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} weight FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Use weight with the full motorcycle specification"
        description="Return to the main model page for price, dimensions, tires, ownership, variants and broader fit context."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href={`${modelPath}/specs`}>Open technical specs</Link>
      </CTAGroup>
    </section>
  </main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { FuelRangeCalculator } from "@/components/FuelRangeCalculator";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { getModel, getModelById, isIndexableModel } from "@/lib/data";
import { efficiencyEvidence, fuelCostForDistance, planningRangeKm, theoreticalRangeKm } from "@/lib/efficiency";
import { fuelConsumptionLandingProfile, fuelConsumptionLandingProfiles } from "@/lib/modelFuelConsumptionLandingPages";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

const planningFuelPricePhp = 65;

export function generateStaticParams() {
  return fuelConsumptionLandingProfiles.flatMap((profile) => {
    const model = getModelById(profile.modelId);
    return model ? [{ make: model.makeSlug, slug: model.slug }] : [];
  });
}

export async function generateMetadata({ params }: { params: Promise<{ make: string; slug: string }> }): Promise<Metadata> {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return {};
  const profile = fuelConsumptionLandingProfile(model.id);
  if (!profile) return {};
  return pageMetadata({
    title: profile.title,
    description: profile.description,
    path: `/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption`,
    index: isIndexableModel(model) && Boolean(model.fuelConsumptionKmL)
  });
}

export default async function ModelFuelConsumptionPage({ params }: { params: Promise<{ make: string; slug: string }> }) {
  const { make, slug } = await params;
  const model = getModel(make, slug);
  if (!model) return notFound();
  const profile = fuelConsumptionLandingProfile(model.id);
  const efficiency = efficiencyEvidence(model);
  if (!profile || !isIndexableModel(model) || efficiency.status !== "listed") return notFound();

  const modelName = `${model.make} ${model.model}`;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption`;
  const modelPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const fullTankRange = theoreticalRangeKm(model);
  const planningRange = planningRangeKm(model);
  const monthlyScenarios = [500, 1000, 1500].map((distanceKm) => ({
    distanceKm,
    liters: distanceKm / efficiency.kmPerL,
    costPhp: fuelCostForDistance(model, distanceKm, planningFuelPricePhp)
  }));

  const evidenceContext = model.id === "honda-click-125i"
    ? "Honda's 2026 launch material cites 50.3 km/L, while the current specification PDF distinguishes 49.3 km/L for Standard and 50.3 km/L for Smart Edition under WMTC. Match the efficiency figure to the exact variant."
    : model.id === "honda-tmx125-alpha"
      ? "Honda's TMX125 Alpha reference states 62.5 km/L at a constant 45 km/h. That test condition is different from stop-and-go city riding, loaded delivery work or mixed-speed commuting."
      : `The stored ${efficiency.kmPerL} km/L figure is a published model reference. Real-world consumption can differ because the test cycle and riding conditions are not identical to daily use.`;

  const faqs: FaqItem[] = [
    {
      question: `What is the ${modelName} fuel consumption?`,
      answer: `MotoIndex currently stores a listed figure of ${efficiency.kmPerL} km/L for the ${modelName}. ${evidenceContext}`
    },
    {
      question: `How far can the ${modelName} travel on a full tank?`,
      answer: `At ${efficiency.kmPerL} km/L and a ${model.fuelTankL} L tank, the simple theoretical calculation is about ${fullTankRange} km. MotoIndex also shows an 85% planning range of about ${planningRange} km to avoid treating the full theoretical number as a guaranteed usable range.`
    },
    {
      question: `How much fuel does the ${modelName} use per 1,000 km?`,
      answer: `At the listed ${efficiency.kmPerL} km/L basis, 1,000 km requires about ${(1000 / efficiency.kmPerL).toFixed(1)} liters. Actual use can move higher or lower with traffic, speed, load, tire pressure, weather and maintenance.`
    },
    {
      question: `Why can real-world ${modelName} fuel economy differ from the published figure?`,
      answer: "Published consumption is measured under a defined test method or stated condition. Congestion, repeated acceleration, passenger/cargo load, tire pressure, elevation, wind, road surface, engine condition and riding speed can materially change the result."
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
      { label: "Fuel consumption" }
    ]} />

    <PageHero
      kicker="Philippines fuel-economy guide"
      title={profile.heading}
      description={profile.intro}
      actions={<CTAGroup>
        <a className="button" href="#calculator">Estimate fuel cost</a>
        <Link className="button secondary" href={modelPath}>Full {model.model} guide</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      { label: "Listed economy", value: `${efficiency.kmPerL} km/L`, note: "Published/model-specific figure" },
      { label: "Fuel tank", value: `${model.fuelTankL} L`, note: "Published tank capacity" },
      { label: "Theoretical range", value: `${fullTankRange} km`, note: "Tank × listed economy" },
      { label: "85% planning range", value: `${planningRange} km`, note: "Conservative planning reference" }
    ]} />

    <section className="section" aria-labelledby="fuel-evidence-heading">
      <SectionHeader
        kicker="Evidence first"
        titleId="fuel-evidence-heading"
        title={`What the ${efficiency.kmPerL} km/L figure means`}
        description="MotoIndex keeps the published figure, its test context and the real-world caveat together instead of presenting one km/L number as a universal result."
      />
      <div className="info-card">
        <h3>{profile.sourceLabel}</h3>
        <p>{evidenceContext}</p>
        <a className="text-link" href={profile.sourceUrl} target="_blank" rel="noreferrer">Open model source →</a>
        <small>Fuel-economy evidence checked {profile.checkedAt}</small>
      </div>
    </section>

    <section className="section" id="calculator" aria-labelledby="fuel-calculator-heading">
      <SectionHeader
        kicker="Editable planning tool"
        titleId="fuel-calculator-heading"
        title={`${modelName} fuel-cost and range calculator`}
        description="Change monthly distance and fuel-price assumptions. The calculator starts from the listed model-specific economy figure, not a generic engine-size estimate."
      />
      <FuelRangeCalculator model={model} />
    </section>

    <section className="section" aria-labelledby="monthly-fuel-scenarios-heading">
      <SectionHeader
        kicker="Like-for-like scenarios"
        titleId="monthly-fuel-scenarios-heading"
        title="Fuel needed at 500, 1,000 and 1,500 km per month"
        description={`These examples use the same ${efficiency.kmPerL} km/L basis and an editable-style planning assumption of ${php(planningFuelPricePhp)}/L. The price is a scenario input, not a claim about today's pump price.`}
      />
      <StatRow items={monthlyScenarios.map((row) => ({
        label: `${row.distanceKm.toLocaleString()} km/month`,
        value: `${row.liters.toFixed(1)} L`,
        note: `${php(Math.round(row.costPhp))}/month at ${php(planningFuelPricePhp)}/L`
      }))} />
    </section>

    <section className="section" aria-labelledby="real-world-factors-heading">
      <SectionHeader
        kicker="Why actual km/L changes"
        titleId="real-world-factors-heading"
        title="What can move real-world fuel consumption?"
        description="The same motorcycle can return different economy in dense traffic, open-road cruising, passenger use or loaded work."
      />
      <div className="ui-content-grid">
        <article className="ui-content-card"><span>Traffic</span><h3>Stops and acceleration</h3><p>Repeated acceleration, idling and low-speed congestion generally use more fuel per kilometer than steady riding.</p></article>
        <article className="ui-content-card"><span>Load</span><h3>Rider, passenger and cargo</h3><p>More mass increases the work required during acceleration and climbing, especially on small-displacement motorcycles.</p></article>
        <article className="ui-content-card"><span>Mechanical</span><h3>Tires and maintenance</h3><p>Low tire pressure, dragging brakes, worn drivetrain parts, dirty filters and overdue service can reduce economy.</p></article>
        <article className="ui-content-card"><span>Route</span><h3>Speed, wind and elevation</h3><p>High cruising speed, headwinds and repeated climbs can materially change consumption compared with a test-cycle result.</p></article>
      </div>
    </section>

    <section id="faq" className="section">
      <FaqSection title={`${modelName} fuel-consumption FAQs`} items={faqs} />
    </section>

    <section className="section">
      <SectionHeader
        kicker="Continue researching"
        title="Fuel economy is only one ownership cost"
        description="Return to the main model page for Philippine price, specifications, fit, financing, tires, maintenance and ownership-cost planning."
      />
      <CTAGroup>
        <Link className="button" href={modelPath}>Open full {model.model} guide</Link>
        <Link className="button secondary" href="/tools">Fuel-cost tools</Link>
      </CTAGroup>
    </section>
  </main>;
}

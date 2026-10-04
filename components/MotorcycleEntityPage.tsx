import Link from "next/link";
import type { CSSProperties } from "react";
import type { Motorcycle } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { CompareButton } from "@/components/CompareButton";
import { SaveToShortlistButton } from "@/components/SaveToShortlistButton";
import { ShareModelButton } from "@/components/ShareModelButton";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { VariantMatrix } from "@/components/VariantMatrix";
import { PriceIntelligence } from "@/components/PriceIntelligence";
import { MarketPriceChecks } from "@/components/MarketPriceChecks";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";
import { FinancingSnapshot } from "@/components/FinancingSnapshot";
import { DealerFinancingSnapshot } from "@/components/DealerFinancingSnapshot";
import { RiderFitCalculator } from "@/components/RiderFitCalculator";
import { FuelRangeCalculator } from "@/components/FuelRangeCalculator";
import { OwnershipCostCalculator } from "@/components/OwnershipCostCalculator";
import { FitmentSummary } from "@/components/FitmentSummary";
import { ProductCard } from "@/components/ProductCard";
import { SimilarMotorcycles } from "@/components/SimilarMotorcycles";
import { CommuteSnapshot } from "@/components/CommuteSnapshot";
import { FaqSection } from "@/components/FaqSection";
import { UsedMarketSummary } from "@/components/UsedMarketSummary";
import { UsedListingTable } from "@/components/UsedListingTable";
import { UsedValueCalculator } from "@/components/UsedValueCalculator";
import { getModelById, isIndexableModel } from "@/lib/data";
import { observedMarketPriceLabel, observedMarketRange, priceChecksForModel } from "@/lib/marketChecks";
import { motorcycleOfferSchema } from "@/lib/structuredData";
import { getVerifiedVariantsForModel, variantPriceOptions } from "@/lib/variants";
import { helmetProducts, getTireProductsForModel, getTopBoxProductsForModel } from "@/lib/catalog";
import { getTopBoxFitmentsForModel } from "@/lib/topBoxFitment";
import { efficiencyEvidence } from "@/lib/efficiency";
import { brandMaintenanceGuideForModel, maintenanceForModel } from "@/lib/maintenance";
import { safetyNoticesForModel } from "@/lib/safety";
import { listingsForModel, marketSummary } from "@/lib/usedMarket";
import { usedValueCurve } from "@/lib/ownership";
import { php } from "@/lib/utils";
import { motorcycleEntityEditorial, motorcycleEntityFaqs, motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { absoluteUrl } from "@/lib/site";
import { getRenderableMedia } from "@/lib/media";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { modelAuthorityQuality } from "@/lib/modelQuality";
import { forClient } from "@/lib/competitors";
import { tireGuideHrefForModel } from "@/lib/tireSeo";
import { getModelFamilyForModel } from "@/lib/families";
import { performanceAnswerFor } from "@/lib/modelPerformance";
import { AuthorBox } from "@/components/AuthorBox";
import { authorPersonSchema } from "@/lib/author";
import { getModelGearGuide } from "@/lib/modelGearGuides";
import { OwnershipCatalogLinks } from "@/components/OwnershipCatalogLinks";
import { CTAGroup, ProductGrid as CanonicalProductGrid, SectionHeader } from "@/components/ui";
import { CanonicalIntentDepth } from "@/components/CanonicalIntentDepth";
import { canonicalIntentFaqs, modelIntentDepthProfile } from "@/lib/modelIntentDepth2026";
import { installmentLandingProfile } from "@/lib/modelIntentLandingPages";
import { colorIntentLandingProfile } from "@/lib/modelColorLandingPages";
import { topSpeedLandingProfile } from "@/lib/modelTopSpeedLandingPages";
import { specsIntentLandingProfile } from "@/lib/modelSpecsLandingPages";
import { fuelConsumptionLandingProfile } from "@/lib/modelFuelConsumptionLandingPages";
import { weightIntentLandingProfile } from "@/lib/modelWeightLandingPages";
import { seatHeightIntentLandingProfile } from "@/lib/modelSeatHeightLandingPages";
import { databaseConfigured } from "@/lib/db";
import { getVerifiedOffers } from "@/lib/persistentOffers";
import { LiveDealerInventory } from "@/components/LiveDealerInventory";

const MOTORCYCLE_ANALYTICS_CSS = `
.motorcycle-analytics-panel{margin:28px 0 18px;padding:34px;border:1px solid rgba(62,82,69,.16);border-radius:16px;background:#fff;box-shadow:0 18px 48px rgba(24,45,32,.055)}
.motorcycle-analytics-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:24px}.motorcycle-analytics-heading>div>span{color:#176b4b;font-size:9px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.motorcycle-analytics-heading h2{margin:6px 0 0;color:#132019;font-size:clamp(28px,3.2vw,40px);line-height:1;letter-spacing:-.045em}.motorcycle-analytics-heading>p{max-width:390px;margin:0;color:#5f6f65;font-size:11px;line-height:1.55}
.motorcycle-analytics-grid{display:grid;grid-template-columns:1.12fr repeat(3,1fr);gap:1px;overflow:hidden;border:1px solid rgba(62,82,69,.16);border-radius:11px;background:rgba(62,82,69,.16)}.motorcycle-analytics-metric{min-width:0;padding:22px;background:#fff}.motorcycle-analytics-metric.is-featured{background:#e8f3ed}.motorcycle-analytics-metric>span{color:#5f6f65;font-size:9px;font-weight:750;letter-spacing:.06em;text-transform:uppercase}.motorcycle-analytics-metric>strong{display:block;margin:17px 0 15px;color:#132019;font-size:27px;line-height:1;letter-spacing:-.04em;white-space:nowrap}.motorcycle-analytics-metric>strong small{color:#5f6f65;font-size:9px;font-weight:650;letter-spacing:0}.motorcycle-analytics-track{height:5px;overflow:hidden;border-radius:6px;background:#e8ece9}.motorcycle-analytics-track>i{display:block;width:var(--metric-fill);height:100%;background:#176b4b}.motorcycle-analytics-metric>p{margin:9px 0 0;color:#5f6f65;font-size:9px;line-height:1.4}
@media(max-width:900px){.motorcycle-analytics-grid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.motorcycle-analytics-panel{padding:24px 0;border-left:0;border-right:0;border-radius:0;box-shadow:none}.motorcycle-analytics-heading{align-items:flex-start;flex-direction:column;gap:10px;padding:0 2px}.motorcycle-analytics-grid{grid-template-columns:1fr}.motorcycle-analytics-metric{padding:18px 14px}.motorcycle-analytics-metric>strong{font-size:23px}}
`;

function HeroFact({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

function AnalyticsMetric({ id, label, value, unit, note, fill, featured = false }: { id: string; label: string; value: string; unit: string; note: string; fill: number; featured?: boolean }) {
  return <article className={`motorcycle-analytics-metric${featured ? " is-featured" : ""}`} data-metric={id}>
    <span>{label}</span>
    <strong>{value} <small>{unit}</small></strong>
    <div className="motorcycle-analytics-track" aria-hidden="true"><i style={{ "--metric-fill": `${Math.max(8, Math.min(fill, 100))}%` } as CSSProperties} /></div>
    <p>{note}</p>
  </article>;
}


export async function MotorcycleEntityPage({ model }: { model: Motorcycle }) {
  const currentOffers = databaseConfigured() ? await getVerifiedOffers({entityType:"motorcycle",entityId:model.id}).catch(()=>[]) : [];
  const isPrevious = model.marketStatus === "previous";
  const isDiscontinued = model.marketStatus === "discontinued";
  const isHistorical = isPrevious || isDiscontinued;
  const availabilityUncertain = model.marketStatus === "uncertain";
  const successor = model.successorId ? getModelById(model.successorId) : undefined;
  const seo = motorcycleEntitySeo(model);
  const editorial = motorcycleEntityEditorial(model);
  const performance = performanceAnswerFor(model.id);
  const range = observedMarketRange(model);
  const priceChecks = priceChecksForModel(model.id);
  const verifiedVariants = getVerifiedVariantsForModel(model.id);
  const financingPriceOptions = variantPriceOptions(model.id);
  const allColors = [...new Set([...model.colors, ...verifiedVariants.flatMap((variant) => variant.colors || [])])];
  const colorLanding = colorIntentLandingProfile(model.id);
  const topSpeedLanding = topSpeedLandingProfile(model.id);
  const specsLanding = specsIntentLandingProfile(model.id);
  const fuelConsumptionLanding = fuelConsumptionLandingProfile(model.id);
  const weightLanding = weightIntentLandingProfile(model.id);
  const seatHeightLanding = seatHeightIntentLandingProfile(model.id);
  const gearGuide = getModelGearGuide(model.id);
  const helmetCandidates = (gearGuide?.helmetIds || []).map((id) => helmetProducts.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product && product.status === "verified"));
  const tireCandidates = getTireProductsForModel(model.id).filter((p) => !isIndexableModel(model) || p.status === "verified");
  const topBoxCandidates = getTopBoxProductsForModel(model.id).filter((p) => !isIndexableModel(model) || p.status === "verified");
  const topBoxFitments = getTopBoxFitmentsForModel(model.id);
  const maintenance = maintenanceForModel(model.id);
  const brandMaintenance = brandMaintenanceGuideForModel(model);
  const safetyNotices = safetyNoticesForModel(model.id);
  const efficiency = efficiencyEvidence(model);
  const usedListings = listingsForModel(model.id);
  const usedSummary = marketSummary(model.id);
  const usedCurve = usedValueCurve(model);
  const media = getRenderableMedia("motorcycle", model.id)[0];
  const authority = modelAuthorityProfile(model.id);
  const quality = modelAuthorityQuality(model);
  const authorityComparisons = authority?.comparisonIds.map((id) => getModelById(id)).filter((item): item is Motorcycle => Boolean(item)) || [];
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const intentDepth = modelIntentDepthProfile(model.id);
  const installmentLanding = installmentLandingProfile(model.id);
  const dedicatedInstallmentHandoff = ["yamaha-aerox-v3", "yamaha-nmax-v3", "honda-click-160", "honda-pcx-160", "honda-click-125i"].includes(model.id);
  const faqs = [...motorcycleEntityFaqs(model), ...canonicalIntentFaqs(model), ...(!topSpeedLanding && performance ? [{ question: `What is the ${model.make} ${model.model} top speed?`, answer: performance.answer }] : [])];
  const offer = motorcycleOfferSchema(model, canonicalPath, isIndexableModel(model));
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${model.make} ${model.model}`,
    sku: model.id,
    url: absoluteUrl(canonicalPath),
    brand: { "@type": "Brand", name: model.make },
    category: `Motorcycle — ${model.category}`,
    description: authority ? `${authority.verdict} ${model.summary}` : model.summary,
    ...(media ? { image: [absoluteUrl(media.src)] } : {}),
    ...(offer ? { offers: offer } : {}),
    additionalProperty: [
      { "@type": "PropertyValue", name: "Engine displacement", value: `${model.engineCc} cc` },
      { "@type": "PropertyValue", name: "Power", value: `${model.powerHp} hp` },
      { "@type": "PropertyValue", name: "Torque", value: `${model.torqueNm} Nm` },
      { "@type": "PropertyValue", name: "Seat height", value: `${model.seatHeightMm} mm` },
      { "@type": "PropertyValue", name: "Curb weight", value: `${model.curbWeightKg} kg` },
      { "@type": "PropertyValue", name: "Front tire", value: model.frontTire },
      { "@type": "PropertyValue", name: "Rear tire", value: model.rearTire },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: absoluteUrl(`${canonicalPath}#faq`),
    author: { "@id": `${absoluteUrl("/authors/erwin-valles")}#person` },
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const authorSchema = {
    "@context": "https://schema.org",
    ...authorPersonSchema(),
  };
  const loanToolHref = { pathname: "/tools/motorcycle-loan-calculator", query: { price: range.from, model: `${model.make} ${model.model}` } };
  const aeroxFinanceTarget = model.id === "yamaha-aerox-v3";
  const tireGuideHref = tireGuideHrefForModel(model.id);
  const modelFamily = getModelFamilyForModel(model.id);
  const scooterClassGuide = /scooter/i.test(model.category)
    ? model.engineCc >= 115 && model.engineCc <= 130
      ? { href: "/recommendations/125cc-scooters-philippines", label: "125cc scooter comparison" }
      : model.engineCc === 155
        ? { href: "/recommendations/155cc-scooters-philippines", label: "exact 155cc scooter comparison" }
        : model.engineCc >= 140 && model.engineCc < 155
          ? { href: "/recommendations/150cc-scooters-philippines", label: "150cc-class scooter comparison" }
          : model.engineCc >= 156 && model.engineCc <= 165
            ? { href: "/recommendations/160cc-scooters-philippines", label: "160cc scooter comparison" }
            : undefined
    : undefined;
  const priceLabel = observedMarketPriceLabel(model);
  const priceRange = priceLabel.split("–");
  const powerToWeight = model.curbWeightKg > 0 ? model.powerHp / model.curbWeightKg * 100 : 0;
  const powerDensity = model.engineCc > 0 ? model.powerHp / model.engineCc * 100 : 0;

  return <article className="motorcycle-entity-page">
    <section className="motorcycle-entity-hero" id="overview">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: model.make, href: `/motorcycles/${model.makeSlug}` }, { label: model.model }]} />
        <div className="motorcycle-hero-grid">
          <div className="motorcycle-hero-copy">
            <span className="entity-kicker">Philippines model guide · {model.generation} · {model.category}{isDiscontinued ? " · discontinued" : availabilityUncertain ? " · availability to verify" : ""}</span>
            <h1>{seo.heading}</h1>
            <p className="entity-lede">{seo.intro}</p>
            <div className="motorcycle-price-lockup">
              <span>{isHistorical ? (isDiscontinued ? "Historical price reference · discontinued" : "Historical launch reference") : availabilityUncertain ? "Published PH price · availability to verify" : "Published Philippine price"}</span>
              <strong>{priceRange.length === 2 ? <><b data-price-boundary style={{ fontWeight: "inherit" }}>{priceRange[0]}</b><i data-price-separator style={{ margin: "0 .22em", color: "var(--model-muted)", fontStyle: "normal", fontWeight: 500 }}>–</i><b data-price-boundary style={{ fontWeight: "inherit" }}>{priceRange[1]}</b></> : priceLabel}</strong>
              <small>{isHistorical ? "Historical context, not a current new-bike quote." : "Final dealer pricing can vary."}</small>
            </div>
            <CTAGroup className="entity-hero-actions">
              {!isHistorical && !availabilityUncertain && <Link className="button" href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer price</Link>}
              <a className={isHistorical ? "button" : "button ghost on-light"} href={isHistorical ? "#used" : "#installment"}>{isHistorical ? "Check used value" : "Estimate monthly"}</a>
            </CTAGroup>
            <div className="entity-hero-utilities"><SaveToShortlistButton modelId={model.id} /><CompareButton modelId={model.id} /><ShareModelButton label="Share" /></div>
            <Freshness model={model} />
          </div>
          <div className="motorcycle-hero-visual">
            <EntityMedia entityType="motorcycle" entityId={model.id} className="motorcycle-hero-media" priority showCredit={false} sizes="(max-width: 900px) 100vw, 48vw" fallback={<EntityVerificationFallback brand={model.make} model={model.model} className="authority-media-fallback" />} />
            <div className="motorcycle-hero-facts">
              <HeroFact label="Engine" value={`${model.engineCc} cc`} note={`${model.powerHp} hp · ${model.torqueNm} Nm`} />
              <HeroFact label="Seat" value={`${model.seatHeightMm} mm`} note={`${model.curbWeightKg} kg curb weight`} />
              <HeroFact label="Transmission" value={model.transmission || "Not listed"} note={model.category} />
              <HeroFact label="Fuel" value={`${model.fuelTankL} L tank`} note={`${efficiency.kmPerL} km/L ${efficiency.status === "listed" ? "listed" : "planning estimate"}`} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="shell motorcycle-entity-nav-wrap">
      <ProductEntityNav items={[
        { href: "#price", label: "Price & variants" },
        ...(colorLanding && allColors.length > 0 ? [{ href: "#colors", label: "Colors" }] : []),
        ...(intentDepth ? [{ href: "#buyer-answers", label: "Buyer answers" }] : []),
        ...(specsLanding ? [{ href: `/motorcycles/${model.makeSlug}/${model.slug}/specs`, label: "Specs" }] : [{ href: "#specs", label: "Key specs" }]),
        ...(topSpeedLanding ? [{ href: `/motorcycles/${model.makeSlug}/${model.slug}/top-speed`, label: "Top speed" }] : []),
        ...(authority ? [{ href: "#buyer-guide", label: "Who it suits" }] : []),
        ...(!isHistorical ? [{ href: "#installment", label: "Monthly" }] : []),
        { href: "#rider-fit", label: "Rider fit" },
        ...(!isHistorical ? [{ href: "#ownership", label: "Ownership" }] : []),
        ...(!isHistorical ? [{ href: "#alternatives", label: "Alternatives" }] : []),
        { href: "#detailed-research", label: "Detailed research" },
      ]} />
    </div>

    <div className="shell motorcycle-entity-body">
      <style>{MOTORCYCLE_ANALYTICS_CSS}</style>
      <section className="motorcycle-analytics-panel" data-motorcycle-analytics="true" aria-label={`${model.make} ${model.model} performance snapshot`}>
        <div className="motorcycle-analytics-heading"><div><span>Performance snapshot</span><h2>The numbers that shape the ride</h2></div><p>Published specifications and calculated ratios. Bars provide scale context, not a universal motorcycle score.</p></div>
        <div className="motorcycle-analytics-grid">
          <AnalyticsMetric id="power" label="Power" value={model.powerHp.toLocaleString("en-PH", { maximumFractionDigits: 1 })} unit="hp" note={`${powerDensity.toFixed(1)} hp per 100 cc`} fill={powerDensity / 15 * 100} featured />
          <AnalyticsMetric id="torque" label="Torque" value={model.torqueNm.toLocaleString("en-PH", { maximumFractionDigits: 1 })} unit="Nm" note="Published peak output" fill={model.torqueNm / Math.max(model.engineCc / 8, 12) * 100} />
          <AnalyticsMetric id="power-to-weight" label="Power-to-weight" value={powerToWeight.toFixed(1)} unit="hp / 100 kg" note={`Calculated from ${model.curbWeightKg} kg curb weight`} fill={powerToWeight / 25 * 100} />
          <AnalyticsMetric id="seat-height" label="Seat height" value={model.seatHeightMm.toLocaleString("en-PH")} unit="mm" note={`${model.curbWeightKg} kg curb weight · check fit in person`} fill={(model.seatHeightMm - 650) / 3} />
        </div>
      </section>
      <CanonicalIntentDepth model={model} />
      {availabilityUncertain && <section className="entity-alert-card"><div><span>Availability needs verification</span><h2>Confirm current new-bike availability before relying on this price</h2><p>This model has Philippine price and specification references but is not treated as part of the current shopping catalog until present-day availability is confirmed.</p></div></section>}
      {isHistorical && successor && <section className="entity-alert-card"><div><span>{isDiscontinued ? "Discontinued model" : "Previous generation"}</span><h2>Looking for the current model?</h2><p>{model.model} stays live for owners and used-bike research. Current new-bike pricing belongs to {successor.make} {successor.model}.</p></div><Link className="button small" href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>View {successor.model} →</Link></section>}

      <section className="motorcycle-entity-section entity-overview-section" aria-labelledby="overview-heading">
        <SectionHeader kicker="Decision summary" titleId="overview-heading" title={<>Is the {model.make} {model.model} worth shortlisting?</>} description="Start with who it suits and the important trade-offs. The deeper evidence stays lower on the page." />
        <div className="motorcycle-editorial-grid"><article className="editorial-best"><span>Best fit for</span><h3>{editorial.bestFor}</h3><p>{model.summary}</p></article><article><span>Pros</span><ul>{editorial.strengths.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Trade-offs</span><ul>{editorial.watchOuts.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
      </section>

      <section id="price" className="motorcycle-entity-section" aria-labelledby="price-heading">
        <SectionHeader kicker="Price & variants" titleId="price-heading" title={<>{model.make} {model.model} price in the Philippines</>} description={isHistorical ? "Historical pricing is kept separate from used value." : "Start with the published price and exact variant, then confirm the current dealer quote before purchase."} />
        <div className="entity-price-grid motorcycle-price-grid"><article><span>{isHistorical ? "Historical price reference" : "Published price"}</span><strong>{observedMarketPriceLabel(model)}</strong><small>{isHistorical ? "Historical reference only." : "Confirm the current dealer quote before purchase."}</small></article><article><span>Model status</span><strong>{isDiscontinued ? "Discontinued" : isPrevious ? "Previous generation" : availabilityUncertain ? "Availability needs verification" : "Current model"}</strong><small>{model.generation} · {model.category}</small></article></div>
        {!isHistorical && <VariantMatrix model={model} />}
        {colorLanding && allColors.length > 0 && <div id="colors" className="model-color-intent">
          <SectionHeader
            kicker="Colors"
            title={`${model.make} ${model.model} colors in the Philippines`}
            description={`Color intent now has a focused page with ${allColors.length} verified/listed paint names, trim mapping and dealer-stock caveats.`}
          />
          <div className="entity-tool-grid">
            <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/colors`}>
              <span>Dedicated color guide</span>
              <strong>See all {model.model} colors and variant mapping</strong>
              <small>Check paint names, trim-specific colors, source dates and dealer-stock verification.</small>
            </Link>
          </div>
        </div>}
        {!isHistorical && <PriceIntelligence model={model} />}
        {!isHistorical && <MarketPriceChecks model={model} />}
        {!isHistorical && <LiveDealerInventory model={model} offers={currentOffers} />}
      </section>

      <section className="motorcycle-entity-section global-spec-intent" aria-labelledby="quick-specs-heading">
        <SectionHeader kicker="Quick specs" titleId="quick-specs-heading" title={`${model.make} ${model.model} horsepower, weight, seat height and tire size`} description="These core motorcycle specifications are useful across markets. Philippine pricing is shown separately above so local SRP is not confused with globally applicable technical specifications." />
        <div className="entity-spec-table motorcycle-spec-table quick-spec-grid" role="table" aria-label={`${model.make} ${model.model} quick specifications`}>
          <div role="row"><span role="cell">Horsepower</span><strong role="cell">{model.powerHp} hp</strong></div>
          <div role="row"><span role="cell">Torque</span><strong role="cell">{model.torqueNm} Nm</strong></div>
          <div role="row"><span role="cell">Curb weight</span><strong role="cell">{model.curbWeightKg} kg</strong></div>
          <div role="row"><span role="cell">Seat height</span><strong role="cell">{model.seatHeightMm} mm</strong></div>
          <div role="row"><span role="cell">Fuel capacity</span><strong role="cell">{model.fuelTankL} L</strong></div>
          <div role="row"><span role="cell">Front tire size</span><strong role="cell">{model.frontTire}</strong></div>
          <div role="row"><span role="cell">Rear tire size</span><strong role="cell">{model.rearTire}</strong></div>
          {model.groundClearanceMm ? <div role="row"><span role="cell">Ground clearance</span><strong role="cell">{model.groundClearanceMm} mm</strong></div> : null}
        </div>
        <p className="entity-lede">{model.make} {model.model} uses a {model.engineCc} cc engine rated at {model.powerHp} hp and {model.torqueNm} Nm. Recorded curb weight is {model.curbWeightKg} kg, seat height is {model.seatHeightMm} mm, and fuel capacity is {model.fuelTankL} L.</p>
      </section>

      {specsLanding ? <section id="specs" className="motorcycle-entity-section" aria-labelledby="specs-heading">
        <SectionHeader
          kicker="Key specifications"
          titleId="specs-heading"
          title={`${model.make} ${model.model} technical specifications`}
          description="This model has a focused specification page for engine, output, weight, seat height, fuel tank, ground clearance, tires, transmission and braking."
        />
        <div className="entity-tool-grid">
          <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/specs`}>
            <span>Dedicated technical reference</span>
            <strong>Open the full {model.model} specification sheet</strong>
            <small>See engine, power, torque, weight, seat, tank, ground clearance, tires, transmission, ABS and source date.</small>
          </Link>
        </div>
      </section> : <section id="specs" className="motorcycle-entity-section" aria-labelledby="specs-heading">
        <SectionHeader kicker="Key specifications" titleId="specs-heading" title={`${model.make} ${model.model} specifications`} description="Compare engine, power, fit, weight, transmission, braking and stock tire sizes for this motorcycle." />
        <div className="entity-spec-table motorcycle-spec-table key-spec-grid" role="table" aria-label={`${model.make} ${model.model} key specifications`}>
          <div role="row"><span role="cell">Engine</span><strong role="cell">{model.engineCc} cc · {model.powerHp} hp · {model.torqueNm} Nm</strong></div>
          <div role="row"><span role="cell">Transmission</span><strong role="cell">{model.transmission || "Not listed"}</strong></div>
          <div role="row"><span role="cell">Seat / curb weight</span><strong role="cell">{model.seatHeightMm} mm · {model.curbWeightKg} kg</strong></div>
          <div role="row"><span role="cell">Fuel tank</span><strong role="cell">{model.fuelTankL} L</strong></div>
          <div role="row"><span role="cell">Brakes / ABS</span><strong role="cell">{model.abs}</strong></div>
          <div role="row"><span role="cell">Tires</span><strong role="cell">{model.frontTire} front · {model.rearTire} rear</strong></div>
          {model.groundClearanceMm ? <div role="row"><span role="cell">Ground clearance</span><strong role="cell">{model.groundClearanceMm} mm</strong></div> : null}
        </div>
      </section>}

      {authority && <section id="buyer-guide" className="motorcycle-entity-section authority-decision-section" aria-labelledby="buyer-guide-heading">
        <div className="authority-verdict motorcycle-decision-panel"><div><span className="section-kicker">Who this bike is for</span><h2 id="buyer-guide-heading">Should you buy the {model.make} {model.model}?</h2><p>{authority.verdict}</p></div><aside><span>Important context</span><p>{authority.researchAngle}</p></aside></div>
        <div className="authority-grid motorcycle-decision-grid"><article className="authority-buy"><span>Buy it if</span><ul>{authority.buyIf.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="authority-skip"><span>Skip it if</span><ul>{authority.skipIf.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="authority-ph"><span>Philippine ownership</span><ul>{authority.phContext.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
      </section>}

      {!isHistorical && dedicatedInstallmentHandoff ? <><span id="installment" aria-hidden="true" /><section className="motorcycle-entity-section" aria-labelledby="installment-heading">
        <SectionHeader
          kicker="Monthly payment"
          titleId="installment-heading"
          title={`${model.make} ${model.model} downpayment and monthly installment estimate`}
          description="This financing intent now has its own focused page so the main motorcycle guide can stay centered on price, variants, specifications, fit and ownership."
        />
        <div className="entity-tool-grid">
          <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/installment`}>
            <span>Dedicated financing guide</span>
            <strong>Calculate downpayment and monthly installment</strong>
            <small>Compare dealer observations, 10/20/30% scenarios, variant prices and an editable loan estimate.</small>
          </Link>
        </div>
      </section></> : !isHistorical ? <section id="installment" className="motorcycle-entity-section" aria-labelledby="installment-heading">
        <SectionHeader
          kicker="Monthly payment"
          titleId="installment-heading"
          title={`${model.make} ${model.model} downpayment and monthly installment estimate`}
          description={installmentLanding ? "Estimate the monthly payment here, then open the focused financing guide for deeper dealer and scenario context." : aeroxFinanceTarget ? "Compare Standard and SP downpayment examples, then edit the exact cash price, downpayment, term and annual rate using the calculator." : "Use the published price as a starting point, then replace the downpayment, term and rate with the actual dealer or lender quote."}
        />
        <InstallmentCalculator price={range.from} priceOptions={financingPriceOptions} />
        <FinancingSnapshot modelName={`${model.make} ${model.model}`} price={range.from} priceOptions={financingPriceOptions} />
        <DealerFinancingSnapshot modelId={model.id} modelName={`${model.make} ${model.model}`} />
        <div className="entity-tool-grid">
          {installmentLanding ? <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/installment`}><span>Focused financing guide</span><strong>Open the installment and downpayment guide</strong><small>See model-specific financing context and scenarios.</small></Link> : <Link href={loanToolHref}><span>Need more control?</span><strong>{aeroxFinanceTarget ? "Calculate Aerox V3 downpayment and monthly payment" : "Open the full loan calculator"}</strong><small>{aeroxFinanceTarget ? "Enter an exact peso downpayment or use 10%, 20% and 30% presets, then adjust term and rate." : "Change price, down payment, term and rate with a shareable URL."}</small></Link>}
        </div>
      </section> : null}

      <section id="rider-fit" className="motorcycle-entity-section" aria-labelledby="fit-heading">
        <SectionHeader kicker="Rider fit" titleId="fit-heading" title={<>Will the {model.make} {model.model} fit you?</>} description="Seat height is only a starting point. Use your inseam with the recorded seat height and curb weight, then sit on the exact motorcycle when possible." />
        <div className="entity-fit-kpis"><HeroFact label="Seat height" value={`${model.seatHeightMm} mm`} /><HeroFact label="Curb weight" value={`${model.curbWeightKg} kg`} /><HeroFact label="Power" value={`${model.powerHp} hp`} note={`${model.engineCc} cc`} /><HeroFact label="Transmission" value={model.transmission || "Not listed"} /></div>
        <RiderFitCalculator model={forClient(model)} />
      </section>

      {!isHistorical && <section id="ownership" className="motorcycle-entity-section motorcycle-ownership-section" aria-labelledby="ownership-heading">
        <SectionHeader kicker="Ownership estimate" titleId="ownership-heading" title={`What could the ${model.model} cost to own?`} description="See the monthly picture first. Open advanced assumptions only when you want to model financing, fuel, maintenance, insurance, registration, tires and resale in detail." />
        <CommuteSnapshot model={model} />
        <details className="entity-disclosure ownership-assumptions"><summary>Adjust full ownership assumptions</summary><OwnershipCostCalculator model={forClient(model)} /></details>
      </section>}

      {!isHistorical && <section id="alternatives" className="motorcycle-entity-section" aria-labelledby="alternatives-heading">
        <SectionHeader kicker="Alternatives" titleId="alternatives-heading" title="What else should you consider?" description="Compare the motorcycles most likely to change the decision before you focus on deep technical research." />
        {authorityComparisons.length > 0 && <div className="authority-comparisons motorcycle-alternative-cards"><div><span>Buyer-guide alternatives</span><strong>Start with these direct cross-shopping choices</strong></div><div>{authorityComparisons.slice(0,3).map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}><span>{item.make} {item.model}</span><small>{item.engineCc} cc · {observedMarketPriceLabel(item)}</small></Link>)}</div></div>}
        {(modelFamily || scooterClassGuide) && <div className="entity-section-note">
          {modelFamily && <Link href={`/motorcycles/${modelFamily.makeSlug}/${modelFamily.slug}`}>Compare all {modelFamily.make} {modelFamily.name} generations →</Link>}
          {scooterClassGuide && <Link href={scooterClassGuide.href}>Compare this model in the {scooterClassGuide.label} →</Link>}
        </div>}
        <SimilarMotorcycles model={model} />
      </section>}

      <SectionHeader className="entity-research-divider" kicker="Detailed research" title="Evidence for the deeper check" description="Open these sections when the motorcycle is already on your shortlist." />

      {seatHeightLanding ? <section id="seat-height" className="motorcycle-entity-section">
        <div className="entity-tool-grid">
          <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/seat-height`}>
            <span>Dedicated rider-fit context</span>
            <strong>{model.make} {model.model} seat height</strong>
            <small>{model.seatHeightMm} mm published seat · curb-weight comparison, rider-reach caveats and nearby seat-height alternatives.</small>
          </Link>
        </div>
      </section> : null}

      {weightLanding ? <section id="weight" className="motorcycle-entity-section">
        <div className="entity-tool-grid">
          <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/weight`}>
            <span>Dedicated weight context</span>
            <strong>{model.make} {model.model} weight</strong>
            <small>{model.curbWeightKg} kg curb weight · 650-class comparison, seat-height context and power-to-weight calculation.</small>
          </Link>
        </div>
      </section> : null}

      {topSpeedLanding ? <section id="performance" className="motorcycle-entity-section">
        <div className="entity-tool-grid">
          <Link href={`/motorcycles/${model.makeSlug}/${model.slug}/top-speed`}>
            <span>Dedicated performance evidence</span>
            <strong>{model.make} {model.model} top speed</strong>
            <small>{topSpeedLanding.observedTopSpeedKph} km/h evidence · test method, generation caveats and real-world factors.</small>
          </Link>
        </div>
      </section> : performance ? <section id="performance" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Performance and top-speed evidence</summary><div className="source-panel entity-source-panel"><span>{performance.evidence}</span><h3>{performance.observedRangeKph ? `${performance.observedRangeKph[0]}–${performance.observedRangeKph[1]} km/h observed range` : performance.observedTopSpeedKph ? `About ${performance.observedTopSpeedKph} km/h editorial estimate` : "No manufacturer-published top-speed figure"}</h3><p>{performance.answer}</p><small>{performance.caution}</small></div></details></section> : null}

      {fuelConsumptionLanding && efficiency.status === "listed" ? <section id="fuel" className="motorcycle-entity-section"><div className="entity-tool-grid"><Link href={`/motorcycles/${model.makeSlug}/${model.slug}/fuel-consumption`}><span>Dedicated fuel-economy guide</span><strong>{model.make} {model.model} fuel consumption</strong><small>{efficiency.kmPerL} km/L listed figure · range, monthly fuel-cost calculator, evidence context and real-world caveats.</small></Link></div></section> : <section id="fuel" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Fuel economy and range</summary><SectionHeader title={<>{model.make} {model.model} fuel consumption</>} description={efficiency.status === "listed" ? `The ${efficiency.kmPerL} km/L basis comes from the model data on file.` : "MotoIndex starts from a labeled planning estimate when a model-specific published figure is unavailable."} /><FuelRangeCalculator model={forClient(model)} /></details></section>}

      <section id="tires-fitment" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Tires, top boxes and fitment</summary><SectionHeader title={<>{model.make} {model.model} tires and ownership gear</>} description="Start with the stock tire sizes and model-specific fitment evidence, then continue into the full ownership catalogs when you need more options." />{tireGuideHref && <p className="entity-section-note"><Link href={tireGuideHref}>Open the dedicated {model.model} tire-size guide →</Link></p>}<div className="entity-fit-kpis tire-fit-kpis"><HeroFact label="Front tire" value={model.frontTire} /><HeroFact label="Rear tire" value={model.rearTire} />{maintenance?.tirePressure && <HeroFact label="Solo pressure" value={`${maintenance.tirePressure.soloFrontPsi} / ${maintenance.tirePressure.soloRearPsi} psi`} note="Front / rear" />}</div><FitmentSummary model={model} />{(tireCandidates.length > 0 || topBoxCandidates.length > 0) && <CanonicalProductGrid>{tireCandidates.slice(0,3).map((p) => <ProductCard key={p.id} item={{ entityId:p.id, href:`/tires/${p.brandSlug}/${p.slug}`, category:"Tire", brand:p.brand, model:p.model, meta:p.useCase, status:p.status, priceFromPhp:p.priceFromPhp }} />)}{topBoxCandidates.slice(0,3).map((p) => { const edge=topBoxFitments.find((f)=>f.topBoxId===p.id); return <ProductCard key={p.id} item={{ entityId:p.id, href:`/accessories/top-box/${p.slug}`, category:"Top box", brand:p.brand, model:p.model, meta:edge?.status==="verified"?`${edge.rackCode} · model-specific rack`:`${p.capacityL}L · fit to confirm`, status:edge?.status==="verified"?"verified":"research", priceFromPhp:p.priceFromPhp }} />; })}</CanonicalProductGrid>}<OwnershipCatalogLinks hasHelmetGuide={Boolean(gearGuide && helmetCandidates.length > 0)} /></details></section>

      <section id="maintenance" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Maintenance and official service schedule</summary>{maintenance ? <><div className="entity-maintenance-table" role="table" aria-label={`${model.make} ${model.model} maintenance schedule`}><div className="head" role="row"><span role="columnheader">Item</span><span role="columnheader">Action</span><span role="columnheader">Interval</span></div>{maintenance.items.map((item) => <div role="row" key={item.item}><span role="cell"><strong>{item.item}</strong>{item.note && <small>{item.note}</small>}</span><span role="cell">{item.action}</span><span role="cell">{item.interval}</span></div>)}</div><p className="entity-section-note">Exact owner-manual schedule. Confirm the maintenance schedule for the exact model year and market before servicing. <a href={maintenance.sourceUrl} target="_blank" rel="noreferrer">Open the official owner manual →</a></p></> : brandMaintenance ? <><div className="entity-alert-card subdued"><div><span>Official brand PMS guide</span><h3>{brandMaintenance.sourceLabel}</h3><p>{brandMaintenance.applicability}</p><p><strong>PMS milestones:</strong> {brandMaintenance.pmsMilestones}</p></div></div><div className="entity-maintenance-table" role="table" aria-label={`${model.make} brand maintenance guidance`}><div className="head" role="row"><span role="columnheader">Item</span><span role="columnheader">Action</span><span role="columnheader">Brand guide interval</span></div>{brandMaintenance.items.map((item) => <div role="row" key={item.item}><span role="cell"><strong>{item.item}</strong>{item.note && <small>{item.note}</small>}</span><span role="cell">{item.action}</span><span role="cell">{item.interval}</span></div>)}</div><p className="entity-section-note">This is {model.make} brand-level maintenance guidance, not a substitute for the exact {model.model} owner manual. <a href={brandMaintenance.sourceUrl} target="_blank" rel="noreferrer">Check the official {model.make} maintenance source →</a></p></> : <div className="entity-alert-card subdued"><div><span>Official service schedule</span><h3>Use the current manufacturer maintenance documentation</h3><p>MotoIndex does not substitute a generic interval when a model-specific official schedule has not been transcribed.</p></div></div>}</details></section>

      <section id="safety" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Safety, recalls and service campaigns</summary>{safetyNotices.length > 0 ? <div className="safety-notice-list entity-safety-list">{safetyNotices.map((notice) => <article key={`${notice.modelId}-${notice.publishedAt}`}><span>{notice.publishedAt}</span><h3>{notice.title}</h3><p>{notice.summary}</p></article>)}</div> : <div className="note-box compact-note"><h3>No model-specific notice is listed here right now</h3><p>This is not proof that no recall, product update or service campaign applies. Check the exact VIN/frame number with the manufacturer.</p></div>}</details></section>

      <section id="used" className="motorcycle-entity-section"><details className="entity-disclosure" open={isHistorical}><summary>Used value and depreciation</summary>{usedListings.length === 0 ? <div className="note-box compact-note"><h3>Used-market sample not available yet</h3><p>The calculator below is an estimate, not a live appraisal. Listing samples appear only after they pass verification.</p></div> : <><UsedMarketSummary modelId={model.id} />{!isHistorical && <div className="new-used-grid entity-new-used-grid"><article><span>New reference</span><strong>{observedMarketPriceLabel(model)}</strong></article><article><span>Used median ask</span><strong>{php(usedSummary.medianPrice)}</strong><p>{usedSummary.included} verified listing samples.</p></article></div>}<details className="entity-disclosure"><summary>Show used listing samples</summary><UsedListingTable items={usedListings} /></details></>}<UsedValueCalculator model={forClient(model)} />{isHistorical && <CTAGroup><Link className="button secondary" href="/used-motorcycles">Used motorcycle research</Link><Link className="button secondary" href="/used-motorcycles/buying-checklist">Buying checklist</Link>{successor ? <Link className="button secondary" href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>Compare current {successor.model}</Link> : null}</CTAGroup>}<details className="entity-disclosure"><summary>Show illustrative depreciation table</summary><div className="depreciation-table"><div className="depreciation-row head"><span>Age</span><span>Fair</span><span>Good</span><span>Excellent</span></div>{usedCurve.map((row) => <div className="depreciation-row" key={row.age}><strong>{row.age} year{row.age===1?"":"s"}</strong><span>{php(row.fair)}</span><span>{php(row.good)}</span><span>{php(row.excellent)}</span></div>)}</div></details></details></section>

      {!colorLanding && allColors.length > 0 && <section id="colors" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>{model.make} {model.model} colors and variants</summary><div className="entity-color-grid">{allColors.map((color) => <article key={color}><strong>{color}</strong></article>)}</div></details></section>}

      {gearGuide && helmetCandidates.length > 0 && <section id="gear" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Helmet options for this rider profile</summary><p>{gearGuide.intro} Helmet fit is rider-specific, so these are shopping options rather than motorcycle-fitment claims.</p><div className="product-grid">{helmetCandidates.slice(0,3).map((p) => <ProductCard key={p.id} item={{ entityId:p.id, href:`/gear/helmets/${p.brandSlug}/${p.slug}`, category:p.helmetType, brand:p.brand, model:p.model, meta:p.certification, status:p.status, priceFromPhp:p.priceFromPhp }} />)}</div></details></section>}

      {authority && <section id="research-quality" className="motorcycle-entity-section research-quality-section"><details className="entity-disclosure"><summary>What to confirm before buying</summary><div className="research-quality-panel"><article><span>Covered on this page</span><ul>{quality.strengths.slice(0,5).map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Still worth confirming</span><ul>{quality.gaps.slice(0,5).map((item) => <li key={item}>{item}</li>)}</ul></article></div></details></section>}

      <section id="faq" className="motorcycle-entity-section"><FaqSection title={`${model.make} ${model.model} FAQs`} items={faqs} /></section>
      <AuthorBox />
    </div>
    <JsonLd data={[schema, faqSchema, authorSchema]} />
  </article>;
}

import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { CompareButton } from "@/components/CompareButton";
import { SaveToShortlistButton } from "@/components/SaveToShortlistButton";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { VariantMatrix } from "@/components/VariantMatrix";
import { PriceIntelligence } from "@/components/PriceIntelligence";
import { MarketPriceChecks } from "@/components/MarketPriceChecks";
import { InstallmentCalculator } from "@/components/InstallmentCalculator";
import { FinancingSnapshot } from "@/components/FinancingSnapshot";
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
import { getVerifiedVariantsForModel, variantPriceOptions } from "@/lib/variants";
import { helmetProducts, getTireProductsForModel, getTopBoxProductsForModel } from "@/lib/catalog";
import { getTopBoxFitmentsForModel } from "@/lib/topBoxFitment";
import { efficiencyEvidence } from "@/lib/efficiency";
import { maintenanceForModel, serviceResourceForModel } from "@/lib/maintenance";
import { safetyNoticesForModel, safetyResourceForModel } from "@/lib/safety";
import { listingsForModel, marketSummary } from "@/lib/usedMarket";
import { usedValueCurve } from "@/lib/ownership";
import { php } from "@/lib/utils";
import { motorcycleEntityEditorial, motorcycleEntityFaqs, motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { absoluteUrl } from "@/lib/site";
import { getRenderableMedia } from "@/lib/media";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { phBrandSupportFor } from "@/lib/phBrandSupport";
import { modelAuthorityQuality } from "@/lib/modelQuality";
import { SourceRef } from "@/components/SourceRef";
import { forClient } from "@/lib/competitors";
import { performanceAnswerFor } from "@/lib/modelPerformance";
import { AuthorBox } from "@/components/AuthorBox";
import { getModelGearGuide } from "@/lib/modelGearGuides";
import { OwnershipCatalogLinks } from "@/components/OwnershipCatalogLinks";

function HeroFact({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export function MotorcycleEntityPage({ model }: { model: Motorcycle }) {
  const isPrevious = model.marketStatus === "previous";
  const availabilityUncertain = model.marketStatus === "uncertain";
  const successor = model.successorId ? getModelById(model.successorId) : undefined;
  const seo = motorcycleEntitySeo(model);
  const editorial = motorcycleEntityEditorial(model);
  const performance = performanceAnswerFor(model.id);
  const range = observedMarketRange(model);
  const priceChecks = priceChecksForModel(model.id);
  const verifiedVariants = getVerifiedVariantsForModel(model.id);
  const allColors = [...new Set([...model.colors, ...verifiedVariants.flatMap((variant) => variant.colors || [])])];
  const gearGuide = getModelGearGuide(model.id);
  const helmetCandidates = (gearGuide?.helmetIds || []).map((id) => helmetProducts.find((product) => product.id === id)).filter((product): product is NonNullable<typeof product> => Boolean(product && product.status === "verified"));
  const tireCandidates = getTireProductsForModel(model.id).filter((p) => !isIndexableModel(model) || p.status === "verified");
  const topBoxCandidates = getTopBoxProductsForModel(model.id).filter((p) => !isIndexableModel(model) || p.status === "verified");
  const topBoxFitments = getTopBoxFitmentsForModel(model.id);
  const maintenance = maintenanceForModel(model.id);
  const serviceResource = serviceResourceForModel(model);
  const safetyResource = safetyResourceForModel(model);
  const safetyNotices = safetyNoticesForModel(model.id);
  const efficiency = efficiencyEvidence(model);
  const usedListings = listingsForModel(model.id);
  const usedSummary = marketSummary(model.id);
  const usedCurve = usedValueCurve(model);
  const media = getRenderableMedia("motorcycle", model.id)[0];
  const authority = modelAuthorityProfile(model.id);
  const brandSupport = phBrandSupportFor(model.makeSlug);
  const quality = modelAuthorityQuality(model);
  const authorityComparisons = authority?.comparisonIds.map((id) => getModelById(id)).filter((item): item is Motorcycle => Boolean(item)) || [];
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const faqs = [...motorcycleEntityFaqs(model), ...(performance ? [{ question: `What is the ${model.make} ${model.model} top speed?`, answer: performance.answer }] : [])];
  const officialPriceChecks = priceChecks.filter((row) => row.sourceType === "manufacturer");
  const officialPricePoints = officialPriceChecks.flatMap((row) => [row.priceFromPhp, row.priceToPhp].filter((value): value is number => typeof value === "number"));
  const officialLow = officialPricePoints.length ? Math.min(...officialPricePoints) : undefined;
  const officialHigh = officialPricePoints.length ? Math.max(...officialPricePoints) : undefined;
  const offer = !isPrevious && !availabilityUncertain && isIndexableModel(model) && typeof officialLow === "number"
    ? typeof officialHigh === "number" && officialHigh > officialLow
      ? { "@type": "AggregateOffer", priceCurrency: "PHP", lowPrice: officialLow, highPrice: officialHigh, url: absoluteUrl(canonicalPath) }
      : { "@type": "Offer", priceCurrency: "PHP", price: officialLow, itemCondition: "https://schema.org/NewCondition", url: absoluteUrl(canonicalPath) }
    : undefined;
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
  const loanToolHref = { pathname: "/tools/motorcycle-loan-calculator", query: { price: range.from, model: `${model.make} ${model.model}` } };

  return <article className="motorcycle-entity-page">
    <section className="motorcycle-entity-hero" id="overview">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: model.make, href: `/motorcycles/${model.makeSlug}` }, { label: model.model }]} />
        <div className="motorcycle-hero-grid">
          <div className="motorcycle-hero-copy">
            <span className="entity-kicker">Philippines model guide · {model.generation} · {model.category}{availabilityUncertain ? " · availability to verify" : ""}</span>
            <h1>{seo.heading}</h1>
            <p className="entity-lede">{seo.intro}</p>
            <div className="motorcycle-price-lockup">
              <span>{isPrevious ? "Historical launch reference" : availabilityUncertain ? "Published PH price · availability to verify" : "Published Philippine price"}</span>
              <strong>{observedMarketPriceLabel(model)}</strong>
              <small>{isPrevious ? "Historical context, not a current new-bike quote." : `Checked ${model.marketPriceCheckedAt || model.verifiedAt}. Final dealer pricing can vary.`}</small>
            </div>
            <div className="hero-actions entity-hero-actions">
              {!isPrevious && !availabilityUncertain && <Link className="button" href={`/get-quote/${model.makeSlug}/${model.slug}`}>Get dealer price</Link>}
              <a className={isPrevious ? "button" : "button ghost on-light"} href={isPrevious ? "#used" : "#installment"}>{isPrevious ? "Check used value" : "Estimate monthly"}</a>
            </div>
            <div className="entity-hero-utilities"><SaveToShortlistButton modelId={model.id} /><CompareButton modelId={model.id} /></div>
            <Freshness model={model} />
          </div>
          <div className="motorcycle-hero-visual">
            <EntityMedia entityType="motorcycle" entityId={model.id} className="motorcycle-hero-media" priority sizes="(max-width: 900px) 100vw, 48vw" fallback={<EntityVerificationFallback brand={model.make} model={model.model} className="authority-media-fallback" />} />
            <div className="motorcycle-hero-facts">
              <HeroFact label="Engine" value={`${model.engineCc} cc`} note={`${model.powerHp} hp · ${model.torqueNm} Nm`} />
              <HeroFact label="Seat" value={`${model.seatHeightMm} mm`} note={`${model.curbWeightKg} kg curb weight`} />
              <HeroFact label="Transmission" value={model.transmission || "Check model source"} note={model.category} />
              <HeroFact label="Fuel" value={`${model.fuelTankL} L tank`} note={`${efficiency.kmPerL} km/L ${efficiency.status === "listed" ? "listed" : "planning estimate"}`} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="shell motorcycle-entity-nav-wrap">
      <ProductEntityNav items={[
        { href: "#price", label: "Price & variants" },
        { href: "#specs", label: "Key specs" },
        ...(authority ? [{ href: "#buyer-guide", label: "Who it suits" }] : []),
        ...(!isPrevious ? [{ href: "#installment", label: "Monthly" }] : []),
        { href: "#rider-fit", label: "Rider fit" },
        ...(!isPrevious ? [{ href: "#ownership", label: "Ownership" }] : []),
        ...(!isPrevious ? [{ href: "#alternatives", label: "Alternatives" }] : []),
        { href: "#detailed-research", label: "Detailed research" },
      ]} />
    </div>

    <div className="shell motorcycle-entity-body">
      {availabilityUncertain && <section className="entity-alert-card"><div><span>Availability needs verification</span><h2>Confirm current new-bike availability before relying on this price</h2><p>This model has Philippine price and specification references but is not treated as part of the current shopping catalog until present-day availability is confirmed.</p></div></section>}
      {isPrevious && successor && <section className="entity-alert-card"><div><span>Previous generation</span><h2>Looking for the current model?</h2><p>{model.model} stays live for owners and used-bike research. Current new-bike pricing belongs to {successor.make} {successor.model}.</p></div><Link className="button small" href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>View {successor.model} →</Link></section>}

      <section className="motorcycle-entity-section entity-overview-section" aria-labelledby="overview-heading">
        <div className="section-head compact"><div><span className="section-kicker">Decision summary</span><h2 id="overview-heading">Is the {model.make} {model.model} worth shortlisting?</h2><p>Start with who it suits and the important trade-offs. The deeper evidence stays lower on the page.</p></div></div>
        <div className="motorcycle-editorial-grid"><article className="editorial-best"><span>Best fit for</span><h3>{editorial.bestFor}</h3><p>{model.summary}</p></article><article><span>Pros</span><ul>{editorial.strengths.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Trade-offs</span><ul>{editorial.watchOuts.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
      </section>

      <section id="price" className="motorcycle-entity-section" aria-labelledby="price-heading">
        <div className="section-head compact"><div><span className="section-kicker">Price & variants</span><h2 id="price-heading">{model.make} {model.model} price in the Philippines</h2><p>{isPrevious ? "Historical launch pricing is kept separate from used value." : "Start with the published price and exact variant. Source-level evidence is available below when you need it."}</p></div></div>
        <div className="entity-price-grid motorcycle-price-grid"><article><span>{isPrevious ? "Historical launch SRP" : "Published price"}</span><strong>{observedMarketPriceLabel(model)}</strong><small>{model.priceContext || `Checked ${model.marketPriceCheckedAt || model.verifiedAt}`}</small></article><article><span>Model status</span><strong>{isPrevious ? "Previous generation" : availabilityUncertain ? "Availability needs verification" : "Current model"}</strong><small>{model.generation} · {model.category}</small></article></div>
        {!isPrevious && <VariantMatrix model={model} />}
        {!isPrevious && <PriceIntelligence model={model} />}
        {!isPrevious && <details className="entity-disclosure"><summary>Show published price-source checks</summary><MarketPriceChecks model={model} /></details>}
      </section>

      <section id="specs" className="motorcycle-entity-section" aria-labelledby="specs-heading">
        <div className="section-head compact"><div><span className="section-kicker">Key specifications</span><h2 id="specs-heading">The numbers most buyers need first</h2><p>Keep the first pass to engine, power, fit, weight, transmission, braking and stock tires.</p></div></div>
        <div className="entity-spec-table motorcycle-spec-table" role="table" aria-label={`${model.make} ${model.model} key specifications`}>
          <div role="row"><span role="cell">Engine</span><strong role="cell">{model.engineCc} cc · {model.powerHp} hp · {model.torqueNm} Nm</strong></div>
          <div role="row"><span role="cell">Transmission</span><strong role="cell">{model.transmission || "Check current model source"}</strong></div>
          <div role="row"><span role="cell">Seat / curb weight</span><strong role="cell">{model.seatHeightMm} mm · {model.curbWeightKg} kg</strong></div>
          <div role="row"><span role="cell">Fuel tank</span><strong role="cell">{model.fuelTankL} L</strong></div>
          <div role="row"><span role="cell">Brakes / ABS</span><strong role="cell">{model.abs}</strong></div>
          <div role="row"><span role="cell">Tires</span><strong role="cell">{model.frontTire} front · {model.rearTire} rear</strong></div>
          {model.groundClearanceMm ? <div role="row"><span role="cell">Ground clearance</span><strong role="cell">{model.groundClearanceMm} mm</strong></div> : null}
        </div>
      </section>

      {authority && <section id="buyer-guide" className="motorcycle-entity-section authority-decision-section" aria-labelledby="buyer-guide-heading">
        <div className="authority-verdict"><div><span className="section-kicker">Who this bike is for</span><h2 id="buyer-guide-heading">Should you buy the {model.make} {model.model}?</h2><p>{authority.verdict}</p></div><aside><span>Important context</span><p>{authority.researchAngle}</p></aside></div>
        <div className="authority-grid"><article className="authority-buy"><span>Buy it if</span><ul>{authority.buyIf.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="authority-skip"><span>Skip it if</span><ul>{authority.skipIf.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="authority-ph"><span>Philippine ownership</span><ul>{authority.phContext.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
      </section>}

      {!isPrevious && <section id="installment" className="motorcycle-entity-section" aria-labelledby="installment-heading">
        <div className="section-head compact"><div><span className="section-kicker">Monthly payment</span><h2 id="installment-heading">Estimate the monthly commitment</h2><p>Start from the published price, then replace the assumptions with the actual dealer or lender quote.</p></div></div>
        <InstallmentCalculator price={range.from} priceOptions={variantPriceOptions(model.id)} />
        <FinancingSnapshot modelName={`${model.make} ${model.model}`} price={range.from} />
        <div className="entity-tool-grid"><Link href={loanToolHref}><span>Need more control?</span><strong>Open the full loan calculator</strong><small>Change price, down payment, term and rate with a shareable URL.</small></Link></div>
      </section>}

      <section id="rider-fit" className="motorcycle-entity-section" aria-labelledby="fit-heading">
        <div className="section-head compact"><div><span className="section-kicker">Rider fit</span><h2 id="fit-heading">Will the {model.make} {model.model} fit you?</h2><p>Seat height is only a starting point. Use your inseam with the recorded seat height and curb weight, then sit on the exact motorcycle when possible.</p></div></div>
        <div className="entity-fit-kpis"><HeroFact label="Seat height" value={`${model.seatHeightMm} mm`} /><HeroFact label="Curb weight" value={`${model.curbWeightKg} kg`} /><HeroFact label="Power" value={`${model.powerHp} hp`} note={`${model.engineCc} cc`} /><HeroFact label="Transmission" value={model.transmission || "Check source"} /></div>
        <RiderFitCalculator model={forClient(model)} />
      </section>

      {!isPrevious && <section id="ownership" className="motorcycle-entity-section" aria-labelledby="ownership-heading">
        <div className="section-head compact"><div><span className="section-kicker">Ownership estimate</span><h2 id="ownership-heading">What could the {model.model} cost to own?</h2><p>See the monthly picture first. Open advanced assumptions only when you want to model financing, fuel, maintenance, insurance, registration, tires and resale in detail.</p></div></div>
        <CommuteSnapshot model={model} />
        <details className="entity-disclosure"><summary>Adjust full ownership assumptions</summary><OwnershipCostCalculator model={forClient(model)} /></details>
      </section>}

      {!isPrevious && <section id="alternatives" className="motorcycle-entity-section" aria-labelledby="alternatives-heading">
        <div className="section-head compact"><div><span className="section-kicker">Alternatives</span><h2 id="alternatives-heading">What else should you consider?</h2><p>Compare the motorcycles most likely to change the decision before you focus on deep technical research.</p></div></div>
        {authorityComparisons.length > 0 && <div className="authority-comparisons"><div><span>Buyer-guide alternatives</span><strong>Start with these direct cross-shopping choices</strong></div><div>{authorityComparisons.slice(0,3).map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model}<small>{item.engineCc} cc · {observedMarketPriceLabel(item)}</small></Link>)}</div></div>}
        <SimilarMotorcycles model={model} />
      </section>}

      <div id="detailed-research" className="section-head compact entity-research-divider"><div><span className="section-kicker">Detailed research</span><h2>Evidence for the deeper check</h2><p>Open these sections when the motorcycle is already on your shortlist.</p></div></div>

      {performance && <section id="performance" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Performance and top-speed evidence</summary><div className="source-panel entity-source-panel"><span>{performance.evidence}</span><h3>{performance.observedRangeKph ? `${performance.observedRangeKph[0]}–${performance.observedRangeKph[1]} km/h observed range` : performance.observedTopSpeedKph ? `About ${performance.observedTopSpeedKph} km/h editorial estimate` : "No manufacturer-published top-speed figure"}</h3><p>{performance.answer}</p><small>{performance.caution}</small><br/><SourceRef url={performance.sourceUrl} label={performance.sourceLabel} /></div></details></section>}

      <section id="fuel" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Fuel economy and range</summary><div className="section-head compact"><div><h2>{model.make} {model.model} fuel consumption</h2><p>{efficiency.status === "listed" ? `The ${efficiency.kmPerL} km/L basis comes from the model data on file.` : "MotoIndex starts from a labeled planning estimate when a model-specific published figure is unavailable."}</p></div></div><FuelRangeCalculator model={forClient(model)} />{efficiency.sourceUrl && <div className="source-panel entity-source-panel"><span>Fuel-economy source</span><p>{efficiency.label} · checked {efficiency.checkedAt}</p><SourceRef url={efficiency.sourceUrl} label="Open model source" /></div>}</details></section>

      <section id="tires-fitment" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Tires, top boxes and fitment</summary><div className="section-head compact"><div><h2>{model.make} {model.model} tires and ownership gear</h2><p>Start with the stock tire sizes and model-specific fitment evidence, then continue into the full ownership catalogs when you need more options.</p></div></div><div className="entity-fit-kpis tire-fit-kpis"><HeroFact label="Front tire" value={model.frontTire} /><HeroFact label="Rear tire" value={model.rearTire} />{maintenance?.tirePressure && <HeroFact label="Solo pressure" value={`${maintenance.tirePressure.soloFrontPsi} / ${maintenance.tirePressure.soloRearPsi} psi`} note="Front / rear" />}</div><FitmentSummary model={model} />{(tireCandidates.length > 0 || topBoxCandidates.length > 0) && <div className="product-grid">{tireCandidates.slice(0,3).map((p) => <ProductCard key={p.id} item={{ entityId:p.id, href:`/tires/${p.brandSlug}/${p.slug}`, category:"Tire", brand:p.brand, model:p.model, meta:p.useCase, status:p.status, priceFromPhp:p.priceFromPhp }} />)}{topBoxCandidates.slice(0,3).map((p) => { const edge=topBoxFitments.find((f)=>f.topBoxId===p.id); return <ProductCard key={p.id} item={{ entityId:p.id, href:`/accessories/top-box/${p.slug}`, category:"Top box", brand:p.brand, model:p.model, meta:edge?.status==="verified"?`${edge.rackCode} · model-specific rack`:`${p.capacityL}L · fit to confirm`, status:edge?.status==="verified"?"verified":"research", priceFromPhp:p.priceFromPhp }} />; })}</div>}<OwnershipCatalogLinks hasHelmetGuide={Boolean(gearGuide && helmetCandidates.length > 0)} /></details></section>

      <section id="maintenance" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Maintenance and official service schedule</summary>{maintenance ? <><div className="entity-maintenance-table" role="table" aria-label={`${model.make} ${model.model} maintenance schedule`}><div className="head" role="row"><span role="columnheader">Item</span><span role="columnheader">Action</span><span role="columnheader">Interval</span></div>{maintenance.items.map((item) => <div role="row" key={item.item}><span role="cell"><strong>{item.item}</strong>{item.note && <small>{item.note}</small>}</span><span role="cell">{item.action}</span><span role="cell">{item.interval}</span></div>)}</div><div className="source-panel entity-source-panel"><span>Official maintenance source</span><h3>{maintenance.sourceLabel}</h3><p>Checked {maintenance.lastChecked}. Confirm the schedule for the exact model year and market.</p><SourceRef url={maintenance.sourceUrl} label="Open official manual" /></div></> : <div className="entity-alert-card subdued"><div><span>Official service schedule</span><h3>Use the current manufacturer maintenance documentation</h3><p>MotoIndex does not substitute a generic interval when a model-specific official schedule has not been transcribed.</p></div>{serviceResource ? <a className="button small" href={serviceResource.url} target="_blank" rel="noreferrer">{serviceResource.label} ↗</a> : brandSupport?.serviceUrl ? <a className="button small" href={brandSupport.serviceUrl} target="_blank" rel="noreferrer">Official {model.make} service resource ↗</a> : null}</div>}</details></section>

      <section id="safety" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Safety, recalls and service campaigns</summary>{safetyNotices.length > 0 ? <div className="safety-notice-list entity-safety-list">{safetyNotices.map((notice) => <article key={`${notice.modelId}-${notice.publishedAt}`}><span>{notice.publishedAt}</span><h3>{notice.title}</h3><p>{notice.summary}</p><SourceRef url={notice.sourceUrl} label={notice.sourceLabel} /></article>)}</div> : <div className="note-box compact-note"><h3>No model-specific notice is listed here right now</h3><p>This is not proof that no recall, product update or service campaign applies. Check the exact VIN/frame number with the manufacturer.</p></div>}{safetyResource && <div className="source-panel entity-source-panel"><span>Official campaign resource</span><h3>{safetyResource.label}</h3><p>{safetyResource.method}</p><small>Checked {safetyResource.lastChecked}</small><br/><SourceRef url={safetyResource.url} label="Open official resource" /></div>}</details></section>

      <section id="used" className="motorcycle-entity-section"><details className="entity-disclosure" open={isPrevious}><summary>Used value and depreciation</summary>{usedListings.length === 0 ? <div className="note-box compact-note"><h3>Used-market sample not available yet</h3><p>The calculator below is an estimate, not a live appraisal. Listing samples appear only after they pass verification.</p></div> : <><UsedMarketSummary modelId={model.id} />{!isPrevious && <div className="new-used-grid entity-new-used-grid"><article><span>New reference</span><strong>{observedMarketPriceLabel(model)}</strong></article><article><span>Used median ask</span><strong>{php(usedSummary.medianPrice)}</strong><p>{usedSummary.included} verified listing samples.</p></article></div>}<details className="entity-disclosure"><summary>Show used listing samples</summary><UsedListingTable items={usedListings} /></details></>}<UsedValueCalculator model={forClient(model)} /><details className="entity-disclosure"><summary>Show illustrative depreciation table</summary><div className="depreciation-table"><div className="depreciation-row head"><span>Age</span><span>Fair</span><span>Good</span><span>Excellent</span></div>{usedCurve.map((row) => <div className="depreciation-row" key={row.age}><strong>{row.age} year{row.age===1?"":"s"}</strong><span>{php(row.fair)}</span><span>{php(row.good)}</span><span>{php(row.excellent)}</span></div>)}</div></details></details></section>

      {allColors.length > 0 && <section id="colors" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Colors and variants</summary><div className="entity-color-grid">{allColors.map((color) => <article key={color}><strong>{color}</strong></article>)}</div></details></section>}

      {gearGuide && helmetCandidates.length > 0 && <section id="gear" className="motorcycle-entity-section"><details className="entity-disclosure"><summary>Helmet options for this rider profile</summary><p>{gearGuide.intro} Helmet fit is rider-specific, so these are shopping options rather than motorcycle-fitment claims.</p><div className="product-grid">{helmetCandidates.slice(0,3).map((p) => <ProductCard key={p.id} item={{ entityId:p.id, href:`/gear/helmets/${p.brandSlug}/${p.slug}`, category:p.helmetType, brand:p.brand, model:p.model, meta:p.certification, status:p.status, priceFromPhp:p.priceFromPhp }} />)}</div></details></section>}

      {(brandSupport || authority) && <section id="research-quality" className="motorcycle-entity-section research-quality-section"><details className="entity-disclosure"><summary>Sources, verification and what to confirm</summary><div className="research-quality-panel"><article><span>Verified on this page</span><ul>{quality.strengths.slice(0,5).map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>Still worth confirming</span><ul>{quality.gaps.slice(0,5).map((item) => <li key={item}>{item}</li>)}</ul></article></div>{brandSupport && <div className="ph-brand-support"><div><span>Philippine ownership support</span><h3>{brandSupport.officialName}</h3><p>{brandSupport.supportNote}</p><small>Resource check: {brandSupport.checkedAt}</small></div><div className="ph-brand-support-links"><SourceRef url={brandSupport.officialUrl} label="Official brand" />{brandSupport.dealerUrl && <SourceRef url={brandSupport.dealerUrl} label="Dealer network" />}{brandSupport.serviceUrl && <SourceRef url={brandSupport.serviceUrl} label="Service / after-sales" />}{brandSupport.ownerUrl && <SourceRef url={brandSupport.ownerUrl} label="Owner resources" />}</div></div>}</details></section>}

      <section id="faq" className="motorcycle-entity-section"><FaqSection title={`${model.make} ${model.model} FAQs`} items={faqs} /></section>
      <AuthorBox />
    </div>
    <JsonLd data={schema} />
  </article>;
}

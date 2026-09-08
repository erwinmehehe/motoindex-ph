import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Freshness } from "@/components/Freshness";
import { EntityMedia } from "@/components/EntityMedia";
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
import { ModelUpdateLog } from "@/components/ModelUpdateLog";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FaqSection } from "@/components/FaqSection";
import { UsedMarketSummary } from "@/components/UsedMarketSummary";
import { UsedListingTable } from "@/components/UsedListingTable";
import { UsedValueCalculator } from "@/components/UsedValueCalculator";
import { getModelById, isIndexableModel } from "@/lib/data";
import { observedMarketPriceLabel, observedMarketRange, priceChecksForModel } from "@/lib/marketChecks";
import { variantPriceOptions } from "@/lib/variants";
import { getTireProductsForModel, getTopBoxProductsForModel } from "@/lib/catalog";
import { getTopBoxFitmentsForModel } from "@/lib/topBoxFitment";
import { efficiencyEvidence } from "@/lib/efficiency";
import { maintenanceForModel, serviceResourceForModel } from "@/lib/maintenance";
import { safetyNoticesForModel, safetyResourceForModel } from "@/lib/safety";
import { listingsForModel, marketSummary } from "@/lib/usedMarket";
import { usedValueCurve } from "@/lib/ownership";
import { php } from "@/lib/utils";
import { modelInternalLinks } from "@/lib/internalLinks";
import { motorcycleEntityEditorial, motorcycleEntityFaqs, motorcycleEntitySeo } from "@/lib/motorcycleEntitySeo";
import { absoluteUrl } from "@/lib/site";
import { getRenderableMedia } from "@/lib/media";
import { modelAuthorityProfile } from "@/lib/modelAuthority";
import { phBrandSupportFor } from "@/lib/phBrandSupport";
import { modelAuthorityQuality } from "@/lib/modelQuality";
import { SourceRef } from "@/components/SourceRef";
import { forClient } from "@/lib/competitors";

function HeroFact({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export function MotorcycleEntityPage({ model }: { model: Motorcycle }) {
  const isPrevious = model.marketStatus === "previous";
  const availabilityUncertain = model.marketStatus === "uncertain";
  const successor = model.successorId ? getModelById(model.successorId) : undefined;
  const seo = motorcycleEntitySeo(model);
  // Keywords keep every spelling, but the visible line drops any alias that is
  // just a shorter piece of another ("PG1" inside "Yamaha PG1"), which otherwise
  // reads as the same name listed twice.
  const akaDisplay = (model.alsoKnownAs || []).filter(
    (a, _i, arr) => !arr.some((b) => b !== a && b.toLowerCase().includes(a.toLowerCase()))
  );
  const editorial = motorcycleEntityEditorial(model);
  const faqs = motorcycleEntityFaqs(model);
  const range = observedMarketRange(model);
  const priceChecks = priceChecksForModel(model.id);
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
  const priceSourceCount = new Set([model.marketPriceSourceUrl || model.sourceUrl, ...priceChecks.map((row) => row.sourceUrl)]).size;
  const canonicalPath = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const offer = !isPrevious && !availabilityUncertain && isIndexableModel(model)
    ? range.to && range.to > range.from
      ? { "@type": "AggregateOffer", priceCurrency: "PHP", lowPrice: range.from, highPrice: range.to, offerCount: Math.max(priceChecks.length, 1), url: absoluteUrl(canonicalPath) }
      : { "@type": "Offer", priceCurrency: "PHP", price: range.from, itemCondition: "https://schema.org/NewCondition", url: absoluteUrl(canonicalPath) }
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
  const insuranceToolHref = { pathname: "/tools/motorcycle-insurance-calculator", query: { value: range.from, model: `${model.make} ${model.model}` } };
  const registrationToolHref = { pathname: "/tools/lto-registration-fee-calculator", query: { model: `${model.make} ${model.model}` } };

  return <article className="motorcycle-entity-page">
    <section className="motorcycle-entity-hero" id="overview">
      <div className="shell">
        <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: model.make, href: `/motorcycles/${model.makeSlug}` }, { label: model.model }]} />
        <div className="motorcycle-hero-grid">
          <div className="motorcycle-hero-copy">
            <span className="entity-kicker">Philippines model guide · {model.generation} · {model.category}{availabilityUncertain ? " · availability to verify" : ""}</span>
            <h1>{seo.heading}</h1>
            <p className="entity-lede">{seo.intro}</p>
            {akaDisplay.length ? <p className="entity-aka">
              Also sold and searched as {akaDisplay.map((a, i, arr) =>
                <span key={a}><strong>{a}</strong>{i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}</span>)}
              {" "}— the same motorcycle, not a different model.
            </p> : null}
            <div className="motorcycle-price-lockup">
              <span>{isPrevious ? "Historical launch reference" : availabilityUncertain ? "Observed PH price reference · availability to verify" : model.marketPriceSourceLabel ? "Observed PH price range" : "Indicative SRP"}</span>
              <strong>{observedMarketPriceLabel(model)}</strong>
              <small>{isPrevious ? "Historical context — not a current new-bike quote." : `Price basis last checked ${model.marketPriceCheckedAt || model.verifiedAt}.`}</small>
            </div>
            <div className="hero-actions entity-hero-actions">
              <a className="button" href={isPrevious ? "#used" : "#installment"}>{isPrevious ? "Check used value" : "Estimate monthly"}</a>
              <a className="button ghost on-light" href="#price">See price sources</a>
              <CompareButton modelId={model.id} />
              <SaveToShortlistButton modelId={model.id} />
            </div>
            <Freshness model={model} />
          </div>
          <div className="motorcycle-hero-visual">
            <EntityMedia entityType="motorcycle" entityId={model.id} className="motorcycle-hero-media" priority sizes="(max-width: 900px) 100vw, 48vw" fallback={authority ? <div className="authority-media-fallback"><span>Verified model record · photo pending</span><strong>{model.make}<b>{model.model}</b></strong><div><em>{model.engineCc} cc</em><em>{model.powerHp} hp</em><em>{model.curbWeightKg} kg</em><em>{model.seatHeightMm} mm seat</em></div><small>{model.category} · {model.generation}</small></div> : <div className="bike-art big"><span className="wheel wheel-a"/><span className="wheel wheel-b"/><span className="bike-body"/><div className="art-caption">{model.generation} · {model.category}</div></div>} />
            <div className="motorcycle-hero-facts">
              <HeroFact label="Engine" value={`${model.engineCc} cc`} note={`${model.powerHp} hp · ${model.torqueNm} Nm`} />
              <HeroFact label="Seat / weight" value={`${model.seatHeightMm} mm`} note={`${model.curbWeightKg} kg curb`} />
              <HeroFact label="Fuel" value={`${model.fuelTankL} L tank`} note={`${efficiency.kmPerL} km/L ${efficiency.status === "listed" ? "listed" : "estimate"}`} />
              <HeroFact label="Tires" value={model.frontTire} note={`Rear ${model.rearTire}`} />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div className="shell motorcycle-entity-nav-wrap">
      <ProductEntityNav items={[
        { href: "#price", label: "Price" },
        ...(authority ? [{ href: "#buyer-guide", label: "Buyer guide" }] : []),
        ...(!isPrevious ? [{ href: "#installment", label: "Installment" }] : []),
        { href: "#specs", label: "Specs" },
        { href: "#rider-fit", label: "Rider fit" },
        { href: "#tires-fitment", label: "Tires & fitment" },
        { href: "#fuel", label: "Fuel" },
        ...(!isPrevious ? [{ href: "#ownership", label: "Ownership" }] : []),
        { href: "#maintenance", label: "Maintenance" },
        { href: "#safety", label: "Safety" },
        { href: "#used", label: "Used value" },
        { href: "#alternatives", label: "Alternatives" },
        { href: "#faq", label: "FAQ" },
      ]} />
    </div>

    <div className="shell motorcycle-entity-body">
      {availabilityUncertain && <section className="entity-alert-card"><div><span>Availability to verify</span><h2>Confirm current new-bike availability before relying on this price</h2><p>This model still has a source-backed Philippine record and current marketplace references, but it is not surfaced in the manufacturer&apos;s current discovery lineup. Verify stock, model year and final pricing with an authorized dealer.</p></div></section>}

      {isPrevious && successor && <section className="entity-alert-card">
        <div><span>Previous generation</span><h2>Looking for the current model?</h2><p>{model.model} stays live for owners and used-bike research. Current new-bike pricing belongs to {successor.make} {successor.model}.</p></div>
        <Link className="button small" href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>View {successor.model} →</Link>
      </section>}

      <section className="motorcycle-entity-section entity-overview-section" aria-labelledby="overview-heading">
        <div className="section-head compact"><div><span className="section-kicker">Decision summary</span><h2 id="overview-heading">What the {model.make} {model.model} is like on paper</h2><p>Price, fit, running cost, maintenance and used-value context are brought together so you can judge the motorcycle without jumping between disconnected pages.</p></div></div>
        <div className="motorcycle-editorial-grid">
          <article className="editorial-best"><span>Best fit for</span><h3>{editorial.bestFor}</h3><p>{model.summary}</p></article>
          <article><span>Strong facts</span><ul>{editorial.strengths.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>Watch-outs</span><ul>{editorial.watchOuts.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
      </section>

      {authority && <section id="buyer-guide" className="motorcycle-entity-section authority-decision-section" aria-labelledby="buyer-guide-heading">
        <div className="authority-verdict">
          <div><span className="section-kicker">MotoIndex buyer verdict</span><h2 id="buyer-guide-heading">Should you buy the {model.make} {model.model} in the Philippines?</h2><p>{authority.verdict}</p></div>
          <aside><span>Research angle</span><p>{authority.researchAngle}</p></aside>
        </div>
        <div className="authority-grid">
          <article className="authority-buy"><span>Buy it if</span><ul>{authority.buyIf.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="authority-skip"><span>Skip it if</span><ul>{authority.skipIf.map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article className="authority-ph"><span>PH ownership reality</span><ul>{authority.phContext.map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        {authorityComparisons.length > 0 && <div className="authority-comparisons"><div><span>Direct cross-shopping</span><strong>Compare the alternatives that change the decision</strong></div><div>{authorityComparisons.map((item) => <Link key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>{item.make} {item.model}<small>{item.engineCc} cc · {observedMarketPriceLabel(item)}</small></Link>)}</div></div>}
      </section>}

      <section id="price" className="motorcycle-entity-section" aria-labelledby="price-heading">
        <div className="section-head compact"><div><span className="section-kicker">Price intelligence</span><h2 id="price-heading">{model.make} {model.model} price in the Philippines</h2><p>{isPrevious ? "Historical launch-price context is kept separate from current used value." : "Dated manufacturer, dealer and comparison-site observations stay visible instead of being averaged into one unexplained number."}</p></div></div>
        <div className="entity-price-grid motorcycle-price-grid">
          <article><span>{isPrevious ? "Historical launch SRP" : "Observed price range"}</span><strong>{observedMarketPriceLabel(model)}</strong><small>{model.priceContext || `Checked ${model.marketPriceCheckedAt || model.verifiedAt}`}</small></article>
          <article><span>Price sources</span><strong>{priceSourceCount}</strong><small>{priceChecks.length ? "Model source plus dated PH observations are shown below." : "One dated baseline source is stored; independent PH price checking remains open."}</small></article>
          <article><span>Model status</span><strong>{isPrevious ? "Previous generation" : availabilityUncertain ? "Availability to verify" : "Current model"}</strong><small>{model.generation} · {model.category}</small></article>
        </div>
        {!isPrevious && <VariantMatrix model={model} />}
        {!isPrevious && <PriceIntelligence model={model} />}
        {!isPrevious && <MarketPriceChecks model={model} />}
        {isPrevious && <div className="note-box compact-note"><h3>Do not use the launch SRP as today&apos;s used-bike value</h3><p>Condition, year, mileage, registration, service history, modifications and location can move the actual used price materially.</p></div>}
      </section>

      {!isPrevious && <section id="installment" className="motorcycle-entity-section" aria-labelledby="installment-heading">
        <div className="section-head compact"><div><span className="section-kicker">Financing</span><h2 id="installment-heading">{model.make} {model.model} installment calculator</h2><p>Start from the dated purchase-price reference, then replace the assumptions with an actual dealer or lender quote.</p></div></div>
        <InstallmentCalculator price={range.from} priceOptions={variantPriceOptions(model.id)} />
        <FinancingSnapshot modelName={`${model.make} ${model.model}`} price={range.from} />
        <div className="entity-tool-grid">
          <Link href={loanToolHref}><span>Loan scenario</span><strong>Standalone loan calculator</strong><small>Change price, down payment, term and rate with a shareable URL.</small></Link>
          <Link href={insuranceToolHref}><span>Insurance</span><strong>Insurance estimate</strong><small>Prefill insured value from this model&apos;s price basis.</small></Link>
          <Link href={registrationToolHref}><span>Registration</span><strong>LTO fee estimate</strong><small>Add editable registration, CTPL and assessed fees.</small></Link>
        </div>
      </section>}

      <section id="specs" className="motorcycle-entity-section" aria-labelledby="specs-heading">
        <div className="section-head compact"><div><span className="section-kicker">Specifications</span><h2 id="specs-heading">{model.make} {model.model} specs and dimensions</h2><p>Core model data is kept on the canonical entity page so price, fit and ownership questions share the same specification record.</p></div></div>
        <div className="entity-spec-table motorcycle-spec-table" role="table" aria-label={`${model.make} ${model.model} specifications`}>
          <div role="row"><span role="cell">Engine</span><strong role="cell">{model.engineCc} cc</strong></div>
          <div role="row"><span role="cell">Transmission</span><strong role="cell">{model.transmission || "Check current model source"}</strong></div>
          <div role="row"><span role="cell">Power</span><strong role="cell">{model.powerHp} hp</strong></div>
          <div role="row"><span role="cell">Torque</span><strong role="cell">{model.torqueNm} Nm</strong></div>
          <div role="row"><span role="cell">Curb weight</span><strong role="cell">{model.curbWeightKg} kg</strong></div>
          <div role="row"><span role="cell">Seat height</span><strong role="cell">{model.seatHeightMm} mm</strong></div>
          <div role="row"><span role="cell">Fuel tank</span><strong role="cell">{model.fuelTankL} L</strong></div>
          <div role="row"><span role="cell">Fuel economy</span><strong role="cell">{efficiency.kmPerL} km/L · {efficiency.status === "listed" ? "listed" : "planning estimate"}</strong></div>
          <div role="row"><span role="cell">Ground clearance</span><strong role="cell">{model.groundClearanceMm ? `${model.groundClearanceMm} mm` : "Not stored"}</strong></div>
          <div role="row"><span role="cell">Brakes / ABS</span><strong role="cell">{model.abs}</strong></div>
          <div role="row"><span role="cell">Front tire</span><strong role="cell">{model.frontTire}</strong></div>
          <div role="row"><span role="cell">Rear tire</span><strong role="cell">{model.rearTire}</strong></div>
          <div role="row"><span role="cell">Generation</span><strong role="cell">{model.generation}</strong></div>
          <div role="row"><span role="cell">Colors recorded</span><strong role="cell">{model.colors.length ? model.colors.join(" · ") : "Check current source"}</strong></div>
        </div>
      </section>

      <section id="rider-fit" className="motorcycle-entity-section" aria-labelledby="fit-heading">
        <div className="section-head compact"><div><span className="section-kicker">Ergonomics</span><h2 id="fit-heading">Will the {model.make} {model.model} fit your height and use?</h2><p>Seat height alone cannot predict actual foot reach. Combine published dimensions with your inseam, traffic, passenger and luggage needs.</p></div></div>
        <div className="entity-fit-kpis">
          <HeroFact label="Seat height" value={`${model.seatHeightMm} mm`} note="Published specification" />
          <HeroFact label="Curb weight" value={`${model.curbWeightKg} kg`} note="Published specification" />
          <HeroFact label="Power" value={`${model.powerHp} hp`} note={`${model.engineCc} cc`} />
          <HeroFact label="Transmission" value={model.transmission || "—"} note={model.category} />
        </div>
        <RiderFitCalculator model={forClient(model)} />
        <div className="note-box compact-note"><h3>Test the exact motorcycle</h3><p>Seat width, suspension sag, footwear, rider weight, road camber and technique all change real foot reach and low-speed confidence.</p></div>
      </section>

      <section id="tires-fitment" className="motorcycle-entity-section" aria-labelledby="tires-heading">
        <div className="section-head compact"><div><span className="section-kicker">Tires + accessories</span><h2 id="tires-heading">{model.make} {model.model} tire size and fitment</h2><p>Stock tire sizes, pressure evidence where available, compatible product candidates and bike-specific mounting records live together.</p></div></div>
        <div className="entity-fit-kpis tire-fit-kpis">
          <HeroFact label="Front tire" value={model.frontTire} note="Stock specification" />
          <HeroFact label="Rear tire" value={model.rearTire} note="Stock specification" />
          {maintenance?.tirePressure && <HeroFact label="Solo pressure" value={`${maintenance.tirePressure.soloFrontPsi} / ${maintenance.tirePressure.soloRearPsi} psi`} note="Front / rear · owner manual" />}
          {maintenance?.tirePressure && <HeroFact label="With passenger" value={`${maintenance.tirePressure.passengerFrontPsi} / ${maintenance.tirePressure.passengerRearPsi} psi`} note="Front / rear · owner manual" />}
        </div>
        {(tireCandidates.length > 0 || topBoxCandidates.length > 0) && <div className="entity-product-cluster">
          <div className="section-head compact"><div><h3>Products worth checking for this model</h3><p>Tire cards start from stock-size matches. Top-box cards distinguish bike-specific rack evidence from general fit-to-confirm options.</p></div></div>
          <div className="product-grid">{tireCandidates.map((p) => <ProductCard key={p.id} item={{ entityId: p.id, href: `/tires/${p.brandSlug}/${p.slug}`, category: "Tire", brand: p.brand, model: p.model, meta: `Size match · ${p.useCase}`, status: p.status, priceFromPhp: p.priceFromPhp }} />)}{topBoxCandidates.map((p) => { const edge = topBoxFitments.find((f) => f.topBoxId === p.id); return <ProductCard key={p.id} item={{ entityId: p.id, href: `/accessories/top-box/${p.slug}`, category: "Top box", brand: p.brand, model: p.model, meta: edge ? `${edge.rackCode} · ${edge.status === "verified" ? "model-specific rack" : "fit to confirm"}` : `${p.capacityL}L · fit to confirm`, status: edge?.status === "verified" ? "verified" : "research", priceFromPhp: p.priceFromPhp }} />; })}</div>
        </div>}
        {topBoxFitments.length > 0 && <div className="fitment-evidence-grid entity-fitment-evidence">{topBoxFitments.map((f) => <article key={f.id}><span className={`catalog-status ${f.status === "verified" ? "verified" : ""}`}>{f.status === "verified" ? "Manufacturer-listed" : "Needs checking"}</span><h3>{f.topBoxLabel}</h3><p><b>Rack:</b> {f.rackCode} · {f.rackLabel}</p><p><b>Years:</b> {f.modelYears}</p><p>{f.plateRequirement}</p>{f.marketNote && <small>{f.marketNote}</small>}<div className="fitment-card-links"><Link href={f.productHref}>Open product →</Link><SourceRef url={f.sourceUrl} label="Fitment source" /></div></article>)}</div>}
        <FitmentSummary model={model} />
      </section>

      <section id="fuel" className="motorcycle-entity-section" aria-labelledby="fuel-heading">
        <div className="section-head compact"><div><span className="section-kicker">Running cost</span><h2 id="fuel-heading">{model.make} {model.model} fuel consumption and range</h2><p>{efficiency.status === "listed" ? `The ${efficiency.kmPerL} km/L basis comes from the model data on file.` : "No model-specific listed economy figure is stored, so the tool starts from a labeled planning estimate."}</p></div></div>
        <FuelRangeCalculator model={forClient(model)} />
        {efficiency.sourceUrl && <div className="source-panel entity-source-panel"><span>Fuel-economy source</span><p>{efficiency.label} · checked {efficiency.checkedAt}</p><SourceRef url={efficiency.sourceUrl} label="Open model source" /></div>}
      </section>

      {!isPrevious && <section id="ownership" className="motorcycle-entity-section" aria-labelledby="ownership-heading">
        <div className="section-head compact"><div><span className="section-kicker">Total cost</span><h2 id="ownership-heading">{model.make} {model.model} cost of ownership</h2><p>Purchase, financing, fuel, maintenance, insurance, registration, tires and resale are adjustable in one model-specific ownership view.</p></div></div>
        <CommuteSnapshot model={model} />
        <OwnershipCostCalculator model={forClient(model)} />
      </section>}

      <section id="maintenance" className="motorcycle-entity-section" aria-labelledby="maintenance-heading">
        <div className="section-head compact"><div><span className="section-kicker">Service</span><h2 id="maintenance-heading">{model.make} {model.model} maintenance schedule</h2><p>{maintenance ? "Model-specific intervals below are transcribed from the linked official owner-manual source." : "No exact model-specific schedule is published here until an official source is parsed; use the manufacturer resource instead."}</p></div></div>
        {maintenance ? <>
          <div className="entity-maintenance-table" role="table" aria-label={`${model.make} ${model.model} maintenance schedule`}>
            <div className="head" role="row"><span role="columnheader">Item</span><span role="columnheader">Action</span><span role="columnheader">Interval</span></div>
            {maintenance.items.map((item) => <div role="row" key={item.item}><span role="cell"><strong>{item.item}</strong>{item.note && <small>{item.note}</small>}</span><span role="cell">{item.action}</span><span role="cell">{item.interval}</span></div>)}
          </div>
          <div className="source-panel entity-source-panel"><span>Official maintenance source</span><h3>{maintenance.sourceLabel}</h3><p>Checked {maintenance.lastChecked}. Always confirm the schedule for your exact model year and market.</p><SourceRef url={maintenance.sourceUrl} label="Open official manual" /></div>
        </> : <div className="entity-alert-card subdued"><div><span>Exact schedule not stored</span><h3>Use the official service resource</h3><p>A generic oil, CVT, valve or coolant interval could be wrong for this model.</p></div>{serviceResource ? <a className="button small" href={serviceResource.url} target="_blank" rel="noreferrer">{serviceResource.label} ↗</a> : brandSupport?.serviceUrl ? <a className="button small" href={brandSupport.serviceUrl} target="_blank" rel="noreferrer">Official {model.make} service resource ↗</a> : null}</div>}
      </section>

      <section id="safety" className="motorcycle-entity-section" aria-labelledby="safety-heading">
        <div className="section-head compact"><div><span className="section-kicker">Recall + campaign checks</span><h2 id="safety-heading">{model.make} {model.model} recall and service-campaign resources</h2><p>VIN/frame-specific eligibility belongs with the manufacturer. An empty notice list is never treated as proof that no campaign applies.</p></div></div>
        {safetyNotices.length > 0 ? <div className="safety-notice-list entity-safety-list">{safetyNotices.map((notice) => <article key={`${notice.modelId}-${notice.publishedAt}`}><span>{notice.publishedAt}</span><h3>{notice.title}</h3><p>{notice.summary}</p><SourceRef url={notice.sourceUrl} label={`{notice.sourceLabel}`} /></article>)}</div> : <div className="note-box compact-note"><h3>No model-specific notice is listed here right now</h3><p>This does not prove that no recall, product update or service campaign applies to your motorcycle.</p></div>}
        {safetyResource && <div className="source-panel entity-source-panel"><span>Official campaign resource</span><h3>{safetyResource.label}</h3><p>{safetyResource.method}</p><small>Checked {safetyResource.lastChecked}</small><br/><SourceRef url={safetyResource.url} label="Open official resource" /></div>}
        {!safetyResource && brandSupport?.recallUrl && <div className="source-panel entity-source-panel"><span>Brand safety / owner resource</span><h3>{brandSupport.officialName}</h3><p>Use the official brand resource with the exact model year and VIN/frame number. MotoIndex does not infer recall status from an empty local notice list.</p><small>Checked {brandSupport.checkedAt}</small><br/><SourceRef url={brandSupport.recallUrl} label="Open official resource" /></div>}
      </section>

      {(brandSupport || authority) && <section id="research-quality" className="motorcycle-entity-section research-quality-section" aria-labelledby="research-quality-heading">
        <div className="section-head compact"><div><span className="section-kicker">Evidence + after-sales</span><h2 id="research-quality-heading">What MotoIndex knows — and what still needs checking</h2><p>Strong research pages should show their evidence depth, not hide missing data behind generated paragraphs.</p></div></div>
        <div className="research-quality-panel">
          <div className={`quality-score ${quality.grade}`}><span>Authority score</span><strong>{quality.score}<small>/100</small></strong><b>{quality.grade}</b><p>{quality.indexable ? "Passes the current expansion-page publication gate." : "Held from indexation until the hard gate is met."}</p></div>
          <article><span>Evidence present</span><ul>{quality.strengths.slice(0, 7).map((item) => <li key={item}>{item}</li>)}</ul></article>
          <article><span>Open research gaps</span><ul>{quality.gaps.slice(0, 7).map((item) => <li key={item}>{item}</li>)}</ul></article>
        </div>
        {brandSupport && <div className="ph-brand-support">
          <div><span>Philippine ownership support</span><h3>{brandSupport.officialName}</h3><p>{brandSupport.supportNote}</p><small>Resource check: {brandSupport.checkedAt}</small></div>
          <div className="ph-brand-support-links"><SourceRef url={brandSupport.officialUrl} label="Official brand" />{brandSupport.dealerUrl && <SourceRef url={brandSupport.dealerUrl} label="Dealer network" />}{brandSupport.serviceUrl && <SourceRef url={brandSupport.serviceUrl} label="Service / after-sales" />}{brandSupport.ownerUrl && <SourceRef url={brandSupport.ownerUrl} label="Owner resources" />}</div>
        </div>}
      </section>}

      <section id="used" className="motorcycle-entity-section" aria-labelledby="used-heading">
        <div className="section-head compact"><div><span className="section-kicker">Used market</span><h2 id="used-heading">Used {model.make} {model.model} price and value</h2><p>Listing samples and depreciation estimates are shown separately so a small sample is not mistaken for a live market appraisal.</p></div></div>
        {usedListings.length > 0 && <>
          <UsedMarketSummary modelId={model.id} />
          {!isPrevious && <div className="new-used-grid entity-new-used-grid"><article><span>New reference</span><strong>{observedMarketPriceLabel(model)}</strong><p>Dated current-model purchase-price basis.</p></article><article><span>Used median ask</span><strong>{php(usedSummary.medianPrice)}</strong><p>{usedSummary.included} listing samples after outlier filtering.</p></article><article className="difference"><span>Gap vs reference</span><strong>{php(Math.max(0, range.from - usedSummary.medianPrice))}</strong><p>Before transfer costs, repairs, financing differences and condition adjustments.</p></article></div>}
          <details className="entity-disclosure"><summary>Show used listing samples</summary><UsedListingTable items={usedListings} /></details>
        </>}
        <UsedValueCalculator model={forClient(model)} />
        <details className="entity-disclosure"><summary>Show illustrative depreciation table</summary><div className="depreciation-table"><div className="depreciation-row head"><span>Age</span><span>Fair</span><span>Good</span><span>Excellent</span></div>{usedCurve.map((row) => <div className="depreciation-row" key={row.age}><strong>{row.age} year{row.age === 1 ? "" : "s"}</strong><span>{php(row.fair)}</span><span>{php(row.good)}</span><span>{php(row.excellent)}</span></div>)}</div></details>
      </section>

      {!isPrevious && <section id="alternatives" className="motorcycle-entity-section" aria-labelledby="alternatives-heading"><div className="section-head compact"><div><span className="section-kicker">Cross-shopping</span><h2 id="alternatives-heading">Alternatives to the {model.make} {model.model}</h2><p>Similar current models are grouped by price, engine size, category, transmission and seat height.</p></div></div><SimilarMotorcycles model={model} /></section>}

      <section id="faq" className="motorcycle-entity-section"><FaqSection title={`${model.make} ${model.model} questions`} items={faqs} /></section>

      <section className="motorcycle-entity-section entity-page-footer-block"><ModelUpdateLog model={model} /><RelatedLinks title={`More ${model.model} research`} links={modelInternalLinks(model)} /></section>
    </div>

    <JsonLd data={schema} />
  </article>;
}

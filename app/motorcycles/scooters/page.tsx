import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { CTAGroup, DataTable, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import { observedMarketPriceLabel, observedMarketRange } from "@/lib/marketChecks";
import {
  currentScooters,
  hasAbs,
  marketBrandCount,
  marketMedianPrice,
  marketPriceSpan,
  priceOrdered
} from "@/lib/motorcycleMarket";
import { pageMetadata, SITE_URL } from "@/lib/site";
import { php } from "@/lib/utils";
import styles from "./ScootersPage.module.css";

const scooters = priceOrdered(currentScooters);
const priceSpan = marketPriceSpan(scooters);
const medianPrice = marketMedianPrice(scooters);
const under100k = scooters.filter((model) => observedMarketRange(model).from < 100000).length;
const class125 = scooters.filter((model) => model.engineCc >= 100 && model.engineCc <= 125).length;
const class150 = scooters.filter((model) => model.engineCc >= 140 && model.engineCc <= 155).length;
const class155 = scooters.filter((model) => model.engineCc === 155).length;
const class160 = scooters.filter((model) => model.engineCc >= 156 && model.engineCc <= 165).length;
const absModels = scooters.filter(hasAbs).length;
const tableColumns: CSSProperties = {
  gridTemplateColumns: "1.6fr 1.15fr .6fr .6fr .6fr 1.3fr"
};
const decisionGridStyle: CSSProperties = {
  gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))",
  gap: "var(--mi-space-3)"
};
const decisionCardStyle: CSSProperties = {
  minHeight: 0,
  padding: "var(--mi-space-4)"
};

export const metadata: Metadata = pageMetadata({
  title: "Scooter Price Philippines 2026: Models & Price List",
  description: "Compare scooter prices in the Philippines for 2026. See current models from Honda, Yamaha, Suzuki, Kymco and more, with 125cc, 150cc, 155cc and 160cc guides.",
  path: "/motorcycles/scooters",
  index: scooters.length >= 5,
  image: "/media/motorcycles/honda-beat.webp",
  imageAlt: "Honda BeAT Premium scooter in Pearl Arctic White",
  imageWidth: 1200,
  imageHeight: 1200
});

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Scooters in the Philippines",
  numberOfItems: scooters.length,
  itemListElement: scooters.map((model, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${model.make} ${model.model}`,
    url: `${SITE_URL}/motorcycles/${model.makeSlug}/${model.slug}`
  }))
};

const childClusters = [
  { href: "/recommendations/best-scooters-philippines", label: "Best scooters to compare", note: "Editorial comparison by price, rider fit, braking, fuel data and everyday use" },
  { href: "/recommendations/125cc-scooters-philippines", label: "125cc scooters", note: `${class125} current models in the 100–125cc band` },
  { href: "/recommendations/150cc-scooters-philippines", label: "150cc-class scooters", note: `${class150} current models in the broad 140–155cc market class` },
  { href: "/recommendations/155cc-scooters-philippines", label: "155cc scooters", note: `${class155} current models recorded at exactly 155cc` },
  { href: "/recommendations/160cc-scooters-philippines", label: "160cc scooters", note: `${class160} current models in the 156–165cc band` },
  { href: "/recommendations/maxi-scooters-philippines", label: "Maxi scooters", note: "Larger scooter and touring-oriented choices" },
  { href: "/recommendations/honda-scooters-philippines", label: "Honda scooters", note: "Current Honda scooter research and prices" },
  { href: "/recommendations/yamaha-scooters-philippines", label: "Yamaha scooters", note: "Current Yamaha scooter research and prices" },
  { href: "/recommendations/suzuki-scooters-philippines", label: "Suzuki scooters", note: "Current Suzuki scooter research and prices" }
];

const priceResearchLinks = [
  { href: "/motorcycles/yamaha/nmax", label: "Yamaha NMAX price Philippines", note: "V1, V2 and current V3 price context in one family hub" },
  { href: "/motorcycles/yamaha/aerox", label: "Yamaha Aerox price Philippines", note: "V1, V2 and current V3 / SP price context" },
  { href: "/motorcycles/honda/click", label: "Honda Click price Philippines", note: "Click 125i, 150i and 160 family comparison" },
  { href: "/motorcycles/honda/adv-160", label: "Honda ADV160 price Philippines", note: "ABS vs RoadSync price and ownership research" },
  { href: "/motorcycles/honda/pcx-160", label: "Honda PCX160 price Philippines", note: "Standard vs RoadSync price and equipment" },
  { href: "/motorcycles/yamaha/fazzio", label: "Yamaha Fazzio price Philippines", note: "Current price, fit and monthly-payment planning" },
  { href: "/motorcycles/yamaha/xmax", label: "Yamaha XMAX price Philippines", note: "Current maxi-scooter price and ownership costs" },
  { href: "/motorcycles/honda/beat", label: "Honda BeAT price Philippines", note: "Playful vs Premium price and commuter data" },
  { href: "/motorcycles/honda/navi", label: "Honda Navi price Philippines", note: "Current compact automatic price and ownership context" }
] as const;

export default function ScootersPage() {
  return <main className="page">
    <div className="shell">
      <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Scooters" }]} />
      <section className={styles.hero} data-mockup-scooter-hero>
        <div className={styles.heroCopy}>
          <span>Motorcycles · Scooter</span>
          <h1>Scooter Motorcycles<br/>in the Philippines</h1>
          <p>Explore the latest scooter models, compare prices, specs and find the right scooter for your daily ride.</p>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.cityBackdrop} aria-hidden="true"/>
          {scooters[0]&&<EntityMedia entityType="motorcycle" entityId={scooters[0].id} className={styles.heroBike} showCredit={false} priority sizes="(max-width: 800px) 80vw, 34vw" fallback={<EntityVerificationFallback brand={scooters[0].make} model={scooters[0].model}/>} />}
        </div>
      </section>
      <nav className={styles.mockFilters} aria-label="Scooter catalog filters">
        <Link href="/motorcycles/scooters">All Brands⌄</Link>
        <Link href="/recommendations#budget">Price Range⌄</Link>
        <Link href="/recommendations/155cc-scooters-philippines">Engine CC⌄</Link>
        <Link href="/recommendations/motorcycles-with-abs-philippines">Features⌄</Link>
        <Link className={styles.reset} href="/motorcycles/scooters">Reset</Link>
      </nav>
      <div className={styles.catalogMeta}><strong>{scooters.length} scooter models</strong><span>Sort by: <b>Latest⌄</b></span></div>
      <div className={styles.modelGrid} data-mockup-scooter-grid>
        {scooters.slice(0,12).map((model)=><MotorcycleCard key={model.id} model={model} variant="reference" />)}
      </div>

      <section className="section" aria-labelledby="scooter-price-philippines">
        <SectionHeader
          kicker="2026 price guide"
          title="How much is a scooter in the Philippines?"
          titleId="scooter-price-philippines"
          description={priceSpan.low && priceSpan.high
            ? `Current tracked scooter prices run from ${php(priceSpan.low)} to ${php(priceSpan.high)}, with a median observed starting price of ${medianPrice ? php(medianPrice) : "updating"} across the current indexable set.`
            : "Use the current price list below to compare Philippine scooter models by observed starting price."}
        />
        <div className="ui-content-grid">
          <InfoPanel subtle><h3>Budget scooters under ₱100K</h3><p>{under100k} current scooter records start below ₱100,000. Compare them in the price list or open the <Link href="/recommendations/motorcycles-under-100k">under-₱100K guide</Link>.</p></InfoPanel>
          <InfoPanel subtle><h3>125cc scooters</h3><p>{class125} current models fall in the 100–125cc band, covering many commuter-focused choices. See the <Link href="/recommendations/125cc-scooters-philippines">125cc scooter comparison</Link>.</p></InfoPanel>
          <InfoPanel subtle><h3>150cc, 155cc and 160cc scooters</h3><p>Use the broad <Link href="/recommendations/150cc-scooters-philippines">150cc-class guide</Link>, the <Link href="/recommendations/155cc-scooters-philippines">exact 155cc comparison</Link>, or the <Link href="/recommendations/160cc-scooters-philippines">160cc guide</Link> to keep nearby engine-size intent separate.</p></InfoPanel>
        </div>
      </section>

      <section className="section" aria-labelledby="scooter-market-snapshot">
        <SectionHeader
          kicker="Current market"
          title="Scooter market snapshot"
          titleId="scooter-market-snapshot"
          description="Calculated from current indexable scooter records and observed starting prices. Historical and unverified models are excluded."
        />
        <StatRow items={[
          { label: "Current scooters", value: scooters.length, note: "Current indexable models" },
          { label: "Brands", value: marketBrandCount(scooters), note: "Brands represented" },
          { label: "Median starting price", value: medianPrice ? php(medianPrice) : "Updating", note: "Median observed entry price" },
          { label: "Below ₱100K", value: under100k, note: "Current scooter records" },
          { label: "ABS listed", value: absModels, note: "At least one ABS-equipped configuration" }
        ]} />
      </section>

      <section className="section" aria-labelledby="scooter-clusters" data-scooter-decision-section>
        <SectionHeader
          kicker="Narrow the market"
          title="Find the right scooter faster"
          titleId="scooter-clusters"
          description="Start with a shortlist, jump to the right engine-size or brand guide, or estimate monthly payments before opening the full price list."
        />
        <div className="ui-content-grid" style={decisionGridStyle} data-scooter-decision-grid>
          <Link href="/recommendations/best-scooters-philippines" className="ui-content-card" style={decisionCardStyle} data-scooter-decision-card>
            <span className="section-kicker">01 · Shortlist</span>
            <h3>Compare the strongest scooter options</h3>
            <p>Review current scooters by price, rider fit, braking and fuel data.</p>
          </Link>
          <a href="#scooter-shortcuts" className="ui-content-card" style={decisionCardStyle} data-scooter-decision-card>
            <span className="section-kicker">02 · Narrow it down</span>
            <h3>Browse by engine size or brand</h3>
            <p>Jump to 125cc, broad 150cc-class, exact 155cc, 160cc, Honda, Yamaha or Suzuki research.</p>
          </a>
          <Link href="/tools/motorcycle-loan-calculator" className="ui-content-card" style={decisionCardStyle} data-scooter-decision-card>
            <span className="section-kicker">03 · Affordability</span>
            <h3>Estimate your monthly payment</h3>
            <p>Calculate payments using the exact bike price, down payment, term and rate.</p>
          </Link>
        </div>
        <div id="scooter-shortcuts">
          <CTAGroup>
            {childClusters.slice(1).map((cluster) => <Link href={cluster.href} key={cluster.href} className="button ghost small" data-scooter-shortcut-link>{cluster.label}</Link>)}
          </CTAGroup>
        </div>
      </section>

      <section id="scooter-price-list" className="section" aria-labelledby="scooter-price-list-title">
        <SectionHeader
          kicker="Price list"
          title="Current scooter prices and key specifications"
          titleId="scooter-price-list-title"
          description={priceSpan.low && priceSpan.high
            ? `Observed starting-to-high price coverage currently spans ${php(priceSpan.low)} to ${php(priceSpan.high)}. Rows are ordered by observed starting price, not by an overall quality ranking.`
            : "Rows are ordered by observed starting price, not by an overall quality ranking."}
        />
        <DataTable label="Current scooter prices and specifications">
          <div className="head" role="row" style={tableColumns}>
            <span>Model</span><span>Price</span><span>Engine</span><span>Seat</span><span>Weight</span><span>Braking</span>
          </div>
          {scooters.map((model) => <div role="row" style={tableColumns} key={model.id}>
            <span role="cell"><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}><strong>{model.make} {model.model}</strong></Link><br /><small>{model.category}</small></span>
            <span role="cell"><strong>{observedMarketPriceLabel(model)}</strong><br /><small>Checked {model.marketPriceCheckedAt || model.verifiedAt}</small></span>
            <span role="cell">{model.engineCc} cc</span>
            <span role="cell">{model.seatHeightMm} mm</span>
            <span role="cell">{model.curbWeightKg} kg</span>
            <span role="cell">{model.abs}</span>
          </div>)}
        </DataTable>
      </section>

      <section className="section" aria-labelledby="scooter-decision-paths">
        <SectionHeader
          kicker="Buyer paths"
          title="Use the scooter data for a specific decision"
          titleId="scooter-decision-paths"
          description="The broad scooter hub connects into narrower questions that already have dedicated MotoIndex research."
        />
        <div className="ui-content-grid">
          <Link href="/recommendations/motorcycles-under-100k" className="ui-content-card"><h3>Budget scooters</h3><p>Start with motorcycles below ₱100K and compare the automatic options.</p></Link>
          <Link href="/recommendations/automatic-motorcycles-philippines" className="ui-content-card"><h3>Automatic motorcycles</h3><p>Compare all current automatic records, including scooters and non-scooter automatics.</p></Link>
          <Link href="/recommendations/fuel-efficient-motorcycles-philippines" className="ui-content-card"><h3>Fuel economy</h3><p>Compare models with published fuel-consumption figures in the dataset.</p></Link>
          <Link href="/recommendations/best-motorcycles-for-short-riders" className="ui-content-card"><h3>Lower seat heights</h3><p>Use published seat height and curb weight as measurable fit starting points.</p></Link>
        </div>
      </section>

      <section className="section" aria-labelledby="popular-scooter-price-research">
        <SectionHeader
          kicker="Popular price research"
          title="Open the exact scooter or family price page"
          titleId="popular-scooter-price-research"
          description="High-volume price searches stay on the canonical family or model page instead of being split across thin /price URLs."
        />
        <div className="ui-content-grid">
          {priceResearchLinks.map((item) => <Link href={item.href} className="ui-content-card" key={item.href}>
            <h3>{item.label}</h3>
            <p>{item.note}</p>
          </Link>)}
        </div>
      </section>

      <section className="section" aria-labelledby="scooter-methodology">
        <SectionHeader
          kicker="How this page works"
          title="One market hub, model-level evidence"
          titleId="scooter-methodology"
          description="MotoIndex keeps the category comparison here while each model page carries its detailed price, specifications, colors, installment context and fitment evidence."
        />
        <div className="ui-content-grid">
          <InfoPanel subtle><h3>What counts as a current scooter?</h3><p>The model must be indexable, currently marketed in the MotoIndex dataset and have a scooter category such as commuter, sport, premium, adventure, lifestyle or maxi scooter.</p></InfoPanel>
          <InfoPanel subtle><h3>How prices are handled</h3><p>The table uses the observed market-price range attached to each model. Where a model has multiple current trims, the range stays visible instead of averaging them into one artificial price.</p></InfoPanel>
          <InfoPanel subtle><h3>Where the evidence lives</h3><p>Each model keeps its own dated manufacturer, dealer or other source record. Review the <Link href="/methodology">methodology</Link> and <Link href="/data-sources">data sources</Link> for publication and correction rules.</p></InfoPanel>
          <InfoPanel subtle><h3>What the data cannot decide</h3><p>Specifications cannot fully measure comfort, handling, rider confidence or dealer experience. Use the data to shortlist, then verify fit and the exact unit before buying.</p></InfoPanel>
        </div>
      </section>

      <FaqSection title="Scooter price Philippines FAQ" items={[
        { question: "How much are scooters in the Philippines in 2026?", answer: priceSpan.low && priceSpan.high ? `Current MotoIndex records span ${php(priceSpan.low)} to ${php(priceSpan.high)} across the tracked scooter market. Dealer cash prices, promotions, registration and financing can change the final amount.` : "Prices vary by model and dealer. Use the current price list above for the latest tracked Philippine references." },
        { question: "What is the cheapest scooter currently tracked?", answer: scooters[0] ? `${scooters[0].make} ${scooters[0].model} is currently the lowest-priced scooter in this price-ordered set at ${observedMarketPriceLabel(scooters[0])}.` : "The lowest-priced current scooter changes as market records are updated." },
        { question: "Which scooter engine sizes are common in the Philippines?", answer: "The current MotoIndex set includes many 125cc, 150cc-class, exact 155cc and 160cc scooters, plus larger maxi scooters. Use the engine-size guides to compare models within a tighter class." },
        { question: "Are scooter prices on MotoIndex dealer quotes?", answer: "No. MotoIndex publishes dated model-level price references for research. Confirm the exact variant, cash price, registration, insurance, promotions and financing with the seller before buying." }
      ]} />

      <JsonLd data={itemListSchema} />
    </div>
  </main>;
}

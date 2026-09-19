import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
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

const scooters = priceOrdered(currentScooters);
const priceSpan = marketPriceSpan(scooters);
const medianPrice = marketMedianPrice(scooters);
const under100k = scooters.filter((model) => observedMarketRange(model).from < 100000).length;
const class125 = scooters.filter((model) => model.engineCc >= 100 && model.engineCc <= 125).length;
const class150 = scooters.filter((model) => model.engineCc >= 140 && model.engineCc <= 155).length;
const class160 = scooters.filter((model) => model.engineCc >= 156 && model.engineCc <= 165).length;
const absModels = scooters.filter(hasAbs).length;
const tableColumns: CSSProperties = {
  gridTemplateColumns: "minmax(220px,1.5fr) minmax(150px,1.1fr) .62fr .62fr .62fr minmax(210px,1.25fr)"
};

export const metadata: Metadata = pageMetadata({
  title: "Scooters Philippines 2026: Prices & Models | MotoIndex",
  description: "Compare current scooters in the Philippines by price, engine size, weight, seat height, ABS and fuel data, with links to 125cc, 150cc and 160cc guides.",
  path: "/motorcycles/scooters",
  index: scooters.length >= 5
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
  { href: "/recommendations/125cc-scooters-philippines", label: "125cc scooters", note: `${class125} current models in the 100–125cc band` },
  { href: "/recommendations/150cc-scooters-philippines", label: "150cc & 155cc scooters", note: `${class150} current models in the 140–155cc band` },
  { href: "/recommendations/160cc-scooters-philippines", label: "160cc scooters", note: `${class160} current models in the 156–165cc band` },
  { href: "/recommendations/maxi-scooters-philippines", label: "Maxi scooters", note: "Larger scooter and touring-oriented choices" },
  { href: "/recommendations/honda-scooters-philippines", label: "Honda scooters", note: "Current Honda scooter research and prices" },
  { href: "/recommendations/yamaha-scooters-philippines", label: "Yamaha scooters", note: "Current Yamaha scooter research and prices" }
];

export default function ScootersPage() {
  return <main className="page">
    <div className="shell">
      <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Scooters" }]} />
      <PageHero
        kicker="National scooter research hub"
        title="Scooters in the Philippines"
        description="Compare current scooter prices and specifications from the same model-level records used across MotoIndex. Use this page for the full market, then narrow by engine size, brand, budget or rider need."
        actions={<CTAGroup>
          <a className="button" href="#scooter-price-list">View scooter price list</a>
          <Link className="button secondary" href="/finder">Find a motorcycle</Link>
          <Link className="button secondary" href="/compare">Compare models</Link>
        </CTAGroup>}
      />

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

      <section className="section" aria-labelledby="scooter-clusters">
        <SectionHeader
          kicker="Narrow the market"
          title="Compare scooters by engine size and brand"
          titleId="scooter-clusters"
          description="These child guides answer narrower buying questions without splitting model details across separate pages."
        />
        <div className="ui-content-grid">
          {childClusters.map((cluster) => <Link href={cluster.href} key={cluster.href} className="ui-content-card">
            <h3>{cluster.label}</h3>
            <p>{cluster.note}</p>
          </Link>)}
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

      <JsonLd data={itemListSchema} />
    </div>
  </main>;
}

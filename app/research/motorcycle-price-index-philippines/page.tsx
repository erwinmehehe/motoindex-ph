import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { PRICE_INDEX_BASELINE_DATE, PRICE_INDEX_METHOD_VERSION, latestResearchCheck, median, researchBrandPriceBenchmarks, researchBudgetBands, researchPriceRows, researchPriceSegments } from "@/lib/researchData";
import { php, phpRange } from "@/lib/utils";
import { EntityMedia } from "@/components/EntityMedia";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../research-detail.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Price Index Philippines 2026 | Prices & Data",
  description: "Compare current motorcycle prices in the Philippines with segment medians, brand benchmarks, budget bands, source dates and a downloadable CSV dataset.",
  path: "/research/motorcycle-price-index-philippines"
});

export default function MotorcyclePriceIndexPage() {
  const rows = researchPriceRows();
  const prices = rows.map((row) => row.fromPhp);
  const medianPrice = Math.round(median(prices));
  const segments = researchPriceSegments();
  const brands = researchBrandPriceBenchmarks();
  const budgetBands = researchBudgetBands();
  const scooterSegment = segments.find((segment) => segment.label === "Scooters");
  const bigBikeSegment = segments.find((segment) => segment.label === "400cc+ motorcycles");
  const lowest = rows[0];
  const highest = [...rows].sort((a, b) => b.fromPhp - a.fromPhp)[0];
  const checkedAt = latestResearchCheck();
  const path = "/research/motorcycle-price-index-philippines";
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "MotoIndex Philippine Motorcycle Price Index 2026",
    description: "Published starting-price references for current, indexable motorcycles in the MotoIndex Philippine catalog.",
    url: absoluteUrl(path),
    dateModified: checkedAt,
    creator: { "@type": "Organization", name: "MotoIndex PH", url: absoluteUrl("/") },
    spatialCoverage: { "@type": "Place", name: "Philippines" },
    variableMeasured: ["Published starting price", "Engine displacement", "Motorcycle category", "Price source check date"],
    version: PRICE_INDEX_METHOD_VERSION,
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: absoluteUrl(`${path}/data.csv`)
    }
  };

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research", href: "/research" }, { label: "Motorcycle price index" }]} />
    <PageHero
      kicker="MotoIndex original price research"
      title="Motorcycle price index Philippines 2026"
      description="Compare current Philippine motorcycle price references by market segment, brand and budget band. Download the same source-led model table used to calculate the benchmarks."
      actions={<CTAGroup>
        <a className="button" href="/research/motorcycle-price-index-philippines/data.csv">Download CSV</a>
        <Link className="button secondary" href="/methodology">Read methodology</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      {label:"Current models",value:String(rows.length),note:"Indexable Philippine-market records"},
      {label:"Median starting price",value:php(medianPrice),note:"Median across the current dataset"},
      {label:"Scooter median",value:scooterSegment?php(scooterSegment.medianPhp):"—",note:scooterSegment?`${scooterSegment.count} current scooter records`:"No qualifying records"},
      {label:"400cc+ median",value:bigBikeSegment?php(bigBikeSegment.medianPhp):"—",note:bigBikeSegment?`${bigBikeSegment.count} current 400cc+ records`:"No qualifying records"}
    ]} />

    <section className="section" aria-labelledby="price-index-segments">
      <SectionHeader
        kicker="Current market benchmark"
        title="Median motorcycle prices by segment"
        titleId="price-index-segments"
        description="Each benchmark uses the published starting price for the current indexable MotoIndex records in that segment. These are dataset medians, not national sales-weighted averages."
      />
      <div className="ui-content-grid">
        {segments.map((segment) => <article className="ui-content-card" key={segment.label}>
          <h3>{segment.label}</h3>
          <p><strong>{php(segment.medianPhp)}</strong> median starting price across {segment.count} current {segment.count===1?"record":"records"}.</p>
          <small>{segment.count ? `${php(segment.minPhp)} to ${php(segment.maxPhp)} in the current dataset` : "No qualifying current records"}</small>
        </article>)}
      </div>
    </section>

    <section className="section" aria-labelledby="price-budget-distribution">
      <SectionHeader
        kicker="Budget distribution"
        title="How the current catalog is distributed by starting price"
        titleId="price-budget-distribution"
        description="Counts use one published starting-price reference per current model so higher trims do not inflate the number of motorcycles in a budget band."
      />
      <div className="entity-price-grid">
        {budgetBands.map((band) => <article key={band.label}><span>{band.label}</span><strong>{band.count}</strong><small>current model{band.count===1?"":"s"}</small></article>)}
      </div>
    </section>

    {brands.length > 0 && <section className="section" aria-labelledby="brand-price-benchmarks">
      <SectionHeader
        kicker="Brand benchmark"
        title="Median starting prices for brands with at least three current models"
        titleId="brand-price-benchmarks"
        description="This is a within-MotoIndex catalog comparison, not a ranking of value, quality or popularity."
      />
      <DataTable label="Brand median motorcycle prices in the Philippines">
        <div className="head" role="row"><span>Brand</span><span>Models</span><span>Median</span><span>Dataset span</span><span>Brand page</span></div>
        {brands.map((row) => <Link role="row" href={`/motorcycles/${row.make.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`} key={row.make}>
          <strong>{row.make}</strong><span>{row.count}</span><span>{php(row.medianPhp)}</span><span>{php(row.minPhp)}–{php(row.maxPhp)}</span><span>Open →</span>
        </Link>)}
      </DataTable>
    </section>}

    <section className="section split" aria-labelledby="price-index-baseline">
      <div>
        <span className="section-kicker">Baseline publication</span>
        <h2 id="price-index-baseline">This is the starting point for future price movement tracking</h2>
        <p>MotoIndex records this methodology as baseline {PRICE_INDEX_METHOD_VERSION} on {PRICE_INDEX_BASELINE_DATE}. The page does not claim month-over-month movement yet because a second comparable monthly snapshot has not been published under the same method.</p>
        <p>Future updates can add model and segment movement only when both periods use the same inclusion rules and price basis.</p>
      </div>
      <div className="info-card">
        <h3>Downloadable fields</h3>
        <ul className="checklist"><li>Make and model</li><li>Canonical MotoIndex URL</li><li>Category and engine size</li><li>Starting and upper price references</li><li>Seat height and curb weight</li><li>Latest represented check date</li><li>Core and price source URLs</li></ul>
        <a className="text-link" href="/research/motorcycle-price-index-philippines/data.csv">Download current CSV →</a>
      </div>
    </section>

    {lowest && highest && <section className="section split" aria-labelledby="price-index-context">
      <div><span className="section-kicker">Price span</span><h2 id="price-index-context">What does the current MotoIndex dataset cover?</h2><p>The lowest published starting-price record in this dataset is <strong>{lowest.model.make} {lowest.model.model}</strong> at {php(lowest.fromPhp)}. The highest starting-price record is <strong>{highest.model.make} {highest.model.model}</strong> at {php(highest.fromPhp)}.</p><p>This is not a claim about every motorcycle sold in the Philippines. It describes the current public MotoIndex dataset after model-quality and freshness gates.</p></div>
      <div className="info-card"><h3>Price methodology</h3><ul className="checklist"><li>Current, indexable models only</li><li>Published starting-price basis for cross-model comparison</li><li>Variant ranges remain visible on the model page</li><li>Dealer fees, promotions and local availability can differ</li><li>Latest represented source check: {checkedAt}</li></ul></div>
    </section>}

    <section className="section" aria-labelledby="price-index-table">
      <div className="section-head compact"><div><span className="section-kicker">Current price database</span><h2 id="price-index-table">Motorcycle prices tracked by MotoIndex</h2><p>Open any model to check variants, financing estimates and the dated evidence behind the amount.</p></div><Link href="/recommendations#budget">Browse budget buying guidance →</Link></div>
      <div className={styles.visualTable} role="table" aria-label="MotoIndex Philippine motorcycle price index">
        <div className={styles.tableHead} role="row"><span>Motorcycle</span><span>Published price</span><span>Engine</span><span>Category</span><span>Checked</span></div>
        {rows.map(({ model, fromPhp, toPhp, checkedAt: modelCheckedAt }) => <Link className={styles.tableRow} role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id}><span className={styles.modelCell}><EntityMedia entityType="motorcycle" entityId={model.id} fallback={<span className={styles.mediaFallback}>{model.make.slice(0,1)}</span>} showCredit={false}/><strong>{model.make} {model.model}</strong></span><b>{phpRange(fromPhp, toPhp)}</b><span>{model.engineCc} cc</span><span>{model.category}</span><span>{modelCheckedAt} →</span></Link>)}
      </div>
    </section>

    <div className="note-box"><h2>Use price as a starting point, not the whole decision</h2><p>A lower starting price does not make one motorcycle a better choice. Compare rider fit, braking equipment, weight, ownership costs, dealer support and the exact variant before buying.</p><Link className="text-link" href="/tools/motorcycle-loan-calculator">Open motorcycle loan calculator →</Link></div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

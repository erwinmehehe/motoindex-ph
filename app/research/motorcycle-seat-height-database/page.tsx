import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchSeatRows } from "@/lib/researchData";
import { phpRange } from "@/lib/utils";
import { EntityMedia } from "@/components/EntityMedia";
import { CTAGroup, DataTable, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../research-detail.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Seat Height Philippines 2026 | MotoIndex",
  description: "Compare motorcycle seat heights in the Philippines with curb weight, price and category data, plus lower-seat shortlists and rider-fit tools.",
  path: "/research/motorcycle-seat-height-database"
});

const tableColumns: CSSProperties = {
  gridTemplateColumns: "minmax(270px,1.6fr) minmax(100px,.65fr) minmax(100px,.65fr) minmax(130px,.8fr)"
};

export default function MotorcycleSeatHeightDatabasePage() {
  const rows = researchSeatRows();
  const heights = rows.map(({ model }) => model.seatHeightMm);
  const medianSeat = Math.round(median(heights));
  const lowerSeat = rows.filter(({ model }) => model.seatHeightMm <= 760);
  const middleSeat = rows.filter(({ model }) => model.seatHeightMm > 760 && model.seatHeightMm <= 800);
  const tallerSeat = rows.filter(({ model }) => model.seatHeightMm > 800);
  const lowerSeatLightest = [...lowerSeat].sort((a, b) => a.model.curbWeightKg - b.model.curbWeightKg || a.model.seatHeightMm - b.model.seatHeightMm).slice(0, 5);
  const automaticLowerSeat = rows
    .filter(({ model }) => model.transmission === "Automatic" && model.seatHeightMm <= 780)
    .sort((a, b) => a.model.seatHeightMm - b.model.seatHeightMm || a.model.curbWeightKg - b.model.curbWeightKg)
    .slice(0, 5);
  const lowestFive = rows.slice(0, 5);
  const lowest = rows[0];
  const highest = rows.at(-1);
  const checkedAt = latestResearchCheck();
  const path = "/research/motorcycle-seat-height-database";
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "MotoIndex Philippine Motorcycle Seat Height Database",
    description: "Published seat heights, curb weights, categories and price references for current motorcycles in the MotoIndex Philippine catalog.",
    url: absoluteUrl(path),
    dateModified: checkedAt,
    creator: { "@type": "Organization", name: "MotoIndex PH", url: absoluteUrl("/") },
    spatialCoverage: { "@type": "Place", name: "Philippines" },
    variableMeasured: ["Seat height", "Curb weight", "Published starting price", "Motorcycle category"]
  };

  const shortlist = (items: typeof rows) => <ol>
    {items.map(({ model, range }) => <li key={model.id}>
      <Link href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`}><strong>{model.make} {model.model}</strong></Link>
      <small> · {model.seatHeightMm} mm · {model.curbWeightKg} kg · {phpRange(range.from, range.to)}</small>
    </li>)}
  </ol>;

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research", href: "/research" }, { label: "Seat-height database" }]} />
    <PageHero
      kicker="Rider-fit data"
      title="Motorcycle seat height database Philippines"
      description="Compare published seat height with curb weight, category and price before you shortlist a motorcycle. Use the numbers to narrow the field, then check your inseam and sit on the exact bike when possible."
      actions={<CTAGroup>
        <a className="button" href="#seat-height-table">Browse full database</a>
        <Link className="button secondary" href="/recommendations#rider-fit">Lower-seat guidance</Link>
        <Link className="button secondary" href="/finder">Find a motorcycle</Link>
      </CTAGroup>}
    />

    <StatRow items={[
      {label:"Current models",value:String(rows.length),note:"Current indexable records"},
      {label:"Median seat height",value:`${medianSeat} mm`,note:"Across the current dataset"},
      {label:"760 mm or lower",value:String(lowerSeat.length),note:"Lower-seat starting pool"},
      {label:"Lowest recorded",value:lowest?`${lowest.model.seatHeightMm} mm`:"—",note:lowest?`${lowest.model.make} ${lowest.model.model}`:""}
    ]} />

    <section className="section" aria-labelledby="seat-fit-bands">
      <SectionHeader
        kicker="Start with a range"
        title="Use seat-height bands to narrow the market"
        titleId="seat-fit-bands"
        description="These bands are navigation aids, not fit guarantees. Seat width, suspension sag, motorcycle weight and your inseam can change how tall the same published number feels."
      />
      <div className="ui-content-grid">
        <a href="#seat-height-table" className="ui-content-card">
          <h3>760 mm and below</h3>
          <p>{lowerSeat.length} current models. A useful first pool when easier ground reach is the priority.</p>
        </a>
        <a href="#seat-height-table" className="ui-content-card">
          <h3>761 to 800 mm</h3>
          <p>{middleSeat.length} current models across scooters, road bikes and other everyday categories.</p>
        </a>
        <a href="#seat-height-table" className="ui-content-card">
          <h3>Above 800 mm</h3>
          <p>{tallerSeat.length} current models, including many adventure, dual-sport and performance-focused motorcycles.</p>
        </a>
      </div>
    </section>

    {lowest && highest && <section className="section split" aria-labelledby="seat-height-method">
      <div>
        <span className="section-kicker">Fit context</span>
        <h2 id="seat-height-method">Seat height is not the same as rider fit</h2>
        <p>The current database spans from {lowest.model.seatHeightMm} mm on the {lowest.model.make} {lowest.model.model} to {highest.model.seatHeightMm} mm on the {highest.model.make} {highest.model.model}. That range helps narrow choices, but it does not measure seat width, balance or how much the suspension compresses under a rider.</p>
        <p>Use the database to build a shortlist, then compare inseam, curb weight and the exact motorcycle in person when possible.</p>
      </div>
      <div className="info-card">
        <h3>Check these measurements together</h3>
        <ul className="checklist">
          <li>Published seat height</li>
          <li>Your actual inseam</li>
          <li>Curb weight and balance</li>
          <li>Seat width and shape</li>
          <li>Suspension sag</li>
          <li>Footwear and low-speed confidence</li>
        </ul>
      </div>
    </section>}

    <section className="section" aria-labelledby="seat-height-shortlists">
      <SectionHeader
        kicker="Quick factual shortlists"
        title="Three ways to scan the lower-seat end of the database"
        titleId="seat-height-shortlists"
        description="These are direct sorts of the current dataset, not overall motorcycle rankings."
      />
      <div className="ui-content-grid">
        <article className="ui-content-card"><h3>Five lowest seat heights</h3><p>Sorted by published seat height from lowest upward.</p>{shortlist(lowestFive)}</article>
        <article className="ui-content-card"><h3>Lighter bikes at 760 mm or below</h3><p>Lower-seat models sorted by curb weight.</p>{shortlist(lowerSeatLightest)}</article>
        <article className="ui-content-card"><h3>Automatic models at 780 mm or below</h3><p>Automatic motorcycles sorted by published seat height.</p>{shortlist(automaticLowerSeat)}</article>
      </div>
    </section>

    <section id="seat-height-table" className="section" aria-labelledby="seat-height-table-title">
      <SectionHeader
        kicker="Full database · low to high"
        title="Current motorcycle seat heights"
        titleId="seat-height-table-title"
        description="Price is included only to help compare the complete shortlist. Open a model page for the exact price source, financing estimate and rider-fit calculator."
        aside={<Link href="/recommendations#rider-fit">Rider-fit buying guidance →</Link>}
      />
      <p><small>Last research check: {checkedAt}</small></p>
      <DataTable label="Motorcycle seat heights in the Philippines">
        <div className="head" role="row" style={tableColumns}><span>Motorcycle</span><span>Seat height</span><span>Curb weight</span><span>Price</span></div>
        {rows.map(({ model, range }) => <Link role="row" style={tableColumns} href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`} key={model.id}>
          <span className={styles.modelCell}><EntityMedia entityType="motorcycle" entityId={model.id} fallback={<span className={styles.mediaFallback}>{model.make.slice(0,1)}</span>} showCredit={false}/><span><strong>{model.make} {model.model}</strong><small>{model.category}</small></span></span>
          <strong>{model.seatHeightMm} mm</strong>
          <span>{model.curbWeightKg} kg</span>
          <span>{phpRange(range.from, range.to)} →</span>
        </Link>)}
      </DataTable>
    </section>

    <div className="note-box">
      <h2>Need a personal fit estimate?</h2>
      <p>The finder and each model page combine seat height with other motorcycle data to help narrow choices. They still cannot replace an in-person fit check.</p>
      <CTAGroup><Link className="button" href="/finder">Open motorcycle finder</Link><Link className="button secondary" href="/recommendations#rider-fit">See rider-fit guidance</Link></CTAGroup>
    </div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

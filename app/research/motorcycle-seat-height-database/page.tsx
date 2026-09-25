import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchSeatRows } from "@/lib/researchData";
import { phpRange } from "@/lib/utils";
import { EntityMedia } from "@/components/EntityMedia";
import { CTAGroup, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../research-detail.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Seat Height Philippines 2026 | MotoIndex",
  description: "Compare motorcycle seat heights in the Philippines with curb weight, price and category data, plus lower-seat shortlists and rider-fit tools.",
  path: "/research/motorcycle-seat-height-database"
});

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

  const shortlist = (items: typeof rows) => items.map(({ model, range }) => (
    <Link className={styles.shortlistRow} href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`} key={model.id}>
      <EntityMedia entityType="motorcycle" entityId={model.id} fallback={<span className={styles.mediaFallback}>{model.make.slice(0,1)}</span>} showCredit={false} />
      <span><strong>{model.make} {model.model}</strong><small>{model.seatHeightMm} mm · {model.curbWeightKg} kg · {phpRange(range.from, range.to)}</small></span>
    </Link>
  ));

  return <section className={`page shell ${styles.seatPage}`}>
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
      <div className={styles.fitBandGrid}>
        <a href="#lower-seat" className={styles.fitBandCard}>
          <span>Lower seat</span>
          <strong>760 mm and below</strong>
          <b>{lowerSeat.length} models</b>
          <p>A useful first pool when easier ground reach is the priority.</p>
        </a>
        <a href="#middle-seat" className={styles.fitBandCard}>
          <span>Middle range</span>
          <strong>761–800 mm</strong>
          <b>{middleSeat.length} models</b>
          <p>A broad range covering many scooters, road bikes and everyday motorcycles.</p>
        </a>
        <a href="#taller-seat" className={styles.fitBandCard}>
          <span>Taller seat</span>
          <strong>Above 800 mm</strong>
          <b>{tallerSeat.length} models</b>
          <p>Common among adventure, dual-sport and some performance-oriented motorcycles.</p>
        </a>
      </div>
    </section>

    {lowest && highest && <section className={`section ${styles.fitContext}`} aria-labelledby="seat-height-method">
      <div>
        <span className="section-kicker">Fit context</span>
        <h2 id="seat-height-method">Seat height is not the same as rider fit</h2>
        <p>The current database spans from {lowest.model.seatHeightMm} mm on the {lowest.model.make} {lowest.model.model} to {highest.model.seatHeightMm} mm on the {highest.model.make} {highest.model.model}. That range helps narrow choices, but it does not measure seat width, balance or how much the suspension compresses under a rider.</p>
        <p>Use the database to build a shortlist, then compare inseam, curb weight and the exact motorcycle in person when possible.</p>
      </div>
      <div className={styles.fitChecklist}>
        <span>Check together</span>
        <ul>
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
        title="Three useful ways to scan the lower-seat end of the database"
        titleId="seat-height-shortlists"
        description="These lists are sorted from the current dataset only. They are not overall motorcycle rankings."
      />
      <div className={styles.shortlistGrid}>
        <article>
          <div className={styles.shortlistHead}><span>Seat height</span><h3>Five lowest recorded</h3></div>
          {shortlist(lowestFive)}
        </article>
        <article>
          <div className={styles.shortlistHead}><span>Weight</span><h3>Lighter bikes at 760 mm or below</h3></div>
          {shortlist(lowerSeatLightest)}
        </article>
        <article>
          <div className={styles.shortlistHead}><span>Automatic</span><h3>Automatic models at 780 mm or below</h3></div>
          {shortlist(automaticLowerSeat)}
        </article>
      </div>
    </section>

    <section id="lower-seat" className={`section ${styles.bandSummary}`} aria-labelledby="lower-seat-heading">
      <SectionHeader kicker="Lower-seat pool" titleId="lower-seat-heading" title="760 mm and below" description={`${lowerSeat.length} current models fall in this band. Lower published seat height can help ground reach, but motorcycle width and weight still matter.`} />
    </section>

    <section id="middle-seat" className={styles.bandSummary} aria-labelledby="middle-seat-heading">
      <SectionHeader kicker="Middle range" titleId="middle-seat-heading" title="761 to 800 mm" description={`${middleSeat.length} current models fall in this band. This range includes multiple motorcycle categories, so compare weight and seat shape as well as the number.`} />
    </section>

    <section id="taller-seat" className={styles.bandSummary} aria-labelledby="taller-seat-heading">
      <SectionHeader kicker="Taller-seat pool" titleId="taller-seat-heading" title="Above 800 mm" description={`${tallerSeat.length} current models fall in this band. Taller seats are common in motorcycles that prioritize ground clearance, suspension travel or riding position.`} />
    </section>

    <section id="seat-height-table" className="section" aria-labelledby="seat-height-table-title">
      <SectionHeader
        kicker="Full database · low to high"
        title="Current motorcycle seat heights"
        titleId="seat-height-table-title"
        description="Price is included only to help compare the complete shortlist. Open a model page for the exact price source, financing estimate and rider-fit calculator."
      />
      <div className={styles.tableToolbar}>
        <span>Last research check: {checkedAt}</span>
        <Link href="/recommendations#rider-fit">Rider-fit buying guidance →</Link>
      </div>
      <div className={styles.visualTable} role="table" aria-label="Motorcycle seat heights in the Philippines">
        <div className={styles.tableHead} role="row"><span>Motorcycle</span><span>Seat height</span><span>Curb weight</span><span>Category</span><span>Price</span></div>
        {rows.map(({ model, range }) => <Link className={styles.tableRow} role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`} key={model.id}>
          <span className={styles.modelCell}><EntityMedia entityType="motorcycle" entityId={model.id} fallback={<span className={styles.mediaFallback}>{model.make.slice(0,1)}</span>} showCredit={false}/><span><strong>{model.make} {model.model}</strong><small>{model.category}</small></span></span>
          <span className={styles.metricCell}><small>Seat height</small><b>{model.seatHeightMm} mm</b></span>
          <span className={styles.metricCell}><small>Curb weight</small><span>{model.curbWeightKg} kg</span></span>
          <span className={styles.metricCell}><small>Category</small><span>{model.category}</span></span>
          <span className={styles.metricCell}><small>Price</small><span>{phpRange(range.from, range.to)} →</span></span>
        </Link>)}
      </div>
    </section>

    <div className={styles.finalCta}>
      <div><span>Need a personal fit estimate?</span><h2>Use your inseam with the actual motorcycle data</h2><p>The finder and each model page combine seat height with other motorcycle data to help narrow choices. They still cannot replace an in-person fit check.</p></div>
      <CTAGroup><Link className="button" href="/finder">Open motorcycle finder</Link><Link className="button secondary" href="/recommendations#rider-fit">See rider-fit guidance</Link></CTAGroup>
    </div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

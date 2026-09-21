import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchSeatRows } from "@/lib/researchData";
import { phpRange } from "@/lib/utils";
import { EntityMedia } from "@/components/EntityMedia";
import { PageHero, StatRow, InfoPanel } from "@/components/ui";
import styles from "../research-detail.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Seat Height Database Philippines | MotoIndex PH",
  description: "Compare motorcycle seat heights in the Philippines with curb weight, price and category data to build a better rider-fit shortlist.",
  path: "/research/motorcycle-seat-height-database"
});

export default function MotorcycleSeatHeightDatabasePage() {
  const rows = researchSeatRows();
  const heights = rows.map(({ model }) => model.seatHeightMm);
  const medianSeat = Math.round(median(heights));
  const lowSeat = rows.filter(({ model }) => model.seatHeightMm <= 760).length;
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

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research", href: "/research" }, { label: "Seat-height database" }]} />
    <PageHero kicker="Rider-fit data" title="Motorcycle seat height database Philippines" description="Compare published seat heights with motorcycle weight, category and price. Start with the numbers, then narrow the shortlist around the way the bike actually fits you." />

    <StatRow items={[{label:"Current models",value:String(rows.length),note:"Current indexable records"},{label:"Median seat height",value:`${medianSeat} mm`,note:"Across the current dataset"},{label:"760 mm or lower",value:String(lowSeat),note:"Lower-seat starting pool"},{label:"Lowest recorded",value:lowest?`${lowest.model.seatHeightMm} mm`:"—",note:lowest?`${lowest.model.make} ${lowest.model.model}`:""}]} />

    {lowest && highest && <section className="section split" aria-labelledby="seat-height-method">
      <div><span className="section-kicker">Fit context</span><h2 id="seat-height-method">Seat height is not the same as rider fit</h2><p>The current database spans from {lowest.model.seatHeightMm} mm on the {lowest.model.make} {lowest.model.model} to {highest.model.seatHeightMm} mm on the {highest.model.make} {highest.model.model}. Those numbers help narrow choices, but they do not measure seat width, balance or how much the suspension compresses under a rider.</p><p>Use the table to identify candidates, then sit on the exact motorcycle before buying when possible.</p></div>
      <div className="info-card"><h3>Use these measurements together</h3><ul className="checklist"><li>Published seat height</li><li>Your actual inseam</li><li>Curb weight and weight distribution</li><li>Seat width and shape</li><li>Suspension sag with your body weight</li><li>Footwear and low-speed confidence</li></ul></div>
    </section>}

    <section className="section" aria-labelledby="seat-height-table">
      <div className="section-head compact"><div><span className="section-kicker">Sorted low to high</span><h2 id="seat-height-table">Current motorcycle seat heights</h2><p>Prices are included only to help compare the whole shortlist. Open the model page for the exact price source and rider-fit calculator.</p></div><Link href="/recommendations#rider-fit">Open rider-fit buying guidance →</Link></div>
      <div className={styles.visualTable} role="table" aria-label="Motorcycle seat heights in the Philippines">
        <div className={styles.tableHead} role="row"><span>Motorcycle</span><span>Seat height</span><span>Curb weight</span><span>Category</span><span>Price</span></div>
        {rows.map(({ model, range }) => <Link className={styles.tableRow} role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`} key={model.id}><span className={styles.modelCell}><EntityMedia entityType="motorcycle" entityId={model.id} fallback={<span className={styles.mediaFallback}>{model.make.slice(0,1)}</span>} showCredit={false}/><strong>{model.make} {model.model}</strong></span><b>{model.seatHeightMm} mm</b><span>{model.curbWeightKg} kg</span><span>{model.category}</span><span>{phpRange(range.from, range.to)} →</span></Link>)}
      </div>
    </section>

    <div className="note-box"><h2>Need a personal fit estimate?</h2><p>The MotoIndex finder and model pages use seat height together with other motorcycle data to help narrow choices. They still cannot replace an in-person fit check.</p><Link className="text-link" href="/finder">Open motorcycle finder →</Link></div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

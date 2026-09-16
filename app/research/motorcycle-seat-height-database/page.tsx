import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchSeatRows } from "@/lib/researchData";
import { phpRange } from "@/lib/utils";

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
    <div className="page-head">
      <span className="entity-kicker">Rider-fit data</span>
      <h1>Motorcycle seat height database Philippines</h1>
      <p>Compare published seat heights across current motorcycles tracked by MotoIndex. Seat height is useful for narrowing a shortlist, but actual reach also depends on inseam, seat width, suspension sag, footwear and motorcycle weight.</p>
    </div>

    <div className="entity-price-grid">
      <article><span>Current models</span><strong>{rows.length}</strong><small>Current, indexable records in this dataset</small></article>
      <article><span>Median seat height</span><strong>{medianSeat} mm</strong><small>Median published seat height across the dataset</small></article>
      <article><span>760 mm or lower</span><strong>{lowSeat}</strong><small>Useful starting pool for lower-seat research</small></article>
      {lowest && <article><span>Lowest recorded seat</span><strong>{lowest.model.seatHeightMm} mm</strong><small>{lowest.model.make} {lowest.model.model}</small></article>}
    </div>

    {lowest && highest && <section className="section split" aria-labelledby="seat-height-method">
      <div><span className="section-kicker">Fit context</span><h2 id="seat-height-method">Seat height is not the same as rider fit</h2><p>The current database spans from {lowest.model.seatHeightMm} mm on the {lowest.model.make} {lowest.model.model} to {highest.model.seatHeightMm} mm on the {highest.model.make} {highest.model.model}. Those numbers help narrow choices, but they do not measure seat width, balance or how much the suspension compresses under a rider.</p><p>Use the table to identify candidates, then sit on the exact motorcycle before buying when possible.</p></div>
      <div className="info-card"><h3>Use these measurements together</h3><ul className="checklist"><li>Published seat height</li><li>Your actual inseam</li><li>Curb weight and weight distribution</li><li>Seat width and shape</li><li>Suspension sag with your body weight</li><li>Footwear and low-speed confidence</li></ul></div>
    </section>}

    <section className="section" aria-labelledby="seat-height-table">
      <div className="section-head compact"><div><span className="section-kicker">Sorted low to high</span><h2 id="seat-height-table">Current motorcycle seat heights</h2><p>Prices are included only to help compare the whole shortlist. Open the model page for the exact price source and rider-fit calculator.</p></div><Link href="/recommendations#rider-fit">Open rider-fit buying guidance →</Link></div>
      <div className="ph-brand-price-table" role="table" aria-label="Motorcycle seat heights in the Philippines">
        <div className="head" role="row"><span>Motorcycle</span><span>Seat height</span><span>Curb weight</span><span>Category</span><span>Price</span></div>
        {rows.map(({ model, range }) => <Link role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}#rider-fit`} key={model.id}>
          <strong>{model.make} {model.model}</strong><span>{model.seatHeightMm} mm</span><span>{model.curbWeightKg} kg</span><span>{model.category}</span><span>{phpRange(range.from, range.to)} →</span>
        </Link>)}
      </div>
    </section>

    <div className="note-box"><h2>Need a personal fit estimate?</h2><p>The MotoIndex finder and model pages use seat height together with other motorcycle data to help narrow choices. They still cannot replace an in-person fit check.</p><Link className="text-link" href="/finder">Open motorcycle finder →</Link></div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

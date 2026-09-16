import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { latestResearchCheck, median, researchPriceRows } from "@/lib/researchData";
import { php, phpRange } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Price Index Philippines 2026 | MotoIndex PH",
  description: "Compare current motorcycle prices in the Philippines with median price, budget bands and a model-by-model table using dated MotoIndex source checks.",
  path: "/research/motorcycle-price-index-philippines"
});

export default function MotorcyclePriceIndexPage() {
  const rows = researchPriceRows();
  const prices = rows.map((row) => row.fromPhp);
  const medianPrice = Math.round(median(prices));
  const under100k = rows.filter((row) => row.fromPhp < 100000).length;
  const band100to150 = rows.filter((row) => row.fromPhp >= 100000 && row.fromPhp <= 150000).length;
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
    variableMeasured: ["Published starting price", "Engine displacement", "Motorcycle category", "Price source check date"]
  };

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research", href: "/research" }, { label: "Motorcycle price index" }]} />
    <div className="page-head">
      <span className="entity-kicker">MotoIndex price research</span>
      <h1>Motorcycle price index Philippines 2026</h1>
      <p>Compare published starting-price references across current motorcycles tracked by MotoIndex. Use this as a market-research baseline, then open the model page to inspect its exact price range, variants, source and check date.</p>
    </div>

    <div className="entity-price-grid">
      <article><span>Current models</span><strong>{rows.length}</strong><small>Indexable Philippine-market records</small></article>
      <article><span>Median starting price</span><strong>{php(medianPrice)}</strong><small>Median of published starting-price references</small></article>
      <article><span>Below ₱100K</span><strong>{under100k}</strong><small>Current models with a starting price below ₱100,000</small></article>
      <article><span>₱100K–₱150K</span><strong>{band100to150}</strong><small>Current models inside this starting-price band</small></article>
    </div>

    {lowest && highest && <section className="section split" aria-labelledby="price-index-context">
      <div><span className="section-kicker">Price span</span><h2 id="price-index-context">What does the current MotoIndex dataset cover?</h2><p>The lowest published starting-price record in this dataset is <strong>{lowest.model.make} {lowest.model.model}</strong> at {php(lowest.fromPhp)}. The highest starting-price record is <strong>{highest.model.make} {highest.model.model}</strong> at {php(highest.fromPhp)}.</p><p>This is not a claim about every motorcycle sold in the Philippines. It describes the current public MotoIndex dataset after model-quality and freshness gates.</p></div>
      <div className="info-card"><h3>Price methodology</h3><ul className="checklist"><li>Current, indexable models only</li><li>Published starting-price basis for cross-model comparison</li><li>Variant ranges remain visible on the model page</li><li>Dealer fees, promotions and local availability can differ</li><li>Latest represented source check: {checkedAt}</li></ul></div>
    </section>}

    <section className="section" aria-labelledby="price-index-table">
      <div className="section-head compact"><div><span className="section-kicker">Current price database</span><h2 id="price-index-table">Motorcycle prices tracked by MotoIndex</h2><p>Open any model to check variants, financing estimates and the dated evidence behind the amount.</p></div><Link href="/recommendations/motorcycles-under-100k">Browse motorcycles under ₱100K →</Link></div>
      <div className="ph-brand-price-table" role="table" aria-label="MotoIndex Philippine motorcycle price index">
        <div className="head" role="row"><span>Motorcycle</span><span>Published price</span><span>Engine</span><span>Category</span><span>Checked</span></div>
        {rows.map(({ model, fromPhp, toPhp, checkedAt: modelCheckedAt }) => <Link role="row" href={`/motorcycles/${model.makeSlug}/${model.slug}`} key={model.id}>
          <strong>{model.make} {model.model}</strong><span>{phpRange(fromPhp, toPhp)}</span><span>{model.engineCc} cc</span><span>{model.category}</span><span>{modelCheckedAt} →</span>
        </Link>)}
      </div>
    </section>

    <div className="note-box"><h2>Use price as a starting point, not the whole decision</h2><p>A lower starting price does not make one motorcycle a better choice. Compare rider fit, braking equipment, weight, ownership costs, dealer support and the exact variant before buying.</p><Link className="text-link" href="/tools/motorcycle-loan-calculator">Open motorcycle loan calculator →</Link></div>
    <AuthorBox />
    <JsonLd data={dataset} />
  </section>;
}

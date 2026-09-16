import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AuthorBox } from "@/components/AuthorBox";
import { pageMetadata } from "@/lib/site";
import { latestResearchCheck, researchMotorcycles } from "@/lib/researchData";

export const metadata: Metadata = pageMetadata({
  title: "Philippine Motorcycle Data & Research | MotoIndex PH",
  description: "MotoIndex Philippine motorcycle datasets for current prices, seat heights, down payments and monthly financing estimates, with dated source checks.",
  path: "/research"
});

export default function ResearchPage() {
  const checkedAt = latestResearchCheck();
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Research" }]} />
    <div className="page-head">
      <span className="entity-kicker">MotoIndex data research</span>
      <h1>Philippine motorcycle data built for comparison</h1>
      <p>Explore source-led datasets generated from the current public MotoIndex motorcycle catalog. Every table links back to the model page where price context, specifications and source dates can be checked.</p>
    </div>

    <div className="entity-price-grid">
      <article><span>Current models in dataset</span><strong>{researchMotorcycles.length}</strong><small>Only current, indexable MotoIndex records</small></article>
      <article><span>Latest source check</span><strong>{checkedAt}</strong><small>Newest model or market-price check represented</small></article>
      <article><span>Method</span><strong>Source-led</strong><small>No dealer quote or financing approval is implied</small></article>
    </div>

    <section className="section" aria-labelledby="research-datasets">
      <div className="section-head compact"><div><span className="section-kicker">Original datasets</span><h2 id="research-datasets">Use the dataset that matches your decision</h2><p>These pages summarize the same verified entities used across MotoIndex buying tools, without splitting model intent into thin SEO pages.</p></div></div>
      <div className="topic-grid">
        <article><h2>Motorcycle price index</h2><p>Compare published starting prices across current Philippine motorcycle records, including median price and budget-band counts.</p><div className="topic-action"><Link href="/research/motorcycle-price-index-philippines">Open price index →</Link></div></article>
        <article><h2>Seat-height database</h2><p>Sort current motorcycles by published seat height, then compare curb weight, category and price before doing an in-person fit check.</p><div className="topic-action"><Link href="/research/motorcycle-seat-height-database">Open seat-height database →</Link></div></article>
        <article><h2>Down payment & monthly index</h2><p>Compare one consistent financing scenario across current motorcycles using 20% down, 36 months and a 12% annual amortizing-rate assumption.</p><div className="topic-action"><Link href="/research/motorcycle-financing-index-philippines">Open financing index →</Link></div></article>
      </div>
    </section>

    <div className="note-box">
      <h2>What this research is, and what it is not</h2>
      <p>MotoIndex uses dated Philippine price and specification references to make motorcycles easier to compare. These datasets are research tools, not complete manufacturer catalogs, live dealer inventories, lender quotations or guarantees that every recorded model is in stock near you.</p>
      <Link className="text-link" href="/methodology">Read the MotoIndex methodology →</Link>
    </div>
    <AuthorBox />
  </section>;
}

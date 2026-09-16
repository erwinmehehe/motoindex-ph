import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { editorialGuides } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Guides Philippines: Helmets, Gear & Ownership",
  description: "Practical MotoIndex Philippines guides for motorcycle helmet sizing, certification, electric motorcycles, gear, fitment and ownership research.",
  path: "/guides",
  index: true
});

export default function GuidesPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <div className="page-head"><span className="entity-kicker">Rider guides</span><h1>Motorcycle guides for Philippine riders</h1><p>Start with the task you are trying to solve, then open the detailed guide or tool only when you need it.</p></div>

    <div className="section-head compact"><div><span className="section-kicker">Choose a starting point</span><h2>What are you trying to do?</h2></div></div>
    <div className="topic-grid">
      <article><h2>Choose a motorcycle</h2><p>Shortlist current motorcycles by budget, use, rider fit and the tradeoffs that matter to you.</p><div className="topic-action"><Link href="/recommendations">Open buying guides →</Link></div></article>
      <article><h2>Plan ownership</h2><p>Estimate total cost, insurance and paperwork after you have a realistic motorcycle shortlist.</p><div className="topic-action"><Link href="/ownership">Open ownership hub →</Link></div></article>
      <article><h2>Maintain a motorcycle</h2><p>Use model schedules, maintenance references and official service resources without mixing generic advice with exact intervals.</p><div className="topic-action"><Link href="/maintenance">Open maintenance guides →</Link></div></article>
      <article><h2>Check gear and fitment</h2><p>Research helmets, tire sizes and model-specific fitment before ordering riding gear or accessories.</p><div className="topic-action"><Link href="/fitment">Open fitment finder →</Link></div></article>
      <article><h2>Handle safety and paperwork</h2><p>Check registration, ownership transfer, insurance and manufacturer safety resources from one ownership path.</p><div className="topic-action"><Link href="/ownership#paperwork">Open paperwork guides →</Link></div></article>
      <article><h2>Research electric motorcycles</h2><p>Compare current electric models, batteries, range, charging and Philippine registration context.</p><div className="topic-action"><Link href="/motorcycles/electric">Open electric research →</Link></div></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">MotoIndex data research</span><h2>Compare the underlying motorcycle data</h2><p>Use source-led datasets when you need a market-wide view before narrowing to individual model pages.</p></div><Link href="/research">Open research hub →</Link></div>
    <div className="topic-grid">
      <article><h2>Philippine motorcycle price index</h2><p>Compare current published starting prices, median price and budget bands across the public MotoIndex catalog.</p><div className="topic-action"><Link href="/research/motorcycle-price-index-philippines">Explore price data →</Link></div></article>
      <article><h2>Seat-height database</h2><p>Sort current motorcycles by published seat height and compare curb weight, category and price.</p><div className="topic-action"><Link href="/research/motorcycle-seat-height-database">Explore seat heights →</Link></div></article>
      <article><h2>Down payment & monthly index</h2><p>Apply one financing scenario across current motorcycle prices, then adjust any model in the full loan calculator.</p><div className="topic-action"><Link href="/research/motorcycle-financing-index-philippines">Explore financing data →</Link></div></article>
    </div>

    <div className="section-head inline-head"><div><span className="section-kicker">Published research</span><h2>Detailed MotoIndex guides</h2><p>Use these when you need a focused answer beyond the main buying and ownership tools.</p></div></div>
    <div className="guide-grid">{editorialGuides.map((guide) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><div style={{marginBottom:16}}><GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact /></div><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>
  </section>;
}

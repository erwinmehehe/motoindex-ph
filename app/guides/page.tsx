import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { editorialGuides } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";
import styles from "./GuidesPage.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Guides Philippines: Helmets, Gear & Ownership",
  description: "Practical MotoIndex Philippines guides for motorcycle helmet sizing, certification, electric motorcycles, gear, fitment and ownership research.",
  path: "/guides",
  index: true
});

export default function GuidesPage() {
  const featuredGuide=editorialGuides[0]!;
  const remainingGuides=editorialGuides.slice(1);
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <section className={styles.mockupHero}>
      <div><span>Guides & resources</span><h1>Motorcycle Guides<br/>& Resources</h1><p>Helpful guides, buying tips, maintenance advice and motorcycle news for Filipino riders.</p></div>
      <div className={styles.heroArt}><GuideFeaturedArt slug={featuredGuide.slug} title={featuredGuide.title} kicker={featuredGuide.kicker} /></div>
    </section>
    <nav className={styles.filters} aria-label="Guide categories">
      <Link href="#guide-grid">All</Link>
      <Link href="/recommendations">Buying Guide</Link>
      <Link href="/maintenance">Maintenance</Link>
      <Link href="/guides">Tips & Advice</Link>
      <Link href="/research">Reviews</Link>
      <Link href="/guides">News</Link>
    </nav>
    <div id="guide-grid" className={styles.mockupGrid}>{editorialGuides.slice(0,6).map((guide)=><Link className={styles.mockupCard} key={guide.slug} href={`/guides/${guide.slug}`}>
      <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact />
      <span>{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><small>Read guide →</small>
    </Link>)}</div>

    <div className="section-head compact"><div><span className="section-kicker">MotoIndex data research</span><h2>Compare the underlying motorcycle data</h2><p>Use source-led datasets when you need a market-wide view before narrowing to individual model pages.</p></div><Link href="/research">Open research hub →</Link></div>
    <div className="topic-grid">
      <article><h2>Philippine motorcycle price index</h2><p>Compare current published starting prices, median price and budget bands across the public MotoIndex catalog.</p><div className="topic-action"><Link href="/research/motorcycle-price-index-philippines">Explore price data →</Link></div></article>
      <article><h2>Seat-height database</h2><p>Sort current motorcycles by published seat height and compare curb weight, category and price.</p><div className="topic-action"><Link href="/research/motorcycle-seat-height-database">Explore seat heights →</Link></div></article>
      <article><h2>Down payment & monthly index</h2><p>Apply one financing scenario across current motorcycle prices, then adjust any model in the full loan calculator.</p><div className="topic-action"><Link href="/research/motorcycle-financing-index-philippines">Explore financing data →</Link></div></article>
    </div>

    <div className="section-head inline-head"><div><span className="section-kicker">Published research</span><h2>Detailed MotoIndex guides</h2><p>Use these when you need a focused answer beyond the main buying and ownership tools.</p></div></div>
    <div className="guide-grid">{remainingGuides.map((guide) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><div style={{marginBottom:16}}><GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact /></div><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>
  </section>;
}

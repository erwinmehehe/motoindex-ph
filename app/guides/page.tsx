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
  const featuredGuide=editorialGuides[0];
  const previewGuides=editorialGuides.slice(0,6);
  const remainingGuides=editorialGuides.slice(6);
  const tasks=[
    {number:"01",title:"Choose a motorcycle",copy:"Shortlist current motorcycles by budget, use, rider fit and the tradeoffs that matter to you.",href:"/recommendations",action:"Open buying guides"},
    {number:"02",title:"Plan ownership",copy:"Estimate total cost, insurance and paperwork after you have a realistic motorcycle shortlist.",href:"/ownership",action:"Open ownership hub"},
    {number:"03",title:"Maintain a motorcycle",copy:"Use model schedules, maintenance references and official service resources.",href:"/maintenance",action:"Open maintenance guides"},
    {number:"04",title:"Check gear and fitment",copy:"Research helmets, tire sizes and model-specific fitment before ordering gear or accessories.",href:"/fitment",action:"Open fitment finder"},
    {number:"05",title:"Safety and paperwork",copy:"Check registration, ownership transfer, insurance and manufacturer safety resources.",href:"/ownership#paperwork",action:"Open paperwork guides"},
    {number:"06",title:"Research electric",copy:"Compare current electric models, batteries, range, charging and Philippine registration context.",href:"/motorcycles/electric",action:"Open electric research"}
  ];
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <section className={styles.hero} data-mockup-guides-hero>
      <div className={styles.heroCopy}><span>Home · Guides</span><h1>Motorcycle Guides<br/>& Resources</h1><p>Helpful guides, buying tips, maintenance advice and motorcycle news for Filipino riders.</p></div>
      <div className={styles.heroArt}>{featuredGuide&&<GuideFeaturedArt slug={featuredGuide.slug} title={featuredGuide.title} kicker={featuredGuide.kicker}/>}</div>
    </section>
    <nav className={styles.filters} aria-label="Guide categories"><a href="#guide-preview">All</a><a href="#guide-preview">Buying Guide</a><a href="#guide-preview">Maintenance</a><a href="#guide-preview">Tips & Advice</a><a href="#guide-preview">Reviews</a><a href="#guide-preview">News</a></nav>
    <section id="guide-preview" className={styles.preview}>
      <div className={styles.mockGuideGrid}>{previewGuides.map((guide)=><Link className={styles.mockGuideCard} key={guide.slug} href={"/guides/"+guide.slug}>
        <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact />
        <div><span>{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong>Read guide →</strong></div>
      </Link>)}</div>
    </section>

    <div className="section-head compact"><div><span className="section-kicker">Choose a starting point</span><h2>What are you trying to do?</h2></div></div>
    <div className={styles.taskGrid}>
      {tasks.map((task)=><Link className={styles.taskCard} href={task.href} key={task.number}>
        <span className={styles.taskNumber}>{task.number}</span><h2>{task.title}</h2><p>{task.copy}</p><strong>{task.action} →</strong>
      </Link>)}
    </div>

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

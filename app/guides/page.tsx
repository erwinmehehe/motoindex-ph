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

const tasks=[
  {number:"01",title:"Choose a motorcycle",copy:"Shortlist current motorcycles by budget, use, rider fit and the tradeoffs that matter to you.",href:"/recommendations",action:"Open buying guides"},
  {number:"02",title:"Plan ownership",copy:"Estimate total cost, insurance and paperwork after you have a realistic motorcycle shortlist.",href:"/ownership",action:"Open ownership hub"},
  {number:"03",title:"Maintain a motorcycle",copy:"Use model schedules, maintenance references and official service resources.",href:"/maintenance",action:"Open maintenance guides"},
  {number:"04",title:"Check gear and fitment",copy:"Research helmets, tire sizes and model-specific fitment before ordering gear or accessories.",href:"/fitment",action:"Open fitment finder"},
  {number:"05",title:"Safety and paperwork",copy:"Check registration, ownership transfer, insurance and manufacturer safety resources.",href:"/ownership#paperwork",action:"Open paperwork guides"},
  {number:"06",title:"Research electric",copy:"Compare current electric models, batteries, range, charging and Philippine registration context.",href:"/motorcycles/electric",action:"Open electric research"}
] as const;

export default function GuidesPage() {
  const featuredGuide=editorialGuides[0];
  const remainingGuides=editorialGuides.slice(1);

  return <section className={`page shell ${styles.page}`}>
    <Breadcrumbs items={[{ label: "Guides" }]} />

    <div className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className="entity-kicker">Rider guides</span>
        <h1>Motorcycle guides for Philippine riders</h1>
        <p>Start with the task you are trying to solve, then open the detailed guide or tool only when you need it.</p>
        <nav className={styles.chips} aria-label="Guide categories">
          <Link href="/recommendations">Buying</Link>
          <Link href="/ownership">Ownership</Link>
          <Link href="/maintenance">Maintenance</Link>
          <Link href="/gear/helmets">Helmets & gear</Link>
          <Link href="/motorcycles/electric">Electric</Link>
        </nav>
      </div>
      {featuredGuide&&<Link className={styles.heroArt} href={`/guides/${featuredGuide.slug}`}>
        <GuideFeaturedArt slug={featuredGuide.slug} title={featuredGuide.title} kicker={featuredGuide.kicker} />
        <span><small>Featured guide · {featuredGuide.kicker}</small><strong>{featuredGuide.title}</strong></span>
      </Link>}
    </div>

    <section className={styles.section}>
      <div className={styles.sectionHead}><div><span>Choose a starting point</span><h2>What are you trying to do?</h2></div></div>
      <div className={styles.taskGrid}>
        {tasks.map((task)=><Link className={styles.taskCard} href={task.href} key={task.number}>
          <span className={styles.taskNumber}>{task.number}</span>
          <h3>{task.title}</h3>
          <p>{task.copy}</p>
          <strong>{task.action} →</strong>
        </Link>)}
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHead}><div><span>MotoIndex data research</span><h2>Compare the underlying motorcycle data</h2><p>Use source-led datasets when you need a market-wide view before narrowing to individual model pages.</p></div><Link href="/research">Open research hub →</Link></div>
      <div className={styles.dataGrid}>
        <Link href="/research/motorcycle-price-index-philippines"><span>Price research</span><h3>Philippine motorcycle price index</h3><p>Compare current published starting prices, median price and budget bands across the public MotoIndex catalog.</p><strong>Explore price data →</strong></Link>
        <Link href="/research/motorcycle-seat-height-database"><span>Rider fit</span><h3>Seat-height database</h3><p>Sort current motorcycles by published seat height and compare curb weight, category and price.</p><strong>Explore seat heights →</strong></Link>
        <Link href="/research/motorcycle-financing-index-philippines"><span>Financing</span><h3>Down payment & monthly index</h3><p>Apply one financing scenario across current motorcycle prices, then adjust any model in the full loan calculator.</p><strong>Explore financing data →</strong></Link>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.sectionHead}><div><span>Published research</span><h2>Detailed MotoIndex guides</h2><p>Use these when you need a focused answer beyond the main buying and ownership tools.</p></div></div>
      <div className={styles.guideGrid}>
        {remainingGuides.map((guide)=><Link className={styles.guideCard} key={guide.slug} href={`/guides/${guide.slug}`}>
          <div className={styles.guideArt}><GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact /></div>
          <span>{guide.kicker}</span>
          <h3>{guide.title}</h3>
          <p>{guide.description}</p>
          <strong>Read guide →</strong>
        </Link>)}
      </div>
    </section>
  </section>;
}

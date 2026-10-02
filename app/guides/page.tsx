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

const GUIDES_MOCKUP_CSS=`
.guides-mockup-page{width:min(1280px,calc(100% - 32px))}
.guides-mockup-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(400px,1fr);gap:28px;align-items:center;margin:10px 0 28px}.guides-mockup-copy>span{display:block;margin-bottom:7px;color:var(--mi-color-primary);font-size:9px;font-weight:850;text-transform:uppercase}.guides-mockup-copy h1{max-width:680px;margin:0;font-size:clamp(40px,4.5vw,58px);line-height:.98;letter-spacing:-.055em}.guides-mockup-copy>p{max-width:620px;color:var(--mi-color-copy);font-size:13px;line-height:1.55}
.guides-mockup-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}.guides-mockup-chips a{padding:6px 9px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);font-size:9px}
.guides-mockup-art{position:relative;display:block;min-height:300px;overflow:hidden;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-sm);background:var(--mi-color-surface-subtle)}.guides-mockup-art>div{height:300px}.guides-mockup-art>span{position:absolute;left:12px;right:12px;bottom:12px;padding:9px 10px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.guides-mockup-art small,.guides-mockup-art strong{display:block}.guides-mockup-art small{font-size:8px;color:var(--mi-color-muted);text-transform:uppercase}.guides-mockup-art strong{font-size:14px}
.guides-mockup-section{padding:26px 0;border-top:1px solid var(--mi-color-line-soft)}.guides-mockup-head{display:flex;justify-content:space-between;gap:18px;margin-bottom:11px}.guides-mockup-head span{color:var(--mi-color-primary);font-size:8px;font-weight:850;text-transform:uppercase}.guides-mockup-head h2{margin:4px 0 0;font-size:clamp(24px,2.7vw,34px)}.guides-mockup-head p,.guides-mockup-head>a{font-size:9px}.guides-mockup-head p{color:var(--mi-color-copy)}
.guides-mockup-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.guides-mockup-card{display:flex;min-width:0;min-height:150px;flex-direction:column;padding:13px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.guides-mockup-card>span{color:var(--mi-color-primary);font-size:8px;font-weight:850;text-transform:uppercase}.guides-mockup-card h3{margin:12px 0 4px;font-size:14px}.guides-mockup-card p{margin:0;color:var(--mi-color-copy);font-size:9px;line-height:1.45}.guides-mockup-card strong{margin-top:auto;padding-top:9px;color:var(--mi-color-primary);font-size:8px}.guides-mockup-guide{overflow:hidden;padding-top:0}.guides-mockup-guide-art{height:145px;margin:0 -13px 9px;overflow:hidden;border-bottom:1px solid var(--mi-color-line-soft)}.guides-mockup-guide-art>*{height:100%}
@media(max-width:900px){.guides-mockup-hero{grid-template-columns:1fr}.guides-mockup-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.guides-mockup-page{width:min(100% - 24px,1280px)}.guides-mockup-copy h1{font-size:36px}.guides-mockup-art,.guides-mockup-art>div{min-height:220px;height:220px}.guides-mockup-head{flex-direction:column}.guides-mockup-grid{grid-template-columns:1fr}}
`;

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

  return <section className="page shell guides-mockup-page"><style>{GUIDES_MOCKUP_CSS}</style>
    <Breadcrumbs items={[{ label: "Guides" }]} />

    <div className="guides-mockup-hero">
      <div className="guides-mockup-copy">
        <span className="entity-kicker">Rider guides</span>
        <h1>Motorcycle guides for Philippine riders</h1>
        <p>Start with the task you are trying to solve, then open the detailed guide or tool only when you need it.</p>
        <nav className="guides-mockup-chips" aria-label="Guide categories">
          <Link href="/recommendations">Buying</Link>
          <Link href="/ownership">Ownership</Link>
          <Link href="/maintenance">Maintenance</Link>
          <Link href="/gear/helmets">Helmets & gear</Link>
          <Link href="/motorcycles/electric">Electric</Link>
        </nav>
      </div>
      {featuredGuide&&<Link className="guides-mockup-art" href={`/guides/${featuredGuide.slug}`}>
        <GuideFeaturedArt slug={featuredGuide.slug} title={featuredGuide.title} kicker={featuredGuide.kicker} />
        <span><small>Featured guide · {featuredGuide.kicker}</small><strong>{featuredGuide.title}</strong></span>
      </Link>}
    </div>

    <section className="guides-mockup-section">
      <div className="guides-mockup-head"><div><span>Choose a starting point</span><h2>What are you trying to do?</h2></div></div>
      <div className="guides-mockup-grid">
        {tasks.map((task)=><Link className="guides-mockup-card" href={task.href} key={task.number}>
          <span className="guides-mockup-number">{task.number}</span>
          <h3>{task.title}</h3>
          <p>{task.copy}</p>
          <strong>{task.action} →</strong>
        </Link>)}
      </div>
    </section>

    <section className="guides-mockup-section">
      <div className="guides-mockup-head"><div><span>MotoIndex data research</span><h2>Compare the underlying motorcycle data</h2><p>Use source-led datasets when you need a market-wide view before narrowing to individual model pages.</p></div><Link href="/research">Open research hub →</Link></div>
      <div className="guides-mockup-grid">
        <Link href="/research/motorcycle-price-index-philippines"><span>Price research</span><h3>Philippine motorcycle price index</h3><p>Compare current published starting prices, median price and budget bands across the public MotoIndex catalog.</p><strong>Explore price data →</strong></Link>
        <Link href="/research/motorcycle-seat-height-database"><span>Rider fit</span><h3>Seat-height database</h3><p>Sort current motorcycles by published seat height and compare curb weight, category and price.</p><strong>Explore seat heights →</strong></Link>
        <Link href="/research/motorcycle-financing-index-philippines"><span>Financing</span><h3>Down payment & monthly index</h3><p>Apply one financing scenario across current motorcycle prices, then adjust any model in the full loan calculator.</p><strong>Explore financing data →</strong></Link>
      </div>
    </section>

    <section className="guides-mockup-section">
      <div className="guides-mockup-head"><div><span>Published research</span><h2>Detailed MotoIndex guides</h2><p>Use these when you need a focused answer beyond the main buying and ownership tools.</p></div></div>
      <div className="guides-mockup-grid">
        {remainingGuides.map((guide)=><Link className="guides-mockup-card guides-mockup-guide" key={guide.slug} href={`/guides/${guide.slug}`}>
          <div className="guides-mockup-guide-art"><GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact /></div>
          <span>{guide.kicker}</span>
          <h3>{guide.title}</h3>
          <p>{guide.description}</p>
          <strong>Read guide →</strong>
        </Link>)}
      </div>
    </section>
  </section>;
}

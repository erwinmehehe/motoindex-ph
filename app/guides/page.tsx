import { ReviewedCatalogArt } from "@/components/ReviewedCatalogArt";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { editorialGuides } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Philippine Motorcycle & Transport Guides | MotoIndex PH",
  description: "Philippine motorcycle, LTO licensing, expressway exit and toll guides, RFID balance help and commuting references with checked operator sources.",
  path: "/guides",
  index: true
});

// Keep all indexable editorial guides discoverable without one overwhelming grid.
// Topic sections cap repeated card counts and improve scanning on narrow screens.
const roadGuideSlugs = new Set([
  "autosweep-rfid-installation-philippines",
  "easytrip-rfid-balance-check",
  "skyway-philippines-routes-toll-fees",
  "slex-toll-fee-philippines",
  "nlex-toll-fee-philippines",
  "cavite-laguna-expressway-calax",
  "autosweep-rfid-balance-check",
  "nlex-connector-road-philippines",
  "tplex-exits-and-route",
  "sctex-route-and-exits",
]);
const commuteGuideSlugs = new Set([
  "lto-exam-reviewer-philippines",
  "lto-student-permit-requirements-philippines",
  "mrt-3-stations-philippines",
  "lrt-2-stations-philippines",
  "lrt-1-fare-philippines",
  "edsa-carousel-stations-fare",
  "metro-manila-number-coding-today",
  "lost-drivers-license-philippines",
]);

const guideSections = [
  {
    title: "Expressways and RFID",
    description: "Operator-sourced toll roads, exit tables, toll examples and RFID account guidance.",
    guides: editorialGuides.filter((guide) => roadGuideSlugs.has(guide.slug)),
  },
  {
    title: "Commuting and driver licensing",
    description: "Train and bus station lists, number coding, LTO requirements and practice resources.",
    guides: editorialGuides.filter((guide) => commuteGuideSlugs.has(guide.slug)),
  },
  {
    title: "Motorcycles, ownership and gear",
    description: "Motorcycle decisions, maintenance, safety, ownership paperwork and riding gear.",
    guides: editorialGuides.filter((guide) => !roadGuideSlugs.has(guide.slug) && !commuteGuideSlugs.has(guide.slug)),
  },
];

export default function GuidesPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <div className="reviewed-catalog-hero"><ReviewedCatalogArt entityId="yamaha-aerox-v3" /><div className="page-head ui-page-hero"><span className="entity-kicker">Rider guides</span><h1>Motorcycle and transport guides for the Philippines</h1><p>Research motorcycles, driver licensing, toll RFID and Metro Manila rail lines using source-checked practical guides and tools.</p></div></div>

    <div className="section-head compact"><div><span className="section-kicker">Choose a starting point</span><h2>What are you trying to do?</h2></div></div>
    <div className="topic-grid">
      <article><h2>Choose a motorcycle</h2><p>Shortlist current motorcycles by budget, use, rider fit and the tradeoffs that matter to you.</p><div className="topic-action"><Link href="/recommendations">Open buying guides →</Link></div></article>
      <article><h2>Plan ownership</h2><p>Estimate total cost, insurance and paperwork after you have a realistic motorcycle shortlist.</p><div className="topic-action"><Link href="/ownership">Open ownership hub →</Link></div></article>
      <article><h2>Maintain a motorcycle</h2><p>Use model schedules, maintenance references and official service resources without mixing generic advice with exact intervals.</p><div className="topic-action"><Link href="/maintenance">Open maintenance guides →</Link></div></article>
      <article><h2>Check gear and fitment</h2><p>Research helmets, tire sizes and model-specific fitment before ordering riding gear or accessories.</p><div className="topic-action"><Link href="/fitment">Open fitment finder →</Link></div></article>
      <article><h2>Handle safety and paperwork</h2><p>Check registration, ownership transfer, insurance and manufacturer safety resources from one ownership path.</p><div className="topic-action"><Link href="/ownership#paperwork">Open paperwork guides →</Link></div></article>
      <article><h2>Research electric motorcycles</h2><p>Compare current electric models, batteries, range, charging and Philippine registration context.</p><div className="topic-action"><Link href="/motorcycles/electric">Open electric research →</Link></div></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">Road and rail</span><h2>Philippine transportation guides</h2><p>Check toll fees, RFID, licensing, commuter routes, number coding and official operator information.</p></div></div>
    <div className="topic-grid">
      <article><h2>Toll RFID</h2><p>Find the Autosweep installation process and Easytrip balance-check instructions before traveling.</p><div className="topic-action"><Link href="/guides/autosweep-rfid-installation-philippines">Autosweep installation →</Link> · <Link href="/guides/easytrip-rfid-balance-check">Easytrip balance →</Link></div></article>
      <article><h2>LTO license preparation</h2><p>Study driving rules with original practice questions and check the student permit application checklist.</p><div className="topic-action"><Link href="/guides/lto-exam-reviewer-philippines">LTO reviewer →</Link> · <Link href="/guides/lto-student-permit-requirements-philippines">Student permit →</Link></div></article>
      <article><h2>Metro Manila train stations</h2><p>Compare ordered MRT-3 and LRT-2 station tables, terminal stops and pedestrian transfers.</p><div className="topic-action"><Link href="/guides/mrt-3-stations-philippines">MRT-3 stations →</Link> · <Link href="/guides/lrt-2-stations-philippines">LRT-2 stations →</Link></div></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">More travel planning</span><h2>Expressway rates, transit fares and number coding</h2><p>Selected published fares include effective dates. Check operator notices for later adjustments.</p></div></div>
    <div className="topic-grid">
      <article><h2>Skyway, SLEX and NLEX toll fees</h2><p>Review dated Class 1 examples, entry and exit guidance, and the right RFID payment network.</p><div className="topic-action"><Link href="/guides/skyway-philippines-routes-toll-fees">Skyway →</Link> · <Link href="/guides/slex-toll-fee-philippines">SLEX →</Link> · <Link href="/guides/nlex-toll-fee-philippines">NLEX →</Link></div></article>
      <article><h2>LRT-1 and EDSA Carousel</h2><p>Use the 25-station LRT-1 table, fare examples and directional EDSA Busway stop list.</p><div className="topic-action"><Link href="/guides/lrt-1-fare-philippines">LRT-1 fares →</Link> · <Link href="/guides/edsa-carousel-stations-fare">Carousel stops →</Link></div></article>
      <article><h2>Number coding today</h2><p>Check the regular Manila plate-ending schedule and announced suspensions before planning a road trip.</p><div className="topic-action"><Link href="/guides/metro-manila-number-coding-today">Check your plate →</Link></div></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">New operator guides</span><h2>TPLEX, SCTEX, CALAX and LTO help</h2><p>Read exit lists, check which toll road and RFID account applies, or prepare for a lost-license replacement with the LTO checklist.</p></div></div>
    <div className="topic-grid">
      <article><h2>TPLEX and SCTEX exit lists</h2><p>Plan northern Luzon routes with referenced interchange lists. Learn where Autosweep changes to Easytrip.</p><div className="topic-action"><Link href="/guides/tplex-exits-and-route">TPLEX →</Link> · <Link href="/guides/sctex-route-and-exits">SCTEX →</Link></div></article>
      <article><h2>CALAX and NLEX Connector</h2><p>Check the currently documented road sections and available access points. Avoid mistaking planned connections for open roads.</p><div className="topic-action"><Link href="/guides/cavite-laguna-expressway-calax">CALAX →</Link> · <Link href="/guides/nlex-connector-road-philippines">NLEX Connector →</Link></div></article>
      <article><h2>RFID and driver paperwork</h2><p>Find the official Autosweep account-balance methods, or use an LTO document checklist for a duplicate license.</p><div className="topic-action"><Link href="/guides/autosweep-rfid-balance-check">Autosweep balance →</Link> · <Link href="/guides/lost-drivers-license-philippines">Lost LTO license →</Link></div></article>
    </div>

    <div className="section-head compact"><div><span className="section-kicker">MotoIndex data research</span><h2>Compare the underlying motorcycle data</h2><p>Use source-led datasets when you need a market-wide view before narrowing to individual model pages.</p></div><Link href="/research">Open research hub →</Link></div>
    <div className="topic-grid">
      <article><h2>Philippine motorcycle price index</h2><p>Compare current published starting prices, median price and budget bands across the public MotoIndex catalog.</p><div className="topic-action"><Link href="/research/motorcycle-price-index-philippines">Explore price data →</Link></div></article>
      <article><h2>Seat-height database</h2><p>Sort current motorcycles by published seat height and compare curb weight, category and price.</p><div className="topic-action"><Link href="/research/motorcycle-seat-height-database">Explore seat heights →</Link></div></article>
      <article><h2>Down payment & monthly index</h2><p>Apply one financing scenario across current motorcycle prices, then adjust any model in the full loan calculator.</p><div className="topic-action"><Link href="/research/motorcycle-financing-index-philippines">Explore financing data →</Link></div></article>
    </div>

    <div className="section-head inline-head"><div><span className="section-kicker">Published research</span><h2>Detailed MotoIndex guides</h2><p>Use these when you need a focused answer beyond the main buying and ownership tools.</p></div></div>
    {guideSections.map((group) => <section key={group.title} aria-label={group.title}>
      <div className="section-head compact"><div><h2>{group.title}</h2><p>{group.description}</p></div></div>
      <div className="guide-grid">{group.guides.map((guide) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><div style={{marginBottom:16}}><GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact /></div><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>
    </section>)}
  </section>;
}

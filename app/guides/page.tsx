import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { editorialGuides } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Guides Philippines: Helmets, Gear & Ownership",
  description: "Practical MotoIndex Philippines guides for motorcycle helmet sizing, certification, gear, fitment and ownership research.",
  path: "/guides",
  index: true
});

export default function GuidesPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <div className="page-head"><h1>Motorcycle guides for Philippine riders</h1><p>Practical buying and ownership guides built around checkable product information, fitment and Philippine-market requirements.</p></div>
    <div className="guide-grid">{editorialGuides.map((guide) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>
    <div className="section-head inline-head"><div><h2>More research tools</h2></div></div>
    <div className="topic-grid"><article><h2>Helmet Finder</h2><p>Filter verified helmet models by format, price, size and equipment.</p><div className="topic-action"><Link href="/gear/helmets/finder">Find a helmet →</Link></div></article><article><h2>Motorcycle buying guides</h2><p>Compare current motorcycles by budget, seat height, category and riding use.</p><div className="topic-action"><Link href="/recommendations">Browse recommendations →</Link></div></article><article><h2>Maintenance guides</h2><p>Use source-backed service information and model-specific ownership checks where available.</p><div className="topic-action"><Link href="/maintenance">Browse maintenance →</Link></div></article></div>
  </section>;
}

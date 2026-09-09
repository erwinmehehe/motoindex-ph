import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { editorialGuides } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Guides Philippines: Helmets, Gear & Ownership",
  description: "Practical MotoIndex Philippines guides for motorcycle helmet sizing, certification, electric motorcycles, gear, fitment and ownership research.",
  path: "/guides",
  index: true
});

const electricGuides = [
  {
    href: "/guides/electric-scooters-philippines",
    kicker: "Electric",
    title: "Electric scooters in the Philippines",
    description: "Compare verified Philippine-market electric scooters, prices, battery options, claimed range and charging time."
  },
  {
    href: "/guides/e-bike-vs-motorcycle",
    kicker: "Classification",
    title: "E-bike versus electric motorcycle",
    description: "Understand why appearance alone does not determine registration, licensing or road-use requirements."
  },
  {
    href: "/guides/electric-motorcycle-registration-philippines",
    kicker: "Registration",
    title: "Electric motorcycle registration",
    description: "A source-linked guide to LTO classification and the checks to make before buying an electric two-wheeler."
  },
  {
    href: "/guides/electric-motorcycle-vs-gas-motorcycle",
    kicker: "Ownership",
    title: "Electric vs gas motorcycle",
    description: "Compare range, charging, refueling, maintenance and everyday ownership trade-offs."
  }
];

export default function GuidesPage() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides" }]} />
    <div className="page-head"><h1>Motorcycle guides for Philippine riders</h1><p>Practical buying and ownership guides built around checkable product information, fitment and Philippine-market requirements.</p></div>
    <div className="guide-grid">{editorialGuides.map((guide) => <Link className="guide-card" key={guide.slug} href={`/guides/${guide.slug}`}><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>

    <div className="section-head inline-head"><div><span className="section-kicker">Electric ownership</span><h2>Electric motorcycle guides</h2></div></div>
    <div className="guide-grid">{electricGuides.map((guide) => <Link className="guide-card" key={guide.href} href={guide.href}><span className="section-kicker">{guide.kicker}</span><h2>{guide.title}</h2><p>{guide.description}</p><strong className="guide-action">Read guide →</strong></Link>)}</div>

    <div className="section-head inline-head"><div><h2>More research tools</h2></div></div>
    <div className="topic-grid">
      <article><h2>Electric motorcycles</h2><p>Compare verified Philippine models, battery capacity, claimed range, charging time and registration classification.</p><div className="topic-action"><Link href="/motorcycles/electric">Browse electric models →</Link></div></article>
      <article><h2>Charging-cost calculator</h2><p>Estimate a full charge, cost per 100 km and monthly electricity use from your own rate and riding distance.</p><div className="topic-action"><Link href="/tools/electric-motorcycle-charging-cost">Calculate charging cost →</Link></div></article>
      <article><h2>Helmet Finder</h2><p>Filter verified helmet models by format, price, size and equipment.</p><div className="topic-action"><Link href="/gear/helmets/finder">Find a helmet →</Link></div></article>
      <article><h2>Motorcycle buying guides</h2><p>Compare current motorcycles by budget, seat height, category and riding use.</p><div className="topic-action"><Link href="/recommendations">Browse recommendations →</Link></div></article>
      <article><h2>Maintenance guides</h2><p>Use source-backed service information and model-specific ownership checks where available.</p><div className="topic-action"><Link href="/maintenance">Browse maintenance →</Link></div></article>
    </div>
  </section>;
}

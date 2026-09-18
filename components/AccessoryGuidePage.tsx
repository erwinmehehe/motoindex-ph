import Link from "next/link";
import { AccessorySeoGuideContent } from "@/components/AccessorySeoGuideContent";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAccessoryCategory } from "@/lib/data";
import type { AccessorySeoGuide } from "@/lib/accessorySeo";

const accessoryHubs = [
  { href: "/accessories/top-box", label: "Top boxes" },
  { href: "/accessories/phone-holders", label: "Phone holders" },
  { href: "/accessories/intercoms", label: "Intercoms" },
  { href: "/accessories/rain-gear", label: "Rain gear" }
];

export function AccessoryGuidePage({ guide }: { guide: AccessorySeoGuide }) {
  const category = getAccessoryCategory(guide.slug);
  if (!category) return null;

  return <section className="page shell accessories-master-page accessory-guide-page">
    <Breadcrumbs items={[{ label: "Accessories", href: "/accessories" }, { label: category.name }]} />
    <div className="page-head">
      <span className="entity-kicker">Motorcycle accessories</span>
      <h1>{guide.title}</h1>
      <p>{guide.intro}</p>
    </div>

    <nav className="product-entity-nav" aria-label="Accessory category pages">
      {accessoryHubs.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Buying checks</span><h2>What to confirm before you buy</h2><p>Use these checks before comparing brands or seller listings.</p></div></div>
      <div className="topic-grid">{category.buyerQuestions.map((question,index)=><article key={question}><span className="section-kicker">Check {String(index+1).padStart(2,"0")}</span><h3>{question}</h3></article>)}</div>
    </section>

    <AccessorySeoGuideContent guide={guide} />

    <section className="motorcycle-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fitment</span><h2>Check the exact motorcycle or helmet before ordering</h2><p>Accessory fitment depends on the mounting point, controls, helmet interior or riding setup. Use the relevant MotoIndex entity page before treating a product as compatible.</p></div></div>
      <div className="hero-actions"><Link className="button small" href="/motorcycles">Browse motorcycles</Link><Link className="button ghost small" href="/gear/helmets">Browse helmets</Link></div>
    </section>

    <AuthorBox />
  </section>;
}

import Link from "next/link";
import { AccessorySeoGuideContent } from "@/components/AccessorySeoGuideContent";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAccessoryCategory } from "@/lib/data";
import type { AccessorySeoGuide } from "@/lib/accessorySeo";
import { CTAGroup, PageHero, SectionHeader } from "@/components/ui";

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
    <PageHero kicker="Motorcycle accessories" title={guide.title} description={guide.intro} />

    <nav className="product-entity-nav" aria-label="Accessory category pages">
      {accessoryHubs.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>

    <section className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head compact" kicker="Buying checks" title="What to confirm before you buy" description="Use these checks before comparing brands or seller listings." />
      <div className="ui-content-grid">{category.buyerQuestions.map((question,index)=><article className="ui-content-card" key={question}><span className="ui-section-header__kicker">Check {String(index+1).padStart(2,"0")}</span><h3>{question}</h3></article>)}</div>
    </section>

    <AccessorySeoGuideContent guide={guide} />

    <section className="motorcycle-entity-section ui-page-section">
      <SectionHeader className="section-head compact" kicker="Fitment" title="Check the exact motorcycle or helmet before ordering" description="Accessory fitment depends on the mounting point, controls, helmet interior or riding setup. Use the relevant MotoIndex entity page before treating a product as compatible." />
      <CTAGroup><Link className="button small" href="/motorcycles">Browse motorcycles</Link><Link className="button ghost small" href="/gear/helmets">Browse helmets</Link></CTAGroup>
    </section>

    <AuthorBox />
  </section>;
}

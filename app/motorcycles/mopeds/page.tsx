import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { CTAGroup, InfoPanel, PageHero, SectionHeader } from "@/components/ui";
import { pageMetadata, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Moped Philippines 2026 | Prices, Meaning & Small Bikes",
  description: "Moped Philippines guide explaining how the term is used locally, with a current Skygo Duke reference and links to small scooters, underbones and electric alternatives.",
  path: "/motorcycles/mopeds"
});

export default function MopedsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Moped Philippines: prices, meaning and small-bike alternatives",
    mainEntityOfPage: `${SITE_URL}/motorcycles/mopeds`,
    dateModified: "2026-10-04"
  };

  return <main className="page"><div className="shell">
    <Breadcrumbs items={[{ label: "Motorcycles", href: "/motorcycles" }, { label: "Mopeds" }]} />
    <PageHero
      kicker="Philippine small-bike guide"
      title="Mopeds in the Philippines"
      description="The word moped is used loosely in Philippine searches for small step-through motorcycles, underbones, scooters and some electric vehicles. Start with the exact vehicle type and legal classification instead of relying on the label alone."
      actions={<CTAGroup><Link className="button" href="/motorcycles?max=150">Compare small motorcycles</Link><Link className="button secondary" href="/motorcycles/scooters">Compare scooters</Link></CTAGroup>}
    />

    <section className="section">
      <SectionHeader kicker="What counts as a moped?" title="Moped is a search term, not a safe shortcut for vehicle classification" description="Different sellers and riders use the word for different formats. MotoIndex keeps the formal motorcycle model and registration evidence separate from casual moped terminology." />
      <div className="ui-content-grid">
        <InfoPanel subtle><h3>Small gasoline motorcycles</h3><p>Many moped searches are really looking for light, inexpensive 110–125cc step-through or underbone motorcycles. Compare the exact model, transmission, weight and seat height.</p></InfoPanel>
        <InfoPanel subtle><h3>Scooters</h3><p>Automatic scooters are often grouped into the same search journey even though their chassis and transmission differ from traditional step-through motorcycles.</p></InfoPanel>
        <InfoPanel subtle><h3>Electric vehicles</h3><p>Electric sellers may use moped, e-bike and scooter interchangeably. Verify the exact LTO classification before assuming registration or licence requirements.</p></InfoPanel>
      </div>
    </section>

    <section className="section">
      <SectionHeader kicker="Current official example" title="Skygo Duke is listed by Skygo under its moped category" description="Skygo's official site currently places Duke in its motorcycle/moped product category and lists it at ₱47,000. Use that as one concrete market example, not as a definition for every vehicle sold as a moped." />
      <CTAGroup>
        <a className="button secondary" href="https://www.skygo.com.ph/index.php/product-category/motorcycles/moped/" target="_blank" rel="nofollow noopener noreferrer">Skygo moped category ↗</a>
        <Link className="button secondary" href="/motorcycles/skygo">Skygo price list</Link>
      </CTAGroup>
    </section>

    <section className="section">
      <SectionHeader kicker="Better comparisons" title="Choose by the vehicle you actually need" description="These existing MotoIndex hubs answer the decision more precisely than a broad moped label." />
      <div className="ui-content-grid">
        <Link href="/motorcycles?max=150" className="ui-content-card"><h3>Motorcycles below 150cc</h3><p>Compare small gasoline motorcycles by price, engine, transmission, weight and seat height.</p></Link>
        <Link href="/recommendations" className="ui-content-card"><h3>Underbone motorcycles</h3><p>Compare step-through and underbone choices with model-specific evidence.</p></Link>
        <Link href="/motorcycles/scooters" className="ui-content-card"><h3>Scooters</h3><p>Compare current automatic scooters by price and engine class.</p></Link>
        <Link href="/motorcycles/electric" className="ui-content-card"><h3>Electric motorcycles</h3><p>See electric models with stronger LTO and battery evidence.</p></Link>
      </div>
    </section>

    <FaqSection title="Moped Philippines FAQ" items={[
      { question: "What is a moped in the Philippines?", answer: "The word is used inconsistently in search results and seller listings. Check whether the exact vehicle is a motorcycle, scooter, underbone or electric vehicle and verify its LTO classification rather than relying on the word moped." },
      { question: "How much is a moped in the Philippines?", answer: "There is no single moped price because the label covers different vehicle types. As one current official example, Skygo lists the Duke in its moped category at ₱47,000." },
      { question: "Does a moped need registration in the Philippines?", answer: "Registration depends on the exact vehicle classification. Verify the model's current LTO classification and requirements before purchase." },
      { question: "What should I compare when buying a small motorcycle?", answer: "Compare the exact cash price, engine or motor specification, transmission, weight, seat height, brakes, parts support, warranty and legal classification." }
    ]} />
    <JsonLd data={schema} />
  </div></main>;
}

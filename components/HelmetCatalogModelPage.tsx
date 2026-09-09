import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { SourceRef } from "@/components/SourceRef";
import { getHelmetBrand } from "@/lib/data";
import { getHelmetProductsForBrand } from "@/lib/catalog";
import type { HelmetCatalogModel } from "@/lib/helmetBrandLineups";
import { absoluteUrl } from "@/lib/site";

export function HelmetCatalogModelPage({ item }: { item: HelmetCatalogModel }) {
  const brand = getHelmetBrand(item.brandSlug);
  const brandName = brand?.brand || item.brandSlug.toUpperCase();
  const detailed = getHelmetProductsForBrand(item.brandSlug)
    .filter((product) => product.status === "verified")
    .slice(0, 4);

  const canonicalPath = `/gear/helmets/${item.brandSlug}/${item.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brandName} ${item.model}`,
    url: absoluteUrl(canonicalPath),
    brand: { "@type": "Brand", name: brandName },
    category: "Motorcycle helmet",
    description: `${brandName} ${item.model} helmet guide for Philippine buyers with model identity, catalog source, sizing, certification, visor and purchase checks.`,
  };

  const faqs = [
    {
      question: `Is the ${brandName} ${item.model} a current helmet model?`,
      answer: `The ${brandName} ${item.model} appears in the current brand or Philippine retail catalog source linked on this page. Availability can still differ by seller, size and graphic.`,
    },
    {
      question: `How much is the ${brandName} ${item.model} in the Philippines?`,
      answer: "The final price depends on the seller, size, graphic, visor package and current promotion. Check a current Philippine seller for the exact version you plan to buy rather than using a price from another helmet in the same family.",
    },
    {
      question: `Is the ${brandName} ${item.model} certified for Philippine use?`,
      answer: "Check the certification label and the PS or ICC conformity marking on the exact helmet offered locally. Do not assume a certification from another market or another model applies to the unit in front of you.",
    },
    {
      question: `How do I choose the right ${brandName} ${item.model} size?`,
      answer: "Measure your head using the helmet maker's method and use the size chart for this exact model. Try the helmet on when possible because shell shape and cheek-pad thickness can differ even within one brand.",
    },
  ];

  return <section className="page shell product-entity-page helmet-model-guide-page">
    <Breadcrumbs items={[
      { label: "Helmets", href: "/gear/helmets" },
      { label: brandName, href: `/gear/helmets/${item.brandSlug}` },
      { label: item.model },
    ]} />

    <div className="page-head helmet-model-guide-head">
      <span className="entity-kicker">{brandName} helmet guide</span>
      <h1>{brandName} {item.model} helmet: price, fit and buying guide</h1>
      <p>Use this guide to check the exact {item.model} model before buying, including the current seller price, size chart, local certification marking, visor compatibility and replacement-parts availability.</p>
      <div className="hero-actions">
        <Link className="button" href={`/gear/helmets/${item.brandSlug}`}>All {brandName} helmets</Link>
        <Link className="button secondary" href="/gear/helmets/finder">Compare helmet options</Link>
      </div>
    </div>

    <div className="entity-price-grid helmet-model-buying-facts">
      <article><span>Model</span><strong>{brandName} {item.model}</strong><small>Listed in the linked current catalog reference.</small></article>
      <article><span>Price</span><strong>Check current seller</strong><small>Match the exact size, color or graphic and included visor.</small></article>
      <article><span>Fit</span><strong>Use the exact size chart</strong><small>Brand-level sizing is not a substitute for model-specific fit.</small></article>
      <article><span>Local compliance</span><strong>Check PS / ICC marking</strong><small>Inspect the actual helmet offered in the Philippines.</small></article>
    </div>

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>What to check on the {brandName} {item.model}</h2><p>These checks matter more than assuming details from another helmet in the same brand.</p></div></div>
      <div className="topic-grid">
        <article><h3>Fit and size chart</h3><p>Measure the widest part of your head and use the manufacturer chart for the {item.model}. Confirm cheek-pad pressure, forehead comfort and movement before paying.</p></article>
        <article><h3>Certification and PH marking</h3><p>Read the certification label on the actual unit and look for the required PS or ICC conformity marking for helmets sold locally.</p></article>
        <article><h3>Visor and replacement parts</h3><p>Confirm the shield code, Pinlock compatibility, visor mechanism and replacement-liner availability for this exact model before ordering accessories.</p></article>
        <article><h3>Price and variant</h3><p>Compare the same size, color or graphic across sellers. Replica graphics, bundled visors and promotions can change the asking price without changing the base model.</p></article>
      </div>
    </section>

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>{brandName} {item.model} catalog reference</h2><p>Use the original catalog reference to confirm the model name and current range, then check the exact local helmet before purchase.</p></div></div>
      <div className="source-panel verified">
        <span>Model source</span>
        <p>{item.sourceLabel}</p>
        <SourceRef url={item.sourceUrl} label="Open catalog source" />
        <small>Catalog checked {item.checkedAt}.</small>
      </div>
    </section>

    {detailed.length > 0 && <section className="product-entity-section">
      <div className="section-head compact"><div><h2>Compare other {brandName} helmets</h2><p>These {brandName} models have additional price and specification details for side-by-side shopping.</p></div></div>
      <div className="product-grid">{detailed.map((product) => <ProductCard key={product.id} item={{
        entityId: product.id,
        href: `/gear/helmets/${product.brandSlug}/${product.slug}`,
        category: product.helmetType,
        brand: product.brand,
        model: product.model,
        meta: [product.certification, product.shell].filter(Boolean).join(" · ") || product.visor,
        status: product.status,
        priceFromPhp: product.priceFromPhp,
      }} />)}</div>
    </section>}

    <section className="product-entity-section"><FaqSection title={`${brandName} ${item.model} buying questions`} items={faqs} /></section>
    <AuthorBox />
    <JsonLd data={schema} />
  </section>;
}

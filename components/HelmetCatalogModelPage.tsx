import Link from "next/link";
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
    description: `${brandName} ${item.model} is a current catalog model tracked by MotoIndex while model-specific Philippine price, fit, visor, shell and certification details are being completed.`,
  };

  const faqs = [
    {
      question: `Is the ${brandName} ${item.model} a real helmet model?`,
      answer: `Yes. MotoIndex tracks ${item.model} from the cited current ${brandName} brand or Philippine retail catalog. This page separates that confirmed model identity from details that still need exact model-specific verification.`,
    },
    {
      question: `How much is the ${brandName} ${item.model} in the Philippines?`,
      answer: "MotoIndex does not publish a price here until a current model-specific Philippine price source is checked. Seller prices can also vary by size, graphic, visor package and promotion.",
    },
    {
      question: `Is the ${brandName} ${item.model} certified for Philippine use?`,
      answer: "Check the conformity marking and certification label on the exact local unit. A brand-level catalog reference is not enough to confirm the certification of a specific helmet sold by a specific seller.",
    },
  ];

  return <section className="page shell product-entity-page">
    <Breadcrumbs items={[
      { label: "Helmets", href: "/gear/helmets" },
      { label: brandName, href: `/gear/helmets/${item.brandSlug}` },
      { label: item.model },
    ]} />

    <div className="page-head">
      <span className="entity-kicker">Current catalog model · checked {item.checkedAt}</span>
      <h1>{brandName} {item.model} helmet</h1>
      <p>{item.model} is listed in the current {brandName} catalog source tracked by MotoIndex. The model page is live now so riders can navigate to the exact helmet instead of hitting a dead catalog card while price, shell, visor, sizing and certification details are verified.</p>
      <div className="hero-actions">
        <Link className="button" href={`/gear/helmets/${item.brandSlug}`}>Back to {brandName} helmets</Link>
        <Link className="button secondary" href="/gear/helmets/finder">Open helmet finder</Link>
      </div>
    </div>

    <div className="entity-price-grid">
      <article><span>Catalog status</span><strong>Model identity confirmed</strong><small>Listed in the checked current catalog source.</small></article>
      <article><span>Philippine price</span><strong>Verification in progress</strong><small>No price is invented from a family or unrelated graphic.</small></article>
      <article><span>Detailed specification</span><strong>Verification in progress</strong><small>Exact shell, visor, sizing and certification stay model-specific.</small></article>
    </div>

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>What MotoIndex has confirmed</h2><p>This page distinguishes a confirmed catalog model name from product details that still need a stronger exact-model source.</p></div></div>
      <div className="entity-spec-table">
        <div><span>Brand</span><strong>{brandName}</strong></div>
        <div><span>Model / family</span><strong>{item.model}</strong></div>
        <div><span>Catalog checked</span><strong>{item.checkedAt}</strong></div>
        <div><span>Detail-page status</span><strong>Source expansion in progress</strong></div>
      </div>
    </section>

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>What to verify before buying</h2><p>Use the exact unit and exact model-specific source instead of assuming every helmet in one brand shares the same specification.</p></div></div>
      <div className="topic-grid">
        <article><h3>Fit and size chart</h3><p>Measure your head and use the size chart for this exact model. Shell shape can differ between models from the same brand.</p></article>
        <article><h3>Certification and PH marking</h3><p>Inspect the certification label plus the PS or ICC conformity marking on the actual helmet offered locally.</p></article>
        <article><h3>Visor and replacement parts</h3><p>Match replacement shields, Pinlock inserts and mechanisms to this exact helmet model before ordering.</p></article>
        <article><h3>Price and variant</h3><p>Compare the exact size, color or graphic and included visor bundle. A family name alone is not a reliable price reference.</p></article>
      </div>
    </section>

    <section className="product-entity-section">
      <div className="note-box">
        <h2>Catalog source</h2>
        <p>{item.sourceLabel}</p>
        <SourceRef url={item.sourceUrl} label="Open catalog source" />
        <small>Checked {item.checkedAt}. {item.note || "MotoIndex will replace catalog-only fields with exact model-specific data as stronger sources are verified."}</small>
      </div>
    </section>

    {detailed.length > 0 && <section className="product-entity-section">
      <div className="section-head compact"><div><h2>Detailed {brandName} helmet pages</h2><p>These models already have model-specific product records and can be used for a more complete price and specification comparison.</p></div></div>
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

    <section className="product-entity-section"><FaqSection title={`${brandName} ${item.model} questions`} items={faqs} /></section>
    <JsonLd data={schema} />
  </section>;
}

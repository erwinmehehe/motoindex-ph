import Link from "next/link";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { SourceRef } from "@/components/SourceRef";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { ProductEntityShell } from "@/components/ProductEntityShell";
import { ProductHero } from "@/components/ProductHero";
import { ProductTrustRow } from "@/components/ProductTrustRow";
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

  const heroFacts = [
    { label: "Record", value: "Current catalog reference" },
    { label: "Fit", value: "Use the exact size chart" },
    { label: "Local marking", value: "Check PS / ICC" },
    { label: "Parts", value: "Match the exact model" },
  ];

  return <ProductEntityShell className="helmet-model-guide-page">
    <Breadcrumbs items={[
      { label: "Helmets", href: "/gear/helmets" },
      { label: brandName, href: `/gear/helmets/${item.brandSlug}` },
      { label: item.model },
    ]} />

    <ProductHero
      media={<div className="entity-media"><div className="product-hero-card"><span>Helmet catalog</span><strong>H</strong><div><small>{brandName}</small><h2>{item.model}</h2></div></div></div>}
      eyebrow={<><span className="product-type-pill">Helmet</span><span className="product-status-pill research">Catalog reference</span></>}
      title={<>{brandName} {item.model}</>}
      description={<p>This page confirms the model in a current catalog reference and gives the buying checks that still need exact-product verification, including price, sizing, certification marking, visor and replacement parts.</p>}
      price="Check current seller"
      priceNote="Price is not verified on this catalog-reference page"
      facts={heroFacts}
      trust={<ProductTrustRow
        status="catalog"
        statusLabel="Catalog reference"
        sourceLabel={item.sourceLabel}
        source={{ url: item.sourceUrl, label: "Open catalog source" }}
        lastChecked={item.checkedAt}
      />}
    />

    <ProductEntityNav items={[
      { href: "#checks", label: "Buying checks" },
      { href: "#source", label: "Catalog source" },
      ...(detailed.length ? [{ href: "#alternatives", label: `Other ${brandName} helmets` }] : []),
      { href: "#faq", label: "FAQ" },
    ]} />

    <section id="checks" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Before you buy</span><h2>What to verify on the {brandName} {item.model}</h2><p>The catalog confirms the model identity. These purchase details still need to be checked on the exact local product.</p></div></div>
      <div className="ui-content-grid">
        <article className="ui-content-card"><h3>Fit and size chart</h3><p>Measure the widest part of your head and use the manufacturer chart for the {item.model}. Confirm cheek-pad pressure, forehead comfort and movement before paying.</p></article>
        <article className="ui-content-card"><h3>Certification and PH marking</h3><p>Read the certification label on the actual unit and look for the applicable PS or ICC conformity marking for helmets sold locally.</p></article>
        <article className="ui-content-card"><h3>Visor and replacement parts</h3><p>Confirm the shield code, Pinlock compatibility, visor mechanism and replacement-liner availability for this exact model before ordering accessories.</p></article>
        <article className="ui-content-card"><h3>Price and variant</h3><p>Compare the same size, color or graphic across sellers. Bundled visors and promotions can change the asking price without changing the base model.</p></article>
      </div>
    </section>

    <section id="source" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Evidence</span><h2>{brandName} {item.model} catalog reference</h2><p>Use the original catalog reference to confirm the model name and current range, then check the exact local helmet before purchase.</p></div></div>
      <div className="source-panel verified">
        <span>Model source</span>
        <p>{item.sourceLabel}</p>
        <SourceRef url={item.sourceUrl} label="Open catalog source" />
        <small>Catalog checked {item.checkedAt}.</small>
        {item.note && <p>{item.note}</p>}
      </div>
    </section>

    {detailed.length > 0 && <section id="alternatives" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Verified product pages</span><h2>Compare other {brandName} helmets</h2><p>These {brandName} models have additional price and specification details for side-by-side shopping.</p></div></div>
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

    <section id="faq" className="product-entity-section"><FaqSection title={`${brandName} ${item.model} buying questions`} items={faqs} /></section>
    <AuthorBox />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

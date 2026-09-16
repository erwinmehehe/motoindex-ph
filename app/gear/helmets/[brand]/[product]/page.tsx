import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getHelmetProduct, helmetProducts } from "@/lib/catalog";
import { getHelmetCatalogModel, helmetCatalogModels, helmetCatalogAliasTarget } from "@/lib/helmetBrandLineups";
import { HelmetCatalogModelPage } from "@/components/HelmetCatalogModelPage";
import { php } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { helmetProductInternalLinks } from "@/lib/internalLinks";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { EntityMedia } from "@/components/EntityMedia";
import { CommercePriceComparison } from "@/components/CommercePriceComparison";
// AffiliateOffer remains rendered by CommercePriceComparison for approved affiliate destinations.
import { helmetEditorial } from "@/lib/productEditorial";
import { helmetAlternatives, helmetComparisonTargets, helmetFaqs } from "@/lib/productSeo";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection } from "@/components/FaqSection";
import { SourceRef } from "@/components/SourceRef";
import { AuthorBox } from "@/components/AuthorBox";

export const revalidate = 3600;

export function generateStaticParams() {
  const params = [
    ...helmetProducts.map((p) => ({ brand: p.brandSlug, product: p.slug })),
    ...helmetCatalogModels.map((p) => ({ brand: p.brandSlug, product: p.slug })),
  ];
  return [...new Map(params.map((item) => [`${item.brand}/${item.product}`, item])).values()];
}

export async function generateMetadata({ params }: { params: Promise<{ brand: string; product: string }> }): Promise<Metadata> {
  const { brand, product } = await params;
  const p = getHelmetProduct(brand, product);
  if (!p) {
    const catalog = getHelmetCatalogModel(brand, product);
    if (!catalog) return {};
    const brandLabel = catalog.brandSlug.toUpperCase();
    return pageMetadata({
      title: `${brandLabel} ${catalog.model} Helmet Philippines: Buying Guide`,
      description: `${brandLabel} ${catalog.model} Philippines helmet guide with current catalog reference, seller-price checks, sizing, certification, visor and replacement-parts advice.`,
      path: `/gear/helmets/${catalog.brandSlug}/${catalog.slug}`,
      index: false,
    });
  }
  const base = pageMetadata({
    title: `${p.brand} ${p.model} Price Philippines: Specs & Size Guide`,
    description: `${p.brand} ${p.model} Philippines guide with price, size chart, shell, weight, visor/Pinlock details, pros and cons, alternatives and fit checks.`,
    path: `/gear/helmets/${p.brandSlug}/${p.slug}`,
    index: p.status === "verified",
  });
  const name = `${p.brand} ${p.model}`.toLowerCase();
  return { ...base, keywords: [`${name} price philippines`, `${name} size chart`, `${name} specs`, `${name} weight`, `${name} visor`, `${name} pinlock`, `${name} review`, `${name} helmet`] };
}

function helmetCompareRows(base: ReturnType<typeof getHelmetProduct>, other: NonNullable<ReturnType<typeof getHelmetProduct>>) {
  if (!base) return [];
  const rows: Array<readonly [string, string, string]> = [
    ["Type", base.helmetType, other.helmetType],
    ["Starting price", base.priceFromPhp ? php(base.priceFromPhp) : "Price not verified yet", other.priceFromPhp ? php(other.priceFromPhp) : "Price not verified yet"],
  ];
  if (base.shell && other.shell) rows.push(["Shell", base.shell, other.shell]);
  if (base.sizes.length && other.sizes.length) rows.push(["Sizes", base.sizes.join(" · "), other.sizes.join(" · ")]);
  rows.push(["Visor", base.visor, other.visor]);
  if (base.pinlock && other.pinlock) rows.push(["Pinlock / anti-fog", base.pinlock, other.pinlock]);
  if (base.intercomReady && other.intercomReady) rows.push(["Intercom provision", "Listed", "Listed"]);
  return rows;
}

export default async function HelmetProductPage({ params }: { params: Promise<{ brand: string; product: string }> }) {
  const { brand, product } = await params;
  const p = getHelmetProduct(brand, product);
  if (!p) {
    const aliasTarget = helmetCatalogAliasTarget(brand, product);
    if (aliasTarget) redirect(`/gear/helmets/${brand}/${aliasTarget}`);
    const catalog = getHelmetCatalogModel(brand, product);
    if (!catalog) return notFound();
    return <HelmetCatalogModelPage item={catalog} />;
  }

  const editorial = helmetEditorial(p);
  const alternatives = helmetAlternatives(p, 3);
  const compareTargets = helmetComparisonTargets(p, 2);
  const faqs = helmetFaqs(p);
  const canonicalPath = `/gear/helmets/${p.brandSlug}/${p.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.model}`,
    url: absoluteUrl(canonicalPath),
    brand: { "@type": "Brand", name: p.brand },
    category: `Motorcycle helmet — ${p.helmetType}`,
    description: p.description,
  };

  return <section className="page shell product-entity-page">
    <Breadcrumbs items={[{ label: "Helmets", href: "/gear/helmets" }, { label: p.brand, href: `/gear/helmets/${p.brandSlug}` }, { label: p.model }]} />

    <div className="product-hero">
      <div>
        <h1>{p.brand} {p.model}: price, specs and fit guide</h1>
        <p>{p.description}</p>
        <div className="product-facts helmet-product-facts">
          <div><span>Helmet type</span><strong>{p.helmetType}</strong></div>
          <div><span>Starting price</span><strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong></div>
          {p.sizes.length > 0 && <div><span>Sizes listed</span><strong>{p.sizes.join(" · ")}</strong></div>}
          {p.shell && <div><span>Shell</span><strong>{p.shell}</strong></div>}
        </div>
        <div className={`source-panel ${p.status}`}>
          <span>{p.status === "verified" ? "Product details" : "Needs checking"}</span>
          <p>{p.sourceLabel}</p>
          {p.sourceUrl && <SourceRef url={p.sourceUrl} label="Manufacturer/spec source" />}
          {p.priceSourceUrl && p.priceSourceUrl !== p.sourceUrl && <SourceRef url={p.priceSourceUrl} label="Price source" />}
          {p.lastChecked && <small>Updated {p.lastChecked}</small>}
        </div>
      </div>
      <EntityMedia entityType="helmet" entityId={p.id} fallback={<div className="product-hero-card"><span>Helmet</span><strong>H</strong><div><small>{p.brand}</small><h2>{p.model}</h2></div></div>} />
    </div>

    <ProductEntityNav items={[
      { href: "#price", label: "Price" },
      { href: "#specs", label: "Specs" },
      { href: "#size", label: "Sizing" },
      { href: "#visor", label: "Visor" },
      { href: "#pros-cons", label: "Pros & cons" },
      { href: "#alternatives", label: "Alternatives" },
      { href: "#compare", label: "Compare" },
      { href: "#faq", label: "FAQ" },
    ]} />

    <section id="price" className="product-entity-section">
      <div className="section-head compact"><div><h2>{p.brand} {p.model} price in the Philippines</h2><p>Use the dated amount as a reference, then check the current seller for the exact size, graphic, bundle and stock.</p></div></div>
      <div className="entity-price-grid">
        <article><span>Starting price reference</span><strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong>{p.lastChecked && <small>Updated {p.lastChecked}</small>}</article>
        {p.stockStatus && <article><span>Availability</span><strong>{p.stockStatus}</strong><small>Stock can differ by size and graphic.</small></article>}
        {(p.colors?.length || p.variants?.length) ? <article><span>Variants / colors</span><strong>{p.colors?.length ? p.colors.join(" · ") : p.variants?.join(" · ")}</strong><small>Do not assume every graphic is available in every size.</small></article> : null}
      </div>
      <CommercePriceComparison entityType="helmet" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="specs" className="product-entity-section">
      <div className="section-head compact"><div><h2>{p.brand} {p.model} specifications</h2></div></div>
      <div className="entity-spec-table" role="table" aria-label={`${p.brand} ${p.model} helmet specifications`}>
        <div role="row"><span role="cell">Helmet type</span><strong role="cell">{p.helmetType}</strong></div>
        {p.shell && <div role="row"><span role="cell">Shell / material</span><strong role="cell">{p.shell}</strong></div>}
        {p.weightG && <div role="row"><span role="cell">Weight</span><strong role="cell">{p.weightG.toLocaleString("en-PH")} g</strong></div>}
        {p.certification && <div role="row"><span role="cell">Safety certification</span><strong role="cell">{p.certification}</strong></div>}
        {p.intercomReady && <div role="row"><span role="cell">Intercom / speaker provision</span><strong role="cell">Listed for this model</strong></div>}
      </div>
    </section>

    <section id="size" className="product-entity-section">
      <div className="section-head compact"><div><h2>{p.brand} {p.model} size chart and fit</h2><p>Helmet fit is model-specific. Start with the manufacturer chart, then confirm pressure points and stability on your own head shape.</p></div></div>
      {p.sizeChart?.length ? <div className="entity-size-table">{p.sizeChart.map((row) => <div key={row.size}><strong>{row.size}</strong><span>{row.headCm} cm head circumference</span></div>)}</div> : p.sizes.length ? <div className="size-chips">{p.sizes.map((size) => <span key={size}>{size}</span>)}</div> : <div className="note-box compact-note"><h3>Size chart not verified yet</h3><p>Use the manufacturer&apos;s current size chart and measure your head before ordering.</p></div>}
      <div className="note-box compact-note"><h3>Before choosing a size</h3><p>Measure around the widest part of your head using the method shown by the helmet maker. A size letter from another helmet is not a reliable shortcut.</p></div>
    </section>

    <section id="visor" className="product-entity-section">
      <div className="section-head compact"><div><h2>Visor, Pinlock and replacement parts</h2></div></div>
      <div className="entity-spec-table">
        <div><span>Visor setup</span><strong>{p.visor}</strong></div>
        {p.pinlock && <div><span>Pinlock / anti-fog</span><strong>{p.pinlock}</strong></div>}
        {p.replacementVisors?.length ? <div><span>Replacement visor</span><strong>{p.replacementVisors.join(" · ")}</strong></div> : null}
      </div>
      {!p.replacementVisors?.length && <div className="note-box compact-note"><h3>Replacement visor check</h3><p>Match the visor to the exact helmet model and visor code before ordering.</p></div>}
    </section>

    <section id="pros-cons" className="product-entity-section">
      <div className="product-editorial">
        <article><span>Best for</span><h2>{editorial.bestFor}</h2><p>{p.description}</p></article>
        <article><span>Pros</span><ul>{editorial.pros.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><span>Cons / watch-outs</span><ul>{editorial.cons.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section">
      <div className="section-head compact"><div><h2>Alternatives to the {p.brand} {p.model}</h2><p>These are verified product pages chosen first from the same brand/type, then by nearby price where price data exists.</p></div></div>
      <div className="product-grid">{alternatives.map((item) => <ProductCard key={item.id} item={{ entityId: item.id, href: `/gear/helmets/${item.brandSlug}/${item.slug}`, category: item.helmetType, brand: item.brand, model: item.model, meta: [item.shell, item.pinlock].filter(Boolean).join(" · "), status: item.status, priceFromPhp: item.priceFromPhp }} />)}</div>
    </section>

    {compareTargets.length > 0 && <section id="compare" className="product-entity-section">
      <div className="section-head compact"><div><h2>{p.brand} {p.model} comparisons</h2><p>Comparison intent stays on this strong entity page instead of being split into separate thin URLs.</p></div><Link href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}`}>Open interactive compare →</Link></div>
      <div className="entity-comparisons">{compareTargets.map((other) => <article key={other.id}>
        <h3>{p.brand} {p.model} vs {other.brand} {other.model}</h3>
        <div className="mini-compare-table">
          <div className="head"><span>Feature</span><strong>{p.model}</strong><strong>{other.model}</strong></div>
          {helmetCompareRows(p, other).map(([label, a, b]) => <div key={label}><span>{label}</span><b>{a}</b><b>{b}</b></div>)}
        </div>
        <Link className="text-link" href={`/gear/helmets/${other.brandSlug}/${other.slug}`}>View {other.brand} {other.model} →</Link>
      </article>)}</div>
    </section>}

    <section id="faq" className="product-entity-section"><FaqSection title={`${p.brand} ${p.model} questions`} items={faqs} /></section>

    <div className="note-box"><h2>Philippine helmet check</h2><p>Inspect the conformity marking on the exact helmet offered locally, confirm the fit in your size, and match replacement visors or inserts to the exact model before buying.</p><Link className="text-link" href="/methodology">How MotoIndex checks product information →</Link></div>

    <AuthorBox />
    <RelatedLinks title={`More about ${p.brand} and ${p.helmetType.toLowerCase()} helmets`} links={helmetProductInternalLinks(p)} />
    <JsonLd data={schema} />
  </section>;
}

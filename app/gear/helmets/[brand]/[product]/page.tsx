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
import { AuthorBox } from "@/components/AuthorBox";
import { ProductEntityShell } from "@/components/ProductEntityShell";
import { ProductHero } from "@/components/ProductHero";
import { ProductTrustRow } from "@/components/ProductTrustRow";
import { getRenderableMedia } from "@/lib/renderableMedia";

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
  const media = getRenderableMedia("helmet", p.id)[0];
  const hasSpecificMedia = Boolean(media && !media.src.includes("/media/placeholders/"));
  const base = pageMetadata({
    title: `${p.brand} ${p.model} Price Philippines: Specs & Size Guide`,
    description: `${p.brand} ${p.model} Philippines guide with price, size chart, shell, weight, visor/Pinlock details, pros and cons, alternatives and fit checks.`,
    path: `/gear/helmets/${p.brandSlug}/${p.slug}`,
    index: p.status === "verified",
    image: hasSpecificMedia ? media?.src : undefined,
    imageAlt: hasSpecificMedia ? media?.alt : `${p.brand} ${p.model} motorcycle helmet`,
    imageWidth: hasSpecificMedia ? media?.width : undefined,
    imageHeight: hasSpecificMedia ? media?.height : undefined,
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

  const heroFacts = [
    { label: "Type", value: p.helmetType },
    { label: "Sizes", value: p.sizes.length ? p.sizes.join(" · ") : "Check size chart" },
    { label: p.weightG ? "Weight" : "Shell", value: p.weightG ? `${p.weightG.toLocaleString("en-PH")} g` : (p.shell || "See specifications") },
    { label: "Visor", value: p.pinlock ? `${p.visor} · ${p.pinlock}` : p.visor },
  ];

  return <ProductEntityShell className="helmet-product-page">
    <Breadcrumbs items={[{ label: "Helmets", href: "/gear/helmets" }, { label: p.brand, href: `/gear/helmets/${p.brandSlug}` }, { label: p.model }]} />

    <ProductHero
      media={<EntityMedia entityType="helmet" entityId={p.id} priority fallback={<div className="product-hero-card"><span>Helmet</span><strong>H</strong><div><small>{p.brand}</small><h2>{p.model}</h2></div></div>} />}
      eyebrow={<><span className="product-type-pill">Helmet</span><span className={`product-status-pill ${p.status}`}>{p.status === "verified" ? "Verified product" : "Needs checking"}</span></>}
      title={<>{p.brand} {p.model}</>}
      description={<p>{p.description}</p>}
      price={p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}
      priceNote={p.lastChecked ? `Observed starting price · checked ${p.lastChecked}` : "Starting price reference in the Philippines"}
      actions={<>
        <a className="helmet-primary-cta" href="#price">Compare prices</a>
        <a className="helmet-secondary-cta" href="#size">Check sizing</a>
      </>}
      facts={heroFacts}
      trust={<ProductTrustRow
        status={p.status}
        sourceLabel={p.sourceLabel}
        source={p.sourceUrl ? { url: p.sourceUrl, label: "Manufacturer/spec source" } : undefined}
        secondarySource={p.priceSourceUrl && p.priceSourceUrl !== p.sourceUrl ? { url: p.priceSourceUrl, label: "Price source" } : undefined}
        lastChecked={p.lastChecked}
      />}
    />

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

    <section id="price" className="product-entity-section product-price-section">
      <div className="section-head compact"><div><span className="section-kicker">Price & availability</span><h2>{p.brand} {p.model} price in the Philippines</h2><p>Use the observed amount as a reference, then verify the exact size, visor bundle, color and stock with the seller.</p></div></div>
      <div className="helmet-price-summary">
        <article className="primary-price-card">
          <span>Observed starting price</span>
          <strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong>
          <small>{p.lastChecked ? `Checked ${p.lastChecked}` : "Check the current seller before buying"}</small>
        </article>
        <article>
          <span>What to verify</span>
          <strong>Exact size, stock and bundle</strong>
          <small>Graphics, visor packages and checkout totals can change.</small>
        </article>
      </div>
      <CommercePriceComparison entityType="helmet" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="specs" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Specifications</span><h2>{p.brand} {p.model} specifications</h2></div></div>
      <div className="entity-spec-table helmet-spec-table" role="table" aria-label={`${p.brand} ${p.model} helmet specifications`}>
        <div role="row"><span role="cell">Helmet type</span><strong role="cell">{p.helmetType}</strong></div>
        {p.shell && <div role="row"><span role="cell">Shell / material</span><strong role="cell">{p.shell}</strong></div>}
        {p.weightG && <div role="row"><span role="cell">Weight</span><strong role="cell">{p.weightG.toLocaleString("en-PH")} g</strong></div>}
        {p.sizes.length > 0 && <div role="row"><span role="cell">Available sizes</span><strong role="cell">{p.sizes.join(" · ")}</strong></div>}
        <div role="row"><span role="cell">Visor setup</span><strong role="cell">{p.visor}</strong></div>
        {p.pinlock && <div role="row"><span role="cell">Pinlock / anti-fog</span><strong role="cell">{p.pinlock}</strong></div>}
        {p.certification && <div role="row"><span role="cell">Safety certification</span><strong role="cell">{p.certification}</strong></div>}
        {p.intercomReady && <div role="row"><span role="cell">Intercom / speaker provision</span><strong role="cell">Listed for this model</strong></div>}
      </div>
    </section>

    <section id="size" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fit guide</span><h2>{p.brand} {p.model} sizing</h2><p>Start with the exact model chart when available, then confirm even pressure and stability on your own head shape.</p></div></div>
      {p.sizeChart?.length ? <div className="entity-size-table">{p.sizeChart.map((row) => <div key={row.size}><strong>{row.size}</strong><span>{row.headCm} cm</span></div>)}</div> : p.sizes.length ? <div className="helmet-size-panel"><div><span>Available sizes</span><div className="size-chips">{p.sizes.map((size) => <span key={size}>{size}</span>)}</div></div><p>The exact head-circumference chart is not verified for this model. Measure your head before ordering and confirm the current {p.brand} chart for the exact unit.</p></div> : <div className="helmet-fit-note"><strong>Size chart not verified yet.</strong><span>Measure your head and confirm the maker&apos;s current chart before ordering.</span></div>}
      <div className="helmet-fit-note"><strong>Fit matters more than the size letter.</strong><span>A helmet should feel evenly snug without a painful hotspot or excessive movement.</span><Link href="/guides/motorcycle-helmet-size-guide">Read the helmet size guide →</Link></div>
    </section>

    <section id="visor" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Visor & parts</span><h2>{p.brand} {p.model} visor and replacement parts</h2><p>Match replacement parts to the exact helmet model rather than assuming another {p.brand} visor will fit.</p></div></div>
      <div className="helmet-parts-card">
        <div><span>Visor setup</span><strong>{p.visor}</strong></div>
        {p.pinlock && <div><span>Pinlock / anti-fog</span><strong>{p.pinlock}</strong></div>}
        <div><span>Replacement visor</span><strong>{p.replacementVisors?.length ? p.replacementVisors.join(" · ") : "Confirm the exact model and visor code before ordering"}</strong></div>
      </div>
    </section>

    <section id="pros-cons" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Buying decision</span><h2>Best for, strengths and trade-offs</h2></div></div>
      <div className="product-editorial">
        <article className="editorial-best"><span>Best for</span><h3>{editorial.bestFor}</h3><p>{p.description}</p></article>
        <article className="editorial-pros"><span>Strengths</span><ul>{editorial.pros.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="editorial-cons"><span>Trade-offs</span><ul>{editorial.cons.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Similar helmets</span><h2>Alternatives to the {p.brand} {p.model}</h2><p>These are verified product pages chosen first from the same brand/type, then by nearby price where price data exists.</p></div></div>
      <div className="product-grid">{alternatives.map((item) => <ProductCard key={item.id} item={{ entityId: item.id, href: `/gear/helmets/${item.brandSlug}/${item.slug}`, category: item.helmetType, brand: item.brand, model: item.model, meta: [item.shell, item.pinlock].filter(Boolean).join(" · "), status: item.status, priceFromPhp: item.priceFromPhp }} />)}</div>
    </section>

    {compareTargets.length > 0 && <section id="compare" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Compare</span><h2>{p.brand} {p.model} comparisons</h2><p>Comparison intent stays on this strong entity page instead of being split into separate thin URLs.</p></div><Link href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}`}>Open interactive compare →</Link></div>
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
  </ProductEntityShell>;
}

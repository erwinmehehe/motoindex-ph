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
    { label: "Sizes", value: p.sizes.length ? p.sizes.join(" · ") : "Check exact chart" },
    { label: p.weightG ? "Weight" : "Shell", value: p.weightG ? `${p.weightG.toLocaleString("en-PH")} g` : (p.shell || "See key details") },
    { label: "Safety", value: p.certification || "Verify the exact local unit" },
  ];

  return <ProductEntityShell className="helmet-product-page">
    <Breadcrumbs items={[{ label: "Helmets", href: "/gear/helmets" }, { label: p.brand, href: `/gear/helmets/${p.brandSlug}` }, { label: p.model }]} />

    <ProductHero
      media={<EntityMedia entityType="helmet" entityId={p.id} priority imageScale={1.08} fallback={<div className="product-hero-card"><span>Helmet</span><strong>H</strong><div><small>{p.brand}</small><h2>{p.model}</h2></div></div>} />}
      eyebrow={<><span className="product-type-pill">{p.helmetType}</span><span className={`product-status-pill ${p.status}`}>{p.status === "verified" ? "Verified product" : "Needs checking"}</span></>}
      title={<>{p.brand} {p.model}</>}
      description={<p>{p.description}</p>}
      price={p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}
      priceNote="Observed Philippine starting price"
      actions={<div className="helmet-hero-actions"><a className="button helmet-primary-cta" href="#price">Check current price</a><a className="helmet-secondary-cta" href="#details">Fit & specs</a></div>}
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
      { href: "#details", label: "Key details" },
      { href: "#decision", label: "Buying guide" },
      { href: "#alternatives", label: "Alternatives" },
      { href: "#faq", label: "FAQ" },
    ]} />

    <section id="price" className="product-entity-section helmet-price-section">
      <div className="helmet-section-intro"><span>Price & availability</span><h2>{p.brand} {p.model} price in the Philippines</h2><p>Use the observed amount as a reference, then confirm the exact size, graphic and bundle before checkout.</p></div>
      <div className="helmet-price-panel">
        <div className="helmet-price-main"><span>Observed starting price</span><strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong>{p.lastChecked && <small>Checked {p.lastChecked}</small>}</div>
        <div className="helmet-price-context"><span>Exact product</span><strong>{p.brand} {p.model}</strong><p>{p.stockStatus ? p.stockStatus : "Stock and final checkout price can vary by size, graphic and seller."}</p></div>
      </div>
      <CommercePriceComparison entityType="helmet" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="details" className="product-entity-section helmet-details-section">
      <div className="helmet-section-intro"><span>Key details</span><h2>What matters before you buy</h2><p>Construction, fit and visor compatibility are grouped here so you do not have to scan several repetitive spec sections.</p></div>
      <div className="helmet-detail-grid">
        <article className="helmet-detail-card">
          <div className="helmet-detail-icon" aria-hidden="true">01</div>
          <span>Safety & construction</span>
          <h3>{p.shell || p.helmetType}</h3>
          <dl>
            <div><dt>Type</dt><dd>{p.helmetType}</dd></div>
            {p.shell && <div><dt>Shell</dt><dd>{p.shell}</dd></div>}
            {p.weightG && <div><dt>Weight</dt><dd>{p.weightG.toLocaleString("en-PH")} g</dd></div>}
            {p.certification && <div><dt>Certification</dt><dd>{p.certification}</dd></div>}
          </dl>
        </article>

        <article className="helmet-detail-card helmet-fit-card">
          <div className="helmet-detail-icon" aria-hidden="true">02</div>
          <span>Fit & sizing</span>
          <h3>{p.sizes.length ? `${p.sizes.length} listed sizes` : "Check the current size chart"}</h3>
          {p.sizeChart?.length ? <div className="helmet-size-list">{p.sizeChart.map((row) => <div key={row.size}><strong>{row.size}</strong><span>{row.headCm} cm</span></div>)}</div> : p.sizes.length ? <div className="helmet-size-chips">{p.sizes.map((size) => <span key={size}>{size}</span>)}</div> : <p className="helmet-card-copy">Exact size chart not verified yet.</p>}
          <p className="helmet-card-copy">Measure your head and use the current manufacturer chart. A size letter from another helmet is not enough.</p>
          <Link href="/guides/motorcycle-helmet-size-guide">Open sizing guide →</Link>
        </article>

        <article className="helmet-detail-card">
          <div className="helmet-detail-icon" aria-hidden="true">03</div>
          <span>Visor & replacement parts</span>
          <h3>{p.pinlock ? "Anti-fog compatible setup" : "Check exact visor compatibility"}</h3>
          <dl>
            <div><dt>Visor</dt><dd>{p.visor}</dd></div>
            {p.pinlock && <div><dt>Pinlock / anti-fog</dt><dd>{p.pinlock}</dd></div>}
            <div><dt>Replacement visor</dt><dd>{p.replacementVisors?.length ? p.replacementVisors.join(" · ") : "Match the exact model and visor code"}</dd></div>
          </dl>
        </article>
      </div>
    </section>

    <section id="decision" className="product-entity-section helmet-decision-section">
      <div className="helmet-section-intro"><span>Buying guide</span><h2>Is the {p.brand} {p.model} a good fit for you?</h2></div>
      <div className="helmet-decision-grid">
        <article className="helmet-best-for"><span>Best for</span><h3>{editorial.bestFor}</h3><p>{p.description}</p></article>
        <article className="helmet-pros"><span>Strengths</span><ul>{editorial.pros.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="helmet-cons"><span>Trade-offs</span><ul>{editorial.cons.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section helmet-alternatives-section">
      <div className="helmet-section-intro"><span>Similar helmets</span><h2>Other helmets worth checking</h2><p>Verified alternatives are chosen first from the same brand or helmet type, then by nearby observed price where available.</p></div>
      <div className="product-grid helmet-alternative-grid">{alternatives.map((item) => <ProductCard key={item.id} item={{ entityId: item.id, href: `/gear/helmets/${item.brandSlug}/${item.slug}`, category: item.helmetType, brand: item.brand, model: item.model, meta: [item.shell, item.pinlock].filter(Boolean).join(" · "), status: item.status, priceFromPhp: item.priceFromPhp }} />)}</div>
    </section>

    {compareTargets.length > 0 && <section className="product-entity-section helmet-compare-section">
      <div className="helmet-section-intro helmet-compare-intro"><span>Compare</span><h2>Compare the {p.model}</h2><p>Use these shortcuts for a cleaner side-by-side decision instead of reading another large table here.</p></div>
      <div className="helmet-compare-cards">{compareTargets.map((other) => <article key={other.id}>
        <span>{other.helmetType}</span>
        <h3>{other.brand} {other.model}</h3>
        <div className="helmet-compare-meta"><strong>{other.priceFromPhp ? php(other.priceFromPhp) : "Price not verified"}</strong><small>{other.sizes.length ? `${other.sizes.length} listed sizes` : "Check sizing"}</small></div>
        <div className="helmet-compare-actions"><Link href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}&b=${encodeURIComponent(other.id)}`}>Compare side by side →</Link><Link href={`/gear/helmets/${other.brandSlug}/${other.slug}`}>View helmet</Link></div>
      </article>)}</div>
    </section>}

    <section id="faq" className="product-entity-section helmet-faq-section"><FaqSection title={`${p.brand} ${p.model} questions`} items={faqs} /></section>

    <div className="helmet-local-check"><div><span>Philippine buying check</span><h2>Confirm the exact unit before paying.</h2></div><p>Inspect the conformity marking, confirm the fit in your size, and match replacement visors or inserts to the exact model.</p><Link href="/methodology">How MotoIndex checks product information →</Link></div>

    <AuthorBox />
    <RelatedLinks title="Continue researching helmets" links={helmetProductInternalLinks(p).slice(0, 6)} />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

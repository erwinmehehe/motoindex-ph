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
    { label: "Safety", value: p.certification || "Verify exact local unit" },
  ];

  return <ProductEntityShell className="helmet-product-page">
    <Breadcrumbs items={[{ label: "Helmets", href: "/gear/helmets" }, { label: p.brand, href: `/gear/helmets/${p.brandSlug}` }, { label: p.model }]} />

    <ProductHero
      media={<EntityMedia entityType="helmet" entityId={p.id} priority fallback={<div className="product-hero-card"><span>Helmet</span><strong>H</strong><div><small>{p.brand}</small><h2>{p.model}</h2></div></div>} />}
      eyebrow={<><span className="product-type-pill">{p.helmetType}</span><span className={`product-status-pill ${p.status}`}>{p.status === "verified" ? "Verified product" : "Needs checking"}</span></>}
      title={<>{p.brand} {p.model}</>}
      description={<p>{p.description}</p>}
      price={p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}
      priceNote="Observed Philippine starting price"
      actions={<><a className="button helmet-primary-cta" href="#price">Check current price</a><a className="button ghost" href="#details">Fit & specs</a></>}
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

    <section id="price" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Price & availability</span><h2>{p.brand} {p.model} price in the Philippines</h2><p>Use the observed amount as a reference, then confirm the exact size, graphic and bundle before checkout.</p></div></div>
      <div className="entity-price-grid helmet-price-panel">
        <article className="primary-price-card"><span>Observed starting price</span><strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong>{p.lastChecked && <small>Checked {p.lastChecked}</small>}</article>
        <article><span>Exact product</span><strong>{p.brand} {p.model}</strong><small>{p.stockStatus || "Stock and final checkout price can vary by size, graphic and seller."}</small></article>
      </div>
      <CommercePriceComparison entityType="helmet" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="details" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Key details</span><h2>What matters before you buy</h2><p>Construction, fit and visor compatibility are grouped here so the important information is easier to scan.</p></div></div>
      <div className="product-editorial helmet-detail-grid">
        <article>
          <span>Safety & construction</span>
          <h3>{p.shell || p.helmetType}</h3>
          <ul>
            <li><strong>Type:</strong> {p.helmetType}</li>
            {p.shell && <li><strong>Shell:</strong> {p.shell}</li>}
            {p.weightG && <li><strong>Weight:</strong> {p.weightG.toLocaleString("en-PH")} g</li>}
            {p.certification && <li><strong>Certification:</strong> {p.certification}</li>}
          </ul>
        </article>
        <article>
          <span>Fit & sizing</span>
          <h3>{p.sizes.length ? `${p.sizes.length} listed sizes` : "Check the current size chart"}</h3>
          {p.sizeChart?.length ? <div className="entity-size-table">{p.sizeChart.map((row) => <div key={row.size}><strong>{row.size}</strong><span>{row.headCm} cm</span></div>)}</div> : p.sizes.length ? <div className="size-chips">{p.sizes.map((size) => <span key={size}>{size}</span>)}</div> : null}
          <p>Measure your head and use the current manufacturer chart. A size letter from another helmet is not enough.</p>
          <Link className="text-link" href="/guides/motorcycle-helmet-size-guide">Open sizing guide →</Link>
        </article>
        <article>
          <span>Visor & parts</span>
          <h3>{p.pinlock ? "Anti-fog compatible setup" : "Check exact visor compatibility"}</h3>
          <ul>
            <li><strong>Visor:</strong> {p.visor}</li>
            {p.pinlock && <li><strong>Pinlock / anti-fog:</strong> {p.pinlock}</li>}
            <li><strong>Replacement visor:</strong> {p.replacementVisors?.length ? p.replacementVisors.join(" · ") : "Match the exact model and visor code"}</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="decision" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Buying guide</span><h2>Is the {p.brand} {p.model} a good fit for you?</h2></div></div>
      <div className="product-editorial helmet-decision-grid">
        <article><span>Best for</span><h3>{editorial.bestFor}</h3><p>{p.description}</p></article>
        <article><span>Strengths</span><ul>{editorial.pros.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article><span>Trade-offs</span><ul>{editorial.cons.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Similar helmets</span><h2>Other helmets worth checking</h2><p>Verified alternatives are chosen first from the same brand or helmet type, then by nearby observed price where available.</p></div></div>
      <div className="product-grid">{alternatives.map((item) => <ProductCard key={item.id} item={{ entityId: item.id, href: `/gear/helmets/${item.brandSlug}/${item.slug}`, category: item.helmetType, brand: item.brand, model: item.model, meta: [item.shell, item.pinlock].filter(Boolean).join(" · "), status: item.status, priceFromPhp: item.priceFromPhp }} />)}</div>
    </section>

    {compareTargets.length > 0 && <section className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Compare</span><h2>Compare the {p.model}</h2><p>Use a focused side-by-side comparison instead of another large table on this page.</p></div><Link href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}`}>Open compare tool →</Link></div>
      <div className="product-editorial helmet-compare-cards">
        {compareTargets.map((other) => <article key={other.id}><span>{other.helmetType}</span><h3>{other.brand} {other.model}</h3><p>{other.priceFromPhp ? `Observed from ${php(other.priceFromPhp)}.` : "Price not verified yet."} {other.sizes.length ? `${other.sizes.length} listed sizes.` : ""}</p><Link className="text-link" href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}&b=${encodeURIComponent(other.id)}`}>Compare side by side →</Link></article>)}
        <article><span>Custom comparison</span><h3>Compare another helmet</h3><p>Choose any other verified helmet and compare the recorded price, fit and equipment.</p><Link className="text-link" href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}`}>Build comparison →</Link></article>
      </div>
    </section>}

    <section id="faq" className="product-entity-section"><FaqSection title={`${p.brand} ${p.model} questions`} items={faqs} /></section>

    <div className="note-box"><h2>Confirm the exact unit before paying</h2><p>Inspect the conformity marking, confirm the fit in your size, and match replacement visors or inserts to the exact model.</p><Link className="text-link" href="/methodology">How MotoIndex checks product information →</Link></div>

    <AuthorBox />
    <RelatedLinks title="Continue researching helmets" links={helmetProductInternalLinks(p).slice(0, 6)} />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

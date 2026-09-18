import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopBoxProduct, topBoxProducts } from "@/lib/catalog";
import { getModelById } from "@/lib/data";
import { getTopBoxFitmentsForProduct } from "@/lib/topBoxFitment";
import { php } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { topBoxInternalLinks } from "@/lib/internalLinks";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { EntityMedia } from "@/components/EntityMedia";
import { CommercePriceComparison } from "@/components/CommercePriceComparison";
import { topBoxEditorial } from "@/lib/productEditorial";
import { topBoxAlternatives, topBoxFaqs } from "@/lib/productSeo";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection } from "@/components/FaqSection";
import { ProductEntityShell } from "@/components/ProductEntityShell";
import { ProductHero } from "@/components/ProductHero";
import { ProductTrustRow } from "@/components/ProductTrustRow";

export const revalidate = 3600;

export function generateStaticParams() {
  return topBoxProducts.map((product) => ({ product: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const { product } = await params;
  const item = getTopBoxProduct(product);
  if (!item) return {};
  const base = pageMetadata({
    title: `${item.brand} ${item.model} Top Box Price Philippines: Fitment & Specs`,
    description: `${item.brand} ${item.model} top-box guide with price, ${item.capacityL}L capacity, dimensions, mounting system, motorcycle fitment, pros and cons and alternatives.`,
    path: `/accessories/top-box/${item.slug}`,
    index: item.status === "verified",
  });
  const name = `${item.brand} ${item.model}`.toLowerCase();
  return { ...base, keywords: [`${name} top box price philippines`, `${name} capacity`, `${name} fitment`, `${name} mounting`, `${name} review`, `${name} top box`] };
}

function topBoxPriceLabel(price?: number) {
  return typeof price === "number" ? php(price) : "Price not verified yet";
}

export default async function TopBoxProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  const item = getTopBoxProduct(product);
  if (!item) return notFound();

  const fitments = getTopBoxFitmentsForProduct(item.id)
    .map((fitment) => ({ fitment, motorcycle: getModelById(fitment.modelId) }))
    .filter((row) => row.motorcycle);
  const alternatives = topBoxAlternatives(item, 3);
  const compareTarget = alternatives[0];
  const editorial = topBoxEditorial(item);
  const faqs = topBoxFaqs(item);
  const canonicalPath = `/accessories/top-box/${item.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.brand} ${item.model}`,
    url: absoluteUrl(canonicalPath),
    brand: { "@type": "Brand", name: item.brand },
    category: "Motorcycle top box",
    description: item.description,
  };

  const heroFacts = [
    { label: "Capacity", value: `${item.capacityL} L` },
    { label: "Helmet capacity", value: item.helmetCapacity },
    { label: "Mounting", value: item.mountingSystem || item.shell },
    { label: typeof item.maxLoadKg === "number" ? "Maximum load" : "Shell", value: typeof item.maxLoadKg === "number" ? `${item.maxLoadKg} kg` : item.shell },
  ];

  return <ProductEntityShell>
    <Breadcrumbs items={[{ label: "Accessories", href: "/accessories" }, { label: "Top boxes", href: "/accessories/top-box" }, { label: item.model }]} />

    <ProductHero
      media={<EntityMedia entityType="topbox" entityId={item.id} priority fallback={<div className="product-hero-card"><span>Storage system</span><strong>B</strong><div><small>{item.brand}</small><h2>{item.model}</h2></div></div>} />}
      eyebrow={<><span className="product-type-pill">Top box</span><span className={`product-status-pill ${item.status}`}>{item.status === "verified" ? "Verified product" : "Needs checking"}</span></>}
      title={<>{item.brand} {item.model}</>}
      description={<p>{item.description}</p>}
      price={topBoxPriceLabel(item.priceFromPhp)}
      priceNote="Starting price reference in the Philippines"
      facts={heroFacts}
      trust={<ProductTrustRow
        status={item.status}
        sourceLabel={item.sourceLabel}
        source={item.sourceUrl ? { url: item.sourceUrl, label: "Manufacturer/product source" } : undefined}
        lastChecked={item.lastChecked}
      />}
    />

    <ProductEntityNav items={[
      { href: "#price", label: "Price" },
      { href: "#specs", label: "Specs" },
      { href: "#mounting", label: "Mounting" },
      { href: "#fitment", label: "Fitment" },
      { href: "#pros-cons", label: "Pros & cons" },
      { href: "#alternatives", label: "Alternatives" },
      ...(compareTarget ? [{ href: "#compare", label: "Compare" }] : []),
      { href: "#faq", label: "FAQ" },
    ]} />

    <section id="price" className="product-entity-section product-price-section">
      <div className="section-head compact"><div><span className="section-kicker">Price & availability</span><h2>{item.brand} {item.model} price in the Philippines</h2><p>The box price and the installed price are not always the same. A rack, fitting kit or plate may add cost.</p></div></div>
      <div className="entity-price-grid">
        <article className="primary-price-card"><span>Starting price reference</span><strong>{topBoxPriceLabel(item.priceFromPhp)}</strong>{item.lastChecked && <small>Updated {item.lastChecked}</small>}</article>
        {item.stockStatus && <article><span>Stock</span><strong>{item.stockStatus}</strong><small>Availability can change by cover color and bundle.</small></article>}
        {(item.colors?.length || item.variants?.length) ? <article><span>Finish / variants</span><strong>{item.colors?.length ? item.colors.join(" · ") : item.variants!.join(" · ")}</strong><small>Confirm the exact lid, cover and bundle included in the listing.</small></article> : null}
      </div>
      <CommercePriceComparison entityType="topbox" entityId={item.id} productName={`${item.brand} ${item.model}`} />
    </section>

    <section id="specs" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Specifications</span><h2>{item.brand} {item.model} specifications</h2></div></div>
      <div className="entity-spec-table">
        <div><span>Capacity</span><strong>{item.capacityL} L</strong></div>
        <div><span>Shell</span><strong>{item.shell}</strong></div>
        <div><span>Helmet storage</span><strong>{item.helmetCapacity}</strong></div>
        {item.dimensionsCm && <div><span>Dimensions</span><strong>{item.dimensionsCm.width} × {item.dimensionsCm.depth} × {item.dimensionsCm.height} cm</strong></div>}
        {typeof item.weightKg === "number" && <div><span>Box weight</span><strong>{item.weightKg} kg</strong></div>}
        {typeof item.maxLoadKg === "number" && <div><span>Maximum load</span><strong>{item.maxLoadKg} kg — rack limit may be lower</strong></div>}
        {item.variants?.length ? <div><span>Configurations / variants</span><strong>{item.variants.join(" · ")}</strong></div> : null}
      </div>
    </section>

    <section id="mounting" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Mounting</span><h2>Mounting system and included hardware</h2><p>Capacity does not determine motorcycle compatibility. The rack, plate and case interface must all match.</p></div></div>
      <div className="entity-spec-table">
        <div><span>Mounting system</span><strong>{item.mountingSystem || "Confirm the exact mounting system before purchase"}</strong></div>
        {item.includedHardware && <div><span>Included with the case</span><strong>{item.includedHardware}</strong></div>}
        <div><span>Motorcycle-side requirement</span><strong>{item.mountingNote}</strong></div>
      </div>
      {item.compatibleAccessories?.length ? <div className="entity-accessories"><h3>Compatible accessories</h3>{item.compatibleAccessories.map((accessory) => <div key={`${accessory.name}-${accessory.sku || ""}`}><strong>{accessory.name}</strong>{accessory.sku && <span>{accessory.sku}</span>}</div>)}</div> : null}
    </section>

    <section id="fitment" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fitment</span><h2>Motorcycle rack and bracket fitment</h2><p>Only model-specific fitment rows are shown here. Confirm the Philippine motorcycle model year and the exact hardware code before ordering.</p></div></div>
      {fitments.length ? <div className="fitment-evidence-grid">{fitments.map(({ fitment, motorcycle }) => <article key={fitment.id}>
        <span className={`catalog-status ${fitment.status === "verified" ? "verified" : ""}`}>{fitment.status}</span>
        <h3>{motorcycle!.make} {motorcycle!.model}</h3>
        <p><b>Rack:</b> {fitment.rackCode} · {fitment.rackLabel}</p>
        <p><b>Model years:</b> {fitment.modelYears}</p>
        <p>{fitment.plateRequirement}</p>
        {fitment.marketNote && <small>{fitment.marketNote}</small>}
        <a className="text-link" href={fitment.sourceUrl} target="_blank" rel="noreferrer">Open fitment source ↗</a>
        <Link className="text-link" href={`/motorcycles/${motorcycle!.makeSlug}/${motorcycle!.slug}#tires-fitment`}>Open MotoIndex fitment →</Link>
      </article>)}</div> : <div className="empty-state large">No model-specific rack or bracket is recorded for this box yet. Do not infer fit from capacity alone.</div>}
    </section>

    <section id="pros-cons" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Buying decision</span><h2>Best for, strengths and trade-offs</h2></div></div>
      <div className="product-editorial">
        <article className="editorial-best"><span>Best for</span><h3>{editorial.bestFor}</h3><p>{item.description}</p></article>
        <article className="editorial-pros"><span>Strengths</span><ul>{editorial.pros.map((point) => <li key={point}>{point}</li>)}</ul></article>
        <article className="editorial-cons"><span>Trade-offs</span><ul>{editorial.cons.map((point) => <li key={point}>{point}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Similar top boxes</span><h2>Alternatives to the {item.brand} {item.model}</h2><p>Alternatives stay on the entity page so shoppers can compare capacity and mounting requirements without bouncing through thin keyword pages.</p></div></div>
      {alternatives.length ? <div className="product-grid">{alternatives.map((alt) => <ProductCard key={alt.id} item={{ entityId: alt.id, href: `/accessories/top-box/${alt.slug}`, category: "Top box", brand: alt.brand, model: alt.model, meta: `${alt.capacityL}L · ${alt.mountingSystem || alt.shell}`, status: alt.status, priceFromPhp: alt.priceFromPhp }} />)}</div> : <div className="empty-state large">No other verified top-box entity is close enough to compare yet.</div>}
    </section>

    {compareTarget && <section className="product-entity-section" id="compare">
      <div className="section-head compact"><div><span className="section-kicker">Compare</span><h2>{item.brand} {item.model} vs {compareTarget.brand} {compareTarget.model}</h2></div></div>
      <div className="mini-compare-table wide">
        <div className="head"><span>Feature</span><strong>{item.model}</strong><strong>{compareTarget.model}</strong></div>
        <div><span>Capacity</span><b>{item.capacityL} L</b><b>{compareTarget.capacityL} L</b></div>
        <div><span>Starting price</span><b>{topBoxPriceLabel(item.priceFromPhp)}</b><b>{topBoxPriceLabel(compareTarget.priceFromPhp)}</b></div>
        <div><span>Helmet storage</span><b>{item.helmetCapacity}</b><b>{compareTarget.helmetCapacity}</b></div>
        <div><span>Mounting</span><b>{item.mountingSystem || item.shell}</b><b>{compareTarget.mountingSystem || compareTarget.shell}</b></div>
        {(typeof item.maxLoadKg === "number" || typeof compareTarget.maxLoadKg === "number") && <div><span>Maximum load</span><b>{typeof item.maxLoadKg === "number" ? `${item.maxLoadKg} kg` : "—"}</b><b>{typeof compareTarget.maxLoadKg === "number" ? `${compareTarget.maxLoadKg} kg` : "—"}</b></div>}
      </div>
    </section>}

    <section id="faq" className="product-entity-section"><FaqSection title={`${item.brand} ${item.model} top-box questions`} items={faqs} /></section>

    <div className="note-box"><h2>Philippines top-box note</h2><p>LTO removed the ₱100 registration fee for custom-made motorcycle top boxes and saddle bags, but safe mounting and other applicable road rules still matter.</p><a className="text-link" href="https://lto.gov.ph/news/bayad-sa-rehistro-ng-top-box-sa-motorsiklo-inalis-na-ng-lto/" target="_blank" rel="noreferrer">Read the LTO notice ↗</a></div>
    <RelatedLinks title="Related fitment pages" links={topBoxInternalLinks(item)} />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

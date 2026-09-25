import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTireProduct, getTireSizeMatches, tireProducts } from "@/lib/catalog";
import { isIndexableModel } from "@/lib/data";
import { php } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedLinks } from "@/components/RelatedLinks";
import { JsonLd } from "@/components/JsonLd";
import { tireProductInternalLinks } from "@/lib/internalLinks";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { EntityMedia } from "@/components/EntityMedia";
import { CommercePriceComparison } from "@/components/CommercePriceComparison";
import { tireEditorial } from "@/lib/productEditorial";
import { tireAlternatives, tireFaqs } from "@/lib/productSeo";
import { ProductEntityNav } from "@/components/ProductEntityNav";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection } from "@/components/FaqSection";
import { ProductEntityShell } from "@/components/ProductEntityShell";
import { ProductHero } from "@/components/ProductHero";
import { ProductTrustRow } from "@/components/ProductTrustRow";
import { AuthorBox } from "@/components/AuthorBox";

export const revalidate = 3600;

export function generateStaticParams() {
  return tireProducts.map((p) => ({ slug: p.brandSlug, product: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; product: string }> }): Promise<Metadata> {
  const { slug, product } = await params;
  const p = getTireProduct(slug, product);
  if (!p) return {};
  const base = pageMetadata({
    title: `${p.brand} ${p.model} Tire Price Philippines: Sizes & Fitment`,
    description: `${p.brand} ${p.model} motorcycle tire guide with exact listed sizes, bike matches, construction, price reference, pros and cons, alternatives and fitment checks.`,
    path: `/tires/${p.brandSlug}/${p.slug}`,
    index: p.status === "verified",
  });
  const name = `${p.brand} ${p.model}`.toLowerCase();
  return { ...base, keywords: [`${name} tire price philippines`, `${name} tire sizes`, `${name} motorcycle fitment`, `${name} review`, `${name} tire`] };
}

export default async function TireProductPage({ params }: { params: Promise<{ slug: string; product: string }> }) {
  const { slug, product } = await params;
  const p = getTireProduct(slug, product);
  if (!p) return notFound();

  const matches = getTireSizeMatches(p).filter((row) => isIndexableModel(row.motorcycle));
  const alternatives = tireAlternatives(p, 3);
  const compareTarget = alternatives[0];
  const editorial = tireEditorial(p);
  const faqs = tireFaqs(p);
  const canonicalPath = `/tires/${p.brandSlug}/${p.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.model}`,
    url: absoluteUrl(canonicalPath),
    brand: { "@type": "Brand", name: p.brand },
    category: "Motorcycle tire",
    description: p.description,
  };

  const heroFacts = [
    { label: "Use case", value: p.useCase },
    { label: "Listed sizes", value: String(p.knownSizes.length) },
    { label: "Catalog bike matches", value: String(matches.length) },
    { label: "Construction", value: p.construction },
  ];

  return <ProductEntityShell>
    <Breadcrumbs items={[{ label: "Tires", href: "/tires" }, { label: p.brand }, { label: p.model }]} />

    <ProductHero
      media={<EntityMedia entityType="tire" entityId={p.id} priority fallback={<div className="product-hero-card"><span>Tire family</span><strong>T</strong><div><small>{p.brand}</small><h2>{p.model}</h2></div></div>} />}
      eyebrow={<><span className="product-type-pill">Motorcycle tire</span><span className={`product-status-pill ${p.status}`}>{p.status === "verified" ? "Verified product" : "Needs checking"}</span></>}
      title={<>{p.brand} {p.model}</>}
      description={<p>{p.description}</p>}
      price={p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}
      priceNote="Starting price reference in the Philippines; exact size pricing can differ"
      facts={heroFacts}
      trust={<ProductTrustRow
        status={p.status}
        sourceLabel={p.sourceLabel}
        source={p.sourceUrl ? { url: p.sourceUrl, label: "Manufacturer/size source" } : undefined}
        lastChecked={p.lastChecked}
      />}
    />

    <ProductEntityNav items={[
      { href: "#price", label: "Price" },
      { href: "#sizes", label: "Sizes" },
      { href: "#fitment", label: "Fitment" },
      { href: "#pros-cons", label: "Pros & cons" },
      { href: "#alternatives", label: "Alternatives" },
      ...(compareTarget ? [{ href: "#compare", label: "Compare" }] : []),
      { href: "#faq", label: "FAQ" },
    ]} />

    <section id="price" className="product-entity-section product-price-section">
      <div className="section-head compact"><div><span className="section-kicker">Price & application</span><h2>{p.brand} {p.model} price in the Philippines</h2><p>Tire pricing depends heavily on the exact size. Compare the same size, load and speed rating, front or rear application and seller before ordering.</p></div></div>
      <div className="entity-price-grid">
        <article className="primary-price-card"><span>Starting price reference</span><strong>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong>{p.lastChecked && <small>Updated {p.lastChecked}</small>}</article>
        <article><span>Construction</span><strong>{p.construction}</strong><small>Confirm the exact tire sidewall and application before purchase.</small></article>
        <article><span>Primary use</span><strong>{p.useCase}</strong><small>Use the manufacturer&apos;s guidance for the exact size and axle.</small></article>
      </div>
      <CommercePriceComparison entityType="tire" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="sizes" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Recorded sizes</span><h2>{p.brand} {p.model} sizes</h2><p>These are manufacturer-listed sizes recorded for this tire family. Availability can differ by market and seller.</p></div></div>
      <div className="size-chips">{p.knownSizes.map((size) => <span key={size}>{size}</span>)}</div>
    </section>

    <section id="fitment" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Fitment candidates</span><h2>Motorcycles with a matching stock tire size</h2><p>A printed-size match is only a candidate. Confirm front or rear application, load index, speed rating, rim compatibility, construction and clearance before buying.</p></div></div>
      {matches.length ? <div className="match-grid">{matches.map((m) => <Link key={m.motorcycle.id} href={`/motorcycles/${m.motorcycle.makeSlug}/${m.motorcycle.slug}#tires-fitment`}>
        <strong>{m.motorcycle.make} {m.motorcycle.model}</strong>
        <small>Stock: {m.motorcycle.frontTire} / {m.motorcycle.rearTire}</small>
        <em>{m.frontMatch && m.rearMatch ? "Front + rear printed size match" : m.frontMatch ? "Front printed size match" : "Rear printed size match"}</em>
      </Link>)}</div> : <div className="empty-state large">No current motorcycle in the MotoIndex catalog shares one of these recorded sizes.</div>}
      <div className="note-box compact-note"><h3>Fitment rule</h3><p>Do not buy from size text alone. The same nominal size can still be wrong for the axle, rim, load or speed requirement.</p></div>
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
      <div className="section-head compact"><div><span className="section-kicker">Similar tires</span><h2>Alternatives to the {p.brand} {p.model}</h2><p>Alternatives are prioritized by overlapping recorded sizes so comparison intent stays on a useful product page.</p></div></div>
      {alternatives.length ? <div className="product-grid">{alternatives.map((alt) => <ProductCard key={alt.id} item={{ entityId: alt.id, href: `/tires/${alt.brandSlug}/${alt.slug}`, category: "Tire", brand: alt.brand, model: alt.model, meta: `${alt.useCase} · ${alt.knownSizes.length} listed sizes`, status: alt.status, priceFromPhp: alt.priceFromPhp }} />)}</div> : <div className="empty-state large">No other verified tire family overlaps the recorded sizes yet.</div>}
    </section>

    {compareTarget && <section id="compare" className="product-entity-section">
      <div className="section-head compact"><div><span className="section-kicker">Compare</span><h2>{p.brand} {p.model} vs {compareTarget.brand} {compareTarget.model}</h2></div></div>
      <div className="mini-compare-table wide">
        <div className="head"><span>Feature</span><strong>{p.model}</strong><strong>{compareTarget.model}</strong></div>
        <div><span>Use case</span><b>{p.useCase}</b><b>{compareTarget.useCase}</b></div>
        <div><span>Construction</span><b>{p.construction}</b><b>{compareTarget.construction}</b></div>
        <div><span>Sizes recorded</span><b>{p.knownSizes.length}</b><b>{compareTarget.knownSizes.length}</b></div>
        <div><span>Starting price</span><b>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</b><b>{compareTarget.priceFromPhp ? php(compareTarget.priceFromPhp) : "Price not verified yet"}</b></div>
      </div>
    </section>}

    <section id="faq" className="product-entity-section"><FaqSection title={`${p.brand} ${p.model} tire questions`} items={faqs} /></section>

    <div className="note-box"><h2>Check the exact tire before buying</h2><p>Match the complete sidewall specification and front or rear application to the motorcycle. A family name or nominal size by itself is not enough to prove fitment.</p><Link className="text-link" href="/fitment">Open MotoIndex fitment finder →</Link></div>

    <AuthorBox />
    <RelatedLinks title="Related tire-size pages" links={tireProductInternalLinks(p)} />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

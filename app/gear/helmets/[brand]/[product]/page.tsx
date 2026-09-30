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
      priceNote="Observed Philippine starting price"
      actions={<a className="button helmet-primary-cta" href="#price">Compare prices</a>}
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
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Price & availability</span><h2>{p.brand} {p.model} price in the Philippines</h2><p>Use the dated amount as a reference, then check the current seller for the exact size, graphic, bundle and stock.</p></div></div>
      <div className="helmet-price-summary" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:12}}>
        <article className="info-card primary-price-card" style={{display:"flex",minWidth:0,minHeight:168,padding:22,flexDirection:"column",justifyContent:"space-between"}}>
          <div><span className="section-kicker">Observed starting price</span><strong style={{display:"block",marginTop:8,fontSize:"clamp(34px,4vw,46px)",lineHeight:1,letterSpacing:"-.045em"}}>{p.priceFromPhp ? php(p.priceFromPhp) : "Price not verified yet"}</strong></div>
          <div><p style={{margin:"18px 0 0",color:"var(--mi-color-copy)",fontSize:11,lineHeight:1.55}}>Dated Philippine reference. Confirm the exact size, graphic, bundle, shipping and final checkout total before paying.</p>{p.lastChecked && <small style={{display:"block",marginTop:8,color:"var(--mi-color-muted)",fontSize:10}}>Checked {p.lastChecked}</small>}</div>
        </article>
        <article className="info-card helmet-product-check" style={{display:"flex",minWidth:0,minHeight:168,padding:22,flexDirection:"column",justifyContent:"space-between"}}>
          <div><span className="section-kicker">Exact product check</span><strong style={{display:"block",marginTop:8,fontSize:22,lineHeight:1.15,letterSpacing:"-.03em"}}>{p.brand} {p.model}</strong><p style={{margin:"10px 0 0",color:"var(--mi-color-copy)",fontSize:11,lineHeight:1.55}}>Make sure the seller listing matches this exact model before comparing price.</p></div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:18}}>
            <span style={{padding:"6px 9px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface-subtle)",fontSize:9,fontWeight:800}}>{p.helmetType}</span>
            {p.stockStatus && <span style={{padding:"6px 9px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface-subtle)",fontSize:9,fontWeight:800}}>{p.stockStatus}</span>}
            {p.sizes.length > 0 && <span style={{padding:"6px 9px",border:"1px solid var(--mi-color-line)",borderRadius:999,background:"var(--mi-color-surface-subtle)",fontSize:9,fontWeight:800}}>{p.sizes.join(" · ")}</span>}
          </div>
        </article>
      </div>
      <CommercePriceComparison entityType="helmet" entityId={p.id} productName={`${p.brand} ${p.model}`} />
    </section>

    <section id="specs" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Specifications</span><h2>{p.brand} {p.model} specifications</h2></div></div>
      <div className="entity-spec-table helmet-spec-grid" role="table" aria-label={`${p.brand} ${p.model} helmet specifications`}>
        <div role="row"><span role="cell">Helmet type</span><strong role="cell">{p.helmetType}</strong></div>
        {p.shell && <div role="row"><span role="cell">Shell / material</span><strong role="cell">{p.shell}</strong></div>}
        {p.weightG && <div role="row"><span role="cell">Weight</span><strong role="cell">{p.weightG.toLocaleString("en-PH")} g</strong></div>}
        {p.certification && <div role="row"><span role="cell">Safety certification</span><strong role="cell">{p.certification}</strong></div>}
        {p.intercomReady && <div role="row"><span role="cell">Intercom / speaker provision</span><strong role="cell">Listed for this model</strong></div>}
      </div>
    </section>

    <section id="size" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Fit guide</span><h2>{p.brand} {p.model} size chart and fit</h2><p>Helmet fit is model-specific. Start with the manufacturer chart, then confirm pressure points and stability on your own head shape.</p></div></div>
      <div className="helmet-fit-layout" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:12}}>
        <article className="helmet-fit-data info-card" style={{padding:22}}>
          <span className="section-kicker">Fit status</span>
          <h3 style={{margin:"8px 0 10px",fontSize:22,letterSpacing:"-.03em"}}>{p.sizeChart?.length ? "Model-specific size chart" : p.sizes.length ? "Available sizes" : "Exact chart not verified yet"}</h3>
          {p.sizeChart?.length ? <div className="entity-size-table">{p.sizeChart.map((row) => <div key={row.size}><strong>{row.size}</strong><span>{row.headCm} cm head circumference</span></div>)}</div> : p.sizes.length ? <><div className="size-chips">{p.sizes.map((size) => <span key={size}>{size}</span>)}</div><p style={{margin:"14px 0 0",color:"var(--mi-color-copy)",fontSize:11,lineHeight:1.55}}>Use the maker&apos;s current chart to match these size labels to your head circumference.</p></> : <p style={{margin:0,color:"var(--mi-color-copy)",fontSize:12,lineHeight:1.6}}>The exact circumference chart is not verified yet. Do not guess from the size letter alone; use the current manufacturer chart before ordering.</p>}
        </article>
        <article className="helmet-fit-help info-card" style={{padding:22}}>
          <span className="section-kicker">How to measure</span>
          <h3 style={{margin:"8px 0 14px",fontSize:22,letterSpacing:"-.03em"}}>Measure before ordering</h3>
          <div style={{display:"grid",gap:10}}>
            {["Wrap the tape around the widest part of your head.","Compare the result with this exact model’s current chart.","Check pressure points and movement before removing tags."].map((step,index)=><div key={step} style={{display:"grid",gridTemplateColumns:"26px 1fr",gap:9,alignItems:"start"}}><strong style={{display:"grid",width:26,height:26,placeItems:"center",borderRadius:999,background:"var(--mi-color-primary-soft)",color:"var(--mi-color-primary)",fontSize:10}}>{index+1}</strong><span style={{color:"var(--mi-color-copy)",fontSize:11,lineHeight:1.5}}>{step}</span></div>)}
          </div>
          <Link className="button ghost on-light" style={{display:"inline-flex",marginTop:16}} href="/guides/motorcycle-helmet-size-guide">Open sizing guide</Link>
        </article>
      </div>
    </section>

    <section id="visor" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Visor & parts</span><h2>Visor, Pinlock and replacement parts</h2></div></div>
      <div className="helmet-parts-card info-card">
        <div className="entity-spec-table helmet-visor-grid">
          <div><span>Visor setup</span><strong>{p.visor}</strong></div>
          {p.pinlock && <div><span>Pinlock / anti-fog</span><strong>{p.pinlock}</strong></div>}
          {p.replacementVisors?.length ? <div><span>Replacement visor</span><strong>{p.replacementVisors.join(" · ")}</strong></div> : <div><span>Replacement visor</span><strong>Verify the exact visor code</strong></div>}
        </div>
        <p>Replacement visors and anti-fog inserts must match the exact helmet model and visor code. Similar-looking parts are not enough.</p>
      </div>
    </section>

    <section id="pros-cons" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Buying decision</span><h2>Best for, strengths and trade-offs</h2></div></div>
      <div className="product-editorial">
        <article className="editorial-best"><span>Best for</span><h3>{editorial.bestFor}</h3><p>{p.description}</p></article>
        <article className="editorial-pros"><span>Strengths</span><ul>{editorial.pros.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="editorial-cons"><span>Trade-offs</span><ul>{editorial.cons.map((item) => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section id="alternatives" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Similar helmets</span><h2>Alternatives to the {p.brand} {p.model}</h2><p>These are verified product pages chosen first from the same brand/type, then by nearby price where price data exists.</p></div></div>
      <div className="product-grid">{alternatives.map((item) => <ProductCard key={item.id} item={{ entityId: item.id, href: `/gear/helmets/${item.brandSlug}/${item.slug}`, category: item.helmetType, brand: item.brand, model: item.model, meta: [item.shell, item.pinlock].filter(Boolean).join(" · "), status: item.status, priceFromPhp: item.priceFromPhp }} />)}</div>
    </section>

    {compareTargets.length > 0 && <section id="compare" className="product-entity-section">
      <div className="section-head compact helmet-section-head"><div><span className="section-kicker">Compare</span><h2>{p.brand} {p.model} comparisons</h2><p>Put the important differences side by side before opening another product page.</p></div><Link className="button ghost on-light helmet-compare-cta" href={`/gear/helmets/compare?a=${encodeURIComponent(p.id)}`}>Open interactive compare</Link></div>
      <div className="entity-comparisons helmet-comparison-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:12}}>{compareTargets.map((other) => <article className="helmet-compare-card info-card" style={{minWidth:0,padding:20}} key={other.id}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14}}>
          <div><span className="section-kicker">Head-to-head</span><h3 style={{margin:"6px 0 0",fontSize:19,lineHeight:1.2,letterSpacing:"-.025em"}}>{p.model} vs {other.model}</h3></div>
          <span style={{flex:"none",padding:"6px 9px",borderRadius:999,background:"var(--mi-color-primary-soft)",color:"var(--mi-color-primary)",fontSize:9,fontWeight:850}}>Compare</span>
        </div>
        <div className="compare-wrap" style={{overflowX:"auto",borderRadius:12}}>
          <table className="compare-table" style={{width:"100%",minWidth:560}}>
            <thead><tr><th>Feature</th><th>{p.model}</th><th>{other.model}</th></tr></thead>
            <tbody>{helmetCompareRows(p, other).map(([label, a, b]) => <tr key={label}><td>{label}</td><td>{a}</td><td>{b}</td></tr>)}</tbody>
          </table>
        </div>
        <Link className="text-link" style={{display:"inline-flex",marginTop:14,color:"var(--mi-color-primary)",fontSize:10,fontWeight:800}} href={`/gear/helmets/${other.brandSlug}/${other.slug}`}>View {other.brand} {other.model} →</Link>
      </article>)}</div>
    </section>}

    <section id="faq" className="product-entity-section"><FaqSection title={`${p.brand} ${p.model} questions`} items={faqs} /></section>

    <div className="note-box"><h2>Philippine helmet check</h2><p>Inspect the conformity marking on the exact helmet offered locally, confirm the fit in your size, and match replacement visors or inserts to the exact model before buying.</p><Link className="text-link" href="/methodology">How MotoIndex checks product information →</Link></div>

    <AuthorBox />
    <RelatedLinks title={`More about ${p.brand} and ${p.helmetType.toLowerCase()} helmets`} links={helmetProductInternalLinks(p)} />
    <JsonLd data={schema} />
  </ProductEntityShell>;
}

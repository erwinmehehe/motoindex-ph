import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { RelatedLinks } from "@/components/RelatedLinks";
import { articleSchema } from "@/lib/articleSchema";
import { getHelmetSeoCollection, getHelmetSeoCollectionProducts, type HelmetSeoCollectionSlug } from "@/lib/helmetSeoCollections";
import { absoluteUrl } from "@/lib/site";
import { php } from "@/lib/utils";

export function HelmetSeoCollectionPage({ slug }: { slug: HelmetSeoCollectionSlug }) {
  const collection = getHelmetSeoCollection(slug);
  if (!collection) return null;
  const products = getHelmetSeoCollectionProducts(slug);
  const brands = [...new Set(products.map((product) => product.brand))];
  const prices = products.map((product) => product.priceFromPhp).filter((value): value is number => typeof value === "number");
  const minPrice = prices.length ? Math.min(...prices) : undefined;
  const maxPrice = prices.length ? Math.max(...prices) : undefined;
  const checkedDates = products.map((product) => product.lastChecked);
  const article = articleSchema({
    headline: collection.title,
    description: collection.description,
    path: `/gear/helmets/${slug}`,
    about: collection.title.replace(" in the Philippines", ""),
    keywords: [collection.seoTitle, "motorcycle helmet Philippines"],
    checkedDates
  });
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${product.brand} ${product.model}`,
      url: absoluteUrl(`/gear/helmets/${product.brandSlug}/${product.slug}`)
    }))
  };
  const related = [
    { href: "/gear/helmets", title: "Motorcycle helmet prices", description: "Browse the full checked helmet catalog." },
    { href: "/gear/helmets/finder", title: "Helmet Finder", description: "Filter verified helmets by type, size, budget and equipment." },
    { href: "/guides/motorcycle-helmet-size-guide", title: "Motorcycle helmet size guide", description: "Measure your head and check model-specific fit." },
    { href: "/guides/motorcycle-helmet-certification-philippines", title: "Helmet certification in the Philippines", description: "Understand PS, ICC and international certification references." },
    ...(slug !== "for-commuting" ? [{ href: "/gear/helmets/for-commuting", title: "Helmets for commuting", description: "Compare road-helmet formats for daily Philippine riding." }] : []),
    ...(slug !== "ece-22-06" ? [{ href: "/gear/helmets/ece-22-06", title: "ECE 22.06 helmets", description: "See models with explicit ECE 22.06 references." }] : [])
  ];

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Helmets", href: "/gear/helmets" }, { label: collection.title.replace(" in the Philippines", "") }]} />
    <div className="page-head">
      <span className="section-kicker">{collection.kicker}</span>
      <h1>{collection.title}</h1>
      <p>{collection.intro}</p>
    </div>

    <div className="brand-facts">
      <div><span>Checked models</span><strong>{products.length}</strong></div>
      <div><span>Brands represented</span><strong>{brands.length}</strong></div>
      <div><span>Observed prices</span><strong>{minPrice && maxPrice ? (minPrice === maxPrice ? php(minPrice) : `${php(minPrice)}–${php(maxPrice)}`) : "Check model pages"}</strong></div>
    </div>

    <div className="note-box">
      <h2>How this list is built</h2>
      <p>{collection.selectionNote}</p>
    </div>

    {products.length > 0 ? <>
      <div className="section-head inline-head"><div><h2>Helmets to compare</h2><p>Open a model for its dated price source, sizing, visor, shell and certification notes.</p></div><Link href="/gear/helmets/compare">Compare helmets →</Link></div>
      <div className="product-grid">{products.map((product) => <ProductCard key={product.id} item={{
        entityId: product.id,
        href: `/gear/helmets/${product.brandSlug}/${product.slug}`,
        category: product.helmetType,
        brand: product.brand,
        model: product.model,
        meta: [product.certification, product.intercomReady ? "Intercom provision" : undefined].filter(Boolean).join(" · ") || product.visor,
        status: product.status,
        priceFromPhp: product.priceFromPhp
      }} />)}</div>
    </> : <div className="empty-state large"><h2>No models meet this filter yet</h2><p>MotoIndex will not fill a collection with unverified product records just to make the page look larger.</p></div>}

    <div className="split section">
      <div>
        <h2>{collection.buyingHeading}</h2>
        {collection.buyingCopy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="info-card">
        <h3>Check before buying</h3>
        <ul className="checklist">{collection.checks.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>

    <FaqSection title="Helmet buying questions" items={collection.faqs} />
    <RelatedLinks title="Continue your helmet research" links={related} />
    <JsonLd data={[article, itemList]} />
  </section>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { helmetProducts, isIndexableHelmetBrand } from "@/lib/catalog";
import { helmetBrands } from "@/lib/data";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title:"Motorcycle Helmet Brands Philippines 2026: Models & Prices",
  description:"Compare motorcycle helmet brands in the Philippines with verified model counts, helmet types, observed prices and direct links to exact helmet guides.",
  path:"/gear/helmets/brands",
  index:true
});

export default function HelmetBrandsPage(){
  const brands=helmetBrands
    .filter(brand=>isIndexableHelmetBrand(brand.slug))
    .map(brand=>{
      const products=helmetProducts.filter(product=>product.status==="verified"&&product.brandSlug===brand.slug);
      const types=[...new Set(products.map(product=>product.helmetType))];
      const prices=products.map(product=>product.priceFromPhp).filter((value):value is number=>typeof value==="number");
      return {
        ...brand,
        products,
        types,
        minPrice:prices.length?Math.min(...prices):undefined,
        maxPrice:prices.length?Math.max(...prices):undefined
      };
    })
    .sort((a,b)=>b.products.length-a.products.length||b.searchVolume-a.searchVolume||a.brand.localeCompare(b.brand));

  const itemList={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:"Motorcycle helmet brands in the Philippines",
    numberOfItems:brands.length,
    itemListElement:brands.map((brand,index)=>({
      "@type":"ListItem",
      position:index+1,
      name:`${brand.brand} helmets`,
      url:absoluteUrl(`/gear/helmets/${brand.slug}`)
    }))
  };

  return <section className="page shell helmet-brands-index">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Brands"}]} />
    <div className="page-head">
      <span className="section-kicker">Helmet brand directory</span>
      <h1>Motorcycle helmet brands in the Philippines</h1>
      <p>Compare the brands MotoIndex currently tracks using verified exact-model records. Brand names are only a starting point: open the brand guide to compare helmet type, fit, observed price, visor setup and model-specific certification evidence.</p>
    </div>

    <div className="brand-facts">
      <div><span>Brands with verified models</span><strong>{brands.length}</strong></div>
      <div><span>Verified helmet records</span><strong>{brands.reduce((sum,brand)=>sum+brand.products.length,0)}</strong></div>
      <div><span>Comparison rule</span><strong>Exact models first</strong></div>
    </div>

    <div className="ui-content-grid topic-grid">
      {brands.map(brand=><article className="ui-content-card" key={brand.slug}>
        <span className="entity-kicker">{brand.products.length} verified model{brand.products.length===1?"":"s"}</span>
        <h2><Link href={`/gear/helmets/${brand.slug}`}>{brand.brand} helmets</Link></h2>
        <p>{brand.positioning}</p>
        <p><strong>{brand.types.slice(0,4).join(" · ")||"Model types vary"}</strong></p>
        <p>{brand.minPrice&&brand.maxPrice
          ? `Observed starting prices: ${brand.minPrice===brand.maxPrice?php(brand.minPrice):`${php(brand.minPrice)}–${php(brand.maxPrice)}`}`
          :"Open the brand guide for current model and seller references."}</p>
        <Link href={`/gear/helmets/${brand.slug}`}>Compare {brand.brand} models →</Link>
      </article>)}
    </div>

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>Do not choose a helmet by brand alone</h2></div></div>
      <p>A single brand can sell budget thermoplastic helmets, premium composite shells, open-face city models, modular touring helmets and race-oriented full-face designs. Compare equivalent models at the same riding use and price tier.</p>
      <p>For a Philippine purchase, check the fit and the applicable PS or ICC conformity marking on the exact unit. International certification details are model-specific and should not be carried across an entire brand.</p>
      <div className="hero-actions">
        <Link className="button" href="/gear/helmets/finder">Open Helmet Finder</Link>
        <Link className="button ghost" href="/gear/helmets/compare">Compare exact helmets</Link>
      </div>
    </section>
    <JsonLd data={itemList}/>
  </section>;
}

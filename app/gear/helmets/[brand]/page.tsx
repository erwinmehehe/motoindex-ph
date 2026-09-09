import type { Metadata } from "next";
import Link from "next/link";
import { getHelmetBrand, helmetBrands } from "@/lib/data";
import { getHelmetBrandStats, isIndexableHelmetBrand } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { notFound } from "next/navigation";
import { php } from "@/lib/utils";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { RelatedLinks } from "@/components/RelatedLinks";
import { helmetBrandInternalLinks } from "@/lib/internalLinks";
import { pageMetadata } from "@/lib/site";
import { getHelmetBrandLineup, helmetCatalogCanonicalSlug } from "@/lib/helmetBrandLineups";
import { HelmetBrandGuide } from "@/components/HelmetBrandGuide";
import { AuthorBox } from "@/components/AuthorBox";

export function generateStaticParams(){return helmetBrands.map(h=>({brand:h.slug}));}
export async function generateMetadata({params}:{params:Promise<{brand:string}>}):Promise<Metadata>{
  const {brand}=await params;
  const h=getHelmetBrand(brand);
  if(!h)return {};
  return pageMetadata({
    title:`${h.brand} Helmet Price Philippines 2026: Models & Types`,
    description:`Compare ${h.brand} helmet prices, types, sizes and visor features in the Philippines, with model pages and current product references.`,
    path:`/gear/helmets/${h.slug}`,
    index:isIndexableHelmetBrand(brand)
  });
}
export default async function HelmetBrandPage({params}:{params:Promise<{brand:string}>}){
  const {brand}=await params;
  const h=getHelmetBrand(brand);
  if(!h)return notFound();
  const {products,verifiedCount,minPrice,maxPrice}=getHelmetBrandStats(brand);
  const lineup=getHelmetBrandLineup(brand);
  const verified=products.filter(p=>p.status==="verified").sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.model.localeCompare(b.model));
  const types=[...new Set(verified.map(p=>p.helmetType))];
  const latestChecked=[...verified.map(p=>p.lastChecked),lineup?.checkedAt].filter((v):v is string=>Boolean(v)).sort().at(-1);
  const verifiedSlugs=new Set(verified.map(p=>p.slug));
  const lineupModels=(lineup?.models||[]).filter(model=>!verifiedSlugs.has(helmetCatalogCanonicalSlug(h.slug, model))).sort((a,b)=>a.localeCompare(b));
  const trackedCount=verified.length+lineupModels.length;
  const faqs: FaqItem[]=[
    {question:`How much is a ${h.brand} helmet in the Philippines?`,answer:minPrice&&maxPrice?`The ${h.brand} models in this guide have starting prices from ${php(minPrice)} to ${php(maxPrice)}. The exact price can change by graphic, visor bundle, size and seller, so open the source on the individual model before buying.`:`There are not enough priced ${h.brand} models yet for a useful range. Open the available model pages for current details.`},
    {question:`What types of ${h.brand} helmets are covered here?`,answer:types.length?`The ${h.brand} models with detailed specifications currently include ${types.join(", ")}. Open any model guide to check the exact helmet type, fit and local-unit certification before buying.`:`Open the ${h.brand} model guides to compare the current range and check the exact helmet before buying.`},
    {question:`Are ${h.brand} helmets certified for use in the Philippines?`,answer:`Certification can vary by model and market. Check the PS or ICC mark and the certification label on the actual ${h.brand} helmet offered in the Philippines.`},
    {question:`How should I choose a ${h.brand} helmet size?`,answer:"Use the manufacturer size chart for the exact model, measure head circumference as instructed, and try the helmet on when possible. A brand-level size label does not guarantee the same internal fit across different helmet models."}
  ];
  const brandArticle = articleSchema({
    headline: `${h.brand} helmet prices and models in the Philippines`,
    description: `Compare ${h.brand} helmet prices, types, sizes and certification in the Philippines.`,
    path: `/gear/helmets/${h.slug}`,
    about: `${h.brand} helmet price Philippines`,
    keywords: [`${h.brand} helmet`, `${h.brand} helmet price`, "motorcycle helmet Philippines"],
    checkedDates: [...verified.map(p => p.lastChecked), lineup?.checkedAt]
  });
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:h.brand}]} />
    <div className="page-head helmet-brand-head"><h1>{h.brand} helmet prices and models in the Philippines</h1><p>Compare {h.brand} helmet models, types, sizes, visor features and current price references. Open a model guide to check fit, certification and the exact local unit before buying.</p><div className="brand-facts"><div><span>Models covered</span><strong>{trackedCount}</strong></div><div><span>Price-checked models</span><strong>{verifiedCount}</strong></div><div><span>Types found</span><strong>{types.length?types.join(" · "):"Varies by model"}</strong></div><div><span>Published prices</span><strong>{minPrice&&maxPrice?(minPrice===maxPrice?php(minPrice):`${php(minPrice)}–${php(maxPrice)}`):"Check model guides"}</strong></div>{latestChecked&&<div><span>Updated</span><strong>{latestChecked}</strong></div>}</div></div>

    {trackedCount>0?<>
      <div className="section-head inline-head"><div><h2>{h.brand} helmet models</h2><p>Browse the current {h.brand} model guides in one place. Models with a checked Philippine price show it below; open any model for fit, visor, certification and seller checks.</p></div></div>

      {verified.length>0&&<div className="product-grid helmet-detailed-model-grid">{verified.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:[p.certification,p.shell].filter(Boolean).join(" · ")||p.visor,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>}

      {lineupModels.length>0&&<div className="helmet-model-guide-grid">{lineupModels.map(model=><Link className="helmet-model-guide-card" href={`/gear/helmets/${h.slug}/${helmetCatalogCanonicalSlug(h.slug, model)}`} key={model}><span>{h.brand}</span><h3>{model}</h3><p>Helmet model guide</p><strong>View model →</strong></Link>)}</div>}

      {lineup&&<p className="helmet-brand-catalog-source"><a href={lineup.sourceUrl} target="_blank" rel="noreferrer">Brand/catalog reference ↗</a> <small>Checked {lineup.checkedAt}</small></p>}

      {verified.length>0&&<>
        <div className="section-head"><div><h2>{h.brand} helmet prices</h2><p>These are starting prices from the linked product or seller pages. Price can change with stock, size, graphic and promotions.</p></div></div>
        <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Model</span><span>Type</span><span>Starting price</span><span>Last checked</span></div>{verified.map(p=><Link href={`/gear/helmets/${p.brandSlug}/${p.slug}`} className="helmet-brand-row" key={p.id}><strong>{p.model}</strong><span>{p.helmetType}</span><span>{p.priceFromPhp?php(p.priceFromPhp):"Check model"}</span><span>{p.lastChecked||"Source page"}</span></Link>)}</div>
      </>}
    </>:<div className="empty-state large">No current {h.brand} model guides are available on this page.</div>}


    <div className="split section helmet-buying-notes"><div><h2>Why {h.brand} helmet prices can differ</h2><p>Graphics, shell material, visor bundles, size availability and promotions can change the price of the same helmet family. Compare the exact variant and seller before paying.</p></div><div className="info-card"><h3>Before buying a helmet</h3><ul className="checklist"><li>Check the PS or ICC mark on the exact helmet sold in the Philippines.</li><li>Use the manufacturer&apos;s size chart, then try the helmet on when possible.</li><li>Confirm the certification shown on the actual unit.</li><li>Check visor, liner and spare-part availability before choosing a model.</li></ul></div></div>
    <HelmetBrandGuide brand={h.brand} verified={verified} types={types} minPrice={minPrice} maxPrice={maxPrice} trackedCount={trackedCount} />
    {trackedCount>0&&<FaqSection title={`${h.brand} helmet price and buying questions`} items={faqs}/>} 
    <AuthorBox />
    <RelatedLinks title={`Explore ${h.brand} and related helmet guides`} links={helmetBrandInternalLinks(h.slug)} />
    <JsonLd data={brandArticle} />
  </section>;
}

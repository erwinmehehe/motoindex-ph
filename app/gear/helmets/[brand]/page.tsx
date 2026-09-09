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
  const latestChecked=verified.map(p=>p.lastChecked).filter((v):v is string=>Boolean(v)).sort().at(-1);
  const verifiedSlugs=new Set(verified.map(p=>p.slug));
  const lineupModels=(lineup?.models||[]).filter(model=>!verifiedSlugs.has(helmetCatalogCanonicalSlug(h.slug, model)));
  const trackedCount=verified.length+lineupModels.length;
  const faqs: FaqItem[]=[
    {question:`How much is a ${h.brand} helmet in the Philippines?`,answer:minPrice&&maxPrice?`The ${h.brand} models in this guide have starting prices from ${php(minPrice)} to ${php(maxPrice)}. The exact price can change by graphic, visor bundle, size and seller, so open the source on the individual model before buying.`:`There are not enough priced ${h.brand} models yet for a useful range. Open the available model pages for current details.`},
    {question:`What types of ${h.brand} helmets are covered here?`,answer:types.length?`The detailed ${h.brand} pages currently cover ${types.join(", ")}. The brand may sell other helmet types or models that are still being researched.`:`Detailed ${h.brand} product pages are still being added.`},
    {question:`Are ${h.brand} helmets certified for use in the Philippines?`,answer:`Certification can vary by model and market. Check the PS or ICC mark and the certification label on the actual ${h.brand} helmet offered in the Philippines.`},
    {question:`How should I choose a ${h.brand} helmet size?`,answer:"Use the manufacturer size chart for the exact model, measure head circumference as instructed, and try the helmet on when possible. A brand-level size label does not guarantee the same internal fit across different helmet models."}
  ];
  const brandArticle = articleSchema({
    headline: `${h.brand} helmet prices and models in the Philippines`,
    description: `Compare ${h.brand} helmet prices, types, sizes and certification in the Philippines.`,
    path: `/gear/helmets/${h.slug}`,
    about: `${h.brand} helmet price Philippines`,
    keywords: [`${h.brand} helmet`, `${h.brand} helmet price`, "motorcycle helmet Philippines"],
    checkedDates: verified.map(p => p.lastChecked)
  });
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:h.brand}]} />
    <div className="page-head helmet-brand-head"><h1>{h.brand} helmet prices and models in the Philippines</h1><p>Compare {h.brand} helmet types, sizes, features and recent listed prices. Availability can change by size, graphic and seller, so use each model page as a starting point and check the actual helmet before buying.</p><div className="brand-facts"><div><span>Models tracked</span><strong>{trackedCount}</strong></div><div><span>Detailed models</span><strong>{verifiedCount}</strong></div><div><span>Types covered</span><strong>{types.length?types.join(" · "):"Researching"}</strong></div><div><span>Listed prices</span><strong>{minPrice&&maxPrice?(minPrice===maxPrice?php(minPrice):`${php(minPrice)}–${php(maxPrice)}`):"Not enough data"}</strong></div>{latestChecked&&<div><span>Updated</span><strong>{latestChecked}</strong></div>}</div></div>

    {verified.length?<>
      <div className="section-head inline-head"><div><h2>{h.brand} models with detailed pages</h2><p>Open a model for price, fit, visor, shell and certification notes, plus the product information used for the page.</p></div></div>
      <div className="product-grid">{verified.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:[p.certification,p.shell].filter(Boolean).join(" · ")||p.visor,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>

      {lineup && lineupModels.length>0 && <section className="brand-lineup section" aria-labelledby="brand-lineup-title">
        <div className="section-head compact"><div><h2 id="brand-lineup-title">More {h.brand} models in current catalogs ({lineupModels.length})</h2><p>These are additional real model or family names from the cited brand or Philippine retail catalog. They stay visible here while MotoIndex finishes the model-specific price, fit, visor, shell and certification checks needed for a full detail page.</p></div></div>
        <div className="brand-lineup-grid">{lineupModels.map(model=><Link className="brand-lineup-card" href={`/gear/helmets/${h.slug}/${helmetCatalogCanonicalSlug(h.slug, model)}`} key={model}><strong>{model}</strong><span>Open model page →</span></Link>)}</div>
        {lineup.note&&<p className="muted-copy">{lineup.note}</p>}
        <p className="brand-lineup-source"><a href={lineup.sourceUrl} target="_blank" rel="noreferrer">View {lineup.sourceLabel} ↗</a> <small>Checked {lineup.checkedAt}</small></p>
      </section>}

      <div className="section-head"><div><h2>{h.brand} helmet price list</h2><p>These are dated starting prices from the linked product or seller pages. They can change with stock, size, graphic and promotions.</p></div></div>
      <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Model</span><span>Type</span><span>Starting price</span><span>Last checked</span></div>{verified.map(p=><Link href={`/gear/helmets/${p.brandSlug}/${p.slug}`} className="helmet-brand-row" key={p.id}><strong>{p.model}</strong><span>{p.helmetType}</span><span>{p.priceFromPhp?php(p.priceFromPhp):"Check model"}</span><span>{p.lastChecked||"Source page"}</span></Link>)}</div>
    </>:<div className="empty-state large">We do not have enough current {h.brand} model data to publish this brand guide yet.</div>}


    <div className="split section helmet-buying-notes"><div><h2>Why {h.brand} helmet prices can differ</h2><p>Graphics, shell material, visor bundles, size availability and promotions can change the price of the same helmet family. Compare the exact variant and seller before paying.</p></div><div className="info-card"><h3>Before buying a helmet</h3><ul className="checklist"><li>Check the PS or ICC mark on the exact helmet sold in the Philippines.</li><li>Use the manufacturer&apos;s size chart, then try the helmet on when possible.</li><li>Confirm the certification shown on the actual unit.</li><li>Check visor, liner and spare-part availability before choosing a model.</li></ul></div></div>
    <HelmetBrandGuide brand={h.brand} verified={verified} types={types} minPrice={minPrice} maxPrice={maxPrice} trackedCount={trackedCount} />
    {verified.length>0&&<FaqSection title={`${h.brand} helmet price and buying questions`} items={faqs}/>} 
    <RelatedLinks title={`Explore ${h.brand} and related helmet guides`} links={helmetBrandInternalLinks(h.slug)} />
    <JsonLd data={brandArticle} />
  </section>;
}

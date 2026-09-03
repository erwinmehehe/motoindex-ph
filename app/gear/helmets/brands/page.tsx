import type { Metadata } from "next";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { helmetBrands } from "@/lib/data";
import { getHelmetBrandStats, isIndexableHelmetBrand } from "@/lib/catalog";
import { php } from "@/lib/utils";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { getHelmetBrandLineup } from "@/lib/helmetBrandLineups";

export const metadata: Metadata = pageMetadata({
  title: "Helmet Brands Philippines: Compare Models, Prices & Types",
  description: "Compare motorcycle helmet brands in the Philippines by tracked models, detailed product pages, helmet types and current price observations.",
  path: "/gear/helmets/brands",
  index: true,
});

export default function HelmetBrandsPage(){
  const rows=helmetBrands.filter(b=>isIndexableHelmetBrand(b.slug)).map(b=>{
    const s=getHelmetBrandStats(b.slug);
    const types=[...new Set(s.products.filter(p=>p.status==="verified").map(p=>p.helmetType))];
    const verifiedNames=new Set(s.products.filter(p=>p.status==="verified").map(p=>p.model.toLowerCase()));
    const lineupCount=(getHelmetBrandLineup(b.slug)?.models||[]).filter(model=>!verifiedNames.has(model.toLowerCase())).length;
    const trackedCount=s.verifiedCount+lineupCount;
    return {...b,...s,types,trackedCount};
  }).sort((a,b)=>b.trackedCount-a.trackedCount || b.verifiedCount-a.verifiedCount || a.brand.localeCompare(b.brand));

  const schema={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:"Motorcycle helmet brands in the Philippines",
    itemListElement:rows.map((row,index)=>({"@type":"ListItem",position:index+1,name:row.brand,url:absoluteUrl(`/gear/helmets/${row.slug}`)})),
  };

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Brands"}]} />
    <div className="page-head"><h1>Motorcycle helmet brands in the Philippines</h1><p>Compare brands by the models currently tracked in brand and Philippine retail catalogs, plus the subset with fully checked MotoIndex detail pages and current price observations. The table is not a safety ranking: the exact helmet model, fit and Philippine conformity marking matter more than the logo alone.</p></div>

    <div className="helmet-brand-table"><div className="helmet-brand-row head"><span>Brand</span><span>Tracked models</span><span>Types covered</span><span>Observed prices</span></div>{rows.map(r=><Link href={`/gear/helmets/${r.slug}`} className="helmet-brand-row" key={r.slug}><strong>{r.brand}<small>{r.positioning}</small></strong><span><b>{r.trackedCount}</b><small>{r.verifiedCount} detailed pages</small></span><span>{r.types.join(" · ")||"Researching"}</span><span>{r.minPrice&&r.maxPrice?(r.minPrice===r.maxPrice?php(r.minPrice):`${php(r.minPrice)}–${php(r.maxPrice)}`):"Check products"}</span></Link>)}</div>

    <div className="section-head compact"><div><h2>How to compare helmet brands without guessing</h2><p>Use the brand list as a starting point, then make the buying decision at the exact-model level.</p></div></div>
    <div className="topic-grid">
      <article><h2>1. Fit first</h2><p>A well-known brand cannot compensate for a helmet that is the wrong shape or size. Use the current size chart and try the exact model where possible.</p></article>
      <article><h2>2. Check the exact certification and PH mark</h2><p>Certification can vary by model and market. Inspect the actual unit sold in the Philippines for its PS or ICC marking and verify the product source.</p></article>
      <article><h2>3. Match the helmet type to the ride</h2><p>Full-face, modular and half-face helmets trade off coverage, convenience, ventilation and weight differently. Compare the exact model rather than assuming every product from one brand behaves the same.</p></article>
      <article><h2>4. Compare observed prices, not brand reputation alone</h2><p>MotoIndex shows checked product observations so you can compare real price bands. A higher price is not itself proof of better fit or protection.</p></article>
    </div>

    <div className="note-box helmet-brand-note"><h2>There is no single “best helmet brand” for every rider</h2><p>The better question is which exact helmet model fits your head, riding style, budget and required conformity marking. Open a brand page to compare the products MotoIndex has actually verified.</p></div>

    <FaqSection title="Helmet brand questions" items={[
      {question:"What is the best helmet brand in the Philippines?",answer:"There is no single best brand for every rider. Compare the exact helmet model by fit, helmet type, verified conformity marking, features, source and price rather than choosing from the brand name alone."},
      {question:"Which helmet brands does MotoIndex cover?",answer:`MotoIndex currently has indexable brand pages for ${rows.length} helmet brands. Each page now separates the broader tracked catalog from the smaller set of models with fully checked MotoIndex detail pages and dated price observations.`},
      {question:"Does a more expensive helmet automatically mean it is safer?",answer:"No. Price can reflect materials, features, finish and brand positioning. Protection claims should be tied to the exact certified model, while fit and condition remain critical."},
      {question:"Should I buy a helmet based only on an online size chart?",answer:"Use the size chart as a starting point, but head shape and model fit can differ. Trying the exact helmet is preferable when possible, especially before a final purchase."},
    ]}/>
    <JsonLd data={schema}/>
  </section>;
}

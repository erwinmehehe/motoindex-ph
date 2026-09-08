import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { RelatedLinks } from "@/components/RelatedLinks";
import { articleSchema } from "@/lib/articleSchema";
import { getHelmetSeoComparison, getHelmetSeoComparisonSides, helmetSeoComparisons, isIndexableHelmetSeoComparison } from "@/lib/helmetSeoComparisons";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";
import type { HelmetProduct } from "@/lib/types";

export function generateStaticParams(){
  return helmetSeoComparisons.map(comparison=>({slug:comparison.slug}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const comparison=getHelmetSeoComparison(slug);
  if(!comparison) return {};
  return pageMetadata({
    title:comparison.seoTitle,
    description:comparison.description,
    path:`/gear/helmets/compare/${comparison.slug}`,
    index:isIndexableHelmetSeoComparison(slug)
  });
}

function range(products:HelmetProduct[]){
  const values=products.map(p=>p.priceFromPhp).filter((value):value is number=>typeof value==="number");
  if(!values.length) return "Price varies";
  const min=Math.min(...values),max=Math.max(...values);
  return min===max?php(min):`${php(min)}–${php(max)}`;
}

function sideFacts(products:HelmetProduct[]){
  return {
    count:products.length,
    types:[...new Set(products.map(p=>p.helmetType))],
    intercom:products.filter(p=>p.intercomReady).length,
    prices:range(products)
  };
}

function cards(products:HelmetProduct[]){
  return [...products]
    .sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model))
    .slice(0,8);
}

export default async function HelmetSeoComparisonPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const comparison=getHelmetSeoComparison(slug);
  if(!comparison) return notFound();
  const {left,right}=getHelmetSeoComparisonSides(comparison);
  const leftFacts=sideFacts(left),rightFacts=sideFacts(right);
  const article=articleSchema({
    headline:comparison.title,
    description:comparison.description,
    path:`/gear/helmets/compare/${comparison.slug}`,
    about:comparison.title,
    keywords:[comparison.seoTitle,`${comparison.leftLabel} vs ${comparison.rightLabel}`],
    checkedDates:[...left,...right].map(p=>p.lastChecked).filter((v):v is string=>Boolean(v))
  });
  const list={
    "@context":"https://schema.org",
    "@type":"ItemList",
    name:comparison.title,
    itemListElement:[...left,...right].map((product,index)=>({
      "@type":"ListItem",
      position:index+1,
      name:`${product.brand} ${product.model}`,
      url:absoluteUrl(`/gear/helmets/${product.brandSlug}/${product.slug}`)
    }))
  };

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Compare",href:"/gear/helmets/compare"},{label:`${comparison.leftLabel} vs ${comparison.rightLabel}`}]} />
    <div className="page-head"><span className="section-kicker">{comparison.kicker}</span><h1>{comparison.title}</h1><p>{comparison.intro}</p></div>

    <div className="helmet-brand-table">
      <div className="helmet-brand-row head"><span>Comparison</span><span>{comparison.leftLabel}</span><span>{comparison.rightLabel}</span><span>How to use it</span></div>
      <div className="helmet-brand-row"><strong>Verified models</strong><span>{leftFacts.count}</span><span>{rightFacts.count}</span><span>Only full MotoIndex product records</span></div>
      <div className="helmet-brand-row"><strong>Observed price range</strong><span>{leftFacts.prices}</span><span>{rightFacts.prices}</span><span>Dated starting prices where recorded</span></div>
      <div className="helmet-brand-row"><strong>Helmet formats</strong><span>{leftFacts.types.join(", ")||"Not recorded"}</span><span>{rightFacts.types.join(", ")||"Not recorded"}</span><span>Compare the exact model, not the brand label</span></div>
      <div className="helmet-brand-row"><strong>Intercom provision</strong><span>{leftFacts.intercom} model{leftFacts.intercom===1?"":"s"}</span><span>{rightFacts.intercom} model{rightFacts.intercom===1?"":"s"}</span><span>Recorded model-level provision only</span></div>
    </div>

    {comparison.sections.map(section=><section className="split section" key={section.heading}><div><h2>{section.heading}</h2>{section.body.map(body=><p key={body}>{body}</p>)}</div><div className="info-card"><h3>Compare before buying</h3><ul className="checklist"><li>Use the exact model size chart</li><li>Check the PS or ICC mark on the actual unit</li><li>Compare visor and replacement-part availability</li><li>Open the source-backed model page before paying</li></ul></div></section>)}

    <div className="section-head inline-head"><div><h2>{comparison.leftLabel} models to compare</h2><p>Verified product pages with source and check-date context.</p></div></div>
    <div className="product-grid">{cards(left).map(product=><ProductCard key={product.id} item={{entityId:product.id,href:`/gear/helmets/${product.brandSlug}/${product.slug}`,category:product.helmetType,brand:product.brand,model:product.model,meta:[product.certification,product.intercomReady?"Intercom provision":undefined].filter(Boolean).join(" · ")||product.visor,status:product.status,priceFromPhp:product.priceFromPhp}} />)}</div>

    <div className="section-head inline-head"><div><h2>{comparison.rightLabel} models to compare</h2><p>Open the individual model instead of assuming every helmet on this side shares the same specification.</p></div></div>
    <div className="product-grid">{cards(right).map(product=><ProductCard key={product.id} item={{entityId:product.id,href:`/gear/helmets/${product.brandSlug}/${product.slug}`,category:product.helmetType,brand:product.brand,model:product.model,meta:[product.certification,product.intercomReady?"Intercom provision":undefined].filter(Boolean).join(" · ")||product.visor,status:product.status,priceFromPhp:product.priceFromPhp}} />)}</div>

    <div className="note-box"><h2>No paid winner</h2><p>MotoIndex does not rank one side first because of sponsorship or seller relationships. This page is a structured comparison of the verified records currently in the catalog.</p></div>
    <FaqSection title={`${comparison.leftLabel} vs ${comparison.rightLabel} questions`} items={comparison.faqs} />
    <RelatedLinks title="Continue comparing helmets" links={[
      {href:"/gear/helmets/compare",title:"Helmet comparison tool",description:"Choose exact helmet models for a side-by-side specification table."},
      {href:"/gear/helmets/under-5000",title:"Helmets under ₱5,000",description:"Compare verified helmets by observed starting price."},
      {href:"/gear/helmets/for-commuting",title:"Helmets for commuting",description:"Compare road-helmet formats for daily riding."},
      {href:"/guides/motorcycle-helmet-size-guide",title:"Helmet size guide",description:"Measure your head before choosing a model."}
    ]} />
    <div className="topic-action"><Link href="/gear/helmets">Back to motorcycle helmets →</Link></div>
    <JsonLd data={[article,list]} />
  </section>;
}

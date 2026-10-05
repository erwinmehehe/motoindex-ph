import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { ProductCard } from "@/components/ProductCard";
import { getHelmetSeoComparison, getHelmetSeoComparisonSides, helmetSeoComparisons, isIndexableHelmetSeoComparison } from "@/lib/helmetSeoComparisons";
import { pageMetadata } from "@/lib/site";
import { php } from "@/lib/utils";

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
    index:isIndexableHelmetSeoComparison(comparison.slug)
  });
}

export default async function HelmetSeoComparisonPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const comparison=getHelmetSeoComparison(slug);
  if(!comparison) return notFound();

  const {left,right}=getHelmetSeoComparisonSides(comparison);
  const leftPriced=left.map(item=>item.priceFromPhp).filter((value):value is number=>typeof value==="number");
  const rightPriced=right.map(item=>item.priceFromPhp).filter((value):value is number=>typeof value==="number");
  const leftMin=leftPriced.length?Math.min(...leftPriced):undefined;
  const rightMin=rightPriced.length?Math.min(...rightPriced):undefined;

  return <section className="page shell helmet-brand-comparison-page">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:"Compare",href:"/gear/helmets/compare"},{label:`${comparison.leftLabel} vs ${comparison.rightLabel}`}]} />

    <div className="page-head">
      <span className="entity-kicker">{comparison.kicker}</span>
      <h1>{comparison.title}</h1>
      <p>{comparison.intro}</p>
      <div className="brand-facts">
        <div><span>{comparison.leftLabel} models checked</span><strong>{left.length}</strong></div>
        <div><span>{comparison.rightLabel} models checked</span><strong>{right.length}</strong></div>
        <div><span>{comparison.leftLabel} price floor</span><strong>{leftMin?php(leftMin):"Check models"}</strong></div>
        <div><span>{comparison.rightLabel} price floor</span><strong>{rightMin?php(rightMin):"Check models"}</strong></div>
      </div>
    </div>

    <div className="split section">
      <div>
        <div className="section-head compact"><div><h2>{comparison.leftLabel} helmet models</h2><p>Verified product records currently used in this comparison.</p></div></div>
        <div className="product-grid">{left.slice(0,8).map(item=><ProductCard key={item.id} item={{
          entityId:item.id,
          href:`/gear/helmets/${item.brandSlug}/${item.slug}`,
          category:item.helmetType,
          brand:item.brand,
          model:item.model,
          meta:[item.certification,item.shell].filter(Boolean).join(" · ")||item.visor,
          status:item.status,
          priceFromPhp:item.priceFromPhp
        }}/>)}</div>
      </div>
      <div>
        <div className="section-head compact"><div><h2>{comparison.rightLabel} helmet models</h2><p>Verified product records currently used in this comparison.</p></div></div>
        <div className="product-grid">{right.slice(0,8).map(item=><ProductCard key={item.id} item={{
          entityId:item.id,
          href:`/gear/helmets/${item.brandSlug}/${item.slug}`,
          category:item.helmetType,
          brand:item.brand,
          model:item.model,
          meta:[item.certification,item.shell].filter(Boolean).join(" · ")||item.visor,
          status:item.status,
          priceFromPhp:item.priceFromPhp
        }}/>)}</div>
      </div>
    </div>

    {comparison.sections.map(section=><section className="product-entity-section" key={section.heading}>
      <div className="section-head compact"><div><h2>{section.heading}</h2></div></div>
      {section.body.map(paragraph=><p key={paragraph}>{paragraph}</p>)}
    </section>)}

    <section className="product-entity-section">
      <div className="section-head compact"><div><h2>Compare exact models side by side</h2><p>Brand pages are useful for narrowing the field. Use the interactive comparison for exact helmet specifications.</p></div></div>
      <div className="hero-actions">
        <Link className="button" href="/gear/helmets/compare">Open helmet comparison</Link>
        {comparison.leftBrandSlug&&<Link className="button ghost" href={`/gear/helmets/${comparison.leftBrandSlug}`}>Browse {comparison.leftLabel}</Link>}
        {comparison.rightBrandSlug&&<Link className="button ghost" href={`/gear/helmets/${comparison.rightBrandSlug}`}>Browse {comparison.rightLabel}</Link>}
        {comparison.leftType==="Full face"&&<Link className="button ghost" href="/gear/helmets/full-face">Full-face guide</Link>}
        {comparison.rightType==="Modular"&&<Link className="button ghost" href="/gear/helmets/modular">Modular guide</Link>}
      </div>
    </section>

    <FaqSection title={`${comparison.leftLabel} vs ${comparison.rightLabel} questions`} items={comparison.faqs} />
  </section>;
}

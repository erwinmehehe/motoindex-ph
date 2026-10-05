import Link from "next/link";
import { getHelmetCategoryProducts, type HelmetCategorySlug } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { helmetCategoryInternalLinks } from "@/lib/internalLinks";
import { HelmetFormatGuide } from "@/components/HelmetFormatGuide";
import { AuthorBox } from "@/components/AuthorBox";
import { absoluteUrl } from "@/lib/site";

const categoryCopy: Record<HelmetCategorySlug, {
  kicker:string;
  title:string;
  intro:string;
  tradeoff:string;
  check:string[];
  keywords:string[];
}> = {
  "full-face": {
    kicker:"Full coverage road helmets",
    title:"Full-face motorcycle helmets in the Philippines",
    intro:"Compare verified full-face motorcycle helmets by observed Philippine price, shell construction, visor and anti-fog setup, sizing and model-specific certification evidence.",
    tradeoff:"A fixed chin bar gives the most complete coverage of the common road formats, while ventilation, weight, visor optics and fit vary widely by model.",
    check:["PS or ICC mark on the exact unit","Correct head-shape and size fit","Visor and anti-fog system","Replacement liner and visor availability"],
    keywords:["full face helmet Philippines","full face motorcycle helmet","motorcycle helmet full face"]
  },
  "modular": {
    kicker:"Flip-up helmets",
    title:"Modular motorcycle helmets in the Philippines",
    intro:"Compare verified modular and flip-up motorcycle helmets by observed price, chin-bar design, visor setup, sizing, intercom provision and homologation evidence.",
    tradeoff:"A flip-up chin bar adds convenience for stops and touring, but usually brings more weight and mechanical complexity than a fixed full-face shell.",
    check:["P/J or market homologation where stated","Chin-bar latch operation","Pinlock and sun-visor setup","Speaker and microphone clearance"],
    keywords:["modular helmet Philippines","flip up helmet Philippines","modular motorcycle helmet"]
  },
  "half-face": {
    kicker:"Half-face helmets",
    title:"Half-face motorcycle helmets in the Philippines",
    intro:"Compare verified half-face motorcycle helmets by observed Philippine price, visor setup, shell details and model-specific certification evidence.",
    tradeoff:"Half-face helmets prioritize airflow and compact city use while leaving more of the face exposed than full-face or modular designs.",
    check:["PS or ICC mark on the exact unit","Visor or eye-protection plan","Secure retention system","Fit around the crown and sides"],
    keywords:["half face helmet Philippines","half face motorcycle helmet","motorcycle helmet half face"]
  },
  "open-face": {
    kicker:"Open-face / jet helmets",
    title:"Open-face motorcycle helmets in the Philippines",
    intro:"Compare verified open-face, jet and hybrid city helmets by observed Philippine price, visor coverage, sun-visor equipment, sizing and certification evidence.",
    tradeoff:"Open-face helmets improve airflow and visibility for city riding, but the chin and jaw remain more exposed than with a fixed full-face shell.",
    check:["PS or ICC mark on the exact unit","Main visor coverage and locking","Internal sun visor where fitted","Eyewear and cheek-pad clearance"],
    keywords:["open face helmet Philippines","open face motorcycle helmet","jet helmet Philippines"]
  },
  "adventure": {
    kicker:"Adventure / dual-sport helmets",
    title:"Adventure and dual-sport helmets in the Philippines",
    intro:"Compare verified adventure and dual-sport motorcycle helmets by observed Philippine price, peak and visor setup, shell construction, goggle compatibility, intercom provision and certification evidence.",
    tradeoff:"Adventure helmets combine road-visor practicality with an extended peak and off-road-inspired eye port, trading some highway quietness and aerodynamics for mixed-surface versatility.",
    check:["Peak stability at road speed","Visor sealing and anti-fog provision","Goggle compatibility where relevant","PS or ICC mark on the exact unit"],
    keywords:["adventure helmet Philippines","dual sport helmet Philippines","adventure motorcycle helmet"]
  },
  "off-road": {
    kicker:"Off-road / motocross helmets",
    title:"Off-road and motocross helmets in the Philippines",
    intro:"Compare verified off-road and motocross motorcycle helmets by observed Philippine price, shell weight, goggle opening, peak design, ventilation and certification evidence.",
    tradeoff:"Off-road helmets prioritize airflow, a large eye port and a peak for trail or motocross use rather than the sealed visor and wind isolation of a road full-face helmet.",
    check:["Goggle fit and eye-port clearance","Peak hardware and stability","Chin-bar and ventilation clearance","PS or ICC mark for road use where applicable"],
    keywords:["off road helmet Philippines","motocross helmet Philippines","motocross motorcycle helmet"]
  }
};

export function HelmetCategoryView({slug}:{slug:HelmetCategorySlug}){
  const c=categoryCopy[slug];
  const products=getHelmetCategoryProducts(slug).sort((a,b)=>(a.priceFromPhp??Number.MAX_SAFE_INTEGER)-(b.priceFromPhp??Number.MAX_SAFE_INTEGER)||a.brand.localeCompare(b.brand)||a.model.localeCompare(b.model));
  const visibleProducts=products.slice(0,48);
  const categoryArticle = articleSchema({
    headline: c.title,
    description: c.intro,
    path: `/gear/helmets/${slug}`,
    about: `${slug.replace("-", " ")} helmet Philippines`,
    keywords: [...c.keywords, "motorcycle helmet Philippines"],
    checkedDates: products.map(p => p.lastChecked)
  });
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.title,
    numberOfItems: products.length,
    itemListElement: products.map((product,index)=>({
      "@type": "ListItem",
      position: index + 1,
      name: `${product.brand} ${product.model}`,
      url: absoluteUrl(`/gear/helmets/${product.brandSlug}/${product.slug}`)
    }))
  };
  return <section className="page shell helmet-category-page">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:c.title.replace(" in the Philippines","")}]} />
    <div className="page-head helmet-category-head"><h1>{c.title}</h1><p>{c.intro}</p></div>
    <div className="section-head inline-head"><div><h2>Helmets to compare</h2></div></div>
    <div className="product-grid ui-product-grid helmet-category-grid">{visibleProducts.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:[p.certification,p.shell].filter(Boolean).join(" · ")||p.visor,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    {products.length>visibleProducts.length&&<p className="helmet-master-note">Showing {visibleProducts.length} of {products.length} verified models. <Link href="/gear/helmets/finder">Use Helmet Finder for the full catalog →</Link></p>}
    <HelmetFormatGuide format={slug} products={products} />
    <div className="split section helmet-buying-notes"><div><h2>Choose the format for how you ride</h2><p>{c.tradeoff}</p><p>Do not choose only by price or graphics. A correctly fitted helmet with the required local conformity mark matters more than a long feature list.</p></div><div className="info-card"><h3>Check before buying</h3><ul className="checklist">{c.check.map(x=><li key={x}>{x}</li>)}</ul></div></div><AuthorBox /><RelatedLinks title="More helmet information" links={helmetCategoryInternalLinks(slug)} />
    <JsonLd data={[categoryArticle, itemList]} />
  </section>
}

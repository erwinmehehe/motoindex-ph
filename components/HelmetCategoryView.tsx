import Link from "next/link";
import { helmetProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/articleSchema";
import { helmetCategoryInternalLinks } from "@/lib/internalLinks";
import { HelmetFormatGuide } from "@/components/HelmetFormatGuide";

const categoryCopy = {
  "half-face": { kicker:"Open-face / half-face", title:"Half-face helmets in the Philippines", intro:"Compare open-face and half-face-style helmets by observed price, visor setup, certification and shell details. Retailers use 'half face', 'open face' and 'jet' inconsistently, so this guide groups helmets without a fixed chin bar.", tradeoff:"More airflow and easier city use, but less facial coverage than a full-face helmet.", check:["PS or ICC mark on the exact unit","Visor coverage and locking system","Sun visor and eyewear clearance","Fit around the cheeks and crown"] },
  "modular": { kicker:"Flip-up helmets", title:"Modular helmets in the Philippines", intro:"Compare modular helmets by observed price, certification, visor setup and shell details. A flip-up chin bar adds convenience, but homologation and locking design matter.", tradeoff:"Convenient for stops and touring; usually heavier and mechanically more complex than a fixed full-face shell.", check:["P/J or market homologation where stated","Chin-bar latch operation","Pinlock and sun-visor setup","Speaker and microphone clearance"] },
  "full-face": { kicker:"Full coverage", title:"Full-face helmets in the Philippines", intro:"Compare full-face helmets by observed price, shell, visor setup and certification before checking the exact size and local conformity mark.", tradeoff:"The fixed chin bar provides the most complete coverage of the common road-helmet formats, with ventilation and weight varying widely by model.", check:["PS or ICC mark on the exact unit","Correct head-shape and size fit","Visor and anti-fog system","Replacement liner and visor availability"] }
} as const;

type CategorySlug=keyof typeof categoryCopy;
export function HelmetCategoryView({slug}:{slug:CategorySlug}){
  const c=categoryCopy[slug];
  const type=slug==="full-face"?"Full face":slug==="modular"?"Modular":null;
  const products=helmetProducts.filter(p=>p.status==="verified"&&(type?p.helmetType===type:["Half face","Open face"].includes(p.helmetType)));
  const categoryArticle = articleSchema({
    headline: c.title,
    description: c.intro,
    path: `/gear/helmets/${slug}`,
    about: `${slug.replace("-", " ")} helmet Philippines`,
    keywords: [`${slug.replace("-", " ")} helmet`, "motorcycle helmet Philippines"],
    checkedDates: products.map(p => p.lastChecked)
  });
  return <section className="page shell">
    <Breadcrumbs items={[{label:"Helmets",href:"/gear/helmets"},{label:c.title.replace(" in the Philippines","")}]} />
    <div className="page-head helmet-category-head"><h1>{c.title}</h1><p>{c.intro}</p></div>
    <div className="section-head inline-head"><div><h2>Helmets to compare</h2></div></div>
    <div className="product-grid">{products.map(p=><ProductCard key={p.id} item={{entityId:p.id,href:`/gear/helmets/${p.brandSlug}/${p.slug}`,category:p.helmetType,brand:p.brand,model:p.model,meta:[p.certification,p.shell].filter(Boolean).join(" · ")||p.visor,status:p.status,priceFromPhp:p.priceFromPhp}}/>)}</div>
    <HelmetFormatGuide format={slug} products={products} />
    <div className="split section helmet-buying-notes"><div><h2>Choose the format for how you ride</h2><p>{c.tradeoff}</p><p>Do not choose only by price or graphics. A correctly fitted helmet with the required local conformity mark matters more than a long feature list.</p></div><div className="info-card"><h3>Check before buying</h3><ul className="checklist">{c.check.map(x=><li key={x}>{x}</li>)}</ul></div></div><RelatedLinks title="More helmet information" links={helmetCategoryInternalLinks(slug)} />
    <JsonLd data={categoryArticle} />
  </section>
}

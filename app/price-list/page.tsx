import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PriceListExplorer } from "@/components/PriceListExplorer";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { absoluteUrl, pageMetadata } from "@/lib/site";

const PRICE_PAGE_CSS=`
.price-list-page{width:min(1280px,calc(100% - 32px))}
.price-list-hero{max-width:880px}
.price-list-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:8px 0 14px}.price-list-summary article{padding:12px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface)}.price-list-summary span,.price-list-summary small{display:block;font-size:8px;color:var(--mi-color-muted)}.price-list-summary span{text-transform:uppercase;font-weight:850}.price-list-summary strong{display:block;margin:4px 0;font-size:18px}.price-list-note{padding:12px;border:1px solid var(--mi-color-line);border-radius:var(--mi-radius-xs);background:var(--mi-color-surface-subtle);color:var(--mi-color-copy);font-size:10px;line-height:1.5}
@media(max-width:900px){.price-list-summary{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.price-list-page{width:min(100% - 24px,1280px)}}
`;

export const dynamic = "force-static";
export const revalidate = false;

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Price List Philippines",
  description: "Compare current motorcycle SRP, brand, category, engine displacement and transmission in the Philippines.",
  path: "/price-list",
  index: true
});

export default function PriceListPage(){
  const bikes=publicMotorcycles
    .filter(bike=>bike.marketStatus!=="previous"&&bike.marketStatus!=="discontinued")
    .map(bike=>({
      id:bike.id,
      make:bike.make,
      makeSlug:bike.makeSlug,
      model:bike.model,
      slug:bike.slug,
      category:bike.category,
      engineCc:bike.engineCc,
      transmission:bike.transmission,
      srp:bike.srp
    }));

  const brands=new Set(bikes.map(bike=>bike.makeSlug)).size;
  const prices=bikes.map(bike=>bike.srp).filter(Boolean);
  const low=prices.length?Math.min(...prices):0;
  const high=prices.length?Math.max(...prices):0;
  const automatic=bikes.filter(bike=>bike.transmission==="Automatic").length;

  const schema={
    "@context":"https://schema.org",
    "@graph":[
      {
        "@type":"CollectionPage",
        name:"Motorcycle Price List Philippines",
        url:absoluteUrl("/price-list"),
        description:"Current Philippine motorcycle prices and key catalog specifications."
      },
      {
        "@type":"BreadcrumbList",
        itemListElement:[
          {"@type":"ListItem",position:1,name:"Home",item:absoluteUrl("/")},
          {"@type":"ListItem",position:2,name:"Motorcycle Price List",item:absoluteUrl("/price-list")}
        ]
      }
    ]
  };

  return <section className="page shell price-list-page"><style>{PRICE_PAGE_CSS}</style>
    <Breadcrumbs items={[{label:"Price list"}]}/>
    <PageHero
      className="price-list-hero"
      kicker="Philippine motorcycle market"
      title="Motorcycle price list in the Philippines"
      description="Compare published starting prices, brand, category, engine displacement and transmission across current MotoIndex motorcycle records."
    />
    <div className="price-list-summary">
      <article ><span>Current models</span><strong>{bikes.length}</strong><small>Published current motorcycle records</small></article>
      <article ><span>Brands</span><strong>{brands}</strong><small>Manufacturers represented</small></article>
      <article ><span>Price span</span><strong>{low&&high?`₱${low.toLocaleString("en-PH")}–₱${high.toLocaleString("en-PH")}`:"Updating"}</strong><small>Published starting-price coverage</small></article>
      <article ><span>Automatic</span><strong>{automatic}</strong><small>Current automatic motorcycle records</small></article>
    </div>
    <PriceListExplorer bikes={bikes}/>
    <p className="price-list-note">Prices are reference points for research, not guaranteed dealer quotes. Open the exact model for variants, checked dates, specifications, financing context and source details.</p>
    <JsonLd data={schema}/>
  </section>;
}

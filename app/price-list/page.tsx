import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PriceListExplorer } from "@/components/PriceListExplorer";
import { PageHero } from "@/components/ui";
import { publicMotorcycles } from "@/lib/data";
import { absoluteUrl, pageMetadata } from "@/lib/site";

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
      id:bike.id,make:bike.make,makeSlug:bike.makeSlug,model:bike.model,slug:bike.slug,
      category:bike.category,engineCc:bike.engineCc,transmission:bike.transmission,srp:bike.srp
    }));

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

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Price list"}]}/>
    <PageHero
      kicker="Philippine motorcycle market"
      title="Motorcycle price list in the Philippines"
      description="Compare published starting prices, brand, category, engine displacement and transmission across current MotoIndex motorcycle records. Open any model for source details, checked dates, variants and full specifications."
    />
    <PriceListExplorer bikes={bikes}/>
    <JsonLd data={schema}/>
  </section>;
}

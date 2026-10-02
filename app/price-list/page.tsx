import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PriceListExplorer } from "@/components/PriceListExplorer";

import { publicMotorcycles } from "@/lib/data";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import styles from "./PriceListPage.module.css";

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

  return <section className="page shell">
    <Breadcrumbs items={[{label:"Price list"}]}/>
    <section className={styles.mockupHero}>
      <div><span>Price directory</span><h1>Motorcycle Price List<br/>in the Philippines</h1><p>Complete list of motorcycle prices from major brands in the Philippines. Updated regularly.</p></div>
      <div className={styles.cityArt} aria-hidden="true"><i/><b/><em/></div>
    </section>
    <PriceListExplorer bikes={bikes}/>
    <p className={styles.note}>Prices are reference points for research, not guaranteed dealer quotes. Open the exact model for variants, checked dates, specifications, financing context and source details.</p>
    <JsonLd data={schema}/>
  </section>;
}

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PriceListExplorer } from "@/components/PriceListExplorer";
import { PageHero } from "@/components/ui";
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
    <PageHero
      kicker="Philippine motorcycle market"
      title="Motorcycle price list in the Philippines"
      description="Compare published starting prices, brand, category, engine displacement and transmission across current MotoIndex motorcycle records. Open any model for source details, checked dates, variants and full specifications."
    />
    <div className={styles.summary}>
      <article className={styles.card}><span>Current models</span><strong>{bikes.length}</strong><small>Published current motorcycle records</small></article>
      <article className={styles.card}><span>Brands</span><strong>{brands}</strong><small>Manufacturers represented</small></article>
      <article className={styles.card}><span>Price span</span><strong>{low&&high?`₱${low.toLocaleString("en-PH")}–₱${high.toLocaleString("en-PH")}`:"Updating"}</strong><small>Published starting-price coverage</small></article>
      <article className={styles.card}><span>Automatic</span><strong>{automatic}</strong><small>Current automatic motorcycle records</small></article>
    </div>
    <PriceListExplorer bikes={bikes}/>
    <p className={styles.note}>Prices are reference points for research, not guaranteed dealer quotes. Open the exact model for variants, checked dates, specifications, financing context and source details.</p>
    <JsonLd data={schema}/>
  </section>;
}

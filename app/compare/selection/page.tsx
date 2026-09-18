import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { SelectedCompareClient } from "@/components/SelectedCompareClient";
import { PageHero } from "@/components/ui";
import styles from "./SelectionPage.module.css";

export const metadata:Metadata=pageMetadata({
  title:"Custom Motorcycle Comparison Philippines",
  description:"Compare two or three current Philippine motorcycles side by side for price, engine, rider fit, fuel, tires and braking.",
  path:"/compare/selection",
  index:false
});

type SearchParams = Promise<{ bikes?: string | string[] }>;

export default async function SelectedComparePage({ searchParams }: { searchParams: SearchParams }){
  const params = await searchParams;
  const raw = Array.isArray(params.bikes) ? params.bikes[0] : params.bikes || "";
  const compareTokens = new Map<string,string>();
  for (const model of publicMotorcycles) {
    compareTokens.set(model.slug, model.slug);
    compareTokens.set(model.id, model.slug);
  }
  const initialSlugs = [...new Set(raw.split(",").map(token => compareTokens.get(token.trim())).filter((slug): slug is string => Boolean(slug)))].slice(0,3);

  return <section className={`${styles.page} page shell`}>
    <PageHero
      className={styles.hero}
      kicker="Side-by-side research"
      title="Compare your selected motorcycles"
      description="Keep the bikes visible while you scan price, rider fit and the specification differences that matter."
    />
    <SelectedCompareClient models={forClient(publicMotorcycles)} initialSlugs={initialSlugs}/>
  </section>;
}

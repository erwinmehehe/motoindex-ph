import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { SelectedCompareClient } from "@/components/SelectedCompareClient";
import { PageHero } from "@/components/ui";
import styles from "./SelectionPage.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Custom Motorcycle Comparison Philippines",
  description: "Compare two or three current Philippine motorcycles side by side for price, engine, rider fit, fuel, tires and braking.",
  path: "/compare/selection",
  index: false
});

export default async function SelectedComparePage({
  searchParams
}:{
  searchParams:Promise<{bikes?:string|string[]}>
}) {
  const query=await searchParams;
  const raw=Array.isArray(query.bikes)?query.bikes[0]||"":query.bikes||"";
  const initialSlugs=[...new Set(raw.split(",").map(slug=>slug.trim()).filter(Boolean))].slice(0,3);

  return <section className={`${styles.page} page shell`}>
    <PageHero
      className={styles.hero}
      kicker="Side-by-side research"
      title="Compare your selected motorcycles"
      description="Keep the bikes visible while you scan price, rider fit and the specification differences that matter."
    />
    <SelectedCompareClient models={forClient(publicMotorcycles)} initialSlugs={initialSlugs} />
  </section>;
}

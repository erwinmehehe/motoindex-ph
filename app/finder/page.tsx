import type { Metadata } from "next";
import { currentMotorcycles, isIndexableModel } from "@/lib/data";
import { FinderClient } from "@/components/FinderClient";
import { DecisionPath } from "@/components/DecisionPath";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { siteStats } from "@/lib/siteStats";
import { AdSense } from "@/components/AdSense";
import { GuideInContentAd } from "@/components/GuideInContentAd";
import { motorcycleAdNonce } from "@/lib/adsenseMotorcycleDocument";
import { adsenseEnabled } from "@/lib/adsense";
import styles from "./FinderPage.module.css";

const models = currentMotorcycles.filter(isIndexableModel);
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Finder Philippines",
  description: "Find motorcycles in the Philippines by budget, inseam, use case, passenger needs, traffic, highway use, transmission, ABS, seat height and weight.",
  path: "/finder",
  index: models.length >= 3,
});

export default async function FinderPage() {
  const adNonce = await motorcycleAdNonce();
  return <section className={`page shell ${styles.page}`}>
    <AdSense nonce={adNonce} />
    <div className={`page-head ${styles.head}`}><span className="entity-kicker">{siteStats.currentMotorcycles} current models</span><h1>Find the motorcycle that fits your actual life.</h1><p>Answer six practical questions. MotoIndex will narrow the current Philippine catalog to three motorcycles worth inspecting, with the reasons and ownership estimate shown clearly.</p></div>
    <FinderClient models={forClient(models)} syncUrl={!adsenseEnabled()} />
    <GuideInContentAd nonceReady={Boolean(adNonce)} />
    <DecisionPath stage="finder" />
  </section>;
}

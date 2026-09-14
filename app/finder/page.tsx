import type { Metadata } from "next";
import { publicMotorcycles } from "@/lib/data";
import { FinderClient } from "@/components/FinderClient";
import { DecisionPath } from "@/components/DecisionPath";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { siteStats } from "@/lib/siteStats";
import styles from "./FinderPage.module.css";

const models = publicMotorcycles;
export const dynamic = "force-static";
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Finder Philippines",
  description: "Find motorcycles in the Philippines by budget, inseam, use case, passenger needs, traffic, highway use, transmission, ABS, seat height and weight.",
  path: "/finder",
  index: models.length >= 3,
});

export default function FinderPage() {
  return <section className={`page shell ${styles.page}`}>
    <div className={`page-head ${styles.head}`}><span className="entity-kicker">{siteStats.currentMotorcycles} current models</span><h1>Find the motorcycle that fits your actual life.</h1><p>Rank the current Philippine catalog against budget, rider fit, traffic, daily distance, passenger and luggage needs, open-road use and a transparent monthly ownership-planning estimate.</p></div>
    <FinderClient models={forClient(models)} />
    <DecisionPath stage="finder" />
  </section>;
}

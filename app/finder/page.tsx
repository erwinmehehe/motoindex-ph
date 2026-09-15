import type { Metadata } from "next";
import { currentMotorcycles, isIndexableModel } from "@/lib/data";
import { FinderClient } from "@/components/FinderClient";
import { DecisionPath } from "@/components/DecisionPath";
import { pageMetadata } from "@/lib/site";
import { forClient } from "@/lib/competitors";
import { siteStats } from "@/lib/siteStats";
import styles from "./FinderPage.module.css";

const models = currentMotorcycles.filter(isIndexableModel);
export const dynamic = "force-static";
export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Finder Philippines",
  description: "Find motorcycles in the Philippines by budget, inseam, use case, passenger needs, traffic, highway use, transmission, ABS, seat height and weight.",
  path: "/finder",
  index: models.length >= 3,
});

export default function FinderPage() {
  return <section className={`page shell ${styles.page}`}>
    <div className={`page-head ${styles.head}`}><span className="entity-kicker">{siteStats.currentMotorcycles} current models</span><h1>Find the motorcycle that fits your actual life.</h1><p>Answer six practical questions. MotoIndex will narrow the current Philippine catalog to three motorcycles worth inspecting, with the reasons and ownership estimate shown clearly.</p></div>
    <FinderClient models={forClient(models)} />
    <DecisionPath stage="finder" />
  </section>;
}

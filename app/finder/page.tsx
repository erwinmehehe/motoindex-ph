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
  return <section className={`page ${styles.page}`}>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={`page-head ${styles.head}`}><span className="entity-kicker">{siteStats.currentMotorcycles} current models</span><h1>Find the motorcycle that fits your actual life.</h1><p>Answer six practical questions. MotoIndex will narrow the current Philippine catalog to three motorcycles worth inspecting, with the reasons and ownership estimate shown clearly.</p></div>
        <aside className={styles.steps} aria-label="Motorcycle Finder decision steps">
          <div className={styles.step}><b>01</b><strong>Budget</strong><small>Set a realistic purchase range.</small></div>
          <div className={styles.step}><b>02</b><strong>Daily use</strong><small>Traffic, commute and passenger needs.</small></div>
          <div className={styles.step}><b>03</b><strong>Rider fit</strong><small>Seat height, weight and confidence.</small></div>
          <div className={styles.step}><b>04</b><strong>Transmission</strong><small>Automatic or manual preference.</small></div>
          <div className={styles.step}><b>05</b><strong>Equipment</strong><small>ABS and practical feature needs.</small></div>
          <div className={styles.step}><b>06</b><strong>Shortlist</strong><small>Three explained matches to inspect.</small></div>
        </aside>
      </div>
    </div>
    <div className={styles.workspace}><FinderClient models={forClient(models)} /><DecisionPath stage="finder" /></div>
  </section>;
}

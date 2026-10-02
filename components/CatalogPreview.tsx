import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { MotorcycleCard } from "@/components/MotorcycleCard";
import styles from "./CatalogPreview.module.css";

export function CatalogPreview({ models }: { models: Motorcycle[] }) {
  if (!models.length) return null;
  return <section className={styles.section} aria-labelledby="catalog-preview-title">
    <div className={styles.head}>
      <div>
        <span className={styles.kicker}>Featured current models</span>
        <h2 id="catalog-preview-title">Start with a few bikes, not a wall of filters.</h2>
        <p>Open a current model to see price, specifications, rider fit and ownership context, or jump straight into the full catalog below.</p>
      </div>
      <Link href="/price-list">Open full price list →</Link>
    </div>
    <div className={styles.grid}>{models.slice(0,4).map(model=><MotorcycleCard key={model.id} model={model} variant="standard" />)}</div>
    <nav className={styles.path} aria-label="Motorcycle catalog shortcuts">
      <Link href="/motorcycles/scooters">Scooters <span>→</span></Link>
      <Link href="/recommendations#budget">Under ₱100K <span>→</span></Link>
      <Link href="/recommendations#400cc">400cc+ <span>→</span></Link>
      <Link href="/compare">Compare motorcycles <span>→</span></Link>
    </nav>
  </section>;
}

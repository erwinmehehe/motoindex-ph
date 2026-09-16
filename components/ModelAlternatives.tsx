import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import styles from "./ModelAlternatives.module.css";

export function ModelAlternatives({ model, alternatives }: { model: Motorcycle; alternatives: Motorcycle[] }) {
  if (!alternatives.length) return null;
  const compareHref = `/compare/selection?a=${encodeURIComponent(`${model.makeSlug}:${model.slug}`)}`;

  return <div className={styles.wrap}>
    <div className={styles.intro}>
      <span className={styles.kicker}>How does it compare?</span>
      <h3>Compare against direct alternatives</h3>
      <p>Start with the motorcycles most likely to change the decision, then open the full comparison only when you need the side-by-side details.</p>
      <Link className={styles.compare} href={compareHref}>Compare motorcycles →</Link>
    </div>
    <div className={styles.list}>
      {alternatives.slice(0,3).map((item) => <Link className={styles.row} key={item.id} href={`/motorcycles/${item.makeSlug}/${item.slug}`}>
        <span>
          <strong className={styles.name}>{item.make} {item.model}</strong>
          <small className={styles.meta}><span className={styles.price}>{observedMarketPriceLabel(item)}</span><span>{item.engineCc} cc</span><span>{item.seatHeightMm} mm seat</span></small>
        </span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>)}
    </div>
  </div>;
}

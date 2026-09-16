import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { similarMotorcycles } from "@/lib/similar";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import styles from "./SimilarMotorcycles.module.css";

function Group({ label, title, models }: { label: string; title: string; models: Motorcycle[] }) {
  if (!models.length) return null;
  return <div className={styles.group}>
    <div className={styles.groupHead}><span>{label}</span><h3>{title}</h3></div>
    {models.map((m) => <Link className={styles.row} href={`/motorcycles/${m.makeSlug}/${m.slug}`} key={m.id}>
      <span className={styles.copy}>
        <strong className={styles.name}>{m.make} {m.model}</strong>
        <small className={styles.meta}><span className={styles.price}>{observedMarketPriceLabel(m)}</span><span>{m.engineCc} cc</span><span>{m.seatHeightMm} mm seat</span></small>
      </span>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>)}
  </div>;
}

export function SimilarMotorcycles({ model }: { model: Motorcycle }) {
  const groups = similarMotorcycles(model);
  return <section className={styles.section}>
    <div className={styles.head}><span>More useful matches</span><h2>Similar motorcycles worth checking</h2><p>These are broader matches based on price, engine size, category, transmission and seat height.</p></div>
    <div className={styles.groups}>
      <Group label="Best match" title="Closest overall" models={groups.similar} />
      <Group label="Budget" title="Lower-price options" models={groups.cheaper} />
      <Group label="Rider fit" title="Lower-seat options" models={groups.lowerSeat} />
    </div>
  </section>;
}

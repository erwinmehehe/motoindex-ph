import type { ReactNode } from "react";
import { ProductFactsGrid, type ProductFact } from "@/components/ProductFactsGrid";
import styles from "./ProductHero.module.css";

type Props = {
  media: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  price?: ReactNode;
  priceNote?: ReactNode;
  facts: ProductFact[];
  trust: ReactNode;
  actions?: ReactNode;
};

export function ProductHero({ media, eyebrow, title, description, price, priceNote, facts, trust, actions }: Props) {
  return <div className={`product-detail-hero ${styles.hero}`}>
    <div className={`product-detail-media ${styles.media}`}>{media}</div>
    <div className={`product-detail-summary ${styles.summary}`}>
      {eyebrow && <div className={`product-detail-eyebrow ${styles.eyebrow}`}>{eyebrow}</div>}
      <h1 className={styles.title}>{title}</h1>
      <div className={`product-detail-description product-detail-lede ${styles.description}`}>{description}</div>
      {price && <div className={`product-detail-price-block ${styles.priceCard}`}>
        <span className={styles.priceLabel}>Philippine price reference</span>
        <strong className={`product-detail-price ${styles.price}`}>{price}</strong>
        {priceNote && <small className={styles.priceNote}>{priceNote}</small>}
      </div>}
      {actions && <div className={`product-detail-actions ${styles.actions}`}>{actions}</div>}
      <div className={styles.facts}><ProductFactsGrid facts={facts} /></div>
      <div className={styles.trust}>{trust}</div>
    </div>
  </div>;
}

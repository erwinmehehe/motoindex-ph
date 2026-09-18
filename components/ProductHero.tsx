import type { ReactNode } from "react";
import { ProductFactsGrid, type ProductFact } from "@/components/ProductFactsGrid";

type Props = {
  media: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  price?: ReactNode;
  priceNote?: ReactNode;
  facts: ProductFact[];
  trust: ReactNode;
};

export function ProductHero({ media, eyebrow, title, description, price, priceNote, facts, trust }: Props) {
  return <div className="product-detail-hero">
    <div className="product-detail-media">{media}</div>
    <div className="product-detail-summary">
      {eyebrow && <div className="product-detail-eyebrow">{eyebrow}</div>}
      <h1>{title}</h1>
      <div className="product-detail-description product-detail-lede">{description}</div>
      {price && <div className="product-detail-price-block">
        <strong className="product-detail-price">{price}</strong>
        {priceNote && <small>{priceNote}</small>}
      </div>}
      <ProductFactsGrid facts={facts} />
      {trust}
    </div>
  </div>;
}

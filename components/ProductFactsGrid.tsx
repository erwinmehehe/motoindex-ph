import type { ReactNode } from "react";

export type ProductFact = {
  label: string;
  value: ReactNode;
};

export function ProductFactsGrid({ facts }: { facts: ProductFact[] }) {
  return <div className="product-facts-grid product-detail-facts">
    {facts.map((fact) => <div className="product-fact" key={fact.label}>
      <span>{fact.label}</span>
      <strong>{fact.value}</strong>
    </div>)}
  </div>;
}

import Link from "next/link";
import { getFitmentRecommendations } from "@/lib/data";
import type { Motorcycle } from "@/lib/types";

function fitmentLabel(confidence:"research"|"medium"|"verified"){
  if(confidence==="verified")return "Manufacturer-listed";
  if(confidence==="medium")return "Confirm fit";
  return "General guidance";
}

export function FitmentSummary({ model }: { model: Motorcycle }) {
  const items = getFitmentRecommendations(model.id);
  return <div className="fitment-summary-grid">{items.map(item => <article key={item.categorySlug} className="fitment-summary-card"><div><span className={`confidence ${item.confidence}`}>{fitmentLabel(item.confidence)}</span></div><h3>{item.title}</h3><strong>{item.recommendation}</strong><p>{item.mounting}</p><small>{item.caution}</small><div className="fitment-card-links">{item.productHref && <Link href={item.productHref}>Open product →</Link>}{item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noreferrer">Manufacturer source ↗</a>}{!item.productHref && <Link href={`/accessories/${item.categorySlug}`}>Open category →</Link>}</div></article>)}</div>;
}

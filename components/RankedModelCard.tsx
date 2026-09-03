import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { EntityMedia } from "@/components/EntityMedia";

function reason(model: Motorcycle, intent: string) {
  if (intent === "fit") return `${model.seatHeightMm} mm seat · ${model.curbWeightKg} kg`;
  if (intent === "use-case") return model.fuelConsumptionKmL ? `${model.fuelConsumptionKmL} km/L listed · ${model.fuelTankL} L tank` : `${model.fuelTankL} L tank · ${model.category}`;
  if (intent === "budget") return `${model.engineCc} cc · ${model.category}`;
  return `${model.category} · ${model.engineCc} cc`;
}

export function RankedModelCard({ model, intent, rank }: { model: Motorcycle; intent: string; rank?: number }) {
  const href=`/motorcycles/${model.makeSlug}/${model.slug}`;
  return <article className="rank-card">
    <div className="rank-number" aria-label={rank ? `Rank ${rank}` : undefined}>{rank ?? ""}</div>
    <EntityMedia entityType="motorcycle" entityId={model.id} className="recommendation-model-media" linkHref={href} showCredit={false} fallback={<div className="recommendation-model-fallback">{model.make}</div>} />
    <div className="rank-copy"><h2><Link href={href}>{model.make} {model.model}</Link></h2><p>{model.summary}</p><div className="rank-reason">{reason(model,intent)}</div></div>
    <div className="rank-price"><span>Observed price</span><strong>{observedMarketPriceLabel(model)}</strong><Link href={href}>View model →</Link></div>
  </article>;
}

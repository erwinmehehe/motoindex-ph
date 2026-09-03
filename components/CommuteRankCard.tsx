import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { commuteMonthlyCosts } from "@/lib/commuteMath";

export function CommuteRankCard({ model, reasons }: { model: Motorcycle; reasons:string[] }) {
  const costs=commuteMonthlyCosts(model);
  return <article className="commute-rank-card"><div className="commute-rank-copy"><h2><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}>{model.model}</Link></h2><p>{model.summary}</p><div className="commute-reasons">{reasons.slice(0,4).map(r=><span key={r}>{r}</span>)}</div></div><div className="commute-rank-kpis"><div><small>Market price</small><strong>{observedMarketPriceLabel(model)}</strong></div><div><small>Fuel + maintenance*</small><strong>₱{Math.round(costs.total).toLocaleString("en-PH")}/mo</strong></div><Link href={`/motorcycles/${model.makeSlug}/${model.slug}`}>View motorcycle →</Link></div></article>;
}

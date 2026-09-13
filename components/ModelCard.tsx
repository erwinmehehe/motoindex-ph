import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { EntityMedia } from "@/components/EntityMedia";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { SaveToShortlistButton } from "@/components/SaveToShortlistButton";
import { CompareButton } from "@/components/CompareButton";
import { lifecycleLabel } from "@/lib/lifecycle";

export function ModelCard({ model }: { model: Motorcycle }) {
  const previous = model.marketStatus === "previous";
  const href = `/motorcycles/${model.makeSlug}/${model.slug}`;
  const needsUpdate = model.freshness !== "verified";
  const showLifecycle = Boolean(model.marketStatus && model.marketStatus !== "current");
  return <article className="model-card"><EntityMedia entityType="motorcycle" entityId={model.id} className="model-card-media" linkHref={href} showCredit={false} fallback={<Link className="model-media-placeholder" href={href} aria-label={`View ${model.make} ${model.model}`}><span>Verified model record</span><strong>{model.make}<b>{model.model}</b></strong><div><em>{model.engineCc} cc</em><em>{model.powerHp} hp</em><em>{model.seatHeightMm} mm seat</em></div><small>Photo pending · open model research →</small></Link>}/><div className="model-card-body"><div className="model-card-topline"><SaveToShortlistButton modelId={model.id} compact/></div>{needsUpdate&&<span className="catalog-status">Needs update</span>}<h3><Link href={href}>{model.make} {model.model}</Link></h3><div className="price">{observedMarketPriceLabel(model)}</div><small>{previous ? "Historical launch SRP" : model.marketPriceSourceLabel ? `${model.marketPriceSourceLabel} · checked ${model.marketPriceCheckedAt}` : `Checked ${model.verifiedAt}`}</small><div className="mini-stats"><span>{model.engineCc} cc</span><span>{model.powerHp} hp</span><span>{model.seatHeightMm} mm seat</span>{model.transmission&&<span>{model.transmission}</span>}{showLifecycle&&<span>{lifecycleLabel(model)}</span>}</div><div className="card-actions"><Link className="button small" href={href}>View model</Link><CompareButton modelId={model.id} compact/></div></div></article>;
}

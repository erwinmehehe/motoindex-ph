import type { ReactNode } from "react";
import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import type { DecisionResult } from "@/lib/decisionEngine";
import { EntityMedia } from "@/components/EntityMedia";
import { EntityVerificationFallback } from "@/components/EntityVerificationFallback";
import { SaveToShortlistButton } from "@/components/SaveToShortlistButton";
import { CompareButton } from "@/components/CompareButton";
import { SourceTrustBadge } from "@/components/SourceTrustBadge";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { lifecycleLabel } from "@/lib/lifecycle";
import { php } from "@/lib/utils";

type Variant = "standard" | "compare" | "decision" | "compact";

type Props = {
  model: Motorcycle;
  variant?: Variant;
  decision?: DecisionResult;
  rank?: number;
  monthlyBudgetPhp?: number;
  monthlyOwnershipPhp?: number;
  highlightMonthly?: boolean;
  leadingAction?: ReactNode;
};

function compactPeso(value: number) {
  if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  return `₱${Math.round(value / 1000)}K`;
}
function absAvailable(model: Motorcycle) {
  return /\bABS\b/i.test(model.abs) && !/^No ABS/i.test(model.abs);
}
function PriceSourceBadge({ model }: { model: Motorcycle }) {
  return <SourceTrustBadge
    label={model.marketPriceSourceLabel || model.sourceLabel}
    url={model.marketPriceSourceUrl || model.sourceUrl}
    needsRecheck={model.freshness !== "verified"}
    historical={model.marketStatus === "previous"}
    compact
  />;
}

export function MotorcycleCard({
  model,
  variant = "standard",
  decision,
  rank,
  monthlyBudgetPhp = 0,
  monthlyOwnershipPhp,
  highlightMonthly = false,
  leadingAction,
}: Props) {
  const href = `/motorcycles/${model.makeSlug}/${model.slug}`;

  if (variant === "compare") {
    return <article className="compare-product-card motorcycle-card motorcycle-card-compare">
      <EntityMedia entityType="motorcycle" entityId={model.id} className="compare-product-media" linkHref={href} showCredit={false} fallback={<EntityVerificationFallback brand={model.make} model={model.model} href={href} className="media-unavailable"/>}/>
      <div className="compare-product-copy"><span>{model.make}</span><h2>{model.model}</h2><strong>{observedMarketPriceLabel(model)}</strong><PriceSourceBadge model={model}/><small>{model.engineCc} cc · {model.curbWeightKg} kg · {model.seatHeightMm} mm seat</small><Link href={href}>View full research →</Link></div>
    </article>;
  }

  if (variant === "decision" && decision) {
    return <article className="decision-result-card motorcycle-card motorcycle-card-decision">
      <div className="decision-rank"><span>#{rank || 1}</span><strong>{decision.score}</strong><small>{decision.label}</small></div>
      <div className="decision-result-media"><EntityMedia entityType="motorcycle" entityId={model.id} linkHref={href} showCredit={false} fallback={<EntityVerificationFallback brand={model.make} model={model.model} href={href} className="decision-media-fallback"/>} /></div>
      <div className="decision-result-main">
        <div className="decision-title-row"><div><span>{model.make} · {model.category}</span><h3><Link href={href}>{model.model}</Link></h3></div><div><strong>{observedMarketPriceLabel(model)}</strong><PriceSourceBadge model={model}/></div></div>
        <div className="decision-chips"><span>{model.engineCc} cc</span><span>{model.seatHeightMm} mm seat</span><span>{model.curbWeightKg} kg</span><span>{model.transmission || "—"}</span>{absAvailable(model) && <span>ABS listed</span>}</div>
        <div className="decision-reason-grid"><div><span>Why it fits</span><ul>{decision.reasons.slice(0,3).map((reason)=><li key={reason}>{reason}</li>)}{decision.reasons.length===0&&<li>Best available score on the selected measurable factors.</li>}</ul></div><div><span>Watch-outs</span><ul>{decision.cautions.slice(0,3).map((reason)=><li key={reason}>{reason}</li>)}{decision.cautions.length===0&&<li>No major score penalty under the selected profile.</li>}</ul></div></div>
        <details className="decision-breakdown"><summary>How MotoIndex reached this result</summary><div>{decision.factors.map((factor)=><div key={factor.key} className={`decision-factor ${factor.tone}`}><span>{factor.label}<small>{factor.detail}</small></span><b>{factor.score}/{factor.maxScore}</b></div>)}</div></details>
        <div className="decision-cost-strip finder-commute-cost"><span><small>Published price</small><b>{compactPeso(decision.purchasePricePhp)}</b></span><span><small>Estimated loan</small><b>{php(decision.estimatedLoanMonthlyPhp)}</b></span><span><small>Running costs</small><b>{php(decision.estimatedRunningMonthlyPhp)}</b></span><span><small>Est. ownership / mo</small><b>{php(decision.estimatedTotalMonthlyPhp)}</b></span>{monthlyBudgetPhp>0&&<span className={decision.affordabilityGapPhp&&decision.affordabilityGapPhp>=0?"within":"over"}><small>Vs ceiling</small><b>{decision.affordabilityGapPhp&&decision.affordabilityGapPhp>=0?"+":""}{php(decision.affordabilityGapPhp||0)}</b></span>}</div>
        <div className="decision-card-actions"><Link href={`/get-quote/${model.makeSlug}/${model.slug}`} className="button small">Dealer price</Link><Link href={href} className="button ghost small">Model details</Link><CompareButton modelId={model.id} compact/><SaveToShortlistButton modelId={model.id} compact/></div>
      </div>
    </article>;
  }

  if (variant === "compact") {
    return <article className="mi-bike motorcycle-card motorcycle-card-compact">
      {leadingAction}
      <Link className="mi-bike-media" href={href} aria-label={`View ${model.make} ${model.model}`}>
        <EntityMedia entityType="motorcycle" entityId={model.id} showCredit={false} fallback={<EntityVerificationFallback brand={model.make} model={model.model} className="mi-bike-fallback"/>}/>
      </Link>
      <div className="mi-bike-copy"><p>{model.make}</p><h2><Link href={href}>{model.model}</Link></h2><strong className="mi-price">{observedMarketPriceLabel(model)}</strong>{typeof monthlyOwnershipPhp === "number" && <p className="mi-monthly">About <strong>{php(monthlyOwnershipPhp)}</strong> a month{highlightMonthly ? <span> · Lowest estimate</span> : null}</p>}</div>
      <details className="mi-details"><summary>Key specifications</summary><dl><div><dt>Engine</dt><dd>{model.engineCc ? `${model.engineCc} cc` : "Electric"}</dd></div><div><dt>Seat height</dt><dd>{model.seatHeightMm ? `${model.seatHeightMm} mm` : "Not listed"}</dd></div><div><dt>Weight</dt><dd>{model.curbWeightKg ? `${model.curbWeightKg} kg` : "Not listed"}</dd></div><div><dt>Transmission</dt><dd>{model.transmission || "Not listed"}</dd></div></dl></details>
      <Link className="mi-view-link" href={href}>Explore {model.model} <span aria-hidden="true">→</span></Link>
    </article>;
  }

  const showLifecycle = Boolean(model.marketStatus && model.marketStatus !== "current");
  return <article className="model-card motorcycle-card motorcycle-card-standard">
    <EntityMedia entityType="motorcycle" entityId={model.id} className="model-card-media" linkHref={href} showCredit={false} fallback={<EntityVerificationFallback brand={model.make} model={model.model} href={href} className="model-media-placeholder"/>}/>
    <div className="model-card-body">
      <div className="model-card-topline"><span className="model-card-brand">{model.make}</span><SaveToShortlistButton modelId={model.id} compact/></div>
      <h3><Link href={href}>{model.make} {model.model}</Link></h3>
      <div className="price">{observedMarketPriceLabel(model)}</div>
      <div className="mini-stats"><span>{model.engineCc} cc</span><span>{model.transmission || "Transmission n/a"}</span><span>{model.seatHeightMm} mm seat</span>{showLifecycle&&<span>{lifecycleLabel(model)}</span>}</div>
      <div className="card-actions"><Link className="button small" href={href}>View model</Link><CompareButton modelId={model.id} compact/></div>
    </div>
  </article>;
}

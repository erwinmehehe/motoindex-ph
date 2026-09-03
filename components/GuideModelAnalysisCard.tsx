import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { observedMarketPriceLabel } from "@/lib/marketChecks";
import { EntityMedia } from "@/components/EntityMedia";

type Props = {
  model: Motorcycle;
  orderLabel: string;
  position: number;
  why: string;
  consider: string;
  alternative: string;
  comparison?: { href: string; label: string };
};

export function GuideModelAnalysisCard({ model, orderLabel, position, why, consider, alternative, comparison }: Props) {
  const href = `/motorcycles/${model.makeSlug}/${model.slug}`;
  return <article className="guide-model-analysis">
    <div className="guide-model-media-wrap">
      <span className="guide-model-position">{orderLabel} {position}</span>
      <EntityMedia
        entityType="motorcycle"
        entityId={model.id}
        className="guide-model-media"
        linkHref={href}
        showCredit={false}
        sizes="(max-width: 700px) 110px, 150px"
        fallback={<div className="recommendation-model-fallback guide-model-fallback"><span>{model.make}</span><small>Image not verified</small></div>}
      />
    </div>

    <div className="guide-model-copy">
      <div className="guide-model-heading">
        <div>
          <span className="guide-model-type">{model.category}</span>
          <h3><Link href={href}>{model.make} {model.model}</Link></h3>
          <p>{model.generation || "Current"} Philippine-market record · specs checked {model.verifiedAt}</p>
        </div>
        <div className="guide-model-price"><small>Observed price</small><strong>{observedMarketPriceLabel(model)}</strong></div>
      </div>

      <div className="guide-model-kpis" aria-label={`${model.make} ${model.model} key specifications`}>
        <span><small>Engine</small><b>{model.engineCc} cc</b></span>
        <span><small>Transmission</small><b>{model.transmission || "Not recorded"}</b></span>
        <span><small>Curb weight</small><b>{model.curbWeightKg} kg</b></span>
        <span><small>Seat height</small><b>{model.seatHeightMm} mm</b></span>
        <span><small>ABS</small><b>{model.abs}</b></span>
      </div>

      <div className="guide-model-editorial">
        <section className="guide-model-why"><strong>Why it ranks here</strong><p>{why}</p></section>
        <section><strong>Who should consider it</strong><p>{consider}</p></section>
        <section><strong>Main tradeoff</strong><p>{alternative}</p></section>
      </div>

      <div className="guide-model-actions">
        <Link href={href}>Model details &amp; sources →</Link>
        {comparison && <Link href={comparison.href}>{comparison.label} →</Link>}
      </div>
    </div>
  </article>;
}

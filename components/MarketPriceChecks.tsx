import type { Motorcycle } from "@/lib/types";
import { priceChecksForModel } from "@/lib/marketChecks";
import { phpRange } from "@/lib/utils";
import { SourceCard, SourceOpen, sourceDisplayName } from "@/components/SourceRef";

function sourceTypeLabel(sourceType: "manufacturer" | "comparison-site" | "dealer") {
  if (sourceType === "manufacturer") return "Manufacturer";
  if (sourceType === "dealer") return "Dealer listing";
  return "Comparison site";
}

export function MarketPriceChecks({ model }: { model: Motorcycle }) {
  const checks = priceChecksForModel(model.id);
  const baselineUrl = model.marketPriceSourceUrl || model.sourceUrl;
  const baselineLabel = sourceDisplayName(model.marketPriceSourceLabel || model.sourceLabel, model.marketPriceSourceUrl || model.sourceUrl);
  const baselineCheckedAt = model.marketPriceCheckedAt || model.verifiedAt;

  return <section className="market-checks">
    <div className="section-head compact"><div><h2>Prices found on PH sources</h2><p>These are source-dated listed prices, not a guaranteed branch quote. Independent checks are shown when stored; until then the model-level source remains visible as a one-source baseline instead of implying broader market coverage.</p></div></div>
    <div className="market-check-grid">
      {checks.length === 0 && <SourceCard url={baselineUrl} className="baseline-price-source">
        <span>Model-level baseline</span>
        <strong>{baselineLabel}</strong>
        <b>{phpRange(model.srp, model.marketPriceHighPhp)}</b>
        <small>Checked {baselineCheckedAt} · 1 verified source currently stored</small>
        <SourceOpen url={baselineUrl} />
      </SourceCard>}
      {checks.map((row)=><SourceCard key={`${row.sourceName}-${row.checkedAt}-${row.priceFromPhp}`} url={row.sourceUrl}>
        <span>{sourceTypeLabel(row.sourceType)}</span>
        <strong>{sourceDisplayName(row.sourceName, row.sourceUrl)}</strong>
        <b>{phpRange(row.priceFromPhp,row.priceToPhp)}</b>
        <small>Checked {row.checkedAt}{row.note ? ` · ${row.note}` : ""}</small>
        <SourceOpen url={row.sourceUrl} />
      </SourceCard>)}
    </div>
    {checks.length === 0 && <p className="market-check-gap">Independent dealer/comparison pricing is still a research gap for this model. MotoIndex will not turn one source into a fake market consensus.</p>}
  </section>;
}

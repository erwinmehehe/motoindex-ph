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
    <div className="section-head compact"><div><h2>Current Philippine price references</h2><p>Compare the published prices we found for this exact model. Dealer cash prices, registration, financing and promotions can still change the final amount.</p></div></div>
    <div className="market-check-grid">
      {checks.length === 0 && <SourceCard url={baselineUrl} className="market-check-card baseline-price-source">
        <span>Model-level baseline</span>
        <strong>{baselineLabel}</strong>
        <b>{phpRange(model.srp, model.marketPriceHighPhp)}</b>
        <small>Checked {baselineCheckedAt} · 1 verified source currently stored</small>
        <SourceOpen url={baselineUrl} />
      </SourceCard>}
      {checks.map((row)=><SourceCard className="market-check-card" key={`${row.sourceName}-${row.checkedAt}-${row.priceFromPhp}`} url={row.sourceUrl}>
        <span>{sourceTypeLabel(row.sourceType)}</span>
        <strong>{sourceDisplayName(row.sourceName, row.sourceUrl)}</strong>
        <b>{phpRange(row.priceFromPhp,row.priceToPhp)}</b>
        <small>Checked {row.checkedAt}{row.note ? ` · ${row.note}` : ""}</small>
        <SourceOpen url={row.sourceUrl} />
      </SourceCard>)}
    </div>
    {checks.length === 0 && <p className="market-check-gap">Only one current price source is stored for this model, so treat it as a reference rather than a market-wide price.</p>}
  </section>;
}

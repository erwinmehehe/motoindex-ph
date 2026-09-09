import type { Motorcycle } from "@/lib/types";
import { priceChecksForModel } from "@/lib/marketChecks";
import { phpRange } from "@/lib/utils";
import { SourceCard, SourceOpen, sourceDisplayName } from "@/components/SourceRef";

function sourceTypeLabel(sourceType: "manufacturer" | "comparison-site" | "dealer") {
  if (sourceType === "manufacturer") return "Manufacturer";
  if (sourceType === "dealer") return "Dealer";
  return "Price comparison";
}

function dateLabel(value?: string) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(new Date(`${value}T00:00:00+08:00`));
}

export function MarketPriceChecks({ model }: { model: Motorcycle }) {
  const checks = priceChecksForModel(model.id);
  const baselineUrl = model.marketPriceSourceUrl || model.sourceUrl;
  const baselineLabel = sourceDisplayName(
    model.marketPriceSourceLabel || model.sourceLabel,
    model.marketPriceSourceUrl || model.sourceUrl
  );
  const baselineCheckedAt = model.marketPriceCheckedAt || model.verifiedAt;

  return <section className="market-checks market-price-sources" aria-labelledby="market-price-sources-heading">
    <div className="section-head compact market-price-sources-head">
      <div>
        <span className="section-kicker">Price verification</span>
        <h2 id="market-price-sources-heading">Philippine price checks</h2>
        <p>Compare published prices for this exact motorcycle. The final amount can still change with variant, dealer fees, registration, financing and promotions.</p>
      </div>
    </div>

    <div className="market-check-grid market-price-source-grid">
      {checks.length === 0 && <SourceCard url={baselineUrl} className="market-check-card market-price-source-card baseline-price-source">
        <div className="market-price-source-top">
          <span className="market-price-source-type">Price reference</span>
          <time>{dateLabel(baselineCheckedAt)}</time>
        </div>
        <div className="market-price-source-value">{phpRange(model.srp, model.marketPriceHighPhp)}</div>
        <p className="market-price-source-note">Current published price reference for this model.</p>
        <div className="market-price-source-footer">
          <span>{baselineLabel}</span>
          <SourceOpen url={baselineUrl} />
        </div>
      </SourceCard>}

      {checks.map((row) => <SourceCard
        className="market-check-card market-price-source-card"
        key={`${row.sourceName}-${row.checkedAt}-${row.priceFromPhp}`}
        url={row.sourceUrl}
      >
        <div className="market-price-source-top">
          <span className="market-price-source-type">{sourceTypeLabel(row.sourceType)}</span>
          <time>{dateLabel(row.checkedAt)}</time>
        </div>
        <div className="market-price-source-value">{phpRange(row.priceFromPhp, row.priceToPhp)}</div>
        <p className="market-price-source-note">{row.note || "Published Philippine price reference for this model."}</p>
        <div className="market-price-source-footer">
          <span>{sourceDisplayName(row.sourceName, row.sourceUrl)}</span>
          <SourceOpen url={row.sourceUrl} />
        </div>
      </SourceCard>)}
    </div>

    {checks.length === 0 && <p className="market-price-source-disclaimer">Only one published price reference is available right now. Confirm the current dealer quote before paying a reservation or deposit.</p>}
  </section>;
}

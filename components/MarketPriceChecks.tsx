import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { priceChecksForModel } from "@/lib/marketChecks";
import { phpRange } from "@/lib/utils";
import { SourceCard, SourceOpen, sourceDisplayName } from "@/components/SourceRef";

function sourceTypeLabel(sourceType: "manufacturer" | "comparison-site" | "dealer") {
  if (sourceType === "manufacturer") return "Official price";
  if (sourceType === "dealer") return "Dealer price";
  return "Comparison price";
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
  const uniqueChecks = checks.filter((row, index) =>
    checks.findIndex((item) => item.sourceUrl === row.sourceUrl) === index
  );
  const baselineUrl = model.marketPriceSourceUrl || model.sourceUrl;
  const baselineLabel = sourceDisplayName(
    model.marketPriceSourceLabel || model.sourceLabel,
    baselineUrl
  );
  const baselineCheckedAt = model.marketPriceCheckedAt || model.verifiedAt;
  const showBaseline = Boolean(baselineUrl) && !uniqueChecks.some((row) => row.sourceUrl === baselineUrl);

  return <section className="market-checks market-price-sources" aria-labelledby="market-price-sources-heading">
    <div className="section-head compact market-price-sources-head">
      <div>
        <span className="section-kicker">Price check</span>
        <h2 id="market-price-sources-heading">Published Philippine prices</h2>
        <p>These are the prices we found for this motorcycle. Open any source to check the listing yourself, then confirm the exact variant and final cash price with the seller.</p>
      </div>
    </div>

    <div className="market-check-grid market-price-source-grid">
      {showBaseline && <SourceCard url={baselineUrl} className="market-check-card market-price-source-card baseline-price-source">
        <div className="market-price-source-top">
          <span className="market-price-source-type">Price source</span>
          <time>{dateLabel(baselineCheckedAt)}</time>
        </div>
        <div className="market-price-source-value">{phpRange(model.srp, model.marketPriceHighPhp)}</div>
        <p className="market-price-source-note">Published price for this motorcycle at the time we checked it.</p>
        <div className="market-price-source-footer">
          <span>{baselineLabel}</span>
          <SourceOpen url={baselineUrl} />
        </div>
      </SourceCard>}

      {uniqueChecks.map((row) => <SourceCard
        className="market-check-card market-price-source-card"
        key={row.sourceUrl}
        url={row.sourceUrl}
      >
        <div className="market-price-source-top">
          <span className="market-price-source-type">{sourceTypeLabel(row.sourceType)}</span>
          <time>{dateLabel(row.checkedAt)}</time>
        </div>
        <div className="market-price-source-value">{phpRange(row.priceFromPhp, row.priceToPhp)}</div>
        <p className="market-price-source-note">{row.note || "Published Philippine price for this motorcycle."}</p>
        <div className="market-price-source-footer">
          <span>{sourceDisplayName(row.sourceName, row.sourceUrl, row.sourceType)}</span>
          <SourceOpen url={row.sourceUrl} />
        </div>
      </SourceCard>)}
    </div>

    {uniqueChecks.length === 0 && <p className="market-price-source-disclaimer">Only one published price is available right now. Confirm the current dealer quote before paying a reservation or deposit.</p>}
    <p className="market-price-source-disclaimer">Ready to ask for a current quote? <Link href="/dealers">Find motorcycle dealers in the Philippines →</Link></p>
  </section>;
}
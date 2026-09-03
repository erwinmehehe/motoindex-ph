import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { checkedAgeDays, marketPriceNeedsRefresh, modelSourceNeedsRefresh } from "@/lib/freshnessPolicy";

function ageLabel(days: number) {
  if (!Number.isFinite(days)) return "unknown age";
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function Freshness({ model }: { model: Motorcycle }) {
  const sourceOverdue = modelSourceNeedsRefresh(model);
  const marketOverdue = marketPriceNeedsRefresh(model);
  const tone = sourceOverdue ? "stale" : model.freshness;
  const status = sourceOverdue ? "Source update due" : model.freshness === "verified" ? "Checked" : model.freshness === "stale" ? "Needs update" : "Needs checking";
  return (
    <div className={`freshness ${tone}`}>
      <span className="dot" />
      <div>
        <strong>{status}</strong>
        <small>Specifications checked {model.verifiedAt} ({ageLabel(checkedAgeDays(model.verifiedAt))}) · <a href={model.sourceUrl} target="_blank" rel="noreferrer">{model.sourceLabel} ↗</a></small>
        {model.marketPriceSourceUrl&&<small className="market-source">{marketOverdue ? "Price update due" : "Price checked"} {model.marketPriceCheckedAt} ({ageLabel(checkedAgeDays(model.marketPriceCheckedAt))}) · <a href={model.marketPriceSourceUrl} target="_blank" rel="noreferrer">{model.marketPriceSourceLabel || "price source"} ↗</a></small>}
        <Link className="freshness-method" href="/methodology">How sources are checked →</Link>
      </div>
    </div>
  );
}

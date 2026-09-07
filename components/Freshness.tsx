import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { checkedAgeDays, marketPriceNeedsRefresh, modelSourceNeedsRefresh } from "@/lib/freshnessPolicy";
import { sourceDisplayName } from "@/components/SourceRef";

function ageLabel(days: number) {
  if (!Number.isFinite(days)) return "unknown age";
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// The hero names its sources and dates them, but does not link out to them.
// Several sources are direct competitors, and the hero is the highest-value link
// position on the page. The full linked citation still lives in the #price
// section (PriceIntelligence), which the hero's "See price sources" button jumps
// straight to — so verifiability is unchanged, the outbound link just is not in
// the hero.
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
        <small>Specifications checked {model.verifiedAt} ({ageLabel(checkedAgeDays(model.verifiedAt))}) · <span className="freshness-source">{sourceDisplayName(model.sourceLabel, model.sourceUrl)}</span></small>
        {model.marketPriceSourceUrl&&<small className="market-source">{marketOverdue ? "Price update due" : "Price checked"} {model.marketPriceCheckedAt} ({ageLabel(checkedAgeDays(model.marketPriceCheckedAt))}) · <span className="freshness-source">{sourceDisplayName(model.marketPriceSourceLabel || "price source", model.marketPriceSourceUrl)}</span></small>}
        <Link className="freshness-method" href="/methodology">How sources are checked →</Link>
      </div>
    </div>
  );
}

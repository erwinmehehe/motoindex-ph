import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { checkedAgeDays, modelSourceNeedsRefresh } from "@/lib/freshnessPolicy";
import { sourceDisplayName } from "@/components/SourceRef";

function ageLabel(days: number) {
  if (!Number.isFinite(days)) return "unknown age";
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function Freshness({ model }: { model: Motorcycle }) {
  const sourceOverdue = modelSourceNeedsRefresh(model);
  const tone = sourceOverdue ? "stale" : model.freshness;
  const status = sourceOverdue ? "Specification update due" : model.freshness === "verified" ? "Specifications checked" : model.freshness === "stale" ? "Specifications need an update" : "Specifications need checking";
  return (
    <div className={`freshness ${tone}`}>
      <span className="dot" />
      <div>
        <strong>{status}</strong>
        <small>{model.verifiedAt} ({ageLabel(checkedAgeDays(model.verifiedAt))}) · <span className="freshness-source">{sourceDisplayName(model.sourceLabel, model.sourceUrl)}</span></small>
        <Link className="freshness-method" href="/methodology">How we check motorcycle data →</Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { modelSourceNeedsRefresh } from "@/lib/freshnessPolicy";
import { sourceDisplayName } from "@/components/SourceRef";
import { SourceTrustBadge } from "@/components/SourceTrustBadge";

export function Freshness({ model }: { model: Motorcycle }) {
  const sourceOverdue = modelSourceNeedsRefresh(model);
  const tone = sourceOverdue ? "stale" : model.freshness;
  const status = sourceOverdue ? "Specification update due" : model.freshness === "verified" ? "Specifications checked" : model.freshness === "stale" ? "Specifications need an update" : "Specifications need checking";
  return (
    <div className={`freshness ${tone}`}>
      <span className="dot" />
      <div>
        <strong>{status}</strong>
        <SourceTrustBadge label={model.sourceLabel} url={model.sourceUrl} needsRecheck={sourceOverdue || model.freshness !== "verified"} compact />
        <small>Checked {model.verifiedAt} · <span className="freshness-source">{sourceDisplayName(model.sourceLabel, model.sourceUrl)}</span></small>
        <Link className="freshness-method" href="/methodology">How we check motorcycle data →</Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { modelSourceNeedsRefresh } from "@/lib/freshnessPolicy";

export function Freshness({ model }: { model: Motorcycle }) {
  const sourceOverdue = modelSourceNeedsRefresh(model);
  const tone = sourceOverdue ? "stale" : model.freshness;
  const status = sourceOverdue ? "Specification update due" : model.freshness === "verified" ? "Specifications checked" : model.freshness === "stale" ? "Specifications need an update" : "Specifications need checking";
  return (
    <div className={`freshness ${tone}`}>
      <span className="dot" />
      <div>
        <strong>{status}</strong>
        <Link className="freshness-method" href="/methodology">How MotoIndex checks motorcycle data →</Link>
      </div>
    </div>
  );
}

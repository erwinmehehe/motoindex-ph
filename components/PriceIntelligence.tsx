import type { Motorcycle } from "@/lib/types";
import { modelPriceIntelligence } from "@/lib/priceIntelligence";
import { php, phpRange } from "@/lib/utils";
import { SourceRef } from "@/components/SourceRef";

function dateLabel(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila"
  }).format(new Date(`${value}T00:00:00+08:00`));
}

export function PriceIntelligence({ model }: { model: Motorcycle }) {
  const intel = modelPriceIntelligence(model);

  // A single price observation does not need its own "history" section.
  // The current price and its source are already shown above and below.
  if (!intel.historyReady || intel.snapshots.length < 2) return null;

  const delta = intel.lowDeltaPhp;

  return <section className="price-intel price-history" aria-labelledby="price-history-heading">
    <div className="section-head compact price-history-head">
      <div>
        <span className="section-kicker">Price history</span>
        <h2 id="price-history-heading">How the recorded price has changed</h2>
        <p>Compare dated price observations for the same motorcycle. A difference can come from a new variant, seller mix, promotion or an actual price change.</p>
      </div>
    </div>

    <div className="price-history-summary">
      <div>
        <span>Recorded range</span>
        <strong>{phpRange(intel.range.from, intel.range.to)}</strong>
      </div>
      <div>
        <span>Price sources</span>
        <strong>{intel.sourceCount}</strong>
      </div>
      <div>
        <span>Tracking since</span>
        <strong>{dateLabel(intel.firstObservedAt)}</strong>
      </div>
    </div>

    {typeof delta === "number" && delta !== 0 && <div className="price-history-change">
      <span>Change in the lowest recorded price</span>
      <strong>{`${delta > 0 ? "+" : "−"}${php(Math.abs(delta))}`}</strong>
    </div>}

    <div className="price-history-list">
      {intel.snapshots.map((snapshot) => <article className="price-history-row" key={`${snapshot.observedAt}-${snapshot.kind}`}>
        <div className="price-history-date">
          <time>{dateLabel(snapshot.observedAt)}</time>
          <span>{snapshot.kind === "launch" ? "Launch price" : "Market check"}</span>
        </div>
        <div className="price-history-price">
          <strong>{phpRange(snapshot.fromPhp, snapshot.toPhp)}</strong>
          {snapshot.note && <p>{snapshot.note}</p>}
        </div>
        <div className="price-history-source">
          <small>{snapshot.sourceCount} source{snapshot.sourceCount === 1 ? "" : "s"}</small>
          <span>{snapshot.sourceLabels.join(", ")}</span>
          {snapshot.sourceUrl ? <SourceRef url={snapshot.sourceUrl} label="Source" /> : null}
        </div>
      </article>)}
    </div>
  </section>;
}

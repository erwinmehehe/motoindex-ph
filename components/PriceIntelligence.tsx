import type { Motorcycle } from "@/lib/types";
import { modelPriceIntelligence } from "@/lib/priceIntelligence";
import { php, phpRange } from "@/lib/utils";

function dateLabel(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Manila" }).format(new Date(`${value}T00:00:00+08:00`));
}

export function PriceIntelligence({ model }: { model: Motorcycle }) {
  const intel = modelPriceIntelligence(model);
  if (!intel.snapshots.length) return null;
  const delta = intel.lowDeltaPhp;
  return <section className="price-intel">
    <div className="section-head compact"><div><h2>Dated price records</h2><p>Each entry is tied to a date and source set. A difference between dates can reflect a different seller mix as well as an actual price change.</p></div></div>
    <div className="price-intel-kpis">
      <div><span>Observed range</span><strong>{phpRange(intel.range.from,intel.range.to)}</strong></div>
      <div><span>Price sources on page</span><strong>{intel.sourceCount}</strong></div>
      <div><span>Latest price spread</span><strong>{php(intel.spreadPhp)}</strong></div>
      <div><span>Records since</span><strong>{dateLabel(intel.firstObservedAt)}</strong></div>
    </div>
    {typeof delta === "number" && <div className="price-intel-delta"><span>Lowest recorded price vs previous check</span><strong>{delta===0?"No change":`${delta>0?"+":"−"}${php(Math.abs(delta))}`}</strong><small>This compares the lowest recorded observation on each date. It does not prove the whole market moved by the same amount.</small></div>}
    <div className="price-snapshots">
      {intel.snapshots.map((snapshot)=><article className="price-snapshot" key={`${snapshot.observedAt}-${snapshot.kind}`}>
        <time>{dateLabel(snapshot.observedAt)}</time>
        <div><span>{snapshot.kind === "launch" ? "Launch / manufacturer reference" : "Market price check"}</span><strong>{phpRange(snapshot.fromPhp,snapshot.toPhp)}</strong><small>{snapshot.sourceCount} source{snapshot.sourceCount===1?"":"s"} · {snapshot.sourceLabels.join(", ")}</small>{snapshot.note&&<p>{snapshot.note}</p>}</div>
        {snapshot.sourceUrl?<a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a>:<span className="muted-copy">See price sources below</span>}
      </article>)}
    </div>
    {!intel.historyReady&&<p className="variant-footnote">This is the first recorded price check. More dates will appear as prices are rechecked.</p>}
  </section>;
}

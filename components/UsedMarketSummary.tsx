import { php } from "@/lib/utils";
import { marketSummary } from "@/lib/usedMarket";

export function UsedMarketSummary({modelId}:{modelId:string}){
  const s=marketSummary(modelId);
  if(!s.total)return <div className="empty-state large">No used listing samples are available for this model yet.</div>;
  return <div className="used-market-summary">
    <div><span>Median asking price</span><strong>{php(s.medianPrice)}</strong><small>{s.included} listings used</small></div>
    <div><span>Observed range</span><strong>{php(s.low)}–{php(s.high)}</strong><small>After outlier filtering</small></div>
    <div><span>Average mileage</span><strong>{s.averageMileage.toLocaleString()} km</strong><small>{s.oldestYear}–{s.newestYear} model years</small></div>
    <div><span>Vs. new reference</span><strong>{s.discountVsReference}% lower</strong><small>{s.confidence === "demo" ? "Demo market sample" : `${s.confidence} confidence`}</small></div>
  </div>;
}

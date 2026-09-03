import type { PriceObservation } from "@/lib/types";
import { php } from "@/lib/utils";

export function PriceHistory({items}:{items:PriceObservation[]}){
  if(items.length < 2) return null;
  const prices=items.map(i=>i.pricePhp), min=Math.min(...prices), max=Math.max(...prices), span=Math.max(max-min,1);
  return <div className="history-card"><div><h2>Recorded observations</h2><p>History is useful only when each observation is tied to the same SKU/variant and seller context.</p></div><div className="history-bars">{items.map((i,idx)=>{const pct=28+((i.pricePhp-min)/span)*62;return <div className="history-item" key={`${i.sellerName}-${i.observedAt}-${idx}`}><span>{i.observedAt.slice(5)}</span><div><i style={{height:`${pct}%`}}></i></div><strong>{php(i.pricePhp)}</strong></div>})}</div><small className="history-note">Demo observations are not current market-price claims.</small></div>
}

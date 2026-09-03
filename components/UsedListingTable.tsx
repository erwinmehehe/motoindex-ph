import type { UsedListing } from "@/lib/types";
import { isPriceOutlier } from "@/lib/usedMarket";
import { php } from "@/lib/utils";

export function UsedListingTable({items}:{items:UsedListing[]}){
  if(!items.length)return <div className="empty-state large">No used listing samples are available for this model yet.</div>;
  return <div className="used-listing-table">
    <div className="used-listing-row head"><span>Listing</span><span>Asking price</span><span>Mileage</span><span>Condition</span><span>Status</span></div>
    {items.map(x=>{const outlier=isPriceOutlier(x,items);return <div className={`used-listing-row${outlier?" outlier":""}`} key={x.id}>
      <span><strong>{x.title}</strong><small>{x.location} · {x.sellerType}</small></span>
      <span><strong>{php(x.askingPricePhp)}</strong><small>Posted {x.postedAt}</small></span>
      <span>{x.mileageKm.toLocaleString()} km</span>
      <span>{x.condition}</span>
      <span><em className={`listing-status ${x.status}`}>{outlier?"Excluded outlier":x.status}</em></span>
    </div>})}
  </div>;
}

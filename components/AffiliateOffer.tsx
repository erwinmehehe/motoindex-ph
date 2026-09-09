"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";

type Status = {
  active: boolean;
  merchant?: "shopee";
  network?: "shopee_direct" | "involve_asia";
};

export function AffiliateOffer({ productId, productName, compact = false }: { productId: string; productName: string; compact?: boolean }) {
  const [status,setStatus]=useState<Status|undefined>(undefined);

  useEffect(()=>{
    let cancelled=false;
    fetch(`/api/affiliate-links/${encodeURIComponent(productId)}`,{cache:"no-store"})
      .then(response=>response.ok?response.json():{active:false})
      .then((result:Status)=>{if(!cancelled)setStatus(result);})
      .catch(()=>{if(!cancelled)setStatus({active:false});});
    return ()=>{cancelled=true;};
  },[productId]);

  if(!status?.active||!status.network)return null;
  if(compact)return <div className="affiliate-card-action"><AffiliateLink productId={productId} productName={productName} network={status.network} compact /></div>;
  return <aside className="affiliate-offer" aria-label="Affiliate offer">
    <div><h2>Check current price on Shopee</h2><p>Open the current listing to check the seller, exact size or variant, stock, shipping and final checkout price.</p></div>
    <div className="affiliate-offer-action"><AffiliateLink productId={productId} productName={productName} network={status.network} /><small>MotoIndex may earn a commission from qualifying purchases at no extra cost to you. The tracking destination may use Shopee directly or an approved affiliate network such as Involve Asia. <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.</small></div>
  </aside>;
}

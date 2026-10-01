"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";

const MARKETPLACE_AFFILIATE_CSS = `.affiliate-kicker{display:block;color:var(--accent);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.affiliate-marketplace-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%}.affiliate-marketplace-actions .affiliate-button{width:100%;color:#fff}.affiliate-button.shopee{background:#ee4d2d}.affiliate-button.lazada{background:#24195d}.affiliate-card-action:has(.affiliate-button+.affiliate-button){display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}@media(max-width:700px){.affiliate-marketplace-actions,.affiliate-card-action:has(.affiliate-button+.affiliate-button){grid-template-columns:1fr}}`;

type Status = {
  active: boolean;
  offers?: Array<{
    merchant: "shopee" | "lazada";
    network: "shopee_direct" | "involve_asia";
  }>;
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

  const offers=status?.offers||[];
  if(!status?.active||!offers.length)return null;
  if(compact)return <><style>{MARKETPLACE_AFFILIATE_CSS}</style><div className="affiliate-card-action">{offers.map(offer=><AffiliateLink key={offer.merchant} productId={productId} productName={productName} merchant={offer.merchant} network={offer.network} compact />)}</div></>;
  return <><style>{MARKETPLACE_AFFILIATE_CSS}</style><aside className="affiliate-offer marketplace-affiliate-offer" aria-label="Marketplace affiliate offers">
    <div><span className="affiliate-kicker">Verified marketplace links</span><h2>Compare marketplace prices</h2><p>Check the exact helmet size, graphic, seller rating, stock, shipping and checkout total before ordering.</p></div>
    <div className="affiliate-offer-action"><div className="affiliate-marketplace-actions">{offers.map(offer=><AffiliateLink key={offer.merchant} productId={productId} productName={productName} merchant={offer.merchant} network={offer.network} />)}</div><small>MotoIndex may earn a commission from qualifying purchases at no extra cost to you. Marketplace links may use direct or approved affiliate-network tracking. Rankings and editorial conclusions are not affected. <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.</small></div>
  </aside></>;
}

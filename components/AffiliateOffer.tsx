"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";

type Status = {
  active: boolean;
  offers?: Array<{
    merchant: "shopee" | "lazada";
    network: "shopee_direct" | "involve_asia";
  }>;
};

type AffiliateOfferVariant = "full" | "compact" | "hero";

export function AffiliateOffer({
  productId,
  productName,
  variant = "full",
  compact = false
}: {
  productId: string;
  productName: string;
  variant?: AffiliateOfferVariant;
  compact?: boolean;
}) {
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
  const presentation: AffiliateOfferVariant = compact ? "compact" : variant;
  if(!status?.active||!offers.length)return null;

  if(presentation==="compact"){
    return <div className="affiliate-card-action">
      {offers.map(offer=><AffiliateLink
        key={offer.merchant}
        productId={productId}
        productName={productName}
        merchant={offer.merchant}
        network={offer.network}
        compact
      />)}
    </div>;
  }

  if(presentation==="hero"){
    return <div className="affiliate-hero-actions" aria-label="Marketplace price links">
      {offers.map(offer=><AffiliateLink
        key={offer.merchant}
        productId={productId}
        productName={productName}
        merchant={offer.merchant}
        network={offer.network}
        hero
      />)}
    </div>;
  }

  return <aside className="affiliate-offer marketplace-affiliate-offer" aria-label="Marketplace affiliate offers">
    <div><span className="affiliate-kicker">Verified marketplace links</span><h2>Compare marketplace prices</h2><p>Check the exact helmet size, graphic, seller rating, stock, shipping and checkout total before ordering.</p></div>
    <div className="affiliate-offer-action">
      <div className="affiliate-marketplace-actions">
        {offers.map(offer=><AffiliateLink
          key={offer.merchant}
          productId={productId}
          productName={productName}
          merchant={offer.merchant}
          network={offer.network}
        />)}
      </div>
      <small>MotoIndex may earn a commission from qualifying purchases at no extra cost to you. Marketplace links may use direct or approved affiliate-network tracking. Rankings and editorial conclusions are not affected. <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.</small>
    </div>
  </aside>;
}

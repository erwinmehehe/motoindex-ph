"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AffiliateLink } from "@/components/AffiliateLink";

const MARKETPLACE_AFFILIATE_CSS = `.affiliate-kicker{display:block;color:var(--mi-color-primary);font-size:10px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.affiliate-marketplace-actions,.affiliate-hero-actions,.affiliate-card-action{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;width:100%}.affiliate-button{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 15px;border-radius:12px;color:var(--mi-color-surface)!important;font-size:12px;font-weight:800;text-align:center}.affiliate-button.shopee{background:var(--mi-color-shopee)}.affiliate-button.lazada{background:var(--mi-color-lazada)}.affiliate-button.compact{min-height:38px;padding:9px 11px;font-size:11px}.affiliate-button.hero{min-height:48px;padding:12px 16px}.marketplace-affiliate-offer{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,.9fr);gap:28px;align-items:start;margin-top:22px;padding:22px;border:1px solid var(--mi-color-line);border-radius:16px;background:var(--mi-color-surface)}.marketplace-affiliate-offer h2{margin:5px 0 8px;font-size:24px}.affiliate-offer-action small{display:block;margin-top:9px;color:var(--mi-color-copy);font-size:10px;line-height:1.55}@media(max-width:700px){.affiliate-marketplace-actions,.affiliate-hero-actions,.affiliate-card-action,.marketplace-affiliate-offer{grid-template-columns:1fr}}`;

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
    return <><style>{MARKETPLACE_AFFILIATE_CSS}</style><div className="affiliate-card-action">
      {offers.map(offer=><AffiliateLink
        key={offer.merchant}
        productId={productId}
        productName={productName}
        merchant={offer.merchant}
        network={offer.network}
        compact
      />)}
    </div></>;
  }

  if(presentation==="hero"){
    return <><style>{MARKETPLACE_AFFILIATE_CSS}</style><div className="affiliate-hero-actions" aria-label="Marketplace price links">
      {offers.map(offer=><AffiliateLink
        key={offer.merchant}
        productId={productId}
        productName={productName}
        merchant={offer.merchant}
        network={offer.network}
        hero
      />)}
    </div></>;
  }

  return <><style>{MARKETPLACE_AFFILIATE_CSS}</style><aside className="affiliate-offer marketplace-affiliate-offer" aria-label="Marketplace affiliate offers">
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
  </aside></>;
}

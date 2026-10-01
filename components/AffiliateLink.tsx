"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/track";

export function AffiliateLink({
  productId,
  productName,
  merchant,
  network,
  compact = false,
  hero = false
}: {
  productId: string;
  productName: string;
  merchant: "shopee" | "lazada";
  network: "shopee_direct" | "involve_asia";
  compact?: boolean;
  hero?: boolean;
}) {
  const href = `/go/affiliate/${encodeURIComponent(productId)}/${merchant}`;
  const merchantLabel = merchant === "lazada" ? "Lazada" : "Shopee";
  const presentation = hero ? "hero" : compact ? "compact" : "default";
  return <Link
    className={`affiliate-button ${presentation} ${merchant}`}
    href={href}
    rel="sponsored nofollow noopener noreferrer"
    target="_blank"
    onClick={() => trackEvent("affiliate_click", {
      merchant,
      network,
      product_id: productId,
      product_name: productName,
      placement: hero ? "product_hero" : compact ? "catalog_card" : "product_detail"
    })}
  >
    Check price on {merchantLabel} <span aria-hidden="true">↗</span>
  </Link>;
}

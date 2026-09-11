"use client";

import Link from "next/link";
import { backendUrl } from "@/lib/apiBase";
import { trackEvent } from "@/lib/track";

export function AffiliateLink({
  productId,
  productName,
  network,
  compact = false
}: {
  productId: string;
  productName: string;
  network: "shopee_direct" | "involve_asia";
  compact?: boolean;
}) {
  const href = backendUrl(`/go/affiliate/${encodeURIComponent(productId)}`);
  return <Link
    className={compact ? "affiliate-button compact" : "affiliate-button"}
    href={href}
    rel="sponsored nofollow noopener noreferrer"
    target="_blank"
    onClick={() => trackEvent("affiliate_click", {
      merchant: "shopee",
      network,
      product_id: productId,
      product_name: productName,
      placement: compact ? "catalog_card" : "product_detail"
    })}
  >
    Check price on Shopee <span aria-hidden="true">↗</span>
  </Link>;
}

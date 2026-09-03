"use client";

import { AffiliateLink } from "@/components/AffiliateLink";

// v2.2.1 compatibility wrapper. New UI should use AffiliateLink through AffiliateOffer.
export function ShopeeAffiliateLink({
  productId,
  productName,
  compact = false
}: {
  productId: string;
  productName: string;
  compact?: boolean;
}) {
  return <AffiliateLink productId={productId} productName={productName} network="shopee_direct" compact={compact} />;
}

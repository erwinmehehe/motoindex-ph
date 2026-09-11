"use client";

import Link from "next/link";
import { backendUrl } from "@/lib/apiBase";
import { trackEvent } from "@/lib/track";

export function OfferOutboundLink({ offerId, entityType, entityId, sellerName, affiliate = false }: {
  offerId: string;
  entityType: string;
  entityId: string;
  sellerName: string;
  affiliate?: boolean;
}) {
  return <Link
    className="commerce-offer-button"
    href={backendUrl(`/go/${encodeURIComponent(offerId)}`)}
    rel={affiliate ? "sponsored nofollow" : "nofollow"}
    onClick={() => trackEvent("commerce_outbound_click", {
      offer_id: offerId,
      entity_type: entityType,
      entity_id: entityId,
      merchant: sellerName,
      affiliate,
    })}
  >Check merchant ↗</Link>;
}

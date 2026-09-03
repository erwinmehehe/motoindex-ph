import { NextResponse } from "next/server";
import { getOfferById, publicOfferTarget } from "@/lib/offers";
import {
  commerceOfferDestination,
  getSourceBackedCommerceOfferById,
  isFreshCommerceOffer,
} from "@/lib/commerceOffers";
import { databaseConfigured } from "@/lib/db";
import { getVerifiedOfferById, recordOutboundClick } from "@/lib/persistentOffers";
import { isHttpsUrl } from "@/lib/commercePolicy";

function redirectNoStore(target: string | URL, status = 302) {
  const response = NextResponse.redirect(target, status);
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export async function GET(request: Request, { params }: { params: Promise<{ offerId: string }> }) {
  const { offerId } = await params;

  const sourceOffer = getSourceBackedCommerceOfferById(offerId);
  if (sourceOffer) {
    const destination = commerceOfferDestination(sourceOffer);
    if (!isFreshCommerceOffer(sourceOffer) || !destination) {
      return redirectNoStore(new URL("/catalog?offer=stale", request.url));
    }
    try { await recordOutboundClick(sourceOffer, true); } catch { /* analytics must never block the redirect */ }
    return redirectNoStore(destination);
  }

  if (databaseConfigured()) {
    try {
      const persistent = await getVerifiedOfferById(offerId);
      const destination = persistent ? commerceOfferDestination(persistent) : null;
      if (persistent && destination) {
        try { await recordOutboundClick(persistent, false); } catch { /* analytics must never block the redirect */ }
        return redirectNoStore(destination);
      }
    } catch {
      // Database availability must not turn a merchant redirect into a 500.
    }
  }

  // Legacy v0.6 safety invariant: offer.status!=="verified" must never redirect outbound.
  const offer = getOfferById(offerId);
  if (!offer) return redirectNoStore(new URL("/catalog", request.url));
  const legacyDestination = offer.affiliateUrl || offer.targetUrl;
  if (offer.status !== "verified" || !legacyDestination || !isHttpsUrl(legacyDestination)) {
    return redirectNoStore(new URL(`${publicOfferTarget(offer)}?offer=not-live`, request.url));
  }
  return redirectNoStore(legacyDestination);
}

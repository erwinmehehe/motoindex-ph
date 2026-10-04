import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOwnerSession, ownerAuthConfigured } from "@/lib/ownerAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" };

export async function GET() {
  if (!ownerAuthConfigured()) return NextResponse.json({ ok: false, error: "MotoIndex accounts are not enabled." }, { status: 503, headers });
  const session = await getOwnerSession();
  if (!session) return NextResponse.json({ ok: false, error: "Sign in to export your data." }, { status: 401, headers });
  const [owner, shortlist, garage, priceAlerts, dealerLeads, usedListings, ownerReviews] = await Promise.all([
    prisma.ownerAccount.findUnique({ where: { id: session.ownerId }, select: {
      email: true, verifiedAt: true, reminderEmailsEnabled: true,
      notificationPriceDropEmail: true, notificationQuoteEmail: true,
      notificationRegistrationEmail: true, notificationInsuranceEmail: true,
      notificationMaintenanceEmail: true, notificationDealerPromoEmail: true,
      createdAt: true, updatedAt: true,
    }}),
    prisma.ownerShortlistItem.findMany({ where: { ownerId: session.ownerId }, orderBy: { position: "asc" }, select: { modelId: true, position: true, createdAt: true, updatedAt: true } }),
    prisma.garageSnapshot.findUnique({ where: { ownerId: session.ownerId }, select: { payload: true, revision: true, createdAt: true, updatedAt: true } }),
    prisma.priceAlertSubscription.findMany({ where: { ownerId: session.ownerId }, select: {
      entityType: true, entityId: true, targetPricePhp: true, status: true, confirmedAt: true,
      lastObservedPricePhp: true, lastAlertedPricePhp: true, lastSentAt: true, createdAt: true, updatedAt: true,
    }}),
    prisma.dealerLead.findMany({
      where: { ownerId: session.ownerId },
      select: {
        modelExternalId: true, make: true, model: true, variant: true, cityProvince: true, purchaseType: true,
        downPaymentBudget: true, fullName: true, mobile: true, email: true, consentedAt: true, status: true,
        sourcePath: true, createdAt: true, updatedAt: true,
        deliveries: { select: {
          sellerSlug: true, sellerName: true, status: true, sharedAt: true, openedAt: true, expiresAt: true, createdAt: true, updatedAt: true,
          quoteResponse: { select: {
            cashPricePhp: true, downPaymentPhp: true, monthlyPhp: true, termMonths: true, availability: true,
            validUntil: true, dealerNote: true, buyerDecision: true, buyerDecisionAt: true, submittedAt: true, updatedAt: true,
          }},
        }},
      },
    }),
    prisma.usedListing.findMany({ where: { ownerId: session.ownerId }, include: { inquiries: true } }),
    prisma.ownerReview.findMany({
      where: { ownerId: session.ownerId },
      select: {
        id: true, modelExternalId: true, garageMotorcycleLocalId: true, variantLabel: true, modelYear: true,
        ownershipMonths: true, odometerKm: true, comfortRating: true, cityTrafficRating: true,
        maintenanceRating: true, passengerRating: true, highwayRating: true, fuelEconomyKmpl: true,
        annualMaintenancePhp: true, unscheduledRepairsCount: true, summary: true, likes: true, dislikes: true,
        status: true, garageVerifiedAt: true, consentedAt: true, submittedAt: true, reviewedAt: true,
        publishedAt: true, moderatorNote: true,
        intelligenceConsentedAt: true, intelligenceMonthlyRunningCostPhp: true,
        intelligenceAnnualMaintenancePhp: true, intelligenceFuelEconomyKmpl: true,
        intelligenceTireLifeKm: true, intelligenceMaintenanceEventsPer10kKm: true,
        intelligenceRepairsPer10kKm: true, intelligenceTrackedDistanceKm: true,
        intelligenceRecordCount: true, intelligenceEventCounts: true,
        createdAt: true, updatedAt: true,
      },
    }).catch(() => []),
  ]);
  const body = JSON.stringify({ exportedAt: new Date().toISOString(), account: owner, shortlist, garage, priceAlerts, dealerLeads, usedListings, ownerReviews }, null, 2);
  return new NextResponse(body, { headers: {
    ...headers,
    "Content-Type": "application/json; charset=utf-8",
    "Content-Disposition": `attachment; filename="motoindex-account-export-${new Date().toISOString().slice(0,10)}.json"`,
  }});
}

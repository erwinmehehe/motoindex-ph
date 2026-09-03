import { prisma, databaseConfigured } from "./db";
import { motorcycles } from "./data";
import { helmetProducts, tireProducts, topBoxProducts } from "./catalog";
import { validateImportRow } from "./ingestion";
import { commerceFreshDays, commerceFreshnessWindow } from "./commercePolicy";
import type { OfferEntityType, SellerOffer, SellerType } from "./types";

export type StageInput = {
  sourceLabel: string;
  sourceUrl?: string;
  notes?: string;
  rows: Record<string, unknown>[];
};

export function matchEntity(type: OfferEntityType, id: string) {
  if (type === "motorcycle") {
    const item = motorcycles.find((x) => x.id === id);
    return item ? `${item.make} ${item.model}` : null;
  }
  if (type === "helmet") {
    const item = helmetProducts.find((x) => x.id === id);
    return item ? `${item.brand} ${item.model}` : null;
  }
  if (type === "tire") {
    const item = tireProducts.find((x) => x.id === id);
    return item ? `${item.brand} ${item.model}` : null;
  }
  const item = topBoxProducts.find((x) => x.id === id);
  return item ? `${item.brand} ${item.model}` : null;
}

export async function stageOfferBatch(input: StageInput) {
  if (!databaseConfigured()) throw new Error("DATABASE_URL is required for persistent ingestion.");
  const sourceLabel = input.sourceLabel?.trim();
  if (!sourceLabel) throw new Error("sourceLabel is required.");
  if (!Array.isArray(input.rows) || !input.rows.length) throw new Error("At least one row is required.");
  if (input.rows.length > 500) throw new Error("Maximum 500 rows per batch.");

  const checked = input.rows.map((row, index) => validateImportRow(row, index));
  const sellerSlugs = [...new Set(checked.map((x) => x.row.sellerSlug).filter(Boolean))];
  const sellers = await prisma.seller.findMany({
    where: { slug: { in: sellerSlugs } },
    select: { id: true, slug: true }
  });
  const sellerMap = new Map(sellers.map((seller) => [seller.slug, seller.id]));
  const existingOffers = sellers.length ? await prisma.sellerOffer.findMany({
    where: { sellerId: { in: sellers.map((seller) => seller.id) } },
    select: { sellerId: true, entityType: true, entityId: true, observedAt: true, pricePhp: true }
  }) : [];
  const existingKeys = new Set(existingOffers.map((offer) =>
    `${offer.sellerId}|${offer.entityType}|${offer.entityId}|${offer.observedAt.toISOString().slice(0, 10)}|${offer.pricePhp ? Number(offer.pricePhp) : ""}`
  ));
  const batchKeys = new Set<string>();

  const stagedRows = checked.map((result, index) => {
    const entityLabel = result.ok ? matchEntity(result.row.entityType, result.row.entityId) : null;
    const issues = [...result.issues];
    const sellerId = sellerMap.get(result.row.sellerSlug) || null;
    if (result.ok && !entityLabel) issues.push("entityId not found in MotoIndex catalog");
    if (result.row.sellerSlug && !sellerId) issues.push("sellerSlug not found in Seller table");
    const duplicateKey = `${sellerId || result.row.sellerSlug}|${result.row.entityType}|${result.row.entityId}|${result.row.observedAt}|${result.row.pricePhp ?? ""}`;
    if (batchKeys.has(duplicateKey)) issues.push("duplicate row in this batch");
    batchKeys.add(duplicateKey);
    if (sellerId && existingKeys.has(duplicateKey)) issues.push("same seller/entity/date/price already published");
    return {
      rowNumber: index + 2,
      sellerSlug: result.row.sellerSlug,
      matchedSellerId: sellerId,
      entityType: result.row.entityType,
      entityId: result.row.entityId,
      matchedEntityLabel: entityLabel,
      pricePhp: result.row.pricePhp,
      downPaymentPhp: result.row.downpaymentPhp,
      monthlyPhp: result.row.monthlyPhp,
      termMonths: result.row.termMonths,
      availability: result.row.availability,
      observedAt: new Date(`${result.row.observedAt}T00:00:00Z`),
      sourceUrl: result.row.sourceUrl || null,
      affiliateUrl: result.row.affiliateUrl || null,
      status: issues.length ? "needs_review" : "staged",
      issues
    };
  });

  return prisma.offerImportBatch.create({
    data: {
      sourceLabel,
      sourceUrl: input.sourceUrl?.trim() || null,
      notes: input.notes?.trim() || null,
      rowCount: stagedRows.length,
      errorCount: stagedRows.filter((row) => row.issues.length).length,
      rows: { create: stagedRows }
    },
    include: { rows: { orderBy: { rowNumber: "asc" } } }
  });
}

export async function listImportBatches() {
  if (!databaseConfigured()) return [];
  return prisma.offerImportBatch.findMany({
    orderBy: { importedAt: "desc" },
    take: 30,
    include: { rows: { orderBy: { rowNumber: "asc" } } }
  });
}

export async function reviewImportRow(
  batchId: string,
  rowId: string,
  status: "approved" | "rejected",
  note?: string
) {
  if (!databaseConfigured()) throw new Error("DATABASE_URL is required.");
  const row = await prisma.offerImportRow.findFirst({ where: { id: rowId, batchId } });
  if (!row) throw new Error("Row not found.");
  if (status === "approved" && (row.issues.length || !row.matchedSellerId || !row.matchedEntityLabel)) {
    throw new Error("Resolve row issues before approval.");
  }

  await prisma.offerImportRow.update({
    where: { id: rowId },
    data: { status, reviewNote: note?.trim() || null, reviewedAt: new Date() }
  });
  const counts = await prisma.offerImportRow.groupBy({
    by: ["status"],
    where: { batchId },
    _count: { _all: true }
  });
  const count = (value: string) => counts.find((x) => x.status === value)?._count._all || 0;
  return prisma.offerImportBatch.update({
    where: { id: batchId },
    data: {
      status: "review",
      approvedCount: count("approved"),
      rejectedCount: count("rejected"),
      reviewedAt: new Date()
    }
  });
}

export async function publishApprovedBatch(batchId: string) {
  if (!databaseConfigured()) throw new Error("DATABASE_URL is required.");
  const batch = await prisma.offerImportBatch.findUnique({
    where: { id: batchId },
    include: { rows: { where: { status: "approved" } } }
  });
  if (!batch) throw new Error("Batch not found.");
  if (!batch.rows.length) throw new Error("No approved rows to publish.");

  const published = await prisma.$transaction(async (tx) => {
    let count = 0;
    for (const row of batch.rows) {
      if (!row.matchedSellerId) continue;
      const existing = await tx.sellerOffer.findFirst({
        where: {
          sellerId: row.matchedSellerId,
          entityType: row.entityType,
          entityId: row.entityId
        },
        orderBy: { updatedAt: "desc" }
      });
      const offerData = {
        sellerId: row.matchedSellerId,
        entityType: row.entityType,
        entityId: row.entityId,
        pricePhp: row.pricePhp,
        downPaymentPhp: row.downPaymentPhp,
        monthlyPhp: row.monthlyPhp,
        termMonths: row.termMonths,
        availability: row.availability,
        status: "verified",
        observedAt: row.observedAt,
        verifiedAt: new Date(),
        targetUrl: row.sourceUrl,
        affiliateUrl: row.affiliateUrl
      };
      const offer = existing
        ? await tx.sellerOffer.update({ where: { id: existing.id }, data: offerData })
        : await tx.sellerOffer.create({ data: offerData });

      if (row.pricePhp) {
        await tx.offerPriceObservation.create({
          data: {
            offerId: offer.id,
            pricePhp: row.pricePhp,
            observedAt: row.observedAt,
            status: "verified"
          }
        });
      }
      await tx.offerImportRow.update({
        where: { id: row.id },
        data: { status: "published", publishedOfferId: offer.id }
      });
      count += 1;
    }
    await tx.offerImportBatch.update({
      where: { id: batchId },
      data: { status: "published", publishedAt: new Date() }
    });
    return count;
  });
  return { published };
}

export async function expireStaleOffers(maxAgeDays = commerceFreshDays) {
  if (!databaseConfigured()) throw new Error("DATABASE_URL is required.");
  const { lower: cutoff } = commerceFreshnessWindow(new Date(), Math.max(1, maxAgeDays));
  const result = await prisma.sellerOffer.updateMany({
    where: { status: "verified", observedAt: { lt: cutoff } },
    data: { status: "expired" }
  });
  return { expired: result.count, cutoff: cutoff.toISOString() };
}

export async function getPriceHistory(entityType: OfferEntityType, entityId: string) {
  if (!databaseConfigured()) return [];
  const rows = await prisma.offerPriceObservation.findMany({
    where: { offer: { entityType, entityId, status: { in: ["verified", "expired"] } } },
    orderBy: { observedAt: "asc" },
    include: { offer: { select: { seller: { select: { name: true } }, status: true } } }
  });
  return rows.map((row) => ({
    pricePhp: Number(row.pricePhp),
    observedAt: row.observedAt.toISOString().slice(0, 10),
    sellerName: row.offer.seller.name,
    status: row.offer.status
  }));
}

export async function getVerifiedOffers(
  filters?: { entityType?: OfferEntityType; entityId?: string },
  now = new Date()
): Promise<SellerOffer[]> {
  if (!databaseConfigured()) return [];
  const { lower, upper } = commerceFreshnessWindow(now);
  const rows = await prisma.sellerOffer.findMany({
    where: {
      status: "verified",
      observedAt: { gte: lower, lte: upper },
      ...(filters?.entityType ? { entityType: filters.entityType } : {}),
      ...(filters?.entityId ? { entityId: filters.entityId } : {})
    },
    include: { seller: { select: { name: true, slug: true, type: true } } },
    orderBy: [{ observedAt: "desc" }, { pricePhp: "asc" }, { updatedAt: "desc" }],
    take: 200
  });
  return rows.map((row) => ({
    id: row.id, entityType: row.entityType as OfferEntityType, entityId: row.entityId, sellerName: row.seller.name,
    sellerSlug: row.seller.slug, sellerType: row.seller.type as SellerType, pricePhp: row.pricePhp ? Number(row.pricePhp) : undefined,
    downpaymentPhp: row.downPaymentPhp ? Number(row.downPaymentPhp) : undefined, monthlyPhp: row.monthlyPhp ? Number(row.monthlyPhp) : undefined,
    termMonths: row.termMonths || undefined, availability: row.availability, status: "verified",
    observedAt: row.observedAt.toISOString().slice(0, 10), verifiedAt: row.verifiedAt?.toISOString().slice(0, 10),
    targetUrl: row.targetUrl || undefined, affiliateUrl: row.affiliateUrl || undefined,
    note: "Verified offer published through the reviewed ingestion workflow."
  }));
}

export async function getVerifiedOfferById(id: string, now = new Date()): Promise<SellerOffer | null> {
  if (!databaseConfigured()) return null;
  const { lower, upper } = commerceFreshnessWindow(now);
  const row = await prisma.sellerOffer.findFirst({
    where: { id, status: "verified", observedAt: { gte: lower, lte: upper } },
    include: { seller: { select: { name: true, slug: true, type: true } } }
  });
  if (!row) return null;
  return {
    id: row.id, entityType: row.entityType as OfferEntityType, entityId: row.entityId, sellerName: row.seller.name,
    sellerSlug: row.seller.slug, sellerType: row.seller.type as SellerType, pricePhp: row.pricePhp ? Number(row.pricePhp) : undefined,
    downpaymentPhp: row.downPaymentPhp ? Number(row.downPaymentPhp) : undefined, monthlyPhp: row.monthlyPhp ? Number(row.monthlyPhp) : undefined,
    termMonths: row.termMonths || undefined, availability: row.availability, status: "verified" as const,
    observedAt: row.observedAt.toISOString().slice(0, 10), verifiedAt: row.verifiedAt?.toISOString().slice(0, 10),
    targetUrl: row.targetUrl || undefined, affiliateUrl: row.affiliateUrl || undefined,
    note: "Verified offer published through the reviewed ingestion workflow."
  };
}

export async function recordOutboundClick(offer: SellerOffer, sourceBacked: boolean) {
  if (!databaseConfigured()) return;
  await prisma.outboundClickEvent.create({
    data: {
      offerId: sourceBacked ? null : offer.id,
      sourceOfferId: sourceBacked ? offer.id : null,
      entityType: offer.entityType,
      entityId: offer.entityId,
      merchant: offer.sellerName
    }
  });
}

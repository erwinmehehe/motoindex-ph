-- MotoIndex PH v2.4.4 baseline schema for a fresh PostgreSQL database.
-- Generated from prisma/schema.prisma because earlier source releases had no migration history.

CREATE TYPE "FreshnessStatus" AS ENUM ('VERIFIED', 'STALE', 'REVIEW');
CREATE TYPE "SourceType" AS ENUM ('MANUFACTURER', 'DEALER', 'GOVERNMENT', 'DISTRIBUTOR', 'MARKETPLACE', 'EDITORIAL');

CREATE TABLE "Make" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "officialUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Model" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "makeId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Generation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "modelId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "yearStart" INTEGER,
  "yearEnd" INTEGER,
  "market" TEXT NOT NULL DEFAULT 'PH',
  "summary" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Variant" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "generationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" "FreshnessStatus" NOT NULL DEFAULT 'REVIEW',
  "sourceId" TEXT,
  "checkedAt" TIMESTAMP(3),
  "featureSummary" TEXT,
  "engineCc" DOUBLE PRECISION,
  "powerHp" DOUBLE PRECISION,
  "torqueNm" DOUBLE PRECISION,
  "curbWeightKg" DOUBLE PRECISION,
  "seatHeightMm" INTEGER,
  "fuelTankL" DOUBLE PRECISION,
  "abs" TEXT,
  "colors" TEXT[] NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Source" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" "SourceType" NOT NULL,
  "publisher" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "authority" INTEGER NOT NULL DEFAULT 50,
  "lastCheckedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "PriceRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "variantId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "priceType" TEXT NOT NULL DEFAULT 'srp',
  "amountPhp" DECIMAL(12,2) NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "status" "FreshnessStatus" NOT NULL DEFAULT 'REVIEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FinanceOffer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "variantId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "downPaymentPhp" DECIMAL(12,2),
  "termMonths" INTEGER NOT NULL,
  "monthlyPhp" DECIMAL(12,2),
  "annualRatePct" DOUBLE PRECISION,
  "verifiedAt" TIMESTAMP(3),
  "status" "FreshnessStatus" NOT NULL DEFAULT 'REVIEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TireFitment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "generationId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "axle" TEXT NOT NULL,
  "widthMm" INTEGER NOT NULL,
  "aspectRatio" INTEGER NOT NULL,
  "rimDiameterIn" DOUBLE PRECISION NOT NULL,
  "stockAlternative" TEXT NOT NULL DEFAULT 'stock',
  "loadRating" TEXT,
  "speedRating" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Accessory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "brand" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "priceMinPhp" DECIMAL(12,2),
  "priceMaxPhp" DECIMAL(12,2),
  "affiliateUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AccessoryFitment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "accessoryId" TEXT NOT NULL,
  "generationId" TEXT NOT NULL,
  "sourceId" TEXT,
  "fitmentStatus" TEXT NOT NULL DEFAULT 'confirmed',
  "bracketRequired" BOOLEAN NOT NULL DEFAULT false,
  "bracketCode" TEXT,
  "plateRequirement" TEXT,
  "modelYears" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "notes" TEXT
);

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "src" TEXT NOT NULL,
  "alt" TEXT NOT NULL,
  "width" INTEGER NOT NULL,
  "height" INTEGER NOT NULL,
  "rightsStatus" TEXT NOT NULL DEFAULT 'pending',
  "rightsHolder" TEXT NOT NULL,
  "sourceId" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "MaintenanceRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "generationId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "item" TEXT NOT NULL,
  "intervalKm" INTEGER,
  "intervalMonths" INTEGER,
  "specification" TEXT,
  "marketNote" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "status" "FreshnessStatus" NOT NULL DEFAULT 'REVIEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Seller" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "city" TEXT,
  "region" TEXT,
  "website" TEXT,
  "phone" TEXT,
  "status" TEXT NOT NULL DEFAULT 'research',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "SellerOffer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sellerId" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "pricePhp" DECIMAL(12,2),
  "downPaymentPhp" DECIMAL(12,2),
  "monthlyPhp" DECIMAL(12,2),
  "termMonths" INTEGER,
  "availability" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'review',
  "observedAt" TIMESTAMP(3) NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "targetUrl" TEXT,
  "affiliateUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "OfferPriceObservation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "offerId" TEXT NOT NULL,
  "pricePhp" DECIMAL(12,2) NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OutboundClickEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "offerId" TEXT NOT NULL,
  "referrer" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PriceAlertSubscription" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "targetPricePhp" DECIMAL(12,2),
  "status" TEXT NOT NULL DEFAULT 'pending',
  "confirmToken" TEXT,
  "confirmedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "OfferImportBatch" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sourceLabel" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'staged',
  "rowCount" INTEGER NOT NULL DEFAULT 0,
  "errorCount" INTEGER NOT NULL DEFAULT 0,
  "approvedCount" INTEGER NOT NULL DEFAULT 0,
  "rejectedCount" INTEGER NOT NULL DEFAULT 0,
  "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "notes" TEXT
);

CREATE TABLE "OfferImportRow" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "batchId" TEXT NOT NULL,
  "rowNumber" INTEGER NOT NULL,
  "sellerSlug" TEXT NOT NULL,
  "matchedSellerId" TEXT,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "matchedEntityLabel" TEXT,
  "pricePhp" DECIMAL(12,2),
  "downPaymentPhp" DECIMAL(12,2),
  "monthlyPhp" DECIMAL(12,2),
  "termMonths" INTEGER,
  "availability" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3) NOT NULL,
  "sourceUrl" TEXT,
  "affiliateUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'staged',
  "issues" TEXT[] NOT NULL,
  "reviewNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "publishedOfferId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "UsedListing" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "modelExternalId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "modelYear" INTEGER NOT NULL,
  "mileageKm" INTEGER NOT NULL,
  "askingPricePhp" DECIMAL(12,2) NOT NULL,
  "condition" TEXT NOT NULL,
  "sellerType" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "sourceLabel" TEXT NOT NULL,
  "sourceUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'review',
  "postedAt" TIMESTAMP(3) NOT NULL,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

ALTER TABLE "Model" ADD CONSTRAINT "Model_makeId_fkey" FOREIGN KEY ("makeId") REFERENCES "Make" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PriceRecord" ADD CONSTRAINT "PriceRecord_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PriceRecord" ADD CONSTRAINT "PriceRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FinanceOffer" ADD CONSTRAINT "FinanceOffer_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FinanceOffer" ADD CONSTRAINT "FinanceOffer_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TireFitment" ADD CONSTRAINT "TireFitment_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TireFitment" ADD CONSTRAINT "TireFitment_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessoryFitment" ADD CONSTRAINT "AccessoryFitment_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccessoryFitment" ADD CONSTRAINT "AccessoryFitment_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccessoryFitment" ADD CONSTRAINT "AccessoryFitment_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "Generation" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SellerOffer" ADD CONSTRAINT "SellerOffer_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferPriceObservation" ADD CONSTRAINT "OfferPriceObservation_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "SellerOffer" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutboundClickEvent" ADD CONSTRAINT "OutboundClickEvent_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "SellerOffer" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferImportRow" ADD CONSTRAINT "OfferImportRow_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "OfferImportBatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OfferImportRow" ADD CONSTRAINT "OfferImportRow_matchedSellerId_fkey" FOREIGN KEY ("matchedSellerId") REFERENCES "Seller" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OfferImportRow" ADD CONSTRAINT "OfferImportRow_publishedOfferId_fkey" FOREIGN KEY ("publishedOfferId") REFERENCES "SellerOffer" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "Make_name_key" ON "Make"("name");
CREATE UNIQUE INDEX "Make_slug_key" ON "Make"("slug");
CREATE UNIQUE INDEX "Model_makeId_slug_key" ON "Model"("makeId", "slug");
CREATE UNIQUE INDEX "Variant_generationId_slug_key" ON "Variant"("generationId", "slug");
CREATE INDEX "Variant_sourceId_idx" ON "Variant"("sourceId");
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");
CREATE INDEX "PriceRecord_variantId_observedAt_idx" ON "PriceRecord"("variantId", "observedAt");
CREATE INDEX "TireFitment_generationId_axle_idx" ON "TireFitment"("generationId", "axle");
CREATE UNIQUE INDEX "Accessory_slug_key" ON "Accessory"("slug");
CREATE UNIQUE INDEX "AccessoryFitment_accessoryId_generationId_key" ON "AccessoryFitment"("accessoryId", "generationId");
CREATE INDEX "AccessoryFitment_sourceId_idx" ON "AccessoryFitment"("sourceId");
CREATE INDEX "MediaAsset_entityType_entityId_rightsStatus_idx" ON "MediaAsset"("entityType", "entityId", "rightsStatus");
CREATE INDEX "MaintenanceRecord_generationId_item_idx" ON "MaintenanceRecord"("generationId", "item");
CREATE UNIQUE INDEX "Seller_slug_key" ON "Seller"("slug");
CREATE INDEX "SellerOffer_entityType_entityId_idx" ON "SellerOffer"("entityType", "entityId");
CREATE INDEX "SellerOffer_sellerId_status_idx" ON "SellerOffer"("sellerId", "status");
CREATE INDEX "OfferPriceObservation_offerId_observedAt_idx" ON "OfferPriceObservation"("offerId", "observedAt");
CREATE INDEX "OutboundClickEvent_offerId_createdAt_idx" ON "OutboundClickEvent"("offerId", "createdAt");
CREATE UNIQUE INDEX "PriceAlertSubscription_confirmToken_key" ON "PriceAlertSubscription"("confirmToken");
CREATE INDEX "PriceAlertSubscription_entityType_entityId_status_idx" ON "PriceAlertSubscription"("entityType", "entityId", "status");
CREATE INDEX "OfferImportBatch_status_importedAt_idx" ON "OfferImportBatch"("status", "importedAt");
CREATE UNIQUE INDEX "OfferImportRow_batchId_rowNumber_key" ON "OfferImportRow"("batchId", "rowNumber");
CREATE INDEX "OfferImportRow_batchId_status_idx" ON "OfferImportRow"("batchId", "status");
CREATE INDEX "OfferImportRow_entityType_entityId_observedAt_idx" ON "OfferImportRow"("entityType", "entityId", "observedAt");
CREATE INDEX "OfferImportRow_matchedSellerId_idx" ON "OfferImportRow"("matchedSellerId");
CREATE INDEX "UsedListing_modelExternalId_status_postedAt_idx" ON "UsedListing"("modelExternalId", "status", "postedAt");

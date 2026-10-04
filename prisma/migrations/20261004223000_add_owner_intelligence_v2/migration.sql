ALTER TABLE "OwnerReview"
ADD COLUMN "intelligenceConsentedAt" TIMESTAMP(3),
ADD COLUMN "intelligenceMonthlyRunningCostPhp" DECIMAL(12,2),
ADD COLUMN "intelligenceAnnualMaintenancePhp" DECIMAL(12,2),
ADD COLUMN "intelligenceFuelEconomyKmpl" DOUBLE PRECISION,
ADD COLUMN "intelligenceTireLifeKm" INTEGER,
ADD COLUMN "intelligenceMaintenanceEventsPer10kKm" DOUBLE PRECISION,
ADD COLUMN "intelligenceRepairsPer10kKm" DOUBLE PRECISION,
ADD COLUMN "intelligenceTrackedDistanceKm" INTEGER,
ADD COLUMN "intelligenceRecordCount" INTEGER,
ADD COLUMN "intelligenceEventCounts" JSONB;

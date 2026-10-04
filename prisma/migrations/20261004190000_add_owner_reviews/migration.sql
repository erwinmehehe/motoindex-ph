CREATE TABLE "OwnerReview" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "modelExternalId" TEXT NOT NULL,
    "garageMotorcycleLocalId" TEXT NOT NULL,
    "variantLabel" TEXT,
    "modelYear" INTEGER,
    "ownershipMonths" INTEGER NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "comfortRating" INTEGER NOT NULL,
    "cityTrafficRating" INTEGER NOT NULL,
    "maintenanceRating" INTEGER NOT NULL,
    "passengerRating" INTEGER,
    "highwayRating" INTEGER,
    "fuelEconomyKmpl" DOUBLE PRECISION,
    "annualMaintenancePhp" DECIMAL(12,2),
    "unscheduledRepairsCount" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT NOT NULL,
    "likes" TEXT NOT NULL,
    "dislikes" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "garageVerifiedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "moderatorNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OwnerReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OwnerReview_ownerId_garageMotorcycleLocalId_key"
ON "OwnerReview"("ownerId", "garageMotorcycleLocalId");

CREATE INDEX "OwnerReview_modelExternalId_status_publishedAt_idx"
ON "OwnerReview"("modelExternalId", "status", "publishedAt");

CREATE INDEX "OwnerReview_ownerId_status_updatedAt_idx"
ON "OwnerReview"("ownerId", "status", "updatedAt");

ALTER TABLE "OwnerReview"
ADD CONSTRAINT "OwnerReview_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

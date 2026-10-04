-- My MotoIndex v1: unified owner account, shortlist, commerce links and notification preferences.

ALTER TABLE "PriceAlertSubscription" ADD COLUMN "ownerId" TEXT;
ALTER TABLE "DealerLead" ADD COLUMN "ownerId" TEXT;
ALTER TABLE "DealerQuoteResponse" ADD COLUMN "ownerNotifiedAt" TIMESTAMP(3);
ALTER TABLE "DealerQuoteResponse" ADD COLUMN "expiryNotifiedAt" TIMESTAMP(3);

ALTER TABLE "OwnerAccount" ADD COLUMN "notificationPriceDropEmail" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "OwnerAccount" ADD COLUMN "notificationQuoteEmail" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "OwnerAccount" ADD COLUMN "notificationRegistrationEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OwnerAccount" ADD COLUMN "notificationInsuranceEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OwnerAccount" ADD COLUMN "notificationMaintenanceEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OwnerAccount" ADD COLUMN "notificationDealerPromoEmail" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OwnerAccount" ADD COLUMN "lastDealerPromoEmailAt" TIMESTAMP(3);

-- Preserve existing Garage reminder opt-ins when splitting the legacy master toggle.
UPDATE "OwnerAccount"
SET
  "notificationRegistrationEmail" = "reminderEmailsEnabled",
  "notificationInsuranceEmail" = "reminderEmailsEnabled",
  "notificationMaintenanceEmail" = "reminderEmailsEnabled";

CREATE TABLE "OwnerShortlistItem" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "modelId" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OwnerShortlistItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OwnerShortlistItem_ownerId_modelId_key" ON "OwnerShortlistItem"("ownerId", "modelId");
CREATE INDEX "OwnerShortlistItem_ownerId_position_idx" ON "OwnerShortlistItem"("ownerId", "position");
CREATE INDEX "PriceAlertSubscription_ownerId_status_updatedAt_idx" ON "PriceAlertSubscription"("ownerId", "status", "updatedAt");
CREATE INDEX "DealerLead_ownerId_status_createdAt_idx" ON "DealerLead"("ownerId", "status", "createdAt");

ALTER TABLE "OwnerShortlistItem"
  ADD CONSTRAINT "OwnerShortlistItem_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PriceAlertSubscription"
  ADD CONSTRAINT "PriceAlertSubscription_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DealerLead"
  ADD CONSTRAINT "DealerLead_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DELETE FROM "PriceAlertSubscription" WHERE "targetPricePhp" IS NULL;

ALTER TABLE "PriceAlertSubscription"
ALTER COLUMN "targetPricePhp" SET NOT NULL,
ADD COLUMN "unsubscribeToken" TEXT,
ADD COLUMN "lastCheckedAt" TIMESTAMP(3),
ADD COLUMN "lastObservedPricePhp" DECIMAL(12,2),
ADD COLUMN "lastAlertedPricePhp" DECIMAL(12,2),
ADD COLUMN "thresholdWasMet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "lastSentAt" TIMESTAMP(3);

UPDATE "PriceAlertSubscription"
SET "unsubscribeToken" = md5(random()::text || clock_timestamp()::text || "id")
WHERE "unsubscribeToken" IS NULL;

ALTER TABLE "PriceAlertSubscription"
ALTER COLUMN "unsubscribeToken" SET NOT NULL;

CREATE UNIQUE INDEX "PriceAlertSubscription_unsubscribeToken_key" ON "PriceAlertSubscription"("unsubscribeToken");
CREATE INDEX "PriceAlertSubscription_status_updatedAt_idx" ON "PriceAlertSubscription"("status","updatedAt");

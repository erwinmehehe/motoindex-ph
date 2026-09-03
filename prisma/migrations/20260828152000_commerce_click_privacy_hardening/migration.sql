-- v2.9.1 commerce analytics hardening:
-- allow source-backed static offers to be counted without fabricating SellerOffer rows,
-- and stop retaining referrer/user-agent metadata for commerce click events.
ALTER TABLE "OutboundClickEvent" ALTER COLUMN "offerId" DROP NOT NULL;
ALTER TABLE "OutboundClickEvent" ADD COLUMN "sourceOfferId" TEXT;
ALTER TABLE "OutboundClickEvent" ADD COLUMN "entityType" TEXT;
ALTER TABLE "OutboundClickEvent" ADD COLUMN "entityId" TEXT;
ALTER TABLE "OutboundClickEvent" ADD COLUMN "merchant" TEXT;
ALTER TABLE "OutboundClickEvent" DROP COLUMN "referrer";
ALTER TABLE "OutboundClickEvent" DROP COLUMN "userAgent";

CREATE INDEX "OutboundClickEvent_sourceOfferId_createdAt_idx" ON "OutboundClickEvent"("sourceOfferId", "createdAt");

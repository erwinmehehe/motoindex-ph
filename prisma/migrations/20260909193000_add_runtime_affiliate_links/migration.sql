CREATE TABLE "AffiliateProductLink" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "merchant" TEXT NOT NULL DEFAULT 'shopee',
    "network" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "reviewNote" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AffiliateProductLink_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AffiliateProductLink_productId_key" ON "AffiliateProductLink"("productId");
CREATE INDEX "AffiliateProductLink_status_updatedAt_idx" ON "AffiliateProductLink"("status","updatedAt");

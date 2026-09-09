ALTER TABLE "Seller"
ADD COLUMN "leadContactName" TEXT,
ADD COLUMN "leadEmail" TEXT,
ADD COLUMN "leadMobile" TEXT;

CREATE TABLE "DealerLeadDelivery" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "sellerSlug" TEXT NOT NULL,
    "sellerName" TEXT NOT NULL,
    "dealerEmail" TEXT NOT NULL,
    "deliveryToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sharedAt" TIMESTAMP(3),
    "openedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerLeadDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DealerLeadDelivery_deliveryToken_key" ON "DealerLeadDelivery"("deliveryToken");
CREATE UNIQUE INDEX "DealerLeadDelivery_leadId_sellerSlug_key" ON "DealerLeadDelivery"("leadId","sellerSlug");
CREATE INDEX "DealerLeadDelivery_sellerSlug_status_createdAt_idx" ON "DealerLeadDelivery"("sellerSlug","status","createdAt");
CREATE INDEX "DealerLeadDelivery_leadId_status_idx" ON "DealerLeadDelivery"("leadId","status");
ALTER TABLE "DealerLeadDelivery" ADD CONSTRAINT "DealerLeadDelivery_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "DealerLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DealerLead"
ADD COLUMN "buyerAccessToken" TEXT,
ADD COLUMN "buyerAccessExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "DealerLead_buyerAccessToken_key" ON "DealerLead"("buyerAccessToken");

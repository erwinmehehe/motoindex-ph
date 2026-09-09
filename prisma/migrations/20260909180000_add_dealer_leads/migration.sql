CREATE TABLE "DealerLead" (
    "id" TEXT NOT NULL,
    "modelExternalId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "variant" TEXT,
    "cityProvince" TEXT NOT NULL,
    "purchaseType" TEXT NOT NULL,
    "downPaymentBudget" INTEGER,
    "fullName" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "matchedSellerSlugs" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'new',
    "sourcePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerLead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DealerLead_modelExternalId_status_createdAt_idx" ON "DealerLead"("modelExternalId", "status", "createdAt");
CREATE INDEX "DealerLead_cityProvince_status_createdAt_idx" ON "DealerLead"("cityProvince", "status", "createdAt");

ALTER TABLE "Seller"
ADD COLUMN "province" TEXT,
ADD COLUMN "addressLabel" TEXT,
ADD COLUMN "brands" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "categories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "description" TEXT,
ADD COLUMN "sourceLabel" TEXT,
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "lastChecked" TIMESTAMP(3),
ADD COLUMN "verificationNote" TEXT;

CREATE TABLE "DealerApplication" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "branchName" TEXT,
    "addressLabel" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "region" TEXT,
    "brands" TEXT[],
    "website" TEXT,
    "phone" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactMobile" TEXT NOT NULL,
    "officialSourceUrl" TEXT,
    "notes" TEXT,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedSellerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DealerApplication_status_createdAt_idx" ON "DealerApplication"("status", "createdAt");
CREATE INDEX "DealerApplication_contactEmail_createdAt_idx" ON "DealerApplication"("contactEmail", "createdAt");

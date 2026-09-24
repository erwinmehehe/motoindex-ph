ALTER TABLE "UsedListing"
ADD COLUMN "ownerId" TEXT,
ADD COLUMN "garageMotorcycleLocalId" TEXT;

CREATE INDEX "UsedListing_ownerId_status_postedAt_idx"
ON "UsedListing"("ownerId", "status", "postedAt");

CREATE INDEX "UsedListing_ownerId_garageMotorcycleLocalId_idx"
ON "UsedListing"("ownerId", "garageMotorcycleLocalId");

ALTER TABLE "UsedListing"
ADD CONSTRAINT "UsedListing_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "UsedListingInquiry" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerName" TEXT NOT NULL,
    "buyerEmail" TEXT NOT NULL,
    "buyerMobile" TEXT,
    "message" TEXT NOT NULL,
    "consentedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UsedListingInquiry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "UsedListingInquiry_listingId_status_createdAt_idx"
ON "UsedListingInquiry"("listingId", "status", "createdAt");

CREATE INDEX "UsedListingInquiry_buyerEmail_createdAt_idx"
ON "UsedListingInquiry"("buyerEmail", "createdAt");

ALTER TABLE "UsedListingInquiry"
ADD CONSTRAINT "UsedListingInquiry_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "UsedListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SellerOffer"
ADD COLUMN "publicationSource" TEXT NOT NULL DEFAULT 'reviewed_ingestion',
ADD COLUMN "dealerPublishedAt" TIMESTAMP(3);

CREATE TABLE "DealerAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DealerMembership" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'manager',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DealerMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DealerMagicLink" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DealerMagicLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DealerSession" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DealerSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DealerAccount_email_key" ON "DealerAccount"("email");
CREATE UNIQUE INDEX "DealerMembership_accountId_sellerId_key" ON "DealerMembership"("accountId", "sellerId");
CREATE INDEX "DealerMembership_sellerId_idx" ON "DealerMembership"("sellerId");
CREATE UNIQUE INDEX "DealerMagicLink_tokenHash_key" ON "DealerMagicLink"("tokenHash");
CREATE INDEX "DealerMagicLink_accountId_createdAt_idx" ON "DealerMagicLink"("accountId", "createdAt");
CREATE INDEX "DealerMagicLink_expiresAt_idx" ON "DealerMagicLink"("expiresAt");
CREATE UNIQUE INDEX "DealerSession_tokenHash_key" ON "DealerSession"("tokenHash");
CREATE INDEX "DealerSession_accountId_expiresAt_idx" ON "DealerSession"("accountId", "expiresAt");
CREATE INDEX "DealerSession_expiresAt_idx" ON "DealerSession"("expiresAt");

ALTER TABLE "DealerMembership"
ADD CONSTRAINT "DealerMembership_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "DealerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DealerMembership"
ADD CONSTRAINT "DealerMembership_sellerId_fkey"
FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DealerMagicLink"
ADD CONSTRAINT "DealerMagicLink_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "DealerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DealerSession"
ADD CONSTRAINT "DealerSession_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "DealerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

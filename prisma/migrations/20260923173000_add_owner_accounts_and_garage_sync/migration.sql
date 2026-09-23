CREATE TABLE "OwnerAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OwnerAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OwnerMagicLink" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OwnerMagicLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OwnerSession" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OwnerSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GarageSnapshot" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GarageSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OwnerAccount_email_key" ON "OwnerAccount"("email");
CREATE UNIQUE INDEX "OwnerMagicLink_tokenHash_key" ON "OwnerMagicLink"("tokenHash");
CREATE INDEX "OwnerMagicLink_ownerId_createdAt_idx" ON "OwnerMagicLink"("ownerId", "createdAt");
CREATE INDEX "OwnerMagicLink_expiresAt_idx" ON "OwnerMagicLink"("expiresAt");
CREATE UNIQUE INDEX "OwnerSession_tokenHash_key" ON "OwnerSession"("tokenHash");
CREATE INDEX "OwnerSession_ownerId_expiresAt_idx" ON "OwnerSession"("ownerId", "expiresAt");
CREATE INDEX "OwnerSession_expiresAt_idx" ON "OwnerSession"("expiresAt");
CREATE UNIQUE INDEX "GarageSnapshot_ownerId_key" ON "GarageSnapshot"("ownerId");

ALTER TABLE "OwnerMagicLink"
ADD CONSTRAINT "OwnerMagicLink_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OwnerSession"
ADD CONSTRAINT "OwnerSession_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GarageSnapshot"
ADD CONSTRAINT "GarageSnapshot_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "OwnerAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

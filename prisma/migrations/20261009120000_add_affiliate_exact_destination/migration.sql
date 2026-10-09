-- Store independently checked exact-item merchant URL alongside opaque network
-- tracking links. Existing affiliate links remain present, but cannot be
-- advertised as product-specific until their target is explicitly verified.
ALTER TABLE "AffiliateProductLink" ADD COLUMN "destinationUrl" TEXT;

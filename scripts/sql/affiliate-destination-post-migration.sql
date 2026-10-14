-- Verify nullable additive schema, preservation of existing rows, and new destination storage.
DO $$
DECLARE
  nullable_flag text;
  legacy_url text;
  legacy_destination text;
BEGIN
  SELECT is_nullable INTO nullable_flag
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'AffiliateProductLink'
    AND column_name = 'destinationUrl';
  IF nullable_flag IS DISTINCT FROM 'YES' THEN
    RAISE EXCEPTION 'destinationUrl must exist and allow NULL';
  END IF;

  SELECT "url", "destinationUrl" INTO legacy_url, legacy_destination
  FROM "AffiliateProductLink" WHERE "productId" = 'ci-legacy-product';
  IF NOT FOUND OR legacy_url IS DISTINCT FROM 'https://invl.me/ci-legacy-placeholder' THEN
    RAISE EXCEPTION 'Legacy tracked URL was lost or changed';
  END IF;
  IF legacy_destination IS NOT NULL THEN
    RAISE EXCEPTION 'Migration must not invent an approved exact-item destination';
  END IF;
END
$$;

INSERT INTO "AffiliateProductLink"
  ("id", "productId", "merchant", "network", "url", "destinationUrl", "status", "updatedAt")
VALUES
  ('ci-new-row', 'ci-new-product', 'shopee', 'involve_asia',
   'https://invl.me/ci-new-placeholder', 'https://shopee.ph/product/123456/789012',
   'disabled', CURRENT_TIMESTAMP);

DO $$
BEGIN
  IF (SELECT count(*) FROM "AffiliateProductLink" WHERE "productId" IN ('ci-legacy-product', 'ci-new-product')) <> 2 THEN
    RAISE EXCEPTION 'Expected both old and new affiliate records';
  END IF;
  IF (SELECT "destinationUrl" FROM "AffiliateProductLink" WHERE "productId" = 'ci-new-product')
     IS DISTINCT FROM 'https://shopee.ph/product/123456/789012' THEN
    RAISE EXCEPTION 'Exact destination was not persisted';
  END IF;
END
$$;

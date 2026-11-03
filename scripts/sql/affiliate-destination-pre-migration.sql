-- Disposable PostgreSQL runner ONLY. This is not MotoIndex's staging or production database.
DO $$
BEGIN
  IF to_regclass('public."AffiliateProductLink"') IS NULL THEN
    RAISE EXCEPTION 'AffiliateProductLink baseline table is missing';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'AffiliateProductLink'
      AND column_name = 'destinationUrl'
  ) THEN
    RAISE EXCEPTION 'destinationUrl must not exist before the additive migration';
  END IF;
END
$$;

INSERT INTO "AffiliateProductLink"
  ("id", "productId", "merchant", "network", "url", "status", "reviewNote", "updatedAt")
VALUES
  ('ci-legacy-row', 'ci-legacy-product', 'shopee', 'involve_asia',
   'https://invl.me/ci-legacy-placeholder', 'active', 'Disposable CI fixture, not an approved link', CURRENT_TIMESTAMP);

# Shopee affiliate setup moved

MotoIndex v2.2.3 supports both direct Shopee affiliate links and Involve Asia deeplinks.

See `AFFILIATE_SETUP.md` for the current provider-neutral configuration format. The legacy `SHOPEE_AFFILIATE_LINKS_JSON` environment variable remains supported during migration.

## Important: build-time configuration

The legacy `SHOPEE_AFFILIATE_LINKS_JSON` value is consumed while statically generated product pages are built. Set it in the **build environment before `next build`**. If links change, rebuild and redeploy; a runtime-only variable or a restart will not add the CTA to pages that were built without it.

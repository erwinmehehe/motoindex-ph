# MotoIndex Cloudflare Workers migration

MotoIndex now has a Prisma-free Cloudflare Workers build path using OpenNext.

## Current status

- Next.js remains on 15.5.24.
- Prisma is removed from the Cloudflare migration runtime.
- Legacy database-backed features fail closed until they are migrated to a Workers-native backend.
- Public motorcycle, helmet, guide, comparison, catalog and SEO pages remain available.
- `npm run typecheck` passes on the migration branch.
- `npm run cf:build` passes.
- `wrangler deploy --dry-run` passes.

## First live test

Do not move the production domain yet.

Either connect the Cloudflare account through the available Cloudflare integration, or create these GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Then manually run the **Deploy MotoIndex to Cloudflare Workers** workflow. Wrangler will deploy the Worker to the account's Workers environment, where it can be tested before changing DNS.

## Production cutover checklist

1. Test homepage, motorcycle hub, model pages, helmet pages, guides, search and comparison.
2. Test redirects, headers, sitemap and robots.
3. Confirm images render correctly.
4. Confirm optional database-only features stay unavailable rather than erroring.
5. Crawl the Workers deployment and compare important URLs with production.
6. Only after the test passes, attach `motoindexph.com` to the Worker and update DNS.
7. Keep the existing Vercel project available during the initial cutover so rollback remains simple.

## Database features

Prisma was intentionally removed from the Cloudflare build. When persistence is needed, migrate the individual feature to Supabase or another Workers-native backend instead of restoring Prisma globally.


## Fresh-build trigger note

Cloudflare Workers Builds may use Node 24. MotoIndex supports Node >=22 <25; use a new branch build rather than retrying a stale deployment created before the engine range was updated.

# MotoIndex PH affiliate setup — Involve Asia

MotoIndex now uses a **pre-generate + cache** workflow for Involve Asia deeplinks. The public site never sends the API key/secret to the browser and never spends a deeplink-generation request when a visitor clicks a product.

## Build-time configuration and redeploy requirement

Product pages are statically generated, so the affiliate map is read at **build time**, not
per request. A runtime-only environment variable produces **zero** affiliate CTAs, and the
failure is silent — it looks identical to correct fail-closed behaviour.

- Set `AFFILIATE_LINKS_JSON` in the **build** environment, before `next build`.
- Changing, adding or removing a link requires a **redeploy**, not a restart.
- `npm run check:affiliate-build` warns when the map is empty at build time; set
  `REQUIRE_AFFILIATE_LINKS=true` to make that a hard build failure once you are live.

## Accepted tracking hosts

`/deeplink/generate` returns short links on **`invl.me`** (see the Involve Asia API docs
sample response). The accepted tracking hosts are therefore `invol.co`, `involve.asia` and
`invl.me`. Any other host fails closed with a 404 and renders no CTA.

## 1. Keep credentials out of the repository

Create `.env.local` (already ignored by Git) and add your **current** Involve Asia credentials:

```env
INVOLVE_ASIA_API_KEY=
INVOLVE_ASIA_API_SECRET=
INVOLVE_ASIA_API_BASE_URL=https://api.involve.asia/api
INVOLVE_ASIA_SHOPEE_PH_OFFER_ID=
INVOLVE_ASIA_SHOPEE_PH_OFFER_NAME=Shopee
INVOLVE_ASIA_SHOPEE_SEARCH_FALLBACK=true
```

Do not prefix credentials with `NEXT_PUBLIC_`. Never put real credentials in `.env.example`, source files, screenshots, issues, or commits.

The generator defaults to the `/auth` path. If Involve Asia's current docs use a different Authentication HTTP Request URL, set it explicitly:

```env
INVOLVE_ASIA_AUTH_URL=https://api.involve.asia/api/<current-auth-path>
```

## 2. Preview what MotoIndex will monetize

```bash
npm run affiliates:preview
```

Preview mode does not call Involve Asia. It lists the verified catalog products that will receive affiliate destinations, plus already-cached mappings.

MotoIndex intentionally does not turn editorial/manufacturer `sourceUrl` values into shopping links. Instead, destination priority is: (1) your explicit override, (2) a verified Shopee `priceSourceUrl`, then (3) a Shopee search for the exact `Brand Model`. The search fallback is enabled by default so the full verified gear catalog can be monetized without inventing seller/product URLs. Set `INVOLVE_ASIA_SHOPEE_SEARCH_FALLBACK=false` if you want direct/explicit destinations only.

## 3. Add destination overrides when needed

For a catalog product whose checked price source is an official/retailer page but you have a preferred Shopee listing, add an override in `.env.local`:

```env
AFFILIATE_DESTINATIONS_JSON={"your-product-id":"https://shopee.ph/your-approved-destination"}
```

Object form is also accepted when a product needs a specific Involve Asia offer ID:

```env
AFFILIATE_DESTINATIONS_JSON={"your-product-id":{"url":"https://shopee.ph/your-approved-destination","offerId":12345}}
```

## 4. Generate missing Involve Asia deeplinks

```bash
npm run affiliates:generate
```

The generator:

- authenticates server-side with the API Key + Secret;
- uses `INVOLVE_ASIA_SHOPEE_PH_OFFER_ID` when supplied, otherwise searches `/offers/all` and refuses ambiguous offer matches;
- sends the chosen direct or Shopee-search destination to `/deeplink/generate`;
- tags links with MotoIndex product/category/brand sub-IDs;
- saves successful mappings in `data/affiliate-links.generated.json`;
- skips existing cached links unless `--force` is used;
- spaces generation calls to avoid bursting the API;
- preserves successful/existing mappings when one product fails.

Useful targeted commands:

```bash
node scripts/generate-involve-affiliates.mjs --product=zebra-atlas-2026
node scripts/generate-involve-affiliates.mjs --limit=5
node scripts/generate-involve-affiliates.mjs --offer-id=12345 --product=zebra-atlas-2026
```

Use `--force` sparingly. Involve Asia limits unique deeplink generation, so cached links should normally be reused rather than regenerated.

## 5. Build and deploy

`lib/affiliate.ts` merges mappings in this order:

1. `data/affiliate-links.generated.json` — generated baseline;
2. legacy `SHOPEE_AFFILIATE_LINKS_JSON` — optional migration override;
3. `AFFILIATE_LINKS_JSON` — highest-priority deploy-time override.

Then run:

```bash
npm run check:affiliate-build
npm run build
```

The existing `/go/affiliate/[productId]` route remains the public redirect surface, so raw affiliate destinations do not need to be scattered throughout components.

The customer-facing commerce CTA remains **Check price on Shopee** and routes through that redirect surface only when a validated affiliate mapping exists.

## Safety and maintenance

- The API Key and Secret are credentials; generated deeplink URLs are not credentials.
- Rotate any credential that has been pasted into chat, a ticket, a commit, or other shared text before using it in production.
- If `/deeplink/generate` returns a generic HTTP 500, confirm both the `offer_id` and that the destination host is whitelisted for the selected offer.
- If Shopee listings change, update `AFFILIATE_DESTINATIONS_JSON`, regenerate only the affected product, and redeploy.

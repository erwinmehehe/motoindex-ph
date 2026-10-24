# Automated Philippines DOE fuel-price adjustments

**Canonical page:** `/gas-price-philippines` (served by Next.js / OpenNext on Cloudflare)

**Official DOE source:** https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/price-adjustments

## What the figures mean

The DOE **Prior Notice on Price Adjustments** PDFs list Philippine peso **changes per liter** by oil company, for gasoline, diesel, and sometimes kerosene. They do **not** provide the current absolute selling price for each gas station. Do not describe the figures as a nationwide retail pump price. Blank product cells mean **not reported**, not zero.

The site links to the DOE's separate NCR, Luzon, Visayas and Mindanao actual pump-price reports.

## How automatic updates work

- Source importer: `scripts/update_doe_fuel_prices.py`
- Schedule: `.github/workflows/doe-fuel-prices.yml` (09:17 and 18:17 Philippine time, Monday–Friday; best-effort GitHub Actions cron).
- The script fetches the official DOE page, discovers linked PDFs, reads the tables using `pdfplumber`, and validates effective weeks and reported values.
- It stores up to eight weeks in `data/fuel-price-adjustments.json` on the **fuel-data** GitHub branch. Only a changed, validated dataset is committed; otherwise nothing is pushed.
- The production route fetches the public `fuel-data` JSON at runtime with a one-hour revalidation hint. The website does **not** need a new Cloudflare deployment for the next dataset.
- The route has a manually verified seed, `data/fuel-price-adjustments.seed.json`, if the remote feed is unavailable. A clear fallback warning is displayed. Reports older than two weeks also show a freshness warning.
- No API keys or commercial scraping services are needed.

**Important:** The `fuel-data` branch must exist and be writable by the workflow's `GITHUB_TOKEN`. It is intentionally separate from protected `main`, which requires review. Never disable main-branch protection to make data updates work.

## Release steps

1. Review and merge the page feature PR through the existing protected-main process.
2. Manually deploy the approved main branch using the existing **Deploy MotoIndex Production to Cloudflare** workflow and applicable release gates. This is required **once** for the new route.
3. In **Actions → Sync DOE Philippine Fuel Price Adjustments**, run **Run workflow** once from `main` to backfill earlier weeks. Check that its `fuel-data` commit succeeded.
4. Check `https://motoindexph.com/gas-price-philippines` on desktop/mobile and open the official PDF attached to the most recent row.

Subsequent weekly updates do **not** require another manual production deployment, assuming the site can reach the public GitHub raw feed and scheduled jobs continue running.

## Operations and recovery

- **Data didn't update:** Check the **Sync DOE Philippine Fuel Price Adjustments** GitHub Actions run log; cron can be delayed. Run the workflow manually.
- **Source layout changed:** The importer fails safely and keeps the previous verified feed, rather than guessing. Update its PDF parsing logic and fixtures.
- **No new PDF:** The importer leaves the data unchanged; a new period is not invented.
- **Private or deleted fuel-data branch:** Restore public read access and an authorized write path, or change the feed URL to a supported public endpoint.
- **Feed unavailable:** The page shows the last source-checked bundled figures and a conspicuous warning. New periods are not inferred.
- **DOE publishes a per-company difference:** Cards show a numeric **range**, not a fabricated single national adjustment.
- **Python regression tests:** `python -m unittest discover -s tests -p test_doe_fuel_prices.py -v`
- **TypeScript regression tests:** `npm run test:unit -- tests/fuelPriceFeed.test.ts`

Source attribution: Philippines Department of Energy. Independent MotoIndex PH display, not operated by or affiliated with the DOE.

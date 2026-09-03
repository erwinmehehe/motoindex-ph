# MotoIndex PH v2.0 variant and price-intelligence sources

Checked: 2026-08-25

This release adds a deliberately narrow verified-variant layer. MotoIndex does **not** infer trims from every model-level price range. A price range can reflect variants, dealer differences, promotions or stale source data, so unmapped ranges are sent to the admin research queue instead of becoming invented variant pages.

## Yamaha Aerox V3

- Verified trim names/prices in this build: Standard — ₱125,900; SP — ₱163,900.
- Current price reference: Zigwheels Philippines, `https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price`.
- Yamaha YECVT product information is used only to support the SP/YECVT feature distinction, not as a substitute for a dated Philippine price observation.

## Yamaha NMAX V3

- Verified trim names/prices in this build: Standard — ₱155,900; Tech Max — ₱175,900.
- Current price reference: Zigwheels Philippines, `https://www.zigwheels.ph/new-motorcycles/yamaha/nmax`.
- Yamaha Philippines YECVT material supports the Tech Max riding-mode/YECVT distinction.

## Honda PCX160

- Verified trim names/prices: Standard — ₱133,400; RoadSync — ₱154,900.
- Primary source: Honda Philippines, `https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160`.
- The same Honda release is stored as the initial 2025-05-18 launch-price snapshot.

## Honda ADV160

- Verified trim names/prices: ABS — ₱167,400; RoadSync — ₱174,900.
- Honda Philippines current product/release material supports the ABS/RoadSync naming, specifications and color split.
- Price source used for the dated 2026-01-19 launch snapshot: Traffic Network PH coverage marked as an official Honda Philippines release: `https://trafficnetworkph.com/ride-the-suv-pride-the-new-honda-adv160/`.
- Current dealer cross-check: Motortrade RoadSync page, `https://motortrade.com.ph/motorcycles/honda-adv160-roadsync-type/`, which also quotes Honda suggested prices while showing a separate indicative dealer amount.
- Existing Zigwheels and Wheeltek observations remain in the market-check layer even when they disagree with the newer 2026 suggested prices. MotoIndex does not average the disagreement away.

## Price-history semantics

`lib/priceIntelligence.ts` stores two kinds of snapshots:

- `launch`: a source-dated manufacturer/official-release launch reference when the underlying evidence is explicit.
- `market`: a dated aggregate envelope from MotoIndex market-check rows on the same check date.

The UI describes changes between stored snapshot lows as reference changes, **not** guaranteed market appreciation/depreciation. Different source coverage can change a range even when the underlying market has not moved.

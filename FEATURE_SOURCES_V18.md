# MotoIndex PH v1.8 — Ownership & Safety Source Ledger

Checked: **2026-08-25**

This release adds product surfaces for maintenance, safety campaigns, fuel/range planning and ownership cost. It deliberately separates **an official brand resource** from **an exact model-specific schedule or notice**.

## Honda Philippines

### Maintenance Planner
- https://www.hondaph.com/service-calculator
- Use: official Philippine maintenance-planning handoff for Honda motorcycles whose exact owner-manual table has not yet been transcribed into MotoIndex.

### Owner manuals
- https://www.hondaph.com/owner-manual
- Use: official Honda Philippines path into Honda MotoPub owner-manual material.

### Product Update Checker
- https://www.hondaph.com/product-update
- Use: official engine/frame-number product-update check. MotoIndex does not treat an empty internal notice list as proof that no campaign applies.

### PCX160 Philippines owner manual
- https://2rom-prd-data.hondamotopub.com/om/HPI/PCX160/2021/PCX160_32K1ZE000_0.pdf
- Stored exact data in v1.8:
  - engine-oil indicator: first 1,000 km; then every 6,000 km after reset
  - drive-belt replacement point shown at 24,000 km in the maintenance table
  - radiator coolant: 3 years
  - final drive oil: 2 years
  - brake fluid: 2 years
  - tire pressure: 29/33 psi solo front/rear; 29/36 psi rider + passenger front/rear
- Warning: always follow the manual/label for the exact market/model year and actual service condition.

## Yamaha Philippines

### After Sales
- https://aftersales.yamaha-motor.com.ph/
- Use: official Yamaha Philippines after-sales, owner-manual, maintenance and service-campaign handoff.
- No generic Yamaha interval table is substituted when an exact model schedule has not been parsed.

## Suzuki Philippines

### After Sales
- https://mc.suzuki.com.ph/after-sales/
- Use: official Suzuki Philippines after-sales/service information handoff.

### Service Campaign Checker
- https://mc.suzuki.com.ph/service-campaign/
- Use: official frame/chassis-number service-campaign check.
- MotoIndex does not infer “no recall” from the absence of a stored model notice.

## Kawasaki Philippines

### Service Network
- https://www.kawasakileisurebikes.ph/services/service-network/
- Use: official Kawasaki Philippines service-network handoff for model-specific maintenance support.

### Contact / campaign confirmation
- https://kawasakileisurebikes.ph/contact-us/
- Use: official contact path for VIN/frame-specific service-campaign confirmation when no public checker is stored.

## Product rules in v1.8

1. Exact maintenance intervals are published only from a parsed exact-model/market owner/service source.
2. Generic interval guesses are not used to fill missing maintenance tables.
3. An official campaign checker is not equivalent to a stored model-specific recall notice.
4. “No stored notice” never renders as “no recall.”
5. Fuel economy is labeled either **source-listed** or **planning estimate**; only source-listed fuel pages are eligible for indexing.
6. Price history remains deliberately excluded from v1.8.

### Click160 Philippines owner manual
- https://2rom-prd-data.hondamotopub.com/om/HPI/Click160/2022/Click160_32K2SF000_0.pdf
- Stored exact data in v1.8:
  - engine oil: first change at about 1,000 km; then every 6,000 km after the first reset
  - drive belt: periodic inspection; replacement point shown at 24,000 km
  - radiator coolant: 3 years
  - final drive oil: 2 years
  - brake fluid: 2 years
  - cold tire pressure: 29/33 psi front/rear, both solo and rider + passenger in this PH manual

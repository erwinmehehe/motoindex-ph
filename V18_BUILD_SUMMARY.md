# MotoIndex PH v1.8 Build Summary

Release: **v1.8 — Ownership, Fit & Research Tools**  
Build date: **2026-08-25**

## User-requested scope

Build the remaining high-value research features while explicitly **excluding price history**.

## Shipped

### 1. Model lifecycle / generation layer
- All verified motorcycles now carry an explicit lifecycle status.
- Supports current, previous, discontinued and uncertain states.
- Existing Aerox/NMAX family hubs continue to separate current and previous generations rather than mixing prices/specifications.
- Model pages show lifecycle status, generation label, successor and family links when applicable.

### 2. Total ownership cost
- Upgraded from monthly running cost to 1-year + 3-year planning.
- Cash or financed purchase.
- Down payment, APR and 12/24/36-month amortization.
- Fuel, maintenance, insurance, registration and tire reserve.
- 3-year generic resale estimate and net ownership cost.
- All values are editable planning assumptions, not dealer/insurance quotes.

### 3. Rider-fit tools
- Model-specific rider-fit route.
- Finder now considers inseam, traffic, passenger use, faster-road use and luggage in addition to seat height, curb weight, category, transmission and ABS.
- Explicitly avoids promising flat-footing or safe control from seat height alone.

### 4. Fuel economy and range
- Model-level monthly fuel-cost and full-tank range planner.
- Source-listed consumption is separated from planning estimates.
- Uses a conservative 85% planning range in addition to theoretical full-tank range.
- Fuel pages only index when a source-listed consumption value is stored.

### 5. Availability lifecycle
- Explicit `current`, `previous`, `discontinued`, `uncertain` contract.
- The 18 earlier verified/current v1.5 motorcycles were normalized from implicit-current to explicit-current status.

### 6. Structured site search
- Parses budget intent (`under 100k`, `over 150k`).
- Parses engine class (`160cc`).
- Automatic/manual, ABS/no-ABS, low-seat, light-weight, fuel-efficient and category intent.
- Search event includes result count and zero-result state when analytics is configured.

### 7. Saved shortlist
- Browser-local shortlist; no account or PII.
- Save/remove from cards, finder and model pages.
- Maximum eight saved models.
- Shareable `/shortlist?bikes=...` URLs contain model slugs only.
- Direct two- or three-bike comparison from shortlist.
- Shortlist remains noindex and out of sitemaps.

### 8. Three-way comparison
- Compare exactly three current public motorcycles.
- Price, engine, power, torque, weight, seat height, tank, fuel economy, transmission, tires and brakes.
- Quick “data leader” cards for price, power, weight, seat height and fuel tank.
- Arbitrary three-way URLs remain noindex to avoid combinatorial SEO duplication.

### 9. Similar motorcycles
- Closest overall alternatives.
- Cheaper alternatives.
- Lower-seat alternatives.
- Ranking uses observed market price, engine size, seat height, category and transmission.

### 10. Transparent model update log
- Specification-source check.
- Latest market-price-source check.
- Image-source check.
- Manual maintenance parsing event where applicable.
- Safety-campaign resource check.

### 11. Official maintenance layer
- Official Honda, Yamaha, Suzuki and Kawasaki Philippine service-resource handoffs.
- Exact maintenance tables are stored for Honda Click160 and PCX160 using Philippines owner manuals.
- Exact model maintenance pages only index when a parsed schedule exists.
- Missing schedules explicitly refuse generic interval substitution.

### 12. Recall / safety-campaign layer
- Honda Product Update Checker.
- Suzuki Service Campaign Checker.
- Yamaha Philippines after-sales/service-campaign resource.
- Kawasaki Philippines official contact/service route.
- Empty MotoIndex notice list is explicitly **not** treated as “no recall.”

### 13. Tire + accessory integration
- Tire-size pages can surface manual-backed tire pressure where stored.
- Direct links between tire fitment, maintenance and accessory fitment.
- Existing verified top-box rack evidence remains connected to model/accessory pages.

### 14. Analytics + data-health operations
- Optional GA4 (`NEXT_PUBLIC_GA_MEASUREMENT_ID`) and/or Plausible (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) integration.
- Events for search, zero-result finder states, finder model opens, shortlist save/remove/share and comparison builds. Raw search terms are not sent by default; an explicit public env flag is required to opt in.
- Protected `/admin/data-health` now shows image gaps, weak price-source coverage, fuel-economy gaps, exact maintenance coverage and safety-resource coverage.

## Intentionally not shipped

- **Price history** — explicitly excluded by user request.
- Generic/fabricated maintenance schedules.
- Claims that a motorcycle has no recall simply because MotoIndex has no stored notice.
- Account-based shortlist/profile system.
- Four-plus motorcycle comparison UI.

## SEO/indexing rules

- Shortlist and arbitrary three-way comparison are noindex.
- Fuel pages index only with a source-listed consumption figure.
- Maintenance pages index only with an exact stored schedule.
- Safety pages index only when the model is public and an official brand safety resource is connected.
- Rider-fit pages may index for verified models because the underlying published dimensions/specifications are source-gated and the tool is clearly labeled as planning guidance.

## Validation

Use:

```bash
npm run validate:v18
npm run validate:all
```

The dependency-backed Next.js typecheck/build still requires installed project dependencies and the existing launch preflight requirements.

See `FEATURE_SOURCES_V18.md` for the ownership/safety source ledger.

# v2.4.7 R5 comparison editorial hardening

This overlay extends the R4 UI/content fixes with editorial comparison pages driven by factual, current model records.

## Published comparison briefs

1. Yamaha Aerox vs Yamaha NMAX
2. Yamaha Aerox V3 vs Yamaha NMAX V3
3. Honda ADV160 vs Honda PCX160
4. Honda Click 160 vs Yamaha Aerox 155/current Aerox V3
5. Suzuki Raider R150 FI vs Yamaha Sniper 155
6. Honda Click 125i vs Yamaha Mio Gear
7. Honda Click 125i vs Suzuki Burgman Street
8. Honda ADV160 vs Yamaha NMAX
9. Honda ADV160 vs Yamaha Aerox
10. Yamaha Fazzio vs Honda Giorno+
11. Honda TMX125 Alpha vs Yamaha YTX 125

Each editorial page now uses the same sequence: direct answer, selected motorcycles with media, quick comparison, computed key differences, verified variant prices where available, detailed buyer-intent sections, factual choose-A/choose-B guidance, grouped full specifications, methodology, FAQs and source/freshness links.

## Pending briefs, not published

- Kawasaki Ninja 500 vs CFMoto 450SR
- Yamaha XMAX vs Honda Forza 350

These briefs are stored but deliberately not added to the public comparison list because the current MotoIndex dataset does not contain a source-backed Philippine-market CFMoto 450SR or Honda Forza 350 record. No specifications were invented to force those pages live.

## Editorial safeguards

- No generic overall score.
- No unsupported acceleration/top-speed claim from horsepower or power-to-weight.
- No storage, suspension, full-dimension or comfort claim when both records do not contain comparable data.
- Variant-specific ABS/traction/equipment wording remains explicit.
- Derived power-to-weight is labeled as a comparison metric only.
- Generic Aerox vs NMAX and V3-specific Aerox V3 vs NMAX V3 serve separate intent and cross-link to each other.

## Validation

- `npm run validate:all` passes.
- `node scripts/validate-comparison-briefs.mjs` passes: 11 published editorial pairs + 2 pending source-gated briefs.
- Internal-link audit passes.
- Copy-tone validation passes.
- `package-lock.json` is not included in this overlay and was not modified for this work.

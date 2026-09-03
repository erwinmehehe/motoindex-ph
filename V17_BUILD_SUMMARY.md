# MotoIndex PH v1.7 build summary

Date: 2026-08-25

## Scope
v1.7 expands MotoIndex as a **model-level research index**, not a seller/trim catalog.

### 24 current PH models added
**Honda:** Giorno+, XRM125, TMX Supremo  
**Yamaha:** PG-1, WR155R, XMAX  
**Suzuki:** Avenis, Smash FI, Raider J Crossover, Raider PRO, Gixxer 155, Gixxer SF 155, Gixxer 250, Gixxer SF250, V-Strom 250 SX, V-Strom 160, DR160, Access, Skydrive Sport, Burgman Street  
**Kawasaki:** KLX150, KLX 230, Ninja 500, Z500

The source dataset is now 49 motorcycle records, of which 42 pass the current verified/public gate. Seven older/research records remain excluded by the existing fail-closed indexation rules.

## Third live price source
Wheeltek was added alongside Zigwheels Philippines and Motortrade. Eleven dated Wheeltek observations are stored in `lib/marketChecks.ts`. Dealer observations remain distinct from manufacturer SRP and can disagree. The clearest current example is Yamaha PG-1: Wheeltek showed ₱96,400 while Motortrade showed ₱82,900 on the same check date.

## Images
Each new v1.7 model has a source-visible external image reference. The pass prefers manufacturer-hosted Suzuki/Kawasaki media; Wheeltek and Motortrade are used as authorized-dealer references for several Honda/Yamaha records and two Suzuki records. No v1.7 third-party image is marked `licensed` or copied into the repository.

## Product behavior
- No `/variants/` route family was added.
- XRM125/Smash/Sniper-style configuration spreads are represented as model-level price context, not seller-style trim pages.
- Finder, compare, category guides and model hubs automatically gain the newly verified records through `publicMotorcycles`.
- Fixed an inherited ABS matcher bug (`\bABS\b`) so ABS discovery logic works as intended.

## QA
`npm run validate:all` includes the new `validate:v17` check. It validates the 24 added IDs, verified/current source state, image provenance disclosure, third-source coverage, remote image hosts and no-variant policy.

A dependency-backed `next build` still requires registry access, a reproducible npm lockfile and the production security-patched Next.js release before launch. Source validation does not claim to replace that final build/smoke gate.

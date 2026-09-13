import type { Motorcycle } from "./types";

// September 2026 Philippine catalog expansion.
// Models are added only when a current PH model/price reference and enough specification data exist.
const verifiedAt = "2026-09-13";

export const phTier23Expansion2026: Motorcycle[] = [
  {
    id: "bajaj-pulsar-ns400z", make: "Bajaj", makeSlug: "bajaj", model: "Pulsar NS400Z", slug: "pulsar-ns400z", generation: "2026 Philippine model", category: "Naked street bike",
    srp: 199888, engineCc: 373.3, powerHp: 42.4, torqueNm: 35, curbWeightKg: 174, seatHeightMm: 807, fuelTankL: 12, groundClearanceMm: 165,
    frontTire: "110/70 ZR17", rearTire: "150/60 ZR17", abs: "Dual-channel ABS with Road, Rain, Sport and Off-road modes; traction control", colors: ["Racing Red", "Brooklyn Black", "Pearl Metallic White", "Pewter Grey"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bajaj Auto Philippines current Pulsar NS400Z specification; Philippine 2026 price cross-check", sourceUrl: "https://www.bajajauto.com/en-ph/bikes/pulsar-ns400z", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Philippine comparison site", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/bajaj/pulsar-ns400z/price", marketPriceCheckedAt: verifiedAt,
    summary: "373.3cc flagship Pulsar street bike with 43 PS-class output, 174 kg kerb weight, dual-channel ABS, traction control and a six-speed manual gearbox."
  },
  {
    id: "bajaj-pulsar-rs200", make: "Bajaj", makeSlug: "bajaj", model: "Pulsar RS200", slug: "pulsar-rs200", generation: "2026 Philippine model", category: "Sport bike",
    srp: 133888, engineCc: 199.4, powerHp: 24.2, torqueNm: 18.7, curbWeightKg: 166, seatHeightMm: 810, fuelTankL: 13, groundClearanceMm: 157,
    frontTire: "110/70-17", rearTire: "140/70-17", abs: "Dual-channel ABS with Road, Rain and Off-road braking modes on the current platform", colors: ["Racing Red", "Racing Blue", "Graphite Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bajaj Auto Philippines current Pulsar RS200 specification; Philippine 2026 price cross-check", sourceUrl: "https://www.bajajauto.com/en-ph/bikes/pulsar-rs200", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Philippine comparison site", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/bajaj/pulsar-rs200/price", marketPriceCheckedAt: verifiedAt,
    summary: "199.4cc fully faired sport motorcycle with a six-speed gearbox, 13 L tank, 810 mm seat and current dual-channel ABS platform."
  },
  {
    id: "bajaj-pulsar-n160", make: "Bajaj", makeSlug: "bajaj", model: "Pulsar N160", slug: "pulsar-n160", generation: "2026 Philippine model", category: "Naked street bike",
    srp: 115888, engineCc: 164.8, powerHp: 15.8, torqueNm: 14.7, curbWeightKg: 152, seatHeightMm: 795, fuelTankL: 14, groundClearanceMm: 165,
    frontTire: "100/80-17", rearTire: "130/70-17", abs: "Dual-channel ABS", colors: ["Brooklyn Black", "Caribbean Blue", "Racing Red", "Polar Sky Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bajaj Auto Philippines current Pulsar N160 specification; Philippine 2026 price and seat-height cross-check", sourceUrl: "https://www.bajajauto.com/en-ph/bikes/pulsar-n160", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Philippine comparison site", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/bajaj/pulsar-n160/price", marketPriceCheckedAt: verifiedAt,
    summary: "164.8cc naked commuter-sport motorcycle with dual-channel ABS, a 795 mm seat, 14 L tank and five-speed manual transmission."
  },
  {
    id: "bajaj-pulsar-n125", make: "Bajaj", makeSlug: "bajaj", model: "Pulsar N125", slug: "pulsar-n125", generation: "2026 Philippine model", category: "Naked street bike",
    srp: 79888, engineCc: 124.6, powerHp: 11.8, torqueNm: 11, curbWeightKg: 125, seatHeightMm: 795, fuelTankL: 9.5, groundClearanceMm: 198,
    frontTire: "80/100-17", rearTire: "110/80-17", abs: "No ABS; 240 mm front disc and rear drum with anti-skid braking system", colors: ["Citrus Rush", "Cocktail Wine Red", "Purple Furry"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bajaj Auto Philippines current Pulsar N125 specification; Philippine 2026 price and seat-height cross-check", sourceUrl: "https://www.bajajauto.com/en-ph/bikes/pulsar-n125", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Philippine comparison site", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/bajaj/pulsar-n125/price", marketPriceCheckedAt: verifiedAt,
    summary: "124.6cc lightweight street motorcycle with a 795 mm seat, 125 kg kerb weight, 9.5 L tank and five-speed manual gearbox."
  },
  {
    id: "kymco-dink-s-150", make: "Kymco", makeSlug: "kymco", model: "Dink S 150", slug: "dink-s-150", generation: "Current Philippine model", category: "Maxi-style scooter",
    srp: 142900, engineCc: 149.8, powerHp: 15, torqueNm: 13.2, curbWeightKg: 146, seatHeightMm: 783, fuelTankL: 7,
    frontTire: "120/70-13", rearTire: "130/70-13", abs: "Bosch dual-channel ABS; traction control listed for the Philippine model", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines current Dink S 150 product specification with Philippine market cross-check", sourceUrl: "https://kymco.com.ph/product/dink-s-150/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "Kymco Philippines", marketPriceSourceUrl: "https://kymco.com.ph/product/dink-s-150/", marketPriceCheckedAt: verifiedAt,
    summary: "149.8cc liquid-cooled urban scooter with Bosch ABS, traction control, a 783 mm seat and a 7 L fuel tank."
  },
  {
    id: "kymco-dollar-150", make: "Kymco", makeSlug: "kymco", model: "Dollar 150", slug: "dollar-150", generation: "Current Philippine model", category: "Commuter scooter",
    srp: 127800, engineCc: 150.1, powerHp: 11.3, torqueNm: 12.8, curbWeightKg: 125, seatHeightMm: 745, fuelTankL: 8,
    frontTire: "90/90-12", rearTire: "100/90-10", abs: "No ABS stated; front disc and rear drum", colors: ["Stucco Lake Green", "Pearly White", "Flat Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines current Dollar 150 product specification and launch reference", sourceUrl: "https://kymco.com.ph/product/dollar-150/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "Kymco Philippines", marketPriceSourceUrl: "https://kymco.com.ph/product/dollar-150/", marketPriceCheckedAt: verifiedAt,
    summary: "150.1cc utility-focused scooter with a low 745 mm seat, 125 kg kerb weight, 8 L tank and flexible passenger-or-cargo layout."
  }
];

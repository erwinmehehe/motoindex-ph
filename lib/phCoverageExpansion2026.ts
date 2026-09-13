import type { Motorcycle } from "./types";

const verifiedAt = "2026-09-13";

// Current Philippine models added during the September 2026 brand-coverage audit.
// Keep this list source-led: no model is added unless current local pricing and
// the core decision fields (power, torque, road-ready/kerb weight, seat, tank and tyres) are verifiable.
export const phCoverageExpansion2026: Motorcycle[] = [
  {
    id: "bmw-f-900-gs", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "F 900 GS", slug: "f-900-gs", generation: "2026 Philippine model", category: "Adventure touring",
    srp: 1135000, engineCc: 895, powerHp: 105, torqueNm: 93, curbWeightKg: 219, seatHeightMm: 870, fuelTankL: 14.5,
    frontTire: "90/90 R21", rearTire: "150/70 R17", abs: "BMW Motorrad ABS Pro with Dynamic Traction Control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad Philippines 2026 F 900 GS technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/adventure/f900gs/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "BMW Motorrad Philippines 2026 model overview", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", marketPriceCheckedAt: verifiedAt,
    summary: "895cc parallel-twin adventure motorcycle with 105 hp, 93 Nm, 21/17-inch cross-spoke wheels, a 14.5 L tank and 219 kg road-ready weight."
  },
  {
    id: "triumph-speed-twin-900", make: "Triumph", makeSlug: "triumph", model: "Speed Twin 900", slug: "speed-twin-900", generation: "Current Philippine model", category: "Modern classic",
    srp: 705000, engineCc: 900, powerHp: 64.1, torqueNm: 80, curbWeightKg: 216, seatHeightMm: 780, fuelTankL: 12,
    frontTire: "100/90-18", rearTire: "150/70 R17", abs: "Optimised cornering ABS with traction control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph Motorcycles Philippines Speed Twin 900 specification", sourceUrl: "https://www.triumphmotorcycles.ph/bikes/classic/bonneville-speed-twin-900/specification", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Triumph Motorcycles Philippines", marketPriceSourceUrl: "https://www.triumphmotorcycles.ph/bikes/classic/bonneville-speed-twin-900/models", marketPriceCheckedAt: verifiedAt,
    summary: "900cc Bonneville twin with 64.1 hp, 80 Nm, a 780 mm seat, 216 kg wet weight, 12 L tank and optimised cornering ABS."
  },
  {
    id: "triumph-tiger-sport-660", make: "Triumph", makeSlug: "triumph", model: "Tiger Sport 660", slug: "tiger-sport-660", generation: "2026 Philippine model", category: "Sport touring",
    srp: 588000, engineCc: 660, powerHp: 80, torqueNm: 64, curbWeightKg: 206, seatHeightMm: 835, fuelTankL: 17.2,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "ABS with switchable traction control and Road/Rain riding modes", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph Motorcycles Philippines Tiger Sport 660 specification and 2026 Philippine model update", sourceUrl: "https://www.triumphmotorcycles.ph/bikes/adventure/tiger-sport-660/specification", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "August 2026 Philippine launch price", marketPriceSourceUrl: "https://www.zigwheels.ph/motorcycle-news/triumph-motorcycles-ph-reveals-2026-660-lineup", marketPriceCheckedAt: verifiedAt,
    summary: "660cc inline-three sport tourer with 80 hp, 64 Nm, an 835 mm seat, 206 kg wet weight, 17.2 L tank and 17-inch road tyres."
  },
  {
    id: "benelli-tnt-135", make: "Benelli", makeSlug: "benelli", model: "TNT135", slug: "tnt-135", generation: "2026 Philippine listing", category: "Mini street bike",
    srp: 88888, engineCc: 135, powerHp: 13, torqueNm: 10.8, curbWeightKg: 121, seatHeightMm: 780, fuelTankL: 7.2, groundClearanceMm: 160,
    frontTire: "120/70 ZR12", rearTire: "130/70 ZR12", abs: "ABS listed on the current Philippine specification", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Benelli TNT135 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/tnt-135/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine 2026 price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/tnt-135", marketPriceCheckedAt: verifiedAt,
    summary: "135cc compact street bike with 13 hp, 10.8 Nm, a 780 mm seat, 121 kg kerb weight and 12-inch tyres."
  },
  {
    id: "benelli-302s", make: "Benelli", makeSlug: "benelli", model: "302S", slug: "302s", generation: "2026 Philippine listing", category: "Naked street bike",
    srp: 222800, engineCc: 300, powerHp: 38, torqueNm: 25.6, curbWeightKg: 185, seatHeightMm: 795, fuelTankL: 16, groundClearanceMm: 175,
    frontTire: "120/70 ZR17", rearTire: "160/60 ZR17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Benelli 302S price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/302-s/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine 2026 price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/302-s", marketPriceCheckedAt: verifiedAt,
    summary: "300cc parallel-twin naked motorcycle with 38 hp, 25.6 Nm, a 795 mm seat, 185 kg kerb weight, 16 L tank and ABS."
  },
  {
    id: "aprilia-tuareg-660", make: "Aprilia", makeSlug: "aprilia", model: "Tuareg 660", slug: "tuareg-660", generation: "2026 Philippine listing", category: "Adventure touring",
    srp: 750000, engineCc: 659, powerHp: 80, torqueNm: 70, curbWeightKg: 204, seatHeightMm: 860, fuelTankL: 18,
    frontTire: "90/90-21", rearTire: "150/70 R18", abs: "Multi-map dual-channel ABS with traction control and four riding modes", colors: ["Acid Gold", "Indaco Tagelmust", "Martian Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia Tuareg 660 technical specification with current Philippine price cross-check", sourceUrl: "https://wlassets.aprilia.com/wlassets/aprilia/master/tech_spec/Tuareg/Tuareg-660_tech_spec_EN/original/Tuareg-660_tech_spec_EN.pdf", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine 2026 price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/aprilia/tuareg-660", marketPriceCheckedAt: verifiedAt,
    summary: "659cc middleweight adventure twin with 80 hp, 70 Nm, 21/18-inch wheels, 860 mm seat, 204 kg wet weight and an 18 L tank."
  },
  {
    id: "aprilia-tuono-660", make: "Aprilia", makeSlug: "aprilia", model: "Tuono 660", slug: "tuono-660", generation: "2026 Philippine listing", category: "Naked sport bike",
    srp: 860000, engineCc: 659, powerHp: 95, torqueNm: 67, curbWeightKg: 183, seatHeightMm: 820, fuelTankL: 15,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "Dual-channel ABS with APRC traction, wheelie and engine-brake controls", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia Tuono 660 technical specification with current Philippine price cross-check", sourceUrl: "https://wlassets.aprilia.com/wlassets/aprilia/gb/tech_spec/Tuono_660/original/Tuono_660.pdf", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine 2026 price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/aprilia/tuono-660", marketPriceCheckedAt: verifiedAt,
    summary: "659cc parallel-twin naked sport motorcycle with 95 hp, 67 Nm, an 820 mm seat, 183 kg road-ready weight, 15 L tank and APRC rider aids."
  }
];

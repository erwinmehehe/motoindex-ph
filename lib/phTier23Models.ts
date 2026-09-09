import type { Motorcycle } from "./types";

// MotoIndex PH v2.6.1 — deliberate Philippines-first expansion.
// These are current, source-backed anchor models for Tier 2 and Tier 3 brands.
// Search-volume fields remain zero until measured keyword data is imported; we do not invent SEO volume.
const verifiedAt = "2026-08-27";
const verifiedNow = "2026-09-08";

export const phTier23Motorcycles: Motorcycle[] = [
  {
    id: "rusi-rfi-175", make: "Rusi", makeSlug: "rusi", model: "RFI 175", slug: "rfi-175", generation: "Current", category: "Sport scooter",
    srp: 97000, engineCc: 171.7, powerHp: 11.5, torqueNm: 12.4, curbWeightKg: 134, seatHeightMm: 770, fuelTankL: 9.5, fuelConsumptionKmL: 38.5, groundClearanceMm: 140,
    frontTire: "110/70-13", rearTire: "130/70-13", abs: "Front and rear ABS listed in the referenced specification", colors: ["Blue", "Black", "Gray", "Red", "Yellow"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kamote.ph current Rusi RFI 175 Philippines price and specification reference", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-rfi-175", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "171.7cc automatic sport scooter with 13-inch tires, a 770 mm seat and a 9.5 L fuel tank."
  },
  {
    id: "rusi-classic-250i", make: "Rusi", makeSlug: "rusi", model: "Classic 250i", slug: "classic-250i", generation: "Current", category: "Classic road bike",
    srp: 80000, engineCc: 250, powerHp: 16.8, torqueNm: 17.2, curbWeightKg: 136, seatHeightMm: 790, fuelTankL: 12, fuelConsumptionKmL: 35, groundClearanceMm: 200,
    frontTire: "110/90-17", rearTire: "130/80-17", abs: "ABS equipment is not confirmed in the referenced specification", colors: ["Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kamote.ph current Rusi Classic 250i Philippines price and specification reference", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-classic-250i", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "250cc classic-style manual motorcycle with a 12 L tank, 790 mm seat and 17-inch road tires."
  },

  {
    id: "motorstar-cafe-400", make: "MotorStar", makeSlug: "motorstar", model: "Cafe 400", slug: "cafe-400", generation: "Current", category: "Classic road bike",
    srp: 140000, engineCc: 397.2, powerHp: 26.8, torqueNm: 30, curbWeightKg: 150, seatHeightMm: 790, fuelTankL: 13, fuelConsumptionKmL: 20, groundClearanceMm: 160,
    frontTire: "90/90-19", rearTire: "110/80-18", abs: "No ABS confirmed; front disc and rear drum in the referenced specification", colors: ["Green"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current MotorStar Cafe 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "397.2cc retro road bike with a six-speed manual gearbox, 13 L tank and 19/18-inch wheels."
  },
  {
    id: "motorstar-xplorer-250r", make: "MotorStar", makeSlug: "motorstar", model: "Xplorer 250R", slug: "xplorer-250r", generation: "Current", category: "Adventure touring",
    srp: 69000, engineCc: 249.6, powerHp: 22.12, torqueNm: 22.5, curbWeightKg: 146, seatHeightMm: 795, fuelTankL: 16, fuelConsumptionKmL: 32.5, groundClearanceMm: 210,
    frontTire: "100/90-18", rearTire: "130/80-17", abs: "ABS is not listed in the referenced Philippine specification", colors: ["Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH 2026 MotorStar Xplorer 250R price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "249.6cc budget adventure-touring motorcycle with a six-speed gearbox, 210 mm ground clearance and a 16 L tank."
  },

  {
    id: "kymco-like-150i-abs", make: "Kymco", makeSlug: "kymco", model: "Like 150i ABS", slug: "like-150i-abs", generation: "Current", category: "Retro scooter",
    srp: 134000, engineCc: 150, powerHp: 13.3, torqueNm: 12.5, curbWeightKg: 115, seatHeightMm: 770, fuelTankL: 7, fuelConsumptionKmL: 36.1,
    frontTire: "110/70-12", rearTire: "130/70-12", abs: "ABS", colors: ["White", "Golden", "Mint"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines current model/price reference with Philippines specification cross-check", sourceUrl: "https://kymco.com.ph/product", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc retro automatic scooter with ABS, 12-inch tires, a 770 mm seat and a 7 L fuel tank."
  },
  {
    id: "kymco-krv-180i-tcs", make: "Kymco", makeSlug: "kymco", model: "KRV 180i TCS", slug: "krv-180i-tcs", generation: "Current", category: "Sport scooter",
    srp: 179900, engineCc: 175, powerHp: 17, torqueNm: 15.68, curbWeightKg: 143, seatHeightMm: 795, fuelTankL: 7.2, fuelConsumptionKmL: 37,
    frontTire: "110/70-13", rearTire: "130/70-13", abs: "ABS with traction control", colors: ["Snow Peak Silver", "Indigo Sea Blue", "Ether Black", "Thundershock Purple"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Kymco KRV 180i TCS price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/kymco/krv-180i-tcs", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "175cc premium sport scooter with ABS, traction control and 13-inch tires."
  },

  {
    id: "sym-jet-x150", make: "SYM", makeSlug: "sym", model: "Jet X150", slug: "jet-x150", generation: "Current", category: "Sport scooter",
    srp: 135800, engineCc: 150, powerHp: 12.3, torqueNm: 12, curbWeightKg: 140, seatHeightMm: 780, fuelTankL: 7.5, fuelConsumptionKmL: 60, groundClearanceMm: 107,
    frontTire: "100/90-14", rearTire: "110/80-14", abs: "ABS", colors: ["Red", "Grey", "White", "Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current SYM Jet X150 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/sym/jet-x150", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc sport scooter with ABS, 14-inch wheels, 780 mm seat height and a 7.5 L fuel tank."
  },
  {
    id: "sym-cruisym-150", make: "SYM", makeSlug: "sym", model: "Cruisym 150", slug: "cruisym-150", generation: "Current", category: "Maxi-style scooter",
    srp: 103800, engineCc: 150, powerHp: 12, torqueNm: 12, curbWeightKg: 130.5, seatHeightMm: 820, fuelTankL: 7.5, fuelConsumptionKmL: 60, groundClearanceMm: 110,
    frontTire: "100/90-14", rearTire: "110/80-14", abs: "Variant-dependent; Dual ABS variant listed", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current SYM Cruisym 150 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/sym/cruisym-150/specifications", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 108800, transmission: "Automatic",
    summary: "150cc maxi-style scooter offered in standard and Dual ABS configurations, with a 7.5 L fuel tank."
  },

  {
    id: "cfmoto-450mt", make: "CFMOTO", makeSlug: "cfmoto", model: "450MT", slug: "450mt", generation: "Current", category: "Adventure touring",
    srp: 338900, engineCc: 449, powerHp: 42, torqueNm: 42, curbWeightKg: 175, seatHeightMm: 820, fuelTankL: 17.5, groundClearanceMm: 220,
    frontTire: "90/90-21", rearTire: "140/70-18", abs: "ABS with off-road-oriented rear-wheel control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "CFMOTO Philippines current 450MT price and technical specification page", sourceUrl: "https://www.cfmotoph.com/motorcycle/450mt", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "449cc parallel-twin adventure motorcycle with 21/18-inch cross-spoke wheels, 42 hp and a six-speed slipper-clutch transmission."
  },
  {
    id: "cfmoto-450sr", make: "CFMOTO", makeSlug: "cfmoto", model: "450SR", slug: "450sr", generation: "Current", category: "Sport bike",
    srp: 299900, engineCc: 449.5, powerHp: 51, torqueNm: 40, curbWeightKg: 168, seatHeightMm: 795, fuelTankL: 14, groundClearanceMm: 140,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "CFMOTO Philippines current 450SR price and technical specification page", sourceUrl: "https://www.cfmotoph.com/motorcycle/450sr", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "449.5cc parallel-twin sport bike with a six-speed slipper clutch, 17-inch road tires and a 795 mm reference seat height."
  },

  {
    id: "bristol-adx-160", make: "Bristol", makeSlug: "bristol", model: "ADX 160", slug: "adx-160", generation: "Current", category: "Adventure scooter",
    srp: 178800, engineCc: 155, powerHp: 13, torqueNm: 14, curbWeightKg: 151, seatHeightMm: 790, fuelTankL: 11,
    frontTire: "110/80-14", rearTire: "130/70-13", abs: "Disc-brake configuration; confirm exact ABS equipment on the local unit", colors: ["Black", "Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Bristol ADX 160 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/bristol/adx-160/standard/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "155cc adventure-style automatic scooter with a 790 mm seat, 11 L tank and mixed 14/13-inch wheel setup."
  },
  {
    id: "bristol-maxie-400", make: "Bristol", makeSlug: "bristol", model: "Maxie 400", slug: "maxie-400", generation: "Current", category: "Maxi scooter",
    srp: 368000, engineCc: 377, powerHp: 29.1, torqueNm: 33.5, curbWeightKg: 208, seatHeightMm: 730, fuelTankL: 17.4, fuelConsumptionKmL: 25, groundClearanceMm: 170,
    frontTire: "120/70-14", rearTire: "150/70-13", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Bristol Maxie 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/bristol/maxie-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "377cc maxi scooter with ABS, a low published 730 mm seat height and a 17.4 L fuel tank."
  },

  {
    id: "benelli-180s", make: "Benelli", makeSlug: "benelli", model: "180S", slug: "180s", generation: "Current", category: "Naked street bike",
    srp: 129900, engineCc: 175.3, powerHp: 17.8, torqueNm: 14, curbWeightKg: 185, seatHeightMm: 810, fuelTankL: 10, fuelConsumptionKmL: 45, groundClearanceMm: 170,
    frontTire: "100/80-17", rearTire: "130/70-17", abs: "Disc brakes; ABS is not listed in the referenced specification", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Benelli 180S price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/180s/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "175.3cc naked street motorcycle with a six-speed manual transmission, 17-inch tires and a 10 L tank."
  },
  {
    id: "benelli-trk-502x", make: "Benelli", makeSlug: "benelli", model: "TRK 502X", slug: "trk-502x", generation: "Current", category: "Adventure touring",
    srp: 399000, engineCc: 500, powerHp: 47, torqueNm: 46, curbWeightKg: 213, seatHeightMm: 840, fuelTankL: 20, fuelConsumptionKmL: 20, groundClearanceMm: 220,
    frontTire: "110/80-19", rearTire: "150/70-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Benelli TRK 502X price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/trk502x/standard", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "500cc adventure-touring motorcycle with ABS, 19/17-inch wheels, 220 mm ground clearance and a 20 L tank."
  },

  {
    id: "ktm-390-duke", make: "KTM", makeSlug: "ktm", model: "390 Duke", slug: "390-duke", generation: "Current", category: "Naked street bike",
    srp: 289000, engineCc: 373, powerHp: 43, torqueNm: 37, curbWeightKg: 139, seatHeightMm: 800, fuelTankL: 11, fuelConsumptionKmL: 28, groundClearanceMm: 170,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: ["White", "Orange"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current KTM 390 Duke price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/duke-390/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc naked street bike with 43 hp, ABS, 17-inch tires and a six-speed manual transmission."
  },
  {
    id: "ktm-390-adventure", make: "KTM", makeSlug: "ktm", model: "390 Adventure", slug: "390-adventure", generation: "Current", category: "Adventure touring",
    srp: 338000, engineCc: 373, powerHp: 43, torqueNm: 37, curbWeightKg: 158, seatHeightMm: 830, fuelTankL: 14.5, groundClearanceMm: 160,
    frontTire: "100/90-19", rearTire: "130/80-17", abs: "ABS with off-road mode and traction-control equipment", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current KTM 390 Adventure price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/390-adventure", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc adventure motorcycle with 19/17-inch wheels, a 14.5 L tank and electronic rider aids."
  },

  {
    id: "royal-enfield-hunter-350", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Hunter 350", slug: "hunter-350", generation: "Current", category: "Classic road bike",
    srp: 231000, engineCc: 349, powerHp: 20.2, torqueNm: 27, curbWeightKg: 181, seatHeightMm: 790, fuelTankL: 13, fuelConsumptionKmL: 36,
    frontTire: "110/70-17", rearTire: "140/70-17", abs: "Dual-channel ABS on current Metro configuration", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Royal Enfield Hunter 350 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/royal-enfield/hunter-350", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "349cc roadster with a 790 mm seat, 17-inch wheels, 13 L tank and a five-speed manual transmission."
  },
  {
    id: "royal-enfield-himalayan-450", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Himalayan 450", slug: "himalayan-450", generation: "Current", category: "Adventure touring",
    srp: 329000, engineCc: 451.65, powerHp: 39.5, torqueNm: 40, curbWeightKg: 196, seatHeightMm: 825, fuelTankL: 17, fuelConsumptionKmL: 27.86, groundClearanceMm: 230,
    frontTire: "90/90-21", rearTire: "140/80-17", abs: "Dual-channel switchable ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield Philippines current Himalayan model page with published technical specification", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/new-himalayan/", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 365000, transmission: "Manual",
    summary: "451.65cc adventure motorcycle with 21/17-inch wheels, 230 mm ground clearance, a 17 L tank and switchable ABS."
  },

  {
    id: "bmw-g-310-gs", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "G 310 GS", slug: "g-310-gs", generation: "Current", category: "Adventure touring",
    srp: 320000, engineCc: 313, powerHp: 34, torqueNm: 28, curbWeightKg: 175, seatHeightMm: 835, fuelTankL: 11.5, fuelConsumptionKmL: 30.3,
    frontTire: "110/80-19", rearTire: "150/70-17", abs: "ABS", colors: ["Black", "Silver", "Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current BMW G 310 GS price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/bmw/g-310/gs", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "313cc entry adventure motorcycle with ABS, 19/17-inch wheels and a published 835 mm seat height."
  },
  {
    id: "bmw-c-400-gt", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "C 400 GT", slug: "c-400-gt", generation: "2026 Philippine model", category: "Maxi scooter",
    srp: 625000, engineCc: 350, powerHp: 34, torqueNm: 35, curbWeightKg: 219, seatHeightMm: 775, fuelTankL: 12.8,
    frontTire: "120/70-15", rearTire: "150/70-14", abs: "BMW Motorrad ABS Pro with traction-control equipment", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad Philippines C 400 GT technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/urban_mobility/c400gt/technicaldata.html", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current", marketPriceSourceLabel: "BMW Motorrad Philippines 2026 model overview", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", marketPriceCheckedAt: verifiedNow, transmission: "Automatic",
    summary: "350cc premium maxi scooter with a 775 mm seat, 12.8 L tank and BMW ABS/traction-control rider aids."
  },

  {
    id: "ducati-monster-937-plus", make: "Ducati", makeSlug: "ducati", model: "Monster 937 Plus", slug: "monster-937-plus", generation: "Current", category: "Naked street bike",
    srp: 875000, engineCc: 937, powerHp: 111, torqueNm: 93, curbWeightKg: 188, seatHeightMm: 820, fuelTankL: 14,
    frontTire: "120/70ZR17", rearTire: "180/55ZR17", abs: "Cornering ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Ducati Monster 937 Plus price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/monster-937-plus/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "937cc naked sport motorcycle with 111 hp, a six-speed transmission and a modern electronic rider-aid package."
  },
  {
    id: "ducati-scrambler-nightshift", make: "Ducati", makeSlug: "ducati", model: "Scrambler Nightshift", slug: "scrambler-nightshift", generation: "Current", category: "Modern classic",
    srp: 785000, engineCc: 803, powerHp: 73, torqueNm: 65.2, curbWeightKg: 196, seatHeightMm: 798, fuelTankL: 13.5,
    frontTire: "110/80R18", rearTire: "180/55R17", abs: "Cornering ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Ducati Scrambler Nightshift price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/scrambler-nightshift/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "803cc modern-classic motorcycle with a 798 mm seat, mixed 18/17-inch wheels and Ducati electronic rider aids."
  },

  {
    id: "triumph-speed-400", make: "Triumph", makeSlug: "triumph", model: "Speed 400", slug: "speed-400", generation: "Current", category: "Modern classic",
    srp: 299000, engineCc: 398, powerHp: 39, torqueNm: 37.5, curbWeightKg: 170, seatHeightMm: 790, fuelTankL: 13,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Triumph Speed 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/triumph/speed-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "398cc roadster with 39 hp, a 790 mm seat, 13 L tank and six-speed manual transmission."
  },
  {
    id: "triumph-scrambler-400-x", make: "Triumph", makeSlug: "triumph", model: "Scrambler 400 X", slug: "scrambler-400-x", generation: "Current", category: "Scrambler",
    srp: 339000, engineCc: 398, powerHp: 39, torqueNm: 37.5, curbWeightKg: 179, seatHeightMm: 835, fuelTankL: 13, fuelConsumptionKmL: 28.5, groundClearanceMm: 195,
    frontTire: "100/90-19", rearTire: "140/80-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Triumph Scrambler 400 X price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/triumph/scrambler-400-x/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "398cc scrambler with a 19-inch front wheel, 835 mm seat, 13 L tank and six-speed gearbox."
  },

  {
    id: "vespa-primavera-150", make: "Vespa", makeSlug: "vespa", model: "Primavera 150", slug: "primavera-150", generation: "Current", category: "Retro scooter",
    srp: 210000, engineCc: 155, powerHp: 12.7, torqueNm: 12.8, curbWeightKg: 130, seatHeightMm: 790, fuelTankL: 7,
    frontTire: "110/70-12", rearTire: "120/70-12", abs: "Front-wheel ABS on the current 150-class configuration", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH 2026 Vespa Primavera price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/vespa/primavera/specifications", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 235000, transmission: "Automatic",
    summary: "155cc classic Vespa scooter with CVT transmission, a 790 mm seat and 12-inch tubeless wheels."
  },
  {
    id: "vespa-sprint-150", make: "Vespa", makeSlug: "vespa", model: "Sprint 150", slug: "sprint-150", generation: "Current", category: "Retro scooter",
    srp: 230000, engineCc: 155, powerHp: 12.7, torqueNm: 12.8, curbWeightKg: 132, seatHeightMm: 790, fuelTankL: 8,
    frontTire: "110/70-12", rearTire: "120/70-12", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH 2026 Vespa Sprint price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/vespa/sprint/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 275000, transmission: "Automatic",
    summary: "155cc premium retro scooter with CVT transmission, ABS and a 790 mm seat; current Philippine listings span multiple trims."
  },

  {
    id: "aprilia-sr-gt-200", make: "Aprilia", makeSlug: "aprilia", model: "SR GT 200", slug: "sr-gt-200", generation: "Current", category: "Adventure scooter",
    srp: 248000, engineCc: 174, powerHp: 17.4, torqueNm: 16.5, curbWeightKg: 148, seatHeightMm: 799, fuelTankL: 9,
    frontTire: "110/80-14", rearTire: "130/70-13", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH 2026 Aprilia SR GT price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/aprilia/sr-gt/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 258000, transmission: "Automatic",
    summary: "174cc adventure-style scooter with ABS, a 799 mm seat and mixed 14/13-inch road tires."
  },
  {
    id: "aprilia-rs-457", make: "Aprilia", makeSlug: "aprilia", model: "RS 457", slug: "rs-457", generation: "Current", category: "Sport bike",
    srp: 348000, engineCc: 457, powerHp: 47.6, torqueNm: 43.5, curbWeightKg: 175, seatHeightMm: 800, fuelTankL: 13,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "Dual-channel ABS with rider-aid electronics", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Aprilia RS 457 price/specification reference with Aprilia technical cross-check", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/aprilia/rs-457/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "457cc parallel-twin sport motorcycle with 47.6 hp, a six-speed manual transmission and dual-channel ABS."
  },

  {
    id: "husqvarna-svartpilen-401", make: "Husqvarna", makeSlug: "husqvarna", model: "Svartpilen 401", slug: "svartpilen-401", generation: "Current", category: "Scrambler",
    srp: 295000, engineCc: 373, powerHp: 44, torqueNm: 37, curbWeightKg: 152, seatHeightMm: 835, fuelTankL: 9.5, fuelConsumptionKmL: 29, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Husqvarna Svartpilen 401 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/husqvarna/svartpilen-401/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc scrambler-style road bike with 44 hp, ABS and a six-speed manual transmission."
  },
  {
    id: "husqvarna-vitpilen-401", make: "Husqvarna", makeSlug: "husqvarna", model: "Vitpilen 401", slug: "vitpilen-401", generation: "Current", category: "Cafe roadster",
    srp: 315000, engineCc: 373, powerHp: 44, torqueNm: 37, curbWeightKg: 151, seatHeightMm: 835, fuelTankL: 9.5, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Independent PH current Husqvarna Vitpilen 401 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/husqvarna/vitpilen-401/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc cafe-style roadster with 44 hp, ABS, 17-inch tires and a six-speed manual transmission."
  },
  {
    id: "bmw-g-310-r", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "G 310 R", slug: "g-310-r", generation: "2023 Philippine listing", category: "Naked street bike",
    srp: 300000, engineCc: 313, powerHp: 34, torqueNm: 28, curbWeightKg: 164, seatHeightMm: 785, fuelTankL: 11,
    frontTire: "110/70 R17", rearTire: "150/60 R17", abs: "BMW Motorrad ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad Philippines G 310 R technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/roadster/g310r/technicaldata.html", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "BMW Motorrad Philippines model overview", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "313cc entry roadster with 34 hp, a 785 mm seat, 164 kg road-ready weight, 17-inch tires and BMW Motorrad ABS."
  },
  {
    id: "bmw-r-1300-gs", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "R 1300 GS", slug: "r-1300-gs", generation: "2026 Philippine model", category: "Adventure touring",
    srp: 1675000, engineCc: 1300, powerHp: 145, torqueNm: 149, curbWeightKg: 237, seatHeightMm: 850, fuelTankL: 19,
    frontTire: "120/70 R19", rearTire: "170/60 R17", abs: "BMW Motorrad Full Integral ABS Pro", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad Philippines R 1300 GS technical data", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/adventure/r1300gs/technicaldata.html", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "BMW Motorrad Philippines 2026 model overview", marketPriceSourceUrl: "https://www.bmwmotorrad.com.ph/en/models/modeloverview.html", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "1300cc boxer adventure motorcycle with 145 hp, 149 Nm, a 19 L tank, 850 mm seat and Full Integral ABS Pro."
  },
  {
    id: "cfmoto-450nk", make: "CFMOTO", makeSlug: "cfmoto", model: "450NK", slug: "450nk", generation: "Current Philippine model", category: "Naked street bike",
    srp: 275900, engineCc: 449.5, powerHp: 51, torqueNm: 39, curbWeightKg: 173, seatHeightMm: 795, fuelTankL: 14, groundClearanceMm: 192,
    frontTire: "110/70 ZR17", rearTire: "150/60 ZR17", abs: "ABS with traction control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "CFMOTO Philippines current 450NK price and specification page", sourceUrl: "https://www.cfmotoph.com/motorcycle/450nk", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "CFMOTO Philippines", marketPriceSourceUrl: "https://www.cfmotoph.com/motorcycle/450nk", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "449.5cc twin-cylinder naked bike with about 51 hp, a 795 mm seat, ABS, traction control and six-speed manual transmission."
  },
  {
    id: "cfmoto-675sr-r", alsoKnownAs: ["CFMOTO 675SRR"], make: "CFMOTO", makeSlug: "cfmoto", model: "675SR-R", slug: "675sr-r", generation: "Current Philippine model", category: "Sport bike",
    srp: 438900, engineCc: 675, powerHp: 93.9, torqueNm: 70, curbWeightKg: 189, seatHeightMm: 810, fuelTankL: 15, groundClearanceMm: 140,
    frontTire: "120/70 R17", rearTire: "180/55 R17", abs: "ABS with adjustable traction control", colors: ["Nebula Black", "Nebula White", "Aerolite Grey"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "CFMOTO Philippines current 675SR-R price and engine specification page with global chassis specification cross-check", sourceUrl: "https://www.cfmotoph.com/motorcycle/675sr", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "CFMOTO Philippines", marketPriceSourceUrl: "https://www.cfmotoph.com/motorcycle/675sr", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "675cc inline-three sport bike with 70 kW output, 70 Nm, a 15 L tank, 810 mm seat, ABS and adjustable traction control."
  },
  {
    id: "triumph-trident-660", make: "Triumph", makeSlug: "triumph", model: "Trident 660", slug: "trident-660", generation: "2025 Philippine model", category: "Naked street bike",
    srp: 524000, engineCc: 660, powerHp: 81, torqueNm: 64, curbWeightKg: 190, seatHeightMm: 805, fuelTankL: 14,
    frontTire: "120/70 R17", rearTire: "180/55 R17", abs: "Optimised cornering ABS with traction control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph Motorcycles Philippines Trident 660 model and specification pages", sourceUrl: "https://www.triumphmotorcycles.ph/bikes/roadsters/trident/specification", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Triumph Motorcycles Philippines", marketPriceSourceUrl: "https://www.triumphmotorcycles.ph/bikes/previous-model-year/models/trident-660-2025", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "660cc inline-three roadster with 81 hp, 64 Nm, an 805 mm seat, 14 L tank and optimised cornering ABS."
  },
  {
    id: "triumph-street-triple-765-rs", alsoKnownAs: ["Street Triple RS"], make: "Triumph", makeSlug: "triumph", model: "Street Triple 765 RS", slug: "street-triple-765-rs", generation: "Current Philippine model", category: "Naked street bike",
    srp: 870000, engineCc: 765, powerHp: 128.2, torqueNm: 80, curbWeightKg: 188, seatHeightMm: 839, fuelTankL: 15,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "Optimised cornering ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Triumph Motorcycles Philippines Street Triple 765 RS specification page", sourceUrl: "https://www.triumphmotorcycles.ph/bikes/roadsters/street-triple-765/specification", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Triumph Motorcycles Philippines", marketPriceSourceUrl: "https://www.triumphmotorcycles.ph/bikes/roadsters/street-triple/street-triple-765-rs", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "765cc inline-three naked bike with 128.2 hp, 80 Nm, an 839 mm seat, 188 kg wet weight and optimised cornering ABS."
  },
  {
    id: "royal-enfield-guerrilla-450", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Guerrilla 450", slug: "guerrilla-450", generation: "Current Philippine model", category: "Naked street bike",
    srp: 289000, engineCc: 452, powerHp: 39.5, torqueNm: 40, curbWeightKg: 185, seatHeightMm: 780, fuelTankL: 11, groundClearanceMm: 169,
    frontTire: "120/70 R17", rearTire: "160/60 R17", abs: "Dual-channel ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield Philippines Guerrilla 450 model and technical specification page", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/guerrilla-450/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Royal Enfield Philippines owner support", marketPriceSourceUrl: "https://www.royalenfield.com/ph/en/support/owners-manual/", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "452cc roadster with 40 PS and 40 Nm, a low 780 mm seat, 169 mm ground clearance, 17-inch tires and dual-channel ABS."
  },
  {
    id: "royal-enfield-classic-350", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Classic 350", slug: "classic-350", generation: "Current Philippine model", category: "Classic road bike",
    srp: 230000, engineCc: 349, powerHp: 20.2, torqueNm: 27, curbWeightKg: 195, seatHeightMm: 805, fuelTankL: 13, groundClearanceMm: 170,
    frontTire: "100/90-19", rearTire: "120/80-18", abs: "Dual-channel ABS on current dual-disc configurations", colors: ["Emerald", "Stealth Black", "Gun Grey", "Commando Sand", "Medallion Bronze"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield Classic 350 technical specification and Philippine model pages", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/classic-350/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Royal Enfield Philippines owner support", marketPriceSourceUrl: "https://www.royalenfield.com/ph/en/support/owners-manual/", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "349cc classic road bike with 20.2 hp, 27 Nm, an 805 mm seat, 13 L tank and 19/18-inch wheels."
  },
  {
    id: "vespa-gts-supersport-300", alsoKnownAs: ["Vespa GTS Super Sport 300"], make: "Vespa", makeSlug: "vespa", model: "GTS SuperSport 300", slug: "gts-supersport-300", generation: "2025 Philippine model", category: "Premium scooter",
    srp: 375000, engineCc: 278, powerHp: 23.8, torqueNm: 26, curbWeightKg: 157, seatHeightMm: 790, fuelTankL: 8.5, fuelConsumptionKmL: 30.3,
    frontTire: "120/70-12", rearTire: "130/70-12", abs: "Dual-channel ABS with ASR traction control", colors: ["Blue Eclettico"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Vespa Philippines GTS SuperSport 300 price page and official technical specification sheet", sourceUrl: "https://www.vespa.com/ph_EN/models/gts/gts-supersport-300-hpe-2025/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Vespa Philippines", marketPriceSourceUrl: "https://www.vespa.com/ph_EN/models/gts/gts-supersport-300-hpe-2025/", marketPriceCheckedAt: verifiedNow, transmission: "Automatic",
    summary: "278cc premium Grand Tourer scooter with 23.8 hp, dual-channel ABS, ASR, 12-inch wheels, a 790 mm seat and an 8.5 L tank."
  },
  {
    id: "vespa-gtv-300", make: "Vespa", makeSlug: "vespa", model: "GTV 300", slug: "gtv-300", generation: "2025 Philippine model", category: "Premium scooter",
    srp: 425000, engineCc: 278, powerHp: 23.8, torqueNm: 26, curbWeightKg: 163, seatHeightMm: 790, fuelTankL: 8.5,
    frontTire: "120/70-12", rearTire: "130/70-12", abs: "Dual-channel ABS with ASR traction control", colors: ["Green Tenace"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Vespa Philippines GTV 300 price and product page with current GTV technical cross-check", sourceUrl: "https://www.vespa.com/ph_EN/models/gtv/gtv-300-hpe-2025/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Vespa Philippines", marketPriceSourceUrl: "https://www.vespa.com/ph_EN/models/gtv/gtv-300-hpe-2025/", marketPriceCheckedAt: verifiedNow, transmission: "Automatic",
    summary: "278cc premium retro-sport scooter with 23.8 hp, a 790 mm seat, 12-inch tires, dual-channel ABS and ASR traction control."
  },
  {
    id: "aprilia-rs-660", make: "Aprilia", makeSlug: "aprilia", model: "RS 660", slug: "rs-660", generation: "Current Philippine model", category: "Sport bike",
    srp: 660000, engineCc: 659, powerHp: 105, torqueNm: 70, curbWeightKg: 183, seatHeightMm: 820, fuelTankL: 15,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "Multimap cornering ABS with APRC rider aids", colors: ["Acid Gold", "Lava Red", "Tribute", "Apex Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Aprilia Philippines RS 660 price page with current official technical specification cross-check", sourceUrl: "https://www.aprilia.com/ph_EN/models/rs-660/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Aprilia Philippines", marketPriceSourceUrl: "https://www.aprilia.com/ph_EN/models/rs-660/", marketPriceCheckedAt: verifiedNow, transmission: "Manual",
    summary: "659cc parallel-twin sport motorcycle with 105 hp, 70 Nm, 183 kg wet weight, a 15 L tank and multimap cornering ABS."
  },


  {
    id: "kymco-sky-town-150", make: "Kymco", makeSlug: "kymco", model: "Sky Town 150", slug: "sky-town-150", generation: "2026 Philippine model", category: "Commuter scooter",
    srp: 118500, engineCc: 150, powerHp: 11.3, torqueNm: 11.9, curbWeightKg: 126, seatHeightMm: 770, fuelTankL: 7,
    frontTire: "110/70-14", rearTire: "130/70-13", abs: "Dual-channel ABS", colors: ["Pearly White", "Pearly Black", "Golden Brown"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines Sky Town 150 official product and launch references", sourceUrl: "https://kymco.com.ph/product/sky-town-150/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc fuel-injected urban scooter with dual ABS, mixed 14/13-inch wheels, a 770 mm seat and a 7 L fuel tank."
  },
  {
    id: "kymco-agility-eco-125i", make: "Kymco", makeSlug: "kymco", model: "Agility Eco 125i", slug: "agility-eco-125i", generation: "Current Philippine model", category: "Commuter scooter",
    srp: 82500, engineCc: 124, powerHp: 9.4, torqueNm: 10.2, curbWeightKg: 119, seatHeightMm: 760, fuelTankL: 9,
    frontTire: "90/90-12", rearTire: "100/90-10", abs: "ABS is not stated on the official Philippine product specification page", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines Agility Eco 125i official product specification", sourceUrl: "https://kymco.com.ph/product/agility-eco-125i/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current",
    summary: "124cc fuel-injected commuter scooter with a low 760 mm seat, 9 L fuel tank and compact 12/10-inch wheel setup."
  },
  {
    id: "kymco-dink-r-150", make: "Kymco", makeSlug: "kymco", model: "Dink R 150", slug: "dink-r-150", generation: "Current Philippine model", category: "Maxi-style scooter",
    srp: 148900, engineCc: 150, powerHp: 15, torqueNm: 13.2, curbWeightKg: 148, seatHeightMm: 783, fuelTankL: 10.7,
    frontTire: "120/70-13", rearTire: "130/70-13", abs: "Bosch 9.1M dual-channel ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines Dink R 150 official product specification", sourceUrl: "https://kymco.com.ph/product/dink-r-150/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc liquid-cooled scooter with dual ABS, a 783 mm seat, 10.7 L fuel tank and 13-inch tires."
  },
  {
    id: "kymco-dtx360-300", make: "Kymco", makeSlug: "kymco", model: "DTX360-300", slug: "dtx360-300", generation: "Current Philippine model", category: "Adventure scooter",
    srp: 229000, engineCc: 276, powerHp: 22.8, torqueNm: 23.7, curbWeightKg: 184, seatHeightMm: 800, fuelTankL: 12.5,
    frontTire: "120/80-14", rearTire: "150/70-13", abs: "ABS with traction control", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kymco Philippines DTX360-300 official product specification", sourceUrl: "https://kymco.com.ph/product/dtx-360-300/", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "276cc crossover scooter with ABS, traction control, an 800 mm seat, 12.5 L tank and mixed 14/13-inch tires."
  },
  {
    id: "husqvarna-svartpilen-200", make: "Husqvarna", makeSlug: "husqvarna", model: "Svartpilen 200", slug: "svartpilen-200", generation: "Current Philippine model", category: "Cafe roadster",
    srp: 175000, engineCc: 200, powerHp: 26, torqueNm: 19.5, curbWeightKg: 147, seatHeightMm: 835, fuelTankL: 9.5, fuelConsumptionKmL: 37.5, groundClearanceMm: 145,
    frontTire: "110/70 R17", rearTire: "150/60 R17", abs: "ABS", colors: ["Gray"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Husqvarna Svartpilen 200 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/husqvarna/svartpilen-200/specifications", verifiedAt: verifiedNow, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "200cc lightweight roadster with 26 hp, ABS, an 835 mm seat, 17-inch tires and a six-speed manual transmission."
  },


  {
    id: "benelli-trk-502", make: "Benelli", makeSlug: "benelli", model: "TRK 502", slug: "trk-502", generation: "Current Philippine model", category: "Adventure touring",
    srp: 379000, engineCc: 500, powerHp: 47, torqueNm: 45, curbWeightKg: 213, seatHeightMm: 800, fuelTankL: 20, fuelConsumptionKmL: 33.7, groundClearanceMm: 190,
    frontTire: "120/70 R17", rearTire: "160/60 R17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Benelli TRK 502 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/trk-502/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "500cc parallel-twin adventure-tourer with 47 hp, ABS, a 20 L tank, 800 mm seat and 17-inch road tires."
  },
  {
    id: "benelli-302s", make: "Benelli", makeSlug: "benelli", model: "302S", slug: "302s", generation: "Current Philippine model", category: "Naked street bike",
    srp: 222800, engineCc: 300, powerHp: 38, torqueNm: 25.6, curbWeightKg: 185, seatHeightMm: 795, fuelTankL: 16, fuelConsumptionKmL: 25, groundClearanceMm: 175,
    frontTire: "120/70 ZR17", rearTire: "160/60 ZR17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Benelli 302S price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/302-s/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "300cc parallel-twin naked bike with 38 hp, ABS, a 795 mm seat, 16 L tank and six-speed manual transmission."
  },
  {
    id: "benelli-leoncino-250", make: "Benelli", makeSlug: "benelli", model: "Leoncino 250", slug: "leoncino-250", generation: "Current Philippine model", category: "Modern classic",
    srp: 188800, engineCc: 249, powerHp: 25, torqueNm: 21, curbWeightKg: 159, seatHeightMm: 800, fuelTankL: 12.5, fuelConsumptionKmL: 24.4, groundClearanceMm: 170,
    frontTire: "110/70 R17", rearTire: "150/60 R17", abs: "ABS is not listed in the referenced Philippine specification", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Benelli Leoncino 250 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/leoncino-250/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "249cc single-cylinder modern-classic motorcycle with 25 hp, an 800 mm seat and six-speed manual transmission."
  },
  {
    id: "ktm-200-duke", alsoKnownAs: ["KTM Duke 200"], make: "KTM", makeSlug: "ktm", model: "200 Duke", slug: "200-duke", generation: "Current Philippine listing", category: "Naked street bike",
    srp: 178000, engineCc: 200, powerHp: 26, torqueNm: 19.5, curbWeightKg: 154, seatHeightMm: 830, fuelTankL: 13.4, fuelConsumptionKmL: 37.5, groundClearanceMm: 170,
    frontTire: "110/70 R17", rearTire: "150/70 R17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine KTM Duke 200 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/duke-200/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "200cc single-cylinder street bike with 26 hp, ABS, a 13.4 L tank, 830 mm seat and six-speed manual transmission."
  },
  {
    id: "ktm-790-duke", make: "KTM", makeSlug: "ktm", model: "790 Duke", slug: "790-duke", generation: "Current Philippine listing", category: "Naked street bike",
    srp: 599000, engineCc: 799, powerHp: 105, torqueNm: 87, curbWeightKg: 189, seatHeightMm: 825, fuelTankL: 14, fuelConsumptionKmL: 22, groundClearanceMm: 186,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine KTM 790 Duke price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/duke-790/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "799cc parallel-twin naked bike with 105 hp, 87 Nm, ABS, a 14 L tank and six-speed manual transmission."
  },
  {
    id: "ducati-streetfighter-v4", make: "Ducati", makeSlug: "ducati", model: "Streetfighter V4", slug: "streetfighter-v4", generation: "Current Philippine model", category: "Naked street bike",
    srp: 1590000, engineCc: 1103, powerHp: 208, torqueNm: 123, curbWeightKg: 199, seatHeightMm: 845, fuelTankL: 16,
    frontTire: "120/70 ZR17", rearTire: "200/60 ZR17", abs: "ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Ducati Streetfighter V4 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/streetfighter-v4/specifications/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "1103cc V4 hyper-naked motorcycle with 208 hp, 123 Nm, ABS, traction control and a six-speed manual transmission."
  },
  {
    id: "ducati-panigale-v4", make: "Ducati", makeSlug: "ducati", model: "Panigale V4", slug: "panigale-v4", generation: "Current Philippine model", category: "Super sport",
    srp: 1995000, engineCc: 1103, powerHp: 214, torqueNm: 124, curbWeightKg: 198, seatHeightMm: 835, fuelTankL: 16,
    frontTire: "120/70 ZR17", rearTire: "200/60 ZR17", abs: "ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Ducati Panigale V4 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/panigale-v4/specifications/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "1103cc V4 superbike with 214 hp, 124 Nm, ABS, traction control, a 835 mm seat and six-speed manual transmission."
  },


  {
    id: "rusi-adventure-x-150i-v2", make: "Rusi", makeSlug: "rusi", model: "Adventure X 150i V2", slug: "adventure-x-150i-v2", generation: "2025-current Philippine model", category: "Adventure scooter",
    srp: 110000, engineCc: 150, powerHp: 14.75, torqueNm: 14, curbWeightKg: 142, seatHeightMm: 790, fuelTankL: 11, fuelConsumptionKmL: 40, groundClearanceMm: 120,
    frontTire: "110/80-14", rearTire: "130/70-13", abs: "Dual-channel ABS", colors: ["Red", "Aqua Blue", "White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Rusi Adventure X 150i V2 price and specification reference", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-adventure-x-150i-v2", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc adventure-style automatic scooter with dual-channel ABS, an 11 L tank, 790 mm seat and mixed 14/13-inch tires."
  },
  {
    id: "rusi-flash-150x", make: "Rusi", makeSlug: "rusi", model: "Flash 150X", slug: "flash-150x", generation: "Current Philippine model", category: "Sport underbone",
    srp: 75000, engineCc: 149.6, powerHp: 16.76, torqueNm: 14.5, curbWeightKg: 118, seatHeightMm: 770, fuelTankL: 5.3, fuelConsumptionKmL: 56, groundClearanceMm: 145,
    frontTire: "90/80-17", rearTire: "120/70-17", abs: "Front ABS is listed; the same reference lists a rear drum brake", colors: ["Red", "Yellow", "White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Rusi Flash 150X price and specification reference", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-flash-150x", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "149.6cc six-speed sport underbone with fuel injection, a 770 mm seat, 17-inch tires and a listed front ABS setup."
  },
  {
    id: "rusi-cyclone-400", make: "Rusi", makeSlug: "rusi", model: "Cyclone 400", slug: "cyclone-400", generation: "Current Philippine model", category: "Cafe roadster",
    srp: 270000, engineCc: 378, powerHp: 36.2, torqueNm: 33, curbWeightKg: 184, seatHeightMm: 770, fuelTankL: 19, fuelConsumptionKmL: 29.5, groundClearanceMm: 145,
    frontTire: "120/70-17", rearTire: "150/70-17", abs: "Dual-channel ABS", colors: ["Gray"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Rusi Cyclone 400 price and specification reference", sourceUrl: "https://www.kamote.ph/motorcycle/rusi-cyclone-400", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "378cc parallel-twin roadster with 36.2 hp, dual-channel ABS, a 19 L tank, 770 mm seat and six-speed manual transmission."
  },


  {
    id: "bristol-maxxie-160", make: "Bristol", makeSlug: "bristol", model: "Maxxie 160", slug: "maxxie-160", generation: "Current Philippine model", category: "Maxi-style scooter",
    srp: 168800, engineCc: 160, powerHp: 15.8, torqueNm: 14.7, curbWeightKg: 137.6, seatHeightMm: 746, fuelTankL: 13, groundClearanceMm: 130,
    frontTire: "110/70-13", rearTire: "130/70-13", abs: "Dual-channel ABS", colors: ["Black", "Gray", "White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bristol Maxxie 160 current model specification with Philippine market cross-check", sourceUrl: "https://www.bikes4sale.com/details/bristol/maxxie-160/maxxie-160/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Bristol Motorcycle Cebu current dealer listing", marketPriceSourceUrl: "https://www.autoyas.com/PH/Mandaue-City/116217340506470/Bristol-Motorcycle-Cebu", marketPriceCheckedAt: "2026-09-09", transmission: "Automatic",
    summary: "160cc urban maxi-style scooter with CVT, dual-channel ABS, a low 746 mm seat, 13 L tank and 13-inch tires."
  },
  {
    id: "bristol-basilica-125", make: "Bristol", makeSlug: "bristol", model: "Basilica 125", slug: "basilica-125", generation: "Current Philippine model", category: "Retro scooter",
    srp: 128800, engineCc: 125, powerHp: 8.9, torqueNm: 9.5, curbWeightKg: 111, seatHeightMm: 780, fuelTankL: 6.6, fuelConsumptionKmL: 50, groundClearanceMm: 110,
    frontTire: "120/70-12", rearTire: "120/70-12", abs: "Combined braking system (CBS); no ABS asserted", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bristol Basilica 125 current model specification with Philippine market cross-check", sourceUrl: "https://www.bikes4sale.com/details/bristol/basilica/basilica/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Bristol Motorcycle Cebu current dealer listing", marketPriceSourceUrl: "https://www.autoyas.com/PH/Mandaue-City/116217340506470/Bristol-Motorcycle-Cebu", marketPriceCheckedAt: "2026-09-09", transmission: "Automatic",
    summary: "125cc retro automatic scooter with CBS, a 780 mm seat, 6.6 L tank, 12-inch tires and an approximately 111 kg kerb weight."
  },
  {
    id: "husqvarna-norden-901", make: "Husqvarna", makeSlug: "husqvarna", model: "Norden 901", slug: "norden-901", generation: "Current Philippine model", category: "Adventure touring",
    srp: 950000, engineCc: 889, powerHp: 105, torqueNm: 100, curbWeightKg: 204, seatHeightMm: 854, fuelTankL: 19, fuelConsumptionKmL: 22.2, groundClearanceMm: 252,
    frontTire: "90/90 R21", rearTire: "150/70 R18", abs: "Bosch cornering ABS with off-road mode", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Husqvarna Philippines Norden 901 technical specification", sourceUrl: "https://www.husqvarna-motorcycles.com/en-ph/models/travel/norden-901-2022.html", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    priceContext: "Current 2026 Philippine listings are price-on-request; ₱950,000 is the last confirmed public Philippine launch SRP from 2023.", transmission: "Manual",
    summary: "889cc parallel-twin adventure tourer with 105 hp, 100 Nm, 21/18-inch tubeless spoked wheels, a 19 L tank and adjustable 854/874 mm seat."
  },


  {
    id: "honda-cb650r", make: "Honda", makeSlug: "honda", model: "CB650R", slug: "cb650r", generation: "2026 Philippine model", category: "Naked street bike",
    srp: 525000, engineCc: 649, powerHp: 93.9, torqueNm: 63, curbWeightKg: 203, seatHeightMm: 810, fuelTankL: 15.4, fuelConsumptionKmL: 20.9, groundClearanceMm: 148,
    frontTire: "120/70-17", rearTire: "180/55-17", abs: "2-channel ABS", colors: ["Matte Gunpowder Black Metallic", "Grand Prix Red", "Matte Jeans Blue Metallic"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Honda Philippines CB650R official specification sheet", sourceUrl: "https://www.hondaph.com/honda-bigbikes/files/products/646b1eb380c48.pdf", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceHighPhp: 565000, marketPriceSourceLabel: "Honda Philippines Makina Moto Expo 2026 launch", marketPriceSourceUrl: "https://www.hondaph.com/big-bike/news/honda-philippines-launches-three-new-models-elevates-innovation-at-makina-moto-expo-2026", marketPriceCheckedAt: "2026-09-09", transmission: "Manual",
    summary: "649cc inline-four naked bike with 93.9 hp, 63 Nm, an 810 mm seat and Standard plus E-Clutch variants in the 2026 Philippine lineup."
  },
  {
    id: "honda-x-adv", make: "Honda", makeSlug: "honda", model: "X-ADV", slug: "x-adv", generation: "Current Philippine model", category: "Adventure scooter",
    srp: 1170000, engineCc: 745, powerHp: 57.8, torqueNm: 69, curbWeightKg: 237, seatHeightMm: 820, fuelTankL: 13.2, fuelConsumptionKmL: 28.3, groundClearanceMm: 162,
    frontTire: "120/70 R17", rearTire: "160/60 R15", abs: "2-channel ABS", colors: ["Matte Ballistic Black Metallic", "Iridium Gray Metallic", "Puco Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Honda Philippines current X-ADV official specification sheet", sourceUrl: "https://www.hondaph.com/honda-bigbikes/files/products/675164fa0742a.pdf", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Honda Philippines current X-ADV official price/specification sheet", marketPriceSourceUrl: "https://www.hondaph.com/honda-bigbikes/files/products/69dca8e80ca1c.pdf", marketPriceCheckedAt: "2026-09-09", transmission: "Automatic",
    summary: "745cc parallel-twin adventure scooter with six-speed DCT, 2-channel ABS, 28.3 km/L WMTC fuel consumption and a 820 mm seat."
  },
  {
    id: "kawasaki-ninja-zx-4rr", make: "Kawasaki", makeSlug: "kawasaki", model: "Ninja ZX-4RR", slug: "ninja-zx-4rr", generation: "2026 model", category: "Sport bike",
    srp: 505000, engineCc: 401, powerHp: 76, torqueNm: 39.6, curbWeightKg: 188, seatHeightMm: 800, fuelTankL: 15, fuelConsumptionKmL: 19.6, groundClearanceMm: 135,
    frontTire: "120/70 ZR17", rearTire: "160/60 ZR17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki 2026 Ninja ZX-4RR official specification", sourceUrl: "https://www.kawasaki-lifestyle.com/en/motorcycles/ninja/ninja-zx-4rr-2026.html", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Current Philippine 2026 market listing", marketPriceSourceUrl: "https://www.carmudi.com.ph/new-motorcycles/kawasaki/ninja-zx-4rr/price/angeles/", marketPriceCheckedAt: "2026-09-09", transmission: "Manual",
    summary: "401cc inline-four supersport with approximately 76 hp, an 800 mm seat, 188 kg curb mass and 15 L fuel tank."
  },
  {
    id: "cfmoto-300sr", make: "CFMOTO", makeSlug: "cfmoto", model: "300SR", slug: "300sr", generation: "Current Philippine model", category: "Sport bike",
    srp: 165000, engineCc: 292.4, powerHp: 29, torqueNm: 25.3, curbWeightKg: 165, seatHeightMm: 780, fuelTankL: 12, groundClearanceMm: 135,
    frontTire: "110/70 R17", rearTire: "140/60 R17", abs: "Continental dual-channel ABS", colors: ["Nebula Black", "Turquoise Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "CFMOTO Philippines 300SR official product specification", sourceUrl: "https://www.cfmoto.ph/product/300sr/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Current Philippine 2026 market listing", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/cfmoto/300sr", marketPriceCheckedAt: "2026-09-09", transmission: "Manual",
    summary: "292.4cc single-cylinder sport bike with 29 hp, 25.3 Nm, a 780 mm seat and dual-channel ABS."
  },
  {
    id: "royal-enfield-shotgun-650", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Shotgun 650", slug: "shotgun-650", generation: "Current Philippine model", category: "Classic road bike",
    srp: 429000, engineCc: 648, powerHp: 46.4, torqueNm: 52.3, curbWeightKg: 240, seatHeightMm: 795, fuelTankL: 13.8, fuelConsumptionKmL: 22, groundClearanceMm: 140,
    frontTire: "100/90-18", rearTire: "150/70 R17", abs: "Dual-channel ABS", colors: ["Stencil White", "Sheet Metal Grey", "Drill Green", "Plasma Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Royal Enfield Philippines Shotgun 650 current campaign and official specification", sourceUrl: "https://www.royalenfield.com/ph/en/motorcycles/shotgun-650/campaign/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current",
    marketPriceHighPhp: 445000, marketPriceSourceLabel: "Current Philippine variant price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/royal-enfield/shotgun-650/faq/what-is-the-price-of-royal-enfield-shotgun-650", marketPriceCheckedAt: "2026-09-09", transmission: "Manual",
    summary: "648cc parallel-twin roadster with 46.4 hp, 52.3 Nm, a 795 mm seat, 13.8 L tank and modular solo-or-pillion styling."
  },


  {
    id: "honda-adv-150", alsoKnownAs: ["Honda ADV150"], make: "Honda", makeSlug: "honda", model: "ADV 150", slug: "adv-150", generation: "2019–2022 Philippine generation", category: "Adventure scooter",
    srp: 149000, engineCc: 150, powerHp: 14.35, torqueNm: 13.8, curbWeightKg: 133, seatHeightMm: 795, fuelTankL: 8, fuelConsumptionKmL: 46.6, groundClearanceMm: 165,
    frontTire: "110/80-14", rearTire: "130/70-13", abs: "Single-channel ABS with front and rear disc brakes", colors: ["Winning Red", "White", "Matte Meteorite Brown Metallic"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Honda Philippines ADV150 launch and official specification brochure", sourceUrl: "https://www.hondaph.com/cms/files/products/6050687a6e4a7.pdf", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "previous", transmission: "Automatic", successorId: "honda-adv-160",
    priceContext: "Historical Philippine launch SRP; the ADV150 is discontinued and succeeded by the ADV160.",
    summary: "Previous-generation 150cc Honda adventure scooter with a 795 mm seat, 133 kg curb weight, 8 L tank and single-channel ABS."
  },
  {
    id: "honda-cbr650r", make: "Honda", makeSlug: "honda", model: "CBR650R", slug: "cbr650r", generation: "Current Philippine model", category: "Sport bike",
    srp: 554000, marketPriceHighPhp: 594000, engineCc: 649, powerHp: 93.8, torqueNm: 63, curbWeightKg: 208, seatHeightMm: 810, fuelTankL: 15.4, fuelConsumptionKmL: 20.9, groundClearanceMm: 130,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "2-channel ABS", colors: ["Grand Prix Red", "Matte Gunpowder Black Metallic"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine CBR650R price and specification reference with Honda specification cross-check", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cbr650r/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine Standard/E-Clutch variant pricing", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cbr650r", marketPriceCheckedAt: "2026-09-09",
    summary: "649cc inline-four sport motorcycle with 2-channel ABS, 810 mm seat, 15.4 L tank and Standard/E-Clutch price range."
  },
  {
    id: "kawasaki-ninja-zx-25r", alsoKnownAs: ["Kawasaki ZX-25R", "ZX25R"], make: "Kawasaki", makeSlug: "kawasaki", model: "Ninja ZX-25R", slug: "ninja-zx-25r", generation: "Current Philippine model", category: "Sport bike",
    srp: 406000, marketPriceHighPhp: 442000, engineCc: 250, powerHp: 43.58, torqueNm: 21.2, curbWeightKg: 183, seatHeightMm: 785, fuelTankL: 15,
    frontTire: "110/70 R17", rearTire: "150/60 R17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Leisure Bikes Philippines official Ninja ZX-25R Standard specification and MSRP", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r-standard/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Kawasaki Philippines Standard/SE model pricing", marketPriceSourceUrl: "https://kawasakileisurebikes.ph/motorcycles/supersports/ninja-zx-25r/", marketPriceCheckedAt: "2026-09-09",
    summary: "250cc inline-four supersport with a 785 mm seat, 15 L tank and Philippine Standard/SE price range."
  },
  {
    id: "cfmoto-400nk", alsoKnownAs: ["CFMOTO 400 NK"], make: "CFMOTO", makeSlug: "cfmoto", model: "400NK", slug: "400nk", generation: "Current Philippine model", category: "Naked street bike",
    srp: 219000, engineCc: 400, powerHp: 40.9, torqueNm: 34.4, curbWeightKg: 206, seatHeightMm: 815, fuelTankL: 17, fuelConsumptionKmL: 27, groundClearanceMm: 150,
    frontTire: "120/70 ZR17", rearTire: "160/60 ZR17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine CFMOTO 400NK price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/cfmoto/400-nk/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "400cc parallel-twin naked motorcycle with 40.9 hp, ABS, an 815 mm seat and 17 L fuel tank."
  },
  {
    id: "yamaha-mio-i-125", alsoKnownAs: ["Yamaha Mio i125", "Mio i 125"], make: "Yamaha", makeSlug: "yamaha", model: "Mio i 125", slug: "mio-i-125", generation: "Current Philippine model", category: "Commuter scooter",
    srp: 77900, marketPriceHighPhp: 82900, engineCc: 125, powerHp: 9.3, torqueNm: 9.6, curbWeightKg: 92, seatHeightMm: 750, fuelTankL: 4.2, groundClearanceMm: 135,
    frontTire: "70/90 R14", rearTire: "80/90 R14", abs: "No ABS; front disc and rear drum brake configuration", colors: ["Yellow", "Magenta", "Matt Black", "Cyan Metallic", "Matte Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Yamaha Mio i 125 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-i-125/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "Current Philippine Standard/S variant pricing", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-i-125", marketPriceCheckedAt: "2026-09-09",
    summary: "125cc automatic commuter scooter with a 750 mm seat, 92 kg curb weight, 4.2 L tank and Standard/S price range."
  },
  {
    id: "yamaha-yzf-r15m", alsoKnownAs: ["Yamaha R15M", "YZF R15M"], make: "Yamaha", makeSlug: "yamaha", model: "YZF-R15M", slug: "yzf-r15m", generation: "Current Philippine model", category: "Sport bike",
    srp: 204000, engineCc: 155, powerHp: 19, torqueNm: 14.7, curbWeightKg: 140, seatHeightMm: 815, fuelTankL: 11, groundClearanceMm: 170,
    frontTire: "100/80 R17", rearTire: "140/70 R17", abs: "ABS with traction control", colors: ["Icon Performance"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Yamaha YZF-R15M price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/yzf-r15m/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "155cc sport motorcycle with 19 hp, ABS, traction control, an 815 mm seat and six-speed transmission."
  },
  {
    id: "yamaha-yzf-r1m", alsoKnownAs: ["Yamaha R1M", "YZF R1M"], make: "Yamaha", makeSlug: "yamaha", model: "YZF-R1M", slug: "yzf-r1m", generation: "Current Philippine model", category: "Sport bike",
    srp: 1769000, engineCc: 998, powerHp: 197, torqueNm: 113.3, curbWeightKg: 202, seatHeightMm: 860, fuelTankL: 17, fuelConsumptionKmL: 13.8, groundClearanceMm: 130,
    frontTire: "120/70 ZR17", rearTire: "200/55 ZR17", abs: "ABS", colors: ["Icon Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Yamaha YZF-R1M price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/yzf-r1m/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "998cc superbike with 197 hp, 113.3 Nm, a 17 L tank, 860 mm seat and six-speed transmission."
  },
  {
    id: "bajaj-dominar-400", alsoKnownAs: ["Kawasaki Dominar 400", "Dominar 400"], make: "Bajaj", makeSlug: "bajaj", model: "Dominar 400", slug: "dominar-400", generation: "Current Philippine model", category: "Sport touring",
    srp: 208888, engineCc: 373.3, powerHp: 39.5, torqueNm: 35, curbWeightKg: 192, seatHeightMm: 800, fuelTankL: 13, groundClearanceMm: 157,
    frontTire: "110/70 R17", rearTire: "150/60 R17", abs: "Twin-channel ABS", colors: ["Aurora Green", "Charcoal Black", "Canyon Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Bajaj Auto Philippines official Dominar D400 specification page with current Philippine price cross-check", sourceUrl: "https://www.bajajauto.com/en-ph/bikes/dominar-d400", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine comparison-site price", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/bajaj/dominar-400", marketPriceCheckedAt: "2026-09-09",
    summary: "373.3cc sport-touring motorcycle with a six-speed gearbox, twin-channel ABS, 13 L tank and 800 mm seat."
  },


  {
    id: "yamaha-yzf-r7", alsoKnownAs: ["Yamaha R7", "YZF R7"], make: "Yamaha", makeSlug: "yamaha", model: "YZF-R7", slug: "yzf-r7", generation: "Current Philippine model", category: "Sport bike",
    srp: 598000, engineCc: 689, powerHp: 72, torqueNm: 67, curbWeightKg: 188, seatHeightMm: 855, fuelTankL: 13, fuelConsumptionKmL: 23.8, groundClearanceMm: 135,
    frontTire: "120/70 ZR17", rearTire: "180/55 ZR17", abs: "ABS", colors: ["Black", "Race Blue", "Anniversary White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Yamaha YZF-R7 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/yzf-r7/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine YZF-R7 SRP reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/yzf-r7", marketPriceCheckedAt: "2026-09-09",
    summary: "689cc sport motorcycle with 72 hp, 67 Nm, ABS, a 855 mm seat, 13 L tank and six-speed manual transmission."
  },
  {
    id: "kawasaki-ninja-1000", alsoKnownAs: ["Kawasaki Ninja 1000SX", "Ninja 1000SX"], make: "Kawasaki", makeSlug: "kawasaki", model: "Ninja 1000SX", slug: "ninja-1000", generation: "Current Philippine model", category: "Sport touring",
    srp: 718000, engineCc: 1043, powerHp: 142, torqueNm: 111, curbWeightKg: 234, seatHeightMm: 820, fuelTankL: 19, groundClearanceMm: 135,
    frontTire: "120/70 ZR17", rearTire: "190/50 ZR17", abs: "ABS with traction-control rider aids", colors: ["Green"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Leisure Bikes Philippines official Ninja 1000SX specification and MSRP", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/sports/ninja-1000/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Kawasaki Philippines current MSRP", marketPriceSourceUrl: "https://kawasakileisurebikes.ph/motorcycles/sports/ninja-1000/", marketPriceCheckedAt: "2026-09-09",
    summary: "1043cc inline-four sport-tourer with 142 hp, 111 Nm, a 19 L tank, 820 mm seat and six-speed manual transmission."
  },
  {
    id: "kawasaki-z1000-r-edition", make: "Kawasaki", makeSlug: "kawasaki", model: "Z1000 R Edition", slug: "z1000-r-edition", generation: "Current Philippine model", category: "Naked street bike",
    srp: 710000, engineCc: 1043, powerHp: 142, torqueNm: 111, curbWeightKg: 221, seatHeightMm: 815, fuelTankL: 17, fuelConsumptionKmL: 15, groundClearanceMm: 125,
    frontTire: "120/70 ZR17", rearTire: "190/50 ZR17", abs: "ABS with Brembo braking hardware", colors: ["Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Leisure Bikes Philippines official Z1000 R Edition specification and MSRP", sourceUrl: "https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Kawasaki Philippines current MSRP", marketPriceSourceUrl: "https://www.kawasakileisurebikes.ph/motorcycles/sports/z100r/", marketPriceCheckedAt: "2026-09-09",
    summary: "1043cc inline-four naked motorcycle with 142 hp, 111 Nm, ABS, a 17 L tank and 815 mm seat height."
  },
  {
    id: "keeway-cafe-racer-152", make: "Keeway", makeSlug: "keeway", model: "Cafe Racer 152", slug: "cafe-racer-152", generation: "Current Philippine model", category: "Cafe racer",
    srp: 69900, engineCc: 149, powerHp: 11.3, torqueNm: 11.1, curbWeightKg: 108, seatHeightMm: 770, fuelTankL: 12.1, groundClearanceMm: 160,
    frontTire: "3.00-17", rearTire: "110/80-17", abs: "ABS is not stated in the manufacturer specification; front disc and rear drum brakes are listed", colors: ["Black", "Silver"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Keeway official Cafe Racer 152 specification with current Philippine price cross-check", sourceUrl: "https://www.keeway.com/int-en/products/cafe-racer-152", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine Cafe Racer 152 SRP reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/keeway/cafe-racer-152", marketPriceCheckedAt: "2026-09-09",
    summary: "149cc retro cafe racer with a five-speed manual gearbox, 770 mm seat, 12.1 L tank and spoke wheels."
  },
  {
    id: "honda-cbr150r", make: "Honda", makeSlug: "honda", model: "CBR150R", slug: "cbr150r", generation: "Current Philippine model", category: "Sport bike",
    srp: 183900, engineCc: 149, powerHp: 16, torqueNm: 13.7, curbWeightKg: 135, seatHeightMm: 787, fuelTankL: 12, fuelConsumptionKmL: 41.5, groundClearanceMm: 166,
    frontTire: "100/80 R17", rearTire: "130/70 R17", abs: "No ABS confirmed for the current Standard variant; front and rear disc brakes", colors: ["Winning Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Honda CBR150R price, specification and color reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cbr150r/specifications", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine CBR150R SRP reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cbr150r", marketPriceCheckedAt: "2026-09-09",
    summary: "149cc six-speed sport motorcycle with 16 hp, a 787 mm seat, 12 L fuel tank and current Winning Red color listing."
  },

  {
    id: "ktm-rc-390", alsoKnownAs: ["KTM RC390"], make: "KTM", makeSlug: "ktm", model: "RC 390", slug: "rc-390", generation: "2022 model in current Philippine catalog", category: "Sport bike",
    srp: 335000, engineCc: 373, powerHp: 43.5, torqueNm: 37, curbWeightKg: 170, seatHeightMm: 824, fuelTankL: 13.7, groundClearanceMm: 158,
    frontTire: "110/70 ZR17", rearTire: "150/60 ZR17", abs: "Cornering ABS with Supermoto mode", colors: ["Blue", "Orange"], searchVolume: 10000, keywordDifficulty: 0,
    sourceLabel: "KTM Philippines official RC 390 model page and technical specification", sourceUrl: "https://www.ktm.com/en-ph/models/supersport/2022-ktm-rc-390.html", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "KTM Philippines official base price", marketPriceSourceUrl: "https://www.ktm.com/en-ph/models/supersport/2022-ktm-rc-390.html", marketPriceCheckedAt: "2026-09-09",
    summary: "373cc single-cylinder sport motorcycle with 43.5 hp, 37 Nm, cornering ABS, a 824 mm seat and six-speed transmission."
  },
  {
    id: "honda-gold-wing", alsoKnownAs: ["Honda Goldwing", "Gold Wing 1800"], make: "Honda", makeSlug: "honda", model: "Gold Wing", slug: "gold-wing", generation: "Current Philippine listing", category: "Luxury touring",
    srp: 2050000, marketPriceHighPhp: 2100000, engineCc: 1833, powerHp: 125.3, torqueNm: 171, curbWeightKg: 385, seatHeightMm: 745, fuelTankL: 21.1, groundClearanceMm: 130,
    frontTire: "130/70 R18", rearTire: "200/55 R16", abs: "Dual combined ABS; airbag equipment depends on variant", colors: [], searchVolume: 5100, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Honda Gold Wing specification and variant reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/gold-wing/standard", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "Current Philippine Standard and 50th Anniversary DCT pricing", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/gold-wing/standard", marketPriceCheckedAt: "2026-09-09",
    summary: "1833cc flat-six luxury tourer with seven-speed DCT, 171 Nm, integrated luggage, a 745 mm seat and variant-dependent airbag equipment."
  },
  {
    id: "honda-rebel-1100", alsoKnownAs: ["Honda Rebel1100"], make: "Honda", makeSlug: "honda", model: "Rebel 1100", slug: "rebel-1100", generation: "Current Philippine listing", category: "Cruiser",
    srp: 665000, engineCc: 1083, powerHp: 85.8, torqueNm: 98, curbWeightKg: 233, seatHeightMm: 690, fuelTankL: 13.6, groundClearanceMm: 120,
    frontTire: "130/70 R18", rearTire: "180/70 R16", abs: "Dual-channel ABS with traction-control rider aids", colors: ["Gunmetal Black Metallic"], searchVolume: 3500, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Honda Rebel 1100 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/rebel-1100", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "Current Philippine Rebel 1100 starting-price reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/rebel-1100", marketPriceCheckedAt: "2026-09-09",
    summary: "1083cc parallel-twin cruiser with six-speed DCT, 98 Nm, cruise control, a low 690 mm seat and dual-channel ABS."
  },
  {
    id: "honda-rebel-500", alsoKnownAs: ["Honda Rebel", "Honda CMX500 Rebel"], make: "Honda", makeSlug: "honda", model: "Rebel 500", slug: "rebel-500", generation: "Current Philippine listing", category: "Cruiser",
    srp: 399000, engineCc: 471, powerHp: 45.5, torqueNm: 43.3, curbWeightKg: 191, seatHeightMm: 690, fuelTankL: 11.2, fuelConsumptionKmL: 27, groundClearanceMm: 124,
    frontTire: "130/90-16", rearTire: "150/80-16", abs: "Dual-channel ABS", colors: ["Matte Gunpowder Black Metallic"], searchVolume: 3400, keywordDifficulty: 0,
    sourceLabel: "Current Philippine Honda Rebel 500 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/rebel", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine Rebel 500 SRP reference", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/rebel", marketPriceCheckedAt: "2026-09-09",
    summary: "471cc parallel-twin cruiser with a six-speed gearbox, dual-channel ABS, low 690 mm seat and 11.2 L fuel tank."
  },

  {
    id: "zontes-400g", alsoKnownAs: ["Bristol Zontes 400G", "Bristol 400G"], make: "Zontes", makeSlug: "zontes", model: "400G", slug: "400g", generation: "2026 Philippine model", category: "Adventure maxi scooter",
    srp: 408800, engineCc: 400, powerHp: 38, torqueNm: 40, curbWeightKg: 203, seatHeightMm: 770, fuelTankL: 17.5, groundClearanceMm: 180,
    frontTire: "110/70-17", rearTire: "150/70-14", abs: "Dual-channel ABS with traction control", colors: ["Gray", "Black", "Green", "White"], searchVolume: 7000, keywordDifficulty: 0,
    sourceLabel: "2026 Philippine Zontes 400G launch and locally published specification cross-check", sourceUrl: "https://lifestyleonwheels.com/the-digital-nomads-shield-the-zontes-400g-safe-ride-journey-feature/", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    marketPriceSourceLabel: "2026 Zontes 400G Philippine launch price", marketPriceSourceUrl: "https://trafficnetworkph.com/2026-zontes-400g-launches-in-the-philippines/", marketPriceCheckedAt: "2026-09-09",
    summary: "400cc CVT adventure maxi scooter with 38 hp, 40 Nm, 203 kg curb weight, a 770 mm seat, 17.5 L tank, dual-channel ABS and traction control."
  },
  {
    id: "kawasaki-ninja-h2", alsoKnownAs: ["Kawasaki H2", "Ninja H2 Carbon"], make: "Kawasaki", makeSlug: "kawasaki", model: "Ninja H2", slug: "ninja-h2", generation: "2026 Carbon Philippine listing", category: "Hypersport",
    srp: 1917200, engineCc: 998, powerHp: 197.4, torqueNm: 133.5, curbWeightKg: 237, seatHeightMm: 825, fuelTankL: 17, groundClearanceMm: 130,
    frontTire: "120/70 R17", rearTire: "200/55 R17", abs: "KIBS ABS with traction control and launch-control equipment", colors: ["Mirror Coated Matte Spark Black / Candy Flat Blazed Green"], searchVolume: 6400, keywordDifficulty: 0,
    sourceLabel: "2026 Kawasaki Ninja H2 Carbon specification with Philippine-market cross-check", sourceUrl: "https://www.kawasaki.com/en-us/motorcycle/ninja/hypersport/ninja-h2/2026-ninja-h2-carbon-abs", verifiedAt: "2026-09-09", freshness: "verified", marketStatus: "current", transmission: "Manual",
    marketPriceSourceLabel: "Current Philippine Ninja H2 Carbon price", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/kawasaki/ninja-h2/price", marketPriceCheckedAt: "2026-09-09",
    summary: "998cc supercharged hypersport motorcycle with 197.4 hp, 133.5 Nm, 237 kg curb weight, an 825 mm seat and KIBS ABS."
  },

];

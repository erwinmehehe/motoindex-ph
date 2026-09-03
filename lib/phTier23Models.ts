import type { Motorcycle } from "./types";

// MotoIndex PH v2.6.1 — deliberate Philippines-first expansion.
// These are current, source-backed anchor models for Tier 2 and Tier 3 brands.
// Search-volume fields remain zero until measured keyword data is imported; we do not invent SEO volume.
const verifiedAt = "2026-08-27";

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
    sourceLabel: "Zigwheels Philippines current MotorStar Cafe 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/cafe-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "397.2cc retro road bike with a six-speed manual gearbox, 13 L tank and 19/18-inch wheels."
  },
  {
    id: "motorstar-xplorer-250r", make: "MotorStar", makeSlug: "motorstar", model: "Xplorer 250R", slug: "xplorer-250r", generation: "Current", category: "Adventure touring",
    srp: 69000, engineCc: 249.6, powerHp: 22.12, torqueNm: 22.5, curbWeightKg: 146, seatHeightMm: 795, fuelTankL: 16, fuelConsumptionKmL: 32.5, groundClearanceMm: 210,
    frontTire: "100/90-18", rearTire: "130/80-17", abs: "ABS is not listed in the referenced Philippine specification", colors: ["Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 MotorStar Xplorer 250R price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/motorstar/xplorer-250r/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
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
    sourceLabel: "Zigwheels Philippines current Kymco KRV 180i TCS price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/kymco/krv-180i-tcs", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "175cc premium sport scooter with ABS, traction control and 13-inch tires."
  },

  {
    id: "sym-jet-x150", make: "SYM", makeSlug: "sym", model: "Jet X150", slug: "jet-x150", generation: "Current", category: "Sport scooter",
    srp: 135800, engineCc: 150, powerHp: 12.3, torqueNm: 12, curbWeightKg: 140, seatHeightMm: 780, fuelTankL: 7.5, fuelConsumptionKmL: 60, groundClearanceMm: 107,
    frontTire: "100/90-14", rearTire: "110/80-14", abs: "ABS", colors: ["Red", "Grey", "White", "Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current SYM Jet X150 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/sym/jet-x150", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "150cc sport scooter with ABS, 14-inch wheels, 780 mm seat height and a 7.5 L fuel tank."
  },
  {
    id: "sym-cruisym-150", make: "SYM", makeSlug: "sym", model: "Cruisym 150", slug: "cruisym-150", generation: "Current", category: "Maxi-style scooter",
    srp: 103800, engineCc: 150, powerHp: 12, torqueNm: 12, curbWeightKg: 130.5, seatHeightMm: 820, fuelTankL: 7.5, fuelConsumptionKmL: 60, groundClearanceMm: 110,
    frontTire: "100/90-14", rearTire: "110/80-14", abs: "Variant-dependent; Dual ABS variant listed", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current SYM Cruisym 150 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/sym/cruisym-150/specifications", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 108800, transmission: "Automatic",
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
    sourceLabel: "Carmudi Philippines current Bristol ADX 160 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/bristol/adx-160/standard/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "155cc adventure-style automatic scooter with a 790 mm seat, 11 L tank and mixed 14/13-inch wheel setup."
  },
  {
    id: "bristol-maxie-400", make: "Bristol", makeSlug: "bristol", model: "Maxie 400", slug: "maxie-400", generation: "Current", category: "Maxi scooter",
    srp: 368000, engineCc: 377, powerHp: 29.1, torqueNm: 33.5, curbWeightKg: 208, seatHeightMm: 730, fuelTankL: 17.4, fuelConsumptionKmL: 25, groundClearanceMm: 170,
    frontTire: "120/70-14", rearTire: "150/70-13", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Bristol Maxie 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/bristol/maxie-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "377cc maxi scooter with ABS, a low published 730 mm seat height and a 17.4 L fuel tank."
  },

  {
    id: "benelli-180s", make: "Benelli", makeSlug: "benelli", model: "180S", slug: "180s", generation: "Current", category: "Naked street bike",
    srp: 129900, engineCc: 175.3, powerHp: 17.8, torqueNm: 14, curbWeightKg: 185, seatHeightMm: 810, fuelTankL: 10, fuelConsumptionKmL: 45, groundClearanceMm: 170,
    frontTire: "100/80-17", rearTire: "130/70-17", abs: "Disc brakes; ABS is not listed in the referenced specification", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Benelli 180S price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/180s/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "175.3cc naked street motorcycle with a six-speed manual transmission, 17-inch tires and a 10 L tank."
  },
  {
    id: "benelli-trk-502x", make: "Benelli", makeSlug: "benelli", model: "TRK 502X", slug: "trk-502x", generation: "Current", category: "Adventure touring",
    srp: 399000, engineCc: 500, powerHp: 47, torqueNm: 46, curbWeightKg: 213, seatHeightMm: 840, fuelTankL: 20, fuelConsumptionKmL: 20, groundClearanceMm: 220,
    frontTire: "110/80-19", rearTire: "150/70-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Benelli TRK 502X price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/benelli/trk502x/standard", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "500cc adventure-touring motorcycle with ABS, 19/17-inch wheels, 220 mm ground clearance and a 20 L tank."
  },

  {
    id: "ktm-390-duke", make: "KTM", makeSlug: "ktm", model: "390 Duke", slug: "390-duke", generation: "Current", category: "Naked street bike",
    srp: 289000, engineCc: 373, powerHp: 43, torqueNm: 37, curbWeightKg: 139, seatHeightMm: 800, fuelTankL: 11, fuelConsumptionKmL: 28, groundClearanceMm: 170,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: ["White", "Orange"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current KTM 390 Duke price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/duke-390/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc naked street bike with 43 hp, ABS, 17-inch tires and a six-speed manual transmission."
  },
  {
    id: "ktm-390-adventure", make: "KTM", makeSlug: "ktm", model: "390 Adventure", slug: "390-adventure", generation: "Current", category: "Adventure touring",
    srp: 338000, engineCc: 373, powerHp: 43, torqueNm: 37, curbWeightKg: 158, seatHeightMm: 830, fuelTankL: 14.5, groundClearanceMm: 160,
    frontTire: "100/90-19", rearTire: "130/80-17", abs: "ABS with off-road mode and traction-control equipment", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current KTM 390 Adventure price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/ktm/390-adventure", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc adventure motorcycle with 19/17-inch wheels, a 14.5 L tank and electronic rider aids."
  },

  {
    id: "royal-enfield-hunter-350", make: "Royal Enfield", makeSlug: "royal-enfield", model: "Hunter 350", slug: "hunter-350", generation: "Current", category: "Classic road bike",
    srp: 231000, engineCc: 349, powerHp: 20.2, torqueNm: 27, curbWeightKg: 181, seatHeightMm: 790, fuelTankL: 13, fuelConsumptionKmL: 36,
    frontTire: "110/70-17", rearTire: "140/70-17", abs: "Dual-channel ABS on current Metro configuration", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Royal Enfield Hunter 350 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/royal-enfield/hunter-350", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
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
    sourceLabel: "Zigwheels Philippines current BMW G 310 GS price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/bmw/g-310/gs", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "313cc entry adventure motorcycle with ABS, 19/17-inch wheels and a published 835 mm seat height."
  },
  {
    id: "bmw-c-400-gt", make: "BMW Motorrad", makeSlug: "bmw-motorrad", model: "C 400 GT", slug: "c-400-gt", generation: "Current", category: "Maxi scooter",
    srp: 595000, engineCc: 350, powerHp: 34, torqueNm: 35, curbWeightKg: 219, seatHeightMm: 775, fuelTankL: 12.8,
    frontTire: "120/70-15", rearTire: "150/70-14", abs: "BMW Motorrad ABS Pro with traction-control equipment", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "BMW Motorrad Philippines C 400 GT technical data with current Philippines price cross-check", sourceUrl: "https://www.bmwmotorrad.com.ph/en/models/urban_mobility/c400gt/technicaldata.html", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "350cc premium maxi scooter with a 775 mm seat, 12.8 L tank and BMW ABS/traction-control rider aids."
  },

  {
    id: "ducati-monster-937-plus", make: "Ducati", makeSlug: "ducati", model: "Monster 937 Plus", slug: "monster-937-plus", generation: "Current", category: "Naked street bike",
    srp: 875000, engineCc: 937, powerHp: 111, torqueNm: 93, curbWeightKg: 188, seatHeightMm: 820, fuelTankL: 14,
    frontTire: "120/70ZR17", rearTire: "180/55ZR17", abs: "Cornering ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Carmudi Philippines current Ducati Monster 937 Plus price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/monster-937-plus/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "937cc naked sport motorcycle with 111 hp, a six-speed transmission and a modern electronic rider-aid package."
  },
  {
    id: "ducati-scrambler-nightshift", make: "Ducati", makeSlug: "ducati", model: "Scrambler Nightshift", slug: "scrambler-nightshift", generation: "Current", category: "Modern classic",
    srp: 785000, engineCc: 803, powerHp: 73, torqueNm: 65.2, curbWeightKg: 196, seatHeightMm: 798, fuelTankL: 13.5,
    frontTire: "110/80R18", rearTire: "180/55R17", abs: "Cornering ABS with traction-control rider aids", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Carmudi Philippines current Ducati Scrambler Nightshift price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/ducati/scrambler-nightshift/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "803cc modern-classic motorcycle with a 798 mm seat, mixed 18/17-inch wheels and Ducati electronic rider aids."
  },

  {
    id: "triumph-speed-400", make: "Triumph", makeSlug: "triumph", model: "Speed 400", slug: "speed-400", generation: "Current", category: "Modern classic",
    srp: 299000, engineCc: 398, powerHp: 39, torqueNm: 37.5, curbWeightKg: 170, seatHeightMm: 790, fuelTankL: 13,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Triumph Speed 400 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/triumph/speed-400/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "398cc roadster with 39 hp, a 790 mm seat, 13 L tank and six-speed manual transmission."
  },
  {
    id: "triumph-scrambler-400-x", make: "Triumph", makeSlug: "triumph", model: "Scrambler 400 X", slug: "scrambler-400-x", generation: "Current", category: "Scrambler",
    srp: 339000, engineCc: 398, powerHp: 39, torqueNm: 37.5, curbWeightKg: 179, seatHeightMm: 835, fuelTankL: 13, fuelConsumptionKmL: 28.5, groundClearanceMm: 195,
    frontTire: "100/90-19", rearTire: "140/80-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Triumph Scrambler 400 X price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/triumph/scrambler-400-x/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "398cc scrambler with a 19-inch front wheel, 835 mm seat, 13 L tank and six-speed gearbox."
  },

  {
    id: "vespa-primavera-150", make: "Vespa", makeSlug: "vespa", model: "Primavera 150", slug: "primavera-150", generation: "Current", category: "Retro scooter",
    srp: 210000, engineCc: 155, powerHp: 12.7, torqueNm: 12.8, curbWeightKg: 130, seatHeightMm: 790, fuelTankL: 7,
    frontTire: "110/70-12", rearTire: "120/70-12", abs: "Front-wheel ABS on the current 150-class configuration", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Vespa Primavera price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/vespa/primavera/specifications", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 235000, transmission: "Automatic",
    summary: "155cc classic Vespa scooter with CVT transmission, a 790 mm seat and 12-inch tubeless wheels."
  },
  {
    id: "vespa-sprint-150", make: "Vespa", makeSlug: "vespa", model: "Sprint 150", slug: "sprint-150", generation: "Current", category: "Retro scooter",
    srp: 230000, engineCc: 155, powerHp: 12.7, torqueNm: 12.8, curbWeightKg: 132, seatHeightMm: 790, fuelTankL: 8,
    frontTire: "110/70-12", rearTire: "120/70-12", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Carmudi Philippines 2026 Vespa Sprint price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/vespa/sprint/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 275000, transmission: "Automatic",
    summary: "155cc premium retro scooter with CVT transmission, ABS and a 790 mm seat; current Philippine listings span multiple trims."
  },

  {
    id: "aprilia-sr-gt-200", make: "Aprilia", makeSlug: "aprilia", model: "SR GT 200", slug: "sr-gt-200", generation: "Current", category: "Adventure scooter",
    srp: 248000, engineCc: 174, powerHp: 17.4, torqueNm: 16.5, curbWeightKg: 148, seatHeightMm: 799, fuelTankL: 9,
    frontTire: "110/80-14", rearTire: "130/70-13", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Carmudi Philippines 2026 Aprilia SR GT price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/aprilia/sr-gt/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", marketPriceHighPhp: 258000, transmission: "Automatic",
    summary: "174cc adventure-style scooter with ABS, a 799 mm seat and mixed 14/13-inch road tires."
  },
  {
    id: "aprilia-rs-457", make: "Aprilia", makeSlug: "aprilia", model: "RS 457", slug: "rs-457", generation: "Current", category: "Sport bike",
    srp: 348000, engineCc: 457, powerHp: 47.6, torqueNm: 43.5, curbWeightKg: 175, seatHeightMm: 800, fuelTankL: 13,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "Dual-channel ABS with rider-aid electronics", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Aprilia RS 457 price/specification reference with Aprilia technical cross-check", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/aprilia/rs-457/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "457cc parallel-twin sport motorcycle with 47.6 hp, a six-speed manual transmission and dual-channel ABS."
  },

  {
    id: "husqvarna-svartpilen-401", make: "Husqvarna", makeSlug: "husqvarna", model: "Svartpilen 401", slug: "svartpilen-401", generation: "Current", category: "Scrambler",
    srp: 295000, engineCc: 373, powerHp: 44, torqueNm: 37, curbWeightKg: 152, seatHeightMm: 835, fuelTankL: 9.5, fuelConsumptionKmL: 29, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines current Husqvarna Svartpilen 401 price and specification reference", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/husqvarna/svartpilen-401/specifications", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc scrambler-style road bike with 44 hp, ABS and a six-speed manual transmission."
  },
  {
    id: "husqvarna-vitpilen-401", make: "Husqvarna", makeSlug: "husqvarna", model: "Vitpilen 401", slug: "vitpilen-401", generation: "Current", category: "Cafe roadster",
    srp: 315000, engineCc: 373, powerHp: 44, torqueNm: 37, curbWeightKg: 151, seatHeightMm: 835, fuelTankL: 9.5, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Carmudi Philippines current Husqvarna Vitpilen 401 price and specification reference", sourceUrl: "https://www.carmudi.com.ph/new-motorcycles/husqvarna/vitpilen-401/specifications/", verifiedAt, freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "373cc cafe-style roadster with 44 hp, ABS, 17-inch tires and a six-speed manual transmission."
  }
];

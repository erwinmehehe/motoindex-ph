import type { AccessoryCategory, Comparison, FitmentRecommendation, HelmetBrand, Motorcycle, RecommendationGuide } from "./types";
import { getTopBoxFitmentsForModel } from "./topBoxFitment";
import { modelSourceNeedsRefresh } from "./freshnessPolicy";
import { observedMarketRange } from "./marketChecks";
import { phTier23Motorcycles } from "./phTier23Models";
import { isAuthorityExpansionModel, modelAuthorityQuality } from "./modelQuality";
import { evaluateMotorcycle } from "./decisionEngine";

export const motorcycles: Motorcycle[] = [
  {
    id: "yamaha-aerox-v3",
    make: "Yamaha",
    makeSlug: "yamaha",
    model: "Aerox V3",
    slug: "aerox-v3",
    generation: "V3",
    marketStatus: "current",
    category: "Sport scooter",
    srp: 125900,
    engineCc: 155,
    powerHp: 15.4,
    torqueNm: 14.2,
    curbWeightKg: 124,
    seatHeightMm: 790,
    fuelTankL: 5.5,
    frontTire: "110/80-14",
    rearTire: "140/70-14",
    abs: "Variant-dependent; SP listings include ABS and traction control",
    colors: ["Black", "Race Blu", "Glaze Blue"],
    searchVolume: 41000,
    keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Aerox variant price and specification reference",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceHighPhp: 163900,
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-aerox/price",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "155cc automatic sport scooter with a 790 mm seat, 124 kg curb weight and Standard/SP variants."
  },
  {
    id: "yamaha-nmax-v3",
    make: "Yamaha",
    makeSlug: "yamaha",
    model: "NMAX V3",
    slug: "nmax-v3",
    generation: "V3",
    marketStatus: "current",
    category: "Premium scooter",
    srp: 155900,
    engineCc: 155,
    powerHp: 15.1,
    torqueNm: 14.2,
    curbWeightKg: 131,
    seatHeightMm: 770,
    fuelTankL: 7.1,
    frontTire: "110/70-13",
    rearTire: "130/70-13",
    abs: "Dual-channel ABS",
    colors: ["Black", "Light Grey", "Black Gold", "Dark Magma"],
    searchVolume: 14000,
    keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 NMAX variant price and specification reference",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/nmax",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceHighPhp: 175900,
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/nmax",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "155cc maxi-scooter with a 770 mm seat, 135 kg curb weight and Standard/Tech Max variants."
  },
  {
    id: "yamaha-aerox-v2",
    make: "Yamaha",
    makeSlug: "yamaha",
    model: "Aerox V2",
    slug: "aerox-v2",
    generation: "2021 generation",
    category: "Sport scooter",
    srp: 112900,
    engineCc: 155,
    powerHp: 15.4,
    torqueNm: 13.9,
    curbWeightKg: 125,
    seatHeightMm: 790,
    fuelTankL: 5.5,
    frontTire: "110/80-14",
    rearTire: "140/70-14",
    abs: "Variant-dependent",
    colors: ["Race Blu", "Red", "Dark Gray", "Black Raven (S)"],
    searchVolume: 20000,
    keywordDifficulty: 8,
    sourceLabel: "Webike Philippines 2021 Mio Aerox launch announcement with SRP and specifications",
    sourceUrl: "https://www.webike.ph/ph_news/latest-news/20210304-yamaha-philippines-releases-the-2021-mio-aerox/",
    verifiedAt: "2026-09-05",
    freshness: "verified",
    marketStatus: "previous",
    priceContext: "Historical 2021 Philippine launch SRP for the standard variant",
    successorId: "yamaha-aerox-v3",
    summary: "Previous Aerox generation commonly called V2 in the Philippines, with historical launch pricing kept separate from the current V3."
  },
  {
    id: "yamaha-nmax-v2",
    make: "Yamaha",
    makeSlug: "yamaha",
    model: "NMAX V2",
    slug: "nmax-v2",
    generation: "2020–2021 generation",
    category: "Premium scooter",
    srp: 119900,
    engineCc: 155,
    powerHp: 15.4,
    torqueNm: 13.9,
    curbWeightKg: 129,
    seatHeightMm: 765,
    fuelTankL: 7.1,
    frontTire: "110/70-13",
    rearTire: "130/70-13",
    abs: "Variant-dependent",
    colors: ["Midnight Black", "Phantom Blue", "Tech Camo", "Matte Red"],
    searchVolume: 13000,
    keywordDifficulty: 0,
    sourceLabel: "2020 Philippine launch pricing and 2021 owner-manual specifications",
    sourceUrl: "https://www.motopinas.com/motorcycle-news/yamaha-officially-launches-the-new-nmax-starting-at-php119-900.html",
    verifiedAt: "2026-09-05",
    freshness: "verified",
    marketStatus: "previous",
    priceContext: "Historical Philippine launch SRP for the standard variant",
    successorId: "yamaha-nmax-v3",
    summary: "Previous NMAX generation commonly called V2 in the Philippines, with historical price, specifications and tire sizes kept separate from the current V3."
  },
  {
    id: "honda-adv-160",
    make: "Honda",
    makeSlug: "honda",
    model: "ADV 160",
    slug: "adv-160",
    generation: "Current",
    marketStatus: "current",
    category: "Adventure scooter",
    srp: 167400,
    engineCc: 157,
    powerHp: 15.8,
    torqueNm: 14.7,
    curbWeightKg: 133,
    seatHeightMm: 780,
    fuelTankL: 8.1,
    fuelConsumptionKmL: 45.0,
    groundClearanceMm: 165,
    frontTire: "110/80-14",
    rearTire: "130/70-13",
    abs: "ABS with HSTC",
    colors: ["Matte Gunpowder Black Metallic", "Pearl Fadeless White", "Matte Sabre Green Metallic", "Matte Pearl Crater White", "Quartz Brown Metallic"],
    searchVolume: 13000,
    keywordDifficulty: 0,
    sourceLabel: "Honda Philippines 2026 ADV160 features and current ABS/RoadSync catalog naming",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/experience-the-suv-pride-with-the-adv160",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceHighPhp: 174900,
    marketPriceSourceLabel: "Traffic Network PH / Honda Philippines official release",
    marketPriceSourceUrl: "https://trafficnetworkph.com/ride-the-suv-pride-the-new-honda-adv160/",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "157cc adventure-style scooter with a 780 mm seat, 133 kg curb weight and current ABS/RoadSync variants."
  },
  {
    id: "honda-click-160",
    make: "Honda",
    makeSlug: "honda",
    model: "Click 160",
    slug: "click-160",
    generation: "Current",
    marketStatus: "current",
    category: "Commuter scooter",
    srp: 116900,
    engineCc: 157,
    powerHp: 15.2,
    torqueNm: 13.8,
    curbWeightKg: 116,
    seatHeightMm: 778,
    fuelTankL: 5.5,
    fuelConsumptionKmL: 46.7,
    frontTire: "100/80-14",
    rearTire: "120/70-14",
    abs: "Combined Braking System (CBS)",
    colors: ["Matte Gunpowder Black Metallic", "Matte Solar Red Metallic", "Matte Cosmo Silver Metallic"],
    searchVolume: 11000,
    keywordDifficulty: 0,
    sourceLabel: "Honda Philippines Click160 specification reference with Zigwheels Philippines 2026 market-price cross-check",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/ready-to-take-on-the-world-step-up-your-game-with-a-sportier-and-more-stylish-the-new-click160",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/click-160",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "157cc automatic scooter weighing 116 kg, with a 778 mm seat and 5.5 L fuel tank."
  },
  {
    id: "honda-click-150i",
    make: "Honda",
    makeSlug: "honda",
    model: "Click 150i",
    slug: "click-150i",
    generation: "2018–2022 generation",
    marketStatus: "previous",
    category: "Commuter scooter",
    srp: 95900,
    engineCc: 150,
    powerHp: 13.0,
    torqueNm: 13.4,
    curbWeightKg: 113,
    seatHeightMm: 769,
    fuelTankL: 5.5,
    fuelConsumptionKmL: 52,
    groundClearanceMm: 132,
    frontTire: "90/80-14",
    rearTire: "100/80-14",
    abs: "Combined Braking System (CBS); no ABS asserted for this generation",
    colors: ["Matte Gunpowder Black Metallic", "Matte Solar Red Metallic", "Matte Crypton Silver Metallic", "Pearl Fadeless White"],
    searchVolume: 1700,
    keywordDifficulty: 0,
    sourceLabel: "Honda Philippines 2018 Click150i launch reference; archived Philippine road-test specifications cross-check",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/honda-unleashes-game-changing-models-click125i-click150i",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    priceContext: "Historical introductory Philippine launch SRP from Honda Philippines (2018)",
    transmission: "Automatic",
    successorId: "honda-click-160",
    summary: "Previous 150cc Click generation launched in the Philippines in 2018 and succeeded by the Click160 in 2022; historical launch pricing is kept separate from current Click160 pricing."
  },
  {
    id: "honda-pcx-160",
    make: "Honda",
    makeSlug: "honda",
    model: "PCX 160",
    slug: "pcx-160",
    generation: "Current",
    marketStatus: "current",
    category: "Premium scooter",
    srp: 133400,
    engineCc: 157,
    powerHp: 15.8,
    torqueNm: 14.7,
    curbWeightKg: 131,
    seatHeightMm: 764,
    fuelTankL: 8.1,
    fuelConsumptionKmL: 46.0,
    frontTire: "110/70-14",
    rearTire: "130/70-13",
    abs: "CBS (Standard); ABS + HSTC (RoadSync)",
    colors: ["Vortex Red Metallic", "Pearl Fadeless White", "Matte Bullet Silver", "Matte Gunpowder Black Metallic"],
    searchVolume: 8300,
    keywordDifficulty: 0,
    sourceLabel: "Honda Philippines All-New PCX160 current Standard/RoadSync variant reference",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceHighPhp: 154900,
    marketPriceSourceLabel: "Honda Philippines",
    marketPriceSourceUrl: "https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "157cc maxi-scooter with a 764 mm seat, 132 kg curb weight and Standard/RoadSync variants."
  },
  {
    id: "yamaha-fazzio",
    make: "Yamaha",
    makeSlug: "yamaha",
    model: "Fazzio",
    slug: "fazzio",
    generation: "Current",
    marketStatus: "current",
    category: "Lifestyle scooter",
    srp: 93900,
    engineCc: 125,
    powerHp: 8.2,
    torqueNm: 9.9,
    curbWeightKg: 95,
    seatHeightMm: 750,
    fuelTankL: 5.1,
    frontTire: "110/70-12",
    rearTire: "110/70-12",
    abs: "No ABS",
    colors: ["Mint", "Ivory", "Black"],
    searchVolume: 7600,
    keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Mio Fazzio price and specification page",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-fazzio",
    verifiedAt: "2026-08-25",
    freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-fazzio",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "125cc automatic scooter with a 750 mm seat, 95 kg curb weight and 12-inch wheels."
  },
  {
    id: "honda-crf150l",
    make: "Honda",
    makeSlug: "honda",
    model: "CRF150L",
    slug: "crf150l",
    generation: "Current CRF150L reference",
    category: "Dual-sport",
    srp: 147900,
    engineCc: 149,
    powerHp: 12.24,
    torqueNm: 11.94,
    curbWeightKg: 122,
    seatHeightMm: 863,
    fuelTankL: 7.2,
    fuelConsumptionKmL: 45.5,
    groundClearanceMm: 285,
    frontTire: "70/100-21",
    rearTire: "90/100-18",
    abs: "No ABS listed; front and rear hydraulic disc brakes",
    colors: ["Extreme Red", "Ross White", "Black"],
    searchVolume: 9100,
    keywordDifficulty: 0,
    sourceLabel: "Honda Philippines CRF150L specifications and June 2023 SRP reference",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/looking-for-the-perfect-fathers-day-adventure-hit-the-road-with-the-new-crf150",
    verifiedAt: "2026-08-24",
    freshness: "review",
    priceContext: "Last official Honda Philippines SRP located: ₱147,900 (June 2023). Confirm current dealer pricing before purchase.",
    summary: "149cc street-legal dual-sport with 21/18-inch wheels, long-travel suspension and an 863 mm seat."
  },
  {
    id: "honda-adv-350",
    make: "Honda",
    makeSlug: "honda",
    model: "ADV 350",
    slug: "adv-350",
    generation: "Current",
    category: "Maxi scooter",
    srp: 360000,
    engineCc: 330,
    powerHp: 28.8,
    torqueNm: 31.5,
    curbWeightKg: 186,
    seatHeightMm: 795,
    fuelTankL: 11.7,
    frontTire: "120/70-15",
    rearTire: "140/70-14",
    abs: "Dual-channel ABS",
    colors: ["Graphite", "Black"],
    searchVolume: 4400,
    keywordDifficulty: 0,
    sourceLabel: "Manufacturer/dealer source pending recheck",
    sourceUrl: "https://www.hondaph.com/",
    verifiedAt: "2026-08-24",
    freshness: "review",
    summary: "330cc maxi-scooter with a 795 mm seat, 186 kg curb weight, ABS and a 11.7 L fuel tank."
  },
  {
    id: "kawasaki-ninja-400",
    make: "Kawasaki",
    makeSlug: "kawasaki",
    model: "Ninja 400",
    slug: "ninja-400",
    generation: "Current",
    category: "Sport bike",
    srp: 340900,
    engineCc: 399,
    powerHp: 45,
    torqueNm: 37,
    curbWeightKg: 168,
    seatHeightMm: 785,
    fuelTankL: 14,
    frontTire: "110/70-17",
    rearTire: "150/60-17",
    abs: "Dual-channel ABS",
    colors: ["Lime Green", "Black"],
    searchVolume: 6800,
    keywordDifficulty: 5,
    sourceLabel: "Manufacturer/dealer source pending recheck",
    sourceUrl: "https://www.kawasaki.ph/",
    verifiedAt: "2026-08-24",
    freshness: "review",
    summary: "399cc parallel-twin sport bike with a 785 mm seat, 168 kg curb weight and dual-channel ABS."
  },
  {
    id: "honda-navi", make: "Honda", makeSlug: "honda", model: "Navi", slug: "navi", generation: "Current", category: "Mini commuter",
    srp: 53900, engineCc: 109, powerHp: 7.8, torqueNm: 8.9, curbWeightKg: 104, seatHeightMm: 765, fuelTankL: 3.8,
    frontTire: "90/90-12", rearTire: "90/100-10", abs: "No ABS", colors: ["Red", "Black"], searchVolume: 21000, keywordDifficulty: 0,
    sourceLabel: "Manufacturer details pending recheck", sourceUrl: "https://www.hondaph.com/", verifiedAt: "2026-08-24", freshness: "review",
    summary: "109cc automatic mini-motorcycle with a 765 mm seat and compact dimensions for city use."
  },
  {
    id: "honda-beat", make: "Honda", makeSlug: "honda", model: "BeAT", slug: "beat", generation: "Current", category: "Commuter scooter",
    srp: 72400, engineCc: 110, powerHp: 8.9, torqueNm: 9.3, curbWeightKg: 90, seatHeightMm: 740, fuelTankL: 4.2,
    frontTire: "80/90-14", rearTire: "90/90-14", abs: "No ABS", colors: ["Black", "Red"], searchVolume: 12000, keywordDifficulty: 2,
    sourceLabel: "Manufacturer details pending recheck", sourceUrl: "https://www.hondaph.com/", verifiedAt: "2026-08-24", freshness: "review",
    summary: "110cc automatic scooter with a low seat, light curb weight and city-focused dimensions."
  },
  {
    id: "honda-click-125i", make: "Honda", makeSlug: "honda", model: "Click 125i", slug: "click-125i", generation: "Current", category: "Commuter scooter",
    marketStatus: "current",
    srp: 81900, engineCc: 125, powerHp: 11.0, torqueNm: 10.8, curbWeightKg: 111, seatHeightMm: 769, fuelTankL: 5.5,
    frontTire: "80/90-14", rearTire: "90/90-14", abs: "No ABS", colors: ["Black", "Red", "White"], searchVolume: 7100, keywordDifficulty: 65,
    sourceLabel: "Zigwheels Philippines 2026 Click 125i price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/click-125i", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/click-125i",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "125cc automatic commuter scooter with a 769 mm seat and published fuel-economy data."
  },
  {
    id: "yamaha-mio-gear", make: "Yamaha", makeSlug: "yamaha", model: "Mio Gear", slug: "mio-gear", generation: "Current", category: "Commuter scooter",
    marketStatus: "current",
    srp: 79400, engineCc: 125, powerHp: 9.3, torqueNm: 9.6, curbWeightKg: 96, seatHeightMm: 750, fuelTankL: 4.2,
    frontTire: "80/80-14", rearTire: "100/70-14", abs: "No ABS", colors: ["Black", "Gray"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Mio Gear price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-gear", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceHighPhp: 82400,
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/mio-gear",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "125cc automatic scooter with a 750 mm seat, light curb weight and 14-inch wheels."
  },
  {
    id: "suzuki-burgman-street-ex", make: "Suzuki", makeSlug: "suzuki", model: "Burgman Street EX", slug: "burgman-street-ex", generation: "Current", category: "Premium scooter",
    marketStatus: "current",
    srp: 92400, engineCc: 124, powerHp: 8.6, torqueNm: 10.0, curbWeightKg: 112, seatHeightMm: 780, fuelTankL: 5.5,
    frontTire: "90/90-12", rearTire: "100/80-12", abs: "No ABS", colors: ["Black", "Gray"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Burgman Street 125 EX price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/suzuki/burgman-street-125-ex", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/suzuki/burgman-street-125-ex",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Automatic",
    summary: "124cc automatic scooter with a 780 mm seat, 111 kg curb weight and a 5.5 L tank."
  },
  {
    id: "yamaha-sniper-155", make: "Yamaha", makeSlug: "yamaha", model: "Sniper 155", slug: "sniper-155", generation: "Current", category: "Underbone",
    marketStatus: "current",
    srp: 125900, engineCc: 155, powerHp: 17.7, torqueNm: 14.4, curbWeightKg: 119, seatHeightMm: 795, fuelTankL: 5.4,
    frontTire: "90/80-17", rearTire: "120/70-17", abs: "Variant dependent", colors: ["Black", "Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Sniper 155 price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/sniper-155", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceHighPhp: 145900,
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/sniper-155",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Manual",
    summary: "155cc six-speed underbone with a 795 mm seat, manual shifting and ABS on selected variants."
  },
  {
    id: "suzuki-raider-r150", make: "Suzuki", makeSlug: "suzuki", model: "Raider R150 Fi", slug: "raider-r150", generation: "Current", category: "Underbone",
    marketStatus: "current",
    srp: 121900, engineCc: 147, powerHp: 18.2, torqueNm: 13.8, curbWeightKg: 109, seatHeightMm: 765, fuelTankL: 4.0,
    frontTire: "70/90-17", rearTire: "80/90-17", abs: "No ABS", colors: ["Black", "Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Raider R150 Fi price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/suzuki/raider-r150-fi", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/suzuki/raider-r150-fi",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Manual",
    summary: "147cc six-speed underbone with light curb weight, manual shifting and a 4 L fuel tank."
  },
  {
    id: "kawasaki-barako-ii", make: "Kawasaki", makeSlug: "kawasaki", model: "Barako II", slug: "barako-ii", generation: "Current", category: "Business motorcycle",
    marketStatus: "current",
    srp: 91500, engineCc: 177, powerHp: 12.7, torqueNm: 13.2, curbWeightKg: 142, seatHeightMm: 805, fuelTankL: 12.0,
    frontTire: "3.00-17", rearTire: "3.00-17", abs: "No ABS", colors: ["Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Barako II price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/kawasaki/barako-ii", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines",
    marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/kawasaki/barako-ii",
    marketPriceCheckedAt: "2026-08-25",
    transmission: "Manual",
    summary: "177cc utility motorcycle with a long seat, rear carrier and work-oriented chassis."
  },
  {
    id: "honda-winner-x", make: "Honda", makeSlug: "honda", model: "Winner X", slug: "winner-x", generation: "Current", category: "Underbone",
    marketStatus: "current",
    srp: 123900, engineCc: 149, powerHp: 15.4, torqueNm: 13.5, curbWeightKg: 122, seatHeightMm: 795, fuelTankL: 4.5, fuelConsumptionKmL: 52.3, groundClearanceMm: 151,
    frontTire: "90/80-17", rearTire: "120/70-17", abs: "Variant-dependent; ABS on Premium and Racing variants", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Winner X price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/winner-x/specifications", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceHighPhp: 131900, marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/winner-x", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "149cc six-speed underbone with a 795 mm seat and ABS available on higher variants."
  },
  {
    id: "honda-wave-rsx", make: "Honda", makeSlug: "honda", model: "Wave RSX", slug: "wave-rsx", generation: "Current", category: "Underbone",
    marketStatus: "current",
    srp: 62900, engineCc: 109, powerHp: 8.6, torqueNm: 8.7, curbWeightKg: 98, seatHeightMm: 760, fuelTankL: 4.0, fuelConsumptionKmL: 69.5, groundClearanceMm: 135,
    frontTire: "70/90-17", rearTire: "80/90-17", abs: "No ABS; brake equipment varies by Drum/Disc variant", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 Wave RSX price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/wave-rsx/specifications", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceHighPhp: 64900, marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/wave-rsx", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "109cc underbone with a 760 mm seat, light curb weight and published fuel-economy data."
  },
  {
    id: "honda-tmx125-alpha", make: "Honda", makeSlug: "honda", model: "TMX125 Alpha", slug: "tmx125-alpha", generation: "Current", category: "Business motorcycle",
    marketStatus: "current",
    srp: 56900, engineCc: 125, powerHp: 9.6, torqueNm: 9.1, curbWeightKg: 113, seatHeightMm: 759, fuelTankL: 8.6, fuelConsumptionKmL: 62.5, groundClearanceMm: 156,
    frontTire: "2.50-18", rearTire: "2.75-18", abs: "No ABS; drum brakes", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 TMX125 Alpha price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/tmx125-alpha/specifications", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/tmx125-alpha", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "125cc business motorcycle with an 8.6 L fuel tank, low seat and simple work-oriented layout."
  },
  {
    id: "yamaha-ytx-125", make: "Yamaha", makeSlug: "yamaha", model: "YTX 125", slug: "ytx-125", generation: "Current", category: "Business motorcycle",
    marketStatus: "current",
    srp: 57900, engineCc: 125, powerHp: 8.0, torqueNm: 10.2, curbWeightKg: 114, seatHeightMm: 800, fuelTankL: 7.6, groundClearanceMm: 170,
    frontTire: "3.00-17", rearTire: "3.00-17", abs: "No ABS; drum brakes", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 YTX 125 price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/ytx-125/specifications", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/ytx-125", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "125cc work/commuter motorcycle with a 7.6 L fuel tank and 170 mm ground clearance."
  },
  {
    id: "honda-cb150x", make: "Honda", makeSlug: "honda", model: "CB150X", slug: "cb150x", generation: "Current", category: "Adventure touring",
    marketStatus: "current",
    srp: 173900, engineCc: 149, powerHp: 15.0, torqueNm: 13.8, curbWeightKg: 140, seatHeightMm: 817, fuelTankL: 12.0, fuelConsumptionKmL: 38.0, groundClearanceMm: 181,
    frontTire: "100/80-17", rearTire: "130/70-17", abs: "Single-channel ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 CB150X price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cb150x/specifications", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/cb150x", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "149cc road-biased adventure motorcycle with a 12 L tank, upright riding position and 17-inch wheels."
  },
  {
    id: "yamaha-xsr155", make: "Yamaha", makeSlug: "yamaha", model: "XSR155", slug: "xsr155", generation: "Current", category: "Retro roadster",
    marketStatus: "current",
    srp: 182000, engineCc: 155, powerHp: 19.0, torqueNm: 14.7, curbWeightKg: 134, seatHeightMm: 808, fuelTankL: 10.0, groundClearanceMm: 170,
    frontTire: "110/70-17", rearTire: "140/70-17", abs: "No ABS", colors: ["Garage Metal", "Phantom Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Zigwheels Philippines 2026 XSR155 price and specification page", sourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/xsr155/standard", verifiedAt: "2026-08-25", freshness: "verified",
    marketPriceSourceLabel: "Zigwheels Philippines", marketPriceSourceUrl: "https://www.zigwheels.ph/new-motorcycles/yamaha/xsr155", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "155cc roadster with a six-speed manual transmission, 19 hp and a 10 L fuel tank."
  },
  {
    id: "honda-giorno-plus", make: "Honda", makeSlug: "honda", model: "Giorno+", slug: "giorno-plus", generation: "Current", category: "Lifestyle scooter",
    srp: 101900, engineCc: 125, powerHp: 11.38, torqueNm: 11.6, curbWeightKg: 116, seatHeightMm: 780, fuelTankL: 5.4, fuelConsumptionKmL: 47, groundClearanceMm: 155,
    frontTire: "100/90-12", rearTire: "100/90-12", abs: "No ABS; combined braking system", colors: ["White", "Beige", "Orange", "Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines Giorno+ specification and indicative-price page", sourceUrl: "https://wheeltek.com.ph/motorcycles/giorno/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/motorcycles/giorno/", marketPriceCheckedAt: "2026-08-25", transmission: "Automatic",
    summary: "125cc automatic scooter with a 780 mm seat and 12-inch wheels."
  },
  {
    id: "honda-xrm125", make: "Honda", makeSlug: "honda", model: "XRM125", slug: "xrm125", generation: "Current model family", category: "Dual-purpose underbone",
    srp: 71900, engineCc: 125, powerHp: 9.55, torqueNm: 9.55, curbWeightKg: 102, seatHeightMm: 775, fuelTankL: 3.9, groundClearanceMm: 145,
    frontTire: "2.50-17", rearTire: "2.50-17", abs: "No ABS; brake and wheel equipment differs by XRM125 configuration", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines XRM125 model-family listings; DS chassis used as the model-level baseline", sourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    priceContext: "Current Wheeltek observations span XRM125 configurations from ₱71,900 to ₱76,900. MotoIndex keeps one model-level page rather than separate trim pages.", marketPriceHighPhp: 76900, marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/products/regular-bikes/", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "125cc dual-purpose underbone; the DS chassis is used as the model reference while current configuration prices are shown separately."
  },
  {
    id: "honda-tmx-supremo", make: "Honda", makeSlug: "honda", model: "TMX Supremo", slug: "tmx-supremo", generation: "Current", category: "Business motorcycle",
    srp: 78900, engineCc: 149, powerHp: 11.08, torqueNm: 11.61, curbWeightKg: 127, seatHeightMm: 782, fuelTankL: 10.3, fuelConsumptionKmL: 44.6, groundClearanceMm: 163,
    frontTire: "80/100-18", rearTire: "90/90-18", abs: "No ABS; drum brakes", colors: ["Black", "Candy Ruby Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines TMX Supremo specification and indicative-price page", sourceUrl: "https://wheeltek.com.ph/motorcycles/tmx-supremo/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/motorcycles/tmx-supremo/", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "149cc work motorcycle with a 10.3 L fuel tank, drum brakes and an upright utility layout."
  },
  {
    id: "yamaha-pg-1", make: "Yamaha", makeSlug: "yamaha", model: "PG-1", slug: "pg-1", generation: "Current", category: "Scrambler / utility motorcycle",
    srp: 96400, engineCc: 114, powerHp: 8.85, torqueNm: 9.5, curbWeightKg: 107, seatHeightMm: 795, fuelTankL: 5.1, groundClearanceMm: 190,
    frontTire: "90/100-16", rearTire: "90/100-16", abs: "No ABS; front disc and rear drum", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines PG-1 specification and indicative-price page", sourceUrl: "https://wheeltek.com.ph/vehicles/pg-1/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/vehicles/pg-1/", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "114cc motorcycle with 16-inch block-pattern tires, 190 mm ground clearance and a four-speed centrifugal-clutch drivetrain."
  },
  {
    id: "yamaha-wr155r", make: "Yamaha", makeSlug: "yamaha", model: "WR155R", slug: "wr155r", generation: "Current", category: "Dual-sport",
    srp: 180900, engineCc: 155, powerHp: 16.49, torqueNm: 14.3, curbWeightKg: 134, seatHeightMm: 880, fuelTankL: 8.1, groundClearanceMm: 245,
    frontTire: "2.75-21", rearTire: "4.10-18", abs: "No ABS; front and rear disc brakes", colors: ["Racing Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines WR155R specification and indicative-price page", sourceUrl: "https://wheeltek.com.ph/motorcycles/wr-155r/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/motorcycles/wr-155r/", marketPriceCheckedAt: "2026-08-25", transmission: "Manual",
    summary: "155cc dual-sport with 21/18-inch wheels, 245 mm ground clearance and an 880 mm seat."
  },
  {
    id: "yamaha-xmax", make: "Yamaha", makeSlug: "yamaha", model: "XMAX", slug: "xmax", generation: "Current", category: "Maxi scooter",
    srp: 311000, engineCc: 292, powerHp: 27.62, torqueNm: 29, curbWeightKg: 181, seatHeightMm: 795, fuelTankL: 13, groundClearanceMm: 135,
    frontTire: "120/70-15", rearTire: "140/70-14", abs: "Dual-channel ABS", colors: ["Powered Gray", "Dark Petrol"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Wheeltek current Philippines XMAX specification and indicative-price page", sourceUrl: "https://wheeltek.com.ph/motorcycles/xmax/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    marketPriceSourceLabel: "Wheeltek", marketPriceSourceUrl: "https://wheeltek.com.ph/motorcycles/xmax/", marketPriceCheckedAt: "2026-08-25", transmission: "Automatic",
    summary: "292cc maxi-scooter with a 13 L fuel tank, ABS and 15/14-inch wheels."
  },
  {
    id: "suzuki-avenis", make: "Suzuki", makeSlug: "suzuki", model: "Avenis", slug: "avenis", generation: "Current", category: "Sport scooter",
    srp: 81400, engineCc: 124, powerHp: 8.58, torqueNm: 10, curbWeightKg: 106, seatHeightMm: 780, fuelTankL: 5.2, fuelConsumptionKmL: 54, groundClearanceMm: 160,
    frontTire: "90/90-12", rearTire: "90/100-10", abs: "No ABS; front disc with combined brake system", colors: ["Metallic Matte Stellar Blue", "Metallic Matte Black", "Pearl Brilliant White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Avenis product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/avenis/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "124cc automatic scooter with a 780 mm seat, combined braking and Suzuki's published 54 km/L test figure."
  },
  {
    id: "suzuki-smash-fi", make: "Suzuki", makeSlug: "suzuki", model: "Smash FI", slug: "smash-fi", generation: "Current", category: "Underbone",
    srp: 68400, engineCc: 113, powerHp: 9.25, torqueNm: 9.1, curbWeightKg: 94, seatHeightMm: 755, fuelTankL: 3.7, fuelConsumptionKmL: 68, groundClearanceMm: 145,
    frontTire: "70/90-17", rearTire: "80/90-17", abs: "No ABS; brake equipment differs by configuration", colors: ["Candy Summer Red", "New Titan Black", "Metallic Matte Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Smash FI product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/underbone/smash-fi/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current",
    priceContext: "Current manufacturer pricing spans model configurations from ₱68,400 to ₱73,400. MotoIndex keeps one model-level page rather than separate trim pages.", marketPriceHighPhp: 73400, transmission: "Manual",
    summary: "113cc fuel-injected underbone with a 755 mm seat and a manufacturer-published 68 km/L test figure."
  },
  {
    id: "suzuki-raider-j-crossover", make: "Suzuki", makeSlug: "suzuki", model: "Raider J Crossover", slug: "raider-j-crossover", generation: "Current", category: "Dual-purpose underbone",
    srp: 71900, engineCc: 113, powerHp: 9.12, torqueNm: 9, curbWeightKg: 96, seatHeightMm: 765, fuelTankL: 3.7, fuelConsumptionKmL: 52.6, groundClearanceMm: 145,
    frontTire: "70/90-17", rearTire: "80/90-17", abs: "No ABS; front disc and rear drum", colors: ["Champion Yellow", "Flame Red", "Solid Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Raider J Crossover product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/underbone/raider-j-crossover/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "113cc dual-purpose underbone with semi-block tires, 145 mm ground clearance and a published 52.6 km/L test figure."
  },
  {
    id: "suzuki-raider-pro", make: "Suzuki", makeSlug: "suzuki", model: "Raider PRO", slug: "raider-pro", generation: "Current", category: "Performance underbone",
    srp: 146400, engineCc: 147, powerHp: 18.10, torqueNm: 13.8, curbWeightKg: 115, seatHeightMm: 765, fuelTankL: 4, fuelConsumptionKmL: 43.4, groundClearanceMm: 150,
    frontTire: "70/90-17", rearTire: "80/90-17", abs: "Single-channel front ABS", colors: ["Tech Yellow", "Candy Matte Bordeaux Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Raider PRO product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/underbone/raider-pro/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "147cc six-speed underbone with front ABS and a manufacturer-published 43.4 km/L test figure."
  },
  {
    id: "suzuki-gixxer-155", make: "Suzuki", makeSlug: "suzuki", model: "Gixxer 155", slug: "gixxer-155", generation: "Current", category: "Naked street bike",
    srp: 106400, engineCc: 155, powerHp: 13.94, torqueNm: 14, curbWeightKg: 140, seatHeightMm: 795, fuelTankL: 12, fuelConsumptionKmL: 53.3, groundClearanceMm: 160,
    frontTire: "100/80-17", rearTire: "140/60R17", abs: "No ABS; front and rear disc brakes", colors: ["Metallic Triton Blue", "Glass Sparkle Black", "Pearl Mira Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Gixxer 155 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-155/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "155cc naked street bike with a 12 L tank, 795 mm seat and manufacturer-published 53.3 km/L test figure."
  },
  {
    id: "suzuki-gixxer-sf-155", make: "Suzuki", makeSlug: "suzuki", model: "Gixxer SF 155", slug: "gixxer-sf-155", generation: "Current", category: "Sport bike",
    srp: 116900, engineCc: 155, powerHp: 13.94, torqueNm: 14, curbWeightKg: 146, seatHeightMm: 795, fuelTankL: 12, fuelConsumptionKmL: 50.2, groundClearanceMm: 165,
    frontTire: "100/80-17", rearTire: "140/60R17", abs: "No ABS; front and rear disc brakes", colors: ["Metallic Triton Blue", "Glass Sparkle Black", "Pearl Mira Red"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Gixxer SF 155 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf-155/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "155cc full-faired road bike with a 12 L tank and a published 50.2 km/L test figure."
  },
  {
    id: "suzuki-gixxer-250", make: "Suzuki", makeSlug: "suzuki", model: "Gixxer 250", slug: "gixxer-250", generation: "Current", category: "Naked street bike",
    srp: 182900, engineCc: 249, powerHp: 26.13, torqueNm: 22.6, curbWeightKg: 156, seatHeightMm: 800, fuelTankL: 12, fuelConsumptionKmL: 37, groundClearanceMm: 165,
    frontTire: "110/70-17", rearTire: "150/60R17", abs: "Dual-channel ABS", colors: ["Metallic Triton Blue", "Matte Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Gixxer 250 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-250/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "249cc naked street bike with dual-channel ABS, 17-inch road tires and a 12 L fuel tank."
  },
  {
    id: "suzuki-gixxer-sf250", make: "Suzuki", makeSlug: "suzuki", model: "Gixxer SF250", slug: "gixxer-sf250", generation: "Current", category: "Sport bike",
    srp: 192900, engineCc: 249, powerHp: 26.13, torqueNm: 22.6, curbWeightKg: 161, seatHeightMm: 800, fuelTankL: 12, fuelConsumptionKmL: 36.6, groundClearanceMm: 165,
    frontTire: "110/70-17", rearTire: "150/60R17", abs: "Dual-channel ABS", colors: ["Metallic Triton Blue and Glacier White", "Matte Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Gixxer SF250 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/gixxer-sf-250/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "249cc full-faired sport bike with dual-channel ABS, a 12 L tank and a manufacturer-published 36.6 km/L test figure."
  },
  {
    id: "suzuki-v-strom-250-sx", make: "Suzuki", makeSlug: "suzuki", model: "V-Strom 250 SX", slug: "v-strom-250-sx", generation: "Current", category: "Adventure touring",
    srp: 229900, engineCc: 249, powerHp: 26.15, torqueNm: 22.2, curbWeightKg: 167, seatHeightMm: 835, fuelTankL: 12, fuelConsumptionKmL: 35, groundClearanceMm: 205,
    frontTire: "100/90-19", rearTire: "140/70-17", abs: "Dual-channel ABS", colors: ["Champion Yellow", "Pearl Fresh Blue"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current V-Strom 250 SX product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-250-sx/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "249cc adventure-style motorcycle with a 19-inch front wheel, 205 mm ground clearance and dual-channel ABS."
  },
  {
    id: "suzuki-v-strom-160", make: "Suzuki", makeSlug: "suzuki", model: "V-Strom 160", slug: "v-strom-160", generation: "Current", category: "Adventure touring",
    srp: 146000, engineCc: 162, powerHp: 14.75, torqueNm: 14, curbWeightKg: 148, seatHeightMm: 795, fuelTankL: 13, fuelConsumptionKmL: 50, groundClearanceMm: 160,
    frontTire: "100/80-17", rearTire: "130/70-17", abs: "Dual-channel ABS", colors: ["Solid Cool Yellow", "Pearl Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current V-Strom 160 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/v-strom-160/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "162cc adventure-style road motorcycle with a 13 L tank, dual-channel ABS and a published 50 km/L test figure."
  },
  {
    id: "suzuki-dr160", make: "Suzuki", makeSlug: "suzuki", model: "DR160", slug: "dr160", generation: "Current", category: "Dual-sport",
    srp: 129000, engineCc: 162, powerHp: 14.08, torqueNm: 14.5, curbWeightKg: 138, seatHeightMm: 845, fuelTankL: 12.2, fuelConsumptionKmL: 48.8, groundClearanceMm: 244,
    frontTire: "90/90-19", rearTire: "110/90-17", abs: "Single-channel front ABS", colors: ["Solid Pure Black", "Solid White"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current DR160 product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/backbone/dr160/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "162cc dual-sport with 244 mm ground clearance, a 12.2 L fuel tank and front-wheel ABS."
  },
  {
    id: "suzuki-access", make: "Suzuki", makeSlug: "suzuki", model: "Access", slug: "access", generation: "Current", category: "Commuter scooter",
    srp: 85900, engineCc: 124, powerHp: 8.31, torqueNm: 10.2, curbWeightKg: 106, seatHeightMm: 770, fuelTankL: 5.3, fuelConsumptionKmL: 57.3, groundClearanceMm: 160,
    frontTire: "90/90-12", rearTire: "90/90-10", abs: "No ABS; combined braking system", colors: ["Solid Ice Green", "Pearl Grace White", "Metallic Matte Black"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Access product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/access/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "124cc commuter scooter with a 770 mm seat and a manufacturer-published 57.3 km/L test figure."
  },
  {
    id: "suzuki-skydrive-sport", make: "Suzuki", makeSlug: "suzuki", model: "Skydrive Sport", slug: "skydrive-sport", generation: "Current", category: "Commuter scooter",
    srp: 73900, engineCc: 113, powerHp: 8.98, torqueNm: 8.5, curbWeightKg: 93, seatHeightMm: 740, fuelTankL: 3.6, groundClearanceMm: 150,
    frontTire: "80/90-14", rearTire: "90/90-14", abs: "No ABS; conventional braking", colors: ["Titan Black", "Metallic Matte Stellar Blue", "Candy Jackal Green"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Skydrive Sport product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/skydrive-sport/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "113cc automatic scooter with a 740 mm seat, 14-inch wheels and 93 kg curb weight."
  },
  {
    id: "suzuki-burgman-street", make: "Suzuki", makeSlug: "suzuki", model: "Burgman Street", slug: "burgman-street", generation: "Current", category: "Maxi-style scooter",
    srp: 84400, engineCc: 124, powerHp: 8.58, torqueNm: 10.2, curbWeightKg: 110, seatHeightMm: 780, fuelTankL: 5.5, fuelConsumptionKmL: 54.9, groundClearanceMm: 160,
    frontTire: "90/90-12", rearTire: "90/90-10", abs: "No ABS; combined braking system", colors: ["Candy Summer Red", "New Titan Black", "Pearl Mirage White", "Metallic Matte Titanium Silver"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Suzuki Motorcycles Philippines current Burgman Street product page", sourceUrl: "https://mc.suzuki.com.ph/motorcycles/scooter/burgman-street/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Automatic",
    summary: "124cc maxi-style commuter scooter with a 5.5 L tank and a manufacturer-published 54.9 km/L test figure."
  },
  {
    id: "kawasaki-klx150", make: "Kawasaki", makeSlug: "kawasaki", model: "KLX150", slug: "klx150", generation: "Current", category: "Dual-sport",
    srp: 134900, engineCc: 144, powerHp: 11.53, torqueNm: 11.3, curbWeightKg: 119, seatHeightMm: 866, fuelTankL: 6.9,
    frontTire: "2.75-21", rearTire: "4.10-18", abs: "No ABS; off-road-oriented brake package", colors: ["Lime Green"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Philippines current KLX150 model, price and chassis reference", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/dual-purpose/klx150/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "144cc dual-sport with 21/18-inch wheels and a published 119 kg curb weight."
  },
  {
    id: "kawasaki-klx230", make: "Kawasaki", makeSlug: "kawasaki", model: "KLX 230", slug: "klx230", generation: "Current", category: "Dual-sport",
    srp: 196000, engineCc: 233, powerHp: 19.74, torqueNm: 19.5, curbWeightKg: 132, seatHeightMm: 884, fuelTankL: 7.5, groundClearanceMm: 264,
    frontTire: "80/100-21", rearTire: "100/100-18", abs: "No ABS asserted on the Kawasaki Philippines model-level page", colors: ["Lime Green"], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Philippines current KLX 230 model/price with current Philippines chassis cross-check", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/dual-purpose/klx-230/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "233cc dual-sport with a six-speed transmission, 21/18-inch wheels and a published 132 kg curb weight."
  },
  {
    id: "kawasaki-ninja-500", make: "Kawasaki", makeSlug: "kawasaki", model: "Ninja 500", slug: "ninja-500", generation: "Current", category: "Sport bike",
    srp: 353800, engineCc: 451, powerHp: 51.3, torqueNm: 42.6, curbWeightKg: 170, seatHeightMm: 785, fuelTankL: 14, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "Brake package varies; anti-lock equipment not asserted for this model-level record", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Philippines current Ninja 500 model and MSRP page", sourceUrl: "https://kawasakileisurebikes.ph/motorcycles/sports/ninja-500/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "451cc parallel-twin sport bike with a 785 mm seat, 14 L tank and published 170 kg curb weight."
  },
  {
    id: "kawasaki-z500", make: "Kawasaki", makeSlug: "kawasaki", model: "Z500", slug: "z500", generation: "Current", category: "Naked street bike",
    srp: 329800, engineCc: 451, powerHp: 51.3, torqueNm: 42.6, curbWeightKg: 166, seatHeightMm: 785, fuelTankL: 14, groundClearanceMm: 145,
    frontTire: "110/70-17", rearTire: "150/60-17", abs: "ABS", colors: [], searchVolume: 0, keywordDifficulty: 0,
    sourceLabel: "Kawasaki Philippines current Z500 model and MSRP page", sourceUrl: "https://www.kawasakileisurebikes.ph/motorcycles/sports/z500/", verifiedAt: "2026-08-25", freshness: "verified", marketStatus: "current", transmission: "Manual",
    summary: "451cc parallel-twin naked bike with a 785 mm seat, 14 L tank, ABS and published 166 kg curb weight."
  },
  ...phTier23Motorcycles,

];

export const currentMotorcycles = motorcycles.filter((m) => m.marketStatus !== "previous");
export function isIndexableModel(model: Motorcycle) {
  const sourceNeedsReview = /pending|recheck|research only|needs verification/i.test(model.sourceLabel);
  const sourceIsCurrent = !modelSourceNeedsRefresh(model);
  const legacyReady = model.freshness === "verified" && !sourceNeedsReview && /^https:\/\//.test(model.sourceUrl) && Boolean(model.verifiedAt) && sourceIsCurrent;
  if (!legacyReady) return false;
  if (!isAuthorityExpansionModel(model)) return true;
  return modelAuthorityQuality(model).indexable;
}

// Public discovery surfaces use the same quality gate as model indexation.
// Records that still need review can remain available to internal workflows without appearing in public listings.
export const publicMotorcycles = currentMotorcycles.filter(isIndexableModel);

export const helmetBrands: HelmetBrand[] = [
  { brand: "KYT", slug: "kyt", searchVolume: 11000, keywordDifficulty: 0, positioning: "Race-inspired full-face and modular helmets" },
  { brand: "Spyder", slug: "spyder", searchVolume: 11000, keywordDifficulty: 0, positioning: "Popular PH commuter and touring helmets" },
  { brand: "Gille", slug: "gille", searchVolume: 8600, keywordDifficulty: 0, positioning: "Street-focused value helmets" },
  { brand: "EVO", slug: "evo", searchVolume: 7900, keywordDifficulty: 0, positioning: "Affordable full-face and half-face helmets" },
  { brand: "SEC", slug: "sec", searchVolume: 6100, keywordDifficulty: 0, positioning: "Helmets plus a broad top-box ecosystem" },
  { brand: "Arai", slug: "arai", searchVolume: 5000, keywordDifficulty: 20, positioning: "Premium Japanese full-face and adventure helmets" },
  { brand: "HJC", slug: "hjc", searchVolume: 4100, keywordDifficulty: 37, positioning: "Global full-face and open-face range" },
  { brand: "Rook", slug: "rook", searchVolume: 3900, keywordDifficulty: 0, positioning: "Retro and lifestyle-focused helmets" },
  { brand: "Shoei", slug: "shoei", searchVolume: 3800, keywordDifficulty: 6, positioning: "Premium Japanese helmets" },
  { brand: "Zebra", slug: "zebra", searchVolume: 3100, keywordDifficulty: 0, positioning: "Value-focused full-face, modular and city helmets with broad Philippine marketplace availability" },
  { brand: "HNJ", slug: "hnj", searchVolume: 2700, keywordDifficulty: 0, positioning: "Value-focused modular and full-face helmets sold widely in the Philippines" },
  { brand: "AGV", slug: "agv", searchVolume: 2600, keywordDifficulty: 28, positioning: "Italian road and sport helmets" },
  { brand: "MT", slug: "mt", searchVolume: 1900, keywordDifficulty: 0, positioning: "ECE-focused full-face and modular helmets with Philippine retail availability" },
  { brand: "Bell", slug: "bell", searchVolume: 1700, keywordDifficulty: 7, positioning: "American full-face and classic open-face helmets" },
  { brand: "Shark", slug: "shark", searchVolume: 1100, keywordDifficulty: 1, positioning: "Premium French road and sport-touring helmets" },
  { brand: "LS2", slug: "ls2", searchVolume: 2700, keywordDifficulty: 28, positioning: "Broad road, modular, adventure and off-road helmet range with strong Philippine retail availability" },
  { brand: "NHK", slug: "nhk", searchVolume: 700, keywordDifficulty: 43, positioning: "Race, street, modular and open-face helmets with a broad Asian-market catalogue" },
  { brand: "SMK", slug: "smk", searchVolume: 500, keywordDifficulty: 0, positioning: "Full-face, modular, flip-back, off-road and open-face helmets" },
  { brand: "Alpinestars", slug: "alpinestars", searchVolume: 400, keywordDifficulty: 0, positioning: "Premium road-racing and motocross helmets" }
];

export const comparisons: Comparison[] = [
  { slug: "aerox-vs-nmax", a: "yamaha-aerox-v3", b: "yamaha-nmax-v3", summary: "Current Aerox and NMAX families compared with separate V3-specific context" },
  { slug: "aerox-v3-vs-nmax-v3", a: "yamaha-aerox-v3", b: "yamaha-nmax-v3", summary: "Current V3 variants, prices and specifications only" },
  { slug: "adv-160-vs-pcx-160", a: "honda-adv-160", b: "honda-pcx-160", summary: "Premium Honda scooters compared by price, clearance, weight and equipment" },
  { slug: "click-160-vs-aerox-v3", a: "honda-click-160", b: "yamaha-aerox-v3", summary: "Similar-displacement scooters with different price, weight and output" },
  { slug: "raider-r150-vs-sniper-155", a: "suzuki-raider-r150", b: "yamaha-sniper-155", summary: "Performance underbones compared by output, weight, transmission and brakes" },
  { slug: "click-125i-vs-mio-gear", a: "honda-click-125i", b: "yamaha-mio-gear", summary: "Affordable automatic commuters compared for cost and everyday specifications" },
  { slug: "click-125i-vs-burgman-street", a: "honda-click-125i", b: "suzuki-burgman-street", summary: "Compact commuter and maxi-style scooter compared with factual specifications" },
  { slug: "adv-160-vs-nmax-v3", a: "honda-adv-160", b: "yamaha-nmax-v3", summary: "Premium cross-brand scooters compared by clearance, size and equipment" },
  { slug: "adv-160-vs-aerox-v3", a: "honda-adv-160", b: "yamaha-aerox-v3", summary: "Adventure-style and sport-oriented scooters compared with measurable differences" },
  { slug: "fazzio-vs-giorno-plus", a: "yamaha-fazzio", b: "honda-giorno-plus", summary: "Retro-style scooters compared by price, weight, seat and equipment" },
  { slug: "tmx125-alpha-vs-ytx-125", a: "honda-tmx125-alpha", b: "yamaha-ytx-125", summary: "Utility motorcycles compared by price, engine, weight and tank size" },
  { slug: "click-160-vs-nmax-v3", a: "honda-click-160", b: "yamaha-nmax-v3", summary: "Light city scooter vs comfort-focused premium scooter" },
  { slug: "click-125i-vs-click-160", a: "honda-click-125i", b: "honda-click-160", summary: "Lower-cost 125cc commuting vs stronger 160cc performance" },
  { slug: "fazzio-vs-mio-gear", a: "yamaha-fazzio", b: "yamaha-mio-gear", summary: "Retro city style vs practical commuter value" },
  { slug: "winner-x-vs-sniper-155", a: "honda-winner-x", b: "yamaha-sniper-155", summary: "Sport underbone alternatives with different price and brake packages" },
  { slug: "pcx-160-vs-nmax-v3", a: "honda-pcx-160", b: "yamaha-nmax-v3", summary: "Honda maxi-scooter comfort vs Yamaha premium-scooter tech" }
];

export function getModel(make: string, slug: string) {
  return motorcycles.find((m) => m.makeSlug === make && m.slug === slug);
}

export function getModelById(id: string) {
  return motorcycles.find((m) => m.id === id);
}

export function getComparison(slug: string) {
  const curated = comparisons.find((c) => c.slug === slug);
  if (curated) {
    const a = getModelById(curated.a);
    const b = getModelById(curated.b);
    if (!a || !b) return undefined;
    return { ...curated, a, b };
  }
  const a = currentMotorcycles.find((model) => slug.startsWith(`${model.slug}-vs-`));
  if (!a) return undefined;
  const bSlug = slug.slice(`${a.slug}-vs-`.length);
  const b = currentMotorcycles.find((model) => model.slug === bSlug);
  if (!b || a.id === b.id) return undefined;
  return { slug, summary: `${a.category} vs ${b.category} using current market-price and specification records`, a, b };
}

export function isIndexableComparison(slug: string) {
  // The builder can render any valid pair, but only editorially curated pairs are indexable.
  // This prevents reverse-order and arbitrary pair permutations from creating thin/duplicate indexable URLs.
  const curated = comparisons.some((comparison) => comparison.slug === slug);
  const comparison = curated ? getComparison(slug) : undefined;
  return Boolean(comparison && isIndexableModel(comparison.a) && isIndexableModel(comparison.b));
}


export const accessoryCategories: AccessoryCategory[] = [
  { name: "Top boxes", slug: "top-box", searchVolume: 3500, keywordDifficulty: 0, description: "Storage boxes, brackets and fitment guidance for commuter and touring motorcycles.", buyerQuestions: ["What capacity fits my bike?", "Which bracket is required?", "Will a full-face helmet fit?", "What is the safe load limit?"] },
  { name: "Intercoms", slug: "intercoms", searchVolume: 1100, keywordDifficulty: 0, description: "Helmet communication systems for rider-to-rider audio, navigation and calls.", buyerQuestions: ["Does it fit my helmet?", "How many riders can pair?", "What is the claimed range?", "Is it weather resistant?"] },
  { name: "Phone holders", slug: "phone-holders", searchVolume: 350, keywordDifficulty: 0, description: "Handlebar and mirror-mount phone holders with vibration and rain considerations.", buyerQuestions: ["Where does it mount?", "Does it damp vibration?", "Will it fit my phone size?", "Does it block controls?"] },
  { name: "Rain gear", slug: "rain-gear", searchVolume: 500, keywordDifficulty: 0, description: "Rider raincoats and waterproof layers built around Philippine commuting conditions.", buyerQuestions: ["Is it truly waterproof?", "Will it fit over riding gear?", "How visible is it at night?", "How compact does it pack?"] }
];

export function getHelmetBrand(slug: string) {
  return helmetBrands.find((brand) => brand.slug === slug);
}

export function getAccessoryCategory(slug: string) {
  return accessoryCategories.find((category) => category.slug === slug);
}


export const recommendationGuides: RecommendationGuide[] = [
  {
    slug: "motorcycles-under-100k",
    kicker: "Budget guide",
    title: "Motorcycles under ₱100K in the Philippines",
    description: "Current motorcycles below ₱100,000, compared by observed price, engine, transmission, weight, seat height and equipment.",
    primaryKeyword: "motorcycles under 100k Philippines",
    secondaryKeywords: ["motorcycle below 100k Philippines", "affordable motorcycles Philippines", "cheapest motorcycles Philippines", "budget motorcycles Philippines"],
    directAnswer: "Looking for a motorcycle below ₱100,000? MotoIndex tracks current motorcycles whose observed starting price falls below ₱100,000 and compares them using measurable specifications instead of assuming the cheapest model is automatically the right choice.",
    inclusionRules: ["Observed starting price below ₱100,000", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Rank",
    sourcePolicy: "Observed prices come from dated manufacturer, dealer or comparison-site checks. Specifications come from each model's dated source-backed record; conflicting live-market prices are shown as a range rather than averaged.",
    caveats: ["A model can qualify when its entry variant is below ₱100,000 even if a higher trim exceeds the budget.", "Dealer pricing, freight, promotions and local availability can differ from observed or published prices."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "economy", "context"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Largest engine",metric:"engine"},{label:"Highest published fuel economy",metric:"economy"}],
    editorialSections: ["Cheapest motorcycles under ₱100K", "Automatic vs manual motorcycles under ₱100K", "What do you give up at this price?", "Which sub-₱100K motorcycle suits different riders?"],
    faqQuestions: ["What is the cheapest motorcycle in the Philippines under ₱100,000?", "What automatic motorcycles cost below ₱100K?", "Are there motorcycles with ABS below ₱100K?", "Which motorcycle under ₱100K has the lowest seat?", "Does the ₱100K limit include all variants?", "Are dealer prices the same as SRP?"],
    relatedGuideSlugs: ["automatic-motorcycles-under-100k", "motorcycles-100k-to-150k", "best-scooters-philippines", "motorcycles-with-abs-philippines", "lightweight-motorcycles-philippines"],
    intent: "budget"
  },
  {
    slug: "automatic-motorcycles-under-100k",
    kicker: "Budget + transmission",
    title: "Automatic motorcycles under ₱100K in the Philippines",
    description: "Current automatic motorcycles below ₱100,000, compared for price, weight, seat height, tank capacity, ABS and published fuel economy.",
    primaryKeyword: "automatic motorcycles under 100k Philippines",
    secondaryKeywords: ["cheapest automatic motorcycle Philippines", "automatic scooter under 100k", "Honda automatic motorcycle under 100k", "Yamaha automatic motorcycle under 100k", "Suzuki automatic motorcycle under 100k"],
    directAnswer: "These are current automatic motorcycles in the MotoIndex database with an observed starting price below ₱100,000. Price comes first, while weight and seat height stay visible because both can matter in everyday stop-and-go riding.",
    inclusionRules: ["Automatic transmission", "Observed starting price below ₱100,000", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest.",
    tieBreakers: ["Lower curb weight", "Lower published seat height"],
    orderLabel: "Rank",
    sourcePolicy: "Observed prices use dated live-market checks where available; specifications and transmission classification come from the source-backed model record.",
    caveats: ["Automatic does not automatically mean easier for every rider.", "Seat width, physical dimensions, weight distribution and rider confidence are not fully represented by the current structured dataset."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "tank", "economy"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Highest published fuel economy",metric:"economy"},{label:"Largest engine",metric:"engine"}],
    editorialSections: ["Cheapest automatic motorcycles below ₱100K", "Lightest automatic choices", "Automatic motorcycles with lower seats", "Automatic models with published fuel-economy figures", "Which one makes sense for city commuting?"],
    faqQuestions: ["What is the cheapest automatic motorcycle in the Philippines?", "What automatic scooters are available below ₱100K?", "Which Honda automatic motorcycles are under ₱100K?", "Which Yamaha automatic motorcycles are under ₱100K?", "Which Suzuki automatic motorcycles are under ₱100K?"],
    relatedGuideSlugs: ["motorcycles-under-100k", "best-scooters-philippines", "fuel-efficient-motorcycles-philippines", "best-motorcycles-for-short-riders", "lightweight-motorcycles-philippines"],
    intent: "budget"
  },
  {
    slug: "motorcycles-100k-to-150k",
    kicker: "₱100K–₱150K",
    title: "Motorcycles from ₱100K to ₱150K",
    description: "Current motorcycles with observed starting prices from ₱100,000 to ₱150,000 across scooters, underbones and manual motorcycles.",
    primaryKeyword: "motorcycles 100k to 150k Philippines",
    secondaryKeywords: ["motorcycles below 150k Philippines", "scooters 100k to 150k Philippines", "motorcycles with ABS below 150k"],
    directAnswer: "₱100,000–₱150,000 is not one motorcycle segment. The range contains scooters, underbones and manual motorcycles with different engines, weights, ergonomics and equipment, so MotoIndex presents a price-ordered comparison rather than a popularity ranking.",
    inclusionRules: ["Observed starting price from ₱100,000 through ₱150,000", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest; this is price order, not an overall quality ranking.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Price order",
    sourcePolicy: "The price band is based on observed starting prices from dated market checks, while specifications come from each motorcycle's dated model record.",
    caveats: ["Higher variants of a qualifying model can sit outside the ₱100K–₱150K band.", "A higher price does not imply that every specification or feature is better."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "tank", "power"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Largest engine",metric:"engine"},{label:"Highest power",metric:"power"}],
    editorialSections: ["What changes when you move above ₱100K?", "Scooters from ₱100K–₱150K", "Manual motorcycles from ₱100K–₱150K", "Underbones from ₱100K–₱150K", "Lower-seat options", "Lightweight options", "Motorcycles with ABS in this range"],
    faqQuestions: ["What motorcycles cost between ₱100K and ₱150K?", "What scooters are available in this price range?", "What motorcycles with ABS cost below ₱150K?", "What is the largest-engine motorcycle below ₱150K?"],
    relatedGuideSlugs: ["motorcycles-under-100k", "best-scooters-philippines", "best-underbone-motorcycles-philippines", "motorcycles-with-abs-philippines"],
    intent: "budget"
  },
  {
    slug: "best-scooters-philippines",
    kicker: "Scooters",
    title: "Scooters to compare in the Philippines",
    seoTitle: "Best Scooters in the Philippines to Compare in 2026",
    description: "Current scooters across commuter, sport and maxi-scooter categories, compared with objective price and specification data.",
    primaryKeyword: "best scooters Philippines",
    secondaryKeywords: ["scooters Philippines", "scooters under 100k Philippines", "scooters with ABS Philippines", "lightweight scooters Philippines"],
    directAnswer: "There is no single best scooter for every rider. MotoIndex compares current scooters using observed price, engine size, curb weight, seat height, tank capacity, braking equipment and available fuel-economy figures so you can choose around your own priorities.",
    inclusionRules: ["Scooter category in the current MotoIndex motorcycle dataset", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest for display only.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Price order",
    sourcePolicy: "Scooter prices use dated observed market checks; dimensions, engine, brakes and fuel figures come from source-backed model records.",
    caveats: ["The page does not name a universal 'best scooter' because MotoIndex does not currently use a defensible overall scoring model.", "Handling and comfort claims require riding data that are not captured by basic specifications."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "tank", "economy"],
    quickPicks: [{label:"Lowest-priced scooter",metric:"price"},{label:"Lightest scooter",metric:"weight"},{label:"Lowest-seat scooter",metric:"seat"},{label:"Highest published fuel economy",metric:"economy"},{label:"Largest fuel tank",metric:"tank"},{label:"Largest engine",metric:"engine"}],
    editorialSections: ["Scooters under ₱100K", "125cc–160cc scooters", "Larger and maxi-scooters", "Scooters with ABS", "Scooters with lower seat heights", "How scooter size changes everyday use"],
    faqQuestions: ["Which scooters have the lowest observed starting prices?", "Which scooters have ABS?", "Which scooters have lower seat heights?", "Which scooters have published fuel-economy figures?", "What should I compare before choosing a scooter?"],
    relatedGuideSlugs: ["automatic-motorcycles-under-100k", "motorcycles-under-100k", "motorcycles-with-abs-philippines", "fuel-efficient-motorcycles-philippines", "best-motorcycles-for-short-riders"],
    intent: "category"
  },
  {
    slug: "motorcycles-with-abs-philippines",
    kicker: "Braking equipment",
    title: "Motorcycles with ABS in the Philippines",
    description: "Current motorcycles whose records list ABS on at least one configuration, with the recorded ABS wording kept visible by model.",
    primaryKeyword: "motorcycles with ABS Philippines",
    secondaryKeywords: ["cheapest motorcycle with ABS Philippines", "scooters with ABS Philippines", "single channel ABS motorcycle Philippines", "dual channel ABS motorcycle Philippines"],
    directAnswer: "These motorcycles have ABS listed on at least one current configuration in the MotoIndex database. Because ABS availability can vary by trim, the exact recorded ABS wording matters more than a simple yes/no badge.",
    inclusionRules: ["ABS listed on at least one current configuration", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest among qualifying motorcycles.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Rank",
    sourcePolicy: "ABS wording, trim information and core specifications come from source-backed model records; observed prices come from dated live-market checks where available.",
    caveats: ["ABS availability can vary by trim or configuration; verify the exact motorcycle before buying.", "ABS presence alone cannot support an objective 'safest motorcycle' ranking."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs"],
    quickPicks: [{label:"Lowest price with ABS",metric:"price"},{label:"Lightest with ABS",metric:"weight"},{label:"Lowest seat with ABS",metric:"seat"},{label:"Largest engine",metric:"engine"}],
    editorialSections: ["Most affordable motorcycles with ABS", "Automatic motorcycles with ABS", "Underbones with ABS", "Scooters with ABS", "What to check when comparing ABS variants"],
    faqQuestions: ["What is the cheapest motorcycle with ABS in the Philippines?", "Which scooters have ABS?", "Does the Honda Click have ABS?", "Does the Aerox have ABS?", "Is ABS standard on every variant?", "What is single-channel vs dual-channel ABS?"],
    relatedGuideSlugs: ["motorcycles-under-100k", "best-scooters-philippines", "best-underbone-motorcycles-philippines", "motorcycles-100k-to-150k"],
    intent: "category"
  },
  {
    slug: "fuel-efficient-motorcycles-philippines",
    kicker: "Fuel economy",
    title: "Motorcycles with published fuel-economy figures",
    seoTitle: "Most Fuel-Efficient Motorcycles in the Philippines",
    description: "Current motorcycles ordered by sourced published fuel-consumption figures, with tank size and theoretical range shown separately.",
    primaryKeyword: "fuel efficient motorcycles Philippines",
    secondaryKeywords: ["most fuel efficient motorcycle Philippines", "fuel efficient scooters Philippines", "motorcycle km per liter Philippines", "motorcycle fuel economy Philippines"],
    directAnswer: "MotoIndex compares motorcycles with manufacturer-published or otherwise sourced fuel-consumption figures recorded in the database. Different sources can use different test conditions, so the figures are useful references but not perfectly comparable real-world results.",
    inclusionRules: ["A sourced published fuel-consumption figure is present", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Highest published km/L first.",
    tieBreakers: ["Lower observed starting price"],
    orderLabel: "Rank",
    sourcePolicy: "Published km/L values and specifications come from dated source-backed model records; observed prices come from dated market checks. Theoretical range is calculated as published km/L × tank capacity.",
    caveats: ["Published fuel-economy figures can use different test methods and should not be treated as identical real-world tests.", "Theoretical range is a calculation, not a real-world range estimate; traffic, load, speed, terrain, tire pressure and maintenance affect actual consumption."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "economy", "tank", "range"],
    quickPicks: [{label:"Highest published fuel economy",metric:"economy"},{label:"Largest fuel tank",metric:"tank"},{label:"Longest theoretical range",metric:"range"},{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"}],
    editorialSections: ["Highest published km/L", "Fuel-efficient scooters", "Fuel-efficient underbones", "Fuel economy vs fuel-tank size", "What affects real-world fuel economy?"],
    faqQuestions: ["What motorcycle has the best published fuel economy?", "What scooter has the best published fuel economy?", "How far can a motorcycle travel on one tank?", "Are manufacturer fuel-economy figures accurate?", "Does engine size affect fuel economy?"],
    relatedGuideSlugs: ["best-scooters-philippines", "best-underbone-motorcycles-philippines", "motorcycles-under-100k", "best-motorcycles-for-long-rides"],
    intent: "use-case"
  },
  {
    slug: "best-underbone-motorcycles-philippines",
    kicker: "Underbones",
    title: "Underbone motorcycles to compare in the Philippines",
    description: "Current Philippine-market underbones compared by price, engine, output, transmission, weight, seat height, brakes and published fuel economy.",
    primaryKeyword: "best underbone motorcycles Philippines",
    secondaryKeywords: ["underbone motorcycles Philippines", "underbone with ABS Philippines", "fuel efficient underbone Philippines", "lightweight underbone Philippines"],
    directAnswer: "Underbones range from inexpensive everyday transportation to much more performance-oriented motorcycles. MotoIndex compares the current records using observed price, engine size, power, transmission, curb weight, seat height, braking equipment and published fuel economy where available.",
    inclusionRules: ["Underbone category", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest for display.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Price order",
    sourcePolicy: "Observed prices use dated market checks; power, torque, dimensions, transmission and braking details come from each source-backed model record.",
    caveats: ["MotoIndex does not call one underbone universally best without an overall scoring methodology.", "Power and torque should be compared with curb weight, gearing and intended use rather than read in isolation."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "power", "torque", "economy"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Largest engine",metric:"engine"},{label:"Highest power",metric:"power"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Highest published fuel economy",metric:"economy"}],
    editorialSections: ["Affordable underbones", "Underbones with the largest engines", "Most powerful underbones", "Lightweight underbones", "Lower-seat underbones", "Underbones with ABS", "Fuel-efficient underbones"],
    faqQuestions: ["Which underbones have the lowest observed prices?", "Which underbones have the largest engines?", "Which underbones have ABS?", "Which underbones are lightest?", "Which underbones have published fuel-economy figures?"],
    relatedGuideSlugs: ["motorcycles-under-100k", "motorcycles-100k-to-150k", "motorcycles-with-abs-philippines", "fuel-efficient-motorcycles-philippines", "lightweight-motorcycles-philippines"],
    intent: "category"
  },
  {
    slug: "best-motorcycles-for-short-riders",
    kicker: "Lower seats",
    title: "Motorcycles with lower seat heights",
    description: "Current models ordered by published seat height, then curb weight, while keeping the limits of seat-height-only fit advice explicit.",
    primaryKeyword: "best motorcycles for short riders Philippines",
    secondaryKeywords: ["motorcycles with low seat height Philippines", "low seat motorcycle Philippines", "motorcycles for shorter riders Philippines"],
    directAnswer: "This list is ordered by published seat height, with curb weight used as the secondary factor. A lower published seat does not guarantee easier ground reach because seat width, suspension sag, footwear and rider proportions also affect actual fit.",
    inclusionRules: ["Published seat-height figure is present", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Lowest published seat height first.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Seat order",
    sourcePolicy: "Seat height, curb weight, ground clearance and other specifications come from dated source-backed model records; observed prices come from current market checks where available.",
    caveats: ["Published seat height is only one rider-fit measurement.", "Seat width, suspension compression, rider inseam, footwear and weight distribution are not fully represented in the current database."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "clearance"],
    quickPicks: [{label:"Lowest published seat",metric:"seat"},{label:"Lightest",metric:"weight"},{label:"Lowest price",metric:"price"},{label:"Largest engine",metric:"engine"}],
    editorialSections: ["Lowest published seat heights", "Low seat + low weight", "Automatic motorcycles with lower seats", "Lower-seat motorcycles below ₱100K", "Why seat height isn't the whole story", "Physical fit checklist"],
    faqQuestions: ["What motorcycle has the lowest seat?", "What motorcycles are good for shorter riders?", "Is seat height the same as rider fit?", "Is a lighter motorcycle easier for shorter riders?", "What seat height is considered low?"],
    relatedGuideSlugs: ["lightweight-motorcycles-philippines", "automatic-motorcycles-under-100k", "motorcycles-under-100k", "best-scooters-philippines"],
    intent: "fit"
  },
  {
    slug: "best-motorcycles-for-long-rides",
    kicker: "Longer rides",
    title: "Motorcycles with larger tanks and touring-oriented layouts",
    description: "Current road-, maxi-scooter- and adventure-oriented motorcycles compared by tank capacity and other measurable long-ride planning data.",
    primaryKeyword: "best motorcycles for long rides Philippines",
    secondaryKeywords: ["motorcycles for long rides Philippines", "touring motorcycles Philippines", "motorcycles with large fuel tank Philippines"],
    directAnswer: "This is not a comfort ranking. MotoIndex uses fuel-tank capacity plus road-, maxi-scooter- and adventure-oriented classifications to identify motorcycles worth considering for longer rides, while clearly separating measurable specifications from comfort factors the dataset cannot determine.",
    inclusionRules: ["Road-, maxi-scooter-, adventure- or similar longer-ride-oriented category", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Largest fuel-tank capacity first.",
    tieBreakers: ["Lower observed starting price"],
    orderLabel: "Tank order",
    sourcePolicy: "Tank capacity, engine, weight, ABS and published fuel figures come from dated model records. Theoretical range is calculated from published km/L × tank capacity where both values exist.",
    caveats: ["This is not an objective comfort ranking.", "Specifications do not fully measure seat comfort after hours of riding, wind buffeting, vibration, luggage usability, passenger comfort or suspension quality."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "tank", "economy", "range"],
    quickPicks: [{label:"Largest fuel tank",metric:"tank"},{label:"Longest theoretical range",metric:"range"},{label:"Highest published fuel economy",metric:"economy"},{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"}],
    editorialSections: ["Largest fuel tanks", "Models with published fuel economy", "Estimated theoretical fuel range", "Maxi-scooters for longer rides", "Adventure and road motorcycles", "What MotoIndex cannot determine from specifications"],
    faqQuestions: ["Which motorcycles have larger fuel tanks?", "Which models have the longest theoretical fuel range?", "Do basic specifications measure long-distance comfort?", "Which touring-oriented models have ABS?", "How should theoretical fuel range be interpreted?"],
    relatedGuideSlugs: ["fuel-efficient-motorcycles-philippines", "best-scooters-philippines", "motorcycles-with-abs-philippines"],
    intent: "use-case"
  },
  {
    slug: "lightweight-motorcycles-philippines",
    kicker: "Low weight",
    title: "Lightweight motorcycles in the Philippines",
    description: "Current motorcycles ordered by published curb weight, with seat height, price, engine, output and equipment for context.",
    primaryKeyword: "lightweight motorcycles Philippines",
    secondaryKeywords: ["lightest motorcycles Philippines", "lightweight scooter Philippines", "lightweight motorcycle under 100k Philippines"],
    directAnswer: "These motorcycles are ordered by their published curb weight. Lower weight can make a motorcycle easier to move around a parking area or manage at very low speeds, but seat height, seat width and weight distribution still affect real-world fit and control.",
    inclusionRules: ["Published curb-weight figure is present", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Lowest published curb weight first.",
    tieBreakers: ["Lower published seat height"],
    orderLabel: "Weight order",
    sourcePolicy: "Curb weight, seat height, engine, power, transmission and braking data come from dated model records; prices use current observed checks where available.",
    caveats: ["Lower weight does not automatically mean a motorcycle is physically small or easier for every rider.", "Seat width and weight distribution are not fully represented in the current structured dataset."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "power"],
    quickPicks: [{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Lowest price",metric:"price"},{label:"Highest power",metric:"power"},{label:"Largest engine",metric:"engine"}],
    editorialSections: ["Lightest motorcycles currently tracked", "Lightweight motorcycles below ₱100K", "Lightweight automatic motorcycles", "Lightweight motorcycles with lower seats", "Lightweight does not always mean small"],
    faqQuestions: ["What is the lightest motorcycle currently tracked?", "Which lightweight motorcycles cost below ₱100K?", "Which lightweight motorcycles are automatic?", "Does lower weight always mean easier rider fit?", "How useful is horsepower per 100 kg?"],
    relatedGuideSlugs: ["best-motorcycles-for-short-riders", "motorcycles-under-100k", "automatic-motorcycles-under-100k", "best-underbone-motorcycles-philippines"],
    intent: "fit"
  }
  ,{
    slug: "best-motorcycles-for-daily-commute-philippines",
    kicker: "Daily commute",
    title: "Motorcycles for daily commuting in the Philippines",
    description: "Current motorcycles ranked with a transparent city-commute profile using curb weight, transmission, rider-fit starting point, traffic context and published fuel data where available.",
    primaryKeyword: "best motorcycle for daily commute Philippines",
    secondaryKeywords: ["commuter motorcycle Philippines", "best scooter for daily commute Philippines", "motorcycle for Manila traffic", "daily motorcycle Philippines"],
    directAnswer: "MotoIndex ranks this shortlist with a fixed daily-commute profile: 30-inch inseam, heavy stop-go traffic and a 20 km daily round trip. Lower curb weight, automatic transmission, fit and published fuel economy can improve the score, but the result is a measurable shortlist rather than a universal best-motorcycle claim.",
    inclusionRules: ["Current, indexable Philippine-market motorcycle record", "Motorcycle can be evaluated by the MotoIndex decision engine using stored dimensions, transmission, category and price data"],
    orderingRule: "Highest MotoIndex city-commute decision score first using a fixed 30-inch-inseam, heavy-traffic, 20 km/day profile.",
    tieBreakers: ["Lower observed starting price"],
    orderLabel: "Rank",
    sourcePolicy: "The decision score uses source-backed motorcycle dimensions, transmission, engine and price records. Published fuel economy is used only when stored; running-cost models remain labeled estimates.",
    caveats: ["The ranking does not measure comfort, dealer proximity, parts availability or actual traffic filtering width.", "Seat width, suspension sag and rider technique can change real-world fit even when published seat height looks favorable."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "economy", "context"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Highest published fuel economy",metric:"economy"}],
    editorialSections: ["Strong city-commute profiles", "Automatic motorcycles for stop-go traffic", "Lighter motorcycles for daily use", "Published fuel economy for commuting", "What a commute score cannot measure"],
    faqQuestions: ["How does MotoIndex rank motorcycles for daily commuting?", "Is an automatic motorcycle always better in traffic?", "Does a lighter motorcycle make commuting easier?", "How should fuel-economy figures be used?", "Should I use the personalized finder instead?"],
    relatedGuideSlugs: ["best-scooters-philippines", "fuel-efficient-motorcycles-philippines", "lightweight-motorcycles-philippines", "motorcycles-under-100k"],
    intent: "use-case"
  },
  {
    slug: "beginner-friendly-motorcycles-philippines",
    kicker: "New rider shortlist",
    title: "Beginner-friendly motorcycle shortlist in the Philippines",
    description: "A measurable starting shortlist using lower seat height, lower curb weight, manageable output and ABS context without pretending specifications can determine rider skill or confidence.",
    primaryKeyword: "beginner motorcycle Philippines",
    secondaryKeywords: ["best motorcycle for beginners Philippines", "first motorcycle Philippines", "easy motorcycle for beginners Philippines", "beginner scooter Philippines"],
    directAnswer: "MotoIndex treats beginner-friendliness as a starting shortlist, not a safety guarantee. The order favors motorcycles with lower curb weight, lower published seat height and manageable recorded output, with ABS context shown separately. Training, throttle control, braking practice and an in-person fit check matter more than any database score.",
    inclusionRules: ["Current, indexable Philippine-market motorcycle record", "Published curb weight and seat height are present", "Recorded power is present"],
    orderingRule: "A measurable beginner-starting score favors lower curb weight and seat height, then moderates very high power-to-weight values; ABS is shown as an equipment factor rather than a skill substitute.",
    tieBreakers: ["Lower observed starting price"],
    orderLabel: "Rank",
    sourcePolicy: "Weight, seat height, output, ABS wording and prices come from dated model records. The page does not infer rider skill, handling feel or training quality from specifications.",
    caveats: ["No motorcycle is automatically safe or suitable for a new rider because of specifications alone.", "Rider training, throttle/brake control, local road conditions and an actual test fit should take priority over this shortlist."],
    tableColumns: ["price", "engine", "transmission", "weight", "seat", "abs", "power", "context"],
    quickPicks: [{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Lowest price",metric:"price"},{label:"Highest published fuel economy",metric:"economy"}],
    editorialSections: ["Lower-weight starting points", "Lower published seat heights", "Automatic beginner options", "ABS-equipped options", "Why engine size alone is not a beginner score", "Training matters more than ranking"],
    faqQuestions: ["What makes a motorcycle beginner-friendly?", "Is a low seat always better for beginners?", "Is a lighter motorcycle easier to learn on?", "Do beginners need ABS?", "Should a beginner choose a scooter or manual motorcycle?"],
    relatedGuideSlugs: ["best-motorcycles-for-short-riders", "lightweight-motorcycles-philippines", "motorcycles-with-abs-philippines", "best-scooters-philippines"],
    intent: "fit"
  },
  {
    slug: "motorcycles-400cc-plus-philippines",
    kicker: "400cc+ class",
    title: "400cc+ motorcycles in the Philippines",
    description: "Current motorcycles with at least 400cc recorded displacement, compared by observed price, weight, seat height, output, tank size and ABS context for big-bike and expressway-planning research.",
    primaryKeyword: "400cc motorcycle Philippines",
    secondaryKeywords: ["400cc motorcycles Philippines", "expressway motorcycle Philippines", "big bike Philippines", "affordable 400cc motorcycle Philippines"],
    directAnswer: "This guide lists current MotoIndex motorcycles with at least 400cc recorded engine displacement. It is useful for big-bike and expressway-planning research, but engine displacement alone is not a legal determination: confirm the motorcycle's registration classification and current tollway rules before relying on it for expressway access.",
    inclusionRules: ["Recorded engine displacement is at least 400cc", "Current, indexable Philippine-market motorcycle record"],
    orderingRule: "Observed starting price from lowest to highest within the 400cc+ recorded-displacement set.",
    tieBreakers: ["Lower curb weight"],
    orderLabel: "Price order",
    sourcePolicy: "Displacement, dimensions, output and braking data come from dated model records. Price uses current observed checks where available. Tollway access is not inferred from displacement alone.",
    caveats: ["A 400cc+ engine record does not by itself establish legal expressway access.", "Confirm current tollway rules, OR/CR classification, exact variant and registration details before purchase."],
    tableColumns: ["price", "engine", "power", "weight", "seat", "abs", "tank", "context"],
    quickPicks: [{label:"Lowest price",metric:"price"},{label:"Lightest",metric:"weight"},{label:"Lowest seat",metric:"seat"},{label:"Highest power",metric:"power"},{label:"Largest fuel tank",metric:"tank"}],
    editorialSections: ["Lowest-priced 400cc+ motorcycles", "Lighter 400cc+ motorcycles", "Lower-seat big-bike options", "Adventure and road-focused 400cc+ models", "What to verify for expressway planning"],
    faqQuestions: ["Which 400cc+ motorcycles are cheapest in the current catalog?", "Does 400cc automatically mean expressway legal?", "Which 400cc+ motorcycle has the lowest seat?", "Which 400cc+ motorcycle is lightest?", "What should I verify before buying for expressway use?"],
    relatedGuideSlugs: ["best-motorcycles-for-long-rides", "motorcycles-with-abs-philippines", "lightweight-motorcycles-philippines"],
    intent: "category"
  }

];

export function getRecommendationGuide(slug: string) {
  return recommendationGuides.find((guide) => guide.slug === slug);
}

export function getRecommendationModels(slug: string) {
  const models = [...publicMotorcycles];
  const byPrice = [...models].sort((a,b) => observedMarketRange(a).from - observedMarketRange(b).from || a.curbWeightKg - b.curbWeightKg);
  const hasAbs = (m: Motorcycle) => /\bABS\b/i.test(m.abs) && !/^No ABS/i.test(m.abs);
  switch (slug) {
    case "motorcycles-under-100k": return byPrice.filter(m => observedMarketRange(m).from < 100000);
    case "automatic-motorcycles-under-100k": return byPrice.filter(m => m.transmission === "Automatic" && observedMarketRange(m).from < 100000);
    case "motorcycles-100k-to-150k": return byPrice.filter(m => observedMarketRange(m).from >= 100000 && observedMarketRange(m).from <= 150000);
    case "best-scooters-philippines": return byPrice.filter(m => m.category.toLowerCase().includes("scooter"));
    case "motorcycles-with-abs-philippines": return byPrice.filter(hasAbs);
    case "fuel-efficient-motorcycles-philippines": return models.filter(m => typeof m.fuelConsumptionKmL === "number").sort((a,b) => (b.fuelConsumptionKmL || 0) - (a.fuelConsumptionKmL || 0) || observedMarketRange(a).from - observedMarketRange(b).from);
    case "best-underbone-motorcycles-philippines": return byPrice.filter(m => /underbone/i.test(m.category));
    case "best-motorcycles-for-short-riders": return [...models].sort((a,b) => a.seatHeightMm - b.seatHeightMm || a.curbWeightKg - b.curbWeightKg);
    case "best-motorcycles-for-long-rides": return models.filter(m => /premium|adventure|maxi|sport bike|roadster/i.test(m.category)).sort((a,b) => b.fuelTankL - a.fuelTankL || observedMarketRange(a).from - observedMarketRange(b).from);
    case "lightweight-motorcycles-philippines": return [...models].sort((a,b) => a.curbWeightKg - b.curbWeightKg || a.seatHeightMm - b.seatHeightMm);
    case "best-motorcycles-for-daily-commute-philippines": return [...models].sort((a,b) => evaluateMotorcycle(b,{useCase:"city",inseamIn:30,passenger:false,highway:false,expresswayClass:false,luggage:false,traffic:"heavy",dailyKm:20,downPaymentPct:20,termMonths:36,annualRatePct:12}).score - evaluateMotorcycle(a,{useCase:"city",inseamIn:30,passenger:false,highway:false,expresswayClass:false,luggage:false,traffic:"heavy",dailyKm:20,downPaymentPct:20,termMonths:36,annualRatePct:12}).score || observedMarketRange(a).from - observedMarketRange(b).from);
    case "beginner-friendly-motorcycles-philippines": return [...models].sort((a,b) => { const score=(m:Motorcycle)=>Math.max(0,40-Math.max(0,m.curbWeightKg-100)*.35-Math.max(0,m.seatHeightMm-740)*.05-Math.max(0,m.powerHp-20)*.8+(hasAbs(m)?5:0)); return score(b)-score(a)||observedMarketRange(a).from-observedMarketRange(b).from; });
    case "motorcycles-400cc-plus-philippines": return byPrice.filter(m => m.engineCc >= 400);
    default: return [];
  }
}

export function isIndexableRecommendation(slug: string) {
  const models = getRecommendationModels(slug);
  return models.length >= 3 && models.every(isIndexableModel);
}

function topBoxProfile(category: string) {
  if (/adventure|maxi/i.test(category)) return { recommendation: "40–55 L touring box class", mounting: "Use a model-specific rear rack or plate rated for the box and load.", bestFor: "Longer rides, rain gear and larger daily carry" };
  if (/premium/i.test(category)) return { recommendation: "35–45 L top box class", mounting: "Confirm rear rack/bracket generation and load rating before purchase.", bestFor: "Commuting plus occasional touring" };
  if (/sport bike/i.test(category)) return { recommendation: "20–35 L compact luggage or tail-bag class", mounting: "Prefer a purpose-built rack or soft-luggage system; verify subframe limits.", bestFor: "Light touring without overwhelming sport-bike proportions" };
  if (/underbone|mini|business/i.test(category)) return { recommendation: "25–35 L utility top box class", mounting: "Verify rack geometry, fasteners and rated carrying load.", bestFor: "Daily essentials and practical utility" };
  return { recommendation: "30–40 L commuter top box class", mounting: "Confirm a model-specific bracket/rack and clearance around grab rails and seat.", bestFor: "Helmet-sized daily storage and commuting" };
}

export function getFitmentRecommendations(modelId: string): FitmentRecommendation[] {
  const model = getModelById(modelId);
  if (!model) return [];
  const top = topBoxProfile(model.category);
  const topBoxFitment = [...getTopBoxFitmentsForModel(modelId)].sort((a, b) => Number(b.status === "verified") - Number(a.status === "verified"))[0];
  const topBoxRecommendation: FitmentRecommendation = topBoxFitment
    ? {
        modelId,
        categorySlug: "top-box",
        title: `${model.model} top-box fitment`,
        recommendation: `${topBoxFitment.topBoxLabel} with rack ${topBoxFitment.rackCode}`,
        mounting: `${topBoxFitment.rackLabel}. ${topBoxFitment.plateRequirement}`,
        bestFor: top.bestFor,
        confidence: topBoxFitment.status,
        caution: topBoxFitment.marketNote || `Manufacturer fitment lists model years ${topBoxFitment.modelYears}. Recheck the exact motorcycle year and rack load limit before ordering.`,
        sourceLabel: topBoxFitment.sourceLabel,
        sourceUrl: topBoxFitment.sourceUrl,
        productHref: topBoxFitment.productHref
      }
    : { modelId, categorySlug: "top-box", title: `${model.model} top-box starting point`, recommendation: top.recommendation, mounting: top.mounting, bestFor: top.bestFor, confidence: "research", caution: "Confirm the exact bracket, model generation, bolt pattern and rack load limit before buying." };
  return [
    topBoxRecommendation,
    { modelId, categorySlug: "phone-holders", title: `${model.model} phone-mount starting point`, recommendation: "Vibration-damped handlebar or mirror-mount system", mounting: "Measure available bar/mirror-stem mounting area and verify control, windscreen and steering clearance.", bestFor: "Navigation and everyday commuting", confidence: "research", caution: "Phone-camera stabilization systems can be sensitive to motorcycle vibration. Check the mount maker and phone maker guidance before use." },
    { modelId, categorySlug: "intercoms", title: `${model.model} intercom buying path`, recommendation: "Choose by helmet shell/liner compatibility rather than motorcycle model", mounting: "Intercom fitment follows helmet speaker pockets, clamp/adhesive area and microphone layout.", bestFor: "Navigation prompts, calls and rider-to-rider communication", confidence: "medium", caution: "Intercom fit depends mainly on the helmet, speaker pockets and microphone position rather than the motorcycle." },
    { modelId, categorySlug: "rain-gear", title: `${model.model} rain-gear buying path`, recommendation: "Packable waterproof over-layer with high-visibility detailing", mounting: "No motorcycle mounting required; size over normal riding gear and confirm heat clearance if stored on-bike.", bestFor: "Philippine wet-season commuting and emergency carry", confidence: "medium", caution: "Check the product’s stated waterproofing and visibility details before relying on it in heavy rain." }
  ];
}

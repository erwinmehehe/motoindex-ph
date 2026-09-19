export type BrandSeoGrowthProfile = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  intentNote: string;
  bigBikeTitle?: string;
  bigBikeDescription?: string;
};

const profiles: Record<string, BrandSeoGrowthProfile> = {
  honda: {
    seoTitle: "Honda Philippines Price List 2026 | Motorcycles & Big Bikes",
    seoDescription: "Honda Philippines motorcycle price list with current scooters, commuters and big bikes including CB650R, CBR650R, Rebel, X-ADV and Gold Wing.",
    heroTitle: "Honda Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current Honda motorcycles in the Philippines by price, engine size, seat height and category, from everyday scooters to 400cc+ big bikes.",
    intentNote: "This Honda brand hub owns broad Honda motorcycle, Honda price list and Honda big bike Philippines intent. Model-specific price, specs and financing stay on each canonical model URL.",
    bigBikeTitle: "Honda big bikes in the Philippines",
    bigBikeDescription: "Compare current Honda 400cc+ motorcycles tracked by MotoIndex, including naked, sport, cruiser, adventure-scooter and touring options."
  },
  yamaha: {
    seoTitle: "Yamaha Philippines Price List 2026 | Motorcycles & Big Bikes",
    seoDescription: "Yamaha Philippines motorcycle price list with current scooters, sport models and 400cc+ big bikes including TMAX, YZF-R7 and YZF-R1M.",
    heroTitle: "Yamaha Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current Yamaha motorcycles in the Philippines by price, engine size, seat height and category, from Mio and NMAX scooters to 400cc+ models.",
    intentNote: "This Yamaha brand hub owns broad Yamaha motorcycle, Yamaha price list and Yamaha big bike Philippines intent. Model-specific price, specs and financing stay on each canonical model URL.",
    bigBikeTitle: "Yamaha big bikes in the Philippines",
    bigBikeDescription: "Compare current Yamaha 400cc+ motorcycles tracked by MotoIndex, including maxi-scooter and supersport options."
  },
  kawasaki: {
    seoTitle: "Kawasaki Philippines Price List 2026 | Big Bikes",
    seoDescription: "Kawasaki Philippines price list with current big bikes including Z500, Ninja 500, ZX-4RR, Ninja 1000SX and Ninja H2, plus specs and prices.",
    heroTitle: "Kawasaki Philippines Motorcycle Price List 2026",
    heroDescription: "Compare current Kawasaki motorcycles and big bikes in the Philippines by price, engine size, seat height and category, from 451cc street bikes to H2.",
    intentNote: "This Kawasaki brand hub owns broad Kawasaki motorcycle, Kawasaki price list and Kawasaki big bike Philippines intent. Z, Ninja and hypersport model details stay on their canonical model URLs.",
    bigBikeTitle: "Kawasaki big bikes in the Philippines",
    bigBikeDescription: "Compare current Kawasaki 400cc+ motorcycles tracked by MotoIndex, from the Z500 and Ninja 500 to ZX-4RR, Ninja 1000SX and Ninja H2."
  },
  vespa: {
    seoTitle: "Vespa Philippines Price List 2026 | GTS, GTV, Sprint & Primavera",
    seoDescription: "Vespa Philippines price list for GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150 with specs, seat height, ABS and ownership links.",
    heroTitle: "Vespa Philippines Price List 2026",
    heroDescription: "Compare Vespa scooters tracked for the Philippines, including GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150, with prices, engine sizes, seat heights, ABS details and ownership research.",
    intentNote: "This brand hub owns broad Vespa motorcycle, Vespa scooter and Vespa price Philippines intent. Model-specific price, specs, colors and financing stay on each canonical model URL instead of being split into city-price or installment pages."
  }
};

export function brandSeoGrowthProfile(makeSlug: string) {
  return profiles[makeSlug];
}

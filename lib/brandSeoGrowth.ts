export type BrandSeoGrowthProfile = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  intentNote: string;
  bigBikeMinCc?: number;
  bigBikeTitle?: string;
  bigBikeDescription?: string;
};

const profiles: Record<string, BrandSeoGrowthProfile> = {
  kawasaki: {
    seoTitle: "Kawasaki Big Bikes Philippines 2026 | Motorcycle Price List",
    seoDescription: "Kawasaki Philippines motorcycle price list with current Ninja, Z and big-bike models, 400cc+ prices, engine sizes, seat heights and buyer research.",
    heroTitle: "Kawasaki Motorcycle Philippines Price List 2026",
    heroDescription: "Compare current Kawasaki motorcycles in the Philippines, from commuter and dual-sport models to Ninja and Z big bikes, with published prices, engine sizes, seat heights and ownership research.",
    intentNote: "This brand hub owns Kawasaki motorcycles Philippines, Kawasaki price list Philippines and Kawasaki big bike Philippines intent. Individual Ninja, Z and other model searches stay on each canonical model page instead of being split into thin price or big-bike URLs.",
    bigBikeMinCc: 400,
    bigBikeTitle: "Kawasaki big bikes in the Philippines",
    bigBikeDescription: "Compare current Kawasaki motorcycles at 400cc and above by published price, engine size, power, seat height and category. Open any model for its canonical specs, financing and ownership research."
  },
  vespa: {
    seoTitle: "Vespa Philippines Price List 2026 | GTS, GTV, Sprint & Primavera",
    seoDescription: "Vespa Philippines price list for GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150 with specs, seat height, ABS and ownership links.",
    heroTitle: "Vespa Philippines Price List 2026",
    heroDescription: "Compare Vespa scooters tracked for the Philippines, including GTS SuperSport 300, GTV 300, Primavera 150 and Sprint 150, with dated prices, engine sizes, seat heights, ABS details and ownership research.",
    intentNote: "This brand hub owns broad Vespa motorcycle, Vespa scooter and Vespa price Philippines intent. Model-specific price, specs, colors and financing stay on each canonical model URL instead of being split into city-price or installment pages."
  }
};

export function brandSeoGrowthProfile(makeSlug: string) {
  return profiles[makeSlug];
}

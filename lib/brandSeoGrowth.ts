export type BrandSeoGrowthProfile = {
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroDescription: string;
  intentNote: string;
};

const profiles: Record<string, BrandSeoGrowthProfile> = {
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

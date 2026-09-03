export type PhBrandTier = 1 | 2 | 3;

type BrandPriority = {
  tier: PhBrandTier;
  label: string;
  reason: string;
};

export const phBrandPriority: Record<string, BrandPriority> = {
  yamaha: { tier: 1, label: "Core PH brand", reason: "High-volume Philippine-market coverage already established." },
  honda: { tier: 1, label: "Core PH brand", reason: "High-volume Philippine-market coverage already established." },
  suzuki: { tier: 1, label: "Core PH brand", reason: "High-volume Philippine-market coverage already established." },
  kawasaki: { tier: 1, label: "Core PH brand", reason: "High-volume Philippine-market coverage already established." },

  rusi: { tier: 2, label: "PH expansion · Tier 2", reason: "High-demand value brand with broad Philippine-market consideration." },
  motorstar: { tier: 2, label: "PH expansion · Tier 2", reason: "Value-focused local-market brand with commuter and larger-displacement interest." },
  kymco: { tier: 2, label: "PH expansion · Tier 2", reason: "Established scooter brand with strong urban and premium-scooter relevance." },
  sym: { tier: 2, label: "PH expansion · Tier 2", reason: "Scooter-focused brand with strong fit for Philippine urban search intent." },
  cfmoto: { tier: 2, label: "PH expansion · Tier 2", reason: "Fast-growing mid-displacement portfolio with strong value and enthusiast intent." },
  bristol: { tier: 2, label: "PH expansion · Tier 2", reason: "Philippine-market brand with distinctive scooter, classic and adventure demand." },
  benelli: { tier: 2, label: "PH expansion · Tier 2", reason: "Accessible larger-displacement models with commuter-to-adventure search demand." },

  ktm: { tier: 3, label: "Enthusiast · Tier 3", reason: "Performance-focused models with strong enthusiast comparison intent." },
  "royal-enfield": { tier: 3, label: "Enthusiast · Tier 3", reason: "Classic and adventure motorcycles with strong ownership-research demand." },
  "bmw-motorrad": { tier: 3, label: "Premium · Tier 3", reason: "Premium touring, adventure and urban-mobility research intent." },
  ducati: { tier: 3, label: "Premium · Tier 3", reason: "Premium performance and lifestyle demand with high-value comparison intent." },
  triumph: { tier: 3, label: "Enthusiast · Tier 3", reason: "Modern-classic and roadster demand with high comparison value." },
  vespa: { tier: 3, label: "Premium scooter · Tier 3", reason: "Premium scooter searches with strong price, variant and ownership intent." },
  aprilia: { tier: 3, label: "Enthusiast · Tier 3", reason: "Sport and premium-scooter demand with high consideration-stage intent." },
  husqvarna: { tier: 3, label: "Enthusiast · Tier 3", reason: "Niche performance models with focused comparison and specification intent." }
};

export const phTier2BrandSlugs = Object.entries(phBrandPriority).filter(([, value]) => value.tier === 2).map(([slug]) => slug);
export const phTier3BrandSlugs = Object.entries(phBrandPriority).filter(([, value]) => value.tier === 3).map(([slug]) => slug);

export function getPhBrandPriority(slug: string) {
  return phBrandPriority[slug];
}

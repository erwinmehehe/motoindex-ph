export type FreshnessStatus = "verified" | "stale" | "review";

export type Motorcycle = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  generation: string;
  category: string;
  srp: number;
  engineCc: number;
  powerHp: number;
  torqueNm: number;
  curbWeightKg: number;
  seatHeightMm: number;
  fuelTankL: number;
  fuelConsumptionKmL?: number;
  groundClearanceMm?: number;
  frontTire: string;
  rearTire: string;
  abs: string;
  colors: string[];
  searchVolume: number;
  keywordDifficulty: number;
  sourceLabel: string;
  sourceUrl: string;
  verifiedAt: string;
  freshness: FreshnessStatus;
  summary: string;
  marketStatus?: "current" | "previous" | "discontinued" | "uncertain";
  priceContext?: string;
  marketPriceHighPhp?: number;
  marketPriceSourceLabel?: string;
  marketPriceSourceUrl?: string;
  marketPriceCheckedAt?: string;
  transmission?: "Automatic" | "Manual";
  /**
   * Unofficial names riders actually search for. Only unambiguous aliases go
   * here — a different spelling ("PG1"), or the displacement people append
   * ("Winner X 150"). Community generation nicknames like "Click V3" are
   * deliberately excluded: sellers use them for different model years, so
   * pinning one to a record would assert something no source supports.
   */
  alsoKnownAs?: string[];
  successorId?: string;
};

export type MarketPriceCheck = {
  modelId: string;
  sourceName: string;
  sourceType: "manufacturer" | "comparison-site" | "dealer";
  sourceUrl: string;
  priceFromPhp: number;
  priceToPhp?: number;
  checkedAt: string;
  note?: string;
};

export type MotorcycleVariant = {
  id: string;
  modelId: string;
  name: string;
  slug: string;
  srpPhp: number;
  status: "verified" | "research";
  checkedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  featureSummary: string;
  differentiators: string[];
  colors?: string[];
  braking?: string;
  weightKg?: number;
  note?: string;
};

export type ModelPriceSnapshot = {
  modelId: string;
  observedAt: string;
  fromPhp: number;
  toPhp?: number;
  sourceCount: number;
  sourceLabels: string[];
  kind: "launch" | "market";
  sourceUrl?: string;
  note?: string;
};


export type HelmetBrand = {
  brand: string;
  slug: string;
  searchVolume: number;
  keywordDifficulty: number;
  positioning: string;
};

export type Comparison = {
  slug: string;
  a: string;
  b: string;
  summary: string;
};

export type AccessoryCategory = {
  name: string;
  slug: string;
  searchVolume: number;
  keywordDifficulty: number;
  description: string;
  buyerQuestions: string[];
};


export type FitmentConfidence = "research" | "medium" | "verified";

export type FitmentRecommendation = {
  modelId: string;
  categorySlug: string;
  title: string;
  recommendation: string;
  mounting: string;
  bestFor: string;
  confidence: FitmentConfidence;
  caution: string;
  sourceLabel?: string;
  sourceUrl?: string;
  productHref?: string;
};

export type RecommendationTableColumn =
  | "price"
  | "engine"
  | "transmission"
  | "weight"
  | "seat"
  | "abs"
  | "economy"
  | "tank"
  | "range"
  | "power"
  | "torque"
  | "clearance"
  | "context";

export type RecommendationQuickPickMetric =
  | "price"
  | "weight"
  | "seat"
  | "economy"
  | "tank"
  | "engine"
  | "power"
  | "range";

export type RecommendationGuide = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  seoTitle?: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  directAnswer: string;
  inclusionRules: string[];
  orderingRule: string;
  tieBreakers: string[];
  orderLabel: "Rank" | "Price order" | "Seat order" | "Tank order" | "Weight order";
  sourcePolicy: string;
  caveats: string[];
  tableColumns: RecommendationTableColumn[];
  quickPicks: { label: string; metric: RecommendationQuickPickMetric }[];
  editorialSections: string[];
  faqQuestions: string[];
  relatedGuideSlugs: string[];
  intent: "budget" | "fit" | "use-case" | "category";
};

export type CatalogStatus = "research" | "verified";

export type HelmetProduct = {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  slug: string;
  helmetType: "Full face" | "Modular" | "Half face" | "Open face" | "Hybrid" | "Off-road" | "Adventure";
  weightG?: number;
  sizes: string[];
  sizeChart?: { size: string; headCm: string }[];
  colors?: string[];
  variants?: string[];
  intercomReady: boolean;
  visor: string;
  pinlock?: string;
  replacementVisors?: string[];
  certification?: string;
  shell?: string;
  stockStatus?: string;
  priceFromPhp?: number;
  priceSourceUrl?: string;
  status: CatalogStatus;
  sourceLabel: string;
  sourceUrl?: string;
  lastChecked?: string;
  description: string;
};

export type TireProduct = {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  slug: string;
  useCase: string;
  construction: string;
  knownSizes: string[];
  priceFromPhp?: number;
  status: CatalogStatus;
  sourceLabel: string;
  sourceUrl?: string;
  lastChecked?: string;
  description: string;
};

export type TopBoxProduct = {
  id: string;
  brand: string;
  brandSlug: string;
  model: string;
  slug: string;
  capacityL: number;
  shell: string;
  helmetCapacity: string;
  mountingNote: string;
  dimensionsCm?: { width: number; depth: number; height: number };
  weightKg?: number;
  maxLoadKg?: number;
  mountingSystem?: string;
  includedHardware?: string;
  compatibleAccessories?: { name: string; sku?: string }[];
  colors?: string[];
  variants?: string[];
  stockStatus?: string;
  priceFromPhp?: number;
  status: CatalogStatus;
  sourceLabel: string;
  sourceUrl?: string;
  lastChecked?: string;
  description: string;
};

export type OfferEntityType = "motorcycle" | "helmet" | "tire" | "topbox";
export type OfferStatus = "demo" | "verified" | "expired";
export type SellerType = "dealer" | "retailer" | "marketplace" | "official";

export type SellerOffer = {
  id: string;
  entityType: OfferEntityType;
  entityId: string;
  sellerName: string;
  sellerSlug?: string;
  sellerType: SellerType;
  pricePhp?: number;
  downpaymentPhp?: number;
  monthlyPhp?: number;
  termMonths?: number;
  availability: string;
  status: OfferStatus;
  observedAt: string;
  verifiedAt?: string;
  targetUrl?: string;
  affiliateUrl?: string;
  note: string;
};

export type PriceObservation = {
  entityType: OfferEntityType;
  entityId: string;
  sellerName: string;
  pricePhp: number;
  observedAt: string;
  status: OfferStatus;
};


export type SellerProfile = {
  id: string;
  name: string;
  slug: string;
  type: SellerType;
  city: string;
  province?: string;
  region: string;
  addressLabel: string;
  website?: string;
  phoneLabel?: string;
  description: string;
  brands: string[];
  categories: string[];
  isDemo: boolean;
  status: "research" | "verified";
  lastChecked?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  verificationNote?: string;
};

export type PriceAlertTarget = {
  entityType: OfferEntityType;
  entityId: string;
  label: string;
  currentPricePhp?: number;
};

export type OfferImportRow = {
  sellerSlug: string;
  entityType: OfferEntityType;
  entityId: string;
  pricePhp?: number;
  downpaymentPhp?: number;
  monthlyPhp?: number;
  termMonths?: number;
  availability: string;
  observedAt: string;
  sourceUrl?: string;
  affiliateUrl?: string;
};

export type UsedListingCondition = "fair" | "good" | "excellent";
export type UsedListingSellerType = "private" | "dealer";
export type UsedListingStatus = "demo" | "verified" | "expired";

export type UsedListing = {
  id: string;
  modelId: string;
  title: string;
  year: number;
  mileageKm: number;
  askingPricePhp: number;
  condition: UsedListingCondition;
  sellerType: UsedListingSellerType;
  location: string;
  postedAt: string;
  status: UsedListingStatus;
  sourceLabel: string;
  sourceUrl?: string;
};

export type VerificationStatus = "research" | "verified";

export type TopBoxFitment = {
  id: string;
  topBoxId: string;
  topBoxLabel: string;
  productHref: string;
  modelId: string;
  rackCode: string;
  rackLabel: string;
  plateRequirement: string;
  modelYears: string;
  marketNote?: string;
  status: VerificationStatus;
  sourceLabel: string;
  sourceUrl: string;
  lastChecked: string;
};

export type OwnershipGuideSource = {
  label: string;
  url: string;
  publisher: string;
  checkedAt: string;
};

export type OwnershipGuideSection = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type OwnershipGuide = {
  slug: string;
  kicker: string;
  title: string;
  description: string;
  lastChecked: string;
  sections: OwnershipGuideSection[];
  sources: OwnershipGuideSource[];
};

export type MediaRightsStatus = "first-party" | "licensed" | "external-reference" | "pending";
export type EntityMedia = {
  id: string;
  role: "primary";
  entityType: "motorcycle" | "helmet" | "tire" | "topbox" | "site";
  entityId: string;
  src: string;
  /** Checked upstream image retained for provenance and temporary fallback during migration. */
  sourceImageUrl?: string;
  alt: string;
  width: number;
  height: number;
  rightsStatus: MediaRightsStatus;
  rightsHolder: string;
  sourceLabel?: string;
  sourceUrl?: string;
  lastChecked: string;
};

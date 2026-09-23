import { brandMaintenanceGuides, maintenanceSchedules } from "@/lib/maintenance";

export const GARAGE_STORAGE_KEY = "motoindex:garage:v1";
export const GARAGE_VERSION = 1;

export const GARAGE_RECORD_CATEGORIES = [
  "PMS",
  "FUEL",
  "TIRE",
  "BATTERY",
  "REPAIR",
  "ACCIDENT",
  "PART",
  "WARRANTY",
  "PARKING",
  "TOLL",
  "REGISTRATION",
  "INSURANCE",
  "RESALE",
] as const;

export const GARAGE_DOCUMENT_TYPES = [
  "OR",
  "CR",
  "CTPL",
  "INSURANCE",
  "WARRANTY",
  "RECEIPT",
  "DEED_OF_SALE",
  "TRANSFER",
  "OTHER",
] as const;

export type GarageRecordCategory = (typeof GARAGE_RECORD_CATEGORIES)[number];
export type GarageDocumentType = (typeof GARAGE_DOCUMENT_TYPES)[number];

export type GarageMotorcycle = {
  id: string;
  make: string;
  model: string;
  variant?: string;
  year?: number;
  plate?: string;
  purchaseDate?: string;
  purchasePricePhp?: number;
  odometerKm: number;
  registrationExpiry?: string;
  insuranceExpiry?: string;
  estimatedResaleValuePhp?: number;
  createdAt: string;
  updatedAt: string;
};

export type GarageRecord = {
  id: string;
  motorcycleId: string;
  category: GarageRecordCategory;
  date: string;
  title: string;
  amountPhp?: number;
  odometerKm?: number;
  liters?: number;
  pricePerLiterPhp?: number;
  nextDueKm?: number;
  nextDueDate?: string;
  notes?: string;
};

export type GarageDocument = {
  id: string;
  motorcycleId: string;
  type: GarageDocumentType;
  label: string;
  reference?: string;
  expiryDate?: string;
  notes?: string;
};

export type GarageState = {
  version: typeof GARAGE_VERSION;
  motorcycles: GarageMotorcycle[];
  records: GarageRecord[];
  documents: GarageDocument[];
};

export function emptyGarageState(): GarageState {
  return { version: GARAGE_VERSION, motorcycles: [], records: [], documents: [] };
}

export function parseGarageState(raw: string | null): GarageState {
  if (!raw) return emptyGarageState();
  try {
    const value = JSON.parse(raw) as Partial<GarageState>;
    if (!Array.isArray(value.motorcycles) || !Array.isArray(value.records) || !Array.isArray(value.documents)) {
      return emptyGarageState();
    }
    return {
      version: GARAGE_VERSION,
      motorcycles: value.motorcycles,
      records: value.records,
      documents: value.documents,
    };
  } catch {
    return emptyGarageState();
  }
}

export function slugifyGaragePart(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function guessedCatalogModelId(bike: Pick<GarageMotorcycle, "make" | "model">) {
  return `${slugifyGaragePart(bike.make)}-${slugifyGaragePart(bike.model)}`;
}

export function maintenanceReferenceForBike(bike: GarageMotorcycle) {
  const guessedId = guessedCatalogModelId(bike);
  const exact = maintenanceSchedules.find((schedule) => schedule.modelId === guessedId);
  if (exact) {
    return {
      level: "Exact model" as const,
      label: exact.sourceLabel,
      sourceUrl: exact.sourceUrl,
      checkedAt: exact.lastChecked,
      summary: exact.items.map((item) => `${item.item}: ${item.interval}`).join(" · "),
    };
  }
  const brand = brandMaintenanceGuides.find((guide) => guide.makeSlug === slugifyGaragePart(bike.make));
  if (brand) {
    return {
      level: "Brand guidance" as const,
      label: brand.sourceLabel,
      sourceUrl: brand.sourceUrl,
      checkedAt: brand.lastChecked,
      summary: brand.pmsMilestones,
    };
  }
  return null;
}

export function daysUntil(date?: string) {
  if (!date) return null;
  const target = new Date(`${date}T00:00:00`);
  if (Number.isNaN(target.valueOf())) return null;
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((target.valueOf() - start.valueOf()) / 86400000);
}

export function money(value?: number) {
  if (!Number.isFinite(value)) return "₱0";
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value || 0);
}

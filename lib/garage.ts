import { brandMaintenanceGuides, maintenanceSchedules } from "@/lib/maintenance";
import { depreciationFactor } from "@/lib/ownership";

export const GARAGE_STORAGE_KEY = "motoindex:garage:v1";
export const GARAGE_VERSION = 2;

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

export type GarageCatalogMotorcycle = {
  id: string;
  make: string;
  makeSlug: string;
  model: string;
  slug: string;
  generation: string;
  srp: number;
  frontTire: string;
  rearTire: string;
  fuelConsumptionKmL?: number;
  href: string;
};

export type GarageMotorcycle = {
  id: string;
  catalogModelId?: string;
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

export type SmartMaintenanceTask = {
  item: string;
  action: string;
  sourceLevel: "Exact model" | "Brand guidance";
  sourceLabel: string;
  sourceUrl: string;
  nextDueKm?: number;
  kmRemaining?: number;
  nextDueDate?: string;
  daysRemaining?: number | null;
  status: "overdue" | "due-soon" | "upcoming";
  note?: string;
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

export function guessedCatalogModelId(bike: Pick<GarageMotorcycle, "catalogModelId" | "make" | "model">) {
  return bike.catalogModelId || `${slugifyGaragePart(bike.make)}-${slugifyGaragePart(bike.model)}`;
}

export function maintenanceReferenceForBike(bike: GarageMotorcycle) {
  const modelId = guessedCatalogModelId(bike);
  const exact = maintenanceSchedules.find((schedule) => schedule.modelId === modelId);
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

export function tireFactsForBike(bike: GarageMotorcycle, catalog?: GarageCatalogMotorcycle) {
  const exact = maintenanceSchedules.find((schedule) => schedule.modelId === guessedCatalogModelId(bike));
  return {
    frontTire: catalog?.frontTire,
    rearTire: catalog?.rearTire,
    tirePressure: exact?.tirePressure,
  };
}

function normalizeMaintenanceName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchingMaintenanceRecord(item: string, records: GarageRecord[]) {
  const wanted = normalizeMaintenanceName(item);
  const words = wanted.split(" ").filter((word) => word.length > 2);
  return records
    .filter((record) => record.category === "PMS")
    .filter((record) => {
      const haystack = normalizeMaintenanceName(`${record.title} ${record.notes || ""}`);
      return words.length > 0 && words.every((word) => haystack.includes(word));
    })
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function addMonths(date: string, months: number) {
  const value = new Date(`${date}T00:00:00`);
  if (Number.isNaN(value.valueOf())) return undefined;
  value.setMonth(value.getMonth() + months);
  return value.toISOString().slice(0, 10);
}

function mileageStatus(remaining?: number) {
  if (remaining === undefined) return "upcoming" as const;
  if (remaining < 0) return "overdue" as const;
  if (remaining <= 500) return "due-soon" as const;
  return "upcoming" as const;
}

function dateStatus(remaining?: number | null) {
  if (remaining === undefined || remaining === null) return "upcoming" as const;
  if (remaining < 0) return "overdue" as const;
  if (remaining <= 30) return "due-soon" as const;
  return "upcoming" as const;
}

function moreUrgent(a: SmartMaintenanceTask["status"], b: SmartMaintenanceTask["status"]) {
  const score = { overdue: 0, "due-soon": 1, upcoming: 2 };
  return score[a] <= score[b] ? a : b;
}

export function smartMaintenanceTasks(bike: GarageMotorcycle, records: GarageRecord[]): SmartMaintenanceTask[] {
  const modelId = guessedCatalogModelId(bike);
  const exact = maintenanceSchedules.find((schedule) => schedule.modelId === modelId);
  if (exact) {
    return exact.items.flatMap((item) => {
      const rule = item.garageRule;
      if (!rule) return [];
      const last = matchingMaintenanceRecord(item.item, records);
      let nextDueKm: number | undefined;
      if (rule.dueKm !== undefined) {
        if (last?.odometerKm !== undefined && last.odometerKm >= rule.dueKm) return [];
        nextDueKm = rule.dueKm;
      } else if (rule.intervalKm !== undefined) {
        if (last?.odometerKm !== undefined) nextDueKm = last.odometerKm + rule.intervalKm;
        else if (rule.firstDueKm !== undefined) {
          if (bike.odometerKm <= rule.firstDueKm) nextDueKm = rule.firstDueKm;
          else nextDueKm = rule.firstDueKm + Math.ceil((bike.odometerKm - rule.firstDueKm) / rule.intervalKm) * rule.intervalKm;
        }
      }

      let nextDueDate: string | undefined;
      if (rule.intervalMonths !== undefined) {
        const baseDate = last?.date || bike.purchaseDate;
        if (baseDate) nextDueDate = addMonths(baseDate, rule.intervalMonths);
      }

      const kmRemaining = nextDueKm === undefined ? undefined : nextDueKm - bike.odometerKm;
      const daysRemaining = nextDueDate ? daysUntil(nextDueDate) : undefined;
      const status = moreUrgent(mileageStatus(kmRemaining), dateStatus(daysRemaining));
      return [{
        item: item.item,
        action: item.action,
        sourceLevel: "Exact model" as const,
        sourceLabel: exact.sourceLabel,
        sourceUrl: exact.sourceUrl,
        nextDueKm,
        kmRemaining,
        nextDueDate,
        daysRemaining,
        status,
        note: item.note,
      }];
    }).sort((a, b) => {
      const score = { overdue: 0, "due-soon": 1, upcoming: 2 };
      return score[a.status] - score[b.status] || (a.kmRemaining ?? 999999) - (b.kmRemaining ?? 999999);
    });
  }

  const guide = brandMaintenanceGuides.find((item) => item.makeSlug === slugifyGaragePart(bike.make));
  if (guide?.pmsMileageMilestones?.length) {
    const milestones = guide.pmsMileageMilestones;
    const current = bike.odometerKm;
    let nextDueKm = milestones.find((value) => value >= current);
    if (nextDueKm === undefined && guide.pmsRecurringKm) {
      const lastMilestone = milestones[milestones.length - 1];
      nextDueKm = lastMilestone + Math.ceil((current - lastMilestone) / guide.pmsRecurringKm) * guide.pmsRecurringKm;
    }
    if (nextDueKm !== undefined) {
      const kmRemaining = nextDueKm - current;
      return [{
        item: `${bike.make} periodic maintenance`,
        action: "Check",
        sourceLevel: "Brand guidance",
        sourceLabel: guide.sourceLabel,
        sourceUrl: guide.sourceUrl,
        nextDueKm,
        kmRemaining,
        status: mileageStatus(kmRemaining),
        note: guide.applicability,
      }];
    }
  }
  return [];
}

export function estimatedGarageResaleValue(bike: GarageMotorcycle, catalog?: GarageCatalogMotorcycle) {
  if (!catalog) return undefined;
  const now = new Date();
  let ageYears = 0;
  if (bike.purchaseDate) {
    const bought = new Date(`${bike.purchaseDate}T00:00:00`);
    if (!Number.isNaN(bought.valueOf())) ageYears = Math.max(0, (now.valueOf() - bought.valueOf()) / 31557600000);
  } else if (bike.year) {
    ageYears = Math.max(0, now.getFullYear() - bike.year);
  }
  return Math.round(catalog.srp * depreciationFactor(ageYears) / 100) * 100;
}

export function actualFuelEconomy(records: GarageRecord[]) {
  const fills = records
    .filter((record) => record.category === "FUEL" && record.odometerKm !== undefined && record.liters !== undefined && record.liters > 0)
    .sort((a, b) => (a.odometerKm || 0) - (b.odometerKm || 0));
  if (fills.length < 2) return undefined;
  const first = fills[0];
  const last = fills[fills.length - 1];
  const distance = (last.odometerKm || 0) - (first.odometerKm || 0);
  const consumed = fills.slice(1).reduce((sum, record) => sum + (record.liters || 0), 0);
  if (distance <= 0 || consumed <= 0) return undefined;
  return distance / consumed;
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

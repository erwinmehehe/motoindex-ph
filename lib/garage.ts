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
  catalogModelId?: string;
  make: string;
  model: string;
  variant?: string;
  year?: number;
  plate?: string;
  purchaseDate?: string;
  purchasePricePhp?: number;
  purchaseOdometerKm?: number;
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
  fullTank?: boolean;
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

export type GarageCatalogMaintenanceItem = {
  item: string;
  interval: string;
  action: "Inspect" | "Replace" | "Check";
  note?: string;
};

export type GarageCatalogModel = {
  id: string;
  make: string;
  model: string;
  slug: string;
  makeSlug: string;
  marketStatus?: string;
  srp: number;
  engineCc?: number;
  powerHp?: number;
  torqueNm?: number;
  curbWeightKg?: number;
  seatHeightMm?: number;
  fuelTankL?: number;
  fuelConsumptionKmL?: number;
  groundClearanceMm?: number;
  frontTire: string;
  rearTire: string;
  sourceLabel: string;
  sourceUrl: string;
  exactMaintenance: boolean;
  maintenanceSourceLabel?: string;
  maintenanceSourceUrl?: string;
  maintenanceCheckedAt?: string;
  maintenanceItems: GarageCatalogMaintenanceItem[];
  tirePressure?: { soloFrontPsi: number; soloRearPsi: number; passengerFrontPsi: number; passengerRearPsi: number };
};

export type SmartMaintenanceDue = {
  item: string;
  action: GarageCatalogMaintenanceItem["action"];
  interval: string;
  nextDueKm?: number;
  remainingKm?: number;
  note?: string;
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

export function guessedCatalogModelId(bike: Pick<GarageMotorcycle, "catalogModelId" | "make" | "model">) {
  return bike.catalogModelId || `${slugifyGaragePart(bike.make)}-${slugifyGaragePart(bike.model)}`;
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


function numbersInInterval(interval: string) {
  return [...interval.matchAll(/(\d[\d,]*)\s*km/gi)].map((match) => Number(match[1].replaceAll(",", ""))).filter(Number.isFinite);
}

export function smartMaintenanceDue(items: GarageCatalogMaintenanceItem[], odometerKm: number): SmartMaintenanceDue[] {
  return items.map((item) => {
    const values = numbersInInterval(item.interval);
    let nextDueKm: number | undefined;

    const everyMatch = item.interval.match(/every\s+(\d[\d,]*)\s*km/i);
    if (everyMatch) {
      const cadence = Number(everyMatch[1].replaceAll(",", ""));
      const firstMatch = item.interval.match(/first\s+at\s+(\d[\d,]*)\s*km/i);
      const first = firstMatch ? Number(firstMatch[1].replaceAll(",", "")) : cadence;
      if (odometerKm < first) nextDueKm = first;
      else nextDueKm = first + Math.max(1, Math.ceil((odometerKm - first + 1) / cadence)) * cadence;
    } else if (/replacement point shown at/i.test(item.interval) && values.length) {
      nextDueKm = values[values.length - 1];
    } else if (values.length === 1 && /\bat\b/i.test(item.interval)) {
      nextDueKm = values[0];
    }

    return {
      item: item.item,
      action: item.action,
      interval: item.interval,
      nextDueKm,
      remainingKm: nextDueKm !== undefined ? nextDueKm - odometerKm : undefined,
      note: item.note,
    };
  });
}

export function estimatedGarageResale(srp: number, year?: number, purchaseDate?: string) {
  const now = new Date();
  let age = 0;
  if (year) age = Math.max(0, now.getFullYear() - year);
  else if (purchaseDate) {
    const purchased = new Date(`${purchaseDate}T00:00:00`);
    if (!Number.isNaN(purchased.valueOf())) age = Math.max(0, Math.floor((now.valueOf() - purchased.valueOf()) / 31557600000));
  }
  age = Math.min(10, age);
  let factor = 1;
  for (let current = 1; current <= age; current += 1) {
    factor *= 1 - (current === 1 ? .15 : current === 2 ? .10 : current <= 5 ? .08 : .06);
  }
  return Math.round((srp * factor) / 100) * 100;
}


export type GarageOwnershipAnalytics = {
  totalSpendPhp: number;
  currentMonthSpendPhp: number;
  averageMonthlySpendPhp: number;
  trackedDistanceKm?: number;
  distanceBasis: "purchase" | "first-log" | "none";
  costPerKmPhp?: number;
  fuelSpendPhp: number;
  fuelLiters: number;
  fuelEconomyKmL?: number;
  fuelEconomyDistanceKm?: number;
  fuelEconomyLiters?: number;
  categorySpend: { category: GarageRecordCategory; amountPhp: number; share: number }[];
  depreciationPhp?: number;
  depreciationPct?: number;
  netOwnershipCostPhp?: number;
};

function validDate(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

function ownershipMonths(bike: GarageMotorcycle, records: GarageRecord[], now: Date) {
  const purchase = validDate(bike.purchaseDate);
  const recordDates = records.map((record) => validDate(record.date)).filter((date): date is Date => Boolean(date));
  const start = purchase || recordDates.sort((a,b) => a.valueOf() - b.valueOf())[0];
  if (!start) return 1;
  const days = Math.max(1, (now.valueOf() - start.valueOf()) / 86400000);
  return Math.max(1, days / 30.4375);
}

export function garageOwnershipAnalytics(
  bike: GarageMotorcycle,
  records: GarageRecord[],
  effectiveResaleValuePhp?: number,
  now = new Date(),
): GarageOwnershipAnalytics {
  const totalSpendPhp = records.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthSpendPhp = records
    .filter((record) => record.date.startsWith(currentMonthKey))
    .reduce((sum, record) => sum + (record.amountPhp || 0), 0);

  const categories = new Map<GarageRecordCategory, number>();
  for (const record of records) {
    categories.set(record.category, (categories.get(record.category) || 0) + (record.amountPhp || 0));
  }
  const categorySpend = [...categories.entries()]
    .filter(([, amountPhp]) => amountPhp > 0)
    .map(([category, amountPhp]) => ({ category, amountPhp, share: totalSpendPhp > 0 ? amountPhp / totalSpendPhp : 0 }))
    .sort((a,b) => b.amountPhp - a.amountPhp);

  let trackedDistanceKm: number | undefined;
  let distanceBasis: GarageOwnershipAnalytics["distanceBasis"] = "none";
  if (
    bike.purchaseOdometerKm !== undefined &&
    bike.odometerKm >= bike.purchaseOdometerKm
  ) {
    trackedDistanceKm = bike.odometerKm - bike.purchaseOdometerKm;
    distanceBasis = "purchase";
  } else {
    const loggedOdometers = records
      .map((record) => record.odometerKm)
      .filter((value): value is number => value !== undefined && Number.isFinite(value) && value <= bike.odometerKm);
    if (loggedOdometers.length) {
      trackedDistanceKm = bike.odometerKm - Math.min(...loggedOdometers);
      distanceBasis = "first-log";
    }
  }

  const fuelRecords = records.filter((record) => record.category === "FUEL");
  const fuelSpendPhp = fuelRecords.reduce((sum, record) => sum + (record.amountPhp || 0), 0);
  const fuelLiters = fuelRecords.reduce((sum, record) => sum + (record.liters || 0), 0);
  const fullTankRecords = fuelRecords
    .filter((record) => record.fullTank && record.odometerKm !== undefined && (record.liters || 0) > 0)
    .sort((a,b) => (a.odometerKm || 0) - (b.odometerKm || 0) || a.date.localeCompare(b.date));

  let fuelEconomyDistanceKm = 0;
  let fuelEconomyLiters = 0;
  for (let index = 1; index < fullTankRecords.length; index += 1) {
    const previous = fullTankRecords[index - 1];
    const current = fullTankRecords[index];
    const distance = (current.odometerKm || 0) - (previous.odometerKm || 0);
    if (distance > 0 && (current.liters || 0) > 0) {
      fuelEconomyDistanceKm += distance;
      fuelEconomyLiters += current.liters || 0;
    }
  }

  const depreciationPhp = bike.purchasePricePhp !== undefined && effectiveResaleValuePhp !== undefined
    ? Math.max(0, bike.purchasePricePhp - effectiveResaleValuePhp)
    : undefined;
  const depreciationPct = depreciationPhp !== undefined && bike.purchasePricePhp
    ? depreciationPhp / bike.purchasePricePhp
    : undefined;
  const netOwnershipCostPhp = bike.purchasePricePhp !== undefined && effectiveResaleValuePhp !== undefined
    ? Math.max(0, bike.purchasePricePhp + totalSpendPhp - effectiveResaleValuePhp)
    : undefined;

  return {
    totalSpendPhp,
    currentMonthSpendPhp,
    averageMonthlySpendPhp: totalSpendPhp / ownershipMonths(bike, records, now),
    trackedDistanceKm,
    distanceBasis,
    costPerKmPhp: trackedDistanceKm && trackedDistanceKm > 0 ? totalSpendPhp / trackedDistanceKm : undefined,
    fuelSpendPhp,
    fuelLiters,
    fuelEconomyKmL: fuelEconomyDistanceKm > 0 && fuelEconomyLiters > 0 ? fuelEconomyDistanceKm / fuelEconomyLiters : undefined,
    fuelEconomyDistanceKm: fuelEconomyDistanceKm || undefined,
    fuelEconomyLiters: fuelEconomyLiters || undefined,
    categorySpend,
    depreciationPhp,
    depreciationPct,
    netOwnershipCostPhp,
  };
}

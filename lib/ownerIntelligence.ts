import type { GarageMotorcycle, GarageRecord } from "@/lib/garage";
import { garageOwnershipAnalytics } from "@/lib/garage";

export const OWNER_INTELLIGENCE_MIN_SAMPLE = 5;

const MAINTENANCE_CATEGORIES = new Set<string>(["PMS","TIRE","BATTERY","OIL","CVT","REPAIR","PART"]);

type EventCounts = Record<string, number>;

export type OwnerIntelligenceSnapshot = {
  monthlyRunningCostPhp: number | null;
  annualMaintenancePhp: number | null;
  fuelEconomyKmpl: number | null;
  tireLifeKm: number | null;
  maintenanceEventsPer10kKm: number | null;
  repairsPer10kKm: number | null;
  trackedDistanceKm: number | null;
  recordCount: number;
  eventCounts: EventCounts;
};

function validDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function monthsObserved(bike: GarageMotorcycle, records: GarageRecord[], now = new Date()) {
  const purchase = validDate(bike.purchaseDate);
  const dates = records.map(record => validDate(record.date)).filter((date): date is Date => Boolean(date));
  const start = purchase || dates.sort((a,b)=>a.valueOf()-b.valueOf())[0];
  if (!start) return null;
  const months = Math.max(1, (now.valueOf() - start.valueOf()) / (30.4375 * 86400000));
  return months;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum,value)=>sum+value,0) / values.length : null;
}

export function deriveOwnerIntelligenceSnapshot(
  bike: GarageMotorcycle,
  records: GarageRecord[],
  now = new Date(),
): OwnerIntelligenceSnapshot {
  const bikeRecords = records.filter(record => record.motorcycleId === bike.id);
  const analytics = garageOwnershipAnalytics(bike, bikeRecords, undefined, now);
  const observedMonths = monthsObserved(bike, bikeRecords, now);
  const runningRecords = bikeRecords.filter(record => record.category !== "RESALE");
  const runningSpend = runningRecords.reduce((sum,record)=>sum+(record.amountPhp||0),0);
  const runningCostRecords = runningRecords.filter(record => (record.amountPhp || 0) > 0);
  const maintenanceRecords = bikeRecords.filter(record => MAINTENANCE_CATEGORIES.has(record.category));
  const maintenanceSpend = maintenanceRecords.reduce((sum,record)=>sum+(record.amountPhp||0),0);
  const maintenanceCostRecords = maintenanceRecords.filter(record => (record.amountPhp || 0) > 0);

  const tireRecords = bikeRecords
    .filter(record => record.category === "TIRE" && record.odometerKm !== undefined && /replace|replacement|changed?|installed|new tire/i.test(record.title))
    .sort((a,b)=>(a.odometerKm||0)-(b.odometerKm||0));
  const tireIntervals:number[]=[];
  for(let i=1;i<tireRecords.length;i+=1){
    const distance=(tireRecords[i].odometerKm||0)-(tireRecords[i-1].odometerKm||0);
    if(distance>0)tireIntervals.push(distance);
  }

  const eventCounts:EventCounts={};
  for(const record of maintenanceRecords){
    eventCounts[record.category]=(eventCounts[record.category]||0)+1;
  }

  const trackedDistance = analytics.trackedDistanceKm && analytics.trackedDistanceKm > 0
    ? analytics.trackedDistanceKm
    : null;
  const per10k = (count:number) => trackedDistance && trackedDistance >= 1000
    ? count / trackedDistance * 10000
    : null;

  const enoughRunningCostHistory = Boolean(observedMonths && observedMonths >= 3 && runningCostRecords.length >= 3);
  const enoughMaintenanceHistory = Boolean(observedMonths && observedMonths >= 6 && maintenanceCostRecords.length >= 2);
  const enoughEventHistory = Boolean(trackedDistance && trackedDistance >= 2000 && bikeRecords.length >= 5);
  const enoughRepairHistory = Boolean(trackedDistance && trackedDistance >= 5000 && bikeRecords.length >= 8);

  return {
    monthlyRunningCostPhp: enoughRunningCostHistory && observedMonths ? runningSpend / observedMonths : null,
    annualMaintenancePhp: enoughMaintenanceHistory && observedMonths ? maintenanceSpend / observedMonths * 12 : null,
    fuelEconomyKmpl: analytics.fuelEconomyKmL ?? null,
    tireLifeKm: tireIntervals.length ? Math.round(average(tireIntervals) || 0) : null,
    maintenanceEventsPer10kKm: enoughEventHistory ? per10k(maintenanceRecords.length) : null,
    repairsPer10kKm: enoughRepairHistory ? per10k(bikeRecords.filter(record => record.category === "REPAIR").length) : null,
    trackedDistanceKm: trackedDistance ? Math.round(trackedDistance) : null,
    recordCount: bikeRecords.length,
    eventCounts,
  };
}

type Contribution = {
  intelligenceConsentedAt: Date | null;
  intelligenceMonthlyRunningCostPhp: unknown;
  intelligenceAnnualMaintenancePhp: unknown;
  intelligenceFuelEconomyKmpl: number | null;
  intelligenceTireLifeKm: number | null;
  intelligenceMaintenanceEventsPer10kKm: number | null;
  intelligenceRepairsPer10kKm: number | null;
  intelligenceTrackedDistanceKm: number | null;
  intelligenceEventCounts: unknown;
};

function numeric(value: unknown) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function metric(values: Array<number | null>) {
  const usable = values.filter((value): value is number => value !== null);
  return {
    sample: usable.length,
    value: usable.length >= OWNER_INTELLIGENCE_MIN_SAMPLE ? Math.round((average(usable) || 0) * 10) / 10 : null,
  };
}

function cleanCounts(value: unknown): EventCounts {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output:EventCounts={};
  for(const [key,raw] of Object.entries(value as Record<string,unknown>)){
    const n=Number(raw);
    if(Number.isFinite(n)&&n>0)output[key]=Math.round(n);
  }
  return output;
}

export function summarizeOwnerIntelligence(rows: Contribution[]) {
  const consented = rows.filter(row => Boolean(row.intelligenceConsentedAt));
  const monthly = metric(consented.map(row => numeric(row.intelligenceMonthlyRunningCostPhp)));
  const maintenance = metric(consented.map(row => numeric(row.intelligenceAnnualMaintenancePhp)));
  const fuel = metric(consented.map(row => row.intelligenceFuelEconomyKmpl));
  const tire = metric(consented.map(row => row.intelligenceTireLifeKm));
  const maintenanceFrequency = metric(consented.map(row => row.intelligenceMaintenanceEventsPer10kKm));
  const repairs = metric(consented.map(row => row.intelligenceRepairsPer10kKm));

  const categoryOwners = new Map<string,number>();
  const categoryEvents = new Map<string,number>();
  for(const row of consented){
    const counts=cleanCounts(row.intelligenceEventCounts);
    for(const [category,count] of Object.entries(counts)){
      categoryOwners.set(category,(categoryOwners.get(category)||0)+1);
      categoryEvents.set(category,(categoryEvents.get(category)||0)+count);
    }
  }
  const commonMaintenance = [...categoryEvents.entries()]
    .filter(([category]) => (categoryOwners.get(category)||0) >= OWNER_INTELLIGENCE_MIN_SAMPLE)
    .map(([category,eventCount])=>({category,eventCount,ownerSample:categoryOwners.get(category)||0}))
    .sort((a,b)=>b.eventCount-a.eventCount)
    .slice(0,5);

  return {
    contributorCount: consented.length,
    ready: consented.length >= OWNER_INTELLIGENCE_MIN_SAMPLE,
    monthlyRunningCostPhp: monthly.value,
    monthlyRunningCostSample: monthly.sample,
    annualMaintenancePhp: maintenance.value,
    annualMaintenanceSample: maintenance.sample,
    fuelEconomyKmpl: fuel.value,
    fuelEconomySample: fuel.sample,
    tireLifeKm: tire.value,
    tireLifeSample: tire.sample,
    maintenanceEventsPer10kKm: maintenanceFrequency.value,
    maintenanceEventsSample: maintenanceFrequency.sample,
    repairsPer10kKm: repairs.value,
    repairsSample: repairs.sample,
    commonMaintenance,
  };
}

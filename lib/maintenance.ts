import type { Motorcycle } from "./types";

export type MaintenanceItem = {
  item: string;
  interval: string;
  action: "Inspect" | "Replace" | "Check";
  note?: string;
  firstDueKm?: number;
  intervalKm?: number;
  firstDueMonths?: number;
  intervalMonths?: number;
};

export type MaintenanceSchedule = {
  modelId: string;
  sourceLabel: string;
  sourceUrl: string;
  lastChecked: string;
  exact: boolean;
  items: MaintenanceItem[];
  tirePressure?: { soloFrontPsi: number; soloRearPsi: number; passengerFrontPsi: number; passengerRearPsi: number };
};

export type BrandServiceResource = {
  makeSlug: string;
  label: string;
  description: string;
  url: string;
  lastChecked: string;
};

export type BrandMaintenanceGuide = {
  makeSlug: string;
  sourceLabel: string;
  sourceUrl: string;
  lastChecked: string;
  applicability: string;
  pmsMilestones: string;
  items: MaintenanceItem[];
};

export const brandServiceResources: BrandServiceResource[] = [
  {
    makeSlug: "honda",
    label: "Honda Philippines Maintenance Planner",
    description: "Official Philippine maintenance planner for recommended inspection and replacement items by motorcycle and kilometer reading.",
    url: "https://www.hondaph.com/service-calculator",
    lastChecked: "2026-09-23",
  },
  {
    makeSlug: "yamaha",
    label: "Yamaha Philippines After Sales",
    description: "Official Yamaha Philippines after-sales hub with owner-manual, maintenance, service and genuine-parts resources.",
    url: "https://aftersales.yamaha-motor.com.ph/",
    lastChecked: "2026-09-22",
  },
  {
    makeSlug: "suzuki",
    label: "Suzuki Philippines After Sales",
    description: "Official Suzuki Philippines after-sales hub for preventive maintenance, repairs, service campaigns and genuine oils/parts.",
    url: "https://mc.suzuki.com.ph/after-sales/",
    lastChecked: "2026-08-25",
  },
  {
    makeSlug: "kawasaki",
    label: "Kawasaki Philippines Service Network",
    description: "Official Kawasaki Philippines service-network directory for service support and model-specific maintenance questions.",
    url: "https://www.kawasakileisurebikes.ph/services/service-network/",
    lastChecked: "2026-08-25",
  },
];

export const brandMaintenanceGuides: BrandMaintenanceGuide[] = [
  {
    makeSlug: "honda",
    sourceLabel: "Honda Philippines commuter motorcycle free-service PMS guidance",
    sourceUrl: "https://www.hondaph.com/motorcycle/faq",
    lastChecked: "2026-09-23",
    applicability: "Brand-level Honda Philippines commuter-bike service guidance. These are free-service coupon windows, not a complete model-specific maintenance table. Use the exact owner manual or Honda Maintenance Planner for the motorcycle, model year and riding conditions.",
    pmsMilestones: "Coupon 1: 500–2,000 km or 3 months · Coupon 2: 2,001–6,000 km or 7 months · Coupon 3: 6,001–12,000 km or 12 months, measured from purchase date and subject to Honda's whichever-comes-first guidance.",
    items: [
      { item: "Free service coupon 1", interval: "500–2,000 km or 3 months from purchase", action: "Check", note: "Honda describes this as a standard preventive-maintenance service window; parts and engine oil remain chargeable." },
      { item: "Free service coupon 2", interval: "2,001–6,000 km or 7 months from purchase", action: "Check", note: "This is a coupon eligibility window, not permission to ignore an earlier model-specific service requirement." },
      { item: "Free service coupon 3", interval: "6,001–12,000 km or 12 months from purchase", action: "Check", note: "Use the exact owner manual and Honda Maintenance Planner for the work items required at the actual mileage." },
    ],
  },
  {
    makeSlug: "yamaha",
    sourceLabel: "Yamaha Motor Philippines Periodic Maintenance Schedule (PMS) Guide",
    sourceUrl: "https://aftersales.yamaha-motor.com.ph/",
    lastChecked: "2026-09-22",
    applicability: "Brand-level Yamaha Philippines PMS guidance. Use the exact owner manual or authorized Yamaha service advice when it differs for a specific model, generation or riding condition.",
    pmsMilestones: "1,000 km · 4,000 km · 7,000 km · 10,000 km · 13,000 km; the Yamaha guide then continues on a 3,000 km PMS cadence.",
    items: [
      { item: "Engine oil", interval: "After the 13,000 km PMS point, Yamaha lists every 3,000 km", action: "Replace", note: "Use the oil grade and quantity specified for the exact motorcycle." },
      { item: "Gear oil", interval: "Every 12,000 km", action: "Replace", note: "Applies where the Yamaha motorcycle has a separate gear/final-drive oil service item." },
      { item: "Engine oil filter", interval: "Every 6,000 km", action: "Replace", note: "Confirm whether the exact model uses the listed service part and procedure." },
      { item: "Liquid coolant", interval: "Every 12,000 km", action: "Replace", note: "Applies to liquid-cooled models; use the exact coolant specification." },
      { item: "Air filter", interval: "Every 12,000 km", action: "Replace" },
      { item: "Spark plug", interval: "Every 6,000 km", action: "Replace" },
      { item: "V-belt / chain", interval: "Yamaha PMS guide lists 25,000 km", action: "Check", note: "The exact model manual controls inspection/replacement requirements and whether the drivetrain uses a belt or chain." },
      { item: "Fuel injector", interval: "Every 12,000 km", action: "Check" },
      { item: "Brake fluid", interval: "Yamaha PMS guide lists 1 year or 12,000 km", action: "Replace", note: "Confirm the exact model/year service requirement with Yamaha." },
    ],
  },
];

export function brandMaintenanceGuideForModel(model: Motorcycle) {
  return brandMaintenanceGuides.find((guide) => guide.makeSlug === model.makeSlug);
}

// Exact intervals are published only when the owner-manual evidence has been parsed.
// Click160 and PCX160 use Philippines owner manuals (PH market) hosted by Honda MotoPub.
export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    modelId: "honda-click-160",
    sourceLabel: "Honda Click160 Philippines Owner's Manual · maintenance schedule",
    sourceUrl: "https://2rom-prd-data.hondamotopub.com/om/HPI/Click160/2022/Click160_32K2SF000_0.pdf",
    lastChecked: "2026-08-25",
    exact: true,
    items: [
      { item: "Engine oil", interval: "First at 1,000 km; then every 6,000 km", action: "Replace", firstDueKm: 1000, intervalKm: 6000, note: "The manual's OIL CHANGE indicator calls for the first change at about 1,000 km and every 6,000 km after the first reset." },
      { item: "Drive belt", interval: "Inspect periodically; replacement point shown at 24,000 km", action: "Inspect", firstDueKm: 24000 },
      { item: "Radiator coolant", interval: "Every 3 years", action: "Replace", intervalMonths: 36 },
      { item: "Final drive oil", interval: "Every 2 years", action: "Replace", intervalMonths: 24 },
      { item: "Brake fluid", interval: "Every 2 years", action: "Replace", intervalMonths: 24 },
    ],
    tirePressure: { soloFrontPsi: 29, soloRearPsi: 33, passengerFrontPsi: 29, passengerRearPsi: 33 },
  },
  {
    modelId: "honda-pcx-160",
    sourceLabel: "Honda PCX160 Philippines Owner's Manual · maintenance schedule",
    sourceUrl: "https://2rom-prd-data.hondamotopub.com/om/HPI/PCX160/2021/PCX160_32K1ZE000_0.pdf",
    lastChecked: "2026-08-25",
    exact: true,
    items: [
      { item: "Engine oil", interval: "First at 1,000 km; then every 6,000 km", action: "Replace", firstDueKm: 1000, intervalKm: 6000, note: "The manual's oil-change indicator first appears at 1,000 km and then every 6,000 km after reset." },
      { item: "Drive belt", interval: "Inspect at the manual's periodic schedule; replacement point shown at 24,000 km", action: "Inspect", firstDueKm: 24000 },
      { item: "Radiator coolant", interval: "Every 3 years", action: "Replace", intervalMonths: 36 },
      { item: "Final drive oil", interval: "Every 2 years", action: "Replace", intervalMonths: 24 },
      { item: "Brake fluid", interval: "Every 2 years", action: "Replace", intervalMonths: 24 },
    ],
    tirePressure: { soloFrontPsi: 29, soloRearPsi: 33, passengerFrontPsi: 29, passengerRearPsi: 36 },
  },
];

export function maintenanceForModel(modelId: string) {
  return maintenanceSchedules.find((schedule) => schedule.modelId === modelId);
}

export function serviceResourceForModel(model: Motorcycle) {
  return brandServiceResources.find((resource) => resource.makeSlug === model.makeSlug);
}

import type { Motorcycle } from "./types";

export type MaintenanceItem = {
  item: string;
  interval: string;
  action: "Inspect" | "Replace" | "Check";
  note?: string;
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

export const brandServiceResources: BrandServiceResource[] = [
  {
    makeSlug: "honda",
    label: "Honda Philippines Maintenance Planner",
    description: "Official Philippine maintenance planner for recommended inspection and replacement items by motorcycle and kilometer reading.",
    url: "https://www.hondaph.com/service-calculator",
    lastChecked: "2026-08-25",
  },
  {
    makeSlug: "yamaha",
    label: "Yamaha Philippines After Sales",
    description: "Official Yamaha Philippines after-sales hub with owner-manual, maintenance, service and genuine-parts resources.",
    url: "https://aftersales.yamaha-motor.com.ph/",
    lastChecked: "2026-08-25",
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
      { item: "Engine oil", interval: "First at 1,000 km; then every 6,000 km", action: "Replace", note: "The manual's OIL CHANGE indicator calls for the first change at about 1,000 km and every 6,000 km after the first reset." },
      { item: "Drive belt", interval: "Inspect periodically; replacement point shown at 24,000 km", action: "Inspect" },
      { item: "Radiator coolant", interval: "Every 3 years", action: "Replace" },
      { item: "Final drive oil", interval: "Every 2 years", action: "Replace" },
      { item: "Brake fluid", interval: "Every 2 years", action: "Replace" },
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
      { item: "Engine oil", interval: "First at 1,000 km; then every 6,000 km", action: "Replace", note: "The manual's oil-change indicator first appears at 1,000 km and then every 6,000 km after reset." },
      { item: "Drive belt", interval: "Inspect at the manual's periodic schedule; replacement point shown at 24,000 km", action: "Inspect" },
      { item: "Radiator coolant", interval: "Every 3 years", action: "Replace" },
      { item: "Final drive oil", interval: "Every 2 years", action: "Replace" },
      { item: "Brake fluid", interval: "Every 2 years", action: "Replace" },
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

import type { Motorcycle } from "./types";

export type SafetyResource = {
  makeSlug: string;
  label: string;
  url: string;
  method: string;
  lastChecked: string;
  hasVehicleChecker: boolean;
};

export type SafetyNotice = {
  modelId: string;
  title: string;
  publishedAt: string;
  sourceLabel: string;
  sourceUrl: string;
  summary: string;
};

export const safetyResources: SafetyResource[] = [
  {
    makeSlug: "honda",
    label: "Honda Philippines Product Update Checker",
    url: "https://www.hondaph.com/product-update",
    method: "Check an engine number or frame number on Honda Philippines' official Product Update page.",
    lastChecked: "2026-08-25",
    hasVehicleChecker: true,
  },
  {
    makeSlug: "suzuki",
    label: "Suzuki Philippines Service Campaign Checker",
    url: "https://mc.suzuki.com.ph/service-campaign/",
    method: "Enter the motorcycle chassis/frame number in Suzuki Philippines' official service-campaign form.",
    lastChecked: "2026-08-25",
    hasVehicleChecker: true,
  },
  {
    makeSlug: "yamaha",
    label: "Yamaha Philippines After Sales / Service Campaign",
    url: "https://aftersales.yamaha-motor.com.ph/",
    method: "Use Yamaha Philippines' official after-sales and service-campaign resources or an authorized Yamaha service center for VIN-specific confirmation.",
    lastChecked: "2026-08-25",
    hasVehicleChecker: false,
  },
  {
    makeSlug: "kawasaki",
    label: "Kawasaki Philippines Customer / Service Network",
    url: "https://kawasakileisurebikes.ph/contact-us/",
    method: "Contact Kawasaki Motors Philippines or an official service center with the frame/VIN for campaign confirmation.",
    lastChecked: "2026-08-25",
    hasVehicleChecker: false,
  },
];

// Empty by design until a model-specific official notice is tied to a motorcycle in the current catalog.
export const safetyNotices: SafetyNotice[] = [];

export function safetyResourceForModel(model: Motorcycle) {
  return safetyResources.find((resource) => resource.makeSlug === model.makeSlug);
}

export function safetyNoticesForModel(modelId: string) {
  return safetyNotices.filter((notice) => notice.modelId === modelId);
}

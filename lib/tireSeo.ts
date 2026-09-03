import { getModelById } from "./data";
import type { Motorcycle } from "./types";

export type TireFamilyHub = {
  slug: string;
  title: string;
  shortName: string;
  description: string;
  modelIds: string[];
  queryVolume: number;
  aliases: string[];
};

export const tireFamilyHubs: TireFamilyHub[] = [
  {
    slug: "aerox-tire-size",
    title: "Yamaha Aerox Tire Size — V2 & V3 Front and Rear",
    shortName: "Yamaha Aerox",
    description: "Compare stock Yamaha Aerox V2 and V3 front and rear tire sizes, then open the exact generation for pressure and replacement-tire checks.",
    modelIds: ["yamaha-aerox-v3", "yamaha-aerox-v2"],
    queryVolume: 4830,
    aliases: ["aerox tire size", "aerox stock tire size", "aerox front tire size", "aerox rear tire size"]
  },
  {
    slug: "nmax-tire-size",
    title: "Yamaha NMAX Tire Size — V2 & V3 Front and Rear",
    shortName: "Yamaha NMAX",
    description: "Compare stock Yamaha NMAX V2 and V3 tire sizes and open the exact generation for pressure, maintenance and replacement-tire checks.",
    modelIds: ["yamaha-nmax-v3", "yamaha-nmax-v2"],
    queryVolume: 2750,
    aliases: ["nmax tire size", "nmax stock tire size", "nmax front tire size", "nmax rear tire size"]
  },
  {
    slug: "honda-click-tire-size",
    title: "Honda Click Tire Size — 125i, 150i & 160 Front and Rear",
    shortName: "Honda Click",
    description: "Compare stock Honda Click 125i, Click 150i and Click 160 tire sizes without mixing generations or assuming larger tires automatically fit.",
    modelIds: ["honda-click-160", "honda-click-150i", "honda-click-125i"],
    queryVolume: 2650,
    aliases: ["honda click tire size", "honda click front tire size", "honda click rear tire size", "honda click tire size chart"]
  }
];

export const priorityTireModelSeo: Record<string, { title: string; description: string; keywordLabel: string }> = {
  "honda-adv-160": {
    title: "Honda ADV 160 Tire Size Philippines — Front & Rear",
    description: "Honda ADV 160 stock front and rear tire sizes, tire-pressure reference where available, replacement-size matches and fitment warnings.",
    keywordLabel: "Honda ADV 160 tire size"
  },
  "yamaha-aerox-v3": {
    title: "Yamaha Aerox V3 Tire Size — Stock Front & Rear",
    description: "Yamaha Aerox V3 stock tire sizes for the front and rear, with pressure references, matching tire families and fitment checks.",
    keywordLabel: "Aerox V3 tire size"
  },
  "yamaha-aerox-v2": {
    title: "Yamaha Aerox V2 Tire Size — Stock Front & Rear",
    description: "Yamaha Aerox V2 stock front and rear tire sizes, with replacement-size matches and warnings about load, speed rating and clearance.",
    keywordLabel: "Aerox V2 tire size"
  },
  "yamaha-nmax-v3": {
    title: "Yamaha NMAX V3 Tire Size — Stock Front & Rear",
    description: "Yamaha NMAX V3 stock tire sizes for the front and rear, with pressure references, replacement-size matches and fitment checks.",
    keywordLabel: "NMAX V3 tire size"
  },
  "yamaha-nmax-v2": {
    title: "Yamaha NMAX V2 Tire Size — Stock Front & Rear",
    description: "Yamaha NMAX V2 stock front and rear tire sizes, with replacement-size matches and fitment notes for the exact generation.",
    keywordLabel: "NMAX V2 tire size"
  },
  "honda-click-125i": {
    title: "Honda Click 125i Tire Size — Stock Front & Rear",
    description: "Honda Click 125i stock front and rear tire sizes, replacement-size matches and fitment checks for the current 125cc commuter scooter.",
    keywordLabel: "Honda Click 125i tire size"
  },
  "honda-click-160": {
    title: "Honda Click 160 Tire Size — Stock Front & Rear",
    description: "Honda Click 160 stock front and rear tire sizes, replacement-size matches, pressure references and fitment warnings.",
    keywordLabel: "Honda Click 160 tire size"
  }
};

export function getTireFamilyHub(slug: string) {
  return tireFamilyHubs.find((hub) => hub.slug === slug);
}

export function getTireFamilyModels(hub: TireFamilyHub): Motorcycle[] {
  return hub.modelIds.map(getModelById).filter((m): m is Motorcycle => Boolean(m));
}

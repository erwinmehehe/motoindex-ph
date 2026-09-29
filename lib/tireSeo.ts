import { getModelById, publicMotorcycles } from "./data";
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
    title: "Yamaha NMAX Tire Size Philippines: V2 & V3 Front and Rear",
    shortName: "Yamaha NMAX",
    description: "Compare stock Yamaha NMAX V2 and V3 tire sizes and open the exact generation for pressure, maintenance and replacement-tire checks.",
    modelIds: ["yamaha-nmax-v3", "yamaha-nmax-v2"],
    queryVolume: 2750,
    aliases: ["nmax tire size", "nmax stock tire size", "nmax front tire size", "nmax rear tire size"]
  },
  {
    slug: "honda-click-tire-size",
    title: "Honda Click Tire Size Philippines: 125i, 150i & 160",
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

export type TireModelSeoHub = {
  slug: string;
  modelId: string;
  title: string;
  description: string;
  keywordLabel: string;
  queryVolume: number;
  aliases: string[];
};

export const tireModelSeoHubs: TireModelSeoHub[] = [
  {
    slug: "adv-160-tire-size",
    modelId: "honda-adv-160",
    title: "Honda ADV 160 Tire Size Philippines: Front & Rear",
    description: "Honda ADV 160 stock front and rear tire sizes, exact tire-pressure reference, replacement tire families and fitment checks for Philippine riders.",
    keywordLabel: "Honda ADV 160 tire size",
    queryVolume: 2200,
    aliases: ["adv 160 tire size", "honda adv 160 tire size", "adv160 stock tire size", "adv 160 front tire size", "adv 160 rear tire size"]
  },
  {
    slug: "fazzio-tire-size",
    modelId: "yamaha-fazzio",
    title: "Yamaha Fazzio Tire Size Philippines: Front & Rear",
    description: "Yamaha Fazzio stock front and rear tire sizes, 12-inch wheel fitment notes, replacement tire families and size-reading guidance for Philippine riders.",
    keywordLabel: "Yamaha Fazzio tire size",
    queryVolume: 700,
    aliases: ["fazzio tire size", "yamaha fazzio tire size", "mio fazzio tire size", "fazzio stock tire size"]
  },
  {
    slug: "mio-gear-tire-size",
    modelId: "yamaha-mio-gear",
    title: "Yamaha Mio Gear Tire Size Philippines: Front & Rear",
    description: "Yamaha Mio Gear stock front and rear tire sizes, 14-inch wheel fitment notes, verified replacement families and tire-size guidance.",
    keywordLabel: "Yamaha Mio Gear tire size",
    queryVolume: 600,
    aliases: ["mio gear tire size", "yamaha mio gear tire size", "mio gear stock tire size", "mio gear front tire size", "mio gear rear tire size"]
  },
  {
    slug: "sniper-155-tire-size",
    modelId: "yamaha-sniper-155",
    title: "Yamaha Sniper 155 Tire Size Philippines: Front & Rear",
    description: "Yamaha Sniper 155 stock front and rear tire sizes, 17-inch wheel guidance, replacement-fitment checks and tire-size safety notes.",
    keywordLabel: "Yamaha Sniper 155 tire size",
    queryVolume: 500,
    aliases: ["sniper 155 tire size", "yamaha sniper 155 tire size", "sniper 155 stock tire size", "sniper 155 front tire size", "sniper 155 rear tire size"]
  }
];

export function getTireModelSeoHub(slug: string) {
  return tireModelSeoHubs.find((hub) => hub.slug === slug);
}

export function tireGuideHrefForModel(modelId: string) {
  const modelHub=tireModelSeoHubs.find((hub)=>hub.modelId===modelId);
  if(modelHub)return `/tires/${modelHub.slug}`;
  const familyHub=tireFamilyHubs.find((hub)=>hub.modelIds.includes(modelId));
  return familyHub?`/tires/${familyHub.slug}`:undefined;
}

export function getTireFamilyHub(slug: string) {
  return tireFamilyHubs.find((hub) => hub.slug === slug);
}

export function getTireFamilyModels(hub: TireFamilyHub): Motorcycle[] {
  return hub.modelIds.map(getModelById).filter((m): m is Motorcycle => Boolean(m));
}


export type TireSizeSeoHub = {
  slug: string;
  size: string;
  title: string;
  description: string;
};

export const tireSizeSeoHubs: TireSizeSeoHub[] = [
  { slug:"90-90-14", size:"90/90-14", title:"Motorcycles Using 90/90-14 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 90/90-14 as a stock front or rear tire size, then open the exact model for full fitment context." },
  { slug:"100-80-14", size:"100/80-14", title:"Motorcycles Using 100/80-14 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 100/80-14 as a stock front or rear tire size, with axle position and exact model links." },
  { slug:"110-80-14", size:"110/80-14", title:"Motorcycles Using 110/80-14 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 110/80-14 as a stock front or rear tire size, then verify the complete fitment on the model page." },
  { slug:"130-70-13", size:"130/70-13", title:"Motorcycles Using 130/70-13 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 130/70-13 as a stock front or rear tire size and compare the exact axle use by model." },
  { slug:"110-70-17", size:"110/70-17", title:"Motorcycles Using 110/70-17 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 110/70-17 as a stock front or rear tire size, with direct links to each model's tire section." },
  { slug:"150-60-17", size:"150/60-17", title:"Motorcycles Using 150/60-17 Tires in the Philippines", description:"See current Philippine-market motorcycles that list 150/60-17 as a stock front or rear tire size and verify the full fitment before buying." }
];

function normalizeTireSize(value: string) {
  return value.toUpperCase().replace(/\s+/g,"").replace(/R(?=\d)/g,"-").replace(/M\/C/g,"").replace(/--+/g,"-");
}

export function getTireSizeSeoHub(slug: string) {
  return tireSizeSeoHubs.find((hub) => hub.slug === slug);
}

export function getMotorcyclesUsingTireSize(size: string) {
  const target=normalizeTireSize(size);
  return publicMotorcycles
    .map(model => ({
      model,
      front: normalizeTireSize(model.frontTire) === target,
      rear: normalizeTireSize(model.rearTire) === target
    }))
    .filter(match => match.front || match.rear)
    .sort((a,b) => a.model.make.localeCompare(b.model.make) || a.model.model.localeCompare(b.model.model));
}

export function isIndexableTireSizeSeoHub(slug: string) {
  const hub=getTireSizeSeoHub(slug);
  return Boolean(hub && getMotorcyclesUsingTireSize(hub.size).length >= 3);
}


export function findTireSizeSeoHub(size: string) {
  const target=normalizeTireSize(size);
  return tireSizeSeoHubs.find((hub)=>normalizeTireSize(hub.size)===target);
}

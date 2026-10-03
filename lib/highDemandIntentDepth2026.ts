// Ranked from the supplied ZigWheels canonical-gap export after excluding the first three #366 targets.
export type HighDemandIntentKind =
  | "price"
  | "colors"
  | "variants"
  | "specs"
  | "top-speed"
  | "seat-height"
  | "fuel-tank"
  | "fuel-economy"
  | "tires"
  | "weight"
  | "brakes";

export type HighDemandIntentProfile = {
  modelId: string;
  mappedSearchVolume: number;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intents: HighDemandIntentKind[];
};

export const highDemandIntentProfiles2026: HighDemandIntentProfile[] = [
  { modelId: "honda-pcx-160", mappedSearchVolume: 136620, primaryKeyword: "pcx 160", secondaryKeywords: ["pcx 160 price", "pcx price philippines", "pcx 160 specs"], intents: ["price", "variants", "specs", "colors", "seat-height"] },
  { modelId: "honda-click-160", mappedSearchVolume: 125550, primaryKeyword: "honda click 160", secondaryKeywords: ["honda click 160 price philippines", "click 160 price philippines", "click 160 specs"], intents: ["price", "specs", "colors", "fuel-economy", "top-speed"] },
  { modelId: "honda-navi", mappedSearchVolume: 82710, primaryKeyword: "honda navi", secondaryKeywords: ["honda navi price", "honda navi specs", "navi honda price"], intents: ["price", "specs", "colors", "seat-height", "weight"] },
  { modelId: "yamaha-sniper-155", mappedSearchVolume: 82040, primaryKeyword: "sniper 155", secondaryKeywords: ["sniper 155 price philippines 2026", "sniper 150", "sniper 155 specs"], intents: ["price", "specs", "colors", "variants", "top-speed"] },
  { modelId: "honda-adv-350", mappedSearchVolume: 70450, primaryKeyword: "adv 350", secondaryKeywords: ["adv 350 price philippines", "honda adv 350", "adv 350 colors"], intents: ["price", "colors", "specs", "seat-height", "top-speed"] },
  { modelId: "yamaha-fazzio", mappedSearchVolume: 67930, primaryKeyword: "fazzio price", secondaryKeywords: ["yamaha fazzio price", "mio fazzio", "fazzio specs"], intents: ["price", "colors", "specs", "seat-height", "fuel-economy"] },
  { modelId: "suzuki-raider-r150", mappedSearchVolume: 65240, primaryKeyword: "raider 150 fi", secondaryKeywords: ["raider 150 fi price philippines", "raider 150 price philippines", "raider 150 specs"], intents: ["price", "specs", "colors", "top-speed", "brakes"] },
  { modelId: "honda-adv-160", mappedSearchVolume: 51690, primaryKeyword: "adv 160 price philippines", secondaryKeywords: ["honda adv 160 price philippines", "adv 160 specs", "adv 160 colors"], intents: ["price", "specs", "colors", "fuel-tank", "top-speed"] },
  { modelId: "honda-giorno-plus", mappedSearchVolume: 46410, primaryKeyword: "giorno honda", secondaryKeywords: ["honda giorno price", "honda giorno specs", "honda giorno colors"], intents: ["price", "specs", "colors", "seat-height", "fuel-economy"] },
  { modelId: "honda-beat", mappedSearchVolume: 43730, primaryKeyword: "honda beat", secondaryKeywords: ["honda beat v3", "honda beat premium", "honda beat seat height"], intents: ["price", "variants", "colors", "seat-height", "fuel-economy"] },
  { modelId: "yamaha-xmax", mappedSearchVolume: 35110, primaryKeyword: "xmax price philippines", secondaryKeywords: ["yamaha xmax price philippines", "xmax v3", "xmax specs"], intents: ["price", "colors", "specs", "seat-height", "top-speed"] },
  { modelId: "honda-x-adv", mappedSearchVolume: 34550, primaryKeyword: "honda x adv", secondaryKeywords: ["adv 750", "x adv 750 price philippines", "adv motorcycle"], intents: ["price", "specs", "seat-height", "weight", "fuel-tank"] },
  { modelId: "yamaha-mio-i-125", mappedSearchVolume: 32100, primaryKeyword: "mio i 125 price", secondaryKeywords: ["mio i 125 price philippines", "mio i 125 specs", "mio i seat height"], intents: ["price", "specs", "colors", "seat-height", "fuel-economy"] },
  { modelId: "yamaha-xsr155", mappedSearchVolume: 29660, primaryKeyword: "xsr 155", secondaryKeywords: ["yamaha xsr 155", "yamaha xsr 155 price philippines", "yamaha xsr 155 specs"], intents: ["price", "specs", "seat-height", "top-speed", "tires"] },
  { modelId: "honda-winner-x", mappedSearchVolume: 29310, primaryKeyword: "winner x 150", secondaryKeywords: ["winner x price", "honda winner x", "winner x specs"], intents: ["price", "variants", "colors", "specs", "top-speed"] },
  { modelId: "suzuki-burgman-street", mappedSearchVolume: 29100, primaryKeyword: "suzuki burgman 125", secondaryKeywords: ["burgman street", "burgman price", "burgman street colors"], intents: ["price", "variants", "colors", "specs", "fuel-economy"] },
  { modelId: "yamaha-yzf-r3", mappedSearchVolume: 27500, primaryKeyword: "yamaha r3 price philippines", secondaryKeywords: ["r3 price philippines", "r3 top speed", "yamaha yzf-r3"], intents: ["price", "top-speed", "specs", "seat-height", "weight"] },
  { modelId: "yamaha-yzf-r15m", mappedSearchVolume: 26040, primaryKeyword: "r15 price philippines", secondaryKeywords: ["yamaha r15 price philippines", "r15m", "yamaha yzf-r15"], intents: ["price", "colors", "specs", "top-speed", "seat-height"] },
  { modelId: "suzuki-burgman-400", mappedSearchVolume: 25220, primaryKeyword: "burgman 400", secondaryKeywords: ["suzuki burgman 400", "burgman 400 price philippines", "suzuki burgman 400 price"], intents: ["price", "specs", "seat-height", "weight", "top-speed"] },
  { modelId: "kawasaki-ninja-400", mappedSearchVolume: 22180, primaryKeyword: "ninja 400 price philippines", secondaryKeywords: ["kawasaki ninja 400 price philippines", "ninja 400 price", "ninja 400 seat height"], intents: ["price", "specs", "seat-height", "top-speed", "weight"] },
];

const byId = new Map(highDemandIntentProfiles2026.map((profile) => [profile.modelId, profile]));

export function highDemandIntentProfile2026(modelId: string) {
  return byId.get(modelId);
}

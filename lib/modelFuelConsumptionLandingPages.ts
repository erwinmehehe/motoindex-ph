export type FuelConsumptionLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const fuelConsumptionLandingProfiles: FuelConsumptionLandingProfile[] = [
  {
    modelId: "honda-click-125i",
    keyword: "honda click fuel consumption",
    keywordVolume: 800,
    title: "Honda Click 125i Fuel Consumption Philippines | 50.3 km/L",
    description: "Honda Click 125i fuel consumption Philippines guide with listed 50.3 km/L, 5.5L tank range, monthly fuel-cost calculator, source date and real-world caveats.",
    heading: "Honda Click 125i fuel consumption in the Philippines",
    intro: "Honda's current Click125 reference lists 50.3 km/L. Use that published figure as a planning basis, then compare theoretical tank range, an 85% planning range and monthly fuel cost without presenting one laboratory figure as a guaranteed real-world result."
  },
  {
    modelId: "honda-adv-160",
    keyword: "adv 160 fuel consumption",
    keywordVolume: 600,
    title: "Honda ADV160 Fuel Consumption Philippines | 45 km/L Guide",
    description: "Honda ADV160 fuel consumption Philippines guide with listed 45.0 km/L, 8.1L tank range, monthly fuel-cost calculator, source date and real-world caveats.",
    heading: "Honda ADV160 fuel consumption in the Philippines",
    intro: "Honda's ADV160 reference lists 45.0 km/L under its stated test basis. MotoIndex keeps that source figure separate from real-world planning, where traffic, load, speed, tire pressure, wind and riding style can materially change fuel use."
  },
  {
    modelId: "honda-tmx125-alpha",
    keyword: "tmx 125 fuel consumption",
    keywordVolume: 500,
    title: "Honda TMX125 Alpha Fuel Consumption Philippines | 62.5 km/L",
    description: "Honda TMX125 Alpha fuel consumption Philippines guide with listed 62.5 km/L, 8.6L tank range, monthly fuel-cost calculator, source date and riding caveats.",
    heading: "Honda TMX125 Alpha fuel consumption in the Philippines",
    intro: "MotoIndex currently stores a 62.5 km/L published/reference figure for the TMX125 Alpha. Use it as a dated model reference, not a promise that every loaded delivery, city commute or rural route will reproduce the same consumption."
  },
  {
    modelId: "honda-pcx-160",
    keyword: "pcx 160 fuel consumption",
    keywordVolume: 350,
    title: "Honda PCX160 Fuel Consumption Philippines | 46 km/L Guide",
    description: "Honda PCX160 fuel consumption Philippines guide with listed 46.0 km/L, 8.1L tank range, monthly fuel-cost calculator, source date and real-world caveats.",
    heading: "Honda PCX160 fuel consumption in the Philippines",
    intro: "Honda's PCX160 reference lists 46.0 km/L. Use that figure to estimate tank range and monthly fuel spend, then adjust expectations for congestion, passenger load, tire pressure, maintenance and riding speed."
  },
  {
    modelId: "honda-xr150l",
    keyword: "xr 150 fuel consumption",
    keywordVolume: 90,
    title: "Honda XR150L Fuel Consumption Philippines | 36.7 km/L Guide",
    description: "Honda XR150L fuel consumption Philippines guide with listed 36.7 km/L, 12L tank range, monthly fuel-cost calculator, source date and real-world riding caveats.",
    heading: "Honda XR150L fuel consumption in the Philippines",
    intro: "Honda's Philippine XR150L launch material lists 36.7 km/L. The 12 L tank makes range a meaningful ownership question, but road surface, tire choice, load, gearing, speed and off-pavement use can move actual consumption away from the published figure."
  }
];

const byId = new Map(fuelConsumptionLandingProfiles.map((profile) => [profile.modelId, profile]));

export function fuelConsumptionLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasFuelConsumptionLandingPage(modelId: string) {
  return byId.has(modelId);
}

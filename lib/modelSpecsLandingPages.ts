export type SpecsIntentLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  intro: string;
};

export const specsIntentLandingProfiles: SpecsIntentLandingProfile[] = [
  {
    modelId: "honda-giorno-plus",
    keyword: "honda giorno specs",
    keywordVolume: 1700,
    title: "Honda Giorno+ Specs Philippines 2026 | Engine, Weight & Seat",
    description: "Honda Giorno+ specs Philippines 2026 with 124.9cc engine, power and torque, weight, seat height, fuel tank, tires, ABS/brakes and current source dates.",
    heading: "Honda Giorno+ specifications in the Philippines",
    intro: "Use this page as the technical reference for the Giorno+ engine, output, weight, seat, tank, tires, transmission and braking data. Price, colors, financing and ownership stay on the main model guide."
  },
  {
    modelId: "honda-adv-160",
    keyword: "adv 160 specs",
    keywordVolume: 1300,
    title: "Honda ADV160 Specs Philippines 2026 | Engine, Weight & Seat",
    description: "Honda ADV160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, ground clearance, tires and ABS details.",
    heading: "Honda ADV160 specifications in the Philippines",
    intro: "Use this page for the ADV160 technical sheet: engine, output, weight, seat height, ground clearance, fuel tank, stock tires, transmission and braking details."
  },
  {
    modelId: "yamaha-sniper-155",
    keyword: "sniper 155 specs",
    keywordVolume: 1100,
    title: "Yamaha Sniper 155 Specs Philippines 2026 | Engine & Weight",
    description: "Yamaha Sniper 155 specs Philippines 2026 with 155cc engine, power, torque, curb weight, seat height, fuel tank, tires, six-speed transmission and ABS context.",
    heading: "Yamaha Sniper 155 specifications in the Philippines",
    intro: "This technical reference keeps Sniper 155 engine, output, weight, seat, tank, tire, transmission and braking details separate from price, installment and ownership intent."
  },
  {
    modelId: "yamaha-fazzio",
    keyword: "fazzio specs",
    keywordVolume: 500,
    title: "Yamaha Fazzio Specs Philippines 2026 | Engine, Weight & Seat",
    description: "Yamaha Fazzio specs Philippines 2026 with 125cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and source dates.",
    heading: "Yamaha Fazzio specifications in the Philippines",
    intro: "Use this page as the focused Fazzio specification sheet. It keeps the technical reference concise while the main model page owns price, colors, financing and ownership questions."
  },
  {
    modelId: "yamaha-lexi-155",
    keyword: "lexi 155 specs",
    keywordVolume: 500,
    title: "Yamaha Lexi 155 Specs Philippines 2026 | Engine & Weight",
    description: "Yamaha Lexi 155 specs Philippines 2026 with 155cc engine, power, torque, curb weight, seat height, fuel tank, tires, transmission and brake/ABS details.",
    heading: "Yamaha Lexi 155 specifications in the Philippines",
    intro: "Use this page for the Lexi 155 technical details: engine, output, weight, seat, tank, stock tires, transmission and braking context."
  },
  {
    modelId: "honda-pcx-160",
    keyword: "pcx 160 specs",
    keywordVolume: 500,
    title: "Honda PCX160 Specs Philippines 2026 | Engine, Weight & Seat",
    description: "Honda PCX160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, ground clearance, tires and ABS details.",
    heading: "Honda PCX160 specifications in the Philippines",
    intro: "Use this page as the PCX160 technical reference for engine, output, dimensions stored by MotoIndex, weight, seat, tank, tires, transmission and braking."
  },
  {
    modelId: "yamaha-mio-gravis",
    keyword: "mio gravis specs",
    keywordVolume: 450,
    title: "Yamaha Mio Gravis Specs Philippines 2026 | Engine & Weight",
    description: "Yamaha Mio Gravis specs Philippines 2026 with 125cc engine, power, torque, curb weight, seat height, fuel tank, tire sizes, transmission and source dates.",
    heading: "Yamaha Mio Gravis specifications in the Philippines",
    intro: "Use this technical page for the current MotoIndex Mio Gravis engine, output, weight, seat, tank, tire and transmission data, while availability and price context remain on the main model page."
  },
  {
    modelId: "honda-click-160",
    keyword: "click 160 specs",
    keywordVolume: 400,
    title: "Honda Click 160 Specs Philippines 2026 | Engine & Weight",
    description: "Honda Click 160 specs Philippines 2026 with 157cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and brake details.",
    heading: "Honda Click 160 specifications in the Philippines",
    intro: "This page owns Click 160 technical specification intent so the main model guide can stay focused on price, colors, financing, fit and ownership."
  },
  {
    modelId: "suzuki-raider-r150",
    keyword: "raider 150 fi specs",
    keywordVolume: 400,
    title: "Suzuki Raider R150 Specs Philippines 2026 | Engine & Weight",
    description: "Suzuki Raider R150 specs Philippines 2026 with 147cc engine, power, torque, curb weight, seat height, fuel tank, tire sizes, six-speed transmission and ABS.",
    heading: "Suzuki Raider R150 specifications in the Philippines",
    intro: "Use this page for the Raider R150 technical sheet: engine, output, curb weight, seat, tank, stock tires, six-speed transmission and braking context."
  },
  {
    modelId: "honda-beat",
    keyword: "honda beat specs",
    keywordVolume: 400,
    title: "Honda BeAT Specs Philippines 2026 | Engine, Weight & Seat",
    description: "Honda BeAT specs Philippines 2026 with 110cc engine, power and torque, curb weight, seat height, fuel tank, tire sizes, transmission and brake details.",
    heading: "Honda BeAT specifications in the Philippines",
    intro: "Use this page as the focused BeAT technical reference. Price, colors, variant positioning, financing and ownership remain on the broader model page."
  }
];

const byId = new Map(specsIntentLandingProfiles.map((profile) => [profile.modelId, profile]));

export function specsIntentLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasSpecsIntentLandingPage(modelId: string) {
  return byId.has(modelId);
}

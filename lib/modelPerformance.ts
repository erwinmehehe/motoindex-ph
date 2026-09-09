export type PerformanceAnswer = {
  modelId: string;
  answer: string;
  evidence: "independent road test" | "Philippine editorial estimate" | "not manufacturer-published";
  observedTopSpeedKph?: number;
  observedRangeKph?: [number, number];
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
  caution: string;
};

export const modelPerformanceAnswers: PerformanceAnswer[] = [
  {
    modelId: "honda-navi",
    answer: "Honda does not publish an official maximum-speed figure for the Philippine Navi. Independent road tests of stock Navis have reported roughly 80 to 89 km/h, so the honest answer is a tested range rather than one guaranteed number.",
    evidence: "independent road test",
    observedRangeKph: [80, 89],
    sourceLabel: "AMCN 2026 Honda Navi road test and Rider Magazine first-ride test",
    sourceUrl: "https://amcn.com.au/editorial/road-test-honda-navi/",
    checkedAt: "2026-09-09",
    caution: "The tests were not conducted on the same Philippine unit or under identical conditions. Rider mass, wind, road gradient, tire pressure, break-in and speedometer error can change the result."
  },
  {
    modelId: "honda-adv-160",
    answer: "Honda Philippines publishes power, torque and fuel-consumption figures for the ADV 160 but not an official top speed. A Philippine-market editorial reference describes about 115 km/h; MotoIndex labels that as an editorial estimate, not a manufacturer guarantee or controlled instrumented result.",
    evidence: "Philippine editorial estimate",
    observedTopSpeedKph: 115,
    sourceLabel: "Zigwheels Philippines ADV 160 editorial performance description",
    sourceUrl: "https://www.zigwheels.ph/new-motorcycles/honda/adv-160",
    checkedAt: "2026-09-09",
    caution: "Do not treat 115 km/h as a guaranteed result. Published road-test conditions and GPS correction were not supplied with the estimate."
  },
  {
    modelId: "honda-click-125i",
    answer: "Honda Philippines does not publish an official top speed for the Click 125i, and no repeatable instrumented Philippine road test was verified for this update. Rider-posted speedometer videos vary too much to support one factual number.",
    evidence: "not manufacturer-published",
    sourceLabel: "Honda Philippines current Click 125 specifications",
    sourceUrl: "https://www.hondaph.com/motor/click125",
    checkedAt: "2026-09-09",
    caution: "Speedometer readings, downhill runs and modified motorcycles are not equivalent to GPS-tested maximum speed."
  },
  {
    modelId: "honda-click-160",
    answer: "Honda Philippines does not state an official top speed for the Click 160. MotoIndex does not publish a number because the available rider reports do not establish the model year, stock condition, road gradient or GPS accuracy consistently.",
    evidence: "not manufacturer-published",
    sourceLabel: "Honda Philippines current Click 160 product information",
    sourceUrl: "https://www.hondaph.com/motor/click160",
    checkedAt: "2026-09-09",
    caution: "A dashboard-indicated speed can differ from true road speed and should not be presented as an official specification."
  },
  {
    modelId: "yamaha-aerox-v3",
    answer: "Yamaha Philippines does not publish an official maximum speed for the Aerox V3. The current model also has Standard and SP configurations, so older Aerox videos and modified-bike results should not be assigned to the V3 as a verified specification.",
    evidence: "not manufacturer-published",
    sourceLabel: "Yamaha Motor Philippines All-New Aerox announcement",
    sourceUrl: "https://www.yamaha-motor.com.ph/news/news-overview/the-all-new-yamaha-aerox",
    checkedAt: "2026-09-09",
    caution: "Do not mix V2 tests, tuned CVT results or speedometer-only videos with the current V3."
  },
  {
    modelId: "yamaha-nmax-v3",
    answer: "Yamaha Philippines does not list an official top speed for the NMAX V3. Turbo, Tech Max and previous-generation NMAX results are frequently mixed online, so no single figure is published here without a repeatable stock-bike GPS test.",
    evidence: "not manufacturer-published",
    sourceLabel: "Yamaha Motor Philippines current NMAX information",
    sourceUrl: "https://www.yamaha-motor.com.ph/product/nmax",
    checkedAt: "2026-09-09",
    caution: "Variant, rider weight, riding mode, wind, gradient and dashboard error all affect reported maximum speed."
  },
  {
    modelId: "suzuki-raider-r150",
    answer: "Suzuki Philippines publishes engine output and specifications for the Raider R150 but does not guarantee an official top speed. Rider videos frequently include modified engines or gearing, so MotoIndex does not convert those results into a stock-model claim.",
    evidence: "not manufacturer-published",
    sourceLabel: "Suzuki Philippines Raider R150 product information",
    sourceUrl: "https://mc.suzuki.com.ph/product/raider-r150-fi/",
    checkedAt: "2026-09-09",
    caution: "Confirm whether any cited run used a stock motorcycle, GPS measurement, level road and controlled direction before comparing results."
  },
  {
    modelId: "yamaha-sniper-155",
    answer: "Yamaha Philippines does not publish an official top speed for the Sniper 155. Available rider reports do not consistently separate stock units from modified motorcycles or GPS speed from the dashboard reading, so no verified number is shown.",
    evidence: "not manufacturer-published",
    sourceLabel: "Yamaha Motor Philippines Sniper 155 product information",
    sourceUrl: "https://www.yamaha-motor.com.ph/product/sniper155",
    checkedAt: "2026-09-09",
    caution: "A claimed maximum speed without test method, model year and modification details is not a reliable specification."
  }
];

export function performanceAnswerFor(modelId: string) {
  return modelPerformanceAnswers.find((item) => item.modelId === modelId);
}

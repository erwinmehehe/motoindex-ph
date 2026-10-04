export type TopSpeedLandingProfile = {
  modelId: string;
  keyword: string;
  keywordVolume: number;
  title: string;
  description: string;
  heading: string;
  observedTopSpeedKph: number;
  evidenceLabel: string;
  answer: string;
  caution: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
};

export const topSpeedLandingProfiles: TopSpeedLandingProfile[] = [
  {
    modelId: "kawasaki-ninja-650",
    keyword: "ninja 650 top speed",
    keywordVolume: 8800,
    title: "Kawasaki Ninja 650 Top Speed Philippines | Test Evidence",
    description: "Kawasaki Ninja 650 top speed guide with independent test evidence, mph/km/h conversion, model-year caveats, gearing context and why real-world speed varies.",
    heading: "Kawasaki Ninja 650 top speed: tested evidence",
    observedTopSpeedKph: 201,
    evidenceLabel: "Independent road test",
    answer: "Cycle World recorded 125 mph, about 201 km/h, for a tested Ninja 650. Treat that as independent test evidence rather than a guaranteed figure for every model year or Philippine-market unit.",
    caution: "Ninja 650 generations, ECU calibration, rider tuck, wind, altitude, tire condition and speedometer error can change the result. Kawasaki does not publish this test number as an official maximum-speed specification.",
    sourceLabel: "Cycle World Ninja 650 test",
    sourceUrl: "https://www.cycleworld.com/2014/11/14/kawasaki-ninja-650-sportbike-affordable-and-best-value-motorcycles-cw-bargain-blasters/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "suzuki-hayabusa",
    keyword: "hayabusa top speed",
    keywordVolume: 4000,
    title: "Suzuki Hayabusa Top Speed Philippines | 299 km/h Evidence",
    description: "Suzuki Hayabusa top speed guide with the 299 km/h electronic limit, independent test evidence, generation context and why real-world maximum speed varies.",
    heading: "Suzuki Hayabusa top speed and the 299 km/h limit",
    observedTopSpeedKph: 299,
    evidenceLabel: "Independent test / electronic limit",
    answer: "Motorcycle News lists 186 mph, about 299 km/h, for the third-generation Hayabusa. That aligns with the long-standing electronically limited maximum associated with modern Hayabusa generations.",
    caution: "The current Suzuki product page emphasizes power and electronics rather than promising a public-road maximum speed. Conditions, tire specification, rider position and limiter behavior matter.",
    sourceLabel: "Motorcycle News 2021+ Hayabusa review",
    sourceUrl: "https://www.motorcyclenews.com/suzuki/hayabusa/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "kawasaki-ninja-zx-10r",
    keyword: "kawasaki ninja zx-10r top speed",
    keywordVolume: 3100,
    title: "Kawasaki ZX-10R Top Speed Philippines | Test Evidence Guide",
    description: "Kawasaki Ninja ZX-10R top speed guide with independent test results, 299 km/h context, generation caveats, gearing, limiter notes and test-condition warnings.",
    heading: "Kawasaki Ninja ZX-10R top speed: test evidence",
    observedTopSpeedKph: 299,
    evidenceLabel: "Independent performance record",
    answer: "Published ZX-10R test histories repeatedly place modern-generation maximum speed around 186 mph, about 299 km/h. MotoIndex treats that as test/history evidence, not a Kawasaki Philippines guaranteed road-speed specification.",
    caution: "ZX-10R generations differ in electronics, gearing, aerodynamics and output. Do not transfer one model-year test to every unit without the generation caveat.",
    sourceLabel: "Visordown ZX-10R model-history performance guide",
    sourceUrl: "https://www.visordown.com/features/guides/Kawasaki-ZX-10R-Ninja",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "yamaha-yzf-r3",
    keyword: "r3 top speed",
    keywordVolume: 1800,
    title: "Yamaha R3 Top Speed Philippines | 181 km/h Test Evidence",
    description: "Yamaha YZF-R3 top speed guide with independent testing around 181 km/h, mph conversion, rider/condition caveats, gearing context and stock-bike evidence.",
    heading: "Yamaha YZF-R3 top speed: independent test evidence",
    observedTopSpeedKph: 181,
    evidenceLabel: "Independent acceleration test",
    answer: "MotoStatz reports a tested YZF-R3 top speed of about 112.4 mph, roughly 181 km/h, with a strong tuck. That is an independent performance result, not an official Yamaha maximum-speed specification.",
    caution: "Rider size, tuck, wind, road gradient and model-year calibration have a large effect on a roughly 40 hp motorcycle. Do not treat a dashboard peak as GPS-equivalent.",
    sourceLabel: "MotoStatz Yamaha YZF-R3 acceleration and top-speed test",
    sourceUrl: "https://motostatz.com/yamaha-yzf-r3-acceleration/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "honda-cbr500r",
    keyword: "cbr500r top speed",
    keywordVolume: 1800,
    title: "Honda CBR500R Top Speed Philippines | 180 km/h Evidence",
    description: "Honda CBR500R top speed guide with independent testing around 180 km/h, mph conversion, model-year context, stock-bike caveats and performance evidence.",
    heading: "Honda CBR500R top speed: road-test evidence",
    observedTopSpeedKph: 180,
    evidenceLabel: "Independent road test",
    answer: "Motorcycle News reports about 112 mph, roughly 180 km/h, for the 2019–2021 CBR500R. MotoIndex uses that as generation-specific road-test evidence rather than an official Honda Philippines maximum-speed claim.",
    caution: "The MotoIndex Philippine record is a 2021-generation reference. Exact output, gearing, rider conditions and newer model revisions can change a measured result.",
    sourceLabel: "Motorcycle News Honda CBR500R 2019–2021 review",
    sourceUrl: "https://www.motorcyclenews.com/bike-reviews/honda/cbr500r/2019/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "royal-enfield-shotgun-650",
    keyword: "shotgun 650 top speed",
    keywordVolume: 1700,
    title: "Royal Enfield Shotgun 650 Top Speed Philippines | Evidence",
    description: "Royal Enfield Shotgun 650 top speed guide with an indicated 160 km/h road-test result, official-spec context, rider-condition caveats and evidence notes.",
    heading: "Royal Enfield Shotgun 650 top speed: road-test evidence",
    observedTopSpeedKph: 160,
    evidenceLabel: "Independent indicated-speed road test",
    answer: "BikeReview reported winding a Shotgun 650 out to an indicated 160 km/h on flat ground. Because the report describes indicated speed rather than a GPS-certified maximum, MotoIndex labels the measurement accordingly.",
    caution: "Indicated speed can over-read true road speed. Altitude, rider size, wind and the Shotgun's 240 kg wet mass also affect whether another unit reproduces the same number.",
    sourceLabel: "BikeReview Shotgun 650 world-launch road test",
    sourceUrl: "https://bikereview.com.au/review-2024-royal-enfield-shotgun-650-world-launch-test/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "kawasaki-z1000-r-edition",
    keyword: "z1000 top speed",
    keywordVolume: 900,
    title: "Kawasaki Z1000 Top Speed Philippines | 237 km/h Evidence",
    description: "Kawasaki Z1000 top speed guide with a 237 km/h Cycle World test result, mph conversion, model-generation context, gearing notes and stock-bike caveats.",
    heading: "Kawasaki Z1000 top speed: independent test evidence",
    observedTopSpeedKph: 237,
    evidenceLabel: "Independent road test",
    answer: "Cycle World measured 147 mph, roughly 237 km/h, on a 2014 Z1000 ABS. MotoIndex uses that as closely related generation evidence for Z1000 performance, not as a guaranteed figure for the Philippine 2017 R Edition record.",
    caution: "The MotoIndex page is the 2017 R Edition, while the measured test was a 2014 Z1000 ABS. Equipment, gearing and aerodynamic details can differ between years and trims.",
    sourceLabel: "Cycle World 2014 Kawasaki Z1000 ABS test",
    sourceUrl: "https://magazine.cycleworld.com/article/2014/8/1/kawasaki-z1000-abs",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "ktm-790-duke",
    keyword: "duke 790 top speed",
    keywordVolume: 900,
    title: "KTM 790 Duke Top Speed Philippines | 225 km/h Test Evidence",
    description: "KTM 790 Duke top speed guide with an independent test around 225 km/h, mph conversion, model-generation context, gearing notes and test-condition caveats.",
    heading: "KTM 790 Duke top speed: independent test evidence",
    observedTopSpeedKph: 225,
    evidenceLabel: "Independent road test",
    answer: "Cycle News reported about 140 mph, roughly 225 km/h, during its 790 Duke test. MotoIndex treats that as an independent test result and keeps it separate from KTM's published power and gearing specifications.",
    caution: "The test predates some later-market 790 Duke updates. Model-year calibration, rider position, wind, road and gearing can change the maximum speed.",
    sourceLabel: "Cycle News KTM 790 Duke full test",
    sourceUrl: "https://www.cyclenews.com/2018/04/article/2019-ktm-790-duke-full-test/",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "aprilia-rs-660",
    keyword: "rs660 top speed",
    keywordVolume: 700,
    title: "Aprilia RS 660 Top Speed Philippines | 240 km/h Evidence",
    description: "Aprilia RS 660 top speed guide with independent evidence around 240 km/h, mph conversion, model-year context, limiter caveats and real-world test notes.",
    heading: "Aprilia RS 660 top speed: 240 km/h evidence",
    observedTopSpeedKph: 240,
    evidenceLabel: "Independent / published performance evidence",
    answer: "Recent RS 660 Factory testing and published performance references place maximum speed around 240 km/h, about 149 mph, with a long run and a full tuck. MotoIndex treats that as performance evidence rather than a guaranteed road result.",
    caution: "Standard and Factory versions, rider aerodynamics, run length, wind and speedometer/GPS method can change the measured result. Public-road riding is not an appropriate top-speed test.",
    sourceLabel: "Gazzetta RS 660 Factory track test",
    sourceUrl: "https://www.gazzetta.it/motori/la-mia-moto/prove-moto/03-08-2025/aprilia-rs-660-factory-2025-la-prova-in-pista-a-misano-e-cervesina.shtml",
    checkedAt: "2026-10-03"
  },
  {
    modelId: "bmw-m-1000-rr",
    keyword: "bmw m1000rr top speed",
    keywordVolume: 700,
    title: "BMW M 1000 RR Top Speed Philippines | 314 km/h Official",
    description: "BMW M 1000 RR top speed guide with BMW's official 314 km/h maximum-speed figure, aerodynamic context, model-year notes and closed-course safety caveats.",
    heading: "BMW M 1000 RR top speed: official 314 km/h figure",
    observedTopSpeedKph: 314,
    evidenceLabel: "BMW Motorrad official maximum-speed figure",
    answer: "BMW Motorrad states that the 2023-generation M 1000 RR increased maximum speed from 306 km/h to 314 km/h through major aerodynamic development. MotoIndex uses that manufacturer figure as generation-specific evidence.",
    caution: "Maximum speed is highly sensitive to model year, configuration, tires, aerodynamics and conditions. This is not a public-road target; high-speed testing belongs on a controlled closed course.",
    sourceLabel: "BMW Motorrad M 1000 RR maximum-speed technical Q&A",
    sourceUrl: "https://support.bmw-motorrad.com/s/article/M-1000-RR-2023-higher-maximum-speed-uzQOa?language=en_GB",
    checkedAt: "2026-10-04"
  },
  {
    modelId: "yamaha-yzf-r7",
    keyword: "yamaha r7 top speed",
    keywordVolume: 700,
    title: "Yamaha R7 Top Speed Philippines | 224 km/h Test Evidence",
    description: "Yamaha YZF-R7 top speed guide with independent testing around 224 km/h, mph conversion, rider/tuck caveats, gearing context and real-world performance notes.",
    heading: "Yamaha YZF-R7 top speed: independent test evidence",
    observedTopSpeedKph: 224,
    evidenceLabel: "Independent acceleration test",
    answer: "MotoStatz reports a YZF-R7 top speed of about 139 mph, roughly 224 km/h, under favorable conditions with an effective tuck. That is independent test evidence, not an official Yamaha maximum-speed specification.",
    caution: "The R7 is sensitive to rider aerodynamics, wind and available run length. ECU calibration can also vary by market, so one measured result is not universal.",
    sourceLabel: "MotoStatz Yamaha YZF-R7 acceleration and top-speed test",
    sourceUrl: "https://motostatz.com/yamaha-yzf-r7-top-speed-acceleration/",
    checkedAt: "2026-10-03"
  }
];

const byId = new Map(topSpeedLandingProfiles.map((profile) => [profile.modelId, profile]));

export function topSpeedLandingProfile(modelId: string) {
  return byId.get(modelId);
}

export function hasTopSpeedLandingPage(modelId: string) {
  return byId.has(modelId);
}

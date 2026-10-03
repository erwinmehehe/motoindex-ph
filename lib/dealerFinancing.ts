export type DealerFinancingObservation = {
  modelId: string;
  label: string;
  srpPhp: number;
  downPaymentPhp?: number;
  monthlyPhp?: number;
  checkedAt: string;
  sourceName: string;
  sourceUrl: string;
  note?: string;
};

export const dealerFinancingObservations: DealerFinancingObservation[] = [
  {
    modelId: "honda-click-125i",
    label: "Click 125 dealer listing",
    srpPhp: 81900,
    downPaymentPhp: 3500,
    monthlyPhp: 4100,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-click-125i-new-acb125cbfn-motortrade-motorcycle-price/",
    note: "Motortrade marks the price and financing figures as indicative and branch-dependent. Confirm the exact 2026 variant/model code before reserving."
  },
  {
    modelId: "honda-click-160",
    label: "Click 160 dealer listing",
    srpPhp: 116900,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-click-160/",
    note: "The current Motortrade product page exposes SRP but does not publish a downpayment or monthly figure. MotoIndex does not infer one."
  },
  {
    modelId: "honda-pcx-160",
    label: "PCX160 CBS dealer listing",
    srpPhp: 134000,
    downPaymentPhp: 14000,
    monthlyPhp: 6200,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-the-all-new-pcx160-cbs/",
    note: "Dealer naming and pricing can differ from Honda's current Standard/RoadSync lineup, so confirm the exact trim and model year."
  },
  {
    modelId: "honda-pcx-160",
    label: "PCX160 ABS dealer listing",
    srpPhp: 154900,
    downPaymentPhp: 16000,
    monthlyPhp: 7200,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/honda-the-all-new-pcx160-abs/",
    note: "Dealer naming and pricing can differ from Honda's current Standard/RoadSync lineup, so confirm the exact trim and model year."
  },
  {
    modelId: "yamaha-nmax-v3",
    label: "NMAX dealer listing",
    srpPhp: 155900,
    downPaymentPhp: 17000,
    monthlyPhp: 7200,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/model/yamaha_new-nmax/",
    note: "The listing publishes a monthly amount but not the full rate/term assumptions in the surfaced price card. Treat it as a dealer snapshot, not a transferable loan quote."
  },
  {
    modelId: "yamaha-nmax-v3",
    label: "NMAX Tech Max dealer listing",
    srpPhp: 178400,
    downPaymentPhp: 14000,
    monthlyPhp: 8300,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-nmax-techmax/",
    note: "Motortrade marks these figures as indicative and branch-dependent. Confirm the exact financed amount, term, rate method and fees."
  },
  {
    modelId: "yamaha-mio-gear",
    label: "Mio Gear dealer listing",
    srpPhp: 79400,
    downPaymentPhp: 4000,
    monthlyPhp: 4000,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-mio-gear/",
    note: "Motortrade marks the price and financing figures as indicative and branch-dependent. Confirm the financed amount, term, rate method, fees and exact BJN4 unit before reserving."
  },
  {
    modelId: "yamaha-aerox-v3",
    label: "New Aerox dealer listing",
    srpPhp: 133900,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-new-aerox/",
    note: "The current New Aerox page exposes SRP but no downpayment/monthly figure. Older Mio Aerox financing is not reused for the current generation."
  },
  {
    modelId: "yamaha-aerox-v3",
    label: "Aerox SP dealer listing",
    srpPhp: 163900,
    checkedAt: "2026-10-01",
    sourceName: "Motortrade Philippines",
    sourceUrl: "https://motortrade.com.ph/motorcycles/yamaha-aerox-sp/",
    note: "The current Aerox SP page exposes SRP but no downpayment/monthly figure, so MotoIndex keeps dealer financing blank rather than estimating it."
  }
];

export function dealerFinancingObservationsFor(modelId: string) {
  return dealerFinancingObservations.filter((row) => row.modelId === modelId);
}

export function hasDealerFinancingObservation(modelId: string) {
  return dealerFinancingObservations.some((row) => row.modelId === modelId);
}

export type ElectricMotorcycle = {
  slug: string;
  make: string;
  model: string;
  priceFromPhp: number;
  oneBatteryPricePhp?: number;
  twoBatteryPricePhp?: number;
  batteryKwh: number;
  twoBatteryKwh: number;
  batteryType: string;
  rangeOneKm: number;
  rangeTwoKm: number;
  chargeOneHours: number;
  chargeTwoHours: number;
  maxPowerOneW: number;
  maxPowerTwoW: number;
  topSpeedKph: number;
  dimensionsMm: string;
  wheelbaseMm: number;
  colors: string[];
  imageUrl: string;
  sourceUrl: string;
  ltoSourceUrl: string;
  checkedAt: string;
};

export const electricMotorcycles: ElectricMotorcycle[] = [
  {
    slug: "vinfast-evo", make: "VinFast", model: "Evo", priceFromPhp: 62900,
    oneBatteryPricePhp: 75600, twoBatteryPricePhp: 88300,
    batteryKwh: 1.5, twoBatteryKwh: 3, batteryType: "Removable LFP",
    rangeOneKm: 85, rangeTwoKm: 150, chargeOneHours: 4.5, chargeTwoHours: 9,
    maxPowerOneW: 3000, maxPowerTwoW: 5200, topSpeedKph: 80,
    dimensionsMm: "1,850 × 675 × 1,130", wheelbaseMm: 1295,
    colors: ["Olive", "Red", "Black", "White"],
    imageUrl: "https://vinfastauto.ph/themes/custom/vinfast/images/pdp/evo/olive.webp",
    sourceUrl: "https://vinfastauto.ph/en/evo",
    ltoSourceUrl: "https://lto.gov.ph/wp-content/uploads/2026/08/MEMORANDUM-CIRCULAR-NO.-MVL-2026-5281.pdf",
    checkedAt: "2026-09-09"
  },
  {
    slug: "vinfast-feliz-ii", make: "VinFast", model: "Feliz II", priceFromPhp: 64900,
    oneBatteryPricePhp: 77600, twoBatteryPricePhp: 90300,
    batteryKwh: 1.5, twoBatteryKwh: 3, batteryType: "Removable LFP",
    rangeOneKm: 82, rangeTwoKm: 145, chargeOneHours: 4.5, chargeTwoHours: 9,
    maxPowerOneW: 3000, maxPowerTwoW: 5200, topSpeedKph: 90,
    dimensionsMm: "1,913 × 693 × 1,130", wheelbaseMm: 1320,
    colors: ["Olive", "Red", "Black", "White"],
    imageUrl: "https://vinfastauto.ph/themes/custom/vinfast/images/pdp/feliz-ii/olive.webp",
    sourceUrl: "https://vinfastauto.ph/en/feliz-ii",
    ltoSourceUrl: "https://lto.gov.ph/wp-content/uploads/2026/08/MEMORANDUM-CIRCULAR-NO.-MVL-2026-5279.pdf",
    checkedAt: "2026-09-09"
  },
  {
    slug: "vinfast-viper", make: "VinFast", model: "Viper", priceFromPhp: 73900,
    oneBatteryPricePhp: 89600, twoBatteryPricePhp: 99300,
    batteryKwh: 1.5, twoBatteryKwh: 3, batteryType: "Removable LFP",
    rangeOneKm: 82, rangeTwoKm: 145, chargeOneHours: 4.5, chargeTwoHours: 9,
    maxPowerOneW: 3000, maxPowerTwoW: 5200, topSpeedKph: 90,
    dimensionsMm: "1,950 × 712 × 1,122", wheelbaseMm: 1320,
    colors: ["Beige Black", "Red Black", "Matte Black", "Grey", "White"],
    imageUrl: "https://vinfastauto.ph/themes/custom/vinfast/images/pdp/viper/beige-black.webp",
    sourceUrl: "https://vinfastauto.ph/en/viper",
    ltoSourceUrl: "https://lto.gov.ph/wp-content/uploads/2026/08/MEMORANDUM-CIRCULAR-NO.-MVL-2026-5277.pdf",
    checkedAt: "2026-09-09"
  }
];

export function getElectricMotorcycle(slug: string) {
  return electricMotorcycles.find(model => model.slug === slug);
}

export function php(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

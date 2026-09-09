export type OfficialDealerLocator = {
  brand: string;
  href: string;
  note: string;
  checkedAt: string;
};

export const officialDealerLocators: OfficialDealerLocator[] = [
  { brand: "Honda", href: "https://www.hondaph.com/dealer-locator", note: "Official Honda Philippines dealer locator.", checkedAt: "2026-09-09" },
  { brand: "Yamaha", href: "https://find-dealer.yamaha-motor.com.ph/", note: "Official Yamaha Motor Philippines dealer locator.", checkedAt: "2026-09-09" },
  { brand: "Suzuki", href: "https://mc.suzuki.com.ph/motorcycles-dealer/", note: "Official Suzuki Motorcycles Philippines dealer locator.", checkedAt: "2026-09-09" },
  { brand: "Kawasaki", href: "https://www.kawasakileisurebikes.ph/dealers/motorcycle-dealers/", note: "Official Kawasaki Motors Philippines motorcycle dealer directory.", checkedAt: "2026-09-09" }
];

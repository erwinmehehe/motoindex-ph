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
  { brand: "Kawasaki", href: "https://kawasaki.ph/dealers/motorcycle", note: "Official Kawasaki Motors Philippines motorcycle dealer directory.", checkedAt: "2026-09-09" },
  { brand: "SYM", href: "https://www.sym-global.com/global-distributors", note: "Official SYM global distributor directory. Its Philippines entries identify Mitsukoshi Motors PHIL and Astra Prime Mobility Corporation; this is a distributor source, not a branch-level dealer list.", checkedAt: "2026-09-15" }
];

import type { HelmetProduct } from "./types";

export type VerifiedHelmetSizing = {
  chart: { size: string; headCm: string }[];
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
  note: string;
};

type Chart = Record<string, string>;

const checkedAt = "2026-10-05";

function canonicalSize(size: string) {
  const value = size.trim().toUpperCase();
  if (value === "XXS") return "2XS";
  if (value === "XXXS") return "3XS";
  if (value === "XXL") return "2XL";
  if (value === "XXXL") return "3XL";
  return value;
}

function rowsForProduct(product: HelmetProduct, chart: Chart) {
  return product.sizes.flatMap((size) => {
    const headCm = chart[canonicalSize(size)];
    return headCm ? [{ size, headCm }] : [];
  });
}

const kytChart: Chart = {
  XS: "53-54",
  S: "55-56",
  M: "57-58",
  L: "59-60",
  XL: "61-62",
  "2XL": "63",
};

const ls2AdultChart: Chart = {
  "2XS": "51-52",
  XS: "53-54",
  S: "55-56",
  M: "57-58",
  L: "59-60",
  XL: "61-62",
  "2XL": "63-64",
  "3XL": "65-66",
  "4XL": "67-68",
};

const ls2JuniorChart: Chart = {
  S: "47-48",
  M: "49-50",
  L: "51-52",
};

const agvE2206Chart: Chart = {
  XS: "53-54",
  S: "55-56",
  M: "57-58",
  L: "59-60",
  XL: "61-62",
  "2XL": "63-64",
};

const hjcChart: Chart = {
  "3XS": "50-51",
  "2XS": "52-53",
  XS: "54-55",
  S: "55-56",
  M: "57-58",
  L: "58-59",
  XL: "60-61",
  "2XL": "62-63",
  "3XL": "64-65",
  "4XL": "66-67",
  "5XL": "68-69",
};

const sharkStandardChart: Chart = {
  XS: "53-54",
  S: "55-56",
  M: "57-58",
  L: "59-60",
  XL: "61-62",
  "2XL": "63-64",
};

const sharkSpartanChart: Chart = {
  ...sharkStandardChart,
  "2XL": "63",
};

const ls2JuniorIds = new Set(["ls2-kid", "ls2-funny-ii", "ls2-fast-evo-ii-mini"]);
const agvE2206Ids = new Set(["agv-pista-gp-rr", "agv-k7", "agv-k1-s", "agv-k3", "agv-k6-s"]);

export function getVerifiedHelmetSizing(product: HelmetProduct): VerifiedHelmetSizing | undefined {
  if (!product.sizes.length) return undefined;

  if (product.brandSlug === "kyt") {
    const chart = rowsForProduct(product, kytChart);
    if (!chart.length) return undefined;
    return {
      chart,
      sourceLabel: "KYT Americas helmet size chart",
      sourceUrl: "https://kytamericas.com/pages/kyt-helmet-size-chart",
      checkedAt,
      note: "KYT states that its helmets use the same commercial size scale; the rows shown here are filtered to this model's recorded sizes.",
    };
  }

  if (product.brandSlug === "ls2") {
    const chart = rowsForProduct(product, ls2JuniorIds.has(product.id) ? ls2JuniorChart : ls2AdultChart);
    if (!chart.length) return undefined;
    return {
      chart,
      sourceLabel: "LS2 official helmet user manual and size guide",
      sourceUrl: "https://ls2helmets.com/user-manual",
      checkedAt,
      note: ls2JuniorIds.has(product.id)
        ? "LS2 publishes a separate junior circumference chart; the rows shown here are filtered to this junior model's recorded sizes."
        : "LS2 publishes a brand helmet circumference chart; the rows shown here are filtered to this model's recorded adult sizes.",
    };
  }

  if (product.brandSlug === "agv" && agvE2206Ids.has(product.id)) {
    const chart = rowsForProduct(product, agvE2206Chart);
    if (!chart.length) return undefined;
    return {
      chart,
      sourceLabel: "AGV official E2206 size guide",
      sourceUrl: "https://www.agv.com/im/en/k1-s-speedarmor-matt-black-grey-red---motorbike-full-face-helmet-e2206-2118394017073.html",
      checkedAt,
      note: "AGV groups Pista GP RR, K7, K6 S, K3 and K1 S under this E2206 circumference chart; only this model's recorded sizes are shown.",
    };
  }

  if (product.brandSlug === "hjc") {
    const chart = rowsForProduct(product, hjcChart);
    if (!chart.length) return undefined;
    return {
      chart,
      sourceLabel: "HJC Helmets Europe size chart",
      sourceUrl: "https://hjchelmets.eu/pages/size-chart",
      checkedAt,
      note: "HJC publishes this helmet-size convention chart as a reference and advises trying the helmet on for final fit; only this model's recorded sizes are shown.",
    };
  }

  if (product.brandSlug === "shark") {
    const chart = rowsForProduct(product, /^Spartan GT Pro/i.test(product.model) ? sharkSpartanChart : sharkStandardChart);
    if (!chart.length) return undefined;
    return {
      chart,
      sourceLabel: "Shark Helmets official size guide",
      sourceUrl: "https://www.shark-helmets.com/en/pages/size-guide",
      checkedAt,
      note: "Shark publishes model-group circumference tables; MotoIndex filters the applicable table to the sizes recorded for this exact helmet.",
    };
  }

  return undefined;
}

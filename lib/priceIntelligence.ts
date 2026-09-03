import type { ModelPriceSnapshot, Motorcycle } from "./types";
import { priceChecksForModel } from "./marketChecks";
import { observedMarketRange } from "./marketChecks";

const historicalSnapshots: ModelPriceSnapshot[] = [
  {
    modelId: "honda-pcx-160",
    observedAt: "2025-05-18",
    fromPhp: 133400,
    toPhp: 154900,
    sourceCount: 1,
    sourceLabels: ["Honda Philippines"],
    kind: "launch",
    sourceUrl: "https://www.hondaph.com/motorcycle/news/elevate-your-riding-experience-where-elegance-meets-truly-exceptional-with-the-all-new-pcx160",
    note: "All-New PCX160 launch SRPs: Standard and RoadSync.",
  },
  {
    modelId: "honda-adv-160",
    observedAt: "2026-01-19",
    fromPhp: 167400,
    toPhp: 174900,
    sourceCount: 1,
    sourceLabels: ["Traffic Network PH / Honda Philippines official release"],
    kind: "launch",
    sourceUrl: "https://trafficnetworkph.com/ride-the-suv-pride-the-new-honda-adv160/",
    note: "Honda Philippines official-release coverage reports 2026 ADV160 launch SRPs: ABS and RoadSync.",
  },
];


function baselineSnapshot(model: Motorcycle): ModelPriceSnapshot {
  return {
    modelId: model.id,
    observedAt: model.marketPriceCheckedAt || model.verifiedAt,
    fromPhp: model.srp,
    toPhp: typeof model.marketPriceHighPhp === "number" && model.marketPriceHighPhp > model.srp ? model.marketPriceHighPhp : undefined,
    sourceCount: 1,
    sourceLabels: [model.marketPriceSourceLabel || model.sourceLabel],
    kind: "market",
    sourceUrl: model.marketPriceSourceUrl || model.sourceUrl,
    note: "Baseline model-level Philippine price/spec source. Add independent dealer or comparison checks when verified; MotoIndex does not fabricate source depth.",
  };
}

function currentSnapshotsForModel(modelId: string): ModelPriceSnapshot[] {
  const checks = priceChecksForModel(modelId);
  const byDate = new Map<string, typeof checks>();
  for (const check of checks) {
    const list = byDate.get(check.checkedAt) || [];
    list.push(check);
    byDate.set(check.checkedAt, list);
  }
  return [...byDate.entries()].map(([observedAt, rows]) => {
    const lows = rows.map((row) => row.priceFromPhp);
    const highs = rows.map((row) => row.priceToPhp || row.priceFromPhp);
    const fromPhp = Math.min(...lows);
    const high = Math.max(...highs);
    const sourceLabels = [...new Set(rows.map((row) => row.sourceName))];
    return {
      modelId,
      observedAt,
      fromPhp,
      toPhp: high > fromPhp ? high : undefined,
      sourceCount: sourceLabels.length,
      sourceLabels,
      kind: "market" as const,
      note: "Aggregated from source-dated MotoIndex market checks; source disagreements remain visible on the price page.",
    };
  });
}

export function priceSnapshotsForModel(modelId: string) {
  const items = [
    ...historicalSnapshots.filter((snapshot) => snapshot.modelId === modelId),
    ...currentSnapshotsForModel(modelId),
  ];
  return items
    .filter((item, index, all) => all.findIndex((other) => other.observedAt === item.observedAt && other.kind === item.kind) === index)
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt));
}

export function priceRangeSuggestsVariants(model: Motorcycle) {
  if (typeof model.marketPriceHighPhp === "number" && model.marketPriceHighPhp > model.srp) return true;
  return priceChecksForModel(model.id).some((row) => typeof row.priceToPhp === "number" && row.priceToPhp > row.priceFromPhp);
}

export function modelPriceIntelligence(model: Motorcycle) {
  const checks = priceChecksForModel(model.id);
  const storedSnapshots = priceSnapshotsForModel(model.id);
  const snapshots = storedSnapshots.length ? storedSnapshots : [baselineSnapshot(model)];
  const range = observedMarketRange(model);
  const uniqueSources = [...new Set([model.marketPriceSourceLabel || model.sourceLabel, ...checks.map((row) => row.sourceName)])];
  const spreadPhp = (range.to || range.from) - range.from;
  const first = snapshots[0];
  const latest = snapshots[snapshots.length - 1];
  const previous = snapshots.length > 1 ? snapshots[snapshots.length - 2] : undefined;
  const lowDeltaPhp = previous && latest ? latest.fromPhp - previous.fromPhp : undefined;
  return {
    sourceCount: uniqueSources.length,
    range,
    spreadPhp,
    snapshots,
    firstObservedAt: first?.observedAt,
    latestObservedAt: latest?.observedAt,
    lowDeltaPhp,
    historyReady: snapshots.length >= 2,
  };
}

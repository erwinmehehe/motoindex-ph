import type { Motorcycle } from "./types";
import { priceChecksForModel } from "./marketChecks";
import { getRenderableMedia } from "./media";
import { maintenanceForModel } from "./maintenance";
import { safetyResourceForModel } from "./safety";

export type ModelUpdate = { date: string; label: string; detail: string; sourceUrl?: string };

export function modelUpdates(model: Motorcycle): ModelUpdate[] {
  const updates: ModelUpdate[] = [
    { date: model.verifiedAt, label: "Specifications", detail: model.sourceLabel, sourceUrl: model.sourceUrl },
  ];
  const checks = priceChecksForModel(model.id).sort((a,b)=>b.checkedAt.localeCompare(a.checkedAt));
  if (checks[0]) updates.push({ date: checks[0].checkedAt, label: "Market price checked", detail: `${checks.length} current source${checks.length===1?"":"s"} stored; latest ${checks[0].sourceName}.`, sourceUrl: checks[0].sourceUrl });
  const media = getRenderableMedia("motorcycle", model.id).sort((a,b)=>(b.lastChecked||"").localeCompare(a.lastChecked||""));
  if (media[0]?.lastChecked) updates.push({ date: media[0].lastChecked, label: "Image", detail: media[0].sourceLabel || `Image source: ${media[0].rightsHolder}`, sourceUrl: media[0].sourceUrl });
  const maintenance = maintenanceForModel(model.id);
  if (maintenance) updates.push({ date: maintenance.lastChecked, label: "Maintenance schedule parsed", detail: maintenance.sourceLabel, sourceUrl: maintenance.sourceUrl });
  const safety = safetyResourceForModel(model);
  if (safety) updates.push({ date: safety.lastChecked, label: "Safety campaign", detail: safety.label, sourceUrl: safety.url });
  return updates.sort((a,b)=>b.date.localeCompare(a.date));
}

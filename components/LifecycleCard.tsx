import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { lifecycleCopy, lifecycleLabel, lifecycleTone } from "@/lib/lifecycle";
import { getModelById } from "@/lib/data";
import { modelFamilies } from "@/lib/families";

export function LifecycleCard({ model }: { model: Motorcycle }) {
  const successor=model.successorId?getModelById(model.successorId):undefined;
  const family=modelFamilies.find(f=>f.generationIds.includes(model.id));
  return <div className="lifecycle-card">
    <div><h2>{lifecycleLabel(model)}</h2><p>{lifecycleCopy(model)}</p></div>
    <div className="lifecycle-meta"><span className={`catalog-status ${lifecycleTone(model)==="verified"?"verified":""}`}>{model.generation}</span><small>Checked {model.verifiedAt}</small>{family&&<Link href={`/motorcycles/${family.makeSlug}/${family.slug}`}>Compare {family.name} generations →</Link>}{successor&&<Link href={`/motorcycles/${successor.makeSlug}/${successor.slug}`}>Current successor: {successor.model} →</Link>}</div>
  </div>;
}

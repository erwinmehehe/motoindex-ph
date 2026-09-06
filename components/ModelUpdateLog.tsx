import type { Motorcycle } from "@/lib/types";
import { modelUpdates } from "@/lib/modelUpdates";
import { SourceRef } from "@/components/SourceRef";

export function ModelUpdateLog({model}:{model:Motorcycle}){const updates=modelUpdates(model);return <section className="model-updates"><div className="section-head compact"><div><h2>Dates and sources for this page</h2><p>Recent checks for prices, specifications and model updates.</p></div></div><div className="update-list">{updates.map((u,i)=><article key={`${u.date}-${u.label}-${i}`}><time>{u.date}</time><div><strong>{u.label}</strong><p>{u.detail}</p>{u.sourceUrl&&<SourceRef url={u.sourceUrl} label="Open source" />}</div></article>)}</div></section>}

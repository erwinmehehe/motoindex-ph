import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { safetyNoticesForModel, safetyResourceForModel } from "@/lib/safety";

export function SafetySummary({ model }: { model: Motorcycle }) {
  const resource=safetyResourceForModel(model);
  const notices=safetyNoticesForModel(model.id);
  return <div className="safety-summary"><div><h2>{notices.length?`${notices.length} official notice${notices.length===1?"":"s"} listed`:resource?"Official campaign-check link":"Official campaign link not available yet"}</h2><p>{notices.length?notices[0].summary:"An empty notice list does not prove that no recall or service campaign applies. Check by frame/VIN when the manufacturer supports it."}</p></div><Link className="text-link" href={`/motorcycles/${model.makeSlug}/${model.slug}#safety`}>Check safety resources →</Link></div>;
}

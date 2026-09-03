import Link from "next/link";
import type { Motorcycle } from "@/lib/types";
import { maintenanceForModel, serviceResourceForModel } from "@/lib/maintenance";

export function MaintenanceSummary({ model }: { model: Motorcycle }) {
  const schedule=maintenanceForModel(model.id);
  const resource=serviceResourceForModel(model);
  return <div className="maintenance-summary">
    <div><h2>{schedule?"Owner-manual intervals available":"Official service information"}</h2><p>{schedule?`${schedule.items.length} maintenance items are listed from an official owner manual.`:resource?"The manufacturer's Philippine service page is linked, but an exact model schedule is not listed here yet.":"No official service page is linked for this brand yet."}</p></div>
    <div>{schedule&&<Link className="button small" href={`/motorcycles/${model.makeSlug}/${model.slug}#maintenance`}>View schedule</Link>}{!schedule&&resource&&<a className="button small" href={resource.url} target="_blank" rel="noreferrer">Official service resource ↗</a>}</div>
  </div>;
}

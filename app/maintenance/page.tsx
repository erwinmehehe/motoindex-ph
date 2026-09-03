import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";
import { maintenanceSchedules, brandServiceResources } from "@/lib/maintenance";
import { getModelById } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Maintenance & Parts Guide Philippines",
  description: "Motorcycle battery, oil, coolant, CVT, sprocket and parts guides plus model-specific maintenance schedules from official sources.",
  path: "/maintenance",
  index: true,
});

export default function MaintenanceSeoHub() {
  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Maintenance" }]} />
    <div className="page-head">
      <h1>Motorcycle maintenance and parts guides</h1>
      <p>Understand common service items first, then open the exact motorcycle schedule or manufacturer resource before buying parts or setting an interval.</p>
    </div>

    <div className="topic-grid ownership-guide-grid">
      {maintenanceSeoTopics.map(topic => <Link className="ownership-guide-card" href={`/maintenance/${topic.slug}`} key={topic.slug}>
        <h2>{topic.title}</h2>
        <p>{topic.description}</p>
        <small className="verified-pill">Sources checked {topic.lastChecked}</small>
      </Link>)}
    </div>

    <div className="section-head compact"><div><h2>Exact owner-manual schedules currently available</h2><p>These pages publish specific intervals only where MotoIndex has parsed a source for the exact motorcycle.</p></div></div>
    <div className="list-cards">
      {maintenanceSchedules.map(schedule => {
        const model = getModelById(schedule.modelId);
        return model ? <Link href={`/motorcycles/${model.makeSlug}/${model.slug}#maintenance`} key={schedule.modelId}>
          <span><strong>{model.make} {model.model} maintenance</strong><small>{schedule.items.length} manual-derived service items · checked {schedule.lastChecked}</small></span><b>Open schedule →</b>
        </Link> : null;
      })}
    </div>

    <div className="section-head compact"><div><h2>Official manufacturer maintenance resources</h2><p>Use these when MotoIndex does not yet have a model-specific interval table.</p></div></div>
    <div className="source-ladder">
      {brandServiceResources.map(resource => <article key={resource.makeSlug}><span>{resource.makeSlug}</span><div><h2>{resource.label}</h2><small>Checked {resource.lastChecked}</small></div><div><p>{resource.description}</p><a className="text-link" href={resource.url} target="_blank" rel="noreferrer">Open official resource ↗</a></div></article>)}
    </div>
  </section>;
}

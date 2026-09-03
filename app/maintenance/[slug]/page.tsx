import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { getMaintenanceSeoTopic, maintenanceSeoTopics } from "@/lib/maintenanceSeo";
import { maintenanceSchedules } from "@/lib/maintenance";
import { getModelById } from "@/lib/data";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return maintenanceSeoTopics.map(topic => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getMaintenanceSeoTopic(slug);
  if (!topic) return {};
  return pageMetadata({ title: topic.title, description: topic.description, path: `/maintenance/${topic.slug}`, index: true });
}

export default async function MaintenanceSeoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getMaintenanceSeoTopic(slug);
  if (!topic) return notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.description,
    dateModified: topic.lastChecked,
    author: { "@type": "Organization", name: "MotoIndex PH" },
  };

  return <section className="page shell trust-page">
    <Breadcrumbs items={[{ label: "Maintenance", href: "/maintenance" }, { label: topic.title }]} />
    <div className="page-head">
      <h1>{topic.title}</h1>
      <p>{topic.description}</p>
      <small className="source-date">Sources checked {topic.lastChecked}</small>
    </div>

    <div className="note-box">
      <h2>Use the exact motorcycle specification before buying or servicing</h2>
      <p>This guide explains the system and the checks that matter. Fluid grade, part number, service interval, capacity, torque and fitment must come from the exact motorcycle's current owner manual or manufacturer service information.</p>
    </div>

    <div className="method-steps ownership-guide-sections">
      {topic.sections.map((section, index) => <article key={section.heading}>
        <b>{String(index + 1).padStart(2, "0")}</b>
        <h2>{section.heading}</h2>
        <p>{section.body}</p>
        {section.bullets && <ul className="checklist">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
      </article>)}
    </div>

    <div className="section-head compact"><div><h2>Model-specific maintenance schedules</h2><p>Open an exact schedule where MotoIndex has parsed the owner-manual evidence.</p></div></div>
    <div className="list-cards">
      {maintenanceSchedules.map(schedule => {
        const model = getModelById(schedule.modelId);
        return model ? <Link href={`/motorcycles/${model.makeSlug}/${model.slug}#maintenance`} key={schedule.modelId}><span><strong>{model.make} {model.model}</strong><small>{schedule.items.length} manual-derived items</small></span><b>Open →</b></Link> : null;
      })}
      <Link href="/ownership/maintenance"><span><strong>All maintenance resources</strong><small>Official brand planners and service links</small></span><b>Browse →</b></Link>
    </div>

    <div className="section-head compact"><div><h2>Sources used for this guide</h2><p>These are manufacturer resources, not marketplace listings or generic interval charts.</p></div></div>
    <div className="source-ladder">
      {topic.sources.map(source => <article key={source.url}><span>{source.publisher}</span><h2>{source.label}</h2><div><a className="text-link" href={source.url} target="_blank" rel="noreferrer">Open official source ↗</a><small>Checked {source.checkedAt}</small></div></article>)}
    </div>

    <FaqSection title={`${topic.primaryKeyword} questions`} items={topic.faqs} />
    <JsonLd data={schema} />
  </section>;
}

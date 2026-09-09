import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";
import { maintenanceSchedules, brandServiceResources } from "@/lib/maintenance";
import { getModelById } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { articleSchema } from "@/lib/articleSchema";

export const metadata: Metadata = pageMetadata({
  title: "Motorcycle Maintenance Guide Philippines: Oil, CVT, Battery & Parts",
  description: "One motorcycle maintenance guide covering oil, coolant, batteries, CVT, sprockets, parts and model-specific service schedules from official sources.",
  path: "/maintenance",
  index: true,
});

export default function MaintenanceGuidePage() {
  const faqs: FaqItem[] = [
    {question:"How often should I change motorcycle oil?",answer:"Use the interval and oil specification for the exact motorcycle in its owner manual or manufacturer maintenance source. Riding conditions, oil type and model design can change the required interval."},
    {question:"Can I use any coolant in a motorcycle?",answer:"No. Use the coolant type and specification required by the motorcycle manufacturer. Mixing incompatible coolant types or using the wrong concentration can create cooling-system problems."},
    {question:"When should a motorcycle battery be replaced?",answer:"Replace a battery based on condition and testing rather than age alone. Slow cranking, repeated charging problems, low measured voltage or a failed load test are stronger reasons to investigate replacement."},
    {question:"When should I service a scooter CVT?",answer:"Use the exact manufacturer's maintenance schedule for belt inspection or replacement, rollers, clutch and CVT cleaning. Intervals are not universal across scooter models."},
    {question:"Can I change motorcycle sprocket sizes?",answer:"Changing sprocket tooth counts changes final gearing and can affect acceleration, cruising rpm, chain length, clearance and speedometer behavior. Check model-specific fitment and the effect before changing from stock."}
  ];

  const schema=articleSchema({
    headline:"Motorcycle maintenance guide for the Philippines",
    description:"One maintenance reference covering motorcycle parts, batteries, coolant, sprockets, oil, CVT systems and exact model service schedules.",
    path:"/maintenance",
    about:"motorcycle maintenance Philippines",
    keywords:["motorcycle maintenance","motorcycle oil","motorcycle battery","motorcycle coolant","motorcycle CVT","motorcycle sprocket"],
    checkedDates:[...maintenanceSeoTopics.map(t=>t.lastChecked),...maintenanceSchedules.map(s=>s.lastChecked),...brandServiceResources.map(r=>r.lastChecked)]
  });

  return <section className="page shell maintenance-master-page">
    <Breadcrumbs items={[{ label: "Maintenance" }]} />
    <div className="page-head">
      <span className="entity-kicker">Motorcycle maintenance reference</span>
      <h1>Motorcycle maintenance: oil, coolant, CVT, battery and parts</h1>
      <p>Use one guide for the common systems, then use the exact motorcycle page or manufacturer manual for the service interval, fluid grade, capacity, torque value and part number. Generic maintenance advice should never override model-specific instructions.</p>
    </div>

    <nav className="product-entity-nav maintenance-master-nav" aria-label="Maintenance guide sections">
      {maintenanceSeoTopics.map(topic=><a href={`#${topic.slug}`} key={topic.slug}>{topic.primaryKeyword}</a>)}
      <a href="#model-schedules">Model schedules</a>
      <a href="#official-resources">Official resources</a>
    </nav>

    <div className="note-box">
      <h2>Use the exact motorcycle specification before servicing</h2>
      <p>Oil grade, coolant, battery size, CVT parts, chain and sprocket fitment, service intervals and torque values can differ between models and generations. Open the exact motorcycle page when a model-specific schedule is available.</p>
    </div>

    {maintenanceSeoTopics.map(topic=><section id={topic.slug} className="maintenance-master-section" key={topic.slug}>
      <div className="section-head compact"><div><span className="section-kicker">{topic.primaryKeyword}</span><h2>{topic.title}</h2><p>{topic.description}</p></div></div>
      <div className="method-steps ownership-guide-sections">
        {topic.sections.map((section,index)=><article key={section.heading}>
          <b>{String(index+1).padStart(2,"0")}</b>
          <h3>{section.heading}</h3>
          <p>{section.body}</p>
          {section.bullets&&<ul className="checklist">{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
        </article>)}
      </div>
      <details className="maintenance-source-details">
        <summary>Sources for this section</summary>
        <div className="source-ladder">{topic.sources.map(source=><article key={source.url}><span>{source.publisher}</span><h3>{source.label}</h3><div><a className="text-link" href={source.url} target="_blank" rel="noreferrer">Open official source ↗</a><small>Checked {source.checkedAt}</small></div></article>)}</div>
      </details>
    </section>)}

    <section id="model-schedules" className="maintenance-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Exact motorcycles</span><h2>Model-specific maintenance schedules</h2><p>These links open the maintenance section on the canonical motorcycle page where owner-manual evidence has been parsed for that exact model.</p></div></div>
      <div className="list-cards">
        {maintenanceSchedules.map(schedule=>{
          const model=getModelById(schedule.modelId);
          return model?<Link href={`/motorcycles/${model.makeSlug}/${model.slug}#maintenance`} key={schedule.modelId}><span><strong>{model.make} {model.model}</strong><small>{schedule.items.length} manual-derived service items · checked {schedule.lastChecked}</small></span><b>Open schedule →</b></Link>:null;
        })}
      </div>
    </section>

    <section id="official-resources" className="maintenance-master-section">
      <div className="section-head compact"><div><span className="section-kicker">Manufacturer support</span><h2>Official maintenance resources</h2><p>Use the manufacturer resource when an exact model schedule is not yet available on MotoIndex.</p></div></div>
      <div className="source-ladder">{brandServiceResources.map(resource=><article key={resource.makeSlug}><span>{resource.makeSlug}</span><div><h3>{resource.label}</h3><small>Checked {resource.lastChecked}</small></div><div><p>{resource.description}</p><a className="text-link" href={resource.url} target="_blank" rel="noreferrer">Open official resource ↗</a></div></article>)}</div>
    </section>

    <JsonLd data={schema}/>
    <FaqSection title="Motorcycle maintenance questions" items={faqs}/>
    <AuthorBox/>
  </section>;
}

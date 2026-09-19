import type { Metadata } from "next";
import Link from "next/link";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBox } from "@/components/AuthorBox";
import { maintenanceSeoTopics } from "@/lib/maintenanceSeo";
import { maintenanceSchedules, brandServiceResources } from "@/lib/maintenance";
import { getModelById } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
import { articleSchema } from "@/lib/articleSchema";
import { CTAGroup, InfoPanel, PageHero, SectionHeader, StatRow } from "@/components/ui";
import styles from "../styles/hub-index.module.css";

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
    <PageHero
      kicker="Motorcycle maintenance reference"
      title="Motorcycle maintenance: oil, coolant, CVT, battery and parts"
      description="Use the common-system guidance here, then check the exact motorcycle or manufacturer source for service intervals, fluid grade, capacity, torque values and part numbers."
      actions={<CTAGroup><a className="button" href="#model-schedules">Find model schedules</a><a className="button secondary" href="#official-resources">Official resources</a></CTAGroup>}
    />

    <StatRow items={[
      {label:"Maintenance topics",value:String(maintenanceSeoTopics.length),note:"Oil, coolant, battery, CVT and parts"},
      {label:"Model schedules",value:String(maintenanceSchedules.length),note:"Owner-manual-derived records"},
      {label:"Official resources",value:String(brandServiceResources.length),note:"Manufacturer support sources"}
    ]}/>

    <nav className="product-entity-nav maintenance-master-nav" aria-label="Maintenance guide sections">
      {maintenanceSeoTopics.map(topic=><a href={`#${topic.slug}`} key={topic.slug}>{topic.primaryKeyword}</a>)}
      <a href="#model-schedules">Model schedules</a>
      <a href="#official-resources">Official resources</a>
    </nav>

    <InfoPanel subtle>
      <h3>Use the exact motorcycle specification before servicing</h3>
      <p>Oil grade, coolant, battery size, CVT parts, chain and sprocket fitment, service intervals and torque values can differ between models and generations. Generic maintenance guidance should never override the exact owner manual.</p>
    </InfoPanel>

    {maintenanceSeoTopics.map(topic=><section id={topic.slug} className={styles.section} key={topic.slug} data-maintenance-topic>
      <SectionHeader kicker={topic.primaryKeyword} title={topic.title} description={topic.description} />
      <div className={styles.detailList}>
        {topic.sections.map((section,index)=><details className={styles.detailRow} key={section.heading} open={index===0} data-maintenance-detail>
          <summary>
            <span className={styles.detailIndex}>{String(index+1).padStart(2,"0")}</span>
            <span className={styles.detailTitle}>{section.heading}</span>
            <span className={styles.detailToggle}>Open</span>
          </summary>
          <div className={styles.detailBody}>
            <p>{section.body}</p>
            {section.bullets&&<ul>{section.bullets.map(item=><li key={item}>{item}</li>)}</ul>}
          </div>
        </details>)}
      </div>
      <details className={styles.compactDetails}>
        <summary><span>Sources for this section</span><span>{topic.sources.length} source{topic.sources.length===1?"":"s"}</span></summary>
        <div className={styles.sourceLinks}>
          {topic.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">
            <span><strong>{source.label}</strong><small>{source.publisher} · checked {source.checkedAt}</small></span>
            <b>Open ↗</b>
          </a>)}
        </div>
      </details>
    </section>)}

    <section id="model-schedules" className={styles.section}>
      <SectionHeader
        kicker="Exact motorcycles"
        title="Model-specific maintenance schedules"
        description="Open the canonical motorcycle page where owner-manual evidence has been parsed for that exact model."
      />
      <div className={styles.decisionList} data-maintenance-schedule-list>
        {maintenanceSchedules.map(schedule=>{
          const model=getModelById(schedule.modelId);
          return model?<Link className={styles.decisionRow} href={`/motorcycles/${model.makeSlug}/${model.slug}#maintenance`} key={schedule.modelId}>
            <span className={styles.decisionLabel}>{model.make}</span>
            <span className={styles.decisionCopy}><h3>{model.model}</h3><p>{schedule.items.length} manual-derived service items · checked {schedule.lastChecked}</p></span>
            <span className={styles.decisionMeta}>Open schedule →</span>
          </Link>:null;
        })}
      </div>
    </section>

    <section id="official-resources" className={styles.section}>
      <SectionHeader
        kicker="Manufacturer support"
        title="Official maintenance resources"
        description="Use the manufacturer resource when an exact model schedule is not yet available on MotoIndex."
      />
      <div className={styles.decisionList} data-maintenance-resource-list>
        {brandServiceResources.map(resource=><a className={styles.decisionRow} key={resource.makeSlug} href={resource.url} target="_blank" rel="noreferrer">
          <span className={styles.decisionLabel}>{resource.makeSlug}</span>
          <span className={styles.decisionCopy}><h3>{resource.label}</h3><p>{resource.description}</p></span>
          <span className={styles.decisionMeta}>Checked {resource.lastChecked} ↗</span>
        </a>)}
      </div>
    </section>

    <JsonLd data={schema}/>
    <FaqSection title="Motorcycle maintenance questions" items={faqs}/>
    <AuthorBox/>
  </section>;
}

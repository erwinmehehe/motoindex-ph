import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { articleSchema } from "@/lib/articleSchema";
import type { AccessorySeoGuide } from "@/lib/accessorySeo";

export function AccessorySeoGuideContent({ guide }: { guide: AccessorySeoGuide }) {
  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/accessories/${guide.slug}`,
    about: guide.title,
    keywords: [guide.seoTitle, "motorcycle accessories Philippines"],
    checkedDates: [guide.checkedAt]
  });

  return <>
    {guide.sections.map((section) => <section className="split section" key={section.heading}>
      <div><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {section.bullets && <div className="info-card"><h3>Before buying</h3><ul className="checklist">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div>}
    </section>)}
    <FaqSection title={`${guide.title.replace(" in the Philippines", "")} questions`} items={guide.faqs} />
    <RelatedLinks title="Related motorcycle gear research" links={guide.related} />
    <JsonLd data={schema} />
  </>;
}

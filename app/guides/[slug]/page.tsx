import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { SourceRef } from "@/components/SourceRef";
import { articleSchema } from "@/lib/articleSchema";
import { editorialGuides, getEditorialGuide } from "@/lib/editorialGuides";
import { pageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return editorialGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEditorialGuide(slug);
  if (!guide) return {};
  return pageMetadata({ title: guide.seoTitle, description: guide.description, path: `/guides/${guide.slug}`, index: true });
}

export default async function EditorialGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getEditorialGuide(slug);
  if (!guide) return notFound();
  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    about: guide.title,
    keywords: [guide.seoTitle, "motorcycle guide Philippines"],
    checkedDates: [guide.lastChecked]
  });

  return <section className="page shell">
    <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
    <div className="page-head"><span className="section-kicker">{guide.kicker}</span><h1>{guide.title}</h1><p>{guide.intro}</p><small>Source check: {guide.lastChecked}</small></div>
    {guide.sections.map((section) => <section className="split section" key={section.heading}><div><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{section.bullets && <div className="info-card"><h3>Quick check</h3><ul className="checklist">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div>}</section>)}
    <section className="section"><div className="section-head compact"><div><h2>Sources used for this guide</h2><p>Open the original manufacturer or Philippine government source when you need to verify a current requirement or fit instruction.</p></div></div><div className="checked-record-list">{guide.sources.map((source) => <div key={source.url}><span><strong>{source.label}</strong><small>Checked {guide.lastChecked}</small></span><span className="checked-record-action"><SourceRef url={source.url} label="Open source" /></span></div>)}</div></section>
    <FaqSection title="Frequently asked questions" items={guide.faqs} />
    <RelatedLinks title="Continue your research" links={guide.related} />
    <JsonLd data={schema} />
  </section>;
}

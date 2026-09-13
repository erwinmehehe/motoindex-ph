import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { SourceRef } from "@/components/SourceRef";
import { articleSchema } from "@/lib/articleSchema";
import { editorialGuides, getEditorialGuide } from "@/lib/editorialGuides";
import { getEditorialGuideMedia } from "@/lib/editorialGuideMedia";
import { pageMetadata } from "@/lib/site";

const DEFAULT_GUIDE_IMAGE = "/brand/motoindex-og.png";

const guideResearchLinks = [
  { href: "/gear/helmets/finder", title: "Find helmets by fit and budget", description: "Use the Helmet Finder after checking size and certification." },
  { href: "/gear/helmets", title: "Browse checked helmet models", description: "Move from general guidance to model-level size and certification records." },
  { href: "/methodology", title: "See how MotoIndex verifies claims", description: "Review the source, freshness and correction rules behind the research." }
];

function readableDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function generateStaticParams() {
  return editorialGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getEditorialGuide(slug);
  if (!guide) return {};
  const guideMedia = getEditorialGuideMedia(guide.slug);
  return pageMetadata({
    title: guide.seoTitle,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    index: true,
    image: guideMedia?.image ?? DEFAULT_GUIDE_IMAGE
  });
}

export default async function EditorialGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getEditorialGuide(slug);
  if (!guide) return notFound();
  const guideMedia = getEditorialGuideMedia(guide.slug);
  const schemaImage = guideMedia?.image ?? DEFAULT_GUIDE_IMAGE;
  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    about: guide.title,
    keywords: [guide.seoTitle, "motorcycle guide Philippines"],
    datePublished: guideMedia?.publishedAt,
    checkedDates: [guide.lastChecked],
    image: schemaImage
  });
  const quickSteps = guide.sections.find((section) => section.bullets)?.bullets?.slice(0, 4) ?? [];

  return <article className="page shell">
    <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
    <header className="page-head">
      <span className="section-kicker">{guide.kicker}</span>
      <h1>{guide.title}</h1>
      <p>{guide.intro}</p>
      <p className="article-meta">
        {guideMedia?.publishedAt && <>Published <time dateTime={guideMedia.publishedAt}>{readableDate(guideMedia.publishedAt)}</time> · </>}
        Last source check <time dateTime={guide.lastChecked}>{readableDate(guide.lastChecked)}</time>
      </p>
    </header>

    {guideMedia && <figure className="info-card guide-hero-media">
      <Image src={guideMedia.image} alt={guideMedia.alt} width={1200} height={630} priority sizes="(max-width: 900px) 100vw, 1120px" />
      <figcaption><small>{guideMedia.caption}</small></figcaption>
    </figure>}

    <section className="split section" aria-labelledby="guide-at-a-glance">
      <div>
        <span className="section-kicker">At a glance</span>
        <h2 id="guide-at-a-glance">Use the guide as a verification checklist</h2>
        <p>Start with the buyer decision, then confirm the exact helmet model and the current source before purchasing. MotoIndex keeps the source links beside the guidance so changing fit or compliance details can be checked directly.</p>
      </div>
      <div className="info-card">
        <h3>Quick verification path</h3>
        <ul className="checklist">{quickSteps.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>

    {guide.sections.map((section) => <section className="split section" key={section.heading}>
      <div><h2>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      {section.bullets && <div className="info-card"><h3>Quick check</h3><ul className="checklist">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div>}
    </section>)}

    <section className="section" aria-labelledby="guide-research-tools">
      <div className="section-head compact"><div><h2 id="guide-research-tools">Put this guide to work</h2><p>Continue from general guidance into model-level research without creating another thin search page.</p></div></div>
      <div className="guide-strip">{guideResearchLinks.map((item) => <Link href={item.href} key={item.href}><strong>{item.title}</strong><small>{item.description}</small></Link>)}</div>
    </section>

    <section className="section">
      <div className="section-head compact"><div><h2>Sources used for this guide</h2><p>Open the original manufacturer or Philippine government source when you need to verify a current requirement or fit instruction.</p></div></div>
      <div className="checked-record-list">{guide.sources.map((source) => <div key={source.url}><span><strong>{source.label}</strong><small>Checked {readableDate(guide.lastChecked)}</small></span><span className="checked-record-action"><SourceRef url={source.url} label="Open source" /></span></div>)}</div>
    </section>
    <FaqSection title="Frequently asked questions" items={guide.faqs} />
    <AuthorBox />
    <RelatedLinks title="Continue your research" links={guide.related} />
    <JsonLd data={schema} />
  </article>;
}

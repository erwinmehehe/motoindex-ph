import type { Metadata } from "next";
import { Fragment } from "react";
import { connection } from "next/server";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBox } from "@/components/AuthorBox";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSection } from "@/components/FaqSection";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { GuideInContentAd } from "@/components/GuideInContentAd";
import { AdSense } from "@/components/AdSense";
import { adsenseEnabled } from "@/lib/adsense";
import { QuickAnswer } from "@/components/QuickAnswer";
import { ArticleJumpLinks, articleSectionId } from "@/components/ArticleJumpLinks";
import { JsonLd } from "@/components/JsonLd";
import { RelatedLinks } from "@/components/RelatedLinks";
import { SourceRef } from "@/components/SourceRef";
import { articleSchema } from "@/lib/articleSchema";
import { editorialGuides, getEditorialGuide } from "@/lib/editorialGuides";
import { getEditorialGuideMedia } from "@/lib/editorialGuideMedia";
import { pageMetadata } from "@/lib/site";
import { editorialLeadQuestions, leadQuestion } from "@/lib/aeoContent";
import { faqPageSchema } from "@/lib/structuredData";
import { transportGuides2026 } from "@/lib/transportGuides2026";
import { transitStationGuide, transitStationListSchema } from "@/lib/transitStationGuides2026";
import { TransitStationTable } from "@/components/TransitStationTable";
import { LtoPracticeQuiz } from "@/components/LtoPracticeQuiz";

const DEFAULT_GUIDE_IMAGE = "/brand/motoindex-og.png";

const helmetResearchLinks = [
  { href: "/gear/helmets/finder", title: "Find helmets by fit and budget", description: "Use the Helmet Finder after checking size and certification." },
  { href: "/gear/helmets", title: "Browse checked helmet models", description: "Move from general guidance to model-level size and certification records." },
  { href: "/methodology", title: "See how MotoIndex verifies claims", description: "Review the source, freshness and correction rules behind the research." }
];

const motorcycleResearchLinks = [
  { href: "/motorcycles", title: "Browse motorcycle research", description: "Move from a broad guide into current model, price and specification records." },
  { href: "/recommendations", title: "Compare buying guides", description: "Narrow the market by budget, category, engine class, fit or use case." },
  { href: "/methodology", title: "See how MotoIndex verifies claims", description: "Review the source, freshness and correction rules behind the research." }
];

const electricResearchLinks = [
  { href: "/motorcycles/electric", title: "Browse electric motorcycle research", description: "Compare current electric mobility research, model context and ownership considerations." },
  { href: "/tools/electric-motorcycle-charging-cost", title: "Estimate charging cost", description: "Model electricity cost using your own charging assumptions." },
  { href: "/methodology", title: "See how MotoIndex verifies claims", description: "Review the source, freshness and correction rules behind the research." }
];

const roadResearchLinks = [
  { href: "/guides/autosweep-rfid-installation-philippines", title: "Install Autosweep RFID", description: "Prepare for SLEX and Skyway RFID installation through authorized sites." },
  { href: "/guides/easytrip-rfid-balance-check", title: "Check Easytrip balance", description: "Use operator-approved RFID balance and reload channels." },
  { href: "/motorcycles/expressway-legal", title: "Motorcycle expressway access", description: "Check 400cc+ eligibility with source-backed guidance." }
];
const railResearchLinks = [
  { href: "/guides/mrt-3-stations-philippines", title: "MRT-3 stations", description: "All 13 North Avenue–Taft stops and transfers." },
  { href: "/guides/lrt-2-stations-philippines", title: "LRT-2 stations", description: "All 13 Recto–Antipolo stops and transfers." },
  { href: "/commute", title: "Plan your commute", description: "Compare everyday travel choices and costs." }
];
const licensingResearchLinks = [
  { href: "/guides/lto-student-permit-requirements-philippines", title: "Student permit requirements", description: "Check TDC, medical and identification documents." },
  { href: "/guides/lto-exam-reviewer-philippines", title: "LTO theory practice", description: "Try original road-rule scenarios and review official learning materials." },
  { href: "/ownership/dl-code-b-motorcycle-philippines", title: "Motorcycle license code", description: "Understand the correct DL Code A entitlement." }
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
  // Only ad-bearing guides get dynamic, nonce-protected HTML. Ordinary builds
  // continue using the existing static guide route behavior.
  let adNonce: string | undefined;
  if (adsenseEnabled()) {
    await connection();
    adNonce = (await headers()).get("x-nonce") || undefined;
  }
  const guideMedia = getEditorialGuideMedia(guide.slug);
  const schemaImage = guideMedia?.image ?? DEFAULT_GUIDE_IMAGE;
  const transportGuide = transportGuides2026.some((item) => item.slug === guide.slug);
  const stationGuide = transitStationGuide(guide.slug);
  const stationSchema = transitStationListSchema(guide.slug);
  const guideResearchLinks = stationGuide
    ? railResearchLinks
    : /autosweep-rfid|easytrip-rfid/i.test(guide.slug)
      ? roadResearchLinks
      : /lto-exam|lto-student/i.test(guide.slug)
        ? licensingResearchLinks
        : /helmet/i.test(guide.slug)
          ? helmetResearchLinks
          : /nwow|electric|e-bike/i.test(guide.slug)
            ? electricResearchLinks
            : motorcycleResearchLinks;
  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    about: guide.title,
    keywords: [guide.seoTitle, transportGuide ? "Philippines transport and commuting guide" : "motorcycle guide Philippines"],
    datePublished: guideMedia?.publishedAt,
    checkedDates: [guide.lastChecked],
    image: schemaImage
  });
  const quickSteps = guide.sections.find((section) => section.bullets)?.bullets?.slice(0, 4) ?? [];

  return <article className="page shell">
    <AdSense nonce={adNonce} />
    <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
    <header className="page-head">
      <span className="section-kicker">{guide.kicker}</span>
      <h1>{guide.title}</h1>
      <p className="article-meta">
        {guideMedia?.publishedAt && <>Published <time dateTime={guideMedia.publishedAt}>{readableDate(guideMedia.publishedAt)}</time> · </>}
        Last source check <time dateTime={guide.lastChecked}>{readableDate(guide.lastChecked)}</time>
      </p>
    </header>

    <QuickAnswer question={leadQuestion(guide.slug, editorialLeadQuestions, guide.title)} answer={guide.intro} checkedAt={guide.lastChecked} />

    {stationGuide && <TransitStationTable guide={stationGuide} />}

    <figure className="info-card guide-hero-media">
      <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} />
      {guideMedia?.caption && <figcaption><small>{guideMedia.caption}</small></figcaption>}
    </figure>

    <section className="split section" aria-labelledby="guide-at-a-glance">
      <div>
        <span className="section-kicker">At a glance</span>
        <h2 id="guide-at-a-glance">{transportGuide ? "Verify the latest operator or government instructions" : "Use the guide as a verification checklist"}</h2>
        <p>{transportGuide ? "Start with the direct answer, then check the official agency or operator before making a payment, applying for a permit or planning a trip. Service rules, costs and schedules can change." : "Start with the buyer decision, then confirm the exact model, product or rule against the current source before acting. MotoIndex keeps source links beside the guidance so changing prices, specifications, availability and requirements can be checked directly."}</p>
      </div>
      <div className="info-card">
        <h3>{transportGuide ? "Before you act" : "Quick verification path"}</h3>
        <ul className="checklist">{quickSteps.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </section>

    <ArticleJumpLinks sections={guide.sections} />

    {guide.sections.map((section, index) => <Fragment key={section.heading}>
      <section className="split section">
        <div><h2 id={articleSectionId(section.heading, index)}>{section.heading}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.bullets && <div className="info-card"><h3>Quick check</h3><ul className="checklist">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      </section>
      {index === 1 && guide.slug === "lto-exam-reviewer-philippines" && <LtoPracticeQuiz />}
      {index === 1 && <GuideInContentAd nonceReady={Boolean(adNonce)} />}
    </Fragment>)}

    <section className="section" aria-labelledby="guide-research-tools">
      <div className="section-head compact"><div><h2 id="guide-research-tools">Put this guide to work</h2><p>Continue from general guidance into model-level research, comparison and verification without creating another thin search page.</p></div></div>
      <div className="guide-strip">{guideResearchLinks.map((item) => <Link href={item.href} key={item.href}><strong>{item.title}</strong><small>{item.description}</small></Link>)}</div>
    </section>

    <section className="section">
      <div className="section-head compact"><div><h2>Sources used for this guide</h2><p>{transportGuide ? "Open the official operator or Philippine government resource for current requirements, station information and service changes." : "Open the original manufacturer or Philippine government source when you need to verify a current requirement or fit instruction."}</p></div></div>
      <div className="checked-record-list">{guide.sources.map((source) => <div key={source.url}><span><strong>{source.label}</strong><small>Checked {readableDate(guide.lastChecked)}</small></span><span className="checked-record-action"><SourceRef url={source.url} label="Open source" /></span></div>)}</div>
    </section>
    <FaqSection title="Frequently asked questions" items={guide.faqs} />
    <AuthorBox />
    <RelatedLinks title="Continue your research" links={guide.related} />
    <JsonLd data={stationSchema ? [schema, faqPageSchema(guide.faqs), stationSchema] : [schema, faqPageSchema(guide.faqs)]} />
  </article>;
}

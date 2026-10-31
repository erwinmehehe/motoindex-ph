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
import { transportGuidesWave2 } from "@/lib/transportGuidesWave2";
import { transportGuidesWave3 } from "@/lib/transportGuidesWave3";
import { corridorExitGuide, corridorExitSchema } from "@/lib/transportWave3/corridorExits";
import { transportWave3FareTable } from "@/lib/transportWave3/fareReferences";
import { CorridorExitTable } from "@/components/CorridorExitTable";
import { LostLicenseChecklist } from "@/components/LostLicenseChecklist";
import { transportFareTable } from "@/lib/transportWave2/fareReferences";
import { TransportFareTable } from "@/components/TransportFareTable";
import { getManilaCodingStatus } from "@/lib/transportWave2/numberCodingSchedule";
import { NumberCodingToday } from "@/components/NumberCodingToday";
import { transitStationGuide, transitStationListSchema } from "@/lib/transitStationGuides2026";
import { TransitStationTable } from "@/components/TransitStationTable";
import { LtoPracticeQuiz } from "@/components/LtoPracticeQuiz";
import styles from "./guide.module.css";

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
  { href: "/motorcycles/expressway-legal", title: "Motorcycle expressway access", description: "Review 400cc motorcycle eligibility and applicable expressway rules." }
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

const expandedRoadResearchLinks = [
  { href: "/guides/skyway-philippines-routes-toll-fees", title: "Skyway tolls and exits", description: "Check Skyway stages and dated toll examples." },
  { href: "/guides/slex-toll-fee-philippines", title: "SLEX toll fees", description: "Review southbound toll examples and Autosweep access." },
  { href: "/guides/nlex-toll-fee-philippines", title: "NLEX toll fees", description: "Review Class 1 toll examples and Easytrip account guidance." }
];

const newExpresswayResearchLinks = [
  { href: "/guides/tplex-exits-and-route", title: "TPLEX exits and tolls", description: "Check the northern route and Autosweep payment." },
  { href: "/guides/sctex-route-and-exits", title: "SCTEX route and exits", description: "Check Central Luzon exits and Easytrip access." },
  { href: "/guides/cavite-laguna-expressway-calax", title: "CALAX open sections", description: "Check the Laguna–Cavite toll-road opening status." },
  { href: "/guides/nlex-connector-road-philippines", title: "NLEX Connector", description: "Review Manila access ramps and separate tolls." }
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
  // The coding indicator must use the Manila date at request time, not a static build date.
  // All other ad-free guide pages retain their existing static prerendering.
  const isCodingGuide = slug === "metro-manila-number-coding-today";
  const hasAds = adsenseEnabled();
  if (isCodingGuide || hasAds) await connection();
  let adNonce: string | undefined;
  if (hasAds) adNonce = (await headers()).get("x-nonce") || undefined;
  const guideMedia = getEditorialGuideMedia(guide.slug);
  const schemaImage = guideMedia?.image ?? DEFAULT_GUIDE_IMAGE;
  const transportGuide = [...transportGuides2026, ...transportGuidesWave2, ...transportGuidesWave3].some((item) => item.slug === guide.slug);
  const fareTable = transportFareTable(guide.slug) ?? transportWave3FareTable(guide.slug);
  const exitGuide = corridorExitGuide(guide.slug);
  const exitSchema = corridorExitSchema(guide.slug);
  const lostLicenseChecklist = guide.slug === "lost-drivers-license-philippines";
  const codingStatus = isCodingGuide ? getManilaCodingStatus(new Date()) : null;
  const stationGuide = transitStationGuide(guide.slug);
  const stationSchema = transitStationListSchema(guide.slug);
  let guideResearchLinks = motorcycleResearchLinks;
  if (/cavite-laguna-expressway|tplex-exits|sctex-route|nlex-connector-road/i.test(guide.slug)) {
    guideResearchLinks = newExpresswayResearchLinks;
  } else if (stationGuide) {
    guideResearchLinks = railResearchLinks;
  } else if (/lost-drivers-license|lto-exam|lto-student/i.test(guide.slug)) {
    guideResearchLinks = licensingResearchLinks;
  } else if (/skyway-philippines|slex-toll|nlex-toll|metro-manila-number-coding/i.test(guide.slug)) {
    guideResearchLinks = expandedRoadResearchLinks;
  } else if (/autosweep-rfid|easytrip-rfid/i.test(guide.slug)) {
    guideResearchLinks = roadResearchLinks;
  } else if (/helmet/i.test(guide.slug)) {
    guideResearchLinks = helmetResearchLinks;
  } else if (/nwow|electric|e-bike/i.test(guide.slug)) {
    guideResearchLinks = electricResearchLinks;
  }
  const schema = articleSchema({
    headline: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    about: guide.title,
    keywords: [guide.seoTitle, transportGuide ? "Philippines transport and commuting guide" : "motorcycle guide Philippines"],
    citations: guide.sources.map((source) => source.url),
    datePublished: guideMedia?.publishedAt,
    checkedDates: [guide.lastChecked],
    image: schemaImage
  });


  return <article className={"page shell " + styles.editorialPage}>
    <AdSense nonce={adNonce} />
    <div className={styles.breadcrumbBar}>
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
    </div>

    <header className={styles.guideHero}>
      <div className={styles.heroCopy}>
        <div className={styles.heroEyebrow}>
          <span className={styles.heroCategory}>{guide.kicker}</span>
          <span className={styles.heroEdition}>MotoIndex PH / Editorial guide</span>
        </div>
        <h1 className={styles.heroTitle}>{guide.title}</h1>
        <p className={styles.heroDeck}>{guide.description}</p>
        <div className={styles.heroMeta}>
          {guideMedia?.publishedAt && <span>Published <time dateTime={guideMedia.publishedAt}>{readableDate(guideMedia.publishedAt)}</time></span>}
          {guideMedia?.publishedAt && <span className={styles.heroMetaDivider} aria-hidden="true">•</span>}
          <span>Sources checked <time dateTime={guide.lastChecked}>{readableDate(guide.lastChecked)}</time></span>
        </div>
        <div className={styles.heroActions}>
          <a className={styles.heroPrimary} href="#guide-answer">Get the quick answer <span aria-hidden="true">↓</span></a>
          <a className={styles.heroSecondary} href="#guide-content">Read the full guide <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <figure className={styles.heroArtwork}>
        <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} />
        {guideMedia?.caption && <figcaption>{guideMedia.caption}</figcaption>}
      </figure>
    </header>

    <div className={styles.trustRibbon} aria-label="Guide information">
      <div className={styles.trustItem}>
        <span className={styles.trustIcon} aria-hidden="true">✓</span>
        <span className={styles.trustCopy}><strong>Source-checked</strong><small>Verified {readableDate(guide.lastChecked)}</small></span>
      </div>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon} aria-hidden="true">§</span>
        <span className={styles.trustCopy}><strong>{guide.sections.length} practical sections</strong><small>Steps and useful context</small></span>
      </div>
      <div className={styles.trustItem}>
        <span className={styles.trustIcon} aria-hidden="true">↗</span>
        <span className={styles.trustCopy}><strong>{guide.sources.length} cited sources</strong><small>Open and verify the originals</small></span>
      </div>
    </div>

    <div className={styles.answerWrap} id="guide-answer">
      <QuickAnswer question={leadQuestion(guide.slug, editorialLeadQuestions, guide.title)} answer={guide.intro} checkedAt={guide.lastChecked} />
    </div>

    <div className={styles.readingLayout} id="guide-content">
      <aside className={styles.sidebar} aria-label="Guide navigation">
        <div className={styles.sidebarInner}>
          <span className={styles.sidebarEyebrow}>Navigate this guide</span>
          <p className={styles.sidebarTitle}>In this article</p>
          <ArticleJumpLinks sections={guide.sections} />
          <div className={styles.sidebarLinks}>
            <a href="#guide-sources">Official sources <span aria-hidden="true">↗</span></a>
            <Link href="/guides">All MotoIndex guides <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </aside>

      <div className={styles.readingColumn}>
        {(codingStatus || lostLicenseChecklist || fareTable || exitGuide || stationGuide) && <div className={styles.toolsArea}>
          {codingStatus && <NumberCodingToday status={codingStatus} />}
          {lostLicenseChecklist && <LostLicenseChecklist />}
          {fareTable && <TransportFareTable table={fareTable} />}
          {exitGuide && <CorridorExitTable guide={exitGuide} />}
          {stationGuide && <TransitStationTable guide={stationGuide} />}
        </div>}

        <div className={styles.articleSections}>
          {guide.sections.map((section, index) => <Fragment key={section.heading}>
            <section className={styles.articleSection} aria-labelledby={articleSectionId(section.heading, index)}>
              <div className={styles.sectionIndex}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.sectionIndexText}>Guide section</span>
              </div>
              <h2 id={articleSectionId(section.heading, index)}>{section.heading}</h2>
              <div className={styles.articleBody}>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              {section.bullets && <div className={styles.takeaways}>
                <h3>Key things to check</h3>
                <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>}
            </section>
            {index === 1 && guide.slug === "lto-exam-reviewer-philippines" && <div className={styles.afterSectionTool}><LtoPracticeQuiz /></div>}
            {index === 1 && <GuideInContentAd nonceReady={Boolean(adNonce)} />}
          </Fragment>)}
        </div>

        <section className={styles.actionBlock} aria-labelledby="guide-research-tools">
          <div className={styles.blockHeader}>
            <span className={styles.sectionEyebrow}>What next</span>
            <h2 id="guide-research-tools">Put this guide to work</h2>
            <p>Explore related MotoIndex resources and verify the details that matter to your next step.</p>
          </div>
          <div className={styles.actionLinks}>
            {guideResearchLinks.map((item) => <Link className={styles.actionLink} href={item.href} key={item.href}>
              <strong>{item.title}</strong><small>{item.description}</small><span>Explore guide →</span>
            </Link>)}
          </div>
        </section>

        <section className={styles.sourcesBlock} id="guide-sources" aria-labelledby="guide-source-heading">
          <div className={styles.blockHeader}>
            <span className={styles.sectionEyebrow}>Research and transparency</span>
            <h2 id="guide-source-heading">Official sources and references</h2>
            <p>{transportGuide ? "Check the current operator or government source for requirements, fees, service schedules and announcements." : "Check the original manufacturer, agency or research source for changing prices, product details and requirements."}</p>
          </div>
          <div className={styles.sourceRows}>
            {guide.sources.map((source) => <div className={styles.sourceRow} key={source.url}>
              <span className={styles.sourceInfo}><strong>{source.label}</strong><small>Source checked {readableDate(guide.lastChecked)}</small></span>
              <span className={styles.sourceAction}><SourceRef url={source.url} label="View source" /></span>
            </div>)}
          </div>
        </section>

        <div className={styles.faqArea}><FaqSection title="Frequently asked questions" items={guide.faqs} /></div>
        <div className={styles.authorArea}><AuthorBox /></div>
        <div className={styles.relatedArea}><RelatedLinks title="Continue your research" links={guide.related} /></div>
      </div>
    </div>
    <JsonLd data={[schema, faqPageSchema(guide.faqs), ...(stationSchema ? [stationSchema] : []), ...(exitSchema ? [exitSchema] : [])]} />
  </article>;
}

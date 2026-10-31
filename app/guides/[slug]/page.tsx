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
import { AUTHOR_NAME, AUTHOR_PATH } from "@/lib/author";
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


  const isAutosweepInstall = guide.slug === "autosweep-rfid-installation-philippines";
  const displayTitle = isAutosweepInstall ? "Autosweep RFID installation in the Philippines" : guide.title;
  const preflightItems = isAutosweepInstall
    ? [
        "Confirm that the installation center accepts new RFID applications, not only reloads.",
        "Check current opening hours and any required vehicle documents.",
        "Ask about the opening toll load and any separate installation charge."
      ]
    : (guide.sections[0]?.bullets?.slice(0, 3) ?? []);
  const quickLinks = isAutosweepInstall
    ? [
        { index: 0, title: "Installation centers", hint: "Where to start", mark: "⌖" },
        { index: 2, title: "Requirements", hint: "What to bring", mark: "✓" },
        { index: 2, title: "Fees & initial load", hint: "What to confirm", mark: "₱" },
        { index: 1, title: "Installation process", hint: "Five practical steps", mark: "01" }
      ]
    : guide.sections.slice(0, 4).map((section, index) => ({
        index,
        title: section.heading,
        hint: "Jump to section",
        mark: String(index + 1).padStart(2, "0")
      }));
  const sourceInAnswer = isAutosweepInstall
    ? guide.sources.find((source) => source.url === "https://autosweeprfid.com/")
    : guide.sources[0];
  const autoSourceIndexBySection: Record<number, number> = { 0: 1, 1: 2, 2: 1, 3: 0, 5: 3 };


  return <article className={"page shell " + styles.editorialPage}>
    <AdSense nonce={adNonce} />
    <div className={styles.breadcrumbBar}>
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />
    </div>

    <div className={styles.heroLayout}>
      <header className={styles.guideHero}>
        <span className={styles.heroCategory}>{guide.kicker}</span>
        <h1>{displayTitle}</h1>
        <p className={styles.heroDeck}>{isAutosweepInstall
          ? "Where to get it, what documents to bring, and what to expect when the tag is installed."
          : guide.description}</p>
        <div className={styles.byline}>
          <span className={styles.avatar} aria-hidden="true">EV</span>
          <span>By <Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link></span>
          {guideMedia?.publishedAt && <><span aria-hidden="true" className={styles.metaDot}>•</span><span>Published <time dateTime={guideMedia.publishedAt}>{readableDate(guideMedia.publishedAt)}</time></span></>}
          <span aria-hidden="true" className={styles.metaDot}>•</span>
          <span className={styles.verified}>Last source check <time dateTime={guide.lastChecked}>{readableDate(guide.lastChecked)}</time></span>
        </div>
      </header>

      <section className={styles.answerWrap} id="guide-answer" aria-label="Quick answer and official resource">
        <QuickAnswer question={leadQuestion(guide.slug, editorialLeadQuestions, guide.title)} answer={guide.intro} checkedAt={guide.lastChecked}>
          <div className={styles.answerActions}>
            {sourceInAnswer && <SourceRef url={sourceInAnswer.url} label={isAutosweepInstall ? "Visit official Autosweep website" : "View cited reference"} className={styles.answerPrimary} />}
            <a href={"#" + articleSectionId(guide.sections[0].heading, 0)} className={styles.answerSecondary}>Read the steps ↓</a>
          </div>
          {sourceInAnswer && <p className={styles.answerNote}>{isAutosweepInstall
            ? "This opens the official operator website. Confirm current installation locations and hours there."
            : "Check the original reference for changing details before acting."}</p>}
        </QuickAnswer>
      </section>

      <aside className={styles.visitCard} aria-label={isAutosweepInstall ? "Before you visit an installation center" : "Before you act"}>
        <span className={styles.visitEyebrow}>{isAutosweepInstall ? "Before you drive" : "Before you act"}</span>
        <h2>{isAutosweepInstall ? "Confirm these three things" : "A few things to verify"}</h2>
        <ul>{preflightItems.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
        <p>Availability, requirements and fees can change. Check the original source before traveling or paying.</p>
      </aside>
    </div>

    {quickLinks.length > 0 && <nav className={styles.quickNavigation} aria-label="Popular sections of this guide">
      <div className={styles.quickNavHead}><h2>Find what you need</h2><p>Jump straight to the answer.</p></div>
      <div className={styles.quickNavGrid}>{quickLinks.map((item, index) =>
        <a href={"#" + articleSectionId(guide.sections[item.index].heading, item.index)} key={index} className={styles.quickNavItem}>
          <span aria-hidden="true" className={styles.quickNavIcon}>{item.mark}</span>
          <strong>{item.title}</strong>
          <small>{item.hint}</small>
        </a>)}</div>
    </nav>}

    <div className={styles.readingLayout} id="guide-content">
      <aside className={styles.sidebar} aria-label="Guide navigation">
        <ArticleJumpLinks sections={guide.sections} />
        <div className={styles.sidebarLinks}>
          <a href="#guide-sources">Sources & references ↗</a>
          <a href="#guide-faqs">Common questions ↓</a>
          <Link href="/guides">All guides →</Link>
        </div>
      </aside>

      <div className={styles.readingColumn}>
        <details className={styles.mobileContents}>
          <summary>On this page <span aria-hidden="true">↓</span></summary>
          <ul>{guide.sections.map((section, index) =>
            <li key={section.heading}><a href={"#" + articleSectionId(section.heading, index)}>{section.heading}</a></li>)}</ul>
        </details>

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
              <div className={styles.sectionIndex}><span>{String(index + 1).padStart(2, "0")}</span><small>{isAutosweepInstall ? ["Installation locations","Installation process","Documents & costs","Choosing an RFID","Motorcycle access","After installation"][index] : "Guide section"}</small></div>
              <h2 id={articleSectionId(section.heading, index)}>{isAutosweepInstall && index === 1 ? "The Autosweep installation process" : section.heading}</h2>
              <div className={styles.articleBody}>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>

              {isAutosweepInstall && autoSourceIndexBySection[index] !== undefined && guide.sources[autoSourceIndexBySection[index]] &&
                <div className={styles.inlineSource}><SourceRef url={guide.sources[autoSourceIndexBySection[index]].url} label={"Official source: " + guide.sources[autoSourceIndexBySection[index]].label} /></div>}

              {section.bullets && (isAutosweepInstall && index === 1
                ? <ol className={styles.stepList}>{section.bullets.map((item) =>
                    <li key={item}>{item.replace(/^\d+\.\s*/, "")}</li>)}</ol>
                : isAutosweepInstall && index === 2
                ? <div className={styles.requirementsCards}>
                    <div><h3>Documents to prepare</h3><ul>{section.bullets.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><h3>Payment and account setup</h3><ul>{section.bullets.slice(3).map((item) => <li key={item}>{item}</li>)}
                      <li>Ask for a receipt separating prepaid toll load from any fee.</li>
                    </ul></div>
                  </div>
                : <ul className={styles.checkList}>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>)}

              {isAutosweepInstall && index === 3 &&
                <div className={styles.compareScroll} role="region" aria-label="Autosweep and Easytrip network comparison" tabIndex={0}>
                  <table><thead><tr><th>RFID network</th><th>Example expressways</th><th>What to check</th></tr></thead><tbody>
                    <tr><th scope="row">Autosweep</th><td>SLEX, Skyway</td><td>Authorized installation and available load</td></tr>
                    <tr><th scope="row">Easytrip</th><td>NLEX, SCTEX</td><td>Account and accepted toll lanes</td></tr>
                  </tbody></table>
                </div>}

              {index === 1 && <figure className={styles.editorialArt}>
                <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} />
                <figcaption>{guideMedia?.caption ?? "MotoIndex original editorial illustration. Verify current route, account and product details against cited sources."}</figcaption>
              </figure>}
            </section>
            {index === 1 && guide.slug === "lto-exam-reviewer-philippines" && <div className={styles.afterSectionTool}><LtoPracticeQuiz /></div>}
            {index === 1 && <GuideInContentAd nonceReady={Boolean(adNonce)} />}
          </Fragment>)}
        </div>

        <section className={styles.sourcesBlock} id="guide-sources" aria-labelledby="guide-source-heading">
          <span className={styles.sectionEyebrow}>Research notes</span>
          <h2 id="guide-source-heading">Sources you can check yourself</h2>
          <p>These are the original resources behind this guide. Last source check <time dateTime={guide.lastChecked}>{readableDate(guide.lastChecked)}</time>. Confirm changing details with the relevant operator, agency or manufacturer.</p>
          <div className={styles.sourceRows}>{guide.sources.map((source) =>
            <div className={styles.sourceRow} key={source.url}>
              <div><strong>{source.label}</strong><small>Checked {readableDate(guide.lastChecked)}</small></div>
              <SourceRef url={source.url} label="Open source" />
            </div>)}</div>
        </section>

        <section className={styles.faqArea} id="guide-faqs" aria-label="Frequently asked questions">
          <FaqSection title="Frequently asked questions" items={guide.faqs} />
        </section>
        <div className={styles.authorArea}><AuthorBox /></div>
        <div className={styles.relatedArea}><RelatedLinks title="Related MotoIndex guides" links={guide.related} /></div>
        <section className={styles.actionBlock} aria-labelledby="guide-research-tools">
          <h2 id="guide-research-tools">Put this guide to work</h2>
          <p>Continue to related motorcycle research, official sources, and our <Link href="/methodology">editorial methodology</Link>.</p>
          <div className={styles.actionLinks}>{guideResearchLinks.map((item) =>
            <Link href={item.href} key={item.href}><strong>{item.title}</strong><small>{item.description}</small><span aria-hidden="true">→</span></Link>)}</div>
        </section>
      </div>
    </div>
    <JsonLd data={[schema, faqPageSchema(guide.faqs), ...(stationSchema ? [stationSchema] : []), ...(exitSchema ? [exitSchema] : [])]} />
  </article>;
}

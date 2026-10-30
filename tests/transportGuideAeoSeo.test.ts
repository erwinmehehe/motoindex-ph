import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { editorialGuides, getEditorialGuide } from "../lib/editorialGuides";
import { transportGuides2026 } from "../lib/transportGuides2026";
import { transitStationGuide, transitStationListSchema } from "../lib/transitStationGuides2026";
import { ltoPracticeQuestions } from "../lib/ltoPracticeQuestions";
import { editorialLeadQuestions } from "../lib/aeoContent";
import { coreSitemapEntries } from "../lib/sitemaps";
import { pageMetadata } from "../lib/site";

const expected = [
  "autosweep-rfid-installation-philippines",
  "easytrip-rfid-balance-check",
  "lto-exam-reviewer-philippines",
  "lto-student-permit-requirements-philippines",
  "mrt-3-stations-philippines",
  "lrt-2-stations-philippines"
];

describe("AEO and SEO for the six Philippine transportation guides", () => {
  it("makes six unique, full-length, date-backed guides indexable through the shared editorial sitemap", () => {
    expect(transportGuides2026.map(g => g.slug)).toEqual(expected);
    expect(new Set(editorialGuides.map(g => g.slug)).size).toBe(editorialGuides.length);
    const sitemap = coreSitemapEntries();
    for (const slug of expected) {
      const guide = getEditorialGuide(slug)!;
      expect(guide).toBeDefined();
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(5);
      expect(guide.related.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.every(s => s.url.startsWith("https://"))).toBe(true);
      expect(guide.lastChecked).toBe("2026-10-30");
      expect(guide.seoTitle.length, slug).toBeLessThanOrEqual(65);
      expect(guide.description.length, slug).toBeLessThanOrEqual(158);
      expect(editorialLeadQuestions[slug], slug).toMatch(/\?$/);
      const meta = pageMetadata({ title: guide.seoTitle, description: guide.description, path: "/guides/" + slug });
      expect(meta.title).toBe(guide.seoTitle);
      expect(meta.alternates?.canonical).toBe("/guides/" + slug);
      expect(sitemap.some(x => x.url.endsWith("/guides/" + slug)), slug).toBe(true);
    }
  });

  it("gives every guide direct answers, original explanations, reputable primary sources and visible related links", () => {
    for (const guide of transportGuides2026) {
      expect(guide.intro.length).toBeGreaterThan(130);
      expect(guide.sections.every(section => section.body.length >= 2), guide.slug).toBe(true);
      expect(guide.sections.every(section => section.bullets?.length && section.bullets.length >= 3), guide.slug).toBe(true);
      expect(guide.faqs.every(faq => faq.question.endsWith("?") && faq.answer.length > 35), guide.slug).toBe(true);
      expect(guide.related.some(link => expected.some(slug => link.href === "/guides/" + slug)), guide.slug).toBe(true);
      expect(guide.sources.some(src => /lto\.gov\.ph|ltoncr\.com|lrta\.gov\.ph|dotrmrt3\.gov\.ph|easytrip\.ph|smcinfrastructure\.com\.ph|autosweeprfid\.com/.test(src.url)), guide.slug).toBe(true);
    }
  });

  it("renders ordered, official station data and exactly matching ItemList metadata for both lines", () => {
    const north = transitStationGuide("mrt-3-stations-philippines")!;
    expect(north.stations).toHaveLength(13);
    expect(north.stations[0].name).toBe("North Avenue");
    expect(north.stations.at(-1)?.name).toBe("Taft Avenue");
    const east = transitStationGuide("lrt-2-stations-philippines")!;
    expect(east.stations).toHaveLength(13);
    expect(east.stations[0].name).toBe("Recto");
    expect(east.stations.at(-1)?.name).toBe("Antipolo");
    for (const slug of ["mrt-3-stations-philippines", "lrt-2-stations-philippines"]) {
      const guide = transitStationGuide(slug)!;
      expect(new Set(guide.stations.map(s=>s.name)).size).toBe(13);
      const schema = transitStationListSchema(slug)!;
      expect(schema.numberOfItems).toBe(13);
      expect(schema.itemListElement.map(item => item.name)).toEqual(guide.stations.map(s => s.name));
      expect(schema.itemListElement.map(item => item.position)).toEqual(Array.from({length:13}, (_,i)=>i+1));
    }
  });

  it("includes an original, accessible 12-question quiz without claiming official exam status", () => {
    expect(ltoPracticeQuestions).toHaveLength(12);
    expect(new Set(ltoPracticeQuestions.map(q=>q.id)).size).toBe(12);
    for (const question of ltoPracticeQuestions) {
      expect(question.options.length).toBe(3);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(question.options.length);
      expect(question.explanation.length).toBeGreaterThan(30);
    }
    const source = readFileSync(new URL("../components/LtoPracticeQuiz.tsx", import.meta.url), "utf8");
    expect(source).toContain('role="status"');
    expect(source).toContain("checked={answers[q.id] === i}");
    expect(source).toContain("setSubmitted(true)");
    const guide = getEditorialGuide("lto-exam-reviewer-philippines")!;
    expect(guide.intro).toMatch(/not an official LTO exam/i);
  });

  it("uses one article template, themed illustrations, and discoverable hub links", () => {
    const template = readFileSync(new URL("../app/guides/[slug]/page.tsx", import.meta.url), "utf8");
    const hub = readFileSync(new URL("../app/guides/page.tsx", import.meta.url), "utf8");
    const art = readFileSync(new URL("../components/GuideFeaturedArt.tsx", import.meta.url), "utf8");
    expect(template).toContain("<TransitStationTable guide={stationGuide} />");
    expect(template).toContain("<LtoPracticeQuiz />");
    expect(template).toContain("transitStationListSchema");
    expect(template).toContain("faqPageSchema(guide.faqs)");
    expect(art).toContain('kind === "rail"');
    expect(art).toContain('kind === "rfid"');
    expect(art).toContain('kind === "license"');
    for (const slug of expected) expect(hub).toContain('href="/guides/' + slug + '"');
  });
});

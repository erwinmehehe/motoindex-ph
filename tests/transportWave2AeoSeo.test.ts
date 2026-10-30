import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { editorialGuides, getEditorialGuide } from "../lib/editorialGuides";
import { transportGuidesWave2 } from "../lib/transportGuidesWave2";
import { coreSitemapEntries } from "../lib/sitemaps";
import { editorialLeadQuestions } from "../lib/aeoContent";
import { pageMetadata } from "../lib/site";
import { transportFareTable } from "../lib/transportWave2/fareReferences";
import { transitStationGuide, transitStationListSchema } from "../lib/transitStationGuides2026";
import { getManilaCodingStatus } from "../lib/transportWave2/numberCodingSchedule";

const slugs = [
  "skyway-philippines-routes-toll-fees",
  "slex-toll-fee-philippines",
  "nlex-toll-fee-philippines",
  "lrt-1-fare-philippines",
  "edsa-carousel-stations-fare",
  "metro-manila-number-coding-today"
] as const;

describe("Second SEO/AEO transport keyword wave", () => {
  it("registers six unique, indexable and dated editorial articles", () => {
    expect(transportGuidesWave2.map(g => g.slug)).toEqual(slugs);
    expect(new Set(editorialGuides.map(g=>g.slug)).size).toEqual(editorialGuides.length);
    const sitemap = coreSitemapEntries();
    for (const slug of slugs) {
      const guide = getEditorialGuide(slug)!;
      expect(guide).toBeDefined();
      expect(guide.sections.length).toBeGreaterThanOrEqual(5);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(6);
      expect(guide.related.length).toBeGreaterThanOrEqual(3);
      expect(guide.lastChecked).toBe("2026-10-30");
      expect(guide.seoTitle.length).toBeLessThanOrEqual(65);
      expect(guide.description.length).toBeLessThanOrEqual(158);
      expect(guide.intro.length).toBeGreaterThan(140);
      expect(guide.sources.length).toBeGreaterThanOrEqual(4);
      expect(guide.sources.every(x=>x.url.startsWith("https://"))).toBe(true);
      expect(guide.sections.every(x=>x.bullets && x.bullets.length>=3)).toBe(true);
      expect(guide.sections.every(x=>x.body.length>=2)).toBe(true);
      expect(guide.faqs.every(x=>x.question.endsWith("?") && x.answer.length>45)).toBe(true);
      expect(guide.related.some(x=>slugs.some(s=>x.href==="/guides/"+s)||/\/(guides|motorcycles|commute)\//.test(x.href))).toBe(true);
      expect(editorialLeadQuestions[slug]).toMatch(/\?$/);
      expect(sitemap.some(x=>x.url.endsWith("/guides/"+slug))).toBe(true);
      const meta=pageMetadata({title:guide.seoTitle,description:guide.description,path:"/guides/"+slug});
      expect(meta.alternates?.canonical).toEqual("/guides/"+slug);
    }
  });
  it("keeps all reference fares visibly date-stamped and no complete/live toll claims", () => {
    const tollSlugs = slugs.slice(0,3);
    for (const slug of tollSlugs) {
      const table=transportFareTable(slug)!;
      expect(table).toBeDefined();
      expect(table.rows.length).toBeGreaterThanOrEqual(5);
      expect(table.caption).toMatch(/not live fares/i);
      expect(table.rows.every(row=>row.length===table.headers.length)).toBe(true);
      expect(table.rows.every(row=>row.at(-1)?.startsWith("₱"))).toBe(true);
      expect(getEditorialGuide(slug)?.intro).toMatch(/dated|not a live|not a real-time/i);
    }
    const lrt=transportFareTable("lrt-1-fare-philippines")!;
    expect(lrt.rows).toHaveLength(5);
    expect(lrt.headers).toEqual(["From","To","Beep card","Single journey"]);
    expect(lrt.rows.every(row=>row.length===4)).toBe(true);
    expect(transportFareTable("metro-manila-number-coding-today")).toBeUndefined();
  });
  it("publishes all 25 LRT-1 and 24 EDSA southbound stops with matching ItemList schema", () => {
    for (const [slug,count,first,last] of [
      ["lrt-1-fare-philippines",25,"Fernando Poe Jr.","Dr. Santos"],
      ["edsa-carousel-stations-fare",24,"Monumento","PITX"]
    ] as const) {
      const guide=transitStationGuide(slug)!;
      expect(guide.stations).toHaveLength(count);
      expect(guide.stations[0].name).toBe(first);
      expect(guide.stations.at(-1)?.name).toBe(last);
      expect(new Set(guide.stations.map(s=>s.name)).size).toBe(count);
      const schema=transitStationListSchema(slug)!;
      expect(schema.numberOfItems).toBe(count);
      expect(schema.itemListElement.map(x=>x.name)).toEqual(guide.stations.map(s=>s.name));
    }
  });
  it("computes Philippines weekday coding without implying live enforcement", () => {
    const fri=getManilaCodingStatus(new Date("2026-10-30T11:10:00Z"));
    expect(fri.date).toBe("2026-10-30");
    expect(fri.weekday).toBe("Friday");
    expect(fri.digits).toEqual([9,0]);
    expect(fri.suspended).toBe(false);
    const monday=getManilaCodingStatus(new Date("2026-11-02T03:00:00Z"));
    expect(monday.digits).toEqual([1,2]);
    expect(monday.suspended).toBe(true);
    expect(monday.suspensionNotice).toMatch(/MMDA/);
    const sat=getManilaCodingStatus(new Date("2026-10-31T03:00:00Z"));
    expect(sat.isWeekday).toBe(false);
    expect(sat.digits).toEqual([]);
  });
  it("shows interactive checker, visible tables, topic art and internal links", () => {
    const page=readFileSync(new URL("../app/guides/[slug]/page.tsx",import.meta.url),"utf8");
    const hub=readFileSync(new URL("../app/guides/page.tsx",import.meta.url),"utf8");
    const art=readFileSync(new URL("../components/GuideFeaturedArt.tsx",import.meta.url),"utf8");
    const checker=readFileSync(new URL("../components/NumberCodingToday.tsx",import.meta.url),"utf8");
    expect(page).toContain("await connection()");
    expect(page).toContain("<TransportFareTable table={fareTable} />");
    expect(page).toContain("<NumberCodingToday status={codingStatus} />");
    expect(page).toContain("transitStationListSchema");
    expect(checker).toContain('aria-live="polite"');
    expect(checker).toContain("Official suspension for this date");
    for (const slug of slugs) expect(hub).toContain('href="/guides/'+slug+'"');
    for (const kind of ["toll","bus","coding"]) expect(art).toContain('kind === "'+kind+'"');
  });
});

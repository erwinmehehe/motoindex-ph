import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { editorialGuides, getEditorialGuide } from "../lib/editorialGuides";
import { transportGuidesWave3 } from "../lib/transportGuidesWave3";
import { coreSitemapEntries } from "../lib/sitemaps";
import { editorialLeadQuestions } from "../lib/aeoContent";
import { pageMetadata } from "../lib/site";
import { corridorExitGuide, corridorExitSchema } from "../lib/transportWave3/corridorExits";
import { transportWave3FareTable } from "../lib/transportWave3/fareReferences";

const slugs = [
  "cavite-laguna-expressway-calax",
  "autosweep-rfid-balance-check",
  "nlex-connector-road-philippines",
  "tplex-exits-and-route",
  "sctex-route-and-exits",
  "lost-drivers-license-philippines"
] as const;

describe("Third Philippine transport SEO/AEO keyword wave", () => {
  it("registers six unique canonical guides with useful source-linked depth", () => {
    expect(transportGuidesWave3.map(g => g.slug)).toEqual(slugs);
    expect(new Set(editorialGuides.map(g => g.slug)).size).toBe(editorialGuides.length);
    const sitemap = coreSitemapEntries();
    for (const slug of slugs) {
      const guide = getEditorialGuide(slug)!;
      expect(guide).toBeDefined();
      expect(guide.sections).toHaveLength(6);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(6);
      expect(guide.related.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(4);
      expect(guide.lastChecked).toBe("2026-10-30");
      expect(guide.seoTitle.length).toBeLessThanOrEqual(65);
      expect(guide.description.length).toBeLessThanOrEqual(158);
      expect(guide.intro.length).toBeGreaterThan(140);
      expect(guide.sections.every(s => s.body.length >= 2 && (s.bullets?.length || 0) >= 3)).toBe(true);
      expect(guide.faqs.every(f => f.question.endsWith("?") && f.answer.length >= 40)).toBe(true);
      expect(guide.sources.every(source => source.url.startsWith("https://"))).toBe(true);
      expect(guide.related.every(link => link.href.startsWith("/"))).toBe(true);
      expect(editorialLeadQuestions[slug]).toMatch(/\?$/);
      expect(sitemap.some(entry => entry.url.endsWith("/guides/" + slug))).toBe(true);
      const metadata = pageMetadata({title:guide.seoTitle,description:guide.description,path:"/guides/" + slug});
      expect(metadata.alternates?.canonical).toEqual("/guides/" + slug);
    }
  });

  it("lists only documented corridor access points and matches ItemList JSON-LD", () => {
    const cases: { slug: string; total: number; first: string; last: string }[] = [
      {slug:"cavite-laguna-expressway-calax",total:7,first:"Greenfield–Mamplasan",last:"Governor's Drive"},
      {slug:"nlex-connector-road-philippines",total:3,first:"C-3 Road / Fifth Avenue",last:"Magsaysay Boulevard"},
      {slug:"tplex-exits-and-route",total:11,first:"La Paz",last:"Rosario/Baguio"},
      {slug:"sctex-route-and-exits",total:12,first:"Tipo/Subic",last:"Tarlac / La Paz"}
    ];
    for (const item of cases) {
      const guide = corridorExitGuide(item.slug)!;
      expect(guide).toBeDefined();
      expect(guide.exits).toHaveLength(item.total);
      expect(guide.exits[0].name).toBe(item.first);
      expect(guide.exits.at(-1)?.name).toBe(item.last);
      expect(new Set(guide.exits.map(x=>x.name)).size).toBe(item.total);
      expect(guide.sourceUrl).toMatch(/^https:\/\//);
      expect(guide.disclaimer.length).toBeGreaterThan(70);
      const schema = corridorExitSchema(item.slug)!;
      expect(schema.numberOfItems).toBe(item.total);
      expect(schema.itemListElement.map(x=>x.name)).toEqual(guide.exits.map(x=>x.name));
      expect(schema.url).toContain("/guides/" + item.slug);
    }
    expect(corridorExitGuide("autosweep-rfid-balance-check")).toBeUndefined();
  });

  it("shows only sourced, dated toll-pair examples, never fabricated live fare matrices", () => {
    const calax=transportWave3FareTable("cavite-laguna-expressway-calax")!;
    expect(calax.effective).toBe("August 9, 2026");
    expect(calax.rows).toHaveLength(2);
    expect(calax.headers).toEqual(["Entry–exit pair","Class 1","Class 2","Class 3"]);
    expect(calax.rows[0]).toEqual(["Silang Aguinaldo ↔ Governor's Drive","₱35","₱70","₱106"]);
    expect(calax.rows[1]).toEqual(["Governor's Drive ↔ Greenfield","₱117","₱234","₱351"]);
    const tplex=transportWave3FareTable("tplex-exits-and-route")!;
    expect(tplex.rows).toHaveLength(5);
    expect(tplex.effective).toMatch(/July 27, 2026/);
    expect(tplex.rows.every(row=>row.length===tplex.headers.length)).toBe(true);
    const connector=transportWave3FareTable("nlex-connector-road-philippines")!;
    expect(connector.rows).toHaveLength(2);
    expect(connector.effective.toLowerCase()).toContain("effective date not stated");
    expect(connector.caption.toLowerCase()).toContain("verify");
    expect(transportWave3FareTable("sctex-route-and-exits")).toBeUndefined();
    expect(transportWave3FareTable("autosweep-rfid-balance-check")).toBeUndefined();
  });

  it("renders the corridor tables, LTO document checklist and contextual internal links", () => {
    const guidePage=readFileSync(new URL("../app/guides/[slug]/page.tsx",import.meta.url),"utf8");
    const guideHub=readFileSync(new URL("../app/guides/page.tsx",import.meta.url),"utf8");
    const art=readFileSync(new URL("../components/GuideFeaturedArt.tsx",import.meta.url),"utf8");
    const lto=readFileSync(new URL("../components/LostLicenseChecklist.tsx",import.meta.url),"utf8");
    const corridor=readFileSync(new URL("../components/CorridorExitTable.tsx",import.meta.url),"utf8");
    expect(guidePage).toContain("<CorridorExitTable guide={exitGuide} />");
    expect(guidePage).toContain("<LostLicenseChecklist />");
    expect(guidePage).toContain("...(exitSchema ? [exitSchema] : [])");
    expect(guidePage).toContain("transportWave3FareTable");
    expect(guidePage).toContain("transportGuidesWave3");
    expect(corridor).toContain('scope="row"');
    expect(corridor).toContain('tabIndex={0}');
    expect(lto).toContain("Affidavit of Loss");
    expect(lto).toContain('aria-live="polite"');
    expect(lto).toContain('type="checkbox"');
    expect(lto).not.toContain("localStorage");
    expect(lto).not.toContain("password");
    for (const slug of slugs) expect(guideHub).toContain('href="/guides/'+slug+'"');
    for (const token of ["calax","tplex","sctex","nlex-connector"]) expect(art).toContain(token);
  });

  it("keeps account data private and distinguishes the main toll networks", () => {
    const autosweep=getEditorialGuide("autosweep-rfid-balance-check")!;
    const sctex=getEditorialGuide("sctex-route-and-exits")!;
    const tplex=getEditorialGuide("tplex-exits-and-route")!;
    const lost=getEditorialGuide("lost-drivers-license-philippines")!;
    expect(autosweep.intro).toContain("official Autosweep Mobile App");
    expect(autosweep.sources.some(s=>s.url.includes("play.google.com"))).toBe(true);
    expect(autosweep.faqs.some(f=>f.answer.includes("never asks"))).toBe(true);
    expect(tplex.intro).toContain("Autosweep");
    expect(sctex.intro).toContain("Easytrip");
    expect(lost.sections.some(s=>s.heading.includes("Affidavit of Loss"))).toBe(true);
    expect(lost.sections.some(s=>s.body.some(p=>p.includes("not the same transaction")))).toBe(true);
  });
});

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error(`v2.6.1 validation failed: ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✓ ${message}`);

const pkg = JSON.parse(read("package.json"));
const [major, minor, patch] = String(pkg.version).split(".").map(Number);
const v261OrNewer = major > 2 || (major === 2 && (minor > 6 || (minor === 6 && patch >= 1)));
if (!v261OrNewer) fail(`package version is ${pkg.version}, expected 2.6.1+`); else pass(`package version ${pkg.version} preserves the v2.6.1 expansion`);

const data = read("lib/data.ts");
const expansion = read("lib/phTier23Models.ts");
const priority = read("lib/phBrandPriority.ts");
const brandPage = read("app/motorcycles/[make]/page.tsx");
const indexPage = read("app/motorcycles/page.tsx");
const layout = read("app/layout.tsx");
const css = read("app/v261.css");

if (!data.includes('import { phTier23Motorcycles } from "./phTier23Models";') || !data.includes("...phTier23Motorcycles")) fail("Tier 2/3 model data is not wired into the main motorcycle catalog"); else pass("Tier 2/3 data is wired into the main catalog");

const ids = [...expansion.matchAll(/\bid:\s*"([^"]+)"/g)].map((m) => m[1]);
if (ids.length !== 30) fail(`expected 30 Tier 2/3 anchor models, found ${ids.length}`); else pass("30 Tier 2/3 anchor models are defined");
if (new Set(ids).size !== ids.length) fail("duplicate Tier 2/3 model IDs found"); else pass("Tier 2/3 model IDs are unique");

const expected = ["rusi","motorstar","kymco","sym","cfmoto","bristol","benelli","ktm","royal-enfield","bmw-motorrad","ducati","triumph","vespa","aprilia","husqvarna"];
for (const slug of expected) {
  const count = [...expansion.matchAll(new RegExp(`makeSlug:\\s*"${slug}"`, "g"))].length;
  if (count !== 2) fail(`${slug} has ${count} anchor models; expected 2`);
}
if (!process.exitCode) pass("all 15 Tier 2/3 brands have two anchor models");

const verifiedDates = [...expansion.matchAll(/verifiedAt, freshness:\s*"verified"/g)].length;
if (verifiedDates !== 30 || !expansion.includes('const verifiedAt = "2026-08-27"')) fail("new model records do not all use the v2.6.1 verified date/status"); else pass("all 30 records use the current verification date and verified status");

const sourceUrls = [...expansion.matchAll(/sourceUrl:\s*"([^"]+)"/g)].map((m) => m[1]);
if (sourceUrls.length !== 30 || sourceUrls.some((url) => !url.startsWith("https://"))) fail("every new model must have one HTTPS source URL"); else pass("all 30 anchor models have HTTPS source references");

if (/searchVolume:\s*(?!0\b)\d+/.test(expansion) || /keywordDifficulty:\s*(?!0\b)\d+/.test(expansion)) fail("unmeasured SEO metrics must remain zero in the expansion dataset"); else pass("unmeasured SEO metrics are not fabricated");

for (const slug of expected) {
  if (!priority.includes(`${slug.includes("-") ? `"${slug}"` : slug}:`) && !priority.includes(`"${slug}":`)) fail(`priority map missing ${slug}`);
}
if (!process.exitCode) pass("Tier priority map includes all expansion brands");

for (const token of ["ph-brand-hero", "ph-brand-overview", "ph-brand-price-table", "ph-brand-method-grid", "ph-brand-faq", "FAQPage", "CollectionPage"]) {
  if (!brandPage.includes(token)) fail(`brand hub missing ${token}`);
}
if (!process.exitCode) pass("brand hubs include strong hero, decision table, research method, FAQ and structured data");

for (const token of ["Tier 2 + Tier 3 rollout", "ph-expansion-grid", "expansionMakes"]) {
  if (!indexPage.includes(token)) fail(`motorcycle index missing ${token}`);
}
if (!process.exitCode) pass("motorcycle index highlights the PH Tier 2/3 rollout");

if (!layout.includes('import "./v261.css";') || layout.indexOf('import "./v261.css";') < layout.indexOf('import "./v260.css";')) fail("v261.css must load after v260.css"); else pass("v2.6.1 styles load after v2.6.0 styles");
if (!css.includes(".ph-brand-hero") || !css.includes(".ph-expansion-grid")) fail("v2.6.1 brand/index UI styles are incomplete"); else pass("v2.6.1 brand and expansion UI styles are present");

if (!pkg.scripts?.["validate:v261"]?.includes("validate-v261.mjs")) fail("validate:v261 script missing from package.json"); else pass("validate:v261 script is registered");

if (process.exitCode) process.exit(process.exitCode);
console.log("v2.6.1 validation passed.");

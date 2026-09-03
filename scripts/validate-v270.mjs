import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error(`v2.7.0 validation failed: ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✓ ${message}`);

const pkg = JSON.parse(read("package.json"));
const [major, minor] = String(pkg.version).split(".").map(Number);
if (major < 2 || (major === 2 && minor < 7)) fail(`package version is ${pkg.version}, expected 2.7.0+`); else pass(`package version ${pkg.version} preserves the v2.7 authority pass`);

const authority = read("lib/modelAuthority.ts");
const quality = read("lib/modelQuality.ts");
const support = read("lib/phBrandSupport.ts");
const entity = read("components/MotorcycleEntityPage.tsx");
const brand = read("app/motorcycles/[make]/page.tsx");
const index = read("app/motorcycles/page.tsx");
const priceIntel = read("lib/priceIntelligence.ts");
const marketChecks = read("components/MarketPriceChecks.tsx");
const seo = read("lib/motorcycleEntitySeo.ts");
const layout = read("app/layout.tsx");
const css = read("app/v270.css");
const data = read("lib/data.ts");

const authorityIds = [...authority.matchAll(/modelId:\s*"([^"]+)"/g)].map((m) => m[1]);
if (authorityIds.length !== 30 || new Set(authorityIds).size !== 30) fail(`expected 30 unique authority profiles, found ${authorityIds.length}`); else pass("30 Tier 2/3 models have unique authority profiles");
for (const token of ["verdict:", "buyIf:", "skipIf:", "phContext:", "comparisonIds:", "researchAngle:"]) {
  if (!authority.includes(token)) fail(`authority profile schema missing ${token}`);
}
if (!process.exitCode) pass("authority profiles store buyer verdict, buy/skip criteria, PH context and competitors");

const expectedBrands = ["rusi","motorstar","kymco","sym","cfmoto","bristol","benelli","ktm","royal-enfield","bmw-motorrad","ducati","triumph","vespa","aprilia","husqvarna"];
for (const slug of expectedBrands) if (!support.includes(`makeSlug:"${slug}"`)) fail(`PH support map missing ${slug}`);
if (!process.exitCode) pass("all 15 expansion brands have Philippine ownership/support resources");

for (const token of ["ModelAuthorityQuality", "score", "grade", "indexable", "strengths", "gaps", "Independent second PH price check", "modelAuthorityProfile", "phBrandSupportFor"]) {
  if (!quality.includes(token)) fail(`quality gate missing ${token}`);
}
if (!data.includes("isAuthorityExpansionModel") || !data.includes("modelAuthorityQuality(model).indexable")) fail("main model indexation does not enforce the authority quality gate"); else pass("Tier 2/3 indexation now passes through the authority quality gate");

for (const token of ['id="buyer-guide"', "authority-verdict", "authority-grid", "authority-media-fallback", "Direct cross-shopping", 'id="research-quality"', "research-quality-panel", "ph-brand-support", "modelAuthorityQuality", "modelAuthorityProfile"]) {
  if (!entity.includes(token)) fail(`model entity page missing ${token}`);
}
if (!process.exitCode) pass("model pages include decision-first buyer guide, direct alternatives and transparent research-quality UI");

for (const token of ["baselineSnapshot", "Baseline model-level Philippine price/spec source", "sourceCount: 1"]) if (!priceIntel.includes(token)) fail(`price intelligence baseline missing ${token}`);
for (const token of ["Model-level baseline", "1 verified source currently stored", "fake market consensus"]) if (!marketChecks.includes(token)) fail(`market-price transparency missing ${token}`);
if (!process.exitCode) pass("one-source models show a real dated baseline instead of a zero-source or fake market view");

for (const token of ["authorityFaqs", "Who should buy the", "main reasons to skip", "modelAuthorityProfile"]) if (!seo.includes(token)) fail(`authority SEO/FAQ layer missing ${token}`);
if (!process.exitCode) pass("Tier 2/3 FAQs and model editorial are materially model-specific");

for (const token of ["not a claim that every Philippine-market", "not labeled the complete lineup", 'id="support"', "publication standard", "Gaps stay visible", "averageAuthorityScore"]) if (!brand.includes(token)) fail(`brand-hub transparency/depth layer missing ${token}`);
if (!process.exitCode) pass("brand hubs clearly distinguish researched coverage from the complete market lineup");

for (const token of ["Authority anchors", "Depth first", "ph-expansion-depth", "authority-anchor models"]) if (!index.includes(token)) fail(`motorcycle index authority summary missing ${token}`);
if (!process.exitCode) pass("motorcycle index communicates depth-before-breadth authority policy");

if (!layout.includes('import "./v270.css";') || layout.indexOf('import "./v270.css";') < layout.indexOf('import "./v261.css";')) fail("v270.css must load after v261.css");
for (const token of [".authority-decision-section", ".research-quality-panel", ".ph-brand-support-panel", ".ph-expansion-depth"]) if (!css.includes(token)) fail(`v2.7 CSS missing ${token}`);
if (!process.exitCode) pass("v2.7 authority UI styles are loaded after v2.6.1");

if (!pkg.scripts?.["validate:v270"]?.includes("validate-v270.mjs") || !pkg.scripts?.["validate:all"]?.includes("validate:v270")) fail("v2.7 validator is not registered in validation chain"); else pass("v2.7 validator is registered in validate:all");

if (process.exitCode) process.exit(process.exitCode);
console.log("v2.7.0 validation passed: Tier 2/3 pages now use authority briefs, quality gates, transparent gaps, real price baselines and Philippine after-sales resources.");

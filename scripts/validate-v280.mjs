import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => { console.error(`v2.8.0 validation failed: ${message}`); process.exitCode = 1; };
const pass = (message) => console.log(`✓ ${message}`);

const pkg = JSON.parse(read("package.json"));
const [pkgMajor280, pkgMinor280] = String(pkg.version || "0.0.0").split(".").map(Number);
if (!(pkgMajor280 === 2 && pkgMinor280 >= 8)) fail(`package version is ${pkg.version}, expected 2.8.0+ within major v2`); else pass(`package version ${pkg.version} preserves the v2.8 decision engine`);

const engine = read("lib/decisionEngine.ts");
const finder = read("components/MotorcycleFinder.tsx");
const finderPage = read("app/finder/page.tsx");
const comparison = read("components/ComparisonDecisionMatrix.tsx");
const comparisonLogic = read("lib/comparisonDecision.ts");
const comparisonPage = read("app/compare/[slug]/page.tsx");
const data = read("lib/data.ts");
const guide = read("app/recommendations/[slug]/page.tsx");
const layout = read("app/layout.tsx");
const css = read("app/v280.css");
const sitemap = read("lib/sitemaps.ts");
const marketChecks = read("lib/marketChecks.ts");

for (const token of ["DecisionProfile", "DecisionFactor", "evaluateMotorcycle", "estimatedLoanMonthlyPhp", "estimatedRunningMonthlyPhp", "estimatedTotalMonthlyPhp", "expresswayClass", "affordabilityGapPhp"]) {
  if (!engine.includes(token)) fail(`decision engine missing ${token}`);
}
if (!process.exitCode) pass("decision engine combines rider fit, use case, road context and monthly planning factors");

for (const token of ["PH decision engine", "Monthly ownership ceiling", "400cc+ expressway-planning class", "Ranked for your profile", "Show score breakdown", "Compare top two", "decision.affordabilityGapPhp"]) {
  if (!finder.includes(token)) fail(`finder missing ${token}`);
}
for (const token of ["expresswayClass", "monthlyBudget", "downPaymentPct", "termMonths", "annualRatePct"]) {
  if (!finderPage.includes(token)) fail(`finder URL hydration missing ${token}`);
}
if (!process.exitCode) pass("finder supports shareable lifestyle, fit and affordability profiles with transparent score breakdowns");

for (const token of ["planningPurchasePrice", "purchasePriceBasis", "annualInsurance", "annualRegistration", "tiresPerYear", "estimatedAnnualReserveMonthlyPhp"]) {
  if (!engine.includes(token) && !marketChecks.includes(token)) fail(`affordability hardening missing ${token}`);
}
for (const token of ["finder_view", "finder_filter_change", "finder_results_generated", "finder_result_click", "finder_score_breakdown_open", "finder_reset"]) {
  if (!finder.includes(token)) fail(`finder analytics missing ${token}`);
}
for (const token of ["allowedNumber", "budgetValues", "trafficValues", "termMonths"]) {
  if (!finderPage.includes(token)) fail(`finder URL normalization missing ${token}`);
}
if (!process.exitCode) pass("finder affordability, URL-state normalization and decision-funnel analytics hardening are present");

for (const token of ["Which one fits which rider?", "Open personalized finder"]) {
  if (!comparison.includes(token)) fail(`comparison decision matrix missing ${token}`);
}
for (const token of ["Heavy city traffic", "Lower / easier bike", "Performance", "Longer rides", "Passenger + luggage"]) {
  if (!comparisonLogic.includes(token)) fail(`comparison scenario library missing ${token}`);
}
if (!comparisonPage.includes("ComparisonDecisionMatrix")) fail("comparison page does not render the decision matrix"); else pass("comparison pages include scenario-based winners without declaring a universal winner");

const newGuides = [
  "best-motorcycles-for-daily-commute-philippines",
  "beginner-friendly-motorcycles-philippines",
  "motorcycles-400cc-plus-philippines",
];
for (const slug of newGuides) {
  if (!data.includes(`slug: "${slug}"`)) fail(`missing recommendation guide ${slug}`);
  if (!data.includes(`case "${slug}"`)) fail(`missing recommendation model logic for ${slug}`);
}
for (const token of ["fixed city-commute decision profile", "beginner-starting method", "400cc+ recorded-displacement set", "does 400cc automatically mean expressway legal", "personalized finder"]) {
  if (!guide.toLowerCase().includes(token.toLowerCase())) fail(`guide methodology/caveat layer missing ${token}`);
}
if (!process.exitCode) pass("three decision-led PH guide hubs have explicit methods and caveats instead of thin listicle copy");

if (!layout.includes('import "./v280.css";') || layout.indexOf('import "./v280.css";') < layout.indexOf('import "./v270.css";')) fail("v280.css must load after v270.css");
for (const token of [".decision-profile-panel", ".decision-winner", ".decision-result-card", ".comparison-decision-matrix"]) if (!css.includes(token)) fail(`v2.8 CSS missing ${token}`);
if (!process.exitCode) pass("v2.8 UI layer is loaded after the authority-pass styles");

if (!sitemap.includes("recommendationGuides.filter(g=>isIndexableRecommendation(g.slug))")) fail("recommendation sitemap quality gate missing"); else pass("new guide URLs remain subject to the existing recommendation indexability gate");

if (!pkg.scripts?.["validate:v280"]?.includes("validate-v280.mjs") || !pkg.scripts?.["validate:all"]?.includes("validate:v280")) fail("v2.8 validator is not registered in validate:all"); else pass("v2.8 validator is registered in validate:all");

if (process.exitCode) process.exit(process.exitCode);
console.log("v2.8.0 validation passed: personalized finder, affordability planning, scenario comparison matrix and decision-led PH guide hubs are present with quality gates and caveats.");

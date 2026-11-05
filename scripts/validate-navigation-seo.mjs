import fs from "node:fs";
import path from "node:path";

// Fast repository-level regression test for the visible public navigation.
// Route shape checks supplement (but do not replace) the rendered HTTP audit.
const root = process.cwd();
const failures = [];

function load(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function walk(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, result);
    else if (entry.name === "page.tsx") result.push(full);
  }
  return result;
}

function validRoute(candidate, routes) {
  const parts = candidate.split("/").filter(Boolean);
  return routes.some((route) => {
    const candidateRoute = route.split("/").filter(Boolean);
    if (parts.length !== candidateRoute.length) return false;
    return candidateRoute.every((segment, index) => segment.startsWith("[") || segment === parts[index]);
  });
}

const routes = walk(path.join(root, "app"))
  .map((file) => path.relative(path.join(root, "app"), path.dirname(file)).replaceAll(path.sep, "/"))
  .map((route) => route === "" ? "/" : "/" + route);
const targets = [
  "components/Header.tsx",
  "components/Footer.tsx",
  "app/page.tsx",
  "lib/internalLinks.ts"
];
const patterns = [
  /href=["'](\/[^"'?#]*)/g,
  /href:\s*["'](\/[^"'?#]*)/g,
  /,\s*["'](\/[^"'?#]*)["']\s*\]/g
];
let checked = 0;

for (const file of targets) {
  const src = load(file);
  const discovered = new Set();
  for (const regex of patterns) {
    for (const match of src.matchAll(regex)) discovered.add(match[1]);
  }
  for (const href of discovered) {
    if (href.startsWith("//")) continue;
    if (!validRoute(href, routes)) failures.push(file + ": route not found: " + href);
    checked += 1;
  }
}
const header = load("components/Header.tsx");
const footer = load("components/Footer.tsx");
const home = load("app/page.tsx");
const model = load("components/MotorcycleEntityPage.tsx");
const guides = load("app/guides/[slug]/page.tsx");
const buyingHub = load("app/recommendations/RecommendationsHub.tsx");

const expectedNav = [
  "/motorcycles/scooters",
  "/used-motorcycles",
  "/recommendations/motorcycles-under-100k",
  "/recommendations/best-motorcycles-for-daily-commute-philippines",
  "/recommendations/beginner-friendly-motorcycles-philippines",
  "/gear/helmets/finder",
  "/ownership/cost-calculator",
  "/dealers",
  "/service-centers"
];
for (const href of expectedNav) {
  if (!header.includes('"' + href + '"')) failures.push("Header missing topic link: " + href);
}
for (const href of ["/recommendations", "/used-motorcycles", "/fitment", "/dealers", "/service-centers"]) {
  if (!footer.includes('"' + href + '"')) failures.push("Footer missing important hub: " + href);
}
for (const href of [
  "/recommendations/motorcycles-under-100k",
  "/recommendations/best-motorcycles-for-daily-commute-philippines",
  "/motorcycles/scooters"
]) {
  if (!home.includes('"' + href + '"')) failures.push("Homepage missing canonical destination: " + href);
}
if (header.includes('"/recommendations#')) failures.push("Header still promotes anchored buying guide links");
if ((header.match(/className="mobile-menu-group"/g) || []).length < 4) failures.push("Mobile menu lacks collapsed topic groups");
if (!model.includes("modelInternalLinks(model)")) failures.push("Model pages do not render contextual research links");
if (!guides.includes("Continue on this topic")) failures.push("Editorial guide links are not contextual");
if (buyingHub.includes('<main className="shell rec-content">')) failures.push("Recommendations page contains nested main landmark");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Navigation SEO audit passed: " + checked + " public link targets checked across " + targets.length + " files; hierarchy and contextual link contracts satisfied.");

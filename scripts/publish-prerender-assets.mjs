import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, ".next", "prerender-manifest.json");
const nextAppRoot = path.join(projectRoot, ".next", "server", "app");
const assetRoot = path.join(projectRoot, ".open-next", "assets");

if (!fs.existsSync(manifestPath)) {
  throw new Error("Missing .next/prerender-manifest.json. Run the Next/OpenNext build first.");
}
if (!fs.existsSync(nextAppRoot) || !fs.existsSync(assetRoot)) {
  throw new Error("Missing Next/OpenNext output directories.");
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const routes = Object.keys(manifest.routes || {});
const adDocumentsEnabled =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true";

// Static HTML assets bypass Next redirects and middleware when
// Wrangler assets.run_worker_first=false. Never copy a configured
// permanent redirect source as HTTP 200 HTML: that breaks canonical URLs.
const { default: nextConfig } = await import(pathToFileURL(path.join(projectRoot, "next.config.mjs")).href);
const configuredRedirects = await nextConfig.redirects();
const redirectSourcePaths = new Set(
  configuredRedirects.filter(({ source }) => typeof source === "string" && !source.includes(":")).map(({ source }) => source)
);

const blockedPrefixes = [
  "/_not-found",
  "/admin",
  "/api",
  "/dealer-lead",
  "/dealer-portal",
  "/my",
  "/garage",
  "/get-quote",
  "/dealers/join",
  "/price-alerts",
  "/quote-status",
  "/sellers",
  "/used-motorcycles/listing"
];

function isSafePublicRoute(route) {
  if (!route.startsWith("/")) return false;
  if (redirectSourcePaths.has(route)) return false;
  // Active ad documents require Worker-first HTML and request-specific nonces.
  if (adDocumentsEnabled && (
    route === "/" || route === "/finder" || route === "/tools/motorcycle-loan-calculator" ||
    route === "/tires" || route === "/gear/helmets" ||
    route === "/research/motorcycle-price-index-philippines" ||
    route === "/recommendations/best-scooters-philippines" ||
    route === "/motorcycles" || route.startsWith("/motorcycles/")
  )) return false;
  // With AdSense active, eligible editorial guides must reach the Worker to
  // receive a fresh document nonce + strict CSP. Static edge HTML bypasses
  // middleware completely when run_worker_first=false.
  if (
    process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
    process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true" &&
    /^\/guides\/[a-z0-9-]+\/?$/.test(route)
  ) return false;
  if (blockedPrefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))) return false;
  if (/^\/motorcycles\/[^/]+\/[^/]+\/(used-value|new-vs-used)\/?$/.test(route)) return false;
  return true;
}

function sourceCandidates(route) {
  if (route === "/") return [path.join(nextAppRoot, "index.html")];
  const relative = route.replace(/^\//, "");
  return [
    path.join(nextAppRoot, `${relative}.html`),
    path.join(nextAppRoot, relative, "index.html")
  ];
}

function destinationFor(route) {
  if (route === "/") return path.join(assetRoot, "index.html");
  return path.join(assetRoot, `${route.replace(/^\//, "")}.html`);
}

let copied = 0;
const copiedRoutes = [];

for (const route of routes) {
  if (!isSafePublicRoute(route)) continue;
  const source = sourceCandidates(route).find((candidate) => fs.existsSync(candidate));
  if (!source) continue;
  const destination = destinationFor(route);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied += 1;
  copiedRoutes.push(route);
}

const requiredRoutes = [
  ...(!adDocumentsEnabled ? ["/"] : []),
  // When ads are active these become dynamic Worker HTML, not static assets.
  ...(!adDocumentsEnabled ? ["/motorcycles", "/motorcycles/yamaha/aerox-v3"] : []),
  "/compare",
  "/recommendations",
  "/recommendations/motorcycles-under-100k"
];

// Wrangler serves static assets before the Worker. Old/prebuilt redirect
// source HTML may remain in .open-next/assets even when the source was not
// copied by this pass; remove exact redirect-source files so they cannot
// shadow configured 308 responses.
for (const redirectSource of redirectSourcePaths) {
  if (!redirectSource.startsWith("/") || redirectSource === "/") continue;
  const destination = destinationFor(redirectSource);
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
}

const missing = requiredRoutes.filter((route) => !copiedRoutes.includes(route));
if (missing.length) {
  throw new Error(`Static edge publish is missing required routes: ${missing.join(", ")}`);
}

const workerImageRoutes = requiredRoutes.filter((route) => {
  const destination = destinationFor(route);
  if (!fs.existsSync(destination)) return false;
  return fs.readFileSync(destination, "utf8").includes("/_next/image?");
});
if (workerImageRoutes.length) {
  throw new Error(`Static recovery pages still depend on the Worker image optimizer: ${workerImageRoutes.join(", ")}`);
}

console.log(`Published ${copied} prerendered public HTML routes as Cloudflare static assets.`);
console.log(`Verified static recovery routes: ${requiredRoutes.join(", ")}`);

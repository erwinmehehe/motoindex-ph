import fs from "node:fs";
import path from "node:path";

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

const blockedPrefixes = [
  "/_not-found",
  "/admin",
  "/api",
  "/dealer-lead",
  "/garage",
  "/price-alerts",
  "/quote-status",
  "/sellers",
  "/used-motorcycles/listing"
];

function isSafePublicRoute(route) {
  if (!route.startsWith("/")) return false;
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
  "/",
  "/motorcycles",
  "/motorcycles/yamaha/aerox-v3",
  "/compare/selection",
  "/recommendations",
  "/recommendations/motorcycles-under-100k"
];

const missing = requiredRoutes.filter((route) => !copiedRoutes.includes(route));
if (missing.length) {
  throw new Error(`Static edge publish is missing required routes: ${missing.join(", ")}`);
}

console.log(`Published ${copied} prerendered public HTML routes as Cloudflare static assets.`);
console.log(`Verified static recovery routes: ${requiredRoutes.join(", ")}`);

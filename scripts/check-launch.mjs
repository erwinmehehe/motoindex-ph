import fs from "node:fs";
import path from "node:path";
import { findSiblingDynamicRouteConflicts } from "./route-conflict-guard.mjs";

const root = process.cwd();
const failures = [];
const warnings = [];

const routeConflicts = findSiblingDynamicRouteConflicts(path.join(root, "app"));
for (const conflict of routeConflicts) {
  failures.push(`Conflicting ${conflict.kind} route segments under app/${conflict.directory}: ${conflict.segments.join(", ")}. Sibling dynamic segments at the same route level must use one canonical parameter name.`);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const exact = (value) => typeof value === "string" && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value);

for (const [name, version] of Object.entries({...pkg.dependencies, ...pkg.devDependencies})) {
  if (!exact(version)) failures.push(`${name} must use an exact version; found ${version}`);
}

const lockfiles = ["package-lock.json", "npm-shrinkwrap.json"].filter((file) => fs.existsSync(path.join(root, file)));
if (lockfiles.length === 0) failures.push("No npm lockfile found. Run npm install with registry access, commit package-lock.json, then use npm ci for deployment.");

let site;
try { site = new URL(process.env.NEXT_PUBLIC_SITE_URL || ""); } catch { failures.push("NEXT_PUBLIC_SITE_URL must be a valid URL."); }
if (site) {
  if (site.protocol !== "https:") failures.push("NEXT_PUBLIC_SITE_URL must use HTTPS for launch.");
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(site.hostname)) failures.push("NEXT_PUBLIC_SITE_URL cannot point to localhost for launch.");
}

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@(example\.(com|org|net)|test|invalid)$/i.test(email)) {
  failures.push("NEXT_PUBLIC_CONTACT_EMAIL must be a real monitored mailbox for launch.");
}

const adminUser = process.env.ADMIN_USERNAME || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";
if (adminUser.length < 8) failures.push("ADMIN_USERNAME must be set and at least 8 characters.");
if (adminPassword.length < 20) failures.push("ADMIN_PASSWORD must be set and at least 20 characters.");
if (adminUser && adminPassword && adminUser === adminPassword) failures.push("ADMIN_USERNAME and ADMIN_PASSWORD must be different.");


const DAY_MS = 86_400_000;
const ageDays = (date) => {
  const ms = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(ms) ? Math.max(0, Math.floor((Date.now() - ms) / DAY_MS)) : Number.POSITIVE_INFINITY;
};
const dataSource = fs.readFileSync(path.join(root, "lib/data.ts"), "utf8");
const motorcyclesStart = dataSource.indexOf("export const motorcycles");
const arrayStart = dataSource.indexOf("[", motorcyclesStart);
const arrayEnd = dataSource.indexOf("\n];", arrayStart);
const modelBlocks = dataSource.slice(arrayStart + 1, arrayEnd).split(/\n  \},\n  \{/).map((block, index, all) => `${index === 0 ? "" : "{"}${block}${index === all.length - 1 ? "" : "}"}`);
for (const block of modelBlocks) {
  if (!/freshness:\s*"verified"/.test(block) || /marketStatus:\s*"previous"/.test(block)) continue;
  const id = block.match(/id:\s*"([^"]+)"/)?.[1] || "unknown-model";
  const verifiedAt = block.match(/verifiedAt:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (!verifiedAt || ageDays(verifiedAt) > 90) failures.push(`${id} model source is older than the 90-day public freshness window (${verifiedAt || "missing date"}).`);
  const marketCheckedAt = block.match(/marketPriceCheckedAt:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
  if (marketCheckedAt && ageDays(marketCheckedAt) > 30) warnings.push(`${id} market-price check is older than 30 days (${marketCheckedAt}).`);
}

// Next.js refuses to route when sibling dynamic segments use different param
// names (e.g. app/tires/[brand] beside app/tires/[slug]). That builds cleanly
// then returns 500 for EVERY request. Shipped broken in v2.4.5/2.4.6.
const appDir = path.join(root, "app");
function checkDynamicSiblings(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  const named = entries
    .filter((e) => e.isDirectory() && /^\[.+\]$/.test(e.name) && !e.name.startsWith("[..."))
    .map((e) => e.name);
  const unique = [...new Set(named)];
  if (unique.length > 1) {
    const where = path.relative(root, dir).split(path.sep).join("/") || "app";
    failures.push(`Route conflict in ${where}: sibling dynamic segments ${unique.join(" and ")} use different param names. Next.js will return 500 for every request.`);
  }
  for (const e of entries) if (e.isDirectory()) checkDynamicSiblings(path.join(dir, e.name));
}
checkDynamicSiblings(appDir);

const nextVersion = pkg.dependencies?.next || "";
const parts = nextVersion.split(".").map(Number);
if (!(parts[0] === 15 && parts[1] === 5 && parts[2] > 23)) {
  failures.push(`Next.js ${nextVersion} is below the patched 15.5.24 security baseline. Upgrade to Next.js 15.5.24 or a newer supported 15.5 patch, regenerate the lockfile, and re-run verification.`);
}

if (warnings.length) console.warn("Launch preflight warnings:\n- " + warnings.join("\n- "));
if (failures.length) {
  console.error("Launch preflight failed:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("Launch preflight passed: exact dependencies, lockfile, HTTPS site URL, contact channel, admin credentials, source freshness, and Next.js security baseline are present.");

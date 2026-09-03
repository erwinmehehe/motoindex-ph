import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const blockers = [];
const warnings = [];
const passes = [];

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const pkg = readJson("package.json");
const lock = readJson("package-lock.json");
const nextConfig = fs.readFileSync(path.join(root, "next.config.mjs"), "utf8");

const nextVersion = String(pkg.dependencies?.next || "");
const nextParts = nextVersion.split(".").map(Number);
const patchedNext = nextParts[0] === 15 && nextParts[1] === 5 && nextParts[2] >= 24;
if (patchedNext) {
  passes.push(`Next.js ${nextVersion} clears the 15.5.24 critical-security baseline.`);
} else {
  blockers.push(`Next.js ${nextVersion || "missing"} is below the patched 15.5.24 security baseline.`);
}

const rootLock = lock.packages?.[""];
const packageSections = ["dependencies", "devDependencies"];
const sameRecord = (a = {}, b = {}) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return aKeys.length === bKeys.length && aKeys.every((key, index) => key === bKeys[index] && a[key] === b[key]);
};
let lockInSync = Boolean(rootLock);
for (const section of packageSections) {
  const expected = pkg[section] || {};
  const actual = rootLock?.[section] || {};
  if (!sameRecord(expected, actual)) lockInSync = false;
  for (const [name, version] of Object.entries(expected)) {
    if (lock.packages?.[`node_modules/${name}`]?.version !== version) lockInSync = false;
  }
}
if (lockInSync) passes.push("package-lock.json matches the exact root dependency versions.");
else blockers.push("package-lock.json is not in sync with package.json. Regenerate it with npm install, then deploy with npm ci.");

const securityLockRecords = ["node_modules/next", "node_modules/@next/env"];
const securityLockNeedsSriRefresh = securityLockRecords.filter((location) => !lock.packages?.[location]?.integrity);
if (securityLockNeedsSriRefresh.length) {
  warnings.push("The Next.js 15.5.24 security packages are exact-pinned, but npm-published integrity metadata still needs a one-time refresh in a networked environment. Run npm run refresh:security-lock before the next dependency change.");
} else {
  passes.push("Security-patch lockfile records include npm integrity metadata.");
}

const hasAvif = /formats\s*:\s*\[[^\]]*["']image\/avif["']/s.test(nextConfig);
if (!patchedNext && hasAvif) blockers.push("AVIF optimization is enabled while Next.js is below 15.5.24.");
else if (!patchedNext) warnings.push("AVIF output is disabled as defense in depth, but the Next.js patch is still required before launch.");
else passes.push("Image optimization is on a patched Next.js baseline.");

let site;
try { site = new URL(process.env.NEXT_PUBLIC_SITE_URL || ""); } catch {}
if (!site || site.protocol !== "https:" || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(site.hostname)) {
  blockers.push("NEXT_PUBLIC_SITE_URL must be set to the real HTTPS production origin. Run npm run launch:prepare -- --site https://your-domain.com --email hello@your-domain.com to create a private local production env file.");
} else passes.push(`Production origin is configured as ${site.origin}.`);

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@(example\.(com|org|net)|test|invalid)$/i.test(email)) {
  blockers.push("NEXT_PUBLIC_CONTACT_EMAIL must be a real monitored mailbox. Use npm run launch:prepare with your real contact address.");
} else passes.push("A monitored public contact mailbox is configured.");

const adminUser = process.env.ADMIN_USERNAME || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";
if (adminUser.length < 8) blockers.push("ADMIN_USERNAME must be at least 8 characters. launch:prepare can generate one locally.");
if (adminPassword.length < 20) blockers.push("ADMIN_PASSWORD must be at least 20 characters. launch:prepare can generate a strong password locally.");
if (adminUser && adminPassword && adminUser === adminPassword) blockers.push("ADMIN_USERNAME and ADMIN_PASSWORD must be different.");
if (adminUser.length >= 8 && adminPassword.length >= 20 && adminUser !== adminPassword) passes.push("Admin protection credentials are configured.");

if (process.env.NEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS === "true") {
  warnings.push("Search-term analytics capture is enabled. Confirm the published privacy policy and intentional consent posture before launch.");
} else passes.push("Search-term analytics capture is off by default.");

if (process.env.DATABASE_URL) {
  passes.push("DATABASE_URL is configured for future Prisma-backed persistence.");
} else {
  warnings.push("DATABASE_URL is not set. This does not block the current seed-backed public launch, but persistent offer ingestion, review, price history, and expiry are disabled until Postgres is configured and migrated.");
}

const affiliateRaw = process.env.AFFILIATE_LINKS_JSON || process.env.SHOPEE_AFFILIATE_LINKS_JSON || "";
if (!affiliateRaw || affiliateRaw.trim() === "{}") {
  warnings.push("No affiliate map is configured. Launch remains safe, but shopping CTAs and affiliate revenue will stay off.");
} else {
  try {
    const parsed = JSON.parse(affiliateRaw);
    const count = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? Object.keys(parsed).length : 0;
    if (count > 0) passes.push(`${count} affiliate destination${count === 1 ? " is" : "s are"} configured for runtime validation.`);
    else warnings.push("Affiliate configuration is present but empty; shopping CTAs will stay off.");
  } catch {
    blockers.push("Affiliate link configuration is invalid JSON.");
  }
}

const installedNextPath = path.join(root, "node_modules", "next", "package.json");
if (fs.existsSync(installedNextPath)) {
  const installedNext = readJson(path.relative(root, installedNextPath).split(path.sep).join("/")).version;
  if (installedNext === nextVersion) passes.push(`Local Next.js install matches package.json (${installedNext}).`);
  else blockers.push(`Local Next.js is ${installedNext}, but package.json requires ${nextVersion}. Run npm ci.`);
} else {
  warnings.push("node_modules is absent, so typecheck/build cannot be proven in this source bundle. Run npm ci && npm run verify:launch in a clean networked build environment.");
}

console.log("MotoIndex PH launch status\n");
if (blockers.length) {
  console.log(`BLOCKERS (${blockers.length})`);
  for (const item of blockers) console.log(`- ${item}`);
  console.log("");
}
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length})`);
  for (const item of warnings) console.log(`- ${item}`);
  console.log("");
}
console.log(`PASSES (${passes.length})`);
for (const item of passes) console.log(`- ${item}`);
console.log("");
console.log(blockers.length ? "Decision: NOT READY TO LAUNCH" : "Decision: SOURCE PREFLIGHT CLEAR - run verify:launch and deployed smoke tests before traffic.");
process.exitCode = blockers.length ? 1 : 0;

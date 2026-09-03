import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const assert = (ok, msg) => { if (!ok) errors.push(msg); };
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const [maj, min, patch] = String(pkg.version).split(".").map(Number);
assert(maj === 2 && (min > 3 || (min === 3 && patch >= 1)), `package version must be v2.3.1 or newer within major v2, found ${pkg.version}`);

const packageSource = read("package.json");
assert(pkg.dependencies?.next === "15.5.24", `Next.js must stay exact-pinned to the patched 15.5.24 release, found ${pkg.dependencies?.next || "missing"}`);
assert(lock.packages?.[""]?.dependencies?.next === "15.5.24", "package-lock root must pin Next.js 15.5.24");
assert(lock.packages?.["node_modules/next"]?.version === "15.5.24", "locked Next.js package must resolve to 15.5.24");
assert(lock.packages?.["node_modules/@next/env"]?.version === "15.5.24", "locked @next/env package must resolve to 15.5.24");
assert(packageSource.includes('"launch:status": "node scripts/launch-status.mjs"'), "launch:status script is missing");
assert(packageSource.includes('"refresh:security-lock"'), "refresh:security-lock script is missing");
assert(packageSource.includes('npm run validate:lockfile'), "verify must include the strict lockfile validator");
assert(packageSource.includes('npm run validate:v231'), "validate:all must include v2.3.1 regression coverage");

const launchStatus = read("scripts/launch-status.mjs");
for (const token of ["15.5.24", "package-lock.json", "NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_CONTACT_EMAIL", "ADMIN_USERNAME", "ADMIN_PASSWORD", "DATABASE_URL", "AFFILIATE_LINKS_JSON", "NOT READY TO LAUNCH"]) {
  assert(launchStatus.includes(token), `launch-status is missing ${token}`);
}
assert(launchStatus.includes("does not block the current seed-backed public launch"), "launch status must correctly classify DATABASE_URL as optional for the current runtime");

const nextConfig = read("next.config.mjs");
assert(!nextConfig.includes('"image/avif"'), "AVIF output should stay disabled until the critical Next.js image patch is installed and dependency-backed verification passes");
assert(nextConfig.includes('"image/webp"'), "WebP image optimization should remain enabled");

const checklist = read("LAUNCH_CHECKLIST.md");
for (const token of ["15.5.24", "npm run launch:status", "npm run validate:lockfile", "Affiliate maps remain optional", "DATABASE_URL is optional"]) {
  assert(checklist.includes(token), `launch checklist is missing ${token}`);
}

assert(lock.version === pkg.version && lock.packages?.[""]?.version === pkg.version, "package-lock root version must match package.json");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("v2.3.1 validation passed: launch status reporting, strict lockfile gating, current 15.5.24 security guidance, optional-runtime DB classification and temporary AVIF mitigation are wired.");

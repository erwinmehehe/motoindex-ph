import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const args = process.argv.slice(2);
const readArg = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name) => args.includes(name);

const siteRaw = readArg("--site") || process.env.NEXT_PUBLIC_SITE_URL || "";
const email = readArg("--email") || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
const output = path.resolve(readArg("--output") || ".env.production.local");
const force = has("--force");

const errors = [];
let site;
try { site = new URL(siteRaw); } catch { errors.push("Provide --site with the real production HTTPS origin."); }
if (site) {
  if (site.protocol !== "https:") errors.push("Production site URL must use HTTPS.");
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(site.hostname)) errors.push("Production site URL cannot use localhost.");
  if (site.pathname !== "/" || site.search || site.hash) errors.push("Production site URL must be the origin only, with no path/query/hash.");
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /@(example\.(com|org|net)|test|invalid)$/i.test(email)) {
  errors.push("Provide --email with a real monitored mailbox.");
}
if (errors.length) {
  console.error("Launch env preparation failed:\n- " + errors.join("\n- "));
  console.error("\nUsage: npm run launch:prepare -- --site https://your-domain.com --email hello@your-domain.com");
  process.exit(1);
}
if (fs.existsSync(output) && !force) {
  console.error(`${path.relative(process.cwd(), output)} already exists. Re-run with --force to replace it.`);
  process.exit(1);
}

const existingUser = process.env.ADMIN_USERNAME || "";
const existingPassword = process.env.ADMIN_PASSWORD || "";
const adminUser = existingUser.length >= 8 ? existingUser : `motoindex_${crypto.randomBytes(5).toString("hex")}`;
const adminPassword = existingPassword.length >= 20 ? existingPassword : crypto.randomBytes(32).toString("base64url");

const body = `# Generated locally by npm run launch:prepare. DO NOT COMMIT.\nNEXT_PUBLIC_SITE_URL=${site.origin}\nNEXT_PUBLIC_CONTACT_EMAIL=${email}\n\nADMIN_USERNAME=${adminUser}\nADMIN_PASSWORD=${adminPassword}\n\n# Optional: leave blank for the current static public launch.\nDATABASE_URL=\n\n# Analytics: privacy-safe default.\nNEXT_PUBLIC_GA_MEASUREMENT_ID=\nNEXT_PUBLIC_PLAUSIBLE_DOMAIN=\nNEXT_PUBLIC_ANALYTICS_CAPTURE_SEARCH_TERMS=false\n\n# Affiliate links remain disabled until real approved destinations are configured.\nAFFILIATE_LINKS_JSON={}\nSHOPEE_AFFILIATE_LINKS_JSON={}\n`;
fs.writeFileSync(output, body, { mode: 0o600 });

console.log(`Created ${path.relative(process.cwd(), output)} with validated production identity and generated admin credentials.`);
console.log("Keep this file private. Copy these values into your hosting provider's production environment, then run npm run verify:launch.");

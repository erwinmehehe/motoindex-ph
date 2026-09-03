import fs from "node:fs";
import path from "node:path";

const required = process.env.REQUIRE_AFFILIATE_LINKS === "true";
const generatedPath = path.join(process.cwd(), "data", "affiliate-links.generated.json");

function parseMap(raw, label) {
  const value = raw?.trim();
  if (!value || value === "{}") return {};
  let parsed;
  try { parsed = JSON.parse(value); }
  catch { throw new Error(`${label} is not valid JSON.`); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error(`${label} must be an object keyed by product ID.`);
  return parsed;
}

function readGenerated() {
  if (!fs.existsSync(generatedPath)) return {};
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(generatedPath, "utf8")); }
  catch { throw new Error("data/affiliate-links.generated.json is not valid JSON."); }
  const links = parsed?.links;
  if (!links) return {};
  if (typeof links !== "object" || Array.isArray(links)) throw new Error("data/affiliate-links.generated.json links must be an object keyed by product ID.");
  return links;
}

try {
  const generated = readGenerated();
  const legacy = parseMap(process.env.SHOPEE_AFFILIATE_LINKS_JSON, "SHOPEE_AFFILIATE_LINKS_JSON");
  const unified = parseMap(process.env.AFFILIATE_LINKS_JSON, "AFFILIATE_LINKS_JSON");
  const merged = { ...generated, ...legacy, ...unified };
  const count = Object.keys(merged).length;
  if (!count) {
    const message = "Affiliate map is empty at build time. Shopee CTAs stay disabled until `npm run affiliates:generate` creates data/affiliate-links.generated.json or deploy-time affiliate JSON is configured; build and redeploy after links change.";
    if (required) { console.error(`Affiliate build check failed: ${message}`); process.exit(1); }
    console.warn(`Affiliate build check warning: ${message}`);
    process.exit(0);
  }
  console.log(`Affiliate build check passed: ${count} product mapping${count === 1 ? "" : "s"} available (${Object.keys(generated).length} generated cache, ${Object.keys(unified).length + Object.keys(legacy).length} environment mappings before overrides). Build and redeploy after affiliate-link changes.`);
} catch (error) {
  console.error(`Affiliate build check failed: ${error.message}`);
  process.exit(1);
}

import { pathToFileURL } from "node:url";
import path from "node:path";

// Cloudflare's publicly documented dummy credentials are for development/QA only.
// A successful preflight proves required fields are set, NOT that account settings
// or real form submissions have been independently accepted.
const TEST_SITE_KEYS = new Set([
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "1x00000000000000000000BB",
  "2x00000000000000000000BB",
  "3x00000000000000000000FF"
]);
const TEST_SECRET_KEYS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA"
]);

export function productionFormConfigurationIssues(env) {
  const issues = [];
  if (env.REQUIRE_FORM_BOT_PROTECTION !== "true") {
    issues.push("REQUIRE_FORM_BOT_PROTECTION must be true for the production release.");
  }
  const publicSiteKey = (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "").trim();
  const secretKey = (env.TURNSTILE_SECRET_KEY || "").trim();
  if (!publicSiteKey) {
    issues.push("NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing.");
  } else if (TEST_SITE_KEYS.has(publicSiteKey)) {
    issues.push("NEXT_PUBLIC_TURNSTILE_SITE_KEY is a Cloudflare test key, not a production key.");
  }
  if (!secretKey) {
    issues.push("TURNSTILE_SECRET_KEY is missing.");
  } else if (TEST_SECRET_KEYS.has(secretKey)) {
    issues.push("TURNSTILE_SECRET_KEY is a Cloudflare test key, not a production secret.");
  }
  return issues;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const issues = productionFormConfigurationIssues(process.env);
  if (issues.length) {
    console.error("Production form release blocked:\n- " + issues.join("\n- "));
    process.exitCode = 1;
  } else {
    console.log("Production form release preflight passed: enforcement enabled and non-test Turnstile bindings present.");
  }
}

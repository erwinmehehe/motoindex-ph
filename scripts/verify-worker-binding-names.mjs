import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Only names are read. Never print or persist Worker secret values.
export const REQUIRED_RUNTIME_SECRET_NAMES = [
  "DATABASE_URL",
  "TURNSTILE_SECRET_KEY",
  "CF_ACCESS_TEAM_DOMAIN",
  "CF_ACCESS_AUD",
  "ADMIN_ACCESS_EMAILS",
];

export function missingWorkerBindingNames(entries) {
  if (!Array.isArray(entries)) throw new Error("Expected Wrangler secret list --format json to return an array.");
  const configured = new Set(entries
    .filter(item => item && typeof item === "object" && typeof item.name === "string")
    .map(item => item.name));
  return REQUIRED_RUNTIME_SECRET_NAMES.filter(name => !configured.has(name));
}

export function verifyWorkerBindingFile(filePath) {
  if (!filePath) throw new Error("Provide the path to the Wrangler secret-list JSON file.");
  const entries = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const missing = missingWorkerBindingNames(entries);
  if (missing.length) throw new Error("Worker runtime secret bindings are missing: " + missing.join(", "));
  return REQUIRED_RUNTIME_SECRET_NAMES.length;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const count = verifyWorkerBindingFile(process.argv[2]);
    console.log("Verified " + count + " required MotoIndex Worker runtime secret binding names.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

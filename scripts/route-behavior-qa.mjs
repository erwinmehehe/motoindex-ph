import fs from "node:fs";
import path from "node:path";

const base = new URL(process.env.BASE_URL || "http://127.0.0.1:3000");
const canonicalOrigin = new URL(process.env.CANONICAL_ORIGIN || "https://motoindexph.com");

const directRoutes = [
  "/motorcycles/electric/vinfast-evo",
  "/motorcycles/electric/vinfast-feliz-ii",
  "/motorcycles/electric/vinfast-viper",
];

const redirects = [
  { source: "/motorcycles/yamaha/aerox-v3/price", destination: "/motorcycles/yamaha/aerox-v3#price" },
  { source: "/motorcycles/yamaha/aerox-v3/specifications", destination: "/motorcycles/yamaha/aerox-v3#specs" },
  { source: "/motorcycles/honda/click-160/colors", destination: "/motorcycles/honda/click-160#colors" },
  { source: "/motorcycles/yamaha/aerox-155", destination: "/motorcycles/yamaha/aerox" },
  { source: "/motorcycles/yamaha/aerox-sp", destination: "/motorcycles/yamaha/aerox-v3" },
  { source: "/motorcycles/yamaha/nmax-155", destination: "/motorcycles/yamaha/nmax" },
  { source: "/motorcycles/yamaha/nmax-2020", destination: "/motorcycles/yamaha/nmax-v2" },
  { source: "/motorcycles/honda/click-v3", destination: "/motorcycles/honda/click-160" },
  { source: "/motorcycles/honda/click-v2", destination: "/motorcycles/honda/click-150i" },
  { source: "/motorcycles/yamaha/aerox-v4", destination: "/motorcycles/yamaha/aerox-v3" },
  { source: "/motorcycles/yamaha/aerox-2025", destination: "/motorcycles/yamaha/aerox-v3" },
  { source: "/motorcycles/yamaha/nmax-turbo", destination: "/motorcycles/yamaha/nmax-v3" },
];

function normalizedRoute(value) {
  const url = new URL(value, base);
  return `${url.pathname}${url.search}${url.hash}`;
}

function canonicalHref(html) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (!/\brel=["'][^"']*canonical[^"']*["']/i.test(tag)) continue;
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) return href;
  }
  return "";
}

const failures = [];
const results = [];

for (const entry of redirects) {
  const sourceUrl = new URL(entry.source, base);
  let response;
  try {
    response = await fetch(sourceUrl, { redirect: "manual", headers: { "user-agent": "MotoIndexRouteQA/1.0" } });
  } catch (error) {
    failures.push(`${entry.source}: request failed: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  const location = response.headers.get("location") || "";
  const actualDestination = location ? normalizedRoute(location) : "";
  const status = response.status;
  const expectedPath = new URL(entry.destination, base).pathname;
  const targetUrl = new URL(expectedPath, base);

  let targetStatus = 0;
  let canonical = "";
  try {
    const target = await fetch(targetUrl, { redirect: "follow", headers: { "user-agent": "MotoIndexRouteQA/1.0" } });
    targetStatus = target.status;
    const html = await target.text();
    canonical = canonicalHref(html);
  } catch (error) {
    failures.push(`${entry.source}: destination request failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  let canonicalPath = "";
  let canonicalHost = "";
  if (canonical) {
    try {
      const canonicalUrl = new URL(canonical, canonicalOrigin);
      canonicalPath = canonicalUrl.pathname.replace(/\/$/, "") || "/";
      canonicalHost = canonicalUrl.hostname.replace(/^www\./, "");
    } catch {}
  }

  const expectedCanonicalPath = expectedPath.replace(/\/$/, "") || "/";
  results.push({
    source: entry.source,
    expectedDestination: entry.destination,
    status,
    location,
    actualDestination,
    targetStatus,
    canonical,
  });

  if (status !== 308) failures.push(`${entry.source}: HTTP ${status}; expected permanent 308 redirect`);
  if (!location) failures.push(`${entry.source}: redirect response is missing Location`);
  if (actualDestination !== entry.destination) failures.push(`${entry.source}: redirects to ${actualDestination || "nothing"}; expected ${entry.destination}`);
  if (targetStatus < 200 || targetStatus >= 400) failures.push(`${entry.source}: destination ${expectedPath} returned HTTP ${targetStatus}`);
  if (!canonical) failures.push(`${entry.source}: destination ${expectedPath} is missing a canonical link`);
  if (canonical && canonicalPath !== expectedCanonicalPath) failures.push(`${entry.source}: canonical path is ${canonicalPath || "invalid"}; expected ${expectedCanonicalPath}`);
  if (canonical && canonicalHost !== canonicalOrigin.hostname.replace(/^www\./, "")) failures.push(`${entry.source}: canonical host is ${canonicalHost || "invalid"}; expected ${canonicalOrigin.hostname}`);
}


const directResults = [];
for (const route of directRoutes) {
  let response;
  try {
    response = await fetch(new URL(route, base), { redirect: "manual", headers: { "user-agent": "MotoIndexRouteQA/1.0" } });
  } catch (error) {
    failures.push(`${route}: request failed: ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }

  const status = response.status;
  const location = response.headers.get("location") || "";
  const html = await response.text();
  const canonical = canonicalHref(html);
  let canonicalPath = "";
  let canonicalHost = "";
  if (canonical) {
    try {
      const canonicalUrl = new URL(canonical, canonicalOrigin);
      canonicalPath = canonicalUrl.pathname.replace(/\/$/, "") || "/";
      canonicalHost = canonicalUrl.hostname.replace(/^www\./, "");
    } catch {}
  }

  const expectedPath = route.replace(/\/$/, "") || "/";
  directResults.push({ route, status, location, canonical });

  if (status < 200 || status >= 300) failures.push(`${route}: HTTP ${status}; expected direct 2xx model page`);
  if (location) failures.push(`${route}: unexpectedly redirects to ${location}`);
  if (!canonical) failures.push(`${route}: model page is missing a canonical link`);
  if (canonical && canonicalPath !== expectedPath) failures.push(`${route}: canonical path is ${canonicalPath || "invalid"}; expected ${expectedPath}`);
  if (canonical && canonicalHost !== canonicalOrigin.hostname.replace(/^www\./, "")) failures.push(`${route}: canonical host is ${canonicalHost || "invalid"}; expected ${canonicalOrigin.hostname}`);
}

const outputDir = path.join(process.cwd(), "artifacts", "visual-qa", "routes");
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "route-behavior-qa.json"), JSON.stringify({ base: base.toString(), directResults, results, failures }, null, 2));

if (failures.length) {
  console.error("Route behavior QA failed:");
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Route behavior QA passed: ${directRoutes.length} electric model routes render directly and ${redirects.length} legacy redirects resolve correctly.`);
}

import fs from "node:fs";

// Usage: BASE_URL=https://preview.example.com npm run audit:rendered-links
// The report is a sampled crawl, not a complete Search Console or sitemap audit.
// Excludes disabled private/quote features by design; this audit does not change
// their availability or the product release gate.
const originInput = process.env.BASE_URL || process.argv[2];
if (!originInput) {
  console.error("Set BASE_URL to an accessible MotoIndex deployment.");
  process.exit(2);
}
const origin = new URL(originInput).origin;
const limit = Math.min(500, Math.max(10, Number(process.env.CRAWL_LIMIT || 120)));
const blockedPrefixes = [
  "/get-quote", "/garage", "/my", "/dealer-portal", "/dealer-lead",
  "/quote-status", "/price-alerts", "/admin", "/api", "/search",
  "/shortlist", "/sellers", "/go", "/catalog"
];
const seeds = [
  "/", "/motorcycles", "/motorcycles/scooters", "/recommendations",
  "/guides", "/gear/helmets", "/tires", "/accessories", "/ownership",
  "/tools", "/dealers", "/service-centers", "/used-motorcycles"
];
const queue = [];
const enqueued = new Set();
const visited = new Map();
const incoming = new Map();
const depth = new Map([["/", 0]]);
const broken = [];
const warnings = [];
const sitemapPages = new Set();

function allowed(pathname) {
  return !blockedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"));
}
function localPath(input) {
  try {
    const url = new URL(input, origin);
    if (url.origin !== origin || !/^https?:$/.test(url.protocol)) return null;
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    return allowed(pathname) ? pathname : null;
  } catch {
    return null;
  }
}
function add(pathname) {
  if (pathname && !enqueued.has(pathname) && enqueued.size < limit * 5) {
    enqueued.add(pathname);
    queue.push(pathname);
  }
}
function linksFrom(html) {
  const links = new Set();
  const anchor = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>/gis;
  for (const match of html.matchAll(anchor)) {
    const href = match[2].replaceAll("&amp;", "&");
    // Fragment-only navigation stays within the current document.
    if (href.startsWith("#") || href.startsWith("?")) continue;
    const path = localPath(href);
    if (path) links.add(path);
  }
  return [...links];
}
function canonicalFrom(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']canonical["']/i.test(match[0])) continue;
    const href = match[0].match(/\bhref\s*=\s*(["'])(.*?)\1/i);
    return href ? href[2].replaceAll("&amp;", "&") : null;
  }
  return null;
}
async function get(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "MotoIndex-SEO-Link-QA/1.0" }
    });
  } finally {
    clearTimeout(timer);
  }
}
async function loadSitemaps() {
  for (const source of ["/sitemap.xml", "/sitemaps/motorcycles.xml", "/sitemaps/gear.xml"]) {
    try {
      const response = await get(origin + source);
      if (!response.ok) {
        warnings.push(source + ": sitemap HTTP " + response.status);
        continue;
      }
      const xml = await response.text();
      for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/gis)) {
        const local = localPath(match[1].trim().replaceAll("&amp;", "&"));
        if (local) sitemapPages.add(local);
      }
    } catch (err) {
      warnings.push(source + ": " + String(err));
    }
  }
}
await loadSitemaps();
for (const path of seeds) add(path);
for (const path of [...sitemapPages].slice(0, Math.max(0, Math.min(limit - seeds.length, 45)))) add(path);

async function worker() {
  while (visited.size < limit && queue.length) {
    const path = queue.shift();
    if (visited.has(path)) continue;
    // Register before awaiting to prevent two workers fetching the same URL.
    visited.set(path, { status: "pending", links: [] });
    try {
      const response = await get(origin + path);
      const status = response.status;
      if (!response.ok) {
        broken.push({ path, status, issue: "HTTP error" });
        visited.set(path, { status, links: [] });
        continue;
      }
      const type = response.headers.get("content-type") || "";
      if (!type.includes("text/html")) {
        visited.set(path, { status, links: [] });
        continue;
      }
      const html = await response.text();
      const links = linksFrom(html);
      const canonical = canonicalFrom(html);
      const hasNoindex = /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
        || /noindex/i.test(response.headers.get("x-robots-tag") || "");
      for (const to of links) {
        if (!incoming.has(to)) incoming.set(to, new Set());
        incoming.get(to).add(path);
        if (depth.has(path) && (!depth.has(to) || depth.get(to) > depth.get(path) + 1)) depth.set(to, depth.get(path) + 1);
        add(to);
      }
      const canonicalPath = canonical ? localPath(canonical) : null;
      if (!hasNoindex && !canonical) warnings.push(path + ": missing canonical link");
      if (!hasNoindex && canonical && canonicalPath !== path) warnings.push(path + ": canonical differs (" + canonical + ")");
      if (response.redirected) warnings.push(path + ": redirects to " + response.url);
      visited.set(path, { status, links, canonical, hasNoindex });
    } catch (err) {
      broken.push({ path, issue: String(err) });
      visited.set(path, { status: "error", links: [] });
    }
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));

const visitedPaths = [...visited.keys()];
const sampleOrphans = visitedPaths.filter((path) => path !== "/" && sitemapPages.has(path)
  && (incoming.get(path)?.size || 0) === 0);
const graph = {
  origin,
  crawlLimit: limit,
  fetchedPages: visited.size,
  discoveredSitemapPages: sitemapPages.size,
  discoveredInternalTargets: incoming.size,
  clickDepthFromHomepage: {
    oneOrLess: visitedPaths.filter((path) => depth.has(path) && depth.get(path) <= 1).length,
    two: visitedPaths.filter((path) => depth.get(path) === 2).length,
    three: visitedPaths.filter((path) => depth.get(path) === 3).length,
    greaterThanThree: visitedPaths.filter((path) => depth.has(path) && depth.get(path) > 3).length,
    unknownInSample: visitedPaths.filter((path) => !depth.has(path)).length
  },
  // These are candidates only: a partial sample cannot prove an orphan.
  zeroInboundWithinSample: sampleOrphans.slice(0, 30),
  broken: broken.slice(0, 100),
  warnings: warnings.slice(0, 100),
  excludedFeatures: "Disabled user, quote and private flows are excluded by scope."
};
console.log(JSON.stringify(graph, null, 2));
if (process.env.AUDIT_OUTPUT) fs.writeFileSync(process.env.AUDIT_OUTPUT, JSON.stringify(graph, null, 2) + "\n");
if (broken.length) process.exitCode = 1;

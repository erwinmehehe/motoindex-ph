// Read-only, low-rate SEO sample. Never probes private or disabled features.
const origin = new URL(process.env.BASE_URL || "https://motoindexph.com").origin;
const pages = [
  "/", "/motorcycles", "/motorcycles/scooters", "/motorcycles/electric",
  "/motorcycles/yamaha/aerox-v3", "/motorcycles/yamaha/nmax-v3",
  "/motorcycles/honda/adv-160", "/motorcycles/honda/click-160",
  "/recommendations", "/recommendations/motorcycles-under-100k",
  "/recommendations/best-scooters-philippines",
  "/recommendations/best-motorcycles-for-daily-commute-philippines",
  "/recommendations/beginner-friendly-motorcycles-philippines",
  "/recommendations/best-motorcycles-for-short-riders",
  "/recommendations/motorcycles-with-abs-philippines",
  "/guides", "/guides/autosweep-rfid-installation-philippines",
  "/tires", "/gear/helmets", "/gear/helmets/finder",
  "/fitment", "/ownership", "/ownership/cost-calculator",
  "/tools", "/dealers", "/service-centers", "/used-motorcycles",
  "/research/motorcycle-price-index-philippines"
];
const tags = (html, name) => html.match(new RegExp("<" + name + "\\b[^>]*>", "gi")) || [];
const attr = (tag, name) => tag?.match(new RegExp("\\b" + name + "\\s*=\\s*(['\"])(.*?)\\1", "i"))?.[2] || "";
const report = [];
for (const path of pages) {
  try {
    const response = await fetch(new URL(path, origin), {
      redirect: "manual",
      headers: { "user-agent": "MotoIndex-SEO-public-sample/1.0", "cache-control": "no-cache" },
      signal: AbortSignal.timeout(13000)
    });
    const raw = await response.text();
    const html = response.status === 200 ? raw : "";
    const edgeError = response.status >= 500 ? (() => {
      const body = raw.slice(0, 4000).toLowerCase();
      if (/1102|resource limit|worker exceeded|memory limit|cpu time exceeded/.test(body)) return "worker-resource";
      if (/1015|rate limit|too many requests/.test(body)) return "rate-limit";
      if (/cloudflare|cloudflare-nginx/.test(body)) return "cloudflare-identified";
      return "unclassified";
    })() : undefined;
    const links = tags(html, "link");
    const metas = tags(html, "meta");
    const canonical = attr(links.find((tag) => attr(tag, "rel").split(" ").includes("canonical")), "href");
    const robots = attr(metas.find((tag) => attr(tag, "name").toLowerCase() === "robots"), "content");
    const description = attr(metas.find((tag) => attr(tag, "name").toLowerCase() === "description"), "content");
    const title = html.match(new RegExp("<title[^>]*>([^<]*)</title>", "i"))?.[1] || "";
    const expected = new URL(path, origin).href;
    const issues = [];
    if (response.status !== 200) issues.push("status=" + response.status);
    else {
      if (title.trim().length < 12) issues.push("short-title");
      if (description.trim().length < 40) issues.push("short-description");
      if (!canonical) issues.push("missing-canonical");
      else if (canonical !== expected) issues.push("different-canonical");
      if (/noindex/i.test(robots + " " + (response.headers.get("x-robots-tag") || ""))) issues.push("noindex");
    }
    report.push({ path, status: response.status, issueCount: issues.length, issues,
      ...(canonical && canonical !== expected ? {canonical} : {}),
      ...(response.status >= 500 ? {
        cfRay: response.headers.get("cf-ray"),
        server: response.headers.get("server"),
        retryAfter: response.headers.get("retry-after"),
        edgeError
      } : {})
    });
  } catch (error) {
    report.push({ path, status: "network-error", issueCount: 1, issues: [error instanceof Error ? error.name : "unknown"] });
  }
  await new Promise((resolve) => setTimeout(resolve, 700));
}
const flagged = report.filter((r) => r.issueCount > 0);
console.log(JSON.stringify({
  base: origin,
  sampled: report.length,
  http200: report.filter((r) => r.status === 200).length,
  flaggedCount: flagged.length,
  flagged,
  note: "Read-only fixed sample. No claim of sitewide crawl or Google index coverage."
}, null, 2));
if (flagged.length) process.exitCode = 1;

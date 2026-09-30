import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    input: undefined,
    output: undefined,
    minImpressions: 10,
    strikingMin: 4,
    strikingMax: 20,
    ctrMaxPosition: 10,
    lowCtr: 0.02,
    siteOrigin: "https://motoindexph.com"
  };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--output") args.output = argv[++i];
    else if (value === "--min-impressions") args.minImpressions = Number(argv[++i]);
    else if (value === "--striking-min") args.strikingMin = Number(argv[++i]);
    else if (value === "--striking-max") args.strikingMax = Number(argv[++i]);
    else if (value === "--ctr-max-position") args.ctrMaxPosition = Number(argv[++i]);
    else if (value === "--low-ctr") args.lowCtr = Number(argv[++i]);
    else if (value === "--site-origin") args.siteOrigin = argv[++i];
    else if (!args.input) args.input = value;
  }
  return args;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows.filter((item) => item.some((value) => value.trim() !== ""));
}

function normalizeHeader(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function number(value) {
  const parsed = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function ratio(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  if (raw.endsWith("%")) return number(raw.slice(0, -1)) / 100;
  const parsed = number(raw);
  return parsed > 1 ? parsed / 100 : parsed;
}

function pct(value) { return `${(value * 100).toFixed(2)}%`; }
function clean(value) { return String(value ?? "").trim(); }
function md(value) { return clean(value).replace(/\|/g, "\\|").replace(/\n/g, " "); }

function normalizePage(value, siteOrigin) {
  const raw = clean(value);
  if (!raw) return raw;
  try {
    const parsed = new URL(raw, siteOrigin);
    const site = new URL(siteOrigin);
    if (parsed.hostname === site.hostname || parsed.hostname === `www.${site.hostname}`) {
      const pathname = parsed.pathname === "/" ? "/" : parsed.pathname.replace(/\/+$/, "");
      return pathname || "/";
    }
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    const withoutQuery = raw.split(/[?#]/)[0] || raw;
    return withoutQuery === "/" ? "/" : withoutQuery.replace(/\/+$/, "");
  }
}

function queryFamily(query) {
  const value = query.toLowerCase();
  if (/tire|tyre/.test(value) && /size|front|rear|stock|replacement/.test(value)) return "Tire size & fitment";
  if (/installment|downpayment|down payment|monthly|finance|financing|loan|emi/.test(value)) return "Installment & financing";
  if (/price|srp|how much|cost/.test(value)) return "Price";
  if (/spec|specification|horsepower|hp\b|torque|engine|cc\b/.test(value)) return "Specifications";
  if (/color|colour/.test(value)) return "Colors & variants";
  if (/fuel|km\/l|kmpl|consumption|mileage|range|tank/.test(value)) return "Fuel & range";
  if (/seat|height|weight|fit|short rider|inseam/.test(value)) return "Rider fit";
  if (/\bvs\b|versus|compare|comparison/.test(value)) return "Comparison";
  if (/\bv[1-9]\b|generation|gen\b|variant|standard|abs|tech max|sp\b/.test(value)) return "Generation & variant";
  if (/dealer|shop|store|near me|where to buy/.test(value)) return "Dealer";
  return "General model/category";
}

function aggregate(items) {
  const clicks = items.reduce((sum, item) => sum + item.clicks, 0);
  const impressions = items.reduce((sum, item) => sum + item.impressions, 0);
  const weightedPosition = items.reduce((sum, item) => sum + item.position * item.impressions, 0);
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPosition / impressions : 0
  };
}

function opportunityScore(row, lowCtrThreshold) {
  const positionWeight = row.position <= 3 ? 0.25
    : row.position <= 10 ? 1
      : row.position <= 20 ? 0.7
        : 0.25;
  const clickGap = Math.max(0.25, 1 + Math.max(0, lowCtrThreshold - row.ctr) * 10);
  return row.impressions * positionWeight * clickGap;
}

const args = parseArgs(process.argv.slice(2));
if (!args.input) {
  console.error("Usage: npm run seo:gsc-opportunities -- <combined-query-page.csv> [--output report.md] [--min-impressions 10]");
  console.error("Required columns: query, page, clicks, impressions, ctr, position.");
  console.error("The input must contain query + page dimensions together, typically from the Search Console API or another combined export. Separate Queries.csv and Pages.csv files cannot prove query-to-page ownership.");
  process.exit(1);
}

for (const [name, value] of [
  ["min impressions", args.minImpressions],
  ["striking min", args.strikingMin],
  ["striking max", args.strikingMax],
  ["CTR max position", args.ctrMaxPosition],
  ["low CTR", args.lowCtr]
]) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid ${name}: ${value}`);
}
if (args.strikingMin > args.strikingMax) throw new Error("--striking-min cannot exceed --striking-max.");

const csv = parseCsv(fs.readFileSync(args.input, "utf8"));
if (csv.length < 2) throw new Error("GSC export is empty.");
const headers = csv[0].map(normalizeHeader);
const indexOf = (...names) => names.map(normalizeHeader).map((name) => headers.indexOf(name)).find((idx) => idx >= 0) ?? -1;
const indexes = {
  query: indexOf("query", "topqueries"),
  page: indexOf("page", "pages", "url", "landingpage"),
  clicks: indexOf("clicks"),
  impressions: indexOf("impressions"),
  ctr: indexOf("ctr", "clickthroughrate"),
  position: indexOf("position", "averageposition")
};

for (const key of ["query", "page", "clicks", "impressions", "position"]) {
  if (indexes[key] < 0) throw new Error(`Missing required GSC column: ${key}`);
}

const rows = csv.slice(1).map((values) => {
  const query = clean(values[indexes.query]);
  const page = normalizePage(values[indexes.page], args.siteOrigin);
  const clicks = number(values[indexes.clicks]);
  const impressions = number(values[indexes.impressions]);
  const reportedCtr = indexes.ctr >= 0 ? ratio(values[indexes.ctr]) : 0;
  return {
    query,
    page,
    clicks,
    impressions,
    ctr: indexes.ctr >= 0 ? reportedCtr : (impressions ? clicks / impressions : 0),
    position: number(values[indexes.position]),
    family: queryFamily(query)
  };
}).filter((row) => row.query && row.page && row.impressions > 0 && row.position > 0);

const byPage = new Map();
const byQuery = new Map();
const byFamily = new Map();
for (const row of rows) {
  const pageRows = byPage.get(row.page) ?? [];
  pageRows.push(row);
  byPage.set(row.page, pageRows);

  const queryPages = byQuery.get(row.query) ?? new Map();
  const rowsForPage = queryPages.get(row.page) ?? [];
  rowsForPage.push(row);
  queryPages.set(row.page, rowsForPage);
  byQuery.set(row.query, queryPages);

  const familyRows = byFamily.get(row.family) ?? [];
  familyRows.push(row);
  byFamily.set(row.family, familyRows);
}

const striking = rows
  .filter((row) => row.position >= args.strikingMin && row.position <= args.strikingMax && row.impressions >= args.minImpressions)
  .map((row) => ({ ...row, score: opportunityScore(row, args.lowCtr) }))
  .sort((a, b) => b.score - a.score || b.impressions - a.impressions)
  .slice(0, 60);

const zeroClick = rows
  .filter((row) => row.clicks === 0 && row.impressions >= Math.max(20, args.minImpressions))
  .map((row) => ({ ...row, score: opportunityScore(row, args.lowCtr) }))
  .sort((a, b) => b.score - a.score || b.impressions - a.impressions)
  .slice(0, 60);

const lowCtr = rows
  .filter((row) => row.position <= args.ctrMaxPosition && row.impressions >= Math.max(50, args.minImpressions) && row.ctr < args.lowCtr)
  .map((row) => ({ ...row, score: opportunityScore(row, args.lowCtr) }))
  .sort((a, b) => b.score - a.score || b.impressions - a.impressions)
  .slice(0, 60);

const pageLeaders = [...byPage.entries()].map(([page, items]) => ({ page, ...aggregate(items) }))
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 60);

const pageOpportunities = [...byPage.entries()].map(([page, items]) => {
  const stats = aggregate(items);
  const actionable = items.filter((row) =>
    (row.position >= args.strikingMin && row.position <= args.strikingMax) ||
    (row.position <= args.ctrMaxPosition && row.ctr < args.lowCtr)
  );
  return {
    page,
    ...stats,
    actionableImpressions: actionable.reduce((sum, row) => sum + row.impressions, 0),
    score: actionable.reduce((sum, row) => sum + opportunityScore(row, args.lowCtr), 0),
    families: [...new Set(actionable.map((row) => row.family))].slice(0, 4).join(", ")
  };
}).filter((item) => item.actionableImpressions >= args.minImpressions)
  .sort((a, b) => b.score - a.score || b.actionableImpressions - a.actionableImpressions)
  .slice(0, 50);

const familySummary = [...byFamily.entries()].map(([family, items]) => ({ family, ...aggregate(items) }))
  .sort((a, b) => b.impressions - a.impressions);

const cannibalization = [];
for (const [query, pages] of byQuery.entries()) {
  const candidates = [...pages.entries()].map(([page, items]) => ({ page, ...aggregate(items) }))
    .filter((item) => item.impressions >= Math.max(5, Math.floor(args.minImpressions / 2)))
    .sort((a, b) => b.impressions - a.impressions);
  const totalImpressions = candidates.reduce((sum, item) => sum + item.impressions, 0);
  if (candidates.length >= 2 && totalImpressions >= Math.max(20, args.minImpressions)) {
    cannibalization.push({ query, totalImpressions, pages: candidates.slice(0, 5) });
  }
}
cannibalization.sort((a, b) => b.totalImpressions - a.totalImpressions);

const programWatchlist = [
  "/motorcycles/honda/pcx-160",
  "/motorcycles/suzuki/raider-r150",
  "/motorcycles/yamaha/sniper-155",
  "/motorcycles/yamaha/fazzio",
  "/motorcycles/yamaha/mio-gear",
  "/motorcycles/honda/adv-160",
  "/tires/adv-160-tire-size",
  "/tires/fazzio-tire-size",
  "/tires/mio-gear-tire-size",
  "/tires/sniper-155-tire-size",
  "/tires/aerox-tire-size",
  "/tires/nmax-tire-size",
  "/tires/honda-click-tire-size"
];
const watched = programWatchlist.flatMap((page) => {
  const items = byPage.get(page);
  return items ? [{ page, ...aggregate(items) }] : [];
}).sort((a, b) => b.impressions - a.impressions);

function table(title, items, columns, rowFn) {
  const lines = [`## ${title}`, "", `| ${columns.join(" | ")} |`, `| ${columns.map(() => "---").join(" | ")} |`];
  if (!items.length) lines.push(`| ${columns.map((_, i) => i === 0 ? "None in this export" : "").join(" | ")} |`);
  else for (const item of items) lines.push(`| ${rowFn(item).map(md).join(" | ")} |`);
  return lines.join("\n");
}

const report = [
  "# MotoIndex GSC opportunity report",
  "",
  `Rows analyzed: ${rows.length.toLocaleString("en-PH")}. This report only prioritizes URLs and queries present in the supplied first-party Search Console dataset. It does not treat competitor traffic estimates or keyword-volume research as GSC performance.`,
  "",
  "## Configuration",
  "",
  `- Minimum impressions: ${args.minImpressions}`,
  `- Striking-distance positions: ${args.strikingMin}–${args.strikingMax}`,
  `- Low-CTR check: position ≤ ${args.ctrMaxPosition}, CTR < ${pct(args.lowCtr)}`,
  `- Page normalization origin: ${args.siteOrigin}`,
  "- Opportunity score is an internal prioritization heuristic based on impressions, position band and CTR gap. It is not a Google ranking metric.",
  "",
  table("Page priorities from earned impressions", pageOpportunities, ["Page", "Actionable impressions", "Clicks", "CTR", "Weighted position", "Query families"], (row) => [row.page, row.actionableImpressions, row.clicks, pct(row.ctr), row.position.toFixed(1), row.families]),
  "",
  table("Striking-distance queries", striking, ["Query", "Intent", "Page", "Clicks", "Impressions", "CTR", "Position"], (row) => [row.query, row.family, row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("High-impression zero-click rows", zeroClick, ["Query", "Intent", "Page", "Impressions", "Position"], (row) => [row.query, row.family, row.page, row.impressions, row.position.toFixed(1)]),
  "",
  table("Possible CTR opportunities", lowCtr, ["Query", "Intent", "Page", "Clicks", "Impressions", "CTR", "Position"], (row) => [row.query, row.family, row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("Query-family demand already reaching MotoIndex", familySummary, ["Intent family", "Clicks", "Impressions", "CTR", "Weighted position"], (row) => [row.family, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("Current SEO-program watchlist found in GSC", watched, ["Page", "Clicks", "Impressions", "CTR", "Weighted position"], (row) => [row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("Pages Google already rewards with impressions", pageLeaders, ["Page", "Clicks", "Impressions", "CTR", "Weighted position"], (row) => [row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  "## Possible query cannibalization",
  "",
  ...(cannibalization.length ? cannibalization.slice(0, 30).flatMap((item) => [
    `### ${item.query}`,
    `Total impressions across competing canonical paths: ${item.totalImpressions}`,
    "",
    ...item.pages.map((page) => `- ${page.page} — ${page.impressions} impressions, ${page.clicks} clicks, CTR ${pct(page.ctr)}, avg position ${page.position.toFixed(1)}`),
    ""
  ]) : ["No query with meaningful impressions appeared across multiple normalized page paths in this export.", ""]),
  "## Recommended workflow",
  "",
  "1. Improve on-page coverage and internal links first for positions 4–20 where the existing canonical page clearly matches the query intent.",
  "2. Test title/meta changes only where the page already earns meaningful impressions and CTR is weak for its current position; do not rewrite titles from keyword-volume data alone.",
  "3. For price/installment, specs, colors and tire-size query families, strengthen the matching section on the canonical model or tire guide instead of creating thin derivative URLs.",
  "4. Treat cannibalization as a review queue, not an automatic merge instruction. Confirm that the pages truly serve the same search intent before consolidating.",
  "5. Re-export the same query+page dimensions for an equivalent date range after changes and compare clicks, impressions, CTR and weighted position."
].join("\n");

if (args.output) {
  const out = path.resolve(args.output);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, report);
  console.log(`Wrote ${out}`);
} else {
  console.log(report);
}

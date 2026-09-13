import fs from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const args = { input: undefined, output: undefined };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--output") args.output = argv[++i];
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
    else if (ch === ',') { row.push(field); field = ""; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
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

const { input, output } = parseArgs(process.argv.slice(2));
if (!input) {
  console.error("Usage: node scripts/gsc-opportunity-report.mjs <combined-query-page.csv> [--output report.md]");
  console.error("Required columns: query, page, clicks, impressions, ctr, position. Export query + page dimensions together from Search Console API or a connected GSC data source.");
  process.exit(1);
}

const csv = parseCsv(fs.readFileSync(input, "utf8"));
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

const rows = csv.slice(1).map((values) => ({
  query: clean(values[indexes.query]),
  page: clean(values[indexes.page]),
  clicks: number(values[indexes.clicks]),
  impressions: number(values[indexes.impressions]),
  ctr: indexes.ctr >= 0 ? ratio(values[indexes.ctr]) : 0,
  position: number(values[indexes.position])
})).filter((row) => row.query && row.page && row.impressions > 0 && row.position > 0);

const byPage = new Map();
const byQuery = new Map();
for (const row of rows) {
  const page = byPage.get(row.page) ?? { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
  page.clicks += row.clicks;
  page.impressions += row.impressions;
  page.weightedPosition += row.position * row.impressions;
  byPage.set(row.page, page);

  const query = byQuery.get(row.query) ?? new Map();
  const pageForQuery = query.get(row.page) ?? { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
  pageForQuery.clicks += row.clicks;
  pageForQuery.impressions += row.impressions;
  pageForQuery.weightedPosition += row.position * row.impressions;
  query.set(row.page, pageForQuery);
  byQuery.set(row.query, query);
}

const striking = rows
  .filter((row) => row.position >= 4 && row.position <= 20 && row.impressions >= 10)
  .sort((a, b) => b.impressions - a.impressions || a.position - b.position)
  .slice(0, 50);

const zeroClick = rows
  .filter((row) => row.clicks === 0 && row.impressions >= 20)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 50);

const lowCtr = rows
  .filter((row) => row.position <= 10 && row.impressions >= 50 && row.ctr < 0.02)
  .sort((a, b) => b.impressions - a.impressions || a.ctr - b.ctr)
  .slice(0, 50);

const pageLeaders = [...byPage.values()].map((item) => ({
  ...item,
  ctr: item.impressions ? item.clicks / item.impressions : 0,
  position: item.impressions ? item.weightedPosition / item.impressions : 0
})).sort((a, b) => b.impressions - a.impressions).slice(0, 50);

const cannibalization = [];
for (const [query, pages] of byQuery.entries()) {
  const candidates = [...pages.values()].map((item) => ({
    ...item,
    position: item.impressions ? item.weightedPosition / item.impressions : 0
  })).filter((item) => item.impressions >= 5).sort((a, b) => b.impressions - a.impressions);
  const totalImpressions = candidates.reduce((sum, item) => sum + item.impressions, 0);
  if (candidates.length >= 2 && totalImpressions >= 20) cannibalization.push({ query, totalImpressions, pages: candidates.slice(0, 4) });
}
cannibalization.sort((a, b) => b.totalImpressions - a.totalImpressions);

function table(title, items, columns, rowFn) {
  const lines = [`## ${title}`, "", `| ${columns.join(" | ")} |`, `| ${columns.map(() => "---").join(" | ")} |`];
  if (!items.length) lines.push(`| ${columns.map((_, i) => i === 0 ? "None in this export" : "").join(" | ")} |`);
  else for (const item of items) lines.push(`| ${rowFn(item).map(md).join(" | ")} |`);
  return lines.join("\n");
}

const report = [
  "# MotoIndex GSC opportunity report",
  "",
  `Rows analyzed: ${rows.length.toLocaleString("en-PH")}. This report only prioritizes URLs and queries already receiving Google Search impressions. It does not invent opportunities for pages absent from the export.`,
  "",
  table("Striking-distance queries (positions 4–20)", striking, ["Query", "Page", "Clicks", "Impressions", "CTR", "Position"], (row) => [row.query, row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("High-impression zero-click rows", zeroClick, ["Query", "Page", "Impressions", "Position"], (row) => [row.query, row.page, row.impressions, row.position.toFixed(1)]),
  "",
  table("Possible CTR opportunities", lowCtr, ["Query", "Page", "Clicks", "Impressions", "CTR", "Position"], (row) => [row.query, row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  table("Pages Google already rewards with impressions", pageLeaders, ["Page", "Clicks", "Impressions", "CTR", "Weighted position"], (row) => [row.page, row.clicks, row.impressions, pct(row.ctr), row.position.toFixed(1)]),
  "",
  "## Possible query cannibalization",
  "",
  ...(cannibalization.length ? cannibalization.slice(0, 30).flatMap((item) => [
    `### ${item.query}`,
    `Total impressions across competing pages: ${item.totalImpressions}`,
    "",
    ...item.pages.map((page) => `- ${page.page} — ${page.impressions} impressions, ${page.clicks} clicks, avg position ${page.position.toFixed(1)}`),
    ""
  ]) : ["No query with meaningful impressions appeared across multiple pages in this export.", ""]),
  "## Recommended workflow",
  "",
  "1. Improve content and internal links first for positions 4–20 where the canonical page already matches intent.",
  "2. Rewrite title and meta description only where a page already earns impressions and CTR is weak for its position.",
  "3. Consolidate or differentiate pages only after confirming genuine query overlap, not merely similar page titles.",
  "4. Prioritize missing media and source depth on the pages Google already exposes most often.",
  "5. Re-export the same dimensions after changes and compare clicks, impressions, CTR and position over the same time window."
].join("\n");

if (output) {
  const out = path.resolve(output);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, report);
  console.log(`Wrote ${out}`);
} else {
  console.log(report);
}

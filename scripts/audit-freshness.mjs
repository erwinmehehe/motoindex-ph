import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const libRoot = path.join(root, "lib");
const now = new Date(process.env.FRESHNESS_NOW || new Date().toISOString());
const strict = process.env.FRESHNESS_STRICT === "1";
const thresholds = {
  marketPriceCheckedAt: 30,
  verifiedAt: 90,
  checkedAt: 90,
  lastChecked: 90,
};
const records = [];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.ts$/.test(entry.name)) out.push(full);
  }
  return out;
}

function ageDays(date) {
  const ms = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(ms) ? Math.floor((now.getTime() - ms) / 86_400_000) : Number.POSITIVE_INFINITY;
}

for (const file of walk(libRoot)) {
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const src = fs.readFileSync(file, "utf8");
  for (const match of src.matchAll(/\b(marketPriceCheckedAt|verifiedAt|checkedAt|lastChecked)\s*:\s*["'](\d{4}-\d{2}-\d{2})["']/g)) {
    const key = match[1];
    const date = match[2];
    const age = ageDays(date);
    const maxAge = thresholds[key];
    records.push({ file: rel, key, date, age, maxAge, overdue: age > maxAge });
  }
}

const overdue = records.filter((row) => row.overdue).sort((a, b) => b.age - a.age);
const severe = overdue.filter((row) => row.age > row.maxAge * 2);
const reportDir = path.join(root, "artifacts");
fs.mkdirSync(reportDir, { recursive: true });
const reportPath = path.join(reportDir, "freshness-report.md");
const lines = [
  "# MotoIndex data freshness report",
  "",
  `Checked: ${now.toISOString()}`,
  `Date fields audited: ${records.length}`,
  `Overdue fields: ${overdue.length}`,
  "",
];
if (overdue.length) {
  lines.push("| File | Field | Checked | Age | Target |", "| --- | --- | ---: | ---: | ---: |");
  for (const row of overdue.slice(0, 200)) lines.push(`| ${row.file} | ${row.key} | ${row.date} | ${row.age} days | ${row.maxAge} days |`);
} else {
  lines.push("All audited source-check dates are within their configured freshness windows.");
}
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`);

console.log(`Freshness audit: ${records.length} dated checks scanned; ${overdue.length} overdue. Report: artifacts/freshness-report.md`);
if (overdue.length) console.warn(overdue.slice(0, 20).map((row) => `${row.file} ${row.key}=${row.date} (${row.age}d > ${row.maxAge}d)`).join("\n"));
if (severe.length || (strict && overdue.length)) process.exit(1);

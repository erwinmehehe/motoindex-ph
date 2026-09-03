import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components"];
const excluded = [
  "/admin/",
  "components/OfferImportPreview.tsx",
];

const banned = [
  [/(?:source[- ]checked|source[- ]backed)/i, "source-checked/source-backed pipeline language"],
  [/(?:canonical model page|indexed catalog surfaces?|thin indexable)/i, "SEO/indexing implementation language"],
  [/(?:current-source gate|source[- ]review gate|verified-data gate|quality gate)/i, "internal data-gate language"],
  [/(?:review-state|research-only|launch build|production build|not in the index)/i, "internal lifecycle/build language"],
  [/(?:planning score|\d+%\s+match|%\s+match|\/100\s+(?:fit|score))/i, "fake recommendation precision"],
  [/(?:without the guesswork|does the math|one magic number|data leaders?|measurable row)/i, "generic AI/startup phrasing"],
  [/(?:stored rack evidence|compatibility graph|exact (?:fitment )?edge|research candidates?|research only)/i, "database/fitment implementation language"],
  [/(?:source status|search demand|keyword variation|search audience|demo data)/i, "internal SEO/data vocabulary"],
  [/(?:\bunlock\b|\bultimate\b|\bseamless\b|\beffortless\b|game[- ]changing|smart choice|make an informed decision|perfect (?:bike|motorcycle))/i, "generic marketing/AI cliche"],
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name).split(path.sep).join("/");
    if (excluded.some(part => full.includes(part))) continue;
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(?:tsx|ts|jsx|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const failures = [];
for (const file of roots.flatMap(walk)) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.trim().startsWith("//")) return;
    for (const [pattern, reason] of banned) {
      if (pattern.test(line)) failures.push(`${file}:${i + 1} — ${reason}\n  ${line.trim()}`);
    }
  });
}

if (failures.length) {
  console.error(`Copy tone validation failed (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Copy tone validation passed: no banned public-facing AI/SEO/pipeline phrases found.");

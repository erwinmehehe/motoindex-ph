// Ensures competing price/spec sources are never emitted as normal dofollow
// outbound links. Their publisher names are allowed because public source
// transparency is intentional.
//
// Run after `next build`.

import fs from "node:fs";
import path from "node:path";

const HOSTS = ["zigwheels.ph", "motortrade.com.ph", "carmudi.com.ph", "motodeal.com.ph", "pinoymotospecs.com", "fasterwheeler.com"];

const roots = ["out", ".next/server/app"].filter(d => fs.existsSync(d));
if (!roots.length) {
  console.error("validate-no-competitors: no build output found — run `npm run build` first.");
  process.exit(1);
}

const failures = [];
let scanned = 0;

function anchorHasCompetitor(anchor) {
  return HOSTS.some(host => anchor.toLowerCase().includes(host));
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!/\.(html|body)$/.test(entry.name)) continue;
    scanned++;
    const text = fs.readFileSync(full, "utf8");
    const anchors = text.match(/<a\b[^>]*>/gi) || [];
    for (const anchor of anchors) {
      if (!anchorHasCompetitor(anchor)) continue;
      if (!/rel=["'][^"']*\bnofollow\b[^"']*["']/i.test(anchor)) {
        failures.push(`${full}: competitor link missing nofollow: ${anchor.slice(0, 220)}`);
      }
    }
  }
}

for (const root of roots) walk(root);

if (failures.length) {
  console.error(`validate-no-competitors: FAIL — ${failures.length} dofollow competitor link(s) in ${scanned} files`);
  for (const f of failures.slice(0, 40)) console.error("  " + f);
  if (failures.length > 40) console.error(`  ...and ${failures.length - 40} more`);
  process.exit(1);
}

console.log(`validate-no-competitors: PASS — ${scanned} rendered files contain no dofollow competitor links`);

// Fails the build if any competing price/spec site is linked or named in the
// rendered output. Grep on source files is not enough: the names arrive from
// data files and are assembled in components, so this checks the HTML that
// actually ships.
//
// Run after `next build`. Retail merchants are not competitors and are allowed.

import fs from "node:fs";
import path from "node:path";

const HOSTS = ["zigwheels.ph", "motortrade.com.ph", "carmudi.com.ph", "motodeal.com.ph", "pinoymotospecs.com", "fasterwheeler.com"];
const NAMES = ["Zigwheels", "ZigWheels", "Motortrade", "MotorTrade", "Carmudi", "MotoDeal", "Motodeal", "PinoyMotoSpecs", "FasterWheeler"];

const roots = ["out", ".next/server/app"].filter(d => fs.existsSync(d));
if (!roots.length) {
  console.error("validate-no-competitors: no build output found — run `npm run build` first.");
  process.exit(1);
}

const failures = [];
let scanned = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(full); continue; }
    if (!/\.(html|rsc|body)$/.test(entry.name)) continue;
    scanned++;
    const text = fs.readFileSync(full, "utf8");
    for (const host of HOSTS) if (text.includes(host)) failures.push(`${full}: links ${host}`);
    // Strip React's comment markers so a name split across them is still caught.
    const flat = text.replace(/<!--\s*-->/g, "");
    for (const name of NAMES) if (flat.includes(name)) failures.push(`${full}: names ${name}`);
  }
}

for (const root of roots) walk(root);

if (failures.length) {
  console.error(`validate-no-competitors: FAIL — ${failures.length} occurrence(s) in ${scanned} files`);
  for (const f of failures.slice(0, 40)) console.error("  " + f);
  if (failures.length > 40) console.error(`  ...and ${failures.length - 40} more`);
  process.exit(1);
}
console.log(`validate-no-competitors: PASS — ${scanned} rendered files clean`);

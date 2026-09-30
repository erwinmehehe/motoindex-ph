import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "motoindex-gsc-"));
const input = path.join(tempDir, "query-page.csv");
const output = path.join(tempDir, "report.md");

const fixture = [
  "query,page,clicks,impressions,ctr,position",
  '"pcx 160 price","https://motoindexph.com/motorcycles/honda/pcx-160/",2,180,1.11%,7.2',
  '"pcx 160 installment","https://www.motoindexph.com/motorcycles/honda/pcx-160?source=test",0,90,0%,9.4',
  '"sniper 155 tire size","https://motoindexph.com/tires/sniper-155-tire-size/",1,80,1.25%,8.1',
  '"sniper 155 tire size","https://motoindexph.com/motorcycles/yamaha/sniper-155/",0,25,0%,11.8',
  '"raider 150 fi specs","https://motoindexph.com/motorcycles/suzuki/raider-r150",3,120,2.5%,5.5',
].join("\n");

try {
  fs.writeFileSync(input, fixture);
  const result = spawnSync(process.execPath, [
    "scripts/gsc-opportunity-report.mjs",
    input,
    "--output", output,
    "--min-impressions", "5"
  ], { cwd: process.cwd(), encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(`GSC report command failed:\n${result.stderr || result.stdout}`);
  }

  const report = fs.readFileSync(output, "utf8");
  const required = [
    "# MotoIndex GSC opportunity report",
    "/motorcycles/honda/pcx-160",
    "Installment & financing",
    "Tire size & fitment",
    "Current SEO-program watchlist found in GSC",
    "### sniper 155 tire size",
    "Total impressions across competing canonical paths: 105"
  ];

  for (const token of required) {
    if (!report.includes(token)) throw new Error(`GSC opportunity self-test missing: ${token}`);
  }

  if (report.includes("www.motoindexph.com/motorcycles/honda/pcx-160?source=test")) {
    throw new Error("GSC opportunity report failed to normalize same-site URL variants.");
  }

  console.log("GSC opportunity report validation passed.");
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

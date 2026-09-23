import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const nextDir = path.join(root, ".next");
const publicDir = path.join(root, "public");

const budgets = {
  cssTotalBytes: 451 * 1024,
  largestJsChunkBytes: 350 * 1024,
  jsTotalBytes: 4 * 1024 * 1024,
  largestPublicImageBytes: 1500 * 1024,
};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function size(file) { return fs.statSync(file).size; }
function kb(value) { return `${(value / 1024).toFixed(1)} KB`; }

if (!fs.existsSync(nextDir)) {
  console.error("Performance budget check requires a completed Next.js build (.next is missing).\nRun npm run build first.");
  process.exit(1);
}

const staticFiles = walk(path.join(nextDir, "static"));
const cssFiles = staticFiles.filter((file) => file.endsWith(".css"));
const jsFiles = staticFiles.filter((file) => file.endsWith(".js"));
const imageFiles = walk(publicDir).filter((file) => /\.(?:png|jpe?g|webp|avif)$/i.test(file));

const cssTotal = cssFiles.reduce((sum, file) => sum + size(file), 0);
const jsTotal = jsFiles.reduce((sum, file) => sum + size(file), 0);
const largestJs = jsFiles.map((file) => ({ file, bytes: size(file) })).sort((a,b) => b.bytes-a.bytes)[0];
const largestImage = imageFiles.map((file) => ({ file, bytes: size(file) })).sort((a,b) => b.bytes-a.bytes)[0];

const failures = [];
if (cssTotal > budgets.cssTotalBytes) failures.push(`Compiled CSS is ${kb(cssTotal)}; budget is ${kb(budgets.cssTotalBytes)}.`);
if (largestJs?.bytes > budgets.largestJsChunkBytes) failures.push(`Largest JS chunk is ${kb(largestJs.bytes)} (${path.relative(root, largestJs.file)}); budget is ${kb(budgets.largestJsChunkBytes)}.`);
if (jsTotal > budgets.jsTotalBytes) failures.push(`Total emitted JS is ${kb(jsTotal)}; budget is ${kb(budgets.jsTotalBytes)}.`);
if (largestImage?.bytes > budgets.largestPublicImageBytes) failures.push(`Largest public raster image is ${kb(largestImage.bytes)} (${path.relative(root, largestImage.file)}); budget is ${kb(budgets.largestPublicImageBytes)}.`);

console.log(`Performance budgets: CSS ${kb(cssTotal)} / ${kb(budgets.cssTotalBytes)}; JS ${kb(jsTotal)} / ${kb(budgets.jsTotalBytes)}; largest JS ${largestJs ? kb(largestJs.bytes) : "0 KB"} / ${kb(budgets.largestJsChunkBytes)}; largest raster ${largestImage ? kb(largestImage.bytes) : "0 KB"} / ${kb(budgets.largestPublicImageBytes)}.`);

if (failures.length) {
  console.error("Performance budget failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Performance budget passed.");

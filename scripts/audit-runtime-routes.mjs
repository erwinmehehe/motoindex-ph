import fs from "node:fs";

const rules = [
  ["app/motorcycles/page.tsx", []],
  ["app/finder/page.tsx", []],
  ["app/dealers/page.tsx", []],
  ["app/search/page.tsx", []],
  ["app/shortlist/page.tsx", []],
  ["app/used-motorcycles/page.tsx", []],
  ["app/deals/page.tsx", []],
  ["app/sellers/[slug]/page.tsx", []],
  ["app/dealers/[city]/page.tsx", []],
];
const forbidden=[/force-dynamic/,/searchParams\s*[:=]/,/from\s+["']@\/lib\/persistent/i,/\bcookies\s*\(/,/\bheaders\s*\(/];
const failures=[];
for(const [file] of rules){
  const source=fs.readFileSync(file,"utf8");
  for(const pattern of forbidden)if(pattern.test(source))failures.push(`${file}: public route contains runtime trigger ${pattern}`);
}
if(failures.length){console.error("Public runtime audit failed:\n- "+failures.join("\n- "));process.exit(1)}
console.log(`Public runtime audit passed: ${rules.length} high-traffic routes avoid known Worker-heavy server triggers.`);

import fs from "node:fs";
import path from "node:path";
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const full=path.join(dir,entry.name);return entry.isDirectory()?walk(full):[full]});}
const pages=walk("app").filter(file=>file.endsWith("page.tsx"));
const rows=[];
for(const file of pages){
  const source=fs.readFileSync(file,"utf8");
  const relative=path.relative("app",path.dirname(file)).replaceAll(path.sep,"/");
  const route=relative===""||relative==="."?"/":`/${relative}`;
  const noindex=/index\s*:\s*false/.test(source);
  const dynamic=/force-dynamic/.test(source);
  const redirect=/permanentRedirect\s*\(/.test(source);
  if(noindex||dynamic||redirect)rows.push({route,noindex,dynamic,redirect});
}
fs.mkdirSync("artifacts",{recursive:true});
fs.writeFileSync("artifacts/indexability-report.md",[`# Indexability report`,``,`App page routes scanned: ${pages.length}`,`Routes needing explicit SEO/runtime review: ${rows.length}`,``,`## Review queue`,...(rows.length?rows.map(row=>`- ${row.route}: ${[row.noindex&&"noindex",row.dynamic&&"force-dynamic",row.redirect&&"permanent redirect"].filter(Boolean).join(", ")}`):["- None"])].join("\n"));
console.log(`Indexability audit complete: ${pages.length} page routes scanned. Report: artifacts/indexability-report.md`);

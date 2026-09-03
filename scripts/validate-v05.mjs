import { loadTypeScript } from "./load-typescript.mjs";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module"; const require=createRequire(import.meta.url); const ts=loadTypeScript();
const root=process.cwd();
const required=[
  "lib/catalog.ts","components/ProductCard.tsx","components/CatalogExplorer.tsx","app/catalog/page.tsx",
  "app/gear/helmets/[brand]/[product]/page.tsx","app/tires/[slug]/[product]/page.tsx","app/accessories/top-box/[product]/page.tsx"
];
for(const f of required){if(!fs.existsSync(path.join(root,f))) throw new Error(`Missing ${f}`)}
const catalog=fs.readFileSync(path.join(root,"lib/catalog.ts"),"utf8");
const counts={helmets:(catalog.match(/id:\"[^\"]+\", brand:/g)||[]).length};
for(const token of ["helmetProducts","tireProducts","topBoxProducts","getTireSizeMatches","allCatalogProducts"]){if(!catalog.includes(token))throw new Error(`Catalog missing ${token}`)}
const sourceFiles=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name).split(path.sep).join("/");if(e.isDirectory())walk(p);else if(/\.(ts|tsx)$/.test(e.name)&&!e.name.endsWith(".d.ts"))sourceFiles.push(p)}}
walk(path.join(root,"app"));walk(path.join(root,"components"));walk(path.join(root,"lib"));
let errors=[];
for(const f of sourceFiles){const text=fs.readFileSync(f,"utf8");const out=ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.Preserve},reportDiagnostics:true,fileName:f});for(const d of out.diagnostics||[]){if(d.category===ts.DiagnosticCategory.Error) errors.push(`${path.relative(root,f).split(path.sep).join("/")}: ${ts.flattenDiagnosticMessageText(d.messageText," ")}`)}}
if(errors.length) throw new Error(errors.join("\n"));
console.log(`v0.5 validation passed: ${sourceFiles.length} TS/TSX source files parsed; required catalog routes present.`);

import fs from "node:fs";
import path from "node:path";
import {execFileSync} from "node:child_process";
import ts from "typescript";
const git=(args)=>execFileSync("git",args,{encoding:"utf8"});
const base=process.env.SEO_BASE_REF || git(["merge-base","HEAD","origin/main"]).trim();
const files=git(["ls-tree","-r","--name-only",base]).trim().split("\n");
const errors=[];
const protectedFiles=files.filter(file=>file.startsWith("lib/") || file.startsWith("data/") || /^(?:next.config.mjs|middleware.ts|app\/(?:robots|sitemap)\.ts)$/.test(file) || file.startsWith("app/sitemaps/"));
for(const file of protectedFiles){if(!fs.existsSync(file)||fs.readFileSync(file,"utf8")!==git(["show",`${base}:${file}`])) errors.push(`Protected SEO/data file changed: ${file}`);}
const routes=files.filter(file=>/^app\/.+\/(?:page|route)\.(?:tsx|ts)$/.test(file)||file==="app/page.tsx");
function contracts(file,source){const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);const found={};for(const node of ast.statements){if(ts.isFunctionDeclaration(node)&&["generateMetadata","generateStaticParams"].includes(node.name?.text))found[node.name.text]=node.getText(ast);if(ts.isVariableStatement(node)){for(const item of node.declarationList.declarations){if(ts.isIdentifier(item.name)&&["metadata","dynamic","revalidate","dynamicParams"].includes(item.name.text))found[item.name.text]=item.getText(ast);}}}return found;}
for(const file of routes){if(!fs.existsSync(file)){errors.push(`Existing route removed: ${file}`);continue;}const before=contracts(file,git(["show",`${base}:${file}`]));const after=contracts(file,fs.readFileSync(file,"utf8"));for(const [key,value] of Object.entries(before))if(after[key]!==value)errors.push(`${file}: ${key} SEO/rendering contract changed`);}
const source=fs.readFileSync("components/wireframe/PriceList.tsx","utf8");if(!source.includes("<table")||!source.includes("<thead")||!source.includes("<tbody"))errors.push("Price list must remain a semantic server-rendered table");
if(fs.existsSync("app/price-list/page.tsx"))errors.push("Use the existing canonical /motorcycles price-list hub");
if(errors.length){console.error(errors.join("\n"));process.exit(1);}console.log(`SEO preservation passed against ${base.slice(0,8)}: ${protectedFiles.length} SEO/data files unchanged; ${routes.length} route and metadata contracts retained.`);

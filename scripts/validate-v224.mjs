import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const fail=m=>{throw new Error(`v2.2.4 nav continuity: ${m}`)};

const layouts=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name).split(path.sep).join("/");if(ent.isDirectory())walk(p);else if(ent.name==="layout.tsx")layouts.push(path.relative(root,p).split(path.sep).join("/"));}}
walk(path.join(root,"app"));
if(layouts.length!==1 || layouts[0]!=="app/layout.tsx") fail(`expected one shared app layout, found ${layouts.join(", ")}`);
const layout=read("app/layout.tsx");
if(!layout.includes("<Header />")||!layout.includes("<Footer />")) fail("root layout must own shared Header and Footer");
const header=read("components/Header.tsx");
const continuity=read("components/HeaderContinuity.tsx");
if(!header.includes("<HeaderContinuity")) fail("shared Header must mount HeaderContinuity");
for(const token of ["usePathname", "removeAttribute(\"open\")", "aria-current", "nav-current", "site-header", "pathname.startsWith(\"/gear/\")"]){if(!continuity.includes(token)) fail(`HeaderContinuity missing ${token}`)}
const css=read("app/research-ux.css");
for(const token of [".nav-links>a.nav-current", ".mobile-menu-panel a.nav-current", ".nav-search.nav-current"]){if(!css.includes(token)) fail(`active-nav CSS missing ${token}`)}
const short=read("components/ShortlistNav.tsx");
if(!short.includes("usePathname")||!short.includes("nav-current")) fail("Shortlist must participate in active navigation state");
console.log("v2.2.4 navigation continuity checks passed");

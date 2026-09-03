const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
function loadTypeScript(){
  try{return require("typescript");}catch{}
  const roots=[];
  if(process.env.NODE_PATH) roots.push(...process.env.NODE_PATH.split(path.delimiter).filter(Boolean));
  try{const npm=process.platform==="win32"?"npm.cmd":"npm";const root=execFileSync(npm,["root","-g"],{encoding:"utf8",stdio:["ignore","pipe","ignore"]}).trim();if(root)roots.push(root);}catch{}
  for(const root of [...new Set(roots)]){const file=path.join(root,"typescript","lib","typescript.js");if(fs.existsSync(file)){try{return require(file);}catch{}}}
  throw new Error("TypeScript is required for validation. Run `npm ci` or install TypeScript globally.");
}
module.exports={loadTypeScript};

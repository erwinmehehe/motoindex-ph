import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { findSiblingDynamicRouteConflicts } from "./route-conflict-guard.mjs";

const root=fs.mkdtempSync(path.join(os.tmpdir(),"motoindex-route-guard-"));
try {
  const app=path.join(root,"app");
  fs.mkdirSync(path.join(app,"tires","[slug]"),{recursive:true});
  fs.mkdirSync(path.join(app,"tires","[brand]"),{recursive:true});
  const conflicts=findSiblingDynamicRouteConflicts(app);
  if(!conflicts.some(c=>c.directory==="tires"&&c.segments.includes("[slug]")&&c.segments.includes("[brand]"))){
    throw new Error("route-conflict guard failed to catch sibling [slug]/[brand] segments");
  }
  fs.rmSync(path.join(app,"tires","[brand]"),{recursive:true,force:true});
  if(findSiblingDynamicRouteConflicts(app).length)throw new Error("route-conflict guard reported a false positive after conflict removal");
  console.log("Route-conflict guard negative test passed.");
} finally { fs.rmSync(root,{recursive:true,force:true}); }

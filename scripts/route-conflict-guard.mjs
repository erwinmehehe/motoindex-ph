import fs from "node:fs";
import path from "node:path";

const dynamicSegment = /^\[(?:\[\.\.\.|\.\.\.)?[^\]]+\]\]?$/;
const segmentKind = (name) => name.startsWith("[[...") ? "optional-catchall" : name.startsWith("[...") ? "catchall" : "dynamic";
const posix = (value) => value.split(path.sep).join("/");

export function findSiblingDynamicRouteConflicts(appDir) {
  const conflicts = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isDirectory());
    const dynamic = entries.filter(entry => dynamicSegment.test(entry.name));
    if (dynamic.length > 1) {
      const byKind = new Map();
      for (const entry of dynamic) {
        const kind = segmentKind(entry.name);
        const names = byKind.get(kind) || [];
        names.push(entry.name);
        byKind.set(kind, names);
      }
      for (const [kind, names] of byKind) {
        if (names.length > 1) conflicts.push({ directory: posix(path.relative(appDir, dir)) || ".", kind, segments: names.sort() });
      }
    }
    for (const entry of entries) walk(path.join(dir, entry.name).split(path.sep).join("/"));
  }
  walk(appDir);
  return conflicts;
}

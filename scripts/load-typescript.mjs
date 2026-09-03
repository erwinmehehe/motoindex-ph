import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function tryRequire(candidate) {
  try { return require(candidate); } catch { return undefined; }
}

export function loadTypeScript() {
  const local = tryRequire("typescript");
  if (local) return local;

  const roots = [];
  if (process.env.NODE_PATH) roots.push(...process.env.NODE_PATH.split(path.delimiter).filter(Boolean));
  try {
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const globalRoot = execFileSync(npm, ["root", "-g"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (globalRoot) roots.push(globalRoot);
  } catch {}

  for (const root of [...new Set(roots)]) {
    const file = path.join(root, "typescript", "lib", "typescript.js");
    if (fs.existsSync(file)) {
      const loaded = tryRequire(file);
      if (loaded) return loaded;
    }
  }

  throw new Error(
    "TypeScript is required for validation. Install project dependencies with `npm ci` or make a global TypeScript installation discoverable via `npm root -g`/NODE_PATH."
  );
}

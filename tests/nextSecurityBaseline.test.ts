import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Next.js production launch security baseline", () => {
  it("accepts reviewed patched 15.x and 16.x releases, but rejects unpatched or unreviewed versions", () => {
    const cases: Array<[string, boolean]> = [
      ["14.2.99", false],
      ["15.4.99", false],
      ["15.5.23", false],
      ["15.5.24", true],
      ["15.5.25", true],
      ["15.6.0", true],
      ["16.0.0", false],
      ["16.3.99", false],
      ["16.4.1", false],
      ["16.4.2", true],
      ["16.4.3", true],
      ["16.5.0", true],
      ["17.0.0", false],
      ["16.4.2-canary.1", false],
      ["^16.4.2", false],
      ["16.4.2.1", false],
      ["", false]
    ];
    const moduleUrl = new URL("../scripts/next-security-baseline.mjs", import.meta.url).href;
    const script = `import { meetsNextSecurityBaseline } from ${JSON.stringify(moduleUrl)};
const versions = ${JSON.stringify(cases.map(([version]) => version))};
process.stdout.write(JSON.stringify(versions.map(meetsNextSecurityBaseline)));`;
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", script], { encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual(cases.map(([, expected]) => expected));
  });

  it("uses the reviewed baseline in the actual production preflight", () => {
    const preflight = readFileSync(new URL("../scripts/check-launch.mjs", import.meta.url), "utf8");
    expect(preflight).toContain('import { meetsNextSecurityBaseline } from "./next-security-baseline.mjs"');
    expect(preflight).toContain("if (!meetsNextSecurityBaseline(nextVersion))");
    expect(preflight).not.toContain("parts[0] === 15 && parts[1] === 5");
  });
});

import assert from "node:assert/strict";
import { waitForChromeDebug } from "./chrome-debug.mjs";

let attempts = 0;
await waitForChromeDebug({
  port: 9222,
  timeoutMs: 200,
  intervalMs: 1,
  probe: async () => ++attempts >= 3,
  isExited: () => false,
  stderr: () => ""
});
assert.equal(attempts, 3, "waits until the debug endpoint is ready");

await assert.rejects(
  waitForChromeDebug({
    port: 9222,
    timeoutMs: 200,
    intervalMs: 1,
    probe: async () => false,
    isExited: () => true,
    stderr: () => "chrome crashed"
  }),
  /Chrome exited before remote debugging was ready.*chrome crashed/s
);

console.log("Chrome debug startup helper tests passed.");

// Read-only production feature verification. Prints boolean assertions, not raw HTML.
const origin = new URL(process.env.BASE_URL || "https://motoindexph.com").origin;
const routes = [
  {
    path: "/",
    checks: {
      buyingGuidesNav: /Buying guides/.test,
      gearNav: />Gear\s*</.test,
      ownershipToolsNav: /Ownership &amp; tools|Ownership & tools/.test,
      canonicalScooterLink: /href=["']\/motorcycles\/scooters/.test,
      newGuideMenu: /nav-popover-guides/.test
    }
  },
  {
    path: "/guides/autosweep-rfid-installation-philippines",
    checks: {
      lastSourceCheck: /Last source check/.test,
      quickAnswer: /Quick answer/.test,
      autosweepChecklist: /Confirm these three things/.test,
      sourceCta: /Visit official Autosweep website/.test
    }
  }
];
let failed = false;
for (const route of routes) {
  const response = await fetch(new URL(route.path, origin), {
    headers: { "cache-control": "no-cache", "user-agent": "MotoIndex-live-release-verifier/1.0" },
    signal: AbortSignal.timeout(15000)
  });
  const html = await response.text();
  const checks = Object.fromEntries(Object.entries(route.checks).map(([name, test]) => [name, test.test(html)]));
  console.log(JSON.stringify({ path: route.path, status: response.status, checks }));
  if (response.status !== 200 || Object.values(checks).some((value) => !value)) failed = true;
  await new Promise((r) => setTimeout(r, 800));
}
if (failed) {
  console.error("Production rendered page did not satisfy all merged feature contracts.");
  process.exitCode = 1;
} else {
  console.log("Production rendered features from PR #532 and PR #535 verified.");
}

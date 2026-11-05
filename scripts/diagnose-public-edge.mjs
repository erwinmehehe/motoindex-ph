// Public, read-only diagnostics for Cloudflare release smoke failures.
// Logs headers and status only. Never prints page HTML, nonce values or secrets.
const origin = new URL(process.env.BASE_URL || "https://motoindexph.com").origin;
const paths = [
  "/deployment-info.json",
  "/",
  "/guides/autosweep-rfid-installation-philippines",
  "/motorcycles",
  "/motorcycles/scooters",
  "/tires",
  "/gear/helmets"
];
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function probe(path) {
  const started = Date.now();
  try {
    const response = await fetch(new URL(path, origin), {
      redirect: "manual",
      headers: {
        "user-agent": "MotoIndex-Release-Edge-Diagnostic/1.0",
        "cache-control": "no-cache"
      },
      signal: AbortSignal.timeout(10000)
    });
    const row = {
      path,
      status: response.status,
      elapsedMs: Date.now() - started,
      contentType: response.headers.get("content-type"),
      cfRay: response.headers.get("cf-ray"),
      cacheStatus: response.headers.get("cf-cache-status"),
      server: response.headers.get("server"),
      location: response.headers.get("location"),
      hasNoSniff: response.headers.get("x-content-type-options") === "nosniff",
      hasHsts: Boolean(response.headers.get("strict-transport-security")),
      referrerPolicy: response.headers.get("referrer-policy"),
      hasCsp: Boolean(response.headers.get("content-security-policy"))
    };
    if (path === "/deployment-info.json" && response.ok) {
      const payload = await response.json().catch(() => null);
      if (payload && typeof payload === "object") {
        row.commit = String(payload.commit || "missing").slice(0, 40);
        row.branch = String(payload.branch || "missing").slice(0, 60);
      }
    } else if (response.status >= 500) {
      // Safe classifier only. Do not print HTML, CSP nonce or user data.
      const body = (await response.text()).slice(0, 1800).toLowerCase();
      row.errorClass = body.includes("error 1102") || body.includes("resource limits")
        ? "worker-resource-limit"
        : body.includes("cloudflare") ? "cloudflare-identified" : "unclassified";
    } else {
      // Drain a small body to avoid leaving an open response stream.
      await response.body?.cancel();
    }
    console.log(JSON.stringify(row));
  } catch (error) {
    console.log(JSON.stringify({
      path, status: "network-error", elapsedMs: Date.now() - started,
      error: error instanceof Error ? error.name : "unknown"
    }));
  }
}

console.log("MotoIndex production edge diagnostics (public GET only): " + origin);
for (let pass = 1; pass <= 2; pass += 1) {
  console.log("Diagnostic pass " + pass);
  for (const path of paths) {
    await probe(path);
    await pause(650);
  }
}

// Read-only production Cloudflare Worker resource diagnosis.
// Prints aggregate invocation metrics and non-sensitive configuration only.
// Do not print raw API responses: they can contain account or binding metadata.
const token = process.env.CLOUDFLARE_API_TOKEN || "";
const account = process.env.CLOUDFLARE_ACCOUNT_ID || "";
if (!token || !account) {
  console.error("Cloudflare diagnostics: production credentials unavailable in this protected job.");
  process.exit(2);
}
const headers = {
  Authorization: "Bearer " + token,
  Accept: "application/json",
  "Content-Type": "application/json"
};
const start = "2026-11-05T03:20:00.000Z";
const end = new Date().toISOString();
const query = `query WorkerResourceMetrics($accountTag: string, $start: string, $end: string, $script: string) {
  viewer {
    accounts(filter: {accountTag: $accountTag}) {
      workersInvocationsAdaptive(limit: 1000, filter: {
        scriptName: $script, datetime_geq: $start, datetime_leq: $end
      }) {
        dimensions { datetime status scriptName }
        sum { requests errors }
        quantiles { cpuTimeP50 cpuTimeP99 }
      }
    }
  }
}`;
try {
  const response = await fetch("https://api.cloudflare.com/client/v4/graphql", {
    method: "POST", headers, body: JSON.stringify({
      query, variables: {accountTag: account, start, end, script: "motoindex-ph"}
    }), signal: AbortSignal.timeout(20000)
  });
  const data = await response.json();
  if (!response.ok || data.errors?.length) {
    console.log(JSON.stringify({phase:"analytics",ok:false,httpStatus:response.status,
      errorCodes: (data.errors || []).map(e=>String(e?.extensions?.code || "unknown")).slice(0,5)
    }));
  } else {
    const rows = data.data?.viewer?.accounts?.flatMap(x=>x.workersInvocationsAdaptive||[]) || [];
    const status = {};
    let maxP99 = 0;
    for (const r of rows) {
      const name = String(r.dimensions?.status || "unknown");
      const x = status[name] || {samples:0, requests:0, errors:0};
      x.samples++;
      x.requests+=Number(r.sum?.requests||0);
      x.errors+=Number(r.sum?.errors||0);
      status[name]=x;
      maxP99=Math.max(maxP99,Number(r.quantiles?.cpuTimeP99||0));
    }
    console.log(JSON.stringify({phase:"analytics",ok:true,periodStart:start,periodEnd:end,
      aggregateRows:rows.length,status,maxCpuP99Ms:maxP99}));
  }
} catch (e) { console.log(JSON.stringify({phase:"analytics",ok:false,error:e instanceof Error?e.name:"unknown"})); }
try {
  const url = "https://api.cloudflare.com/client/v4/accounts/"+encodeURIComponent(account)+"/workers/scripts/motoindex-ph/settings";
  const response = await fetch(url, {headers,signal:AbortSignal.timeout(15000)});
  const data = await response.json();
  const config = data?.result || {};
  console.log(JSON.stringify({phase:"worker-settings",ok:response.ok&&data?.success,
    httpStatus:response.status,
    cpuLimitMs:config?.limits?.cpu_ms??null,
    usageModel:config?.usage_model??null,
    observabilityEnabled:config?.observability?.enabled??null,
    bindingsCount:Array.isArray(config?.bindings)?config.bindings.length:undefined
  }));
} catch(e) { console.log(JSON.stringify({phase:"worker-settings",ok:false,error:e instanceof Error?e.name:"unknown"})); }

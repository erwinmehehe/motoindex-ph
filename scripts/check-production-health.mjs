const base=new URL(process.env.BASE_URL||"https://motoindexph.com");
const routes=["/","/motorcycles","/recommendations","/finder","/tires","/gear/helmets","/motorcycles/honda","/motorcycles/honda/click-160","/motorcycles/yamaha/aerox-v3","/dealers","/search","/used-motorcycles"];
const failures=[];
await Promise.all(routes.map(async path=>{
  const started=Date.now();
  try{
    const response=await fetch(new URL(path,base),{redirect:"manual",headers:{"cache-control":"no-cache"},signal:AbortSignal.timeout(12_000)});
    const ms=Date.now()-started;
    const body=response.status>=500?await response.clone().text().catch(()=>""):"";
    if(response.status>=500||response.status===0)failures.push(`${path}: HTTP ${response.status}`);
    if(/error\s*1102|worker exceeded resource limits/i.test(body))failures.push(`${path}: Cloudflare 1102 resource limit`);
    if(ms>9000)failures.push(`${path}: ${ms}ms response time`);
    console.log(`${response.status} ${String(ms).padStart(5)}ms ${path}`);
  }catch(error){failures.push(`${path}: ${error instanceof Error?error.message:String(error)}`);}
}));
if(failures.length){console.error("Production health check failed:\n- "+failures.join("\n- "));process.exit(1)}
console.log(`Production health check passed for ${routes.length} critical routes.`);

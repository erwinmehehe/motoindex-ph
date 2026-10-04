type AccessPayload={
  aud?:string|string[];
  email?:string;
  exp?:number;
  iat?:number;
  iss?:string;
  type?:string;
  [key:string]:unknown;
};

type AccessJwk=JsonWebKey & {kid?:string};

let jwksCache:{expiresAt:number;keys:AccessJwk[]}|null=null;

function decodeBase64Url(value:string){
  const normalized=value.replace(/-/g,"+").replace(/_/g,"/");
  const padded=normalized+"=".repeat((4-normalized.length%4)%4);
  const binary=atob(padded);
  return Uint8Array.from(binary,char=>char.charCodeAt(0));
}

function decodeJson<T>(value:string):T|null{
  try{
    const bytes=decodeBase64Url(value);
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  }catch{return null;}
}

function normalizeTeamDomain(value:string){
  const trimmed=value.trim().replace(/^https?:\/\//,"").replace(/\/$/,"");
  return trimmed;
}

async function accessKeys(teamDomain:string){
  const now=Date.now();
  if(jwksCache&&jwksCache.expiresAt>now)return jwksCache.keys;
  const response=await fetch(`https://${teamDomain}/cdn-cgi/access/certs`,{headers:{"Accept":"application/json"}});
  if(!response.ok)throw new Error("Cloudflare Access JWKS unavailable.");
  const body=await response.json() as {keys?:AccessJwk[]};
  if(!Array.isArray(body.keys)||!body.keys.length)throw new Error("Cloudflare Access JWKS empty.");
  jwksCache={expiresAt:now+5*60*1000,keys:body.keys};
  return body.keys;
}

function audienceMatches(aud:string|string[]|undefined,expected:string){
  if(!aud)return false;
  return Array.isArray(aud)?aud.includes(expected):aud===expected;
}

function allowedEmails(){
  return new Set((process.env.ADMIN_ACCESS_EMAILS||"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean));
}

export function cloudflareAccessConfigured(){
  return Boolean(
    normalizeTeamDomain(process.env.CF_ACCESS_TEAM_DOMAIN||"") &&
    process.env.CF_ACCESS_AUD &&
    allowedEmails().size
  );
}

export async function verifyCloudflareAccess(request:Request){
  const teamDomain=normalizeTeamDomain(process.env.CF_ACCESS_TEAM_DOMAIN||"");
  const expectedAud=(process.env.CF_ACCESS_AUD||"").trim();
  const allowlist=allowedEmails();
  if(!teamDomain||!expectedAud||!allowlist.size)return {ok:false,error:"Cloudflare Access is not configured."} as const;

  const token=(request.headers.get("cf-access-jwt-assertion")||"").trim();
  const assertedEmail=(request.headers.get("cf-access-authenticated-user-email")||"").trim().toLowerCase();
  if(!token||!assertedEmail)return {ok:false,error:"Cloudflare Access identity missing."} as const;

  const parts=token.split(".");
  if(parts.length!==3)return {ok:false,error:"Cloudflare Access token malformed."} as const;
  const header=decodeJson<{alg?:string;kid?:string}>(parts[0]);
  const payload=decodeJson<AccessPayload>(parts[1]);
  if(!header||header.alg!=="RS256"||!header.kid||!payload)return {ok:false,error:"Cloudflare Access token invalid."} as const;

  const now=Math.floor(Date.now()/1000);
  if(!payload.exp||payload.exp<=now)return {ok:false,error:"Cloudflare Access token expired."} as const;
  if(payload.iat&&payload.iat>now+60)return {ok:false,error:"Cloudflare Access token timestamp invalid."} as const;
  if(!audienceMatches(payload.aud,expectedAud))return {ok:false,error:"Cloudflare Access audience mismatch."} as const;
  const expectedIssuer=`https://${teamDomain}`;
  if(payload.iss&&payload.iss.replace(/\/$/,"")!==expectedIssuer)return {ok:false,error:"Cloudflare Access issuer mismatch."} as const;

  const email=(typeof payload.email==="string"?payload.email:"").trim().toLowerCase();
  if(!email||email!==assertedEmail||!allowlist.has(email))return {ok:false,error:"Administrative identity is not allowed."} as const;

  try{
    const keys=await accessKeys(teamDomain);
    const jwk=keys.find(key=>key.kid===header.kid);
    if(!jwk)return {ok:false,error:"Cloudflare Access signing key not found."} as const;
    const key=await crypto.subtle.importKey("jwk",jwk,{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["verify"]);
    const data=new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature=decodeBase64Url(parts[2]);
    const valid=await crypto.subtle.verify("RSASSA-PKCS1-v1_5",key,signature,data);
    if(!valid)return {ok:false,error:"Cloudflare Access signature invalid."} as const;
  }catch{
    return {ok:false,error:"Cloudflare Access verification failed."} as const;
  }

  return {ok:true,email} as const;
}

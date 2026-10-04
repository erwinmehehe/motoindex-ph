export type AdminAuthMode = "basic" | "cloudflare-access";

export function adminAuthMode():AdminAuthMode {
  return process.env.ADMIN_AUTH_MODE === "cloudflare-access" ? "cloudflare-access" : "basic";
}

export function adminAccessAllowedEmails(){
  return new Set(
    (process.env.ADMIN_ACCESS_ALLOWED_EMAILS || "")
      .split(",")
      .map(value=>value.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function normalizeAdminAccessEmail(value:string|null){
  return (value || "").trim().toLowerCase();
}

export function cloudflareAccessIdentity(headers:Headers){
  return {
    email: normalizeAdminAccessEmail(headers.get("cf-access-authenticated-user-email")),
    assertion: (headers.get("cf-access-jwt-assertion") || "").trim()
  };
}

export function adminAccessIdentityAllowed(headers:Headers){
  const {email,assertion}=cloudflareAccessIdentity(headers);
  const allowed=adminAccessAllowedEmails();
  return Boolean(email && assertion && allowed.size && allowed.has(email));
}

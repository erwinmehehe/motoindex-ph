const configuredBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim().replace(/\/+$/, "");

export const publicApiBaseUrl = configuredBase;
export const publicApiConfigured = Boolean(configuredBase);

export function backendUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${configuredBase}${normalized}`;
}

const DAY_MS = 86_400_000;

export const commerceFreshDays = 30;

export function utcDayStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parseStrictIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) return null;
  return parsed;
}

export function commerceAgeDays(observedAt: string, now = new Date()) {
  const parsed = parseStrictIsoDate(observedAt);
  if (!parsed) return Number.POSITIVE_INFINITY;
  return Math.round((utcDayStart(now).getTime() - parsed.getTime()) / DAY_MS);
}

export function isFreshCommerceDate(observedAt: string, maxAgeDays = commerceFreshDays, now = new Date()) {
  const age = commerceAgeDays(observedAt, now);
  return Number.isFinite(age) && age >= 0 && age <= maxAgeDays;
}

export function commerceFreshnessWindow(now = new Date(), maxAgeDays = commerceFreshDays) {
  const today = utcDayStart(now);
  const upper = new Date(now);
  const lower = new Date(today.getTime() - Math.max(0, maxAgeDays) * DAY_MS);
  return { lower, upper };
}

export function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isProductSpecificCommerceUrl(value: string) {
  if (!isHttpsUrl(value)) return false;
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const lower = path.toLowerCase();
    if (path === "/") return false;
    if (/\/(?:collections?|categories?)(?:\/|$)/.test(lower)) return false;
    if (/^\/(?:shop|store|products?)$/.test(lower)) return false;
    return true;
  } catch {
    return false;
  }
}

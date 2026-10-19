import { publicAnalyticsAllowed, safePageviewUrl } from "@/lib/analyticsConfig";

type EventValue = string | number | boolean;

// #466: never forward arbitrary event fields. In particular, a search query,
// form value, buyer identifier or bearer URL must not reach GA4/Plausible even
// if a future caller or environment flag accidentally supplies it.
const identifierKeys = new Set([
  "model_id", "id", "a", "b", "c", "product_id",
  "merchant", "placement", "category", "action", "source", "type",
  "brand", "make", "tool",
]);
const countKeys = new Set(["count", "query_length", "results", "result_count"]);
const flagKeys = new Set(["available", "zero_results"]);

function safeIdentifier(value: string) {
  return value.length <= 48
    && /^[a-z][a-z0-9]*(?:[-_][a-z0-9]+)*$/.test(value)
    && !/\d{7,}/.test(value)
    && !/[a-z0-9]{20,}/.test(value)
    && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value);
}

/** Accept only reviewed, non-personal event metadata. Unknown keys fail closed. */
export function safeAnalyticsEventParams(params: Record<string, EventValue>) {
  const approved: Record<string, EventValue> = {};
  for (const [key, value] of Object.entries(params)) {
    if (identifierKeys.has(key)) {
      if (typeof value === "string" && safeIdentifier(value)) approved[key] = value;
    } else if (countKeys.has(key)) {
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 1_000_000) approved[key] = value;
    } else if (flagKeys.has(key)) {
      if (typeof value === "boolean" || value === 0 || value === 1) approved[key] = value;
    }
  }
  return approved;
}

/** Send only approved non-personal custom events from explicit public routes. */
export function trackEvent(name: string, params: Record<string, EventValue> = {}) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE !== "true") return;
  if (typeof window === "undefined" || !publicAnalyticsAllowed(window.location.pathname)) return;
  if (!/^[a-z][a-z0-9_]{1,63}$/.test(name)) return;
  const pathname = window.location.pathname;
  const safeUrl = safePageviewUrl(window.location.origin, pathname);
  if (!safeUrl) return;
  const approved = safeAnalyticsEventParams(params);
  const w = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: unknown) => void;
  };
  w.gtag?.("event", name, { ...approved, page_location: safeUrl, page_path: pathname });
  w.plausible?.(name, { props: approved, url: safeUrl });
}

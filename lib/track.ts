import { publicAnalyticsAllowed, safePageviewUrl } from "@/lib/analyticsConfig";

/** Custom events inherit no private query strings or tokens from current URLs. */
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !publicAnalyticsAllowed(window.location.pathname)) return;
  const pathname = window.location.pathname;
  const safeUrl = safePageviewUrl(window.location.origin, pathname);
  if (!safeUrl) return;
  const w = window as typeof window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: unknown) => void;
  };
  w.gtag?.("event", name, { ...params, page_location: safeUrl, page_path: pathname });
  w.plausible?.(name, { props: params, url: safeUrl });
}

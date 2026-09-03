export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void; plausible?: (event: string, options?: unknown) => void };
  w.gtag?.("event", name, params);
  w.plausible?.(name, { props: params });
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { plausibleSiteScriptUrl, publicAnalyticsAllowed, safePageviewUrl } from "@/lib/analyticsConfig";

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  plausible?: ((event: string, options?: unknown) => void) & {
    init?: (options: { autoCapturePageviews: boolean }) => void;
  };
};

/**
 * The owner-supplied GA4 loader and initial 'config' live in app/layout.tsx's
 * <head>. Never initialize another gtag or send another initial page_view here.
 * Only public-to-public SPA route changes receive sanitized manual pageviews.
 */
export function Analytics() {
  const pathname = usePathname();
  const publicRoute = publicAnalyticsAllowed(pathname);
  const ga = "G-20TKY10EPQ";
  const trackingEnabled = process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE === "true";
  const plausibleScript = trackingEnabled ? plausibleSiteScriptUrl(process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC) : "";
  const [plausibleInitialized, setPlausibleInitialized] = useState(false);
  const [plausibleLoaded, setPlausibleLoaded] = useState(false);
  const previousGaPath = useRef<string | null>(null);
  const lastPlausiblePath = useRef("");

  // Disable GA4 after transitions to private routes. The root <head> tag
  // follows the owner's standard snippet, so full-document private landings
  // and browser-history events still require independent privacy QA.
  useEffect(() => {
    (window as unknown as Record<string, unknown>)[`ga-disable-${ga}`] = !publicRoute;
    const previous = previousGaPath.current;
    previousGaPath.current = pathname;
    // The standard Google tag automatically sends the first page_view.
    // Do not send another pageview during hydration or same-path rerenders.
    if (previous === null || previous === pathname || !publicRoute || !pathname) return;
    const url = safePageviewUrl(window.location.origin, pathname);
    if (!url) return;
    (window as AnalyticsWindow).gtag?.("event", "page_view", {
      page_location: url,
      page_path: pathname,
      page_title: document.title,
    });
  }, [ga, pathname, publicRoute]);

  useEffect(() => {
    if (!publicRoute) lastPlausiblePath.current = "";
    if (!plausibleScript || !plausibleLoaded || !publicRoute || !pathname || lastPlausiblePath.current === pathname) return;
    const url = safePageviewUrl(window.location.origin, pathname);
    if (!url) return;
    lastPlausiblePath.current = pathname;
    (window as AnalyticsWindow).plausible?.("pageview", { url });
  }, [plausibleScript, plausibleLoaded, publicRoute, pathname]);

  return <>
    {publicRoute && plausibleScript && <>
      <Script id="motoindex-plausible-init" strategy="afterInteractive" onReady={() => setPlausibleInitialized(true)}>{
        "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};window.plausible.init=window.plausible.init||function(options){window.plausible.o=options||{}};window.plausible.init({autoCapturePageviews:false});"
      }</Script>
      {plausibleInitialized && <Script src={plausibleScript} strategy="afterInteractive" onReady={() => setPlausibleLoaded(true)} />}
    </>}
  </>;
}

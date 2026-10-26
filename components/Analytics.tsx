"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { googleAnalyticsMeasurementId, plausibleSiteScriptUrl, publicAnalyticsAllowed, safePageviewUrl } from "@/lib/analyticsConfig";

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  plausible?: ((event: string, options?: unknown) => void) & {
    init?: (options: { autoCapturePageviews: boolean }) => void;
  };
};

/** Report manual, query-free pageviews on public routes only. */
export function Analytics() {
  const pathname = usePathname();
  const publicRoute = publicAnalyticsAllowed(pathname);
  // GA4 tag is owner-requested in the document <head>. A third-party loader is
  // appended only on public routes to avoid network calls on private landings.
  // Plausible and other custom events retain their separate release opt-in.
  const trackingEnabled = process.env.NEXT_PUBLIC_ANALYTICS_SAFE_ENABLE === "true";
  const ga = googleAnalyticsMeasurementId("G-20TKY10EPQ");
  const plausibleScript = trackingEnabled ? plausibleSiteScriptUrl(process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC) : "";
  const [gaInitialized, setGaInitialized] = useState(false);
  const [plausibleInitialized, setPlausibleInitialized] = useState(false);
  const [plausibleLoaded, setPlausibleLoaded] = useState(false);
  const lastGaPath = useRef("");
  const lastPlausiblePath = useRef("");

  // Scripts persist after SPA navigation. Disable GA for private routes too.
  // GA4 Enhanced Measurement history-pageviews must ALSO be disabled in GA4.
  useEffect(() => {
    if (!ga) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${ga}`] = !publicRoute;
    if (!publicRoute) lastGaPath.current = "";
  }, [ga, publicRoute]);

  useEffect(() => {
    if (!ga || !publicRoute) return;
    const w = window as AnalyticsWindow;
    // The inline <head> bootstrap normally creates this queue. Initialize it
    // here as a fallback if a strict document CSP suppressed the inline tag.
    if (!w.gtag) {
      w.dataLayer = w.dataLayer || [];
      w.gtag = (...args: unknown[]) => { w.dataLayer?.push(args); };
      w.gtag("js", new Date());
      w.gtag("config", ga, { send_page_view: false, anonymize_ip: true });
    }
    if (!document.head.querySelector('script[data-motoindex-ga4-loader]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      script.dataset.motoindexGa4Loader = "true";
      document.head.appendChild(script);
    }
    setGaInitialized(true);
  }, [ga, publicRoute]);

  useEffect(() => {
    if (!ga || !gaInitialized || !publicRoute || !pathname || lastGaPath.current === pathname) return;
    const url = safePageviewUrl(window.location.origin, pathname);
    if (!url) return;
    lastGaPath.current = pathname;
    (window as AnalyticsWindow).gtag?.("event", "page_view", {
      page_location: url,
      page_path: pathname,
      page_title: document.title,
    });
  }, [ga, gaInitialized, publicRoute, pathname]);

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

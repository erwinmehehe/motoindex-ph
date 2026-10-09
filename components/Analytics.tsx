"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { googleAnalyticsMeasurementId, plausibleSiteScriptUrl, publicAnalyticsAllowed, safePageviewUrl } from "@/lib/analyticsConfig";

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  plausible?: ((event: string, options?: unknown) => void) & {
    init?: (options: { autoCapturePageviews: boolean }) => void;
  };
};

/** Report manual, query-free pageviews on public routes only. */
export function Analytics() {
  const pathname = usePathname();
  const publicRoute = publicAnalyticsAllowed(pathname);
  const ga = googleAnalyticsMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const plausibleScript = plausibleSiteScriptUrl(process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC);
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
    {publicRoute && ga && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`} strategy="afterInteractive" />
      <Script id="motoindex-ga" strategy="afterInteractive" onReady={() => setGaInitialized(true)}>{
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga)},{anonymize_ip:true,send_page_view:false});`
      }</Script>
    </>}
    {publicRoute && plausibleScript && <>
      <Script id="motoindex-plausible-init" strategy="afterInteractive" onReady={() => setPlausibleInitialized(true)}>{
        "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};window.plausible.init=window.plausible.init||function(options){window.plausible.o=options||{}};window.plausible.init({autoCapturePageviews:false});"
      }</Script>
      {plausibleInitialized && <Script src={plausibleScript} strategy="afterInteractive" onReady={() => setPlausibleLoaded(true)} />}
    </>}
  </>;
}

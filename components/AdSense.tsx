"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { adsenseClientId, adsenseEnabled } from "@/lib/adsense";
import { publicAnalyticsAllowed } from "@/lib/analyticsConfig";

export function AdSense() {
  const pathname = usePathname();
  const clientId = adsenseClientId();
  if (!publicAnalyticsAllowed(pathname) || !adsenseEnabled() || !clientId) return null;
  return <Script
    id="motoindex-adsense"
    async
    strategy="afterInteractive"
    crossOrigin="anonymous"
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
  />;
}

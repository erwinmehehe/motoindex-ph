import Script from "next/script";
import { adsenseClientId, adsenseEnabled } from "@/lib/adsense";

export function AdSense() {
  const clientId = adsenseClientId();

  if (!adsenseEnabled() || !clientId) return null;

  return <Script
    id="motoindex-adsense"
    async
    strategy="beforeInteractive"
    crossOrigin="anonymous"
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
  />;
}

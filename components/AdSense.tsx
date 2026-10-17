import Script from "next/script";
import { adsenseClientId, adsenseEnabled } from "@/lib/adsense";

/**
 * The existing publisher bootstrap must stay in the document head.
 * It is entirely absent unless the owner explicitly enables advertising at build time.
 * Any opt-in also requires consent and public-to-private navigation QA (issue #466).
 */
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

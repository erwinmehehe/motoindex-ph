import Script from "next/script";
import { adsenseClientId } from "@/lib/adsense";

export function AdSense() {
  const clientId = adsenseClientId();
  const enabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

  if (!enabled || !clientId) return null;

  return <Script
    id="motoindex-adsense"
    async
    strategy="afterInteractive"
    crossOrigin="anonymous"
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
  />;
}

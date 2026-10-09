import Script from "next/script";
import { googleAnalyticsMeasurementId } from "@/lib/analyticsConfig";

export function Analytics() {
  // Analytics must be an explicit deployment decision. Never silently fall back
  // to a hardcoded property ID when a stage or production variable is absent.
  const ga = googleAnalyticsMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  return <>
    {ga && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`} strategy="afterInteractive"/>
      <Script id="motoindex-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga)},{anonymize_ip:true});`}</Script>
    </>}
    {plausible && <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive"/>}
  </>;
}

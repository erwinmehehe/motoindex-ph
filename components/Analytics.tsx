import Script from "next/script";

export function Analytics() {
  // GA4 property for motoindexph.com. Hardcoded because a measurement ID is public
  // by design — it ships in the page source either way. An env var can still
  // override it (e.g. for a staging property).
  const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-20TKY10EPQ";
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return <>
    {ga&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive"/><Script id="motoindex-ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}</Script></>}
    {plausible&&<Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive"/>}
  </>;
}

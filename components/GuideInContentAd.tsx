"use client";

import { useEffect, useRef } from "react";
import { adsenseClientId, adsenseEnabled } from "@/lib/adsense";

const AD_CLIENT = "ca-pub-1900865456140693";
const AD_SLOT = "6431580274";

type AdSenseWindow = Window & {
  adsbygoogle?: { push: (request: Record<string, never>) => unknown };
};

/**
 * Manual display-ad placement for long-form editorial guides only.
 *
 * The global AdSense bootstrap already lives in components/AdSense.tsx.
 * Do not add the Google script a second time in this component.
 * Advertising remains off until an operator explicitly enables it after
 * the account, consent, CSP and private-route checks in issue #466.
 */
export function GuideInContentAd() {
  const adRef = useRef<HTMLModElement>(null);
  const enabled = adsenseEnabled() && adsenseClientId() === AD_CLIENT;

  useEffect(() => {
    const element = adRef.current;
    if (!enabled || !element) return;

    // Strict Mode can run effects twice; Google cannot initialize one <ins> twice.
    if (element.dataset.motoindexAdRequested === "true" || element.dataset.adsbygoogleStatus) return;
    element.dataset.motoindexAdRequested = "true";

    try {
      const adWindow = window as AdSenseWindow;
      const queue = adWindow.adsbygoogle ?? ([] as Record<string, never>[]);
      adWindow.adsbygoogle = queue;
      queue.push({});
    } catch (error) {
      delete element.dataset.motoindexAdRequested;
      console.error("MotoIndex AdSense guide unit initialization failed", error);
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside aria-label="Advertisement" style={{ clear: "both", width: "100%", minWidth: 0, margin: "2rem auto", padding: "0.75rem 0", overflow: "hidden" }}>
      <span style={{ display: "block", marginBottom: "0.75rem", color: "#5f6972", fontSize: "0.75rem", lineHeight: 1.4, textAlign: "center" }}>Advertisement</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 250 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

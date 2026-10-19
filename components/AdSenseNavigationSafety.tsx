"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { adsenseEnabled } from "@/lib/adsense";
import { isAdSenseGuideDocument } from "@/lib/adsenseGuideCsp";

/**
 * AdSense's loaded script stays in the document after Next.js SPA navigation.
 * Before entering OR leaving an ad-supported guide, navigate to a fresh HTML
 * document with the correct (strict guide or private) CSP.
 *
 * Ordinary navigation stays SPA-fast when ads are disabled, and between
 * pages that have never loaded AdSense.
 */
export function AdSenseNavigationSafety() {
  const pathname = usePathname();

  useEffect(() => {
    if (!adsenseEnabled()) return;
    const hasAdScript = () => Boolean(
      document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
    );

    const forceDocumentBoundary = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
      let next: URL;
      try { next = new URL(anchor.href, window.location.href); } catch { return; }
      if (next.origin !== window.location.origin || !/^https?:$/.test(next.protocol)) return;
      const now = new URL(window.location.href);
      if (next.pathname === now.pathname && next.search === now.search) return; // anchor jumps are safe
      if (!isAdSenseGuideDocument(next.pathname) && !isAdSenseGuideDocument(now.pathname) && !hasAdScript()) return;

      // Intercept before Next's <Link> click handler: the browser must apply
      // the new document's CSP before any private URL becomes visible.
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(next.href);
    };

    document.addEventListener("click", forceDocumentBoundary, true);
    return () => document.removeEventListener("click", forceDocumentBoundary, true);
  }, []);

  // Guard programmatic router navigation and history changes as a fallback.
  // The approved release still requires real browser-network QA of this path.
  useEffect(() => {
    if (!adsenseEnabled() || !pathname || isAdSenseGuideDocument(pathname)) return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      window.location.replace(window.location.href);
    }
  }, [pathname]);

  return null;
}

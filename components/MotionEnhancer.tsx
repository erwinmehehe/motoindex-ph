"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Keep motion at the section level. Individual product cards, catalog rows and
   utility tiles stay visible immediately so long pages do not feel like a
   dashboard assembling itself as the rider scrolls. */
const revealSelector = [
  ".mi-section-head",
  ".mi-showcase-cta",
  ".mi-final > .shell > *",
  ".page-head",
  ".model-hero-grid > *",
  ".section-head"
].join(",");

function siblingDelay(node: HTMLElement) {
  const parent = node.parentElement;
  if (!parent) return 0;
  const peers = Array.from(parent.children).filter((child) => (child as HTMLElement).matches?.(revealSelector));
  const index = Math.max(0, peers.indexOf(node));
  return Math.min(index * 70, 210);
}

export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      nodes.forEach((node) => { node.dataset.reveal = "visible"; });
      return;
    }

    nodes.forEach((node) => {
      node.dataset.reveal = "pending";
      node.style.setProperty("--reveal-delay", `${siblingDelay(node)}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target as HTMLElement;
        node.dataset.reveal = "visible";
        observer.unobserve(node);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

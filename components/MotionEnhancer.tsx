"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".mi-section-head",
  ".mi-brand-grid > a",
  ".mi-model-grid > *",
  ".mi-category-grid > *",
  ".mi-tool-grid > *",
  ".mi-product-grid > *",
  ".mi-showcase-cta",
  ".mi-final > .shell > *",
  ".page-head",
  ".model-hero-grid > *",
  ".section > *",
  ".guide-strip > *",
  ".list-cards > *",
  ".topic-grid > *",
  ".helmet-grid > *",
  ".priority-model-brief-grid > *",
  ".spec-grid > *",
  ".health-summary > *"
].join(",");

function siblingDelay(node: HTMLElement) {
  const parent = node.parentElement;
  if (!parent) return 0;
  const peers = Array.from(parent.children).filter((child) => (child as HTMLElement).matches?.(revealSelector));
  const index = Math.max(0, peers.indexOf(node));
  return Math.min(index * 90, 450);
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
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}

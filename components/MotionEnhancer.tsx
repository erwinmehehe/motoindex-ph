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

export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    // Content must never depend on IntersectionObserver to become visible.
    // Hover, gradient and component-level motion remain, but public sections
    // render fully visible from the first frame for users, crawlers and QA.
    document.querySelectorAll<HTMLElement>(revealSelector).forEach((node) => {
      node.dataset.reveal = "visible";
      node.style.removeProperty("--reveal-delay");
    });
  }, [pathname]);

  return null;
}

import type { ReactNode } from "react";

export function ProductGrid({ children, className = "", density = "standard" }: { children: ReactNode; className?: string; density?: "standard" | "compact" | "reference" }) {
  const densityClass = density === "compact" ? " ui-product-grid--compact" : density === "reference" ? " ui-product-grid--reference" : "";
  return <div className={`ui-product-grid${densityClass} ${className}`.trim()}>{children}</div>;
}

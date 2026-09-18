import type { ReactNode } from "react";

export function ProductGrid({ children, className = "", density = "standard" }: { children: ReactNode; className?: string; density?: "standard" | "compact" }) {
  const densityClass = density === "compact" ? " ui-product-grid--compact" : "";
  return <div className={`ui-product-grid${densityClass} ${className}`.trim()}>{children}</div>;
}

import type { ReactNode } from "react";

export function ProductGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-product-grid ${className}`.trim()}>{children}</div>;
}

import type { ReactNode } from "react";

export function CTAGroup({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ui-cta-group ${className}`.trim()}>{children}</div>;
}

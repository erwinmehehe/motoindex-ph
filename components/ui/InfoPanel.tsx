import type { ReactNode } from "react";

export function InfoPanel({ children, subtle = false, className = "" }: { children: ReactNode; subtle?: boolean; className?: string }) {
  return <aside className={`ui-info-panel${subtle ? " ui-info-panel--subtle" : ""} ${className}`.trim()}>{children}</aside>;
}

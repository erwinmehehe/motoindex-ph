import type { ReactNode } from "react";

export function DataTable({ children, label, className = "", innerClassName = "" }: { children: ReactNode; label?: string; className?: string; innerClassName?: string }) {
  return <div className={`ui-data-table ${className}`.trim()} role="table" aria-label={label}>
    <div className={`ui-data-table__inner ${innerClassName}`.trim()}>{children}</div>
  </div>;
}

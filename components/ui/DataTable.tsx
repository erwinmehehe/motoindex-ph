import type { ReactNode } from "react";

export function DataTable({ children, label, className = "" }: { children: ReactNode; label?: string; className?: string }) {
  return <div className={`ui-data-table ${className}`.trim()} role="table" aria-label={label}>
    <div className="ui-data-table__inner">{children}</div>
  </div>;
}

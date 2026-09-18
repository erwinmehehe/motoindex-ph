import type { ReactNode } from "react";

export type StatRowItem = { label: ReactNode; value: ReactNode; note?: ReactNode };

export function StatRow({ items, className = "" }: { items: StatRowItem[]; className?: string }) {
  return <div className={`ui-stat-row ${className}`.trim()}>
    {items.map((item,index)=><div className="ui-stat-row__item" key={index}>
      <span className="ui-stat-row__label">{item.label}</span>
      <strong className="ui-stat-row__value">{item.value}</strong>
      {item.note && <small className="ui-stat-row__note">{item.note}</small>}
    </div>)}
  </div>;
}

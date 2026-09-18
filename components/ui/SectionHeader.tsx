import type { ReactNode } from "react";

export function SectionHeader({ kicker, title, description, aside, titleId, className = "" }: { kicker?: ReactNode; title: ReactNode; description?: ReactNode; aside?: ReactNode; titleId?: string; className?: string }) {
  return <header className={`ui-section-header ${className}`.trim()}>
    <div className="ui-section-header__copy">
      {kicker && <span className="ui-section-header__kicker">{kicker}</span>}
      <h2 id={titleId}>{title}</h2>
      {description && <p className="ui-section-header__description">{description}</p>}
    </div>
    {aside && <div className="ui-section-header__aside">{aside}</div>}
  </header>;
}

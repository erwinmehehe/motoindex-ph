import type { ReactNode } from "react";

export function PageHero({ kicker, title, description, actions, className = "" }: { kicker?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return <header className={`ui-page-hero ${className}`.trim()}>
    {kicker && <span className="ui-page-hero__kicker">{kicker}</span>}
    <h1>{title}</h1>
    {description && <p className="ui-page-hero__description">{description}</p>}
    {actions && <div className="ui-page-hero__actions">{actions}</div>}
  </header>;
}

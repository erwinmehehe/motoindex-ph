// Public source attribution. Every visible source can be inspected by the reader.
// Links to competing price/spec sites use nofollow while manufacturer, government
// and other reference links remain normal outbound citations.

import { isCompetitorSource } from "@/lib/competitors";
export { isCompetitorSource, sourceDisplayName } from "@/lib/competitors";

type Props = {
  url?: string;
  label: string;
  className?: string;
  arrow?: boolean;
};

function relFor(url?: string) {
  return url && isCompetitorSource(url) ? "nofollow noreferrer" : "noreferrer";
}

export function SourceRef({ url, label, className, arrow = true }: Props) {
  if (!url) return <span className={className ? `source-ref ${className}` : "source-ref"}>{label}</span>;
  return (
    <a className={className} href={url} target="_blank" rel={relFor(url)}>
      {label}{arrow ? " ↗" : ""}
    </a>
  );
}

export function SourceCard({ url, className, children }: { url?: string; className?: string; children: React.ReactNode }) {
  if (!url) return <div className={className ? `${className} source-ref-card` : "source-ref-card"}>{children}</div>;
  return <a className={className} href={url} target="_blank" rel={relFor(url)}>{children}</a>;
}

export function SourceOpen({ url, as = "em", label = "Open source" }: { url?: string; as?: "em" | "b"; label?: string }) {
  if (!url) return null;
  const Tag = as;
  return <Tag>{label} ↗</Tag>;
}

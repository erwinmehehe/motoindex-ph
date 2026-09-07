// Source attribution that names a source without always linking to it.
//
// MotoIndex cites where each price and specification came from — that is the
// point of the site. But several of those sources are competing price/spec
// aggregators, and a dofollow link from every model page is free marketing and
// free link equity for them.
//
// So: competitor sources are named as plain text, everything else stays a normal
// outbound link. Manufacturers, official brand sites, government references and
// retail/affiliate destinations are unaffected — those links are useful to the
// reader and cost nothing competitively.
//
// The host list and the generic-naming rules live in lib/competitors.ts, which
// is also imported by the client-boundary sanitizer.

import { isCompetitorSource } from "@/lib/competitors";
export { isCompetitorSource, sourceDisplayName } from "@/lib/competitors";

type Props = {
  url?: string;
  label: string;
  className?: string;
  /** Appended to the link text only when the source is actually linked. */
  arrow?: boolean;
};

export function SourceRef({ url, label, className, arrow = true }: Props) {
  if (!url || isCompetitorSource(url)) {
    return <span className={className ? `source-ref ${className}` : "source-ref"}>{label}</span>;
  }
  return (
    <a className={className} href={url} target="_blank" rel="noreferrer">
      {label}{arrow ? " ↗" : ""}
    </a>
  );
}

// Wrapper for source cards whose whole body is the clickable area. Renders a
// plain container instead of an anchor when the destination is a competitor, so
// the card still shows the source name and figures without linking out.
export function SourceCard({ url, className, children }: { url?: string; className?: string; children: React.ReactNode }) {
  if (!url || isCompetitorSource(url)) {
    return <div className={className ? `${className} source-ref-card` : "source-ref-card"}>{children}</div>;
  }
  return <a className={className} href={url} target="_blank" rel="noreferrer">{children}</a>;
}

// The "Open source ↗" affordance inside a SourceCard. Renders nothing when the
// card is not actually a link, so an unlinked competitor card does not invite a
// click that does nothing.
export function SourceOpen({ url, as = "em", label = "Open source" }: { url?: string; as?: "em" | "b"; label?: string }) {
  if (!url || isCompetitorSource(url)) return null;
  const Tag = as;
  return <Tag>{label} ↗</Tag>;
}

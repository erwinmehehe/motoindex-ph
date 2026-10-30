import Image from "next/image";
import Link from "next/link";

export function EntityVerificationFallback({ brand, model, href, className = "media-verification-fallback", kind = "motorcycle", keyword }: {
  brand: string;
  model: string;
  href?: string;
  className?: string;
  kind?: "motorcycle" | "helmet" | "tire" | "topbox";
  keyword?: string;
}) {
  const labels = { motorcycle: "motorcycle", helmet: "helmet", tire: "tire", topbox: "top box" } as const;
  const label = `${brand} ${model} ${labels[kind]} image placeholder`;
  const accessibleLabel = keyword ? `${label} for ${keyword}` : label;
  const content = <Image src={`/media/placeholders/${kind}.svg`} alt={keyword ? accessibleLabel : ""} width={1200} height={1200} />;
  return href
    ? <Link className={className} href={href} aria-label={`View ${keyword || `${brand} ${model}`}`}>{content}</Link>
    : <div className={className} role={keyword ? undefined : "img"} aria-label={keyword ? undefined : accessibleLabel}>{content}</div>;
}

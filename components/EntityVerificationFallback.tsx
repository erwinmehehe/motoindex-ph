import Image from "next/image";
import Link from "next/link";

export function EntityVerificationFallback({ brand, model, href, className = "media-verification-fallback", kind = "motorcycle" }: {
  brand: string;
  model: string;
  href?: string;
  className?: string;
  kind?: "motorcycle" | "helmet" | "tire" | "topbox";
}) {
  const labels = { motorcycle: "motorcycle", helmet: "helmet", tire: "tire", topbox: "top box" } as const;
  const content = <Image src={`/media/placeholders/${kind}.svg`} alt="" width={1200} height={1200} />;
  return href
    ? <Link className={className} href={href} aria-label={`View ${brand} ${model}`}>{content}</Link>
    : <div className={className} role="img" aria-label={`${brand} ${model} ${labels[kind]} image placeholder`}>{content}</div>;
}

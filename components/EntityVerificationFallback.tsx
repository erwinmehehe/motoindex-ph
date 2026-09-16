import Image from "next/image";
import Link from "next/link";

export function EntityVerificationFallback({ brand, model, href, className = "media-verification-fallback" }: {
  brand: string;
  model: string;
  href?: string;
  className?: string;
}) {
  const content = <Image src="/media/placeholders/motorcycle.svg" alt="" width={1200} height={1200} />;
  return href
    ? <Link className={className} href={href} aria-label={`View ${brand} ${model}`}>{content}</Link>
    : <div className={className} role="img" aria-label={`${brand} ${model} motorcycle image placeholder`}>{content}</div>;
}

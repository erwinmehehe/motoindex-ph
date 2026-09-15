import Link from "next/link";

export function EntityVerificationFallback({ brand, model, href, className = "media-verification-fallback" }: {
  brand: string;
  model: string;
  href?: string;
  className?: string;
}) {
  const content = <>
    <span className="sr-only">{brand} {model}</span>
    <div aria-hidden="true">◇</div>
    <small>Image being verified</small>
  </>;
  return href
    ? <Link className={className} href={href} aria-label={`View ${brand} ${model}`}>{content}</Link>
    : <div className={className} aria-label={`${brand} ${model} image being verified`}>{content}</div>;
}

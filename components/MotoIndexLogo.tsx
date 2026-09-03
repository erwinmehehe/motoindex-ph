import Link from "next/link";

export function MotoIndexLogo({ className = "" }: { className?: string }) {
  return <Link className={`brand ${className}`.trim()} href="/" aria-label="MotoIndex PH home">
    <img className="brand-logo" src="/brand/motoindex-mark.svg" alt="MotoIndex PH logo" width="38" height="38" />
    <span className="brand-word">MotoIndex <b>PH</b></span>
  </Link>;
}

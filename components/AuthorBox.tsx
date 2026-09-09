import Link from "next/link";
import { AUTHOR_BIO, AUTHOR_NAME, AUTHOR_PATH, AUTHOR_ROLE } from "@/lib/author";

export function AuthorBox({ label = "Written and reviewed by" }: { label?: string }) {
  return <aside className="author-box" aria-label="About the author">
    <div className="author-avatar" aria-hidden="true">EV</div>
    <div className="author-box-copy">
      <span>{label}</span>
      <h2><Link href={AUTHOR_PATH}>{AUTHOR_NAME}</Link></h2>
      <strong>{AUTHOR_ROLE} · MotoIndex Philippines</strong>
      <p>{AUTHOR_BIO}</p>
      <div className="author-box-links">
        <Link href={AUTHOR_PATH}>About the author →</Link>
        <Link href="/methodology">Editorial methodology →</Link>
        <Link href="/corrections">Report a correction →</Link>
      </div>
    </div>
  </aside>;
}

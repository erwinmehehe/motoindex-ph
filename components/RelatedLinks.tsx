import Link from "next/link";

export type RelatedLink = { href: string; title: string; description?: string; eyebrow?: string };

export function RelatedLinks({ title = "Keep researching", intro, links }: { title?: string; intro?: string; links: RelatedLink[] }) {
  if (!links.length) return null;
  return <section className="related-links" aria-labelledby="related-links-title">
    <div className="section-head compact"><div><h2 id="related-links-title">{title}</h2>{intro && <p>{intro}</p>}</div></div>
    <div className="related-link-grid">
      {links.map(link => <Link href={link.href} key={`${link.href}-${link.title}`}>
        <strong>{link.title}</strong>{link.description && <small>{link.description}</small>}<b>Open →</b>
      </Link>)}
    </div>
  </section>;
}

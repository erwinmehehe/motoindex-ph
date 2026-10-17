import styles from "./ArticleJumpLinks.module.css";

/** Same stable anchor generator is used by nav and the corresponding H2. */
export function articleSectionId(heading: string, index: number) {
  const slug = heading.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return "section-" + (index + 1) + "-" + (slug || "details");
}

export function ArticleJumpLinks({ sections }: { sections: readonly { heading: string }[] }) {
  if (sections.length < 2) return null;
  return <nav className={styles.toc} aria-label="Article sections" data-article-jump-links>
    <strong>In this article</strong>
    <ul>{sections.map((section, index) => <li key={articleSectionId(section.heading, index)}>
      <a href={"#" + articleSectionId(section.heading, index)}>{section.heading}</a>
    </li>)}</ul>
  </nav>;
}

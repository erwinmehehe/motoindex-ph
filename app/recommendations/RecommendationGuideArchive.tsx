import Link from "next/link";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { isIndexableRecommendation, recommendationGuides } from "@/lib/data";
import type { RecommendationGuide } from "@/lib/types";
import styles from "./recommendation-archive.module.css";

const featuredSlugs = [
  "motorcycles-under-100k",
  "best-scooters-philippines",
  "best-motorcycles-for-daily-commute-philippines",
  "best-motorcycles-for-short-riders",
  "motorcycles-with-abs-philippines",
  "fuel-efficient-motorcycles-philippines"
] as const;

function archiveGroup(guide: RecommendationGuide) {
  if (/(yamaha|honda|kawasaki|suzuki|ktm|cfmoto)/.test(guide.slug)) {
    return "Brand and model families";
  }
  if (guide.intent === "budget") return "Budget and price";
  if (guide.intent === "fit" || guide.intent === "use-case") return "Rider fit and use";
  return "Categories and engine classes";
}

export function RecommendationGuideArchive() {
  const guides = recommendationGuides.filter((guide) => isIndexableRecommendation(guide.slug));
  if (!guides.length) return null;

  const featuredSet = new Set<string>(featuredSlugs);
  const featured = featuredSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is RecommendationGuide => Boolean(guide));
  const remaining = guides.filter((guide) => !featuredSet.has(guide.slug));
  const groups = [...remaining.reduce((map, guide) => {
    const label = archiveGroup(guide);
    const list = map.get(label) || [];
    list.push(guide);
    map.set(label, list);
    return map;
  }, new Map<string, RecommendationGuide[]>()).entries()];

  return <section className={styles.archive} aria-labelledby="recommendation-guides-heading" data-recommendation-archive>
    <div className={`shell ${styles.inner}`}>
      <header className={styles.header}>
        <span>Focused buying research</span>
        <h2 id="recommendation-guides-heading">Motorcycle buying guides</h2>
        <p>Start with the most useful buying questions. The full guide library remains grouped below by budget, rider needs, motorcycle type and model family.</p>
      </header>

      <div className={styles.featuredGrid} data-recommendation-featured-grid>
        {featured.map((guide) => <article className={styles.featuredCard} key={guide.slug} data-recommendation-guide-card>
          <Link href={`/recommendations/${guide.slug}`} aria-label={`Read ${guide.title}`} className={styles.artLink}>
            <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact />
          </Link>
          <div className={styles.featuredCopy}>
            <span className={styles.kicker}>{guide.kicker}</span>
            <h3><Link href={`/recommendations/${guide.slug}`}>{guide.title}</Link></h3>
            <p>{guide.description}</p>
            <Link className={styles.link} href={`/recommendations/${guide.slug}`} aria-label={`Read ${guide.title}`}>Read guide <span aria-hidden="true">→</span></Link>
          </div>
        </article>)}
      </div>

      {remaining.length > 0 && <div className={styles.library} data-recommendation-guide-library>
        <div className={styles.libraryHead}>
          <div><span>Full guide library</span><h3>Browse {remaining.length} more focused guides</h3></div>
          <p>Grouped for faster scanning instead of presenting every URL as another large card.</p>
        </div>
        <div className={styles.groups}>
          {groups.map(([label, items], index) => <details className={styles.group} key={label} open={index === 0}>
            <summary><span>{label}</span><b>{items.length}</b></summary>
            <div className={styles.groupLinks}>
              {items.map((guide) => <Link href={`/recommendations/${guide.slug}`} key={guide.slug} data-recommendation-archive-link>
                <span>{guide.kicker}</span>
                <strong>{guide.title}</strong>
                <em aria-hidden="true">→</em>
              </Link>)}
            </div>
          </details>)}
        </div>
      </div>}
    </div>
  </section>;
}

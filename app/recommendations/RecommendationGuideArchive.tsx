import Link from "next/link";
import { GuideFeaturedArt } from "@/components/GuideFeaturedArt";
import { isIndexableRecommendation, recommendationGuides } from "@/lib/data";
import styles from "./recommendation-archive.module.css";

export function RecommendationGuideArchive() {
  const guides = recommendationGuides.filter((guide) => isIndexableRecommendation(guide.slug));
  if (!guides.length) return null;

  return <section className={styles.archive} aria-labelledby="recommendation-guides-heading">
    <div className={`shell ${styles.inner}`}>
      <header className={styles.header}>
        <span>Focused buying research</span>
        <h2 id="recommendation-guides-heading">Motorcycle buying guides</h2>
        <p>These original MotoIndex guides answer specific buying questions about budget, rider fit, commuting, fuel economy, braking, scooters, underbones and larger motorcycles.</p>
      </header>
      <div className={styles.grid}>
        {guides.map((guide) => <article className={styles.card} key={guide.slug}>
          <Link href={`/recommendations/${guide.slug}`} aria-label={`Read ${guide.title}`} style={{ display: "block", marginBottom: 16 }}>
            <GuideFeaturedArt slug={guide.slug} title={guide.title} kicker={guide.kicker} compact />
          </Link>
          <span className={styles.kicker}>{guide.kicker}</span>
          <h3><Link href={`/recommendations/${guide.slug}`}>{guide.title}</Link></h3>
          <p>{guide.description}</p>
          <Link className={styles.link} href={`/recommendations/${guide.slug}`} aria-label={`Read ${guide.title}`}>Read guide <span aria-hidden="true">→</span></Link>
        </article>)}
      </div>
    </div>
  </section>;
}

import Link from "next/link";
import { MotoIndexLogo } from "@/components/MotoIndexLogo";
import { comparisons, motorcycles, isIndexableComparison, isIndexableModel } from "@/lib/data";
import styles from "./Footer.module.css";

const hasModels = motorcycles.some(isIndexableModel);
const hasComparisons = comparisons.some((comparison) => isIndexableComparison(comparison.slug));

export function Footer() {
  return <footer className={styles.footer}>
    <div className={`${styles.inner} ${styles.links}`}>
      <div className={styles.about}>
        <MotoIndexLogo className={styles.brand} />
        <p>Motorcycle prices, buyer guidance, gear and ownership tools for the Philippines.</p>
        <small>Use MotoIndex to narrow the decision, then verify price, stock and the exact unit before purchase.</small>
      </div>
      <div className={styles.column}>
        <strong>Explore</strong>
        {hasModels && <Link href="/motorcycles">Motorcycles</Link>}
        {hasModels && <Link href="/finder">Finder</Link>}
        {hasComparisons && <Link href="/compare">Compare</Link>}
        <Link href="/gear/helmets">Gear</Link>
        <Link href="/dealers">Dealers</Link>
      </div>
      <div className={styles.column}>
        <strong>Guides</strong>
        <Link href="/guides">All guides</Link>
        <Link href="/recommendations">Buying</Link>
        <Link href="/ownership">Ownership</Link>
        <Link href="/maintenance">Maintenance</Link>
        <Link href="/motorcycles/electric">Electric</Link>
      </div>
      <div className={styles.column}>
        <strong>Tools</strong>
        <Link href="/tools">All tools</Link>
        <Link href="/ownership/cost-calculator">Cost to own</Link>
        <Link href="/tools/motorcycle-loan-calculator">Loan calculator</Link>
        <Link href="/fitment">Fitment</Link>
        <Link href="/commute/cost-calculator">Commute cost</Link>
      </div>
      <div className={styles.column}>
        <strong>About</strong>
        <Link href="/about">About MotoIndex</Link>
        <Link href="/authors/erwin-valles">Author</Link>
        <Link href="/methodology">Methodology</Link>
        <Link href="/data-sources">Data sources</Link>
        <Link href="/corrections">Corrections</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
    <div className={`${styles.inner} ${styles.note}`}>
      <span>© 2026 MotoIndex PH</span>
      <span><Link href="/editorial-policy">Editorial policy</Link> · <Link href="/affiliate-disclosure">Affiliate disclosure</Link> · <Link href="/privacy">Privacy</Link></span>
    </div>
  </footer>;
}

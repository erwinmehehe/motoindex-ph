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
        <p>Motorcycle prices, specs, fitment, gear and ownership tools for the Philippines.</p>
        <small>Check the source and date on price-sensitive information.</small>
      </div>
      <div className={styles.column}>
        <strong>Browse</strong>
        {hasModels && <Link href="/motorcycles">Motorcycles</Link>}
        {hasModels && <Link href="/finder">Finder</Link>}
        {hasComparisons && <Link href="/compare">Compare</Link>}
        <Link href="/guides">Guides</Link>
        <Link href="/research">Research</Link>
      </div>
      <div className={styles.column}>
        <strong>Gear</strong>
        <Link href="/gear/helmets">Helmets</Link>
        <Link href="/tires">Tires</Link>
        <Link href="/accessories">Accessories</Link>
      </div>
      <div className={styles.column}>
        <strong>Ownership</strong>
        <Link href="/ownership">Ownership hub</Link>
        <Link href="/tools">Tools</Link>
        <Link href="/maintenance">Maintenance</Link>
        {hasModels && <Link href="/fitment">Fitment finder</Link>}
      </div>
      <div className={styles.column}>
        <strong>About</strong>
        <Link href="/about">About MotoIndex</Link>
        <Link href="/authors/erwin-valles">Author: Erwin Valles</Link>
        <Link href="/methodology">Methodology</Link>
        <Link href="/editorial-policy">Editorial policy</Link>
        <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </div>
    <div className={`${styles.inner} ${styles.note}`}>
      <span>© 2026 MotoIndex PH</span>
      <span>Prices and availability can change. Verify before purchase.</span>
    </div>
  </footer>;
}

import Link from "next/link";
import { MotoIndexLogo } from "@/components/MotoIndexLogo";
import { comparisons, motorcycles, recommendationGuides, isIndexableComparison, isIndexableModel, isIndexableRecommendation } from "@/lib/data";
const hasModels=motorcycles.some(isIndexableModel);
const hasComparisons=comparisons.some(c=>isIndexableComparison(c.slug));
const hasGuides=recommendationGuides.some(g=>isIndexableRecommendation(g.slug));
export function Footer() {
  return <footer className="footer">
    <div className="shell footer-grid">
      <div className="footer-about"><MotoIndexLogo className="footer-brand"/><p>Motorcycle prices, specs, fitment, gear and ownership tools for the Philippines.</p><small>Check the source and date on price-sensitive information.</small></div>
      <div><strong>Browse</strong>{hasModels&&<Link href="/motorcycles">Motorcycles</Link>}{hasModels&&<Link href="/finder">Finder</Link>}{hasComparisons&&<Link href="/compare">Compare</Link>}{hasGuides&&<Link href="/recommendations">Guides</Link>}<Link href="/commute">Commute</Link></div>
      <div><strong>Gear</strong><Link href="/gear/helmets">Helmets</Link><Link href="/tires">Tires</Link><Link href="/accessories">Accessories</Link></div>
      <div><strong>Ownership & tools</strong><Link href="/ownership">Ownership</Link>{hasModels&&<Link href="/fitment">Fitment finder</Link>}<Link href="/tools">All tools</Link><Link href="/tools/motorcycle-loan-calculator">Loan calculator</Link><Link href="/tools/lto-registration-fee-calculator">LTO fee calculator</Link><Link href="/tools/motorcycle-insurance-calculator">Insurance calculator</Link><Link href="/maintenance">Maintenance</Link><Link href="/ownership/registration-renewal">Registration renewal</Link></div>
      <div><strong>About MotoIndex</strong><Link href="/about">About</Link><Link href="/methodology">Methodology</Link><Link href="/data-sources">Data sources</Link><Link href="/editorial-policy">Editorial policy</Link><Link href="/affiliate-disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/corrections">Corrections</Link><Link href="/contact">Contact</Link></div>
    </div>
    <div className="shell footer-note"><span>© 2026 MotoIndex PH</span><span>Prices and availability can change. Verify before purchase.</span></div>
  </footer>;
}

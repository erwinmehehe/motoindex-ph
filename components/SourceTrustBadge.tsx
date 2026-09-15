import { sourceTrustKind, sourceTrustLabels } from "@/lib/sourceTrust";
import styles from "./SourceTrustBadge.module.css";

export function SourceTrustBadge({
  label,
  url,
  needsRecheck = false,
  historical = false,
  compact = false,
}: {
  label?: string;
  url?: string;
  needsRecheck?: boolean;
  historical?: boolean;
  compact?: boolean;
}) {
  const kind = sourceTrustKind({ label, url, needsRecheck, historical });
  return <span
    className={`${styles.badge} ${styles[kind]} ${compact ? styles.compact : ""}`}
    data-source-trust={kind}
    title={label || sourceTrustLabels[kind]}
  >
    <span className={styles.dot} aria-hidden="true" />
    {sourceTrustLabels[kind]}
  </span>;
}

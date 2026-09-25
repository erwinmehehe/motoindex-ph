type TrustSource = {
  url?: string;
  label: string;
};

type Props = {
  status: "verified" | string;
  sourceLabel?: string;
  source?: TrustSource;
  secondarySource?: TrustSource;
  lastChecked?: string;
  statusLabel?: string;
};

export function ProductTrustRow({ status, sourceLabel, source, secondarySource, lastChecked, statusLabel }: Props) {
  return <div className="product-trust-row" aria-label="Product data status and sources">
    <span className={`product-trust-status ${status === "verified" ? "verified" : "pending"}`}>
      {statusLabel || (status === "verified" ? "Verified product data" : "Needs checking")}
    </span>
    {sourceLabel && <span>{sourceLabel}</span>}
    {source?.url && <a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>}
    {secondarySource?.url && <a href={secondarySource.url} target="_blank" rel="noreferrer">{secondarySource.label} ↗</a>}
    {lastChecked && <span>Checked {lastChecked}</span>}
  </div>;
}

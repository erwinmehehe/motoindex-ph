import { SourceRef } from "@/components/SourceRef";

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
};

export function ProductTrustRow({ status, sourceLabel, source, secondarySource, lastChecked }: Props) {
  return <div className="product-trust-row" aria-label="Product data source">
    <span className={`product-trust-status ${status === "verified" ? "verified" : "pending"}`}>
      {status === "verified" ? "Verified product data" : "Needs checking"}
    </span>
    {sourceLabel && <span className="product-trust-label">{sourceLabel}</span>}
    {source && <SourceRef url={source.url} label={source.label} />}
    {secondarySource && <SourceRef url={secondarySource.url} label={secondarySource.label} />}
    {lastChecked && <small>Updated {lastChecked}</small>}
  </div>;
}

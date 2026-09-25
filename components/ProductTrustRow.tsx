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

export function ProductTrustRow({ status, lastChecked, statusLabel }: Props) {
  return <div className="product-trust-row" aria-label="Product data status">
    <span className={`product-trust-status ${status === "verified" ? "verified" : "pending"}`}>
      {statusLabel || (status === "verified" ? "Verified product data" : "Needs checking")}
    </span>
    {lastChecked && <span>Checked {lastChecked}</span>}
  </div>;
}

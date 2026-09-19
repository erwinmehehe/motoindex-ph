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

export function ProductTrustRow({ status }: Props) {
  return <div className="product-trust-row" aria-label="Product data status">
    <span className={`product-trust-status ${status === "verified" ? "verified" : "pending"}`}>
      {status === "verified" ? "Verified product data" : "Needs checking"}
    </span>
  </div>;
}

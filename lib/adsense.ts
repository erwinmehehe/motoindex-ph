const publisherIdPattern = /^pub-\d{16}$/;
const clientIdPattern = /^ca-pub-\d{16}$/;

// Preserve the account already pinned by the site's publisher-readiness contract.
// These are public AdSense identifiers, not secret API credentials.
const defaultPublisherId = "pub-1900865456140693";
const defaultClientId = "ca-pub-1900865456140693";

export function adsensePublisherId() {
  const value = process.env.ADSENSE_PUBLISHER_ID?.trim() || defaultPublisherId;
  return publisherIdPattern.test(value) ? value : null;
}

export function adsenseClientId() {
  const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() || defaultClientId;
  return clientIdPattern.test(value) ? value : null;
}

// Preserve the existing approved bootstrap, but never load AdSense implicitly.
// The operator must explicitly enable it after consent and private-route QA.
export function adsenseEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(adsenseClientId());
}

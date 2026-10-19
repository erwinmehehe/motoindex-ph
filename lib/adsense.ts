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

// Preserve the publisher integration, but fail closed even when someone sets
// NEXT_PUBLIC_ADSENSE_ENABLED=true before #466 consent, CSP and private-route QA.
// A future separately reviewed PR must explicitly wire the second release gate
// after evidence is attached. The production workflow currently does NOT set it.
export function adsenseEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true"
    && process.env.NEXT_PUBLIC_ADSENSE_RELEASE_GATES_APPROVED === "true"
    && Boolean(adsenseClientId());
}

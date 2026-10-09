const publisherIdPattern = /^pub-\d{16}$/;
const clientIdPattern = /^ca-pub-\d{16}$/;

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

export function adsenseEnabled() {
  // Monetization and cookie-bearing ad scripts require explicit operator opt-in.
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(adsenseClientId());
}

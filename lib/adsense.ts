const publisherIdPattern = /^pub-\d{16}$/;
const clientIdPattern = /^ca-pub-\d{16}$/;

/** Do not publish an ads.txt seller record for an unverified account. */
export function adsensePublisherId() {
  const value = (process.env.ADSENSE_PUBLISHER_ID || "").trim();
  return publisherIdPattern.test(value) ? value : null;
}

/** Client ID is public, but must be explicitly provided by an operator. */
export function adsenseClientId() {
  const value = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "").trim();
  return clientIdPattern.test(value) ? value : null;
}

/** Strict opt-in; unset or malformed configuration never loads advertising. */
export function adsenseEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(adsenseClientId());
}

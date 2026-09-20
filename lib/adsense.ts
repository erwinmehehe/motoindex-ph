const publisherIdPattern = /^pub-\d{16}$/;
const clientIdPattern = /^ca-pub-\d{16}$/;

export function adsensePublisherId() {
  const value = process.env.ADSENSE_PUBLISHER_ID?.trim();
  return value && publisherIdPattern.test(value) ? value : null;
}

export function adsenseClientId() {
  const value = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();
  return value && clientIdPattern.test(value) ? value : null;
}

export function adsenseEnabled() {
  return process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" && Boolean(adsenseClientId());
}

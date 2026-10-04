import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export function newActionToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashActionToken(token) };
}

export function hashActionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function actionLinkSecret() {
  return process.env.ACTION_LINK_SECRET || "";
}

export function actionLinkSecretConfigured() {
  return actionLinkSecret().length >= 32;
}

export function signedUnsubscribeToken(subscriptionId: string) {
  const secret = actionLinkSecret();
  if (!secret) throw new Error("ACTION_LINK_SECRET is not configured.");
  const signature = createHmac("sha256", secret).update(`price-alert-unsubscribe:${subscriptionId}`).digest("base64url");
  return `${subscriptionId}.${signature}`;
}

export function verifySignedUnsubscribeToken(raw: string) {
  const secret = actionLinkSecret();
  if (!secret || raw.length > 256) return null;
  const dot = raw.indexOf(".");
  if (dot < 1) return null;
  const subscriptionId = raw.slice(0, dot);
  const signature = raw.slice(dot + 1);
  if (!/^[A-Za-z0-9_-]+$/.test(subscriptionId) || !/^[A-Za-z0-9_-]+$/.test(signature)) return null;
  const expected = createHmac("sha256", secret).update(`price-alert-unsubscribe:${subscriptionId}`).digest("base64url");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return subscriptionId;
}

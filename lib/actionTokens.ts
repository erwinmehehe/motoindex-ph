import { createHash, randomBytes } from "node:crypto";

export function actionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashActionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function validActionToken(token: string) {
  return /^[A-Za-z0-9_-]{32,256}$/.test(token);
}

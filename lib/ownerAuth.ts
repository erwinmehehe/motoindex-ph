import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export const OWNER_SESSION_COOKIE = "motoindex_owner_session";
const MAGIC_LINK_MINUTES = 20;

function senderEmail() {
  return process.env.OWNER_AUTH_FROM_EMAIL || process.env.PRICE_ALERT_FROM_EMAIL || "";
}

export function ownerAuthConfigured() {
  return Boolean(
    process.env.GARAGE_CLOUD_SYNC_ENABLED === "true" &&
    databaseConfigured() &&
    process.env.RESEND_API_KEY &&
    senderEmail()
  );
}

export function normalizeOwnerEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().slice(0, 160);
}

export function validOwnerEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ownerToken() {
  return randomBytes(32).toString("base64url");
}

export function hashOwnerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionDays() {
  const raw = Number(process.env.OWNER_SESSION_DAYS || 30);
  if (!Number.isFinite(raw)) return 30;
  return Math.max(1, Math.min(90, Math.round(raw)));
}

export function ownerSessionExpiry() {
  return new Date(Date.now() + sessionDays() * 24 * 60 * 60 * 1000);
}

export function ownerMagicLinkExpiry() {
  return new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000);
}

export function setOwnerSessionCookie(response: NextResponse, token: string, expires: Date) {
  response.cookies.set({
    name: OWNER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export function clearOwnerSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: OWNER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function ownerSessionTokenFromCookies() {
  const store = await cookies();
  return store.get(OWNER_SESSION_COOKIE)?.value || "";
}

export async function getOwnerSession() {
  if (!ownerAuthConfigured()) return null;
  const raw = await ownerSessionTokenFromCookies();
  if (!raw) return null;
  const tokenHash = hashOwnerToken(raw);
  const row = await prisma.ownerSession.findUnique({
    where: { tokenHash },
    include: { owner: true },
  });
  if (!row) return null;
  if (row.expiresAt.getTime() <= Date.now()) {
    await prisma.ownerSession.delete({ where: { id: row.id } }).catch(() => {});
    return null;
  }
  return row;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char] || char));
}

export async function sendOwnerMagicLink(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderEmail();
  if (!apiKey || !from) throw new Error("Owner email delivery is not configured.");
  const verifyUrl = absoluteUrl(`/garage/sign-in/verify/${encodeURIComponent(token)}`);
  const safeUrl = escapeHtml(verifyUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Sign in to MotoIndex My Garage",
      text: `Open this link to sign in to MotoIndex My Garage: ${verifyUrl}\n\nThe link expires in ${MAGIC_LINK_MINUTES} minutes and can be used once. If you did not request it, ignore this email.`,
      html: `<p>Open the secure link below to sign in to MotoIndex My Garage.</p><p><a href="${safeUrl}">Continue to My Garage</a></p><p>This link expires in ${MAGIC_LINK_MINUTES} minutes and can be used once. If you did not request it, ignore this email.</p>`,
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Owner email delivery failed (${response.status})${detail ? `: ${detail.slice(0, 160)}` : ""}`);
  }
}

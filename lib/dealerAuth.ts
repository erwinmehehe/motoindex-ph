import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { databaseConfigured, prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

export const DEALER_SESSION_COOKIE = "motoindex_dealer_session";
const MAGIC_LINK_MINUTES = 20;

function senderEmail() {
  return process.env.DEALER_AUTH_FROM_EMAIL || process.env.OWNER_AUTH_FROM_EMAIL || process.env.PRICE_ALERT_FROM_EMAIL || "";
}

export function dealerAuthConfigured() {
  return Boolean(
    process.env.DEALER_PORTAL_ENABLED === "true" &&
    databaseConfigured() &&
    process.env.RESEND_API_KEY &&
    senderEmail()
  );
}

export function normalizeDealerEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase().slice(0, 160) : "";
}

export function validDealerEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function dealerRequestOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}

export function dealerToken() {
  return randomBytes(32).toString("base64url");
}

export function hashDealerToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionDays() {
  const raw = Number(process.env.DEALER_SESSION_DAYS || 30);
  return Number.isFinite(raw) ? Math.max(1, Math.min(90, Math.round(raw))) : 30;
}

export function dealerSessionExpiry() {
  return new Date(Date.now() + sessionDays() * 24 * 60 * 60 * 1000);
}

export function dealerMagicLinkExpiry() {
  return new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000);
}

export function setDealerSessionCookie(response: NextResponse, token: string, expires: Date) {
  response.cookies.set({
    name: DEALER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export function clearDealerSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: DEALER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function dealerSessionTokenFromCookies() {
  const store = await cookies();
  return store.get(DEALER_SESSION_COOKIE)?.value || "";
}

export async function getDealerSession() {
  if (!dealerAuthConfigured()) return null;
  const raw = await dealerSessionTokenFromCookies();
  if (!raw) return null;
  const row = await prisma.dealerSession.findUnique({
    where: { tokenHash: hashDealerToken(raw) },
    include: {
      account: {
        include: {
          memberships: {
            include: { seller: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });
  if (!row) return null;
  if (row.expiresAt.getTime() <= Date.now()) {
    await prisma.dealerSession.delete({ where: { id: row.id } }).catch(() => {});
    return null;
  }
  return row;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] || char));
}

export async function sendDealerMagicLink(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderEmail();
  if (!apiKey || !from) throw new Error("Dealer email delivery is not configured.");
  const verifyUrl = absoluteUrl(`/dealer-portal/sign-in/verify/${encodeURIComponent(token)}`);
  const safeUrl = escapeHtml(verifyUrl);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Sign in to MotoIndex Dealer Portal",
      text: `Open this link to sign in to MotoIndex Dealer Portal: ${verifyUrl}\n\nThe link expires in ${MAGIC_LINK_MINUTES} minutes and can be used once.`,
      html: `<p>Open the secure link below to sign in to MotoIndex Dealer Portal.</p><p><a href="${safeUrl}">Open Dealer Portal</a></p><p>This link expires in ${MAGIC_LINK_MINUTES} minutes and can be used once.</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Dealer email delivery failed (${response.status})`);
}

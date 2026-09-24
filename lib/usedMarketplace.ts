import { absoluteUrl } from "@/lib/site";

function senderEmail() {
  return process.env.OWNER_AUTH_FROM_EMAIL || process.env.PRICE_ALERT_FROM_EMAIL || "";
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

export function usedMarketplaceEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && senderEmail());
}

export function ownerListingUrl(listingId: string) {
  return `/used-motorcycles/listing/${encodeURIComponent(listingId)}`;
}

export function ownerListingAbsoluteUrl(listingId: string) {
  return absoluteUrl(ownerListingUrl(listingId));
}

export async function sendUsedListingInquiry(input: {
  sellerEmail: string;
  listingId: string;
  listingTitle: string;
  buyerName: string;
  buyerEmail: string;
  buyerMobile?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderEmail();
  if (!apiKey || !from) throw new Error("Marketplace email delivery is not configured.");

  const listingUrl = ownerListingAbsoluteUrl(input.listingId);
  const phoneLine = input.buyerMobile ? `Buyer mobile: ${input.buyerMobile}\n` : "";
  const text = [
    `You have a new inquiry for ${input.listingTitle}.`,
    "",
    `Buyer: ${input.buyerName}`,
    `Buyer email: ${input.buyerEmail}`,
    phoneLine.trim(),
    "",
    "Message:",
    input.message,
    "",
    `Listing: ${listingUrl}`,
    "",
    "Reply to this email to contact the buyer directly. MotoIndex has not verified the buyer or guaranteed a transaction.",
  ].filter(Boolean).join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.sellerEmail],
      reply_to: input.buyerEmail,
      subject: `MotoIndex inquiry: ${input.listingTitle}`,
      text,
      html: `<p>You have a new inquiry for <strong>${escapeHtml(input.listingTitle)}</strong>.</p>
<p><strong>Buyer:</strong> ${escapeHtml(input.buyerName)}<br>
<strong>Email:</strong> ${escapeHtml(input.buyerEmail)}${input.buyerMobile ? `<br><strong>Mobile:</strong> ${escapeHtml(input.buyerMobile)}` : ""}</p>
<p><strong>Message</strong></p>
<p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>
<p><a href="${escapeHtml(listingUrl)}">Open the MotoIndex listing</a></p>
<p>Reply to this email to contact the buyer directly. MotoIndex has not verified the buyer or guaranteed a transaction.</p>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Marketplace inquiry delivery failed (${response.status})${detail ? `: ${detail.slice(0, 160)}` : ""}`);
  }
}

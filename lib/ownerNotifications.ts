import { prisma } from "@/lib/db";
import { getModelById } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { php } from "@/lib/utils";

function senderEmail() {
  return process.env.OWNER_AUTH_FROM_EMAIL || process.env.PRICE_ALERT_FROM_EMAIL || "";
}

function configured() {
  return Boolean(process.env.RESEND_API_KEY && senderEmail());
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char] || char));
}

async function send(to: string, subject: string, text: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderEmail();
  if (!apiKey || !from) throw new Error("Owner notifications are not configured.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, html }),
  });
  if (!response.ok) throw new Error(`Owner notification delivery failed (${response.status})`);
}

export async function notifyOwnerQuoteReceived(leadId: string, quoteId: string) {
  if (!configured()) return false;
  const lead = await prisma.dealerLead.findUnique({
    where: { id: leadId },
    include: { owner: true, deliveries: { include: { quoteResponse: true } } },
  });
  if (!lead?.owner || !lead.owner.notificationQuoteEmail) return false;
  const delivery = lead.deliveries.find(item => item.quoteResponse?.id === quoteId);
  const quote = delivery?.quoteResponse;
  if (!delivery || !quote || quote.ownerNotifiedAt) return false;
  const dashboard = absoluteUrl("/my");
  const amount = quote.cashPricePhp ? php(Number(quote.cashPricePhp)) : quote.monthlyPhp ? `${php(Number(quote.monthlyPhp))}/mo` : "a new quote";
  await send(
    lead.owner.email,
    `New dealer quote for ${lead.make} ${lead.model}`,
    `${delivery.sellerName} submitted ${amount} for your ${lead.make} ${lead.model} request. Open My MotoIndex: ${dashboard}`,
    `<p><strong>${escapeHtml(delivery.sellerName)}</strong> submitted <strong>${escapeHtml(amount)}</strong> for your ${escapeHtml(lead.make)} ${escapeHtml(lead.model)} request.</p><p><a href="${escapeHtml(dashboard)}">Open My MotoIndex</a></p><p>Confirm final pricing, stock, fees and financing terms directly with the dealer before paying.</p>`
  );
  await prisma.dealerQuoteResponse.update({ where: { id: quote.id }, data: { ownerNotifiedAt: new Date() } });
  return true;
}

export async function runOwnerQuoteExpiryNotifications(limit = 200) {
  if (!configured()) return { checked: 0, sent: 0, errors: 0 };
  const now = new Date();
  const soon = new Date(now.getTime() + 2 * 86400000);
  const quotes = await prisma.dealerQuoteResponse.findMany({
    where: {
      validUntil: { gt: now, lte: soon },
      expiryNotifiedAt: null,
      delivery: { lead: { ownerId: { not: null }, owner: { notificationQuoteEmail: true } } },
    },
    include: { delivery: { include: { lead: { include: { owner: true } } } } },
    take: Math.max(1, Math.min(limit, 500)),
    orderBy: { validUntil: "asc" },
  });
  let sent = 0;
  let errors = 0;
  for (const quote of quotes) {
    const owner = quote.delivery.lead.owner;
    if (!owner || !quote.validUntil) continue;
    try {
      const dashboard = absoluteUrl("/my");
      await send(
        owner.email,
        `Dealer quote expiring soon: ${quote.delivery.lead.make} ${quote.delivery.lead.model}`,
        `${quote.delivery.sellerName}'s quote expires on ${quote.validUntil.toISOString().slice(0,10)}. Open My MotoIndex: ${dashboard}`,
        `<p>${escapeHtml(quote.delivery.sellerName)}'s quote for <strong>${escapeHtml(quote.delivery.lead.make)} ${escapeHtml(quote.delivery.lead.model)}</strong> expires on <strong>${quote.validUntil.toISOString().slice(0,10)}</strong>.</p><p><a href="${escapeHtml(dashboard)}">Open My MotoIndex</a></p>`
      );
      sent += 1;
      await prisma.dealerQuoteResponse.update({ where: { id: quote.id }, data: { expiryNotifiedAt: now } });
    } catch {
      errors += 1;
    }
  }
  return { checked: quotes.length, sent, errors };
}

export async function runOwnerDealerPromoNotifications(limit = 100) {
  if (!configured()) return { checked: 0, sent: 0, errors: 0 };
  const owners = await prisma.ownerAccount.findMany({
    where: { notificationDealerPromoEmail: true, verifiedAt: { not: null }, shortlist: { some: {} } },
    include: { shortlist: { orderBy: { position: "asc" } } },
    take: Math.max(1, Math.min(limit, 300)),
    orderBy: { updatedAt: "asc" },
  });
  let sent = 0;
  let errors = 0;
  const now = new Date();
  for (const owner of owners) {
    const since = owner.lastDealerPromoEmailAt || new Date(now.getTime() - 24 * 60 * 60 * 1000);
    try {
      const offers = await prisma.sellerOffer.findMany({
        where: {
          entityType: "motorcycle",
          entityId: { in: owner.shortlist.map(item => item.modelId) },
          status: "dealer_published",
          publicationSource: "dealer_portal",
          promoLabel: { not: null },
          updatedAt: { gt: since },
          expiresAt: { gt: now },
          seller: { status: "verified" },
        },
        include: { seller: { select: { name: true } } },
        orderBy: { updatedAt: "desc" },
        take: 8,
      });
      if (!offers.length) continue;
      const lines = offers.map(offer => {
        const model = getModelById(offer.entityId);
        return `${model ? `${model.make} ${model.model}` : offer.entityId} — ${offer.promoLabel} — ${offer.seller.name}`;
      });
      const dashboard = absoluteUrl("/my");
      await send(
        owner.email,
        "New dealer promos for your MotoIndex shortlist",
        `${lines.join("\n")}\n\nOpen My MotoIndex: ${dashboard}`,
        `<p>Fresh dealer-published promos appeared for motorcycles on your shortlist:</p><ul>${lines.map(line => `<li>${escapeHtml(line)}</li>`).join("")}</ul><p><a href="${escapeHtml(dashboard)}">Open My MotoIndex</a></p><p>Dealer promos can change or expire. Reconfirm the exact unit and terms before paying.</p>`
      );
      sent += 1;
      await prisma.ownerAccount.update({ where: { id: owner.id }, data: { lastDealerPromoEmailAt: now } });
    } catch {
      errors += 1;
    }
  }
  return { checked: owners.length, sent, errors };
}

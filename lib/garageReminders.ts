import { prisma } from "@/lib/db";
import type { GarageState } from "@/lib/garage";
import { smartMaintenanceDue } from "@/lib/garage";
import { maintenanceSchedules } from "@/lib/maintenance";
import { ownerAuthConfigured } from "@/lib/ownerAuth";
import { absoluteUrl } from "@/lib/site";

type ReminderSeed = {
  reminderKey: string;
  motorcycleLocalId: string;
  motorcycleLabel: string;
  kind: string;
  title: string;
  dueDate?: Date;
  dueKm?: number;
  currentOdometerKm?: number;
};

function safeDate(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
}

function keyPart(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export function deriveGarageReminders(state: GarageState): ReminderSeed[] {
  const reminders: ReminderSeed[] = [];

  for (const bike of state.motorcycles) {
    const label = `${bike.make} ${bike.model}${bike.variant ? ` ${bike.variant}` : ""}`;
    const registrationDate = safeDate(bike.registrationExpiry);
    if (registrationDate && bike.registrationExpiry) {
      reminders.push({
        reminderKey: `${bike.id}:registration:${bike.registrationExpiry}`,
        motorcycleLocalId: bike.id,
        motorcycleLabel: label,
        kind: "registration",
        title: "LTO registration renewal",
        dueDate: registrationDate,
        currentOdometerKm: bike.odometerKm,
      });
    }

    const insuranceDate = safeDate(bike.insuranceExpiry);
    if (insuranceDate && bike.insuranceExpiry) {
      reminders.push({
        reminderKey: `${bike.id}:insurance:${bike.insuranceExpiry}`,
        motorcycleLocalId: bike.id,
        motorcycleLabel: label,
        kind: "insurance",
        title: "Insurance renewal",
        dueDate: insuranceDate,
        currentOdometerKm: bike.odometerKm,
      });
    }

    for (const record of state.records.filter((item) => item.motorcycleId === bike.id && (item.nextDueDate || item.nextDueKm !== undefined))) {
      const dueDate = safeDate(record.nextDueDate);
      reminders.push({
        reminderKey: `${bike.id}:record:${record.id}:${record.nextDueDate || ""}:${record.nextDueKm ?? ""}`,
        motorcycleLocalId: bike.id,
        motorcycleLabel: label,
        kind: record.category.toLowerCase(),
        title: record.title,
        dueDate,
        dueKm: record.nextDueKm,
        currentOdometerKm: bike.odometerKm,
      });
    }

    if (bike.catalogModelId) {
      const schedule = maintenanceSchedules.find((item) => item.modelId === bike.catalogModelId && item.exact);
      if (schedule) {
        for (const item of smartMaintenanceDue(schedule.items, bike.odometerKm)) {
          if (item.nextDueKm === undefined) continue;
          reminders.push({
            reminderKey: `${bike.id}:smart:${keyPart(item.item)}:${item.nextDueKm}`,
            motorcycleLocalId: bike.id,
            motorcycleLabel: label,
            kind: "pms",
            title: item.item,
            dueKm: item.nextDueKm,
            currentOdometerKm: bike.odometerKm,
          });
        }
      }
    }
  }

  return reminders;
}

export async function syncOwnerGarageReminders(ownerId: string, state: GarageState) {
  const reminders = deriveGarageReminders(state);
  await prisma.$transaction(async (tx) => {
    await tx.garageReminder.updateMany({ where: { ownerId }, data: { active: false } });
    for (const reminder of reminders) {
      await tx.garageReminder.upsert({
        where: { ownerId_reminderKey: { ownerId, reminderKey: reminder.reminderKey } },
        update: {
          motorcycleLocalId: reminder.motorcycleLocalId,
          motorcycleLabel: reminder.motorcycleLabel,
          kind: reminder.kind,
          title: reminder.title,
          dueDate: reminder.dueDate,
          dueKm: reminder.dueKm,
          currentOdometerKm: reminder.currentOdometerKm,
          active: true,
        },
        create: {
          ownerId,
          ...reminder,
          active: true,
        },
      });
    }
  });
  return reminders.length;
}

function senderEmail() {
  return process.env.OWNER_AUTH_FROM_EMAIL || process.env.PRICE_ALERT_FROM_EMAIL || "";
}

export function garageRemindersConfigured() {
  return Boolean(
    ownerAuthConfigured() &&
    process.env.RESEND_API_KEY &&
    senderEmail() &&
    process.env.PRICE_ALERT_CRON_SECRET
  );
}

function philippineTodayUtc(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
}

function dateNotice(dueDate: Date, now = new Date()) {
  const due = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const days = Math.ceil((due - philippineTodayUtc(now)) / 86400000);
  if (days > 30) return null;
  if (days <= 0) return { marker: "date:due", phrase: days < 0 ? `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue` : "due today" };
  if (days <= 1) return { marker: "date:1", phrase: "due tomorrow" };
  if (days <= 7) return { marker: "date:7", phrase: `due in ${days} days` };
  return { marker: "date:30", phrase: `due in ${days} days` };
}

function mileageNotice(dueKm?: number | null, currentKm?: number | null) {
  if (dueKm === null || dueKm === undefined || currentKm === null || currentKm === undefined) return null;
  const remaining = dueKm - currentKm;
  if (remaining > 1000) return null;
  if (remaining <= 0) return { marker: "km:due", phrase: `${Math.abs(remaining).toLocaleString()} km past the due mileage` };
  if (remaining <= 250) return { marker: "km:250", phrase: `due in ${remaining.toLocaleString()} km` };
  if (remaining <= 500) return { marker: "km:500", phrase: `due in ${remaining.toLocaleString()} km` };
  return { marker: "km:1000", phrase: `due in ${remaining.toLocaleString()} km` };
}

async function sendReminderEmail(input: { email: string; motorcycleLabel: string; title: string; phrase: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderEmail();
  if (!apiKey || !from) throw new Error("Garage reminder email is not configured.");
  const garageUrl = absoluteUrl("/garage");
  const subject = `${input.motorcycleLabel}: ${input.title} reminder`;
  const text = `${input.motorcycleLabel} — ${input.title} is ${input.phrase}.\n\nOpen My Garage: ${garageUrl}\n\nThis reminder is based on your latest cloud-synced Garage data. You can turn reminder emails off in My Garage.`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject,
      text,
      html: `<p><strong>${input.motorcycleLabel}</strong> — ${input.title} is <strong>${input.phrase}</strong>.</p><p><a href="${garageUrl}">Open My Garage</a></p><p>This reminder is based on your latest cloud-synced Garage data. You can turn reminder emails off in My Garage.</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Garage reminder delivery failed (${response.status})`);
}

export async function runGarageReminderCheck(limit = 300) {
  if (!garageRemindersConfigured()) throw new Error("Garage reminders are not fully configured.");
  const reminders = await prisma.garageReminder.findMany({
    where: {
      active: true,
      owner: { reminderEmailsEnabled: true, verifiedAt: { not: null } },
    },
    include: { owner: true },
    orderBy: { updatedAt: "asc" },
    take: Math.max(1, Math.min(limit, 500)),
  });

  let checked = 0;
  let sent = 0;
  let errors = 0;

  for (const reminder of reminders) {
    checked += 1;
    const notice = reminder.dueDate ? dateNotice(reminder.dueDate) : mileageNotice(reminder.dueKm, reminder.currentOdometerKm);
    if (!notice || notice.marker === reminder.lastNotifiedMarker) continue;
    try {
      await sendReminderEmail({
        email: reminder.owner.email,
        motorcycleLabel: reminder.motorcycleLabel,
        title: reminder.title,
        phrase: notice.phrase,
      });
      sent += 1;
      await prisma.garageReminder.update({
        where: { id: reminder.id },
        data: { lastNotifiedMarker: notice.marker, lastSentAt: new Date() },
      });
    } catch {
      errors += 1;
    }
  }

  return { checked, sent, errors };
}

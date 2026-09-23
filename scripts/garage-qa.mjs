import fs from "node:fs";

const required = [
  ["app/garage/page.tsx", ["robots: { index: false", "GarageWorkspace", "publicMotorcycles", "maintenanceSchedules"]],
  ["app/garage/resale/page.tsx", ["robots: { index: false", "GarageResalePack", "Private plate and document references stay hidden"]],
  ["app/garage/sign-in/verify/[token]/page.tsx", ["force-dynamic", "GarageMagicLinkConfirm", "Opening this page does not consume the link"]],
  ["components/GarageWorkspace.tsx", ["GarageAccountPanel", "Local-first privacy", "Prepare resale pack", "Ownership analytics", "Smart maintenance"]],
  ["components/GarageAccountPanel.tsx", ["Save this device to cloud", "Restore cloud to this device", "Turn on email reminders", "Email reminders unavailable", "latest cloud-synced Garage", "remindersAvailable", "revision", "explicit", "sign-in link"]],
  ["components/GarageResalePack.tsx", ["Private by default", "Print / save PDF", "Copy listing draft", "Export seller pack", "No accident records logged in My Garage", "This is not a claim that the motorcycle is accident-free.", "includePlate", "includeDocumentRefs", "includeAmounts", "includeNotes", "shareableRecord"]],
  ["lib/garage.ts", ["maintenanceReferenceForBike", "GARAGE_DOCUMENT_TYPES", "smartMaintenanceDue", "estimatedGarageResale", "garageOwnershipAnalytics", "distanceBasis", "fullTankRecords", "netOwnershipCostPhp"]],
  ["lib/ownerAuth.ts", ["httpOnly: true", "sameSite: \"lax\"", "hashOwnerToken", "ownerRequestOriginAllowed", "GARAGE_CLOUD_SYNC_ENABLED"]],
  ["lib/garageReminders.ts", ["deriveGarageReminders", "syncOwnerGarageReminders", "reminderEmailsEnabled: true", "lastNotifiedMarker", "PRICE_ALERT_CRON_SECRET", "PRICE_ALERT_CRON_CONFIGURED === \"true\"", "escapeHtml", "mileageNotice"]],
  ["app/api/garage/reminders/preferences/route.ts", ["garageRemindersConfigured", "typeof body.enabled !== \"boolean\"", "reminderEmailsEnabled: body.enabled"]],
  ["app/api/cron/price-alerts/route.ts", ["garageRemindersConfigured", "runGarageReminderCheck", "garageReminders"]],
  ["app/api/garage/auth/request/route.ts", ["recent >= 3", "ownerMagicLinkExpiry", "sendOwnerMagicLink"]],
  ["app/api/garage/auth/verify/[token]/route.ts", ["updateMany", "usedAt: null", "setOwnerSessionCookie"]],
  ["app/api/garage/sync/route.ts", ["expectedRevision", "conflict: true", "MAX_PAYLOAD_BYTES", "ownerId: auth.session.ownerId"]],
  [".env.example", ["GARAGE_CLOUD_SYNC_ENABLED=false", "OWNER_AUTH_FROM_EMAIL", "OWNER_SESSION_DAYS=30"]],
  ["prisma/schema.prisma", ["model OwnerAccount", "reminderEmailsEnabled Boolean @default(false)", "model OwnerMagicLink", "model OwnerSession", "model GarageSnapshot", "model GarageReminder"]],
  ["middleware.ts", ["/garage", "Referrer-Policy", "no-referrer"]],
];

for (const [path, needles] of required) {
  const source = fs.readFileSync(path, "utf8");
  for (const needle of needles) {
    if (!source.includes(needle)) throw new Error(`Garage QA failed: ${path} missing ${needle}`);
  }
}

const workspace = fs.readFileSync("components/GarageWorkspace.tsx", "utf8");
if (!workspace.includes("selectedCatalog?.exactMaintenance && smartMaintenance.length > 0")) {
  throw new Error("Garage QA failed: smart maintenance must remain gated to exact model schedules.");
}
if (workspace.includes("estimatedResaleValuePhp: n(form.get(\"estimatedResaleValuePhp\")) ?? estimatedGarageResale")) {
  throw new Error("Garage QA failed: automatic resale estimates must remain dynamic, not be stored as owner overrides.");
}

const garage = fs.readFileSync("lib/garage.ts", "utf8");
if (!garage.includes('record.fullTank && record.odometerKm !== undefined')) {
  throw new Error("Garage QA failed: fuel economy must only use explicitly marked full-tank fills.");
}
if (!garage.includes('distanceBasis = "purchase"') || !garage.includes('distanceBasis = "first-log"')) {
  throw new Error("Garage QA failed: cost/km must disclose its mileage baseline.");
}

const resale = fs.readFileSync("components/GarageResalePack.tsx", "utf8");
if (!resale.includes('useState(false)') || !resale.includes('Plate: Hidden from this report') || !resale.includes('Private references hidden from this report')) {
  throw new Error("Garage QA failed: resale pack privacy defaults must hide sensitive owner data.");
}
if (!resale.includes("amountPhp: includeAmounts ? record.amountPhp : undefined") || !resale.includes("notes: includeNotes ? record.notes : undefined")) {
  throw new Error("Garage QA failed: seller-pack export must honor amount and internal-note privacy settings.");
}
if (resale.includes("accident-free motorcycle")) {
  throw new Error("Garage QA failed: absence of Garage accident records must not be described as accident-free.");
}

const auth = fs.readFileSync("lib/ownerAuth.ts", "utf8");
if (auth.includes("service_role") || auth.includes("SUPABASE_SERVICE")) {
  throw new Error("Garage QA failed: owner auth must not depend on a browser-exposed privileged key.");
}
if (!auth.includes('createHash("sha256")') || !auth.includes('randomBytes(32)')) {
  throw new Error("Garage QA failed: owner auth tokens must remain opaque and hashed before database storage.");
}

const sync = fs.readFileSync("app/api/garage/sync/route.ts", "utf8");
if (!sync.includes("existing.revision !== expectedRevision") || !sync.includes("revision: { increment: 1 }")) {
  throw new Error("Garage QA failed: cloud writes must use optimistic revision checks.");
}

const migration = fs.readFileSync("prisma/migrations/20260923173000_add_owner_accounts_and_garage_sync/migration.sql", "utf8");
if (!migration.includes('CREATE UNIQUE INDEX "OwnerSession_tokenHash_key"') || !migration.includes('CREATE UNIQUE INDEX "GarageSnapshot_ownerId_key"') || !migration.includes('CREATE UNIQUE INDEX "GarageReminder_ownerId_reminderKey_key"')) {
  throw new Error("Garage QA failed: owner session, snapshot, or reminder uniqueness constraints are missing.");
}
if (!migration.includes('"reminderEmailsEnabled" BOOLEAN NOT NULL DEFAULT false')) {
  throw new Error("Garage QA failed: reminder emails must be opt-in by default.");
}

const reminders = fs.readFileSync("lib/garageReminders.ts", "utf8");
if (!reminders.includes('(reminder.dueDate ? dateNotice(reminder.dueDate) : null) || mileageNotice')) {
  throw new Error("Garage QA failed: mileage reminders must still work when a future date exists.");
}
if (!reminders.includes("lastNotifiedMarker") || !reminders.includes("notice.marker === reminder.lastNotifiedMarker")) {
  throw new Error("Garage QA failed: reminder emails need deduplication markers.");
}


const marketplaceSubmission = fs.readFileSync("app/api/garage/listings/route.ts", "utf8");
for (const privateField of ["plate:", "documents:", "documentRefs", "includeNotes"]) {
  if (marketplaceSubmission.includes(privateField)) {
    throw new Error(`Garage QA failed: marketplace submission must not publish private Garage field ${privateField}`);
  }
}

const publicListing = fs.readFileSync("lib/persistentUsedListings.ts", "utf8");
if (publicListing.includes("owner.email")) {
  throw new Error("Garage QA failed: public used-listing mapper must not expose owner email.");
}

console.log("Garage QA passed");

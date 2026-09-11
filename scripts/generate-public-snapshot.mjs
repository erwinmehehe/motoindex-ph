import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, "../data/generated/public-db-snapshot.json");

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set. Keeping the committed public snapshot unchanged.");
  process.exit(0);
}

const prisma = new PrismaClient();

const sellerType = (value) => value === "dealer" ? "dealer" : value === "retailer" ? "retailer" : value === "marketplace" ? "marketplace" : "official";

try {
  const [dealerRows, offerRows, historyRows, usedRows, affiliateRows] = await Promise.all([
    prisma.seller.findMany({
      where: { type: "dealer", status: "verified" },
      orderBy: [{ city: "asc" }, { name: "asc" }],
      take: 1000,
    }),
    prisma.sellerOffer.findMany({
      where: { status: "verified" },
      include: { seller: { select: { name: true, slug: true, type: true } } },
      orderBy: [{ observedAt: "desc" }, { updatedAt: "desc" }],
      take: 1000,
    }),
    prisma.offerPriceObservation.findMany({
      where: { offer: { status: { in: ["verified", "expired"] } } },
      include: { offer: { select: { entityType: true, entityId: true, status: true, seller: { select: { name: true } } } } },
      orderBy: { observedAt: "asc" },
      take: 5000,
    }),
    prisma.usedListing.findMany({
      where: { status: "verified" },
      orderBy: [{ verifiedAt: "desc" }, { postedAt: "desc" }],
      take: 500,
    }),
    prisma.affiliateProductLink.findMany({
      where: { status: "active" },
      orderBy: { updatedAt: "desc" },
      take: 1000,
    }),
  ]);

  const dealers = dealerRows
    .map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      type: sellerType(row.type),
      city: row.city || "",
      province: row.province || undefined,
      region: row.region || row.province || "",
      addressLabel: row.addressLabel || "",
      website: row.website || undefined,
      phoneLabel: row.phone || undefined,
      description: row.description || `${row.name} dealer profile.`,
      brands: row.brands,
      categories: row.categories.length ? row.categories : ["Motorcycles"],
      isDemo: false,
      status: "verified",
      lastChecked: row.lastChecked?.toISOString().slice(0, 10),
      sourceLabel: row.sourceLabel || undefined,
      sourceUrl: row.sourceUrl || undefined,
      verificationNote: row.verificationNote || undefined,
    }))
    .filter((row) => row.city && row.addressLabel && row.sourceUrl && row.lastChecked);

  const offers = offerRows.map((row) => ({
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    sellerName: row.seller.name,
    sellerSlug: row.seller.slug,
    sellerType: sellerType(row.seller.type),
    pricePhp: row.pricePhp ? Number(row.pricePhp) : undefined,
    downpaymentPhp: row.downPaymentPhp ? Number(row.downPaymentPhp) : undefined,
    monthlyPhp: row.monthlyPhp ? Number(row.monthlyPhp) : undefined,
    termMonths: row.termMonths || undefined,
    availability: row.availability,
    status: "verified",
    observedAt: row.observedAt.toISOString().slice(0, 10),
    verifiedAt: row.verifiedAt?.toISOString().slice(0, 10),
    targetUrl: row.targetUrl || undefined,
    affiliateUrl: row.affiliateUrl || undefined,
    note: "Verified offer from the reviewed MotoIndex database snapshot.",
  }));

  const priceHistory = historyRows.map((row) => ({
    entityType: row.offer.entityType,
    entityId: row.offer.entityId,
    sellerName: row.offer.seller.name,
    pricePhp: Number(row.pricePhp),
    observedAt: row.observedAt.toISOString().slice(0, 10),
    status: row.offer.status === "expired" ? "expired" : "verified",
  }));

  const usedListings = usedRows.map((row) => ({
    id: row.id,
    modelExternalId: row.modelExternalId,
    title: row.title,
    modelYear: row.modelYear,
    mileageKm: row.mileageKm,
    askingPricePhp: Number(row.askingPricePhp),
    condition: row.condition,
    sellerType: row.sellerType,
    location: row.location,
    sourceLabel: row.sourceLabel,
    sourceUrl: row.sourceUrl || undefined,
    postedAt: row.postedAt.toISOString(),
    verifiedAt: row.verifiedAt?.toISOString(),
  }));

  const affiliateLinks = affiliateRows.map((row) => ({
    productId: row.productId,
    merchant: row.merchant,
    network: row.network,
    url: row.url,
    status: row.status,
  }));

  const payload = {
    generatedAt: new Date().toISOString(),
    dealers,
    offers,
    priceHistory,
    usedListings,
    affiliateLinks,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote public snapshot: ${dealers.length} dealers, ${offers.length} offers, ${usedListings.length} used listings.`);
} finally {
  await prisma.$disconnect();
}

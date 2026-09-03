import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CATALOG_FILE = path.join(ROOT, "lib", "catalog.ts");
const OUTPUT_FILE = path.join(ROOT, "data", "affiliate-links.generated.json");
const DEFAULT_AUTH_PATH = "/auth";
const DEFAULT_OFFER_NAME = "Shopee";
const ALLOWED_DESTINATION_HOSTS = new Set(["shopee.ph", "www.shopee.ph"]);
// invl.me is the short domain /deeplink/generate actually returns (see Involve Asia API docs
// sample response: "tracking_link": "https://invl.me/..."). Omitting it made the generator
// reject every real API response, and made lib/affiliate.ts 404 the link at runtime.
const TRACKING_HOSTS = ["invol.co", "involve.asia", "invl.me"];


function apiBase() {
  return (process.env.INVOLVE_ASIA_API_BASE_URL || "https://api.involve.asia/api").replace(/\/$/, "");
}

function cliValue(name) {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : undefined;
}

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const onlyProductId = cliValue("product");
const limitValue = Number(cliValue("limit") || 0);
const cliOfferId = cliValue("offer-id");

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const index = trimmed.indexOf("=");
  if (index <= 0) return;
  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  if (!process.env[key]) process.env[key] = value;
}

async function loadLocalEnv() {
  for (const name of [".env.local", ".env"]) {
    try {
      const text = await fs.readFile(path.join(ROOT, name), "utf8");
      for (const line of text.split(/\r?\n/)) parseEnvLine(line);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
  }
}

function field(line, name) {
  const stringMatch = line.match(new RegExp(`${name}:\\s*"([^"]*)"`));
  if (stringMatch) return stringMatch[1];
  return undefined;
}

function sectionCategory(line, current) {
  if (line.includes("export const helmetProducts")) return "Helmet";
  if (line.includes("export const tireProducts")) return "Tire";
  if (line.includes("export const topBoxProducts")) return "Top box";
  return current;
}

function parseCatalog(source) {
  const products = [];
  let category = "";
  for (const line of source.split(/\r?\n/)) {
    category = sectionCategory(line, category);
    if (!line.includes("{ id:") || !line.includes('status:"verified"')) continue;
    const id = field(line, "id");
    if (!id) continue;
    products.push({
      id,
      category,
      brand: field(line, "brand") || "",
      brandSlug: field(line, "brandSlug") || "",
      model: field(line, "model") || "",
      priceSourceUrl: field(line, "priceSourceUrl")
    });
  }
  return products;
}

function readJsonEnv(name) {
  const raw = process.env[name]?.trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("must be an object");
    return parsed;
  } catch (error) {
    throw new Error(`${name} must be valid JSON keyed by MotoIndex product ID (${error.message}).`);
  }
}

function normalizeDestination(value) {
  if (typeof value === "string") return { url: value };
  if (value && typeof value === "object" && !Array.isArray(value) && typeof value.url === "string") {
    return { url: value.url, offerId: value.offerId ? String(value.offerId) : undefined };
  }
  return undefined;
}

function isShopeeDestination(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "https:" && (ALLOWED_DESTINATION_HOSTS.has(url.hostname.toLowerCase()) || url.hostname.toLowerCase().endsWith(".shopee.ph"));
  } catch {
    return false;
  }
}

function isShopeeProductDestination(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (!isShopeeDestination(rawUrl)) return false;
    const path = url.pathname.toLowerCase();
    return path.includes("-i.") || path.includes("/product/");
  } catch {
    return false;
  }
}

function isTrackingUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return TRACKING_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

async function readGenerated() {
  try {
    const parsed = JSON.parse(await fs.readFile(OUTPUT_FILE, "utf8"));
    return {
      version: 1,
      generatedAt: parsed.generatedAt || null,
      links: parsed.links && typeof parsed.links === "object" && !Array.isArray(parsed.links) ? parsed.links : {}
    };
  } catch (error) {
    if (error?.code === "ENOENT") return { version: 1, generatedAt: null, links: {} };
    throw new Error(`Could not read ${path.relative(ROOT, OUTPUT_FILE)}: ${error.message}`);
  }
}

function shopeeSearchUrl(product) {
  const keyword = [product.brand, product.model].filter(Boolean).join(" ").trim();
  return `https://shopee.ph/search?keyword=${encodeURIComponent(keyword)}`;
}

function buildCandidates(products, destinationOverrides, generated, useSearchFallback) {
  const known = new Map(products.map((product) => [product.id, product]));
  for (const id of Object.keys(destinationOverrides)) {
    if (!known.has(id)) throw new Error(`AFFILIATE_DESTINATIONS_JSON contains unknown product ID: ${id}`);
  }

  return products
    .map((product) => {
      const override = normalizeDestination(destinationOverrides[product.id]);
      let destination;
      let destinationType;
      if (override?.url) {
        destination = override.url;
        destinationType = "override";
      } else if (product.priceSourceUrl && isShopeeProductDestination(product.priceSourceUrl)) {
        destination = product.priceSourceUrl;
        destinationType = "catalog-shopee";
      } else if (useSearchFallback) {
        destination = shopeeSearchUrl(product);
        destinationType = "shopee-search";
      }
      if (!destination || !isShopeeDestination(destination)) return undefined;
      return {
        ...product,
        destinationUrl: new URL(destination).toString(),
        destinationType,
        offerId: override?.offerId,
        existing: generated.links[product.id]
      };
    })
    .filter(Boolean)
    .filter((candidate) => !onlyProductId || candidate.id === onlyProductId);
}

function formBody(values) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") body.set(key, String(value));
  }
  return body;
}

async function parseResponse(response) {
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : {}; }
  catch { payload = { raw: text.slice(0, 500) }; }
  return payload;
}

function apiMessage(payload) {
  return payload?.message || payload?.error?.message || payload?.error || payload?.status || "No API error message returned";
}

async function postForm(url, values, token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: formBody(values)
  });
  const payload = await parseResponse(response);
  return { response, payload };
}

function authUrl() {
  const configured = process.env.INVOLVE_ASIA_AUTH_URL?.trim();
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" || url.hostname !== "api.involve.asia") {
      throw new Error("INVOLVE_ASIA_AUTH_URL must be an HTTPS api.involve.asia URL from the Involve Asia API docs.");
    }
    return url.toString();
  }
  const authPath = (process.env.INVOLVE_ASIA_AUTH_PATH || DEFAULT_AUTH_PATH).trim();
  if (!authPath.startsWith("/")) throw new Error("INVOLVE_ASIA_AUTH_PATH must begin with /. ");
  return `${apiBase()}${authPath}`;
}

async function authenticate() {
  const key = process.env.INVOLVE_ASIA_API_KEY?.trim();
  const secret = process.env.INVOLVE_ASIA_API_SECRET?.trim();
  if (!key || !secret) {
    throw new Error("Set both INVOLVE_ASIA_API_KEY and INVOLVE_ASIA_API_SECRET in .env.local before generating live links.");
  }
  const url = authUrl();
  const { response, payload } = await postForm(url, { key, secret });
  if (!response.ok) {
    const hint = response.status === 404 && !process.env.INVOLVE_ASIA_AUTH_URL && !process.env.INVOLVE_ASIA_AUTH_PATH
      ? " The auth endpoint can change; copy the current Authentication HTTP Request URL from https://api.involve.asia/docs/ into INVOLVE_ASIA_AUTH_URL."
      : "";
    throw new Error(`Involve Asia authentication failed (HTTP ${response.status}): ${apiMessage(payload)}.${hint}`);
  }
  const token = payload?.data?.token || payload?.token || payload?.data?.access_token || payload?.access_token;
  if (!token || typeof token !== "string") throw new Error("Involve Asia authentication succeeded but no token was found in the response.");
  return token;
}

function offerList(payload) {
  const candidates = [payload?.data?.data, payload?.data?.items, payload?.data, payload?.items, payload?.offers];
  return candidates.find((value) => Array.isArray(value)) || [];
}

function offerIdOf(offer) {
  return offer?.offer_id ?? offer?.id ?? offer?.offerId;
}

function offerNameOf(offer) {
  return String(offer?.offer_name ?? offer?.name ?? offer?.offerName ?? "");
}

function offerCountryOf(offer) {
  return String(offer?.country ?? offer?.country_name ?? offer?.market ?? offer?.region ?? "");
}

function chooseOffer(offers, requestedName) {
  const usable = offers.filter((offer) => offerIdOf(offer));
  if (!usable.length) throw new Error(`No usable Involve Asia offers matched "${requestedName}". Set INVOLVE_ASIA_SHOPEE_PH_OFFER_ID to your approved Shopee Philippines offer ID.`);
  const scored = usable.map((offer) => {
    const name = offerNameOf(offer);
    const country = offerCountryOf(offer);
    const lower = `${name} ${country}`.toLowerCase();
    let score = 0;
    if (name.toLowerCase() === requestedName.toLowerCase()) score += 10;
    if (lower.includes(requestedName.toLowerCase())) score += 5;
    if (lower.includes("philippines")) score += 6;
    if (/\bph\b/i.test(`${name} ${country}`)) score += 4;
    if (String(offer?.application_status || "").toLowerCase().includes("approved")) score += 2;
    if (String(offer?.offer_status || "").toLowerCase().includes("active")) score += 1;
    return { offer, score, label: `${name || "unnamed"}${country ? ` (${country})` : ""}` };
  }).sort((a, b) => b.score - a.score);
  const top = scored[0];
  const tied = scored.filter((item) => item.score === top.score);
  if (tied.length > 1 && top.score < 15) {
    const sample = tied.slice(0, 5).map((item) => `${offerIdOf(item.offer)}: ${item.label}`).join("; ");
    throw new Error(`Offer resolution is ambiguous (${sample}). Set INVOLVE_ASIA_SHOPEE_PH_OFFER_ID explicitly.`);
  }
  return { id: String(offerIdOf(top.offer)), label: top.label };
}

async function resolveShopeeOffer(token) {
  const explicit = cliOfferId || process.env.INVOLVE_ASIA_SHOPEE_PH_OFFER_ID?.trim();
  if (explicit) return { id: String(explicit), label: "configured Shopee Philippines offer" };

  const requestedName = process.env.INVOLVE_ASIA_SHOPEE_PH_OFFER_NAME?.trim() || DEFAULT_OFFER_NAME;
  const { response, payload } = await postForm(`${apiBase()}/offers/all`, {
    page: 1,
    limit: 100,
    "filters[offer_name]": requestedName
  }, token);
  if (!response.ok) throw new Error(`Could not resolve Involve Asia offer (HTTP ${response.status}): ${apiMessage(payload)}`);
  return chooseOffer(offerList(payload), requestedName);
}

async function generateLink(token, candidate, offerId) {
  const { response, payload } = await postForm(`${apiBase()}/deeplink/generate`, {
    offer_id: offerId,
    url: candidate.destinationUrl,
    aff_sub: candidate.id,
    aff_sub2: candidate.category.toLowerCase().replace(/\s+/g, "-"),
    aff_sub3: candidate.brandSlug || candidate.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    aff_sub4: "motoindex-ph",
    aff_sub5: candidate.destinationType
  }, token);

  if (!response.ok) {
    const generic500 = response.status === 500
      ? " Involve Asia can return a generic 500 when the offer_id is unknown or the destination host is not whitelisted for that offer."
      : "";
    throw new Error(`HTTP ${response.status}: ${apiMessage(payload)}.${generic500}`);
  }
  const trackingLink = payload?.data?.tracking_link || payload?.data?.trackingLink || payload?.tracking_link || payload?.trackingLink;
  if (!trackingLink || !isTrackingUrl(trackingLink)) throw new Error("API response did not contain a valid Involve Asia tracking_link.");
  return new URL(trackingLink).toString();
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function writeGenerated(data) {
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  const temp = `${OUTPUT_FILE}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temp, OUTPUT_FILE);
}

async function main() {
  await loadLocalEnv();
  const catalogSource = await fs.readFile(CATALOG_FILE, "utf8");
  const products = parseCatalog(catalogSource);
  const destinationOverrides = readJsonEnv("AFFILIATE_DESTINATIONS_JSON");
  const generated = await readGenerated();
  const useSearchFallback = process.env.INVOLVE_ASIA_SHOPEE_SEARCH_FALLBACK?.trim().toLowerCase() !== "false";
  let candidates = buildCandidates(products, destinationOverrides, generated, useSearchFallback);

  if (onlyProductId && !products.some((product) => product.id === onlyProductId)) {
    throw new Error(`Unknown product ID: ${onlyProductId}`);
  }
  if (limitValue > 0) candidates = candidates.slice(0, limitValue);

  const existingCount = candidates.filter((candidate) => candidate.existing && !force).length;
  const pending = candidates.filter((candidate) => force || !candidate.existing);

  console.log(`Shopee affiliate candidates: ${candidates.length}`);
  console.log(`Already cached: ${existingCount}`);
  console.log(`${force ? "To regenerate" : "Missing links"}: ${pending.length}`);
  for (const candidate of candidates) {
    const state = candidate.existing && !force ? "cached" : "generate";
    console.log(`- ${state.padEnd(8)} ${candidate.id} [${candidate.destinationType}] -> ${candidate.destinationUrl}`);
  }

  if (dryRun) {
    console.log("\nDry run only: no Involve Asia API calls were made and no links were generated.");
    return;
  }
  if (!pending.length) {
    console.log("\nNothing to generate. Existing deeplinks were left untouched.");
    return;
  }

  const token = await authenticate();
  let sharedOffer;
  const failures = [];
  let generatedCount = 0;

  for (let index = 0; index < pending.length; index += 1) {
    const candidate = pending[index];
    try {
      let offerId = candidate.offerId || cliOfferId || process.env.INVOLVE_ASIA_SHOPEE_PH_OFFER_ID?.trim();
      if (!offerId) {
        sharedOffer ||= await resolveShopeeOffer(token);
        offerId = sharedOffer.id;
      }
      const trackingLink = await generateLink(token, candidate, offerId);
      generated.links[candidate.id] = {
        merchant: "shopee",
        network: "involve_asia",
        url: trackingLink,
        destinationUrl: candidate.destinationUrl,
        destinationType: candidate.destinationType,
        offerId: Number.isFinite(Number(offerId)) ? Number(offerId) : String(offerId),
        generatedAt: new Date().toISOString()
      };
      generatedCount += 1;
      console.log(`generated ${candidate.id}`);
      if (index < pending.length - 1) await sleep(1100);
    } catch (error) {
      failures.push({ productId: candidate.id, message: error?.message || String(error) });
      console.error(`failed ${candidate.id}: ${error?.message || error}`);
    }
  }

  generated.generatedAt = new Date().toISOString();
  await writeGenerated(generated);
  console.log(`\nSaved ${generatedCount} new deeplink${generatedCount === 1 ? "" : "s"} to ${path.relative(ROOT, OUTPUT_FILE)}.`);
  if (failures.length) {
    console.error(`${failures.length} product${failures.length === 1 ? "" : "s"} failed. Existing mappings were preserved.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(`Affiliate generation failed: ${error?.message || error}`);
  process.exit(1);
});

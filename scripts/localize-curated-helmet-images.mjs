import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const pairs = [
  ["smk-stellar", "Stellar", "https://smkhelmets.com/full-face-helmets/stellar/", "https://smkhelmets.com/wp-content/uploads/2022/11/steller-unicolor-black.webp"],
  ["smk-gullwing", "Gullwing", "https://smkhelmets.com/modular-helmets/gullwing/", "https://smkhelmets.com/wp-content/uploads/2022/11/BLACK-GL-200-OPEN-ISO.png"],
  ["smk-retro-jet", "Retro Jet", "https://smkhelmets.com/open-face-helmets/retro-jet/", "https://smkhelmets.com/wp-content/uploads/2022/11/unicolor3-1-1.png"],
  ["smk-titan", "Titan", "https://smkhelmets.com/full-face-helmets/titan/", "https://smkhelmets.com/wp-content/uploads/2022/10/TITAN-SOLID-MATT-BLACK.webp"],
  ["smk-retro", "Retro", "https://smkhelmets.com/full-face-helmets/retro/", "https://smkhelmets.com/wp-content/uploads/2022/11/RETRO-UNICOLOUR-3-1.png"],
  ["smk-bionic-youth", "Bionic Youth", "https://smkhelmets.com/helmet/full-face-helmets/bionic-youth/bionic-youth-solid/", "https://smkhelmets.com/wp-content/uploads/2022/11/BIONICY-SOLID-MATT-BLACK-MA-200.webp"],
  ["smk-bionic-adult", "Bionic Adult", "https://smkhelmets.com/helmet/full-face-helmets/bionicadult/bionic-adult-kore/", "https://smkhelmets.com/wp-content/uploads/2024/10/BIONIC-ADULT-KORE-GL-153-ISO.png"],
  ["smk-agnar", "Agnar", "https://smkhelmets.com/helmet/full-face-helmets/agnar/agnar-solid/", "https://smkhelmets.com/wp-content/uploads/2023/10/AGNAR-SOLID-ANTHRACITE-GLDA-600-4.webp"],
  ["smk-ares", "Ares", "https://smkhelmets.com/helmet/dual-sport/ares/ares-solid/", "https://smkhelmets.com/wp-content/uploads/2024/10/TITANIUM-GLDA-600.png"],
  ["smk-cygnus", "Cygnus", "https://smkhelmets.com/helmet/flip-back-helmets/cygnus/cygnus-solid/", "https://smkhelmets.com/wp-content/uploads/2025/10/CYGNUS-SOLID-MATT-BLACK-MA-200.png"],
  ["smk-laminar", "Laminar", "https://smkhelmets.com/helmet/open-face-helmets/laminar/laminar-solid/", "https://smkhelmets.com/wp-content/uploads/2023/10/LAMINAR-HI-VISION-HV-400.webp"],
  ["smk-delta-city", "Delta City", "https://smkhelmets.com/helmet/demi-jet-helmets/delta-city/solid/", "https://smkhelmets.com/wp-content/uploads/2025/10/DELTA-CITY-BLACK-FL-200.png"]
];
const mediaPath = path.join(root, "lib/generatedProductMedia.ts");
const mediaText = fs.readFileSync(mediaPath, "utf8");
const assignment = mediaText.indexOf("=", mediaText.indexOf("export const generatedProductMedia"));
const pos = mediaText.indexOf("[", assignment);
if (assignment < 0 || pos < 0) throw new Error("Missing generated product media array");
const prior = JSON.parse(mediaText.slice(pos, mediaText.lastIndexOf("]") + 1));
const preexisting = new Set(prior.map((x) => x.entityType + ":" + x.entityId));
const knownImages = new Set(prior.map((x) => x.sourceImageUrl));
const helmetSource = fs.readFileSync(path.join(root, "lib/catalog.ts"), "utf8");
const added = [];
const rejected = [];
for (const [entityId, model, sourceUrl, imageUrl] of pairs) {
  if (preexisting.has("helmet:" + entityId)) {
    console.log("Already present " + entityId);
    continue;
  }
  if (!helmetSource.includes('id:"' + entityId + '"') && !helmetSource.includes('id: "' + entityId + '"')) {
    throw new Error("Catalog ID is not present: " + entityId);
  }
  if (!helmetSource.includes('sourceUrl:"' + sourceUrl + '"')) throw new Error("Catalog source URL differs for " + entityId);
  if (knownImages.has(imageUrl)) throw new Error("Duplicate upstream image for " + entityId);
  try {
    const response = await fetch(imageUrl, {
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; MotoIndexMediaVerifier/1.0; +https://motoindexph.com/methodology)",
        "accept": "image/webp,image/png,image/jpeg,image/*;q=0.8",
        "referer": sourceUrl
      }
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    if (!/image\/(webp|png|jpeg|avif)/i.test(response.headers.get("content-type") || "")) throw new Error("nonimage response");
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 8_000 || bytes.length > 12_000_000) throw new Error("invalid byte size " + bytes.length);
    const info = await sharp(bytes).metadata();
    if ((info.width || 0) < 400 || (info.height || 0) < 400) throw new Error("insufficient source image dimensions");
    const local = "/media/helmets/" + entityId + ".webp";
    const localPath = path.join(root, "public", local.slice(1));
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    await sharp(bytes)
      .rotate()
      .resize(1200, 1200, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .webp({ quality: 88, effort: 4 })
      .toFile(localPath);
    added.push({
      id: entityId + "-official-20261007",
      entityType: "helmet", entityId, role: "primary",
      src: local, sourceImageUrl: imageUrl,
      alt: "SMK " + model + " official motorcycle helmet photograph",
      width: 1200, height: 1200,
      rightsStatus: "external-reference",
      rightsHolder: "SMK Helmets",
      sourceLabel: "Exact-model product photography from SMK official model page",
      sourceUrl, lastChecked: "2026-10-07"
    });
    knownImages.add(imageUrl);
    console.log("LOCALIZED " + entityId + " " + imageUrl + " " + bytes.length + "B");
  } catch (error) {
    rejected.push(entityId + ": " + String(error));
    console.log("UNRESOLVED " + entityId + ": " + String(error));
  }
}
if (added.length) {
  fs.writeFileSync(mediaPath, mediaText.slice(0, pos) + JSON.stringify([...prior, ...added], null, 2) + ";\n");
  const auditPath = path.join(root, "scripts/audit-helmet-media-coverage.mjs");
  const audit = fs.readFileSync(auditPath, "utf8");
  const installed = new Set(added.map((x) => x.entityId));
  const lines = audit.split("\n").filter((line) => {
    const id = line.trim().match(/^"([^"]+)"[,]?$/)?.[1];
    return !id || !installed.has(id);
  });
  fs.writeFileSync(auditPath, lines.join("\n"));
}
fs.mkdirSync(path.join(root, "artifacts"), { recursive: true });
fs.writeFileSync(path.join(root, "artifacts", "curated-helmet-media-report.json"), JSON.stringify({ localized: added.map((x) => x.entityId), rejected }, null, 2));
console.log("Curated official helmets: " + added.length + "/" + pairs.length + " accepted; " + rejected.length + " inaccessible.");

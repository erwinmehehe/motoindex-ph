import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const mediaSource = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const ids = [
  "studds-helios","studds-trooper-sport",
  "scorpion-exo-r1-air-carbon","scorpion-exo-adx-2","scorpion-exo-adf-9000-air","scorpion-exo-covert-fx","scorpion-covert-2",
  "nolan-n120-1","nolan-n70-2-x","nolan-n21-visor","nolan-x-804rs-ultra-carbon","nolan-x-552-ultra-carbon",
  "ryo-rf-4sv","ryo-rf-5v","ryo-rf-6v","ryo-ro-4sv",
  "evo-vxr-5000","evo-gt-sport","evo-xt-300-riot-ii","evo-gx-1","evo-dx-7",
  "sec-windstorm-v3","sec-whirlwind","sec-rise-v2","sec-element",
  "oneal-2srs","oneal-3srs","oneal-3srs-ii"
];

function recordFor(id) {
  const escaped = id.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
  const pattern = new RegExp("\\{[\\s\\S]{0,1800}?entityId: \"" + escaped + "\"[\\s\\S]{0,1800}?sourceImageUrl: \"([^\"]+)\"[\\s\\S]{0,1800}?\\}", "m");
  const match = mediaSource.match(pattern);
  if (!match) throw new Error("media record not found for " + id);
  return { id, sourceImageUrl: match[1] };
}

async function fetchImage(url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: {
      "user-agent": "Mozilla/5.0 MotoIndexPH media sync",
      "accept": "image/avif,image/webp,image/png,image/jpeg,image/*,*/*;q=0.8"
    }
  });
  if (!response.ok) throw new Error("HTTP " + response.status);
  const type = response.headers.get("content-type") || "";
  if (!type.toLowerCase().startsWith("image/")) throw new Error("not an image (" + (type || "unknown") + ")");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 5000) throw new Error("image too small (" + bytes.length + " bytes)");
  return bytes;
}

const failures = [];
let created = 0;
let already = 0;
for (const id of ids) {
  try {
    const { sourceImageUrl } = recordFor(id);
    const output = path.join(root, "public", "media", "helmets", id + ".webp");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    if (fs.existsSync(output)) {
      already += 1;
      console.log("= " + id + " already local");
      continue;
    }
    const bytes = await fetchImage(sourceImageUrl);
    const meta = await sharp(bytes).metadata();
    if ((meta.width || 0) < 200 || (meta.height || 0) < 200) throw new Error("source dimensions too small " + (meta.width || 0) + "x" + (meta.height || 0));
    await sharp(bytes)
      .rotate()
      .flatten({ background: "#ffffff" })
      .resize({ width: 980, height: 980, fit: "inside", withoutEnlargement: false, background: "#ffffff" })
      .extend({ top: 110, bottom: 110, left: 110, right: 110, background: "#ffffff" })
      .resize(1200, 1200, { fit: "contain", background: "#ffffff" })
      .webp({ quality: 88, effort: 5 })
      .toFile(output);
    const out = await sharp(output).metadata();
    if (out.width !== 1200 || out.height !== 1200) throw new Error("unexpected output " + out.width + "x" + out.height);
    created += 1;
    console.log("✓ " + id + " <- " + sourceImageUrl);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    failures.push(id + ": " + msg);
    console.error("✗ " + id + ": " + msg);
  }
}
console.log("Helmet localization: " + created + " created, " + already + " already present, " + failures.length + " failed.");
if (failures.length) {
  console.error(failures.map(x => "- " + x).join("\n"));
  process.exit(1);
}

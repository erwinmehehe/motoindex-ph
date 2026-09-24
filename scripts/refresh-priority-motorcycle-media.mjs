import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "media", "motorcycles");
const CANVAS = 1200;
const MAX_W = 1000;
const MAX_H = 880;
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const replacements = [
  {
    id: "honda-beat",
    file: "honda-beat.webp",
    url: "https://images.ctfassets.net/p4ab844it03t/73zDTyHHl8VZiWLSoDjZo4/349c2c309b4aa57320b48ac64448f9b7/6510e11420665.png?fm=webp&q=90"
  },
  {
    id: "kawasaki-ninja-zx-4rr",
    file: "kawasaki-ninja-zx-4rr.webp",
    url: "https://www.kawasaki-lifestyle.com/content/dam/products/pim/studio/Resource_320398_26ZX400S_141GN1DRF3CG_A.jpg/_jcr_content/renditions/cq5dam.thumbnail.600.600.png"
  },
  {
    id: "kymco-krv-180i-tcs",
    file: "kymco-krv-180i-tcs.webp",
    url: "https://kymco.com.ph/wp-content/uploads/2024/02/KRV-Belt_1.png"
  },
  {
    id: "yamaha-xsr700",
    file: "yamaha-xsr700.webp",
    url: "https://cdn2.yamaha-motor.eu/prod/product-assets/2022/XS700/2022-Yamaha-XS700-EU-Historic_White-Studio-001-03.jpg"
  },
  {
    id: "honda-cb650r",
    file: "honda-cb650r.webp",
    url: "https://images.ctfassets.net/p4ab844it03t/2QJhmFYoS4Dk4iFfu78qeQ/a96a575c5f6d1ac3b08ac94d647abb14/663311b3dd4c9.png?fm=webp&q=90",
    crop: { left: 0.0, top: 0.0, width: 0.37, height: 0.81 }
  },
  {
    id: "honda-nx500-e-clutch",
    file: "honda-nx500-e-clutch.webp",
    url: "https://images.ctfassets.net/p4ab844it03t/4pg7fV81pYUzq4gfwltBAz/83b7865691fe8646df5e34a5a99978ad/663313b957c73.png?fm=webp&q=90",
    crop: { left: 0.0, top: 0.0, width: 0.50, height: 0.82 }
  },
  {
    id: "cfmoto-300sr",
    file: "cfmoto-300sr.webp",
    page: "https://www.cfmoto.ph/product/300sr/",
    alt: "300sr Blue Right View"
  },
  {
    id: "cfmoto-400nk",
    file: "cfmoto-400nk.webp",
    page: "https://www.cfmoto.ph/product/400-nk/",
    alt: "400nk Blue Right Side View"
  }
];

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function fetchBuffer(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "Mozilla/5.0 MotoIndexMediaQA/1.0",
      accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8"
    }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`Expected image for ${url}, got ${type || "unknown"}`);
  return Buffer.from(await response.arrayBuffer());
}

async function imageUrlFromAlt(pageUrl, wantedAlt) {
  const response = await fetch(pageUrl, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 MotoIndexMediaQA/1.0" }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${pageUrl}`);
  const html = await response.text();
  const tags = html.match(/<img\b[^>]*>/gi) || [];
  const wanted = wantedAlt.toLowerCase();
  for (const tag of tags) {
    const alt = decodeHtml(tag.match(/\balt=["']([^"']*)["']/i)?.[1] || "").trim();
    if (!alt.toLowerCase().includes(wanted)) continue;
    const candidates = [
      tag.match(/\bdata-lazy-src=["']([^"']+)["']/i)?.[1],
      tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1],
      tag.match(/\bsrc=["']([^"']+)["']/i)?.[1]
    ].filter(Boolean);
    for (const candidate of candidates) {
      const decoded = decodeHtml(candidate);
      if (!decoded.startsWith("data:")) return new URL(decoded, pageUrl).href;
    }
  }
  throw new Error(`Could not find image alt "${wantedAlt}" on ${pageUrl}`);
}

async function normalize(sharp, input, crop) {
  let base = sharp(input, { failOn: "warning" }).rotate();
  const meta = await base.metadata();
  if (!meta.width || !meta.height) throw new Error("Missing source dimensions");

  if (crop) {
    const left = Math.max(0, Math.min(meta.width - 1, Math.round(meta.width * crop.left)));
    const top = Math.max(0, Math.min(meta.height - 1, Math.round(meta.height * crop.top)));
    const width = Math.max(1, Math.min(meta.width - left, Math.round(meta.width * crop.width)));
    const height = Math.max(1, Math.min(meta.height - top, Math.round(meta.height * crop.height)));
    base = base.extract({ left, top, width, height });
  }

  const rgba = await base.ensureAlpha().png().toBuffer();
  let subject = sharp(rgba);
  const stats = await subject.stats();
  const hasTransparency = stats.channels.length >= 4 && stats.channels[3].min < 250;

  if (hasTransparency) {
    subject = subject.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 });
  } else {
    subject = subject.trim({ background: "#ffffff", threshold: 12 });
  }

  const fitted = await subject
    .resize({ width: MAX_W, height: MAX_H, fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  return sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: WHITE } })
    .composite([{ input: fitted, gravity: "centre" }])
    .flatten({ background: WHITE })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toBuffer();
}

async function main() {
  const sharp = (await import("sharp")).default;
  await fs.mkdir(OUT, { recursive: true });
  const report = [];

  for (const item of replacements) {
    try {
      const sourceUrl = item.url || await imageUrlFromAlt(item.page, item.alt);
      const input = await fetchBuffer(sourceUrl);
      const output = await normalize(sharp, input, item.crop);
      const dest = path.join(OUT, item.file);
      await fs.writeFile(dest, output);
      const meta = await sharp(output).metadata();
      report.push({ id: item.id, status: "updated", sourceUrl, width: meta.width, height: meta.height });
      console.log(`updated ${item.id} from ${sourceUrl}`);
    } catch (error) {
      report.push({ id: item.id, status: "failed", error: String(error?.message || error) });
      console.error(`failed ${item.id}: ${error?.message || error}`);
    }
  }

  await fs.mkdir(path.join(ROOT, "artifacts"), { recursive: true });
  await fs.writeFile(
    path.join(ROOT, "artifacts", "priority-motorcycle-media-refresh.json"),
    JSON.stringify(report, null, 2)
  );

  const failures = report.filter((item) => item.status === "failed");
  console.log(`Priority media refresh: ${report.length - failures.length}/${report.length} updated.`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

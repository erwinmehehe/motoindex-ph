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
    url: "https://global.honda/content/dam/site/global-jp/news-new/cq_img/2024/04/dl/2240411-cb650r_005H.jpg"
  },
  {
    id: "honda-nx500-e-clutch",
    file: "honda-nx500-e-clutch.webp",
    url: "https://hondabigbike.com.my/wp-content/uploads/2026/09/2026-NX500_studio_A002_E-Clutch_NH-B61P_PearlHorizonWhite_RhSide_M-Photoroom-1-e1786456362968.png"
  },
  {
    id: "kymco-like-150i-abs",
    file: "kymco-like-150i-abs.webp",
    url: "https://kymco.com.ph/wp-content/uploads/2024/03/LIKE125_1.png.webp"
  },
  {
    id: "benelli-180s",
    file: "benelli-180s.webp",
    url: "https://cdn.keeway.com/benelli-3-0/media/1858/conversions/2560x2180-%2835%29-md.png"
  },
  {
    id: "kawasaki-ninja-400",
    file: "kawasaki-ninja-400.webp",
    page: "https://www.kawasaki.ca/en-ca/motorcycle/ninja/sport/ninja-400/2023-ninja-400",
    meta: "og:image"
  },
  {
    id: "royal-enfield-guerrilla-450",
    file: "royal-enfield-guerrilla-450.webp",
    page: "https://www.royalenfield.com/ph/en/motorcycles/guerrilla-450/",
    alt: "Guerrilla 450 - Brava Blue"
  },
  {
    id: "cfmoto-300sr",
    file: "cfmoto-300sr.webp",
    url: "https://static.wixstatic.com/media/496e53_d972b01b15424f42a22810fb38393614~mv2.png"
  },
  {
    id: "cfmoto-400nk",
    file: "cfmoto-400nk.webp",
    url: "https://cfmotord.com/wp-content/uploads/2020/05/20200312104205.png"
  }
]

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
    },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const type = response.headers.get("content-type") || "";
  if (!type.startsWith("image/")) throw new Error(`Expected image for ${url}, got ${type || "unknown"}`);
  return Buffer.from(await response.arrayBuffer());
}

async function imageUrlFromAlt(pageUrl, wantedAlt) {
  const response = await fetch(pageUrl, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 MotoIndexMediaQA/1.0" },
    signal: AbortSignal.timeout(20000)
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

async function imageUrlFromMeta(pageUrl) {
  const response = await fetch(pageUrl, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 MotoIndexMediaQA/1.0" },
    signal: AbortSignal.timeout(20000)
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${pageUrl}`);
  const html = await response.text();
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return new URL(decodeHtml(match[1]), pageUrl).href;
  }
  throw new Error(`Could not find og:image/twitter:image on ${pageUrl}`);
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
      const sourceUrl = item.url || (item.meta ? await imageUrlFromMeta(item.page) : await imageUrlFromAlt(item.page, item.alt));
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
  if (failures.length) {
    console.warn("Some optional media refreshes failed; the catalog audit will decide whether the branch is mergeable.");
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

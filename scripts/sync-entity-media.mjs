import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const MEDIA_FILE = path.join(ROOT, "lib", "media.ts");
const CANVAS = 1200;
const CONTENT_MAX = 920;
// A few manufacturer gallery images are wide lifestyle shots. Focus them before fitting so
// the actual motorcycle is readable in compact guide cards instead of becoming a tiny dot.
const FOCUS_CROPS = {
  "suzuki-access": { left: 0.18, top: 0.0, width: 0.63, height: 1.0 },
  "suzuki-burgman-street": { left: 0.20, top: 0.02, width: 0.53, height: 0.95 }
};
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((value) => value.startsWith("--only="));
const only = onlyArg ? onlyArg.slice("--only=".length) : null;

function field(block, name) {
  const match = block.match(new RegExp(`${name}:\\s*"([^"]+)"`));
  return match?.[1];
}

function parseMedia(source) {
  const blocks = source.match(/  \{[\s\S]*?\n  \},/g) || [];
  return blocks.map((block) => ({
    entityType: field(block, "entityType"),
    entityId: field(block, "entityId"),
    src: field(block, "src"),
    sourceImageUrl: field(block, "sourceImageUrl"),
    alt: field(block, "alt")
  })).filter((item) => item.entityType && item.entityId && item.src);
}

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    throw new Error("The media sync requires the Sharp package installed by the normal project dependency install.");
  }

  const source = await fs.readFile(MEDIA_FILE, "utf8");
  const media = parseMedia(source).filter((item) => item.sourceImageUrl && (!only || item.entityId === only));
  if (!media.length) {
    console.log(only ? `No media record found for ${only}.` : "No upstream media records need syncing.");
    return;
  }

  let synced = 0;
  let skipped = 0;
  const failures = [];

  for (const item of media) {
    const dest = path.join(ROOT, "public", item.src.replace(/^\//, ""));
    await fs.mkdir(path.dirname(dest), { recursive: true });

    if (!force) {
      try {
        await fs.access(dest);
        skipped += 1;
        console.log(`skip ${item.entityId} (already local)`);
        continue;
      } catch {}
    }

    try {
      const response = await fetch(item.sourceImageUrl, {
        redirect: "follow",
        headers: {
          "user-agent": "MotoIndexMediaSync/1.0 (+https://motoindexph.com)",
          accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8"
        }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error(`unexpected content-type ${contentType || "unknown"}`);
      const input = Buffer.from(await response.arrayBuffer());

      const rotated = await sharp(input, { failOn: "warning" })
        .rotate()
        .flatten({ background: WHITE })
        .png()
        .toBuffer({ resolveWithObject: true });

      let subject = sharp(rotated.data);
      const focus = FOCUS_CROPS[item.entityId];
      if (focus) {
        const sourceWidth = rotated.info.width;
        const sourceHeight = rotated.info.height;
        const left = Math.max(0, Math.min(sourceWidth - 1, Math.round(sourceWidth * focus.left)));
        const top = Math.max(0, Math.min(sourceHeight - 1, Math.round(sourceHeight * focus.top)));
        const width = Math.max(1, Math.min(sourceWidth - left, Math.round(sourceWidth * focus.width)));
        const height = Math.max(1, Math.min(sourceHeight - top, Math.round(sourceHeight * focus.height)));
        subject = subject.extract({ left, top, width, height });
      } else {
        // Remove empty white margins from studio/product shots. Lifestyle photos normally have
        // no trim border and are simply enlarged below.
        subject = subject.trim({ background: "#ffffff", threshold: 10 });
      }

      const fitted = await subject
        .resize({ width: CONTENT_MAX, height: CONTENT_MAX, fit: "inside", withoutEnlargement: false })
        .png()
        .toBuffer();

      await sharp({ create: { width: CANVAS, height: CANVAS, channels: 4, background: WHITE } })
        .composite([{ input: fitted, gravity: "centre" }])
        .flatten({ background: WHITE })
        .webp({ quality: 86, effort: 6, smartSubsample: true })
        .toFile(dest);

      const meta = await sharp(dest).metadata();
      if (meta.width !== CANVAS || meta.height !== CANVAS || meta.format !== "webp") {
        throw new Error(`output validation failed (${meta.width}x${meta.height}, ${meta.format})`);
      }
      synced += 1;
      console.log(`sync ${item.entityId} -> ${item.src}`);
    } catch (error) {
      failures.push({ entityId: item.entityId, url: item.sourceImageUrl, error: String(error?.message || error) });
      console.error(`fail ${item.entityId}: ${error?.message || error}`);
    }
  }

  console.log(`\nMedia sync complete: ${synced} synced, ${skipped} already present, ${failures.length} failed.`);
  if (failures.length) {
    console.error("Failed media records:");
    for (const failure of failures) console.error(`- ${failure.entityId}: ${failure.error}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});

#!/usr/bin/env python3
"""Normalize helmet catalog images onto a consistent white product canvas.

This is intentionally an asset build step, not a runtime effect. It removes
source-photo scenery/promotional framing while preserving the helmet itself,
then centers each helmet on a 1200x1200 white catalog canvas.
"""
from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageOps
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "helmets"
CANVAS = (1200, 1200)
MAX_SUBJECT = (960, 900)

# Crops are relative (left, top, right, bottom). They exclude people, poster
# copy, extra product views and retailer framing before background removal.
CROPS: dict[str, tuple[float, float, float, float]] = {
    "hnj-a119.webp": (0.18, 0.24, 0.86, 0.80),
    "hnj-983.webp": (0.20, 0.18, 0.82, 0.78),
    "zebra-a113-ritzy.webp": (0.18, 0.25, 0.86, 0.80),
    "zebra-atlas-2026.webp": (0.14, 0.18, 0.86, 0.72),
    "zebra-alistair-2024.webp": (0.18, 0.23, 0.84, 0.73),
    "gille-135.webp": (0.17, 0.24, 0.87, 0.78),
    "gille-843-circuit.webp": (0.17, 0.24, 0.87, 0.78),
    "gille-863-medusa.webp": (0.17, 0.23, 0.87, 0.79),
    "gille-873-celeste.webp": (0.17, 0.23, 0.87, 0.79),
    "gille-a118-2-adira.webp": (0.17, 0.24, 0.87, 0.79),
    "gille-a5009-phoenix.webp": (0.17, 0.23, 0.87, 0.79),
    "gille-adira-eclipse.webp": (0.23, 0.08, 0.77, 0.58),
    "gille-vertix-z501.webp": (0.20, 0.13, 0.83, 0.59),
    "gille-883-falcon.webp": (0.17, 0.25, 0.85, 0.74),
    "gille-astral.webp": (0.28, 0.25, 0.77, 0.66),
    "sec-carbon-mamba.webp": (0.15, 0.13, 0.84, 0.76),
    "sec-carbon-chronos.webp": (0.15, 0.13, 0.84, 0.76),
    "sec-nomad.webp": (0.14, 0.16, 0.86, 0.78),
    "sec-atmos.webp": (0.16, 0.15, 0.84, 0.72),
    "sec-saga.webp": (0.16, 0.15, 0.84, 0.72),
    "sec-odyssey.webp": (0.16, 0.15, 0.84, 0.72),
    "sec-breach.webp": (0.16, 0.15, 0.84, 0.72),
    "sec-pilot-2025.webp": (0.16, 0.15, 0.84, 0.72),
    "evo-m2.webp": (0.12, 0.18, 0.88, 0.76),
    "evo-vxr-8000.webp": (0.10, 0.18, 0.90, 0.77),
    "evo-sr-09.webp": (0.25, 0.15, 0.76, 0.84),
    "evo-tr-x.webp": (0.22, 0.17, 0.79, 0.83),
    "evo-gt-pro-rr.webp": (0.17, 0.16, 0.83, 0.84),
    "evo-sr-x-mono.webp": (0.22, 0.30, 0.72, 0.88),
    "evo-tourer.webp": (0.25, 0.29, 0.70, 0.88),
    "mt-atom-2-sv-pd-pure.webp": (0.37, 0.10, 0.90, 0.70),
    "bell-custom-500.webp": (0.18, 0.16, 0.82, 0.77),
    "rook-v152-mono.webp": (0.14, 0.23, 0.86, 0.77),
    "hjc-c10.webp": (0.15, 0.18, 0.84, 0.80),
    "hjc-i71.webp": (0.15, 0.18, 0.84, 0.80),
    "hjc-i31.webp": (0.15, 0.18, 0.84, 0.80),
    "agv-k3.webp": (0.06, 0.18, 0.67, 0.82),
}

def crop_relative(image: Image.Image, box: tuple[float, float, float, float]) -> Image.Image:
    w, h = image.size
    l, t, r, b = box
    return image.crop((round(l*w), round(t*h), round(r*w), round(b*h)))

def normalize(path: Path, session) -> None:
    image = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    if path.name in CROPS:
        image = crop_relative(image, CROPS[path.name])

    try:
        cutout = remove(image, session=session, alpha_matting=False, post_process_mask=True)
    except TypeError:
        cutout = remove(image, session=session)

    if not isinstance(cutout, Image.Image):
        cutout = Image.open(cutout)
    cutout = cutout.convert("RGBA")

    alpha = cutout.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"No foreground found for {path.name}")
    subject = cutout.crop(bbox)

    # Normalize visual scale without cropping the helmet.
    subject.thumbnail(MAX_SUBJECT, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS, "white")
    x = (CANVAS[0] - subject.width) // 2
    y = (CANVAS[1] - subject.height) // 2
    canvas.paste(subject.convert("RGB"), (x, y), subject.getchannel("A"))

    canvas.save(path, "WEBP", quality=92, method=6)
    print(f"{path.name}: {image.size} -> subject {subject.size} -> {CANVAS}")

def main() -> None:
    files = sorted(MEDIA_DIR.glob("*.webp"))
    if not files:
        raise SystemExit("No helmet media found")
    session = new_session("u2net")
    for path in files:
        normalize(path, session)
    print(f"Normalized {len(files)} helmet assets.")

if __name__ == "__main__":
    main()

from __future__ import annotations

from io import BytesIO
from pathlib import Path
import requests
from PIL import Image, ImageOps, ImageChops

OUT = Path("public/media/top-boxes")
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    "shad-sh39.webp": [
        "https://www.motostorm.it/images/products/large/borse/shad_sh39carbon_topcase_nero.jpg",
    ],
    "shad-sh33.webp": [
        "https://i.ebayimg.com/images/g/BqgAAeSwvSpp5r0n/s-l1600.webp",
    ],
    "shad-sh29.webp": [
        "https://media.motoblouz.it/images/catalogue/sh29_white_516f9acc6fda5.jpg",
    ],
    "coocase-s28-vivo.webp": [
        "https://cdn.shopify.com/s/files/1/1459/5894/products/S28-2.jpg?v=1644045268",
    ],
    "coocase-v28-fusion.webp": [
        "https://alkhubaizibikes.ae/cdn/shop/files/855520_1_1024x.jpg?v=1704867890",
    ],
    "coocase-v36-wizard.webp": [
        "https://www.nilmoto.com/imagenes/image/productos/vr03-023_1.jpg",
        "https://www.nilmoto.com/imagenes/image/productos/vr03-023_1_230.jpg",
    ],
    "coocase-s48-astra.webp": [
        "https://medias.la-becanerie.com/cache/images_articles/3/3840_2160/top-case-noir-48-l-coocase-astra-keyless-vendu-520433.jpg",
    ],
    "coocase-v50-reflex.webp": [
        "https://motocentral.in/cdn/shop/products/Coocase-V50-Reflex-Basic-Motorcycle-Topbox-1_1080x.jpg?v=1644047604",
    ],
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; MotoIndexPH-MediaSync/1.0; +https://motoindexph.com/)",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}

def fetch(candidates: list[str]) -> bytes:
    errors = []
    for url in candidates:
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            content_type = response.headers.get("content-type", "")
            if "image" not in content_type.lower() and len(response.content) < 10_000:
                raise RuntimeError(f"unexpected content type {content_type!r}")
            return response.content
        except Exception as exc:
            errors.append(f"{url}: {exc}")
    raise RuntimeError("\n".join(errors))

def normalize(data: bytes, destination: Path) -> None:
    with Image.open(BytesIO(data)) as source:
        image = ImageOps.exif_transpose(source).convert("RGBA")
        background = Image.new("RGBA", image.size, "white")
        background.alpha_composite(image)
        flattened = background.convert("RGB")
        corner = flattened.getpixel((0, 0))
        backdrop = Image.new("RGB", flattened.size, corner)
        difference = ImageChops.difference(flattened, backdrop).convert("L")
        mask = difference.point(lambda value: 255 if value > 14 else 0)
        bbox = mask.getbbox()
        if bbox:
            left, top, right, bottom = bbox
            pad_x = max(8, int((right - left) * 0.06))
            pad_y = max(8, int((bottom - top) * 0.06))
            left = max(0, left - pad_x)
            top = max(0, top - pad_y)
            right = min(flattened.width, right + pad_x)
            bottom = min(flattened.height, bottom + pad_y)
            flattened = flattened.crop((left, top, right, bottom))
        flattened.thumbnail((1020, 1020), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (1200, 1200), "white")
        x = (1200 - flattened.width) // 2
        y = (1200 - flattened.height) // 2
        canvas.paste(flattened, (x, y))
        canvas.save(destination, "WEBP", quality=91, method=6)

for filename, candidates in SOURCES.items():
    data = fetch(candidates)
    destination = OUT / filename
    normalize(data, destination)
    print(f"{filename}: {destination.stat().st_size} bytes")

#!/usr/bin/env python3
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

import fitz
from PIL import Image, ImageChops

PDF_URL = "https://storage.kawasaki.eu/repository/pl/pl-PL/Cenniki/Katalog_Kawasaki_2023.pdf"
OUT = Path("public/media/motorcycles/kawasaki-ninja-400.webp")
PAGE_INDEX = 5
CANVAS = 1200
MAX_SIZE = (1000, 880)


def download(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 MotoIndexMediaQA/1.0"})
    with urlopen(req, timeout=30) as response:
        return response.read()


def trim_near_white(image: Image.Image, threshold: int = 18) -> Image.Image:
    rgb = image.convert("RGB")
    bg = Image.new("RGB", rgb.size, "white")
    diff = ImageChops.difference(rgb, bg).convert("L")
    mask = diff.point(lambda p: 255 if p > threshold else 0)
    bbox = mask.getbbox()
    return rgb.crop(bbox) if bbox else rgb


def main() -> None:
    pdf = fitz.open(stream=download(PDF_URL), filetype="pdf")
    page = pdf[PAGE_INDEX]
    pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0), alpha=False)
    image = Image.open(BytesIO(pix.tobytes("png"))).convert("RGB")

    w, h = image.size
    # Official Kawasaki 2023 catalogue: clean Lime Green / Ebony product photo
    # in the lower-left white product panel on the Ninja 400 page.
    crop = image.crop((
        round(w * 0.018),
        round(h * 0.423),
        round(w * 0.305),
        round(h * 0.705),
    ))
    crop = trim_near_white(crop)
    crop.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (CANVAS, CANVAS), "white")
    x = (CANVAS - crop.width) // 2
    y = (CANVAS - crop.height) // 2
    canvas.paste(crop, (x, y))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, "WEBP", quality=90, method=6)
    print(f"updated kawasaki-ninja-400 from {PDF_URL} page {PAGE_INDEX + 1}")


if __name__ == "__main__":
    main()

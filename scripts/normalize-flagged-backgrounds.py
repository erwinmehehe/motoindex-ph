from pathlib import Path
from PIL import Image, ImageFilter
from rembg import remove, new_session

ROOT=Path.cwd()
MEDIA=ROOT/"public"/"media"/"motorcycles"
TARGETS=[
    "honda-x-adv",
    "bmw-f-900-gs",
    "royal-enfield-bear-650",
    "bmw-s-1000-r",
    "honda-adv-150",
    "ducati-streetfighter-v4",
    "kawasaki-ninja-h2",
    "honda-gold-wing",
    "ducati-panigale-v4",
    "ktm-790-duke",
    "bmw-s-1000-rr",
    "bmw-m-1000-rr",
    "honda-cbr650r",
    "kawasaki-ninja-1000",
]

session=new_session("u2netp")

for model_id in TARGETS:
    src=MEDIA/f"{model_id}.webp"
    image=Image.open(src).convert("RGBA")
    cut=remove(image,session=session,alpha_matting=True,alpha_matting_foreground_threshold=240,alpha_matting_background_threshold=12,alpha_matting_erode_size=8)
    alpha=cut.getchannel("A")
    bbox=alpha.getbbox()
    if not bbox:
        raise RuntimeError(f"{model_id}: empty subject after background removal")
    cut=cut.crop(bbox)
    cut.thumbnail((920,760),Image.Resampling.LANCZOS)
    canvas=Image.new("RGBA",(1200,1200),(255,255,255,255))
    x=(1200-cut.width)//2
    y=(1200-cut.height)//2
    canvas.alpha_composite(cut,(x,y))
    out=canvas.convert("RGB")
    out.save(src,"WEBP",quality=90,method=6)
    print(f"normalized {model_id}: {cut.width}x{cut.height} -> 1200x1200 white")

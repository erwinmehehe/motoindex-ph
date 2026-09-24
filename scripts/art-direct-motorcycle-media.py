#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "motorcycles"
CANVAS = 1200
TARGET_MAX_W = 1000
TARGET_MAX_H = 880
SKIP_IDS = {"suzuki-raider-pro"}


def safe_subject_crop(image: np.ndarray) -> tuple[np.ndarray, str]:
    """Crop only transparent or uniform near-white OUTER whitespace.

    This intentionally does not use GrabCut, flood-fill segmentation, or any
    foreground extraction on opaque photos. Those approaches can erase fairings,
    wheels, mirrors, windscreens, and white bodywork.
    """
    if image.ndim == 3 and image.shape[2] == 4:
        alpha = image[:, :, 3]
        ys, xs = np.where(alpha > 8)
        if len(xs):
            x0, x1 = int(xs.min()), int(xs.max()) + 1
            y0, y1 = int(ys.min()), int(ys.max()) + 1
            pad_x = max(8, int((x1 - x0) * 0.025))
            pad_y = max(8, int((y1 - y0) * 0.025))
            x0, x1 = max(0, x0 - pad_x), min(image.shape[1], x1 + pad_x)
            y0, y1 = max(0, y0 - pad_y), min(image.shape[0], y1 + pad_y)
            return image[y0:y1, x0:x1], "alpha-bounds"
        return image, "alpha-empty"

    bgr = image[:, :, :3]
    h, w = bgr.shape[:2]
    band = max(4, min(h, w) // 100)
    border = np.concatenate(
        [
            bgr[:band, :, :].reshape(-1, 3),
            bgr[-band:, :, :].reshape(-1, 3),
            bgr[:, :band, :].reshape(-1, 3),
            bgr[:, -band:, :].reshape(-1, 3),
        ],
        axis=0,
    )
    white_border_ratio = float(np.mean(np.all(border >= 238, axis=1)))

    # Only trim a rectangular outer border when the source is clearly a
    # white-background product image. Internal white pixels are never removed.
    if white_border_ratio >= 0.92:
        non_white = np.any(bgr < 245, axis=2)
        ys, xs = np.where(non_white)
        if len(xs):
            x0, x1 = int(xs.min()), int(xs.max()) + 1
            y0, y1 = int(ys.min()), int(ys.max()) + 1
            pad_x = max(10, int((x1 - x0) * 0.03))
            pad_y = max(10, int((y1 - y0) * 0.03))
            x0, x1 = max(0, x0 - pad_x), min(w, x1 + pad_x)
            y0, y1 = max(0, y0 - pad_y), min(h, y1 + pad_y)
            return image[y0:y1, x0:x1], "white-border-bounds"

    return image, "preserve-full-frame"


def to_bgr_on_white(image: np.ndarray) -> np.ndarray:
    if image.ndim == 3 and image.shape[2] == 4:
        bgr = image[:, :, :3].astype(np.float32)
        alpha = (image[:, :, 3].astype(np.float32) / 255.0)[..., None]
        return np.clip(bgr * alpha + 255.0 * (1.0 - alpha), 0, 255).astype(np.uint8)
    return image[:, :, :3]


def compose_canvas(image: np.ndarray) -> tuple[np.ndarray, dict]:
    image = to_bgr_on_white(image)
    h, w = image.shape[:2]
    scale = min(TARGET_MAX_W / max(w, 1), TARGET_MAX_H / max(h, 1))
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    interpolation = cv2.INTER_LANCZOS4 if scale > 1 else cv2.INTER_AREA
    resized = cv2.resize(image, (new_w, new_h), interpolation=interpolation)

    canvas = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    x = (CANVAS - new_w) // 2
    y = (CANVAS - new_h) // 2
    canvas[y : y + new_h, x : x + new_w] = resized

    return canvas, {
        "subject_width_ratio": round(new_w / CANVAS, 4),
        "subject_height_ratio": round(new_h / CANVAS, 4),
        "left_margin": x,
        "right_margin": CANVAS - x - new_w,
        "top_margin": y,
        "bottom_margin": CANVAS - y - new_h,
    }


def process(path: Path) -> dict:
    entity_id = path.stem
    if entity_id in SKIP_IDS:
        return {"file": path.name, "status": "skipped-suppressed"}

    image = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"file": path.name, "status": "error", "error": "decode failed"}
    if image.ndim != 3 or image.shape[2] not in (3, 4):
        return {"file": path.name, "status": "error", "error": f"unsupported channels: {image.shape}"}

    try:
        cropped, method = safe_subject_crop(image)
        canvas, stats = compose_canvas(cropped)
        ok = cv2.imwrite(str(path), canvas, [cv2.IMWRITE_WEBP_QUALITY, 90])
        if not ok:
            raise RuntimeError("WebP encode failed")
        return {"file": path.name, "status": "updated", "method": method, **stats}
    except Exception as exc:
        return {"file": path.name, "status": "error", "error": str(exc)}


def main() -> int:
    only_arg = next((arg for arg in sys.argv[1:] if arg.startswith("--only=")), None)
    only_ids = set(only_arg.split("=", 1)[1].split(",")) if only_arg else None
    files = sorted(
        path for path in MEDIA_DIR.glob("*.webp")
        if only_ids is None or path.stem in only_ids
    )
    results = [process(path) for path in files]
    updated = sum(r["status"] == "updated" for r in results)
    skipped = sum(r["status"].startswith("skipped") for r in results)
    errors = [r for r in results if r["status"] == "error"]

    report = {
        "canvas": f"{CANVAS}x{CANVAS}",
        "background": "#FFFFFF",
        "target_box": f"{TARGET_MAX_W}x{TARGET_MAX_H}",
        "policy": "non-destructive rectangular trim only; no opaque-image segmentation",
        "files": len(files),
        "updated": updated,
        "skipped": skipped,
        "errors": errors,
        "results": results,
    }
    report_path = ROOT / "artifacts" / "motorcycle-media-art-direction.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Motorcycle media safe normalization: {updated}/{len(files)} updated, {skipped} skipped, {len(errors)} errors.")
    for error in errors:
        print(f"- {error['file']}: {error['error']}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

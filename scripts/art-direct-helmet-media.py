#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "helmets"
CANVAS = 1200
TARGET_MAX_W = 900
TARGET_MAX_H = 900


def safe_outer_crop(image: np.ndarray) -> tuple[np.ndarray, str]:
    if image.ndim == 3 and image.shape[2] == 4:
        alpha = image[:, :, 3]
        ys, xs = np.where(alpha > 8)
        if len(xs):
            x0, x1 = int(xs.min()), int(xs.max()) + 1
            y0, y1 = int(ys.min()), int(ys.max()) + 1
            pad_x = max(8, int((x1 - x0) * 0.025))
            pad_y = max(8, int((y1 - y0) * 0.025))
            return image[
                max(0, y0 - pad_y):min(image.shape[0], y1 + pad_y),
                max(0, x0 - pad_x):min(image.shape[1], x1 + pad_x),
            ], "alpha-bounds"
        return image, "alpha-empty"

    bgr = image[:, :, :3]
    h, w = bgr.shape[:2]
    band = max(4, min(h, w) // 100)
    border = np.concatenate([
        bgr[:band].reshape(-1, 3),
        bgr[-band:].reshape(-1, 3),
        bgr[:, :band].reshape(-1, 3),
        bgr[:, -band:].reshape(-1, 3),
    ])
    white_ratio = float(np.mean(np.all(border >= 238, axis=1)))

    if white_ratio >= 0.92:
        non_white = np.any(bgr < 245, axis=2)
        ys, xs = np.where(non_white)
        if len(xs):
            x0, x1 = int(xs.min()), int(xs.max()) + 1
            y0, y1 = int(ys.min()), int(ys.max()) + 1
            pad_x = max(10, int((x1 - x0) * 0.03))
            pad_y = max(10, int((y1 - y0) * 0.03))
            return image[
                max(0, y0 - pad_y):min(h, y1 + pad_y),
                max(0, x0 - pad_x):min(w, x1 + pad_x),
            ], "white-border-bounds"

    return image, "preserve-full-frame"


def on_white(image: np.ndarray) -> np.ndarray:
    if image.ndim == 3 and image.shape[2] == 4:
        bgr = image[:, :, :3].astype(np.float32)
        alpha = (image[:, :, 3].astype(np.float32) / 255.0)[..., None]
        return np.clip(bgr * alpha + 255.0 * (1.0 - alpha), 0, 255).astype(np.uint8)
    return image[:, :, :3]


def compose(image: np.ndarray) -> tuple[np.ndarray, dict]:
    image = on_white(image)
    h, w = image.shape[:2]
    scale = min(TARGET_MAX_W / max(w, 1), TARGET_MAX_H / max(h, 1))
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))
    resized = cv2.resize(
        image,
        (new_w, new_h),
        interpolation=cv2.INTER_LANCZOS4 if scale > 1 else cv2.INTER_AREA,
    )
    canvas = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    x = (CANVAS - new_w) // 2
    y = (CANVAS - new_h) // 2
    canvas[y:y + new_h, x:x + new_w] = resized
    return canvas, {
        "subject_width_ratio": round(new_w / CANVAS, 4),
        "subject_height_ratio": round(new_h / CANVAS, 4),
        "left_margin": x,
        "right_margin": CANVAS - x - new_w,
        "top_margin": y,
        "bottom_margin": CANVAS - y - new_h,
    }


def process(path: Path) -> dict:
    image = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if image is None:
        return {"file": path.name, "status": "error", "error": "decode failed"}
    if image.ndim != 3 or image.shape[2] not in (3, 4):
        return {"file": path.name, "status": "error", "error": f"unsupported channels: {image.shape}"}
    try:
        cropped, method = safe_outer_crop(image)
        canvas, stats = compose(cropped)
        ok = cv2.imwrite(str(path), canvas, [cv2.IMWRITE_WEBP_QUALITY, 90])
        if not ok:
            raise RuntimeError("WebP encode failed")
        return {"file": path.name, "status": "updated", "method": method, **stats}
    except Exception as exc:
        return {"file": path.name, "status": "error", "error": str(exc)}


def main() -> int:
    only_arg = next((arg for arg in sys.argv[1:] if arg.startswith("--only=")), None)
    only_ids = set(only_arg.split("=", 1)[1].split(",")) if only_arg else None
    files = sorted(p for p in MEDIA_DIR.glob("*.webp") if only_ids is None or p.stem in only_ids)
    results = [process(path) for path in files]
    errors = [r for r in results if r["status"] == "error"]
    report = {
        "canvas": f"{CANVAS}x{CANVAS}",
        "background": "#FFFFFF",
        "target_box": f"{TARGET_MAX_W}x{TARGET_MAX_H}",
        "policy": "outer rectangular trim only; preserve the complete helmet image",
        "files": len(files),
        "updated": sum(r["status"] == "updated" for r in results),
        "errors": errors,
        "results": results,
    }
    report_path = ROOT / "artifacts" / "helmet-media-art-direction.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Helmet media normalization: {report['updated']}/{len(files)} updated, {len(errors)} errors.")
    for error in errors:
        print(f"- {error['file']}: {error['error']}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

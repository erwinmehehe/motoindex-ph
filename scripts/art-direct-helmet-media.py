#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "helmets"
CANVAS = 1200
TARGET_MAX_W = 900
TARGET_MAX_H = 900
SEGMENT_MAX = 640
WHITE = np.array([255, 255, 255], dtype=np.uint8)
SKIP_IDS = set()\n\n
def border_pixels(image: np.ndarray, band: int) -> np.ndarray:
    top = image[:band, :, :3].reshape(-1, 3)
    bottom = image[-band:, :, :3].reshape(-1, 3)
    left = image[:, :band, :3].reshape(-1, 3)
    right = image[:, -band:, :3].reshape(-1, 3)
    return np.concatenate([top, bottom, left, right], axis=0)


def flood_background_mask(image: np.ndarray) -> np.ndarray:
    h, w = image.shape[:2]
    band = max(4, min(h, w) // 100)
    border = border_pixels(image, band).astype(np.float32)
    spread = float(np.mean(np.std(border, axis=0)))
    tol = int(np.clip(16 + spread * 1.35, 16, 42))

    flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
    work = image.copy()
    step_x = max(32, w // 14)
    step_y = max(32, h // 14)
    seeds = (
        [(x, 0) for x in range(0, w, step_x)]
        + [(x, h - 1) for x in range(0, w, step_x)]
        + [(0, y) for y in range(0, h, step_y)]
        + [(w - 1, y) for y in range(0, h, step_y)]
        + [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    )
    flags = 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
    diff = (tol, tol, tol)
    for seed in seeds:
        try:
            cv2.floodFill(work, flood_mask, seed, (0, 0, 0), diff, diff, flags)
        except cv2.error:
            pass
    background = flood_mask[1:-1, 1:-1] > 0
    return ~background


def grabcut_foreground_mask(image: np.ndarray) -> np.ndarray:
    h, w = image.shape[:2]
    margin = max(3, int(round(min(h, w) * 0.018)))
    mask = np.full((h, w), cv2.GC_PR_BGD, dtype=np.uint8)
    mask[:margin, :] = cv2.GC_BGD
    mask[-margin:, :] = cv2.GC_BGD
    mask[:, :margin] = cv2.GC_BGD
    mask[:, -margin:] = cv2.GC_BGD

    x0, x1 = int(w * 0.07), int(w * 0.93)
    y0, y1 = int(h * 0.06), int(h * 0.94)
    mask[y0:y1, x0:x1] = cv2.GC_PR_FGD
    mask[:margin, :] = cv2.GC_BGD
    mask[-margin:, :] = cv2.GC_BGD
    mask[:, :margin] = cv2.GC_BGD
    mask[:, -margin:] = cv2.GC_BGD

    bg_model = np.zeros((1, 65), np.float64)
    fg_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(image, mask, None, bg_model, fg_model, 4, cv2.GC_INIT_WITH_MASK)
    return np.logical_or(mask == cv2.GC_FGD, mask == cv2.GC_PR_FGD)


def mask_quality(mask: np.ndarray) -> float:
    h, w = mask.shape
    area = float(mask.mean())
    if area < 0.025 or area > 0.82:
        return -100.0
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return -100.0
    bw = (xs.max() - xs.min() + 1) / w
    bh = (ys.max() - ys.min() + 1) / h
    edge_ratio = float(
        np.mean(
            np.concatenate(
                [
                    mask[:4, :].ravel(),
                    mask[-4:, :].ravel(),
                    mask[:, :4].ravel(),
                    mask[:, -4:].ravel(),
                ]
            )
        )
    )
    center = float(mask[h // 3 : (2 * h) // 3, w // 3 : (2 * w) // 3].mean())
    return (1.0 - edge_ratio) * 3.0 + center + min(bw, 0.9) + min(bh, 0.9) - abs(area - 0.30)


def refine_mask(mask: np.ndarray) -> np.ndarray:
    hard = (mask.astype(np.uint8) * 255)
    kernel = np.ones((3, 3), np.uint8)
    hard = cv2.morphologyEx(hard, cv2.MORPH_CLOSE, kernel, iterations=1)

    count, labels, stats, _ = cv2.connectedComponentsWithStats((hard > 0).astype(np.uint8), 8)
    if count > 1:
        areas = stats[1:, cv2.CC_STAT_AREA]
        largest_label = int(np.argmax(areas)) + 1
        largest = stats[largest_label]
        lx, ly, lw, lh = [int(v) for v in largest[:4]]
        pad_x = max(24, int(lw * 0.12))
        pad_y = max(24, int(lh * 0.12))
        x0, x1 = max(0, lx - pad_x), min(mask.shape[1], lx + lw + pad_x)
        y0, y1 = max(0, ly - pad_y), min(mask.shape[0], ly + lh + pad_y)
        keep = np.zeros_like(hard)
        for label in range(1, count):
            x, y, w, h, area = [int(v) for v in stats[label]]
            if label == largest_label or (
                area >= 120
                and x < x1
                and x + w > x0
                and y < y1
                and y + h > y0
            ):
                keep[labels == label] = 255
        hard = keep

    return cv2.GaussianBlur(hard, (0, 0), 0.75)


def subject_cutout(image: np.ndarray) -> tuple[np.ndarray, np.ndarray, str]:
    h, w = image.shape[:2]
    band = max(4, min(h, w) // 100)
    border = border_pixels(image, band)
    white_ratio = float(np.mean(np.all(border >= 238, axis=1)))
    neutral_ratio = float(np.mean((border.max(axis=1) - border.min(axis=1)) <= 18))
    spread = float(np.mean(np.std(border.astype(np.float32), axis=0)))

    segment_scale = min(1.0, SEGMENT_MAX / max(h, w))
    if segment_scale < 1.0:
        seg_w = max(2, int(round(w * segment_scale)))
        seg_h = max(2, int(round(h * segment_scale)))
        segment_image = cv2.resize(image, (seg_w, seg_h), interpolation=cv2.INTER_AREA)
    else:
        segment_image = image

    candidates: list[tuple[str, np.ndarray]] = []
    use_grabcut = True
    if white_ratio >= 0.38 or (neutral_ratio >= 0.68 and spread <= 38):
        flood = flood_background_mask(segment_image)
        candidates.append(("edge-background", flood))
        flood_area = float(flood.mean())
        # A good studio extraction is compact and leaves the canvas border behind.
        # Skip GrabCut in that case so thin spokes, mirrors and controls stay crisp.
        if 0.025 <= flood_area <= 0.45 and mask_quality(flood) >= 2.2:
            use_grabcut = False
    if use_grabcut:
        try:
            candidates.append(("grabcut", grabcut_foreground_mask(segment_image)))
        except cv2.error:
            pass

    if not candidates:
        raise RuntimeError("no segmentation candidate")

    method, mask = max(candidates, key=lambda item: mask_quality(item[1]))
    if mask_quality(mask) < -20:
        raise RuntimeError("segmentation confidence too low")
    alpha_small = refine_mask(mask)
    alpha = (
        cv2.resize(alpha_small, (w, h), interpolation=cv2.INTER_LINEAR)
        if alpha_small.shape != (h, w)
        else alpha_small
    )

    hard = alpha >= 40
    ys, xs = np.where(hard)
    if len(xs) == 0:
        raise RuntimeError("empty foreground mask")

    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    sw, sh = x1 - x0, y1 - y0
    pad_x = max(8, int(sw * 0.025))
    pad_y = max(8, int(sh * 0.025))
    x0, x1 = max(0, x0 - pad_x), min(w, x1 + pad_x)
    y0, y1 = max(0, y0 - pad_y), min(h, y1 + pad_y)

    crop = image[y0:y1, x0:x1].astype(np.float32)
    a = alpha[y0:y1, x0:x1].astype(np.float32) / 255.0
    a = a[..., None]
    cutout = np.clip(crop * a + 255.0 * (1.0 - a), 0, 255).astype(np.uint8)
    return cutout, alpha[y0:y1, x0:x1], method


def compose_canvas(cutout: np.ndarray, alpha: np.ndarray) -> tuple[np.ndarray, dict]:
    h, w = cutout.shape[:2]
    scale = min(TARGET_MAX_W / w, TARGET_MAX_H / h)
    new_w = max(1, int(round(w * scale)))
    new_h = max(1, int(round(h * scale)))

    resized = cv2.resize(cutout, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4 if scale > 1 else cv2.INTER_AREA)
    resized_alpha = cv2.resize(alpha, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

    canvas = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    x = (CANVAS - new_w) // 2
    y = min(CANVAS - new_h, max(0, (CANVAS - new_h) // 2 + 18))

    a = (resized_alpha.astype(np.float32) / 255.0)[..., None]
    region = canvas[y : y + new_h, x : x + new_w].astype(np.float32)
    fg = resized.astype(np.float32)
    canvas[y : y + new_h, x : x + new_w] = np.clip(fg * a + region * (1.0 - a), 0, 255).astype(np.uint8)

    stats = {
        "subject_width_ratio": round(new_w / CANVAS, 4),
        "subject_height_ratio": round(new_h / CANVAS, 4),
        "left_margin": x,
        "right_margin": CANVAS - x - new_w,
        "top_margin": y,
        "bottom_margin": CANVAS - y - new_h,
    }
    return canvas, stats


def process(path: Path) -> dict:
    entity_id = path.stem
    if entity_id in SKIP_IDS:
        return {"file": path.name, "status": "skipped-suppressed"}

    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        return {"file": path.name, "status": "error", "error": "decode failed"}

    try:
        cutout, alpha, method = subject_cutout(image)
        canvas, stats = compose_canvas(cutout, alpha)
        ok = cv2.imwrite(str(path), canvas, [cv2.IMWRITE_WEBP_QUALITY, 88])
        if not ok:
            raise RuntimeError("WebP encode failed")
        return {"file": path.name, "status": "updated", "method": method, **stats}
    except Exception as exc:
        return {"file": path.name, "status": "error", "error": str(exc)}


def main() -> int:
    files = sorted(MEDIA_DIR.glob("*.webp"))
    results = [process(path) for path in files]
    updated = sum(r["status"] == "updated" for r in results)
    skipped = sum(r["status"].startswith("skipped") for r in results)
    errors = [r for r in results if r["status"] == "error"]

    report = {
        "canvas": f"{CANVAS}x{CANVAS}",
        "background": "#FFFFFF",
        "target_subject_box": f"{TARGET_MAX_W}x{TARGET_MAX_H}",
        "files": len(files),
        "updated": updated,
        "skipped": skipped,
        "errors": errors,
        "results": results,
    }
    report_path = ROOT / "artifacts" / "helmet-media-art-direction.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Helmet media art direction: {updated}/{len(files)} updated, {skipped} skipped, {len(errors)} errors.")
    for error in errors:
        print(f"- {error['file']}: {error['error']}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())

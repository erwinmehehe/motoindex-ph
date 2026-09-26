#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "motorcycles"
ARTIFACT_DIR = ROOT / "artifacts"

TARGETS = [
    "honda-cb650r",
    "honda-cbr650r",
    "honda-xl750-transalp",
    "honda-crf1100l-africa-twin",
    "honda-x-adv",
    "honda-adv-150",
]

CANVAS = 1200
TARGET_W = 1020
TARGET_H = 820


def find_press_panel(image: np.ndarray) -> tuple[int, int, int, int]:
    nonwhite = np.any(image[:, :, :3] < 248, axis=2)
    row_ratio = nonwhite.mean(axis=1)
    col_ratio = nonwhite.mean(axis=0)

    rows = np.where(row_ratio > 0.52)[0]
    cols = np.where(col_ratio > 0.52)[0]
    if len(rows) < 40 or len(cols) < 40:
        return (0, 0, image.shape[1], image.shape[0])

    return (
        int(cols.min()),
        int(rows.min()),
        int(cols.max()) + 1,
        int(rows.max()) + 1,
    )


def grabcut_subject(panel: np.ndarray) -> np.ndarray:
    h, w = panel.shape[:2]
    bgr = panel[:, :, :3]
    lo = bgr.min(axis=2)
    hi = bgr.max(axis=2)
    chroma = hi.astype(np.int16) - lo.astype(np.int16)

    mask = np.full((h, w), cv2.GC_PR_BGD, dtype=np.uint8)

    # Outer press-photo margins and the caption strip are known background.
    bx = max(8, int(w * 0.035))
    by = max(8, int(h * 0.035))
    mask[:by, :] = cv2.GC_BGD
    mask[-by:, :] = cv2.GC_BGD
    mask[:, :bx] = cv2.GC_BGD
    mask[:, -bx:] = cv2.GC_BGD

    caption_top = int(h * 0.86)
    mask[caption_top:, :] = cv2.GC_BGD

    # The motorcycle lives in the central product-photo region.
    x0, x1 = int(w * 0.055), int(w * 0.945)
    y0, y1 = int(h * 0.055), int(h * 0.83)
    mask[y0:y1, x0:x1] = cv2.GC_PR_FGD

    # Strong dark / chromatic motorcycle pixels are reliable foreground seeds.
    central = np.zeros((h, w), dtype=bool)
    central[y0:y1, x0:x1] = True
    strong_fg = central & ((lo < 145) | ((chroma > 36) & (lo < 225)))
    strong_fg = cv2.morphologyEx(strong_fg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    mask[strong_fg.astype(bool)] = cv2.GC_FGD

    # Neutral light press background is a reliable probable-background seed.
    neutral_bg = (chroma <= 22) & (lo >= 170)
    neutral_bg &= ~central | (lo >= 205)
    mask[neutral_bg] = np.minimum(mask[neutral_bg], cv2.GC_PR_BGD)

    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(bgr, mask, None, bgd, fgd, 7, cv2.GC_INIT_WITH_MASK)

    fg = np.isin(mask, (cv2.GC_FGD, cv2.GC_PR_FGD)).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=2)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8), iterations=1)

    # Retain the largest motorcycle component and nearby attached details;
    # discard the tiny detached caption/date text components.
    count, labels, stats, centroids = cv2.connectedComponentsWithStats(fg, connectivity=8)
    if count <= 1:
        raise RuntimeError("GrabCut produced no foreground")

    areas = stats[1:, cv2.CC_STAT_AREA]
    largest = int(np.argmax(areas)) + 1
    lx = int(stats[largest, cv2.CC_STAT_LEFT])
    ly = int(stats[largest, cv2.CC_STAT_TOP])
    lw = int(stats[largest, cv2.CC_STAT_WIDTH])
    lh = int(stats[largest, cv2.CC_STAT_HEIGHT])
    max_area = int(stats[largest, cv2.CC_STAT_AREA])

    ex0 = max(0, lx - int(w * 0.09))
    ey0 = max(0, ly - int(h * 0.10))
    ex1 = min(w, lx + lw + int(w * 0.09))
    ey1 = min(h, ly + lh + int(h * 0.10))

    keep = np.zeros_like(fg)
    for idx in range(1, count):
        area = int(stats[idx, cv2.CC_STAT_AREA])
        x = int(stats[idx, cv2.CC_STAT_LEFT])
        y = int(stats[idx, cv2.CC_STAT_TOP])
        ww = int(stats[idx, cv2.CC_STAT_WIDTH])
        hh = int(stats[idx, cv2.CC_STAT_HEIGHT])
        cx, cy = centroids[idx]

        intersects = not (x + ww < ex0 or x > ex1 or y + hh < ey0 or y > ey1)
        large_enough = area >= max(180, int(max_area * 0.004))
        not_caption = cy < h * 0.84
        if (idx == largest) or (intersects and large_enough and not_caption):
            keep[labels == idx] = 1

    keep = cv2.morphologyEx(keep, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8), iterations=1)
    return keep


def composite_on_white(panel: np.ndarray, mask: np.ndarray) -> np.ndarray:
    alpha = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 0.8)
    alpha = np.clip(alpha, 0.0, 1.0)[..., None]
    white = np.full_like(panel[:, :, :3], 255, dtype=np.uint8)
    out = panel[:, :, :3].astype(np.float32) * alpha + white.astype(np.float32) * (1.0 - alpha)
    return np.clip(out, 0, 255).astype(np.uint8)


def bbox_from_mask(mask: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.where(mask > 0)
    if not len(xs):
        raise RuntimeError("No subject pixels after cleanup")
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    pad_x = max(18, int((x1 - x0) * 0.04))
    pad_y = max(18, int((y1 - y0) * 0.05))
    return (
        max(0, x0 - pad_x),
        max(0, y0 - pad_y),
        min(mask.shape[1], x1 + pad_x),
        min(mask.shape[0], y1 + pad_y),
    )


def compose_white_canvas(crop: np.ndarray) -> np.ndarray:
    h, w = crop.shape[:2]
    scale = min(TARGET_W / max(w, 1), TARGET_H / max(h, 1))
    nw = max(1, int(round(w * scale)))
    nh = max(1, int(round(h * scale)))
    interpolation = cv2.INTER_LANCZOS4 if scale > 1 else cv2.INTER_AREA
    resized = cv2.resize(crop, (nw, nh), interpolation=interpolation)

    canvas = np.full((CANVAS, CANVAS, 3), 255, dtype=np.uint8)
    x = (CANVAS - nw) // 2
    y = (CANVAS - nh) // 2
    canvas[y:y + nh, x:x + nw] = resized
    return canvas


def clean_one(entity_id: str) -> tuple[np.ndarray, np.ndarray, dict]:
    path = MEDIA_DIR / f"{entity_id}.webp"
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        raise RuntimeError(f"Could not decode {path}")

    before = image.copy()
    px0, py0, px1, py1 = find_press_panel(image)
    panel = image[py0:py1, px0:px1].copy()

    subject_mask = grabcut_subject(panel)
    cleaned_panel = composite_on_white(panel, subject_mask)
    sx0, sy0, sx1, sy1 = bbox_from_mask(subject_mask)
    crop = cleaned_panel[sy0:sy1, sx0:sx1]
    output = compose_white_canvas(crop)

    ok = cv2.imwrite(str(path), output, [cv2.IMWRITE_WEBP_QUALITY, 92])
    if not ok:
        raise RuntimeError(f"Could not encode {path}")

    white_ratio = float(np.mean(np.all(output >= 248, axis=2)))
    stats = {
        "entity_id": entity_id,
        "press_panel": [px0, py0, px1, py1],
        "subject_bbox_in_panel": [sx0, sy0, sx1, sy1],
        "white_pixel_ratio": round(white_ratio, 4),
    }
    return before, output, stats


def thumb(image: np.ndarray, label: str) -> np.ndarray:
    size = 360
    out = cv2.resize(image, (size, size), interpolation=cv2.INTER_AREA)
    bar = np.full((42, size, 3), 255, dtype=np.uint8)
    cv2.putText(bar, label, (10, 27), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (20, 20, 20), 1, cv2.LINE_AA)
    return np.vstack([out, bar])


def main() -> int:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    report = []

    for entity_id in TARGETS:
        before, after, stats = clean_one(entity_id)
        rows.append(np.hstack([thumb(before, f"{entity_id} BEFORE"), thumb(after, "AFTER")]))
        report.append(stats)

    contact_sheet = np.vstack(rows)
    cv2.imwrite(str(ARTIFACT_DIR / "honda-white-background-cleanup.png"), contact_sheet)
    (ARTIFACT_DIR / "honda-white-background-cleanup.json").write_text(
        json.dumps(report, indent=2),
        encoding="utf-8",
    )

    print(f"Cleaned {len(TARGETS)} Honda press images onto pure white product canvases.")
    for item in report:
        print(f"- {item['entity_id']}: white={item['white_pixel_ratio']:.1%}, subject={item['subject_bbox_in_panel']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

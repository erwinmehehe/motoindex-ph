#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MEDIA_DIR = ROOT / "public" / "media" / "motorcycles"
CANVAS = 1200
SKIP_IDS = {"suzuki-raider-pro", "vespa-primavera-150"}


def border_pixels(image: np.ndarray, band: int = 12) -> np.ndarray:
    top = image[:band, :, :3].reshape(-1, 3)
    bottom = image[-band:, :, :3].reshape(-1, 3)
    left = image[:, :band, :3].reshape(-1, 3)
    right = image[:, -band:, :3].reshape(-1, 3)
    return np.concatenate([top, bottom, left, right], axis=0)


def inspect(path: Path) -> tuple[list[str], list[str]]:
    failures: list[str] = []
    warnings: list[str] = []
    image = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if image is None:
        return [f"{path.name}: decode failed"], warnings

    h, w = image.shape[:2]
    if (w, h) != (CANVAS, CANVAS):
        failures.append(f"{path.name}: expected {CANVAS}x{CANVAS}, got {w}x{h}")
        return failures, warnings

    border = border_pixels(image)
    near_white = np.all(border >= 248, axis=1)
    white_ratio = float(near_white.mean())
    if white_ratio < 0.995:
        failures.append(f"{path.name}: white border coverage {white_ratio:.3%} is below 99.5%")

    foreground = np.any(image < 245, axis=2)
    ys, xs = np.where(foreground)
    if len(xs) == 0:
        failures.append(f"{path.name}: no visible subject detected")
        return failures, warnings

    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    bw, bh = x1 - x0, y1 - y0
    wr, hr = bw / CANVAS, bh / CANVAS
    left, right = x0, CANVAS - x1
    top, bottom = y0, CANVAS - y1

    subject_scale = max(wr, hr)
    if subject_scale < 0.56:
        failures.append(f"{path.name}: subject is too small ({wr:.1%}w x {hr:.1%}h)")
    elif subject_scale < 0.62:
        warnings.append(f"{path.name}: subject is slightly small ({wr:.1%}w x {hr:.1%}h)")
    if wr > 0.94 or hr > 0.94:
        failures.append(f"{path.name}: subject is too close to clipping ({wr:.1%}w x {hr:.1%}h)")
    if min(left, right, top, bottom) < 28:
        failures.append(f"{path.name}: subject margin below 28px (L{left}/R{right}/T{top}/B{bottom})")

    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    if abs(cx - CANVAS / 2) > 95:
        warnings.append(f"{path.name}: horizontal visual center is off by {abs(cx - CANVAS / 2):.0f}px")
    if abs(cy - CANVAS / 2) > 130:
        warnings.append(f"{path.name}: vertical visual center is off by {abs(cy - CANVAS / 2):.0f}px")

    return failures, warnings


def main() -> int:
    files = [p for p in sorted(MEDIA_DIR.glob("*.webp")) if p.stem not in SKIP_IDS]
    failures: list[str] = []
    warnings: list[str] = []
    for path in files:
        bad, warn = inspect(path)
        failures.extend(bad)
        warnings.extend(warn)

    print(f"Motorcycle art-direction audit: {len(files)} visible local WebPs checked.")
    if warnings:
        print(f"Warnings: {len(warnings)}")
        for warning in warnings[:30]:
            print(f"- {warning}")
        if len(warnings) > 30:
            print(f"- ...and {len(warnings) - 30} more")

    if failures:
        print(f"Failures: {len(failures)}")
        for failure in failures[:60]:
            print(f"- {failure}")
        if len(failures) > 60:
            print(f"- ...and {len(failures) - 60} more")
        return 1

    print("Art-direction audit passed: pure-white borders, safe margins, and usable subject scale.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

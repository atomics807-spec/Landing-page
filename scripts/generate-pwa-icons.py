#!/usr/bin/env python3
"""Generate PWA icons from public/logo.png.

Outputs (into public/):
  - icon-192.png         (192x192, purpose: any)
  - icon-512.png         (512x512, purpose: any)
  - maskable-192.png     (192x192, purpose: maskable, full-bleed bg + safe-zone logo)
  - maskable-512.png     (512x512, purpose: maskable)
  - apple-touch-icon.png (180x180)
  - favicon-32.png       (32x32)
  - favicon-16.png       (16x16)

Brand colors come from tailwind.config.ts / theme-color:
  teal-600 #0d9488 (primary), white background.
"""

import os
from PIL import Image

BRAND_BG = (13, 148, 136, 255)   # #0d9488 teal-600
WHITE = (255, 255, 255, 255)

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "..", "public")
SOURCE = os.path.join(PUBLIC_DIR, "logo.png")


def load_logo() -> Image.Image:
    """Load the source logo and convert to RGBA."""
    im = Image.open(SOURCE)
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    return im


def fit_logo(logo: Image.Image, target: int, bg_color, padding_ratio: float = 0.0) -> Image.Image:
    """Create a target x target canvas with bg_color and the logo fit inside.

    padding_ratio adds transparent/white margins around the logo (e.g. 0.1 = 10%).
    """
    canvas = Image.new("RGBA", (target, target), bg_color)
    avail = int(target * (1 - 2 * padding_ratio))
    scaled = logo.copy()
    scaled.thumbnail((avail, avail), Image.LANCZOS)
    x = (target - scaled.width) // 2
    y = (target - scaled.height) // 2
    canvas.alpha_composite(scaled, (x, y))
    return canvas


def main() -> None:
    logo = load_logo()
    print(f"Source logo: {logo.size} {logo.mode}")

    # any-purpose icons: white background, logo fit with small margin so it isn't edge-kissed
    for size in (192, 512):
        out = fit_logo(logo, size, WHITE, padding_ratio=0.06)
        path = os.path.join(PUBLIC_DIR, f"icon-{size}.png")
        out.convert("RGB").save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({size}x{size})")

    # maskable icons: full-bleed brand background, logo within ~80% safe zone
    for size in (192, 512):
        out = fit_logo(logo, size, BRAND_BG, padding_ratio=0.10)
        path = os.path.join(PUBLIC_DIR, f"maskable-{size}.png")
        out.convert("RGB").save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({size}x{size} maskable)")

    # apple-touch-icon: white bg, square, minimal margin
    apple = fit_logo(logo, 180, WHITE, padding_ratio=0.04)
    apple.convert("RGB").save(os.path.join(PUBLIC_DIR, "apple-touch-icon.png"), "PNG", optimize=True)
    print("Wrote apple-touch-icon.png (180x180)")

    # favicons
    for size in (16, 32):
        fav = fit_logo(logo, size, WHITE, padding_ratio=0.02)
        fav.convert("RGB").save(os.path.join(PUBLIC_DIR, f"favicon-{size}.png"), "PNG", optimize=True)
        print(f"Wrote favicon-{size}.png ({size}x{size})")

    # Combined ICO favicon (16+32). Keeps existing favicon.ico name working.
    ico32 = fit_logo(logo, 32, WHITE, 0.02).convert("RGB")
    ico16 = fit_logo(logo, 16, WHITE, 0.02).convert("RGB")
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    ico32.save(ico_path, format="ICO", sizes=[(32, 32), (16, 16)], append_images=[ico16])
    print(f"Wrote {ico_path}")


if __name__ == "__main__":
    main()

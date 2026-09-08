"""Create the public derivative; never modify the private camera original.

Run with Python + Pillow. EXIF orientation is baked in and metadata stripped.
"""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source = root / "picture" / "CA1A3276.JPG"
destination = root / "public" / "images" / "identity" / "nguyen-hoang-phuc.webp"
destination.parent.mkdir(parents=True, exist_ok=True)
with Image.open(source) as original:
    portrait = ImageOps.exif_transpose(original).convert("RGB")
    portrait.thumbnail((1800, 2700), Image.Resampling.LANCZOS)
    portrait.save(destination, "WEBP", quality=84, method=6, exif=b"", icc_profile=b"")
    print(f"{destination}: {portrait.size}, {destination.stat().st_size:,} bytes")

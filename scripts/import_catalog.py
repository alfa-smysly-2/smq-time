"""Extract product copy and transparent watch images from the supplied PDFs.

Usage: python3 scripts/import_catalog.py rolex.pdf audemars-piguet.pdf
Requires pypdf and Pillow. The PDFs are source material and are not committed.
"""

from __future__ import annotations

import io
import json
import re
import sys
from pathlib import Path

from PIL import Image
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "watches"
THUMBS = ASSETS / "thumbs"
DATA = ROOT / "catalog.json"


def extract(pdf_path: Path, brand: str) -> list[dict]:
    reader = PdfReader(str(pdf_path))
    products: list[dict] = []
    for page_number, page in enumerate(reader.pages[1:-1], start=2):
        lines = [line.strip() for line in (page.extract_text() or "").splitlines() if line.strip()]
        quality_line = next(i for i, line in enumerate(lines) if "ПРЕМИУМ КАЧЕСТВО" in line)
        article_line = next(i for i, line in enumerate(lines) if line.startswith("ART:"))
        article = lines[article_line].split(":", 1)[1].strip()
        model = lines[quality_line + 1]
        variant = lines[quality_line + 2]
        size_match = re.search(r"(\d+)\s*мм", variant)
        if not size_match:
            raise ValueError(f"Size missing on {pdf_path.name} page {page_number}")
        description = " ".join(lines[quality_line + 3 : article_line])
        description = re.sub(r"\s+", " ", description).replace("- ", "-")
        images = list(page.images)
        if len(images) != 1:
            raise ValueError(f"Expected one watch image on {pdf_path.name} page {page_number}, got {len(images)}")
        image = Image.open(io.BytesIO(images[0].data)).convert("RGBA")
        # Remove the generous transparent margins carried over from the PDF.
        # This reduces transferred pixels and lets the watch fill its card.
        bounds = image.getchannel("A").getbbox()
        if bounds:
            left, top, right, bottom = bounds
            pad = max(8, round(max(right - left, bottom - top) * 0.018))
            image = image.crop(
                (
                    max(0, left - pad),
                    max(0, top - pad),
                    min(image.width, right + pad),
                    min(image.height, bottom + pad),
                )
            )
        image.thumbnail((900, 1100), Image.Resampling.LANCZOS)
        image_name = f"{article.lower()}.webp"
        image.save(ASSETS / image_name, "WEBP", quality=76, method=6)
        thumb = image.copy()
        thumb.thumbnail((480, 600), Image.Resampling.LANCZOS)
        thumb.save(THUMBS / image_name, "WEBP", quality=68, method=4)
        products.append(
            {
                "id": article.lower(),
                "article": article,
                "brand": brand,
                "model": model,
                "size": int(size_match.group(1)),
                "variant": variant.split(" · ", 1)[1] if " · " in variant else "",
                "description": description,
                "image": f"assets/watches/{image_name}",
                "source": pdf_path.name,
                "sourcePage": page_number,
            }
        )
    return products


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: import_catalog.py rolex.pdf audemars-piguet.pdf")
    ASSETS.mkdir(parents=True, exist_ok=True)
    THUMBS.mkdir(parents=True, exist_ok=True)
    products = extract(Path(sys.argv[1]), "Rolex") + extract(Path(sys.argv[2]), "Audemars Piguet")
    ids = [product["id"] for product in products]
    if len(ids) != 93 or len(ids) != len(set(ids)):
        raise ValueError(f"Expected 93 unique products, got {len(ids)}")
    DATA.write_text(json.dumps(products, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(products)} products to {DATA}")


if __name__ == "__main__":
    main()

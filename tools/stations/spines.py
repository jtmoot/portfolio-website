"""Samples a spine colour from each book cover in public/covers into tools/stations/spines.json.

Run with Pillow available: python tools/stations/spines.py
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]


def spine_colour(path: Path) -> str:
    """Returns the cover's most common colour that is neither near white nor near black, as hex."""
    im = Image.open(path).convert("RGB").resize((48, 72)).quantize(6).convert("RGB")
    ranked = sorted(im.getcolors(48 * 72), reverse=True)
    for _, (r, g, b) in ranked:
        if 40 < (r + g + b) / 3 < 225:
            return f"#{r:02x}{g:02x}{b:02x}"
    _, (r, g, b) = ranked[0]
    return f"#{r:02x}{g:02x}{b:02x}"


def main() -> None:
    colours = {p.stem: spine_colour(p) for p in sorted((ROOT / "public/covers").glob("*.jpg"))}
    (ROOT / "tools/stations/spines.json").write_text(json.dumps(colours, indent=2) + "\n")


if __name__ == "__main__":
    main()

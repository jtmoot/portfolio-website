"""Builds the GitHub profile README banner in the pad's style.

Writes docs/github-readme/banner-light.svg and banner-dark.svg: dotted pad paper, the name in
Gloria Hallelujah with a hand-drawn underline, the role and intro in Geist Mono, three halftone
stickers with Garvit-style tags, and a crooked, taped poster. Every letter is an outline (GitHub
will not load web fonts inside an image), so the banner looks the same everywhere.

To change the font or stop lowercasing later, edit the settings below and run again.

Requires: pip install fonttools brotli pillow
Run: python tools/readme/make_banner.py
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "github-readme"

# --- Settings -------------------------------------------------------------------------------------
HAND_FONT = ROOT / "public/fonts/GloriaHallelujah-Regular.woff2"
MONO_FONT = ROOT / "public/fonts/GeistMono-Variable.woff2"
LOWERCASE = True
GREETING = "hello, i'm"
NAME = "joshua moorehead"
ROLE = "ml systems engineer"
INTRO = [
    "i build ml systems and the data plumbing under them.",
    "ms in ece at carnegie mellon. barbells, sprints,",
    "short ribs and history books off the keyboard.",
]
POSTER = ["make it work,", "make it right,", "make it fast."]

W, H = 1200, 420


@dataclass(frozen=True)
class Theme:
    """Colours for one banner, matching the site's day and night tokens."""

    name: str
    paper: str
    dots: str
    ink: str
    muted: str
    rule: str
    card: str
    tape: str
    tape_peach: str
    accent: str


DAY = Theme("light", "#f4f3ee", "#c9c7bd", "#2a2a28", "#6f6d66", "#dcdad2", "#ecebe5", "#f0d68c", "#e8b48c", "#d9622b")
NIGHT = Theme("dark", "#17181a", "#2c2d31", "#d9d7cf", "#8e8c85", "#2a2b2e", "#1f2023", "#b9a46a", "#b98b6c", "#e07a45")


class Outliner:
    """Turns a string into one SVG path in a given font, size and position."""

    def __init__(self, path: Path, weight: float | None = None) -> None:
        """Loads a font; for a variable font, pins its weight axis.

        Args:
            path: A .woff2, .woff or .ttf file.
            weight: The wght value for a variable font, or None.
        """
        font = TTFont(str(path))
        if weight is not None and "fvar" in font:
            font = instancer.instantiateVariableFont(font, {"wght": weight})
        self.font = font
        self.glyphs = font.getGlyphSet()
        self.cmap = font.getBestCmap()
        self.upm = font["head"].unitsPerEm
        self.hmtx = font["hmtx"]

    def width(self, text: str, size: float) -> float:
        """Advance width of `text` at `size` px."""
        total = 0
        for ch in text:
            name = self.cmap.get(ord(ch))
            if name:
                total += self.hmtx[name][0]
        return total * size / self.upm

    def path(self, text: str, x: float, y: float, size: float) -> str:
        """SVG path data for `text` with its baseline starting at (x, y).

        Args:
            text: The string to outline.
            x: Left edge in px.
            y: Baseline in px.
            size: Font size in px.

        Returns:
            Path data, one subpath per glyph contour.
        """
        k = size / self.upm
        pen = SVGPathPen(self.glyphs, ntos=lambda v: f"{v:.1f}")
        cursor = x
        for ch in text:
            name = self.cmap.get(ord(ch))
            if not name:
                continue
            self.glyphs[name].draw(TransformPen(pen, (k, 0, 0, -k, cursor, y)))
            cursor += self.hmtx[name][0] * k
        return pen.getCommands()


def case(s: str) -> str:
    """Applies the LOWERCASE setting."""
    return s.lower() if LOWERCASE else s


def halftone(src: Path, box: tuple[float, float, float], crop: tuple[float, float, float, float], ink: str, paper: str, cell: float = 4.2) -> str:
    """A die-cut halftone sticker, as SVG circles, from a photo on white.

    Args:
        src: The photo.
        box: (x, y, width) of the sticker in the banner, px.
        crop: (x, y, w, h) fractions of the photo to use.
        ink: Dot colour.
        paper: The sticker's white border colour.
        cell: Halftone cell size in px.

    Returns:
        SVG markup: a white border made of slightly larger dots, then the ink dots.
    """
    img = Image.open(src).convert("RGBA")
    cx, cy, cw, ch = crop
    img = img.crop((int(img.width * cx), int(img.height * cy), int(img.width * (cx + cw)), int(img.height * (cy + ch))))
    bx, by, bw = box
    cols = int(bw / cell)
    rows = int(cols * img.height / img.width)
    small = img.resize((cols, rows), Image.LANCZOS)
    border, dots = [], []
    for j in range(rows):
        for i in range(cols):
            r, g, b, a = small.getpixel((i, j))
            lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
            if a < 40 or lum > 0.93:
                continue
            x = bx + (i + 0.5) * cell
            y = by + (j + 0.5) * cell
            border.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{cell * 1.45:.1f}"/>')
            rad = max(0.35, (1 - lum) * cell * 0.62)
            dots.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.2f}"/>')
    return f'<g fill="{paper}" filter="url(#lift)">{"".join(border)}</g><g fill="{ink}">{"".join(dots)}</g>'


def tag(hand: Outliner, text: str, x: float, y: float, rot: float, t: Theme) -> str:
    """Garvit's sticker tag: a scrap of dotted paper with an arrow and a handwritten word."""
    size = 17
    w = hand.width(text, size) + 34
    arrow = f'<path d="M{x + 9:.1f} {y + 17:.1f} L{x + 18:.1f} {y + 8:.1f} M{x + 12:.1f} {y + 8:.1f} H{x + 18:.1f} V{y + 14:.1f}" fill="none" stroke="{t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
    return (
        f'<g transform="rotate({rot} {x} {y})">'
        f'<rect x="{x}" y="{y}" width="{w:.1f}" height="25" fill="{t.card}" stroke="{t.rule}"/>'
        f'<rect x="{x}" y="{y}" width="{w:.1f}" height="25" fill="url(#tagdots)"/>'
        f"{arrow}"
        f'<path d="{hand.path(text, x + 26, y + 18, size)}" fill="{t.ink}"/>'
        "</g>"
    )


def washi(x: float, y: float, w: float, rot: float, colour: str) -> str:
    """A strip of translucent washi tape with torn ends."""
    h = 18
    pts = [(0, 0.08), (0.04, 0), (0.08, 0.1), (0.12, 0), (0.88, 0), (0.92, 0.12), (0.96, 0), (1, 0.1), (1, 0.9), (0.96, 1), (0.92, 0.88), (0.88, 1), (0.12, 1), (0.08, 0.9), (0.04, 1), (0, 0.92)]
    d = " ".join(f"{'M' if i == 0 else 'L'}{x + px * w:.1f} {y + py * h:.1f}" for i, (px, py) in enumerate(pts)) + "Z"
    return f'<path d="{d}" fill="{colour}" fill-opacity="0.62" transform="rotate({rot} {x + w / 2} {y + h / 2})"/>'


def squiggle(x0: float, x1: float, y: float, colour: str) -> str:
    """The hand-drawn underline under the name: a slightly wavy double stroke."""
    pts = []
    n = 40
    for i in range(n + 1):
        t = i / n
        pts.append((x0 + (x1 - x0) * t, y + math.sin(t * math.pi * 3.2) * 1.6 - t * 2))
    d = " ".join(f"{'M' if i == 0 else 'L'}{px:.1f} {py:.1f}" for i, (px, py) in enumerate(pts))
    back = " ".join(f"{'M' if i == 0 else 'L'}{px + 6:.1f} {py + 5:.1f}" for i, (px, py) in enumerate(pts[4:-2]))
    return f'<path d="{d}" fill="none" stroke="{colour}" stroke-width="2.6" stroke-linecap="round"/><path d="{back}" fill="none" stroke="{colour}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>'


def banner(t: Theme, hand: Outliner, mono: Outliner) -> str:
    """The whole banner for one theme, as an SVG document."""
    parts: list[str] = []
    parts.append(
        "<defs>"
        f'<pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.15" fill="{t.dots}"/></pattern>'
        f'<pattern id="tagdots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="0.7" fill="{t.ink}" fill-opacity="0.28"/></pattern>'
        '<filter id="lift" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.22"/></filter>'
        "</defs>"
    )
    parts.append(f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="18" fill="{t.paper}" stroke="{t.rule}"/>')
    parts.append(f'<rect x="0.5" y="0.5" width="{W - 1}" height="{H - 1}" rx="18" fill="url(#dots)"/>')

    # Left margin: three stickers with tags, like the site.
    stickers = ROOT / "public" / "stickers"
    sticker_ink, sticker_paper = "#2a2a27", "#f4f3ee"  # stickers are printed paper, in both themes
    parts.append(f'<g transform="rotate(-4 120 90)">{halftone(stickers / "brain.png", (52, 34, 150), (0.03, 0.1, 0.95, 0.8), sticker_ink, sticker_paper)}</g>')
    parts.append(f'<g transform="rotate(-5 110 230)">{halftone(stickers / "king.png", (86, 170, 52), (0, 0, 1, 1), sticker_ink, sticker_paper, cell=3.4)}</g>')
    parts.append(tag(hand, case("my rating"), 58, 292, -3, t))
    parts.append(f'<g transform="rotate(4 230 330)">{halftone(stickers / "shoe-standin.jpg", (180, 318, 110), (0, 0.48, 1, 0.52), sticker_ink, sticker_paper, cell=3.6)}</g>')
    parts.append(tag(hand, case("my runs"), 196, 374, 2, t))

    # The middle: greeting, name with its underline, role, intro.
    x = 360
    greet, name = case(GREETING), case(NAME)
    parts.append(f'<path d="{hand.path(greet, x, 118, 44)}" fill="{t.ink}"/>')
    nx = x + hand.width(greet + " ", 44)
    parts.append(f'<path d="{hand.path(name, nx, 118, 44)}" fill="{t.ink}"/>')
    parts.append(squiggle(nx - 4, nx + hand.width(name, 44) + 6, 134, t.ink))
    parts.append(f'<path d="{mono.path(case(ROLE), x + 2, 178, 17)}" fill="{t.muted}"/>')
    for i, line in enumerate(INTRO):
        parts.append(f'<path d="{mono.path(case(line), x + 2, 226 + i * 30, 17)}" fill="{t.ink}"/>')
    # The highlighter under "ml systems" on the first line, as on the site.
    mx = x + 2 + mono.width(case("i build "), 17)
    parts.append(f'<path d="M{mx:.1f} 231 L{mx + mono.width(case("ml systems"), 17):.1f} 230" stroke="{t.accent}" stroke-width="2.4" stroke-linecap="round"/>')
    parts.append(f'<path d="{hand.path(case("reach me below"), x + 2, 352, 22)}" fill="{t.muted}"/>')

    # Right margin: a crooked poster, taped twice.
    px, py, pw, ph = 1018, 104, 140, 180
    lines = "".join(f'<path d="{hand.path(case(s), px + 14, py + 66 + i * 32, 17.5)}" fill="#1c1c1a"/>' for i, s in enumerate(POSTER))
    parts.append(
        f'<g transform="rotate(5 {px + pw / 2} {py + ph / 2})" filter="url(#lift)">'
        f'<rect x="{px - 6}" y="{py - 6}" width="{pw + 12}" height="{ph + 12}" fill="#ecebe5"/>'
        f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" fill="#e4e3dd"/>{lines}</g>'
    )
    parts.append(washi(px - 12, py - 4, 52, -38, t.tape))
    parts.append(washi(px + pw - 16, py + ph + 6, 52, -36, t.tape_peach))
    body = "".join(parts)
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-label="{NAME}, {ROLE}">{body}</svg>\n'


def main() -> None:
    """Writes both banners."""
    OUT.mkdir(parents=True, exist_ok=True)
    hand = Outliner(HAND_FONT)
    mono = Outliner(MONO_FONT, weight=400)
    for theme in (DAY, NIGHT):
        path = OUT / f"banner-{theme.name}.svg"
        path.write_text(banner(theme, hand, mono), encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()

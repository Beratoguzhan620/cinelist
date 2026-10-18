"""Builds the app icon, adaptive icon layers, splash mark and favicon in assets/."""
import pathlib

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"

INK = "#1F2A37"
PAPER = "#F7F6F3"
RUST = "#B5522B"
SCALE = 4


def mark(size: int, body: str, block: str, lines: str, background: str | None, coverage: float) -> Image.Image:
    """A filled poster: an image block on top and two title lines underneath, centred on the canvas."""
    big = size * SCALE
    img = Image.new("RGBA", (big, big), background or (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    height = big * coverage
    width = height * 2 / 3
    left = (big - width) / 2
    top = (big - height) / 2
    radius = width * 0.08
    draw.rounded_rectangle((left, top, left + width, top + height), radius=radius, fill=body)

    pad = width * 0.12
    block_bottom = top + height * 0.6
    draw.rounded_rectangle((left + pad, top + pad, left + width - pad, block_bottom), radius=radius * 0.5, fill=block)

    line = height * 0.065
    first = block_bottom + height * 0.09
    draw.rounded_rectangle((left + pad, first, left + width - pad, first + line), radius=line / 2, fill=lines)
    second = first + line * 2
    draw.rounded_rectangle((left + pad, second, left + pad + (width - 2 * pad) * 0.55, second + line), radius=line / 2, fill=lines)
    return img.resize((size, size), Image.LANCZOS)


def save(img: Image.Image, name: str, rgb: bool = False) -> None:
    (img.convert("RGB") if rgb else img).save(ASSETS / name, optimize=True)


def main() -> None:
    save(mark(1024, PAPER, RUST, INK, INK, 0.6), "icon.png", rgb=True)
    save(mark(1024, PAPER, RUST, INK, None, 0.42), "android-icon-foreground.png")
    save(Image.new("RGBA", (1024, 1024), INK), "android-icon-background.png")
    save(mark(1024, "#FFFFFF", (0, 0, 0, 0), (0, 0, 0, 0), None, 0.42), "android-icon-monochrome.png")
    save(mark(1024, INK, RUST, PAPER, None, 0.9), "splash-icon.png")
    save(mark(48, PAPER, RUST, INK, INK, 0.8), "favicon.png")


if __name__ == "__main__":
    main()

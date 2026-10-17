"""Builds the typographic seed posters in server/public/posters from server/db.seed.json."""
import json
import pathlib
import textwrap

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@expo-google-fonts"
TITLE_FONT = FONTS / "ibm-plex-sans" / "600SemiBold" / "IBMPlexSans_600SemiBold.ttf"
MONO_FONT = FONTS / "ibm-plex-mono" / "500Medium" / "IBMPlexMono_500Medium.ttf"

PALETTE = [
    ("#1F2A37", "#F7F6F3"),
    ("#8C3F22", "#F7F6F3"),
    ("#3F4A2A", "#F0EEE9"),
    ("#2E5653", "#F7F6F3"),
    ("#9A7A2E", "#1A1A1A"),
    ("#6E2E26", "#F0EEE9"),
    ("#D9D2C3", "#1A1A1A"),
    ("#2B2B2B", "#E2DFD8"),
]

W, H, PAD = 600, 900, 48


def upper_tr(text: str) -> str:
    return text.replace("i", "İ").replace("ı", "I").upper()


def poster(film: dict, index: int) -> Image.Image:
    bg, fg = PALETTE[index % len(PALETTE)]
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)
    mono = ImageFont.truetype(str(MONO_FONT), 26)

    draw.text((PAD, PAD), upper_tr(film["genre"]), font=mono, fill=fg)
    draw.line((PAD, PAD + 48, W - PAD, PAD + 48), fill=fg, width=2)

    size = 76
    while True:
        font = ImageFont.truetype(str(TITLE_FONT), size)
        lines = textwrap.wrap(film["title"], width=max(6, int(22 * 56 / size)))
        widest = max(draw.textlength(line, font=font) for line in lines)
        if widest <= W - 2 * PAD or size <= 40:
            break
        size -= 4
    line_height = int(size * 1.15)
    y = H - PAD - 90 - line_height * len(lines)
    for line in lines:
        draw.text((PAD, y), line, font=font, fill=fg)
        y += line_height

    draw.line((PAD, H - PAD - 60, W - PAD, H - PAD - 60), fill=fg, width=2)
    draw.text((PAD, H - PAD - 40), str(film["year"]), font=mono, fill=fg)
    minutes = f'{film["durationMinutes"]} dk'
    draw.text((W - PAD - draw.textlength(minutes, font=mono), H - PAD - 40), minutes, font=mono, fill=fg)
    return img


def main() -> None:
    films = json.loads((ROOT / "server" / "db.seed.json").read_text(encoding="utf-8"))["films"]
    out = ROOT / "server" / "public" / "posters"
    out.mkdir(parents=True, exist_ok=True)
    for index, film in enumerate(films):
        name = film["posterUrl"].rsplit("/", 1)[-1]
        poster(film, index).save(out / name, "JPEG", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    main()

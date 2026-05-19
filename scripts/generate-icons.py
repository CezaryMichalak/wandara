"""Generate Wandara icon assets from master PNGs."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BRANDING = ROOT / "public" / "branding"
LOGO = BRANDING / "wandara-logo-master.png"
OG = BRANDING / "wandara-og-master.png"


def save_square(src: Image.Image, size: int, dest: Path) -> None:
    img = src.convert("RGBA")
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="PNG", optimize=True)


def save_og(src: Image.Image, dest: Path) -> None:
    img = src.convert("RGBA")
    img = img.resize((1200, 630), Image.Resampling.LANCZOS)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, format="PNG", optimize=True)


def save_favicon(src: Image.Image, dest: Path) -> None:
    img = src.convert("RGBA")
    sizes = [(16, 16), (32, 32), (48, 48)]
    frames = [img.resize(s, Image.Resampling.LANCZOS) for s in sizes]
    dest.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        dest,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=frames[1:],
    )


def main() -> None:
    logo = Image.open(LOGO)
    og = Image.open(OG)

    save_square(logo, 512, PUBLIC / "icon.png")
    save_square(logo, 180, PUBLIC / "apple-touch-icon.png")
    save_favicon(logo, PUBLIC / "favicon.ico")
    save_og(og, PUBLIC / "og-image.png")

    print("Created:", PUBLIC / "icon.png")
    print("Created:", PUBLIC / "apple-touch-icon.png")
    print("Created:", PUBLIC / "favicon.ico")
    print("Created:", PUBLIC / "og-image.png")


if __name__ == "__main__":
    main()

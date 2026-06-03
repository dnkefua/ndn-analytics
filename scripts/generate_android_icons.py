from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "web-app-manifest-512x512.png"
RES = ROOT / "android" / "app" / "src" / "main" / "res"

DENSITIES = [
    ("mdpi", 48, 108),
    ("hdpi", 72, 162),
    ("xhdpi", 96, 216),
    ("xxhdpi", 144, 324),
    ("xxxhdpi", 192, 432),
]


def centered_logo(size: int, scale: float, background):
    canvas = Image.new("RGBA", (size, size), background)
    logo = Image.open(SOURCE).convert("RGBA")
    logo.thumbnail((round(size * scale), round(size * scale)), Image.Resampling.LANCZOS)
    left = (size - logo.width) // 2
    top = (size - logo.height) // 2
    canvas.alpha_composite(logo, (left, top))
    return canvas


def main():
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source icon: {SOURCE}")

    for density, legacy_size, foreground_size in DENSITIES:
        directory = RES / f"mipmap-{density}"
        directory.mkdir(parents=True, exist_ok=True)

        legacy = centered_logo(legacy_size, 0.92, (255, 255, 255, 255))
        foreground = centered_logo(foreground_size, 0.72, (255, 255, 255, 0))

        legacy.save(directory / "ic_launcher.png")
        legacy.save(directory / "ic_launcher_round.png")
        foreground.save(directory / "ic_launcher_foreground.png")

    print("Android launcher icons generated from NDN logo.")


if __name__ == "__main__":
    main()

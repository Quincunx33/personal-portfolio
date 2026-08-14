from pathlib import Path
from PIL import Image

root = Path('/home/ubuntu/quincunx-portfolio/client/public/assets')
settings = {
    'taaissu-portrait.png': (1400, 86),
    'taaissu-hero-texture.jpg': (1800, 78),
    'taaissu-project-atlas.jpg': (1200, 78),
    'taaissu-signal.jpg': (1200, 78),
}
for filename, (max_width, quality) in settings.items():
    path = root / filename
    image = Image.open(path).convert('RGB')
    if image.width > max_width:
        height = round(image.height * max_width / image.width)
        image = image.resize((max_width, height), Image.Resampling.LANCZOS)
    output = path.with_suffix('.jpg')
    image.save(output, 'JPEG', quality=quality, optimize=True, progressive=True)
    if output != path:
        path.unlink()

logo = Image.open(root / 'taaissu-mark.png').convert('RGBA')
logo.thumbnail((256, 256), Image.Resampling.LANCZOS)
logo.save(root / 'taaissu-mark.png', 'PNG', optimize=True)

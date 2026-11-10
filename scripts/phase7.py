"""Generate official responsive photographs without modifying originals or HTML."""
from pathlib import Path
from PIL import Image, ImageOps
import re, json, hashlib, sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/images/official'
OUT.mkdir(exist_ok=True)
sources = {f'kury-{n}': f'CARLOS KURY {n}.jpeg' for n in ['002','004','012','014','017','019','022']}
sources.update({'kury-0494':'DSC_0494 carlos kury.png','kury-0507':'DSC_0507 carlos kury.png'})
inventory = []
for key, name in sources.items():
    original = ROOT / 'assets/images' / name
    with Image.open(original) as source:
        im = ImageOps.exif_transpose(source).convert('RGBA')
        background = Image.new('RGBA', im.size, '#0b0907')
        im = Image.alpha_composite(background, im).convert('RGB')
        variants = []
        for w in [480, 800, 1200, 1800]:
            target = OUT / f'{key}-{w}.webp'
            im.resize((w, round(im.height*w/im.width)), Image.Resampling.LANCZOS).save(target, 'WEBP', quality=85, method=6)
            variants.append({'path':str(target.relative_to(ROOT)).replace('\\','/'),'bytes':target.stat().st_size})
        inventory.append({'original':name,'sha256':hashlib.sha256(original.read_bytes()).hexdigest(),'dimensions':im.size,'variants':variants})

(OUT/'manifest.json').write_text(json.dumps(inventory,ensure_ascii=False,indent=2),encoding='utf-8')
if '--images-only' in sys.argv:
    print('36 WebP variants generated; original files untouched.')
    sys.exit(0)


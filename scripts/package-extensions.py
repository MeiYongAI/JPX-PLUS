"""Pack both unpacked extensions for manual installation."""
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

base = Path(__file__).resolve().parents[1] / 'extensions'
for slug in ('hv-zh-cn', 'hv-utils'):
    folder = base / slug
    version = json.loads((folder / 'manifest.json').read_text('utf-8'))['version']
    output = base / f'{slug}-{version}.zip'
    with ZipFile(output, 'w') as archive:
        for f in sorted(folder.iterdir()):
            if f.suffix not in ('.png', '.svg', '.js', '.json', '.css', '.html') or not f.is_file():
                raise ValueError(f'Unexpected package file: {f}')
            data = f.read_bytes()
            if f.suffix != '.png':
                data = data.replace(b'\r\n', b'\n')
            archive.writestr(ZipInfo(f.name), data, compress_type=ZIP_DEFLATED)

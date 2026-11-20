'use strict';
const path = require('node:path');
const sharp = require('sharp');
const folder = path.resolve(__dirname, '../extensions/hv-utils');
async function build() {
    for (const size of [16, 32, 48, 128]) {
        await sharp(path.join(folder, 'toolbox.svg')).resize(size, size).png().toFile(path.join(folder, `icon-${size}.png`));
    }
}
build().catch(error => { console.error(error); process.exitCode = 1; });

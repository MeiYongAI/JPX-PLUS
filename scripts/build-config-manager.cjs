'use strict';
// Keeps the distributed userscript self-contained while the new modules remain editable.
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'src/config-manager', name), 'utf8');
const start = '// BEGIN JPX CONFIG MANAGEMENT (tools/build-config-manager.cjs)';
const end = '// END JPX CONFIG MANAGEMENT';
const target = path.join(root, 'JPX-PLUS.user.js');
let source = fs.readFileSync(target, 'utf8');
const sharedStart = '// BEGIN JPX SHARED DATA';
const sharedEnd = '// END JPX SHARED DATA';
const shared = [sharedStart, fs.readFileSync(path.join(root, 'src/shared-data.js'), 'utf8'), sharedEnd].join('\n');
if (source.includes(sharedStart)) source = source.slice(0, source.indexOf(sharedStart)) + shared + source.slice(source.indexOf(sharedEnd) + sharedEnd.length);
else source = source.replace('// Keep the existing Battle API', shared + '\n\n// Keep the existing Battle API');
const monsterStart = '// BEGIN JPX MONSTER DATABASE', monsterEnd = '// END JPX MONSTER DATABASE';
const monster = [monsterStart, fs.readFileSync(path.join(root, 'src/monster-database.js'), 'utf8'), monsterEnd].join('\n');
if (source.includes(monsterStart)) source = source.slice(0, source.indexOf(monsterStart)) + monster + source.slice(source.indexOf(monsterEnd) + monsterEnd.length);
else source = source.replace('function getMonsterInfoSignature(info) {', monster + '\n\nfunction getMonsterInfoSignature(info) {');
const block = [start, 'I18N.cM = ' + JSON.stringify(JSON.parse(read('en.json'))) + ';',
    'const JPX_CONFIG_MANAGER_CSS = ' + JSON.stringify(read('manager.css')) + ';',
    read('library.js'), read('store.js'), read('manager.js'), read('bindings.js'),
    fs.readFileSync(path.join(root, 'src/shared-ui.js'), 'utf8'), end].join('\n');
if (source.includes(start)) source = source.slice(0, source.indexOf(start)) + block + source.slice(source.indexOf(end) + end.length);
else {
    const anchor = "window.addEventListener('storage', event => {\n    if (event.key !== cleanupKey";
    source = source.replace(/\r\n/g, '\n');
    if (!source.includes(anchor)) throw Error('Core integration anchor not found');
    source = source.replace(anchor, block + '\n\n' + anchor);
}
if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8').replace(/\r\n/g, '\n') !== source.replace(/\r\n/g, '\n')) {
        console.error('Config manager is stale. Run: node scripts/build-config-manager.cjs');
        process.exitCode = 1;
    } else console.log('Config manager matches its sources.');
} else { fs.writeFileSync(target, source, 'utf8'); console.log('Updated embedded config-management modules.'); }

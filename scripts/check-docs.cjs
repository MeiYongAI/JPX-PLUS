'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const readmes = ['README.md', 'README.zh-CN.md', 'README.zh-TW.md', 'README.zh-HK.md', 'README.ja.md', 'README.ko.md'];
const guides = ['scene-strategies.md', 'store-authentication.md', 'monster-database.md', 'alt-shared-data-2026-11-08.md'];
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const version = read('JPX-PLUS.user.js').match(/^\/\/\s+@version\s+(\S+)/m)[1];
const markdownFiles = directory => fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : entry.name.endsWith('.md') ? [file] : [];
});
const documents = [...readmes, 'CHANGELOG.md', 'src/config-manager/README.md', ...markdownFiles('docs')];
const failures = [];
let localLinks = 0;
function checkLink(file, target) {
    target = target.replace(/^<|>$/g, '').replaceAll('&amp;', '&');
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) return;
    const pathname = target.split(/[?#]/)[0];
    if (!pathname) return;
    localLinks++;
    const destination = path.resolve(root, path.dirname(file), decodeURIComponent(pathname));
    if (!fs.existsSync(destination)) failures.push(file + ': missing ' + target);
}
for (const file of documents) {
    const source = read(file).replace(/^(\x60{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
    for (const match of source.matchAll(/!?\[[^\]\n]*\]\(\s*(<[^>]+>|[^\s)]+)/g)) checkLink(file, match[1]);
    for (const match of source.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) checkLink(file, match[1]);
    for (const match of source.matchAll(/\bsrcset=["']([^"']+)["']/g)) {
        for (const item of match[1].split(',')) checkLink(file, item.trim().split(/\s+/)[0]);
    }
    for (const match of source.matchAll(/^\s*\[[^\]]+\]:\s*(<[^>]+>|\S+)/gm)) checkLink(file, match[1]);
}
for (const file of readmes) {
    const source = read(file);
    if (!source.includes(version)) failures.push(file + ': missing current release ' + version);
    for (const guide of guides) {
        if (!source.includes('](docs/' + guide)) failures.push(file + ': missing guide ' + guide);
    }
    if (!source.includes('page=scenes')) failures.push(file + ': missing scene preview');
}
const scenes = JSON.parse(read('docs/screenshot-scenes.json'));
if (read('CHANGELOG.md').match(/^## (\d[^\r\n]*)/m)?.[1] !== version) failures.push('CHANGELOG.md: latest release does not match ' + version);
const preview = read('docs/index.html');
if (!preview.includes('name="jpx-version" content="' + version + '"')) failures.push('docs/index.html: preview version does not match ' + version);
for (const asset of ['preview.css', 'preview.js', 'images/desktop-configs-en.png']) {
    if (!preview.includes(asset + '?v=' + version)) failures.push('docs/index.html: stale asset version for ' + asset);
}
for (const locale of ['en', 'zh-CN']) {
    for (const theme of ['light', 'dark']) {
        const galleryFile = 'docs/gallery-' + theme + (locale === 'en' ? '' : '.zh-CN') + '.md';
        const gallery = read(galleryFile);
        for (const [key, en, zh, desktop, mobile] of scenes) {
            if (!gallery.includes('## ' + (locale === 'en' ? en : zh))) failures.push(galleryFile + ': missing scene ' + key);
            for (const base of [desktop, mobile].filter(Boolean)) {
                const themed = theme === 'dark' ? base.replace(/-light$/, '') + '-dark' : base;
                const image = 'images/' + themed + (locale === 'en' ? '-en' : '') + '.png';
                if (!gallery.includes('](' + image + ')')) failures.push(galleryFile + ': missing image ' + image);
            }
        }
    }
}
assert.deepEqual(failures, [], 'Documentation coverage and local links');
console.log(JSON.stringify({ documents: documents.length, readmes: readmes.length, localLinks, galleries: 4, scenes: scenes.length, errors: failures }));

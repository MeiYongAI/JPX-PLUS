'use strict';
// Assemble the optional userscript using only Node built-ins; no bundler or install step.
const fs = require('node:fs'), path = require('node:path');
const sourceRoot = path.resolve(__dirname, '../plugins/config-store');
const outputPath = path.resolve(__dirname, '../JPX-PLUS-ConfigStore.user.js');
const read = file => fs.readFileSync(path.join(sourceRoot, file), 'utf8').replace(/\r\n/g, '\n');
const translations = JSON.parse(read('i18n.json'));
if (JSON.stringify(Object.keys(translations.en).sort()) !== JSON.stringify(Object.keys(translations.zh).sort()))
    throw new Error('English and Chinese Config Store translation keys differ.');
const i18n = JSON.stringify(translations);
const css = JSON.stringify(read('ui.css'));
const header = `// ==UserScript==
// @name         JPX-PLUS Config Store
// @namespace    ijpx
// @version      2026.11.06.6
// @description  Optional configuration sharing and discovery for JPX-PLUS
// @author       MeiYongAI
// @run-at       document-end
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      github.com
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @homepageURL  https://github.com/MeiYongAI/JPX-PLUS
// @supportURL   https://github.com/MeiYongAI/JPX-PLUS/issues
// @updateURL    https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS-ConfigStore.user.js
// @downloadURL  https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS-ConfigStore.user.js
// ==/UserScript==
(function () {
    'use strict';
    const host = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    if (window.top !== window.self) return;
    const translations = ${i18n};
    const t = key => (host.jpxI18N?.cB?.basicSettings ? translations.zh : translations.en)[key.replace(/^cStore\\./, '')] || key;
`;
const footer = `
    function attach() {
        const core = host.JPXPlus;
        if (!core || core.apiVersion !== 1) return;
        core.registerSettingsTab({ id: 'configStore', title: () => t('cStore.name'), render(parent, hooks) {
            if (!document.getElementById('jpx-config-store-style')) {
                const style = document.createElement('style'); style.id = 'jpx-config-store-style';
                style.textContent = ${css}; document.head.append(style);
            }
            renderConfigStore(parent, hooks);
        } });
        host.removeEventListener('jpx:ready', attach);
    }
    host.addEventListener('jpx:ready', attach);
    attach();
})();
`;
const output = header + read('service.js') + '\n' + read('ui.js') + footer;
if (process.argv.includes('--check')) {
    const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current !== output) {
        console.error('Config Store userscript is stale. Run: node scripts/build-config-store.cjs');
        process.exitCode = 1;
    } else console.log('Config Store userscript matches its sources.');
} else {
    fs.writeFileSync(outputPath, output);
    console.log('Built JPX-PLUS-ConfigStore.user.js');
}

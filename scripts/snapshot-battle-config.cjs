'use strict';
// Print every battle-configuration default and schema of a JPX-PLUS build as
// canonical JSON, so refactors can prove the battle settings did not change:
//   node scripts/snapshot-battle-config.cjs [JPX-PLUS.user.js] > snapshot.json
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require('playwright');
const { configArchive } = require('../tests/fixtures/config-archive.cjs');

const file = path.resolve(process.argv[2] || path.join(__dirname, '../JPX-PLUS.user.js'));
const marker = "window.dispatchEvent(new Event('jpx:ready'));\ninitDo();";
const source = fs.readFileSync(file, 'utf8');
if (!source.includes(marker)) throw new Error('JPX startup marker not found');
const exposed = ['defaultCfgBattle', 'defaultCfgStats', 'KEYBINDS', 'BATTLE_STYLES', 'BATTLE_TYPES', 'BATTLE_MODES', 'cfgBattleSchema', 'cfgBattle'];
const probe = `window.__jpxSnapshot = () => ({ ${exposed.join(', ')}, battleRuleSchema: mkBattleRuleSchema(),
    merged: (() => { const out = {}; mergeCfg(JSON.parse(localStorage.getItem(prefix + 'cfgBattle') || '{}'), defaultCfgBattle, out, 'battle'); return out; })() });\n`;
const instrumented = source.replace(marker, probe + marker);
const stored = configArchive({ count: 3, size: 64 * 1024, active: true, world: 'Persistent' }).native;
const html = '<!doctype html><meta charset="utf-8"><body><div id="navbar"></div><div id="mainpane"></div></body>';
const canonical = value => typeof value === 'function' ? 'function:' + value.toString()
    : Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;

(async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(({ stored }) => {
            localStorage.setItem('jpx_cfgBattle', stored);
            const values = new Map();
            Object.assign(window, { GM_getValue: (key, fallback) => values.has(key) ? values.get(key) : fallback, GM_setValue: (key, value) => values.set(key, value),
                GM_deleteValue: key => values.delete(key), GM_listValues: () => [...values.keys()], GM_addValueChangeListener: () => 0, GM_xmlhttpRequest: () => {} });
        }, { stored });
        await page.route('**/*', route => route.request().isNavigationRequest() ? route.fulfill({ contentType: 'text/html', body: html }) : route.fulfill({ status: 204, body: '' }));
        await page.goto('https://hentaiverse.org/?s=Character&ss=snapshot');
        await page.addScriptTag({ content: instrumented });
        const snapshot = await page.evaluate(() => {
            const seen = new WeakSet();
            const plain = value => typeof value === 'function' ? { __function: value.toString() }
                : Array.isArray(value) ? value.map(plain)
                : value && typeof value === 'object' ? (seen.has(value) ? '[circular]' : (seen.add(value), Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)])))) : value;
            return plain(window.__jpxSnapshot());
        });
        if (errors.length) throw new Error('Page errors: ' + errors.join('; '));
        process.stdout.write(JSON.stringify(canonical(snapshot), null, 1) + '\n');
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

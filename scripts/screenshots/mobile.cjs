'use strict';

// README screenshots only. Real renderers + disposable example IndexedDB data.
// Every navigation is a fixture and all other network traffic is aborted.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const backdrop = require('./backdrop.cjs');
const root = path.resolve(__dirname, '../..');
const output = path.join(root, 'docs/images');
const language = process.argv.includes('--language=en') ? 'en' : 'zh';
const locale = language === 'en' ? 'en-US' : 'zh-CN';
const imageSuffix = language === 'en' ? '-en' : '';
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const pack = fs.readFileSync(path.join(root, 'JPX-PLUS-ZhCN.user.js'), 'utf8');
for (const file of [source, pack]) assert.equal(file.includes('\ufffd'), false, 'valid Chinese source without replacement characters');

function exposePreview() {
    initDoI18n(); loadBattleConfig();
    jpxMarket.getMarketPrice = async () => ({ 'Energy Drink': 11000, 'Health Draught': 60, 'Mana Draught': 65, 'Spirit Draught': 70, 'World Seed': 18000 });
    window.__readme = {
        settings: renderSettings,
        records: () => renderBattleRecordsPage(window),
        toggleTheme: toggleJpxTheme,
        seed: async () => {
            const stats = JSON.parse(JSON.stringify(defaultCfgStats));
            const selectedCombat = ['slashing', 'crushing', 'fire', 'damageTotal', 'hit', 'crit', 'miss', 'parry', 'block'];
            stats.combatRows = stats.combatRows.filter(row => selectedCombat.includes(row.id));
            const selectedRevenue = ['exp', 'credit', 'equipment', 'consumable', 'totalProfit', 'stamina', 'finalProfit'];
            stats.revenueRows = stats.revenueRows.filter(row => selectedRevenue.includes(row.id));
            stats.statsColumns = [
                { id: 'date' }, { id: 'battleType' }, { id: 'round' },
                { id: 'finalProfit', colorThresholds: '0:#2f714d,18000:#9b4e03' }
            ];
            localStorage.setItem(prefix + 'cfgStats', JSON.stringify(stats));
            const samples = [
                ['11:42:18', 'Item', 100, 1326, 487, 4218, 13760],
                ['11:21:35', 'Arena', 100, 1468, 512, 5680, 21430],
                ['11:02:07', 'Arena', 80, 1092, 395, 4350, 16820],
                ['10:48:22', 'Encounter', 1, 48, 18, 260, 1920],
                ['10:34:51', 'Arena', 60, 815, 301, 3210, 12450],
                ['10:18:09', 'Item', 100, 1284, 466, 4060, 13580],
                ['09:56:43', 'Arena', 50, 684, 249, 2670, 9850],
                ['09:42:16', 'Encounter', 1, 42, 16, 240, 1840],
                ['09:29:34', 'Arena', 40, 548, 201, 2190, 8140],
                ['09:14:52', 'Item', 80, 1018, 381, 3320, 11270],
                ['08:56:11', 'Arena', 30, 406, 154, 1740, 6420],
                ['08:42:39', 'Encounter', 1, 44, 17, 250, 1860],
                ['08:27:03', 'Arena', 20, 269, 103, 1210, 4550],
                ['08:10:28', 'Item', 50, 641, 236, 2110, 7560],
                ['07:51:04', 'Arena', 10, 138, 56, 670, 2310],
                ['07:38:29', 'Item', 50, 622, 231, 2190, 7680],
                ['07:20:05', 'Arena', 80, 1058, 386, 4180, 15720],
                ['06:59:46', 'Encounter', 1, 46, 18, 250, 1820],
                ['06:41:17', 'Arena', 60, 788, 287, 3140, 12060],
                ['06:20:31', 'Item', 100, 1267, 462, 3980, 13220]
            ];
            const db = await openDB();
            await new Promise((resolve, reject) => {
                const tx = db.transaction('battleRecords', 'readwrite'), store = tx.objectStore('battleRecords');
                for (const [index, [time, type, rounds, turns, seconds, credit, profit]] of samples.entries()) {
                    const combat = jpxUtils.createCombatRecords(), revenue = jpxUtils.createRevenueRecords();
                    Object.assign(combat.physicalDealt, { slashing: 1896240 + index * 14230, fire: 164820, hit: 914, crit: 267, miss: 12, parry: 6, crit1: 203, crit2: 51, crit3: 11, crit4: 2, damageTotal: 2061060 + index * 14230 });
                    Object.assign(combat.magicalDealt, { debuffResist0: 18, debuffResist1: 5, debuffResist3: 1 });
                    Object.assign(combat.physicalTaken, { crushing: 48620, slashing: 27140, hit: 206, crit: 18, parry: 162, block: 183, damageTotal: 75760 });
                    combat.use = { Cure: 18, Regen: 5, Imperil: 24, 'Health Draught': 3, 'Mana Draught': 2 };
                    Object.assign(revenue, { exp: 842650 + index * 16400, credit, totalProfit: profit + 1100, finalProfit: profit, staminaCost: 1 });
                    revenue.equipment = { Legendary: ['Legendary Rapier of Balance'] };
                    revenue.consumable = { 'Health Draught': { drop: 12, use: 3, balance: 9 }, 'Mana Draught': { drop: 8, use: 2, balance: 6 }, 'World Seed': { drop: 1, use: 0, balance: 1 }, profit: 18930 };
                    store.put({ timestamp: '2026-11-08 ' + time, date: '2026-11-08', world: 'Persistent', battleType: type,
                        difficulty: 7, result: 'Victory', playerLevel: 400, persona: document.documentElement.lang.startsWith('en') ? 'One-handed' : '单手',
                        roundInfo: { current: rounds, total: rounds }, turns, deltaSeconds: seconds,
                        deltaTime: jpxUtils.secondsToTime(seconds, true), tps: Math.round(turns / seconds * 100) / 100,
                        riddle: index % 2, combatRecords: combat, revenueRecords: revenue });
                }
                tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
            });
            db.close();
        }
    };
}
const harness = source.replace('\ninitDo();', '\n(' + exposePreview.toString() + ')();');
assert.notEqual(harness, source);
const html = '<!doctype html><html lang="' + locale + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:8px;background:#edebdf;color:#5c0d11;font:12px Verdana}#csp{width:100%;height:704px}</style></head><body><div id="csp"><div id="navbar"></div></div></body></html>';
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const viewState = page => page.evaluate(() => ({
    text: document.body.innerText.replace(/浅色|暗色|\bLight\b|\bDark\b/g, 'Theme'),
    pageScroll: [scrollX, scrollY],
    controls: [...document.querySelectorAll('input,select,textarea')].map(node => ({ value: node.matches('[data-control-color],[data-control-palette]') ? 'theme-palette' : node.value, checked: node.checked })),
    scrolls: [...document.querySelectorAll('#panel_battle,.jpx-records-table-scroll,.jpx-record-detail-scroll')].map(node => ({ left: node.scrollLeft, top: node.scrollTop })),
    menuOpen: document.querySelector('#jpx-settings-menu-button')?.getAttribute('aria-expanded') || null,
    rectangles: [...document.querySelectorAll('#settings-container,.jpx-settings-sidebar,#panel_battle,.jpx-settings-footer,.jpx-control-preview-sample,#battleStatsTable,.jpx-record-detail-page,.jpx-record-detail-scroll')].map(node => {
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
    })
}));
async function assertPreviewPalette(page, theme) {
    const palette = await page.evaluate(() => {
        const sample = document.querySelector('.jpx-control-preview-sample'), css = getComputedStyle(sample);
        const values = [css.color, getComputedStyle(sample.querySelector('.jpx-widget-drag')).backgroundColor, css.backgroundColor, css.borderTopColor];
        const inputs = [...document.querySelectorAll('[data-control-color],[data-control-palette]')].map(node => node.value);
        const colors = values.map(value => '#' + value.match(/[\d.]+/g).slice(0, 3).map(part => Math.round(Number(part)).toString(16).padStart(2, '0')).join(''));
        return { inputs, colors, surface: values[2] };
    });
    assert.deepEqual(palette.inputs, palette.colors, 'Palette controls show actual theme preview colors');
    const surface = palette.surface.match(/[\d.]+/g).slice(0, 3).map(Number);
    assert.equal(surface.every(channel => theme === 'dark' ? channel < 100 : channel > 150), true, 'Default preview surface follows light/dark theme');
}

(async () => {
    fs.mkdirSync(output, { recursive: true });
    const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL}:{}), headless: true });
    const errors = [], blocked = [];
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1, locale });
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
        blocked.push(route.request().url()); return route.abort();
    });
    const open = async url => {
        const page = await context.newPage(); page.setDefaultTimeout(10000);
        await page.goto(url);
        await backdrop.install(page);
        await page.evaluate(() => { window.GM_xmlhttpRequest = () => { throw Error('Unexpected game request'); }; });
        if (language === 'zh') await page.addScriptTag({ content: pack });
        await page.addScriptTag({ content: harness });
        return page;
    };
    try {
        const settings = await open('https://hentaiverse.org/?s=Character');
        await settings.evaluate(() => localStorage.setItem('jpx_cfgBattle', JSON.stringify({ battleVersion: 20251216, advanceToNextRound: true, showCooldowns: true, showDurations: true, showMonsterHP: true })));
        await settings.evaluate(() => __readme.settings());
        await settings.locator('#settings-container').waitFor({ state: 'visible' });
        await settings.locator('[data-control-preview-state=auto]').tap();
        await settings.locator('#panel_battle').evaluate(panel => { const group = panel.querySelector('[data-field-key=controlPanel]'); panel.scrollTop += group.getBoundingClientRect().top - panel.getBoundingClientRect().top - 10; });
        await settings.locator('#panel_battle').evaluate((panel, offset) => { panel.scrollTop += offset; }, language === 'en' ? 125 : 105);
        await settings.locator('#jpx-settings-menu-button').tap(); await settle(settings);
        assert.equal(await settings.locator('#settings-container').evaluate(node => node.classList.contains('jpx-settings-mobile')), true);

        const records = await open('https://meiyongai.github.io/JPX-PLUS/records.html');
        await records.evaluate(() => __readme.seed()); await records.evaluate(() => __readme.records());
        await records.waitForFunction(() => document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy') === 'false');
        await settle(records);
        assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(), 20);

        const popup = records.waitForEvent('popup');
        await records.locator('#battleStatsTable tbody tr:not([data-summary])').first().locator('.jpx-records-detail').tap();
        const detail = await popup;
        await detail.setViewportSize({ width: 390, height: 844 });
        await detail.locator('#info-records-div').waitFor(); await settle(detail);
        assert.equal(detail.url(), 'about:blank', 'real temporary detail page');
        assert.equal(await detail.locator('.jpx-record-detail-scroll').count(), 3);
        const pages = [['settings', settings], ['records', records], ['detail', detail]];
        const samePageStates = new Map();
        const screenshots = [];
        // Date-button activation can focus a table row. Remove that transient
        // focus before capturing both themes so the frames compare exactly.
        for (const [name, page] of pages) {
            await page.evaluate(() => document.activeElement?.blur());
            await settle(page);
            assert.equal(await page.evaluate(() => document.documentElement.dataset.jpxTheme), 'light');
            if (name === 'settings') await assertPreviewPalette(page, 'light');
            samePageStates.set(name, await viewState(page));
            const filename = 'mobile-' + name + imageSuffix + '.png';
            await page.screenshot({ path: path.join(output, filename) });
            screenshots.push(filename);
        }
        const beforeStorage = await settings.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(key => key !== 'jpx_theme').map(key => [key, localStorage.getItem(key)])));
        // Use the production toggle. The records tab receives the real storage
        // event and its registered detail window updates through refreshJpxTheme.
        await settings.evaluate(() => __readme.toggleTheme());
        for (const [name, page] of pages) {
            await page.waitForFunction(() => document.documentElement.dataset.jpxTheme === 'dark');
            await settle(page);
            if (name === 'settings') await assertPreviewPalette(page, 'dark');
            assert.deepEqual(await viewState(page), samePageStates.get(name), name + ': theme palette changes; content, other controls, scroll, menu and geometry remain identical');
            const filename = 'mobile-' + name + '-dark' + imageSuffix + '.png';
            await page.screenshot({ path: path.join(output, filename) });
            screenshots.push(filename);
        }
        assert.deepEqual(await settings.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(key => key !== 'jpx_theme').map(key => [key, localStorage.getItem(key)]))), beforeStorage);
        for (const [, page] of pages) {
            assert.equal(await page.evaluate(() => document.characterSet), 'UTF-8');
            assert.equal((await page.locator('body').textContent()).includes('\ufffd'), false);
            if (language === 'en') assert.doesNotMatch(await page.locator('body').innerText(), /[\u3400-\u9fff]/u, 'native English UI and example values contain no Chinese labels');
        }
        assert.deepEqual(errors, []);
        console.log(JSON.stringify({ language, screenshots, samePageThemePairs: true, realCrossPageThemeSync: true, viewport: { width: 390, height: 844 }, errors, blocked,
            sourceHash: crypto.createHash('sha256').update(source).digest('hex'), packHash: crypto.createHash('sha256').update(pack).digest('hex') }, null, 2));
    } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

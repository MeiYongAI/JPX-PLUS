'use strict';

// README illustrations: actual JPX-PLUS renderers with offline demonstration data.
// This is not a captured account or battle. No game/network actions are executed.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const sharp = require('sharp');
const backdrop = require('./backdrop.cjs');
const repo = path.resolve(__dirname, '../..');
const mainPath = path.join(repo, 'JPX-PLUS.user.js');
const packPath = path.join(repo, 'JPX-PLUS-ZhCN.user.js');
const main = fs.readFileSync(mainPath, 'utf8');
const pack = fs.readFileSync(packPath, 'utf8');
assert.equal(main.split('\ninitDo();').length, 2);
const images = path.join(repo, 'docs/images');
const now = Date.parse('2026-11-08T10:05:00.000Z');
const dark = process.argv.includes('--dark');
const background = dark ? backdrop.dark : backdrop.light;
const english = process.argv.includes('--en');
const languageSuffix = english ? '-en' : '';
const suffix = (dark ? '-dark' : '') + languageSuffix;
const url = 'https://hentaiverse.org/?s=Battle&ss=ba';
const finalStyle = main.slice(main.indexOf('function preProcessLog()')).match(/btcp\.setAttribute\('style', '([^']+)'\);/)[1];

function expose() {
    initDoI18n(); loadBattleConfig(); ensureJpxStyle(); applyJpxTheme();
    const clone = value => JSON.parse(JSON.stringify(value));
    window.__readmePanels = {
        config: () => JSON.stringify({ battle: cfgBattle, stats: cfgStats }),
        style: value => {
            if (value !== undefined) { cfgBattle.ctrlWidgetStyleText = value; jpxPanelManager.refreshAppearance(); }
            return cfgBattle.ctrlWidgetStyleText;
        },
        theme: () => { toggleJpxTheme(); return document.documentElement.dataset.jpxTheme; },
        final: async now => {
            log = document.getElementById('textlog');
            battleType = 'Arena'; worldLevel = 0; towerFloor = 0;
            roundInfo = { current: 100, total: 100 };
            timeRecords = { ...jpxUtils.createTimeRecords(), startTime: now - 300000, action: 1500, turn: 1498,
                riddle: { lastTurn: 100, solved: 2, total: 2 } };
            combatRecords = jpxUtils.createCombatRecords();
            Object.assign(combatRecords.physicalDealt, { fire: 125000, slashing: 345678, damagePlus: 1000,
                glance: 23, hit: 1024, crit: 180, miss: 4, evade: 6, parry: 8 });
            Object.assign(combatRecords.magicalDealt, { holy: 7860, hit: 16, crit: 4, resist: 1 });
            Object.assign(combatRecords.physicalTaken, { crushing: 12345, slashing: 6789, piercing: 3120,
                glance: 45, hit: 210, crit: 12, miss: 26, evade: 41, parry: 76, block: 115, blockPartially: 16 });
            Object.assign(combatRecords.magicalTaken, { fire: 4567, cold: 2345, elec: 1780, hit: 35, crit: 3, resist: 9, resistPartially: 5 });
            combatRecords.use = { Cure: 7, Regen: 4, Imperil: 12, 'Health Draught': 3, 'Mana Potion': 2 };
            revenueRecords = jpxUtils.createRevenueRecords();
            Object.assign(revenueRecords, { exp: 150000, credit: 12480 });
            revenueRecords.proficiency = { 'One-handed': 0.12345, 'Light Armor': 0.08421 };
            revenueRecords.equipment = { Legendary: ['Legendary Fiery Rapier of Slaughter'], Magnificent: ['Magnificent Leather Boots of Protection'] };
            revenueRecords.consumable = { 'World Seed': { drop: 3, use: 0 }, 'Health Draught': { drop: 2, use: 3 }, 'Mana Potion': { drop: 1, use: 2 } };
            revenueRecords.crystal = { 'Crystal of Flames': 42, 'Crystal of Frost': 36, 'Crystal of Lightning': 28 };
            revenueRecords.token = { 'Token of Chaos': 1 };
            cfgStats = clone(defaultCfgStats);
            cfgBattle.recordBattleLog = false;
            cfgBattle.dailyStaminaQuotaPlus = 0;
            const values = { stamina: '80', playerLevel: '400', difficulty: 'PFUDOR', persona: 'Offline example',
                staminaRecords: JSON.stringify({ lastUpdate: now, staminaCost: 22 }) };
            for (const [key, value] of Object.entries(values)) localStorage.setItem(prefix + key + isekaiSuffix, value);
            // Fixed illustrative prices; no account or market fetch is permitted.
            jpxMarket.getMarketPrice = async () => ({ 'Energy Drink': 1000, 'World Seed': 100,
                'Health Draught': 10, 'Mana Potion': 50, 'Crystal of Flames': 2, 'Crystal of Frost': 2,
                'Crystal of Lightning': 2, 'Token of Chaos': 0 });
            await recordFinalBattle();
            return { tables: [...document.querySelectorAll('.jpx-record-detail table')].map(t => ({ id: t.id, rows: t.rows.length })),
                records: (await exportIndexedDB()).stores.battleRecords.length };
        },
        widget: () => {
            log = document.getElementById('textlog'); monstersObj = { activeMonsters: [] };
            battleStyle = 'OneHanded'; battleType = 'Arena'; roundInfo = { current: 12, total: 100 };
            lastActionTimestamp = 1000; lastLogTimestamp = 1120;
            jpxPanelManager.createCtrlWidget('battle'); jpxPanelManager.updateContent('battle');
        },
        state: key => {
            isActiveBattle = key !== 'manual'; readyNext = 0;
            jpxPanelManager.setBackground({ auto: '#4f4', manual: '#fef', waiting: '#ff5' }[key]);
            jpxPanelManager.updateContent('battle');
            return jpxPanelManager.ctrlWidget.dataset.battleState;
        },
    };
}
const harness = main.replace('\ninitDo();', '\n(' + expose.toString() + ')();');
const minimal = body => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<style>body{margin:12px;background:#edebdf;color:#5c0d11;font:12px Verdana,sans-serif}#csp{width:1236px;text-align:center}#pane_log{width:670px;min-width:0}#btcp{width:530px;min-width:0}#final-layout{display:flex;align-items:flex-start;gap:20px}#textlog{margin-top:10px;text-align:left;font:12px Verdana,sans-serif}#textlog td{padding:3px}#finish-battle{font:12px Verdana,sans-serif;padding:6px 12px}</style>' +
    '</head><body><div id="csp"><div id="navbar"></div>' + body + '</div></body></html>';
const finalHTML = minimal('<main id="final-layout"><section id="pane_log"><table id="textlog"><tbody><tr><td>Round 100 / 100</td></tr><tr><td>You are Victorious!</td></tr></tbody></table></section><section id="btcp"><div id="game-controls"><button id="finish-battle">Finish Battle</button></div></section></main>');
const widgetHTML = minimal('<div id="textlog"></div>');
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));

async function open(browser, html, viewport) {
    const errors = [], blocked = [];
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: 'en-US' });
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest() && route.request().url() === url) return route.fulfill({ status: 200, contentType: 'text/html', body: html });
        blocked.push(route.request().url()); return route.abort();
    });
    await context.addInitScript(now => {
        const NativeDate = Date;
        window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } };
        window.GM_xmlhttpRequest = () => { throw Error('Offline README fixture forbids network actions'); };
    }, now);
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await backdrop.install(page);
    if (!english) await page.addScriptTag({ content: pack });
    await page.addScriptTag({ content: harness });
    return { page, context, errors, blocked };
}

(async () => {
    fs.mkdirSync(images, { recursive: true });
    const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL}:{}), headless: true });
    const report = { versions: { main: main.match(/@version\s+([^\r\n]+)/)[1], chinese: english ? null : pack.match(/@version\s+([^\r\n]+)/)[1] }, offlineExample: true, language: english ? 'en' : 'zh-CN', theme: dark ? 'dark' : 'light',
        sourceSha256: crypto.createHash('sha256').update(main).digest('hex'), images: [] };
    try {
        const final = await open(browser, finalHTML, { width: 1280, height: 1000 });
        try {
            await final.page.locator('#btcp').evaluate((node, style) => { node.setAttribute('style', style); node.classList.add('jpx-final-result'); }, finalStyle);
            const rendered = await final.page.evaluate(now => __readmePanels.final(now), now);
            await settle(final.page);
            assert.equal(rendered.records, 1);
            const box = await final.page.locator('#final-layout').boundingBox();
            const clip = { x: Math.max(0, Math.floor(box.x - 8)), y: Math.max(0, Math.floor(box.y - 8)), width: Math.ceil(box.width + 16), height: Math.ceil(box.height + 16) };
            const before = await final.page.evaluate(() => ({ config: __readmePanels.config(), text: document.getElementById('final-layout').innerText }));
            if (dark) {
                assert.equal(await final.page.evaluate(() => __readmePanels.theme()), 'dark');
                await settle(final.page);
                assert.deepEqual(await final.page.locator('#final-layout').boundingBox(), box, 'theme switch preserves final layout');
                assert.deepEqual(await final.page.evaluate(() => ({ config: __readmePanels.config(), text: document.getElementById('final-layout').innerText })), before, 'theme switch preserves configuration and record text');
            }
            const file = path.join(images, 'desktop-final' + suffix + '.png');
            await final.page.screenshot({ path: file, clip });
            const metadata = await sharp(file).metadata();
            if (dark) {
                const light = await sharp(path.join(images, 'desktop-final' + languageSuffix + '.png')).metadata();
                assert.deepEqual([metadata.width, metadata.height], [light.width, light.height]);
            }
            assert.deepEqual(final.errors, []); assert.deepEqual(final.blocked, []);
            report.images.push({ file, width: metadata.width, height: metadata.height, rendered, errors: final.errors, blocked: final.blocked });
        } finally { await final.context.close(); }
        const widget = await open(browser, widgetHTML, { width: 1024, height: 768 });
        try {
            await widget.page.evaluate(() => __readmePanels.widget());
            const captureStates = async () => {
                const captures = [];
                for (const state of ['auto', 'manual', 'waiting']) {
                    assert.equal(await widget.page.evaluate(key => __readmePanels.state(key), state), state);
                    await settle(widget.page);
                    const buffer = await widget.page.locator('#ctrl-widget').screenshot();
                    const metadata = await sharp(buffer).metadata();
                    const palette = await widget.page.locator('#ctrl-widget').evaluate(root => {
                        const style = getComputedStyle(root), header = getComputedStyle(root.querySelector('.jpx-widget-drag'));
                        return { text: style.color, surface: style.backgroundColor, border: style.borderTopColor,
                            header: header.backgroundColor, ink: header.color };
                    });
                    captures.push({ state, buffer, palette, width: metadata.width, height: metadata.height });
                }
                return captures;
            };
            const lightFrames = await captureStates();
            const before = await widget.page.evaluate(() => __readmePanels.config());
            assert.equal(await widget.page.evaluate(() => __readmePanels.theme()), 'dark');
            const darkFrames = await captureStates();
            assert.equal(await widget.page.evaluate(() => __readmePanels.config()), before, 'theme switch preserves control-panel configuration');
            const themeDefaultsChanged = darkFrames.every((frame, index) => !frame.buffer.equals(lightFrames[index].buffer));
            assert.ok(themeDefaultsChanged, 'every default state visibly follows the theme');
            for (const [index, frame] of darkFrames.entries()) {
                assert.deepEqual([frame.width, frame.height], [lightFrames[index].width, lightFrames[index].height], 'theme switch preserves panel layout');
                for (const key of Object.keys(frame.palette)) assert.notEqual(frame.palette[key], lightFrames[index].palette[key], key + ' follows theme');
            }
            if (!dark) assert.equal(await widget.page.evaluate(() => __readmePanels.theme()), 'light');
            const frames = dark ? darkFrames : lightFrames;
            const originalStyle = await widget.page.evaluate(() => __readmePanels.style());
            const customStyle = 'color: #a1b2c3; ' + ['auto', 'manual', 'waiting'].flatMap(state =>
                Object.entries({ header: '#345678', surface: '#123456', border: '#789abc', ink: '#ddeeff' }).map(([part, value]) => '--jpx-' + state + '-' + part + ': ' + value + ';')).join(' ');
            await widget.page.evaluate(style => __readmePanels.style(style), customStyle);
            const customBefore = await captureStates();
            const customConfig = await widget.page.evaluate(() => __readmePanels.config());
            assert.equal(await widget.page.evaluate(() => __readmePanels.theme()), dark ? 'light' : 'dark');
            const customAfter = await captureStates();
            const customColorsPreserved = customAfter.every((frame, index) => JSON.stringify(frame.palette) === JSON.stringify(customBefore[index].palette));
            assert.ok(customColorsPreserved, 'inline user colors take priority in every state and theme');
            const expectedCustom = { text: 'rgb(161, 178, 195)', surface: 'rgb(18, 52, 86)', border: 'rgb(120, 154, 188)', header: 'rgb(52, 86, 120)', ink: 'rgb(221, 238, 255)' };
            for (const frame of customAfter) assert.deepEqual(frame.palette, expectedCustom, 'each explicit user color is applied');
            assert.equal(await widget.page.evaluate(() => __readmePanels.config()), customConfig, 'theme switch preserves custom configuration');
            assert.equal(await widget.page.evaluate(() => __readmePanels.theme()), dark ? 'dark' : 'light');
            await widget.page.evaluate(style => __readmePanels.style(style), originalStyle);
            assert.equal(await widget.page.evaluate(() => __readmePanels.config()), before, 'custom-color test restores original configuration');
            const pad = 14, gap = 18;
            const width = frames.reduce((sum, frame) => sum + frame.width, 0) + gap * (frames.length - 1) + pad * 2;
            const height = Math.max(...frames.map(frame => frame.height)) + pad * 2;
            let left = pad;
            const composite = frames.map(frame => { const item = { input: frame.buffer, left, top: pad }; left += frame.width + gap; return item; });
            const file = path.join(images, 'control-panel' + suffix + '.png');
            await sharp({ create: { width, height, channels: 3, background } }).composite(composite).png().toFile(file);
            if (dark) {
                const light = await sharp(path.join(images, 'control-panel' + languageSuffix + '.png')).metadata();
                assert.deepEqual([width, height], [light.width, light.height]);
            }
            assert.deepEqual(widget.errors, []); assert.deepEqual(widget.blocked, []);
            report.images.push({ file, width, height, themeDefaultsChanged, customColorsPreserved,
                frames: frames.map(({ state, width, height, palette }) => ({ state, width, height, palette })), errors: widget.errors, blocked: widget.blocked });
        } finally { await widget.context.close(); }
        console.log(JSON.stringify(report, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

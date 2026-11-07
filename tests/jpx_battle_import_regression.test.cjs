'use strict';

// Reproduce file import/application with real UI in isolated, offline profiles.
// Optional reporter input stays outside the repository; no custom rules execute.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const fixtures = [{ name: 'Legacy optional targets', config: { battleVersion: 20251216,
    TwoHanded_General: { supports: [{ type: 'stop', customMessage: 'test only', conditions: [] }], attacks: [{ type: 'normalAttack' }] },
    OneHanded_Tower: { supports: [], attacks: [{ type: 'smartDebuff', name: 'Imperil', conditions: [], bottomUp: false, tailSkip: 0, maxAtFirst: 10, minMonstersLeft: 10 }] }
} }];
if (process.env.JPX_CONFIG_REPRO) fixtures.push({ name: 'Reporter configuration', config: JSON.parse(fs.readFileSync(process.env.JPX_CONFIG_REPRO, 'utf8')) });

function expose() {
    initDoI18n(); loadBattleConfig(); battleStyle = 'TwoHanded'; battleType = 'General';
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    const copy = value => JSON.parse(JSON.stringify(value));
    window.__battleImport = {
        open: renderSettings,
        snapshot: () => ({ config: copy(cfgBattle), native: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix),
            active: getJpxConfigLibrary().readState().active, mode: getBattleMode(), running: isActiveBattle }),
        library: () => getJpxConfigLibrary().readState(),
        normalize(config) {
            const output = {}; mergeCfg(copy(config), { battleVersion: defaultCfgBattle.battleVersion }, output, 'battle');
            const undefinedPaths = [];
            const visit = (value, key) => { if (value === undefined) undefinedPaths.push(key); else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => visit(v, key + '.' + k)); };
            visit(output, 'config'); return { undefinedPaths, config: copy(output) };
        },
        beginBattle() {
            log = document.createElement('table'); log.id = 'textlog'; document.getElementById('csp').append(log);
            isActiveBattle = true;
            // No real battle controls, requests or imported custom code execute.
            jpxPanelManager.updateContent = () => {}; jpxPanelManager.setBackground = () => {};
            jpxPanelManager.dispatchState = () => {}; jpxPanelManager.refreshAppearance = () => {};
        },
        routingCost() {
            getBattleMode();
            const get = Storage.prototype.getItem, parse = JSON.parse, stringify = JSON.stringify;
            let libraryReads = 0, parses = 0, serializes = 0;
            Storage.prototype.getItem = function(key) { if (key === jpxConfigLibraryKey) libraryReads++; return get.call(this, key); };
            JSON.parse = (...args) => { parses++; return parse(...args); };
            JSON.stringify = (...args) => { serializes++; return stringify(...args); };
            const started = performance.now();
            try {
                for (let i = 0; i < 10000; i++) { getBattleMode(); getManagedBattleStyle(battleStyle); getManagedSpellType(); }
                return { iterations: 10000, milliseconds: performance.now() - started, libraryReads, parses, serializes };
            } finally { Storage.prototype.getItem = get; JSON.parse = parse; JSON.stringify = stringify; }
        }
    };
}

let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => { await browser?.close(); });
for (const fixture of fixtures) for (const isekai of [false, true]) for (const combat of [false, true]) {
    test(`${fixture.name}: import/apply in ${isekai ? 'Isekai' : 'Persistent'} ${combat ? 'battle' : 'lobby'}`, { timeout: 30000 }, async t => {
        const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
        t.after(() => context.close());
        const page = await context.newPage(), errors = [], requests = [];
        page.on('pageerror', error => errors.push(error.message));
        await context.route('**/*', route => {
            if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div></div>' });
            requests.push(route.request().url()); return route.abort();
        });
        await page.goto('https://hentaiverse.org/' + (isekai ? 'isekai/' : ''));
        await page.addScriptTag({ content: source.replace('\ninitDo();', '\n(' + expose.toString() + ')();') });
        if (combat) await page.evaluate(() => __battleImport.beginBattle());
        await page.evaluate(() => __battleImport.open()); await page.locator('#tab_configManager').click();
        const before = await page.evaluate(() => __battleImport.snapshot());
        const chooser = page.waitForEvent('filechooser');
        await page.locator('.jpx-config-toolbar').getByRole('button', { name: 'Import', exact: true }).click();
        await (await chooser).setFiles({ name: fixture.name + '.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(fixture.config)) });
        await page.locator('.jpx-config-form').getByRole('button', { name: 'Save', exact: true }).click();
        const entry = await page.evaluate(name => __battleImport.library().entries.find(entry => entry.envelope.title === name), fixture.name);
        assert.ok(entry, 'file is stored in the local archive'); assert.equal(entry.envelope.kind, 'battle');
        assert.deepEqual(await page.evaluate(() => __battleImport.snapshot()), before, 'import itself changes no active rules or running state');
        const normalized = await page.evaluate(config => __battleImport.normalize(config), fixture.config);
        t.diagnostic(JSON.stringify({ undefinedAfterNormalization: normalized.undefinedPaths }));
        const row = page.locator(`[data-config-id="${entry.id}"]`);
        await row.getByRole('button', { name: 'Apply', exact: true }).click();
        await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Apply', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('.jpx-config-notice')?.textContent);
        assert.match(await page.locator('.jpx-config-notice').textContent(), /^Applied/, 'whole-file application should succeed');
        const after = await page.evaluate(() => __battleImport.snapshot());
        assert.equal(after.active[isekai ? 'Isekai' : 'Persistent'], entry.id);
        assert.equal(after.mode, 'TwoHanded_General');
        for (const [mode, rules] of Object.entries(normalized.config)) if (rules && typeof rules === 'object' && Array.isArray(rules.attacks)) assert.deepEqual(after.config[mode], rules);
        assert.deepEqual(after.config.OneHanded_Tower, normalized.config.OneHanded_Tower);
        assert.equal(Object.hasOwn(after.config.OneHanded_Tower.attacks[0], 'targetCount'), false, 'missing optional targets stay missing');
        assert.equal(after.running, false, 'applying does not resume a battle');
        const cost = await page.evaluate(() => __battleImport.routingCost()); t.diagnostic(JSON.stringify(cost));
        assert.equal(cost.libraryReads, 0); assert.equal(cost.parses, 0); assert.equal(cost.serializes, 0);
        assert.deepEqual(errors, []);
        if (combat) assert.deepEqual(requests, [], 'battle imports never fetch lobby/equipment or store data');
    });
}

'use strict';

// Real JPX-PLUS UI in disposable offline browser contexts. No game, GitHub,
// installed userscript storage, or account profile is accessed.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.test-output/config-management');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const zh = fs.readFileSync(path.join(root, 'JPX-PLUS-ZhCN.user.js'), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));
const { normalized } = require('./fixtures/battle-import.cjs');
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:8px;background:#edebdf;color:#5c0d11;font:12px Verdana}#csp{width:1240px;height:704px}</style></head><body><div id="csp"><div id="navbar"></div></div></body></html>';
const makeRules = marker => ({
    supports: [{ type: 'stop', customMessage: marker, conditions: [{ key: 'pHP', value: [0, .2] }] }],
    attacks: [{ type: 'normalAttack' }],
    futureMode: { preserve: marker, nested: [false, 7] }
});

function exposeManager() {
    initDoI18n();
    loadBattleConfig();
    battleStyle = 'OneHanded'; battleType = 'General';
    const copy = value => JSON.parse(JSON.stringify(value));
    window.__manager = {
        open: renderSettings,
        config: () => copy({ battle: cfgBattle, stats: cfgStats, shortcuts: userKeybinds }),
        native: () => ({ battle: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix),
            stats: localStorage.getItem(prefix + 'cfgStats'), shortcuts: localStorage.getItem(prefix + 'userKeybinds' + isekaiSuffix),
            magic: localStorage.getItem(prefix + 'spellDamageBonus' + isekaiSuffix) }),
        library: () => getJpxConfigLibrary().readState(),
        theme: toggleJpxTheme,
        label: key => t('cM.' + key),
        running: () => isActiveBattle,
        beginBattle() {
            // Exercise the real apply/pause branch, isolating only the live widget.
            log = document.createElement('div'); isActiveBattle = true;
            jpxPanelManager.updateContent = () => {};
            jpxPanelManager.setBackground = () => {};
            jpxPanelManager.dispatchState = () => {};
            jpxPanelManager.refreshAppearance = () => {};
        },
        seed(raw) {
            cfgBattle = {};
            mergeCfg(copy(raw), defaultCfgBattle, cfgBattle, 'battle');
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            localStorage.setItem(prefix + 'spellDamageBonus' + isekaiSuffix, JSON.stringify({ maxType: 'fire', maxValue: 42 }));
        }
    };
}

assert.equal(source.split('\ninitDo();').length, 2, 'real main-script startup anchor is unique');
const harness = source.replace('\ninitDo();', '\n(' + exposeManager.toString() + ')();');
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); fs.mkdirSync(output, { recursive: true }); });
after(async () => { await browser?.close(); });

async function fixture(t, { mobile = false, language = 'en', dark = false } = {}) {
    const context = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 960 },
        isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const page = await context.newPage(), errors = [], requests = [];
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ status: 200, contentType: 'text/html', body: html });
        if (route.request().method() === 'GET' && /^https:\/\/hentaiverse\.org\/(?:isekai\/)?\?s=Character&ss=(?:ch|eq)$/.test(route.request().url())) return route.fulfill({ status: 503, body: 'Character lookup unavailable in this fixture' });
        requests.push(route.request().url()); return route.abort();
    });
    await page.goto('https://hentaiverse.org/?s=Character');
    await page.evaluate(() => {
        window.__gmRequests = [];
        window.GM_xmlhttpRequest = options => { __gmRequests.push(options.url); throw Error('Unexpected remote request'); };
        const gm = new Map();
        window.GM_getValue = (key, fallback) => gm.has(key) ? gm.get(key) : fallback;
        window.GM_setValue = (key, value) => gm.set(key, value);
        window.GM_deleteValue = key => gm.delete(key);
        window.GM_listValues = () => [...gm.keys()];
    });
    if (language === 'zh') await page.addScriptTag({ content: zh });
    await page.addScriptTag({ content: harness });
    await page.evaluate(raw => { __manager.seed(raw); __manager.open(); }, {
        battleVersion: 20251216, recordBattleLog: false,
        OneHanded_General: makeRules('Original one-handed'), TwoHanded_General: makeRules('Original two-handed'),
        OneHanded_Item: makeRules('Original Item World')
    });
    if (dark) await page.evaluate(() => __manager.theme());
    await selectTab(page, 'configManager');
    await page.locator('.jpx-config-row').first().waitFor();
    const labels = await page.evaluate(() => Object.fromEntries(['name','mine','store','new','import','apply','edit','inUse','updateApply','title','style','element','world','scenario','create','cancel','back','save','undo','redo','keepEditing','discard','applyScope'].map(key => [key, __manager.label(key)])));
    return { page, context, errors, requests, labels, mobile, language, dark };
}

async function selectTab(page, name) {
    const tab = page.locator('#tab_' + name);
    if (!await tab.isVisible()) await page.locator('#jpx-settings-menu-button').click();
    await tab.click();
}
const manager = f => f.page.locator('.jpx-config-manager');
const editor = f => f.page.locator('.jpx-config-editor');
const nativeRow = (f, mode = 'OneHanded_General') => manager(f).locator(`[data-config-id="native-Persistent-${mode}"]`);
const rowByTitle = (f, title) => manager(f).locator('.jpx-config-row').filter({ has: f.page.locator('.jpx-config-title strong', { hasText: title }) });
const nativeSnapshot = f => f.page.evaluate(() => ({ runtime: __manager.config(), stored: __manager.native() }));
const savedEntry = (f, id) => f.page.evaluate(id => __manager.library().entries.find(entry => entry.id === id), id);
async function openNative(f) { await nativeRow(f).getByRole('button', { name: f.labels.edit, exact: true }).click(); await editor(f).waitFor(); }
async function toggleFirstRule(f) { await editor(f).locator('#jpx-rule-panel-rules .jpx-rule-state-toggle').first().click(); }
async function footerAction(f, key) { await editor(f).locator('.jpx-config-editor-footer').getByRole('button', { name: f.labels[key], exact: true }).click(); }
async function settle(page) { await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))); }
async function noErrors(f) {
    assert.deepEqual(f.errors, [], 'no uncaught browser errors');
    assert.deepEqual(f.requests, [], 'no unrelated page network requests');
    assert.deepEqual(await f.page.evaluate(() => __gmRequests), [], 'local management does not request GitHub');
}
async function importFile(f, data, filename) {
    const chooser = f.page.waitForEvent('filechooser');
    await manager(f).getByRole('button', { name: f.labels.import, exact: true }).click();
    await (await chooser).setFiles({ name: filename, mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
    const form = manager(f).locator('.jpx-config-form');
    await form.waitFor();
    await form.getByRole('button', { name: f.labels.save, exact: true }).click();
    await manager(f).locator('.jpx-config-list').waitFor();
}

test('manager seeds native slots without store requests or changes to applied settings', { timeout: 45000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    assert.equal(await nativeRow(f).getAttribute('data-active'), 'false', 'a lobby without equipment evidence cannot pretend to be single-handed');
    assert.equal(await nativeRow(f).locator('.jpx-config-status').count(), 0);
    assert.equal(await f.page.locator('.jpx-config-detected').count(), 0, 'unknown equipment has no current-style badge');
    const data = await savedEntry(f, 'native-Persistent-OneHanded_General');
    assert.deepEqual(data.envelope.config.OneHanded_General, original.runtime.battle.OneHanded_General);
    assert.equal(await f.page.locator('.jpx-settings-footer').isVisible(), false, 'manager owns its actions');
    assert.equal(await f.page.locator('#jpx-style-override-select').count(), 0, 'forced-style controls are absent');
    await selectTab(f.page, 'stats'); await selectTab(f.page, 'configManager');
    assert.deepEqual(await nativeSnapshot(f), original, 'navigation never applies a configuration');
    await noErrors(f);
});

test('editing and undo stay detached; explicit application changes only the chosen slot and pauses battle', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const id = 'native-Persistent-OneHanded_General';
    await openNative(f);
    assert.equal(await editor(f).locator('.jpx-config-editor-footer').getByRole('button', { name: f.labels.undo, exact: true }).isDisabled(), true);
    await toggleFirstRule(f);
    assert.deepEqual(await nativeSnapshot(f), original, 'unsaved rule changes do not affect battle');
    await footerAction(f, 'undo');
    assert.equal(await editor(f).locator('#jpx-rule-panel-rules .jpx-rule-state-toggle').first().getAttribute('data-enabled'), 'true');
    assert.deepEqual(await nativeSnapshot(f), original, 'undo does not rewrite running config');
    await footerAction(f, 'redo');
    assert.equal(await editor(f).locator('#jpx-rule-panel-rules .jpx-rule-state-toggle').first().getAttribute('data-enabled'), 'false');
    await footerAction(f, 'save');
    assert.equal((await savedEntry(f, id)).envelope.config.OneHanded_General.rules[0].disabled, true);
    assert.deepEqual(await nativeSnapshot(f), original, 'save only updates the library');
    await nativeRow(f).getByRole('button', { name: f.labels.updateApply, exact: true }).waitFor();
    await f.page.evaluate(() => __manager.beginBattle());
    await nativeRow(f).getByRole('button', { name: f.labels.updateApply, exact: true }).click();
    await nativeRow(f).locator('.jpx-config-status').waitFor();
    assert.equal(await f.page.evaluate(() => __manager.running()), false, 'auto-battle stops before applying');
    const applied = await nativeSnapshot(f), expected = clone(original.runtime);
    expected.battle.OneHanded_General.rules[0].disabled = true;
    expected.battle.OneHanded_General.rules[1].conditions = [];
    assert.deepEqual(applied.runtime, expected, 'unrelated modes, stats, and shortcuts stay unchanged');
    const expectedStored = JSON.parse(original.stored.battle); expectedStored.OneHanded_General.rules[0].disabled = true; expectedStored.OneHanded_General.rules[1].conditions = [];
    assert.deepEqual(JSON.parse(applied.stored.battle), expectedStored);
    assert.equal(applied.stored.magic, original.stored.magic, 'detected magic damage is never forged');
    await noErrors(f);
});

test('new config starts from defaults as a separate saved copy', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    await manager(f).getByRole('button', { name: f.labels.new, exact: true }).click();
    const form = manager(f).locator('.jpx-config-form');
    await form.getByLabel(f.labels.title, { exact: true }).fill('Two-handed frost');
    await form.getByRole('combobox', { name: f.labels.style, exact: true }).selectOption('TwoHanded');
    await form.getByRole('combobox', { name: f.labels.element, exact: true }).selectOption('cold');
    await form.getByRole('combobox', { name: f.labels.world, exact: true }).selectOption('Persistent');
    await form.getByRole('combobox', { name: f.labels.scenario, exact: true }).selectOption('General');
    await form.getByRole('button', { name: f.labels.create, exact: true }).click();
    await editor(f).waitFor();
    assert.deepEqual(await nativeSnapshot(f), original, 'creation does not apply the defaults');
    await toggleFirstRule(f); await footerAction(f, 'save');
    const entry = await f.page.evaluate(() => __manager.library().entries.find(entry => entry.envelope.title === 'Two-handed frost'));
    assert.equal(entry.envelope.mode, 'TwoHanded_General');
    assert.deepEqual(entry.envelope.config.TwoHanded_General.jpxPlusExecution, { style: 'TwoHanded', element: 'cold' });
    assert.notEqual(entry.id, 'native-Persistent-TwoHanded_General');
    assert.deepEqual(await nativeSnapshot(f), original, 'new copy remains unapplied after saving');
    assert.equal(await rowByTitle(f, 'Two-handed frost').getAttribute('data-active'), 'false');
    await noErrors(f);
});

test('multi-mode import stays one file, edits one group, and confirms whole-config application', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const legacy = { battleVersion: 20251216, OneHanded_General: makeRules('Imported one-handed'),
        TwoHanded_Item: makeRules('Imported item mode'), recordBattleLog: true,
        futureRoot: { preserved: ['whole file', 17] } };
    await importFile(f, legacy, 'Legacy multi-mode.json');
    assert.deepEqual(await nativeSnapshot(f), original);
    let imported = await f.page.evaluate(() => __manager.library().entries.find(entry => entry.envelope.title === 'Legacy multi-mode'));
    assert.equal(imported.envelope.kind, 'battle');
    assert.equal(imported.envelope.mode, undefined);
    assert.deepEqual(imported.envelope.config, normalized(legacy), 'whole file and extension metadata survive import');
    await rowByTitle(f, 'Legacy multi-mode').getByRole('button', { name: f.labels.edit, exact: true }).click();
    assert.equal(await editor(f).count(), 0);
    assert.equal(await manager(f).locator('.jpx-config-group').count(), 2, 'choose group in management');
    await manager(f).locator('.jpx-config-group').first().click();
    await toggleFirstRule(f); await footerAction(f, 'save');
    imported = await savedEntry(f, imported.id);
    assert.equal(imported.envelope.config.OneHanded_General.rules[0].disabled, true);
    assert.deepEqual(imported.envelope.config.TwoHanded_Item, normalized(legacy).TwoHanded_Item);
    assert.deepEqual(imported.envelope.config.futureRoot, legacy.futureRoot);
    assert.deepEqual(await nativeSnapshot(f), original, 'editing an imported group cannot apply its other groups');
    await rowByTitle(f, 'Legacy multi-mode').getByRole('button', { name: f.labels.apply, exact: true }).click();
    const confirm = manager(f).locator('.jpx-config-confirm'); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.cancel, exact: true }).click();
    assert.deepEqual(await nativeSnapshot(f), original, 'cancelled application has no effect');
    await rowByTitle(f, 'Legacy multi-mode').getByRole('button', { name: f.labels.apply, exact: true }).click();
    await confirm.getByRole('button', { name: f.labels.apply, exact: true }).click();
    await rowByTitle(f, 'Legacy multi-mode').locator('.jpx-config-status').waitFor();
    const applied = await nativeSnapshot(f);
    assert.deepEqual(applied.runtime.battle.OneHanded_General, imported.envelope.config.OneHanded_General);
    assert.deepEqual(applied.runtime.battle.TwoHanded_Item, normalized(legacy).TwoHanded_Item);
    assert.deepEqual(applied.runtime.battle.TwoHanded_General, original.runtime.battle.TwoHanded_General);
    assert.equal(applied.runtime.battle.recordBattleLog, true);
    assert.deepEqual((await savedEntry(f, imported.id)).envelope.config.futureRoot, legacy.futureRoot);
    await noErrors(f);
});

test('dirty back, section navigation, and close allow keep, discard, or save without applying', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    await openNative(f); await toggleFirstRule(f);
    await editor(f).locator('.jpx-config-editor-header').getByRole('button', { name: f.labels.back, exact: true }).click();
    const confirm = manager(f).locator('.jpx-config-confirm'); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.keepEditing, exact: true }).click();
    assert.equal(await editor(f).isVisible(), true);
    await selectTab(f.page, 'stats'); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.discard, exact: true }).click();
    await f.page.locator('#panel_stats').waitFor({ state: 'visible' });
    assert.deepEqual(await nativeSnapshot(f), original);
    await selectTab(f.page, 'configManager');
    await openNative(f); await toggleFirstRule(f);
    await f.page.locator('#close-button').click(); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.keepEditing, exact: true }).click();
    assert.equal(await f.page.locator('#settings-container').isVisible(), true);
    await f.page.locator('#close-button').click();
    await confirm.getByRole('button', { name: f.labels.save, exact: true }).click();
    await f.page.locator('#settings-container').waitFor({ state: 'detached' });
    assert.deepEqual(await nativeSnapshot(f), original, 'save-and-close never applies the draft');
    await f.page.evaluate(() => __manager.open()); await selectTab(f.page, 'configManager');
    await nativeRow(f).getByRole('button', { name: f.labels.updateApply, exact: true }).waitFor();
    await noErrors(f);
});

test('saving in a section-change prompt returns to the requested page without applying', { timeout: 45000 }, async t => {
    const f = await fixture(t, { language: 'zh' }), original = await nativeSnapshot(f);
    await openNative(f); await toggleFirstRule(f);
    await selectTab(f.page, 'stats');
    const confirm = manager(f).locator('.jpx-config-confirm'); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.save, exact: true }).click();
    await f.page.locator('#panel_stats').waitFor({ state: 'visible' });
    assert.equal((await savedEntry(f, 'native-Persistent-OneHanded_General')).envelope.config.OneHanded_General.rules[0].disabled, true);
    assert.deepEqual(await nativeSnapshot(f), original, 'save-before-navigation changes the library only');
    await selectTab(f.page, 'configManager');
    await nativeRow(f).getByRole('button', { name: f.labels.updateApply, exact: true }).waitFor();
    assert.equal(await editor(f).count(), 0, 'returning to management cannot reopen a stale draft');
    await noErrors(f);
});

test('stats configs use a detached field picker and commit only after explicit Any-world application', { timeout: 60000 }, async t => {
    const f = await fixture(t, { language: 'zh' }), original = await nativeSnapshot(f);
    const stats = {
        statsVersion: 20260109,
        combatRows: [{ id: 'fire', s_pd: 'color: #654321;' }],
        revenueRows: [{ id: 'credit', styleText: 'color: #345678;' }],
        statsColumns: [{ id: 'date', customName: 'Original date', styleText: 'color: #123456;', future: { preserved: 8 } }]
    };
    const envelope = { schemaVersion: 1, kind: 'stats', title: 'Saved statistics', description: '', world: 'Any', scriptVersion: '2026.11.07.1', config: stats };
    await importFile(f, envelope, 'Saved statistics.json');
    assert.deepEqual(await nativeSnapshot(f), original, 'stats import only saves a library entry');
    await rowByTitle(f, 'Saved statistics').getByRole('button', { name: f.labels.edit, exact: true }).click();
    await editor(f).locator('.jpx-config-stats-editor').waitFor();
    const columns = editor(f).locator('[data-field-key="statsColumns"]');
    await columns.locator('[data-field-id="date"] .jpx-stats-select').click();
    await columns.locator('.jpx-stats-name-edit').click();
    const nameInput = columns.locator('input[data-edit-key="customName"]');
    await nameInput.fill('统计日期'); await nameInput.press('Enter');
    await columns.locator('[data-field-id="date"] .jpx-rule-state-toggle').click();
    assert.deepEqual(await nativeSnapshot(f), original, 'stats controls do not edit cfgStats or its persisted data');
    await footerAction(f, 'save');
    const entry = await f.page.evaluate(() => __manager.library().entries.find(entry => entry.envelope.title === 'Saved statistics'));
    assert.equal(entry.envelope.world, 'Any');
    assert.equal(entry.envelope.config.statsColumns[0].customName, '统计日期');
    assert.equal(entry.envelope.config.statsColumns[0].disabled, true);
    assert.deepEqual(entry.envelope.config.statsColumns[0].future, stats.statsColumns[0].future);
    assert.deepEqual(await nativeSnapshot(f), original, 'saving the stats library entry is not application');
    await rowByTitle(f, 'Saved statistics').getByRole('button', { name: f.labels.apply, exact: true }).click();
    const confirm = manager(f).locator('.jpx-config-confirm'); await confirm.waitFor();
    assert.deepEqual(await nativeSnapshot(f), original, 'the application prompt has no side effect');
    await confirm.getByRole('button', { name: f.labels.apply, exact: true }).click();
    await rowByTitle(f, 'Saved statistics').locator('.jpx-config-status').waitFor();
    const applied = await nativeSnapshot(f), column = applied.runtime.stats.statsColumns.find(item => item.id === 'date');
    assert.equal(column.customName, '统计日期'); assert.equal(column.disabled, true);
    assert.equal(column.styleText, stats.statsColumns[0].styleText);
    assert.deepEqual(column.future, stats.statsColumns[0].future);
    assert.deepEqual(JSON.parse(applied.stored.stats), applied.runtime.stats, 'Any-world stats apply is persisted');
    assert.deepEqual(applied.runtime.battle, original.runtime.battle);
    assert.deepEqual(applied.runtime.shortcuts, original.runtime.shortcuts);
    assert.equal(applied.stored.battle, original.stored.battle);
    assert.equal(applied.stored.shortcuts, original.stored.shortcuts);
    assert.equal(applied.stored.magic, original.stored.magic);
    await noErrors(f);
});

test('deep rule editing retains expanded items and scroll position through undo and redo', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const rules = { supports: Array.from({ length: 80 }, (_, index) => ({ type: 'stop', customMessage: 'Long rule ' + String(index).padStart(2, '0'),
        conditions: [{ key: 'pHP', value: [0, .2] }] })), attacks: [{ type: 'normalAttack' }] };
    await importFile(f, { battleVersion: 20251216, OneHanded_General: rules }, 'Long rules.json');
    await rowByTitle(f, 'Long rules').getByRole('button', { name: f.labels.edit, exact: true }).click();
    const items = editor(f).locator('#jpx-rule-panel-rules .jpx-rule-item');
    assert.equal(await items.count(), 81);
    await items.nth(5).locator(':scope > summary').click();
    await items.nth(45).locator(':scope > summary').click();
    const input = items.nth(45).locator('[data-field-key="customMessage"] input');
    await input.scrollIntoViewIfNeeded(); await input.focus(); await settle(f.page);
    const view = () => editor(f).locator('#jpx-rule-panel-rules').evaluate(panel => ({
        scroll: panel.querySelector('.jpx-rule-scroll').scrollTop,
        expanded: [...panel.querySelectorAll('.jpx-rule-item')].flatMap((item, index) => item.open ? [index] : [])
    }));
    const before = await view();
    assert.ok(before.scroll > 1000, 'the edited rule is deep inside a scrollable list');
    const panel = editor(f).locator('#jpx-rule-panel-rules');
    assert.equal(await panel.locator('nav').count(), 0, 'rules use one list without a duplicate navigation panel');
    const layout = await panel.evaluate(node => ({ panel: node.clientWidth, list: node.querySelector('.jpx-rule-scroll').clientWidth }));
    assert.ok(Math.abs(layout.panel - layout.list) <= 1, 'the rule list uses the full editor width');
    assert.deepEqual(before.expanded, [5, 45]);
    await input.fill('Edited deep rule'); await settle(f.page);
    const edited = await view();
    await footerAction(f, 'undo'); await settle(f.page);
    const undone = await view();
    assert.deepEqual(undone.expanded, before.expanded, 'undo preserves disclosure state');
    assert.ok(Math.abs(undone.scroll - before.scroll) <= 1, `undo keeps scroll position (${undone.scroll} vs ${before.scroll})`);
    assert.equal(await input.inputValue(), 'Long rule 45');
    await footerAction(f, 'redo'); await settle(f.page);
    const redone = await view();
    assert.deepEqual(redone.expanded, edited.expanded, 'redo preserves disclosure state');
    assert.ok(Math.abs(redone.scroll - edited.scroll) <= 1, `redo keeps scroll position (${redone.scroll} vs ${edited.scroll})`);
    assert.equal(await input.inputValue(), 'Edited deep rule');
    assert.deepEqual(await nativeSnapshot(f), original, 'history navigation does not affect live configuration');
    const entry = await f.page.evaluate(() => __manager.library().entries.find(entry => entry.envelope.title === 'Long rules'));
    assert.deepEqual(entry.envelope.config.OneHanded_General, normalized({mode:rules}).mode, 'undo and redo do not save the draft');
    await noErrors(f);
});

async function checkLayout(f) {
    await settle(f.page);
    const geometry = await manager(f).evaluate(node => {
        const dialog = node.closest('dialog'), rect = dialog.getBoundingClientRect();
        const scrolls = [...node.querySelectorAll('.jpx-config-body,.jpx-config-editor-content,.jpx-rule-scroll')]
            .filter(element => element.getClientRects().length)
            .map(element => ({ className: element.className, client: element.clientWidth, scroll: element.scrollWidth }));
        const controls = [...node.querySelectorAll('button,input,select')].filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
            .map(element => { const box = element.getBoundingClientRect(); return { text: element.textContent.slice(0, 32), left: box.left, right: box.right }; });
        return { viewport: { width: innerWidth, height: innerHeight }, dialog: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }, scrolls, controls };
    });
    assert.ok(geometry.dialog.left >= -1 && geometry.dialog.right <= geometry.viewport.width + 1, 'dialog fits viewport width');
    assert.ok(geometry.dialog.top >= -1 && geometry.dialog.bottom <= geometry.viewport.height + 1, 'dialog fits viewport height');
    for (const item of geometry.scrolls) assert.ok(item.scroll <= item.client + 1, item.className + ' has no horizontal overflow');
    for (const control of geometry.controls) assert.ok(control.left >= geometry.dialog.left - 1 && control.right <= geometry.dialog.right + 1,
        'control fits: ' + JSON.stringify(control));
    const footer = editor(f).locator('.jpx-config-editor-footer');
    if (await footer.count()) {
        const rect = await footer.boundingBox();
        assert.ok(rect.y >= geometry.dialog.top && rect.y + rect.height <= geometry.dialog.bottom + 1, 'editor actions remain visible');
    }
    const grip = editor(f).locator('.jpx-drag-grip').first();
    if (await grip.count()) {
        const appearance = await grip.evaluate(node => ({ padding: getComputedStyle(node).padding,
            svgWidth: node.querySelector('svg').getBoundingClientRect().width, dots: node.querySelectorAll('circle').length,
            border: getComputedStyle(node).borderTopColor, cursor: getComputedStyle(node).cursor }));
        assert.equal(appearance.padding, '0px', 'generic button padding must not squeeze the grip');
        assert.ok(appearance.svgWidth >= 16, 'six-dot handle stays visible');
        assert.equal(appearance.dots, 6);
        assert.equal(appearance.border, 'rgba(0, 0, 0, 0)', 'idle grip has no box');
        assert.equal(appearance.cursor, 'grab');
    }
}

test('unchanged detection and return visits preserve configuration rows and keyboard focus', { timeout: 45000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const result = await manager(f).evaluate(async root => {
        const rows = [...root.querySelectorAll('.jpx-config-row')];
        const button = rows[0].querySelector('button'); button.focus();
        const body = root.querySelector('.jpx-config-body'); body.scrollTop = 20;
        const top = body.scrollTop;
        for (let i = 0; i < 5; i++) window.dispatchEvent(new Event('jpx:mode-detected'));
        return { retained: rows.every((row, index) => row === root.querySelectorAll('.jpx-config-row')[index]),
            focused: document.activeElement === button, scroll: body.scrollTop === top };
    });
    assert.deepEqual(result, { retained: true, focused: true, scroll: true });
    const first = await nativeRow(f).elementHandle();
    await selectTab(f.page, 'battle'); await selectTab(f.page, 'configManager');
    assert.equal(await first.evaluate(row => row.isConnected), true, 'returning does not rebuild unchanged rows');
    assert.deepEqual(await nativeSnapshot(f), original);
    await noErrors(f);
});

test('mobile uses one header Back for nested pages and retains unsaved-edit protection', { timeout: 60000 }, async t => {
    const f = await fixture(t, { mobile: true, language: 'zh' }), original = await nativeSnapshot(f);
    const back = f.page.locator('#close-button');
    await openNative(f);
    assert.equal(await manager(f).locator('.jpx-config-back').isVisible(), false, 'no second Back in the editor');
    assert.equal(await back.isVisible(), true);
    await back.click(); await nativeRow(f).waitFor();
    assert.equal(await f.page.locator('#settings-container').isVisible(), true, 'Back returns to configs instead of closing settings');
    await openNative(f); await toggleFirstRule(f); await back.click();
    const confirm = manager(f).locator('.jpx-config-confirm'); await confirm.waitFor();
    await confirm.getByRole('button', { name: f.labels.keepEditing, exact: true }).click();
    await editor(f).waitFor(); await back.click();
    await confirm.getByRole('button', { name: f.labels.discard, exact: true }).click();
    await nativeRow(f).waitFor();
    await manager(f).getByRole('button', { name: f.labels.new, exact: true }).click();
    assert.equal(await manager(f).locator('.jpx-config-back').isVisible(), false);
    await back.click(); await nativeRow(f).waitFor();
    const whole = { battleVersion: 20251216, OneHanded_General: makeRules('One'), TwoHanded_General: makeRules('Two') };
    await importFile(f, whole, 'Mobile groups.json');
    await rowByTitle(f, 'Mobile groups').getByRole('button', { name: f.labels.edit, exact: true }).click();
    assert.equal(await manager(f).locator('.jpx-config-group').count(), 2);
    assert.equal(await manager(f).locator('.jpx-config-back').isVisible(), false);
    await back.click(); await nativeRow(f).waitFor();
    await back.click(); await f.page.locator('#settings-container').waitFor({ state: 'detached' });
    assert.deepEqual(await nativeSnapshot(f), original);
    await noErrors(f);
});

test('collapsed rules defer controls, preserve header geometry, and reuse forms after reopening', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const rules = { supports: Array.from({ length: 160 }, (_, i) => ({ type: 'stop', customMessage: 'Rule ' + i,
        conditions: [{ key: 'pHP', value: [0, .4] }] })), attacks: [{ type: 'normalAttack', conditions: [] }] };
    await importFile(f, { battleVersion: 20251216, OneHanded_General: rules }, 'Deferred rules.json');
    await rowByTitle(f, 'Deferred rules').getByRole('button', { name: f.labels.edit, exact: true }).click();
    const items = editor(f).locator('#jpx-rule-panel-rules .jpx-rule-item');
    assert.equal(await items.count(), 161);
    assert.equal(await items.locator('.jpx-rule-item-body input').count(), 0, 'closed complete rules do not build hidden input controls');
    const item = items.first(), summary = item.locator(':scope > summary');
    const before = await summary.boundingBox();
    const actionBefore = await item.locator('.jpx-array-item-actions').boundingBox();
    await summary.click(); await settle(f.page);
    assert.deepEqual(await summary.boundingBox(), before, 'expansion does not shrink or shift its header');
    assert.deepEqual(await item.locator('.jpx-array-item-actions').boundingBox(), actionBefore, 'header actions remain in place');
    assert.equal(await items.locator('.jpx-rule-item-body input').count(), 3, 'only the selected rule is materialized');
    const input = item.locator('[data-field-key=customMessage] input'), handle = await input.elementHandle();
    await summary.click(); await summary.click();
    assert.equal(await handle.evaluate(node => node.isConnected), true, 'reopening reuses its controls');
    assert.equal(await editor(f).locator('.jpx-config-editor-footer').getByRole('button', { name: f.labels.save, exact: true }).isDisabled(), true,
        'disclosure creates neither changes nor history');
    await input.fill('Deferred edit'); await footerAction(f, 'undo');
    assert.equal(await input.inputValue(), 'Rule 0');
    await footerAction(f, 'redo'); assert.equal(await input.inputValue(), 'Deferred edit');
    assert.deepEqual(await nativeSnapshot(f), original);
    await noErrors(f);
});

test('disclosure animates without moving header controls and supports rapid reversal and bulk toggles', { timeout: 60000 }, async t => {
    const f = await fixture(t);
    const rules = { supports: Array.from({ length: 24 }, (_, i) => ({ type: 'stop', customMessage: 'Motion ' + i,
        conditions: [{ key: 'pHP', value: [0, .4] }] })), attacks: [{ type: 'normalAttack', conditions: [] }] };
    await importFile(f, { battleVersion: 20251216, OneHanded_General: rules }, 'Motion.json');
    await rowByTitle(f, 'Motion').getByRole('button', { name: f.labels.edit, exact: true }).click();
    await f.page.emulateMedia({ reducedMotion: 'no-preference' });
    const items = editor(f).locator('#jpx-rule-panel-rules .jpx-rule-item'), first = items.first();
    const frames = await first.evaluate(async item => {
        const summary = item.querySelector('summary');
        const before = summary.getBoundingClientRect();
        const samples = [];
        summary.click();
        const start = performance.now();
        do {
            await new Promise(requestAnimationFrame);
            const header = summary.getBoundingClientRect();
            samples.push({ height: item.getBoundingClientRect().height, header: header.height, y: header.y });
        } while (performance.now() - start < 240);
        return { samples, before: { height: before.height, y: before.y } };
    });
    const heights = frames.samples.map(frame => frame.height), finalHeight = heights.at(-1);
    assert.ok(heights.some(height => height > frames.before.height + 3 && height < finalHeight - 3), 'expansion has intermediate sizes');
    assert.ok(frames.samples.every(frame => frame.header === frames.before.height && frame.y === frames.before.y), 'header remains stationary throughout animation');
    await first.evaluate(async item => {
        const summary = item.querySelector('summary');
        for (let i = 0; i < 5; i++) { summary.click(); await new Promise(requestAnimationFrame); }
    });
    assert.equal(await first.getAttribute('open'), null, 'rapid reversal ends closed');
    await f.page.waitForTimeout(180);
    const toggle = editor(f).locator('.jpx-rule-section-controls .jpx-rule-list-toggle');
    for (const expanded of [true, false]) {
        const motion = await toggle.evaluate(async button => {
            const row = document.querySelector('#jpx-rule-panel-rules .jpx-rule-item');
            const before = row.getBoundingClientRect().height, samples = [], start = performance.now();
            button.click();
            do { await new Promise(requestAnimationFrame); samples.push(row.getBoundingClientRect().height); } while (performance.now() - start < 260);
            return { before, samples };
        });
        const low = Math.min(motion.before, motion.samples.at(-1)), high = Math.max(motion.before, motion.samples.at(-1));
        assert.ok(motion.samples.some(height => height > low + 2 && height < high - 2), 'bulk disclosure has intermediate frames');
        await f.page.waitForFunction(open => document.querySelectorAll('#jpx-rule-panel-rules .jpx-rule-item[open]').length === (open ? 25 : 0), expanded);
    }
    await f.page.emulateMedia({ reducedMotion: 'reduce' });
    await toggle.click();
    await f.page.waitForFunction(() => document.querySelectorAll('#jpx-rule-panel-rules .jpx-rule-item[open]').length === 25);
    assert.equal(await items.locator('[data-field-key=customMessage] input').count(), 24);
    const handle = await first.locator('[data-field-key=customMessage] input').elementHandle();
    await toggle.click(); await toggle.click();
    assert.equal(await handle.evaluate(node => node.isConnected), true, 'bulk reopening reuses existing forms');
    assert.equal(await editor(f).locator('.jpx-config-editor-footer').getByRole('button', { name: f.labels.save, exact: true }).isDisabled(), true);
    await noErrors(f);
});

test('six-dot grip supports drag and keyboard sorting with reversible isolated edits', { timeout: 45000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    const rules = { supports: ['First', 'Second', 'Third'].map(customMessage => ({ type: 'stop', customMessage, conditions: [] })),
        attacks: [{ type: 'normalAttack', conditions: [] }] };
    await importFile(f, { battleVersion: 20251216, OneHanded_General: rules }, 'Sorting.json');
    await rowByTitle(f, 'Sorting').getByRole('button', { name: f.labels.edit, exact: true }).click();
    const rows = editor(f).locator('#jpx-rule-panel-rules .jpx-rule-array-item');
    const names = () => rows.locator('.jpx-rule-item-name').allTextContents();
    const before = await names();
    const grip = rows.first().locator('.jpx-drag-grip'), start = await grip.boundingBox(), target = await rows.nth(2).boundingBox();
    await f.page.mouse.move(start.x + start.width / 2, start.y + start.height / 2); await f.page.mouse.down();
    await f.page.mouse.move(target.x + 70, target.y + target.height - 3, { steps: 12 });
    await f.page.mouse.up();
    assert.match((await names())[2], /First/);
    assert.equal(await rows.locator('.jpx-rule-item[open]').count(), 0, 'dragging does not disclose a rule');
    await footerAction(f, 'undo'); assert.deepEqual(await names(), before);
    await rows.first().locator('.jpx-drag-grip').press('Alt+ArrowDown');
    assert.match((await names())[1], /First/);
    await footerAction(f, 'undo'); assert.deepEqual(await names(), before);
    assert.deepEqual(await nativeSnapshot(f), original);
    await noErrors(f);
});

test('sidebar motion is interruptible, preserves content, and respects reduced motion', { timeout: 45000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    await f.page.emulateMedia({ reducedMotion: 'no-preference' });
    const sidebar = f.page.locator('.jpx-settings-sidebar');
    const widths = await sidebar.evaluate(async node => {
        const widths = [node.getBoundingClientRect().width], start = performance.now();
        node.querySelector('.jpx-settings-sidebar-toggle').click();
        do { await new Promise(requestAnimationFrame); widths.push(node.getBoundingClientRect().width); } while (performance.now() - start < 220);
        return widths;
    });
    const expandedWidth = widths[0], collapsedWidth = expandedWidth - 98;
    assert.equal(widths.at(-1), collapsedWidth);
    assert.ok(widths.some(width => width > collapsedWidth + 1 && width < expandedWidth - 1), 'sidebar has intermediate widths');
    await sidebar.evaluate(async node => {
        const button = node.querySelector('.jpx-settings-sidebar-toggle');
        for (let i = 0; i < 5; i++) { button.click(); await new Promise(requestAnimationFrame); }
        await Promise.all(node.getAnimations({ subtree: true }).map(animation => animation.finished.catch(() => {})));
    });
    assert.equal((await sidebar.boundingBox()).width, expandedWidth, 'rapid reversals finish expanded');
    await f.page.emulateMedia({ reducedMotion: 'reduce' });
    await sidebar.locator('.jpx-settings-sidebar-toggle').click();
    assert.equal((await sidebar.boundingBox()).width, collapsedWidth, 'reduced motion applies the final width immediately');
    assert.deepEqual(await nativeSnapshot(f), original, 'animation never changes configuration');
    await noErrors(f);
});

test('mobile navigation fades without moving the page and dismisses safely during motion', { timeout: 45000 }, async t => {
    const f = await fixture(t, { mobile: true });
    await f.page.emulateMedia({ reducedMotion: 'no-preference' });
    const sidebar = f.page.locator('.jpx-settings-sidebar'), menu = f.page.locator('#jpx-settings-menu-button');
    const panel = f.page.locator('#panel_configManager'), before = await panel.boundingBox();
    const opacities = await sidebar.evaluate(async node => {
        document.getElementById('jpx-settings-menu-button').click();
        const values = [], start = performance.now();
        do { await new Promise(requestAnimationFrame); values.push(Number(getComputedStyle(node).opacity)); } while (performance.now() - start < 220);
        return values;
    });
    assert.ok(opacities.some(value => value > 0 && value < 1));
    assert.equal(opacities.at(-1), 1);
    assert.deepEqual(await panel.boundingBox(), before, 'dropdown never pushes page content');
    await menu.click();
    assert.equal(await sidebar.evaluate(node => node.inert), true, 'closing immediately prevents hidden navigation focus');
    await menu.click(); await f.page.keyboard.press('Escape');
    await sidebar.waitFor({ state: 'hidden' });
    assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    assert.equal(await menu.evaluate(node => node === document.activeElement), true);
    assert.equal(await f.page.locator('#settings-container').isVisible(), true);
    await f.page.emulateMedia({ reducedMotion: 'reduce' });
    await menu.click();
    assert.equal(await sidebar.evaluate(node => getComputedStyle(node).opacity), '1');
    await menu.click(); assert.equal(await sidebar.isVisible(), false);
    await noErrors(f);
});

for (const mobile of [false, true]) test(`native dropdown options inherit dark colors despite host CSS, ${mobile ? 'mobile' : 'desktop'}`, { timeout: 45000 }, async t => {
    const f = await fixture(t, { mobile, language: 'zh', dark: true });
    const nativeCss = 'input[type="text"],input[type="password"],input[type="number"],textarea,select,option{font-size:10pt;border-radius:5px;color:#5C0D11;background:#EDEADA;border:1px solid #5C0D11;margin:4px 0 0 0;padding:3px}';
    const hostOptions = nativeCss.match(/[^{}]*\boption\s*\{[^}]*\}/)?.[0];
    assert.ok(hostOptions, 'captured game option rule exists');
    await f.page.addStyleTag({ content: hostOptions });
    await importFile(f, { battleVersion: 20251216, OneHanded_General: {
        supports: [{ type: 'item', name: 'Mystic Gem', conditions: [] }], attacks: [{ type: 'normalAttack', conditions: [] }]
    } }, 'Dark picker.json');
    await rowByTitle(f, 'Dark picker').getByRole('button', { name: f.labels.edit, exact: true }).click();
    const item = editor(f).locator('#jpx-rule-panel-rules .jpx-rule-item').first();
    await item.locator(':scope > summary').click();
    const select = item.locator('[data-field-key=name] select'); await select.click();
    const appearance = () => select.evaluate(node => {
        const options = [...node.options];
        return { picker: getComputedStyle(node, '::picker(select)').backgroundColor,
            options: options.map(option => { const css = getComputedStyle(option); return { color: css.color, background: css.backgroundColor,
                margin: css.marginTop, border: css.borderTopWidth, selected: option.selected }; }) };
    });
    const dark = await appearance();
    assert.equal(dark.picker, 'rgb(32, 34, 38)');
    for (const option of dark.options) {
        assert.equal(option.color, 'rgb(229, 224, 216)', 'readable theme text replaces native red');
        assert.ok(['rgba(0, 0, 0, 0)', 'rgb(81, 68, 52)', 'rgb(61, 57, 51)'].includes(option.background), option.background);
        assert.equal(option.margin, '0px'); assert.equal(option.border, '0px', 'options are rows, not separate pale boxes');
    }
    await f.page.screenshot({ path: path.join(output, `${mobile ? 'mobile' : 'desktop'}-dark-picker.png`) });
    await f.page.keyboard.press('Escape');
    await f.page.evaluate(() => __manager.theme()); await select.click();
    const light = await appearance();
    assert.equal(light.picker, 'rgb(237, 235, 223)');
    assert.ok(light.options.every(option => option.color === 'rgb(92, 13, 17)'));
    await f.page.keyboard.press('Escape');
    await noErrors(f);
});

async function openRename(f, row) {
    await row.locator('.jpx-config-more').click();
    const label = await f.page.evaluate(() => __manager.label('rename'));
    await manager(f).locator('.jpx-config-menu').getByRole('button', { name: label, exact: true }).click();
    const dialog = manager(f).getByRole('dialog'); await dialog.waitFor(); return dialog;
}

for (const viewport of [{ width: 1440, height: 960 }, { width: 375, height: 812 }, { width: 812, height: 375 }]) test(`more menu stays hidden until positioned inside ${viewport.width}x${viewport.height}`, async t => {
    const f = await fixture(t, { mobile: viewport.width < 1000 });
    await f.page.setViewportSize(viewport); await settle(f.page);
    const first = nativeRow(f).locator('.jpx-config-more'); await first.scrollIntoViewIfNeeded();
    const bounds = await f.page.locator('#settings-container').boundingBox();
    const early = await first.evaluate(node => {
        node.click();
        const menu = document.querySelector('.jpx-config-menu'), rect = menu.getBoundingClientRect();
        return { hidden: getComputedStyle(menu).visibility === 'hidden', positioned: !!menu.style.top && !!menu.style.left,
            x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    });
    assert.ok(early.hidden || early.positioned, 'the native open must not paint at its unpositioned location: ' + JSON.stringify(early));
    const menu = manager(f).locator('.jpx-config-menu:popover-open'); await menu.waitFor();
    const layout = await menu.evaluate(node => {
        const r = node.getBoundingClientRect(), v = visualViewport;
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, left: v.offsetLeft, top: v.offsetTop,
            viewRight: v.offsetLeft + v.width, viewBottom: v.offsetTop + v.height,
            clipped: node.scrollHeight > node.clientHeight, overflow: getComputedStyle(node).overflowY };
    });
    assert.ok(layout.x >= layout.left && layout.y >= layout.top && layout.right <= layout.viewRight && layout.bottom <= layout.viewBottom, JSON.stringify(layout));
    if (layout.clipped) assert.equal(layout.overflow, 'auto', 'short screens keep every menu item reachable');
    assert.deepEqual(await f.page.locator('#settings-container').boundingBox(), bounds, 'opening the menu cannot move the settings window');
    await f.page.screenshot({ path: path.join(output, `more-menu-${viewport.width}x${viewport.height}.png`) });
    await f.page.keyboard.press('Escape'); await noErrors(f);
});

for (const mobile of [false, true]) test(`more menu toggles and dismisses without reopening, ${mobile ? 'touch' : 'mouse'}`, async t => {
    const f = await fixture(t, { mobile }), original = await nativeSnapshot(f);
    const first = nativeRow(f).locator('.jpx-config-more'), second = nativeRow(f, 'TwoHanded_General').locator('.jpx-config-more');
    const menu = manager(f).locator('.jpx-config-menu:popover-open');
    const activate = node => mobile ? node.tap() : node.click();
    for (let i = 0; i < 2; i++) {
        await activate(first); await menu.waitFor();
        await activate(first); await settle(f.page);
        assert.equal(await menu.count(), 0, 'the second activation closes the menu');
    }
    await activate(first); await second.focus(); await second.press('Enter'); await menu.waitFor();
    assert.equal(await menu.count(), 1, 'switching rows leaves one menu');
    await manager(f).locator('.jpx-config-selection').click(); await settle(f.page);
    assert.equal(await menu.count(), 0, 'outside click dismisses the menu');
    await first.focus(); await first.press('Enter'); await menu.waitFor();
    await f.page.keyboard.press('Escape'); await settle(f.page);
    assert.equal(await menu.count(), 0);
    assert.equal(await first.evaluate(node => node === document.activeElement), true, 'Escape returns focus to the opener');
    await first.press('Space'); await menu.waitFor();
    await first.focus(); await first.press('Space'); await settle(f.page);
    assert.equal(await menu.count(), 0, 'keyboard activation also toggles closed');
    assert.deepEqual(await nativeSnapshot(f), original); await noErrors(f);
});

test('menu rename preserves active rules and list state; blank, unchanged, cancelled and stale names do not overwrite', { timeout: 60000 }, async t => {
    const f = await fixture(t), id = 'native-Persistent-OneHanded_General';
    await nativeRow(f).getByRole('button', { name: f.labels.apply, exact: true }).click();
    const original = await nativeSnapshot(f), before = await savedEntry(f, id);
    const archive = () => f.page.evaluate(() => localStorage.getItem('jpx_configLibrary_v1'));
    const raw = await archive();
    let dialog = await openRename(f, nativeRow(f)), input = dialog.getByRole('textbox');
    assert.deepEqual(await input.evaluate(node => [node === document.activeElement, node.selectionStart, node.selectionEnd]), [true, 0, before.envelope.title.length]);
    await input.fill('   '); await input.press('Enter'); assert.equal(await dialog.isVisible(), true);
    await input.fill('Cancelled'); await input.press('Escape'); assert.equal(await archive(), raw);
    dialog = await openRename(f, nativeRow(f)); await dialog.getByRole('textbox').press('Enter'); assert.equal(await archive(), raw);
    dialog = await openRename(f, nativeRow(f)); input = dialog.getByRole('textbox');
    await input.fill('Daily shield'); await input.press('Enter');
    await f.page.waitForFunction(id => __manager.library().entries.find(entry => entry.id === id).envelope.title === 'Daily shield', id);
    const saved = await savedEntry(f, id);
    assert.deepEqual(saved.envelope.config, before.envelope.config); assert.equal(saved.revision, before.revision + 1);
    assert.equal(await nativeRow(f).getAttribute('data-active'), 'true');
    assert.equal(await nativeRow(f).getByRole('button', { name: f.labels.updateApply, exact: true }).count(), 0);
    assert.equal(await nativeRow(f).locator('.jpx-config-more').evaluate(node => node === document.activeElement), true);
    dialog = await openRename(f, nativeRow(f)); await dialog.getByRole('textbox').fill('Stale rename');
    await f.page.evaluate(id => {
        const data = __manager.library(), entry = data.entries.find(entry => entry.id === id);
        entry.envelope.title = 'Changed elsewhere'; entry.revision++;
        localStorage.setItem('jpx_configLibrary_v1', JSON.stringify(data)); window.dispatchEvent(new Event('jpx:config-library'));
    }, id);
    await dialog.getByRole('textbox').press('Enter');
    assert.equal((await savedEntry(f, id)).envelope.title, 'Changed elsewhere');
    assert.match(await manager(f).locator('.jpx-config-notice').textContent(), /another tab/);
    assert.deepEqual(await nativeSnapshot(f), original);
    await noErrors(f);
});

test('local classifications combine with natural sorting and survive editor navigation', { timeout: 60000 }, async t => {
    const f = await fixture(t), original = await nativeSnapshot(f);
    await f.page.evaluate(() => {
        const state = __manager.library(), base = state.entries[0], rules = base.envelope.config[base.envelope.mode];
        state.entries = [
            ['local-2', 'Build 2', 'Persistent', 'OneHanded_Item', 'battle-mode'],
            ['local-10', 'Build 10', 'Isekai', 'TwoHanded_General', 'battle-mode'],
            ['shared', 'Shared shield', 'Any', 'OneHanded_Item', 'battle-mode'],
            ['all', 'Full battle', 'Persistent', 'OneHanded_Item', 'battle'],
            ['stats', 'Statistics', 'Any', '', 'stats']
        ].map(([id, title, world, mode, kind], i) => ({ id, revision: 1, createdAt: base.createdAt,
            updatedAt: `2026-11-0${i + 1}T00:00:00Z`, envelope: { schemaVersion: 1, title, description: '', world, kind,
                ...(kind === 'battle-mode' ? { mode } : {}), config: kind === 'stats' ? __manager.config().stats : { battleVersion: 20251216, [mode]: rules } } }));
        state.applied = {}; delete state.active;
        localStorage.setItem('jpx_configLibrary_v1', JSON.stringify(state)); window.dispatchEvent(new Event('jpx:config-library'));
    });
    const ids = () => manager(f).locator('.jpx-config-row').evaluateAll(nodes => nodes.map(node => node.dataset.configId));
    const filter = key => manager(f).locator(`[data-config-filter=${key}]`);
    assert.deepEqual(await ids(), ['local-2', 'all', 'shared', 'local-10', 'stats'], 'default order groups actual styles and scenes');
    await manager(f).locator('[data-config-sort]').selectOption('updated');
    assert.deepEqual(await ids(), ['stats', 'all', 'shared', 'local-10', 'local-2']);
    await manager(f).locator('[data-config-sort]').selectOption('name');
    assert.deepEqual(await ids(), ['local-2', 'local-10', 'all', 'shared', 'stats'], 'numeric name order');
    await filter('world').selectOption('Persistent'); await filter('style').selectOption('OneHanded'); await filter('scenario').selectOption('Item');
    assert.deepEqual(await ids(), ['local-2', 'all', 'shared'], 'both-world and full-file rules match their actual groups');
    await filter('world').selectOption('Isekai'); assert.deepEqual(await ids(), ['shared']);
    await filter('kind').selectOption('stats'); assert.deepEqual(await ids(), ['stats']);
    assert.equal(await filter('style').inputValue(), ''); assert.equal(await filter('style').isDisabled(), true);
    assert.equal(await filter('scenario').isDisabled(), true);
    await filter('kind').selectOption('battle-mode'); await filter('world').selectOption('Persistent'); await filter('style').selectOption('OneHanded');
    await manager(f).getByRole('searchbox').fill('Build'); assert.deepEqual(await ids(), ['local-2']);
    await rowByTitle(f, 'Build 2').getByRole('button', { name: f.labels.edit, exact: true }).click();
    await editor(f).getByRole('button', { name: f.labels.back, exact: true }).click();
    assert.deepEqual(await ids(), ['local-2']); assert.equal(await filter('style').inputValue(), 'OneHanded');
    assert.equal(await manager(f).locator('[data-config-sort]').inputValue(), 'name');
    const clearLabel = await f.page.evaluate(() => __manager.label('clearFilters'));
    await manager(f).getByRole('button', { name: clearLabel, exact: true }).click();
    assert.equal((await ids()).length, 5); assert.equal(await manager(f).getByRole('searchbox').inputValue(), '');
    assert.equal(await manager(f).locator('[data-config-sort]').inputValue(), 'name');
    assert.deepEqual(await nativeSnapshot(f), original); await noErrors(f);
});

const configIds = f => manager(f).locator('.jpx-config-row').evaluateAll(rows => rows.map(row => row.dataset.configId));
async function seedTaggedConfigs(f) {
    await f.page.evaluate(() => {
        const state=__manager.library(), base=state.entries[0];
        const rules={ supports: [{ type:'stop',customMessage:'Test rule',conditions:[] }],attacks:[{type:'normalAttack'}] };
        const empty={supports:[],attacks:[]};
        const samples=[
            ['bundle','2H_塔_吸蓝连招','battle','Isekai',{TwoHanded_General:rules,TwoHanded_Tower:rules,Staff_General:empty}],
            ['tower','双手 · 塔楼','battle-mode','Isekai',{TwoHanded_Tower:rules}],
            ['cross','切换套装','battle','Any',{OneHanded_Item:rules,TwoHanded_Tower:rules}],
            ['empty','仅基本设置','battle','Persistent',{Staff_General:empty}],
            ['stats','统计显示','stats','Any',__manager.config().stats]
        ];
        state.entries=samples.map(([id,title,kind,world,config],index)=>({id,revision:1,createdAt:base.createdAt,updatedAt:`2026-11-0${index+1}T00:00:00Z`,
            envelope:{schemaVersion:1,title,description:'',world,kind,...(kind==='battle-mode'?{mode:Object.keys(config)[0]}:{}),
                config:kind==='stats'?config:{battleVersion:20251216,...config}}}));
        state.applied={}; delete state.active;
        localStorage.setItem('jpx_configLibrary_v1',JSON.stringify(state));window.dispatchEvent(new Event('jpx:config-library'));
    });
}

test('tags and filters classify populated groups inside full imports without mixing unrelated style-scene pairs', async t => {
    const f=await fixture(t,{language:'zh'}), original=await nativeSnapshot(f); await seedTaggedConfigs(f);
    const filter=key=>manager(f).locator(`[data-config-filter=${key}]`), bundle=manager(f).locator('[data-config-id=bundle]');
    assert.deepEqual(await bundle.locator('.jpx-config-tag').allTextContents(),['双手','通用','塔楼','2 组规则','异世界']);
    await bundle.getByRole('button',{name:'双手',exact:true}).click();
    assert.deepEqual(await configIds(f),['tower','bundle','cross']);
    await filter('scenario').selectOption('Tower'); assert.deepEqual(await configIds(f),['tower','bundle','cross']);
    await filter('style').selectOption('OneHanded'); assert.deepEqual(await configIds(f),[], 'different groups cannot supply each half of the same filter');
    await filter('scenario').selectOption('Item'); assert.deepEqual(await configIds(f),['cross']);
    await filter('kind').selectOption('battle');
    assert.equal(await filter('style').isEnabled(),true); assert.equal(await filter('style').inputValue(),'OneHanded');
    await filter('style').selectOption('Staff'); await filter('scenario').selectOption(''); assert.deepEqual(await configIds(f),[],'empty default slots do not add tags or false matches');
    await manager(f).getByRole('button',{name:'清除筛选',exact:true}).click();
    await manager(f).getByRole('searchbox').fill('塔楼'); assert.deepEqual(await configIds(f),['tower','bundle','cross']);
    await manager(f).getByRole('searchbox').fill('双手 塔楼 异世界'); assert.deepEqual(await configIds(f),['tower','bundle']);
    assert.deepEqual(await nativeSnapshot(f),original); await noErrors(f);
});

test('the reused drag helper still reorders statistics rows and undoes the change',async t=>{
    const f=await fixture(t);await selectTab(f.page,'stats');await f.page.locator('[data-stats-section=combatRows]').click();
    const rows=f.page.locator('#jpx-stats-combatRows .jpx-stats-row'),before=await f.page.evaluate(()=>__manager.config().stats);
    const start=await rows.first().locator('.jpx-stats-grip').boundingBox(),end=await rows.nth(2).boundingBox();
    await f.page.mouse.move(start.x+10,start.y+10);await f.page.mouse.down();await f.page.mouse.move(end.x+20,end.y+end.height-3,{steps:10});await f.page.mouse.up();
    const after=await f.page.evaluate(()=>__manager.config().stats);assert.equal(after.combatRows[2].id,before.combatRows[0].id);
    await f.page.locator('#undo-settings-button').click();assert.deepEqual(await f.page.evaluate(()=>__manager.config().stats),before);
    await noErrors(f);
});

for (const mobile of [false,true]) test(`manual order supports ${mobile?'touch':'mouse'} dragging and keyboard moves without applying rules`,async t=>{
    const f=await fixture(t,{mobile,language:'zh',dark:mobile}), original=await nativeSnapshot(f);
    await manager(f).locator('[data-config-sort]').selectOption('manual');
    const output=path.join(root,'.test-output/config-tags-order-preview');fs.mkdirSync(output,{recursive:true});
    await f.page.locator('#settings-container').screenshot({path:path.join(output,`manual-${mobile?'mobile-dark':'desktop-light'}.png`)});
    const before=await f.page.evaluate(()=>__manager.library()), ids=await configIds(f);
    const rows=manager(f).locator('.jpx-config-row'), start=await rows.first().locator('.jpx-config-grip').boundingBox(), target=await rows.nth(2).boundingBox();
    if(mobile)assert.ok((await rows.first().boundingBox()).height<=104,'phone rows keep actions beside their content');
    const from={x:start.x+start.width/2,y:start.y+start.height/2}, to={x:target.x+80,y:target.y+target.height-6};
    if(mobile){
        const client=await f.context.newCDPSession(f.page);
        await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});
        for(let step=1;step<=12;step++) await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:from.x+(to.x-from.x)*step/12,y:from.y+(to.y-from.y)*step/12}]});
        assert.ok((await manager(f).locator('.jpx-config-drag-preview').boundingBox()).height<=44,'drag preview is one compact title strip');
        await f.page.locator('#settings-container').screenshot({path:path.join(output,'drag-mobile-dark.png')});
        await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await client.detach();
    }else{
        await f.page.mouse.move(from.x,from.y);await f.page.mouse.down();await f.page.mouse.move(to.x,to.y,{steps:12});
        assert.ok((await manager(f).locator('.jpx-config-drag-preview').boundingBox()).height<=44);
        await f.page.locator('#settings-container').screenshot({path:path.join(output,'drag-desktop-light.png')});await f.page.mouse.up();
    }
    const reordered=[ids[1],ids[2],ids[0],...ids.slice(3)]; assert.deepEqual(await configIds(f),reordered);
    await manager(f).locator(`[data-config-id="${ids[0]}"] .jpx-config-grip`).press('Home'); assert.deepEqual(await configIds(f),ids);
    await manager(f).locator(`[data-config-id="${ids[0]}"] .jpx-config-grip`).press('ArrowDown');
    const final=[ids[1],ids[0],...ids.slice(2)];assert.deepEqual(await configIds(f),final);
    const after=await f.page.evaluate(()=>__manager.library());
    assert.deepEqual(after.entries.map(entry=>entry.id),final);
    assert.deepEqual(after.entries.map(entry=>before.entries.find(old=>old.id===entry.id)),after.entries);
    assert.deepEqual(after.applied,before.applied);assert.deepEqual(after.active,before.active);assert.deepEqual(await nativeSnapshot(f),original);
    await noErrors(f);
});

test('manual subset order preserves hidden positions and survives automatic sorting and reopening Settings',async t=>{
    const f=await fixture(t);await manager(f).locator('[data-config-sort]').selectOption('manual');
    const all=await configIds(f), filter=manager(f).locator('[data-config-filter=style]');await filter.selectOption('OneHanded');
    const visible=await configIds(f), row=manager(f).locator(`[data-config-id="${visible.at(-1)}"]`);
    await row.locator('.jpx-config-more').click();await manager(f).locator('.jpx-config-menu').getByRole('button',{name:'Move to top',exact:true}).click();
    const reordered=[visible.at(-1),...visible.slice(0,-1)];assert.deepEqual(await configIds(f),reordered);
    const hidden=all.filter(id=>!visible.includes(id)), saved=await f.page.evaluate(()=>__manager.library().entries.map(entry=>entry.id));
    for(const id of hidden)assert.equal(saved.indexOf(id),all.indexOf(id));
    await filter.selectOption('');await manager(f).locator('[data-config-sort]').selectOption('name');await manager(f).locator('[data-config-sort]').selectOption('manual');
    assert.deepEqual(await configIds(f),saved);
    await f.page.locator('#close-button').click();
    // Native dialog.close() queues its close event; wait for cleanup before reopening.
    await f.page.locator('#settings-container').waitFor({state:'detached'});
    await f.page.evaluate(()=>__manager.open());await selectTab(f.page,'configManager');
    assert.equal(await manager(f).locator('[data-config-sort]').inputValue(),'manual');assert.deepEqual(await configIds(f),saved);
    await noErrors(f);
});

for (const dark of [false,true]) test(`compact classification tags fit responsive ${dark?'dark':'light'} layouts`,async t=>{
    const f=await fixture(t,{language:'zh',dark});await seedTaggedConfigs(f);
    const output=path.join(root,'.test-output/config-tags-order-preview');fs.mkdirSync(output,{recursive:true});
    for(const width of [1440,1024,768,320]){
        await f.page.setViewportSize({width,height:960});await checkLayout(f);
        const bounds=await manager(f).locator('.jpx-config-tags').evaluateAll(groups=>groups.map(group=>{
            const rect=group.getBoundingClientRect();return {left:rect.left,right:rect.right,tags:[...group.children].map(tag=>{const box=tag.getBoundingClientRect();return {left:box.left,right:box.right};})};
        }));
        assert.ok(bounds.every(group=>group.tags.every(tag=>tag.left>=group.left-1&&tag.right<=group.right+1)),JSON.stringify({width,bounds}));
        if(width===1440||width===320)await f.page.locator('#settings-container').screenshot({path:path.join(output,`${width}-${dark?'dark':'light'}.png`)});
    }
    await noErrors(f);
});

test('rename retains deep list scroll and search without rebuilding the toolbar', { timeout: 45000 }, async t => {
    const f = await fixture(t);
    await f.page.evaluate(() => {
        const data = __manager.library(), source = data.entries[0];
        for (let i = 0; i < 40; i++) data.entries.push({ ...source, id: 'copy-' + i, source: undefined, envelope: { ...source.envelope, title: 'Saved ' + i } });
        localStorage.setItem('jpx_configLibrary_v1', JSON.stringify(data)); window.dispatchEvent(new Event('jpx:config-library'));
    });
    const search = manager(f).getByRole('searchbox'); await search.fill('Saved');
    await manager(f).locator('[data-config-sort]').selectOption('name');
    const row = manager(f).locator('[data-config-id="copy-30"]'); await row.scrollIntoViewIfNeeded();
    const listBody = manager(f).locator('.jpx-config-body'), before = await listBody.evaluate(node => node.scrollTop), searchHandle = await search.elementHandle();
    assert.ok(before > 500);
    const dialog = await openRename(f, row); await dialog.getByRole('textbox').fill('Saved 30 renamed'); await dialog.getByRole('textbox').press('Enter');
    await row.getByText('Saved 30 renamed', { exact: true }).waitFor();
    assert.ok(Math.abs(await listBody.evaluate(node => node.scrollTop) - before) <= 1);
    assert.equal(await searchHandle.evaluate(node => node.isConnected && node.value === 'Saved'), true);
    await noErrors(f);
});

for (const options of [
    { mobile: false, language: 'en', dark: false }, { mobile: false, language: 'zh', dark: true },
    { mobile: true, language: 'zh', dark: false }, { mobile: true, language: 'en', dark: true }
]) {
    const tag = `${options.mobile ? 'mobile' : 'desktop'}-${options.dark ? 'dark' : 'light'}`;
    test(`${tag}: management and editor fit the viewport`, { timeout: 60000 }, async t => {
        const f = await fixture(t, options);
        await checkLayout(f);
        if (f.mobile) {
            const heights = await manager(f).locator('.jpx-config-toolbar button').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
            assert.ok(heights.every(height => height >= 44), 'mobile primary controls have touch-sized targets');
        }
        await f.page.locator('#settings-container').screenshot({ path: path.join(output, tag + '-management.png') });
        if (f.mobile) {
            const toggle = manager(f).locator('.jpx-store-filter-toggle'), filters = manager(f).locator('.jpx-store-filter-grid');
            assert.equal(await filters.isVisible(), false);
            await toggle.click(); await checkLayout(f);
            assert.equal(await filters.isVisible(), true);
            assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
            const heights = await filters.locator('select').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
            assert.ok(heights.every(height => height >= 44));
            await f.page.locator('#settings-container').screenshot({ path: path.join(output, tag + '-local-filters.png') });
            await filters.locator('select').first().focus(); await f.page.keyboard.press('Escape');
            assert.equal(await filters.isVisible(), false); assert.equal(await toggle.evaluate(node => node === document.activeElement), true);
        }
        const rename = await openRename(f, nativeRow(f)); await checkLayout(f);
        await f.page.locator('#settings-container').screenshot({ path: path.join(output, tag + '-rename.png') });
        await rename.getByRole('textbox').press('Escape');
        await openNative(f); await checkLayout(f);
        await editor(f).locator('#jpx-rule-panel-rules .jpx-rule-item > summary').first().click();
        await checkLayout(f);
        await f.page.locator('#settings-container').screenshot({ path: path.join(output, tag + '-editor.png') });
        await noErrors(f);
    });
}

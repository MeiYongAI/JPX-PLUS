'use strict';

// Real configuration-manager interactions in disposable offline contexts.
// Equipment recognition comes from the real DOM reader, never a forced style.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const rules = marker => ({ supports: [{ type: 'stop', customMessage: marker, conditions: [] }], attacks: [{ type: 'normalAttack' }] });
const html = equipment => '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' +
    '<div id="csp"><div id="navbar"></div></div>' + (equipment ? '<div id="eqsb">' +
    '<div class="eqb" onclick="location.href=\'/?equip_slot=1\'"><span>Main</span><span data-eid="123"></span></div>' +
    '<div class="eqb eqdisabled"><div>Off</div><div class="eqempty">...</div></div></div>' : '') + '</body></html>';

function expose() {
    initDoI18n(); loadBattleConfig();
    battleType = 'Arena'; battleStyle = getDetectedJpxBattleStyle();
    const copy = value => JSON.parse(JSON.stringify(value));
    window.__selection = {
        open: renderSettings,
        label: key => t('cM.' + key),
        library: () => getJpxConfigLibrary().readState(),
        get: id => getJpxConfigLibrary().get(id),
        add(envelope) {
            const entry = getJpxConfigLibrary().save(envelope);
            window.dispatchEvent(new Event('jpx:config-library')); return entry;
        },
        oldPlaceholders(entries, missingModes) {
            const stored = JSON.parse(localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix));
            for (const mode of missingModes) delete stored[mode];
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(stored));
            getJpxConfigLibrary().migrate(entries, 'selection-test-old-placeholders');
            window.dispatchEvent(new Event('jpx:config-library'));
        },
        snapshot: () => copy({ config: cfgBattle, stats: cfgStats, mode: getBattleMode(), selected: getJpxSelectedBattleMode(), detected: getDetectedJpxBattleStyle(),
            native: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix) }),
        seed(config) {
            cfgBattle = {}; mergeCfg(copy(config), defaultCfgBattle, cfgBattle, 'battle');
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            refreshJpxSelectedConfig();
        },
        running: () => isActiveBattle,
        resetLobby() {
            log = null; battleStyle = ''; battleType = 'General';
            window.dispatchEvent(new Event('jpx:mode-detected'));
        },
        setBattleType(value) { battleType = value; window.dispatchEvent(new Event('jpx:mode-detected')); },
        externalReplace(mode, data) {
            cfgBattle[mode] = copy(data);
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            refreshJpxSelectedConfig();
            window.dispatchEvent(new Event('jpx:config-library'));
        },
        beginBattle() {
            log = document.createElement('div'); isActiveBattle = true;
            jpxPanelManager.updateContent = () => {};
            jpxPanelManager.setBackground = () => {};
            jpxPanelManager.dispatchState = () => {};
            jpxPanelManager.refreshAppearance = () => {};
        }
    };
}
assert.equal(source.split('\ninitDo();').length, 2, 'main startup anchor is unique');
const harness = source.replace('\ninitDo();', '\n(' + expose.toString() + ')();');
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => { await browser?.close(); });

async function initialize(page, { seed = false, equipment = true } = {}) {
    if (equipment) await page.evaluate(() => { window.dynjs_equip = { '123': { n: '', t: 'Legendary Willow Staff of Destruction' } }; });
    await page.addScriptTag({ content: harness });
    if (seed) await page.evaluate(config => __selection.seed(config), { battleVersion: 20251216,
        OneHanded_General: rules('native single-hand'), OneHanded_Item: rules('native Item'),
        TwoHanded_General: rules('native two-hand'), Staff_General: rules('native staff'), Staff_Arena: rules('native staff arena') });
    await page.evaluate(() => __selection.open());
    await page.locator('#tab_configManager').click();
    await page.locator('.jpx-config-list').waitFor();
}

async function fixture(t, { equipment = true } = {}) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const errors = [], requests = [];
    context.on('page', page => { page.setDefaultTimeout(10000); page.on('pageerror', error => errors.push(error.message)); });
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: html(equipment) });
        if (route.request().method() === 'GET' && /^https:\/\/hentaiverse\.org\/(?:isekai\/)?\?s=Character&ss=(?:ch|eq)$/.test(route.request().url())) return route.fulfill({ status: 503, body: 'Character lookup unavailable in this fixture' });
        requests.push(route.request().url()); return route.abort();
    });
    const page = await context.newPage();
    await page.goto('https://hentaiverse.org/?s=Character');
    await initialize(page, { seed: true, equipment });
    const labels = await page.evaluate(() => Object.fromEntries(['apply', 'edit', 'save', 'updateApply', 'applied', 'currentStyle'].map(key => [key, __selection.label(key)])));
    return { page, context, errors, requests, labels, equipment };
}

const row = (page, id) => page.locator('.jpx-config-row[data-config-id="' + id + '"]');
const snapshot = page => page.evaluate(() => __selection.snapshot());
const library = page => page.evaluate(() => __selection.library());
async function addMode(page, title, mode) {
    return page.evaluate(({ title, mode, data }) => __selection.add({ schemaVersion: 1, kind: 'battle-mode', title, description: '', world: 'Persistent',
        mode, config: { battleVersion: 20251216, [mode]: data } }), { title, mode, data: rules(title) });
}
async function apply(page, entry, labels, confirm = false) {
    const target = row(page, entry.id);
    await target.getByRole('button', { name: labels.apply, exact: true }).click();
    if (confirm) await page.locator('.jpx-config-confirm').getByRole('button', { name: labels.apply, exact: true }).click();
    await target.locator('.jpx-config-status').waitFor();
}
async function assertCurrentBattle(page, expectedId) {
    const state = await library(page);
    assert.equal(state.active.Persistent, expectedId);
    const statsIds = state.entries.filter(entry => entry.envelope.kind === 'stats').map(entry => entry.id);
    const current = await page.locator('.jpx-config-row[data-active="true"]').evaluateAll(nodes => nodes.map(node => node.dataset.configId));
    assert.deepEqual(current.filter(id => !statsIds.includes(id)), [expectedId], 'exactly one battle config carries the current badge');
}
function assertClean(f) { assert.deepEqual(f.errors, []); assert.deepEqual(f.requests, []); }

test('explicit selection wins across detected weapons and scenes, with one current battle badge', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    assert.equal(await page.locator('#eqsb > .eqb.eqdisabled').getAttribute('onclick'), null, 'real Staff offhand is disabled and has no equip_slot link');
    assert.equal((await snapshot(page)).detected, 'Staff', 'equipped Staff is read through the real DOM helper');
    assert.equal((await snapshot(page)).mode, 'Staff_Arena');
    const first = await addMode(page, 'Single-hand Item', 'OneHanded_Item');
    const second = await addMode(page, 'Two-hand general', 'TwoHanded_General');
    await apply(page, first, labels);
    let observed = await snapshot(page), state = await library(page);
    assert.equal(observed.mode, 'OneHanded_Item', 'explicit scene and weapon choice are honored exactly');
    assert.equal(observed.selected, 'OneHanded_Item');
    assert.equal(observed.detected, 'Staff', 'selection does not falsify detected equipment');
    assert.equal(await row(page, 'native-Persistent-Staff_General').locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await row(page, first.id).locator('.jpx-config-detected').count(), 0, 'selected config does not acquire a false detected-style marker');
    assert.equal(state.applied.Persistent[first.id].mode, 'OneHanded_Item');
    await assertCurrentBattle(page, first.id);
    await apply(page, second, labels);
    observed = await snapshot(page); state = await library(page);
    assert.equal(observed.mode, 'TwoHanded_General');
    assert.equal(observed.detected, 'Staff');
    assert.equal(await row(page, 'native-Persistent-Staff_General').locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await row(page, second.id).locator('.jpx-config-detected').count(), 0, 'applying another weapon config cannot move the real current-style marker');
    assert.equal(state.applied.Persistent[second.id].mode, 'TwoHanded_General');
    await assertCurrentBattle(page, second.id);
    assert.equal(await row(page, first.id).locator('.jpx-config-status').count(), 0);
    assertClean(f);
});

test('lobby rows show the real current style and native active group without a top detection label', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    await page.evaluate(() => __selection.resetLobby());
    assert.equal((await snapshot(page)).detected, 'Staff');
    assert.equal((await library(page)).active?.Persistent, undefined, 'lobby has no explicit applied selection');
    const staff = row(page, 'native-Persistent-Staff_General');
    assert.equal(await staff.locator('.jpx-config-detected').textContent(), labels.currentStyle);
    assert.equal(await staff.getAttribute('data-active'), 'true', 'real lobby equipment selects Staff General for its native current badge');
    assert.equal(await page.locator('.jpx-config-row[data-config-id="native-Persistent-Unarmed_General"][data-active="true"]').count(), 0);
    assert.equal(await row(page, 'native-Persistent-OneHanded_General').locator('.jpx-config-detected').count(), 0);
    assert.equal(await page.locator('.jpx-config-toolbar .jpx-config-detected, .jpx-config-detection').count(), 0, 'detection belongs only beside matching row styles');
    await staff.scrollIntoViewIfNeeded();
    const output = path.join(root, '.test-output/config-management');
    fs.mkdirSync(output, { recursive: true });
    await page.locator('#settings-container').screenshot({ path: path.join(output, 'current-style-list.png') });
    const examples = await page.evaluate(data => ['Persistent', 'Isekai', 'Any'].map(world => __selection.add({ schemaVersion: 1,
        kind: 'battle-mode', title: 'Staff in ' + world, description: '', world, mode: 'Staff_General',
        config: { battleVersion: 20251216, Staff_General: data } })), rules('world marker'));
    for (const entry of examples) {
        assert.equal(await row(page, entry.id).locator('.jpx-config-detected').count(), entry.envelope.world === 'Isekai' ? 0 : 1,
            'current-style marker is restricted to the current world or both worlds');
    }
    assertClean(f);
});

test('old untouched native placeholders stay hidden while saved empty drafts and edited native copies remain', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page } = f;
    const empty = { supports: [], attacks: [] };
    const makeEntry = (id, mode, config, revision = 1) => ({ id, revision, source: { type: 'native' }, envelope: {
        schemaVersion: 1, kind: 'battle-mode', title: id, description: '', world: 'Persistent', mode,
        config: { battleVersion: 20251216, [mode]: config }
    } });
    const old = [
        makeEntry('old-empty-native', 'OneHanded_Tower', empty),
        makeEntry('old-missing-native', 'DualWielding_Tower', rules('Old generated defaults')),
        makeEntry('old-edited-native', 'TwoHanded_Tower', empty, 2)
    ];
    await page.evaluate(entries => __selection.oldPlaceholders(entries, ['DualWielding_Tower', 'TwoHanded_Tower']), old);
    const manual = await page.evaluate(data => __selection.add({ schemaVersion: 1, kind: 'battle-mode', title: 'My empty draft', description: '',
        world: 'Persistent', mode: 'Staff_Tower', config: { battleVersion: 20251216, Staff_Tower: data } }), empty);
    assert.equal(await row(page, 'old-empty-native').count(), 0, 'untouched generated empty slot is hidden');
    assert.equal(await row(page, 'old-missing-native').count(), 0, 'generated slot absent from actual native storage is hidden');
    assert.equal(await row(page, 'old-edited-native').count(), 1, 'editing makes even an empty native copy intentional');
    assert.equal(await row(page, manual.id).count(), 1, 'a deliberately saved empty draft remains available');
    const beforeNavigation = await library(page);
    for (const original of old) {
        const stored = beforeNavigation.entries.find(entry => entry.id === original.id);
        assert.deepEqual(stored.envelope, original.envelope, 'hidden placeholders are retained without data loss');
        assert.equal(stored.revision, original.revision);
    }
    await page.locator('#tab_stats').click(); await page.locator('#tab_configManager').click();
    assert.equal(await row(page, 'old-empty-native').count(), 0);
    assert.equal(await row(page, 'old-missing-native').count(), 0);
    assert.equal(await row(page, 'old-edited-native').count(), 1);
    assert.equal(await row(page, manual.id).count(), 1);
    assert.deepEqual(await library(page), beforeNavigation, 'rendering and navigation do not rewrite stored entries');
    assertClean(f);
});

test('unknown detection stays honest while an explicit selected mode survives a reload', { timeout: 45000 }, async t => {
    const f = await fixture(t, { equipment: false }), { page, labels } = f;
    assert.equal((await snapshot(page)).detected, '');
    assert.equal(await page.locator('.jpx-config-detected, .jpx-config-detection').count(), 0, 'no evidence means no current-style marker');
    const entry = await addMode(page, 'Persistent selected Item', 'OneHanded_Item');
    await apply(page, entry, labels);
    assert.equal((await snapshot(page)).mode, 'OneHanded_Item');
    await page.reload();
    await initialize(page, { equipment: false });
    const observed = await snapshot(page);
    assert.equal(observed.detected, '');
    assert.equal(observed.mode, 'OneHanded_Item');
    assert.equal(observed.selected, 'OneHanded_Item');
    assert.equal(await page.locator('.jpx-config-detected, .jpx-config-detection').count(), 0);
    await assertCurrentBattle(page, entry.id);
    assertClean(f);
});

test('an invalidated applied snapshot falls back to detected rules and does not suppress their current badge', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    await page.evaluate(() => __selection.setBattleType('General'));
    const entry = await addMode(page, 'Selected single hand', 'OneHanded_General');
    await apply(page, entry, labels);
    const appliedBefore = (await library(page)).applied.Persistent[entry.id];
    assert.equal((await snapshot(page)).mode, 'OneHanded_General');
    await page.evaluate(({ mode, data }) => __selection.externalReplace(mode, data), { mode: 'OneHanded_General', data: rules('External native change') });
    const observed = await snapshot(page), state = await library(page);
    assert.equal(observed.detected, 'Staff');
    assert.equal(observed.selected, '', 'an applied snapshot which no longer matches native rules cannot stay selected');
    assert.equal(observed.mode, 'Staff_General');
    assert.deepEqual(state.applied.Persistent[entry.id], appliedBefore, 'mismatch handling does not rewrite the historical applied snapshot');
    assert.equal(await row(page, entry.id).getAttribute('data-active'), 'false');
    assert.equal(await row(page, 'native-Persistent-Staff_General').getAttribute('data-active'), 'true');
    const current = await page.locator('.jpx-config-row[data-active="true"]').evaluateAll(nodes => nodes.map(node => node.dataset.configId));
    assert.deepEqual(current, ['native-Persistent-Staff_General'], 'stale active selection cannot hide the still-matching native fallback');
    assertClean(f);
});

test('whole battle packages restore native selection and statistics have an independent active slot', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const single = await addMode(page, 'Single Item', 'OneHanded_Item');
    await apply(page, single, labels);
    const whole = await page.evaluate(config => __selection.add({ schemaVersion: 1, kind: 'battle', title: 'All battle groups', description: '',
        world: 'Persistent', config }), { battleVersion: 20251216, Staff_General: rules('package staff'), Staff_Arena: rules('package arena'), OneHanded_Item: rules('package item') });
    await apply(page, whole, labels, true);
    let observed = await snapshot(page), state = await library(page);
    assert.equal(observed.selected, '');
    assert.equal(observed.mode, 'Staff_Arena', 'whole package uses actual Staff and Arena evidence');
    assert.equal(Object.hasOwn(state.applied.Persistent[whole.id], 'mode'), false);
    await assertCurrentBattle(page, whole.id);
    const selectedBeforeStats = state.active.Persistent;
    const stats = await page.evaluate(() => __selection.add({ schemaVersion: 1, kind: 'stats', title: 'Stats only', description: '', world: 'Any',
        config: { statsVersion: 20260109, statsColumns: [{ id: 'date', customName: 'Selected date' }] } }));
    const battleBeforeStats = observed.config;
    await apply(page, stats, labels, true);
    observed = await snapshot(page); state = await library(page);
    assert.equal(state.active.Any, stats.id);
    assert.equal(state.active.Persistent, selectedBeforeStats);
    assert.equal(observed.mode, 'Staff_Arena');
    assert.deepEqual(observed.config, battleBeforeStats);
    await assertCurrentBattle(page, whole.id);
    assertClean(f);
});

test('saving an active draft retains its applied snapshot until Update & apply is clicked', { timeout: 45000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const entry = await addMode(page, 'Editable current', 'OneHanded_Item');
    await apply(page, entry, labels);
    const before = await snapshot(page), previous = await library(page);
    await row(page, entry.id).getByRole('button', { name: labels.edit, exact: true }).click();
    const editor = page.locator('.jpx-config-editor');
    await editor.locator('#jpx-rule-panel-supports .jpx-rule-state-toggle').first().click();
    await editor.locator('.jpx-config-editor-footer').getByRole('button', { name: labels.save, exact: true }).click();
    await row(page, entry.id).getByRole('button', { name: labels.updateApply, exact: true }).waitFor();
    const state = await library(page), saved = state.entries.find(item => item.id === entry.id);
    assert.equal(saved.revision, entry.revision + 1);
    assert.equal(saved.envelope.config.OneHanded_Item.supports[0].disabled, true);
    assert.deepEqual(state.applied.Persistent[entry.id], previous.applied.Persistent[entry.id]);
    assert.deepEqual(await snapshot(page), before, 'saving never mutates the runtime or native storage');
    await assertCurrentBattle(page, entry.id);
    await row(page, entry.id).getByRole('button', { name: labels.updateApply, exact: true }).click();
    await page.waitForFunction(id => __selection.library().applied.Persistent[id].revision === __selection.get(id).revision, entry.id);
    assert.equal((await snapshot(page)).config.OneHanded_Item.supports[0].disabled, true);
    assert.equal((await snapshot(page)).mode, 'OneHanded_Item');
    await assertCurrentBattle(page, entry.id);
    assertClean(f);
});

test('another tab changes the exact selected mode and pauses a running battle before it is used', { timeout: 45000 }, async t => {
    const f = await fixture(t, { equipment: false }), { page: battlePage, context, labels } = f;
    await battlePage.evaluate(() => __selection.beginBattle());
    assert.equal(await battlePage.evaluate(() => __selection.running()), true);
    assert.equal((await snapshot(battlePage)).detected, '');
    const settingsPage = await context.newPage();
    await settingsPage.goto('https://hentaiverse.org/?s=Character');
    await initialize(settingsPage, { equipment: false });
    const entry = await addMode(settingsPage, 'From another tab', 'TwoHanded_Item');
    await apply(settingsPage, entry, labels);
    await battlePage.waitForFunction(() => __selection.snapshot().selected === 'TwoHanded_Item' && !__selection.running());
    const observed = await snapshot(battlePage);
    assert.equal(observed.mode, 'TwoHanded_Item');
    assert.equal(observed.detected, '');
    assert.equal(observed.config.TwoHanded_Item.supports[0].customMessage, 'From another tab');
    await assertCurrentBattle(battlePage, entry.id);
    assertClean(f);
});

test('success notices expire after four seconds, replace cleanly, clear on navigation and preserve scroll', { timeout: 60000 }, async t => {
    const f = await fixture(t), { page, labels } = f;
    const addFilledRows = group => page.evaluate(({ group, data }) => {
        for (let i = 0; i < 12; i++) __selection.add({ schemaVersion: 1, kind: 'battle-mode', title: 'Timer ' + group + ' ' + i,
            description: '', world: 'Persistent', mode: 'Staff_General', config: { battleVersion: 20251216, Staff_General: data } });
    }, { group, data: rules('Saved list content') });
    await addFilledRows('before');
    const first = await addMode(page, 'Timer first', 'OneHanded_Item');
    const second = await addMode(page, 'Timer second', 'TwoHanded_General');
    await addFilledRows('after');
    await page.locator('.jpx-config-toolbar input[type=search]').fill('Timer');
    await page.locator('[data-config-sort]').selectOption('manual');
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    const notice = page.locator('.jpx-config-notice');
    await apply(page, first, labels);
    assert.equal(await notice.textContent(), labels.applied);
    await page.clock.runFor(3999);
    assert.equal(await notice.textContent(), labels.applied);
    await page.clock.runFor(1);
    assert.equal(await notice.textContent(), '');

    await apply(page, second, labels);
    await page.clock.runFor(2500);
    await apply(page, first, labels);
    await page.clock.runFor(1501);
    assert.equal(await notice.textContent(), labels.applied, 'replacement cancels the previous timeout');
    await page.clock.runFor(2499);
    assert.equal(await notice.textContent(), '');

    await apply(page, second, labels);
    await page.locator('#tab_stats').click();
    assert.equal(await notice.textContent(), '');
    await page.locator('#tab_configManager').click();
    assert.equal(await notice.textContent(), '');
    await page.clock.runFor(5000);

    const target = row(page, first.id);
    await target.scrollIntoViewIfNeeded();
    // Put the chosen entry inside a non-edge scroll position before measuring.
    const before = await page.locator('.jpx-config-body').evaluate(node => {
        node.scrollTop = Math.max(0, node.scrollTop - 80);
        const rect = node.getBoundingClientRect();
        return { top: node.scrollTop, height: node.clientHeight, rectTop: rect.top, rectHeight: rect.height };
    });
    assert.ok(before.top > 0, 'explicitly saved configs create a genuinely scrollable list');
    await apply(page, first, labels);
    await page.clock.runFor(32);
    let after = await page.locator('.jpx-config-body').evaluate(node => ({ top: node.scrollTop, height: node.clientHeight, rectTop: node.getBoundingClientRect().top, rectHeight: node.getBoundingClientRect().height }));
    assert.deepEqual(after, before, 'showing a notice neither moves nor resizes the list');
    await page.clock.runFor(4000);
    after = await page.locator('.jpx-config-body').evaluate(node => ({ top: node.scrollTop, height: node.clientHeight, rectTop: node.getBoundingClientRect().top, rectHeight: node.getBoundingClientRect().height }));
    assert.deepEqual(after, before, 'removing a notice neither moves nor resizes the list');
    assert.equal(await notice.textContent(), '');
    assertClean(f);
});

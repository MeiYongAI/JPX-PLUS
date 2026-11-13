'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture, envelope, mainHTML } = require('./fixtures/battle-import.cjs');
const { normalized } = require('./fixtures/battle-import.cjs');
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
const snapshot = page => page.evaluate(() => __imports.snapshot());
const rawConfig = () => ({ battleVersion: 20251216, TwoHanded_General: envelope().config.OneHanded_Item });
function substantiveConfig(config) {
    // Visiting an unused mode materializes empty lists. Undo deliberately
    // removes those placeholders, without changing any configured rules.
    return Object.fromEntries(Object.entries(config).filter(([, value]) =>
        !value || typeof value !== 'object' || Array.isArray(value) ||
        !Object.entries(value).every(([key, rows]) =>
            ['rules', 'supports', 'attacks'].includes(key) && Array.isArray(rows) && rows.length === 0)));
}
async function direct(page, value) {
    const chooser = page.waitForEvent('filechooser'); await page.locator('#import-button').click();
    await (await chooser).setFiles({ name: 'Direct.json', mimeType: 'application/json', buffer: Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)) });
}
async function done(page) { await page.waitForFunction(() => document.getElementById('import-button').disabled); }
async function setup(t, options = {}) {
    const result = await fixture(browser, t, { status: 'running', ...options });
    await result.page.locator('#tab_battle').click(); return result;
}

for (const isekai of [false, true]) test('direct battle import pauses before using new rules and persists only on Save, ' + isekai, async t => {
    const { page } = await setup(t, { isekai }); const before = await snapshot(page), config = rawConfig();
    await direct(page, config); await done(page);
    const after = await snapshot(page);
    assert.equal(after.active, false); assert.equal(after.attacks, before.attacks);
    assert.deepEqual(after.config.TwoHanded_General, normalized(config).TwoHanded_General);
    assert.equal(after.native, before.native, 'direct import remains an unsaved edit');
    assert.equal(after.library, before.library);
    const feedback = page.locator('.jpx-settings-window > .jpx-import-feedback');
    assert.match(await feedback.textContent(), /Imported.*Direct.json.*Not saved yet/s);
    assert.match(await feedback.textContent(), /Auto-battle is paused/);
    assert.equal(await feedback.locator('p').getAttribute('role'), 'status');
    await page.locator('#save-button').click();
    assert.deepEqual(JSON.parse((await snapshot(page)).native).TwoHanded_General, normalized(config).TwoHanded_General);
    assert.equal(await feedback.locator('p').textContent(), 'Saved.');
});

for (const [name, data] of [
    ['malformed rule after valid mode', { battleVersion: 20251216, OneHanded_General: envelope().config.OneHanded_Item, TwoHanded_General: { supports: [null], attacks: [] } }],
    ['invalid version', { ...rawConfig(), battleVersion: 1 }],
    ['null root', null], ['array root', []],
    ['prototype key', '{"battleVersion":20251216,"__proto__":{"polluted":true}}'],
    ['oversized file', Buffer.alloc(2 * 1024 * 1024 + 1, 32)]
]) test('direct import rejects ' + name + ' without partial runtime mutation', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    await direct(page, data); await done(page);
    assert.deepEqual(await snapshot(page), before);
    assert.match(await page.locator('#import-button').textContent(), /fail/i);
    assert.match(await page.locator('.jpx-settings-window > .jpx-import-feedback').textContent(), /Import not completed.*Direct.json/s);
    assert.equal(await page.locator('.jpx-settings-window > .jpx-import-feedback p').getAttribute('role'), 'alert');
});

test('direct import ignores a file that finishes after changing settings tabs', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    await page.evaluate(() => __imports.hold()); await direct(page, rawConfig());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.locator('#tab_configManager').click(); await page.evaluate(() => __imports.release());
    await page.waitForTimeout(60); assert.deepEqual(await snapshot(page), before);
});

test('direct import keeps the newer selection when file reads finish out of order', async t => {
    const { page } = await setup(t);
    await page.evaluate(() => __imports.hold()); await direct(page, rawConfig());
    await page.waitForFunction(() => __imports.pending() === 1);
    const newer = rawConfig(); newer.TwoHanded_General.supports[0].customMessage = 'Newer direct file';
    await direct(page, newer); await page.waitForFunction(() => __imports.pending() === 2);
    await page.evaluate(() => __imports.release(1)); await done(page);
    await page.evaluate(() => __imports.release()); await page.waitForTimeout(60);
    assert.equal((await snapshot(page)).config.TwoHanded_General.rules[0].customMessage, 'Newer direct file');
});

test('rejecting custom code in direct import leaves active rules intact', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    const config = rawConfig(); config.TwoHanded_General.supports = [{ type: 'kamisamaniNattaHi', code: 'window.__directCodeRan=true;return true;' }];
    page.once('dialog', dialog => dialog.dismiss());
    await direct(page, config); await done(page);
    assert.deepEqual(await snapshot(page), before); assert.equal(await page.evaluate(() => window.__directCodeRan), undefined);
});

test('direct statistics import remains separate from battle rules and running state', async t => {
    const { page } = await setup(t); await page.locator('#tab_stats').click();
    const before = await snapshot(page), config = await page.evaluate(() => __imports.defaults());
    config.statsColumns[0].customName = 'Imported date';
    await direct(page, config); await done(page);
    const after = await snapshot(page);
    assert.deepEqual(after.config, before.config); assert.equal(after.active, true); assert.equal(after.native, before.native);
    assert.equal(after.stats.statsColumns[0].customName, 'Imported date'); assert.equal(after.storedStats, before.storedStats);
});

test('direct import remains undoable and redoable without restarting battle', async t => {
    const { page } = await setup(t); const before = await snapshot(page), config = rawConfig();
    await direct(page, config); await done(page);
    await page.locator('#settings-container').focus(); await page.keyboard.press('Control+z');
    const undone = await snapshot(page);
    assert.deepEqual(substantiveConfig(undone.config), substantiveConfig(before.config));
    assert.equal(undone.active, false); assert.equal(undone.native, before.native);
    await page.keyboard.press('Control+y');
    assert.deepEqual((await snapshot(page)).config.TwoHanded_General, normalized(config).TwoHanded_General);
    assert.equal((await snapshot(page)).active, false); assert.equal((await snapshot(page)).native, before.native);
});

test('direct import does not revive after leaving and returning to the same tab', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    await page.evaluate(() => __imports.hold()); await direct(page, rawConfig());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.locator('#tab_configManager').click(); await page.locator('#tab_battle').click();
    await page.evaluate(() => __imports.release()); await page.waitForTimeout(60);
    assert.deepEqual(await snapshot(page), before);
});

test('closing settings discards a pending direct import without changing combat', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    await page.evaluate(() => __imports.hold()); await direct(page, rawConfig());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.evaluate(() => document.getElementById('settings-container').close());
    await page.locator('#settings-container').waitFor({ state: 'detached' });
    await page.evaluate(() => __imports.release()); await page.waitForTimeout(60);
    assert.deepEqual(await snapshot(page), before);
});

test('direct import still accepts legacy version aliases and spell migration', async t => {
    const { page } = await setup(t); const config = rawConfig();
    config.version = config.battleVersion; delete config.battleVersion;
    config.TwoHanded_General.supports = [{ type: 'spellInstant', name: 'Cure', conditions: [] }];
    await direct(page, config); await done(page);
    const state = await snapshot(page);
    assert.equal(state.config.TwoHanded_General.rules[0].type, 'spellSupport');
    assert.equal(state.active, false);
});

for (const status of ['lobby', 'paused', 'stop', 'between', 'puzzle', 'finished']) test('direct import in ' + status + ' state does not trigger a battle action', async t => {
    const { page } = await setup(t, { status }); const before = await snapshot(page), config = rawConfig();
    await direct(page, config); await done(page);
    const after = await snapshot(page);
    assert.equal(after.active, false); assert.equal(after.attacks, before.attacks);
    assert.deepEqual(after.config.TwoHanded_General, normalized(config).TwoHanded_General);
    assert.equal(after.native, before.native);
});

for (const fallback of [false, true]) test('pending direct import across AJAX ' + (fallback ? 'body fallback is discarded' : 'normal replacement applies and pauses'), async t => {
    const { page } = await setup(t); const before = await snapshot(page), config = rawConfig();
    await page.evaluate(() => __imports.hold()); await direct(page, config);
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.evaluate(({ main, fallback }) => __imports.next(main, fallback), { main: mainHTML(5), fallback });
    await page.evaluate(() => __imports.release());
    if (!fallback) await done(page); else await page.waitForTimeout(80);
    const after = await snapshot(page);
    assert.deepEqual(after.config.TwoHanded_General, fallback ? before.config.TwoHanded_General : normalized(config).TwoHanded_General);
    assert.equal(after.native, before.native);
    if (!fallback) assert.equal(after.active, false);
});

test('cancelled direct file selection leaves history and combat unchanged', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    const chooser = page.waitForEvent('filechooser'); await page.locator('#import-button').click();
    await (await chooser).setFiles([]); await page.waitForTimeout(60);
    assert.deepEqual(await snapshot(page), before);
    assert.equal(await page.locator('#undo-settings-button').isDisabled(), true);
    assert.equal(await page.locator('#import-button').isDisabled(), false);
    await direct(page, rawConfig()); await done(page);
    assert.equal((await snapshot(page)).active, false);
});

test('failed direct file reading preserves runtime and leaves no undo entry', async t => {
    const { page } = await setup(t); const before = await snapshot(page);
    await page.evaluate(() => { File.prototype.text = () => Promise.reject(new Error('Fixture file read failure')); });
    await direct(page, rawConfig()); await done(page);
    assert.deepEqual(await snapshot(page), before);
    assert.equal(await page.locator('#undo-settings-button').isDisabled(), true);
    assert.match(await page.locator('#import-button').textContent(), /fail/i);
});

test('invalid statistics rows cannot partially replace direct-import settings', async t => {
    const { page } = await setup(t); await page.locator('#tab_stats').click();
    const before = await snapshot(page), config = await page.evaluate(() => __imports.defaults());
    config.combatRows[0].customName = 'Must not apply'; config.statsColumns.push(null);
    await direct(page, config); await done(page);
    assert.deepEqual(await snapshot(page), before);
    assert.match(await page.locator('#import-button').textContent(), /fail/i);
});

for (const version of [undefined, 1, 'invalid']) test('direct statistics import rejects unsupported version ' + version, async t => {
    const { page } = await setup(t); await page.locator('#tab_stats').click();
    const before = await snapshot(page), config = await page.evaluate(() => __imports.defaults());
    config.statsVersion = version; config.statsColumns[0].customName = 'Invalid version';
    await direct(page, config); await done(page);
    assert.deepEqual(await snapshot(page), before);
    assert.match(await page.locator('#import-button').textContent(), /fail/i);
});

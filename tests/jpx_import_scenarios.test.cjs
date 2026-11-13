'use strict';
// Offline real import UI; synthetic battle only, all network intercepted.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture, envelope, choose, save, row, mainHTML } = require('./fixtures/battle-import.cjs');
const { normalized } = require('./fixtures/battle-import.cjs');
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
const snapshot = page => page.evaluate(() => __imports.snapshot());
const wait = page => page.waitForTimeout(60);
async function imported(page, value = envelope()) {
    await choose(page, value); await save(page);
    return page.evaluate(title => __imports.library().entries.find(entry => entry.envelope.title === title), value.title);
}
const runtime = value => ({ config: value.config, native: value.native, active: value.active, ready: value.ready, mode: value.mode,
    stats: value.stats, storedStats: value.storedStats, otherWorld: value.otherWorld, attacks: value.attacks });

for (const isekai of [false, true]) for (const status of ['lobby', 'running', 'paused', 'stop', 'between', 'puzzle', 'finished']) {
    test('import and save leave ' + status + ' state intact in ' + (isekai ? 'Isekai' : 'Persistent'), async t => {
        const { page } = await fixture(browser, t, { status, isekai });
        const before = await snapshot(page), world = isekai ? 'Isekai' : 'Persistent';
        const value = envelope('Import case', world);
        await choose(page, value);
        await page.locator('.jpx-config-form').waitFor();
        assert.match(await page.locator('.jpx-config-manager .jpx-import-feedback').textContent(), /File validated.*Nothing has been saved or applied yet/s);
        assert.deepEqual(await snapshot(page), before, 'reading and validating file makes no persistent or running changes');
        await save(page);
        const after = await snapshot(page);
        assert.deepEqual(runtime(after), runtime(before));
        const saved = await page.evaluate(() => __imports.library().entries.find(entry => entry.envelope.title === 'Import case'));
        assert.deepEqual(saved.envelope.config, normalized(value).config);
        assert.equal(saved.envelope.world, world);
        assert.match(await page.locator('.jpx-config-manager .jpx-import-feedback').textContent(), /Imported.*Import case.*My configs.*Not applied yet/s);
    });
}

for (const [name, value] of [
    ['empty file', ''], ['broken JSON', '{bad'], ['null root', 'null'], ['array root', '[]'],
    ['broken rules', { ...envelope(), config: { battleVersion: 20251216, OneHanded_Item: { supports: {}, attacks: [] } } }],
    ['unsupported version', { ...envelope(), config: { battleVersion: 1, OneHanded_Item: envelope().config.OneHanded_Item } }],
    ['prototype property', '{"__proto__":{"polluted":true}}'], ['oversized file', Buffer.alloc(2 * 1024 * 1024 + 1, 32)]
]) test('reject ' + name + ' without disturbing a running battle', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const before = await snapshot(page);
    await choose(page, value);
    await page.locator('.jpx-config-manager .jpx-import-feedback[data-stage=error]').waitFor();
    assert.equal(await page.locator('.jpx-config-form').count(), 0);
    assert.deepEqual(await snapshot(page), before);
    assert.equal(await page.evaluate(() => ({}).polluted), undefined);
});

test('UTF-8 BOM text exports import without losing their native configuration', async t => {
    const { page } = await fixture(browser, t);
    const value = envelope();
    await choose(page, Buffer.from('\ufeff' + JSON.stringify(value)), 'Windows export.txt');
    await save(page);
    const saved = await page.evaluate(() => __imports.library().entries.find(entry => entry.envelope.title === 'Import case'));
    assert.deepEqual(saved.envelope, normalized(value));
});

test('cancelling the name form or the whole-config application preserves runtime and storage', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const before = await snapshot(page);
    await choose(page, envelope());
    await page.locator('.jpx-config-form').getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.deepEqual(await snapshot(page), before);
    const value = envelope(); value.kind = 'battle'; delete value.mode;
    await imported(page, value); const saved = await snapshot(page);
    await row(page, 'Import case').getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.deepEqual(await snapshot(page), saved);
});

test('saving after a quota failure can retry without duplicate entries', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const before = await snapshot(page);
    await choose(page, envelope());
    await page.evaluate(() => __imports.deny('jpx_configLibrary_v1'));
    await save(page); await page.locator('.jpx-config-manager .jpx-import-feedback[data-stage=error]').waitFor();
    assert.deepEqual(await snapshot(page), before);
    assert.equal(await page.locator('.jpx-config-form').count(), 1);
    await save(page);
    assert.equal(await page.evaluate(() => __imports.library().entries.filter(entry => entry.envelope.title === 'Import case').length), 1);
});

for (const key of ['jpx_cfgBattle', 'jpx_configLibrary_v1', 'jpx_configApplySignal_v1']) test('failed apply at ' + key + ' rolls back configuration and stays paused', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    await imported(page); const before = await snapshot(page);
    await page.evaluate(key => __imports.deny(key), key);
    await row(page, 'Import case').getByRole('button', { name: 'Apply', exact: true }).click();
    const after = await snapshot(page);
    assert.deepEqual(after.config, before.config); assert.equal(after.native, before.native); assert.equal(after.library, before.library);
    assert.equal(after.active, false); assert.equal(after.attacks, before.attacks);
});

test('corrupt library encountered after file read is preserved on save failure', async t => {
    const { page } = await fixture(browser, t);
    await choose(page, envelope()); await page.locator('.jpx-config-form').waitFor();
    await page.evaluate(() => __imports.damageLibrary()); const before = await snapshot(page);
    await save(page); assert.deepEqual(await snapshot(page), before);
    assert.equal((await snapshot(page)).library, '{broken');
});

test('delayed import cannot replace a newer file selection', async t => {
    const { page } = await fixture(browser, t);
    await page.evaluate(() => __imports.hold());
    await choose(page, envelope('Older file')); await page.waitForFunction(() => __imports.pending() === 1);
    await choose(page, envelope('Newer file')); await page.waitForFunction(() => __imports.pending() === 2);
    await page.evaluate(() => __imports.release(1)); await page.locator('.jpx-config-form').waitFor();
    await page.evaluate(() => __imports.release()); await wait(page);
    assert.equal(await page.locator('.jpx-config-form input[type=text]').inputValue(), 'Newer file');
    await save(page);
    assert.equal(await row(page, 'Older file').count(), 0);
});

test('leaving the manager cancels a delayed import instead of replacing the returned list', async t => {
    const { page } = await fixture(browser, t);
    const before = await snapshot(page);
    await page.evaluate(() => __imports.hold()); await choose(page, envelope());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.locator('#tab_stats').click(); await page.evaluate(() => __imports.release()); await wait(page);
    await page.locator('#tab_configManager').click();
    assert.equal(await page.locator('.jpx-config-form').count(), 0);
    assert.equal(await page.locator('.jpx-config-list').count(), 1);
    assert.deepEqual(await snapshot(page), before);
});

for (const fallback of [false, true]) test('pending import during AJAX ' + (fallback ? 'body replacement' : 'round replacement') + ' cannot alter battle state', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    await page.evaluate(() => __imports.hold()); await choose(page, envelope());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.evaluate(({ main, fallback }) => __imports.next(main, fallback), { main: mainHTML(), fallback });
    const before = await snapshot(page);
    await page.evaluate(() => __imports.release()); await wait(page);
    assert.deepEqual(await snapshot(page), before);
    if (!fallback) { await save(page); assert.equal((await snapshot(page)).active, false); }
    else assert.equal(await page.locator('#settings-container').count(), 0);
});

test('closing settings during file read cannot affect reopened settings', async t => {
    const { page } = await fixture(browser, t);
    await page.evaluate(() => __imports.hold()); await choose(page, envelope());
    await page.waitForFunction(() => __imports.pending() === 1);
    await page.evaluate(() => document.getElementById('settings-container').close()); await page.locator('#settings-container').waitFor({ state: 'detached' });
    await page.evaluate(() => __imports.open()); await page.locator('#tab_configManager').click();
    const before = await snapshot(page); await page.evaluate(() => __imports.release()); await wait(page);
    assert.equal(await page.locator('.jpx-config-form').count(), 0); assert.deepEqual(await snapshot(page), before);
});

for (const isekai of [false, true]) test('applying an imported opposite-world config does not pause or alter this battle, ' + isekai, async t => {
    const { page } = await fixture(browser, t, { status: 'running', isekai });
    const value = envelope('Other world', isekai ? 'Persistent' : 'Isekai');
    await imported(page, value); const before = await snapshot(page);
    await row(page, 'Other world').getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Apply', exact: true }).click();
    const after = await snapshot(page);
    assert.deepEqual(after.config, before.config); assert.equal(after.native, before.native); assert.equal(after.active, true);
    assert.equal(after.attacks, before.attacks);
    assert.deepEqual(JSON.parse(after.otherWorld).OneHanded_Item, normalized(value).config.OneHanded_Item);
});

test('world-independent import waits for explicit destination and applies to the chosen world', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const value = envelope('Choose world', 'Any');
    await imported(page, value); const before = await snapshot(page);
    await row(page, 'Choose world').getByRole('button', { name: 'Apply', exact: true }).click();
    assert.deepEqual(await snapshot(page), before);
    await page.locator('.jpx-config-confirm select').selectOption('Isekai');
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Apply', exact: true }).click();
    const after = await snapshot(page);
    assert.equal(after.active, true); assert.deepEqual(after.config, before.config);
    assert.deepEqual(JSON.parse(after.otherWorld).OneHanded_Item, normalized(value).config.OneHanded_Item);
});

test('statistics-only import and application do not alter running battle rules', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const config = await page.evaluate(() => __imports.defaults());
    const value = { schemaVersion: 1, kind: 'stats', title: 'Statistics import', description: '', world: 'Any', config };
    await imported(page, value); const before = await snapshot(page);
    await row(page, value.title).getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Apply', exact: true }).click();
    const after = await snapshot(page);
    assert.deepEqual(after.config, before.config); assert.equal(after.native, before.native); assert.equal(after.active, true);
    assert.deepEqual(JSON.parse(after.storedStats), after.stats);
    for (const key of ['combatRows', 'revenueRows', 'statsColumns']) {
        assert.deepEqual(after.stats[key].slice(0, config[key].length), config[key], 'preserve every imported row');
        assert.ok(after.stats[key].slice(config[key].length).every(item => item.disabled), 'schema backfills only disabled fields');
    }
});

test('custom code remains inert during import, save, and cancelled application', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const value = envelope('Code import');
    value.config.OneHanded_Item.supports = [{ type: 'kamisamaniNattaHi', code: 'window.__importCodeExecuted = true; return true;' }];
    await imported(page, value); const before = await snapshot(page);
    assert.equal(await page.evaluate(() => window.__importCodeExecuted), undefined);
    await row(page, value.title).getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.jpx-config-confirm').waitFor();
    assert.equal(await page.evaluate(() => window.__importCodeExecuted), undefined);
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.deepEqual(await snapshot(page), before);
});

for (const status of ['paused', 'stop', 'puzzle', 'between', 'finished']) test('applying imported rules in ' + status + ' state stays stopped without a battle action', async t => {
    const { page } = await fixture(browser, t, { status });
    const value = envelope(); await imported(page, value); const before = await snapshot(page);
    await row(page, value.title).getByRole('button', { name: 'Apply', exact: true }).click();
    await page.waitForTimeout(250);
    const after = await snapshot(page);
    assert.equal(after.active, false); assert.equal(after.attacks, before.attacks);
    assert.deepEqual(after.config.OneHanded_Item, normalized(value).config.OneHanded_Item);
});

test('mobile import naming, save and application preserve the same battle semantics', async t => {
    const { page } = await fixture(browser, t, { status: 'running', mobile: true });
    const before = await snapshot(page); const value = envelope(); await imported(page, value);
    assert.deepEqual(runtime(await snapshot(page)), runtime(before));
    await row(page, value.title).getByRole('button', { name: 'Apply', exact: true }).click();
    assert.equal((await snapshot(page)).active, false);
});

test('cancelling the file picker makes no changes and a subsequent selection works', async t => {
    const { page } = await fixture(browser, t);
    const before = await snapshot(page), chooser = page.waitForEvent('filechooser');
    await page.locator('.jpx-config-toolbar').getByRole('button', { name: 'Import', exact: true }).click();
    await (await chooser).setFiles([]); await wait(page);
    assert.deepEqual(await snapshot(page), before);
    await imported(page); assert.equal(await row(page, 'Import case').count(), 1);
});

test('an obsolete invalid file cannot overwrite the notice or form of a newer selection', async t => {
    const { page } = await fixture(browser, t);
    await page.evaluate(() => __imports.hold());
    await choose(page, '{invalid'); await page.waitForFunction(() => __imports.pending() === 1);
    await choose(page, envelope('Valid newer file')); await page.waitForFunction(() => __imports.pending() === 2);
    await page.evaluate(() => __imports.release(1)); await page.locator('.jpx-config-form').waitFor();
    await page.evaluate(() => __imports.release()); await wait(page);
    assert.equal(await page.locator('.jpx-config-notice').textContent(), '');
    assert.equal(await page.locator('.jpx-config-form input[type=text]').inputValue(), 'Valid newer file');
});

test('legacy multi-mode file and extension metadata survive import as one package', async t => {
    const { page } = await fixture(browser, t, { status: 'running' });
    const before = await snapshot(page);
    const config = { battleVersion: 20251216, OneHanded_Item: envelope().config.OneHanded_Item,
        TwoHanded_General: { supports: [{ type: 'spellInstant', name: 'Cure', conditions: [] }], attacks: [{ type: 'target', bottomUp: true, conditions: [] }, { type: 'normalAttack', conditions: [] }] },
        futureRoot: { label: 'Preserved', values: [1, 2, 3] } };
    await choose(page, config, 'Legacy multi.txt'); await save(page);
    const saved = await page.evaluate(() => __imports.library().entries.find(entry => entry.envelope.title === 'Legacy multi'));
    assert.equal(saved.envelope.kind, 'battle'); assert.equal(saved.envelope.mode, undefined);
    assert.deepEqual(saved.envelope.config.futureRoot, config.futureRoot);
    assert.deepEqual(saved.envelope.config.OneHanded_Item, normalized(config).OneHanded_Item);
    assert.equal(saved.envelope.config.TwoHanded_General.rules[0].type, 'spellSupport');
    assert.equal(saved.envelope.config.TwoHanded_General.rules[1].priorityRule, 'Bottom Up');
    assert.deepEqual(runtime(await snapshot(page)), runtime(before));
    await row(page, 'Legacy multi').getByRole('button', { name: 'Apply', exact: true }).click();
    await page.locator('.jpx-config-confirm').getByRole('button', { name: 'Apply', exact: true }).click();
    const after = await snapshot(page);
    assert.equal(after.active, false);
    assert.deepEqual(after.config.OneHanded_Item, saved.envelope.config.OneHanded_Item);
    assert.deepEqual(after.config.TwoHanded_General, saved.envelope.config.TwoHanded_General);
});

test('importing the same file twice creates isolated copies and leaves the applied snapshot unchanged', async t => {
    const { page } = await fixture(browser, t);
    const value = envelope('Repeated file'); await imported(page, value);
    await row(page, value.title).getByRole('button', { name: 'Apply', exact: true }).click();
    const before = await snapshot(page);
    await imported(page, value);
    const result = await page.evaluate(() => __imports.library());
    const entries = result.entries.filter(entry => entry.envelope.title === 'Repeated file');
    assert.equal(entries.length, 2); assert.notEqual(entries[0].id, entries[1].id);
    assert.deepEqual(result.applied, JSON.parse(before.library).applied);
    assert.deepEqual(runtime(await snapshot(page)), runtime(before));
});

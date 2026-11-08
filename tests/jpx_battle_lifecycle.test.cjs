'use strict';
// Offline synthetic battle; no live account or submitted configuration executes.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, source, mainHTML } = require('./fixtures/battle-performance.cjs');
function instrument() {
    let processed = 0, tenMsTimers = 0, discoveryTimers = 0, databaseReads = 0;
    const original = preProcessLog, timeout = window.setTimeout;
    preProcessLog = (...args) => { processed++; return original(...args); };
    window.setTimeout = function(callback, delay, ...args) {
        if (delay === 10) tenMsTimers++;
        if (delay > 0 && delay <= 50) discoveryTimers++;
        return timeout(callback, delay, ...args);
    };
    window.__life = {
        init: preDoBattle, round: reDoBattle, update: updateMonsterInfo,
        state: () => ({ processed, tenMsTimers, discoveryTimers, databaseReads, action: timeRecords.action, info: JSON.parse(JSON.stringify(allMonsterInfo)) }),
        database(info) { window.HVMonsterDB = { getCurrentMonstersInformation() { databaseReads++; return info; } }; },
        scan: () => combatRecorder('', 'You use Scan', 'Scan'),
        removeDatabase() { delete window.HVMonsterDB; },
        append() { const row = log.insertRow(0); row.insertCell().textContent = 'Fixture update'; },
        replace(main) { document.getElementById('battle_main').innerHTML = main; reDoBattle(); },
        puzzle() { document.body.insertAdjacentHTML('beforeend', '<div id="riddlemaster"></div>'); reDoBattle(); },
        resetCount() { processed = 0; tenMsTimers = 0; discoveryTimers = 0; databaseReads = 0; }
    };
}
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
async function fixture(t) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } }); t.after(() => context.close());
    const input = source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
    const { page, errors } = await open(context, { source: input });
    t.after(() => assert.deepEqual(errors, [])); return page;
}
test('reinitializing the same battle log keeps exactly one observer', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); __life.round(); __life.round(); __life.resetCount(); __life.append(); });
    await page.waitForTimeout(260);
    assert.equal((await page.evaluate(() => __life.state())).processed, 1);
});
test('an old round trailing callback cannot process the replacement log', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); __life.append(); });
    await page.waitForFunction(() => __life.state().processed === 1);
    await page.evaluate(async main => { __life.append(); await Promise.resolve(); __life.replace(main); __life.resetCount(); }, mainHTML());
    await page.waitForTimeout(260);
    assert.equal((await page.evaluate(() => __life.state())).processed, 0);
    await page.evaluate(() => __life.append()); await page.waitForTimeout(30);
    assert.equal((await page.evaluate(() => __life.state())).processed, 1);
});
test('entering a puzzle disconnects battle observation and queued updates', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); __life.append(); });
    await page.waitForFunction(() => __life.state().processed === 1);
    await page.evaluate(async () => { __life.append(); await Promise.resolve(); __life.puzzle(); __life.resetCount(); __life.append(); });
    await page.waitForTimeout(260);
    assert.equal((await page.evaluate(() => __life.state())).processed, 0);
});
test('missing optional monster database uses bounded discovery instead of 10 ms polling', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.removeDatabase(); __life.resetCount(); __life.update(); __life.update(); __life.update(); });
    await page.waitForTimeout(310);
    const state = await page.evaluate(() => __life.state());
    assert.equal(state.tenMsTimers, 0);
    assert.ok(state.discoveryTimers <= 5, JSON.stringify(state));
    t.diagnostic(JSON.stringify({ tenMsTimers: state.tenMsTimers, discoveryTimers: state.discoveryTimers, databaseReads: state.databaseReads }));
});

const database = (id, plvl = 1000) => ({ mkey_1: { monsterId: id, monsterClass: 'Humanoid', attack: 'Slashing', plvl, lastUpdate: '2026-11-08' } });

test('same-round bursts retain one trailing update and see the final log', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); __life.append(); });
    await page.waitForFunction(() => __life.state().processed === 1);
    await page.evaluate(async () => { for (let i = 0; i < 4; i++) { __life.append(); await Promise.resolve(); } });
    await page.waitForTimeout(260);
    assert.equal((await page.evaluate(() => __life.state())).processed, 2);
});

test('detached logs cannot execute a queued callback without a round event', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); __life.append(); });
    await page.waitForFunction(() => __life.state().processed === 1);
    await page.evaluate(async () => { __life.append(); await Promise.resolve(); document.getElementById('textlog').remove(); __life.resetCount(); });
    await page.waitForTimeout(260);
    assert.equal((await page.evaluate(() => __life.state())).processed, 0);
});

test('concurrent lookups share a request and discover a late database', async t => {
    const page = await fixture(t);
    const same = await page.evaluate(() => { __life.init(); const a = __life.update(); const b = __life.update(); window.__pendingInfo = a; return a === b; });
    assert.equal(same, true);
    await page.waitForTimeout(70);
    await page.evaluate(info => __life.database(info), database(101));
    await page.evaluate(() => __pendingInfo);
    const state = await page.evaluate(() => __life.state());
    assert.deepEqual(state.info, database(101));
    assert.equal(state.databaseReads, 1);
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Slashing, 1000');
});

test('ready database retries stay shared and handle a delayed ID change', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); __life.database(info); return __life.update(); }, database(101));
    await page.evaluate(main => { __life.replace(main); __life.resetCount(); window.__pendingInfo = __life.update(); __life.update(); __life.update(); }, mainHTML());
    await page.waitForTimeout(35);
    await page.evaluate(info => __life.database(info), database(202));
    await page.evaluate(() => __pendingInfo);
    assert.deepEqual((await page.evaluate(() => __life.state())).info, database(202));
});

test('previous-round IDs do not fill a new round with stale metadata', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); __life.database(info); return __life.update(); }, database(101));
    await page.evaluate(main => { __life.replace(main); return __life.update(); }, mainHTML());
    assert.deepEqual((await page.evaluate(() => __life.state())).info, {});
});

test('Scan refresh accepts changed fields with unchanged IDs and reused plugin objects', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); window.__databaseInfo = info; __life.database(info); return __life.update(); }, database(101));
    await page.evaluate(() => { __life.scan(); window.__pendingInfo = __life.update(true); });
    await page.waitForTimeout(25);
    await page.evaluate(() => { window.__databaseInfo.mkey_1.plvl = 2000; });
    await page.evaluate(() => __pendingInfo);
    assert.deepEqual((await page.evaluate(() => __life.state())).info, database(101, 2000));
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Slashing, 2000');
});

test('unchanged Scan metadata causes no DOM rewrite', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); __life.database(info); return __life.update(); }, database(101));
    const mutations = await page.evaluate(async () => {
        let count = 0;
        const observer = new MutationObserver(records => { count += records.length; });
        for (const node of document.querySelectorAll('[data-field=monClass], [data-field=monTrAtkPl]')) observer.observe(node, { childList: true, subtree: true, characterData: true });
        await __life.update(true);
        count += observer.takeRecords().length; observer.disconnect(); return count;
    });
    assert.equal(mutations, 0);
});

test('resolved old data cannot apply after a synchronous round replacement', async t => {
    const page = await fixture(t);
    await page.evaluate(() => { __life.init(); return __life.update(); });
    await page.evaluate(({ info, main }) => { __life.database(info); __life.update(); __life.removeDatabase(); __life.replace(main); }, { info: database(101), main: mainHTML() });
    await page.waitForTimeout(280);
    assert.deepEqual((await page.evaluate(() => __life.state())).info, {});
});

test('puzzle entry cancels an outstanding database request', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); __life.database(info); return __life.update(); }, database(101));
    await page.evaluate(() => { __life.update(true); __life.puzzle(); __life.resetCount(); });
    await page.waitForTimeout(280);
    assert.equal((await page.evaluate(() => __life.state())).databaseReads, 0);
});

test('missing display nodes and disabled metadata display keep conditions data usable', async t => {
    const page = await fixture(t);
    await page.evaluate(info => { __life.init(); document.querySelectorAll('[data-field=monClass], [data-field=monTrAtkPl]').forEach(node => node.remove()); __life.database(info); return __life.update(); }, database(101));
    assert.deepEqual((await page.evaluate(() => __life.state())).info, database(101));
    await page.evaluate(info => { __perf.options({ showMonsterInfo: false }); __life.database(info); return __life.update(true); }, database(101, 2000));
    assert.deepEqual((await page.evaluate(() => __life.state())).info, database(101, 2000));
});

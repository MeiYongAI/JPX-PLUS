'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open } = require('./fixtures/battle-performance.cjs');
const { fixture: reload, html } = require('./fixtures/battle-reload.cjs');
const { instrument, history, turn } = require('./fixtures/battle-log.cjs');
const separator = '-'.repeat(50), endMarker = '+'.repeat(50);
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
async function fixture(t, options = {}) {
    const context = await browser.newContext(); t.after(() => context.close());
    const f = await open(context, { source: instrument(), ...options });
    await f.page.evaluate(() => __perf.render());
    t.after(() => assert.deepEqual(f.errors, [])); return f.page;
}
async function fresh(t, options = {}) {
    const f = await reload(browser, t, { source: instrument(), ...options });
    t.after(() => assert.deepEqual(f.errors, [])); return f;
}

test('appending long history keeps its array and preserves identical new turns', async t => {
    const page = await fixture(t), initial = history(100000);
    const result = await page.evaluate(({ initial, turn }) => {
        __log.seed(initial); __log.html(turn); const reference = __log.record;
        for (let i = 0; i < 3; i++) __log.recordTurn();
        return { same: reference === __log.record, record: __log.record, stats: __perf.snapshot() };
    }, { initial, turn });
    assert.equal(result.same, true);
    assert.deepEqual(result.record, initial.concat(...Array.from({ length: 3 }, () => [separator, 'You hit Fixture Monster for 1234 slashing damage.', 'You attack Fixture Monster 0.'])));
    assert.equal(result.stats.action, 3); assert.equal(result.stats.combatRecords.physicalDealt.slashing, 3702);
});

test('initialization rows, text normalization, and round marker retain existing order', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(() => {
        __log.seed(['earlier']);
        __log.html('<tr><td>  You attack \n Monster. </td></tr><tr><td class="tls"><hr></td></tr><tr><td>  MID=5  </td></tr><tr><td>Initializing The Tower (Floor 3) (Round 1 / 100) ...</td></tr>', true);
        __log.recordBatch(); return __log.record;
    });
    assert.deepEqual(actual, ['earlier', '  MID=5  ', 'Initializing The Tower (Floor 3) (Round 1 / 100) ...', separator, 'You attack Monster.', endMarker]);
});

for (const translation of ['before', 'after']) test('Scan tables, translated wrappers, and Unicode survive export, translation ' + translation, async t => {
    const page = await fixture(t, { translation });
    const expected = await page.evaluate(() => {
        __log.seed(['历史 "quoted" \\ slash\n换行 🐱']);
        __log.html('<tr><td><strong>Scanning</strong> <hv-battle-text>怪物 🐱</hv-battle-text><table><tbody><tr><td>secret stats</td></tr></tbody></table> complete.</td></tr><tr><td class="tls"><hr></td></tr>');
        __log.recordTurn(); __log.persist(); document.body.append(__log.export());
        return { log: __log.record, stored: JSON.parse(localStorage.getItem(__log.key)), text: document.querySelector('#textlog').textContent, stats: __perf.snapshot() };
    });
    assert.deepEqual(expected.log, ['历史 "quoted" \\ slash\n换行 🐱', separator, 'Scanning 怪物 🐱 complete.', 'secret stats']);
    // Preserve the existing nested-cell traversal, including its separate stats row.
    assert.deepEqual(expected.stored, expected.log); assert.ok(expected.text.includes('secret stats')); assert.equal(expected.stats.action, 1);
    const downloaded = page.waitForEvent('download'); await page.locator('a[download="battleLog.txt"]').click();
    assert.deepEqual(JSON.parse(fs.readFileSync(await (await downloaded).path(), 'utf8')), expected.log);
});

test('log exports allocate only on click and release each download URL', async t => {
    const page = await fixture(t);
    await page.evaluate(() => {
        const create = URL.createObjectURL, revoke = URL.revokeObjectURL, timer = window.setTimeout;
        window.__logURLs = new Map(); window.__logURLCleanups = [];
        URL.createObjectURL = blob => { const url = create.call(URL, blob); __logURLs.set(url, blob.size); return url; };
        URL.revokeObjectURL = url => { __logURLs.delete(url); return revoke.call(URL, url); };
        window.setTimeout = (callback, delay, ...args) => delay === 30000
            ? (__logURLCleanups.push(() => callback(...args)), 0) : timer(callback, delay, ...args);
        __log.seed(['完整日志 🐱', 'You attack Fixture Monster.']);
        for (let i = 0; i < 40; i++) __log.export();
        document.body.append(__log.export());
    });
    assert.equal(await page.evaluate(() => __logURLs.size), 0, 'creating result links does not serialize or retain log blobs');
    for (let attempt = 0; attempt < 2; attempt++) {
        const downloaded = page.waitForEvent('download'); await page.locator('a[download="battleLog.txt"]').click();
        assert.deepEqual(JSON.parse(fs.readFileSync(await (await downloaded).path(), 'utf8')), ['完整日志 🐱', 'You attack Fixture Monster.']);
        assert.equal(await page.evaluate(() => __logURLs.size), 1);
        await page.evaluate(() => { for (const cleanup of __logURLCleanups.splice(0)) cleanup(); });
        assert.equal(await page.evaluate(() => __logURLs.size), 0, 'download cleanup releases its backing blob');
        assert.equal(await page.locator('a[download="battleLog.txt"]').getAttribute('href'), '#');
    }
});

test('saves serialize only the new suffix and unchanged saves write nothing', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(() => {
        __log.seed(Array.from({ length: 10000 }, (_, i) => 'row ' + i));
        const first = __log.operations(() => __log.save());
        __log.record.push('new 1', 'new 2'); const next = __log.operations(() => __log.save());
        const clean = __log.operations(() => { __log.save(); __log.save(); });
        return { first, next, clean, equal: JSON.stringify(__log.record) === localStorage.getItem(__log.key) };
    });
    assert.deepEqual(actual.first, { arrays: [{ length: 10000, full: true }], gets: 1, sets: 1 });
    assert.deepEqual(actual.next, { arrays: [{ length: 2, full: false }], gets: 1, sets: 1 });
    assert.deepEqual(actual.clean, { arrays: [], gets: 2, sets: 0 }); assert.equal(actual.equal, true);
});

for (const raw of ['[]', ' \n[ \n ] \r\n', '["旧行","引号 \\" 换行\\n"]', ' \n[\n  "older",\n  "line"\n] \r\n']) test('startup restores existing JSON and appends without reserializing prefix: ' + JSON.stringify(raw), async t => {
    const f = await fresh(t, { storage: { jpx_battleLogRecord: raw } });
    const actual = await f.page.evaluate(() => {
        const before = __log.record.slice(); const first = __log.operations(() => __log.save());
        __log.record.push('尾部 🐱\n\\"'); const next = __log.operations(() => __log.save());
        return { before, first, next, stored: JSON.parse(localStorage.getItem(__log.key)) };
    });
    assert.deepEqual(actual.before, JSON.parse(raw)); assert.deepEqual(actual.first.arrays, []);
    assert.deepEqual(actual.next.arrays, [{ length: 1, full: false }]);
    assert.deepEqual(actual.stored, JSON.parse(raw).concat('尾部 🐱\n\\"'));
});

for (const failure of ['get', 'set']) test('failed storage ' + failure + ' does not acknowledge or lose pending records', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(failure => {
        __log.seed(['old']); __log.save(); const checkpoint = __log.checkpoint;
        __log.record.push('new'); const method = failure + 'Item', original = Storage.prototype[method]; let error;
        Storage.prototype[method] = function(key, ...args) { if (key === __log.key) throw new DOMException('fixture failure', failure === 'set' ? 'QuotaExceededError' : 'SecurityError'); return original.call(this, key, ...args); };
        try { __log.save(); } catch (e) { error = e.name; } finally { Storage.prototype[method] = original; }
        const unchanged = __log.checkpoint === checkpoint, old = JSON.parse(localStorage.getItem(__log.key));
        __log.record.push('later'); __log.save(); __log.save();
        return { unchanged, old, error, saved: JSON.parse(localStorage.getItem(__log.key)), length: __log.checkpoint.length };
    }, failure);
    assert.equal(actual.unchanged, true); assert.deepEqual(actual.old, ['old']);
    assert.equal(actual.error, failure === 'set' ? 'QuotaExceededError' : 'SecurityError');
    assert.deepEqual(actual.saved, ['old', 'new', 'later']); assert.equal(actual.length, 3);
});

test('full-log quota failure does not prevent saving battle statistics', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(turn => {
        __log.seed(['old']); __log.save(); __log.html(turn); __log.recordTurn();
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
            if (key === __log.key) throw new DOMException('Full log quota', 'QuotaExceededError');
            return original.call(this, key, value);
        };
        let error;
        try { __log.persist(); } catch (e) { error = e.name; } finally { Storage.prototype.setItem = original; }
        return { error, storedLog: JSON.parse(localStorage.getItem(__log.key)), pendingLog: __log.record,
            time: JSON.parse(localStorage.getItem('jpx_timeRecords')), combat: JSON.parse(localStorage.getItem('jpx_combatRecords')),
            revenue: JSON.parse(localStorage.getItem('jpx_revenueRecords')), current: __perf.snapshot() };
    }, turn);
    assert.equal(actual.error, 'QuotaExceededError'); assert.deepEqual(actual.storedLog, ['old']);
    assert.equal(actual.pendingLog.length, 4, 'unsaved full log stays available in memory');
    assert.equal(actual.time.action, actual.current.action);
    assert.deepEqual(actual.combat, actual.current.combatRecords); assert.deepEqual(actual.revenue, actual.current.revenueRecords);
});

test('a failed first write remains retryable with the complete history', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(() => {
        __log.seed(['old']); const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function() { throw new DOMException('full', 'QuotaExceededError'); };
        let failed = false; try { __log.save(); } catch { failed = true; } finally { Storage.prototype.setItem = original; }
        const empty = __log.checkpoint === null; __log.record.push('new'); __log.save();
        return { failed, empty, stored: JSON.parse(localStorage.getItem(__log.key)) };
    });
    assert.deepEqual(actual, { failed: true, empty: true, stored: ['old', 'new'] });
});

for (const replacement of [null, '["external"]', 'corrupt']) test('external storage changes cannot produce a false clean skip: ' + replacement, async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(replacement => {
        __log.seed(['owned']); __log.save();
        if (replacement === null) localStorage.removeItem(__log.key); else localStorage.setItem(__log.key, replacement);
        const operations = __log.operations(() => __log.save());
        return { operations, stored: JSON.parse(localStorage.getItem(__log.key)) };
    }, replacement);
    assert.equal(actual.operations.sets, 1); assert.deepEqual(actual.operations.arrays, []); assert.deepEqual(actual.stored, ['owned']);
});

test('array replacement and truncation invalidate the serialized checkpoint', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(() => {
        __log.seed(['a', 'b', 'c']); __log.save(); __log.replace(['x', 'y', 'z']);
        const replaced = __log.operations(() => __log.save()); __log.record.length = 1;
        const truncated = __log.operations(() => __log.save()); __log.record.push('new'); __log.save();
        return { replaced, truncated, stored: JSON.parse(localStorage.getItem(__log.key)) };
    });
    assert.deepEqual(actual.replaced.arrays, [{ length: 3, full: true }]);
    assert.deepEqual(actual.truncated.arrays, [{ length: 1, full: true }]); assert.deepEqual(actual.stored, ['x', 'new']);
});

test('non-array cleanup resets checkpoint only after successful removal', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(() => {
        __log.seed(['old']); __log.save(); const checkpoint = __log.checkpoint; __log.replace(null);
        const original = Storage.prototype.removeItem; Storage.prototype.removeItem = function() { throw Error('blocked'); };
        try { __log.save(); } catch {} finally { Storage.prototype.removeItem = original; }
        const unchanged = __log.checkpoint === checkpoint; __log.save();
        return { unchanged, stored: localStorage.getItem(__log.key), checkpoint: __log.checkpoint };
    });
    assert.deepEqual(actual, { unchanged: true, stored: null, checkpoint: null });
});

test('disabled recording neither appends nor reads or writes the saved log', async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(turn => {
        __log.seed(['keep'], true); __perf.options({ recordBattleLog: false }); __log.html(turn);
        const counts = __log.operations(() => { __log.recordTurn(); __log.persist(); });
        return { counts, record: __log.record, raw: localStorage.getItem(__log.key), action: __perf.snapshot().action };
    }, turn);
    assert.deepEqual(actual.counts, { arrays: [], gets: 0, sets: 0 });
    assert.deepEqual(actual.record, ['keep']); assert.equal(actual.raw, '["keep"]'); assert.equal(actual.action, 1);
});

for (const isekai of [false, true]) for (const pending of ['observer', 'throttle']) test('final pending turn persists once across native refresh, ' + pending + ', Isekai ' + isekai, async t => {
    const key = 'jpx_battleLogRecord' + (isekai ? '_isekai' : ''), other = 'jpx_battleLogRecord' + (isekai ? '' : '_isekai');
    const f = await fresh(t, { isekai, storage: { [key]: '["previous round"]', [other]: '["other world"]' } });
    const before = await f.page.evaluate(async ({ turn, pending }) => {
        if (pending === 'throttle') { __log.html(turn); await Promise.resolve(); }
        __log.html(turn);
        if (pending === 'throttle') await Promise.resolve();
        __reload.persist(); __reload.persist();
        return { record: __log.record.slice(), state: __reload.snapshot(), stored: JSON.parse(localStorage.getItem(__log.key)) };
    }, { turn, pending });
    const repeats = pending === 'throttle' ? 2 : 1;
    assert.equal(before.state.timeRecords.action, repeats); assert.equal(before.state.combatRecords.physicalDealt.slashing, repeats * 1234);
    assert.deepEqual(before.record, ['previous round'].concat(...Array.from({ length: repeats }, () => [separator, 'You hit Fixture Monster for 1234 slashing damage.', 'You attack Fixture Monster 0.'])));
    assert.deepEqual(before.stored, before.record);
    await f.page.waitForTimeout(230); assert.deepEqual(await f.page.evaluate(() => __log.record), before.record);
    for (const round of [2, 3]) {
        await f.navigate({ round }, true);
        const state = await f.page.evaluate(() => ({ log: __log.record, state: __reload.snapshot() }));
        assert.deepEqual(state.log, before.record); assert.deepEqual(state.state.timeRecords, before.state.timeRecords);
        assert.equal(state.state.attacks, 0); assert.equal(state.state.casts, 0);
    }
    assert.equal(await f.page.evaluate(key => localStorage.getItem(key), other), '["other world"]');
});

for (const isekai of [false, true]) test('AJAX round resets retain all log batches and final cleanup cannot be resurrected, Isekai ' + isekai, async t => {
    const f = await fresh(t, { isekai }); let expected = [];
    for (let round = 1; round <= 3; round++) {
        if (round > 1) await f.page.evaluate(markup => __log.ajax(markup), html({ round }));
        const actual = await f.page.evaluate(turn => {
            __log.html(turn, true); __log.persist(); __log.persist();
            return { log: __log.record.slice(), state: __reload.snapshot() };
        }, turn);
        expected.push(separator, 'You hit Fixture Monster for 1234 slashing damage.', 'You attack Fixture Monster 0.', endMarker);
        assert.deepEqual(actual.log, expected); assert.equal(actual.state.timeRecords.action, round);
        assert.equal(actual.state.attacks, 0); assert.equal(actual.state.casts, 0);
    }
    const final = await f.page.evaluate(async () => {
        __log.html('<tr><td>You are Victorious!</td></tr><tr><td>You attack Fixture Monster 0.</td></tr><tr><td class="tls"><hr></td></tr>', true);
        document.getElementById('btcp').innerHTML = '<img src="/y/finishbattle.png">';
        await new Promise(resolve => setTimeout(resolve, 250)); await __log.finish(); __log.persist();
        const link = __log.export();
        link.addEventListener('click', event => event.preventDefault()); link.click();
        const exported = JSON.parse(await (await fetch(link.href)).text()); URL.revokeObjectURL(link.href);
        return { stored: localStorage.getItem(__log.key), exported, record: __log.record.slice(), state: __reload.snapshot() };
    });
    assert.equal(final.stored, null); assert.deepEqual(final.exported, final.record);
    assert.deepEqual(final.record, expected.concat(separator, 'You are Victorious!', 'You attack Fixture Monster 0.', endMarker));
    assert.equal(final.state.attacks, 0); assert.equal(final.state.casts, 0);
});

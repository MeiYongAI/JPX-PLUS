'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { source, open, mainHTML } = require('./fixtures/battle-performance.cjs');
const { html: nativeHTML } = require('./fixtures/battle-reload.cjs');
const moduleSource = fs.readFileSync(path.join(__dirname, '../src/monster-database.js'), 'utf8');
const record = (id = 1, plvl = 1234, name = 'Fixture Monster 0') => ({ monsterId: id, monsterName: name, monsterClass: 'Humanoid', attack: 'Slashing', plvl, lastUpdate: '2026-11-08' });
const target = (id = 1, name = 'Fixture Monster 0') => [{ key: 'mkey_1', id, name }];
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
async function cache(t) {
    const context = await browser.newContext(); t.after(() => context.close());
    const page = await context.newPage();
    await context.route('**/*', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><body>offline fixture' }));
    await page.goto('https://hentaiverse.org/');
    await page.addScriptTag({ content: moduleSource });
    await page.evaluate(() => {
        window.state = { now: Date.parse('2026-11-09T10:00:00Z'), calls: 0, changed: 0, rows: [], failure: false };
        window.make = () => createJpxMonsterDatabase({ indexedDB, now: () => state.now, changed: () => state.changed++, request: async world => {
            state.calls++; state.world = world;
            if (state.wait) await state.wait;
            if (state.failure) throw Error('Offline fixture failure');
            return state.rows;
        } });
        window.db = make();
    });
    return page;
}

test('cold cache downloads once, persists across clients, and isolates worlds', async t => {
    const page = await cache(t);
    const result = await page.evaluate(async ({ row, targets }) => {
        state.rows = [row];
        const a = await db.lookup('persistent', targets);
        const b = await make().lookup('persistent', targets);
        state.rows = [{ ...row, plvl: 555 }];
        const c = await db.lookup('isekai', targets);
        const d = await db.lookup('persistent', targets, false);
        return { a, b, c, d, calls: state.calls };
    }, { row: record(), targets: target() });
    assert.deepEqual(result.a, { mkey_1: record() });
    assert.deepEqual(result.b, result.a); assert.deepEqual(result.d, result.a);
    assert.equal(result.c.mkey_1.plvl, 555); assert.equal(result.calls, 2);
});

test('invalid download preserves the snapshot and backs off across navigation', async t => {
    const page = await cache(t);
    const result = await page.evaluate(async ({ row, targets }) => {
        state.rows = [row]; await db.refresh('persistent'); state.now += 86400000; state.rows = [{ ...row, plvl: -1 }];
        let rejected = false; try { await db.refresh('persistent'); } catch { rejected = true; }
        await make().refresh('persistent');
        return { rejected, calls: state.calls, rows: await make().lookup('persistent', targets, false), meta: await db.metadata('persistent') };
    }, { row: record(), targets: target() });
    assert.equal(result.rejected, true); assert.equal(result.calls, 2);
    assert.deepEqual(result.rows, { mkey_1: record() }); assert.equal(result.meta.day, '2026-11-09');
});

test('different tabs share an atomic refresh lease and see later writes', async t => {
    const page = await cache(t), other = await page.context().newPage();
    await other.goto('https://hentaiverse.org/'); await other.addScriptTag({ content: moduleSource });
    await other.evaluate(row => {
        window.calls = 0;
        window.second = createJpxMonsterDatabase({ indexedDB, now: () => Date.parse('2026-11-09T10:00:00Z'), request: async () => { calls++; return [row]; } });
    }, record());
    await page.evaluate(row => { state.rows = [row]; state.wait = new Promise(resolve => state.release = resolve); window.job = db.refresh('persistent'); }, record());
    await page.waitForFunction(() => state.calls === 1);
    assert.equal(await other.evaluate(() => second.refresh('persistent')), false);
    assert.equal(await other.evaluate(() => calls), 0);
    await page.evaluate(() => { state.release(); return job; });
    assert.equal(await other.evaluate(async targets => (await second.lookup('persistent', targets, false)).mkey_1.plvl, target()), 1234);
    await page.evaluate(row => db.scan('persistent', { ...row, plvl: 8765, lastUpdate: '2026-11-09T10:01:00Z' }), record());
    assert.equal(await other.evaluate(async targets => (await second.lookup('persistent', targets, false)).mkey_1.plvl, target()), 8765);
});

test('concurrent first lookups share the download and stale cache returns immediately', async t => {
    const page = await cache(t);
    await page.evaluate(({ row, targets }) => {
        state.rows = [row]; state.wait = new Promise(resolve => state.release = resolve);
        window.jobs = Promise.all([db.lookup('persistent', targets), db.lookup('persistent', targets)]);
    }, { row: record(), targets: target() });
    await page.waitForFunction(() => state.calls === 1);
    assert.equal(await page.evaluate(() => { state.release(); return jobs.then(rows => rows[0].mkey_1.plvl); }), 1234);
    const cached = await page.evaluate(async targets => {
        state.now += 86400000; state.rows[0].plvl = 2000;
        state.wait = new Promise(resolve => state.release = resolve);
        return db.lookup('persistent', targets);
    }, target());
    assert.equal(cached.mkey_1.plvl, 1234);
    await page.waitForFunction(() => state.calls === 2);
    await page.evaluate(() => state.release()); await page.waitForFunction(() => state.changed === 1);
    assert.equal(await page.evaluate(async targets => (await db.lookup('persistent', targets, false)).mkey_1.plvl, target()), 2000);
});

test('spawned IDs override names, unknown IDs stay unknown, and scans survive refresh', async t => {
    const page = await cache(t);
    const result = await page.evaluate(async ({ row, targets }) => {
        state.rows = [row]; await db.refresh('persistent');
        const unknown = await db.lookup('persistent', [{ ...targets[0], id: 99 }], false);
        const renamed = await db.lookup('persistent', [{ ...targets[0], name: 'Renamed' }], false);
        await db.scan('persistent', { ...row, plvl: 9999, lastUpdate: new Date(state.now).toISOString() });
        state.now += 86400000; await db.refresh('persistent');
        return { unknown, renamed, scanned: await make().lookup('persistent', targets, false), byName: await make().lookup('persistent', [{ ...targets[0], id: 0 }], false) };
    }, { row: record(), targets: target() });
    assert.deepEqual(result.unknown, {}); assert.equal(result.renamed.mkey_1.monsterId, 1);
    assert.equal(result.scanned.mkey_1.plvl, 9999); assert.deepEqual(result.byName, result.scanned);
});

test('offline first load returns missing data without inventing a power level', async t => {
    const page = await cache(t);
    const result = await page.evaluate(async targets => { state.failure = true; return { info: await db.lookup('persistent', targets), calls: state.calls }; }, target());
    assert.deepEqual(result, { info: {}, calls: 1 });
});

const scanHTML = (name = 'Fixture Monster 0', modern = true, system = false) => '<tr><td><strong>Scanning ' + name + '...</strong><table><tbody>' +
    (modern ? '<tr><td><strong>Monster Trainer:</strong></td><td>Fixture</td></tr>' : '') +
    '<tr><td><strong>Monster Class:</strong></td><td>Humanoid' + (system ? '' : ', Power Level 9876') + '</td></tr>' +
    '<tr><td><strong>' + (modern ? 'Melee Attack' : 'Attack Type') + ':</strong></td><td>Crushing' + (modern ? '; Physical' : '') + '</td></tr></tbody></table></td></tr>';

test('Scan parser supports labelled old/new tables, wrappers, and system PL zero', async t => {
    const page = await cache(t);
    for (const modern of [false, true]) for (const system of [false, true]) {
        const result = await page.evaluate(({ html, targets }) => parseJpxMonsterScan(html, targets, document, Date.parse('2026-11-09T10:00:00Z')),
            { html: scanHTML('Fixture &amp; Monster', modern, system).replace('Humanoid', '<hv-battle-text>Humanoid</hv-battle-text>'), targets: target(7, 'Fixture & Monster') });
        assert.equal(result.monsterId, 7); assert.equal(result.attack, 'Crushing'); assert.equal(result.plvl, system ? 0 : 9876);
    }
    assert.equal(await page.evaluate(({ html, targets }) => parseJpxMonsterScan(html, targets, document), { html: scanHTML(), targets: target(0) }), null);
});

function instrument() {
    window.__monster = {
        init: preDoBattle, update: updateMonsterInfo, targets: getJpxMonsterTargets,
        settings: renderSettings, theme: toggleJpxTheme, cleanup: requestJpxCleanup,
        info: () => JSON.parse(JSON.stringify(allMonsterInfo)), needs: needsJpxMonsterDatabase,
        parse: html => recordJpxMonsterScan(html), cache: getJpxMonsterDatabase,
        replace: html => { document.getElementById('battle_main').innerHTML = html; reDoBattle(); },
        puzzle: () => { document.body.insertAdjacentHTML('beforeend', '<div id="riddlemaster"></div>'); reDoBattle(); },
        seed(rows, options = {}) {
            allMonsterInfo = {}; monsterData = rows.map(row => ({ id: row.monsterId, name: row.monsterName, maxHP: 20000, level: 400 }));
            Object.assign(cfgBattle, options); preRender();
        },
        rules(value) { cfgBattle[getBattleMode()] = { supports: value, attacks: [] }; },
        conditions: () => initConditions().targetHandlers,
        resetCache: () => { jpxMonsterDatabase = null; }
    };
}
async function battle(t, options = {}) {
    const context = await browser.newContext(); t.after(() => context.close());
    const input = source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
    const { page, errors } = await open(context, { source: input, ...options });
    t.after(() => assert.deepEqual(errors, []));
    await page.evaluate(() => {
        window.__http = { requests: [], rows: [], hold: false, callbacks: [] };
        window.GM_xmlhttpRequest = options => {
            __http.requests.push({ url: options.url, method: options.method, anonymous: options.anonymous });
            const finish = () => options.onload({ status: 200, responseText: JSON.stringify(__http.rows) });
            if (__http.hold) __http.callbacks.push(finish); else queueMicrotask(finish);
        };
        delete window.HVMonsterDB;
    });
    return page;
}

test('standalone battle displays metadata and feeds conditions without a companion', async t => {
    const page = await battle(t);
    const result = await page.evaluate(async row => {
        __http.rows = [row]; __monster.seed([row], { showMonsterInfo: true });
        await __monster.update();
        const handlers = __monster.conditions();
        return { info: __monster.info(), requests: __http.requests, matches: handlers.tClasses(['Humanoid'], { index: 0 }) && handlers.tPowerLevel([1200, 1300], { index: 0 }) };
    }, record());
    assert.deepEqual(result.info, { mkey_1: record() }); assert.equal(result.matches, true);
    assert.deepEqual(result.requests, [{ url: 'https://hv-monsterdb-data.skk.moe/persistent.json', method: 'GET', anonymous: true }]);
    assert.equal(await page.locator('[data-field=monClass]').first().textContent(), 'Humanoid');
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Slashing, 1234');
    await page.evaluate(() => { for (let i=0;i<20;i++) __perf.render(); });
    assert.equal(await page.evaluate(() => __http.requests.length), 1);
});

test('disabled unused feature sends no request; enabled metadata rule works with display off', async t => {
    const page = await battle(t);
    const result = await page.evaluate(async row => {
        __http.rows = [row]; __monster.seed([row], { showMonsterInfo: false }); __monster.rules([]);
        await __monster.update(); const unused = __http.requests.length;
        __monster.rules([{ type: 'stop', conditions: [{ key: 'tClasses', value: ['Humanoid'] }] }]);
        await __monster.update();
        return { unused, requests: __http.requests.length, info: __monster.info() };
    }, record());
    assert.equal(result.unused, 0); assert.equal(result.requests, 1); assert.deepEqual(result.info, { mkey_1: record() });
    assert.equal(await page.locator('[data-field=monTrAtkPl]').count(), 0);
});

test('late download uses new round identities and never paints the old round', async t => {
    const page = await battle(t);
    await page.evaluate(row => { __http.rows = [row, { ...row, monsterId: 21, monsterName: 'Round Two', plvl: 4321 }]; __http.hold = true; __monster.seed([row]); window.old = __monster.update(); }, record());
    await page.waitForFunction(() => __http.callbacks.length === 1);
    await page.evaluate(html => __monster.replace(html), mainHTML().replaceAll('Fixture Monster 0', 'Round Two').replace('<tbody>', '<tbody><tr><td>MID=21 (Round Two) LV=400 HP=20000</td></tr>'));
    await page.evaluate(() => __http.callbacks.forEach(callback => callback()));
    await page.waitForFunction(() => __monster.info().mkey_1?.monsterId === 21);
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Slashing, 4321');
    assert.equal(await page.evaluate(() => __http.requests.length), 1);
});

test('puzzle transition discards late data while allowing cache completion', async t => {
    const page = await battle(t);
    await page.evaluate(row => { __http.rows = [row]; __http.hold = true; __monster.seed([row]); window.old = __monster.update(); }, record());
    await page.waitForFunction(() => __http.callbacks.length === 1);
    await page.evaluate(() => { __monster.puzzle(); __http.callbacks.forEach(callback => callback()); return old; });
    assert.deepEqual(await page.evaluate(() => __monster.info()), {});
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), '');
});

for (const translation of ['before', 'after']) test('local Scan refreshes display and cache with translation ' + translation, async t => {
    const page = await battle(t, { translation });
    await page.evaluate(async row => { __http.rows = [row]; __monster.seed([row]); await __monster.update(); }, record());
    await page.evaluate(html => __monster.parse(html), scanHTML());
    await page.waitForFunction(async () => (await __monster.cache().lookup('persistent', __monster.targets(), false)).mkey_1?.plvl === 9876);
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Crushing, 9876');
    assert.equal(await page.evaluate(() => __http.requests.length), 1);
});

test('isekai entry requests only isekai data and safely renders literal names', async t => {
    const page = await battle(t, { url: 'https://alt.hentaiverse.org/isekai/' });
    await page.evaluate(async row => {
        __http.rows = [row]; __monster.seed([row]); await __monster.update();
    }, record());
    assert.equal(await page.evaluate(() => __http.requests[0].url), 'https://hv-monsterdb-data.skk.moe/isekai.json');
    const targets = await page.evaluate(() => {
        document.querySelector('.btm3 > div > div').textContent = 'Name & Thing';
        __monster.seed([{ monsterId: 14, monsterName: 'Name &amp; Thing' }]); return __monster.targets();
    });
    assert.equal(targets[0].id, 14); assert.equal(targets[0].name, 'Name & Thing');
});

test('real startup, reload, settings activation and scan callback work standalone', async t => {
    const context = await browser.newContext(); t.after(() => context.close());
    const page = await context.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => route.fulfill({ contentType: 'text/html', body: route.request().isNavigationRequest() ? nativeHTML() : '' }));
    await page.goto('https://hentaiverse.org/');
    await page.evaluate(row => {
        localStorage.setItem('jpx_cfgBattle', JSON.stringify({ battleVersion: 20251216, showMonsterInfo: true }));
        window.calls = 0;
        window.GM_xmlhttpRequest = options => { calls++; queueMicrotask(() => options.onload({ status: 200, responseText: JSON.stringify([row]) })); };
    }, record(100));
    await page.addScriptTag({ content: source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();') });
    await page.waitForFunction(() => __monster.info().mkey_1?.monsterId === 100);
    assert.equal(await page.locator('[data-field=monTrAtkPl]').first().textContent(), 'Slashing, 1234');
    assert.equal(await page.evaluate(() => calls), 1);
    await page.evaluate(html => {
        const body = document.querySelector('#textlog > tbody');
        body.innerHTML = html + '<tr><td class="tls"><hr></td></tr>' + body.innerHTML;
    }, scanHTML());
    await page.waitForFunction(() => __monster.info().mkey_1?.plvl === 9876);
    await page.waitForFunction(async () => (await __monster.cache().lookup('persistent', __monster.targets(), false)).mkey_1?.plvl === 9876);
    await page.reload();
    await page.evaluate(() => { window.calls = 0; window.GM_xmlhttpRequest = () => { calls++; throw Error('Unexpected second download'); }; });
    await page.addScriptTag({ content: source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();') });
    await page.waitForFunction(() => __monster.info().mkey_1?.plvl === 9876);
    assert.equal(await page.evaluate(() => calls), 0);
    await page.evaluate(() => __monster.settings());
    const checkbox = page.locator('input[id^="showMonsterInfo"]');
    await checkbox.uncheck(); await page.getByRole('button', { name: 'Save battle settings', exact: true }).click();
    assert.equal(await page.locator('[data-field=monTrAtkPl]').count(), 0);
    await checkbox.check(); await page.getByRole('button', { name: 'Save battle settings', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('[data-field=monTrAtkPl]')?.textContent === 'Crushing, 9876');
    // Use the production reload-based cleanup path; only this isolated origin
    // contains data, and the dialog approval is part of the test fixture.
    page.on('dialog', dialog => dialog.accept());
    await Promise.all([page.waitForNavigation({ waitUntil: 'load' }),
        page.evaluate(() => { document.getElementById('textlog').remove(); __monster.cleanup(); })]);
    await page.addScriptTag({ content: source });
    await page.waitForFunction(() => document.querySelector('#jpx-cleanup-page [role=status]')?.textContent.includes('local data cleared'));
    assert.equal(await page.evaluate(async () => (await indexedDB.databases()).some(db => db.name === 'jpx-monster-database-v1')), false);
    assert.deepEqual(errors, []);
});

test('monster checkbox fits all language packs in both themes', async t => {
    const context = await browser.newContext(); t.after(() => context.close());
    const output = path.join(__dirname, '../.test-output/monster-database'); fs.mkdirSync(output, { recursive: true });
    for (const language of ['', 'ZhCN', 'ZhTW', 'ZhHK', 'Ja', 'Ko']) {
        const input = source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
        const { page, errors } = await open(context, { source: input });
        if (language) await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, '../JPX-PLUS-' + language + '.user.js'), 'utf8') });
        await page.evaluate(() => __monster.settings());
        for (const width of [320, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            for (const theme of ['light', 'dark']) {
                if (theme === 'dark') await page.evaluate(() => __monster.theme());
                const checkbox = page.locator('input[id^="showMonsterInfo"]');
                await checkbox.scrollIntoViewIfNeeded();
                const bounds = await checkbox.evaluate(el => {
                    const rect = el.labels[0].getBoundingClientRect();
                    return { left: rect.left, right: rect.right, width: innerWidth, text: el.labels[0].textContent };
                });
                assert.ok(bounds.left >= 0 && bounds.right <= bounds.width, JSON.stringify(bounds));
                assert.ok(!bounds.text.includes('requires Monster DB')); await checkbox.focus();
                if (language === 'ZhCN') await page.locator('#settings-container').screenshot({ path: path.join(output, width + '-' + theme + '.png') });
            }
            await page.evaluate(() => __monster.theme());
        }
        assert.deepEqual(errors, []); await page.close();
    }
});

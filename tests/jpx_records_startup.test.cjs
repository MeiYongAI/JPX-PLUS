'use strict';
// Simulate userscript injection timing on isolated HV pages, without a real account.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const timing = source.match(/^\/\/\s+@run-at\s+(\S+)/m)[1];
let browser;
before(async () => { browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) }); });
after(async () => browser?.close());

async function fixture(t, { host = 'hentaiverse.org', pathname = '/', records = true, width = 1440, dark = false, language = '', packFirst = false, parserInjection = false } = {}) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const errors = [];
    let unblock;
    const blocked = new Promise(resolve => { unblock = resolve; });
    t.after(async () => { unblock(); await context.close(); assert.deepEqual(errors, []); });
    const measured = source.replace("window.dispatchEvent(new Event('jpx:ready'));", "window.__readyCount = (window.__readyCount || 0) + 1; window.dispatchEvent(new Event('jpx:ready'));");
    const pack = language ? fs.readFileSync(path.join(root, 'JPX-PLUS-' + language + '.user.js'), 'utf8') : '';
    if (pack) assert.match(pack, /@run-at\s+document-start/, 'packs cannot depend on a stopped homepage DOMContentLoaded event');
    const injected = '(() => {if(!/^https?:$/.test(location.protocol)||!/(^|\\.)hentaiverse\\.org$/.test(location.hostname))return;' + (dark ? 'localStorage.setItem("jpx_theme","dark");' : '') +
        (packFirst ? pack : '') + '\nconst run = () => {' + measured + '\n};' +
        (timing === 'document-start' ? 'run();' : 'document.addEventListener("DOMContentLoaded", run, {once:true});') +
        '\n' + (packFirst ? '' : pack) + '\n})();';
    if (!parserInjection) await context.addInitScript({ content: injected });
    // Chrome's popup initial document can retain about:blank init scripts.
    // A first parser script models document-start injection in the new HV document.
    const startup = parserInjection ? '<script>' + injected.replace(/<\/script/gi, '<\\/script') + '</script>' : '';
    await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.pathname === '/hold-parser.js') { await blocked; return route.fulfill({ contentType: 'application/javascript', body: 'window.__nativeResourceRan=true;' }); }
        if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta charset="utf-8">' + startup + '<script>window.__nativeHomeRan=true;</script></head><body><div id="native-homepage"><div id="csp"><div id="navbar"></div><h1>HV homepage</h1></div></div><script src="/hold-parser.js"></script></body></html>' });
        return route.fulfill({ status: 204, body: '' });
    });
    const page = await context.newPage();
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)));
    page.on('pageerror', error => errors.push(error.message));
    const url = 'https://' + host + pathname + (records ? '#jpx-records' : '');
    await page.goto(url, { waitUntil: 'commit' });
    await page.waitForFunction(records ? () => !!document.querySelector('.jpx-records-page') : () => !!document.getElementById('native-homepage'), null, { polling: 25 });
    return { page, context, unblock, url };
}
async function ready(page) {
    await page.waitForFunction(() => document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy') === 'false', null, { polling: 25 });
    assert.equal(await page.locator('.jpx-records-page').isVisible(), true);
    assert.equal(await page.locator('#native-homepage').count(), 0);
}

for (const host of ['hentaiverse.org', 'alt.hentaiverse.org']) for (const pathname of ['/', '/isekai/']) {
    test('records start without the homepage and survive reload: ' + host + pathname, async t => {
        const f = await fixture(t, { host, pathname, width: pathname === '/' ? 1440 : 390, dark: pathname !== '/' });
        await ready(f.page);
        assert.equal(await f.page.evaluate(() => window.__nativeHomeRan), undefined, 'the original homepage is never executed');
        f.unblock();
        await f.page.waitForTimeout(50);
        assert.equal(await f.page.evaluate(() => window.__nativeResourceRan), undefined, 'homepage resources do not execute');
        assert.equal(await f.page.locator('#jpx-records-startup').count(), 0, 'no cover or hidden homepage');
        assert.equal(f.page.url(), f.url);
        assert.equal(await f.page.evaluate(() => window.__readyCount), 1);
        assert.deepEqual(await f.page.locator('#filter-world input:checked').evaluateAll(nodes => nodes.map(node => node.value)), [pathname === '/' ? 'Persistent' : 'Isekai']);
        await f.page.reload({ waitUntil: 'commit' }); await ready(f.page);
        assert.equal(await f.page.evaluate(() => window.__nativeHomeRan), undefined);
        assert.equal(await f.page.evaluate(() => window.__nativeResourceRan), undefined);
        assert.equal(f.page.url(), f.url);
        assert.equal(await f.page.evaluate(() => window.__readyCount), 1);
        await f.page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
        assert.equal(await f.page.evaluate(() => window.__readyCount), 1, 'later synthetic events do not restart the script');
    });
}

test('ordinary game pages stay visible while waiting for DOM readiness', async t => {
    const f = await fixture(t, { records: false });
    assert.equal(await f.page.locator('#native-homepage').isVisible(), true);
    assert.equal(await f.page.evaluate(() => window.JPXPlus), undefined);
    f.unblock(); await f.page.waitForFunction(() => window.__readyCount === 1);
    assert.equal(await f.page.locator('#native-homepage').isVisible(), true);
});

for (const language of ['ZhCN', 'ZhTW', 'ZhHK', 'Ja', 'Ko']) for (const packFirst of [false, true]) {
    test('direct records startup keeps translations: ' + language + ' packFirst=' + packFirst, async t => {
        const f = await fixture(t, { language, packFirst, width: 390 }); await ready(f.page);
        assert.equal(await f.page.locator('.jpx-records-heading h1').textContent(), await f.page.evaluate(() => window.jpxI18N.sP.jpxStats));
        await f.page.reload({ waitUntil: 'commit' }); await ready(f.page);
        assert.equal(await f.page.locator('.jpx-records-heading h1').textContent(), await f.page.evaluate(() => window.jpxI18N.sP.jpxStats));
        assert.equal(await f.page.evaluate(() => window.__nativeResourceRan), undefined);
    });
}

test('Z opens an independent records tab which still reloads after the game tab closes', async t => {
    const f = await fixture(t, { records: false, pathname: '/isekai/', language: 'ZhCN', parserInjection: true });
    f.unblock(); await f.page.waitForFunction(() => window.__readyCount === 1);
    await f.page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const request = indexedDB.open('jpx', 1);
            request.onupgradeneeded = () => request.result.createObjectStore('battleRecords', { keyPath: 'timestamp' }).createIndex('date', 'date');
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result, tx = db.transaction('battleRecords', 'readwrite');
                tx.objectStore('battleRecords').put({ timestamp: '2026-11-09 10:00:00', date: '2026-11-09', world: 'Isekai', battleType: 'Arena', result: 'Victory', difficulty: 20, playerLevel: 400, roundInfo: { current: 1, total: 1 }, turns: 10, deltaSeconds: 5, deltaTime: '00:00:05', tps: 2, combatRecords: {}, revenueRecords: { totalProfit: 50, finalProfit: 50 } });
                tx.oncomplete = () => { db.close(); resolve(); }; tx.onerror = () => reject(tx.error);
            };
        });
    });
    const popup = f.page.waitForEvent('popup'); await f.page.keyboard.press('z');
    const records = await popup; await ready(records);
    assert.equal(records.url(), 'https://hentaiverse.org/isekai/#jpx-records');
    assert.equal(await records.evaluate(() => window.__nativeHomeRan), undefined);
    assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(), 1);
    await f.page.close();
    await records.reload({ waitUntil: 'commit' }); await ready(records);
    assert.equal(await records.locator('.jpx-records-heading h1').textContent(), '战斗统计');
    assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(), 1);
    assert.deepEqual(await records.locator('#filter-world input:checked').evaluateAll(nodes => nodes.map(node => node.value)), ['Isekai']);
});

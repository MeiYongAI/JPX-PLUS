'use strict';
// Full assembled main userscript and legacy plugin in separate mocked GM sandboxes.
// Every HTTP request is fulfilled locally. Real game/account/manager data is untouched.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const main = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const legacy = fs.readFileSync(path.join(root, 'JPX-PLUS-ConfigStore.user.js'), 'utf8');
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:8px;background:#edebdf;color:#5c0d11;font:12px Verdana}#csp{width:1240px;height:704px}</style></head><body><div id="csp"><div id="navbar"></div></div></body></html>';
const clone = value => JSON.parse(JSON.stringify(value));
const config = { battleVersion: 20251216, OneHanded_General: { supports: [{ type: 'stop', customMessage: 'Original native settings', conditions: [] }], attacks: [{ type: 'normalAttack' }] } };
const envelope = (title, world = 'Any') => ({ schemaVersion: 1, kind: 'battle-mode', title, description: 'Offline store sample', world,
    mode: 'TwoHanded_General', scriptVersion: '2026.11.07.1', config: { battleVersion: 20251216,
        TwoHanded_General: { supports: [{ type: 'stop', customMessage: title, conditions: [] }], attacks: [{ type: 'normalAttack' }],
            futureMode: { preserved: true }, jpxPlusExecution: { style: '2H_Mage', element: 'cold' } } } });
const legacyRecords = Array.from({ length: 7 }, (_, index) => ({ id: String(index + 1).padStart(8, '0') + '-1111-4111-8111-111111111111',
    savedAt: '2026-11-07T00:00:00Z', envelope: envelope('Legacy ' + (index + 1), index % 2 ? 'Isekai' : 'Persistent') }));
const legacyToken = { token: 'fixture_legacy_secret_never_migrate', expiresAt: Date.now() + 3600000 };
const oldStorage = [...legacyRecords.map(record => ['jpx-config-store-backpack-v1:' + record.id, record]), ['jpx-config-store-auth-v1', legacyToken]];

function expose() {
    initDoI18n(); loadBattleConfig(); battleStyle = 'OneHanded'; battleType = 'General';
    const clone = value => JSON.parse(JSON.stringify(value));
    window.__fullStore = { open: renderSettings, theme: toggleJpxTheme,
        label: key => t('cM.' + key),
        native: () => ({ battle: clone(cfgBattle), stats: clone(cfgStats), shortcuts: clone(userKeybinds),
            savedBattle: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix), savedStats: localStorage.getItem(prefix + 'cfgStats') }),
        library: () => getJpxConfigLibrary().readState(),
        saveLocal: (value, id) => getJpxConfigLibrary().save(value, id ? { id } : {}),
        removeLocal: id => getJpxConfigLibrary().remove(id),
        seed(value) { cfgBattle = {}; mergeCfg(clone(value), defaultCfgBattle, cfgBattle, 'battle');
            localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle)); }
    };
}
assert.equal(main.split('\ninitDo();').length, 2);
const harness = main.replace('\ninitDo();', '\n(' + expose.toString() + ')();');

// Lexically scoped grants simulate separate Tampermonkey script storage. Reading
// them through this deliberately exposed test helper is not production exposure.
function inSandbox(source, id, initial = []) {
    return '(function(){\nconst scriptId=' + JSON.stringify(id) + ',memory=new Map(' + JSON.stringify(initial) + ');\n' +
        'const copy=value=>JSON.parse(JSON.stringify(value));\n' +
        'const GM_getValue=(key,fallback)=>memory.has(key)?copy(memory.get(key)):fallback;\n' +
        'const GM_setValue=(key,value)=>memory.set(key,copy(value));\n' +
        'const GM_deleteValue=key=>memory.delete(key);const GM_listValues=()=>[...memory.keys()];\n' +
        'const GM_xmlhttpRequest=options=>window.__transport.request(scriptId,options);\n' +
        'window.__transport.snapshots[scriptId]=()=>copy([...memory]);\n' + source + '\n})();';
}
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => { await browser?.close(); });
async function fixture(t, { oldFirst, mobile = false, count = 1, records, language = 'en', signedIn = false, shareOverrides = {} } = {}) {
    const context = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 960 }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const page = await context.newPage(), errors = [], unexpected = [];
    page.setDefaultTimeout(10000); page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({ contentType: 'text/html', body: html });
        if (route.request().method() === 'GET' && /^https:\/\/hentaiverse\.org\/(?:isekai\/)?\?s=Character&ss=(?:ch|eq)$/.test(route.request().url())) return route.fulfill({ status: 503, body: 'Character lookup unavailable in this fixture' });
        unexpected.push(route.request().url()); return route.abort();
    });
    await page.goto('https://hentaiverse.org/');
    const files = {}, catalog = { schemaVersion: 1, updatedAt: '2026-11-07T00:00:00Z', entries: [] };
    for (let index = 1; index <= (records?.length ?? count); index++) {
        const record = records?.[index - 1];
        const value = record?.envelope || envelope('Store configuration ' + index), source = JSON.stringify(value) + '\n';
        const sha256 = createHash('sha256').update(source).digest('hex');
        const configPath = 'catalog/configs/' + index + '-' + sha256 + '.json'; files[configPath] = source;
        catalog.entries.push({ id: index, author: record?.author || 'fixtureauthor', title: value.title, description: value.description, kind: value.kind,
            world: value.world, mode: value.mode, scriptVersion: value.scriptVersion, updatedAt: record?.updatedAt || catalog.updatedAt, sha256,
            configPath, issueUrl: 'https://github.com/MeiYongAI/JPX-PLUS-Configs/issues/' + index,
            ...(record?.catalogModes ? { modes: record.catalogModes } : {}) });
    }
    await page.evaluate(({ files, catalog, signedIn, shareOverrides }) => {
        const issues = Object.fromEntries(catalog.entries.map(entry => [entry.id, {
            number: entry.id, title: '[Config] ' + entry.title, user: { id: 42 }, state: 'open', labels: ['store:published'],
            body: '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n' + files[entry.configPath].trim() + '\n```',
            html_url: entry.issueUrl, updated_at: entry.updatedAt, ...shareOverrides[entry.id]
        }]));
        window.__transport = { calls: [], aborted: [], snapshots: {}, issues, comments: {},
            request(scriptId, options) {
                const item = { scriptId, url: options.url, method: options.method, ...(options.data ? { data: JSON.parse(options.data) } : {}) }; this.calls.push(item);
                let aborted = false;
                if (!options.url.includes('/login/device/code')) queueMicrotask(() => {
                    if (aborted) return;
                    const pathname = options.url.split('/main/')[1];
                    let response = /\/catalog\/index\.json(?:\?|$)/.test(options.url) ? JSON.stringify(catalog) : files[pathname];
                    if (signedIn && options.url.endsWith('/user')) response = JSON.stringify({ id: 42, login: 'fixtureowner' });
                    if (signedIn && options.url.includes('/issues?')) response = JSON.stringify(Object.values(this.issues));
                    const commentId = options.url.match(/\/issues\/(\d+)\/comments\?/)?.[1];
                    if (signedIn && commentId) response = JSON.stringify(this.comments[commentId] || []);
                    const issueId = options.url.match(/\/issues\/(\d+)$/)?.[1];
                    if (signedIn && issueId) {
                        if (!this.issues[issueId]) { options.onload({ status: 404, finalUrl: options.url, responseText: '{}' }); return; }
                        if (options.method === 'PATCH') {
                            if (this.failPatch) { options.onload({ status: 503, finalUrl: options.url, responseText: '{}' }); return; }
                            Object.assign(this.issues[issueId], item.data);
                        }
                        response = JSON.stringify(this.issues[issueId]);
                    }
                    if (!response) { options.onerror(); return; }
                    options.onload({ status: 200, finalUrl: options.url, responseText: response });
                });
                // Hold device-code requests so leaving the visible tab must abort them.
                return { abort() { aborted = true; __transport.aborted.push(item); options.onabort(); } };
            }
        };
    }, { files, catalog, signedIn, shareOverrides });
    if (language !== 'en') await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'JPX-PLUS-' + language + '.user.js'), 'utf8') });
    if (oldFirst === true) await page.addScriptTag({ content: inSandbox(legacy, 'legacy', oldStorage) });
    await page.addScriptTag({ content: inSandbox(harness, 'main', signedIn ? [['jpx-config-store-auth-v1', { token: 'fixture_only', expiresAt: Date.now() + 3600000 }]] : []) });
    if (oldFirst === false) await page.addScriptTag({ content: inSandbox(legacy, 'legacy', oldStorage) });
    if (oldFirst !== undefined) await page.waitForFunction(() => __fullStore.library().entries.filter(entry => entry.id.startsWith('0000000')).length === 7);
    await page.evaluate(config => { __fullStore.seed(config); __fullStore.open(); }, config);
    await tab(page, 'configManager');
    await page.locator('.jpx-config-row').first().waitFor();
    return { page, errors, unexpected, mobile, catalog };
}
async function tab(page, name) {
    if (!await page.locator('#tab_' + name).isVisible()) await page.locator('#jpx-settings-menu-button').click();
    await page.locator('#tab_' + name).click();
}
async function enterStore(page) {
    const name = await page.evaluate(() => __fullStore.label('store'));
    await page.locator('.jpx-config-manager > .jpx-config-toolbar .jpx-config-nav').getByRole('button', { name, exact: true }).click();
    await page.locator('.jpx-store-title').first().waitFor();
}
async function assertClean(f) { assert.deepEqual(f.errors, []); assert.deepEqual(f.unexpected, []); }

function discoveryRecords() {
    const data = [
        ['Shield starter', 'Persistent', 'OneHanded_Item', 'lina', 2],
        ['Mage tower', 'Isekai', '2H_Mage_Tower', 'lin', 6],
        ['Shared shield', 'Any', 'OneHanded_General', 'lina', 5],
        ['Arena staff', 'Isekai', 'Staff_Arena', 'noah', 1],
        ['Twin blades', 'Persistent', 'DualWielding_General', 'kai', 3],
        ['Compact stats', 'Any', null, 'noah', 7],
        ['Battle pack', 'Isekai', null, 'kai', 4]
    ];
    return data.map(([title, world, mode, author, day], index) => {
        const value = envelope(title, world);
        if (mode) { value.config[mode] = value.config[value.mode]; if (mode !== value.mode) delete value.config[value.mode]; value.mode = mode; }
        else { delete value.mode; value.kind = index === 5 ? 'stats' : 'battle'; }
        if (value.kind === 'stats') value.config = { statsVersion: 20260109, combatRows: [], revenueRows: [], statsColumns: [] };
        return { envelope: value, author, updatedAt: `2026-11-0${day}T00:00:00Z` };
    });
}
const visibleStoreIds = page => page.locator('.jpx-store-row[data-store-id]').evaluateAll(rows => rows.map(row => Number(row.dataset.storeId)));

for (const mobile of [false, true]) test(`catalog downloads work directly from the row without applying or saving, ${mobile ? 'mobile' : 'desktop'}`, async t => {
    const f = await fixture(t, { mobile, count: 25 }); await enterStore(f.page);
    const native = await f.page.evaluate(() => __fullStore.native());
    const library = await f.page.evaluate(() => __fullStore.library());
    const search = f.page.locator('.jpx-store-querybar input'); await search.fill('configuration 1');
    const row = f.page.locator('[data-store-id="18"]');
    const button = row.getByRole('button', { name: 'Download config: Store configuration 18', exact: true });
    await button.scrollIntoViewIfNeeded();
    const stage = f.page.locator('.jpx-store-stage'), scroll = await stage.evaluate(node => node.scrollTop);
    const rowBox = await row.boundingBox(), buttonBox = await button.boundingBox();
    const toolsBox = await row.locator('.jpx-store-row-tools').boundingBox(), dateBox = await row.locator('time').boundingBox();
    assert.ok(Math.abs(toolsBox.x + toolsBox.width - rowBox.x - rowBox.width) <= 1, 'download and date occupy the right column');
    assert.ok(dateBox.y >= buttonBox.y + buttonBox.height, 'date sits below the download icon');
    const contentBox = await row.locator('p').last().boundingBox();
    assert.ok(Math.abs(dateBox.y + dateBox.height - contentBox.y - contentBox.height) <= 1, 'date aligns with the bottom of the row content');
    assert.ok(Math.abs(dateBox.x + dateBox.width / 2 - buttonBox.x - buttonBox.width / 2) <= 1, 'download and date are centered together');
    assert.ok(buttonBox.width >= (mobile ? 44 : 32) && buttonBox.height >= (mobile ? 44 : 32));
    const downloadEvent = f.page.waitForEvent('download'); await button.click();
    const download = await downloadEvent;
    assert.equal(download.suggestedFilename(), 'jpx-config-18.json');
    assert.deepEqual(JSON.parse(fs.readFileSync(await download.path(), 'utf8')), envelope('Store configuration 18').config);
    assert.equal(await search.inputValue(), 'configuration 1');
    assert.equal(await stage.evaluate(node => node.scrollTop), scroll, 'download keeps the catalog position');
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), native);
    assert.deepEqual(await f.page.evaluate(() => __fullStore.library()), library);
    assert.equal(await button.isEnabled(), true);
    await assertClean(f);
});

test('catalog download rejects a mismatched file and leaves the button available to retry', async t => {
    const f = await fixture(t); await enterStore(f.page);
    const downloads = []; f.page.on('download', value => downloads.push(value));
    const native = await f.page.evaluate(() => __fullStore.native());
    await f.page.evaluate(() => {
        const request = __transport.request;
        __transport.request = function(scriptId, options) {
            if (options.url.includes('/catalog/configs/')) return request.call(this, scriptId, {
                ...options, onload: response => options.onload({ ...response, responseText: response.responseText + ' ' })
            });
            return request.call(this, scriptId, options);
        };
    });
    const button = f.page.locator('[data-store-id="1"] .jpx-store-download'); await button.click();
    await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.match(await f.page.locator('.jpx-store-status').textContent(), /integrity check/);
    assert.equal(downloads.length, 0);
    assert.equal(await button.isEnabled(), true); assert.equal(await button.getAttribute('aria-busy'), null);
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), native);
    await assertClean(f);
});

test('catalog search reuses ordering until the sort selection changes', async t => {
    const f = await fixture(t, { count: 120 });
    await f.page.evaluate(() => {
        const sort = Array.prototype.sort; window.__catalogSorts = 0;
        Array.prototype.sort = function(compare) {
            if (this[0]?.entry?.id) __catalogSorts++;
            return sort.call(this, compare);
        };
    });
    await enterStore(f.page);
    const search = f.page.locator('.jpx-store-querybar input');
    for (const query of ['c', 'co', 'con', 'config', 'configuration']) await search.fill(query);
    assert.equal(await f.page.evaluate(() => __catalogSorts), 1, 'typing does not sort the same catalog again');
    await f.page.locator('[data-store-sort]').selectOption('name');
    assert.equal(await f.page.evaluate(() => __catalogSorts), 2);
    await search.fill('configuration 1');
    assert.equal(await f.page.evaluate(() => __catalogSorts), 2);
    assert.deepEqual((await visibleStoreIds(f.page)).slice(0, 4), [1, 10, 11, 12]);
    await assertClean(f);
});

test('store search combines localized metadata, authors and normalized words without network requests', async t => {
    const f = await fixture(t, { records: discoveryRecords(), language: 'ZhTrans' }); await enterStore(f.page);
    const search = f.page.locator('.jpx-store-querybar input'), calls = await f.page.evaluate(() => __transport.calls.length);
    for (const [query, ids] of [['@LINA ｉｔｅｍ', [1]], ['异世界 双手战法', [2]], ['２Ｈ mage', [2]], ['lina shared', [3]]]) {
        await search.fill(query); assert.deepEqual(await visibleStoreIds(f.page), ids, query);
        assert.equal(await search.evaluate(node => node === document.activeElement), true, 'typing keeps focus');
    }
    await search.fill('nothing-matches-this'); assert.deepEqual(await visibleStoreIds(f.page), []);
    await f.page.locator('.jpx-store-list .jpx-store-empty button').click();
    assert.equal(await search.inputValue(), ''); assert.equal((await visibleStoreIds(f.page)).length, 7);
    assert.equal(await f.page.evaluate(() => __transport.calls.length), calls);
    await assertClean(f);
});

test('store filters combine world, style and scene, include shared worlds and clear inapplicable fields', async t => {
    const f = await fixture(t, { records: discoveryRecords() }); await enterStore(f.page);
    const filter = key => f.page.locator(`[data-store-filter="${key}"]`);
    const original = await f.page.evaluate(() => __fullStore.native());
    assert.deepEqual(await filter('world').locator('option').evaluateAll(options => options.map(option => option.value)), ['', 'Persistent', 'Isekai']);
    await filter('world').selectOption('Isekai'); assert.deepEqual(await visibleStoreIds(f.page), [6, 2, 3, 7, 4]);
    await filter('style').selectOption('OneHanded'); await filter('battleType').selectOption('General');
    assert.deepEqual(await visibleStoreIds(f.page), [3]);
    await filter('kind').selectOption('stats'); assert.deepEqual(await visibleStoreIds(f.page), [6]);
    assert.equal(await filter('style').isDisabled(), true); assert.equal(await filter('style').inputValue(), '');
    assert.equal(await filter('battleType').inputValue(), '');
    await filter('kind').selectOption('battle'); assert.deepEqual(await visibleStoreIds(f.page), [7]);
    await filter('kind').selectOption(''); await filter('world').selectOption('Persistent');
    assert.deepEqual(await visibleStoreIds(f.page), [6, 3, 5, 1]);
    await f.page.locator('.jpx-store-clear').click(); assert.equal((await visibleStoreIds(f.page)).length, 7);
    await filter('style').selectOption('NitenIchiryu');
    const longLabel = await filter('style').evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth, height: node.getBoundingClientRect().height }));
    assert.ok(longLabel.scroll <= longLabel.width + 1 && longLabel.height <= 34, 'long selected labels stay inside one control: ' + JSON.stringify(longLabel));
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), original, 'discovery cannot apply or alter configs');
    await assertClean(f);
});

test('store sort and refresh preserve filters and use genuine update timestamps', async t => {
    const f = await fixture(t, { records: discoveryRecords() }); await enterStore(f.page);
    assert.deepEqual(await visibleStoreIds(f.page), [6, 2, 3, 7, 5, 1, 4]);
    await f.page.locator('[data-store-sort]').selectOption('name');
    assert.deepEqual(await visibleStoreIds(f.page), [4, 7, 6, 2, 3, 1, 5]);
    await f.page.locator('[data-store-filter="world"]').selectOption('Isekai');
    await f.page.locator('.jpx-store-results').getByRole('button', { name: 'Refresh', exact: true }).click();
    await f.page.locator('.jpx-store-row[data-store-id="4"]').waitFor();
    assert.deepEqual(await visibleStoreIds(f.page), [4, 7, 6, 2, 3]);
    assert.equal(await f.page.locator('[data-store-sort]').inputValue(), 'name');
    assert.equal(await f.page.locator('.jpx-store-row[data-store-id="4"] time').getAttribute('datetime'), '2026-11-01T00:00:00Z');
    assert.equal((await f.page.evaluate(() => __transport.calls)).filter(call => call.url.includes('/catalog/index.json')).length, 2);
    await assertClean(f);
});

test('store renders bounded batches and restores filters, focus and scroll after details', async t => {
    const f = await fixture(t, { count: 90 }); await enterStore(f.page);
    const original = await f.page.evaluate(() => __fullStore.native());
    await f.page.locator('[data-store-sort]').selectOption('name');
    await f.page.locator('.jpx-store-querybar input').fill('store');
    assert.equal((await visibleStoreIds(f.page)).length, 30);
    assert.equal(await f.page.locator('.jpx-store-result-count').textContent(), '90 found');
    await f.page.getByRole('button', { name: 'Show more', exact: true }).click();
    assert.equal((await visibleStoreIds(f.page)).length, 60);
    const title = f.page.locator('[data-store-id="40"] .jpx-store-title');
    await title.scrollIntoViewIfNeeded();
    const stage = f.page.locator('.jpx-store-stage'), position = await stage.evaluate(node => node.scrollTop);
    await title.click(); await f.page.locator('.jpx-store-actions').getByRole('button', { name: 'Save', exact: true }).waitFor();
    await f.page.locator('.jpx-store-back').click(); await title.waitFor();
    assert.equal(await f.page.locator('.jpx-store-querybar input').inputValue(), 'store');
    assert.equal(await f.page.locator('[data-store-sort]').inputValue(), 'name');
    assert.equal((await visibleStoreIds(f.page)).length, 60);
    assert.ok(Math.abs(await stage.evaluate(node => node.scrollTop) - position) <= 1);
    assert.equal(await title.evaluate(node => node === document.activeElement), true);
    assert.equal(await f.page.evaluate(() => __transport.calls.length), 2, 'local filtering and paging make no network requests');
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), original); await assertClean(f);
});

async function assertTabLines(page, mobile) {
    const bounds = await page.locator('.jpx-config-toolbar').evaluate(header => {
        return [...header.querySelectorAll('.jpx-config-nav button,.jpx-store-navigation button')].map(node => {
            const range = document.createRange(); range.selectNodeContents(node);
            return { bottom: node.getBoundingClientRect().bottom, text: range.getBoundingClientRect().bottom,
                line: (header.closest('.jpx-settings-mobile') ? node.parentElement : header).getBoundingClientRect().bottom };
        });
    });
    assert.ok(bounds.every(item => Math.abs(item.bottom - item.line) < 1), JSON.stringify(bounds));
    assert.ok(bounds.every(item => Math.abs(item.text - bounds[0].text) < 1), 'all header tab text shares a baseline: ' + JSON.stringify(bounds));
}

for (const mobile of [false, true]) for (const signedIn of [false, true]) test(`management navigation and filter bands do not jump between views, ${mobile ? 'mobile' : 'desktop'} ${signedIn ? 'signed in' : 'signed out'}`, async t => {
    const f = await fixture(t, { mobile, records: discoveryRecords(), language: 'ZhTrans', signedIn });
    const layout = () => f.page.locator('.jpx-config-manager').evaluate(root => {
        const box = selector => { const node = root.querySelector(selector); if (!node) return null;
            const { x, y, width, height } = node.getBoundingClientRect(); return { x, y, width, height }; };
        return { header: box('.jpx-config-toolbar'), tabs: box('.jpx-config-nav'),
            filters: box('.jpx-store-filter-grid'), results: box('.jpx-store-results'),
            band: box('.jpx-store-browse-header'), first: box('.jpx-config-row,.jpx-store-row') };
    });
    if (mobile) await f.page.locator('.jpx-store-filter-toggle').click();
    const local = await layout();
    await enterStore(f.page);
    if (mobile) await f.page.locator('.jpx-store-filter-toggle').click();
    const browse = await layout();
    await f.page.locator('.jpx-store-navigation button').click();
    const shared = await layout();
    const search = f.page.locator('.jpx-store-querybar input');
    if (signedIn) {
        await f.page.locator('.jpx-store-row').first().waitFor();
        await search.fill('Shield');
        assert.equal(await f.page.locator('.jpx-store-row:visible').count(), 2, 'shared search filters saved submissions locally');
        await f.page.locator('.jpx-store-refresh').click();
        await f.page.locator('.jpx-store-row:visible').first().waitFor();
        assert.equal(await search.inputValue(), 'Shield');
        assert.equal(await f.page.locator('.jpx-store-row:visible').count(), 2);
        assert.deepEqual((await layout()).header, shared.header, 'shared refresh preserves the header');
    } else assert.equal(await search.isDisabled(), true);
    await f.page.locator('.jpx-store-navigation button').click();
    await f.page.locator('.jpx-store-title').first().waitFor();
    const returned = await layout(), detail = JSON.stringify({ local, browse, shared, returned });
    for (const key of ['header', 'tabs']) assert.deepEqual(shared[key], browse[key], key + ' stays fixed in Shared: ' + detail);
    for (const key of ['filters', 'band']) assert.deepEqual(browse[key], local[key], key + ' matches between local and store: ' + detail);
    assert.equal(browse.first.y, local.first.y, 'list content starts on the same line');
    assert.deepEqual(returned, browse, 'returning restores the same geometry');
    await assertClean(f);
});

for (const mobile of [false, true]) test(`catalog loading and refreshing keep filters in place, ${mobile ? 'mobile' : 'desktop'}`, async t => {
    const f = await fixture(t, { mobile, records: discoveryRecords() });
    await f.page.evaluate(() => {
        const request = __transport.request;
        window.__catalogDeliveries = [];
        __transport.request = function(scriptId, options) {
            if (options.url.includes('/catalog/index.json')) return request.call(this, scriptId, {
                ...options, onload: response => __catalogDeliveries.push(fail => fail ? options.onerror({}) : options.onload(response))
            });
            return request.call(this, scriptId, options);
        };
    });
    await f.page.locator('.jpx-config-nav button').last().click();
    if (mobile) await f.page.locator('.jpx-store-filter-toggle').click();
    const filters = f.page.locator('[data-store-filter]'), refresh = f.page.locator('.jpx-store-refresh');
    const bounds = () => filters.evaluateAll(nodes => nodes.map(node => {
        const { x, y, width, height } = node.getBoundingClientRect(); return { x, y, width, height };
    }));
    const initial = await bounds();
    const release = async fail => {
        await f.page.waitForFunction(() => __catalogDeliveries.length > 0);
        await f.page.evaluate(fail => __catalogDeliveries.shift()(fail), fail);
        await f.page.waitForFunction(() => !document.querySelector('.jpx-store-refresh').hasAttribute('aria-busy'));
    };
    await release(false); await f.page.locator('.jpx-store-title').first().waitFor();
    assert.deepEqual(await bounds(), initial, 'initial loading does not move or resize filters');
    await filters.first().selectOption('Isekai');
    const before = await bounds();
    await filters.first().evaluate(node => { window.__originalFilter = node; });
    for (const fail of [false, true, false]) {
        await refresh.click();
        assert.equal(await refresh.getAttribute('aria-busy'), 'true');
        assert.deepEqual(await bounds(), before, 'loading keeps the filter geometry');
        assert.equal(await f.page.locator('.jpx-store-status').isVisible(), false);
        await release(fail);
        assert.deepEqual(await bounds(), before, 'success and failure keep the filter geometry');
        assert.equal(await filters.first().evaluate(node => node === __originalFilter), true, 'refresh reuses the existing controls');
        assert.equal(await filters.first().inputValue(), 'Isekai');
        assert.equal(await refresh.isEnabled(), true);
    }
    await assertClean(f);
});

for (const mobile of [false, true]) for (const dark of [false, true]) test(`store discovery keeps fixed controls and fits ${mobile ? 'mobile' : 'desktop'} ${dark ? 'dark' : 'light'}`, async t => {
    const f = await fixture(t, { mobile, records: discoveryRecords(), language: mobile || dark ? 'ZhTrans' : 'en' });
    if (dark) await f.page.evaluate(() => __fullStore.theme());
    const navigation = f.page.locator('.jpx-config-manager > .jpx-config-toolbar .jpx-config-nav button');
    const bounds = () => navigation.evaluateAll(buttons => buttons.map(button => {
        const { x, y, width, height } = button.getBoundingClientRect();
        return { label: button.textContent, x, y, width, height };
    }));
    const beforeSwitch = await bounds();
    const assertStableTabs = async () => {
        const afterSwitch = await bounds();
        for (let index = 0; index < beforeSwitch.length; index++) for (const key of ['x', 'y', 'width', 'height']) {
            assert.ok(Math.abs(afterSwitch[index][key] - beforeSwitch[index][key]) <= .5,
                `navigation must stay still: ${JSON.stringify({ beforeSwitch, afterSwitch })}`);
        }
    };
    await enterStore(f.page);
    await assertStableTabs();
    await assertTabLines(f.page, mobile);
    await navigation.first().click();
    await f.page.locator('.jpx-config-list').waitFor();
    await assertStableTabs();
    await enterStore(f.page);
    await assertStableTabs();
    assert.equal(await f.page.locator('.jpx-config-store-header > .jpx-store-querybar').count(), 1, 'search shares the manager header');
    assert.equal(await f.page.locator('.jpx-store-navigation button').count(), 1, 'Store already opens browsing; no duplicate Browse tab');
    const topBounds = await f.page.locator('.jpx-config-store-header').boundingBox();
    assert.ok(topBounds.height <= (mobile ? 120 : 52), 'navigation and search use one desktop row or two touch-sized phone rows');
    const filters = f.page.locator('.jpx-store-filter-grid'), toggle = f.page.locator('.jpx-store-filter-toggle');
    assert.equal(await f.page.locator('.jpx-store-results').evaluate(node => node.parentElement.classList.contains('jpx-store-view-header')), true);
    if (!mobile) assert.ok((await f.page.locator('.jpx-store-view-header').boundingBox()).height <= 50, 'desktop filters and sorting share one padded row');
    const assertFits = async () => {
        const layout = await f.page.locator('.jpx-config-manager').evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth,
            controls: [...node.querySelectorAll('.jpx-config-toolbar input,.jpx-config-toolbar button,.jpx-store-view-header select,.jpx-store-view-header button')].filter(n => n.getClientRects().length).map(n => {
                const r=n.getBoundingClientRect(), scale=visualViewport?.scale || 1, left=visualViewport?.offsetLeft || 0;
                return { left:(r.left-left)*scale,right:(r.right-left)*scale,height:r.height*scale };
            }), viewport: innerWidth }));
        assert.ok(layout.scroll <= layout.width + 1);
        assert.ok(layout.controls.every(r => r.left >= 0 && r.right <= f.page.viewportSize().width + 1));
        if (mobile) assert.ok(layout.controls.every(r => r.height >= 43.9), JSON.stringify(layout));
    };
    await assertFits();
    if (mobile) {
        assert.equal(await filters.isVisible(), false); await toggle.click(); assert.equal(await filters.isVisible(), true);
        await f.page.locator('[data-store-filter="world"]').selectOption('Isekai');
        assert.equal(await toggle.textContent(), '筛选 (1)'); await assertFits();
        await f.page.screenshot({ path: path.join(root, `.test-output/config-management/store-mobile-${dark ? 'dark' : 'light'}-filters.png`) });
        await f.page.locator('[data-store-filter="world"]').press('Escape');
        assert.equal(await filters.isVisible(), false); assert.equal(await f.page.locator('#settings-container').isVisible(), true);
        assert.equal(await toggle.evaluate(node => node === document.activeElement), true);
    } else assert.equal(await toggle.isVisible(), false);
    await f.page.screenshot({ path: path.join(root, `.test-output/config-management/store-${mobile ? 'mobile' : 'desktop'}-${dark ? 'dark' : 'light'}.png`) });
    await f.page.locator('.jpx-store-navigation button').click();
    await assertTabLines(f.page, mobile);
    await f.page.screenshot({ path: path.join(root, `.test-output/config-management/shared-${mobile ? 'mobile' : 'desktop'}-${dark ? 'dark' : 'light'}.png`) });
    await f.page.locator('.jpx-store-navigation button').click();
    const header = f.page.locator('.jpx-store-view-header'), before = await header.boundingBox();
    await f.page.locator('.jpx-store-stage').evaluate(node => { node.scrollTop = node.scrollHeight; });
    assert.equal((await header.boundingBox()).y, before.y);
    if (mobile) {
        await f.page.setViewportSize({ width: 812, height: 375 });
        await f.page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await assertFits();
    }
    await assertClean(f);
});

test('shared header preserves search across resizing and shared view, and cancels login when leaving', async t => {
    const f = await fixture(t, { records: discoveryRecords() }); await enterStore(f.page);
    const search = f.page.locator('.jpx-store-querybar input');
    const native = await f.page.evaluate(() => __fullStore.native());
    await search.fill('shield'); await search.focus();
    for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 960 }]) {
        await f.page.setViewportSize(viewport);
        await f.page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await search.inputValue(), 'shield');
        assert.equal(await search.evaluate(node => node === document.activeElement), true);
        assert.deepEqual(await visibleStoreIds(f.page), [3, 1]);
    }
    const shared = f.page.locator('.jpx-store-navigation').getByRole('button', { name: 'Shared', exact: true });
    await shared.click(); await f.page.getByText('Sign in to GitHub to manage your shared configs.').waitFor();
    assert.equal(await search.count(), 1); assert.equal(await search.isDisabled(), true); assert.equal(await shared.getAttribute('aria-pressed'), 'true');
    await shared.click(); await f.page.locator('.jpx-store-title').first().waitFor();
    assert.equal(await search.inputValue(), 'shield'); assert.deepEqual(await visibleStoreIds(f.page), [3, 1]);
    await f.page.locator('.jpx-store-account').getByRole('button', { name: 'Sign in', exact: true }).click();
    await f.page.waitForFunction(() => __transport.calls.some(call => call.url.endsWith('/login/device/code')));
    await f.page.locator('.jpx-config-nav').getByRole('button', { name: 'My configs', exact: true }).click();
    await f.page.waitForFunction(() => __transport.aborted.some(call => call.url.endsWith('/login/device/code')));
    assert.equal(await f.page.locator('.jpx-store-toolbar').count(), 0);
    assert.equal(await f.page.locator('.jpx-store-querybar').count(), 1, 'the local list owns its own search and filters');
    await f.page.locator('.jpx-store-querybar input').fill('Local search');
    await f.page.locator('[data-config-filter=world]').selectOption('Isekai');
    await f.page.locator('[data-config-sort]').selectOption('name');
    await enterStore(f.page);
    assert.equal(await f.page.locator('.jpx-store-toolbar').count(), 1);
    assert.equal(await f.page.locator('.jpx-store-querybar').count(), 1);
    await f.page.locator('.jpx-config-nav').getByRole('button', { name: 'My configs', exact: true }).click();
    assert.equal(await f.page.locator('.jpx-store-querybar input').inputValue(), 'Local search');
    assert.equal(await f.page.locator('[data-config-filter=world]').inputValue(), 'Isekai');
    assert.equal(await f.page.locator('[data-config-sort]').inputValue(), 'name');
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), native);
    await assertClean(f);
});

test('store filters fit the other language packs on a small phone with larger text', async t => {
    for (const language of ['ZhTW', 'ZhHK', 'Ja', 'Ko']) {
        const f = await fixture(t, { mobile: true, language, records: discoveryRecords() });
        await f.page.evaluate(() => __fullStore.theme()); await enterStore(f.page);
        await f.page.addStyleTag({ content: '#settings-container .jpx-config-manager{font-size:16px} #settings-container .jpx-store{font-size:inherit} #settings-container .jpx-store-result-count{font-size:15px}' });
        await f.page.locator('.jpx-store-filter-toggle').click();
        await f.page.locator('[data-store-filter="world"]').selectOption('Isekai');
        const overflow = await f.page.locator('.jpx-store-view-header').evaluate(node => {
            const scale=visualViewport?.scale || 1;
            return { width: node.clientWidth, scroll: node.scrollWidth,
                overflowing: [...node.querySelectorAll('*')].filter(n=>n.getClientRects().length && n.scrollWidth>n.clientWidth+1).map(n=>({tag:n.tagName,cls:n.className,text:n.tagName==='SELECT'?n.selectedOptions[0]?.textContent:n.textContent.slice(0,35),width:n.clientWidth,scroll:n.scrollWidth})),
                right: Math.max(...[...node.querySelectorAll('button,input,select')].filter(n=>n.getClientRects().length).map(n=>n.getBoundingClientRect().right*scale)) };
        });
        assert.ok(overflow.scroll <= overflow.width + 1 && overflow.right <= 375, language + ': ' + JSON.stringify(overflow));
        if (language === 'Ja') await f.page.screenshot({ path: path.join(root, '.test-output/config-management/store-mobile-ja-dark.png') });
        await assertClean(f);
    }
});

for (const oldFirst of [true, false]) test('full core migrates separate legacy GM archive with ' + (oldFirst ? 'plugin first' : 'main first'), { timeout: 30000 }, async t => {
    const f = await fixture(t, { oldFirst });
    assert.deepEqual(await f.page.evaluate(() => __transport.snapshots.legacy()), oldStorage, 'source archive and token are untouched');
    assert.deepEqual(await f.page.evaluate(() => __transport.snapshots.main()), [], 'credentials and archives are not copied to the main GM store');
    const current = await f.page.evaluate(() => __fullStore.library());
    for (const before of legacyRecords) {
        const after = current.entries.find(entry => entry.id === before.id);
        assert.deepEqual(after.envelope, before.envelope); assert.equal(after.createdAt, before.savedAt);
    }
    await f.page.evaluate(() => window.dispatchEvent(new Event('jpx:legacy-config-request')));
    assert.equal((await f.page.evaluate(() => __fullStore.library())).entries.length, current.entries.length, 'repeated handoff does not duplicate archives');
    assert.equal(await f.page.locator('#tab_configStore').count(), 0);
    assert.equal(await f.page.locator('#tab_configManager').count(), 1);
    assert.equal(await f.page.evaluate(() => JSON.stringify(Object.entries(localStorage)).includes('fixture_legacy_secret_never_migrate')), false);
    assert.equal(await f.page.evaluate(() => window.jpxConfigStore !== undefined || window.jpxEmbeddedStore !== undefined || window.JPXPlus.service !== undefined), false);
    assert.deepEqual(await f.page.evaluate(() => __transport.calls), [], 'migration and local management never use old credentials for requests');
    await assertClean(f);
});

for (const mobile of [false, true]) test('full core store saves without applying and keeps compact scroll layout ' + (mobile ? 'mobile dark' : 'desktop light'), { timeout: 45000 }, async t => {
    const f = await fixture(t, { mobile, count: 25 });
    if (mobile) await f.page.evaluate(() => __fullStore.theme());
    const native = await f.page.evaluate(() => __fullStore.native());
    await enterStore(f.page);
    const store = f.page.locator('.jpx-store'), stage = store.locator('.jpx-store-stage');
    const before = await f.page.locator('.jpx-store-toolbar').boundingBox();
    await stage.evaluate(node => { node.scrollTop = node.scrollHeight; });
    const after = await f.page.locator('.jpx-store-toolbar').boundingBox();
    assert.equal(after.y, before.y, 'toolbar stays fixed while catalog scrolls');
    assert.ok(await stage.evaluate(node => node.scrollTop > 0), 'catalog has a usable scroll area');
    const layout = await store.evaluate(node => { const box = node.getBoundingClientRect(); const panel = node.closest('[role="tabpanel"]'); return { left: box.left, right: box.right, screen: innerWidth, panel: panel.clientWidth, scroll: panel.scrollWidth }; });
    assert.ok(layout.left >= -1 && layout.right <= layout.screen + 1, JSON.stringify(layout));
    assert.ok(layout.scroll <= layout.panel + 1, 'no horizontal overflow');
    await stage.evaluate(node => { node.scrollTop = 0; });
    await store.getByRole('button', { name: 'Store configuration 1', exact: true }).click();
    await store.getByRole('button', { name: 'Save', exact: true }).click();
    await store.getByRole('button', { name: 'Saved', exact: true }).waitFor();
    const saved = await f.page.evaluate(() => __fullStore.library().entries.find(entry => entry.source?.id === 1));
    assert.deepEqual(saved.envelope, envelope('Store configuration 1'));
    assert.equal(saved.source.repository, 'MeiYongAI/JPX-PLUS-Configs'); assert.equal(saved.source.author, 'fixtureauthor');
    assert.deepEqual(await f.page.evaluate(() => __fullStore.native()), native, 'store save changes only the library');
    await store.getByRole('button', { name: 'Saved', exact: true }).click();
    await f.page.locator('.jpx-config-confirm').getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal((await f.page.evaluate(() => __fullStore.library().entries.filter(entry => entry.source?.id === 1))).length, 1);
    await f.page.locator('.jpx-config-manager > .jpx-config-toolbar .jpx-config-nav').getByRole('button', { name: 'My configs', exact: true }).click();
    await f.page.locator('.jpx-config-row').filter({ hasText: 'Store configuration 1' }).first().waitFor();
    assert.equal(await f.page.locator('.jpx-store').count(), 0, 'My configs disposes the embedded store');
    await assertClean(f);
});

test('leaving the outer settings tab aborts authorization and returning restores the share draft', { timeout: 40000 }, async t => {
    const f = await fixture(t);
    const row = f.page.locator('[data-config-id="native-Persistent-OneHanded_General"]');
    await row.getByRole('button', { name: /^More/ }).click();
    await f.page.locator('.jpx-config-menu').getByRole('button', { name: 'Share', exact: true }).click();
    const share = f.page.locator('[data-store-editor="share"]');
    await share.getByLabel('Title', { exact: true }).fill('Keep this share title');
    await share.getByLabel('Description', { exact: true }).fill('Keep these share details');
    await share.getByRole('button', { name: 'Submit for review', exact: true }).click();
    await f.page.waitForFunction(() => __transport.calls.some(call => call.url.endsWith('/login/device/code')));
    await tab(f.page, 'stats');
    await f.page.waitForFunction(() => __transport.aborted.some(call => call.url.endsWith('/login/device/code')));
    await tab(f.page, 'configManager');
    await share.waitFor();
    assert.equal(await share.getByLabel('Title', { exact: true }).inputValue(), 'Keep this share title');
    assert.equal(await share.getByLabel('Description', { exact: true }).inputValue(), 'Keep these share details');
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.url.endsWith('/login/device/code')).length), 1, 'showing the draft never automatically restarts login');
    await share.getByRole('button', { name: 'Submit for review', exact: true }).click();
    await f.page.waitForFunction(() => __transport.calls.filter(call => call.url.endsWith('/login/device/code')).length === 2);
    await f.page.locator('#close-button').click();
    await f.page.waitForFunction(() => __transport.aborted.filter(call => call.url.endsWith('/login/device/code')).length === 2);
    await assertClean(f);
});

test('mobile store detail and sharing reuse the single settings-header Back', { timeout: 45000 }, async t => {
    const f = await fixture(t, { mobile: true }), back = f.page.locator('#close-button');
    await f.page.locator('.jpx-config-nav').getByRole('button', { name: 'Store', exact: true }).click();
    const store = f.page.locator('.jpx-store');
    await store.getByRole('button', { name: 'Store configuration 1', exact: true }).click();
    await store.getByRole('button', { name: 'Save', exact: true }).waitFor();
    assert.equal(await store.locator('.jpx-store-back').isVisible(), false);
    await back.click(); await store.getByRole('button', { name: 'Store configuration 1', exact: true }).waitFor();
    assert.equal(await f.page.locator('#settings-container').isVisible(), true);
    await f.page.locator('.jpx-config-nav').getByRole('button', { name: 'My configs', exact: true }).click();
    await f.page.locator('[data-config-id="native-Persistent-OneHanded_General"]').getByRole('button', { name: /^More/ }).click();
    await f.page.locator('.jpx-config-menu').getByRole('button', { name: 'Share', exact: true }).click();
    await f.page.locator('[data-store-editor="share"]').waitFor();
    assert.equal(await store.locator('.jpx-store-back').isVisible(), false);
    await back.click(); await f.page.locator('.jpx-config-row').first().waitFor();
    assert.equal(await store.count(), 0);
    await assertClean(f);
});

async function enterShared(f) {
    await enterStore(f.page);
    await f.page.locator('.jpx-store-navigation button').click();
    await f.page.locator('.jpx-store-row[data-shared-id],.jpx-store-empty').first().waitFor();
}
const sharedRow = (page, id) => page.locator('.jpx-store-row[data-shared-id="' + id + '"]');
async function confirmRemove(page) {
    await page.getByRole('dialog', { name: 'Remove from list', exact: true })
        .getByRole('button', { name: 'Remove from list', exact: true }).click();
}

for (const mobile of [false, true]) test(`withdrawn share removal preserves configuration, search and list position, ${mobile ? 'mobile dark' : 'desktop light'}`, async t => {
    const shareOverrides = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, { state: i ? 'closed' : 'open' }]));
    const f = await fixture(t, { mobile, count: 12, signedIn: true, shareOverrides });
    if (mobile) await f.page.evaluate(() => __fullStore.theme());
    await enterShared(f);
    const original = await f.page.evaluate(() => ({ native: __fullStore.native(), library: __fullStore.library(), issue: __transport.issues[7] }));
    const query = f.page.locator('.jpx-store-querybar input'); await query.fill('Store configuration');
    const row = sharedRow(f.page, 7), remove = row.getByRole('button', { name: 'Remove from list', exact: true });
    await remove.scrollIntoViewIfNeeded();
    const listRequests = await f.page.evaluate(() => __transport.calls.filter(call => call.url.includes('/issues?')).length);
    const scroll = await f.page.locator('.jpx-store-stage').evaluate(node => node.scrollTop); assert.ok(scroll > 0);
    await remove.click();
    const dialog = f.page.locator('.jpx-config-confirm'); await dialog.waitFor();
    assert.ok((await dialog.textContent()).includes('GitHub record and local configs will stay'));
    await f.page.keyboard.press('Escape'); await dialog.waitFor({ state: 'detached' });
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    await remove.focus(); await f.page.keyboard.press('Enter'); await confirmRemove(f.page);
    await row.waitFor({ state: 'detached' });
    const after = await f.page.evaluate(() => ({ native: __fullStore.native(), library: __fullStore.library(), issue: __transport.issues[7], calls: __transport.calls }));
    assert.deepEqual(after.native, original.native); assert.deepEqual(after.library, original.library);
    assert.equal(after.issue.body, original.issue.body.replace('<!-- JPX-PLUS-CONFIG:v1 -->', '<!-- JPX-PLUS-CONFIG-ARCHIVED:v1 -->'));
    assert.equal(after.issue.state, 'closed'); assert.equal(after.issue.title, original.issue.title);
    assert.equal(after.calls.filter(call => call.method === 'PATCH').length, 1);
    assert.equal(after.calls.filter(call => call.url.includes('/issues?')).length, listRequests, 'remove does not reload the list');
    assert.equal(await query.inputValue(), 'Store configuration');
    assert.ok(await f.page.locator('.jpx-store-stage').evaluate(node => node.scrollTop > 0), 'list does not jump to the top');
    assert.equal(await f.page.evaluate(() => document.activeElement.closest('[data-shared-id]')?.dataset.sharedId), '8');
    await f.page.locator('.jpx-store-refresh').click(); await sharedRow(f.page, 1).waitFor();
    assert.equal(await row.count(), 0, 'server-side archive marker survives a refresh');
    await sharedRow(f.page, 1).scrollIntoViewIfNeeded();
    const output = path.join(root, '.test-output/shared-record-management-preview'); fs.mkdirSync(output, { recursive: true });
    await f.page.screenshot({ path: path.join(output, mobile ? 'mobile-dark.png' : 'desktop-light.png') });
    await assertClean(f);
});

test('active shares can be withdrawn, then removed through the same themed confirmation', async t => {
    const f = await fixture(t, { signedIn: true }); await enterShared(f);
    const row = sharedRow(f.page, 1);
    assert.equal(await row.getByRole('button', { name: 'Remove from list', exact: true }).count(), 0);
    await row.getByRole('button', { name: 'Withdraw', exact: true }).click();
    await f.page.locator('.jpx-config-confirm').getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal(await f.page.evaluate(() => __transport.issues[1].state), 'open');
    await row.getByRole('button', { name: 'Withdraw', exact: true }).click();
    await f.page.locator('.jpx-config-confirm').getByRole('button', { name: 'Withdraw', exact: true }).click();
    await row.getByRole('button', { name: 'Remove from list', exact: true }).waitFor();
    assert.equal(await row.getByRole('button', { name: 'Update', exact: true }).count(), 0);
    await row.getByRole('button', { name: 'Remove from list', exact: true }).click(); await confirmRemove(f.page);
    await f.page.getByText('No shared configs.', { exact: true }).waitFor();
    assert.equal(await f.page.locator('[data-shared-id]').count(), 0);
    assert.equal(await f.page.evaluate(() => document.activeElement.type), 'search');
    await assertClean(f);
});

test('failed archive keeps the record manageable and permits retry', async t => {
    const f = await fixture(t, { signedIn: true, shareOverrides: { 1: { state: 'closed' } } }); await enterShared(f);
    const remove = sharedRow(f.page, 1).getByRole('button', { name: 'Remove from list', exact: true });
    const body = await f.page.evaluate(() => __transport.issues[1].body);
    await f.page.evaluate(() => { __transport.failPatch = true; });
    await remove.click(); await confirmRemove(f.page);
    await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.equal(await remove.isEnabled(), true); assert.equal(await f.page.evaluate(() => __transport.issues[1].body), body);
    await f.page.evaluate(() => { __transport.failPatch = false; });
    await remove.click(); await confirmRemove(f.page); await remove.waitFor({ state: 'detached' });
    assert.equal(await f.page.locator('.jpx-store-status').isVisible(), false);
    await assertClean(f);
});

for (const change of ['owner', 'state', 'marker']) test(`archive rejects a stale ${change} before any write`, async t => {
    const f = await fixture(t, { signedIn: true, shareOverrides: { 1: { state: 'closed' } } }); await enterShared(f);
    await f.page.evaluate(change => {
        const issue = __transport.issues[1];
        if (change === 'owner') issue.user.id = 99;
        else if (change === 'state') issue.state = 'open';
        else issue.body = 'Unrelated issue';
    }, change);
    await sharedRow(f.page, 1).getByRole('button', { name: 'Remove from list', exact: true }).click(); await confirmRemove(f.page);
    await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    assert.equal(await sharedRow(f.page, 1).count(), 1);
    await assertClean(f);
});

test('archived records stay absent in a fresh browser and script storage', async t => {
    const f = await fixture(t, { signedIn: true, shareOverrides: { 1: { state: 'closed' } } }); await enterShared(f);
    await sharedRow(f.page, 1).getByRole('button', { name: 'Remove from list', exact: true }).click(); await confirmRemove(f.page);
    await f.page.getByText('No shared configs.', { exact: true }).waitFor();
    const issue = await f.page.evaluate(() => __transport.issues[1]);
    const next = await fixture(t, { signedIn: true, shareOverrides: { 1: issue } }); await enterShared(next);
    await next.page.getByText('No shared configs.', { exact: true }).waitFor();
    assert.equal(await next.page.locator('[data-shared-id]').count(), 0);
    assert.equal(await next.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    await assertClean(f); await assertClean(next);
});

test('shared management controls fit narrow and wide layouts without new styles', async t => {
    const f = await fixture(t, { signedIn: true, shareOverrides: { 1: { state: 'closed' } }, language: 'ZhTrans' }); await enterShared(f);
    for (const width of [320, 768, 1024, 1440]) {
        await f.page.setViewportSize({ width, height: 900 });
        const row = sharedRow(f.page, 1); await row.waitFor();
        const bounds = await row.evaluate(node => {
            const row = node.getBoundingClientRect();
            return { row: { left: row.left, right: row.right }, buttons: [...node.querySelectorAll('button')].map(button => {
                const box = button.getBoundingClientRect(); return { left: box.left, right: box.right, height: box.height, text: button.textContent };
            }) };
        });
        assert.ok(bounds.buttons.some(button => button.text === '移除记录'));
        assert.ok(bounds.buttons.every(button => button.left >= bounds.row.left - 1 && button.right <= bounds.row.right + 1), JSON.stringify({ width, bounds }));
    }
    await assertClean(f);
});

const updatedEnvelope = () => {
    const value = envelope('My improved two-handed rules', 'Isekai');
    value.description = 'Local-only notes'; value.scriptVersion = '2026.11.07.2';
    value.config.TwoHanded_General.supports[0].customMessage = 'Updated local rules';
    value.config.TwoHanded_General.attacks.push({ type: 'skill', name: 'Rending Blow', conditions: [{ key: 'monsters', value: [6, 10] }] });
    return value;
};
async function saveLocal(page, value = updatedEnvelope()) { return page.evaluate(value => __fullStore.saveLocal(value), value); }
async function openShareUpdate(f, id = 1) {
    await sharedRow(f.page, id).getByRole('button', { name: 'Update', exact: true }).click();
    await f.page.locator('[data-share-source]').waitFor();
    return f.page.locator('[data-store-editor="share"]');
}
const readSharedEnvelope = (page, id = 1) => page.evaluate(id => JSON.parse(__transport.issues[id].body.split('\n```json\n')[1].slice(0, -4)), id);

for (const mobile of [false, true]) test(`published rules update the original share and preserve local settings, ${mobile ? 'mobile dark' : 'desktop light'}`, async t => {
    const f = await fixture(t, { signedIn: true, mobile });
    const saved = await saveLocal(f.page); if (mobile) await f.page.evaluate(() => __fullStore.theme());
    await enterShared(f); const before = await f.page.evaluate(() => ({ native: __fullStore.native(), library: __fullStore.library(), issue: __transport.issues[1] }));
    const form = await openShareUpdate(f), source = form.locator('[data-share-source]');
    assert.equal(await source.inputValue(), '');
    await source.selectOption(saved.id);
    assert.equal(await form.getByLabel('Title', { exact: true }).inputValue(), 'Store configuration 1');
    assert.equal(await form.getByLabel('Description', { exact: true }).inputValue(), 'Offline store sample');
    assert.equal(await form.getByLabel('Applies to', { exact: true }).inputValue(), 'Any');
    await form.locator('.jpx-store-raw summary').click();
    assert.deepEqual(JSON.parse(await form.locator('.jpx-store-raw pre').textContent()), saved.envelope.config);
    await form.getByLabel('Title', { exact: true }).fill('Two-handed v2');
    await form.getByLabel('Description', { exact: true }).fill('Updated published description');
    await form.getByLabel('Applies to', { exact: true }).selectOption('Isekai');
    assert.match(await form.locator(':scope > .jpx-store-meta').first().textContent(), /Isekai/);
    const bounds = await source.evaluate(node => { const a = node.getBoundingClientRect(), b = node.closest('form').getBoundingClientRect(); return a.left >= b.left && a.right <= b.right + 1; });
    assert.equal(bounds, true);
    const output = path.join(root, '.test-output/shared-update-preview'); fs.mkdirSync(output, { recursive: true });
    await form.locator('.jpx-store-raw summary').click();
    await f.page.screenshot({ path: path.join(output, mobile ? 'mobile-dark.png' : 'desktop-light.png') });
    await form.getByRole('button', { name: 'Submit update', exact: true }).click();
    await sharedRow(f.page, 1).waitFor();
    assert.equal(await sharedRow(f.page, 1).locator('.jpx-store-badge').textContent(), 'In review');
    const after = await f.page.evaluate(() => ({ native: __fullStore.native(), library: __fullStore.library(), issues: __transport.issues, calls: __transport.calls }));
    assert.deepEqual(after.native, before.native); assert.deepEqual(after.library, before.library); assert.equal(Object.keys(after.issues).length, 1);
    const writes = after.calls.filter(call => ['POST', 'PATCH', 'DELETE'].includes(call.method));
    assert.equal(writes.length, 1); assert.equal(writes[0].method, 'PATCH'); assert.ok(writes[0].url.endsWith('/issues/1'));
    assert.deepEqual(await readSharedEnvelope(f.page), { ...saved.envelope, title: 'Two-handed v2', description: 'Updated published description', world: 'Isekai' });
    assert.equal(after.issues[1].html_url, before.issue.html_url);
    assert.equal(await f.page.locator('.jpx-store-status').isVisible(), false, 'submission feedback does not leave a permanent status block');
    const revision = createHash('sha256').update(JSON.stringify(await readSharedEnvelope(f.page)) + '\n').digest('hex');
    await f.page.evaluate(revision => {
        __transport.comments[1] = [{ user: { login: 'github-actions[bot]', type: 'Bot' }, body: '<!-- JPX-PLUS-REVIEW:v1 ' + JSON.stringify({ revision, status: 'published', summary: { en: 'Published', zh: '已上架' }, findings: [] }) + ' -->' }];
    }, revision);
    await f.page.locator('.jpx-store-refresh').click();
    await f.page.waitForFunction(() => document.querySelector('[data-shared-id="1"] .jpx-store-badge')?.textContent === 'Published version');
    await assertClean(f);
});

test('metadata-only edits and returning to the current share preserve its rules', async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const original = await readSharedEnvelope(f.page), form = await openShareUpdate(f);
    await form.getByLabel('Title', { exact: true }).fill('Metadata edit only');
    await form.locator('[data-share-source]').selectOption(saved.id);
    await form.locator('[data-share-source]').selectOption('');
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await sharedRow(f.page, 1).waitFor();
    assert.deepEqual(await readSharedEnvelope(f.page), { ...original, title: 'Metadata edit only' });
    await assertClean(f);
});

test('the update picker only offers saved entries of the original kind and mode', async t => {
    const f = await fixture(t, { signedIn: true }); const good = await saveLocal(f.page);
    const other = envelope('Different mode'); other.config.OneHanded_General = other.config.TwoHanded_General; delete other.config.TwoHanded_General; other.mode = 'OneHanded_General';
    const wrongMode = await saveLocal(f.page, other);
    const stats = { ...envelope('Statistics'), kind: 'stats', config: { statsVersion: 20260109, combatRows: [{ id: 'fire' }] } }; delete stats.mode;
    const wrongKind = await saveLocal(f.page, stats);
    await enterShared(f); const form = await openShareUpdate(f);
    const values = await form.locator('[data-share-source] option').evaluateAll(options => options.map(option => option.value));
    assert.ok(values.includes(good.id)); assert.ok(!values.includes(wrongMode.id)); assert.ok(!values.includes(wrongKind.id));
    await form.locator('[data-share-source]').selectOption(good.id);
    await f.page.locator('.jpx-store-back').click(); await sharedRow(f.page, 1).waitFor();
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    assert.equal((await readSharedEnvelope(f.page)).title, 'Store configuration 1');
    await assertClean(f);
});

test('updates reject concurrent source changes and let the author reselect the new revision', async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const form = await openShareUpdate(f); await form.locator('[data-share-source]').selectOption(saved.id);
    const newer = clone(saved.envelope); newer.config.TwoHanded_General.supports[0].customMessage = 'Newer local revision';
    await f.page.evaluate(({ id, envelope }) => __fullStore.saveLocal(envelope, id), { id: saved.id, envelope: newer });
    await form.getByRole('button', { name: 'Submit update', exact: true }).click();
    await f.page.getByText('This saved config changed. Select it again before submitting.', { exact: true }).waitFor();
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    await form.locator('[data-share-source]').selectOption(''); await form.locator('[data-share-source]').selectOption(saved.id);
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await sharedRow(f.page, 1).waitFor();
    assert.deepEqual((await readSharedEnvelope(f.page)).config, newer.config);
    await assertClean(f);
});

for (const change of ['body', 'owner', 'closed']) test(`updates reject a remotely changed ${change} without overwriting it`, async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const form = await openShareUpdate(f); await form.locator('[data-share-source]').selectOption(saved.id);
    await f.page.evaluate(change => {
        if (change === 'body') __transport.issues[1].body = __transport.issues[1].body.replace('Offline store sample', 'Changed in another tab');
        else if (change === 'owner') __transport.issues[1].user.id = 99;
        else __transport.issues[1].state = 'closed';
    }, change);
    const before = await f.page.evaluate(() => __transport.issues[1]);
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    assert.deepEqual(await f.page.evaluate(() => __transport.issues[1]), before);
    assert.equal(await form.locator('[data-share-source]').inputValue(), saved.id);
    assert.equal(await form.getByRole('button', { name: 'Submit update', exact: true }).isEnabled(), true);
    await assertClean(f);
});

test('failed updates retain the selected rules and form text for retry', async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const form = await openShareUpdate(f); await form.locator('[data-share-source]').selectOption(saved.id);
    await form.getByLabel('Title', { exact: true }).fill('Keep this title');
    const original = await readSharedEnvelope(f.page);
    await f.page.evaluate(() => { __transport.failPatch = true; });
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.equal(await form.getByLabel('Title', { exact: true }).inputValue(), 'Keep this title');
    assert.equal(await form.locator('[data-share-source]').inputValue(), saved.id); assert.deepEqual(await readSharedEnvelope(f.page), original);
    await f.page.evaluate(() => { __transport.failPatch = false; });
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await sharedRow(f.page, 1).waitFor();
    assert.deepEqual((await readSharedEnvelope(f.page)).config, saved.envelope.config);
    await assertClean(f);
});

test('update drafts retain the chosen local rules when leaving and returning to Settings', async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const form = await openShareUpdate(f); await form.locator('[data-share-source]').selectOption(saved.id);
    await form.getByLabel('Title', { exact: true }).fill('Draft title');
    await tab(f.page, 'stats'); await tab(f.page, 'configManager'); await form.waitFor();
    assert.equal(await form.locator('[data-share-source]').inputValue(), saved.id);
    assert.equal(await form.getByLabel('Title', { exact: true }).inputValue(), 'Draft title');
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await sharedRow(f.page, 1).waitFor();
    assert.deepEqual((await readSharedEnvelope(f.page)).config, saved.envelope.config);
    await assertClean(f);
});

test('a deleted update source stays visible in the draft and cannot submit stale rules', async t => {
    const f = await fixture(t, { signedIn: true }); const saved = await saveLocal(f.page); await enterShared(f);
    const form = await openShareUpdate(f); await form.locator('[data-share-source]').selectOption(saved.id);
    await form.getByLabel('Title', { exact: true }).fill('Keep this draft');
    await f.page.evaluate(id => __fullStore.removeLocal(id), saved.id);
    await tab(f.page, 'stats'); await tab(f.page, 'configManager'); await form.waitFor();
    assert.equal(await form.locator('[data-share-source]').inputValue(), saved.id);
    await form.getByRole('button', { name: 'Submit update', exact: true }).click();
    await f.page.getByText('This saved config changed. Select it again before submitting.', { exact: true }).waitFor();
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    assert.equal(await form.getByLabel('Title', { exact: true }).inputValue(), 'Keep this draft');
    await form.locator('[data-share-source]').selectOption('');
    await form.getByRole('button', { name: 'Submit update', exact: true }).click(); await sharedRow(f.page, 1).waitFor();
    assert.equal((await readSharedEnvelope(f.page)).title, 'Keep this draft');
    await assertClean(f);
});

test('review feedback cannot relabel a hidden share as published', async t => {
    const f = await fixture(t, { signedIn: true, shareOverrides: { 1: { labels: ['store:hide', 'store:published'] } } });
    const revision = createHash('sha256').update(JSON.stringify(await readSharedEnvelope(f.page)) + '\n').digest('hex');
    await f.page.evaluate(revision => {
        __transport.comments[1] = [{ user: { login: 'github-actions[bot]', type: 'Bot' }, body: '<!-- JPX-PLUS-REVIEW:v1 ' + JSON.stringify({ revision, status: 'published', summary: { en: 'Published', zh: '已上架' }, findings: [] }) + ' -->' }];
    }, revision);
    await enterShared(f); const row = sharedRow(f.page, 1);
    assert.equal(await row.locator('.jpx-store-badge').textContent(), 'Hidden');
    await row.getByRole('button', { name: 'Review feedback', exact: true }).click(); await row.locator('.jpx-store-feedback').waitFor();
    assert.equal(await row.locator('.jpx-store-badge').textContent(), 'Hidden');
    await assertClean(f);
});

test('the translated update form fits phone, tablet and desktop widths in both themes', async t => {
    const f = await fixture(t, { signedIn: true, language: 'ZhTrans' });
    const saved = await saveLocal(f.page); await enterShared(f);
    await sharedRow(f.page, 1).getByRole('button', { name: '更新配置', exact: true }).click();
    const form = f.page.locator('[data-store-editor="share"]'); await form.waitFor();
    await form.getByLabel('配置内容', { exact: true }).selectOption(saved.id);
    for (const dark of [false, true]) {
        if (dark) await f.page.evaluate(() => __fullStore.theme());
        for (const width of [320, 768, 1024, 1440]) {
            await f.page.setViewportSize({ width, height: 900 });
            const bounds = await form.evaluate(node => {
                const form = node.getBoundingClientRect();
                return { left: form.left, right: form.right, controls: [...node.querySelectorAll('input,select,textarea,button,summary')].map(control => {
                    const box = control.getBoundingClientRect(); return { left: box.left, right: box.right };
                }) };
            });
            assert.ok(bounds.left >= 0 && bounds.right <= width, JSON.stringify({ width, dark, bounds }));
            assert.ok(bounds.controls.every(control => control.left >= bounds.left - 1 && control.right <= bounds.right + 1), JSON.stringify({ width, dark, bounds }));
        }
    }
    assert.equal(await f.page.evaluate(() => __transport.calls.filter(call => call.method === 'PATCH').length), 0);
    await assertClean(f);
});

for(const mobile of [false,true])test(`store and shared tags filter full configs locally, ${mobile?'mobile dark':'desktop light'}`,async t=>{
    const full=envelope('双手连招','Isekai');full.kind='battle';delete full.mode;
    full.config.TwoHanded_Tower=clone(full.config.TwoHanded_General);full.config.Staff_General={supports:[],attacks:[]};
    const cross=clone(full);cross.title='Mixed file';cross.world='Persistent';
    cross.config.OneHanded_Item=cross.config.TwoHanded_General;delete cross.config.TwoHanded_General;
    const f=await fixture(t,{signedIn:true,mobile,language:'ZhTrans',records:[
        {envelope:full,catalogModes:['TwoHanded_General','TwoHanded_Tower']},
        {envelope:cross,catalogModes:['OneHanded_Item','TwoHanded_Tower']},
        {envelope:envelope('Legacy single','Persistent')}
    ]});
    if(mobile)await f.page.evaluate(()=>__fullStore.theme());await enterStore(f.page);
    const calls=await f.page.evaluate(()=>__transport.calls.length),before=await f.page.evaluate(()=>({native:__fullStore.native(),library:__fullStore.library()}));
    const row=()=>f.page.locator('[data-store-id="1"]');
    assert.ok((await row().locator('.jpx-config-tag').allTextContents()).includes('塔楼'));
    await row().getByRole('button',{name:'双手',exact:true}).click();assert.equal(await f.page.locator('[data-store-filter=style]').inputValue(),'TwoHanded');
    const search=f.page.locator('.jpx-store-querybar input');await search.fill('双手 塔楼 异世界');assert.deepEqual(await visibleStoreIds(f.page),[1]);
    assert.equal(await f.page.evaluate(()=>__transport.calls.length),calls,'clicking and searching tags does not download configurations');
    const output=path.join(root,'.test-output/config-tags-order-preview');fs.mkdirSync(output,{recursive:true});
    await f.page.locator('#settings-container').screenshot({path:path.join(output,`store-${mobile?'mobile-dark':'desktop-light'}.png`)});
    await f.page.locator('.jpx-store-clear').click();if(mobile)await f.page.locator('.jpx-store-filter-toggle').click();
    await f.page.locator('[data-store-filter=kind]').selectOption('battle');
    assert.equal(await f.page.locator('[data-store-filter=style]').isEnabled(),true);
    await f.page.locator('[data-store-filter=style]').selectOption('OneHanded');await f.page.locator('[data-store-filter=battleType]').selectOption('Tower');
    assert.deepEqual(await visibleStoreIds(f.page),[],'full files match style and battle in the same rule group');
    await f.page.locator('.jpx-store-clear').click();await f.page.locator('[data-store-sort]').selectOption('type');
    assert.deepEqual(await visibleStoreIds(f.page),[3,1,2]);
    await f.page.locator('.jpx-store-navigation button').click();await f.page.locator('[data-shared-id="1"]').waitFor();
    await search.fill('双手 塔楼 异世界');assert.equal(await f.page.locator('[data-shared-id]:visible').count(),1);
    await f.page.locator('[data-shared-id="1"]').getByRole('button',{name:'塔楼',exact:true}).click();
    assert.equal(await search.inputValue(),'塔楼');assert.equal(await f.page.locator('[data-shared-id]:visible').count(),2);
    await f.page.locator('#settings-container').screenshot({path:path.join(output,`shared-${mobile?'mobile-dark':'desktop-light'}.png`)});
    assert.deepEqual(await f.page.evaluate(()=>({native:__fullStore.native(),library:__fullStore.library()})),before);
    await assertClean(f);
});

test('invalid catalog mode tags are rejected before displaying or downloading rules',async t=>{
    const f=await fixture(t,{records:[{envelope:envelope('Invalid tags'),catalogModes:['Unknown_General']}]});
    await f.page.locator('.jpx-config-nav button').nth(1).click();await f.page.locator('.jpx-store-status[data-error=true]').waitFor();
    assert.equal(await f.page.locator('[data-store-id]').count(),0);
    assert.equal(await f.page.evaluate(()=>__transport.calls.filter(call=>call.url.includes('/catalog/configs/')).length),0);
    await assertClean(f);
});

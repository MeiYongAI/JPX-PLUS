'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const { webcrypto, createHash } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const source = ['comments.js', 'ratings.js', 'downloads.js', 'store.js'].map(name => fs.readFileSync(path.join(root, 'src/config-manager', name), 'utf8')).join('\n');
const mode = { supports: [], attacks: [{ type: 'normalAttack' }], jpxPlusExecution: { style: '2H_Mage', element: 'fire' } };
const envelope = { schemaVersion: 1, kind: 'battle-mode', title: 'Two-handed test', description: '', world: 'Persistent', mode: 'TwoHanded_General', scriptVersion: '2026.11.07.1', config: { battleVersion: 20251216, TwoHanded_General: mode } };
const clone = value => JSON.parse(JSON.stringify(value));
function sandbox(storage = new Map()) {
    const events = new Map(), calls = [], host = {
        addEventListener(name, listener) { if (!events.has(name)) events.set(name, new Set()); events.get(name).add(listener); },
        removeEventListener(name, listener) { events.get(name)?.delete(listener); },
        dispatchEvent(event) { calls.push(event); for (const listener of events.get(event.type) || []) listener(event); }
    };
    const window = {}; window.self = window; window.top = window;
    const context = { unsafeWindow: host, window, TextEncoder, URL, Uint8Array, crypto: webcrypto, AbortController,
        setTimeout, clearTimeout, CustomEvent: class { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
        GM_getValue: (key, fallback) => storage.has(key) ? clone(storage.get(key)) : fallback,
        GM_setValue: (key, value) => storage.set(key, clone(value)), GM_deleteValue: key => storage.delete(key),
        GM_listValues: () => [...storage.keys()], GM_xmlhttpRequest() { throw Error('Unexpected network request'); }
    };
    vm.createContext(context); return { context, host, calls, storage };
}

test('construction is offline and mode execution metadata survives the existing store envelope', async () => {
    const fixture = sandbox();
    vm.runInContext(source + '\nglobalThis.integrated = createJpxIntegratedStore(unsafeWindow, key => key);', fixture.context);
    const { service } = fixture.context.integrated;
    assert.equal(typeof fixture.context.integrated.render, 'function');
    assert.equal(fixture.host.service, undefined);
    assert.equal(fixture.host.jpxConfigStore, undefined);
    const body = '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n' + JSON.stringify(envelope) + '\n```';
    assert.deepEqual(clone(service.parseSubmission(body)), envelope);
    for (const name of ['backpackList', 'backpackSave', 'backpackRemove']) assert.equal(service[name], undefined, 'local archives belong to the configuration library');
    assert.equal(fixture.storage.size, 0, 'construction and validation do not create a second archive');
});

const serverValidator = path.resolve(root, '../JPX-PLUS-Configs/scripts/validation.mjs');
test('published store validator preserves mode execution metadata', { skip: !fs.existsSync(serverValidator) }, async () => {
    const { validateEnvelope } = await import(pathToFileURL(serverValidator));
    assert.deepEqual(validateEnvelope(envelope).envelope, envelope);
});

test('embedded store exposes Browse and Shared, saves locally, and opens share without fetching catalog', async t => {
    const { chromium } = require('playwright');
    const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true });
    t.after(() => browser.close());
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().isNavigationRequest()
        ? route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta charset="utf-8"><div id="settings-container"><div id="mount" style="display:flex;height:720px"></div></div>' }) : route.abort());
    await page.goto('https://hentaiverse.org/');
    const serialized = JSON.stringify(envelope) + '\n', sha256 = createHash('sha256').update(serialized).digest('hex');
    const entry = { id: 7, author: 'example', title: envelope.title, description: '', world: envelope.world, kind: envelope.kind,
        mode: envelope.mode, scriptVersion: envelope.scriptVersion, updatedAt: '2026-11-07T00:00:00Z', sha256,
        configPath: 'catalog/configs/7-' + sha256 + '.json', issueUrl: 'https://github.com/MeiYongAI/JPX-PLUS-Configs/issues/7' };
    await page.evaluate(({ entry, serialized }) => {
        window.__requests = []; window.__saved = []; window.__applied = [];
        window.GM_getValue = (_, fallback) => fallback;
        window.GM_xmlhttpRequest = options => {
            __requests.push(options.url);
            queueMicrotask(() => options.onload({ status: 200, finalUrl: options.url,
                responseText: options.url.endsWith('catalog/index.json')
                    ? JSON.stringify({ schemaVersion: 1, updatedAt: entry.updatedAt, entries: [entry] }) : options.url.includes('/v1/downloads') ? '{"counts":{"7":0}}' : options.url.includes('/comments?') ? '[]' : serialized }));
            return { abort() {} };
        };
    }, { entry, serialized });
    await page.addScriptTag({ content: source + '\nwindow.__integrated = createJpxIntegratedStore(window, key => key.split(".").at(-1).replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/^./, c => c.toUpperCase()));' });
    assert.deepEqual(await page.evaluate(() => __requests), []);
    await page.evaluate(() => { window.__dispose = __integrated.render(document.getElementById('mount'), {
        saveConfig: (value, origin) => { if (window.__cancelSave) return false; __saved.push({ value, origin }); return true; }
    }); });
    await page.getByRole('button', { name: envelope.title, exact: true }).click();
    await page.evaluate(() => { window.__cancelSave = true; });
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: 'Saved', exact: true }).count(), 0);
    assert.deepEqual(await page.evaluate(() => __saved), []);
    await page.evaluate(() => { window.__cancelSave = false; });
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    const saved = await page.evaluate(() => __saved);
    assert.deepEqual(saved[0].value, envelope);
    assert.equal(saved[0].origin.id, 7); assert.equal(saved[0].origin.author, 'example');
    assert.equal(saved[0].origin.source.sha256, sha256);
    assert.equal(await page.getByRole('button', { name: 'Apply config', exact: true }).count(), 0);
    for (const name of ['My configs', 'Backpack', 'Current']) assert.equal(await page.getByRole('button', { name, exact: true }).count(), 0);
    await page.getByRole('button', { name: 'Shared', exact: true }).click();
    await page.getByText('Sign in to GitHub to manage your shared configs.').waitFor();
    const requests = await page.evaluate(() => __requests.length);
    await page.evaluate(envelope => {
        __dispose(); document.getElementById('mount').replaceChildren();
        window.__dispose = __integrated.render(document.getElementById('mount'), {}, { share: envelope, onBack: () => {} });
    }, envelope);
    await page.locator('[data-store-editor="share"]').waitFor();
    assert.equal(await page.evaluate(() => __requests.length), requests);
    await page.getByLabel('Title', { exact: true }).fill('Edited share title');
    assert.equal(await page.getByRole('button', { name: 'Change config', exact: true }).count(), 0);
    assert.deepEqual(errors, []);
});

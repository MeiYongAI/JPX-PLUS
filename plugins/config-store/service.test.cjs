'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const { webcrypto, createHash } = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, 'service.js'), 'utf8');
const repo = 'MeiYongAI/JPX-PLUS-Configs', url = id => 'https://github.com/' + repo + '/issues/' + id;
const envelope = { schemaVersion: 1, kind: 'battle-mode', title: '双手 / Two-handed', description: 'A shared ruleset', world: 'Persistent', mode: 'TwoHanded_General', scriptVersion: '2026.11.06.7', config: { battleVersion: 20251216, TwoHanded_General: { supports: [], attacks: [{ type: 'kamisamaniNattaHi', code: 'throw Error("must not execute")' }] } } };
const body = data => '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n' + JSON.stringify(data) + '\n```';
const serialized = JSON.stringify(envelope) + '\n', digest = value => createHash('sha256').update(value).digest('hex');
const entry = { id: 12, author: 'tester', title: envelope.title, description: envelope.description, world: envelope.world, kind: envelope.kind, mode: envelope.mode, scriptVersion: envelope.scriptVersion, updatedAt: '2026-11-06T00:00:00Z', sha256: digest(serialized), configPath: 'catalog/configs/12-' + digest(serialized) + '.json', issueUrl: url(12) };
const identity = { id: 7, login: 'tester' };
function setup({ clientId = 'Iv1.public-client-id', stored = true } = {}) {
    let now = 1793923200000, routes = [], calls = [], waits = [];
    const storage = new Map(stored ? [['jpx-config-store-auth-v1', { token: 'ghu_private_test_token', expiresAt: now + 3600000 }]] : []);
    const sandbox = { TextEncoder, URL, Uint8Array, crypto: webcrypto, AbortController, Date: class extends Date { static now() { return now; } },
        setTimeout(fn, time) { waits.push(time); now += time; queueMicrotask(fn); return 1; }, clearTimeout() {},
        GM_getValue: (key, fallback) => storage.has(key) ? storage.get(key) : fallback,
        GM_setValue: (key, value) => storage.set(key, value), GM_deleteValue: key => storage.delete(key),
        GM_xmlhttpRequest(options) {
            const expected = routes.shift(); calls.push(options);
            assert.ok(expected, 'unexpected request ' + options.method + ' ' + options.url);
            assert.ok(options.url.includes(expected.path), 'expected route ' + expected.path + ', received ' + options.url);
            if (expected.method) assert.equal(options.method, expected.method);
            if (expected.check) expected.check(options);
            let aborted = false;
            queueMicrotask(() => { if (!aborted) options.onload({ status: expected.status || 200, finalUrl: expected.finalUrl || options.url, responseText: typeof expected.result === 'string' ? expected.result : JSON.stringify(expected.result) }); });
            return { abort() { aborted = true; options.onabort(); } };
        } };
    vm.createContext(sandbox);
    vm.runInContext(source.replace(/clientId: '[^']*'/, 'clientId: ' + JSON.stringify(clientId)) + '\nglobalThis.service = jpxConfigStore;', sandbox);
    return { service: sandbox.service, storage, calls, waits, routes, done() { assert.equal(routes.length, 0); } };
}
const code = value => err => err.code === value;
async function run() {
    {
        const env = setup();
        assert.equal(env.service.parseSubmission(body(envelope)).config.TwoHanded_General.attacks[0].code, 'throw Error("must not execute")');
        for (const invalid of [body(envelope) + '\nextra', body(envelope).replace('"battleVersion":20251216', '"__proto__":{},"battleVersion":20251216'), body({ ...envelope, config: { ...envelope.config, hideMonsterHp: true } })]) assert.throws(() => env.service.parseSubmission(invalid), code('invalidConfig'));
        assert.throws(() => env.service.parseSubmission(body({ ...envelope, description: 'x'.repeat(60000) })), code('tooLarge'));
        const full = { ...envelope, kind: 'battle', config: { ...envelope.config, Unarmed_General: {} } }; delete full.mode;
        assert.equal(env.service.parseSubmission(body(full)).kind, 'battle', 'full exports preserve unused empty modes');
        assert.throws(() => env.service.parseSubmission(body({ ...envelope, config: { battleVersion: 20251216, TwoHanded_General: {} } })), code('invalidConfig'));
        const badSupport = structuredClone(envelope); badSupport.config.TwoHanded_General.supports = [{ type: 'kamisamaniNattaHi', code: 'bad' }];
        assert.throws(() => env.service.parseSubmission(body(badSupport)), code('invalidConfig'), 'unsupported support rules cannot reach the editor');
        const keyed = structuredClone(envelope); keyed.config.TwoHanded_General.kb_a = keyed.config.TwoHanded_General.attacks;
        assert.equal(env.service.parseSubmission(body(keyed)).config.TwoHanded_General.kb_a[0].type, 'kamisamaniNattaHi', 'supported key-bound custom code remains shareable');
        const legacy = { ...envelope, mode: 'Battlecaster_General', config: { version: 20251216, Battlecaster_General: { supports: [{ type: 'spellInstant', name: 'Cure', conditions: [] }, { type: 'itemDuration', name: 'Health Draught', conditions: [] }], attacks: [] } } };
        const migrated = env.service.parseSubmission(body(legacy));
        assert.equal(migrated.mode, '1H_Mage_General'); assert.equal(migrated.config.battleVersion, 20251216);
        assert.equal(migrated.config['1H_Mage_General'].supports[0].type, 'spellSupport');
        assert.equal(migrated.config['1H_Mage_General'].supports[1].type, 'item');
        assert.equal(legacy.config.Battlecaster_General.supports[0].type, 'spellInstant', 'original legacy object is untouched');
        assert.equal(env.calls.length, 0);
    }
    {
        const env = setup();
        env.routes.push({ path: 'catalog/index.json', result: { schemaVersion: 1, updatedAt: entry.updatedAt, entries: [entry] }, check: o => assert.equal(o.headers.Authorization, undefined) });
        const catalog = await env.service.catalog(); catalog.entries[0].title = 'mutated';
        assert.equal((await env.service.catalog()).entries[0].title, envelope.title);
        env.routes.push({ path: entry.configPath, result: serialized });
        assert.equal((await env.service.load(entry)).title, envelope.title);
        env.routes.push({ path: entry.configPath, result: serialized.replace('Two-handed', 'Tampered') });
        await assert.rejects(env.service.load(entry), code('integrityFailed'));
        await assert.rejects(env.service.load({ ...entry, configPath: '../secret.json' }), code('invalidResponse'));
        env.done();
    }
    {
        const env = setup({ stored: false }); let deviceCode;
        env.routes.push({ path: '/login/device/code', method: 'POST', result: { device_code: 'device-secret', user_code: 'ABCD-EFGH', verification_uri: 'https://github.com/login/device', expires_in: 900, interval: 5 }, check: o => { assert.equal(o.headers.Authorization, undefined); assert.equal(o.anonymous, true); assert.equal(o.redirect, 'error'); } },
            { path: '/login/oauth/access_token', result: { error: 'authorization_pending' } }, { path: '/login/oauth/access_token', result: { error: 'slow_down' } },
            { path: '/login/oauth/access_token', result: { access_token: 'ghu_new_private_token', token_type: 'bearer', expires_in: 28800 } },
            { path: '/user', result: identity, check: o => assert.equal(o.headers.Authorization, 'Bearer ghu_new_private_token') });
        const signedIn = await env.service.login(code => { deviceCode = code; });
        assert.equal(signedIn.login, 'tester'); assert.equal(deviceCode.userCode, 'ABCD-EFGH');
        assert.deepEqual(env.waits, [5000, 5000, 10000]);
        assert.equal(env.storage.get('jpx-config-store-auth-v1').token, 'ghu_new_private_token');
        await env.service.logout(); assert.equal(env.storage.size, 0); env.done();
    }
    {
        const env = setup({ stored: false }); const controller = new AbortController();
        env.routes.push({ path: '/login/device/code', result: { device_code: 'secret', user_code: 'ABCD-EFGH', verification_uri: 'https://github.com/login/device', expires_in: 900, interval: 5 } });
        await assert.rejects(env.service.login(() => controller.abort(), controller.signal), code('cancelled'));
        assert.equal(env.storage.size, 0); assert.equal(env.calls.length, 1); env.done();
        const disabled = setup({ clientId: '', stored: false }); await assert.rejects(disabled.service.login(), code('notConfigured'));
    }
    {
        const env = setup(); env.routes.push({ path: '/user', status: 401, result: { message: 'Bad credentials' } });
        assert.equal(await env.service.user(), null); assert.equal(env.storage.size, 0); env.done();
    }
    {
        const env = setup();
        env.routes.push({ path: '/issues', method: 'POST', result: { number: 12, html_url: url(12) }, check: o => { const data = JSON.parse(o.data); assert.equal(data.body, body(envelope)); assert.equal(data.title, '[Config] ' + envelope.title); } });
        assert.equal((await env.service.submit(envelope)).id, 12);
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, user: { id: 99 }, html_url: url(12), body: body(envelope) } });
        await assert.rejects(env.service.withdraw(12), code('notOwner'));
        assert.equal(env.calls.filter(call => call.method === 'PATCH').length, 0); env.done();
    }
    {
        const env = setup();
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, user: identity, state: 'open', html_url: url(12), body: body(envelope) } },
            { path: '/issues/12', method: 'PATCH', result: { number: 12, html_url: url(12) } });
        await env.service.submit({ ...envelope, title: 'Updated' }, 12); env.done();
    }
    {
        const env = setup();
        const review = { revision: entry.sha256, status: 'published', summary: { en: 'Passed', zh: '通过' }, findings: [] };
        const message = value => '<!-- JPX-PLUS-REVIEW:v1 ' + JSON.stringify(value) + ' -->';
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, user: identity, html_url: url(12), body: body(envelope) } },
            { path: '/issues/12/comments', result: [
                { user: { login: 'github-actions[bot]', type: 'Bot' }, body: message(review) },
                { user: { login: 'attacker', type: 'User' }, body: message({ ...review, status: 'needs-review' }) },
                { user: { login: 'github-actions[bot]', type: 'Bot' }, body: message({ ...review, revision: '0'.repeat(64), status: 'changes-requested' }) }
            ] });
        assert.equal((await env.service.feedback(12)).status, 'published'); env.done();
    }
    {
        const env = setup(); env.routes.push({ path: 'catalog/index.json', finalUrl: 'https://example.org/redirect', result: '{}' });
        await assert.rejects(env.service.catalog(), code('invalidResponse')); env.done();
    }
    {
        const env = setup();
        // Synthetic rules keep this regression portable and exclude personal configurations.
        const config = { battleVersion: 20251216, OneHanded_General: { supports: [], attacks: Array.from({ length: 400 }, () => ({
            type: 'target', conditions: [{ key: 'tHP', value: [0, 1] }], priorityRule: 'Top Down'
        })) }, Unarmed_General: {} };
        const full = { ...envelope, kind: 'battle', config }; delete full.mode;
        assert.ok(Buffer.byteLength(JSON.stringify(full, null, 2)) > 60000, 'full configuration exceeds the limit only when pretty printed');
        assert.equal(env.service.parseSubmission(body(full)).kind, 'battle', 'compact submissions accept a large full configuration');
        env.routes.push({ path: '/user', result: identity }, { path: '/issues?state=all', result: [{ number: 12, user: identity, html_url: url(12), body: body(full), title: '[Config] Full', state: 'open', labels: [], updated_at: entry.updatedAt }] });
        assert.equal((await env.service.mine()).length, 1, 'large issue bodies are network envelopes, not individual config fields');
        env.done();
    }
    {
        const env = setup(), updated = { ...envelope, description: 'Newly approved update' };
        const updatedHash = digest(JSON.stringify(updated) + '\n');
        const updatedEntry = { ...entry, description: updated.description, sha256: updatedHash, configPath: 'catalog/configs/12-' + updatedHash + '.json' };
        env.routes.push({ path: 'raw.githubusercontent.com/' + repo + '/main/catalog/index.json', result: { schemaVersion: 1, updatedAt: entry.updatedAt, entries: [entry] } });
        assert.equal((await env.service.catalog()).entries[0].description, envelope.description, 'ordinary browsing can read the cached CDN snapshot');
        env.routes.push({ path: 'api.github.com/repos/' + repo + '/contents/catalog/index.json?ref=main', result: { schemaVersion: 1, updatedAt: entry.updatedAt, entries: [updatedEntry] }, check: options => {
            assert.equal(options.headers.Accept, 'application/vnd.github.raw+json');
            assert.equal(options.headers['Cache-Control'], 'no-cache');
            assert.equal(options.headers.Authorization, undefined, 'public refresh does not require or expose the login token');
            assert.equal(options.anonymous, true);
        } });
        assert.equal((await env.service.catalog({ refresh: true })).entries[0].description, updated.description, 'manual refresh bypasses a stale raw CDN revision');
        assert.equal((await env.service.catalog()).entries[0].sha256, updatedHash, 'the fresh API revision replaces the in-memory browsing cache');
        env.routes.push({ path: '/contents/catalog/index.json?ref=main', status: 429, result: { message: 'rate limit' } });
        await assert.rejects(env.service.catalog({ refresh: true }), code('rateLimited'), 'refresh errors are visible instead of silently returning stale CDN data');
        assert.equal((await env.service.catalog()).entries[0].sha256, updatedHash, 'failed refresh preserves the last verified cache');
        env.routes.push({ path: '/contents/catalog/index.json?ref=main', result: { schemaVersion: 1, updatedAt: entry.updatedAt, entries: [{ ...updatedEntry, configPath: '../injected.json' }] } });
        await assert.rejects(env.service.catalog({ refresh: true }), code('invalidResponse'), 'API responses undergo the same catalog integrity checks');
        assert.equal((await env.service.catalog()).entries[0].sha256, updatedHash);
        assert.equal(env.calls.length, 4, 'neither refresh failure falls back to the stale raw endpoint'); env.done();
    }
    console.log('Passed 12 configuration-store service scenarios (mocked GitHub; no network or real credentials).');
}
run().catch(err => { console.error(err); process.exitCode = 1; });

'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const { webcrypto, createHash } = require('node:crypto');
const { test } = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/config-manager/store.js'), 'utf8');
const repo = 'MeiYongAI/JPX-PLUS-Configs', url = id => 'https://github.com/' + repo + '/issues/' + id;
const envelope = { schemaVersion: 1, kind: 'battle-mode', title: '双手 / Two-handed', description: 'A shared ruleset', world: 'Persistent', mode: 'TwoHanded_General', scriptVersion: '2026.11.06.7', config: { battleVersion: 20251216, TwoHanded_General: { supports: [], attacks: [{ type: 'kamisamaniNattaHi', code: 'throw Error("must not execute")' }] } } };
const body = data => '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n' + JSON.stringify(data) + '\n```';
const serialized = JSON.stringify(envelope) + '\n', digest = value => createHash('sha256').update(value).digest('hex');
const entry = { id: 12, author: 'tester', title: envelope.title, description: envelope.description, world: envelope.world, kind: envelope.kind, mode: envelope.mode, scriptVersion: envelope.scriptVersion, updatedAt: '2026-11-06T00:00:00Z', sha256: digest(serialized), configPath: 'catalog/configs/12-' + digest(serialized) + '.json', issueUrl: url(12) };
const identity = { id: 7, login: 'tester' };
function setup({ clientId = 'Iv1.public-client-id', stored = true, sharedStorage } = {}) {
    let now = 1793923200000, routes = [], calls = [], waits = [];
    const storage = sharedStorage || new Map(stored ? [['jpx-config-store-auth-v1', { token: 'ghu_private_test_token', expiresAt: now + 3600000 }]] : []);
    const sandbox = { TextEncoder, URL, Uint8Array, crypto: webcrypto, AbortController, Date: class extends Date { static now() { return now; } },
        setTimeout(fn, time) { waits.push(time); now += time; queueMicrotask(fn); return 1; }, clearTimeout() {},
        GM_getValue: (key, fallback) => storage.has(key) ? storage.get(key) : fallback,
        GM_setValue: (key, value) => storage.set(key, value), GM_deleteValue: key => storage.delete(key),
        GM_listValues: () => [...storage.keys()],
        GM_xmlhttpRequest(options) {
            const expected = routes.shift(); calls.push(options);
            assert.ok(expected, 'unexpected request ' + options.method + ' ' + options.url);
            assert.ok(options.url.includes(expected.path), 'expected route ' + expected.path + ', received ' + options.url);
            if (expected.method) assert.equal(options.method, expected.method);
            if (expected.check) expected.check(options);
            let aborted = false;
            const respond = () => { if (!aborted) options.onload({ status: expected.status || 200, responseHeaders: expected.headers || '', finalUrl: expected.finalUrl || options.url, responseText: typeof expected.result === 'string' ? expected.result : JSON.stringify(expected.result) }); };
            if (expected.hold) expected.hold(respond); else queueMicrotask(respond);
            return { abort() { aborted = true; options.onabort(); } };
        } };
    vm.createContext(sandbox);
    vm.runInContext(source.replace(/clientId: '[^']*'/, 'clientId: ' + JSON.stringify(clientId)) + '\nglobalThis.service = createJpxIntegratedStore({}, key => key).service;', sandbox);
    return { service: sandbox.service, storage, calls, waits, routes, globals: sandbox, advance(ms) { now += ms; }, now: () => now, done() { assert.equal(routes.length, 0); } };
}
const code = value => err => err.code === value;
const plain = value => JSON.parse(JSON.stringify(value));
const comment = (overrides = {}) => ({ id: 91, body: 'Useful config', user: { ...identity, type: 'User' },
    created_at: '2026-11-10T01:00:00Z', updated_at: '2026-11-10T01:00:00Z',
    issue_url: 'https://api.github.com/repos/' + repo + '/issues/12', html_url: url(12) + '#issuecomment-91', ...overrides });
const commentSnapshot = value => ({ id: value.id, body: value.body, updatedAt: value.updated_at });
const ratingBody = score => '<!-- JPX-PLUS-RATING:v1 {"score":' + score + '} -->\nRating: ' + score + '/5';
test('ratings create one vote, edit it, and withdraw without deleting ordinary comments', async () => {
    const env = setup(), vote = comment({ body: ratingBody(5) }), changed = comment({ body: ratingBody(2) });
    const issue = { number: 12, html_url: url(12), body: body(envelope), state: 'open' };
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100', result: [comment({ id: 80 })] },
        { path: '/issues/12', result: issue }, { path: '/issues/12/comments', method: 'POST', result: vote });
    assert.deepEqual(plain(await env.service.setRating(12, 5, 7)), { score: 5, count: 1, sum: 5 });
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100', result: [vote] }, { path: '/issues/12', result: issue },
        { path: '/user', result: identity }, { path: '/issues/comments/91', result: vote }, { path: '/issues/comments/91', method: 'PATCH', result: changed });
    assert.deepEqual(plain(await env.service.setRating(12, 2, 7)), { score: 2, count: 1, sum: 2 });
    const older = comment({ id: 90, body: ratingBody(1), html_url: url(12) + '#issuecomment-90' });
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100', result: [older, changed, comment({ id: 80 })] },
        { path: '/user', result: identity }, { path: '/issues/comments/90', result: older }, { path: '/issues/comments/90', method: 'DELETE', status: 204, result: '' },
        { path: '/user', result: identity }, { path: '/issues/comments/91', result: changed }, { path: '/issues/comments/91', method: 'DELETE', status: 204, result: '' });
    assert.deepEqual(plain(await env.service.setRating(12, null, 7)), { score: null, count: 0, sum: 0 });
    assert.equal(env.calls.some(call => call.method === 'DELETE' && call.url.endsWith('/80')), false); env.done();
});
test('ratings deduplicate accounts, paginate, hide vote records and reject invalid writes', async () => {
    const env = setup(), old = comment({ body: ratingBody(1) }), latest = comment({ id: 92, body: ratingBody(5), html_url: url(12) + '#issuecomment-92' });
    const other = comment({ id: 93, body: ratingBody(3), user: { id: 8, login: 'other', type: 'User' }, html_url: url(12) + '#issuecomment-93' });
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100&page=1', result: Array(100).fill(old) },
        { path: '/comments?per_page=100&page=2', result: [latest, other] });
    assert.deepEqual(plain(await env.service.rating(12, 7)), { score: 5, count: 2, sum: 8 });
    env.routes.push({ path: '/comments?per_page=30', result: [old, latest, other, comment({ body: 'Normal discussion' })] });
    assert.deepEqual((await env.service.comments(12)).items.map(row => row.body).join(','), 'Normal discussion');
    for (const score of [0, 6, 2.5, '5']) await assert.rejects(env.service.setRating(12, score, 7), code('ratingInvalid'));
    await assert.rejects(env.service.addComment(12, ratingBody(5), 7), code('commentInvalid'));
    env.routes.push({ path: '/user', result: { id: 9, login: 'newaccount' } });
    await assert.rejects(env.service.setRating(12, 5, 7), code('loginRequired')); env.done();
});
test('ratings do not retry a failed submission or overwrite a remotely changed vote', async () => {
    const env = setup(), vote = comment({ body: ratingBody(4) });
    const issue = { number: 12, html_url: url(12), body: body(envelope), state: 'open' };
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100', result: [] }, { path: '/issues/12', result: issue },
        { path: '/issues/12/comments', method: 'POST', status: 503, result: {} });
    await assert.rejects(env.service.setRating(12, 4, 7), code('networkError'));
    assert.equal(env.calls.filter(call => call.method === 'POST').length, 1);
    env.routes.push({ path: '/user', result: identity }, { path: '/comments?per_page=100', result: [vote] }, { path: '/issues/12', result: issue },
        { path: '/user', result: identity }, { path: '/issues/comments/91', result: comment({ body: ratingBody(2) }) });
    await assert.rejects(env.service.setRating(12, 5, 7), code('commentChanged'));
    assert.equal(env.calls.some(call => call.method === 'PATCH'), false); env.done();
});
test('comments allow anonymous reading and filter bots and unrelated issue records', async () => {
    const env = setup({ stored: false }), value = comment({ body: '<img src=x onerror=alert(1)>' });
    const rows = [value, comment({ user: { id: 8, login: 'github-actions[bot]', type: 'Bot' } }), comment({ issue_url: 'https://api.github.com/repos/other/repo/issues/12' })];
    while (rows.length < 30) rows.push(comment({ user: { id: 8, login: 'review-bot', type: 'Bot' } }));
    env.routes.push({ path: '/issues/12/comments?per_page=30&page=1', result: rows, check: o => assert.equal(o.headers.Authorization, undefined) });
    const result = await env.service.comments(12);
    assert.equal(result.items.length, 1); assert.equal(result.items[0].body, value.body); assert.equal(result.nextPage, 2);
    env.routes.push({ path: '/issues/12/comments?per_page=30&page=2', result: [] });
    assert.equal((await env.service.comments(12, 2)).nextPage, null); env.done();
});
test('comments post, edit and delete the signed-in user comment, including empty DELETE responses', async () => {
    const env = setup(), value = comment(), changed = comment({ body: 'Updated comment', updated_at: '2026-11-10T02:00:00Z' });
    const issue = { number: 12, html_url: url(12), body: body(envelope), state: 'open', labels: [] };
    env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', method: 'GET', result: issue },
        { path: '/issues/12/comments', method: 'POST', result: value, check: o => assert.deepEqual(JSON.parse(o.data), { body: value.body }) });
    const posted = await env.service.addComment(12, '  Useful config  ', 7); assert.equal(posted.id, 91);
    env.routes.push({ path: '/user', result: identity }, { path: '/issues/comments/91', method: 'GET', result: value },
        { path: '/issues/comments/91', method: 'PATCH', result: changed, check: o => assert.deepEqual(JSON.parse(o.data), { body: changed.body }) });
    const edited = await env.service.updateComment(12, posted, changed.body, 7); assert.equal(edited.body, changed.body);
    env.routes.push({ path: '/user', result: identity }, { path: '/issues/comments/91', method: 'GET', result: changed },
        { path: '/issues/comments/91', method: 'DELETE', status: 204, result: '' });
    assert.equal(await env.service.deleteComment(12, edited, 7), true); env.done();
});
test('comments reject other owners, wrong issues, changed content and account switches before writing', async () => {
    for (const method of ['updateComment', 'deleteComment']) for (const scenario of ['owner', 'issue', 'changed', 'switched']) {
        const env = setup(), original = comment(), current = comment(scenario === 'owner' ? { user: { id: 8, login: 'other', type: 'User' } } :
            scenario === 'issue' ? { issue_url: 'https://api.github.com/repos/' + repo + '/issues/13' } : scenario === 'changed' ? { body: 'Changed remotely' } : {});
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/comments/91', method: 'GET', result: current,
            check: scenario === 'switched' ? () => env.storage.set('jpx-config-store-auth-v1', { token: 'ghu_other', user: { id: 8, login: 'other' } }) : undefined });
        const args = [12, commentSnapshot(original), ...(method === 'updateComment' ? ['My edit'] : []), 7];
        await assert.rejects(env.service[method](...args), code(scenario === 'changed' ? 'commentChanged' : scenario === 'switched' ? 'loginRequired' : 'commentNotOwner'));
        assert.equal(env.calls.some(call => call.method !== 'GET'), false, scenario); env.done();
    }
});
test('comments validate content and closed issues and preserve useful API errors', async () => {
    const invalid = setup();
    for (const value of ['', '   ', 'x'.repeat(10001)]) await assert.rejects(invalid.service.addComment(12, value, 7), code('commentInvalid'));
    assert.equal(invalid.calls.length, 0);
    for (const closed of [{ state: 'closed' }, { locked: true }, { labels: [{ name: 'store:hide' }] }]) {
        const env = setup(); env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, html_url: url(12), body: body(envelope), state: 'open', ...closed } });
        await assert.rejects(env.service.addComment(12, 'Hello', 7), code('commentsClosed')); assert.equal(env.calls.length, 2); env.done();
    }
    for (const [status, expected] of [[403, 'commentDenied'], [404, 'commentMissing'], [422, 'commentInvalid'], [503, 'networkError']]) {
        const env = setup(), value = comment();
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/comments/91', method: 'GET', result: value },
            { path: '/issues/comments/91', method: 'PATCH', status, result: {} });
        await assert.rejects(env.service.updateComment(12, commentSnapshot(value), 'Updated', 7), code(expected));
        assert.equal(env.calls.filter(call => call.method === 'PATCH').length, 1); env.done();
    }
});
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
        env.routes.push({ path: '/issues', method: 'POST', result: { number: 12, html_url: url(12), body: body(envelope), state: 'open' }, check: o => { const data = JSON.parse(o.data); assert.equal(data.body, body(envelope)); assert.equal(data.title, '[Config] ' + envelope.title); } });
        assert.equal((await env.service.submit(envelope)).id, 12);
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, user: { id: 99 }, html_url: url(12), body: body(envelope) } });
        await assert.rejects(env.service.withdraw(12), code('notOwner'));
        assert.equal(env.calls.filter(call => call.method === 'PATCH').length, 0); env.done();
    }
    {
        const env = setup();
        env.routes.push({ path: '/user', result: identity }, { path: '/issues/12', result: { number: 12, user: identity, state: 'open', html_url: url(12), body: body(envelope) } },
            { path: '/issues/12', method: 'PATCH', result: { number: 12, html_url: url(12), body: body({ ...envelope, title: 'Updated' }), state: 'open' } });
        await env.service.submit({ ...envelope, title: 'Updated' }, 12, body(envelope)); env.done();
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
}
test('integrated store service validates configs, login, publishing and catalog integrity', run);

const authKey = 'jpx-config-store-auth-v1';
const refreshed = { access_token: 'ghu_renewed', token_type: 'bearer', expires_in: 28800, refresh_token: 'ghr_rotated', refresh_token_expires_in: 15897600 };
function expiring(env) {
    const auth = { token: 'ghu_old', expiresAt: env.now() - 1, refreshToken: 'ghr_old', refreshExpiresAt: env.now() + 86400000, user: identity };
    env.storage.set(authKey, auth); return plain(auth);
}
function queueLogin(env, result) {
    env.routes.push({ path: '/login/device/code', result: { device_code: 'device', user_code: 'ABCD-EFGH', verification_uri: 'https://github.com/login/device', expires_in: 900, interval: 5 } },
        { path: '/login/oauth/access_token', result }, { path: '/user', result: identity });
}
test('login keeps refresh credentials and follows the server lifetime without an eight-hour cap', async () => {
    const env = setup({ stored: false }); queueLogin(env, { ...refreshed, expires_in: 86400 });
    await env.service.login(); const auth = env.storage.get(authKey);
    assert.equal(auth.expiresAt, env.now() + 86400000);
    assert.equal(auth.refreshToken, refreshed.refresh_token);
    assert.equal(auth.refreshExpiresAt, env.now() + refreshed.refresh_token_expires_in * 1000);
    assert.deepEqual(plain(auth.user), identity); env.done();
});
test('non-expiring tokens remain usable after eight hours and a service reload', async () => {
    const env = setup({ stored: false }); queueLogin(env, { access_token: 'ghu_permanent', token_type: 'bearer' });
    await env.service.login(); assert.equal(env.storage.get(authKey).expiresAt, null);
    const reloaded = setup({ sharedStorage: env.storage }); reloaded.advance(3 * 86400000);
    reloaded.routes.push({ path: '/user', result: identity });
    assert.deepEqual(plain(await reloaded.service.user()), identity); reloaded.done(); env.done();
});
test('legacy artificial expiry is checked with GitHub instead of deleting a valid login', async () => {
    const env = setup(); env.advance(86400000);
    env.routes.push({ path: '/user', result: identity });
    assert.deepEqual(plain(await env.service.user()), identity);
    assert.equal(env.storage.get(authKey).token, 'ghu_private_test_token'); env.done();
});
test('expired sessions renew once for concurrent requests and rotate both credentials', async () => {
    const env = setup(); expiring(env);
    env.routes.push({ path: '/login/oauth/access_token', result: refreshed, check: options => {
        assert.deepEqual(JSON.parse(options.data), { client_id: 'Iv1.public-client-id', grant_type: 'refresh_token', refresh_token: 'ghr_old' });
        assert.equal(options.headers.Authorization, undefined);
    } }, ...Array.from({ length: 3 }, () => ({ path: '/user', result: identity, check: options => assert.equal(options.headers.Authorization, 'Bearer ghu_renewed') })));
    assert.deepEqual(plain(await Promise.all([env.service.user(), env.service.user(), env.service.user()])), [identity, identity, identity]);
    assert.equal(env.storage.get(authKey).refreshToken, 'ghr_rotated');
    assert.deepEqual([...env.storage.keys()], [authKey], 'refresh tickets are removed'); env.done();
});
test('two isolated service instances serialize refresh with shared userscript storage', async () => {
    const first = setup(), original = expiring(first), second = setup({ sharedStorage: first.storage });
    let release, started; const startedPromise = new Promise(resolve => { started = resolve; });
    first.routes.push({ path: '/login/oauth/access_token', result: refreshed, hold(respond) { release = respond; started(); } }, { path: '/user', result: identity });
    second.routes.push({ path: '/user', result: identity, check: options => assert.equal(options.headers.Authorization, 'Bearer ghu_renewed') });
    const one = first.service.user(); await startedPromise;
    const two = second.service.user(); queueMicrotask(() => queueMicrotask(release));
    assert.deepEqual(plain(await Promise.all([one, two])), [identity, identity]);
    assert.notEqual(first.storage.get(authKey).refreshToken, original.refreshToken);
    assert.equal(second.calls.some(call => call.url.includes('/oauth/')), false); first.done(); second.done();
});
for (const response of [{ status: 503 }, { status: 429 }, { status: 403, headers: 'x-ratelimit-remaining: 0' }, { result: { error: 'temporarily_unavailable' } }]) {
    test('temporary refresh failure preserves credentials and cached identity ' + JSON.stringify(response), async () => {
        const env = setup(), original = expiring(env);
        env.routes.push({ path: '/login/oauth/access_token', result: {}, ...response });
        assert.deepEqual(plain(await env.service.user()), identity);
        assert.deepEqual(plain(env.storage.get(authKey)), original);
        env.routes.push({ path: '/login/oauth/access_token', result: refreshed }, { path: '/user', result: identity });
        assert.deepEqual(plain(await env.service.user()), identity); env.done();
    });
}
test('an expired refresh credential falls back to GitHub validation without sending it', async () => {
    const env = setup(); expiring(env); env.storage.get(authKey).refreshExpiresAt = env.now() - 1;
    env.routes.push({ path: '/user', status: 401, result: {} });
    assert.equal(await env.service.user(), null); assert.equal(env.storage.has(authKey), false); env.done();
});
test('an early 401 refreshes once and retries the authenticated request', async () => {
    const env = setup(); expiring(env); env.storage.get(authKey).expiresAt = env.now() + 3600000;
    env.routes.push({ path: '/user', status: 401, result: {} }, { path: '/login/oauth/access_token', result: refreshed }, { path: '/user', result: identity });
    assert.deepEqual(plain(await env.service.user()), identity); env.done();
});
test('a late 401 does not delete credentials installed by another tab', async () => {
    const env = setup(); let release;
    env.routes.push({ path: '/user', status: 401, result: {}, hold: respond => { release = respond; } }, { path: '/user', result: identity, check: options => assert.equal(options.headers.Authorization, 'Bearer ghu_new_login') });
    const pending = env.service.user(); while (!release) await Promise.resolve();
    env.storage.set(authKey, { token: 'ghu_new_login', expiresAt: env.now() + 3600000 }); release();
    assert.deepEqual(plain(await pending), identity); assert.equal(env.storage.get(authKey).token, 'ghu_new_login'); env.done();
});
for (const change of ['logout', 'new login']) test('pending renewal cannot undo ' + change, async () => {
    const env = setup(); expiring(env); let release;
    env.routes.push({ path: '/login/oauth/access_token', result: refreshed, hold: respond => { release = respond; } });
    const pending = env.service.user(); while (!release) await Promise.resolve();
    if (change === 'logout') await env.service.logout();
    else {
        env.storage.set(authKey, { token: 'ghu_other_login', expiresAt: env.now() + 3600000 });
        env.routes.push({ path: '/user', result: identity, check: options => assert.equal(options.headers.Authorization, 'Bearer ghu_other_login') });
    }
    release(); const user = await pending;
    if (change === 'logout') { assert.equal(user, null); assert.equal(env.storage.has(authKey), false); }
    else assert.equal(env.storage.get(authKey).token, 'ghu_other_login');
    assert.deepEqual([...env.storage.keys()], change === 'logout' ? [] : [authKey]); env.done();
});
test('invalid refresh responses leave credentials intact without accepting malformed tokens', async () => {
    const env = setup(), original = expiring(env);
    env.routes.push({ path: '/login/oauth/access_token', result: { ...refreshed, refresh_token: 'bad token' } });
    await assert.rejects(env.service.user(), code('invalidResponse')); assert.deepEqual(plain(env.storage.get(authKey)), original); env.done();
});
test('a verified legacy identity survives transient lookup failures without storing API profile details', async () => {
    const env=setup();env.routes.push({path:'/user',result:{...identity,email:'unused@example.test',private_gists:5}});
    assert.deepEqual(plain(await env.service.user()),identity);
    assert.deepEqual(plain(env.storage.get(authKey).user),identity);
    env.routes.push({path:'/user',status:503,result:{}});
    assert.deepEqual(plain(await env.service.user()),identity);env.done();
});
test('rejected refresh credentials ask for sign-in without destroying the saved record',async()=>{
    const env=setup(),original=expiring(env);env.routes.push({path:'/login/oauth/access_token',result:{error:'bad_refresh_token'}});
    assert.equal(await env.service.user(),null);assert.deepEqual(plain(env.storage.get(authKey)),original);env.done();
});
test('a temporary API failure cannot replay a publishing request',async()=>{
    const env=setup();env.routes.push({path:'/issues',method:'POST',status:503,result:{}});
    await assert.rejects(env.service.submit(envelope),code('networkError'));
    assert.equal(env.calls.length,1);assert.ok(env.storage.has(authKey));env.done();
});
test('a late successful identity lookup cannot restore a logged-out account',async()=>{
    const env=setup();let release;env.routes.push({path:'/user',result:identity,hold:respond=>{release=respond;}});
    const pending=env.service.user();while(!release)await Promise.resolve();await env.service.logout();release();
    assert.equal(await pending,null);assert.equal(env.storage.has(authKey),false);env.done();
});
test('a rejected write is never retried under a different account',async()=>{
    const env=setup();env.storage.get(authKey).user=identity;let release;
    env.routes.push({path:'/issues',method:'POST',status:401,result:{},hold:respond=>{release=respond;}});
    const pending=env.service.submit(envelope);while(!release)await Promise.resolve();
    env.storage.set(authKey,{token:'ghu_other_user',expiresAt:env.now()+3600000,user:{id:8,login:'other'}});release();
    await assert.rejects(pending,code('loginRequired'));assert.equal(env.calls.length,1);assert.equal(env.storage.get(authKey).token,'ghu_other_user');env.done();
});
test('a crashed-tab refresh ticket delays renewal without erasing credentials',async()=>{
    const env=setup(),original=expiring(env),key=authKey+':lock:crashed';
    env.storage.set(key,{ticket:1,expiresAt:env.now()+60000});
    assert.deepEqual(plain(await env.service.user()),identity);
    assert.equal(env.calls.length,0);assert.deepEqual(plain(env.storage.get(authKey)),original);
    env.advance(60001);env.routes.push({path:'/login/oauth/access_token',result:refreshed},{path:'/user',result:identity});
    assert.deepEqual(plain(await env.service.user()),identity);env.done();
});
test('a response arriving after its refresh lease expires cannot overwrite credentials',async()=>{
    const env=setup(),original=expiring(env);
    env.routes.push({path:'/login/oauth/access_token',result:refreshed,check:()=>env.advance(60001)});
    assert.deepEqual(plain(await env.service.user()),identity);
    assert.deepEqual(plain(env.storage.get(authKey)),original);env.done();
});

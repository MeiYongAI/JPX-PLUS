// Only this public app identifier is embedded. Tokens stay in userscript-manager storage.
const JPX_CONFIG_STORE = Object.freeze({ repository: 'MeiYongAI/JPX-PLUS-Configs', clientId: 'Iv23liGY2o8zyCDWgKBV' });
const jpxConfigStore = (() => {
    const repository = JPX_CONFIG_STORE.repository, api = 'https://api.github.com', raw = 'https://raw.githubusercontent.com/' + repository + '/main/';
    const tokenKey = 'jpx-config-store-auth-v1', marker = '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n';
    const kinds = ['battle-mode', 'battle', 'stats'], worlds = ['Persistent', 'Isekai', 'Any'];
    const styles = ['OneHanded', '1H_Mage', 'TwoHanded', '2H_Mage', 'DualWielding', 'DW_Mage', 'NitenIchiryu', 'NI_Mage', 'Staff', 'Unarmed'];
    const modes = styles.flatMap(style => ['General', 'Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'].map(type => style + '_' + type));
    const ruleTypes = { supports: ['spellSupport', 'item', 'toggle', 'stop'], attacks: ['target', 'toggle', 'smartDebuff', 'spellDebuff', 'spellDamage', 'skill', 'normalAttack', 'kamisamaniNattaHi'], keys: ['target', 'spellSupport', 'item', 'toggle', 'stop', 'smartDebuff', 'spellDebuff', 'spellDamage', 'skill', 'normalAttack', 'kamisamaniNattaHi'] };
    const conditionKeys = new Set('world pLevel pMaxSpellType battleTypes difficulty roundCurrent roundLeft roundTotal floor pActionCooldown pActionHistory pActionCounts pTotalActionCounts pHP pMP pSP pOC pSpiritStatus pEffects pIgnoredEffects pEffectStacks monsters activeMonsters defeatedMonsters bosses activeBosses defeatedBosses mLevel mWithoutEffects tName tTypes tClasses tPowerLevel tIndex tHP tMP tSP tEffects tIgnoredEffects tEffectStacks tDaysSinceUpdate'.split(' '));
    const encode = value => new TextEncoder().encode(value), clone = value => JSON.parse(JSON.stringify(value));
    let cache, loginPending, sessionGeneration = 0;
    const error = code => Object.assign(new Error(code), { code });
    const fail = code => { throw error(code); };
    const object = value => value && typeof value === 'object' && !Array.isArray(value);
    const integer = value => Number.isSafeInteger(value) && value > 0;
    const validToken = value => typeof value === 'string' && /^[A-Za-z0-9_]{1,512}$/.test(value);
    const text = (value, max, empty = false) => typeof value === 'string' && (empty || value.trim().length > 0) && value.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
    const issueURL = id => 'https://github.com/' + repository + '/issues/' + id;
    function inspect(value, depth = 0, budget = { nodes: 0, stringLimit: Infinity }) {
        if (++budget.nodes > 12000 || depth > 24) fail('invalidConfig');
        if (typeof value === 'string') { if (value.length > budget.stringLimit) fail('tooLarge'); return; }
        if (value === null || typeof value === 'boolean') return;
        if (typeof value === 'number' && Number.isFinite(value)) return;
        if (typeof value !== 'object') fail('invalidConfig');
        for (const key of Object.keys(value)) {
            if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('invalidConfig');
            inspect(value[key], depth + 1, budget);
        }
    }
    function parse(source, max = 60000) {
        if (typeof source !== 'string' || encode(source).length > max) fail('tooLarge');
        let value;
        try { value = JSON.parse(source); } catch { fail('invalidConfig'); }
        inspect(value); return value;
    }
    function validate(value) {
        inspect(value, 0, { nodes: 0, stringLimit: 30000 });
        if (!object(value) || value.schemaVersion !== 1 || !kinds.includes(value.kind) || !worlds.includes(value.world) ||
            !text(value.title, 100) || /[\r\n]/.test(value.title) || !text(value.description, 4000, true) || typeof value.scriptVersion !== 'string' || !/^[\d.\w-]{1,40}$/.test(value.scriptVersion) || !object(value.config)) fail('invalidConfig');
        if (Object.keys(value).some(key => !['schemaVersion', 'kind', 'title', 'description', 'world', 'mode', 'scriptVersion', 'config'].includes(key))) fail('invalidConfig');
        const config = value.config;
        if (value.kind === 'stats') {
            if (!integer(config.statsVersion) || config.statsVersion < 20260109 || value.mode !== undefined) fail('invalidConfig');
            let count = 0;
            for (const name of ['combatRows', 'revenueRows', 'statsColumns']) if (name in config) {
                if (!Array.isArray(config[name]) || config[name].length > 500) fail('invalidConfig');
                const ids = new Set(); count++;
                for (const row of config[name]) {
                    if (!object(row) || !text(row.id, 100) || ids.has(row.id) || ('disabled' in row && typeof row.disabled !== 'boolean')) fail('invalidConfig');
                    for (const field of ['customName', 'styleText', 'colorThresholds', ...Object.keys(row).filter(key => key.startsWith('s_'))]) if (field in row && typeof row[field] !== 'string') fail('invalidConfig');
                    ids.add(row.id);
                }
            }
            if (!count) fail('invalidConfig');
        } else {
            // Match the original JPX aliases on this detached submission only.
            if (!config.battleVersion && config.version) config.battleVersion = config.version;
            delete config.version;
            if (!config['1H_Mage_General'] && config.Battlecaster_General) config['1H_Mage_General'] = config.Battlecaster_General;
            delete config.Battlecaster_General;
            if (value.mode === 'Battlecaster_General') value.mode = '1H_Mage_General';
            if (!integer(config.battleVersion) || config.battleVersion < 20251216) fail('invalidConfig');
            const selected = modes.filter(mode => mode in config);
            if (!selected.length) fail('invalidConfig');
            let ruleCount = 0;
            for (const mode of selected) {
                if (value.kind === 'battle' && object(config[mode]) && !Object.keys(config[mode]).length) continue;
                if (!object(config[mode]) || !Array.isArray(config[mode].supports) || !Array.isArray(config[mode].attacks)) fail('invalidConfig');
                for (const group of ['supports', 'attacks', ...Object.keys(config[mode]).filter(key => key.startsWith('kb_'))]) {
                    const rules = config[mode][group], allowed = ruleTypes[group] || ruleTypes.keys;
                    if (!Array.isArray(rules)) fail('invalidConfig');
                    if ((ruleCount += rules.length) > 2000) fail('tooLarge');
                    for (const rule of rules) {
                        if (object(rule) && ['spellInstant', 'spellDuration'].includes(rule.type)) rule.type = 'spellSupport';
                        if (object(rule) && ['itemInstant', 'itemDuration'].includes(rule.type)) rule.type = 'item';
                        if (!object(rule) || !allowed.includes(rule.type) || ('conditions' in rule && !Array.isArray(rule.conditions))) fail('invalidConfig');
                        for (const condition of rule.conditions || []) {
                            if (!object(condition) || !conditionKeys.has(condition.key)) fail('invalidConfig');
                            if (condition.key === 'pSpiritStatus' ? typeof condition.value !== 'boolean' : condition.key === 'tName' ? typeof condition.value !== 'string' : !Array.isArray(condition.value)) fail('invalidConfig');
                        }
                    }
                }
            }
            if (value.kind === 'battle-mode' && (!modes.includes(value.mode) || selected.length !== 1 || selected[0] !== value.mode || Object.keys(config).some(key => key !== 'battleVersion' && key !== value.mode))) fail('invalidConfig');
            if (value.kind === 'battle' && value.mode !== undefined) fail('invalidConfig');
        }
        const serialized = JSON.stringify(value) + '\n';
        if (encode(serialized).length + 50 > 60000) fail('tooLarge');
        return value;
    }
    function parseSubmission(body) {
        if (typeof body !== 'string' || !body.startsWith(marker) || !body.endsWith('\n```')) fail('invalidConfig');
        return validate(parse(body.slice(marker.length, -4)));
    }
    async function hash(source) {
        const digest = await crypto.subtle.digest('SHA-256', encode(source));
        return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
    }
    function request(url, { method = 'GET', data, token, signal, limit = 6000000, accept = 'application/json' } = {}) {
        if (typeof GM_xmlhttpRequest !== 'function') return Promise.reject(error('managerUnavailable'));
        const target = new URL(url);
        if (target.protocol !== 'https:' || target.username || target.password || !['api.github.com', 'github.com', 'raw.githubusercontent.com'].includes(target.hostname) || (token && target.hostname !== 'api.github.com')) return Promise.reject(error('invalidResponse'));
        return new Promise((resolve, reject) => {
            let handle, done = false;
            const end = (callback, value) => { if (done) return; done = true; signal?.removeEventListener('abort', abort); callback(value); };
            const abort = () => { handle?.abort(); end(reject, error('cancelled')); };
            if (signal?.aborted) return abort();
            const headers = { Accept: accept };
            if (accept === 'application/vnd.github.raw+json') headers['Cache-Control'] = 'no-cache';
            if (target.hostname === 'api.github.com') headers['X-GitHub-Api-Version'] = '2022-11-28';
            if (token) headers.Authorization = 'Bearer ' + token;
            if (data !== undefined) headers['Content-Type'] = 'application/json';
            signal?.addEventListener('abort', abort, { once: true });
            try {
                handle = GM_xmlhttpRequest({ method, url, headers, data: data === undefined ? undefined : JSON.stringify(data), timeout: 25000, anonymous: true, redirect: 'error',
                    onload(response) {
                        if (response.finalUrl && response.finalUrl !== url) return end(reject, error('invalidResponse'));
                        if (typeof response.responseText !== 'string' || encode(response.responseText).length > limit) return end(reject, error('tooLarge'));
                        if (response.status < 200 || response.status >= 300) {
                            const limited = response.status === 429 || (response.status === 403 && /(?:x-ratelimit-remaining:\s*0\b|retry-after:)/i.test(response.responseHeaders || ''));
                            const code = response.status === 401 ? 'loginRequired' : response.status === 404 ? 'notFound' : limited ? 'rateLimited' : response.status === 403 ? 'accessDenied' : 'networkError';
                            return end(reject, Object.assign(error(code), { status: response.status }));
                        }
                        end(resolve, response.responseText);
                    },
                    onerror: () => end(reject, error('networkError')),
                    ontimeout: () => end(reject, error('networkError')),
                    onabort: () => end(reject, error('cancelled')) });
            } catch { end(reject, error('managerUnavailable')); }
        });
    }
    async function storedToken() {
        if (typeof GM_getValue !== 'function') fail('managerUnavailable');
        const auth = await GM_getValue(tokenKey, null);
        if (!object(auth) || !validToken(auth.token) || !Number.isFinite(auth.expiresAt) || auth.expiresAt <= Date.now() + 30000) {
            if (auth) await logout();
            return null;
        }
        return auth.token;
    }
    async function authenticated(path, options = {}) {
        const token = await storedToken();
        if (!token) fail('loginRequired');
        try { return parse(await request(api + path, { ...options, token }), options.limit || 6000000); }
        catch (err) { if (err.code === 'loginRequired') await logout(); throw err; }
    }
    async function user() {
        if (!await storedToken()) return null;
        try {
            const identity = await authenticated('/user');
            if (!integer(identity.id) || !/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(identity.login)) fail('invalidResponse');
            return { id: identity.id, login: identity.login };
        } catch (err) { if (err.code === 'loginRequired') return null; throw err; }
    }
    async function logout() { sessionGeneration++; if (typeof GM_deleteValue !== 'function') fail('managerUnavailable'); await GM_deleteValue(tokenKey); }
    function pause(milliseconds, signal) {
        return new Promise((resolve, reject) => {
            const abort = () => { clearTimeout(timer); reject(error('cancelled')); };
            if (signal?.aborted) return reject(error('cancelled'));
            const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, milliseconds);
            signal?.addEventListener('abort', abort, { once: true });
        });
    }
    async function login(onDeviceCode, signal) {
        if (!JPX_CONFIG_STORE.clientId) fail('notConfigured');
        if (loginPending) fail('loginPending');
        if (typeof GM_setValue !== 'function') fail('managerUnavailable');
        const generation = sessionGeneration; loginPending = true;
        try {
            const device = parse(await request('https://github.com/login/device/code', { method: 'POST', data: { client_id: JPX_CONFIG_STORE.clientId }, signal }));
            if (!text(device.device_code, 256) || !text(device.user_code, 64) || device.verification_uri !== 'https://github.com/login/device' || !integer(device.expires_in) || device.expires_in > 1800 || !integer(device.interval) || device.interval > 60) fail('invalidResponse');
            onDeviceCode?.({ userCode: device.user_code, verificationUri: device.verification_uri, expiresIn: device.expires_in });
            const expires = Date.now() + device.expires_in * 1000; let interval = Math.max(5, device.interval);
            while (Date.now() < expires) {
                await pause(Math.min(interval * 1000, expires - Date.now()), signal);
                if (generation !== sessionGeneration || signal?.aborted) fail('cancelled');
                if (Date.now() >= expires) break;
                const result = parse(await request('https://github.com/login/oauth/access_token', { method: 'POST', signal, data: { client_id: JPX_CONFIG_STORE.clientId, device_code: device.device_code, grant_type: 'urn:ietf:params:oauth:grant-type:device_code' } }));
                if (result.error === 'authorization_pending') continue;
                if (result.error === 'slow_down') { interval += 5; continue; }
                if (result.error) fail(result.error === 'access_denied' ? 'accessDenied' : result.error === 'expired_token' ? 'loginExpired' : result.error === 'device_flow_disabled' ? 'notConfigured' : 'loginFailed');
                if (!validToken(result.access_token) || result.token_type?.toLowerCase() !== 'bearer') fail('invalidResponse');
                const identity = parse(await request(api + '/user', { token: result.access_token, signal }));
                if (!integer(identity.id) || !/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(identity.login)) fail('invalidResponse');
                if (generation !== sessionGeneration || signal?.aborted) fail('cancelled');
                const lifetime = integer(result.expires_in) ? Math.min(result.expires_in, 28800) : 28800;
                await GM_setValue(tokenKey, { token: result.access_token, expiresAt: Date.now() + lifetime * 1000 });
                if (generation !== sessionGeneration || signal?.aborted) { await logout(); fail('cancelled'); }
                return { id: identity.id, login: identity.login };
            }
            fail('loginExpired');
        } finally { loginPending = false; }
    }
    function entryValid(entry) {
        return object(entry) && integer(entry.id) && text(entry.author, 100) && text(entry.title, 100) && text(entry.description, 4000, true) &&
            kinds.includes(entry.kind) && worlds.includes(entry.world) && text(entry.scriptVersion, 64) && text(entry.updatedAt, 64) &&
            /^[a-f0-9]{64}$/.test(entry.sha256) && entry.configPath === 'catalog/configs/' + entry.id + '-' + entry.sha256 + '.json' && entry.issueUrl === issueURL(entry.id) &&
            (entry.kind === 'battle-mode' ? modes.includes(entry.mode) : entry.mode === undefined);
    }
    async function catalog({ refresh = false } = {}) {
        if (!refresh && cache && Date.now() - cache.at < 60000) return clone(cache.value);
        // Raw GitHub can lag behind a publication even with a cache-busting query.
        const url = refresh ? api + '/repos/' + repository + '/contents/catalog/index.json?ref=main' : raw + 'catalog/index.json';
        const value = parse(await request(url, refresh ? { accept: 'application/vnd.github.raw+json' } : {}), 6000000);
        if (!object(value) || value.schemaVersion !== 1 || !Array.isArray(value.entries) || value.entries.length > 5000 || !text(value.updatedAt, 64)) fail('invalidResponse');
        const ids = new Set();
        for (const entry of value.entries) { if (!entryValid(entry) || ids.has(entry.id)) fail('invalidResponse'); ids.add(entry.id); }
        cache = { at: Date.now(), value }; return clone(value);
    }
    async function load(entry) {
        if (!entryValid(entry)) fail('invalidResponse');
        const source = await request(raw + entry.configPath, { limit: 60000 });
        if (await hash(source) !== entry.sha256) fail('integrityFailed');
        const value = validate(parse(source));
        if (['kind', 'title', 'description', 'world', 'mode', 'scriptVersion'].some(key => value[key] !== entry[key])) fail('integrityFailed');
        return value;
    }
    async function ownIssue(id) {
        if (!integer(id)) fail('invalidResponse');
        const identity = await user(); if (!identity) fail('loginRequired');
        const issue = await authenticated('/repos/' + repository + '/issues/' + id);
        if (issue.pull_request || issue.user?.id !== identity.id || issue.number !== id || issue.html_url !== issueURL(id)) fail('notOwner');
        return issue;
    }
    async function mine() {
        const identity = await user(); if (!identity) fail('loginRequired');
        const collected = [];
        for (let page = 1; page <= 10; page++) {
            const rows = await authenticated('/repos/' + repository + '/issues?state=all&creator=' + encodeURIComponent(identity.login) + '&per_page=100&page=' + page);
            if (!Array.isArray(rows)) fail('invalidResponse');
            for (const row of rows) {
                if (row.pull_request || row.user?.id !== identity.id || !integer(row.number) || row.html_url !== issueURL(row.number) || typeof row.body !== 'string' || !row.body.startsWith(marker)) continue;
                collected.push({ id: row.number, title: row.title, state: row.state, labels: (row.labels || []).map(label => typeof label === 'string' ? label : label.name).filter(label => typeof label === 'string'), body: row.body, url: row.html_url, updatedAt: row.updated_at });
            }
            if (rows.length < 100) break;
            if (page === 10) fail('tooManySubmissions');
        }
        return collected;
    }
    async function submit(input, issueNumber) {
        const value = validate(clone(input));
        if (issueNumber !== undefined) {
            const existing = await ownIssue(issueNumber);
            if (existing.state !== 'open') fail('submissionClosed');
            if (!existing.body?.startsWith(marker)) fail('invalidConfig');
        }
        const body = marker + JSON.stringify(value) + '\n```';
        if (encode(body).length > 60000) fail('tooLarge');
        const result = await authenticated('/repos/' + repository + '/issues' + (issueNumber === undefined ? '' : '/' + issueNumber), { method: issueNumber === undefined ? 'POST' : 'PATCH', data: { title: '[Config] ' + value.title, body } });
        if (!integer(result.number) || result.html_url !== issueURL(result.number)) fail('invalidResponse');
        return { id: result.number, url: result.html_url };
    }
    async function withdraw(id) {
        const issue = await ownIssue(id); if (!issue.body?.startsWith(marker)) fail('invalidConfig');
        await authenticated('/repos/' + repository + '/issues/' + id, { method: 'PATCH', data: { state: 'closed' } });
        cache = null;
    }
    async function feedback(id) {
        const issue = await ownIssue(id), envelope = parseSubmission(issue.body), revision = await hash(JSON.stringify(envelope) + '\n');
        let latest = null;
        for (let page = 1; page <= 10; page++) {
            const rows = await authenticated('/repos/' + repository + '/issues/' + id + '/comments?per_page=100&page=' + page);
            if (!Array.isArray(rows)) fail('invalidResponse');
            for (const row of rows) {
                if (row.user?.login !== 'github-actions[bot]' || row.user.type !== 'Bot' || typeof row.body !== 'string') continue;
                const match = row.body.match(/<!-- JPX-PLUS-REVIEW:v1 (\{[^\r\n]+\}) -->/);
                if (!match) continue;
                try {
                    const value = parse(match[1], 24000);
                    if (value.revision !== revision || !['published', 'changes-requested', 'needs-review', 'unavailable', 'pending'].includes(value.status) || !object(value.summary) || !text(value.summary.en, 3000, true) || !text(value.summary.zh, 3000, true) || !Array.isArray(value.findings) || value.findings.length > 50) continue;
                    if (value.findings.some(item => !object(item) || !['info', 'warning', 'error'].includes(item.severity) || !text(item.path, 300, true) || !text(item.en, 3000, true) || !text(item.zh, 3000, true))) continue;
                    latest = value;
                } catch { /* Ignore malformed, unrelated, or stale comments. */ }
            }
            if (rows.length < 100) break;
            if (page === 10) fail('tooManySubmissions');
        }
        return latest;
    }
    return Object.freeze({ catalog, load, user, login, logout, mine, submit, withdraw, parseSubmission, feedback });
})();

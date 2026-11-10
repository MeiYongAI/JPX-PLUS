// Config Store stays inside the userscript sandbox. No credentials or transport are exposed to the page.
// Construction is offline; network activity starts only after render() is explicitly called.
function createJpxIntegratedStore(host, translate) {
    'use strict';
    const translations = {"en":{"name":"Config store","browse":"Browse","mine":"My configs","share":"Share config","signIn":"Sign in","signOut":"Sign out","signedOut":"Signed out.","currentMode":"Battle mode","allBattle":"All battle settings","stats":"Statistics","persistent":"Persistent","isekai":"Isekai","anyWorld":"Both worlds","back":"Back","retry":"Retry","refresh":"Refresh","search":"Search configs or authors","type":"Type","allTypes":"All types","loading":"Loading…","noMatches":"No matching configs.","noConfigs":"No configs have been published yet.","cannotLoad":"This content could not be loaded.","columns":"Columns","combatRows":"Combat rows","revenueRows":"Revenue rows","supports":"Support rules","attacks":"Attack rules","customCode":"Custom code","viewConfig":"View configuration","scriptVersion":"Script version","import":"Import into settings","download":"Download config","imported":"Imported. Review your settings, then save.","importHint":"Importing can be undone. Save in Settings when ready.","connecting":"Connecting to GitHub…","authHint":"Enter this code on GitHub to authorize JPX-PLUS.","authorize":"Authorize on GitHub","waitingAuth":"Waiting for authorization. This page will continue automatically.","cancel":"Cancel","updateShare":"Update","configContents":"Config content","keepSharedConfig":"Keep shared config","noMatchingLocal":"No matching saved configs","shareChanged":"This share changed elsewhere. Reopen it before submitting.","localChanged":"This saved config changed. Select it again before submitting.","updateSubmitted":"Update submitted for review.","editShare":"Edit","world":"World","title":"Title","description":"Description","submit":"Submit for review","submitUpdate":"Submit update","reviewHint":"Shared publicly on GitHub. Code and suspicious content require AI security review and maintainer approval.","loginBeforeShare":"Sign in to GitHub when you submit. Your draft stays here.","submitting":"Submitting…","submitted":"Submitted for review.","pending":"In review","published":"Published","changes":"Changes needed","needsReview":"Maintainer review","unavailable":"Review unavailable","hidden":"Hidden","withdrawn":"Withdrawn","noShares":"No shared configs.","withdraw":"Withdraw","removeShare":"Remove from list","removeShareConfirm":"Remove this withdrawn share from the list? Its GitHub record and local configs will stay.","withdrawFirst":"Withdraw this share before removing its record. Refresh the list and try again.","withdrawConfirm":"Withdraw this configuration from the store? Players who imported it will keep their local copy.","review":"Review feedback","noReview":"No review is available for this revision yet.","loginRequired":"Sign in to GitHub to manage your shared configs.","notConfigured":"GitHub sign-in is not configured yet.","rateLimit":"GitHub's request limit was reached. Please try again later.","networkError":"Could not reach GitHub. Check your connection and try again.","invalidConfig":"This configuration has an invalid format.","tooLarge":"This configuration exceeds the size limit.","integrityError":"The downloaded configuration did not pass its integrity check.","requestFailed":"The request failed. Please try again.","OneHanded":"One-handed","1H_Mage":"1H Mage","TwoHanded":"Two-handed","2H_Mage":"2H Mage","DualWielding":"Dual wield","DW_Mage":"DW Mage","NitenIchiryu":"Niten Ichiryu","NI_Mage":"NI Mage","Staff":"Staff","Unarmed":"Unarmed","General":"General","Arena":"Arena","Encounter":"Encounter","Colosseum":"Colosseum","Battle1000":"Grindfest","Item":"Item World","Tower":"Tower","publishedVersion":"Published version","accessDenied":"GitHub authorization was cancelled.","loginExpired":"The authorization code expired. Please sign in again.","managerUnavailable":"Enable the plugin permissions in your userscript manager.","notOwner":"Only the author can edit this configuration.","submissionClosed":"This configuration has been withdrawn. Share it again as a new submission.","tooManySubmissions":"There are too many submissions to load at once. Please open GitHub to manage them.","local":"Current","backpack":"Backpack","shared":"Shared","style":"Style","battleType":"Battle type","all":"All","shareShort":"Share","useConfig":"Use config","chooseConfig":"Choose a config","currentSettings":"Current settings","savedSettings":"Saved settings","noLocal":"No local configs are available.","updateCore":"Update JPX-PLUS to browse saved configs from both worlds. Current settings are available below.","changeConfig":"Change config","appliesTo":"Applies to","saveBackpack":"Save to backpack","saveCurrent":"Save a current config","emptyBackpack":"Your backpack is empty. Save configs from your settings or the store to keep several versions.","searchBackpack":"Search backpack","editBackpack":"Edit saved config","save":"Save","saving":"Saving…","savedBackpack":"Saved to backpack.","backpackHint":"Kept locally in this browser. Apply or share it when you are ready.","apply":"Apply config","delete":"Delete","deleteBackpackConfirm":"Delete this copy from your backpack? Your applied settings and shared configs will stay unchanged.","storageCorrupt":"The backpack data could not be read. Your saved data has been kept.","storageError":"Could not access backpack storage. Please check the plugin permissions and try again.","localNotFound":"This config is no longer in your backpack.","savedConfig":"Saved to My configs.","saved":"Saved","filters":"Filters","allWorlds":"Any world","allStyles":"All styles","allBattles":"All battles","clearFilters":"Clear filters","sort":"Sort","latest":"Updated","nameSort":"Name","resultCount":"${count} found","showMore":"Show more","comments":"Comments","writeComment":"Write a comment…","postComment":"Post","commentSignIn":"Sign in to comment","noComments":"No comments yet.","commentsPublic":"Comments are public on GitHub","editComment":"Edit","deleteCommentConfirm":"Delete this comment?","commentPosted":"Comment posted.","commentDeleted":"Comment deleted.","commentNotOwner":"You can only change your own comments.","commentChanged":"This comment has changed. Cancel editing, refresh, and try again.","commentMissing":"This comment is no longer available. Refresh and try again.","commentInvalid":"Enter a comment of up to 10,000 characters.","commentDenied":"You cannot change comments here. Check your GitHub permissions.","commentsClosed":"Comments are closed for this config.","commentSendFailed":"Sending was not confirmed. Refresh to check before posting again.","noRatings":"No ratings yet","ratingCount":"${count} ratings","yourRating":"Your rating","ratingStars":"${score} stars","ratingSignIn":"Sign in to rate","removeRating":"Withdraw","ratingSaved":"Rating saved.","ratingRemoved":"Rating withdrawn.","ratingFailed":"The rating could not be confirmed. Refresh to check.","ratingInvalid":"Choose 1 to 5 stars.","ratingsClosed":"Ratings are closed for this config.","ratingDenied":"You cannot rate this config. Check your GitHub permissions.","ratingChanged":"Your rating changed elsewhere. Refresh and try again.","ratingsTooMany":"Too many comments to load your rating. Open this config on GitHub.","ratingCountOne":"1 rating","downloadCount":"${count} downloads","downloadsUnavailable":"Downloads unavailable"}};
    const t = key => {
        const name = key.replace(/^cStore\./, '');
        const pack = host.jpxI18N?.cStore?.[name];
        if (typeof pack === 'string') return pack;
        const external = translate?.(key);
        const missing = name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());
        if (typeof external === 'string' && external !== key && external !== name && external !== missing) return external;
        const fallback = translations.en;
        return fallback[name] || name;
    };
// Only this public app identifier is embedded. Tokens stay in userscript-manager storage.
const JPX_CONFIG_STORE = Object.freeze({ repository: 'MeiYongAI/JPX-PLUS-Configs', clientId: 'Iv23liGY2o8zyCDWgKBV' });
const styles = ['OneHanded', '1H_Mage', 'TwoHanded', '2H_Mage', 'DualWielding', 'DW_Mage', 'NitenIchiryu', 'NI_Mage', 'Staff', 'Unarmed'];
const battleTypes = ['General', 'Arena', 'Encounter', 'Colosseum', 'Battle1000', 'Item', 'Tower'];
const ratingTotals = new Map();
const downloadCounts = createJpxStoreDownloads();
const jpxConfigStore = (() => {
    const repository = JPX_CONFIG_STORE.repository, api = 'https://api.github.com', raw = 'https://raw.githubusercontent.com/' + repository + '/main/';
    const tokenKey = 'jpx-config-store-auth-v1', marker = '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n';
    const archivedMarker = '<!-- JPX-PLUS-CONFIG-ARCHIVED:v1 -->\n```json\n';
    const ratingPrefix = '<!-- JPX-PLUS-RATING:';
    const ratingBody = score => '<!-- JPX-PLUS-RATING:v1 {"score":' + score + '} -->\nRating: ' + score + '/5';
    const ratingScore = body => [1, 2, 3, 4, 5].find(score => body === ratingBody(score)) || null;
    const kinds = ['battle-mode', 'battle', 'stats'], worlds = ['Persistent', 'Isekai', 'Any'];
    const modes = styles.flatMap(style => battleTypes.map(type => style + '_' + type));
    const ruleTypes = { supports: ['spellSupport', 'item', 'toggle', 'stop'], attacks: ['target', 'toggle', 'smartDebuff', 'spellDebuff', 'spellDamage', 'skill', 'normalAttack', 'kamisamaniNattaHi'], keys: ['target', 'spellSupport', 'item', 'toggle', 'stop', 'smartDebuff', 'spellDebuff', 'spellDamage', 'skill', 'normalAttack', 'kamisamaniNattaHi'] };
    const conditionKeys = new Set('world pLevel pMaxSpellType battleTypes difficulty roundCurrent roundLeft roundTotal floor pActionCooldown pActionHistory pActionCounts pTotalActionCounts pHP pMP pSP pOC pSpiritStatus pEffects pIgnoredEffects pEffectStacks monsters activeMonsters defeatedMonsters bosses activeBosses defeatedBosses mLevel mWithoutEffects tName tTypes tClasses tPowerLevel tIndex tHP tMP tSP tEffects tIgnoredEffects tEffectStacks tDaysSinceUpdate'.split(' '));
    const encode = value => new TextEncoder().encode(value), clone = value => JSON.parse(JSON.stringify(value));
    let cache, loginPending, refreshing, sessionGeneration = 0;
    const pendingSubmissions = new Map();
    const error = code => Object.assign(new Error(code), { code });
    const fail = code => { throw error(code); };
    const object = value => value && typeof value === 'object' && !Array.isArray(value);
    const integer = value => Number.isSafeInteger(value) && value > 0;
    const validToken = value => typeof value === 'string' && /^[A-Za-z0-9_]{1,512}$/.test(value);
    const text = (value, max, empty = false) => typeof value === 'string' && (empty || value.trim().length > 0) && value.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
    const issueURL = id => 'https://github.com/' + repository + '/issues/' + id;
    function inspect(value, depth = 0, budget = { nodes: 0, stringLimit: Infinity }) {
        if (++budget.nodes > (budget.nodeLimit || 12000) || depth > 24) fail('invalidConfig');
        if (typeof value === 'string') { if (value.length > budget.stringLimit) fail('tooLarge'); return; }
        if (value === null || typeof value === 'boolean') return;
        if (typeof value === 'number' && Number.isFinite(value)) return;
        if (typeof value !== 'object') fail('invalidConfig');
        const keys = Object.keys(value);
        if (budget.exactJSON && (Object.getOwnPropertySymbols(value).length ||
            (Array.isArray(value) ? keys.length !== value.length || keys.some(key => !/^(0|[1-9]\d*)$/.test(key) || +key >= value.length) :
                Object.prototype.toString.call(value) !== '[object Object]'))) fail('invalidConfig');
        for (const key of keys) {
            if (['__proto__', 'prototype', 'constructor'].includes(key)) fail('invalidConfig');
            if (budget.exactJSON) {
                const property = Object.getOwnPropertyDescriptor(value, key);
                if (property.get || property.set) fail('invalidConfig');
            }
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
            if ('columnGroups' in config && (!object(config.columnGroups) || Object.values(config.columnGroups).some(value => typeof value !== 'boolean'))) fail('invalidConfig');
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
    const validIdentity = value => object(value) && integer(value.id) && typeof value.login === 'string' && /^[a-z\d](?:[a-z\d-]{0,38})$/i.test(value.login);
    const sameAuth = (left, right) => !!left && !!right && left.token === right.token && left.refreshToken === right.refreshToken;
    function readAuth() {
        if (typeof GM_getValue !== 'function') fail('managerUnavailable');
        return GM_getValue(tokenKey, null);
    }
    function authFromResponse(result) {
        if (!validToken(result.access_token) || result.token_type?.toLowerCase() !== 'bearer' ||
            result.expires_in !== undefined && !integer(result.expires_in)) fail('invalidResponse');
        const auth = { token: result.access_token, expiresAt: result.expires_in === undefined ? null : Date.now() + result.expires_in * 1000 };
        if (result.refresh_token !== undefined) {
            if (!validToken(result.refresh_token) || !integer(result.refresh_token_expires_in)) fail('invalidResponse');
            auth.refreshToken = result.refresh_token; auth.refreshExpiresAt = Date.now() + result.refresh_token_expires_in * 1000;
        }
        return auth;
    }
    function forgetAuth(expected) {
        // A late 401 from an old tab/request must not erase a renewed login.
        if (!sameAuth(readAuth(), expected)) return;
        if (typeof GM_deleteValue !== 'function') fail('managerUnavailable');
        sessionGeneration++; pendingSubmissions.clear(); GM_deleteValue(tokenKey);
    }
    async function withAuthLock(action) {
        if (typeof GM_listValues !== 'function' || typeof GM_setValue !== 'function' || typeof GM_deleteValue !== 'function') fail('managerUnavailable');
        // Bakery tickets in userscript storage also coordinate primary/alt hosts.
        // Each contender owns one key; a crashed tab's ticket expires.
        const prefix = tokenKey + ':lock:', key = prefix + crypto.randomUUID();
        const expiresAt = Date.now() + 60000;
        const tickets = () => GM_listValues().filter(name => name.startsWith(prefix)).map(name => [name, GM_getValue(name, null)])
            .filter(([, value]) => object(value) && Number.isFinite(value.expiresAt) && value.expiresAt > Date.now() && Number.isSafeInteger(value.ticket) && value.ticket >= 0);
        GM_setValue(key, { ticket: 0, expiresAt });
        try {
            const ticket = Math.max(0, ...tickets().map(([, value]) => value.ticket)) + 1;
            GM_setValue(key, { ticket, expiresAt });
            while (tickets().some(([name, value]) => name !== key && (value.ticket === 0 || value.ticket < ticket || value.ticket === ticket && name < key))) {
                if (Date.now() >= expiresAt - 26000) fail('networkError');
                await pause(100);
            }
            if (Date.now() >= expiresAt - 26000) fail('networkError');
            return await action(() => Date.now() < expiresAt);
        } finally { GM_deleteValue(key); }
    }
    async function renewAuth(expected) {
        if (refreshing) return refreshing;
        const generation = sessionGeneration;
        refreshing = withAuthLock(async leaseAlive => {
            let auth = readAuth();
            if (generation !== sessionGeneration || !sameAuth(auth, expected)) return auth;
            if (!validToken(auth.refreshToken) || !Number.isFinite(auth.refreshExpiresAt) || auth.refreshExpiresAt <= Date.now()) return auth;
            // GitHub device-flow refresh does not require a client secret.
            // Never copy these credentials into page storage, exports or logs.
            const result = parse(await request('https://github.com/login/oauth/access_token', { method: 'POST', data: {
                client_id: JPX_CONFIG_STORE.clientId, grant_type: 'refresh_token', refresh_token: auth.refreshToken
            } }));
            if (generation !== sessionGeneration || !sameAuth(readAuth(), auth)) return readAuth();
            if (result.error) {
                // Retain the record: another process may have just rotated it,
                // and network/server errors are never a reason to sign out.
                if (['bad_refresh_token', 'expired_token', 'invalid_grant'].includes(result.error)) fail('loginRequired');
                fail('networkError');
            }
            const renewed = authFromResponse(result);
            if (renewed.expiresAt !== null && !renewed.refreshToken) fail('invalidResponse');
            if (!leaseAlive()) fail('networkError');
            if (validIdentity(auth.user)) renewed.user = auth.user;
            GM_setValue(tokenKey, renewed);
            return renewed;
        }).finally(() => { refreshing = null; });
        return refreshing;
    }
    async function storedAuth() {
        let auth = await readAuth();
        if (!object(auth) || !validToken(auth.token)) return null;
        if (Number.isFinite(auth.expiresAt) && auth.expiresAt <= Date.now() + 30000 && validToken(auth.refreshToken)) auth = await renewAuth(auth);
        // Older versions invented an eight-hour deadline even for permanent
        // tokens. Without a refresh token, let GitHub decide validity via 401.
        return object(auth) && validToken(auth.token) ? auth : null;
    }
    async function authenticated(path, options = {}, onSuccess) {
        const { rawResponse = false, expectedUserId, ...requestOptions } = options;
        let auth = await storedAuth();
        if (!auth) fail('loginRequired');
        for (let attempt = 0; attempt < 2; attempt++) {
            if (expectedUserId !== undefined && auth.user?.id !== expectedUserId) fail('loginRequired');
            try {
                const response = await request(api + path, { ...requestOptions, token: auth.token });
                const value = rawResponse ? response : parse(response, options.limit || 6000000);
                onSuccess?.(value, auth); return value;
            }
            catch (err) {
                if (err.code !== 'loginRequired') throw err;
                const current = readAuth();
                if (!sameAuth(current, auth)) {
                    if (options.method && options.method !== 'GET' && (!validIdentity(auth.user) || !validIdentity(current?.user) || auth.user.id !== current.user.id)) throw err;
                    if (!attempt && current && validToken(current.token)) { auth = await storedAuth(); if (auth) continue; }
                    throw err;
                }
                if (!attempt && validToken(auth.refreshToken) && auth.refreshExpiresAt > Date.now()) {
                    auth = await renewAuth(auth); if (auth) continue;
                } else forgetAuth(auth);
                throw err;
            }
        }
    }
    async function user() {
        try {
            const identity = await authenticated('/user', {}, (value, auth) => {
                if (!validIdentity(value)) fail('invalidResponse');
                const current = readAuth();
                if (!sameAuth(current, auth)) fail('loginRequired');
                if (sameAuth(current, auth) && (current.user?.id !== value.id || current.user?.login !== value.login) && typeof GM_setValue === 'function') {
                    GM_setValue(tokenKey, { ...current, user: { id: value.id, login: value.login } });
                }
            });
            return { id: identity.id, login: identity.login };
        } catch (err) {
            if (err.code === 'loginRequired') return null;
            const auth = readAuth();
            if (['networkError', 'rateLimited'].includes(err.code) && validToken(auth?.token) && validIdentity(auth?.user)) return { id: auth.user.id, login: auth.user.login };
            throw err;
        }
    }
    async function logout() { sessionGeneration++; pendingSubmissions.clear(); if (typeof GM_deleteValue !== 'function') fail('managerUnavailable'); await GM_deleteValue(tokenKey); }
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
                const auth = authFromResponse(result);
                const identity = parse(await request(api + '/user', { token: result.access_token, signal }));
                if (!validIdentity(identity)) fail('invalidResponse');
                if (generation !== sessionGeneration || signal?.aborted) fail('cancelled');
                auth.user = { id: identity.id, login: identity.login };
                await GM_setValue(tokenKey, auth);
                if (generation !== sessionGeneration || signal?.aborted) { forgetAuth(auth); fail('cancelled'); }
                return { id: identity.id, login: identity.login };
            }
            fail('loginExpired');
        } finally { loginPending = false; }
    }
    function entryValid(entry) {
        return object(entry) && integer(entry.id) && text(entry.author, 100) && text(entry.title, 100) && text(entry.description, 4000, true) &&
            kinds.includes(entry.kind) && worlds.includes(entry.world) && text(entry.scriptVersion, 64) && text(entry.updatedAt, 64) &&
            (entry.rating === undefined || object(entry.rating) && Number.isSafeInteger(entry.rating.count) && entry.rating.count >= 0 &&
                Number.isSafeInteger(entry.rating.sum) && entry.rating.sum >= entry.rating.count && entry.rating.sum <= 5 * entry.rating.count) &&
            /^[a-f0-9]{64}$/.test(entry.sha256) && entry.configPath === 'catalog/configs/' + entry.id + '-' + entry.sha256 + '.json' && entry.issueUrl === issueURL(entry.id) &&
            (entry.kind === 'battle-mode' ? modes.includes(entry.mode) : entry.mode === undefined) &&
            (entry.modes === undefined || Array.isArray(entry.modes) && entry.modes.length <= modes.length && new Set(entry.modes).size === entry.modes.length &&
                entry.modes.every(mode => modes.includes(mode)) && (entry.kind === 'stats' ? !entry.modes.length : entry.kind !== 'battle-mode' || entry.modes.length === 1 && entry.modes[0] === entry.mode));
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
                collected.push({ id: row.number, title: row.title, state: row.state, labels: (row.labels || []).map(label => typeof label === 'string' ? label : label.name).filter(label => typeof label === 'string'), body: row.body, url: row.html_url, updatedAt: row.updated_at,
                    pending: pendingSubmissions.get(row.number) === row.body });
            }
            if (rows.length < 100) break;
            if (page === 10) fail('tooManySubmissions');
        }
        return collected;
    }
    async function submit(input, issueNumber, expectedBody) {
        const value = validate(clone(input));
        const generation = sessionGeneration;
        if (issueNumber !== undefined) {
            const existing = await ownIssue(issueNumber);
            if (existing.state !== 'open') fail('submissionClosed');
            if (!existing.body?.startsWith(marker)) fail('invalidConfig');
            if (typeof expectedBody !== 'string' || existing.body !== expectedBody) fail('shareChanged');
        }
        if (generation !== sessionGeneration) fail('loginRequired');
        const body = marker + JSON.stringify(value) + '\n```';
        if (encode(body).length > 60000) fail('tooLarge');
        const result = await authenticated('/repos/' + repository + '/issues' + (issueNumber === undefined ? '' : '/' + issueNumber), { method: issueNumber === undefined ? 'POST' : 'PATCH', data: { title: '[Config] ' + value.title, body } });
        if (!integer(result.number) || result.html_url !== issueURL(result.number) || result.body !== body || result.state !== 'open' || issueNumber !== undefined && result.number !== issueNumber) fail('invalidResponse');
        pendingSubmissions.set(result.number, body);
        return { id: result.number, url: result.html_url };
    }
    async function withdraw(id) {
        const issue = await ownIssue(id); if (!issue.body?.startsWith(marker)) fail('invalidConfig');
        await authenticated('/repos/' + repository + '/issues/' + id, { method: 'PATCH', data: { state: 'closed' } });
        cache = null;
    }
    async function archive(id) {
        const generation = sessionGeneration, issue = await ownIssue(id);
        if (generation !== sessionGeneration) fail('loginRequired');
        if (issue.state !== 'closed') fail('withdrawFirst');
        if (issue.body?.startsWith(archivedMarker)) return;
        if (!issue.body?.startsWith(marker)) fail('invalidConfig');
        // Keep the issue and exact configuration as an audit record. A distinct
        // marker removes it from Shared on every device without admin privileges.
        const body = archivedMarker + issue.body.slice(marker.length);
        const result = await authenticated('/repos/' + repository + '/issues/' + id, { method: 'PATCH', data: { state: 'closed', body } });
        if (result.number !== id || result.html_url !== issueURL(id) || result.user?.id !== issue.user.id || result.state !== 'closed' || result.body !== body) fail('invalidResponse');
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
        if (latest && latest.status !== 'pending' && pendingSubmissions.get(id) === issue.body) pendingSubmissions.delete(id);
        return latest;
    }
    function commentRecord(row, issue) {
        if (!object(row) || !integer(row.id) || !validIdentity(row.user) || row.user.type !== 'User' ||
            !text(row.body, 65536, true) || row.html_url !== issueURL(issue) + '#issuecomment-' + row.id ||
            row.issue_url !== api + '/repos/' + repository + '/issues/' + issue ||
            !Number.isFinite(Date.parse(row.created_at)) || !Number.isFinite(Date.parse(row.updated_at))) return null;
        return { id: row.id, body: row.body, author: { id: row.user.id, login: row.user.login },
            createdAt: row.created_at, updatedAt: row.updated_at, url: row.html_url };
    }
    async function comments(issue, page = 1) {
        if (!integer(issue) || !integer(page) || page > 1000) fail('invalidResponse');
        const path = '/repos/' + repository + '/issues/' + issue + '/comments?per_page=30&page=' + page;
        let rows;
        try { rows = await authenticated(path); }
        catch (error) {
            if (error.code !== 'loginRequired') throw error;
            rows = parse(await request(api + path), 6000000);
        }
        if (!Array.isArray(rows) || rows.length > 30) fail('invalidResponse');
        return { items: rows.map(row => commentRecord(row, issue)).filter(row => row && !row.body.startsWith(ratingPrefix)), nextPage: rows.length === 30 ? page + 1 : null };
    }
    function commentBody(value) {
        if (!text(value, 10000) || encode(value).length > 60000 || value.trim().startsWith(ratingPrefix)) fail('commentInvalid');
        return value.trim();
    }
    async function commentIdentity(expectedUserId) {
        if (!integer(expectedUserId)) fail('loginRequired');
        const identity = await user();
        if (identity?.id !== expectedUserId) fail('loginRequired');
        return identity;
    }
    async function commentMutation(action) {
        try { return await action(); }
        catch (error) {
            if (error.code === 'rateLimited') throw error;
            if (error.status === 403) fail('commentDenied');
            if (error.status === 404) fail('commentMissing');
            if (error.status === 422) fail('commentInvalid');
            throw error;
        }
    }
    async function commentIssue(issue, expectedUserId) {
        const path = '/repos/' + repository + '/issues/' + issue;
        const current = await authenticated(path, { expectedUserId });
        if (current.number !== issue || current.html_url !== issueURL(issue) || current.pull_request || !current.body?.startsWith(marker)) fail('invalidResponse');
        if (current.locked || current.state !== 'open' || current.labels?.some(label => (label.name || label) === 'store:hide')) fail('commentsClosed');
        return path;
    }
    async function addComment(issue, input, expectedUserId) {
        if (!integer(issue)) fail('invalidResponse');
        const body = commentBody(input), identity = await commentIdentity(expectedUserId);
        return commentMutation(async () => {
            const path = await commentIssue(issue, expectedUserId);
            const result = commentRecord(await authenticated(path + '/comments', { method: 'POST', data: { body }, expectedUserId }), issue);
            if (!result || result.author.id !== identity.id || result.body !== body) fail('invalidResponse');
            return result;
        });
    }
    async function ownComment(issue, expected, expectedUserId, rating = false) {
        if (!integer(issue) || !integer(expected?.id) || !text(expected.body, 65536, true) || !text(expected.updatedAt, 64)) fail('invalidResponse');
        const identity = await commentIdentity(expectedUserId);
        const path = '/repos/' + repository + '/issues/comments/' + expected.id;
        const current = commentRecord(await authenticated(path, { expectedUserId }), issue);
        if (!current || current.author.id !== identity.id) fail('commentNotOwner');
        if (rating ? !ratingScore(current.body) : current.body.startsWith(ratingPrefix)) fail('invalidResponse');
        if (current.body !== expected.body || current.updatedAt !== expected.updatedAt) fail('commentChanged');
        return { current, path };
    }
    async function updateComment(issue, expected, input, expectedUserId) {
        const body = commentBody(input);
        return commentMutation(async () => {
            const { current, path } = await ownComment(issue, expected, expectedUserId);
            if (current.body === body) return current;
            const result = commentRecord(await authenticated(path, { method: 'PATCH', data: { body }, expectedUserId }), issue);
            if (!result || result.id !== current.id || result.author.id !== current.author.id || result.body !== body) fail('invalidResponse');
            return result;
        });
    }
    async function deleteComment(issue, expected, expectedUserId) {
        return commentMutation(async () => {
            const { path } = await ownComment(issue, expected, expectedUserId);
            await authenticated(path, { method: 'DELETE', rawResponse: true, expectedUserId });
            return true;
        });
    }
    async function ratingRecords(issue, expectedUserId) {
        if (!integer(issue)) fail('invalidResponse');
        await commentIdentity(expectedUserId);
        const records = [];
        for (let page = 1; page <= 100; page++) {
            const rows = await authenticated('/repos/' + repository + '/issues/' + issue + '/comments?per_page=100&page=' + page, { expectedUserId });
            if (!Array.isArray(rows) || rows.length > 100) fail('invalidResponse');
            for (const row of rows) { const value = commentRecord(row, issue); if (value && ratingScore(value.body)) records.push(value); }
            if (rows.length < 100) return records;
        }
        fail('ratingsTooMany');
    }
    function ratingState(records, expectedUserId) {
        const votes = new Map();
        for (const record of records.slice().sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt) || a.id - b.id)) votes.set(record.author.id, record);
        return { score: ratingScore(votes.get(expectedUserId)?.body), count: votes.size, sum: [...votes.values()].reduce((sum, row) => sum + ratingScore(row.body), 0) };
    }
    async function rating(issue, expectedUserId) { return ratingState(await ratingRecords(issue, expectedUserId), expectedUserId); }
    async function setRating(issue, score, expectedUserId) {
        if (!integer(issue) || score !== null && (!Number.isInteger(score) || score < 1 || score > 5)) fail('ratingInvalid');
        return commentMutation(async () => {
            let records = await ratingRecords(issue, expectedUserId);
            const own = records.filter(row => row.author.id === expectedUserId).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || b.id - a.id);
            if (score === null) {
                // Remove older duplicates first so withdrawing never resurrects an old vote.
                for (const row of own.slice().reverse()) {
                    const { path } = await ownComment(issue, row, expectedUserId, true);
                    await authenticated(path, { method: 'DELETE', rawResponse: true, expectedUserId });
                }
                records = records.filter(row => row.author.id !== expectedUserId);
            } else {
                const path = await commentIssue(issue, expectedUserId), body = ratingBody(score);
                const current = own[0];
                if (!current || current.body !== body) {
                    const target = current ? (await ownComment(issue, current, expectedUserId, true)).path : path + '/comments';
                    const saved = commentRecord(await authenticated(target, { method: current ? 'PATCH' : 'POST', data: { body }, expectedUserId }), issue);
                    if (!saved || saved.author.id !== expectedUserId || saved.body !== body || current && saved.id !== current.id) fail('invalidResponse');
                    records = records.filter(row => row.id !== saved.id); records.push(saved);
                }
            }
            cache = null; return ratingState(records, expectedUserId);
        });
    }
    return Object.freeze({ catalog, load, user, login, logout, mine, submit, withdraw, archive, parseSubmission, feedback,
        comments, addComment, updateComment, deleteComment, rating, setRating, prepare: input => validate(clone(input)) });
})();


function renderConfigStore(parent, hooks, options = {}) {
    const doc = parent.ownerDocument;
    const tr = key => t('cStore.' + key);
    const el = (tag, text, className) => {
        const node = doc.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    const root = el('section', undefined, 'jpx-store');
    const toolbar = el('div', undefined, 'jpx-store-toolbar');
    const navigation = el('div', undefined, 'jpx-store-navigation');
    const account = el('div', undefined, 'jpx-store-account');
    const status = el('p', '', 'jpx-store-status');
    status.setAttribute('role', 'status');
    status.hidden = true;
    const viewHeader = el('div', undefined, 'jpx-store-view-header');
    const stage = el('div', undefined, 'jpx-store-stage');
    const layoutEvents = new AbortController();
    let browseControls = null, commentView = null, ratingView = null;
    const commentDrafts = new Map();
    const state = { view: 'browse', entries: [], query: '', sharedQuery: '', kind: '', world: '', style: '', battleType: '', sort: 'updated',
        filtersOpen: false, visible: 30, browseScroll: 0,
        user: null, editor: null, request: 0, login: null, disposed: false, suspended: false, saved: new Set(), authGeneration: 0, currentEntry: null };
    const alive = () => !state.disposed && !state.suspended && root.isConnected;
    function downloadCount(id) {
        const node = el('span', undefined, 'jpx-download-count'); node.dataset.downloadId = String(id); node.setAttribute('role', 'img');
        node.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></svg><span></span>';
        paintDownloadCount(node); return node;
    }
    function paintDownloadCount(node) {
        const count = downloadCounts.peek(Number(node.dataset.downloadId)), text = count === null ? '—' : count.toLocaleString();
        node.lastElementChild.textContent = text;
        node.title = tr(count === null ? 'downloadsUnavailable' : 'downloadCount').replace('${count}', text);
        node.setAttribute('aria-label', node.title);
    }
    function refreshDownloadCounts() {
        const nodes = [...stage.querySelectorAll('.jpx-download-count')];
        const pending = [];
        for (let i = 0; i < nodes.length; i += 100) pending.push(downloadCounts.counts(nodes.slice(i, i + 100).map(node => Number(node.dataset.downloadId))));
        Promise.all(pending).then(() => {
            if (alive()) nodes.filter(node => node.isConnected).forEach(paintDownloadCount);
        }).catch(() => {});
    }
    function recordDownload(id) {
        downloadCounts.record(id).then(() => {
            if (alive()) stage.querySelectorAll('.jpx-download-count').forEach(paintDownloadCount);
        }).catch(() => {});
    }
    function layoutBrowseControls() {
        if (!alive()) return;
        if (!browseControls) return;
        const { queryBar, results, refresh, clear, sort } = browseControls;
        const mobile = root.closest('.jpx-settings-mobile');
        const focused = doc.activeElement;
        if (options.toolbarHost) {
            if (mobile) {
                if (queryBar.parentElement !== options.toolbarHost || queryBar.previousElementSibling !== toolbar) options.toolbarHost.append(queryBar);
                if (refresh.parentElement !== queryBar) queryBar.append(refresh);
                if (clear && clear.parentElement !== results) results.insertBefore(clear, sort);
            } else {
                if (queryBar.parentElement !== options.toolbarHost || queryBar.nextElementSibling !== toolbar) options.toolbarHost.insertBefore(queryBar, toolbar);
                const refreshHost = results || queryBar;
                if (refresh.parentElement !== refreshHost) refreshHost.append(refresh);
                if (clear && clear.parentElement !== queryBar) queryBar.append(clear);
            }
            if (results && results.parentElement !== viewHeader) viewHeader.append(results);
        } else if (mobile) {
            if (results.parentElement !== viewHeader) viewHeader.append(results);
        } else if (results.parentElement !== queryBar) queryBar.insertBefore(results, queryBar.lastElementChild);
        if (focused?.isConnected && focused !== doc.activeElement) focused.focus({ preventScroll: true });
    }
    doc.defaultView.addEventListener('resize', layoutBrowseControls, { signal: layoutEvents.signal });
    doc.defaultView.visualViewport?.addEventListener('resize', layoutBrowseControls, { signal: layoutEvents.signal });
    function message(text, error = false) {
        status.textContent = text || '';
        status.hidden = !text;
        status.dataset.error = String(error);
    }
    function errorMessage(error) {
        const codes = { loginRequired: 'loginRequired', notConfigured: 'notConfigured', rateLimited: 'rateLimit',
            networkError: 'networkError', invalidConfig: 'invalidConfig', tooLarge: 'tooLarge', integrityFailed: 'integrityError',
            accessDenied: 'accessDenied', loginExpired: 'loginExpired', managerUnavailable: 'managerUnavailable',
            notOwner: 'notOwner', submissionClosed: 'submissionClosed', withdrawFirst: 'withdrawFirst', shareChanged: 'shareChanged', localChanged: 'localChanged', tooManySubmissions: 'tooManySubmissions',
            storageCorrupt: 'storageCorrupt', storageError: 'storageError', localNotFound: 'localNotFound' };
        return tr(codes[error?.code] || 'requestFailed');
    }
    function button(text, action, className) {
        const node = el('button', text, className);
        node.type = 'button';
        node.addEventListener('click', async () => {
            node.disabled = true;
            try { await action(node); }
            catch (error) { if (alive() && error?.name !== 'AbortError') message(errorMessage(error), true); }
            finally { if (node.isConnected) node.disabled = false; }
        });
        return node;
    }
    const confirmShare = (title, description, action) => hooks.confirm
        ? hooks.confirm(title, description, action) : Promise.resolve(confirm([title, description].filter(Boolean).join('\n')));
    function field(text, input) {
        const label = el('label', undefined, 'jpx-store-field');
        input.setAttribute('aria-label', text);
        label.append(el('span', text), input);
        return label;
    }
    function refreshControl(action) {
        const node = button(tr('refresh'), action);
        if (options.toolbarHost) {
            node.className = 'jpx-store-refresh';
            node.title = tr('refresh'); node.setAttribute('aria-label', tr('refresh'));
            node.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11a9 9 0 0 1 15.6-5.4L21 8M21 3v5h-5M21 13A9 9 0 0 1 5.4 18.4L3 16M3 21v-5h5"/></svg>';
        }
        return node;
    }
    function select(options, value) {
        const node = el('select');
        for (const [key, name] of options) { const option = el('option', name); option.value = key; node.append(option); }
        node.value = value;
        return node;
    }
    const kinds = () => [['battle-mode', tr('currentMode')], ['battle', tr('allBattle')], ['stats', tr('stats')]];
    const kindName = kind => kinds().find(([key]) => key === kind)?.[1] || kind;
    const worldName = world => tr(world === 'Isekai' ? 'isekai' : world === 'Persistent' ? 'persistent' : 'anyWorld');
    const styleName = style => host.jpxI18N?.cB?.[style] || host.jpxI18N?.cW?.[style] || tr(style);
    const battleName = battle => host.jpxI18N?.cB?.[battle] || tr(battle);
    function modeName(mode) {
        if (!mode) return '';
        const split = mode.lastIndexOf('_'), style = mode.slice(0, split), battle = mode.slice(split + 1);
        return styleName(style) + ' · ' + battleName(battle);
    }
    function info(envelope, author) {
        return [author ? '@' + author : '', kindName(envelope.kind), worldName(envelope.world), modeName(envelope.mode)].filter(Boolean).join(' · ');
    }
    function tags(envelope, author, choose) {
        if (!hooks.renderTags) return el('p', info(envelope, author), 'jpx-store-meta');
        const group = hooks.renderTags(envelope, choose);
        if (author) group.prepend(el('span', '@' + author, 'jpx-config-tag-author'));
        return group;
    }
    const browseButton = button(tr('browse'), () => browse());
    const mineButton = button(tr('shared'), () => options.toolbarHost && state.view === 'mine' ? browse() : mine());
    navigation.append(...(options.toolbarHost ? [mineButton] : [browseButton, mineButton]));
    toolbar.append(navigation, account);
    root.append(toolbar, viewHeader, status, stage);
    parent.append(root);
    if (options.toolbarHost) options.toolbarHost.append(toolbar);
    function accountControls() {
        account.replaceChildren();
        if (state.user) {
            const logout = button('@' + state.user.login, async node => {
                const user = state.user, previousGeneration = state.authGeneration;
                const confirmed = await confirmShare(tr('signOut') + '?', '@' + user.login, tr('signOut'));
                if (!alive() || state.user !== user || state.authGeneration !== previousGeneration) return;
                if (!confirmed) { node.disabled = false; node.focus({ preventScroll: true }); return; }
                const generation = ++state.authGeneration;
                await jpxConfigStore.logout();
                if (!alive() || generation !== state.authGeneration) return;
                state.user = null; accountControls();
                if (state.view === 'mine') await mine();
                message(tr('signedOut'));
                account.querySelector('button')?.focus({ preventScroll: true });
            });
            logout.title = tr('signOut');
            logout.setAttribute('aria-label', tr('signOut') + ' · ' + state.user.login);
            account.append(logout);
        } else account.append(button(tr('signIn'), () => login()));
        commentView?.authChanged(); ratingView?.authChanged();
    }
    function open(view) {
        commentView?.dispose(); commentView = null; ratingView?.dispose(); ratingView = null;
        browseControls?.queryBar.remove(); browseControls = null;
        state.login?.abort(); state.login = null;
        if (view !== 'edit' && view !== 'login') state.editor = null;
        if (view !== 'detail') state.currentEntry = null;
        state.view = view; state.back = null;
        root.classList.toggle('jpx-store-browsing', !!options.toolbarHost && view === 'browse');
        viewHeader.classList.toggle('jpx-store-browse-header', !!options.toolbarHost && view === 'browse');
        viewHeader.classList.toggle('jpx-config-list-header', !!options.toolbarHost && view === 'browse');
        state.request++;
        browseButton.setAttribute('aria-pressed', String(view === 'browse' || view === 'detail'));
        mineButton.setAttribute('aria-pressed', String(view === 'mine' || view === 'edit'));
        viewHeader.replaceChildren(); stage.replaceChildren(); message('');
        stage.scrollTop = 0;
        return state.request;
    }
    function heading(title, back) {
        const row = el('div', undefined, 'jpx-store-heading');
        state.back = back || null;
        if (back) row.append(button(tr('back'), back, 'jpx-store-back'));
        row.append(el('h3', title)); viewHeader.append(row);
    }
    function empty(text, action, label = tr('retry')) {
        const box = el('div', undefined, 'jpx-store-empty');
        box.append(el('p', text));
        if (action) box.append(button(label, action));
        stage.append(box);
    }
    async function browse(refresh = false) {
        const backEntry = state.view === 'detail' ? state.currentEntry?.id : null;
        const backScroll = backEntry ? state.browseScroll : 0;
        const request = open('browse');
        const queryBar = el('div', undefined, 'jpx-store-querybar');
        const search = el('input'); search.type = 'search'; search.value = state.query; search.placeholder = tr('search');
        search.setAttribute('aria-label', tr('search'));
        const filters = el('div', undefined, 'jpx-store-filter-grid');
        filters.id = 'jpx-store-catalog-filters';
        const toggle = button(tr('filters'), () => { state.filtersOpen = !state.filtersOpen; updateFilters(); }, 'jpx-store-filter-toggle');
        toggle.setAttribute('aria-controls', filters.id);
        const refreshButton = refreshControl(() => loadCatalog(true));
        queryBar.append(search, toggle, refreshButton);
        const controls = {};
        for (const [key, label, choices] of [
            ['world', 'world', [['', tr('allWorlds')], ...['Persistent', 'Isekai'].map(value => [value, worldName(value)])]],
            ['style', 'style', [['', tr('allStyles')], ...styles.map(value => [value, styleName(value)])]],
            ['battleType', 'battleType', [['', tr('allBattles')], ...battleTypes.map(value => [value, battleName(value)])]],
            ['kind', 'type', [['', tr('allTypes')], ...kinds()]]
        ]) {
            const control = select(choices, state[key]); controls[key] = control;
            control.setAttribute('aria-label', tr(label)); control.dataset.storeFilter = key;
            control.addEventListener('change', () => {
                state[key] = control.value;
                if (key === 'kind' && state.kind === 'stats') state.style = state.battleType = '';
                render(true);
            });
            filters.append(control);
        }
        const results = el('div', undefined, 'jpx-store-results');
        const count = el('span', '', 'jpx-store-result-count');
        count.setAttribute('role', 'status'); count.setAttribute('aria-live', 'polite');
        const reset = () => {
            state.query = state.kind = state.world = state.style = state.battleType = '';
            search.value = ''; render(true);
        };
        const clear = button(tr('clearFilters'), reset, 'jpx-store-clear');
        const sort = select([['updated', tr('latest')], ['name', tr('nameSort')], ...(hooks.compareTypes ? [['type', t('cM.typeSort')]] : [])], state.sort);
        sort.setAttribute('aria-label', tr('sort')); sort.dataset.storeSort = '';
        sort.addEventListener('change', () => { state.sort = sort.value; render(true); });
        results.append(count, clear, sort);
        const list = el('div', undefined, 'jpx-store-list');
        list.setAttribute('aria-busy', 'true');
        browseControls = { queryBar, results, refresh: refreshButton, clear, sort };
        viewHeader.append(queryBar, filters, results); stage.append(list); layoutBrowseControls();
        // Normalize catalog metadata once, then filter locally without more requests.
        const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/[@_·/\-]+/g, ' ').replace(/\s+/g, ' ').trim();
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        let index = null, orderedBy = null;
        function updateFilters() {
            const active = ['world', 'style', 'battleType', 'kind'].filter(key => state[key]).length;
            toggle.textContent = tr('filters') + (active ? ' (' + active + ')' : '');
            toggle.setAttribute('aria-expanded', String(state.filtersOpen));
            filters.dataset.open = String(state.filtersOpen);
            clear.hidden = !active && !state.query;
            for (const [key, control] of Object.entries(controls)) {
                control.value = state[key];
                control.disabled = ['style', 'battleType'].includes(key) && state.kind === 'stats';
            }
        }
        filters.addEventListener('keydown', event => {
            if (event.key === 'Escape' && state.filtersOpen && root.closest('.jpx-settings-mobile')) {
                event.stopPropagation(); state.filtersOpen = false; updateFilters(); toggle.focus();
            }
        });
        function render(resetPosition = false) {
            updateFilters();
            if (!index) return;
            if (orderedBy !== state.sort) {
                index.sort((a, b) => state.sort === 'type' ? hooks.compareTypes(a.entry,b.entry) || collator.compare(a.entry.title,b.entry.title) || a.entry.id-b.entry.id :
                    state.sort === 'name' ? collator.compare(a.entry.title, b.entry.title) || a.entry.id - b.entry.id : b.updated - a.updated || b.entry.id - a.entry.id);
                orderedBy = state.sort;
            }
            if (resetPosition) { state.visible = 30; state.browseScroll = 0; stage.scrollTop = 0; }
            list.replaceChildren();
            const words = normalize(state.query).split(' ').filter(Boolean);
            const matches = index.filter(({ entry, modes, text }) => (!state.kind || entry.kind === state.kind) &&
                (!state.world || entry.world === state.world || entry.world === 'Any') &&
                ((!state.style && !state.battleType) || modes.some(mode => (!state.style || mode.slice(0,mode.lastIndexOf('_')) === state.style) &&
                    (!state.battleType || mode.slice(mode.lastIndexOf('_')+1) === state.battleType))) && words.every(word => text.includes(word)));
            count.textContent = tr('resultCount').replace('${count}', String(matches.length));
            if (!matches.length) {
                const box = el('div', undefined, 'jpx-store-empty');
                box.append(el('p', tr(index.length ? 'noMatches' : 'noConfigs')));
                if (!clear.hidden) box.append(button(tr('clearFilters'), () => { reset(); search.focus(); }));
                list.append(box); return;
            }
            const fragment = doc.createDocumentFragment();
            for (const { entry, updated } of matches.slice(0, state.visible)) {
                const row = el('article', undefined, 'jpx-store-row');
                row.dataset.storeId = String(entry.id);
                const title = button(entry.title, () => { state.browseScroll = stage.scrollTop; return details(entry); }, 'jpx-store-title');
                row.append(title);
                const tools = el('div', undefined, 'jpx-store-row-tools');
                if (updated) {
                    const date = el('time', new Date(updated).toLocaleDateString(), 'jpx-store-date');
                    date.dateTime = entry.updatedAt; date.title = tr('latest'); tools.append(date);
                }
                const download = button('', async node => {
                    node.setAttribute('aria-busy', 'true');
                    try {
                        const envelope = await jpxConfigStore.load(entry);
                        if (!alive() || request !== state.request || !node.isConnected) return;
                        if (!await saveConfig(envelope, entry)) return;
                        if (alive() && request === state.request && node.isConnected) {
                            node.title = tr('saved'); node.setAttribute('aria-label', tr('saved') + ': ' + entry.title);
                            node.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
                        }
                    } catch (error) {
                        if (alive() && request === state.request && node.isConnected) throw error;
                    } finally { node.removeAttribute('aria-busy'); }
                }, 'jpx-store-download');
                download.title = tr('save'); download.setAttribute('aria-label', tr('save') + ': ' + entry.title);
                download.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></svg>';
                tools.prepend(download); row.append(tools);
                row.append(tags(entry, entry.author, (key, value) => {
                    state[key === 'scenario' ? 'battleType' : key] = value;
                    if (key === 'kind' && value === 'stats') state.style = state.battleType = '';
                    render(true);
                }));
                const metrics = el('p', undefined, 'jpx-store-rating-summary');
                metrics.append(el('span', jpxStoreRatingText(ratingTotals.get(entry.id) || entry.rating, tr)), downloadCount(entry.id)); row.append(metrics);
                if (entry.description) row.append(el('p', entry.description, 'jpx-store-excerpt'));
                fragment.append(row);
            }
            if (matches.length > state.visible) fragment.append(button(tr('showMore'), () => {
                const position = stage.scrollTop, next = matches[state.visible]?.entry.id;
                state.visible += 30; render();
                list.querySelector('[data-store-id="' + next + '"] .jpx-store-title')?.focus({ preventScroll: true });
                stage.scrollTop = position;
            }, 'jpx-store-show-more'));
            list.append(fragment); refreshDownloadCounts();
        }
        search.addEventListener('input', event => { state.query = search.value; if (!event.isComposing) render(true); });
        search.addEventListener('compositionend', () => { state.query = search.value; render(true); });
        updateFilters();
        async function loadCatalog(force) {
            refreshButton.disabled = true; refreshButton.setAttribute('aria-busy', 'true');
            refreshButton.setAttribute('aria-label', tr('loading')); refreshButton.title = tr('loading');
            list.setAttribute('aria-busy', 'true'); message('');
            try {
                const catalog = await jpxConfigStore.catalog({ refresh: force });
                if (!alive() || request !== state.request) return;
                if (force) ratingTotals.clear();
                state.entries = catalog.entries; orderedBy = null;
                index = state.entries.map(entry => {
                    const modes = entry.mode ? [entry.mode] : entry.modes || [];
                    const labels = modes.flatMap(mode => { const split=mode.lastIndexOf('_'), style=mode.slice(0,split), battle=mode.slice(split+1);
                        return [mode,modeName(mode),tr(style),tr(battle),translations.en[style],translations.en[battle]]; });
                    return { entry, modes, updated: Date.parse(entry.updatedAt) || 0,
                        text: normalize([entry.title, entry.description, entry.author, entry.kind, kindName(entry.kind), entry.world,
                            worldName(entry.world), entry.world === 'Any' ? t('cM.anyWorld') : '',
                            entry.kind === 'stats' ? t('cM.stats') : entry.kind === 'battle' ? modes.length ? t('cM.groupCount').replace('${count}',String(modes.length)) : t('cM.allBattle') : '',
                            ...labels].join(' ')) };
                });
                const scroll = stage.scrollTop; render(); stage.scrollTop = scroll;
            } catch (error) {
                if (!alive() || request !== state.request) return;
                message(errorMessage(error), true);
            } finally {
                refreshButton.disabled = false; refreshButton.removeAttribute('aria-busy');
                refreshButton.setAttribute('aria-label', tr('refresh')); refreshButton.title = tr('refresh');
                list.setAttribute('aria-busy', 'false');
            }
        }
        await loadCatalog(refresh);
        if (backEntry && alive() && request === state.request) {
            list.querySelector('[data-store-id="' + backEntry + '"] .jpx-store-title')?.focus({ preventScroll: true });
            stage.scrollTop = backScroll;
        }
    }
    function configSummary(envelope) {
        const values = envelope.config;
        const counts = [];
        if (envelope.kind === 'stats') {
            for (const [key, name] of [['statsColumns', 'columns'], ['combatRows', 'combatRows'], ['revenueRows', 'revenueRows']])
                if (Array.isArray(values[key])) counts.push(tr(name) + ': ' + values[key].filter(item => item.disabled !== true).length);
        } else {
            let supports = 0, attacks = 0, code = 0;
            for (const mode of Object.values(values)) if (mode && Array.isArray(mode.supports) && Array.isArray(mode.attacks)) {
                supports += mode.supports.length; attacks += mode.attacks.length;
                code += [...mode.supports, ...mode.attacks].filter(rule => rule.type === 'kamisamaniNattaHi').length;
            }
            counts.push(tr('supports') + ': ' + supports, tr('attacks') + ': ' + attacks);
            if (code) counts.push(tr('customCode') + ': ' + code);
        }
        return counts.join(' · ');
    }
    function rawPreview(envelope) {
        const details = el('details', undefined, 'jpx-store-raw');
        details.append(el('summary', tr('viewConfig')));
        details.addEventListener('toggle', () => {
            if (details.open && details.childElementCount === 1) details.append(el('pre', JSON.stringify(envelope.config, null, 2)));
        });
        return details;
    }
    function downloadConfig(envelope, id) {
        const blob = new Blob([JSON.stringify(envelope.config, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = el('a');
        link.href = url; link.download = 'jpx-config-' + id + '.json'; link.click();
        recordDownload(id);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    async function saveConfig(envelope, entry) {
        if (typeof hooks.saveConfig !== 'function') throw new Error('Save unavailable');
        const saved = await hooks.saveConfig(JSON.parse(JSON.stringify(envelope)), { id: entry.id, author: entry.author,
            source: { repository: JPX_CONFIG_STORE.repository, id: entry.id, author: entry.author, sha256: entry.sha256, url: entry.issueUrl } });
        if (saved === false) return false;
        state.saved.add(entry.id);
        recordDownload(entry.id);
        return true;
    }
    async function details(entry) {
        const request = open('detail'); heading(entry.title, () => browse()); message(tr('loading'));
        state.currentEntry = entry;
        try {
            const envelope = await jpxConfigStore.load(entry);
            if (!alive() || request !== state.request) return;
            message('');
            stage.append(tags(envelope, entry.author, (key, value) => {
                state[key === 'scenario' ? 'battleType' : key] = value;
                if (key === 'kind' && value === 'stats') state.style = state.battleType = '';
                return browse();
            }));
            if (envelope.description) stage.append(el('p', envelope.description, 'jpx-store-description'));
            stage.append(el('p', configSummary(envelope), 'jpx-store-meta'),
                el('p', tr('scriptVersion') + ': ' + envelope.scriptVersion, 'jpx-store-meta'));
            const actions = el('div', undefined, 'jpx-store-actions');
            const save = button(tr(state.saved.has(entry.id) ? 'saved' : 'save'), async node => {
                if (!await saveConfig(envelope, entry)) return;
                if (!alive() || request !== state.request) return;
                node.textContent = tr('saved'); message(tr('savedConfig'));
            }, 'jpx-store-primary');
            actions.append(save);
            if (typeof hooks.applyConfig === 'function') actions.append(button(tr('apply'), () => hooks.applyConfig(JSON.parse(JSON.stringify(envelope)))));
            actions.append(button(tr('download'), () => downloadConfig(envelope, entry.id)));
            stage.append(actions, rawPreview(envelope));
            ratingView = renderJpxStoreRating(stage, { service: jpxConfigStore, entry, summary: ratingTotals.get(entry.id) || entry.rating, tr, el,
                signIn: () => login(() => details(entry), () => details(entry)), user: () => state.user,
                isCurrent: () => alive() && request === state.request, onChange: value => ratingTotals.set(entry.id, value) });
            stage.querySelector('.jpx-rating-heading strong').after(downloadCount(entry.id)); refreshDownloadCounts();
            const draft = commentDrafts.get(entry.id) || { body: '', edits: {} }; commentDrafts.set(entry.id, draft);
            commentView = renderJpxStoreComments(stage, { service: jpxConfigStore, entry, tr, el, confirm: confirmShare,
                signIn: () => login(() => details(entry), () => details(entry)), user: () => state.user,
                isCurrent: () => alive() && request === state.request, draft });
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => details(entry));
        }
    }
    async function login(after = () => browse(), cancel = () => browse()) {
        const generation = ++state.authGeneration;
        const request = open('login'); heading(tr('signIn'), cancel);
        const panel = el('div', undefined, 'jpx-store-auth'); stage.append(panel);
        const controller = new AbortController(); state.login = controller; message(tr('connecting'));
        try {
            const user = await jpxConfigStore.login(code => {
                if (!alive() || request !== state.request) return;
                message(''); panel.replaceChildren(el('p', tr('authHint')));
                panel.append(el('code', code.userCode, 'jpx-store-auth-code'));
                const link = el('a', tr('authorize'), 'jpx-store-link');
                // Device authorization is the only external navigation in the publishing flow.
                const url = new URL(code.verificationUri);
                if (url.origin !== 'https://github.com' || url.pathname !== '/login/device') throw new Error('Invalid authorization URL');
                link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
                panel.append(link, el('p', tr('waitingAuth'), 'jpx-store-meta'), button(tr('cancel'), cancel));
            }, controller.signal);
            if (!alive() || request !== state.request || generation !== state.authGeneration) return;
            state.user = user || await jpxConfigStore.user(); state.login = null; accountControls(); await after();
        } catch (error) {
            if (!alive() || request !== state.request || error?.name === 'AbortError') return;
            message(errorMessage(error), true); panel.replaceChildren(button(tr('retry'), () => login(after, cancel)));
        }
    }
    async function edit(existing) {
        if (!existing?.envelope) return options.onBack?.();
        const model = existing;
        if (model.id && !model.originalEnvelope) model.originalEnvelope = JSON.parse(JSON.stringify(model.envelope));
        state.editor = model; open('edit');
        heading(tr(model.id ? 'updateShare' : 'share'), model.back || options.onBack || (() => mine()));
        const request = state.request;
        const form = el('form', undefined, 'jpx-store-form'); form.dataset.storeEditor = 'share';
        const envelope = model.envelope;
        const world = model.id ? select([['Persistent', tr('persistent')], ['Isekai', tr('isekai')], ['Any', tr('anyWorld')]], envelope.world) : null;
        const title = el('input'); title.type = 'text'; title.required = true; title.maxLength = 100; title.value = envelope.title || '';
        const description = el('textarea'); description.rows = 4; description.maxLength = 4000; description.value = envelope.description || '';
        const metadata = el('p', info(envelope), 'jpx-store-meta'); form.append(metadata);
        let preview = rawPreview(envelope);
        if (model.id && typeof hooks.listShareConfigs === 'function' && typeof hooks.getShareConfig === 'function') {
            const matches = entry => entry?.envelope?.kind === model.originalEnvelope.kind && entry.envelope.mode === model.originalEnvelope.mode;
            const entries = hooks.listShareConfigs().filter(matches);
            const content = select([['', tr('keepSharedConfig')], ...entries.map(entry => [entry.id, entry.envelope.title + ' · ' + worldName(entry.envelope.world)])], model.localSource?.id || '');
            content.dataset.shareSource = '';
            if (!entries.length) { const option = el('option', tr('noMatchingLocal')); option.disabled = true; content.append(option); }
            // A source deleted in another tab stays visible until the user selects
            // a replacement; never silently submit its stale snapshot as current.
            if (model.localSource && !entries.some(entry => entry.id === model.localSource.id)) {
                const option = el('option', model.localSource.title); option.value = model.localSource.id; content.append(option); content.value = option.value;
            }
            content.addEventListener('change', () => {
                const previous = model.localSource?.id || '';
                try {
                    const entry = content.value ? hooks.getShareConfig(content.value) : null;
                    if (content.value && !matches(entry)) { content.value = previous; message(tr('localChanged'), true); return; }
                    const chosen = jpxConfigStore.prepare(entry?.envelope || model.originalEnvelope);
                    envelope.config = chosen.config; envelope.scriptVersion = chosen.scriptVersion;
                    model.localSource = entry ? { id: entry.id, revision: entry.revision, title: entry.envelope.title } : null;
                    const replacement = rawPreview(envelope), expanded = preview.open;
                    preview.replaceWith(replacement); preview = replacement; preview.open = expanded; message('');
                } catch (error) { content.value = previous; message(errorMessage(error), true); }
            });
            form.append(field(tr('configContents'), content));
        }
        if (world) form.append(field(tr('appliesTo'), world));
        form.append(field(tr('title'), title), field(tr('description'), description));
        const actions = el('div', undefined, 'jpx-store-actions');
        const publish = el('button', tr(model.id ? 'submitUpdate' : 'submit'), 'jpx-store-primary'); publish.type = 'submit';
        actions.append(publish); form.append(preview, actions, el('p', tr('reviewHint'), 'jpx-store-meta'));
        for (const [control, key] of [[title, 'title'], [description, 'description'], ...(world ? [[world, 'world']] : [])])
            control.addEventListener('input', () => { envelope[key] = control.value; if (key === 'world') metadata.textContent = info(envelope); });
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (!form.reportValidity()) return;
            envelope.title = title.value.trim(); envelope.description = description.value.trim();
            if (world) envelope.world = world.value;
            if (!envelope.title) { title.focus(); return; }
            if (model.localSource && hooks.getShareConfig(model.localSource.id)?.revision !== model.localSource.revision) {
                message(tr('localChanged'), true); return;
            }
            if (!state.user) { await login(() => edit(model), () => edit(model)); return; }
            publish.disabled = true; message(tr('submitting'));
            try {
                await jpxConfigStore.submit(envelope, model.id, model.originalBody);
                state.editor = null;
                if (!alive()) { state.view = 'mine'; return; }
                if (request !== state.request) { hooks.notify?.(tr('submitted')); return; }
                await mine();
                if (hooks.notify) hooks.notify(tr(model.id ? 'updateSubmitted' : 'submitted'));
                else message(tr(model.id ? 'updateSubmitted' : 'submitted'));
            } catch (error) { if (alive()) message(errorMessage(error), true); }
            finally { if (publish.isConnected) publish.disabled = false; }
        });
        stage.append(form);
    }
    function issueStatus(issue) {
        if (issue.state === 'closed') return 'withdrawn';
        if (issue.labels.includes('store:hide')) return 'hidden';
        if (issue.pending) return 'pending';
        const labels = issue.labels;
        for (const [label, key] of [['store:hide', 'hidden'], ['store:pending', 'pending'], ['store:changes-requested', 'changes'], ['store:needs-review', 'needsReview'], ['store:unavailable', 'unavailable'], ['store:published', 'published']])
            if (labels.includes(label)) return key;
        return 'pending';
    }
    async function mine() {
        const request = open('mine');
        let search;
        const filterShares = () => {
            const words = state.sharedQuery.normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
            for (const row of stage.querySelectorAll('.jpx-store-row')) row.hidden = !words.every(word => (row.dataset.searchText || row.textContent).normalize('NFKC').toLocaleLowerCase().includes(word));
        };
        if (options.toolbarHost) {
            const queryBar = el('div', undefined, 'jpx-store-querybar');
            search = el('input'); search.type = 'search'; search.value = state.sharedQuery;
            search.placeholder = t('cM.search'); search.setAttribute('aria-label', t('cM.search')); search.disabled = !state.user;
            search.addEventListener('input', () => { state.sharedQuery = search.value; filterShares(); });
            const refresh = refreshControl(() => mine()); refresh.disabled = !state.user;
            queryBar.append(search, refresh); browseControls = { queryBar, refresh }; layoutBrowseControls();
        }
        if (!state.user) { empty(tr('loginRequired'), () => login(() => mine()), tr('signIn')); return; }
        if (!options.toolbarHost) viewHeader.append(button(tr('refresh'), () => mine()));
        message(tr('loading'));
        try {
            const issues = await jpxConfigStore.mine();
            if (!alive() || request !== state.request) return;
            message('');
            if (!issues.length) { empty(tr('noShares')); return; }
            const list = el('div', undefined, 'jpx-store-list'); stage.append(list);
            for (const issue of issues) {
                const row = el('article', undefined, 'jpx-store-row'); row.dataset.sharedId = issue.id;
                const title = el('strong', issue.title.replace(/^\[Config\]\s*/, ''));
                const statusKey = issueStatus(issue);
                const badge = el('span', tr(statusKey === 'published' ? 'publishedVersion' : statusKey), 'jpx-store-badge');
                row.append(title, badge);
                try {
                    const envelope = jpxConfigStore.parseSubmission(issue.body);
                    const group = tags(envelope, null, (key, value, label) => {
                        state.sharedQuery = label; if (search) search.value = label; filterShares();
                    });
                    row.append(group);
                    row.dataset.searchText = [title.textContent, info(envelope), ...group.querySelectorAll('[title]')].map(value => typeof value === 'string' ? value : value.title).join(' ') + ' ' + group.textContent;
                } catch { /* Keep malformed submissions manageable. */ }
                const actions = el('div', undefined, 'jpx-store-actions');
                if (issue.state !== 'closed') {
                    actions.append(button(tr('updateShare'), () => edit({ id: issue.id, envelope: jpxConfigStore.parseSubmission(issue.body), originalBody: issue.body, back: () => mine() })),
                        button(tr('withdraw'), async () => {
                            if (!await confirmShare(tr('withdraw'), tr('withdrawConfirm'), tr('withdraw'))) return;
                            if (!alive() || request !== state.request) return;
                            await jpxConfigStore.withdraw(issue.id); await mine();
                        }));
                } else {
                    actions.append(button(tr('removeShare'), async () => {
                        if (!await confirmShare(tr('removeShare'), tr('removeShareConfirm'), tr('removeShare'))) return;
                        if (!alive() || request !== state.request) return;
                        message('');
                        await jpxConfigStore.archive(issue.id);
                        if (!alive() || request !== state.request) return;
                        const visible = [...list.children].filter(item => !item.hidden), index = visible.indexOf(row);
                        const neighbor = visible[index + 1] || visible[index - 1];
                        row.remove();
                        if (!list.children.length) { list.remove(); empty(tr('noShares')); }
                        (neighbor?.querySelector('button:not(:disabled)') || search || browseControls?.refresh)?.focus({ preventScroll: true });
                    }, 'jpx-store-remove-share'));
                }
                actions.append(button(tr('review'), async node => {
                    const old = row.querySelector('.jpx-store-feedback');
                    if (old) { old.remove(); node.setAttribute('aria-expanded', 'false'); return; }
                    const feedback = await jpxConfigStore.feedback(issue.id);
                    if (!alive() || request !== state.request) return;
                    if (issue.state !== 'closed' && !issue.labels.includes('store:hide')) badge.textContent = tr(feedback ? ({ published: 'publishedVersion', 'changes-requested': 'changes', 'needs-review': 'needsReview', unavailable: 'unavailable', pending: 'pending' })[feedback.status] : 'pending');
                    const box = el('div', undefined, 'jpx-store-feedback');
                    const language = tr('browse') === '浏览' ? 'zh' : 'en';
                    box.append(el('p', feedback?.summary?.[language] || tr('noReview')));
                    for (const finding of feedback?.findings || []) box.append(el('p', [finding.path, finding[language]].filter(Boolean).join(' — ')));
                    row.append(box); node.setAttribute('aria-expanded', 'true');
                }));
                row.append(actions); list.append(row);
                // Reconcile only this session's submissions when the user opens
                // or refreshes Shared. No battle-time polling or per-row timers.
                if (issue.pending && issue.state !== 'closed' && !issue.labels.includes('store:hide')) jpxConfigStore.feedback(issue.id).then(feedback => {
                    if (!alive() || request !== state.request || !feedback) return;
                    badge.textContent = tr(({ published: 'publishedVersion', 'changes-requested': 'changes', 'needs-review': 'needsReview', unavailable: 'unavailable', pending: 'pending' })[feedback.status]);
                }).catch(() => { /* Keep pending until a later refresh succeeds. */ });
            }
            filterShares();
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => mine());
        }
    }
    const observer = new MutationObserver(() => {
        if (!root.isConnected) { state.disposed = true; commentView?.dispose(); ratingView?.dispose(); state.login?.abort(); layoutEvents.abort(); browseControls?.queryBar.remove(); toolbar.remove(); observer.disconnect(); }
    });
    // The core removes its dialog directly from body; ignore battle-content mutations.
    observer.observe(doc.body, { childList: true });
    observer.observe(parent, { childList: true });
    accountControls();
    const authGeneration = state.authGeneration;
    jpxConfigStore.user().then(user => {
        if (!state.disposed && authGeneration === state.authGeneration) {
            state.user = user; if (alive()) accountControls();
        }
    }).catch(cause => { if (alive() && authGeneration === state.authGeneration) message(errorMessage(cause), true); });
    if (options.share) edit({ envelope: JSON.parse(JSON.stringify(options.share)), back: options.onBack });
    else browse();
    const dispose = () => { state.disposed = true; commentView?.dispose(); ratingView?.dispose(); state.login?.abort(); layoutEvents.abort(); browseControls?.queryBar.remove(); toolbar.remove(); observer.disconnect(); };
    dispose.back = () => {
        if (!alive() || !state.back) return false;
        Promise.resolve().then(state.back).catch(error => { if (alive()) message(errorMessage(error), true); });
        return true;
    };
    dispose.suspend = () => {
        if (state.disposed || state.suspended) return;
        state.suspended = true; state.request++; commentView?.dispose(); commentView = null; ratingView?.dispose(); ratingView = null;
        if (state.login) { state.authGeneration++; state.login.abort(); state.login = null; }
    };
    dispose.resume = () => {
        if (state.disposed || !state.suspended) return;
        state.suspended = false; accountControls();
        if (state.editor) edit(state.editor);
        else if (state.view === 'mine') mine();
        else if (state.view === 'detail' && state.currentEntry) details(state.currentEntry);
        else browse();
    };
    return dispose;
}

    return Object.freeze({ service: jpxConfigStore, render(parent, hooks, options = {}) {
        const doc = parent.ownerDocument;
        if (!doc.getElementById('jpx-integrated-store-style')) {
            const style = doc.createElement('style'); style.id = 'jpx-integrated-store-style';
            style.textContent = "#settings-container #panel_configStore { overflow: hidden; }\n#settings-container .jpx-store { display: flex; flex: 1; flex-direction: column; gap: 12px; min-width: 0; min-height: 0; color: var(--jpx-theme-text, #392d25); font: 13px/1.45 Arial, Helvetica, sans-serif; }\n#settings-container .jpx-store * { box-sizing: border-box; }\n#settings-container .jpx-store [hidden] { display: none !important; }\n#settings-container .jpx-store-toolbar, #settings-container .jpx-store-navigation, #settings-container .jpx-store-account, #settings-container .jpx-store-actions, #settings-container .jpx-store-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; }\n#settings-container .jpx-store-toolbar { flex: none; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-view-header { display: grid; flex: none; gap: 12px; min-width: 0; }\n#settings-container .jpx-store-view-header:empty { display: none; }\n#settings-container .jpx-store button, #settings-container .jpx-store-link { min-height: 32px; max-width: 100%; margin: 0; padding: 4px 10px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 6px; background: var(--jpx-theme-surface, #f9f6ec); color: var(--jpx-theme-accent, #5c0d11); font: inherit; font-weight: 400; line-height: 1.4; text-decoration: none; cursor: pointer; overflow-wrap: anywhere; }\n#settings-container .jpx-store button:hover, #settings-container .jpx-store-link:hover { background: var(--jpx-theme-hover, #f1e2c5); }\n#settings-container .jpx-store button[aria-pressed=true], #settings-container .jpx-store .jpx-store-primary { border-color: var(--jpx-theme-accent, #5c0d11); background: var(--jpx-theme-selected, #ead9b8); }\n#settings-container .jpx-store button:disabled { opacity: .55; cursor: default; }\n#settings-container .jpx-store :is(a, summary):focus-visible { outline: 1px solid var(--jpx-theme-accent, #9b4e03); outline-offset: -1px; box-shadow: 0 0 0 2px color-mix(in srgb, var(--jpx-theme-accent, #9b4e03) 12%, transparent); }\n#settings-container .jpx-store p { margin: 0; }\n#settings-container .jpx-store-status, #settings-container .jpx-store-empty { padding: 12px; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); }\n#settings-container .jpx-store-status[data-error=true] { border-left: 3px solid var(--jpx-theme-accent, #5c0d11); }\n#settings-container .jpx-store-status { flex: none; }\n#settings-container .jpx-store-empty p { margin-bottom: 8px; }\n#settings-container .jpx-store-stage { display: grid; align-content: start; flex: 1; gap: 12px; min-width: 0; min-height: 0; overflow: auto; padding-right: 4px; overscroll-behavior: contain; scrollbar-width: var(--jpx-scrollbar-width, thin); scrollbar-color: inherit; }\n#settings-container .jpx-store-filters { display: flex; gap: 8px; min-width: 0; }\n#settings-container .jpx-store input, #settings-container .jpx-store select, #settings-container .jpx-store textarea { min-width: 0; max-width: 100%; min-height: 32px; margin: 0; padding: 5px 8px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 4px; background: var(--jpx-theme-field, #fffdf7); color: var(--jpx-theme-text, #392d25); font: inherit; }\n#settings-container .jpx-store-filters input { flex: 1; width: 0; }\n#settings-container .jpx-store-filters select { max-width: 40%; }\n#settings-container .jpx-store-list { display: grid; min-width: 0; border-top: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 8px; padding: 12px 0; border-bottom: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-row > p, #settings-container .jpx-store-row > .jpx-store-actions, #settings-container .jpx-store-feedback { grid-column: 1 / -1; }\n#settings-container .jpx-store .jpx-store-title { width: fit-content; padding: 0; min-height: 24px; border: 0; background: transparent; text-align: left; font-weight: 600; }\n#settings-container .jpx-store .jpx-store-title:hover { text-decoration: underline; }\n#settings-container .jpx-store-meta { color: var(--jpx-theme-muted, #71634f); font-size: 12px; overflow-wrap: anywhere; }\n#settings-container .jpx-store-excerpt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; }\n#settings-container .jpx-store-description { white-space: pre-wrap; overflow-wrap: anywhere; }\n#settings-container .jpx-store-heading h3 { flex: 1; margin: 0; color: var(--jpx-theme-accent, #5c0d11); font-size: 14px; overflow-wrap: anywhere; }\n#settings-container .jpx-store-form { display: grid; gap: 12px; min-width: 0; }\n#settings-container .jpx-store-local-filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }\n#settings-container .jpx-store-local-row > button { align-self: start; }\n#settings-container .jpx-store-row-tools { display: flex; flex-wrap: wrap; justify-content: end; align-items: start; gap: 6px; }\n#settings-container .jpx-store-selection { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px; }\n#settings-container .jpx-store-selection > button { align-self: start; }\n#settings-container .jpx-store-field { display: grid; gap: 4px; min-width: 0; }\n#settings-container .jpx-store textarea { width: 100%; resize: vertical; }\n#settings-container .jpx-store-raw { min-width: 0; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-field, #fffdf7); }\n#settings-container .jpx-store-raw summary { padding: 8px; cursor: pointer; color: var(--jpx-theme-accent, #5c0d11); }\n#settings-container .jpx-store pre { max-height: 280px; margin: 0; padding: 8px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font: 12px/1.5 Consolas, monospace; border-top: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-auth { display: grid; justify-items: start; gap: 12px; padding: 16px; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); }\n#settings-container .jpx-store-auth-code { font: 600 22px/1.4 Consolas, monospace; user-select: all; letter-spacing: 2px; }\n#settings-container .jpx-store-badge { align-self: start; padding: 2px 8px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 12px; color: var(--jpx-theme-accent, #5c0d11); font-size: 12px; white-space: nowrap; }\n#settings-container .jpx-store-feedback { display: grid; gap: 8px; padding: 8px 12px; border-left: 2px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); overflow-wrap: anywhere; white-space: pre-wrap; }\n@media (max-width: 650px) {\n    #settings-container .jpx-store-toolbar, #settings-container .jpx-store-navigation, #settings-container .jpx-store-account { gap: 6px; }\n    #settings-container .jpx-store button, #settings-container .jpx-store-link { min-height: 36px; padding: 5px 8px; }\n    #settings-container .jpx-store-filters { flex-wrap: wrap; }\n    #settings-container .jpx-store-filters input { flex-basis: 100%; width: 100%; }\n    #settings-container .jpx-store-filters select { flex: 1; max-width: none; }\n    #settings-container .jpx-store-local-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n    #settings-container .jpx-store-local-filters > label:last-child { grid-column: 1 / -1; }\n}\n\n#settings-container .jpx-store { width: 100%; }\n#settings-container .jpx-store-toolbar { gap: 8px; padding-bottom: 8px; }\n#settings-container .jpx-store-row { padding: 10px 0; }\n#settings-container .jpx-store input:focus-visible, #settings-container .jpx-store select:focus-visible, #settings-container .jpx-store textarea:focus-visible, #settings-container .jpx-store button:focus-visible { outline: 1px solid var(--jpx-theme-accent, #9b4e03); outline-offset: -1px; }\n@media (max-width:650px) { #settings-container .jpx-store button, #settings-container .jpx-store-link, #settings-container .jpx-store input, #settings-container .jpx-store select { min-height:44px; } }\n"; doc.head.append(style);
        }
        return renderConfigStore(parent, hooks, options);
    } });
}

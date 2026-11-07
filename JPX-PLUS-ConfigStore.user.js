// ==UserScript==
// @name         JPX-PLUS Config Store
// @namespace    ijpx
// @version      2026.11.08.1
// @description  Optional configuration sharing and discovery for JPX-PLUS
// @author       MeiYongAI
// @run-at       document-end
// @match        *://*.hentaiverse.org/*
// @exclude      *hentaiverse.org/equip/*
// @exclude      *hentaiverse.org/isekai/equip/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @connect      github.com
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @homepageURL  https://github.com/MeiYongAI/JPX-PLUS
// @supportURL   https://github.com/MeiYongAI/JPX-PLUS/issues
// @updateURL    https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS-ConfigStore.user.js
// @downloadURL  https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS-ConfigStore.user.js
// ==/UserScript==
(function () {
    'use strict';
    const host = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
    if (window.top !== window.self) return;
    const translations = {"en":{"name":"Config store","browse":"Browse","mine":"My configs","share":"Share config","signIn":"Sign in","signOut":"Sign out","signedOut":"Signed out.","currentMode":"Battle mode","allBattle":"All battle settings","stats":"Statistics","persistent":"Persistent","isekai":"Isekai","anyWorld":"Both worlds","back":"Back","retry":"Retry","refresh":"Refresh","search":"Search configs or authors","type":"Type","allTypes":"All types","loading":"Loading…","noMatches":"No matching configs.","noConfigs":"No configs have been published yet.","cannotLoad":"This content could not be loaded.","columns":"Columns","combatRows":"Combat rows","revenueRows":"Revenue rows","supports":"Support rules","attacks":"Attack rules","customCode":"Custom code","viewConfig":"View configuration","scriptVersion":"Script version","import":"Import into settings","download":"Download config","imported":"Imported. Review your settings, then save.","importHint":"Importing can be undone. Save in Settings when ready.","connecting":"Connecting to GitHub…","authHint":"Enter this code on GitHub to authorize JPX-PLUS.","authorize":"Authorize on GitHub","waitingAuth":"Waiting for authorization. This page will continue automatically.","cancel":"Cancel","editShare":"Edit","world":"World","title":"Title","description":"Description","submit":"Submit for review","submitUpdate":"Submit update","reviewHint":"Your config and description will be public on GitHub and sent to AI for review. Uncertain results go to the maintainer.","loginBeforeShare":"Sign in to GitHub when you submit. Your draft stays here.","submitting":"Submitting…","submitted":"Submitted for review. Open Shared in My configs to check the result.","pending":"In review","published":"Published","changes":"Changes needed","needsReview":"Maintainer review","unavailable":"Review unavailable","hidden":"Hidden","withdrawn":"Withdrawn","noShares":"You have not shared a config yet.","withdraw":"Withdraw","withdrawConfirm":"Withdraw this configuration from the store? Players who imported it will keep their local copy.","review":"Review feedback","noReview":"No review is available for this revision yet.","loginRequired":"Sign in to GitHub to manage your shared configs.","notConfigured":"GitHub sign-in is not configured yet.","rateLimit":"GitHub's request limit was reached. Please try again later.","networkError":"Could not reach GitHub. Check your connection and try again.","invalidConfig":"This configuration has an invalid format.","tooLarge":"This configuration exceeds the size limit.","integrityError":"The downloaded configuration did not pass its integrity check.","requestFailed":"The request failed. Please try again.","OneHanded":"One-handed","1H_Mage":"1H Mage","TwoHanded":"Two-handed","2H_Mage":"2H Mage","DualWielding":"Dual wield","DW_Mage":"DW Mage","NitenIchiryu":"Niten Ichiryu","NI_Mage":"NI Mage","Staff":"Staff","Unarmed":"Unarmed","General":"General","Arena":"Arena","Encounter":"Encounter","Colosseum":"Colosseum","Battle1000":"Grindfest","Item":"Item World","Tower":"Tower","publishedVersion":"Published version","accessDenied":"GitHub authorization was cancelled.","loginExpired":"The authorization code expired. Please sign in again.","managerUnavailable":"Enable the plugin permissions in your userscript manager.","notOwner":"Only the author can edit this configuration.","submissionClosed":"This configuration has been withdrawn. Share it again as a new submission.","tooManySubmissions":"There are too many submissions to load at once. Please open GitHub to manage them.","local":"Current","backpack":"Backpack","shared":"Shared","style":"Style","battleType":"Battle type","all":"All","shareShort":"Share","useConfig":"Use config","chooseConfig":"Choose a config","currentSettings":"Current settings","savedSettings":"Saved settings","noLocal":"No local configs are available.","updateCore":"Update JPX-PLUS to browse saved configs from both worlds. Current settings are available below.","changeConfig":"Change config","appliesTo":"Applies to","saveBackpack":"Save to backpack","saveCurrent":"Save a current config","emptyBackpack":"Your backpack is empty. Save configs from your settings or the store to keep several versions.","searchBackpack":"Search backpack","editBackpack":"Edit saved config","save":"Save","saving":"Saving…","savedBackpack":"Saved to backpack.","backpackHint":"Kept locally in this browser. Apply or share it when you are ready.","apply":"Apply config","delete":"Delete","deleteBackpackConfirm":"Delete this copy from your backpack? Your applied settings and shared configs will stay unchanged.","storageCorrupt":"The backpack data could not be read. Your saved data has been kept.","storageError":"Could not access backpack storage. Please check the plugin permissions and try again.","localNotFound":"This config is no longer in your backpack."},"zh":{"name":"配置商店","browse":"浏览","mine":"我的配置","share":"分享配置","signIn":"登录","signOut":"退出登录","signedOut":"已退出登录。","currentMode":"战斗模式","allBattle":"整套战斗配置","stats":"统计配置","persistent":"主世界","isekai":"异世界","anyWorld":"两个世界","back":"返回","retry":"重试","refresh":"刷新","search":"搜索配置或作者","type":"类型","allTypes":"全部类型","loading":"加载中…","noMatches":"没有找到匹配的配置。","noConfigs":"还没有已上架的配置。","cannotLoad":"暂时无法加载内容。","columns":"统计列","combatRows":"战斗统计项目","revenueRows":"收益统计项目","supports":"辅助规则","attacks":"攻击规则","customCode":"自定义代码","viewConfig":"查看配置内容","scriptVersion":"脚本版本","import":"导入到设置","download":"下载配置","imported":"已导入，请检查设置后保存。","importHint":"导入后可以撤销，确认后再在设置中保存。","connecting":"正在连接 GitHub…","authHint":"前往 GitHub 输入以下代码，授权 JPX-PLUS。","authorize":"前往 GitHub 授权","waitingAuth":"等待授权，完成后将自动继续。","cancel":"取消","editShare":"编辑","world":"世界","title":"标题","description":"说明","submit":"提交审核","submitUpdate":"提交更新","reviewHint":"配置和说明将在 GitHub 公开，并发送给 AI 审阅；有疑点的交给维护者确认。","loginBeforeShare":"提交时需要登录 GitHub，当前草稿会保留。","submitting":"提交中…","submitted":"已提交审核，可在“我的配置 → 已分享”查看结果。","pending":"审核中","published":"已上架","changes":"需要修改","needsReview":"等待人工确认","unavailable":"审核暂不可用","hidden":"已隐藏","withdrawn":"已撤下","noShares":"你还没有分享配置。","withdraw":"撤下","withdrawConfirm":"将这份配置从商店撤下？已经导入的玩家仍会保留本地配置。","review":"审核反馈","noReview":"当前版本还没有审核结果。","loginRequired":"登录 GitHub 后即可管理自己的分享。","notConfigured":"GitHub 登录尚未配置。","rateLimit":"已达到 GitHub 请求限制，请稍后再试。","networkError":"无法连接 GitHub，请检查网络后重试。","invalidConfig":"这份配置的格式不正确。","tooLarge":"这份配置超过了大小限制。","integrityError":"下载的配置未通过完整性检查。","requestFailed":"请求失败，请重试。","OneHanded":"单手","1H_Mage":"单手法师","TwoHanded":"双手","2H_Mage":"双手法师","DualWielding":"双持","DW_Mage":"双持法师","NitenIchiryu":"二天一流","NI_Mage":"二天法师","Staff":"法杖","Unarmed":"空手","General":"通用","Arena":"竞技场","Encounter":"遭遇战","Colosseum":"浴血擂台","Battle1000":"压榨","Item":"道具界","Tower":"高塔","publishedVersion":"已有上架版本","accessDenied":"已取消 GitHub 授权。","loginExpired":"授权代码已过期，请重新登录。","managerUnavailable":"请在脚本管理器中启用插件权限。","notOwner":"只有作者可以编辑这份配置。","submissionClosed":"这份配置已撤下，可以重新分享。","tooManySubmissions":"分享数量过多，请前往 GitHub 管理。","local":"当前配置","backpack":"背包","shared":"已分享","style":"流派","battleType":"战斗类型","all":"全部","shareShort":"分享","useConfig":"使用此配置","chooseConfig":"选择配置","currentSettings":"当前设置","savedSettings":"已保存","noLocal":"没有可用的本地配置。","updateCore":"更新 JPX-PLUS 后可浏览两个世界的已保存配置。下方仍可选择当前设置。","changeConfig":"更换配置","appliesTo":"适用世界","saveBackpack":"存入背包","saveCurrent":"保存当前配置","emptyBackpack":"背包还是空的。可以从当前设置或商店存入配置，保留多套备用。","searchBackpack":"搜索背包","editBackpack":"编辑背包配置","save":"保存","saving":"保存中…","savedBackpack":"已存入背包。","backpackHint":"仅保存在当前浏览器，需要时再应用或分享。","apply":"应用配置","delete":"删除","deleteBackpackConfirm":"从背包删除这份配置？已应用的设置和已分享的配置不受影响。","storageCorrupt":"无法读取背包数据，原有数据已保留。","storageError":"无法访问背包存储，请检查插件权限后重试。","localNotFound":"这份配置已不在背包中。"}};
    const t = key => {
        const name = key.replace(/^cStore\./, '');
        const external = host.jpxI18N?.cStore?.[name];
        if (typeof external === 'string') return external;
        const fallback = host.jpxI18N?.cB?.basicSettings === '基本设置' ? translations.zh : translations.en;
        return fallback[name] || key;
    };
// Only this public app identifier is embedded. Tokens stay in userscript-manager storage.
const JPX_CONFIG_STORE = Object.freeze({ repository: 'MeiYongAI/JPX-PLUS-Configs', clientId: 'Iv23liGY2o8zyCDWgKBV' });
const jpxConfigStore = (() => {
    const repository = JPX_CONFIG_STORE.repository, api = 'https://api.github.com', raw = 'https://raw.githubusercontent.com/' + repository + '/main/';
    const tokenKey = 'jpx-config-store-auth-v1', marker = '<!-- JPX-PLUS-CONFIG:v1 -->\n```json\n';
    const backpackPrefix = 'jpx-config-store-backpack-v1:', backpackLimit = 2 * 1024 * 1024;
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
    // The local backpack is an archive, not a submission: never migrate aliases or
    // rewrite its configuration. Publishing/importing runs its own compatibility checks.
    function backpackEnvelope(input) {
        inspect(input, 0, { nodes: 0, nodeLimit: 150000, stringLimit: backpackLimit, exactJSON: true });
        if (!object(input) || input.schemaVersion !== 1 || !kinds.includes(input.kind) || !worlds.includes(input.world) ||
            !text(input.title, 100) || /[\r\n]/.test(input.title) || !text(input.description, 4000, true) ||
            typeof input.scriptVersion !== 'string' || !/^[\d.\w-]{1,40}$/.test(input.scriptVersion) || !object(input.config) ||
            Object.keys(input).some(key => !['schemaVersion', 'kind', 'title', 'description', 'world', 'mode', 'scriptVersion', 'config'].includes(key))) fail('invalidConfig');
        const config = input.config;
        if (input.kind === 'stats') {
            if (!integer(config.statsVersion) || input.mode !== undefined) fail('invalidConfig');
        } else {
            if (!integer(config.battleVersion || config.version)) fail('invalidConfig');
            if (input.kind === 'battle-mode' &&
                (![...modes, 'Battlecaster_General'].includes(input.mode) || !object(config[input.mode]) ||
                Object.keys(config).some(key => !['battleVersion', 'version', input.mode].includes(key)))) fail('invalidConfig');
            if (input.kind === 'battle' && input.mode !== undefined) fail('invalidConfig');
        }
        const serialized = JSON.stringify(input);
        if (encode(serialized).length > backpackLimit) fail('tooLarge');
        return JSON.parse(serialized);
    }
    function backpackKey(id) {
        if (typeof id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id)) fail('invalidConfig');
        return backpackPrefix + id;
    }
    function newBackpackId() {
        if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
        const bytes = crypto.getRandomValues(new Uint8Array(16));
        bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
        const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
        return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
    }
    async function backpackStorage(action) {
        try { return await action(); } catch { fail('storageError'); }
    }
    function backpackRecord(value, id) {
        try {
            if (!object(value) || value.id !== id || !text(value.savedAt, 40) || !Number.isFinite(Date.parse(value.savedAt)) ||
                Object.keys(value).some(key => !['id', 'savedAt', 'envelope'].includes(key))) fail('storageCorrupt');
            return { id, savedAt: value.savedAt, envelope: backpackEnvelope(value.envelope) };
        } catch { fail('storageCorrupt'); }
    }
    async function backpackList() {
        if (typeof GM_listValues !== 'function' || typeof GM_getValue !== 'function') fail('managerUnavailable');
        const keys = await backpackStorage(() => GM_listValues());
        if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string')) fail('storageError');
        const records = await Promise.all(keys.filter(key => key.startsWith(backpackPrefix)).map(async key => {
            const id = key.slice(backpackPrefix.length);
            try { backpackKey(id); } catch { fail('storageCorrupt'); }
            const value = await backpackStorage(() => GM_getValue(key, null));
            // Another tab may delete a record after the key enumeration.
            return value === null ? null : backpackRecord(value, id);
        }));
        return records.filter(Boolean).sort((a, b) => b.savedAt.localeCompare(a.savedAt) || a.id.localeCompare(b.id));
    }
    async function backpackSave(input, id) {
        if (typeof GM_getValue !== 'function' || typeof GM_setValue !== 'function') fail('managerUnavailable');
        const envelope = backpackEnvelope(input), updating = id !== undefined;
        id = updating ? id : newBackpackId();
        const key = backpackKey(id), previous = await backpackStorage(() => GM_getValue(key, null));
        if (updating) {
            if (previous === null) fail('localNotFound');
            backpackRecord(previous, id);
        } else if (previous !== null) fail('storageError');
        const record = { id, savedAt: new Date(Date.now()).toISOString(), envelope };
        await backpackStorage(() => GM_setValue(key, clone(record)));
        return clone(record);
    }
    async function backpackRemove(id) {
        const key = backpackKey(id);
        if (typeof GM_deleteValue !== 'function') fail('managerUnavailable');
        await backpackStorage(() => GM_deleteValue(key));
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
    return Object.freeze({ catalog, load, user, login, logout, mine, submit, withdraw, parseSubmission, feedback, backpackList, backpackSave, backpackRemove });
})();

function renderConfigStore(parent, hooks) {
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
    const state = { view: 'browse', entries: [], query: '', kind: '', backpack: { query: '', kind: '' }, local: { world: '', style: '', battleType: '' }, user: null, editor: null, request: 0, login: null, disposed: false };
    const alive = () => !state.disposed && root.isConnected;
    function message(text, error = false) {
        status.textContent = text || '';
        status.hidden = !text;
        status.dataset.error = String(error);
    }
    function errorMessage(error) {
        const codes = { loginRequired: 'loginRequired', notConfigured: 'notConfigured', rateLimited: 'rateLimit',
            networkError: 'networkError', invalidConfig: 'invalidConfig', tooLarge: 'tooLarge', integrityFailed: 'integrityError',
            accessDenied: 'accessDenied', loginExpired: 'loginExpired', managerUnavailable: 'managerUnavailable',
            notOwner: 'notOwner', submissionClosed: 'submissionClosed', tooManySubmissions: 'tooManySubmissions',
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
    function field(text, input) {
        const label = el('label', undefined, 'jpx-store-field');
        label.append(el('span', text), input);
        return label;
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
    function modeName(mode) {
        if (!mode) return '';
        const split = mode.lastIndexOf('_'), style = mode.slice(0, split), battle = mode.slice(split + 1);
        return tr(style) + ' · ' + tr(battle);
    }
    function info(envelope, author) {
        return [author ? '@' + author : '', kindName(envelope.kind), worldName(envelope.world), modeName(envelope.mode)].filter(Boolean).join(' · ');
    }
    const browseButton = button(tr('browse'), () => browse());
    const mineButton = button(tr('mine'), () => backpack());
    navigation.append(browseButton, mineButton);
    toolbar.append(navigation, account);
    root.append(toolbar, status, viewHeader, stage);
    parent.append(root);
    function accountControls() {
        account.replaceChildren();
        if (state.user) {
            const logout = button('@' + state.user.login, async () => {
                await jpxConfigStore.logout(); state.user = null; accountControls();
                if (state.view === 'mine') await mine();
                message(tr('signedOut'));
            });
            logout.title = tr('signOut');
            logout.setAttribute('aria-label', tr('signOut') + ' · ' + state.user.login);
            account.append(logout);
        } else account.append(button(tr('signIn'), () => login()));
    }
    function open(view) {
        state.login?.abort(); state.login = null;
        state.view = view;
        state.request++;
        browseButton.setAttribute('aria-pressed', String(view === 'browse' || view === 'detail'));
        mineButton.setAttribute('aria-pressed', String(['backpack', 'backpackDetail', 'local', 'localDetail', 'mine', 'edit'].includes(view)));
        viewHeader.replaceChildren(); stage.replaceChildren(); message('');
        stage.scrollTop = 0;
        return state.request;
    }
    function heading(title, back) {
        const row = el('div', undefined, 'jpx-store-heading');
        if (back) row.append(button(tr('back'), back));
        row.append(el('h3', title)); viewHeader.append(row);
    }
    function empty(text, action, label = tr('retry')) {
        const box = el('div', undefined, 'jpx-store-empty');
        box.append(el('p', text));
        if (action) box.append(button(label, action));
        stage.append(box);
    }
    async function browse(refresh = false) {
        const request = open('browse');
        const filters = el('div', undefined, 'jpx-store-filters');
        const search = el('input'); search.type = 'search'; search.value = state.query; search.placeholder = tr('search');
        search.setAttribute('aria-label', tr('search'));
        const filter = select([['', tr('allTypes')], ...kinds()], state.kind);
        filter.setAttribute('aria-label', tr('type'));
        filters.append(search, filter, button(tr('refresh'), () => browse(true)));
        const list = el('div', undefined, 'jpx-store-list');
        viewHeader.append(filters); stage.append(list);
        function render() {
            list.replaceChildren();
            const query = state.query.trim().toLocaleLowerCase();
            const entries = state.entries.filter(entry => (!state.kind || entry.kind === state.kind) &&
                [entry.title, entry.description, entry.author, modeName(entry.mode)].join(' ').toLocaleLowerCase().includes(query));
            if (!entries.length) { list.append(el('p', tr(state.entries.length ? 'noMatches' : 'noConfigs'), 'jpx-store-empty')); return; }
            for (const entry of entries) {
                const row = el('article', undefined, 'jpx-store-row');
                const title = button(entry.title, () => details(entry), 'jpx-store-title');
                row.append(title, el('p', info(entry, entry.author), 'jpx-store-meta'));
                if (entry.description) row.append(el('p', entry.description, 'jpx-store-excerpt'));
                list.append(row);
            }
        }
        search.addEventListener('input', () => { state.query = search.value; render(); });
        filter.addEventListener('change', () => { state.kind = filter.value; render(); });
        message(tr('loading'));
        try {
            const catalog = await jpxConfigStore.catalog({ refresh });
            if (!alive() || request !== state.request) return;
            state.entries = catalog.entries; message(''); render();
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true);
            list.append(button(tr('retry'), () => browse(true)));
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
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function personalNavigation(view) {
        const tabs = el('div', undefined, 'jpx-store-navigation');
        for (const [key, action] of [['backpack', () => backpack()], ['local', () => local()], ['shared', () => mine()]]) {
            const tab = button(tr(key), action); tab.setAttribute('aria-pressed', String(view === key)); tabs.append(tab);
        }
        viewHeader.append(tabs);
        return tabs;
    }
    const localName = entry => entry.kind === 'battle-mode' ? modeName(entry.mode) : kindName(entry.kind);
    const localMeta = entry => [worldName(entry.world), entry.source === 'saved' ? tr('savedSettings') : tr('currentSettings')];
    const localDraft = entry => hooks.getDraft(entry.kind, entry.legacy ? undefined : { world: entry.world, mode: entry.mode });
    function chooseLocal(entry, previous) {
        const envelope = localDraft(entry);
        envelope.title = previous?.envelope.title || [localName(entry), worldName(entry.world)].join(' · ');
        envelope.description = previous?.envelope.description || '';
        return edit({ ...(previous || {}), envelope, source: entry });
    }
    function saveToBackpack(envelope, back, id) {
        return edit({ envelope: JSON.parse(JSON.stringify(envelope)), localOnly: true, backpackId: id, back });
    }
    function saveCurrent(entry) {
        const envelope = localDraft(entry);
        envelope.title = [localName(entry), worldName(entry.world)].join(' · ');
        return saveToBackpack(envelope, () => local());
    }
    async function backpack() {
        const request = open('backpack'); personalNavigation('backpack');
        try {
            const entries = await jpxConfigStore.backpackList();
            if (!alive() || request !== state.request) return;
            if (!entries.length) { empty(tr('emptyBackpack'), () => local(), tr('saveCurrent')); return; }
            const filters = el('div', undefined, 'jpx-store-filters');
            const search = el('input'); search.type = 'search'; search.value = state.backpack.query;
            search.placeholder = tr('searchBackpack'); search.setAttribute('aria-label', tr('searchBackpack'));
            const kind = select([['', tr('allTypes')], ...kinds()], state.backpack.kind); kind.setAttribute('aria-label', tr('type'));
            const list = el('div', undefined, 'jpx-store-list');
            filters.append(search, kind); viewHeader.append(filters); stage.append(list);
            function render() {
                list.replaceChildren();
                const query = state.backpack.query.trim().toLocaleLowerCase();
                const shown = entries.filter(({ envelope }) => (!state.backpack.kind || envelope.kind === state.backpack.kind) &&
                    [envelope.title, envelope.description, info(envelope)].join(' ').toLocaleLowerCase().includes(query));
                for (const entry of shown) {
                    const envelope = entry.envelope, row = el('article', undefined, 'jpx-store-row'); row.dataset.backpackId = entry.id;
                    row.append(button(envelope.title, () => backpackDetails(entry), 'jpx-store-title'),
                        button(tr('shareShort'), () => edit({ envelope: JSON.parse(JSON.stringify(envelope)), back: () => backpackDetails(entry) })),
                        el('p', info(envelope), 'jpx-store-meta'));
                    if (envelope.description) row.append(el('p', envelope.description, 'jpx-store-excerpt'));
                    list.append(row);
                }
                if (!shown.length) list.append(el('p', tr('noMatches'), 'jpx-store-empty'));
            }
            search.addEventListener('input', () => { state.backpack.query = search.value; render(); });
            kind.addEventListener('change', () => { state.backpack.kind = kind.value; render(); });
            render();
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => backpack());
        }
    }
    function backpackDetails(entry) {
        const envelope = entry.envelope;
        open('backpackDetail'); heading(envelope.title, () => backpack());
        stage.append(el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta'));
        if (envelope.description) stage.append(el('p', envelope.description, 'jpx-store-description'));
        const actions = el('div', undefined, 'jpx-store-actions');
        actions.append(button(tr('apply'), async () => { await hooks.importConfig(envelope); hooks.notify?.(tr('imported')); }, 'jpx-store-primary'),
            button(tr('shareShort'), () => edit({ envelope: JSON.parse(JSON.stringify(envelope)), back: () => backpackDetails(entry) })),
            button(tr('download'), () => downloadConfig(envelope, entry.id)),
            button(tr('editShare'), () => saveToBackpack(envelope, () => backpackDetails(entry), entry.id)),
            button(tr('delete'), async () => {
                if (!confirm(tr('deleteBackpackConfirm'))) return;
                await jpxConfigStore.backpackRemove(entry.id); await backpack();
            }));
        stage.append(actions, el('p', tr('importHint'), 'jpx-store-meta'), rawPreview(envelope));
    }
    function local(previous) {
        open('local');
        if (previous) heading(tr('chooseConfig'), () => edit(previous));
        else personalNavigation('local');
        let entries;
        if (hooks.listDrafts) entries = hooks.listDrafts();
        else {
            stage.append(el('p', tr('updateCore'), 'jpx-store-meta'));
            entries = kinds().flatMap(([kind]) => {
                try { const draft = hooks.getDraft(kind); return [{ kind, world: draft.world, mode: draft.mode, source: 'draft', legacy: true }]; }
                catch { return []; }
            });
        }
        if (previous?.id) entries = entries.filter(entry => entry.kind === previous.envelope.kind);
        const filters = el('div', undefined, 'jpx-store-local-filters');
        const list = el('div', undefined, 'jpx-store-list');
        const parts = entry => { const split = entry.mode?.lastIndexOf('_'); return split >= 0 ? [entry.mode.slice(0, split), entry.mode.slice(split + 1)] : ['', '']; };
        const options = [
            ['world', 'world', [...new Set(entries.map(entry => entry.world))].map(value => [value, worldName(value)])],
            ['style', 'style', [...new Set(entries.map(entry => parts(entry)[0]).filter(Boolean))].map(value => [value, tr(value)])],
            ['battleType', 'battleType', [...new Set(entries.map(entry => parts(entry)[1]).filter(Boolean))].map(value => [value, tr(value)])]
        ];
        function render() {
            list.replaceChildren();
            const shown = entries.filter(entry => (!state.local.world || entry.world === state.local.world) &&
                (!state.local.style || parts(entry)[0] === state.local.style) && (!state.local.battleType || parts(entry)[1] === state.local.battleType));
            for (const entry of shown) {
                const row = el('article', undefined, 'jpx-store-row jpx-store-local-row');
                row.dataset.localWorld = entry.world; row.dataset.localKind = entry.kind; row.dataset.localMode = entry.mode || '';
                const preview = button(localName(entry), () => localDetails(entry, previous), 'jpx-store-title'); preview.dataset.localAction = 'preview';
                const share = button(tr(previous ? 'useConfig' : 'shareShort'), () => chooseLocal(entry, previous)); share.dataset.localAction = 'share';
                const actions = el('div', undefined, 'jpx-store-row-tools'); actions.append(share);
                if (!previous) { const save = button(tr('saveBackpack'), () => saveCurrent(entry)); save.dataset.localAction = 'save'; actions.append(save); }
                row.append(preview, actions);
                const counts = ['supports', 'attacks'].filter(key => Number.isFinite(entry[key])).map(key => tr(key) + ': ' + entry[key]);
                row.append(el('p', [...localMeta(entry), ...counts].join(' · '), 'jpx-store-meta'));
                list.append(row);
            }
            if (!shown.length) list.append(el('p', tr(entries.length ? 'noMatches' : 'noLocal'), 'jpx-store-empty'));
        }
        for (const [key, label, values] of options) {
            if (!values.some(([value]) => value === state.local[key])) state.local[key] = '';
            const control = select([['', tr('all')], ...values], state.local[key]); control.dataset.localFilter = key;
            control.addEventListener('change', () => { state.local[key] = control.value; render(); });
            filters.append(field(tr(label), control));
        }
        viewHeader.append(filters); stage.append(list); render();
    }
    function localDetails(entry, previous) {
        const envelope = localDraft(entry);
        open('localDetail'); heading(localName(entry), () => local(previous));
        const actions = el('div', undefined, 'jpx-store-actions');
        actions.append(button(tr(previous ? 'useConfig' : 'share'), () => chooseLocal(entry, previous), 'jpx-store-primary'));
        if (!previous) actions.append(button(tr('saveBackpack'), () => saveCurrent(entry)));
        stage.append(el('p', localMeta(entry).join(' · '), 'jpx-store-meta'), el('p', configSummary(envelope), 'jpx-store-meta'), actions, rawPreview(envelope));
    }
    async function details(entry) {
        const request = open('detail'); heading(entry.title, () => browse()); message(tr('loading'));
        try {
            const envelope = await jpxConfigStore.load(entry);
            if (!alive() || request !== state.request) return;
            message('');
            stage.append(el('p', info(envelope, entry.author), 'jpx-store-meta'));
            if (envelope.description) stage.append(el('p', envelope.description, 'jpx-store-description'));
            stage.append(el('p', configSummary(envelope), 'jpx-store-meta'),
                el('p', tr('scriptVersion') + ': ' + envelope.scriptVersion, 'jpx-store-meta'));
            const actions = el('div', undefined, 'jpx-store-actions');
            actions.append(button(tr('import'), async () => { await hooks.importConfig(envelope); hooks.notify?.(tr('imported')); }, 'jpx-store-primary'),
                button(tr('saveBackpack'), () => saveToBackpack(envelope, () => details(entry))),
                button(tr('download'), () => downloadConfig(envelope, entry.id)));
            stage.append(actions, el('p', tr('importHint'), 'jpx-store-meta'), rawPreview(envelope));
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => details(entry));
        }
    }
    async function login(after = () => backpack(), cancel = () => backpack()) {
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
            if (!alive() || request !== state.request) return;
            state.user = user || await jpxConfigStore.user(); state.login = null; accountControls(); await after();
        } catch (error) {
            if (!alive() || request !== state.request || error?.name === 'AbortError') return;
            message(errorMessage(error), true); panel.replaceChildren(button(tr('retry'), () => login(after, cancel)));
        }
    }
    async function edit(existing) {
        if (!existing) return local();
        const model = existing;
        state.editor = model; open('edit');
        heading(model.localOnly ? tr(model.backpackId ? 'editBackpack' : 'saveBackpack') : model.id ? tr('editShare') : tr('share'),
            model.back || (() => model.id ? mine() : local()));
        const request = state.request;
        const form = el('form', undefined, 'jpx-store-form');
        form.dataset.storeEditor = model.localOnly ? 'backpack' : 'share';
        const envelope = model.envelope;
        const world = model.id && !model.localOnly ? select([['Persistent', tr('persistent')], ['Isekai', tr('isekai')], ['Any', tr('anyWorld')]], envelope.world) : null;
        const title = el('input'); title.type = 'text'; title.required = true; title.maxLength = 100; title.value = envelope.title || '';
        const description = el('textarea'); description.rows = 4; description.maxLength = 4000; description.value = envelope.description || '';
        const summary = el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta');
        const selection = el('div', undefined, 'jpx-store-selection');
        selection.append(summary);
        if (!model.localOnly) selection.append(button(tr('changeConfig'), () => local(model)));
        form.append(selection);
        if (world) form.append(field(tr('appliesTo'), world));
        form.append(field(tr('title'), title), field(tr('description'), description));
        const source = el('div', undefined, 'jpx-store-actions');
        const publish = el('button', model.localOnly ? tr('save') : model.id ? tr('submitUpdate') : tr('submit'), 'jpx-store-primary'); publish.type = 'submit';
        source.append(publish); form.append(rawPreview(envelope), source, el('p', tr(model.localOnly ? 'backpackHint' : 'reviewHint'), 'jpx-store-meta'));
        if (!model.localOnly && !state.user) form.append(el('p', tr('loginBeforeShare'), 'jpx-store-meta'));
        for (const [control, key] of [[title, 'title'], [description, 'description'], ...(world ? [[world, 'world']] : [])])
            control.addEventListener('input', () => { envelope[key] = control.value; });
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (!form.reportValidity()) return;
            envelope.title = title.value.trim(); envelope.description = description.value.trim();
            if (world) envelope.world = world.value;
            if (!envelope.title) { title.focus(); return; }
            if (!model.localOnly && !state.user) { await login(() => edit(model), () => edit(model)); return; }
            publish.disabled = true; message(tr(model.localOnly ? 'saving' : 'submitting'));
            try {
                const saved = model.localOnly ? await jpxConfigStore.backpackSave(envelope, model.backpackId) : await jpxConfigStore.submit(envelope, model.id);
                if (!alive()) return;
                state.editor = null;
                if (request !== state.request) { hooks.notify?.(tr(model.localOnly ? 'savedBackpack' : 'submitted')); return; }
                if (model.localOnly) { backpackDetails(saved); message(tr('savedBackpack')); }
                else { await mine(); message(tr('submitted')); }
            } catch (error) { if (alive()) message(errorMessage(error), true); }
            finally { if (publish.isConnected) publish.disabled = false; }
        });
        stage.append(form);
    }
    function issueStatus(issue) {
        if (issue.state === 'closed') return 'withdrawn';
        const labels = issue.labels;
        for (const [label, key] of [['store:hide', 'hidden'], ['store:pending', 'pending'], ['store:changes-requested', 'changes'], ['store:needs-review', 'needsReview'], ['store:unavailable', 'unavailable'], ['store:published', 'published']])
            if (labels.includes(label)) return key;
        return 'pending';
    }
    async function mine() {
        const request = open('mine'), tabs = personalNavigation('shared');
        if (!state.user) { empty(tr('loginRequired'), () => login(() => mine()), tr('signIn')); return; }
        tabs.append(button(tr('refresh'), () => mine()));
        message(tr('loading'));
        try {
            const issues = await jpxConfigStore.mine();
            if (!alive() || request !== state.request) return;
            message('');
            if (!issues.length) { empty(tr('noShares'), () => local(), tr('share')); return; }
            const list = el('div', undefined, 'jpx-store-list'); stage.append(list);
            for (const issue of issues) {
                const row = el('article', undefined, 'jpx-store-row');
                const title = el('strong', issue.title.replace(/^\[Config\]\s*/, ''));
                const statusKey = issueStatus(issue);
                const badge = el('span', tr(statusKey === 'published' ? 'publishedVersion' : statusKey), 'jpx-store-badge');
                row.append(title, badge);
                try {
                    const envelope = jpxConfigStore.parseSubmission(issue.body);
                    row.append(el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta'));
                } catch { /* Keep malformed submissions manageable. */ }
                const actions = el('div', undefined, 'jpx-store-actions');
                if (issue.state !== 'closed') {
                    actions.append(button(tr('editShare'), () => edit({ id: issue.id, envelope: jpxConfigStore.parseSubmission(issue.body) })),
                        button(tr('withdraw'), async () => {
                            if (!confirm(tr('withdrawConfirm'))) return;
                            await jpxConfigStore.withdraw(issue.id); await mine();
                        }));
                }
                actions.append(button(tr('review'), async node => {
                    const old = row.querySelector('.jpx-store-feedback');
                    if (old) { old.remove(); node.setAttribute('aria-expanded', 'false'); return; }
                    const feedback = await jpxConfigStore.feedback(issue.id);
                    if (!alive() || request !== state.request) return;
                    if (!feedback && issue.state !== 'closed') badge.textContent = tr('pending');
                    const box = el('div', undefined, 'jpx-store-feedback');
                    const language = tr('browse') === '浏览' ? 'zh' : 'en';
                    box.append(el('p', feedback?.summary?.[language] || tr('noReview')));
                    for (const finding of feedback?.findings || []) box.append(el('p', [finding.path, finding[language]].filter(Boolean).join(' — ')));
                    row.append(box); node.setAttribute('aria-expanded', 'true');
                }));
                row.append(actions); list.append(row);
            }
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => mine());
        }
    }
    const observer = new MutationObserver(() => {
        if (!root.isConnected) { state.disposed = true; state.login?.abort(); observer.disconnect(); }
    });
    // The core removes its dialog directly from body; ignore battle-content mutations.
    observer.observe(doc.body, { childList: true });
    accountControls();
    jpxConfigStore.user().then(user => { if (alive()) { state.user = user; accountControls(); } }).catch(() => {});
    browse();
    return () => { state.disposed = true; state.login?.abort(); observer.disconnect(); };
}

    let migrationPending = null, migrationComplete = false;
    function attach() {
        const core = host.JPXPlus;
        if (!core || core.apiVersion !== 1) return;
        if (core.features?.configManagement) {
            // Manager storage belongs to another userscript. Transfer configurations only;
            // the source archive and its authorization token stay in this sandbox.
            if (!migrationComplete && !migrationPending && typeof core.migrateLegacyConfigs === 'function') {
                migrationPending = jpxConfigStore.backpackList()
                    .then(entries => core.migrateLegacyConfigs(JSON.parse(JSON.stringify(entries))))
                    .then(result => { if (result === false) throw new Error('Migration declined'); migrationComplete = true; })
                    .catch(error => host.dispatchEvent(new CustomEvent('jpx:legacy-config-error', { detail: {
                        code: ['storageCorrupt', 'storageError', 'managerUnavailable'].includes(error?.code) ? error.code : 'migrationFailed'
                    } })))
                    .finally(() => { migrationPending = null; });
            }
            host.removeEventListener('jpx:ready', attach);
            return;
        }
        core.registerSettingsTab({ id: 'configStore', title: () => t('cStore.name'), render(parent, hooks) {
            if (!document.getElementById('jpx-config-store-style')) {
                const style = document.createElement('style'); style.id = 'jpx-config-store-style';
                style.textContent = "#settings-container #panel_configStore { overflow: hidden; }\n#settings-container .jpx-store { display: flex; flex: 1; flex-direction: column; gap: 12px; min-width: 0; min-height: 0; color: var(--jpx-theme-text, #392d25); font: 13px/1.45 Arial, Helvetica, sans-serif; }\n#settings-container .jpx-store * { box-sizing: border-box; }\n#settings-container .jpx-store [hidden] { display: none !important; }\n#settings-container .jpx-store-toolbar, #settings-container .jpx-store-navigation, #settings-container .jpx-store-account, #settings-container .jpx-store-actions, #settings-container .jpx-store-heading { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-width: 0; }\n#settings-container .jpx-store-toolbar { flex: none; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-view-header { display: grid; flex: none; gap: 12px; min-width: 0; }\n#settings-container .jpx-store-view-header:empty { display: none; }\n#settings-container .jpx-store button, #settings-container .jpx-store-link { min-height: 32px; max-width: 100%; margin: 0; padding: 4px 10px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 6px; background: var(--jpx-theme-surface, #f9f6ec); color: var(--jpx-theme-accent, #5c0d11); font: inherit; font-weight: 400; line-height: 1.4; text-decoration: none; cursor: pointer; overflow-wrap: anywhere; }\n#settings-container .jpx-store button:hover, #settings-container .jpx-store-link:hover { background: var(--jpx-theme-hover, #f1e2c5); }\n#settings-container .jpx-store button[aria-pressed=true], #settings-container .jpx-store .jpx-store-primary { border-color: var(--jpx-theme-accent, #5c0d11); background: var(--jpx-theme-selected, #ead9b8); }\n#settings-container .jpx-store button:disabled { opacity: .55; cursor: default; }\n#settings-container .jpx-store :is(a, summary):focus-visible { outline: 1px solid var(--jpx-theme-accent, #9b4e03); outline-offset: -1px; box-shadow: 0 0 0 2px color-mix(in srgb, var(--jpx-theme-accent, #9b4e03) 12%, transparent); }\n#settings-container .jpx-store p { margin: 0; }\n#settings-container .jpx-store-status, #settings-container .jpx-store-empty { padding: 12px; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); }\n#settings-container .jpx-store-status[data-error=true] { border-left: 3px solid var(--jpx-theme-accent, #5c0d11); }\n#settings-container .jpx-store-status { flex: none; }\n#settings-container .jpx-store-empty p { margin-bottom: 8px; }\n#settings-container .jpx-store-stage { display: grid; align-content: start; flex: 1; gap: 12px; min-width: 0; min-height: 0; overflow: auto; padding-right: 4px; overscroll-behavior: contain; scrollbar-width: var(--jpx-scrollbar-width, thin); scrollbar-color: inherit; }\n#settings-container .jpx-store-filters { display: flex; gap: 8px; min-width: 0; }\n#settings-container .jpx-store input, #settings-container .jpx-store select, #settings-container .jpx-store textarea { min-width: 0; max-width: 100%; min-height: 32px; margin: 0; padding: 5px 8px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 4px; background: var(--jpx-theme-field, #fffdf7); color: var(--jpx-theme-text, #392d25); font: inherit; }\n#settings-container .jpx-store-filters input { flex: 1; width: 0; }\n#settings-container .jpx-store-filters select { max-width: 40%; }\n#settings-container .jpx-store-list { display: grid; min-width: 0; border-top: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 8px; padding: 12px 0; border-bottom: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-row > p, #settings-container .jpx-store-row > .jpx-store-actions, #settings-container .jpx-store-feedback { grid-column: 1 / -1; }\n#settings-container .jpx-store .jpx-store-title { width: fit-content; padding: 0; min-height: 24px; border: 0; background: transparent; text-align: left; font-weight: 600; }\n#settings-container .jpx-store .jpx-store-title:hover { text-decoration: underline; }\n#settings-container .jpx-store-meta { color: var(--jpx-theme-muted, #71634f); font-size: 12px; overflow-wrap: anywhere; }\n#settings-container .jpx-store-excerpt { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; }\n#settings-container .jpx-store-description { white-space: pre-wrap; overflow-wrap: anywhere; }\n#settings-container .jpx-store-heading h3 { flex: 1; margin: 0; color: var(--jpx-theme-accent, #5c0d11); font-size: 14px; overflow-wrap: anywhere; }\n#settings-container .jpx-store-form { display: grid; gap: 12px; min-width: 0; }\n#settings-container .jpx-store-local-filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }\n#settings-container .jpx-store-local-row > button { align-self: start; }\n#settings-container .jpx-store-row-tools { display: flex; flex-wrap: wrap; justify-content: end; align-items: start; gap: 6px; }\n#settings-container .jpx-store-selection { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 8px; }\n#settings-container .jpx-store-selection > button { align-self: start; }\n#settings-container .jpx-store-field { display: grid; gap: 4px; min-width: 0; }\n#settings-container .jpx-store textarea { width: 100%; resize: vertical; }\n#settings-container .jpx-store-raw { min-width: 0; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-field, #fffdf7); }\n#settings-container .jpx-store-raw summary { padding: 8px; cursor: pointer; color: var(--jpx-theme-accent, #5c0d11); }\n#settings-container .jpx-store pre { max-height: 280px; margin: 0; padding: 8px; overflow: auto; white-space: pre-wrap; overflow-wrap: anywhere; font: 12px/1.5 Consolas, monospace; border-top: 1px solid var(--jpx-theme-border, #c8b49b); }\n#settings-container .jpx-store-auth { display: grid; justify-items: start; gap: 12px; padding: 16px; border: 1px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); }\n#settings-container .jpx-store-auth-code { font: 600 22px/1.4 Consolas, monospace; user-select: all; letter-spacing: 2px; }\n#settings-container .jpx-store-badge { align-self: start; padding: 2px 8px; border: 1px solid var(--jpx-theme-border, #c8b49b); border-radius: 12px; color: var(--jpx-theme-accent, #5c0d11); font-size: 12px; white-space: nowrap; }\n#settings-container .jpx-store-feedback { display: grid; gap: 8px; padding: 8px 12px; border-left: 2px solid var(--jpx-theme-border, #c8b49b); background: var(--jpx-theme-surface, #f9f6ec); overflow-wrap: anywhere; white-space: pre-wrap; }\n@media (max-width: 650px) {\n    #settings-container .jpx-store-toolbar, #settings-container .jpx-store-navigation, #settings-container .jpx-store-account { gap: 6px; }\n    #settings-container .jpx-store button, #settings-container .jpx-store-link { min-height: 36px; padding: 5px 8px; }\n    #settings-container .jpx-store-filters { flex-wrap: wrap; }\n    #settings-container .jpx-store-filters input { flex-basis: 100%; width: 100%; }\n    #settings-container .jpx-store-filters select { flex: 1; max-width: none; }\n    #settings-container .jpx-store-local-filters { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n    #settings-container .jpx-store-local-filters > label:last-child { grid-column: 1 / -1; }\n}\n"; document.head.append(style);
            }
            renderConfigStore(parent, hooks);
        } });
        host.removeEventListener('jpx:ready', attach);
    }
    host.addEventListener('jpx:ready', attach);
    host.addEventListener('jpx:legacy-config-request', attach);
    attach();
})();

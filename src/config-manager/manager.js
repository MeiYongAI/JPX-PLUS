// Configuration ownership is separate from the native battle settings and editor drafts.
let jpxConfigLibrary = null;
let jpxConfigManagerView = null;
let jpxEmbeddedStore = null;
const jpxConfigLibraryKey = 'jpx_configLibrary_v1';
const jpxConfigApplyKey = 'jpx_configApplySignal_v1';
const jpxConfigClone = value => JSON.parse(JSON.stringify(value));
const jpxConfigWorld = () => isekaiSuffix ? 'Isekai' : 'Persistent';
const jpxConfigHasRules = value => value && Array.isArray(value.supports) && Array.isArray(value.attacks);
const jpxConfigHasContent = value => jpxConfigHasRules(value) && Object.entries(value).some(([key, rules]) =>
    (key === 'supports' || key === 'attacks' || key.startsWith('kb_')) && Array.isArray(rules) && rules.length);
let jpxSelectedConfig;
const jpxConfigModeLabel = mode => {
    const split = mode.lastIndexOf('_');
    return t('cB.' + mode.slice(0, split)) + ' · ' + t('cB.' + mode.slice(split + 1));
};

function getJpxConfigLibrary() {
    return jpxConfigLibrary ||= createJpxConfigLibrary({ storage: localStorage, key: jpxConfigLibraryKey,
        modes: BATTLE_MODES, battleVersion: defaultCfgBattle.battleVersion, statsVersion: defaultCfgStats.statsVersion });
}

async function migrateJpxLegacyConfigs(entries) {
    if (!Array.isArray(entries) || entries.length > 1000) throw new Error('Invalid configuration archive');
    // The legacy plugin owns its GM store. Only configuration records cross this boundary.
    const copied = jpxConfigClone(entries).map(entry => ({ id: entry.id, savedAt: entry.savedAt,
        envelope: entry.envelope, ...(entry.source ? { source: entry.source } : {}) }));
    const library = getJpxConfigLibrary();
    // A source revision is imported once, even if its local copy was subsequently
    // edited. A changed legacy source gets a new copy rather than replacing edits.
    for (const entry of copied) {
        const source = JSON.stringify({ id: entry.id, envelope: entry.envelope, ...(entry.source ? { source: entry.source } : {}) });
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
        const fingerprint = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        library.migrate([entry], 'legacy-backpack:' + fingerprint);
    }
    window.dispatchEvent(new Event('jpx:config-library'));
    return library.readState();
}

function seedJpxConfigLibrary() {
    const library = getJpxConfigLibrary();
    for (const world of ['Persistent', 'Isekai']) {
        const marker = 'native-configs-v1:' + world;
        if (library.readState().migrations.includes(marker)) continue;
        const raw = localStorage.getItem(prefix + 'cfgBattle' + (world === 'Isekai' ? '_isekai' : ''));
        let config;
        try { config = raw ? JSON.parse(raw) : null; } catch { /* Keep the original malformed storage untouched. */ }
        const valid = config && typeof config === 'object' && !Array.isArray(config) &&
            Number(config.battleVersion || config.version || 0) >= defaultCfgBattle.battleVersion;
        if (!valid) continue;
        // Never split away a user's original multi-mode file during file import. These
        // entries are snapshots of the already-applied native mode slots, not an import.
        const normal = {}, entries = [];
        mergeCfg(jpxConfigClone(config), { battleVersion: defaultCfgBattle.battleVersion }, normal, 'battle');
        for (const mode of BATTLE_MODES) if (jpxConfigHasContent(normal[mode])) entries.push({
            id: 'native-' + world + '-' + mode,
            source: { type: 'native' },
            envelope: { schemaVersion: 1, kind: 'battle-mode', title: jpxConfigModeLabel(mode), description: '', world,
                mode, scriptVersion: window.JPXPlus.version, config: { battleVersion: normal.battleVersion, [mode]: normal[mode] } }
        });
        // Entries, initial applied snapshots and the completion marker are committed
        // together. A failed write can be retried without losing an applied label.
        library.migrate(entries, marker, { applied: entries.map(entry => ({ world, id: entry.id, scopes: [entry.envelope.mode] })) });
    }
    return library;
}

// Cache the explicit selection once, outside the battle action loop. The active
// snapshot belongs to the library; native exports still contain only JPX rules.
function refreshJpxSelectedConfig() {
    jpxSelectedConfig = null;
    try {
        const state = getJpxConfigLibrary().readState(), world = jpxConfigWorld();
        const id = state.active?.[world], record = state.applied[world]?.[id];
        if (record?.mode && BATTLE_MODES.includes(record.mode) && jpxConfigHasRules(cfgBattle[record.mode]) &&
            JSON.stringify(cfgBattle[record.mode]) === JSON.stringify(record.config[record.mode])) {
            jpxSelectedConfig = { mode: record.mode, rules: cfgBattle[record.mode] };
        }
    } catch (error) { console.warn('JPX-PLUS selected configuration could not be loaded.', error); }
}

function getJpxSelectedBattleMode() {
    if (jpxSelectedConfig === undefined || jpxSelectedConfig && cfgBattle[jpxSelectedConfig.mode] !== jpxSelectedConfig.rules) refreshJpxSelectedConfig();
    return jpxSelectedConfig?.mode || '';
}

// Explicit PLUS choices live with their rules, never in the detected magic-damage cache.
function getManagedBattleStyle(detected) {
    const selected = getJpxSelectedBattleMode();
    if (selected) return selected.slice(0, selected.lastIndexOf('_'));
    const family = value => ({ '1H_Mage': 'OneHanded', '2H_Mage': 'TwoHanded', DW_Mage: 'DualWielding', NI_Mage: 'NitenIchiryu' }[value] || value);
    for (const type of [battleType, 'General']) {
        const choices = BATTLE_STYLES.filter(style => family(style) === family(detected));
        for (const style of choices) {
            const data = cfgBattle[style + '_' + type], execution = data?.jpxPlusExecution;
            if (execution?.style === style && jpxConfigHasRules(data) &&
                (data.supports.length || data.attacks.length || Object.entries(data).some(([key, value]) => key.startsWith('kb_') && Array.isArray(value) && value.length))) return style;
        }
    }
    return detected;
}

function getManagedSpellType() {
    const element = cfgBattle[getBattleMode()]?.jpxPlusExecution?.element;
    return ['fire', 'cold', 'wind', 'elec', 'holy', 'dark'].includes(element) ? element : spellDamageBonus.maxType;
}

function pauseForJpxConfigApplication() {
    if (!log) return false;
    isActiveBattle = false; readyNext = 0;
    jpxPanelManager.updateContent('battle'); jpxPanelManager.setBackground('#fef'); jpxPanelManager.dispatchState();
    return true;
}

// Applying from a second tab must also stop the battle tab before its next action.
window.addEventListener('storage', event => {
    if (event.key !== jpxConfigApplyKey || !event.newValue) return;
    try {
        const signal = JSON.parse(event.newValue), stats = signal.world === 'Any';
        if (!stats && signal.world !== jpxConfigWorld() || !Array.isArray(signal.scopes)) return;
        const key = stats ? prefix + 'cfgStats' : prefix + 'cfgBattle' + isekaiSuffix;
        const data = JSON.parse(localStorage.getItem(key) || 'null');
        if (!data || typeof data !== 'object' || Array.isArray(data)) return;
        if (stats) {
            validateStatsConfig(data); cfgStats = jpxConfigClone(data);
            document.getElementById('settings-container')?.jpxConfigApplied?.(data, 'stats');
        } else {
            if ((data.battleVersion || 0) < defaultCfgBattle.battleVersion) return;
            pauseForJpxConfigApplication();
            const patch = {};
            for (const key of signal.scopes) if (BATTLE_MODES.includes(key) || Object.hasOwn(defaultCfgBattle,key)) {
                if (Object.hasOwn(data,key)) patch[key] = jpxConfigClone(data[key]);
            }
            Object.assign(cfgBattle,patch);
            refreshJpxSelectedConfig();
            document.getElementById('settings-container')?.jpxConfigApplied?.(patch,'battle');
            jpxPanelManager.refreshAppearance?.();
        }
    } catch (error) { console.warn('JPX-PLUS configuration update could not be loaded.', error); }
});

function commitJpxConfigEntry(entry, world, onApplied = (patch, scope) => document.getElementById("settings-container")?.jpxConfigApplied?.(patch, scope)) {
    const library = getJpxConfigLibrary(), envelope = entry.envelope, stats = envelope.kind === "stats";
    if (!["Persistent", "Isekai", "Any"].includes(world) || stats !== (world === "Any")) throw Object.assign(new Error(), { code: "invalidConfig" });
    if (library.get(entry.id)?.revision !== entry.revision) throw Object.assign(new Error(), { code: "libraryChanged" });
    const key=stats?prefix+'cfgStats':prefix+'cfgBattle'+(world==='Isekai'?'_isekai':'');
    const original=localStorage.getItem(key), originalLibrary=localStorage.getItem(jpxConfigLibraryKey);
    let current=original?JSON.parse(original):null;
    const versionKey=stats?'statsVersion':'battleVersion',defaults=stats?defaultCfgStats:defaultCfgBattle;
    if(!current||typeof current!=='object'||Array.isArray(current)||Number(current[versionKey]||(!stats&&current.version)||0)<defaults[versionKey])current=jpxConfigClone(defaults);
    const patch={};
    if(stats){ validateStatsConfig(envelope.config); mergeCfg(jpxConfigClone(envelope.config),current,patch,'stats'); }
    else {
        // Native migration rules apply on a detached copy. Single-mode application
        // cannot touch a different slot or persist unrelated settings drafts.
        const normalized={}; mergeCfg(jpxConfigClone(envelope.config),{battleVersion:defaultCfgBattle.battleVersion},normalized,'battle');
        for(const mode of BATTLE_MODES.filter(mode=>Object.hasOwn(envelope.config,mode)))
            patch[mode]=normalized[mode]||jpxConfigClone(envelope.config[mode]);
        if(envelope.kind==='battle')for(const key of Object.keys(envelope.config))if(!BATTLE_MODES.includes(key)&&Object.hasOwn(defaultCfgBattle,key))patch[key]=jpxConfigClone(envelope.config[key]);
        patch.battleVersion=defaultCfgBattle.battleVersion;
        // A newer explicit choice replaces a prior sibling's override, without
        // altering its rules or falsifying equipment stats.
        for(const mode of Object.keys(patch).filter(mode=>BATTLE_MODES.includes(mode))){
            const type=mode.slice(mode.lastIndexOf('_'));
            const families=[['OneHanded','1H_Mage'],['TwoHanded','2H_Mage'],['DualWielding','DW_Mage'],['NitenIchiryu','NI_Mage']];
            const group=families.find(group=>group.includes(mode.slice(0,-type.length)));
            for(const sibling of group||[])if(sibling+type!==mode&&!Object.hasOwn(envelope.config,sibling+type)&&current[sibling+type]?.jpxPlusExecution){
                patch[sibling+type]=jpxConfigClone(current[sibling+type]);delete patch[sibling+type].jpxPlusExecution;
            }
        }
    }
    const result=stats?patch:{...current,...patch};
    const paused=world===jpxConfigWorld()&&!!log;
    if(paused)pauseForJpxConfigApplication();
    try{
        if(original!==null&&localStorage.getItem(key+':configManagerBackup')===null)localStorage.setItem(key+':configManagerBackup',original);
        localStorage.setItem(key,JSON.stringify(result));
        library.setApplied(world,{id:entry.id,revision:entry.revision,scopes:stats?['stats']:Object.keys(patch).filter(key=>key!=='battleVersion'),config:stats?result:patch,
            ...(envelope.kind==='battle-mode'?{mode:envelope.mode}:{})},{activate:true});
        localStorage.setItem(jpxConfigApplyKey,JSON.stringify({world,scopes:stats?['stats']:Object.keys(patch),nonce:Date.now()+':'+Math.random()}));
    }catch(cause){
        if(original===null)localStorage.removeItem(key);else localStorage.setItem(key,original);
        if(originalLibrary===null)localStorage.removeItem(jpxConfigLibraryKey);else localStorage.setItem(jpxConfigLibraryKey,originalLibrary);
        throw cause;
    }
    if(stats){cfgStats=jpxConfigClone(result);onApplied?.(patch,'stats');}
    else if(world===jpxConfigWorld()){Object.assign(cfgBattle,jpxConfigClone(patch));refreshJpxSelectedConfig();onApplied?.(patch,'battle');jpxPanelManager.refreshAppearance?.();}
    return paused;
}

function ensureJpxConfigManagerStyle() {
    if (!document.getElementById('jpx-config-manager-style')) {
        const style = document.createElement('style'); style.id = 'jpx-config-manager-style';
        style.textContent = JPX_CONFIG_MANAGER_CSS; document.head.append(style);
    }
}

function chooseJpxBattleExport(parent, config) {
    if (parent.querySelector('#jpx-battle-export')) return Promise.resolve(null);
    ensureJpxConfigManagerStyle();
    const tr = (key, args) => t('cM.' + key, args), data = jpxConfigClone(config);
    const activeMode = getJpxSelectedBattleMode();
    const detected = activeMode ? '' : log ? battleStyle : getDetectedJpxBattleStyle();
    const mode = activeMode || (detected ? getBattleMode(detected) : '');
    const current = jpxConfigHasRules(data[mode]) ? mode : '';
    const modes = BATTLE_MODES.filter(key => jpxConfigHasContent(data[key]) || key === current);
    let scope = current ? 'current' : 'all', update = () => {};
    const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; };
    const dialog = el('dialog', 'jpx-export-dialog'); dialog.id = 'jpx-battle-export';
    const title = el('h3', '', t('cB.exportBattleConfig')); title.id = getUniqueId('export-title'); dialog.setAttribute('aria-labelledby', title.id);
    const nav = el('div', 'jpx-rule-section-tabs'); nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', title.textContent);
    const summary = el('p', 'jpx-export-summary'), fields = el('div', 'jpx-export-fields');
    const footer = el('div', 'jpx-export-footer');
    const button = (host, text, action) => { const node = jpxUtils.createButton(host, { text, history: false, onClick: action }); node.type = 'button'; return node; };
    const switches = ['current', 'all', 'choose'].map(value => {
        const node = button(nav, tr({ current: 'exportCurrent', all: 'exportAll', choose: 'exportChoose' }[value]), () => { scope = value; update(); });
        node.dataset.exportScope = value; node.disabled = value === 'current' && !current || value === 'choose' && !modes.length;
        if (value === 'current' && !current) node.title = tr('exportUnknown'); return node;
    });
    const style = el('select'), scene = el('select'); style.dataset.exportStyle = ''; scene.dataset.exportScene = '';
    const addOption = (select, value) => { const option = el('option', '', t('cB.' + value)); option.value = value; select.append(option); };
    [...new Set(modes.map(key => key.slice(0, key.lastIndexOf('_'))))].forEach(value => addOption(style, value));
    if (current) style.value = current.slice(0, current.lastIndexOf('_'));
    function updateScenes() {
        const previous = scene.value || current.slice(current.lastIndexOf('_') + 1);
        scene.replaceChildren();
        modes.filter(key => key.slice(0, key.lastIndexOf('_')) === style.value).forEach(key => addOption(scene, key.slice(key.lastIndexOf('_') + 1)));
        if ([...scene.options].some(option => option.value === previous)) scene.value = previous;
        update();
    }
    style.addEventListener('change', updateScenes); scene.addEventListener('change', () => update()); updateScenes();
    for (const [key, input] of [['style', style], ['scenario', scene]]) {
        const label = el('label'); label.append(el('span', '', tr(key)), input); fields.append(label);
    }
    dialog.append(title, nav, summary, fields, footer);
    const focused = document.activeElement;
    return new Promise(resolve => {
        let settled = false;
        const finish = result => {
            if (settled) return; settled = true; parent.removeEventListener('close', parentClosed);
            if (dialog.open) dialog.close(); dialog.remove();
            if (focused?.isConnected) focused.focus({ preventScroll: true }); resolve(result);
        };
        const parentClosed = () => finish(null);
        button(footer, tr('cancel'), () => finish(null));
        const submit = button(footer, tr('export'), () => {
            const key = scope === 'current' ? current : style.value + '_' + scene.value;
            const output = scope === 'all' ? data : { battleVersion: data.battleVersion, [key]: data[key] };
            const suffix = scope === 'all' ? '' : '_' + key;
            finish({ data: output, fileName: `cfgBattle_${jpxConfigWorld()}${suffix}.txt`, depth: 3 });
        });
        submit.className = 'jpx-export-submit';
        update = () => {
            switches.forEach(node => node.setAttribute('aria-pressed', String(node.dataset.exportScope === scope)));
            fields.hidden = scope !== 'choose'; summary.hidden = scope === 'choose';
            summary.textContent = scope === 'current' ? jpxConfigModeLabel(current) :
                t('cB.basicSettings') + ' · ' + tr('groupCount', { count: BATTLE_MODES.filter(key => jpxConfigHasRules(data[key])).length });
            submit.disabled = scope === 'choose' && !modes.includes(style.value + '_' + scene.value);
        };
        dialog.addEventListener('cancel', event => { event.preventDefault(); finish(null); });
        dialog.addEventListener('keydown', event => {
            if (event.key !== 'Tab') return;
            const controls = [...dialog.querySelectorAll('button,select')].filter(node => !node.disabled && node.getClientRects().length);
            if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
            else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
        });
        dialog.addEventListener('close', () => finish(null)); parent.addEventListener('close', parentClosed);
        parent.append(dialog); update(); dialog.showModal(); switches.find(node => node.dataset.exportScope === scope).focus();
    });
}

function renderJpxConfigManager(parent, hooks = {}) {
    ensureJpxConfigManagerStyle();
    const el = (tag, text, className) => {
        const node = document.createElement(tag); if (text !== undefined) node.textContent = text;
        if (className) node.className = className; return node;
    };
    const tr = (key, args) => t('cM.' + key, args);
    const root = el('section', undefined, 'jpx-config-manager'); parent.append(root);
    const sortKey = 'jpx_configListSort_v1';
    let savedSort; try { savedSort = localStorage.getItem(sortKey); } catch {}
    const state = { query: '', world: '', style: '', scenario: '', kind: '', sort: ['type', 'updated', 'name', 'manual'].includes(savedSort) ? savedSort : 'type', filtersOpen: false,
        scroll: 0, editor: null, page: 'mine', storeDispose: null, history: null, disposed: false, dialog: null };
    const library = getJpxConfigLibrary();
    const notice = el('p', '', 'jpx-config-notice'); notice.setAttribute('role', 'status');
    let body, list, toolbar, noticeTimer, listVersion, contextVersion, cachedContext, resultCount, orderedContext, orderedBy, orderedEntries, refreshFilters, cancelListDrag;
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    const clearNotice = () => { clearTimeout(noticeTimer); noticeTimer = null; notice.textContent = ''; };
    const notify = (message, persistent = false) => {
        clearNotice(); if (state.disposed) return;
        notice.textContent = message;
        if (!persistent) noticeTimer = setTimeout(clearNotice, 4000);
    };
    const error = cause => notify(tr(cause?.code && Object.hasOwn(I18N.cM, cause.code) ? cause.code : 'error'), true);
    function button(label, action, cls = '') {
        const node = el('button', label, cls); node.type = 'button';
        node.addEventListener('click', async () => {
            if (node.disabled) return;
            try { await action(node); } catch (cause) { error(cause); }
        }); return node;
    }
    function backButton(action) {
        state.back = action;
        return button(tr('back'), action, 'jpx-config-back');
    }
    function select(values, selected) {
        const node = el('select');
        for (const [value, label] of values) { const option = el('option', label); option.value = value; node.append(option); }
        node.value = selected; return node;
    }
    function field(label, input, wide = false) {
        const node = el('label', undefined, wide ? 'jpx-config-wide' : ''); node.append(el('span', label), input); return node;
    }
    const worlds = [['Persistent', t('cB.Persistent')], ['Isekai', t('cB.Isekai')], ['Any', tr('anyWorld')]];
    const modesOf = envelope => BATTLE_MODES.filter(mode => jpxConfigHasRules(envelope.config[mode]));
    function meta(envelope) {
        const detail = envelope.kind === 'stats' ? tr('stats') : envelope.mode ? jpxConfigModeLabel(envelope.mode) : tr('groupCount', { count: modesOf(envelope).length });
        const execution = envelope.mode && envelope.config[envelope.mode]?.jpxPlusExecution;
        return [envelope.title === detail ? '' : detail, execution?.element && execution.element !== 'auto' ? tr(execution.element) : '', worlds.find(([world]) => world === envelope.world)?.[1]].filter(Boolean).join(' · ');
    }
    const classifications = new WeakMap(), scenarios = ['General', ...BATTLE_TYPES];
    function classify(envelope) {
        if (classifications.has(envelope)) return classifications.get(envelope);
        const modes = envelope.kind === 'battle-mode' ? [envelope.mode] : envelope.config ? modesOf(envelope).filter(mode => jpxConfigHasContent(envelope.config[mode])) : (envelope.modes || []);
        const styles = [...new Set(modes.map(mode => mode.slice(0, mode.lastIndexOf('_'))))];
        const battles = [...new Set(modes.map(mode => mode.slice(mode.lastIndexOf('_') + 1)))];
        const elements = [...new Set(modes.map(mode => envelope.config?.[mode]?.jpxPlusExecution?.element).filter(value => ['fire', 'cold', 'wind', 'elec', 'holy', 'dark'].includes(value)))];
        const result = { modes, styles, battles, elements };
        classifications.set(envelope, result); return result;
    }
    function typeOrder(a, b) {
        const rank = entry => {
            const data = classify(entry.envelope);
            return [entry.envelope.kind === 'stats' ? BATTLE_STYLES.length + 2 : data.styles.length === 1 ? BATTLE_STYLES.indexOf(data.styles[0]) : BATTLE_STYLES.length,
                data.battles.length === 1 ? scenarios.indexOf(data.battles[0]) : scenarios.length,
                worlds.findIndex(([world]) => world === entry.envelope.world)];
        };
        const left = rank(a), right = rank(b);
        return left.reduce((order, value, index) => order || value - right[index], 0);
    }
    function tags(envelope, choose = (key, value) => {
        state[key] = value;
        if (key === 'kind' && value === 'stats') state.style = state.scenario = '';
        refreshFilters();
    }) {
        const data = classify(envelope), group = el('div', undefined, 'jpx-config-tags');
        const add = (label, kind, key, value, title) => {
            const tag = key && choose ? button(label, () => choose(key, value, label)) : el('span', label);
            tag.className = 'jpx-config-tag'; tag.dataset.tagKind = kind;
            if (value) tag.dataset.tagValue = value;
            if (title) tag.title = title;
            group.append(tag);
        };
        if (envelope.kind === 'stats') add(tr('stats'), 'kind', 'kind', 'stats');
        else {
            for (const [values, kind, key, summary] of [[data.styles, 'style', 'style', 'multiStyle'], [data.battles, 'scenario', 'scenario', 'multiBattle']]) {
                if (values.length > 3) add(tr(summary), kind, null, 'mixed', values.map(value => t('cB.' + value)).join(' · '));
                else for (const value of values) add(t('cB.' + value), kind, key, value);
            }
            for (const value of data.elements) add(tr(value), 'element', null, value);
            if (envelope.kind === 'battle') add(data.modes.length ? tr('groupCount', { count: data.modes.length }) : tr('allBattle'), 'kind', null, 'battle');
        }
        add(worlds.find(([world]) => world === envelope.world)?.[1], 'world', envelope.world === 'Any' ? null : 'world', envelope.world);
        return group;
    }
    const matchesApplied = (saved, current) => saved && current && (saved.mode ? [saved.mode] : saved.scopes).every(scope =>
        JSON.stringify(scope === 'stats' ? current : current[scope]) === JSON.stringify(scope === 'stats' ? saved.config : saved.config[scope]));
    function appliedContext() {
        const version = [jpxConfigLibraryKey, prefix + 'cfgBattle', prefix + 'cfgBattle_isekai', prefix + 'cfgStats'].map(key => localStorage.getItem(key));
        if (contextVersion?.every((raw, index) => raw === version[index])) return cachedContext;
        const state = library.readState(), native = {}, saved = {};
        for (const world of ['Persistent', 'Isekai', 'Any']) {
            const key = world === 'Any' ? prefix + 'cfgStats' : prefix + 'cfgBattle' + (world === 'Isekai' ? '_isekai' : '');
            let current;
            try { current = JSON.parse(localStorage.getItem(key) || 'null'); } catch { continue; }
            saved[world] = current;
            current ||= world === jpxConfigWorld() ? cfgBattle : world === 'Any' ? cfgStats : {};
            if (world !== 'Any') {
                const normalized = {};
                mergeCfg(jpxConfigClone(current), defaultCfgBattle, normalized, 'battle');
                // Explicit empty modes deliberately clear a scene and must stay empty.
                for (const mode of BATTLE_MODES) if (current[mode] && !Object.keys(current[mode]).length) normalized[mode] = {};
                current = normalized;
            }
            native[world] = current;
        }
        const active = {};
        for (const world of ['Persistent', 'Isekai', 'Any']) {
            const id = state.active?.[world];
            if (id && matchesApplied(state.applied[world]?.[id], native[world])) active[world] = id;
        }
        contextVersion = version;
        return cachedContext = { state, native, active, saved };
    }
    function currentApplied(entry, context = appliedContext()) {
        const result = [];
        for (const world of ['Persistent', 'Isekai', 'Any']) {
            const saved = context.state.applied[world]?.[entry.id], current = context.native[world];
            if (!saved || !current) continue;
            if (matchesApplied(saved, current)) result.push({ ...saved, world });
        }
        return result;
    }
    function resetPage(page) {
        cancelListDrag?.(); cancelListDrag = null;
        state.storeDispose?.(); state.storeDispose = null;
        root.querySelectorAll('.jpx-config-menu').forEach(node => node.remove());
        state.page = page; state.back = null; clearNotice(); root.replaceChildren();
    }
    async function confirmAction(title, options, content, { validate, focus } = {}) {
        if (state.dialog) return null;
        const focused = document.activeElement, overlay = el('div', undefined, 'jpx-config-overlay');
        const box = el('section', undefined, 'jpx-config-confirm'); box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
        const heading = el('h3', title); heading.id = getUniqueId('config-confirm'); box.setAttribute('aria-labelledby', heading.id); box.append(heading);
        if (content) box.append(content);
        const actions = el('div', undefined, 'jpx-config-actions'); box.append(actions); overlay.append(box);
        const siblings = [...root.children]; siblings.forEach(node => node.inert = true); root.append(overlay);
        return new Promise(resolve => {
            const finish = value => {
                overlay.remove(); state.dialog = null; siblings.forEach(node => node.inert = false);
                if (focused?.isConnected) focused.focus({ preventScroll: true }); resolve(value);
            };
            state.dialog = finish;
            for (const [value, label, primary] of options) actions.append(button(label, () => {
                if (!validate || validate(value)) finish(value);
            }, primary ? 'jpx-config-primary' : ''));
            overlay.addEventListener('keydown', event => {
                if (event.key === 'Escape') { event.stopPropagation(); event.preventDefault(); finish(null); }
                if (event.key === 'Tab') {
                    const controls = [...box.querySelectorAll('button,select,input')].filter(node => !node.disabled);
                    const first = controls[0], last = controls.at(-1);
                    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
                    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
                }
            });
            (focus || actions.querySelector('button'))?.focus();
        });
    }
    function captureList() { if (state.page === 'mine' && body) state.scroll = body.scrollTop; }
    function showMine() {
        resetPage('mine');
        listVersion = null;
        toolbar = el('div', undefined, 'jpx-config-toolbar');
        const nav = el('div', undefined, 'jpx-config-nav'); nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', tr('name'));
        const mine = button(tr('mine'), () => {}); mine.setAttribute('aria-pressed', 'true');
        const store = button(tr('store'), () => { captureList(); showStore(); }); store.setAttribute('aria-pressed', 'false');
        nav.append(mine, store);
        const search = el('input'); search.type = 'search'; search.placeholder = tr('search'); search.setAttribute('aria-label', tr('search')); search.value = state.query;
        search.addEventListener('input', () => { state.query = search.value; refresh(); });
        const queryBar = el('div', undefined, 'jpx-store-querybar');
        const filters = el('div', undefined, 'jpx-store-filter-grid'); filters.id = getUniqueId('config-filters');
        const toggle = button(tr('filters'), () => { state.filtersOpen = !state.filtersOpen; updateFilters(); }, 'jpx-store-filter-toggle');
        toggle.setAttribute('aria-controls', filters.id); queryBar.append(search, toggle);
        const controls = {};
        for (const [key, label, choices] of [
            ['world', 'world', [['', tr('allWorlds')], ...worlds.filter(([value]) => value !== 'Any')]],
            ['style', 'style', [['', tr('allStyles')], ...BATTLE_STYLES.map(value => [value, t('cB.' + value)])]],
            ['scenario', 'scenario', [['', tr('allBattles')], ...['General', ...BATTLE_TYPES].map(value => [value, t('cB.' + value)])]],
            ['kind', 'type', [['', tr('allTypes')], ['battle-mode', tr('singleMode')], ['battle', tr('allBattle')], ['stats', tr('stats')]]]
        ]) {
            const control = select(choices, state[key]); controls[key] = control;
            control.setAttribute('aria-label', tr(label)); control.dataset.configFilter = key;
            control.addEventListener('change', () => {
                state[key] = control.value;
                if (key === 'kind' && state.kind === 'stats') state.style = state.scenario = '';
                refresh();
            });
            filters.append(control);
        }
        const results = el('div', undefined, 'jpx-store-results');
        resultCount = el('span', '', 'jpx-store-result-count'); resultCount.setAttribute('role', 'status');
        const clear = button(tr('clearFilters'), () => {
            state.query = state.world = state.style = state.scenario = state.kind = ''; search.value = ''; refresh();
        }, 'jpx-store-clear');
        const sort = select([['type', tr('typeSort')], ['updated', tr('latest')], ['name', tr('nameSort')], ['manual', tr('manualSort')]], state.sort);
        sort.setAttribute('aria-label', tr('sort')); sort.dataset.configSort = '';
        sort.addEventListener('change', () => {
            state.sort = sort.value; refresh();
            try { localStorage.setItem(sortKey, state.sort); } catch (cause) { error({ code: 'storageError' }); }
        });
        results.append(resultCount, clear, sort);
        const header = el('div', undefined, 'jpx-config-list-header jpx-store-browse-header jpx-store-view-header'); header.append(filters, results);
        function updateFilters() {
            const active = Object.keys(controls).filter(key => state[key]).length;
            toggle.textContent = tr('filters') + (active ? ' (' + active + ')' : '');
            toggle.setAttribute('aria-expanded', String(state.filtersOpen)); filters.dataset.open = String(state.filtersOpen);
            clear.hidden = !active && !state.query;
            for (const [key, control] of Object.entries(controls)) {
                control.value = state[key];
                control.disabled = ['style', 'scenario'].includes(key) && state.kind === 'stats';
            }
        }
        function refresh() { updateFilters(); state.scroll = 0; renderList(); body.scrollTop = 0; }
        refreshFilters = refresh;
        filters.addEventListener('keydown', event => {
            if (event.key === 'Escape' && state.filtersOpen && root.closest('.jpx-settings-mobile')) {
                event.preventDefault(); event.stopPropagation(); state.filtersOpen = false; updateFilters(); toggle.focus();
            }
        });
        const actions = el('div', undefined, 'jpx-config-actions');
        actions.append(button(tr('new'), () => { captureList(); showSettings(); }, 'jpx-config-primary'), button(tr('import'), () => importFile()));
        toolbar.append(nav, queryBar, actions);
        body = el('div', undefined, 'jpx-config-body'); list = el('div', undefined, 'jpx-config-list'); body.append(list);
        root.append(toolbar, header, notice, body); updateFilters(); renderList(); body.scrollTop = state.scroll;
        cancelListDrag = bindStatsListDrag(list, moveEntry, { row: '.jpx-config-row', handle: '.jpx-config-grip', idKey: 'configId', scroller: body, previewClass: 'jpx-config-drag-preview',
            preview: row => [createSettingsIcon('grip'), el('strong', row.querySelector('.jpx-config-title strong').textContent)], afterMove: () => {} });
    }
    function visibleSavedEntry(entry, application = appliedContext()) {
        // Hide only untouched placeholders from older migrations, in every picker.
        if (entry.source?.type === 'native' && entry.revision === 1 && !Object.values(application.state.active || {}).includes(entry.id)) {
            const mode = entry.envelope.mode, saved = application.saved[entry.envelope.world];
            const rules = saved?.[mode] || (mode === '1H_Mage_General' ? saved?.Battlecaster_General : null);
            return !!(jpxConfigHasContent(entry.envelope.config[mode]) && jpxConfigHasContent(rules));
        }
        return true;
    }
    function renderList() {
        cancelListDrag?.();
        const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/[_·/\-]+/g, ' ').replace(/\s+/g, ' ').trim();
        const query = normalize(state.query), words = query.split(' ').filter(Boolean);
        const application = appliedContext();
        const detectedStyle = getDetectedJpxBattleStyle();
        const detectedMode = detectedStyle ? getBattleMode(detectedStyle) : '';
        const version = [application, query, detectedStyle, detectedMode, state.world, state.style, state.scenario, state.kind, state.sort,
            localStorage.getItem(jpxLoadoutKey('Persistent')), localStorage.getItem(jpxLoadoutKey('Isekai'))];
        if (listVersion?.every((value, index) => value === version[index])) { ensureJpxModeDetection(); return; }
        const fragment = document.createDocumentFragment();
        const loadouts = new Map(), entryBindings = new Map();
        for (const binding of application.state.bindings || []) {
            if (!loadouts.has(binding.world)) loadouts.set(binding.world, getJpxLoadoutCatalog(binding.world));
            if (!entryBindings.has(binding.id)) entryBindings.set(binding.id, []);
            entryBindings.get(binding.id).push(binding);
        }
        if (orderedContext !== application || orderedBy !== state.sort) {
            orderedEntries = [...application.state.entries];
            if (state.sort !== 'manual') orderedEntries.sort((a, b) =>
                (state.sort === 'type' ? typeOrder(a, b) : state.sort === 'updated' ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt) : 0) ||
                collator.compare(a.envelope.title, b.envelope.title) || a.id.localeCompare(b.id));
            orderedContext = application; orderedBy = state.sort;
        }
        const entries = orderedEntries.filter(entry => {
            if (!visibleSavedEntry(entry, application)) return false;
            const envelope = entry.envelope, data = classify(envelope);
            return (!state.world || envelope.world === state.world || envelope.world === 'Any') &&
                (!state.kind || envelope.kind === state.kind) &&
                ((!state.style && !state.scenario) || data.modes.some(mode => (!state.style || mode.slice(0, mode.lastIndexOf('_')) === state.style) &&
                    (!state.scenario || mode.slice(mode.lastIndexOf('_') + 1) === state.scenario))) &&
                words.every(word => normalize([envelope.title, meta(envelope), ...data.modes, ...data.styles.map(value => t('cB.' + value)), ...data.battles.map(value => t('cB.' + value)), ...data.elements.map(value => tr(value))].join(' ')).includes(word));
        });
        for (const entry of entries) {
            const row = el('article', undefined, 'jpx-config-row'); row.dataset.configId = entry.id;
            const applied = currentApplied(entry, application), current = applied.some(item => {
                if (item.world !== 'Any' && item.world !== jpxConfigWorld()) return false;
                const selected = application.active[item.world];
                return selected ? selected === entry.id : item.world === 'Any' || !!detectedMode && item.scopes.includes(detectedMode);
            }),
                outdated = applied.some(item => item.revision !== entry.revision);
            row.dataset.active = String(current);
            const info = el('div', undefined, 'jpx-config-info'), title = el('div', undefined, 'jpx-config-title');
            if (state.sort === 'manual') {
                const grip = button(t('cGen.dragRule'), () => {}, 'jpx-config-grip'); grip.replaceChildren(createSettingsIcon('grip'));
                grip.title = t('cGen.dragRule'); grip.setAttribute('aria-label', t('cGen.dragRule') + ': ' + entry.envelope.title);
                grip.addEventListener('keydown', event => {
                    if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
                    event.preventDefault(); event.stopPropagation();
                    const rows = [...list.querySelectorAll('.jpx-config-row')], from = rows.findIndex(row => row.dataset.configId === entry.id);
                    const to = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : from + (event.key === 'ArrowUp' ? -1 : 1);
                    moveEntry(entry.id, Math.max(0, Math.min(rows.length - 1, to)));
                }); title.append(grip);
            }
            title.append(el('strong', entry.envelope.title));
            if (current) title.append(el('span', tr('inUse'), 'jpx-config-status'));
            if (detectedStyle && classify(entry.envelope).styles.includes(detectedStyle) &&
                ['Any', jpxConfigWorld()].includes(entry.envelope.world)) title.append(el('span', tr('currentStyle'), 'jpx-config-detected'));
            info.append(title, tags(entry.envelope));
            const bindings = entryBindings.get(entry.id) || [];
            if (bindings.length) {
                const label = bindings.map(binding => bindingLabel(binding, loadouts.get(binding.world))).join(' / ');
                const bound = button(label, () => showBindings(entry), 'jpx-config-binding');
                bound.title = tr('bind') + ': ' + label; info.append(bound);
            }
            const actions = el('div', undefined, 'jpx-config-actions');
            if (!current || outdated) actions.append(button(tr(outdated ? 'updateApply' : 'apply'), async () => { await applyEntry(entry); }, 'jpx-config-primary'));
            actions.append(button(tr('edit'), () => { captureList(); chooseEditor(entry); }));
            const more = button(tr('more'), () => showMore(more, entry), 'jpx-config-more');
            more.replaceChildren(createSettingsIcon('more')); more.setAttribute('aria-label', tr('more') + ': ' + entry.envelope.title); more.title = tr('more');
            actions.append(more); row.append(info, actions); fragment.append(row);
        }
        resultCount.textContent = tr('resultCount', { count: entries.length });
        if (!entries.length) fragment.append(el('p', tr(query || state.world || state.style || state.scenario || state.kind ? 'noMatches' : 'empty'), 'jpx-config-empty'));
        list.replaceChildren(fragment);
        listVersion = version;
        ensureJpxModeDetection();
    }
    function moveEntry(id, destination) {
        if (state.sort !== 'manual') return;
        const ids = [...list.querySelectorAll('.jpx-config-row')].map(row => row.dataset.configId), from = ids.indexOf(id);
        if (from < 0 || destination < 0 || destination >= ids.length || destination === from) return;
        const reordered = [...ids]; reordered.splice(from, 1); reordered.splice(destination, 0, id);
        try {
            captureList(); library.reorder(reordered, ids); renderList(); body.scrollTop = state.scroll;
            [...list.children].find(row => row.dataset.configId === id)?.querySelector('.jpx-config-grip')?.focus({ preventScroll: true });
        } catch (cause) { error(cause); }
    }
    function showMore(anchor, entry) {
        if (anchor.popoverTargetElement?.isConnected) return;
        root.querySelectorAll('.jpx-config-menu').forEach(node => node.remove());
        const menu = el('div', undefined, 'jpx-config-menu'); menu.setAttribute('popover', 'auto'); menu.setAttribute('role', 'group');
        const add = (label, action, disabled = false) => {
            const item = button(label.startsWith('cGen.') ? t(label) : tr(label), async () => { menu.hidePopover(); await action(); }); item.disabled = disabled; menu.append(item);
        };
        if (state.sort === 'manual') {
            const rows = [...list.querySelectorAll('.jpx-config-row')], index = rows.findIndex(row => row.dataset.configId === entry.id);
            for (const [label, destination] of [['moveTop', 0], ['moveUp', index - 1], ['moveDown', index + 1], ['moveBottom', rows.length - 1]])
                add('cGen.' + label, () => moveEntry(entry.id, destination), destination < 0 || destination >= rows.length || destination === index);
        }
        add('rename', () => renameEntry(entry, anchor));
        if (entry.envelope.kind !== 'stats') add('bind', () => showBindings(entry));
        add('settings', () => { captureList(); showSettings(entry); });
        add('duplicate', () => { const envelope = jpxConfigClone(entry.envelope); envelope.title = (envelope.title + ' · ' + tr('copySuffix')).slice(0,100); library.save(envelope, { source: entry.source }); showMine(); });
        add('export', () => exportEntry(entry));
        if (entry.envelope.kind === 'battle-mode') add('reset', async () => {
            if (await confirmAction(tr('resetConfirm'), [['cancel', tr('cancel')], ['reset', tr('reset'), true]]) !== 'reset') return;
            captureList(); openEditor(entry, entry.envelope.mode);
            state.editor.history.run(tr('reset'), () => {
                const mode = entry.envelope.mode, execution = state.editor.draft.envelope.config[mode].jpxPlusExecution;
                state.editor.draft.envelope.config[mode] = jpxConfigClone(defaultCfgBattle[mode] || { supports: [], attacks: [] });
                if (execution) state.editor.draft.envelope.config[mode].jpxPlusExecution = execution;
                state.editor.redraw();
            });
        });
        add('share', () => { captureList(); showStore(entry.envelope); });
        add('delete', async () => {
            if (await confirmAction(tr('deleteConfirm'), [['cancel', tr('cancel')], ['delete', tr('delete'), true]]) !== 'delete') return;
            if (currentApplied(entry).length) { notify(tr('appliedConfig')); return; }
            for (const world of ['Persistent', 'Isekai', 'Any']) library.clearApplied(world, entry.id);
            library.remove(entry.id); refreshJpxSelectedConfig(); showMine(); notify(tr('deleted'));
        }, currentApplied(entry).length > 0);
        // Keep the opener linked so native light-dismiss and a second click agree.
        menu.style.visibility = 'hidden';
        root.append(menu); anchor.popoverTargetElement = menu;
        menu.addEventListener('toggle', () => {
            if (menu.matches(':popover-open')) {
                positionSettingsPopover(anchor, menu); menu.style.removeProperty('visibility');
                menu.querySelector('button')?.focus({ preventScroll: true });
            } else {
                menu.remove(); if (anchor.popoverTargetElement === menu) anchor.popoverTargetElement = null;
            }
        });
    }
    async function renameEntry(entry, anchor) {
        captureList(); anchor.focus({ preventScroll: true });
        const input = el('input'); input.type = 'text'; input.required = true; input.maxLength = 100;
        input.pattern = '.*\\S.*'; input.value = entry.envelope.title; input.setAttribute('aria-label', tr('title'));
        const content = el('div', undefined, 'jpx-config-rename'); content.append(input);
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.isComposing) {
                event.preventDefault(); input.closest('.jpx-config-confirm').querySelector('.jpx-config-primary').click();
            }
        });
        const answer = confirmAction(tr('rename'), [['cancel', tr('cancel')], ['save', tr('save'), true]], content,
            { validate: value => value !== 'save' || input.reportValidity(), focus: input });
        input.select();
        if (await answer !== 'save' || state.disposed || state.page !== 'mine') return;
        library.rename(entry.id, input.value, entry.revision);
        renderList(); body.scrollTop = state.scroll;
        [...list.children].find(row => row.dataset.configId === entry.id)?.querySelector('.jpx-config-more')?.focus({ preventScroll: true });
        notify(tr('saved'));
    }
    function exportEntry(entry) {
        const blob = new Blob([JSON.stringify(entry.envelope.config, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob), anchor = el('a'); anchor.href = url;
        anchor.download = entry.envelope.title.replace(/[\\/:*?"<>|]/g, '_') + '.json'; anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function showSettings(entry, imported) {
        resetPage('settings');
        const header = el('div', undefined, 'jpx-config-editor-header'); header.append(backButton(showMine), el('strong', tr(entry ? 'settings' : imported ? 'importWorld' : 'new')));
        body = el('div', undefined, 'jpx-config-body');
        const form = el('form', undefined, 'jpx-config-form');
        const envelope = entry ? jpxConfigClone(entry.envelope) : imported;
        const title = el('input'); title.type = 'text'; title.required = true; title.maxLength = 100; title.value = envelope?.title || '';
        const mode = envelope?.mode || getBattleMode('OneHanded'), split = mode.lastIndexOf('_');
        const existing = envelope?.mode ? envelope.config[envelope.mode]?.jpxPlusExecution : null;
        const style = select([['auto', tr('auto')], ...BATTLE_STYLES.map(value => [value, t('cB.' + value)])], existing?.style || (entry ? 'auto' : mode.slice(0,split)));
        const element = select([['auto', tr('auto')], ...['fire','cold','wind','elec','holy','dark'].map(value => [value,tr(value)])], existing?.element || 'auto');
        const world = select(worlds, envelope?.world || jpxConfigWorld());
        const scenario = select(['General', ...BATTLE_TYPES].map(value => [value, t('cB.' + value)]), mode.slice(split + 1));
        const single = !envelope || envelope.kind === 'battle-mode';
        form.append(field(tr('title'), title, true));
        if (single) form.append(field(tr('style'), style), field(tr('element'), element));
        form.append(field(tr('world'), world));
        if (single) form.append(field(tr('scenario'), scenario));
        if (envelope?.kind === 'stats') { world.value = 'Any'; world.disabled = true; }
        // An imported mode keeps its exact key. Changing a saved key is an explicit
        // config-setting action, never an automatic remapping during import.
        if (imported && single) { style.value = 'auto'; style.disabled = true; scenario.disabled = true; element.disabled = true; }
        const actions = el('div', undefined, 'jpx-config-actions jpx-config-wide');
        actions.append(button(tr('cancel'), showMine));
        const submit = el('button', tr(entry || imported ? 'save' : 'create'), 'jpx-config-primary'); submit.type = 'submit'; actions.append(submit); form.append(actions);
        form.addEventListener('submit', event => {
            event.preventDefault(); if (!form.reportValidity()) return;
            try {
                let next = envelope ? jpxConfigClone(envelope) : { schemaVersion:1, kind:'battle-mode', title:'', description:'', world:world.value, scriptVersion:window.JPXPlus.version, config:{battleVersion:defaultCfgBattle.battleVersion} };
                next.title = title.value.trim(); if (!next.title) { title.focus(); return; } next.world = world.value;
                if (single && !imported) {
                    const selectedStyle = style.value === 'auto' ? mode.slice(0,split) : style.value;
                    const nextMode = selectedStyle + '_' + scenario.value;
                    const rules = next.mode ? next.config[next.mode] : jpxConfigClone(defaultCfgBattle[nextMode] || defaultCfgBattle[selectedStyle + '_General'] || { supports:[],attacks:[] });
                    if (next.mode && next.mode !== nextMode) delete next.config[next.mode];
                    if (style.value !== 'auto' || element.value !== 'auto') rules.jpxPlusExecution = { style:style.value, element:element.value };
                    else delete rules.jpxPlusExecution;
                    next.mode = nextMode; next.config[nextMode] = rules;
                }
                const saved = library.save(next, entry ? { id:entry.id, source:entry.source } : {});
                if (!entry && !imported) chooseEditor(saved); else { showMine(); notify(tr(imported ? 'imported' : 'saved')); }
            } catch (cause) { error(cause); }
        });
        body.append(form); root.append(header,notice,body); title.focus();
    }
    function importFile() {
        const input = el('input'); input.type = 'file'; input.accept = '.txt,.json';
        input.addEventListener('change', async () => {
            const file = input.files[0]; if (!file) return;
            try {
                if (file.size > 2 * 1024 * 1024) throw Object.assign(new Error(), { code:'tooLarge' });
                const value = JSON.parse(await file.text(), (key,value) => { if (['__proto__','prototype','constructor'].includes(key)) throw new Error('Invalid key'); return value; });
                let envelope;
                if (value?.schemaVersion === 1 && value.config) envelope = value;
                else {
                    const config = value, modes = BATTLE_MODES.filter(mode => Object.hasOwn(config,mode));
                    if (config.Battlecaster_General && !modes.includes('1H_Mage_General')) modes.push('Battlecaster_General');
                    const stats = !!config.statsVersion;
                    const mode = modes.length === 1 && Object.keys(config).every(key => ['battleVersion','version',modes[0]].includes(key)) ? modes[0] : null;
                    envelope = { schemaVersion:1, kind:stats?'stats':mode?'battle-mode':'battle', title:file.name.replace(/\.(json|txt)$/i,'').slice(0,100), description:'', world:stats?'Any':jpxConfigWorld(), scriptVersion:window.JPXPlus.version, ...(mode?{mode}:{}), config };
                }
                // Validate in a detached temporary store so the naming form never
                // writes a malformed archive to the real library.
                const temporary = new Map();
                const validator = createJpxConfigLibrary({ storage:{getItem:key=>temporary.get(key)||null,setItem:(key,value)=>temporary.set(key,value)}, key:'check', modes:BATTLE_MODES,battleVersion:defaultCfgBattle.battleVersion,statsVersion:defaultCfgStats.statsVersion });
                envelope = validator.save(envelope).envelope;
                captureList(); showSettings(null,envelope);
            } catch(cause) { error(cause.code?cause:Object.assign(cause,{code:'invalidConfig'})); }
        }); input.click();
    }
    function bindingLabel(binding, catalog = getJpxLoadoutCatalog(binding.world)) {
        const persona = catalog.personas.find(item => item.id === binding.personaId);
        const set = persona?.sets.find(item => item.id === binding.setId);
        return [t('cB.' + binding.world), persona?.name || tr('personaNumber', { id: binding.personaId }),
            set?.name || tr('setNumber', { id: binding.setId })].join(' · ');
    }
    async function showBindings(entry) {
        if (library.get(entry.id)?.revision !== entry.revision) throw Object.assign(new Error(), { code: 'libraryChanged' });
        initJpxLoadoutBindings();
        if (state.disposed || !root.isConnected) return;
        const content = el('div', undefined, 'jpx-config-bindings'), assignments = el('div', undefined, 'jpx-config-binding-list');
        const world = select(worlds.slice(0, 2), entry.envelope.world === 'Any' ? jpxConfigWorld() : entry.envelope.world);
        const persona = select([], ''), set = select([], ''), hint = el('p', undefined, 'jpx-config-binding-hint');
        const form = el('div', undefined, 'jpx-config-binding-fields');
        world.dataset.bindingWorld = ''; persona.dataset.bindingPersona = ''; set.dataset.bindingSet = '';
        form.append(field(tr('world'), world), field(tr('persona'), persona), field(tr('equipSet'), set));
        const fill = (select, values, value) => {
            select.replaceChildren();
            for (const [id, name] of values) { const option = el('option', name); option.value = id; select.append(option); }
            if (values.some(([id]) => id === value)) select.value = value;
            select.disabled = !values.length;
        };
        function updateSets() {
            const catalog = getJpxLoadoutCatalog(world.value), known = catalog.personas.find(item => item.id === persona.value);
            const ids = [...new Set(known?.sets.length ? known.sets.map(item => item.id) : catalog.sets)].sort((a, b) => Number(a) - Number(b));
            fill(set, ids.map(id => [id, known?.sets.find(item => item.id === id)?.name || tr('setNumber', { id })]),
                catalog.current?.personaId === persona.value ? catalog.current.setId : known?.lastSetId || set.value);
            hint.hidden = !!persona.value && !!set.value;
            hint.textContent = tr(log || document.querySelector('#riddlemaster') ? 'bindingUnavailable' : 'bindingUnknown');
            const submit = root.querySelector('.jpx-config-confirm .jpx-config-primary');
            if (submit) submit.disabled = !persona.value || !set.value;
        }
        function updatePersonas() {
            const catalog = getJpxLoadoutCatalog(world.value);
            fill(persona, catalog.personas.map(item => [item.id, item.name || tr('personaNumber', { id: item.id })]), catalog.current?.personaId || persona.value);
            updateSets();
        }
        function drawAssignments() {
            assignments.replaceChildren();
            for (const binding of library.readState().bindings?.filter(item => item.id === entry.id) || []) {
                const row = el('div', undefined, 'jpx-config-binding-item');
                row.append(el('span', bindingLabel(binding)), button(tr('unbind'), () => {
                    library.removeBinding(binding, entry.id); drawAssignments();
                    (assignments.querySelector('button') || (persona.disabled ? world : persona)).focus({ preventScroll: true });
                    window.dispatchEvent(new Event('jpx:config-library'));
                })); assignments.append(row);
            }
        }
        world.addEventListener('change', updatePersonas); persona.addEventListener('change', updateSets);
        updatePersonas(); drawAssignments(); content.append(assignments, form, hint);
        if (entry.envelope.kind === 'battle') content.append(el('p', tr('applyAll')));
        if (jpxConfigContainsCode(entry.envelope)) content.append(el('p', tr('customCode')));
        const choicePromise = confirmAction(tr('bind'), [['close', tr('close')], ['bind', tr('bind'), true]], content,
            { focus: persona.disabled ? world : persona, validate: value => value !== 'bind' || !!persona.value && !!set.value });
        updateSets();
        if (!jpxLoadoutConfirmed) {
            ensureJpxModeDetection(true).then(() => { if (content.isConnected) updatePersonas(); });
        }
        const choice = await choicePromise;
        if (choice !== 'bind') return;
        const context = { world: world.value, personaId: persona.value, setId: set.value };
        const previous = library.readState().bindings?.find(item => jpxLoadoutSame(item, context));
        if (previous && previous.id !== entry.id) {
            const previousName = library.get(previous.id)?.envelope.title || '';
            if (await confirmAction(tr('replaceBinding', { name: previousName }), [['cancel', tr('cancel')], ['bind', tr('bind'), true]]) !== 'bind') return;
        }
        library.setBinding(context, entry.id, entry.revision, previous?.id || null);
        if (jpxLoadoutSame(jpxLoadoutConfirmed, context)) applyJpxLoadoutBinding(context, true);
        window.dispatchEvent(new Event('jpx:config-library')); notify(tr('bound'));
    }
    async function applyEntry(entry) {
        if (library.get(entry.id)?.revision !== entry.revision) { notify(tr('libraryChanged'), true); return; }
        const envelope = entry.envelope, stats = envelope.kind === 'stats';
        if (envelope.kind === 'battle-mode' && !jpxConfigHasRules(envelope.config[envelope.mode])) throw Object.assign(new Error(), { code: 'invalidConfig' });
        let world = stats ? 'Any' : envelope.world === 'Any' ? jpxConfigWorld() : envelope.world;
        const content = el('div');
        if (envelope.kind === 'battle') content.append(el('p', tr('applyAll')));
        if (!stats) {
            const target = select(worlds.slice(0,2),world); content.append(field(tr('applyWorld'),target));
            target.addEventListener('change',()=>{world=target.value;});
        }
        const custom = jpxConfigContainsCode(envelope);
        if(custom) content.append(el('p',tr('customCode')));
        if (envelope.kind==='battle'||envelope.world==='Any'||world!==jpxConfigWorld()||custom) {
            if(await confirmAction(tr('applyScope'),[['cancel',tr('cancel')],['apply',tr('apply'),true]],content)!=='apply')return;
        }
        if (library.get(entry.id)?.revision !== entry.revision) { notify(tr('libraryChanged'), true); return; }
        const paused = commitJpxConfigEntry(entry, world, hooks.onApplied);
        captureList();showMine();notify(tr(paused?'applyPaused':'applied'));
    }
    function chooseEditor(entry) {
        const modes=modesOf(entry.envelope);
        if(entry.envelope.kind==='stats'){openStatsEditor(entry);return;}
        if(modes.length===1){openEditor(entry,modes[0]);return;}
        resetPage('groups');const header=el('div',undefined,'jpx-config-editor-header');header.append(backButton(showMine),el('strong',entry.envelope.title));
        body=el('div',undefined,'jpx-config-body');
        for(const mode of modes)body.append(button(jpxConfigModeLabel(mode),()=>openEditor(entry,mode),'jpx-config-group'));
        root.append(header,notice,body);
    }
    function openStatsEditor(entry){
        // A detached schema editor uses the same fields without touching live cfgStats.
        openEditor(entry,null);
    }
    function openEditor(entry,mode){
        resetPage('editor');
        const draft=jpxConfigClone(entry),editor=el('div',undefined,'jpx-config-editor');
        const header=el('div',undefined,'jpx-config-editor-header');
        const back=backButton(()=>leave(showMine));header.append(back,el('strong',entry.envelope.title));
        const content=el('div',undefined,'jpx-config-editor-content'), footer=el('div',undefined,'jpx-config-editor-footer');
        const undoButton=button(tr('undo'),()=>history.undo()),redoButton=button(tr('redo'),()=>history.redo());
        const saveButton=button(tr('save'),()=>saveEditor(),'jpx-config-primary');
        footer.append(undoButton,redoButton,saveButton);editor.append(header,content,footer);root.append(notice,editor);
        const previousHistory=settingsEditHistory;
        state.editor={draft,mode,baseline:'',previousHistory,revision:entry.revision,history:null};
        const draw=()=>{
            content.replaceChildren();
            if(mode){const section=el('div');content.append(section);renderBattleRuleSections(section,cfgBattleSchema.properties.find(field=>field.key==='modes').itemSchema,draft.envelope.config[mode],mode);}
            else{content.classList.add('jpx-config-stats-editor');content.style.overflow='auto';renderSchema(content,cfgStatsSchema,draft.envelope.config);}
        };
        state.editor.redraw=draw;
        draw();state.editor.baseline=JSON.stringify(draft.envelope);
        const capture=()=>{
            const expanded=[];
            const visit=(value,path)=>{
                if(!value||typeof value!=='object')return;
                if(fieldRenderers.expandedRuleItems.has(value))expanded.push(path);
                Object.entries(value).forEach(([key,child])=>visit(child,[...path,key]));
            };
            visit(draft.envelope.config,[]);
            for(const panel of content.querySelectorAll('.jpx-rule-section:not([hidden])'))
                battleRulesView.scroll[mode+':'+panel.dataset.fieldKey]=panel.querySelector('.jpx-rule-scroll').scrollTop;
            return {value:JSON.stringify(draft.envelope),view:jpxConfigClone(battleRulesView),expanded,
                scroll:[...content.querySelectorAll('.jpx-rule-scroll')].map(node=>node.scrollTop)};
        };
        const entries=[];let position=0,restoring=false,pending=null,typing=null,typedAt=0;
        const update=()=>{undoButton.disabled=position===0;redoButton.disabled=position===entries.length;saveButton.disabled=!dirty();};
        const finish=(before,key)=>{
            if(restoring||!before)return;const after=capture();if(before.value===after.value)return;
            if(key&&typing===key&&position===entries.length&&Date.now()-typedAt<700)entries.at(-1).after=after;
            else{entries.splice(position);entries.push({before,after});if(entries.length>60)entries.shift();position=entries.length;}
            typing=key;typedAt=Date.now();update();
        };
        const restore=snapshot=>{
            restoring=true;draft.envelope=JSON.parse(snapshot.value);battleRulesView=jpxConfigClone(snapshot.view);
            fieldRenderers.expandedRuleItems=new WeakSet();
            for(const path of snapshot.expanded){const value=path.reduce((item,key)=>item?.[key],draft.envelope.config);if(value&&typeof value==='object')fieldRenderers.expandedRuleItems.add(value);}
            try{draw();[...content.querySelectorAll('.jpx-rule-scroll')].forEach((node,index)=>node.scrollTop=snapshot.scroll[index]||0);}finally{restoring=false;typing=null;update();}
        };
        const beforeInput=event=>{if(event.target.matches('input,select,textarea'))pending=capture();};
        const afterInput=event=>{finish(pending,event.type==='input'?event.target:null);pending=null;};
        for(const type of ['input','change']){editor.addEventListener(type,beforeInput,true);editor.addEventListener(type,afterInput);}
        const history={
            run(label,action){const before=capture();try{return action();}finally{finish(before,null);}},
            undo(){if(position>0)restore(entries[--position].before);},redo(){if(position<entries.length)restore(entries[position++].after);},
            flushColorEdit(){},breakTypingGroup(){typing=null;},
            dispose(){for(const type of ['input','change']){editor.removeEventListener(type,beforeInput,true);editor.removeEventListener(type,afterInput);}}
        };
        editor.addEventListener('keydown',event=>{
            if(!(event.ctrlKey||event.metaKey)||event.altKey||event.isComposing||jpxUtils.keyCaptureController||event.target.closest('input,textarea,[contenteditable=true]'))return;
            if(!['z','y'].includes(event.key.toLowerCase()))return;event.preventDefault();event.stopPropagation();
            if(event.key.toLowerCase()==='y'||event.shiftKey)history.redo();else history.undo();
        });
        state.editor.history=history;settingsEditHistory=history;update();
        (root.closest('.jpx-settings-mobile') ? document.getElementById('close-button') : back).focus({preventScroll:true});
    }
    const dirty=()=>!!state.editor&&JSON.stringify(state.editor.draft.envelope)!==state.editor.baseline;
    function disposeEditor(){
        if(!state.editor)return;fieldRenderers.dragState.cancel?.();jpxUtils.keyCaptureController?.abort();
        state.editor.history.dispose();settingsEditHistory=state.editor.previousHistory;state.editor=null;
    }
    function saveEditor(){
        const edit=state.editor;if(!edit)return true;
        const current=library.get(edit.draft.id);
        if(!current||current.revision!==edit.revision){notify(tr('libraryChanged'));return false;}
        try{library.save(edit.draft.envelope,{id:edit.draft.id,source:edit.draft.source});disposeEditor();showMine();notify(tr('saved'));return true;}
        catch(cause){error(cause);return false;}
    }
    async function leave(next){
        if(state.dialog)return;
        if(dirty()){
            const choice=await confirmAction(tr('saveChanges'),[['keep',tr('keepEditing')],['discard',tr('discard')],['save',tr('save'),true]]);
            if(!choice||choice==='keep')return;
            if(choice==='save'&&!saveEditor())return;
        }
        disposeEditor();if(state.page==='editor')showMine();next();
    }
    function showStore(share){
        resetPage('store');
        const top=el('div',undefined,'jpx-config-toolbar jpx-config-store-header'),nav=el('div',undefined,'jpx-config-nav');
        const mine=button(tr('mine'),showMine),store=button(tr('store'),()=>showStore());
        mine.setAttribute('aria-pressed','false');store.setAttribute('aria-pressed','true');nav.append(mine,store);top.append(nav);root.append(top,notice);
        const mount=el('div');mount.style.cssText='display:flex;flex:1;min-height:0;min-width:0;overflow:hidden';root.append(mount);
        jpxEmbeddedStore ||= createJpxIntegratedStore(window,t);
        state.storeDispose=jpxEmbeddedStore.render(mount,{
            notify,
            renderTags:(envelope,choose)=>tags(envelope,choose||null),
            compareTypes:(a,b)=>typeOrder({envelope:a},{envelope:b}),
            confirm:(title,description,action)=>confirmAction(title,[['cancel',tr('cancel')],['confirm',action,true]],el('p',description)).then(value=>value==='confirm'),
            listShareConfigs(){
                const application=appliedContext();
                return application.state.entries.filter(entry=>visibleSavedEntry(entry,application))
                    .sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)||collator.compare(a.envelope.title,b.envelope.title));
            },
            getShareConfig:id=>library.get(id),
            async saveConfig(envelope,origin){
                const source=origin?.source,previous=source&&library.list().find(entry=>entry.source?.repository===source.repository&&entry.source?.id===source.id);
                let id;
                if(previous){const choice=await confirmAction(tr('sourceExists'),[['cancel',tr('cancel')],['copy',tr('keepCopy')],['update',tr('updateCopy'),true]]);if(!choice||choice==='cancel')return false;if(choice==='update'){
                    if(library.get(previous.id)?.revision!==previous.revision){notify(tr('libraryChanged'));return false;}
                    id=previous.id;
                }}
                library.save(envelope,{...(id?{id}:{}),...(source?{source}:{})});notify(tr('savedFromStore'));return true;
            }
        },{...(share?{share:jpxConfigClone(share)}:{}),onBack:showMine,toolbarHost:top});
    }
    const beforeUnload=event=>{if(dirty()){event.preventDefault();event.returnValue='';}};
    const changed=()=>{if(state.page==='mine'){try{const scroll=body.scrollTop;renderList();body.scrollTop=scroll;}catch(cause){error(cause);}}};
    const onStorage=event=>{if(event.key===jpxConfigLibraryKey)changed();};
    const migrationError=()=>notify(tr('storageError'));
    window.addEventListener('beforeunload',beforeUnload);window.addEventListener('storage',onStorage);
    window.addEventListener('jpx:config-library',changed);window.addEventListener('jpx:legacy-config-error',migrationError);
    window.addEventListener('jpx:mode-detected',changed);
    window.addEventListener('jpx:loadout-detected',changed);
    const controller={
        isEditing:()=>!!state.editor,leave,
        back(){
            if(state.dialog)return true;
            if(state.page==='store')return state.storeDispose?.back?.()||false;
            if(!state.back)return false;
            Promise.resolve().then(state.back).catch(error);return true;
        },
        onHidden(){cancelListDrag?.();clearNotice();state.dialog?.(null);state.storeDispose?.suspend?.();},
        onShown(){state.storeDispose?.resume?.();changed();},
        dispose(){if(state.disposed)return;state.disposed=true;cancelListDrag?.();clearNotice();state.dialog?.(null);disposeEditor();state.storeDispose?.();window.removeEventListener('beforeunload',beforeUnload);window.removeEventListener('storage',onStorage);window.removeEventListener('jpx:config-library',changed);window.removeEventListener('jpx:mode-detected',changed);window.removeEventListener('jpx:loadout-detected',changed);window.removeEventListener('jpx:legacy-config-error',migrationError);if(jpxConfigManagerView===controller)jpxConfigManagerView=null;}
    };
    jpxConfigManagerView=controller;
    try{seedJpxConfigLibrary();showMine();window.dispatchEvent(new Event('jpx:legacy-config-request'));}
    catch(cause){root.append(notice);error(cause);}
    return controller;
}

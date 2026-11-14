// Persona/set observations stay outside native rules and exported configs.
const jpxLoadoutSlot = value => /^[1-9]\d{0,5}$/.test(String(value || '')) ? String(value) : '';
const jpxLoadoutKey = (world = jpxConfigWorld()) => prefix + 'loadouts_v1' + (world === 'Isekai' ? '_isekai' : '');
const jpxLoadoutSame = (a, b) => !!a && !!b && a.world === b.world && a.personaId === b.personaId && a.setId === b.setId;
let jpxLoadoutConfirmed = null, jpxLoadoutPending = false, jpxLoadoutBusy = false, jpxLoadoutInitialized = false;
const jpxLoadoutSyncKey = prefix + 'loadoutSync_v1' + isekaiSuffix;
let jpxLoadoutSyncRequired = sessionStorage.getItem(jpxLoadoutSyncKey) === '1', jpxLoadoutSyncExpected = null;

function setJpxLoadoutSync(required, expected = null) {
    jpxLoadoutSyncRequired = required; jpxLoadoutSyncExpected = expected;
    if (required) sessionStorage.setItem(jpxLoadoutSyncKey, '1');
    else sessionStorage.removeItem(jpxLoadoutSyncKey);
    renderJpxLoadoutSync();
}

function renderJpxLoadoutSync() {
    let notice = document.getElementById('jpx-loadout-sync');
    if (!jpxLoadoutSyncRequired) { notice?.remove(); return; }
    if (!notice) {
        notice = document.createElement('div'); notice.id = 'jpx-loadout-sync'; notice.setAttribute('role', 'status');
        notice.style.cssText = jpxThemeCSS('padding:8px 12px;margin:6px;border:1px solid #c8b49b;background:#f9f6ec;color:#5c0d11;font:13px/1.5 Arial,sans-serif;');
        (document.getElementById('csp') || document.body).prepend(notice);
    }
    const text = t('cM.' + (log || document.querySelector('#textlog, #battle_main') ? 'loadoutSyncBattle' : 'loadoutSyncing'));
    if (notice.textContent !== text) notice.textContent = text;
}

function guardJpxLoadoutSync() {
    if (!jpxLoadoutSyncRequired) return false;
    const message = '\n' + t('cM.loadoutSyncBattle'), changed = isActiveBattle || readyNext !== message;
    isActiveBattle = false; readyNext = message; cancelBattleDecision();
    if (changed) {
        jpxPanelManager.updateContent('battle'); jpxPanelManager.setBackground('#ff5'); jpxPanelManager.dispatchState();
    }
    renderJpxLoadoutSync();
    return true;
}

function matchesJpxLoadoutSync(context) {
    const expected = jpxLoadoutSyncExpected;
    return !expected || context.world === expected.world && context.personaId === expected.personaId &&
        (!expected.setId || context.setId === expected.setId);
}

function readJpxLoadoutCatalog(world = jpxConfigWorld()) {
    let saved;
    try {
        const raw = localStorage.getItem(jpxLoadoutKey(world));
        if (raw?.length < 100000) saved = JSON.parse(raw);
    } catch { /* Missing observations can be recovered from the game. */ }
    const catalog = { version: 1, personas: [], sets: [] };
    if (saved?.version !== 1) return catalog;
    if (Array.isArray(saved.sets)) catalog.sets = [...new Set(saved.sets.map(jpxLoadoutSlot).filter(Boolean))].slice(0, 100);
    if (Array.isArray(saved.personas)) for (const item of saved.personas.slice(0, 100)) {
        if (!jpxLoadoutSlot(item?.id) || catalog.personas.some(persona => persona.id === String(item.id))) continue;
        const persona = { id: String(item.id), name: String(item.name || '').slice(0, 100), sets: [] };
        if (Array.isArray(item.sets)) for (const set of item.sets.slice(0, 100)) {
            if (jpxLoadoutSlot(set?.id)) persona.sets.push({ id: String(set.id), name: String(set.name || '').slice(0, 100) });
        }
        if (persona.sets.some(set => set.id === jpxLoadoutSlot(item.lastSetId))) persona.lastSetId = String(item.lastSetId);
        catalog.personas.push(persona);
    }
    if (saved.current?.world === world && jpxLoadoutSlot(saved.current.personaId) && jpxLoadoutSlot(saved.current.setId))
        catalog.current = { world, personaId: String(saved.current.personaId), setId: String(saved.current.setId) };
    return catalog;
}

function readJpxHvutLoadout(world = jpxConfigWorld()) {
    try {
        const raw = localStorage.getItem((world === 'Isekai' ? 'hvuti' : 'hvut') + '_persona');
        if (!raw || raw.length > 100000) return null;
        const data = JSON.parse(raw), personas = [];
        if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
        for (const [id, item] of Object.entries(data)) {
            if (!jpxLoadoutSlot(id) || !item || typeof item !== 'object') continue;
            const sets = Object.entries(item).filter(([id]) => jpxLoadoutSlot(id))
                .slice(0, 100).map(([id, set]) => ({ id, name: typeof set?.name === 'string' ? set.name.slice(0, 100) : '' }));
            personas.push({ id, name: typeof item.name === 'string' ? item.name.slice(0, 100) : '', sets });
            if (personas.length >= 100) break;
        }
        const personaId = jpxLoadoutSlot(data.pset), setId = jpxLoadoutSlot(data.eset);
        return { personas, sets: [...new Set(personas.flatMap(item => item.sets.map(set => set.id)))],
            current: personaId && setId ? { world, personaId, setId } : null };
    } catch { return null; }
}

function getJpxLoadoutCatalog(world = jpxConfigWorld()) {
    const catalog = readJpxLoadoutCatalog(world), hvut = readJpxHvutLoadout(world);
    // HVUT's cache supplies names/options, never proof of a completed switch.
    for (const item of hvut?.personas || []) {
        const previous = catalog.personas.find(persona => persona.id === item.id);
        if (!previous) catalog.personas.push(item);
        else {
            if (item.name) previous.name = item.name;
            for (const set of item.sets) {
                const known = previous.sets.find(value => value.id === set.id);
                if (!known) previous.sets.push(set); else if (set.name) known.name = set.name;
            }
        }
    }
    catalog.sets = [...new Set([...catalog.sets, ...(hvut?.sets || [])])].sort((a, b) => Number(a) - Number(b));
    return catalog;
}

function jpxConfigContainsCode(envelope) {
    return BATTLE_MODES.some(mode => Object.entries(envelope.config[mode] || {}).some(([key, rules]) =>
        (key === 'rules' || key === 'supports' || key === 'attacks' || key.startsWith('kb_')) &&
        Array.isArray(rules) && rules.some(rule => rule.type === 'kamisamaniNattaHi')));
}

function applyJpxLoadoutBinding(context, force = false, notify = true) {
    if (!context || context.world !== jpxConfigWorld() || jpxLoadoutPending || jpxLoadoutBusy ||
        log || document.querySelector('#textlog, #battle_main, #riddlemaster')) return false;
    const library = getJpxConfigLibrary(), state = library.readState();
    const binding = state.bindings?.find(item => jpxLoadoutSame(item, context));
    if (!binding) return false;
    const entry = state.entries.find(item => item.id === binding.id);
    // A later imported update cannot acquire permission to run custom code.
    if (!entry || jpxConfigContainsCode(entry.envelope) && binding.trustedRevision !== entry.revision) return false;
    const applied = state.applied[context.world]?.[entry.id];
    if (!force && state.active?.[context.world] === entry.id && applied?.revision === entry.revision &&
        applied.scopes.every(scope => JSON.stringify(cfgBattle[scope]) === JSON.stringify(applied.config[scope]))) return false;
    commitJpxConfigEntry(entry, context.world);
    if (notify) window.dispatchEvent(new Event('jpx:config-library'));
    return true;
}

function confirmJpxLoadout(current, catalog, livePage = false) {
    if (jpxLoadoutBusy || log || document.querySelector('#textlog, #battle_main, #riddlemaster') || current.world !== jpxConfigWorld()) return;
    const previous = readJpxLoadoutCatalog().current;
    const pending = jpxLoadoutPending;
    let applied = false;
    jpxLoadoutPending = false;
    try {
        if (!jpxLoadoutSame(previous, current)) applied = applyJpxLoadoutBinding(current, false, false);
    } catch (error) { jpxLoadoutPending = pending; throw error; }
    const persona = catalog.personas.find(item => item.id === current.personaId);
    if (!livePage && !jpxLoadoutSame(previous, current)) {
        localStorage.removeItem(jpxDetectedFamilyKey());
        jpxDetectionSourceIgnored = true;
    }
    if (!jpxLoadoutSame(previous, current) && (!livePage || previous && !getJpxSpellDamageFromPage())) {
        const key = prefix + 'spellDamageBonus' + isekaiSuffix;
        localStorage.removeItem(key); localStorage.removeItem(key + ':context');
        spellDamageBonus = { maxType: '', maxValue: 0 };
    }
    localStorage.setItem(prefix + 'personaId' + isekaiSuffix, current.personaId);
    if (persona?.name) localStorage.setItem(prefix + 'persona' + isekaiSuffix, persona.name);
    catalog.current = current;
    if (persona?.sets.some(set => set.id === current.setId)) persona.lastSetId = current.setId;
    const raw = JSON.stringify(catalog), key = jpxLoadoutKey();
    const changed = localStorage.getItem(key) !== raw || !jpxLoadoutSame(jpxLoadoutConfirmed, current);
    if (localStorage.getItem(key) !== raw) localStorage.setItem(key, raw);
    jpxLoadoutConfirmed = current;
    // Publish only after both configuration and persona/set state are ready.
    if (applied) window.dispatchEvent(new Event('jpx:config-library'));
    if (changed) window.dispatchEvent(new Event('jpx:loadout-detected'));
}

function rememberJpxLoadout(character = document, equipment = document) {
    if ((jpxLoadoutPending || jpxDetectionSourceIgnored) && character === document) return;
    const equipmentPersona = equipment.querySelector('#persona_form select');
    const selector = equipmentPersona || character.querySelector('#persona_form select');
    const personaId = jpxLoadoutSlot(selector?.value);
    const characterPersona = character.querySelector('#persona_form select');
    if (!personaId || characterPersona && characterPersona.value !== personaId) return;
    const active = equipment.querySelector('#eqsl img[src*="_on.png"]');
    const setId = jpxLoadoutSlot(active?.getAttribute('src')?.match(/(?:^|\/)set(\d+)_on\.png(?:[?#]|$)/)?.[1]);
    const catalog = getJpxLoadoutCatalog();
    for (const option of selector.options) {
        const id = jpxLoadoutSlot(option.value);
        if (!id) continue;
        const item = catalog.personas.find(persona => persona.id === id);
        if (item) item.name = option.textContent.trim().slice(0, 100);
        else catalog.personas.push({ id, name: option.textContent.trim().slice(0, 100), sets: [] });
    }
    const sets = [...equipment.querySelectorAll('#eqsl img')].map(node =>
        jpxLoadoutSlot(node.getAttribute('src')?.match(/(?:^|\/)set(\d+)_(?:on|off)\.png(?:[?#]|$)/)?.[1])).filter(Boolean);
    if (sets.length) catalog.sets = [...new Set(sets)];
    if (!setId || !catalog.sets.includes(setId)) return;
    const persona = catalog.personas.find(item => item.id === personaId);
    if (!persona) return;
    // Keep the actual observed slots per persona as well as the legacy catalog.
    // No fixed persona/set count, and no borrowed selection from another world.
    persona.sets = sets.map(id => persona.sets.find(item => item.id === id) || { id, name: '' });
    confirmJpxLoadout({ world: jpxConfigWorld(), personaId, setId }, catalog, character === document && equipment === document);
}

function initJpxLoadoutBindings() {
    if (jpxLoadoutInitialized) return;
    jpxLoadoutInitialized = true;
    const unavailable = () => !!log || !!document.querySelector('#textlog, #battle_main, #riddlemaster');
    if (unavailable()) { renderJpxLoadoutSync(); return; }
    const invalidate = () => {
        jpxLoadoutPending = true; jpxLoadoutConfirmed = null;
        jpxDetectionGeneration++; jpxDetectionRetryAt = 0;
        jpxDetectionSourceIgnored = true;
        localStorage.removeItem(jpxDetectedFamilyKey());
        const key = prefix + 'spellDamageBonus' + isekaiSuffix;
        localStorage.removeItem(key); localStorage.removeItem(key + ':context');
        spellDamageBonus = { maxType: '', maxValue: 0 };
    };
    let refreshTimer;
    const refresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
            if (jpxLoadoutPending && !jpxLoadoutBusy && !unavailable() && document.visibilityState !== 'hidden') ensureJpxModeDetection(true);
        }, 80);
    };
    const personaSelectors = node => [...(node.closest?.('#hvut-top .hvut-top-sub')?.querySelectorAll('select') || [])];
    const isPersonaSelect = node => node.matches?.('select') && personaSelectors(node).length === 2;
    document.addEventListener('change', event => {
        const select = event.target, menu = select.closest?.('#hvut-top .hvut-top-sub');
        const selectors = menu ? personaSelectors(select) : [];
        if (selectors.length === 2 && selectors.includes(select)) {
            watchHvut(select.closest('#hvut-top'));
            const personaId = jpxLoadoutSlot(selectors[0].value), setId = select === selectors[1] ? jpxLoadoutSlot(selectors[1].value) : '';
            beginHvut(personaId ? { world: jpxConfigWorld(), personaId, setId } : null);
            return;
        }
        if (event.target.closest?.('#persona_form, [name=equip_set]')) invalidate();
    }, true);
    document.addEventListener('submit', event => {
        if (isJpxLoadoutSubmission(event.target, event.submitter)) invalidate();
    }, true);
    document.addEventListener('click', event => { if (event.target.closest?.('#eqsl')) invalidate(); }, true);
    // Native navigation is handled on the next page. AJAX replacements need a
    // fresh server snapshot, not the dropdown's provisional selection.
    const nativeObserver = new MutationObserver(records => {
        if (unavailable()) { nativeObserver.disconnect(); return; }
        if (!jpxLoadoutPending || jpxLoadoutBusy) return;
        if (records.some(record => record.type === 'attributes' ? record.target.closest?.('#eqsl') :
            [...record.addedNodes].some(node => node.nodeType === 1 &&
                (node.matches('#persona_form, #eqsl, #eqsb') || node.querySelector('#persona_form, #eqsl, #eqsb'))))) refresh();
    });
    nativeObserver.observe(document.getElementById('csp') || document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    let hvutPending = false, watchedTop = null, hvutObserver = null;
    const hvutBusy = () => [...watchedTop.children].some(node => /^\([PE]\.\.\.\)$/.test(node.firstElementChild?.textContent?.trim())) ||
        [...watchedTop.querySelectorAll('.hvut-top-sub select:disabled')].some(isPersonaSelect);
    function beginHvut(expected = null) {
        hvutPending = true; jpxLoadoutBusy = true;
        invalidate(); setJpxLoadoutSync(true, expected);
    }
    function finishHvut() {
        const observed = readJpxHvutLoadout()?.current;
        if (jpxLoadoutSyncExpected && observed && !matchesJpxLoadoutSync(observed)) return;
        hvutPending = false; jpxLoadoutBusy = false;
        if (observed) setJpxLoadoutSync(true, observed);
        // HVUT's final cache is an expected tuple, not proof of a ready strategy.
        // One server lookup verifies the loadout, equipment and attributes together.
        ensureJpxModeDetection();
    }
    function watchHvut(top) {
        if (!top || watchedTop === top) return;
        hvutObserver?.disconnect(); watchedTop = top;
        if (hvutBusy()) beginHvut();
        hvutObserver = new MutationObserver(records => {
            if (unavailable()) return;
            if (hvutBusy()) { if (!hvutPending) beginHvut(); return; }
            // Preserve switches that enter and leave busy within a single task.
            const completed = records.some(record => record.type === 'attributes' && isPersonaSelect(record.target) && record.oldValue !== null && !record.target.disabled ||
                /^\([PE]\.\.\.\)$/.test(record.oldValue?.trim()) ||
                [...record.removedNodes].some(node => /^\([PE]\.\.\.\)$/.test(node.textContent?.trim())));
            if (!completed) return;
            if (!hvutPending) beginHvut();
            finishHvut();
        });
        hvutObserver.observe(top, { childList: true, subtree: true, characterData: true, characterDataOldValue: true, attributes: true, attributeOldValue: true, attributeFilter: ['disabled'] });
    }
    watchHvut(document.getElementById('hvut-top'));
    const topObserver = new MutationObserver(() => {
        if (unavailable()) { topObserver.disconnect(); hvutObserver?.disconnect(); return; }
        if (!watchedTop?.isConnected) watchHvut(document.getElementById('hvut-top'));
    });
    topObserver.observe(document.getElementById('navbar')?.parentElement || document.body, { childList: true });
    window.addEventListener('storage', event => {
        if (event.key !== jpxLoadoutKey() && event.key !== (isekaiSuffix ? 'hvuti' : 'hvut') + '_persona') return;
        if (unavailable()) return;
        if (event.key === jpxLoadoutKey()) {
            // Another JPX tab has already confirmed and applied this tuple.
            // Share its observation; do not re-apply over a manual selection.
            const current = readJpxLoadoutCatalog().current;
            if (current && !jpxLoadoutBusy) {
                jpxDetectionGeneration++; jpxDetectionSourceIgnored = true;
                jpxLoadoutConfirmed = current; jpxLoadoutPending = false;
                window.dispatchEvent(new Event('jpx:loadout-detected'));
                return;
            }
        }
        invalidate();
        refresh();
    });
    window.addEventListener('focus', () => {
        if (jpxLoadoutPending) refresh();
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && jpxLoadoutPending) refresh(); });
    window.addEventListener('pagehide', () => clearTimeout(refreshTimer));
    try {
        if (jpxLoadoutSyncRequired) { invalidate(); renderJpxLoadoutSync(); }
        rememberJpxLoadout();
        if (!hvutPending && !jpxLoadoutConfirmed && getJpxConfigLibrary().readState().bindings?.some(item => item.world === jpxConfigWorld())) ensureJpxModeDetection(true);
    } catch (error) { console.warn('JPX-PLUS loadout binding could not be read.', error); }
}

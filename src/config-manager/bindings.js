// Persona/set observations stay outside native rules and exported configs.
const jpxLoadoutSlot = value => /^[1-9]\d{0,5}$/.test(String(value || '')) ? String(value) : '';
const jpxLoadoutKey = (world = jpxConfigWorld()) => prefix + 'loadouts_v1' + (world === 'Isekai' ? '_isekai' : '');
const jpxLoadoutSame = (a, b) => !!a && !!b && a.world === b.world && a.personaId === b.personaId && a.setId === b.setId;
let jpxLoadoutConfirmed = null, jpxLoadoutPending = false, jpxLoadoutBusy = false, jpxLoadoutInitialized = false;

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
        else for (const set of item.sets) {
            const known = previous.sets.find(value => value.id === set.id);
            if (!known) previous.sets.push(set); else if (set.name) known.name = set.name;
        }
    }
    catalog.sets = [...new Set([...catalog.sets, ...(hvut?.sets || [])])].sort((a, b) => Number(a) - Number(b));
    return catalog;
}

function jpxConfigContainsCode(envelope) {
    return BATTLE_MODES.some(mode => Object.entries(envelope.config[mode] || {}).some(([key, rules]) =>
        (key === 'supports' || key === 'attacks' || key.startsWith('kb_')) &&
        Array.isArray(rules) && rules.some(rule => rule.type === 'kamisamaniNattaHi')));
}

function applyJpxLoadoutBinding(context, force = false) {
    if (!context || jpxLoadoutPending || log || document.querySelector('#textlog, #battle_main, #riddlemaster')) return false;
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
    window.dispatchEvent(new Event('jpx:config-library'));
    return true;
}

function confirmJpxLoadout(current, catalog) {
    if (jpxLoadoutBusy || log || document.querySelector('#textlog, #battle_main, #riddlemaster') || current.world !== jpxConfigWorld()) return;
    const previous = readJpxLoadoutCatalog().current;
    jpxLoadoutPending = false;
    if (!jpxLoadoutSame(previous, current)) applyJpxLoadoutBinding(current);
    catalog.current = current;
    const raw = JSON.stringify(catalog), key = jpxLoadoutKey();
    if (localStorage.getItem(key) !== raw) localStorage.setItem(key, raw);
    jpxLoadoutConfirmed = current;
    window.dispatchEvent(new Event('jpx:loadout-detected'));
}

function rememberJpxLoadout(character = document, equipment = document) {
    if (jpxLoadoutPending && character === document) return;
    const selector = character.querySelector('#persona_form select');
    const personaId = jpxLoadoutSlot(selector?.value);
    const equipmentPersona = equipment.querySelector('#persona_form select');
    if (!personaId || equipmentPersona && equipmentPersona.value !== personaId) return;
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
    confirmJpxLoadout({ world: jpxConfigWorld(), personaId, setId }, catalog);
}

function initJpxLoadoutBindings() {
    if (jpxLoadoutInitialized) return;
    jpxLoadoutInitialized = true;
    const unavailable = () => !!log || !!document.querySelector('#textlog, #battle_main, #riddlemaster');
    if (unavailable()) return;
    const invalidate = () => {
        jpxLoadoutPending = true; jpxLoadoutConfirmed = null;
        jpxDetectionGeneration++; jpxDetectionRetryAt = 0;
        jpxDetectionSourceIgnored = true;
    };
    document.addEventListener('change', event => {
        if (event.target.closest?.('#persona_form, [name=equip_set]')) invalidate();
    }, true);
    document.addEventListener('submit', event => {
        if (event.target.matches?.('#persona_form, #equipform')) invalidate();
    }, true);
    document.addEventListener('click', event => { if (event.target.closest?.('#eqsl')) invalidate(); }, true);
    let hvutPending = false;
    function watchHvut(top) {
        const isBusy = () => [...top.children].some(node => /^\([PE]\.\.\.\)$/.test(node.firstElementChild?.textContent?.trim()));
        if (isBusy()) { hvutPending = true; jpxLoadoutBusy = true; invalidate(); }
        new MutationObserver(() => {
            if (unavailable()) return;
            const busy = isBusy();
            if (busy) { hvutPending = true; jpxLoadoutBusy = true; invalidate(); return; }
            if (!hvutPending) return;
            hvutPending = false; jpxLoadoutBusy = false;
            const observed = readJpxHvutLoadout();
            if (!observed?.current || !observed.personas.some(persona => persona.id === observed.current.personaId && persona.sets.some(set => set.id === observed.current.setId))) return;
            // HVUT writes persona first, set second. Its P/E indicator must finish
            // before the tuple is accepted; intermediate cache values are ignored.
            try {
                confirmJpxLoadout(observed.current, getJpxLoadoutCatalog());
                // The DOM can still show the old equipment after HVUT's AJAX swap.
                localStorage.setItem(prefix + 'personaId' + isekaiSuffix, observed.current.personaId);
                localStorage.setItem(prefix + 'persona' + isekaiSuffix, observed.personas.find(item => item.id === observed.current.personaId)?.name || '');
                localStorage.removeItem(jpxDetectedFamilyKey());
                localStorage.removeItem(prefix + 'spellDamageBonus' + isekaiSuffix + ':context');
                window.dispatchEvent(new Event('jpx:mode-detected'));
            }
            catch (error) { console.warn('JPX-PLUS loadout binding failed.', error); }
        }).observe(top, { childList: true, subtree: true, characterData: true });
    }
    const top = document.getElementById('hvut-top');
    if (top) watchHvut(top);
    else {
        const observer = new MutationObserver(() => {
            const top = document.getElementById('hvut-top');
            if (top) { observer.disconnect(); clearTimeout(timeout); watchHvut(top); }
        });
        observer.observe(document.getElementById('navbar')?.parentElement || document.body, { childList: true });
        const timeout = setTimeout(() => observer.disconnect(), 10000);
    }
    window.addEventListener('storage', event => {
        if (event.key !== jpxLoadoutKey() && event.key !== (isekaiSuffix ? 'hvuti' : 'hvut') + '_persona') return;
        invalidate();
    });
    window.addEventListener('focus', () => {
        if (jpxLoadoutPending && !unavailable()) ensureJpxModeDetection(true);
    });
    try {
        rememberJpxLoadout();
        if (!hvutPending && !jpxLoadoutConfirmed && getJpxConfigLibrary().readState().bindings?.some(item => item.world === jpxConfigWorld())) ensureJpxModeDetection(true);
    } catch (error) { console.warn('JPX-PLUS loadout binding could not be read.', error); }
}

// The local library is deliberately independent of the editor and battle runtime.
// Keep PLUS metadata outside native JPX configuration objects.
function createJpxConfigLibrary({ storage, key, modes, battleVersion, statsVersion }) {
    const MAX_JSON = 8 * 1024 * 1024;
    const MAX_ENVELOPE = 2 * 1024 * 1024;
    const MAX_ENTRIES = 500;
    const blockedKeys = new Set(['__proto__', 'prototype', 'constructor']);
    const modeSet = new Set(modes || []);
    const worlds = new Set(['Persistent', 'Isekai', 'Any']);
    const backupKey = `${key}:backup`;
    const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };
    if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function' ||
        typeof key !== 'string' || !key || !modeSet.size) fail('invalidConfig');

    function encode(value, limit = MAX_JSON) {
        let nodes = 0;
        const seen = new Set();
        function visit(item, depth) {
            if (++nodes > 250000 || depth > 80) fail('tooLarge');
            if (item === null || typeof item === 'string' || typeof item === 'boolean') return;
            if (typeof item === 'number') { if (!Number.isFinite(item)) fail('invalidConfig'); return; }
            if (typeof item !== 'object' || seen.has(item)) fail('invalidConfig');
            const proto = Object.getPrototypeOf(item);
            if (!Array.isArray(item) && proto !== null && Object.getPrototypeOf(proto) !== null) fail('invalidConfig');
            seen.add(item);
            if (Array.isArray(item)) {
                if (item.length > 100000) fail('tooLarge');
                for (let i = 0; i < item.length; i++) if (!Object.hasOwn(item, i)) fail('invalidConfig');
            }
            for (const name of Reflect.ownKeys(item)) {
                if (typeof name !== 'string' || blockedKeys.has(name)) fail('invalidConfig');
                if (Array.isArray(item) && name === 'length') continue;
                const descriptor = Object.getOwnPropertyDescriptor(item, name);
                if (!descriptor.enumerable || descriptor.get || descriptor.set) fail('invalidConfig');
                if (Array.isArray(item) && !/^(0|[1-9]\d*)$/.test(name)) fail('invalidConfig');
                visit(descriptor.value, depth + 1);
            }
            seen.delete(item);
        }
        visit(value, 0);
        const result = JSON.stringify(value);
        if (result.length > limit) fail('tooLarge');
        return result;
    }
    const clone = (value, limit) => JSON.parse(encode(value, limit));
    function getRaw(name) {
        try { return storage.getItem(name); }
        catch { return fail('storageError'); }
    }
    function putRaw(name, raw) {
        try { storage.setItem(name, raw); }
        catch { fail('storageError'); }
    }
    function parse(raw) {
        if (typeof raw !== 'string' || raw.length > MAX_JSON) fail('storageCorrupt');
        try { return clone(JSON.parse(raw)); }
        catch { return fail('storageCorrupt'); }
    }
    function validId(id) {
        return typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,159}$/.test(id) && !blockedKeys.has(id);
    }
    function validateRules(mode) {
        if (!object(mode)) fail('invalidConfig');
        // Native JPX permits an explicitly empty scene and falls back to General.
        if (!Object.keys(mode).length) return;
        if (!Array.isArray(mode.supports) || !Array.isArray(mode.attacks)) fail('invalidConfig');
        for (const [group, rules] of Object.entries(mode)) {
            if (group !== 'supports' && group !== 'attacks' && !group.startsWith('kb_')) continue;
            if (!Array.isArray(rules)) fail('invalidConfig');
            for (const rule of rules) {
                if (!object(rule) || typeof rule.type !== 'string' || !rule.type) fail('invalidConfig');
                if ('conditions' in rule && (!Array.isArray(rule.conditions) || rule.conditions.some(condition =>
                    !object(condition) || typeof condition.key !== 'string' || !condition.key))) fail('invalidConfig');
            }
        }
    }
    function envelopeCopy(input) {
        const envelope = clone(input, MAX_ENVELOPE);
        if (!object(envelope) || envelope.schemaVersion !== 1 ||
            !['battle', 'battle-mode', 'stats'].includes(envelope.kind) || !object(envelope.config) ||
            typeof envelope.title !== 'string' || (envelope.description !== undefined && typeof envelope.description !== 'string') ||
            !worlds.has(envelope.world)) fail('invalidConfig');
        const config = envelope.config;
        const versionKey = envelope.kind === 'stats' ? 'statsVersion' : 'battleVersion';
        const minimum = envelope.kind === 'stats' ? statsVersion : battleVersion;
        if (envelope.kind !== 'stats' && config.version && !config.battleVersion) {
            config.battleVersion = config.version;
            delete config.version;
        }
        if (!['number', 'string'].includes(typeof config[versionKey]) || String(config[versionKey]).trim() === '' ||
            !Number.isFinite(Number(config[versionKey])) || config[versionKey] < minimum) fail('unsupportedVersion');
        if (envelope.kind === 'stats') {
            for (const field of ['combatRows', 'revenueRows', 'statsColumns']) {
                if (field in config && (!Array.isArray(config[field]) || config[field].some(row => !object(row) || typeof row.id !== 'string'))) fail('invalidConfig');
            }
            return envelope;
        }
        if (config.Battlecaster_General && !config['1H_Mage_General']) {
            config['1H_Mage_General'] = config.Battlecaster_General;
            delete config.Battlecaster_General;
        }
        if (envelope.mode === 'Battlecaster_General') envelope.mode = '1H_Mage_General';
        if (envelope.kind === 'battle-mode' && (!modeSet.has(envelope.mode) || !Object.hasOwn(config, envelope.mode))) fail('invalidConfig');
        for (const mode of [...modeSet, 'Battlecaster_General']) {
            if (!Object.hasOwn(config, mode)) continue;
            const data = config[mode];
            validateRules(data);
            for (const rule of data.supports || []) {
                if (['spellInstant', 'spellDuration'].includes(rule.type)) rule.type = 'spellSupport';
                else if (['itemInstant', 'itemDuration'].includes(rule.type)) rule.type = 'item';
            }
            for (const rule of data.attacks || []) {
                if (rule.type === 'target' && 'bottomUp' in rule) {
                    rule.priorityRule = rule.bottomUp ? 'Bottom Up' : 'Top Down';
                    delete rule.bottomUp;
                }
                if (rule.type === 'smartDebuff' && typeof rule.targetCount === 'string' && rule.targetCount.trim() && !isNaN(rule.targetCount)) {
                    rule.targetCount = Number(rule.targetCount);
                }
            }
        }
        return envelope;
    }
    const emptyState = () => ({ schemaVersion: 1, entries: [], applied: {}, migrations: [] });
    const validSlot = value => typeof value === 'string' && /^[1-9]\d{0,5}$/.test(value);
    const validBinding = value => object(value) && ['Persistent', 'Isekai'].includes(value.world) &&
        validSlot(value.personaId) && validSlot(value.setId);
    const sameBinding = (a, b) => a.world === b.world && a.personaId === b.personaId && a.setId === b.setId;
    const validTime = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
    const validRecordMode = record => !Object.hasOwn(record, 'mode') ||
        typeof record.mode === 'string' && modeSet.has(record.mode) && record.scopes.includes(record.mode) && Object.hasOwn(record.config, record.mode);
    let validatedRaw, validatedState;
    function readState() {
        const raw = getRaw(key);
        if (raw === null || raw === undefined) return emptyState();
        // Revalidate only when storage changes; callers still receive independent
        // copies, including after another tab replaces or corrupts the archive.
        if (raw === validatedRaw) return JSON.parse(validatedState);
        const state = parse(raw);
        try {
            if (!object(state) || state.schemaVersion !== 1 || !Array.isArray(state.entries) || state.entries.length > MAX_ENTRIES ||
                !object(state.applied) || !Array.isArray(state.migrations) || state.migrations.some(marker => typeof marker !== 'string' || !marker)) fail('storageCorrupt');
            const ids = new Set();
            for (const entry of state.entries) {
                if (!object(entry) || !validId(entry.id) || ids.has(entry.id) || !Number.isSafeInteger(entry.revision) || entry.revision < 1 ||
                    !validTime(entry.createdAt) || !validTime(entry.updatedAt) || ('execution' in entry && !object(entry.execution))) fail('storageCorrupt');
                ids.add(entry.id);
                entry.envelope = envelopeCopy(entry.envelope);
            }
            for (const [world, records] of Object.entries(state.applied)) {
                if (!worlds.has(world) || !object(records)) fail('storageCorrupt');
                for (const [id, record] of Object.entries(records)) {
                    const entry = state.entries.find(item => item.id === id);
                    if (!entry || !object(record) || record.id !== id || !Number.isSafeInteger(record.revision) || record.revision < 1 ||
                        record.revision > entry.revision || !Array.isArray(record.scopes) || !record.scopes.length ||
                        record.scopes.some(scope => typeof scope !== 'string' || !scope) || !object(record.config) ||
                        ('execution' in record && !object(record.execution)) || !validRecordMode(record)) fail('storageCorrupt');
                }
            }
            if (Object.hasOwn(state, 'active')) {
                if (!object(state.active)) fail('storageCorrupt');
                for (const [world, id] of Object.entries(state.active)) {
                    if (!worlds.has(world) || !validId(id) || !Object.hasOwn(state.applied[world] || {}, id)) fail('storageCorrupt');
                }
            }
            if (Object.hasOwn(state, 'bindings')) {
                if (!Array.isArray(state.bindings) || state.bindings.length > 2000) fail('storageCorrupt');
                const slots = new Set();
                for (const binding of state.bindings) {
                    const entry = state.entries.find(item => item.id === binding?.id);
                    const slot = JSON.stringify([binding?.world, binding?.personaId, binding?.setId]);
                    if (!validBinding(binding) || !entry || entry.envelope.kind === 'stats' || slots.has(slot) ||
                        !Number.isSafeInteger(binding.trustedRevision) || binding.trustedRevision < 1 || binding.trustedRevision > entry.revision) fail('storageCorrupt');
                    slots.add(slot);
                }
            }
        } catch { return fail('storageCorrupt'); }
        validatedRaw = raw;
        validatedState = JSON.stringify(state);
        return state;
    }
    function write(state) { putRaw(key, encode(state)); }
    function newId(state) {
        let id;
        do {
            id = typeof globalThis.crypto?.randomUUID === 'function' ? globalThis.crypto.randomUUID() :
                `config-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
        } while (state.entries.some(entry => entry.id === id));
        return id;
    }
    function save(input, options = {}) {
        const envelope = envelopeCopy(input);
        const state = readState();
        const previous = options.id === undefined ? null : state.entries.find(entry => entry.id === options.id);
        if (options.id !== undefined && !previous) fail('notFound');
        if (envelope.kind === 'stats' && state.bindings?.some(binding => binding.id === previous?.id)) fail('invalidConfig');
        if (!previous && state.entries.length >= MAX_ENTRIES) fail('tooLarge');
        const now = new Date().toISOString();
        const entry = { ...(previous || {}), id: previous?.id || newId(state), envelope,
            revision: (previous?.revision || 0) + 1, createdAt: previous?.createdAt || now, updatedAt: now };
        for (const name of ['source', 'execution']) if (Object.hasOwn(options, name)) {
            if (options[name] === null || options[name] === undefined) delete entry[name];
            else entry[name] = clone(options[name]);
        }
        if ('execution' in entry && !object(entry.execution)) fail('invalidConfig');
        if (previous) state.entries[state.entries.indexOf(previous)] = entry;
        else state.entries.push(entry);
        write(state);
        return clone(entry);
    }
    function rename(id, title, expectedRevision) {
        if (typeof title !== 'string' || !title.trim() || title.trim().length > 100 || /[\x00-\x1f\x7f]/.test(title)) fail('invalidConfig');
        const state = readState(), entry = state.entries.find(item => item.id === id);
        if (!entry) fail('notFound');
        if (entry.revision !== expectedRevision) fail('libraryChanged');
        title = title.trim();
        if (entry.envelope.title === title) return clone(entry);
        const previousRevision = entry.revision;
        entry.envelope.title = title; entry.revision++; entry.updatedAt = new Date().toISOString();
        // A name change does not alter applied rules. Keep genuinely stale
        // snapshots stale, but do not ask users to reapply a metadata-only edit.
        for (const records of Object.values(state.applied)) {
            if (records[id]?.revision === previousRevision) records[id].revision = entry.revision;
        }
        for (const binding of state.bindings || []) {
            if (binding.id === id && binding.trustedRevision === previousRevision) binding.trustedRevision = entry.revision;
        }
        write(state);
        return clone(entry);
    }
    function reorder(ids, expected) {
        const state = readState();
        if (!Array.isArray(ids) || ids.length > MAX_ENTRIES || ids.some(id => !validId(id)) || new Set(ids).size !== ids.length) fail('invalidConfig');
        const selected = new Set(ids), entries = new Map(state.entries.map(entry => [entry.id, entry]));
        if (ids.some(id => !entries.has(id))) fail('notFound');
        const current = state.entries.filter(entry => selected.has(entry.id)).map(entry => entry.id);
        if (expected !== undefined && (!Array.isArray(expected) || JSON.stringify(current) !== JSON.stringify(expected))) fail('libraryChanged');
        if (JSON.stringify(current) === JSON.stringify(ids)) return;
        let index = 0;
        // Reorder only the visible subset. Hidden entries and rule revisions stay intact.
        state.entries = state.entries.map(entry => selected.has(entry.id) ? entries.get(ids[index++]) : entry);
        write(state);
    }
    function remove(id) {
        const state = readState();
        if (!state.entries.some(entry => entry.id === id)) fail('notFound');
        if (Object.values(state.applied).some(records => Object.hasOwn(records, id))) fail('appliedConfig');
        state.entries = state.entries.filter(entry => entry.id !== id);
        if (state.bindings) state.bindings = state.bindings.filter(binding => binding.id !== id);
        write(state);
        return true;
    }
    function setBinding(context, id, expectedRevision, previousId = null) {
        if (!validBinding(context)) fail('invalidConfig');
        const state = readState(), entry = state.entries.find(item => item.id === id);
        if (!entry || entry.envelope.kind === 'stats') fail('invalidConfig');
        if (entry.revision !== expectedRevision) fail('libraryChanged');
        const bindings = state.bindings ||= [], index = bindings.findIndex(binding => sameBinding(binding, context));
        if ((index < 0 ? null : bindings[index].id) !== previousId) fail('libraryChanged');
        const binding = { world: context.world, personaId: context.personaId, setId: context.setId, id, trustedRevision: entry.revision };
        if (index < 0) { if (bindings.length >= 2000) fail('tooLarge'); bindings.push(binding); }
        else bindings[index] = binding;
        write(state);
        return clone(binding);
    }
    function removeBinding(context, id) {
        if (!validBinding(context)) fail('invalidConfig');
        const state = readState(), index = state.bindings?.findIndex(binding => sameBinding(binding, context)) ?? -1;
        if (index < 0) return false;
        if (state.bindings[index].id !== id) fail('libraryChanged');
        state.bindings.splice(index, 1); write(state); return true;
    }
    function backup() {
        readState(); // Never replace or hide a corrupt source with an apparently valid backup.
        const raw = getRaw(key);
        if (getRaw(backupKey) === null || getRaw(backupKey) === undefined) {
            putRaw(backupKey, JSON.stringify({ savedAt: new Date().toISOString(), raw: raw ?? null }));
        }
        return backupKey;
    }
    function migrate(entries, marker, options = {}) {
        if (!Array.isArray(entries) || typeof marker !== 'string' || !marker || marker.length > 200) fail('invalidConfig');
        const state = readState();
        if (state.migrations.includes(marker)) return clone(state);
        const migratedIds = new Map();
        entries.forEach((input, index) => {
            if (!object(input) || !object(input.envelope)) fail('invalidConfig');
            const envelope = envelopeCopy(input.envelope);
            let id = validId(input.id) ? input.id : `migrated-${marker.replace(/[^A-Za-z0-9_.:-]/g, '-').slice(0, 100)}-${index}`;
            const same = state.entries.find(entry => entry.id === id);
            if (same && encode(same.envelope) === encode(envelope)) {
                migratedIds.set(input.id, same.id);
                return;
            }
            const base = id.slice(0, 140);
            let suffix = 0;
            while (state.entries.some(entry => entry.id === id)) id = `${base}-migrated${suffix++ ? '-' + suffix : ''}`;
            const now = new Date().toISOString();
            const entry = { id, envelope, revision: Number.isSafeInteger(input.revision) && input.revision > 0 ? input.revision : 1,
                createdAt: validTime(input.createdAt) ? input.createdAt : validTime(input.savedAt) ? input.savedAt : now,
                updatedAt: validTime(input.updatedAt) ? input.updatedAt : validTime(input.savedAt) ? input.savedAt : now };
            for (const name of ['source', 'execution']) if (input[name] !== undefined) entry[name] = clone(input[name]);
            if ('execution' in entry && !object(entry.execution)) fail('invalidConfig');
            state.entries.push(entry);
            migratedIds.set(input.id, entry.id);
        });
        if (state.entries.length > MAX_ENTRIES) fail('tooLarge');
        if (options.applied !== undefined) {
            if (!Array.isArray(options.applied)) fail('invalidConfig');
            for (const request of clone(options.applied)) {
                const id = migratedIds.get(request.id);
                const entry = state.entries.find(item => item.id === id);
                if (!entry || !worlds.has(request.world) || !Array.isArray(request.scopes) || !request.scopes.length ||
                    request.scopes.some(scope => typeof scope !== 'string' || !scope)) fail('invalidConfig');
                const records = state.applied[request.world] ||= {};
                // Seeding must never replace a user's explicit application.
                if (Object.values(records).some(record => overlaps(record.scopes, request.scopes))) continue;
                records[id] = { id, revision: entry.revision, scopes: [...new Set(request.scopes)], config: clone(entry.envelope.config) };
            }
        }
        state.migrations.push(marker);
        const serialized = encode(state); // Validate everything before writing either record.
        backup();
        putRaw(key, serialized);
        return clone(state);
    }
    const overlaps = (a, b) => a.includes('*') || b.includes('*') || a.some(scope => b.includes(scope));
    function pruneActive(state) {
        if (!state.active) return;
        for (const [world, id] of Object.entries(state.active)) {
            if (!Object.hasOwn(state.applied[world] || {}, id)) delete state.active[world];
        }
        if (!Object.keys(state.active).length) delete state.active;
    }
    function setApplied(world, input, { activate = false } = {}) {
        if (!worlds.has(world)) fail('invalidConfig');
        const record = clone(input);
        const state = readState();
        const entry = state.entries.find(item => item.id === record?.id);
        if (!entry) fail('notFound');
        if (!object(record) || !Number.isSafeInteger(record.revision) || record.revision < 1 || record.revision > entry.revision ||
            !Array.isArray(record.scopes) || !record.scopes.length || record.scopes.some(scope => typeof scope !== 'string' || !scope) ||
            !object(record.config) || ('execution' in record && !object(record.execution)) || !validRecordMode(record)) fail('invalidConfig');
        record.scopes = [...new Set(record.scopes)];
        const records = state.applied[world] ||= {};
        for (const [id, applied] of Object.entries(records)) {
            if (overlaps(applied.scopes, record.scopes)) delete records[id];
        }
        records[record.id] = record;
        if (activate === true) (state.active ||= {})[world] = record.id;
        pruneActive(state);
        write(state);
        return clone(record);
    }
    function clearApplied(world, id) {
        if (!worlds.has(world) || !validId(id)) fail('invalidConfig');
        const state = readState();
        const records = state.applied[world];
        if (!records || !Object.hasOwn(records, id)) return false;
        delete records[id];
        if (!Object.keys(records).length) delete state.applied[world];
        pruneActive(state);
        write(state);
        return true;
    }
    return Object.freeze({
        list: () => readState().entries,
        get: id => readState().entries.find(entry => entry.id === id) || null,
        save, rename, reorder, remove, migrate, backup, readState, setApplied, clearApplied, setBinding, removeBinding
    });
}

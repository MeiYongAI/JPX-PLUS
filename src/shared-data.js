// One userscript-owned data store for the primary and alt hosts. Native storage
// remains untouched as a migration backup; transient battle logs stay local.
function createJpxSharedData({ native, gm, origin, migrateNative = true, emit = () => {}, now = Date.now, uuid = () => crypto.randomUUID() }) {
    const root = 'jpx_shared_v1:', settingPrefix = root + 'setting:';
    const enabled = !!gm && ['get', 'set', 'list', 'listen'].every(key => typeof gm[key] === 'function');
    const setting = key => /^jpx_(cfgBattle(?:_isekai)?|cfgStats|userKeybinds(?:_isekai)?|configLibrary_v1|configApplySignal_v1|theme|stamina(?:_isekai)?|cleanupRequest)(?::.*)?$/.test(key);
    const config = key => /^jpx_(cfgBattle|cfgStats|userKeybinds|configLibrary_v1)/.test(key);
    const clone = value => JSON.parse(JSON.stringify(value));
    const day = value => new Date(value).toISOString().slice(0, 10);
    const worldOf = record => record.world === 'Isekai' ? 'Isekai' : 'Persistent';
    const idOf = record => JSON.stringify([worldOf(record), record.timestamp]);
    const encode = value => encodeURIComponent(value);
    const resultKey = record => root + 'result:' + encode(idOf(record));
    let lastStamp = 0;
    const stamp = () => {
        const observed = enabled ? Number(String(get(root + 'change')?.nonce || '').split(':')[0]) || 0 : 0;
        lastStamp = Math.max(now(), lastStamp + 1, observed + 1);
        return String(lastStamp).padStart(16, '0') + ':' + uuid();
    };
    const get = (key, fallback = null) => { const value = gm.get(key, fallback); if (value?.then) throw new Error('JPX shared data requires synchronous GM storage'); return value; };
    const set = (key, value) => { const result = gm.set(key, value); if (result?.then) throw new Error('JPX shared data requires synchronous GM storage'); };
    const keys = () => { const value = gm.list(); if (!Array.isArray(value)) throw new Error('JPX shared data cannot enumerate storage'); return value; };
    const notify = key => { try { const nonce = stamp(); if (['records', 'migration'].includes(key)) set(root + 'recordsRevision', nonce); set(root + 'change', { key, nonce }); } catch (error) { console.warn('JPX shared data was saved; notification failed.', error); } };
    const legacyKey = root + 'legacy:' + encode(origin);
    const markerKey = root + 'settingsMigrated:' + encode(origin);
    const recordMarker = root + 'recordsMigrated:' + encode(origin);
    let migration = null, recordCache = null, recordsMigrated = false, archiveRevision = null;
    const cache = new Map();
    function baseline(world, date) {
        const override = get(root + 'staminaBase:' + world + ':' + date);
        if (override !== null) return override;
        let value = 0;
        for (const key of keys()) if (key.startsWith(root + 'legacyStamina:' + world + ':' + date + ':')) value = Math.max(value, get(key, 0));
        return value;
    }
    function migrateSettings() {
        if (get(markerKey)) return;
        let snapshot = get(legacyKey);
        if (!snapshot) {
            snapshot = { origin, capturedAt: now(), values: {} };
            for (let i = 0; i < native.length; i++) { const key = native.key(i); if (setting(key) || /^jpx_staminaRecords(?:_isekai)?$/.test(key)) snapshot.values[key] = native.getItem(key); }
            set(legacyKey, snapshot);
        }
        for (const [key, raw] of Object.entries(get(root + 'reset') ? {} : snapshot.values)) {
            if (key.startsWith('jpx_staminaRecords')) {
                let value;
                try {
                    value = JSON.parse(raw);
                } catch { /* Keep the original snapshot, including malformed legacy data. */ }
                if (Number.isFinite(value?.lastUpdate) && Number.isFinite(value.staminaCost) && value.staminaCost >= 0)
                    set(root + 'legacyStamina:' + (key.endsWith('_isekai') ? 'Isekai' : 'Persistent') + ':' + day(value.lastUpdate) + ':' + encode(origin), value.staminaCost);
            } else if (key !== 'jpx_cleanupRequest' && get(settingPrefix + key) === null) set(settingPrefix + key, { value: raw, source: origin });
        }
        set(markerKey, true);
        notify('migration');
    }
    function readSetting(key) {
        if (!cache.has(key)) cache.set(key, get(settingPrefix + key)?.value ?? null);
        return cache.get(key);
    }
    function writeSetting(key, value) {
        const oldValue = readSetting(key);
        if (oldValue === value) return;
        // Retain concurrent/previous configuration revisions independently of the
        // authoritative value. Never overwrite the other host's legacy snapshot.
        if (config(key)) {
            // Save the proposed value too: simultaneous edits from different
            // domains cannot erase either user's version even without GM CAS.
            const current = get(settingPrefix + key)?.value ?? null;
            const revisionKey = root + 'revision:' + encode(key) + ':' + encode(origin);
            if (current !== null) set(revisionKey + ':previous', { key, value: current, at: now(), source: origin });
            set(revisionKey + ':proposed', { key, value, at: now(), source: origin });
        }
        set(settingPrefix + key, { value, source: origin });
        cache.set(key, value);
        notify(key);
    }
    const facade = {
        getItem(key) { key = String(key); return enabled && setting(key) ? readSetting(key) : native.getItem(key); },
        setItem(key, value) { key = String(key); value = String(value); if (enabled && setting(key)) writeSetting(key, value); else native.setItem(key, value); },
        removeItem(key) { key = String(key); if (enabled && setting(key)) writeSetting(key, null); else native.removeItem(key); },
        key(index) { return storageKeys()[index] ?? null; },
        get length() { return storageKeys().length; }
    };
    function storageKeys() {
        const all = new Set(Array.from({ length: native.length }, (_, i) => native.key(i)));
        if (enabled) for (const key of keys()) if (key.startsWith(settingPrefix)) all.add(key.slice(settingPrefix.length));
        return [...all].filter(key => facade.getItem(key) !== null);
    }
    const storage = enabled ? new Proxy(facade, {
        get(target, key) { return key in target || typeof key !== 'string' ? Reflect.get(target, key) : target.getItem(key); },
        ownKeys: storageKeys,
        getOwnPropertyDescriptor(target, key) { return typeof key === 'string' && facade.getItem(key) !== null ? { configurable: true, enumerable: true, value: facade.getItem(key) } : undefined; }
    }) : native;
    let lastChange = null;
    function refresh(change) {
            if (!enabled || !change || lastChange === change.nonce) return;
            lastChange = change.nonce;
            lastStamp = Math.max(lastStamp, Number(String(change.nonce || '').split(':')[0]) || 0);
            const nextRevision = get(root + 'recordsRevision');
            const recordsChanged = nextRevision !== archiveRevision;
            archiveRevision = nextRevision;
            if (recordsChanged) recordCache = null;
            // A notification is an invalidation, never the source of truth.
            // Refresh every cached setting so concurrent notifications coalesce.
            for (const [key, oldValue] of cache) {
                const newValue = get(settingPrefix + key)?.value ?? null;
                cache.set(key, newValue);
                if (newValue !== oldValue) emit({ key, oldValue, newValue });
            }
            if (setting(change.key) && !cache.has(change.key)) {
                const newValue = get(settingPrefix + change.key)?.value ?? null;
                cache.set(change.key, newValue); emit({ key: change.key, oldValue: null, newValue });
            }
            if (recordsChanged) emit({ key: 'jpx_recordsChanged' });
    }
    if (enabled) {
        if (migrateNative) migrateSettings();
        archiveRevision = get(root + 'recordsRevision');
        gm.listen(root + 'change', (_key, _old, change, remote) => { if (remote) refresh(change); });
    }
    async function ensureRecords(readLegacy) {
        if (!enabled || !migrateNative || recordsMigrated) return;
        if (get(recordMarker)) { recordsMigrated = true; return; }
        if (migration) return migration;
        migration = (async () => {
            const records = get(root + 'reset') ? [] : await readLegacy();
            // A single committed value makes migration atomic and retryable.
            set(root + 'legacyRecords:' + encode(origin), { origin, records });
            set(recordMarker, true);
            recordsMigrated = true;
            recordCache = null; notify('records');
        })();
        try { await migration; } finally { migration = null; }
    }
    function operations() {
        const currentRevision = get(root + 'recordsRevision');
        if (currentRevision !== archiveRevision) { archiveRevision = currentRevision; recordCache = null; }
        if (recordCache) return recordCache;
        const result = { legacy: [], results: [], batches: [], baselines: new Map(), overrides: new Map() };
        for (const key of keys()) {
            if (key.startsWith(root + 'legacyRecords:')) result.legacy.push(get(key));
            else if (key.startsWith(root + 'result:')) result.results.push(get(key));
            else if (key.startsWith(root + 'batch:')) result.batches.push(get(key));
            else if (key.startsWith(root + 'legacyStamina:')) {
                const id = key.slice((root + 'legacyStamina:').length).split(':').slice(0, 2).join(':');
                result.baselines.set(id, Math.max(result.baselines.get(id) || 0, get(key, 0)));
            } else if (key.startsWith(root + 'staminaBase:')) result.overrides.set(key.slice((root + 'staminaBase:').length), get(key, 0));
        }
        result.legacy.sort((a, b) => a.origin.localeCompare(b.origin));
        recordCache = result; return result;
    }
    function stamina(world, date, exclude) {
        let used = baseline(world, date);
        // Load only today's receipts, never all historical battle payloads.
        for (const key of keys()) if (key.startsWith(root + 'day:' + world + ':' + date + ':')) {
            const item = get(get(key));
            if (item?.stamina?.date === date && item.id !== exclude) used += item.stamina.used;
        }
        return Math.round(used * 100) / 100;
    }
    function allRecords() {
        const ops = operations(), map = new Map();
        for (const batch of ops.legacy) for (const record of batch.records) { const id = idOf(record); if (!map.has(id)) map.set(id, clone(record)); }
        const events = [...ops.results, ...ops.batches].sort((a, b) => a.order.localeCompare(b.order));
        for (const event of events) {
            if (event.record) map.set(event.id, clone(event.record));
            else if (event.type === 'import') {
                if (!event.merge) map.clear();
                for (const record of event.records) { const id = idOf(record); if (!event.merge || !map.has(id)) map.set(id, clone(record)); }
            } else if (event.type === 'delete') for (const id of event.ids) map.delete(id);
        }
        // Allocate daily free stamina once in deterministic completion order,
        // including concurrent results. Archive deletion never erases usage.
        const totals = new Map();
        for (const event of [...ops.results].sort((a, b) => a.order.localeCompare(b.order))) {
            const cost = event.stamina; if (!cost) continue;
            const key = cost.world + ':' + cost.date;
            const before = totals.has(key) ? totals.get(key) : ops.overrides.get(key) ?? ops.baselines.get(key) ?? 0;
            const charged = Math.round(Math.max(0, cost.used - Math.max(0, cost.quota - before)) * 10) / 10;
            totals.set(key, before + cost.used);
            const record = map.get(event.id);
            if (record && record.sharedResult === event.order) {
                record.revenueRecords.staminaCost = charged;
                record.revenueRecords.finalProfit = Math.round((record.revenueRecords.totalProfit - charged * cost.unitPrice) * 10) / 10;
            }
        }
        return [...map.values()];
    }
    function saveResult(record, cost) {
        const key = resultKey(record);
        if (get(key)) return;
        const order = stamp(), saved = clone(record); saved.sharedResult = order;
        const event = { order, id: idOf(record), record: saved };
        if (cost) event.stamina = clone(cost);
        // Write the small lookup before the atomic receipt. An interrupted write
        // leaves an inert pointer, never an unrecorded charge. Stable receipt IDs
        // also deduplicate two hosts settling the same battle around midnight.
        if (cost) set(root + 'day:' + cost.world + ':' + cost.date + ':' + encode(event.id), key);
        set(key, event); recordCache = null; notify('records');
    }
    function batch(value) { const order = stamp(); set(root + 'batch:' + order, { ...value, order }); recordCache = null; notify('records'); }
    function reset() {
        // Retain migration markers so another host's old native database cannot
        // resurrect data after the user explicitly resets the shared store.
        for (const key of keys()) if (key.startsWith(root) && !key.includes('Migrated:') && key !== settingPrefix + 'jpx_cleanupRequest') gm.remove(key);
        set(root + 'reset', stamp());
        cache.clear(); recordCache = null; notify('records');
    }
    return { enabled, storage, idOf, ensureRecords, allRecords, saveResult, stamina,
        refresh() { if (enabled) refresh(get(root + 'change')); },
        importRecords: (records, merge) => batch({ type: 'import', records: clone(records), merge }),
        deleteRecords: ids => batch({ type: 'delete', ids }), reset,
        usage: world => ({ lastUpdate: now(), staminaCost: stamina(world, day(now())) }),
        backups: () => enabled ? keys().filter(key => key.startsWith(root + 'legacy:')).map(key => get(key)) : [],
        revisions: () => enabled ? keys().filter(key => key.startsWith(root + 'revision:')).map(key => get(key)) : [],
        baseline, setBaseline(world, date, value) {
            if (!Number.isFinite(value) || value < 0) throw new Error('Invalid stamina baseline');
            set(root + 'staminaBase:' + world + ':' + date, value); recordCache = null; notify('records');
        },
        restore(snapshot) { for (const [key, value] of Object.entries(snapshot.values)) if (config(key)) { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } }
    };
}

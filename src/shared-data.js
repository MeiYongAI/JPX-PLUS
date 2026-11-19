// One userscript-owned data store for the primary and alt hosts. Native storage
// remains untouched as a migration backup; transient battle logs stay local.
function createJpxSharedData({ native, gm, origin, emit = () => {}, now = Date.now, uuid = () => crypto.randomUUID() }) {
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
    const compressedMarker = root + 'recordsCompressed_v1';
    let migration = null, compression = null, recordCache = null, recordsMigrated = false, archiveRevision = null;
    const cache = new Map();
    const payloads = new WeakMap();
    // Userscript managers preload GM storage before injection. Keep the large
    // record payload compressed; stamina/ordering metadata stays directly readable.
    async function pack(value) {
        const stream = new Blob([JSON.stringify(value)]).stream().pipeThrough(new CompressionStream('gzip'));
        const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 32768)
            binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
        return 'gzip:' + btoa(binary);
    }
    async function unpack(value) {
        if (typeof value !== 'string') return value; // Existing uncompressed archives.
        if (!value.startsWith('gzip:')) throw new Error('Unknown JPX archive encoding');
        const bytes = Uint8Array.from(atob(value.slice(5)), char => char.charCodeAt(0));
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
        return JSON.parse(await new Response(stream).text());
    }
    function payload(event) {
        if (!payloads.has(event)) payloads.set(event, unpack(event.record ?? event.records));
        return payloads.get(event);
    }
    function checkReset(before) {
        if (get(root + 'reset') !== before) throw new Error('JPX data was reset while saving records');
    }
    async function compressRecords() {
        if (get(compressedMarker)) return;
        if (compression) return compression;
        compression = (async () => {
            const reset = get(root + 'reset');
            for (const key of keys()) {
                const field = key.startsWith(root + 'result:') ? 'record'
                    : key.startsWith(root + 'legacyRecords:') || key.startsWith(root + 'batch:') ? 'records' : null;
                if (!field) continue;
                const event = get(key);
                if (!event?.[field] || typeof event[field] === 'string') continue;
                const packed = await pack(event[field]);
                checkReset(reset);
                const current = get(key);
                if (!current || typeof current[field] === 'string') continue;
                if (JSON.stringify(current) !== JSON.stringify(event)) throw new Error('JPX archive changed during compression');
                set(key, { ...event, [field]: packed });
            }
            set(compressedMarker, true);
            recordCache = null; notify('records');
        })();
        try { await compression; } finally { compression = null; }
    }
    // Recovery copies and settled results are rarely read, yet the manager loads
    // them before every page. Pack copies once their host has migrated, and fold
    // results older than the stamina window into one bundle per pass.
    // Decide from key names alone: ordinary page loads must not read payloads.
    const packPending = root + 'packPending', packedMarker = root + 'recoveryPacked_v1', settledDays = 1, bundleMinimum = 20;
    const packDue = () => !!get(packPending) || !get(packedMarker);
    const settledKeys = all => {
        const cutoff = day(now() - settledDays * 86400000);
        return all.filter(key => {
            if (!key.startsWith(root + 'result:')) return false;
            // Receipt IDs carry the battle timestamp: "YYYY-MM-DD hh:mm:ss" or epoch ms.
            try {
                const stamp = JSON.parse(decodeURIComponent(key.slice((root + 'result:').length)))[1];
                const date = Number.isFinite(Number(stamp)) && String(stamp).trim() ? day(Number(stamp)) : /^\d{4}-\d{2}-\d{2}/.test(stamp) ? stamp.slice(0, 10) : '';
                return !!date && date < cutoff;
            } catch { return false; }
        });
    };
    let compaction = null;
    async function compactStorage() {
        if (!enabled) return;
        if (compaction) return compaction;
        compaction = (async () => {
            const all = keys();
            if (!packDue() && settledKeys(all).length < bundleMinimum) return;
            const lock = get(root + 'compacting');
            if (lock && lock.until > now()) return;
            set(root + 'compacting', { until: now() + 60000 });
            try { await compact(); } finally { gm.remove(root + 'compacting'); }
        })();
        try { await compaction; } finally { compaction = null; }
    }
    async function compact() {
        const reset = get(root + 'reset'), all = keys();
        // Write only if the value is unchanged since it was read.
        const replace = (key, before, after) => {
            checkReset(reset);
            if (JSON.stringify(get(key)) !== JSON.stringify(before)) return;
            set(key, after);
        };
        if (packDue()) {
            // Clear first: a copy written during this pass raises the flag again.
            gm.remove(packPending);
            try {
                for (const key of all.filter(key => key.startsWith(root + 'revision:'))) {
                    const revision = get(key);
                    if (typeof revision?.value !== 'string' || revision.value.length < 1024) continue;
                    const { value, ...rest } = revision;
                    replace(key, revision, { ...rest, packed: await pack(value) });
                }
                for (const key of all.filter(key => key.startsWith(root + 'legacy:'))) {
                    const snapshot = get(key);
                    // The snapshot is read again only until its own host has migrated.
                    if (!snapshot?.values || !get(root + 'settingsMigrated:' + encode(snapshot.origin))) continue;
                    const { values, ...rest } = snapshot;
                    replace(key, snapshot, { ...rest, packed: await pack(values) });
                }
                set(packedMarker, true);
            } catch (error) { set(packPending, true); throw error; }
        }
        const settled = [];
        for (const key of settledKeys(all)) { const event = get(key); if (event?.order) settled.push([key, event]); }
        if (settled.length >= bundleMinimum) {
            const events = [];
            for (const [, event] of settled) events.push({ ...event, record: await unpack(event.record) });
            events.sort((a, b) => a.order.localeCompare(b.order));
            const packed = await pack(events);
            checkReset(reset);
            // Bundle first: an interrupted pass leaves duplicates, which reads
            // collapse by receipt order, never a missing result.
            set(root + 'bundle:' + events.at(-1).order, { order: events.at(-1).order, count: events.length, events: packed });
            for (const [key, event] of settled) {
                if (JSON.stringify(get(key)) !== JSON.stringify(event)) continue;
                gm.remove(key);
                // Day pointers serve only today's stamina lookup.
                if (event.stamina) gm.remove(root + 'day:' + event.stamina.world + ':' + event.stamina.date + ':' + encode(event.id));
            }
            recordCache = null; notify('records');
        }
    }
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
        set(markerKey, true); set(packPending, true);
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
            set(packPending, true);
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
        migrateSettings();
        archiveRevision = get(root + 'recordsRevision');
        gm.listen(root + 'change', (_key, _old, change, remote) => { if (remote) refresh(change); });
    }
    async function ensureRecords(readLegacy) {
        if (!enabled) return;
        if (!recordsMigrated && !get(recordMarker)) {
            if (!migration) migration = (async () => {
                const reset = get(root + 'reset');
                const records = await pack(reset ? [] : await readLegacy());
                checkReset(reset);
                // A single committed value makes migration atomic and retryable.
                set(root + 'legacyRecords:' + encode(origin), { origin, records });
                set(recordMarker, true);
                recordCache = null; notify('records');
            })();
            try { await migration; } finally { migration = null; }
        }
        recordsMigrated = true;
        await compressRecords();
        await compactStorage();
    }
    function operations() {
        const currentRevision = get(root + 'recordsRevision');
        if (currentRevision !== archiveRevision) { archiveRevision = currentRevision; recordCache = null; }
        if (recordCache) return recordCache;
        const result = { legacy: [], results: [], bundles: [], batches: [], baselines: new Map(), overrides: new Map() };
        for (const key of keys()) {
            if (key.startsWith(root + 'legacyRecords:')) result.legacy.push(get(key));
            else if (key.startsWith(root + 'result:')) result.results.push(get(key));
            else if (key.startsWith(root + 'bundle:')) result.bundles.push(get(key));
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
    async function allRecords() {
        const ops = operations(), map = new Map(), receipts = new Map();
        for (const batch of ops.legacy) for (const record of await payload(batch)) { const id = idOf(record); if (!map.has(id)) map.set(id, clone(record)); }
        // A receipt can briefly exist both loose and bundled; its order is unique.
        for (const bundle of ops.bundles) {
            if (!payloads.has(bundle)) payloads.set(bundle, unpack(bundle.events));
            for (const event of await payloads.get(bundle)) receipts.set(event.order, event);
        }
        for (const event of ops.results) receipts.set(event.order, event);
        const results = [...receipts.values()];
        const events = [...results, ...ops.batches].sort((a, b) => a.order.localeCompare(b.order));
        for (const event of events) {
            if (event.record) map.set(event.id, clone(await payload(event)));
            else if (event.type === 'import') {
                if (!event.merge) map.clear();
                for (const record of await payload(event)) { const id = idOf(record); if (!event.merge || !map.has(id)) map.set(id, clone(record)); }
            } else if (event.type === 'delete') for (const id of event.ids) map.delete(id);
        }
        // Allocate daily free stamina once in deterministic completion order,
        // including concurrent results. Archive deletion never erases usage.
        const totals = new Map();
        for (const event of results.sort((a, b) => a.order.localeCompare(b.order))) {
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
    async function saveResult(record, cost) {
        const key = resultKey(record);
        if (get(key)) return;
        const reset = get(root + 'reset'), order = stamp(), saved = clone(record); saved.sharedResult = order;
        const event = { order, id: idOf(record), record: saved };
        if (cost) event.stamina = clone(cost);
        event.record = await pack(saved);
        checkReset(reset);
        if (get(key)) return;
        // Write the small lookup before the atomic receipt. An interrupted write
        // leaves an inert pointer, never an unrecorded charge. Stable receipt IDs
        // also deduplicate two hosts settling the same battle around midnight.
        if (event.stamina) set(root + 'day:' + event.stamina.world + ':' + event.stamina.date + ':' + encode(event.id), key);
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
        async importRecords(records, merge) {
            const reset = get(root + 'reset'), packed = await pack(records);
            checkReset(reset);
            batch({ type: 'import', records: packed, merge });
        },
        deleteRecords: ids => batch({ type: 'delete', ids }), reset,
        usage: world => ({ lastUpdate: now(), staminaCost: stamina(world, day(now())) }),
        // Recovery copies may be packed; callers receive them restored.
        backups: () => enabled ? Promise.all(keys().filter(key => key.startsWith(root + 'legacy:')).map(async key => {
            const { packed, ...snapshot } = get(key); return packed ? { ...snapshot, values: await unpack(packed) } : snapshot;
        })) : Promise.resolve([]),
        revisions: () => enabled ? Promise.all(keys().filter(key => key.startsWith(root + 'revision:')).map(async key => {
            const { packed, ...revision } = get(key); return packed ? { ...revision, value: await unpack(packed) } : revision;
        })) : Promise.resolve([]),
        compact: compactStorage,
        baseline, setBaseline(world, date, value) {
            if (!Number.isFinite(value) || value < 0) throw new Error('Invalid stamina baseline');
            set(root + 'staminaBase:' + world + ':' + date, value); recordCache = null; notify('records');
        },
        restore(snapshot) { for (const [key, value] of Object.entries(snapshot.values)) if (config(key)) { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } }
    };
}

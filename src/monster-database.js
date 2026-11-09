// Public data: https://hv-monster.skk.moe/ (Sukka Monster Database).
// Store only the fields JPX consumes. IndexedDB avoids reading a full database
// on navigation or putting megabytes into the synchronous settings store.
function createJpxMonsterDatabase({ indexedDB, request, now = Date.now, changed = () => {} }) {
    const classes = new Set('Arthropod Avion Beast Celestial Daimon Dragonkin Elemental Giant Humanoid Mechanoid Reptilian Sprite Undead Common Rare Legendary Ultimate'.split(' '));
    const attacks = new Set('Piercing Crushing Slashing Fire Cold Wind Elec Holy Dark Void'.split(' '));
    const pending = new Map();
    let opening;
    const day = () => new Date(now()).toISOString().slice(0, 10);
    function normalize(row) {
        if (!row || !Number.isSafeInteger(row.monsterId) || row.monsterId <= 0 ||
            typeof row.monsterName !== 'string' || !row.monsterName.trim() || row.monsterName.length > 256 ||
            !classes.has(row.monsterClass) || !attacks.has(row.attack) ||
            !Number.isSafeInteger(row.plvl) || row.plvl < 0 ||
            typeof row.lastUpdate !== 'string' || !Number.isFinite(Date.parse(row.lastUpdate))) return null;
        return { monsterId: row.monsterId, monsterName: row.monsterName, monsterClass: row.monsterClass,
            attack: row.attack, plvl: row.plvl, lastUpdate: row.lastUpdate };
    }
    function open() {
        if (!opening) opening = new Promise((resolve, reject) => {
            const req = indexedDB.open('jpx-monster-database-v1', 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                const records = db.createObjectStore('monsters', { keyPath: ['world', 'monsterId'] });
                records.createIndex('name', ['world', 'monsterName']);
                db.createObjectStore('meta');
                db.createObjectStore('scans', { keyPath: ['world', 'monsterId'] }).createIndex('name', ['world', 'monsterName']);
            };
            req.onerror = () => reject(req.error);
            req.onblocked = () => reject(new Error('Monster cache is blocked by another tab'));
            req.onsuccess = () => { req.result.onversionchange = () => { req.result.close(); opening = null; }; resolve(req.result); };
        }).catch(error => { opening = null; throw error; });
        return opening;
    }
    const value = req => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
    const done = tx => new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = tx.onabort = () => reject(tx.error || new Error('Monster cache write aborted')); });
    async function metadata(world) {
        const db = await open();
        return await value(db.transaction('meta').objectStore('meta').get(world)) || {};
    }
    async function claimRefresh(world) {
        const db = await open(), tx = db.transaction('meta', 'readwrite'), complete = done(tx);
        const store = tx.objectStore('meta'), req = store.get(world);
        let claimed = false;
        req.onsuccess = () => {
            const meta = req.result || {};
            if (meta.day === day() || meta.retryAfter > now()) return;
            claimed = true;
            // This read and write share one transaction, so different tabs do
            // not both start the large daily download. Failure expires the lease.
            store.put({ ...meta, retryAfter: now() + 5 * 60 * 1000 }, world);
        };
        await complete; return claimed;
    }
    async function refresh(world) {
        if (pending.has(world)) return pending.get(world);
        const job = (async () => {
            if (!await claimRefresh(world)) return false;
            const rows = await request(world);
            if (!Array.isArray(rows) || !rows.length || rows.length > 200000) throw new Error('Invalid monster database response');
            const records = [], ids = new Set();
            for (let offset = 0; offset < rows.length; offset += 500) {
                for (const input of rows.slice(offset, offset + 500)) {
                    const row = normalize(input);
                    if (!row) continue;
                    if (ids.has(row.monsterId)) throw new Error('Monster database contains duplicate IDs');
                    ids.add(row.monsterId); records.push(row);
                }
                if (offset + 500 < rows.length) await new Promise(resolve => setTimeout(resolve, 0));
            }
            if (records.length < rows.length * 0.95) throw new Error('Monster database contains invalid records');
            const db = await open(), tx = db.transaction(['monsters', 'meta'], 'readwrite'), complete = done(tx);
            const store = tx.objectStore('monsters');
            // Replace just this world's snapshot, atomically. Readers see the old
            // snapshot until commit; failed downloads/writes never erase it.
            store.delete(IDBKeyRange.bound([world, 0], [world, Number.MAX_SAFE_INTEGER]));
            let offset = 0;
            const batch = () => {
                try {
                    const end = Math.min(offset + 250, records.length);
                    let last;
                    for (; offset < end; offset++) last = store.put({ ...records[offset], world });
                    // Continue inside IDB success events: the transaction remains
                    // atomic while each small batch yields to rendering/input.
                    if (offset < records.length) last.onsuccess = batch;
                    else tx.objectStore('meta').put({ day: day(), count: records.length }, world);
                } catch { tx.abort(); }
            };
            batch();
            await complete;
            return true;
        })().finally(() => pending.delete(world));
        pending.set(world, job);
        return job;
    }
    async function read(world, targets) {
        const result = {}, db = await open();
        const tx = db.transaction(['monsters', 'scans']);
        const store = tx.objectStore('monsters'), scans = tx.objectStore('scans');
        await Promise.all(targets.map(async target => {
            const base = target.id > 0 ? store.get([world, target.id]) : store.index('name').get([world, target.name]);
            // An authoritative spawned ID must never fall back to a different
            // monster with the same name. Name lookup is only for mid-round reloads.
            const scan = target.id > 0 ? scans.get([world, target.id]) : scans.index('name').get([world, target.name]);
            const [cached, local] = await Promise.all([value(base), value(scan)]);
            let row = local && (!cached || Date.parse(local.lastUpdate) >= Date.parse(cached.lastUpdate)) ? local : cached;
            row = row ? normalize(row) : null;
            if (row) result[target.key] = { ...row };
        }));
        return result;
    }
    async function lookup(world, targets, download = true) {
        const cached = await read(world, targets);
        if (!download) return cached;
        if (Object.keys(cached).length) {
            refresh(world).then(updated => { if (updated) changed(); }).catch(error => console.warn('JPX monster database refresh failed; using cached data.', error));
            return cached;
        }
        try { if (await refresh(world)) return await read(world, targets); }
        catch (error) { console.warn('JPX monster database unavailable.', error); }
        return cached;
    }
    async function scan(world, record) {
        const row = normalize(record);
        if (!row) return false;
        const db = await open(), tx = db.transaction('scans', 'readwrite'), complete = done(tx);
        tx.objectStore('scans').put({ ...row, world }); await complete;
        return true;
    }
    return { lookup, refresh, scan, normalize, metadata };
}

// Parse only the fields displayed/used by JPX. Both old and new Scan layouts
// use labelled table cells; parsing detached DOM also handles translation wrappers.
function parseJpxMonsterScan(html, targets, document, timestamp = Date.now()) {
    if (!html?.includes('Scanning')) return null;
    const template = document.createElement('template'); template.innerHTML = html;
    const root = template.content;
    const name = root.textContent.match(/Scanning\s+(.+?)\.\.\./)?.[1]?.trim();
    const target = targets.find(item => item.name === name);
    if (!target?.id) return null;
    const fields = {};
    for (const cell of root.querySelectorAll('td')) {
        const label = cell.textContent.trim().replace(/:$/, '');
        if (['Monster Class', 'Melee Attack', 'Attack Type', 'Attack'].includes(label)) fields[label] = cell.nextElementSibling?.textContent.trim();
    }
    const type = fields['Monster Class']?.match(/^([A-Za-z]+)(?:,\s*Power Level (\d+))?$/);
    const attack = (fields['Melee Attack'] || fields['Attack Type'] || fields.Attack)?.match(/^([A-Za-z]+)(?:[;\s]|$)/)?.[1];
    if (!type || !attack) return null;
    return { monsterId: target.id, monsterName: name, monsterClass: type[1],
        plvl: Number(type[2] || 0), attack, lastUpdate: new Date(timestamp).toISOString() };
}

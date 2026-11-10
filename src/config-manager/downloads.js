function createJpxStoreDownloads() {
    const endpoint = 'https://jpx-plus-downloads.lernsc.workers.dev/v1/downloads';
    const seedKey = 'jpx-config-download-seed-v1', receiptKey = 'jpx-config-download-day-v1:';
    const totals = new Map(), reads = new Map(), writes = new Map(), attempts = new Map();
    const validId = id => Number.isSafeInteger(id) && id > 0 && id <= 9999999999;
    const remember = (id, count) => {
        if (!Number.isSafeInteger(count) || count < 0) throw Error('Invalid download count');
        const value = Math.max(totals.get(id)?.count || 0, count); totals.set(id, { count: value, at: Date.now() }); return value;
    };
    function request(method, suffix = '', data) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'function') { reject(Error('Transport unavailable')); return; }
            const url = endpoint + suffix;
            GM_xmlhttpRequest({ method, url, timeout: 4000, anonymous: true, redirect: 'error',
                headers: { Accept: 'application/json', ...(data ? { 'Content-Type': 'application/json' } : {}) },
                ...(data ? { data: JSON.stringify(data) } : {}),
                onload(response) {
                    try {
                        if (response.status !== 200 || response.finalUrl && response.finalUrl !== url ||
                            typeof response.responseText !== 'string' || response.responseText.length > 32000) throw Error('Counter unavailable');
                        resolve(JSON.parse(response.responseText));
                    } catch (error) { reject(error); }
                }, onerror: () => reject(Error('Counter unavailable')), ontimeout: () => reject(Error('Counter timeout')), onabort: () => reject(Error('Counter cancelled')) });
        });
    }
    async function counts(ids) {
        const wanted = [...new Set(ids.filter(validId))].slice(0, 100);
        const missing = wanted.filter(id => Date.now() - (totals.get(id)?.at ?? -Infinity) > 60000 && Date.now() - (attempts.get(id) ?? -Infinity) > 10000);
        if (missing.length) {
            const key = missing.sort((a, b) => a - b).join(',');
            if (!reads.has(key)) {
                missing.forEach(id => attempts.set(id, Date.now()));
                const pending = request('GET', '?ids=' + key).then(value => {
                    if (!value?.counts || typeof value.counts !== 'object' || Array.isArray(value.counts)) return;
                    for (const id of missing) if (Object.hasOwn(value.counts, id)) remember(id, value.counts[id]);
                }).catch(() => {}).finally(() => reads.delete(key));
                reads.set(key, pending);
            }
            await reads.get(key);
        }
        await Promise.all([...reads.values()]);
        return Object.fromEntries(wanted.filter(id => totals.has(id)).map(id => [id, totals.get(id).count]));
    }
    async function record(id) {
        if (!validId(id)) return null;
        if (writes.has(id)) return writes.get(id);
        const pending = (async () => {
            try {
                if (typeof GM_getValue !== 'function' || typeof GM_setValue !== 'function') return null;
                const day = new Date().toISOString().slice(0, 10);
                if (GM_getValue(receiptKey + id) === day) return null;
                let seed = GM_getValue(seedKey);
                if (typeof seed !== 'string' || !/^[a-f0-9]{64}$/.test(seed)) {
                    seed = [...crypto.getRandomValues(new Uint8Array(32))].map(byte => byte.toString(16).padStart(2, '0')).join('');
                    GM_setValue(seedKey, seed); if (GM_getValue(seedKey) !== seed) return null;
                }
                // Each config and UTC day gets an unrelated public token; the seed never leaves GM storage.
                const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed + ':' + id + ':' + day));
                const visitor = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
                const result = await request('POST', '', { configId: id, day, visitor });
                if (result?.configId !== id || result.day !== day || typeof result.counted !== 'boolean') return null;
                const count = remember(id, result.count); GM_setValue(receiptKey + id, day); return count;
            } catch { return null; }
        })().finally(() => writes.delete(id));
        writes.set(id, pending); return pending;
    }
    return Object.freeze({ counts, record, peek: id => totals.get(id)?.count ?? null });
}

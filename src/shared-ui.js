const JPX_STATS_DATA_CSS = `
    #settings-container #panel_stats { scrollbar-gutter:stable; }
    .jpx-stats-data { --jpx-motion:160ms; color:#392d25; font:13px/1.45 Arial,Helvetica,sans-serif; min-width:0; max-width:100%; text-align:left; }
    .jpx-stats-data * { box-sizing:border-box; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) h3 { margin:0 0 12px; font-size:14px; color:#5c0d11; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) h4 { margin:0 0 8px; font-size:13px; font-weight:600; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) .jpx-stats-toolbar { display:flex; flex-wrap:wrap; gap:8px; margin:0; }
    .jpx-stats-data-section { padding:16px 0; }
    .jpx-stats-data .jpx-shared-data { border-top:1px solid #c8b49b; border-bottom:1px solid #c8b49b; min-width:0; }
    .jpx-shared-data > summary { display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:48px; padding:8px 4px 8px 0; cursor:pointer; list-style:none; color:#5c0d11; font-weight:600; }
    .jpx-shared-data > summary::-webkit-details-marker { display:none; }
    .jpx-shared-data > summary svg { width:18px; height:18px; flex:none; transition:transform var(--jpx-motion) ease-out; }
    .jpx-shared-data[open] > summary svg { transform:rotate(180deg); }
    .jpx-shared-data-body { padding:0 0 16px; display:grid; gap:20px; }
    .jpx-shared-data-row { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:8px 16px; padding:8px 0; }
    .jpx-shared-data-actions { display:flex; gap:8px; flex:none; }
    .jpx-shared-data-source { min-width:0; overflow-wrap:anywhere; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) :is(button,select,input) { font:inherit; margin:0; min-height:36px; max-width:100%; border:1px solid #c8b49b; border-radius:2px; background:#fffdf7; color:#5c0d11; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) button { padding:7px 12px; cursor:pointer; white-space:normal; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) button:hover { background:#f1e2c5; }
    .jpx-stats-data button:disabled { opacity:.6; cursor:default; }
    .jpx-stats-data :focus-visible { outline:2px solid #9b4e03; outline-offset:2px; }
    .jpx-shared-data-row select { min-width:0; width:100%; padding:6px; }
    .jpx-shared-data-stamina label { display:grid; grid-template-columns:minmax(0,1fr) 96px; align-items:center; gap:12px; min-width:0; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) .jpx-shared-data-stamina input[type=number] { width:100%; min-width:0; min-height:36px; field-sizing:fixed; padding:6px; background:#fffdf7; color:#392d25; border-color:#c8b49b; }
    .jpx-stats-data-maintenance { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px 0; flex-wrap:wrap; border-top:1px solid #c8b49b; }
    .jpx-shared-data + .jpx-stats-data-maintenance { border-top:0; }
    :is(.jpx-stats-data,#settings-container .jpx-stats-data) .jpx-stats-transfer { margin:16px 0 0; padding:12px 0 0; border:0; border-top:1px solid #c8b49b; background:transparent; }
    .jpx-stats-data .jpx-stats-transfer label { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin:12px 0; }
    .jpx-stats-data .jpx-stats-transfer select { min-width:0; padding:6px; }
    @media(max-width:650px),(pointer:coarse) {
        :is(.jpx-stats-data,#settings-container .jpx-stats-data) :is(button,select,input) { min-height:44px; }
        .jpx-shared-data-row { gap:8px; }
        .jpx-shared-data-revision { grid-template-columns:minmax(0,1fr); }
        .jpx-shared-data-revision .jpx-shared-data-actions { justify-self:end; }
        .jpx-stats-data-section { padding-top:12px; }
        :is(.jpx-stats-data,#settings-container .jpx-stats-data) .jpx-shared-data-stamina input[type=number] { font-size:16px; min-height:44px; }
    }
    @media(prefers-reduced-motion:reduce) { .jpx-stats-data { --jpx-motion:0ms; } }
`;

function sharedText(key) {
    return t('cShared.' + key);
}

async function ensureJpxSharedRecords() {
    return jpxShared.ensureRecords(async () => {
        const db = await openDB();
        try {
            return await new Promise((resolve, reject) => {
                const tx = db.transaction('battleRecords', 'readonly');
                const request = tx.objectStore('battleRecords').getAll();
                tx.oncomplete = () => resolve(request.result);
                tx.onabort = () => reject(tx.error || new Error('Legacy archive read failed'));
            });
        } finally { db.close(); }
    });
}

function onJpxSharedChange(change) {
    const key = change.key;
    if (key === 'jpx_recordsChanged') { window.dispatchEvent(new Event('jpx:records-changed')); return; }
    // Shared settings are authoritative, but never resume a running battle.
    if (key === 'jpx_configLibrary_v1') {
        // Saving/renaming an unused archive is not an instruction to apply it.
        // A changed active selection is relevant even if the native rules match.
        const before = jpxSelectedConfig?.mode || '';
        refreshJpxSelectedConfig();
        if (before !== (jpxSelectedConfig?.mode || '')) pauseForJpxConfigApplication();
        window.dispatchEvent(new Event('jpx:config-library'));
    }
    if ([prefix + 'cfgBattle' + isekaiSuffix, prefix + 'userKeybinds' + isekaiSuffix].includes(key)) {
        pauseForJpxConfigApplication();
        if (key === prefix + 'cfgBattle' + isekaiSuffix) loadBattleConfig();
        else userKeybinds = JSON.parse(localStorage.getItem(prefix + 'userKeybinds' + isekaiSuffix) || 'null') || { ...KEYBINDS };
        refreshJpxSelectedConfig();
        jpxPanelManager.refreshAppearance?.();
        document.getElementById('settings-container')?.jpxConfigApplied?.(key.includes('userKeybinds') ? { shortcuts: userKeybinds } : cfgBattle, 'battle');
    }
    if (key === prefix + 'cfgStats') { loadStatsSettingsConfig(); document.getElementById('settings-container')?.jpxConfigApplied?.(cfgStats, 'stats'); }
    // Existing theme, apply-signal and cleanup listeners can consume the same
    // invalidation path; no native storage or third-party prototype is changed.
    window.dispatchEvent(new StorageEvent('storage', { key, oldValue: change.oldValue ?? null,
        newValue: change.newValue ?? null, storageArea: window.localStorage, url: location.href }));
}

function renderJpxSharedDataActions(parent) {
    if (!jpxShared.enabled) return;
    const section = document.createElement('details'); section.className = 'jpx-shared-data';
    const title = document.createElement('summary'); title.textContent = sharedText('title'); title.append(createSettingsIcon('chevronDown'));
    const body = document.createElement('div'); body.className = 'jpx-shared-data-body'; section.append(title,body); parent.append(section);
    const group = (caption, tooltip) => {
        const block = document.createElement('section'), heading = document.createElement('h4'); heading.textContent = caption;
        if (tooltip) heading.title = tooltip;
        block.append(heading); body.append(block); return block;
    };
    const download = (name, value) => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
    };
    const restore = snapshot => {
        if (!window.confirm(sharedText('confirm'))) return;
        pauseForJpxConfigApplication(); jpxShared.restore(snapshot);
        onJpxSharedChange({ key: prefix + 'cfgBattle' + isekaiSuffix });
        loadStatsSettingsConfig();
        jpxUtils.createToast(sharedText('saved'));
    };
    const backups = jpxShared.backups();
    if (backups.length) {
        const block = group(sharedText('backupSection'));
        for (const snapshot of backups) {
            const row = document.createElement('div'); row.className = 'jpx-shared-data-row';
            const label = document.createElement('span'); label.className = 'jpx-shared-data-source'; label.textContent = new URL(snapshot.origin).hostname; row.append(label);
            const actions = document.createElement('div'); actions.className = 'jpx-shared-data-actions'; row.append(actions);
            jpxUtils.createButton(actions, { text:t('cM.export'), history:false, onClick:() => download('jpx-before-sharing-' + new URL(snapshot.origin).hostname + '.json', snapshot) }).title = sharedText('backup');
            jpxUtils.createButton(actions, { text:sharedText('restoreAction'), history:false, onClick:() => restore(snapshot) }).title = sharedText('restore'); block.append(row);
        }
    }
    const revisions = jpxShared.revisions();
    if (revisions.length) {
        const block = group(sharedText('historySection'));
        const row = document.createElement('div'); row.className = 'jpx-shared-data-row jpx-shared-data-revision';
        const select = document.createElement('select'); select.setAttribute('aria-label', sharedText('restoreRevision'));
        revisions.slice().reverse().forEach((revision, index) => { const option = document.createElement('option'); option.value = index; option.textContent = revision.key + ' · ' + revision.source + ' · ' + (revision.at ? new Date(revision.at).toLocaleString() : index + 1); select.append(option); });
        row.append(select);
        const actions = document.createElement('div'); actions.className = 'jpx-shared-data-actions'; row.append(actions);
        jpxUtils.createButton(actions, { text:t('cM.export'), history:false, onClick:() => download('jpx-shared-settings-history.json', revisions) }).title = sharedText('history');
        jpxUtils.createButton(actions, { text:sharedText('restoreAction'), history:false, onClick:() => { const revision = revisions.slice().reverse()[Number(select.value)]; restore({values:{[revision.key]:revision.value}}); } }).title = sharedText('restoreRevision'); block.append(row);
    }
    const date = new Date().toISOString().slice(0, 10);
    const stamina = group(sharedText('quotaShort') + ' · ' + date + ' UTC', sharedText('quotaHelp'));
    for (const world of ['Persistent', 'Isekai']) {
        const row = document.createElement('div'); row.className = 'jpx-shared-data-row jpx-shared-data-stamina';
        const label = document.createElement('label'); label.textContent = t('sP.' + world);
        const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.step = '0.01'; input.value = jpxShared.baseline(world, date);
        input.dataset.sharedStamina = world; label.append(input); row.append(label);
        jpxUtils.createButton(row, { text: sharedText('save'), history: false, onClick: () => {
            if (!input.value.trim() || !input.reportValidity()) return;
            jpxShared.setBaseline(world, date, Number(input.value)); window.dispatchEvent(new Event('jpx:records-changed')); return sharedText('saved');
        } }); stamina.append(row);
    }
}

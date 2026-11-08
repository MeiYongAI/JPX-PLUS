function sharedText(key) {
    const zh = /导出|匯出|汇出/.test(t('cS.exportDB'));
    const labels = {
        title: ['Primary / alt shared data', '主站 / alt 共享数据'],
        scope: ['The same userscript installation shares settings, archives and daily stamina between hosts. Persistent and Isekai remain separate. The first visited host supplies the initial settings; both old copies remain available below.', '同一份油猴脚本在主站和 alt 共用配置、战斗记录和当日体力账本；主世界与异世界分开。首次访问的站点提供初始配置，两站旧配置均保留在下方。'],
        backup: ['Download pre-sharing settings', '下载共享前的配置备份'],
        restore: ['Use this host’s old settings', '使用此站点的旧配置'],
        confirm: ['Replace shared settings with this saved copy? Current settings are retained as recoverable revisions. Battle automation will pause.', '将此备份设为两站共用配置？现用配置会保留为可恢复版本，自动战斗会暂停。'],
        history: ['Download previous shared settings', '下载共享配置历史版本'],
        restoreRevision: ['Restore previous shared setting', '恢复共享配置历史项'],
        quota: ['Stamina spent before sharing today (UTC)', '今天启用共享前已消耗体力（UTC）'],
        quotaHelp: ['Old per-host totals cannot prove whether battles overlap. Migration uses the larger total, never blindly adds both. Correct the pre-sharing total here if necessary; new shared battles are added separately. Visit each host once to discover its old data.', '旧版两站只有体力汇总，无法判断是否包含重复战斗；迁移暂取较大值，不直接相加。可在这里修正启用共享前的总消耗，新版战斗另行逐场累计。两站各打开一次，才能发现各自的旧数据。'],
        save: ['Save', '保存'], saved: ['Saved', '已保存'],
        resetScope: ['This also deletes shared settings and battle records for BOTH primary and alt, in both worlds.', '此操作也会删除主站与 alt 共用的配置和战斗记录，覆盖两个世界。'],
        fail: ['Shared data could not be saved. Original data was retained.', '共享数据保存失败，原数据已保留。']
    };
    return labels[key]?.[zh ? 1 : 0] || key;
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
    const section = document.createElement('section'); section.className = 'jpx-shared-data';
    const style = document.createElement('style');
    style.textContent = '.jpx-shared-data{max-width:100%;overflow-wrap:anywhere}.jpx-shared-data .jpx-stats-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;align-items:center}.jpx-shared-data label{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.jpx-shared-data select{max-width:100%;min-width:0}.jpx-shared-data input{width:100px;max-width:100%}';
    const title = document.createElement('h3'); title.textContent = sharedText('title');
    const help = document.createElement('p'); help.className = 'jpx-stats-help'; help.textContent = sharedText('scope');
    section.append(style, title, help); parent.append(section);
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
    for (const snapshot of jpxShared.backups()) {
        const row = document.createElement('div'); row.className = 'jpx-stats-toolbar';
        const label = document.createElement('span'); label.textContent = snapshot.origin; row.append(label);
        jpxUtils.createButton(row, { text: sharedText('backup'), history: false, onClick: () => download('jpx-before-sharing-' + new URL(snapshot.origin).hostname + '.json', snapshot) });
        jpxUtils.createButton(row, { text: sharedText('restore'), history: false, onClick: () => restore(snapshot) }); section.append(row);
    }
    const revisions = jpxShared.revisions();
    if (revisions.length) {
        const row = document.createElement('div'); row.className = 'jpx-stats-toolbar';
        const select = document.createElement('select'); select.setAttribute('aria-label', sharedText('restoreRevision'));
        revisions.slice().reverse().forEach((revision, index) => { const option = document.createElement('option'); option.value = index; option.textContent = revision.key + ' · ' + revision.source + ' · ' + (revision.at ? new Date(revision.at).toLocaleString() : index + 1); select.append(option); });
        row.append(select);
        jpxUtils.createButton(row, { text: sharedText('history'), history: false, onClick: () => download('jpx-shared-settings-history.json', revisions) });
        jpxUtils.createButton(row, { text: sharedText('restoreRevision'), history: false, onClick: () => { const revision = revisions.slice().reverse()[Number(select.value)]; restore({ values: { [revision.key]: revision.value } }); } }); section.append(row);
    }
    const note = document.createElement('p'); note.className = 'jpx-stats-help'; note.textContent = sharedText('quotaHelp'); section.append(note);
    const date = new Date().toISOString().slice(0, 10);
    for (const world of ['Persistent', 'Isekai']) {
        const row = document.createElement('div'); row.className = 'jpx-stats-toolbar';
        const label = document.createElement('label'); label.textContent = t('sP.' + world) + ' · ' + sharedText('quota');
        const input = document.createElement('input'); input.type = 'number'; input.min = '0'; input.step = '0.01'; input.value = jpxShared.baseline(world, date);
        input.dataset.sharedStamina = world; label.append(input); row.append(label);
        jpxUtils.createButton(row, { text: sharedText('save'), history: false, onClick: () => {
            if (!input.value.trim() || !input.reportValidity()) return;
            jpxShared.setBaseline(world, date, Number(input.value)); window.dispatchEvent(new Event('jpx:records-changed')); return sharedText('saved');
        } }); section.append(row);
    }
}

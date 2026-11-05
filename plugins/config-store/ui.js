function renderConfigStore(parent, hooks) {
    const doc = parent.ownerDocument;
    const tr = key => t('cStore.' + key);
    const el = (tag, text, className) => {
        const node = doc.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
    };
    const root = el('section', undefined, 'jpx-store');
    const toolbar = el('div', undefined, 'jpx-store-toolbar');
    const navigation = el('div', undefined, 'jpx-store-navigation');
    const account = el('div', undefined, 'jpx-store-account');
    const status = el('p', '', 'jpx-store-status');
    status.setAttribute('role', 'status');
    status.hidden = true;
    const stage = el('div', undefined, 'jpx-store-stage');
    const state = { view: 'browse', entries: [], query: '', kind: '', backpack: { query: '', kind: '' }, local: { world: '', style: '', battleType: '' }, user: null, editor: null, request: 0, login: null, disposed: false };
    const alive = () => !state.disposed && root.isConnected;
    function message(text, error = false) {
        status.textContent = text || '';
        status.hidden = !text;
        status.dataset.error = String(error);
    }
    function errorMessage(error) {
        const codes = { loginRequired: 'loginRequired', notConfigured: 'notConfigured', rateLimited: 'rateLimit',
            networkError: 'networkError', invalidConfig: 'invalidConfig', tooLarge: 'tooLarge', integrityFailed: 'integrityError',
            accessDenied: 'accessDenied', loginExpired: 'loginExpired', managerUnavailable: 'managerUnavailable',
            notOwner: 'notOwner', submissionClosed: 'submissionClosed', tooManySubmissions: 'tooManySubmissions',
            storageCorrupt: 'storageCorrupt', storageError: 'storageError', localNotFound: 'localNotFound' };
        return tr(codes[error?.code] || 'requestFailed');
    }
    function button(text, action, className) {
        const node = el('button', text, className);
        node.type = 'button';
        node.addEventListener('click', async () => {
            node.disabled = true;
            try { await action(node); }
            catch (error) { if (alive() && error?.name !== 'AbortError') message(errorMessage(error), true); }
            finally { if (node.isConnected) node.disabled = false; }
        });
        return node;
    }
    function field(text, input) {
        const label = el('label', undefined, 'jpx-store-field');
        label.append(el('span', text), input);
        return label;
    }
    function select(options, value) {
        const node = el('select');
        for (const [key, name] of options) { const option = el('option', name); option.value = key; node.append(option); }
        node.value = value;
        return node;
    }
    const kinds = () => [['battle-mode', tr('currentMode')], ['battle', tr('allBattle')], ['stats', tr('stats')]];
    const kindName = kind => kinds().find(([key]) => key === kind)?.[1] || kind;
    const worldName = world => tr(world === 'Isekai' ? 'isekai' : world === 'Persistent' ? 'persistent' : 'anyWorld');
    function modeName(mode) {
        if (!mode) return '';
        const split = mode.lastIndexOf('_'), style = mode.slice(0, split), battle = mode.slice(split + 1);
        return tr(style) + ' · ' + tr(battle);
    }
    function info(envelope, author) {
        return [author ? '@' + author : '', kindName(envelope.kind), worldName(envelope.world), modeName(envelope.mode)].filter(Boolean).join(' · ');
    }
    const browseButton = button(tr('browse'), () => browse());
    const mineButton = button(tr('mine'), () => backpack());
    navigation.append(browseButton, mineButton);
    toolbar.append(navigation, account);
    root.append(toolbar, status, stage);
    parent.append(root);
    function accountControls() {
        account.replaceChildren();
        if (state.user) {
            const logout = button('@' + state.user.login, async () => {
                await jpxConfigStore.logout(); state.user = null; accountControls();
                if (state.view === 'mine') await mine();
                message(tr('signedOut'));
            });
            logout.title = tr('signOut');
            logout.setAttribute('aria-label', tr('signOut') + ' · ' + state.user.login);
            account.append(logout);
        } else account.append(button(tr('signIn'), () => login()));
    }
    function open(view) {
        state.login?.abort(); state.login = null;
        state.view = view;
        state.request++;
        browseButton.setAttribute('aria-pressed', String(view === 'browse' || view === 'detail'));
        mineButton.setAttribute('aria-pressed', String(['backpack', 'backpackDetail', 'local', 'localDetail', 'mine', 'edit'].includes(view)));
        stage.replaceChildren(); message('');
        parent.scrollTop = 0;
        return state.request;
    }
    function heading(title, back) {
        const row = el('div', undefined, 'jpx-store-heading');
        if (back) row.append(button(tr('back'), back));
        row.append(el('h3', title)); stage.append(row);
    }
    function empty(text, action, label = tr('retry')) {
        const box = el('div', undefined, 'jpx-store-empty');
        box.append(el('p', text));
        if (action) box.append(button(label, action));
        stage.append(box);
    }
    async function browse(refresh = false) {
        const request = open('browse');
        const filters = el('div', undefined, 'jpx-store-filters');
        const search = el('input'); search.type = 'search'; search.value = state.query; search.placeholder = tr('search');
        search.setAttribute('aria-label', tr('search'));
        const filter = select([['', tr('allTypes')], ...kinds()], state.kind);
        filter.setAttribute('aria-label', tr('type'));
        filters.append(search, filter, button(tr('refresh'), () => browse(true)));
        const list = el('div', undefined, 'jpx-store-list');
        stage.append(filters, list);
        function render() {
            list.replaceChildren();
            const query = state.query.trim().toLocaleLowerCase();
            const entries = state.entries.filter(entry => (!state.kind || entry.kind === state.kind) &&
                [entry.title, entry.description, entry.author, modeName(entry.mode)].join(' ').toLocaleLowerCase().includes(query));
            if (!entries.length) { list.append(el('p', tr(state.entries.length ? 'noMatches' : 'noConfigs'), 'jpx-store-empty')); return; }
            for (const entry of entries) {
                const row = el('article', undefined, 'jpx-store-row');
                const title = button(entry.title, () => details(entry), 'jpx-store-title');
                row.append(title, el('p', info(entry, entry.author), 'jpx-store-meta'));
                if (entry.description) row.append(el('p', entry.description, 'jpx-store-excerpt'));
                list.append(row);
            }
        }
        search.addEventListener('input', () => { state.query = search.value; render(); });
        filter.addEventListener('change', () => { state.kind = filter.value; render(); });
        message(tr('loading'));
        try {
            const catalog = await jpxConfigStore.catalog({ refresh });
            if (!alive() || request !== state.request) return;
            state.entries = catalog.entries; message(''); render();
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true);
            list.append(button(tr('retry'), () => browse(true)));
        }
    }
    function configSummary(envelope) {
        const values = envelope.config;
        const counts = [];
        if (envelope.kind === 'stats') {
            for (const [key, name] of [['statsColumns', 'columns'], ['combatRows', 'combatRows'], ['revenueRows', 'revenueRows']])
                if (Array.isArray(values[key])) counts.push(tr(name) + ': ' + values[key].filter(item => item.disabled !== true).length);
        } else {
            let supports = 0, attacks = 0, code = 0;
            for (const mode of Object.values(values)) if (mode && Array.isArray(mode.supports) && Array.isArray(mode.attacks)) {
                supports += mode.supports.length; attacks += mode.attacks.length;
                code += [...mode.supports, ...mode.attacks].filter(rule => rule.type === 'kamisamaniNattaHi').length;
            }
            counts.push(tr('supports') + ': ' + supports, tr('attacks') + ': ' + attacks);
            if (code) counts.push(tr('customCode') + ': ' + code);
        }
        return counts.join(' · ');
    }
    function rawPreview(envelope) {
        const details = el('details', undefined, 'jpx-store-raw');
        details.append(el('summary', tr('viewConfig')));
        details.addEventListener('toggle', () => {
            if (details.open && details.childElementCount === 1) details.append(el('pre', JSON.stringify(envelope.config, null, 2)));
        });
        return details;
    }
    function downloadConfig(envelope, id) {
        const blob = new Blob([JSON.stringify(envelope.config, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = el('a');
        link.href = url; link.download = 'jpx-config-' + id + '.json'; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    function personalNavigation(view) {
        const tabs = el('div', undefined, 'jpx-store-navigation');
        for (const [key, action] of [['backpack', () => backpack()], ['local', () => local()], ['shared', () => mine()]]) {
            const tab = button(tr(key), action); tab.setAttribute('aria-pressed', String(view === key)); tabs.append(tab);
        }
        stage.append(tabs);
    }
    const localName = entry => entry.kind === 'battle-mode' ? modeName(entry.mode) : kindName(entry.kind);
    const localMeta = entry => [worldName(entry.world), entry.source === 'saved' ? tr('savedSettings') : tr('currentSettings')];
    const localDraft = entry => hooks.getDraft(entry.kind, entry.legacy ? undefined : { world: entry.world, mode: entry.mode });
    function chooseLocal(entry, previous) {
        const envelope = localDraft(entry);
        envelope.title = previous?.envelope.title || [localName(entry), worldName(entry.world)].join(' · ');
        envelope.description = previous?.envelope.description || '';
        return edit({ ...(previous || {}), envelope, source: entry });
    }
    function saveToBackpack(envelope, back, id) {
        return edit({ envelope: JSON.parse(JSON.stringify(envelope)), localOnly: true, backpackId: id, back });
    }
    function saveCurrent(entry) {
        const envelope = localDraft(entry);
        envelope.title = [localName(entry), worldName(entry.world)].join(' · ');
        return saveToBackpack(envelope, () => local());
    }
    async function backpack() {
        const request = open('backpack'); personalNavigation('backpack');
        try {
            const entries = await jpxConfigStore.backpackList();
            if (!alive() || request !== state.request) return;
            if (!entries.length) { empty(tr('emptyBackpack'), () => local(), tr('saveCurrent')); return; }
            const filters = el('div', undefined, 'jpx-store-filters');
            const search = el('input'); search.type = 'search'; search.value = state.backpack.query;
            search.placeholder = tr('searchBackpack'); search.setAttribute('aria-label', tr('searchBackpack'));
            const kind = select([['', tr('allTypes')], ...kinds()], state.backpack.kind); kind.setAttribute('aria-label', tr('type'));
            const list = el('div', undefined, 'jpx-store-list');
            filters.append(search, kind); stage.append(filters, list);
            function render() {
                list.replaceChildren();
                const query = state.backpack.query.trim().toLocaleLowerCase();
                const shown = entries.filter(({ envelope }) => (!state.backpack.kind || envelope.kind === state.backpack.kind) &&
                    [envelope.title, envelope.description, info(envelope)].join(' ').toLocaleLowerCase().includes(query));
                for (const entry of shown) {
                    const envelope = entry.envelope, row = el('article', undefined, 'jpx-store-row'); row.dataset.backpackId = entry.id;
                    row.append(button(envelope.title, () => backpackDetails(entry), 'jpx-store-title'),
                        button(tr('shareShort'), () => edit({ envelope: JSON.parse(JSON.stringify(envelope)), back: () => backpackDetails(entry) })),
                        el('p', info(envelope), 'jpx-store-meta'));
                    if (envelope.description) row.append(el('p', envelope.description, 'jpx-store-excerpt'));
                    list.append(row);
                }
                if (!shown.length) list.append(el('p', tr('noMatches'), 'jpx-store-empty'));
            }
            search.addEventListener('input', () => { state.backpack.query = search.value; render(); });
            kind.addEventListener('change', () => { state.backpack.kind = kind.value; render(); });
            render();
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => backpack());
        }
    }
    function backpackDetails(entry) {
        const envelope = entry.envelope;
        open('backpackDetail'); heading(envelope.title, () => backpack());
        stage.append(el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta'));
        if (envelope.description) stage.append(el('p', envelope.description, 'jpx-store-description'));
        const actions = el('div', undefined, 'jpx-store-actions');
        actions.append(button(tr('apply'), async () => { await hooks.importConfig(envelope); hooks.notify?.(tr('imported')); }, 'jpx-store-primary'),
            button(tr('shareShort'), () => edit({ envelope: JSON.parse(JSON.stringify(envelope)), back: () => backpackDetails(entry) })),
            button(tr('download'), () => downloadConfig(envelope, entry.id)),
            button(tr('editShare'), () => saveToBackpack(envelope, () => backpackDetails(entry), entry.id)),
            button(tr('delete'), async () => {
                if (!confirm(tr('deleteBackpackConfirm'))) return;
                await jpxConfigStore.backpackRemove(entry.id); await backpack();
            }));
        stage.append(actions, el('p', tr('importHint'), 'jpx-store-meta'), rawPreview(envelope));
    }
    function local(previous) {
        open('local');
        if (previous) heading(tr('chooseConfig'), () => edit(previous));
        else personalNavigation('local');
        let entries;
        if (hooks.listDrafts) entries = hooks.listDrafts();
        else {
            stage.append(el('p', tr('updateCore'), 'jpx-store-meta'));
            entries = kinds().flatMap(([kind]) => {
                try { const draft = hooks.getDraft(kind); return [{ kind, world: draft.world, mode: draft.mode, source: 'draft', legacy: true }]; }
                catch { return []; }
            });
        }
        if (previous?.id) entries = entries.filter(entry => entry.kind === previous.envelope.kind);
        const filters = el('div', undefined, 'jpx-store-local-filters');
        const list = el('div', undefined, 'jpx-store-list');
        const parts = entry => { const split = entry.mode?.lastIndexOf('_'); return split >= 0 ? [entry.mode.slice(0, split), entry.mode.slice(split + 1)] : ['', '']; };
        const options = [
            ['world', 'world', [...new Set(entries.map(entry => entry.world))].map(value => [value, worldName(value)])],
            ['style', 'style', [...new Set(entries.map(entry => parts(entry)[0]).filter(Boolean))].map(value => [value, tr(value)])],
            ['battleType', 'battleType', [...new Set(entries.map(entry => parts(entry)[1]).filter(Boolean))].map(value => [value, tr(value)])]
        ];
        function render() {
            list.replaceChildren();
            const shown = entries.filter(entry => (!state.local.world || entry.world === state.local.world) &&
                (!state.local.style || parts(entry)[0] === state.local.style) && (!state.local.battleType || parts(entry)[1] === state.local.battleType));
            for (const entry of shown) {
                const row = el('article', undefined, 'jpx-store-row jpx-store-local-row');
                row.dataset.localWorld = entry.world; row.dataset.localKind = entry.kind; row.dataset.localMode = entry.mode || '';
                const preview = button(localName(entry), () => localDetails(entry, previous), 'jpx-store-title'); preview.dataset.localAction = 'preview';
                const share = button(tr(previous ? 'useConfig' : 'shareShort'), () => chooseLocal(entry, previous)); share.dataset.localAction = 'share';
                const actions = el('div', undefined, 'jpx-store-row-tools'); actions.append(share);
                if (!previous) { const save = button(tr('saveBackpack'), () => saveCurrent(entry)); save.dataset.localAction = 'save'; actions.append(save); }
                row.append(preview, actions);
                const counts = ['supports', 'attacks'].filter(key => Number.isFinite(entry[key])).map(key => tr(key) + ': ' + entry[key]);
                row.append(el('p', [...localMeta(entry), ...counts].join(' · '), 'jpx-store-meta'));
                list.append(row);
            }
            if (!shown.length) list.append(el('p', tr(entries.length ? 'noMatches' : 'noLocal'), 'jpx-store-empty'));
        }
        for (const [key, label, values] of options) {
            if (!values.some(([value]) => value === state.local[key])) state.local[key] = '';
            const control = select([['', tr('all')], ...values], state.local[key]); control.dataset.localFilter = key;
            control.addEventListener('change', () => { state.local[key] = control.value; render(); });
            filters.append(field(tr(label), control));
        }
        stage.append(filters, list); render();
    }
    function localDetails(entry, previous) {
        const envelope = localDraft(entry);
        open('localDetail'); heading(localName(entry), () => local(previous));
        const actions = el('div', undefined, 'jpx-store-actions');
        actions.append(button(tr(previous ? 'useConfig' : 'share'), () => chooseLocal(entry, previous), 'jpx-store-primary'));
        if (!previous) actions.append(button(tr('saveBackpack'), () => saveCurrent(entry)));
        stage.append(el('p', localMeta(entry).join(' · '), 'jpx-store-meta'), el('p', configSummary(envelope), 'jpx-store-meta'), actions, rawPreview(envelope));
    }
    async function details(entry) {
        const request = open('detail'); heading(entry.title, () => browse()); message(tr('loading'));
        try {
            const envelope = await jpxConfigStore.load(entry);
            if (!alive() || request !== state.request) return;
            message('');
            stage.append(el('p', info(envelope, entry.author), 'jpx-store-meta'));
            if (envelope.description) stage.append(el('p', envelope.description, 'jpx-store-description'));
            stage.append(el('p', configSummary(envelope), 'jpx-store-meta'),
                el('p', tr('scriptVersion') + ': ' + envelope.scriptVersion, 'jpx-store-meta'));
            const actions = el('div', undefined, 'jpx-store-actions');
            actions.append(button(tr('import'), async () => { await hooks.importConfig(envelope); hooks.notify?.(tr('imported')); }, 'jpx-store-primary'),
                button(tr('saveBackpack'), () => saveToBackpack(envelope, () => details(entry))),
                button(tr('download'), () => downloadConfig(envelope, entry.id)));
            stage.append(actions, el('p', tr('importHint'), 'jpx-store-meta'), rawPreview(envelope));
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => details(entry));
        }
    }
    async function login(after = () => backpack(), cancel = () => backpack()) {
        const request = open('login'); heading(tr('signIn'), cancel);
        const panel = el('div', undefined, 'jpx-store-auth'); stage.append(panel);
        const controller = new AbortController(); state.login = controller; message(tr('connecting'));
        try {
            const user = await jpxConfigStore.login(code => {
                if (!alive() || request !== state.request) return;
                message(''); panel.replaceChildren(el('p', tr('authHint')));
                panel.append(el('code', code.userCode, 'jpx-store-auth-code'));
                const link = el('a', tr('authorize'), 'jpx-store-link');
                // Device authorization is the only external navigation in the publishing flow.
                const url = new URL(code.verificationUri);
                if (url.origin !== 'https://github.com' || url.pathname !== '/login/device') throw new Error('Invalid authorization URL');
                link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
                panel.append(link, el('p', tr('waitingAuth'), 'jpx-store-meta'), button(tr('cancel'), cancel));
            }, controller.signal);
            if (!alive() || request !== state.request) return;
            state.user = user || await jpxConfigStore.user(); state.login = null; accountControls(); await after();
        } catch (error) {
            if (!alive() || request !== state.request || error?.name === 'AbortError') return;
            message(errorMessage(error), true); panel.replaceChildren(button(tr('retry'), () => login(after, cancel)));
        }
    }
    async function edit(existing) {
        if (!existing) return local();
        const model = existing;
        state.editor = model; open('edit');
        heading(model.localOnly ? tr(model.backpackId ? 'editBackpack' : 'saveBackpack') : model.id ? tr('editShare') : tr('share'),
            model.back || (() => model.id ? mine() : local()));
        const request = state.request;
        const form = el('form', undefined, 'jpx-store-form');
        form.dataset.storeEditor = model.localOnly ? 'backpack' : 'share';
        const envelope = model.envelope;
        const world = model.id && !model.localOnly ? select([['Persistent', tr('persistent')], ['Isekai', tr('isekai')], ['Any', tr('anyWorld')]], envelope.world) : null;
        const title = el('input'); title.type = 'text'; title.required = true; title.maxLength = 100; title.value = envelope.title || '';
        const description = el('textarea'); description.rows = 4; description.maxLength = 4000; description.value = envelope.description || '';
        const summary = el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta');
        const selection = el('div', undefined, 'jpx-store-selection');
        selection.append(summary);
        if (!model.localOnly) selection.append(button(tr('changeConfig'), () => local(model)));
        form.append(selection);
        if (world) form.append(field(tr('appliesTo'), world));
        form.append(field(tr('title'), title), field(tr('description'), description));
        const source = el('div', undefined, 'jpx-store-actions');
        const publish = el('button', model.localOnly ? tr('save') : model.id ? tr('submitUpdate') : tr('submit'), 'jpx-store-primary'); publish.type = 'submit';
        source.append(publish); form.append(rawPreview(envelope), source, el('p', tr(model.localOnly ? 'backpackHint' : 'reviewHint'), 'jpx-store-meta'));
        if (!model.localOnly && !state.user) form.append(el('p', tr('loginBeforeShare'), 'jpx-store-meta'));
        for (const [control, key] of [[title, 'title'], [description, 'description'], ...(world ? [[world, 'world']] : [])])
            control.addEventListener('input', () => { envelope[key] = control.value; });
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (!form.reportValidity()) return;
            envelope.title = title.value.trim(); envelope.description = description.value.trim();
            if (world) envelope.world = world.value;
            if (!envelope.title) { title.focus(); return; }
            if (!model.localOnly && !state.user) { await login(() => edit(model), () => edit(model)); return; }
            publish.disabled = true; message(tr(model.localOnly ? 'saving' : 'submitting'));
            try {
                const saved = model.localOnly ? await jpxConfigStore.backpackSave(envelope, model.backpackId) : await jpxConfigStore.submit(envelope, model.id);
                if (!alive()) return;
                state.editor = null;
                if (request !== state.request) { hooks.notify?.(tr(model.localOnly ? 'savedBackpack' : 'submitted')); return; }
                if (model.localOnly) { backpackDetails(saved); message(tr('savedBackpack')); }
                else { await mine(); message(tr('submitted')); }
            } catch (error) { if (alive()) message(errorMessage(error), true); }
            finally { if (publish.isConnected) publish.disabled = false; }
        });
        stage.append(form);
    }
    function issueStatus(issue) {
        if (issue.state === 'closed') return 'withdrawn';
        const labels = issue.labels;
        for (const [label, key] of [['store:hide', 'hidden'], ['store:pending', 'pending'], ['store:changes-requested', 'changes'], ['store:needs-review', 'needsReview'], ['store:unavailable', 'unavailable'], ['store:published', 'published']])
            if (labels.includes(label)) return key;
        return 'pending';
    }
    async function mine() {
        const request = open('mine'); personalNavigation('shared');
        if (!state.user) { empty(tr('loginRequired'), () => login(() => mine()), tr('signIn')); return; }
        const refresh = button(tr('refresh'), () => mine()); stage.firstElementChild.append(refresh);
        message(tr('loading'));
        try {
            const issues = await jpxConfigStore.mine();
            if (!alive() || request !== state.request) return;
            message('');
            if (!issues.length) { empty(tr('noShares'), () => local(), tr('share')); return; }
            const list = el('div', undefined, 'jpx-store-list'); stage.append(list);
            for (const issue of issues) {
                const row = el('article', undefined, 'jpx-store-row');
                const title = el('strong', issue.title.replace(/^\[Config\]\s*/, ''));
                const statusKey = issueStatus(issue);
                const badge = el('span', tr(statusKey === 'published' ? 'publishedVersion' : statusKey), 'jpx-store-badge');
                row.append(title, badge);
                try {
                    const envelope = jpxConfigStore.parseSubmission(issue.body);
                    row.append(el('p', info(envelope) + ' · ' + configSummary(envelope), 'jpx-store-meta'));
                } catch { /* Keep malformed submissions manageable. */ }
                const actions = el('div', undefined, 'jpx-store-actions');
                if (issue.state !== 'closed') {
                    actions.append(button(tr('editShare'), () => edit({ id: issue.id, envelope: jpxConfigStore.parseSubmission(issue.body) })),
                        button(tr('withdraw'), async () => {
                            if (!confirm(tr('withdrawConfirm'))) return;
                            await jpxConfigStore.withdraw(issue.id); await mine();
                        }));
                }
                actions.append(button(tr('review'), async node => {
                    const old = row.querySelector('.jpx-store-feedback');
                    if (old) { old.remove(); node.setAttribute('aria-expanded', 'false'); return; }
                    const feedback = await jpxConfigStore.feedback(issue.id);
                    if (!alive() || request !== state.request) return;
                    if (!feedback && issue.state !== 'closed') badge.textContent = tr('pending');
                    const box = el('div', undefined, 'jpx-store-feedback');
                    const language = tr('browse') === '浏览' ? 'zh' : 'en';
                    box.append(el('p', feedback?.summary?.[language] || tr('noReview')));
                    for (const finding of feedback?.findings || []) box.append(el('p', [finding.path, finding[language]].filter(Boolean).join(' — ')));
                    row.append(box); node.setAttribute('aria-expanded', 'true');
                }));
                row.append(actions); list.append(row);
            }
        } catch (error) {
            if (!alive() || request !== state.request) return;
            message(errorMessage(error), true); empty(tr('cannotLoad'), () => mine());
        }
    }
    const observer = new MutationObserver(() => {
        if (!root.isConnected) { state.disposed = true; state.login?.abort(); observer.disconnect(); }
    });
    // The core removes its dialog directly from body; ignore battle-content mutations.
    observer.observe(doc.body, { childList: true });
    accountControls();
    jpxConfigStore.user().then(user => { if (alive()) { state.user = user; accountControls(); } }).catch(() => {});
    browse();
    return () => { state.disposed = true; state.login?.abort(); observer.disconnect(); };
}

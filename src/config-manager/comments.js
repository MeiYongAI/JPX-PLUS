// Comments are plain text. GitHub handles storage and permissions; the UI never
// renders remote HTML or writes config rules while discussing a shared config.
function jpxStoreActionIcon(node, name, label) {
    const paths = {
        refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.5-1L20 9M4 15l2.4 3A7 7 0 0 0 17.9 17"/>',
        edit: '<path d="m16 3 5 5-12 12-6 1 1-6L16 3Zm-2 2 5 5"/>',
        delete: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
        star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>'
    };
    node.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths[name] + '</svg>';
    node.setAttribute('aria-label', label); node.title = label;
    return node;
}
function renderJpxStoreComments(parent, { service, entry, tr, el, confirm, signIn, user, isCurrent, draft }) {
    const root = el('section', undefined, 'jpx-store-comments'), heading = el('div', undefined, 'jpx-comment-heading');
    const list = el('div', undefined, 'jpx-comment-list'), composer = el('div', undefined, 'jpx-comment-composer');
    const status = el('p', '', 'jpx-comment-status'); status.setAttribute('role', 'status'); status.hidden = true;
    const current = () => !disposed && root.isConnected && isCurrent();
    let disposed = false, loading = false, mutating = false, nextPage = null, request = 0, items = [];
    let editing = null, userId = user()?.id;
    const buttons = new Map();
    function button(text, action, className, disabled = () => false) {
        const node = el('button', text, className); node.type = 'button';
        let pending = false;
        buttons.set(node, () => pending || disabled());
        node.addEventListener('click', async () => {
            if (pending || disabled() || !current()) return;
            pending = true; controls();
            try { await action(); }
            catch (error) { if (current()) failure(error); }
            finally { pending = false; if (current()) { syncAuth(); controls(); } }
        });
        return node;
    }
    let feedbackTimer;
    const say = (text, error = false) => {
        clearTimeout(feedbackTimer); status.textContent = text; status.hidden = !text; status.setAttribute('role', error ? 'alert' : 'status');
        if (text && !error && text !== tr('loading')) feedbackTimer = setTimeout(() => { if (current()) status.hidden = true; }, 2500);
    };
    const failure = (error, sending = false) => {
        const key = ({ loginRequired: 'commentSignIn', commentNotOwner: 'commentNotOwner', commentChanged: 'commentChanged',
            commentMissing: 'commentMissing', commentInvalid: 'commentInvalid', commentDenied: 'commentDenied', commentsClosed: 'commentsClosed',
            rateLimited: 'rateLimit' })[error?.code] || (sending ? 'commentSendFailed' : 'requestFailed');
        say(tr(key), true);
    };
    const controls = () => {
        for (const [node, disabled] of buttons) {
            if (root.contains(node)) node.disabled = disabled();
            else buttons.delete(node);
        }
        more.hidden = !nextPage;
        refresh.setAttribute('aria-busy', String(loading));
        root.setAttribute('aria-busy', String(loading || mutating));
    };
    const valid = value => !!value.trim() && value.length <= 10000;
    function renderComposer() {
        if (mutating) return;
        composer.replaceChildren();
        if (!user()) { composer.append(button(tr('commentSignIn'), () => signIn())); return; }
        const input = el('textarea'); input.rows = 2; input.maxLength = 10000; input.value = draft.body || '';
        input.placeholder = tr('writeComment'); input.setAttribute('aria-label', tr('writeComment'));
        input.setAttribute('aria-description', tr('commentsPublic'));
        const publish = button(tr('postComment'), async () => {
            if (loading || mutating || editing || !valid(input.value) || !current()) return;
            const identity = user(), body = input.value;
            if (!identity) { failure({ code: 'loginRequired' }); return; }
            mutating = true; input.disabled = true; controls(); say('');
            try {
                const saved = await service.addComment(entry.id, body, identity.id);
                if (draft.body === body) draft.body = '';
                if (!current()) return;
                items = items.filter(item => item.id !== saved.id); items.push(saved); renderList(); input.value = '';
                say(tr('commentPosted'));
            } catch (error) { if (current()) failure(error, true); }
            finally {
                mutating = false; if (current()) { input.disabled = false; controls(); input.focus({ preventScroll: true }); }
            }
        }, 'jpx-store-primary', () => loading || mutating || !!editing || !valid(input.value));
        input.addEventListener('input', () => { draft.body = input.value; controls(); });
        const footer = el('div', undefined, 'jpx-comment-compose-footer');
        publish.title = tr('commentsPublic'); footer.append(publish);
        composer.append(input, footer);
    }
    function renderList() {
        list.replaceChildren();
        if (!items.length) { list.append(el('p', tr('noComments'), 'jpx-store-meta')); return; }
        for (const item of items) {
            const row = el('article', undefined, 'jpx-comment-row'); row.dataset.commentId = String(item.id);
            const header = el('div', undefined, 'jpx-comment-header');
            const link = el('a', '@' + item.author.login); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
            const date = el('time', new Date(item.createdAt).toLocaleDateString(), 'jpx-store-meta'); date.dateTime = item.createdAt;
            date.title = new Date(item.createdAt).toLocaleString();
            const byline = el('div', undefined, 'jpx-comment-byline'); byline.append(link, date); header.append(byline); row.append(header);
            const content = el('p', item.body, 'jpx-comment-body'); row.append(content);
            if (user()?.id === item.author.id) {
                const actions = el('div', undefined, 'jpx-comment-actions');
                const edit = button(tr('editComment'), () => {
                    if (loading || mutating || editing || !current()) return;
                    editing = item.id; row.dataset.editing = 'true'; controls();
                    const input = el('textarea'); input.rows = 4; input.maxLength = 10000;
                    const savedDraft = draft.edits[item.id] || { body: item.body, original: item };
                    draft.edits[item.id] = savedDraft;
                    input.value = savedDraft.body; input.setAttribute('aria-label', tr('editComment'));
                    const save = button(tr('save'), async () => {
                        if (mutating || !valid(input.value) || !current()) return;
                        const identity = user(); if (!identity) { failure({ code: 'loginRequired' }); return; }
                        mutating = true; input.disabled = true; cancel.disabled = true; controls(); say('');
                        try {
                            const updated = await service.updateComment(entry.id, savedDraft.original, input.value, identity.id);
                            delete draft.edits[item.id];
                            if (!current()) return;
                            items = items.map(value => value.id === item.id ? updated : value); editing = null; renderList(); say(tr('saved'));
                            list.querySelector('[data-comment-id="' + item.id + '"] button')?.focus({ preventScroll: true });
                        } catch (error) { if (current()) failure(error); }
                        finally { mutating = false; if (current()) { input.disabled = false; cancel.disabled = false; controls(); } }
                    }, 'jpx-store-primary', () => mutating || !valid(input.value));
                    const cancel = button(tr('cancel'), () => {
                        if (mutating) return; delete draft.edits[item.id]; editing = null; renderList(); controls();
                        list.querySelector('[data-comment-id="' + item.id + '"] button')?.focus({ preventScroll: true });
                    }, undefined, () => mutating);
                    input.addEventListener('input', () => { savedDraft.body = input.value; controls(); });
                    content.replaceWith(input); actions.replaceChildren(cancel, save); row.append(actions); controls(); input.focus();
                }, undefined, () => loading || mutating || !!editing);
                const remove = button(tr('delete'), async () => {
                    if (loading || mutating || editing || !current()) return;
                    const identity = user(); if (!identity) return;
                    if (!await confirm(tr('deleteCommentConfirm'), '', tr('delete'))) return;
                    if (!current() || loading || mutating || editing || user()?.id !== identity.id) return;
                    mutating = true; controls(); say('');
                    try {
                        await service.deleteComment(entry.id, item, identity.id);
                        delete draft.edits[item.id];
                        if (!current()) return;
                        items = items.filter(value => value.id !== item.id); renderList(); say(tr('commentDeleted'));
                    } catch (error) { if (current()) failure(error); }
                    finally { mutating = false; if (current()) { controls(); refresh.focus({ preventScroll: true }); } }
                }, undefined, () => loading || mutating || !!editing);
                jpxStoreActionIcon(edit, 'edit', tr('editComment')); jpxStoreActionIcon(remove, 'delete', tr('delete'));
                edit.classList.add('jpx-community-icon'); remove.classList.add('jpx-community-icon');
                actions.append(edit, remove); header.append(actions);
            }
            list.append(row);
        }
    }
    async function load(page = 1) {
        if (loading || mutating || editing || !current()) return;
        const generation = ++request; loading = true; controls(); say(tr('loading'));
        try {
            const result = await service.comments(entry.id, page);
            if (!current() || generation !== request) return;
            const collected = new Map((page === 1 ? [] : items).map(item => [item.id, item]));
            for (const item of result.items) collected.set(item.id, item);
            items = [...collected.values()].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id - b.id);
            nextPage = result.nextPage; renderList(); say('');
        } catch (error) { if (current() && generation === request) failure(error); }
        finally { loading = false; if (current()) controls(); }
    }
    function syncAuth() {
        if (!current() || mutating || userId === user()?.id) return;
        userId = user()?.id; editing = null; renderList(); renderComposer(); controls();
    }
    const refresh = jpxStoreActionIcon(button('', () => load(), 'jpx-community-icon', () => loading || mutating || !!editing), 'refresh', tr('refresh'));
    const more = button(tr('showMore'), () => load(nextPage), 'jpx-comment-more', () => loading || mutating || !!editing); more.hidden = true;
    heading.append(el('h4', tr('comments')), refresh); root.append(heading, composer, status, list, more); parent.append(root);
    renderComposer(); load();
    return { authChanged: syncAuth, dispose() { disposed = true; request++; clearTimeout(feedbackTimer); buttons.clear(); } };
}

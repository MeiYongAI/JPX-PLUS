function jpxStoreRatingText(value, tr) {
    if (!value?.count) return tr('noRatings');
    return '★ ' + (value.sum / value.count).toFixed(1) + ' · ' + tr(value.count === 1 ? 'ratingCountOne' : 'ratingCount').replace('${count}', String(value.count));
}
function renderJpxStoreRating(parent, { service, entry, summary, tr, el, user, signIn, isCurrent, onChange }) {
    const root = el('section', undefined, 'jpx-store-rating'), total = el('strong', jpxStoreRatingText(summary, tr));
    const actions = el('div', undefined, 'jpx-rating-actions'), status = el('p', '', 'jpx-rating-status');
    status.hidden = true; status.setAttribute('role', 'status');
    const heading = el('div', undefined, 'jpx-rating-heading'); heading.append(total);
    root.append(heading, actions, status); parent.append(root);
    let disposed = false, busy = false, ready = false, score = null, generation = 0, identity = user()?.id;
    const current = () => !disposed && root.isConnected && isCurrent();
    let feedbackTimer;
    const say = (text, error = false) => {
        clearTimeout(feedbackTimer); status.textContent = text; status.hidden = !text; status.setAttribute('role', error ? 'alert' : 'status');
        if (text && !error && text !== tr('loading')) feedbackTimer = setTimeout(() => { if (current()) status.hidden = true; }, 2500);
    };
    const failure = error => {
        const key = ({ loginRequired: 'ratingSignIn', rateLimited: 'rateLimit', ratingsTooMany: 'ratingsTooMany', ratingInvalid: 'ratingInvalid',
            commentsClosed: 'ratingsClosed', commentDenied: 'ratingDenied', commentChanged: 'ratingChanged', commentMissing: 'ratingChanged' })[error?.code] || 'ratingFailed';
        say(tr(key), true);
    };
    const controls = () => {
        root.setAttribute('aria-busy', String(busy));
        for (const node of root.querySelectorAll('button')) node.disabled = busy || node.dataset.score !== undefined && !ready;
        root.querySelector('.jpx-rating-refresh')?.setAttribute('aria-busy', String(busy));
    };
    function render() {
        actions.replaceChildren(); heading.querySelector('button')?.remove();
        const action = (text, handler, className) => {
            const node = el('button', text, className); node.type = 'button';
            node.addEventListener('click', () => { if (!busy && current()) handler(); });
            return node;
        };
        if (!identity) { actions.append(action(tr('ratingSignIn'), signIn)); controls(); return; }
        const stars = el('div', undefined, 'jpx-rating-stars');
        stars.setAttribute('role', 'group'); stars.setAttribute('aria-label', tr('yourRating'));
        const preview = value => { for (const node of stars.children) node.dataset.filled = String(Number(node.dataset.score) <= value); };
        for (let value = 1; value <= 5; value++) {
            const node = jpxStoreActionIcon(action('', () => change(value), 'jpx-rating-star'), 'star', tr('ratingStars').replace('${score}', String(value)));
            node.dataset.score = String(value); node.setAttribute('aria-pressed', String(value === score));
            node.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse' && !busy && ready) preview(value); });
            node.addEventListener('focus', () => { if (!busy && ready) preview(value); });
            stars.append(node);
        }
        preview(score); stars.addEventListener('pointerleave', () => preview(score));
        stars.addEventListener('focusout', event => { if (!stars.contains(event.relatedTarget)) preview(score); });
        actions.append(stars);
        if (ready && score !== null) actions.append(action(tr('removeRating'), () => change(null), 'jpx-rating-remove'));
        heading.append(jpxStoreActionIcon(action('', () => load(), 'jpx-rating-refresh jpx-community-icon'), 'refresh', tr('refresh'))); controls();
    }
    function accept(value) {
        score = value.score; ready = true; total.textContent = jpxStoreRatingText(value, tr);
        onChange({ count: value.count, sum: value.sum });
    }
    async function load() {
        if (!identity || busy || !current()) return;
        const request = ++generation, expected = identity; busy = true; controls(); say(tr('loading'));
        try {
            const value = await service.rating(entry.id, expected);
            if (!current() || request !== generation || user()?.id !== expected) return;
            accept(value); say('');
        } catch (error) { if (current() && request === generation) failure(error); }
        finally { if (current() && request === generation) { busy = false; render(); } }
    }
    async function change(value) {
        if (!ready || busy || value === score || !identity || !current()) return;
        const request = ++generation, expected = identity; busy = true; controls(); say('');
        try {
            const saved = await service.setRating(entry.id, value, expected);
            if (!current() || request !== generation || user()?.id !== expected) return;
            accept(saved); say(tr(value === null ? 'ratingRemoved' : 'ratingSaved'));
        } catch (error) { if (current() && request === generation) failure(error); }
        finally {
            if (current() && request === generation) {
                busy = false; render();
                (actions.querySelector('[aria-pressed=true]') || actions.querySelector('button'))?.focus({ preventScroll: true });
            }
        }
    }
    render(); load();
    return {
        authChanged() {
            if (!current() || identity === user()?.id) return;
            identity = user()?.id; generation++; busy = false; ready = false; score = null; say(''); render(); load();
        },
        dispose() { disposed = true; generation++; clearTimeout(feedbackTimer); }
    };
}

'use strict';
// Isolated Chromium and synthetic battle HTML; every network request is intercepted.
// Exercise real AJAX replacement, round reset, panel events and toggle throttling.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(__dirname, '../JPX-PLUS.user.js'), 'utf8');
const pageHTML = round => '<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div><div id="battle_main"><img src="/y/green.png" style="width:414px"><img src="/y/bar_blue.png" style="width:207px"><img src="/y/bar_red.png" style="width:207px"><span id="vrhb">2000</span><span id="vrm">1000</span><span id="vrs">1000</span><img id="ckey_spirit" src="/y/spirit_n.png"><div id="pane_effects"></div><div id="quickbar"></div><div id="battle_right"></div><table id="textlog"><tbody><tr><td>Round ' + round + ' / 10</td></tr></tbody></table></div></div>';
function expose() {
    initDoI18n(); loadBattleConfig(); ensureJpxStyle();
    cfgBattle.ctrlWidgetMouseEnter = true; cfgBattle.ajaxRound = true; cfgBattle.advanceToNextRound = false;
    for (const key of ['showDurations', 'showCooldowns', 'showMonsterInfo', 'showMonsterIndex', 'showMonsterHP', 'showRealTimeProficiency']) cfgBattle[key] = false;
    cfgBattle.ctrlWidgetRows = [{ id: 'isActiveBattle', enabled: true }];
    let toggles = 0, requests = 0, gameInitializations = 0;
    const originalToggle = toggleActive;
    toggleActive = () => { toggles++; return originalToggle(); };
    window.Battle = function() { gameInitializations++; };
    window.GM_xmlhttpRequest = () => { throw Error('Unexpected live request'); };
    log = document.querySelector('#textlog');
    initDoBattle();
    window.__hover = {
        state: () => ({ active: isActiveBattle, ready: jpxPanelManager.ready, toggles, requests, gameInitializations,
            pending: !!jpxPanelManager.roundHoverResume, panelCount: document.querySelectorAll('#ctrl-widget').length }),
        next(html, fallback = false) {
            const widget = jpxPanelManager.ctrlWidget;
            const panel = document.createElement('div'); panel.id = 'btcp'; document.querySelector('#battle_main').append(panel);
            jpxUtils.xhrGet = async () => { requests++; return [{ status: 'fulfilled', value: { responseText: html, url: location.href } }]; };
            isActiveBattle = true; monstersObj = { activeMonsters: [] }; goNext();
            if (fallback) document.querySelector('#battle_main').id = 'old-battle-main';
            return panel.onclick().then(() => ({ samePanel: widget === jpxPanelManager.ctrlWidget, connected: widget.isConnected }));
        },
        enable: value => { cfgBattle.ctrlWidgetMouseEnter = value; },
        suppress: () => { jpxPanelManager.suppressHover = true; },
        detachedLog: () => { log.remove(); }
    };
}
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => browser?.close());
async function fixture(t, isekai = false) {
    const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
    t.after(() => context.close());
    const page = await context.newPage(), errors = [];
    page.setDefaultTimeout(5000);
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => route.request().isNavigationRequest()
        ? route.fulfill({ contentType: 'text/html', body: pageHTML(1) }) : route.abort());
    await page.goto('https://hentaiverse.org/' + (isekai ? 'isekai/' : ''));
    await page.addScriptTag({ content: source.replace('\ninitDo();', '\n(' + expose.toString() + ')();') });
    await settle(page);
    t.after(() => assert.deepEqual(errors, []));
    return page;
}
const state = page => page.evaluate(() => __hover.state());
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const cooldown = page => page.waitForTimeout(230);
async function point(page, selector = '.jpx-widget-info') {
    const rect = await page.locator('#ctrl-widget ' + selector).boundingBox();
    assert.ok(rect); return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}
async function enter(page) {
    const p = await point(page); await page.mouse.move(p.x, p.y);
    assert.equal((await state(page)).active, true); return p;
}
async function next(page, round = 2, fallback = false) {
    assert.deepEqual(await page.evaluate(({ html, fallback }) => __hover.next(html, fallback), { html: pageHTML(round), fallback }), { samePanel: true, connected: true });
    await settle(page);
    assert.equal((await state(page)).active, false, 'AJAX does not resume without input');
}
for (const isekai of [false, true]) for (const fallback of [false, true]) {
    test('AJAX hover resumes once inside retained panel: ' + (isekai ? 'Isekai' : 'Persistent') + (fallback ? ', body fallback' : ''), async t => {
        const page = await fixture(t, isekai), p = await enter(page);
        for (const round of [2, 3, 4]) {
            await next(page, round, fallback); await cooldown(page);
            assert.equal((await state(page)).ready, false);
            await page.mouse.move(p.x + round * 3, p.y);
            assert.equal((await state(page)).active, true, 'movement inside status resumes the new round');
            await cooldown(page); await page.mouse.move(p.x + round * 3 + 1, p.y);
            assert.equal((await state(page)).toggles, round, 'subsequent motion cannot switch off');
            assert.equal((await state(page)).panelCount, 1);
        }
        assert.equal((await state(page)).gameInitializations, 3);
        await cooldown(page); await page.mouse.down(); await page.mouse.up();
        assert.equal((await state(page)).active, false, 'click can pause');
        await cooldown(page); await page.mouse.move(p.x + 8, p.y);
        assert.equal((await state(page)).active, false, 'movement preserves deliberate pause');
        await page.mouse.move(10, 10); await page.mouse.move(p.x, p.y);
        assert.equal((await state(page)).active, true, 'normal leave and reenter still toggles');
    });
}
test('movement outside panel can arm input without consuming round recovery', async t => {
    const page = await fixture(t), p = await enter(page); await page.mouse.move(10, 10);
    await next(page); await cooldown(page); await page.mouse.move(20, 20);
    assert.equal((await state(page)).active, false);
    await page.mouse.move(p.x, p.y);
    assert.equal((await state(page)).active, true);
    await cooldown(page); await page.mouse.move(p.x + 2, p.y);
    assert.equal((await state(page)).toggles, 2, 'enter and move do not both toggle');
});
test('throttled movement never schedules delayed activation', async t => {
    const page = await fixture(t);
    await page.evaluate(() => {
        window.__clock = Date.now; const frozen = Date.now(); Date.now = () => frozen;
    });
    const p = await enter(page);
    await page.evaluate(html => __hover.next(html), pageHTML(2));
    await page.mouse.move(p.x + 2, p.y);
    assert.equal((await state(page)).active, false);
    await page.evaluate(() => { Date.now = window.__clock; }); await cooldown(page);
    assert.equal((await state(page)).active, false, 'no queued automatic retry');
    await page.mouse.move(p.x + 3, p.y);
    assert.equal((await state(page)).active, true);
});
test('stationary, synthetic and non-mouse events cannot resume a round', async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    await page.mouse.move(p.x, p.y);
    for (const pointerType of ['mouse', 'touch', 'pen']) await page.locator('#ctrl-widget .jpx-widget-info').dispatchEvent('pointermove', { pointerType, clientX: p.x + 10, clientY: p.y, bubbles: true });
    assert.equal((await state(page)).active, false);
    await page.mouse.move(p.x + 1, p.y);
    assert.equal((await state(page)).active, true);
});
for (const obstacle of ['disabled', 'riddle', 'finished', 'detached']) test('movement cannot resume with ' + obstacle, async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    await page.evaluate(obstacle => {
        if (obstacle === 'disabled') __hover.enable(false);
        if (obstacle === 'detached') __hover.detachedLog();
        if (obstacle === 'riddle') document.body.insertAdjacentHTML('beforeend', '<div id="riddlemaster"></div>');
        if (obstacle === 'finished') document.body.insertAdjacentHTML('beforeend', '<div id="btcp"><img src="/y/finishbattle.png"></div>');
    }, obstacle);
    await page.mouse.move(p.x + 2, p.y); assert.equal((await state(page)).active, false);
});
test('keyboard pause and dragging cancel pending movement recovery', async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    await page.locator('#ctrl-widget .jpx-widget-info').focus(); await page.keyboard.press('Enter');
    assert.equal((await state(page)).active, true); await cooldown(page); await page.keyboard.press('Enter');
    await cooldown(page); await page.mouse.move(p.x + 2, p.y);
    assert.equal((await state(page)).active, false, 'keyboard pause stays off');
    await next(page, 3); await cooldown(page);
    const handle = await point(page, '.jpx-widget-drag');
    await page.mouse.move(handle.x, handle.y); await page.mouse.down();
    await page.mouse.move(handle.x - 40, handle.y - 40, { steps: 4 }); await page.mouse.up();
    assert.equal((await state(page)).active, false);
    assert.equal((await state(page)).pending, false, 'drag consumes pending recovery');
});
test('actual movement can recover after automatic panel reposition suppression', async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    await page.evaluate(() => __hover.suppress()); await page.mouse.move(p.x + 2, p.y);
    assert.equal((await state(page)).active, true);
});
test('held mouse buttons do not resume until a fresh unpressed movement', async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    await page.mouse.down({ button: 'right' }); await page.mouse.move(p.x + 2, p.y);
    assert.equal((await state(page)).active, false);
    await page.mouse.up({ button: 'right' }); await page.mouse.move(p.x + 3, p.y);
    assert.equal((await state(page)).active, true);
});
test('trusted touch movement does not consume pending mouse recovery', async t => {
    const page = await fixture(t), p = await enter(page); await next(page); await cooldown(page);
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 10, y: 10 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p.x, y: p.y }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert.equal((await state(page)).active, false);
    assert.equal((await state(page)).pending, true);
    await session.detach();
});

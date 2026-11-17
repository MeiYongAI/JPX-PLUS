'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { html } = require('./fixtures/battle-reload.cjs');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');

function expose() {
    initDoI18n(); loadBattleConfig(); ensureJpxStyle();
    log = document.querySelector('#textlog');
    cfgBattle.ctrlWidgetRows = [{ id: 'isActiveBattle' }];
    jpxPanelManager.createCtrlWidget('battle');
    let requests = 0, initializations = 0, clicks = 0;
    window.Battle = function() { initializations++; };
    window.__popup = {
        config: () => JSON.parse(JSON.stringify(cfgBattle)), open: renderSettings,
        reload: loadBattleConfig, next: goNext,
        state: () => ({ requests, initializations, clicks }),
        options(values, active = true) {
            Object.assign(cfgBattle, values); isActiveBattle = active;
            jpxPanelManager.setBackground(active ? '#4f4' : '#fef');
        },
        panel(finish = false) {
            const panel = document.createElement('div'); panel.id = 'btcp';
            panel.style.display = 'block';
            panel.innerHTML = finish ? '<img src="/y/battle/finishbattle.png" alt="Finish battle">'
                : '<div>You are victorious!</div><div>You gain 100 EXP!</div><div>Click to proceed to the next round</div>';
            panel.onclick = () => { clicks++; };
            document.querySelector('#battle_main').append(panel);
            monstersObj = { activeMonsters: [] };
        },
        response(value) {
            jpxUtils.xhrGet = async () => { requests++; return [{ status: 'fulfilled', value: { responseText: value, url: location.href } }]; };
        }
    };
}
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
async function setup(t, { isekai = false, language = '', width = 1024 } = {}) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const page = await context.newPage(), errors = []; page.setDefaultTimeout(5000);
    page.on('pageerror', error => errors.push(error.message));
    await context.route('**/*', route => route.request().isNavigationRequest()
        ? route.fulfill({ contentType: 'text/html', body: html({ rows: 1 }) }) : route.fulfill({ status: 204, body: '' }));
    await page.goto('https://hentaiverse.org/' + (isekai ? 'isekai/' : ''));
    if (language) await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'JPX-PLUS-' + language + '.user.js'), 'utf8') });
    await page.addScriptTag({ content: source.replace('\ninitDo();', '\n(' + expose.toString() + ')();') });
    t.after(() => assert.deepEqual(errors, []));
    return page;
}

test('default off and legacy configuration keep the victory popup', async t => {
    const page = await setup(t);
    assert.equal(await page.evaluate(() => __popup.config().hideRoundPopup), false);
    await page.evaluate(() => {
        const config = __popup.config(); delete config.hideRoundPopup;
        localStorage.setItem('jpx_cfgBattle', JSON.stringify(config));
        __popup.options({ hideRoundPopup: true }); __popup.reload(); __popup.panel();
    });
    assert.equal(await page.evaluate(() => __popup.config().hideRoundPopup), false);
    assert.equal(await page.locator('#btcp').isVisible(), true);
});

for (const isekai of [false, true]) test('hidden before log processing, AJAX advances once: ' + isekai, async t => {
    const page = await setup(t, { isekai });
    await page.evaluate(response => {
        __popup.options({ hideRoundPopup: true, advanceToNextRound: true, ajaxRound: true });
        __popup.response(response); __popup.panel();
    }, html({ round: 2, rows: 1 }));
    assert.equal(await page.locator('#btcp').evaluate(node => getComputedStyle(node).display), 'none');
    assert.deepEqual(await page.evaluate(() => __popup.state()), { requests: 0, initializations: 0, clicks: 0 });
    await page.evaluate(() => { __popup.next(); __popup.next(); });
    await page.waitForFunction(() => __popup.state().initializations === 1);
    assert.deepEqual(await page.evaluate(() => __popup.state()), { requests: 1, initializations: 1, clicks: 0 });
    assert.equal(await page.locator('#textlog').textContent().then(text => text.includes('Round 2 / 100')), true);
    assert.equal(await page.locator('#btcp').count(), 0);
});

test('hidden popup retains native non-AJAX navigation and its duplicate-click guard', async t => {
    const page = await setup(t);
    await page.evaluate(() => {
        __popup.options({ hideRoundPopup: true, advanceToNextRound: true, ajaxRound: false });
        __popup.panel(); __popup.next(); __popup.next();
    });
    assert.deepEqual(await page.evaluate(() => __popup.state()), { requests: 0, initializations: 0, clicks: 1 });
});

test('manual round changes, pause and disabling the setting restore the popup', async t => {
    const page = await setup(t);
    await page.evaluate(() => { __popup.options({ hideRoundPopup: true, advanceToNextRound: false }); __popup.panel(); __popup.next(); });
    assert.equal(await page.locator('#btcp').isVisible(), true);
    assert.equal((await page.evaluate(() => __popup.state())).clicks, 0);
    await page.evaluate(() => __popup.options({ advanceToNextRound: true }));
    assert.equal(await page.locator('#btcp').isVisible(), false);
    await page.evaluate(() => __popup.options({}, false));
    assert.equal(await page.locator('#btcp').isVisible(), true);
    await page.locator('#btcp').click();
    assert.equal((await page.evaluate(() => __popup.state())).clicks, 1);
    await page.evaluate(() => __popup.options({ hideRoundPopup: false }));
    assert.equal(await page.locator('#btcp').isVisible(), true);
});

test('final results remain visible even before final-log processing', async t => {
    const page = await setup(t);
    await page.evaluate(() => { __popup.options({ hideRoundPopup: true, advanceToNextRound: true }); __popup.panel(true); __popup.next(); });
    assert.equal(await page.locator('#btcp').isVisible(), true);
    assert.equal((await page.evaluate(() => __popup.state())).clicks, 0);
});

test('AJAX riddle remains visible and blocks another round request', async t => {
    const page = await setup(t);
    await page.evaluate(() => {
        __popup.options({ hideRoundPopup: true, advanceToNextRound: true, ajaxRound: true });
        __popup.response('<!doctype html><script></script><script></script><script>window.__riddleLoaded=true;</script><div id="mainpane"><div id="riddlemaster"><form id="riddleform"><button id="riddlesubmit">Submit</button></form></div></div>');
        __popup.panel(); __popup.next();
    });
    await page.waitForFunction(() => window.__riddleLoaded);
    assert.equal(await page.locator('#riddlemaster').isVisible(), true);
    await page.evaluate(() => __popup.next());
    assert.equal((await page.evaluate(() => __popup.state())).requests, 1);
});

for (const [language, label] of [
    ['', 'Hide the round victory popup'], ['ZhCN', '隐藏过轮胜利弹窗'],
    ['ZhTW', '隱藏過輪勝利彈窗'], ['ZhHK', '隱藏過輪勝利彈窗'],
    ['Ja', 'ラウンド勝利のポップアップを非表示'], ['Ko', '라운드 승리 팝업 숨기기']
]) test('setting saves, reloads and exports: ' + (language || 'English'), async t => {
    const page = await setup(t, { language, width: 390, isekai: language === 'ZhCN' });
    await page.evaluate(() => __popup.open());
    const control = page.getByRole('checkbox', { name: label, exact: true });
    assert.equal(await control.isChecked(), false);
    await control.check(); await page.locator('#save-button').click();
    await page.evaluate(() => __popup.reload());
    assert.equal(await page.evaluate(() => __popup.config().hideRoundPopup), true);
    const bounds = await control.locator('..').evaluate(node => { const rect = node.getBoundingClientRect(); return { left: rect.left, right: rect.right, width: innerWidth }; });
    assert.ok(bounds.left >= 0 && bounds.right <= bounds.width);
    await page.locator('#export-button').click(); await page.locator('[data-export-scope=all]').click();
    const downloading = page.waitForEvent('download'); await page.locator('.jpx-export-submit').click();
    const download = await downloading;
    assert.equal(JSON.parse(fs.readFileSync(await download.path(), 'utf8')).hideRoundPopup, true);
});

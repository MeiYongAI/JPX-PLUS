'use strict';
// Real strategy manager, panel and battle handlers on an isolated synthetic page.
// The native monster click is recorded locally; no live battle requests are sent.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, source, mainHTML } = require('./fixtures/battle-performance.cjs');
const rules = (message, bottom = false) => ({
    supports: [{ type: 'stop', customMessage: message, disabled: true, conditions: [] }],
    attacks: [{ type: 'target', priorityRule: bottom ? 'Bottom Up' : 'Top Down', conditions: [] }, { type: 'normalAttack', conditions: [] }]
});
function instrument() {
    cfgBattle.TwoHanded_General = { supports: [{ type: 'stop', customMessage: 'Initial', disabled: true, conditions: [] }],
        attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'normalAttack', conditions: [] }] };
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    refreshJpxSelectedConfig();
    let processed = 0, decisions = 0, targets = [];
    const process = preProcessLog, decide = smartBattle;
    preProcessLog = (...args) => { processed++; return process(...args); };
    smartBattle = (...args) => { decisions++; return decide(...args); };
    document.addEventListener('click', event => { const monster = event.target.closest('.btm1'); if (monster) targets.push(monster.id); });
    const keyAction = jpxUtils.throttle(actionManager, 75);
    document.addEventListener('keydown', event => onKeyDown(event, keyAction), true);
    document.addEventListener('DOMContentLoaded', reDoBattle);
    preDoBattle();
    window.__strategy = {
        open: renderSettings, toggle: toggleActive,
        state: () => ({ active: isActiveBattle, pendingHover: !!jpxPanelManager.roundHoverResume, mode: getBattleMode(),
            ready: readyNext, processed, decisions, targets: [...targets], config: JSON.parse(JSON.stringify(getJpxBattleRules())) }),
        add(mode, data, title = mode) {
            const entry = getJpxConfigLibrary().save({ schemaVersion: 1, kind: 'battle-mode', title, description: '', world: 'Persistent',
                mode, config: { battleVersion: defaultCfgBattle.battleVersion, [mode]: data } });
            window.dispatchEvent(new Event('jpx:config-library')); return entry;
        },
        commit(id) { return commitJpxConfigEntry(getJpxConfigLibrary().get(id), 'Persistent'); },
        assign(id, target) {
            const library=getJpxConfigLibrary(),entry=library.get(id);
            library.assignScene('Persistent',target,id,entry.envelope.mode,entry.revision,library.readRuntime('Persistent').scenes[target]||null);
            refreshJpxSelectedConfig();pauseForJpxConfigApplication();
        },
        scene(value) { battleType=value; },
        resolved: () => JSON.parse(JSON.stringify(getJpxBattleRules())),
        append() { const row = log.insertRow(0); row.insertCell().textContent = 'Fixture strategy update'; },
        round(main) { document.getElementById('battle_main').innerHTML = main; reDoBattle(); },
        hover(value) { cfgBattle.ctrlWidgetMouseEnter = value; },
        ajax(value) { cfgBattle.ajaxRound = value; cfgBattle.advanceToNextRound = false; },
        vital(key, fraction, update = true) {
            const [file, width, counter] = { pHP: ['green.png', 496, 'vrhb'], pMP: ['bar_blue.png', 207, 'vrm'], pSP: ['bar_red.png', 207, 'vrs'] }[key];
            document.querySelector('#pane_vitals img[src$="' + file + '"]').style.width = Math.round(width * fraction) + 'px';
            document.getElementById(counter).textContent = String(Math.round(10000 * fraction));
            if (update) this.append(); else preRender();
        },
        async next(main) {
            const panel = document.createElement('div'); panel.id = 'btcp'; document.getElementById('battle_main').append(panel);
            window.Battle = function() {};
            jpxUtils.xhrGet = async () => [{ status: 'fulfilled', value: { responseText: '<div id="battle_main">' + main + '</div>', url: location.href } }];
            isActiveBattle = true; monstersObj = { activeMonsters: [] }; goNext();
            await panel.onclick();
        },
        labels: () => Object.fromEntries(['apply', 'edit', 'save', 'updateApply', 'undo', 'redo'].map(key => [key, t('cM.' + key)]))
    };
}
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
const input = source.replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
async function fixture(t) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
    t.after(() => context.close());
    const { page, errors } = await open(context, { source: input }); page.setDefaultTimeout(6000);
    t.after(() => assert.deepEqual(errors, []));
    return { page, context, labels: await page.evaluate(() => __strategy.labels()) };
}
const state = page => page.evaluate(() => __strategy.state());
const row = (page, id) => page.locator('.jpx-config-row[data-config-id="' + id + '"]');
async function settings(page) { await page.evaluate(() => __strategy.open()); await page.locator('#tab_configManager').click(); }
async function add(page, mode, data) { return page.evaluate(({ mode, data }) => __strategy.add(mode, data), { mode, data }); }
async function apply(page, entry, label) { await row(page, entry.id).getByRole('button', { name: label, exact: true }).click(); }
async function close(page) { await page.evaluate(() => document.getElementById('settings-container').close()); await page.locator('#settings-container').waitFor({ state: 'detached' }); }
async function settle(page) { await page.waitForTimeout(280); }

test('assigned scene rules drive battle actions and manual keys without changing native slots', async t => {
    const {page}=await fixture(t), data=rules('Assigned bottom-up',true);
    data.kb_Q=[{type:'target',priorityRule:'Bottom Up',conditions:[]},{type:'normalAttack',conditions:[]}];
    const entry=await add(page,'TwoHanded_General',data);
    await page.evaluate(id=>{__strategy.scene('Arena');__strategy.assign(id,'TwoHanded_Arena');},entry.id);
    assert.equal((await state(page)).active,false);
    assert.deepEqual(await page.evaluate(()=>__strategy.resolved()),data);
    await page.evaluate(()=>__strategy.toggle());await settle(page);
    assert.deepEqual((await state(page)).targets,['mkey_0']);
    await page.evaluate(()=>__strategy.toggle());
    await page.keyboard.press('q');await settle(page);
    assert.deepEqual((await state(page)).targets,['mkey_0','mkey_0']);
});

test('applying a strategy in a running battle pauses and resumes with the new target exactly once', async t => {
    const { page, labels } = await fixture(t);
    await page.evaluate(() => __strategy.toggle()); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    await settings(page);
    const entry = await add(page, 'OneHanded_Item', rules('New mode', true));
    await apply(page, entry, labels.apply);
    assert.equal((await state(page)).active, false);
    assert.equal((await state(page)).mode, 'OneHanded_Item');
    await page.evaluate(() => __strategy.append()); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    await close(page);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1', 'mkey_0']);
    assert.equal((await state(page)).decisions, 2);
});

test('battle draft editing and saving do not affect execution until Update & apply', async t => {
    const { page, labels } = await fixture(t);
    await settings(page);
    const entry = await add(page, 'OneHanded_Item', rules('Before', true));
    await apply(page, entry, labels.apply);
    await page.evaluate(() => __strategy.toggle()); await settle(page);
    const before = await state(page);
    await row(page, entry.id).getByRole('button', { name: labels.edit, exact: true }).click();
    const editor = page.locator('.jpx-config-editor');
    const rule = editor.locator('#jpx-rule-panel-supports .jpx-rule-item').first();
    await rule.locator(':scope > summary').click();
    await rule.locator('[data-field-key=customMessage] input').fill('Edited during combat');
    await rule.locator('.jpx-rule-state-toggle').click();
    const footer = editor.locator('.jpx-config-editor-footer');
    await footer.getByRole('button', { name: labels.undo, exact: true }).click();
    await footer.getByRole('button', { name: labels.redo, exact: true }).click();
    await footer.getByRole('button', { name: labels.save, exact: true }).click();
    assert.deepEqual((await state(page)).config, before.config);
    await page.evaluate(() => __strategy.append()); await settle(page);
    assert.equal((await state(page)).targets.length, before.targets.length + 1);
    await apply(page, entry, labels.updateApply);
    assert.equal((await state(page)).active, false);
    await close(page);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.equal((await state(page)).ready, 'Stop: Edited during combat');
    assert.equal((await state(page)).targets.length, before.targets.length + 1);
});

test('strategy application clears AJAX hover recovery and preserves its pause', async t => {
    const { page, labels } = await fixture(t);
    await page.evaluate(main => { __strategy.hover(true); __strategy.round(main); }, mainHTML());
    assert.equal((await state(page)).pendingHover, true);
    await settings(page);
    const entry = await add(page, 'OneHanded_Item', rules('Paused after apply', true));
    await apply(page, entry, labels.apply);
    assert.equal((await state(page)).pendingHover, false);
    await close(page);
    const box = await page.locator('#ctrl-widget .jpx-widget-info').boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.move(box.x + box.width / 2 + 3, box.y + box.height / 2);
    await settle(page);
    assert.equal((await state(page)).active, false);
    assert.deepEqual((await state(page)).targets, []);
});

test('an already queued decision is cancelled when strategy application is followed by resume', async t => {
    const { page } = await fixture(t);
    const entry = await add(page, 'OneHanded_Item', rules('Immediate switch', true));
    await page.evaluate(id => { __strategy.toggle(); __strategy.commit(id); __strategy.toggle(); }, entry.id);
    await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_0']);
    assert.equal((await state(page)).decisions, 1);
});

test('selected battle strategy survives repeated AJAX rounds without duplicated decisions', async t => {
    const { page } = await fixture(t);
    const entry = await add(page, 'OneHanded_Item', rules('Across rounds', true));
    await page.evaluate(id => __strategy.commit(id), entry.id);
    for (let round = 0; round < 3; round++) {
        await page.evaluate(main => { __strategy.round(main); __strategy.round(main); __strategy.toggle(); }, mainHTML());
        await settle(page);
        assert.equal((await state(page)).mode, 'OneHanded_Item');
        assert.deepEqual((await state(page)).targets, Array(round + 1).fill('mkey_0'));
    }
});

test('another tab applies a strategy to the live battle and resume uses its exact target', async t => {
    const { page, context, labels } = await fixture(t);
    await page.evaluate(() => __strategy.toggle()); await settle(page);
    const external = await open(context, { source: input });
    t.after(() => assert.deepEqual(external.errors, []));
    await settings(external.page);
    const entry = await add(external.page, 'OneHanded_Item', rules('External update', true));
    await apply(external.page, entry, labels.apply);
    await page.waitForFunction(() => __strategy.state().mode === 'OneHanded_Item' && !__strategy.state().active);
    await page.evaluate(() => __strategy.append()); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1', 'mkey_0']);
});

test('queued log updates may finish recording after an apply but cannot resume the battle', async t => {
    const { page } = await fixture(t);
    const entry = await add(page, 'OneHanded_Item', rules('During log burst', true));
    await page.evaluate(() => { __strategy.toggle(); __strategy.append(); });
    await page.waitForFunction(() => __strategy.state().processed === 1 && __strategy.state().targets.length === 1);
    await page.evaluate(async id => { __strategy.append(); await Promise.resolve(); __strategy.commit(id); }, entry.id);
    await settle(page);
    const result = await state(page);
    assert.equal(result.processed, 2);
    assert.equal(result.active, false);
    assert.deepEqual(result.targets, ['mkey_1']);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1', 'mkey_0']);
});

test('manual pause then immediate resume cannot replay the previous pending decision', async t => {
    const { page } = await fixture(t);
    await page.evaluate(() => { __strategy.toggle(); __strategy.toggle(); __strategy.toggle(); });
    await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    assert.equal((await state(page)).decisions, 1);
});

test('editing target priority in battle applies without waiting for another log update', async t => {
    const { page, labels } = await fixture(t);
    await settings(page);
    const entry = await add(page, 'OneHanded_Item', rules('Priority edit'));
    await apply(page, entry, labels.apply);
    await page.evaluate(() => __strategy.toggle()); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    await row(page, entry.id).getByRole('button', { name: labels.edit, exact: true }).click();
    const editor = page.locator('.jpx-config-editor');
    await editor.locator('#jpx-rule-section-attacks').click();
    const target = editor.locator('#jpx-rule-panel-attacks .jpx-rule-item').first();
    await target.locator(':scope > summary').click();
    await target.locator('[data-field-key=priorityRule] select').selectOption('Bottom Up');
    await editor.locator('.jpx-config-editor-footer').getByRole('button', { name: labels.save, exact: true }).click();
    assert.equal((await state(page)).config.attacks[0].priorityRule, 'Top Down');
    await apply(page, entry, labels.updateApply);
    await close(page);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1', 'mkey_0']);
    assert.equal((await state(page)).processed, 0, 'no battle update was needed for the new priority');
});

test('edited stop conditions use current battle state after apply, including undo and redo', async t => {
    const { page, labels } = await fixture(t);
    await settings(page);
    const data = rules('HP threshold');
    data.supports[0].disabled = false;
    data.supports[0].conditions = [{ key: 'pHP', value: [0, 0.2] }];
    const entry = await add(page, 'OneHanded_Item', data);
    await apply(page, entry, labels.apply);
    await page.evaluate(() => __strategy.toggle()); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
    await row(page, entry.id).getByRole('button', { name: labels.edit, exact: true }).click();
    const editor = page.locator('.jpx-config-editor');
    const rule = editor.locator('#jpx-rule-panel-supports .jpx-rule-item').first();
    await rule.locator(':scope > summary').click();
    const numbers = rule.locator('[data-field-key=conditions] input[type=number]');
    assert.equal(await numbers.count(), 2);
    await numbers.nth(1).fill('1');
    const footer = editor.locator('.jpx-config-editor-footer');
    await footer.getByRole('button', { name: labels.undo, exact: true }).click();
    await footer.getByRole('button', { name: labels.redo, exact: true }).click();
    await footer.getByRole('button', { name: labels.save, exact: true }).click();
    assert.deepEqual((await state(page)).config.supports[0].conditions[0].value, [0, 0.2]);
    await apply(page, entry, labels.updateApply);
    await close(page);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.equal((await state(page)).ready, 'Stop: HP threshold');
    assert.deepEqual((await state(page)).targets, ['mkey_1']);
});

async function prepareRecovery(page, key, ajax) {
    const data = rules('Refill ' + key);
    data.supports[0].disabled = false;
    data.supports[0].conditions = [{ key, value: [0, 0.4] }];
    const entry = await add(page, 'OneHanded_Item', data);
    await page.evaluate(({ id, key, ajax }) => { __strategy.commit(id); __strategy.ajax(ajax); __strategy.vital(key, 0.2, false); __strategy.toggle(); }, { id: entry.id, key, ajax });
    await settle(page);
    const stopped = await state(page);
    assert.equal(stopped.active, true, 'a rule stop keeps automatic battle armed');
    assert.equal(stopped.ready, 'Stop: Refill ' + key);
    assert.deepEqual(stopped.targets, []);
    return entry;
}

for (const ajax of [false, true]) for (const key of ['pHP', 'pMP', 'pSP']) {
    test('manual refill clears ' + key + ' rule stop and auto continues once, AJAX ' + ajax, async t => {
        const { page } = await fixture(t);
        await prepareRecovery(page, key, ajax);
        await page.evaluate(key => __strategy.vital(key, 0.3), key); await settle(page);
        assert.equal((await state(page)).ready, 'Stop: Refill ' + key, 'insufficient recovery still waits');
        assert.deepEqual((await state(page)).targets, []);
        await page.evaluate(key => __strategy.vital(key, 0.8), key); await settle(page);
        const resumed = await state(page);
        assert.equal(resumed.active, true);
        assert.deepEqual(resumed.targets, ['mkey_1'], 'fresh status and log update resumes without panel input');
    });
    if (ajax) test('manual refill resumes ' + key + ' after actual AJAX round replacement', async t => {
        const { page } = await fixture(t);
        await prepareRecovery(page, key, true);
        await page.evaluate(main => __strategy.next(main), mainHTML());
        assert.equal((await state(page)).active, false, 'a new round retains the established manual activation gate');
        await page.evaluate(key => { __strategy.vital(key, 0.2, false); __strategy.toggle(); }, key); await settle(page);
        assert.equal((await state(page)).ready, 'Stop: Refill ' + key);
        assert.deepEqual((await state(page)).targets, []);
        await page.evaluate(key => __strategy.vital(key, 0.8), key); await settle(page);
        assert.deepEqual((await state(page)).targets, ['mkey_1']);
        assert.equal((await state(page)).active, true);
    });
}

test('manual pause remains paused after a refill with AJAX enabled', async t => {
    const { page } = await fixture(t);
    await prepareRecovery(page, 'pHP', true);
    await page.locator('#ctrl-widget .jpx-widget-info').click();
    assert.equal((await state(page)).active, false);
    await page.evaluate(() => __strategy.vital('pHP', 0.8)); await settle(page);
    assert.equal((await state(page)).active, false);
    assert.deepEqual((await state(page)).targets, []);
});

test('applying a new strategy while stopped requires resume even after manual refill', async t => {
    const { page } = await fixture(t);
    await prepareRecovery(page, 'pMP', true);
    const entry = await add(page, 'OneHanded_Item', rules('Explicitly paused', true));
    await page.evaluate(id => { __strategy.commit(id); __strategy.vital('pMP', 0.8); }, entry.id); await settle(page);
    assert.equal((await state(page)).active, false);
    assert.deepEqual((await state(page)).targets, []);
    await page.locator('#ctrl-widget .jpx-widget-info').click(); await settle(page);
    assert.deepEqual((await state(page)).targets, ['mkey_0']);
});

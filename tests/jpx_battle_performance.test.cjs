'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, mainHTML } = require('./fixtures/battle-performance.cjs');
let browser;
before(async () => { browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), headless: true }); });
after(async () => browser?.close());
async function fixture(t, options) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    t.after(() => context.close());
    const { page, errors } = await open(context, options);
    t.after(() => assert.deepEqual(errors, [])); return page;
}
test('unchanged battle renders retain nodes and perform no DOM writes or layout text reads', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        __perf.render(); const before = __perf.snapshot();
        const nodes = [...document.querySelectorAll('#battle_main *')];
        const totals = { created: 0, layoutReads: 0, mutations: 0 };
        for (let i = 0; i < 100; i++) {
            const one = __perf.measure(); for (const key in totals) totals[key] += one[key];
        }
        return { totals, before, after: __perf.snapshot(), retained: nodes.every((node, i) => node === document.querySelectorAll('#battle_main *')[i]),
            slots: document.querySelectorAll('#quickbar .extend').length, durations: document.querySelectorAll('.effect-duration').length,
            hp: document.querySelectorAll('.monster-hp').length, classes: document.querySelectorAll('[data-field=monClass]').length };
    });
    assert.deepEqual(result.totals, { created: 0, layoutReads: 0, mutations: 0 });
    assert.deepEqual(result.after, result.before); assert.equal(result.retained, true);
    assert.equal(result.slots, 12); assert.equal(result.durations, 46); assert.equal(result.hp, 10); assert.equal(result.classes, 10);
    assert.equal(result.after.monsters[0].name, 'Fixture Monster 0'); assert.equal(result.after.monsters[0].level, 400);
});
test('each update normalizes the log once and later log changes are never cached', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        const first = __perf.measure('process'), before = __perf.snapshot();
        document.querySelector('#textlog tbody').innerHTML = '<tr><td class="tl"><hv-battle-text>You cast Cure.</hv-battle-text></td></tr><tr><td class="tls"></td></tr>';
        const second = __perf.measure('process'), after = __perf.snapshot();
        document.querySelector('#textlog tbody').innerHTML = '<tr><td>No complete turn</td></tr>';
        const missing = __perf.measure('process'), final = __perf.snapshot();
        return { first, second, missing, before, after, final };
    });
    for (const key of ['first', 'second', 'missing']) assert.equal(result[key].logReads, 1, key);
    assert.equal(result.after.action, result.before.action + 1); assert.equal(result.final.action, result.after.action);
    assert.equal(result.first.layoutReads, 0); assert.equal(result.after.combatRecords.physicalDealt.slashing, 1234);
});
test('plain and addon-decorated vital counters preserve native desktop and alternate layouts', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        const plain = __perf.vitals();
        document.getElementById('vrhb').innerHTML = '<span style="display:none">99999</span><span>6000</span>';
        document.getElementById('vrm').innerHTML = '<span style="display:none">99999</span><span>500</span>';
        const decorated = __perf.vitals();
        document.getElementById('pane_vitals').innerHTML = '<img src="/y/green.png" style="width:207px"><span id="dvrhd">1000</span><img src="/y/bar_blue.png" style="width:207px"><span id="dvrm">800</span><img src="/y/bar_red.png" style="width:207px"><span id="dvrs">500</span><img src="/y/bar_orange.png" style="width:207px">';
        const alternate = __perf.vitals(); return { plain, decorated, alternate };
    });
    assert.equal(result.plain.hpCurrent, 10000); assert.equal(result.plain.mpCurrent, 900);
    assert.equal(result.decorated.hpCurrent, 6000); assert.equal(result.decorated.mpCurrent, 500);
    assert.equal(result.alternate.hpCurrent, 1000); assert.equal(result.alternate.hpMax, 2000); assert.equal(result.alternate.oc, 5);
});
test('quickbar reuses nodes but refreshes cooldowns, handlers, missing entries and configuration order', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        __perf.render(); const cure = document.getElementById('extend_Cure'), native = document.getElementById('native-cure');
        const initial = cure.querySelector('.cooldown').textContent;
        __perf.advance(13); __perf.render(); const afterTurn = cure.querySelector('.cooldown').textContent;
        const original = document.querySelector('.bts > div'); original.setAttribute('onclick', 'window.__casts++');
        __perf.render(); cure.click();
        const available = { cooldown: cure.querySelector('.cooldown'), opacity: cure.querySelector('.btqi').style.opacity, casts: __casts };
        original.remove(); __perf.render();
        const missing = { click: cure.hasAttribute('onclick'), image: !!cure.querySelector('.btqi') };
        __perf.options({ quickbarExtend: ['Haste', 'Regen'] }); __perf.render();
        const order = [...document.querySelectorAll('#quickbar .extend')].map(node => node.id);
        __perf.options({ quickbarExtend: [] }); __perf.render();
        return { initial, afterTurn, available, missing, order, extensions: document.querySelectorAll('#quickbar .extend').length,
            nativePreserved: document.getElementById('native-cure') === native, nativeCooldown: !!native.querySelector('.cooldown') };
    });
    assert.equal(result.initial, '3'); assert.equal(result.afterTurn, '2');
    assert.deepEqual(result.available, { cooldown: null, opacity: '', casts: 1 });
    assert.deepEqual(result.missing, { click: false, image: false });
    assert.deepEqual(result.order, ['extend_Haste', 'extend_Regen']); assert.equal(result.extensions, 0);
    assert.equal(result.nativePreserved, true); assert.equal(result.nativeCooldown, false);
});
test('effect countdowns reuse nodes, update stack text, and reset expired emphasis', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        __perf.render(); const effect = document.querySelector('#pane_effects img'), overlay = effect.previousElementSibling;
        const states = [];
        for (const turns of [2, 5, 10, 'autocast', 'permanent', 'decaying']) {
            effect.setAttribute('onmouseover', "show('Haste (x3)', 'Fixture', '" + turns + "')"); __perf.effects(true);
            states.push({ text: overlay.textContent, background: overlay.firstElementChild.style.background, same: effect.previousElementSibling === overlay });
        }
        __perf.effects(false); const removed = document.querySelectorAll('.effect-duration').length;
        __perf.effects(true); return { states, removed, restored: effect.previousElementSibling === overlay };
    });
    assert.deepEqual(result.states.map(x => x.text), ['2\u00a0x3', '5\u00a0x3', '10\u00a0x3', 'auto\u00a0x3', '∞\u00a0x3', 'x3']);
    assert.deepEqual(result.states.map(x => x.background), ['aquamarine', 'lavender', '', '', '', '']);
    assert.ok(result.states.every(x => x.same)); assert.equal(result.removed, 0); assert.equal(result.restored, true);
});
test('replacement DOM gets fresh decorations and old monster metadata never enters names', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(main => {
        __perf.render(); const old = document.getElementById('extend_Cure');
        document.querySelector('.btm3 > div > div').textContent = 'Renamed Monster';
        __perf.render(); const renamed = __perf.snapshot().monsters[0].name;
        const level = __perf.snapshot().monsters[0].level;
        __perf.reset(main); __perf.render();
        return { renamed, level, fresh: old !== document.getElementById('extend_Cure'), detached: !old.isConnected,
            count: document.querySelectorAll('#quickbar .extend').length, name: __perf.snapshot().monsters[0].name };
    }, mainHTML());
    assert.deepEqual(result, { renamed: 'Renamed Monster', level: 400, fresh: true, detached: true, count: 12, name: 'Fixture Monster 0' });
});
for (const translation of ['before', 'after']) test('published translation remains compatible: ' + translation, async t => {
    const page = await fixture(t, { translation });
    await page.evaluate(() => __perf.render());
    await page.waitForTimeout(50);
    const result = await page.evaluate(() => {
        const first = __perf.snapshot(); __perf.render(); const second = __perf.snapshot();
        return { first, second, slots: document.querySelectorAll('#quickbar .extend').length, icons: document.querySelectorAll('#quickbar .extend .btqi').length };
    });
    assert.deepEqual(result.second, result.first); assert.equal(result.slots, 12); assert.equal(result.icons, 12);
});
test('hidden effects stay separate from six native icons and expire without accumulating nodes', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        const pane = document.querySelector('.btm6');
        const names = ['Imperil', 'Weaken', 'Slow', 'Searing Skin', 'Freezing Limbs', 'Turbulent Air'];
        pane.innerHTML = names.map(name => '<img src="/y/e/fixture.png" onmouseover="show(\'' + name + '\', \'Fixture\', 10)">').join('');
        const previous = Object.fromEntries([...names, 'Asleep'].map(name => [name, { turns: '11', stack: 1 }]));
        __perf.hideEffects({ 'Fixture Monster 0': previous }); __perf.render();
        const first = __perf.snapshot().monsters[0].effects.Asleep.turns;
        const image = pane.lastElementChild;
        for (let i = 0; i < 30; i++) __perf.render();
        const stable = __perf.snapshot().monsters[0].effects.Asleep.turns;
        const images = pane.querySelectorAll('img').length;
        for (const icon of [...pane.querySelectorAll('img')].slice(0, 6)) icon.setAttribute('onmouseover', icon.getAttribute('onmouseover').replace(', 10)', ', 9)'));
        __perf.render(); const elapsed = __perf.snapshot().monsters[0].effects.Asleep.turns;
        document.querySelector('#textlog tbody').innerHTML = '<tr><td class="tl">The effect Asleep on Fixture Monster 0 has expired.</td></tr><tr><td class="tl">You attack.</td></tr><tr><td class="tls"></td></tr>';
        __perf.render();
        return { first, stable, images, elapsed, removed: !image.isConnected, remaining: pane.querySelectorAll('img').length,
            effects: __perf.snapshot().monsters[0].effects };
    });
    assert.equal(Number(result.first), 10); assert.equal(Number(result.stable), 10); assert.equal(result.images, 7);
    assert.equal(Number(result.elapsed), 9); assert.equal(result.removed, true); assert.equal(result.remaining, 6);
    assert.equal(result.effects.Asleep, undefined);
});
test('disabling optional decorations removes only owned nodes and re-enabling does not duplicate them', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(() => {
        __perf.render();
        const icon = document.querySelector('.btm2 img'), name = document.querySelector('.btm3 > div > div');
        const count = () => document.querySelectorAll('.monster-hp,.effect-duration,[data-field=monClass],[data-field=monTrAtkPl],.cooldown').length;
        const before = count();
        __perf.options({ showMonsterHP: false, showMonsterInfo: false, showMonsterIndex: false, showDurations: false, showCooldowns: false });
        __perf.render(); const disabled = count(), iconDisplay = icon.style.display;
        __perf.options({ showMonsterHP: true, showMonsterInfo: true, showMonsterIndex: true, showDurations: true, showCooldowns: true });
        __perf.render();
        return { before, disabled, after: count(), iconDisplay, nativePreserved: icon.isConnected && name.isConnected };
    });
    assert.equal(result.disabled, 0); assert.equal(result.after, result.before); assert.equal(result.iconDisplay, ''); assert.equal(result.nativePreserved, true);
});

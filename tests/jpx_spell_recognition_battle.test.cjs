'use strict';
// Complete production startup and battle handlers, isolated HTML/native clicks.
// No real HV account, installed userscript manager or server battle action.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture, source, html } = require('./fixtures/battle-reload.cjs');
const schools = {
    fire: ['Fiery Blast', 'Inferno', 'Flames of Loki'], cold: ['Freeze', 'Blizzard', 'Fimbulvetr'],
    wind: ['Gale', 'Downburst', 'Storms of Njord'], elec: ['Shockblast', 'Chained Lightning', 'Wrath of Thor'],
    holy: ['Smite', 'Banishment', 'Paradise Lost'], dark: ['Corruption', 'Disintegrate', 'Ragnarok']
};
const skill = name => '<div onclick="window.__casts++;window.__spellClicks.push(\'' + name + '\')" ' +
    'onmouseover="set_infopane_spell(\'' + name + '\', \'Fixture\', \'1001\', 10, 0, 5)">' + name + '</div>';
function markup(value, options = {}) {
    const names = options.quickbar || ['Cure', 'Imperil'];
    return value.replaceAll('Great Cleave', 'Concussive Strike')
        .replace('<div class="bts">', '<div class="btii"></div><div class="bts">' + Object.values(schools).flat().map(skill).join(''))
        .replace(/<div id="quickbar">[\s\S]*?<\/div><table id="textlog">/, '<div id="quickbar">' +
            names.map(name => skill(name).replace('<div ', '<div class="btqs" ')).join('') + '</div><table id="textlog">');
}
function expose() {
    window.__spellClicks = [];
    window.set_infopane_spell = name => { document.querySelector('.btii').textContent = name; };
    window.__spellBattle = {
        info: () => ({ element: getManagedSpellType(), stats: spellDamageBonus, quickbar: jpxQuickbarSpellType }),
        run(tier = 'T1') {
            cfgBattle.Staff_General.attacks[1].name = tier;
            isActiveBattle = true; smartBattle();
            return { active: isActiveBattle, ready: readyNext, clicks: [...window.__spellClicks], targets: window.__attacks };
        },
        ajax(value) {
            document.querySelector('#battle_main').innerHTML = new DOMParser().parseFromString(value, 'text/html').querySelector('#battle_main').innerHTML;
            reDoBattle();
        }
    };
}
const input = source.replace('\ninitDo();', '\n(' + expose.toString() + ')();\ninitDo();');
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => { await browser?.close(); });
function storage(isekai) {
    const suffix = isekai ? '_isekai' : '';
    return {
        ['jpx_persona' + suffix]: 'Fixture Persona', ['jpx_personaId' + suffix]: '17',
        ['jpx_cfgBattle' + suffix]: JSON.stringify({ battleVersion: 20251216,
            Staff_General: { supports: [{ type: 'stop', disabled: true, conditions: [] }],
                attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'spellDamage', name: 'T1', conditions: [] }] } })
    };
}
for (const [school, spells] of Object.entries(schools)) for (const isekai of [false, true]) for (const recognizedBeforeBattle of [false, true]) {
    test('retain ' + school + ' across battle startup and reload, Isekai ' + isekai + ', pre-battle ' + recognizedBeforeBattle, async t => {
        const saved = storage(isekai), suffix = isekai ? '_isekai' : '';
        if (recognizedBeforeBattle) {
            saved['jpx_spellDamageBonus' + suffix] = JSON.stringify({ maxType: school, maxValue: 200 });
            saved['jpx_spellDamageBonus' + suffix + ':context'] = JSON.stringify({ version: 1,
                world: isekai ? 'Isekai' : 'Persistent', persona: 'Fixture Persona', personaId: '17' });
        }
        const quickbar = [recognizedBeforeBattle ? school === 'wind' ? 'Smite' : 'Gale' : spells[0]];
        const f = await fixture(browser, t, { source: input, isekai, storage: saved, transform: markup, pageOptions: { quickbar } });
        t.after(() => assert.deepEqual(f.errors, []));
        assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, school);
        if (recognizedBeforeBattle) assert.equal((await f.page.evaluate(() => __spellBattle.info())).quickbar, '', 'known school never needs quickbar inference');
        await f.page.evaluate(value => __spellBattle.ajax(value), markup(html({ round: 2 })));
        assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, school, 'AJAX round must keep the recognized school');
        for (let tier = 1; tier <= 3; tier++) {
            const result = await f.page.evaluate(tier => __spellBattle.run('T' + tier), tier);
            assert.equal(result.active, true); assert.equal(result.ready, 0); assert.equal(result.clicks.at(-1), spells[tier - 1]);
            assert.equal(result.targets, tier);
        }
        await f.navigate({ round: 3 });
        assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, school, 'new document must keep the recognized school');
        const result = await f.page.evaluate(() => __spellBattle.run());
        assert.equal(result.active, true); assert.deepEqual(result.clicks, [spells[0]]);
        assert.equal(result.targets, 1);
        assert.ok(f.requests.every(url => !url.includes('s=Character')));
    });
}

test('unknown school stays unknown when the fallback is ambiguous', async t => {
    const f = await fixture(browser, t, { source: input, storage: storage(false), transform: markup, pageOptions: { quickbar: ['Smite', 'Corruption'] } });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, '');
    const result = await f.page.evaluate(() => __spellBattle.run());
    assert.equal(result.active, false); assert.match(result.ready, /Spell element unavailable/);
    assert.deepEqual(result.clicks, []); assert.equal(result.targets, 0); assert.deepEqual(f.errors, []);
});

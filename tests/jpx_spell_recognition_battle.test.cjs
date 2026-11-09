'use strict';
// Production startup across separate character, equipment and battle documents.
// Native clicks are recorded locally. No live account or battle request is used.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture, source, html } = require('./fixtures/battle-reload.cjs');
const schools = {
    fire: ['Fiery Blast', 'Inferno', 'Flames of Loki'], cold: ['Freeze', 'Blizzard', 'Fimbulvetr'],
    wind: ['Gale', 'Downburst', 'Storms of Njord'], elec: ['Shockblast', 'Chained Lightning', 'Wrath of Thor'],
    holy: ['Smite', 'Banishment', 'Paradise Lost'], dark: ['Corruption', 'Disintegrate', 'Ragnarok']
};
const families = {
    Staff: ['Concussive Strike', 'Legendary Willow Staff of Destruction', '', 'Staff', 0],
    OneHanded: ['Shield Bash', 'Legendary Rapier of Slaughter', 'Legendary Force Shield', '1H_Mage', 70],
    TwoHanded: ['Great Cleave', 'Legendary Mace of Slaughter', '', '2H_Mage', 100],
    DualWielding: ['Iris Strike', 'Legendary Rapier of Slaughter', 'Legendary Wakizashi of Balance', 'DW_Mage', 100],
    NitenIchiryu: ['Skyward Sword', 'Legendary Katana of Slaughter', 'Legendary Wakizashi of Balance', 'NI_Mage', 100]
};
const skill = (name, available = true) => '<div ' + (available ? 'onclick="window.__casts++;window.__spellClicks.push(\'' + name + '\')" ' : '') +
    'onmouseover="set_infopane_spell(\'' + name + '\', \'Fixture\', \'1001\', 10, 0, 5)">' + name + '</div>';
function markup(value, options = {}) {
    const family = options.family || 'Staff', spec = families[family], school = options.school || 'holy';
    const persona = options.persona || '17', name = options.personaName || 'Fixture Persona';
    const head = '<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div>' +
        '<form id="persona_form"><select><option value="' + persona + '" selected>' + name + '</option></select></form>';
    if (options.page === 'lobby') return head + '</div>';
    if (options.page === 'character') {
        const values = options.stats || { [school]: options.bonus ?? 200 };
        return head + '<div class="spc">Spell Damage Bonus</div><table>' + Object.keys(schools).map(type =>
            '<tr><td>' + (values[type] || 0) + '%</td><td>' + type + '</td></tr>').join('') + '</table></div>';
    }
    if (options.page === 'equipment') {
        const slot = (id, disabled) => '<div class="eqb' + (disabled ? ' eqdisabled' : '') + '"' +
            (disabled ? '' : ' onclick="location.href=\'/?s=Character&ss=eq&equip_slot=' + id + '\'"') + '><div>Slot</div>' +
            (disabled ? '<div class="eqempty">Unavailable</div>' : '<div data-eid="' + (100 + id) + '">Translated equipment name</div>') + '</div>';
        const armor = options.armor ? Array.from({length:5}, (_,i) => slot(i+3, false)).join('') : '';
        const data = { 101: { n: spec[1] }, 102: { n: spec[2] } };
        if (armor) for (let id=3;id<=7;id++) data[100+id] = {n:'Legendary ' + options.armor + ' armor'};
        return head + '<div id="eqsl"><img src="/y/set' + (options.set || '1') + '_on.png"></div><div id="eqsb">' +
            slot(1, false) + slot(2, !spec[2]) + armor + '</div><script>window.dynjs_equip=' +
            JSON.stringify(data) + ';</script></div>';
    }
    let battle = value.replaceAll('Great Cleave', spec[0]);
    if (options.noWeaponSkill) battle = battle.replace(/<div onmouseover="set_infopane_spell\('[^']+', 'Fixture', '1001', 10, 0, 5\)" onclick="window.__casts\+\+">[^<]+<\/div>/, '');
    if (options.locked) battle = battle.replace('onclick="window.__casts++">' + spec[0], '>' + spec[0]);
    return battle.replace('<div class="bts">', '<div class="btii"></div><div class="bts">' +
        Object.values(schools).flat().map(name => skill(name, options.available !== false)).join(''))
        .replace(/<div id="quickbar">[\s\S]*?<\/div><table id="textlog">/, '<div id="quickbar">' +
            (options.quickbar || ['Cure', 'Imperil']).map(name => skill(name).replace('<div ', '<div class="btqs" ')).join('') + '</div><table id="textlog">');
}
function expose() {
    window.__spellClicks = [];
    window.set_infopane_spell = name => { document.querySelector('.btii').textContent = name; };
    window.__spellBattle = {
        info: () => ({ element: getManagedSpellType(), stats: spellDamageBonus, style: battleStyle,
            detected: getDetectedJpxBattleStyle(), family: readJpxDetectedFamily() }),
        ensure: ensureJpxModeDetection,
        ageEquipment() { const key=jpxDetectedFamilyKey(), saved=JSON.parse(localStorage.getItem(key)); saved.verifiedAt-=86400000; localStorage.setItem(key,JSON.stringify(saved)); },
        run(tier = 'T1', element = '') {
            const rules = getJpxBattleRules(); if (rules) rules.attacks[1].name = tier;
            if (rules && element) rules.jpxPlusExecution = { element };
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
    const modes = [...new Set(Object.entries(families).flatMap(([family, spec]) => [family, spec[3]]))];
    const config = { battleVersion: 20251216 };
    for (const mode of modes) config[mode + '_General'] = { supports: [{ type: 'stop', disabled: true, conditions: [] }],
        attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'spellDamage', name: 'T1', conditions: [] }] };
    return { ['jpx_cfgBattle' + (isekai ? '_isekai' : '')]: JSON.stringify(config) };
}
async function enter(t, options) {
    const { isekai = false } = options;
    const f = await fixture(browser, t, { source: input, isekai, storage: storage(isekai), transform: markup, observedEquipment: false,
        pageOptions: { ...options, page: 'character' } });
    t.after(() => { assert.deepEqual(f.errors, []); assert.deepEqual(f.combatRequests, [], 'combat never requests non-battle pages'); });
    await f.page.evaluate(() => __spellBattle.ensure());
    await f.navigate({ ...options, page: 'equipment' });
    await f.page.evaluate(() => __spellBattle.ensure());
    await f.navigate({ ...options, round: 1 });
    await f.page.evaluate(() => __spellBattle.ensure());
    return f;
}

for (const isekai of [false, true]) test('lobby startup records equipment and bonuses before battle without opening settings: ' + isekai, async t => {
    const options={family:'OneHanded',school:'holy',bonus:150,isekai};
    const f=await fixture(browser,t,{source:input,isekai,storage:storage(isekai),transform:markup,observedEquipment:false,
        pageOptions:{...options,page:'lobby'},respond:url=>url.searchParams.get('s')==='Character'?
            markup('',{...options,page:url.searchParams.get('ss')==='ch'?'character':'equipment'}):undefined});
    await f.page.waitForFunction(()=>__spellBattle.info().detected==='1H_Mage');
    assert.equal(f.requests.filter(url=>url.includes('s=Character')).length,2);
    await f.navigate({...options,quickbar:[],noWeaponSkill:true});
    const info=await f.page.evaluate(()=>__spellBattle.info());
    assert.equal(info.style,'1H_Mage'); assert.equal(info.element,'holy');
    assert.equal((await f.page.evaluate(()=>__spellBattle.run())).clicks.at(-1),'Smite');
    assert.deepEqual(f.combatRequests,[]); assert.deepEqual(f.errors,[]);
});

async function recognitionLobby(t, isekai, school = 'holy') {
    const options = { family: 'DualWielding', school, bonus: 200, isekai };
    const f = await fixture(browser, t, { source: input, isekai, storage: storage(isekai), transform: markup, observedEquipment: false,
        pageOptions: { ...options, page: 'lobby' }, respond: url => url.searchParams.get('s') === 'Character' ?
            markup('', { ...options, page: url.searchParams.get('ss') === 'ch' ? 'character' : 'equipment' }) : undefined });
    await f.page.waitForFunction(() => __spellBattle.info().detected === 'DW_Mage');
    return { ...f, options };
}

async function submitLobbyForm(page, query, id = 'equipform') {
    await page.evaluate(({ query, id }) => {
        history.replaceState(null, '', location.pathname + query);
        const form = document.getElementById(id) || document.body.appendChild(document.createElement('form'));
        form.id = id;
        // Keep native submit propagation, but replace navigation with the next fixture document.
        form.addEventListener('submit', event => event.preventDefault());
        const button = form.appendChild(document.createElement('button'));
        button.type = 'submit'; button.id = 'fixture-submit'; button.textContent = 'Submit';
    }, { query, id });
    await page.locator('#fixture-submit').click();
}

const recognitionCache = (page, isekai) => page.evaluate(suffix => Object.fromEntries([
    'jpx_persona' + suffix, 'jpx_personaId' + suffix, 'jpx_equipmentFamily_v1' + suffix,
    'jpx_spellDamageBonus' + suffix, 'jpx_spellDamageBonus' + suffix + ':context',
    'jpx_loadouts_v1' + suffix, 'jpx_cfgBattle' + suffix
].map(key => [key, localStorage.getItem(key)])), isekai ? '_isekai' : '');

for (const isekai of [false, true]) for (const school of Object.keys(schools)) {
    test('Item World form preserves recognition into combat: ' + school + ' / Isekai ' + isekai, async t => {
        const f = await recognitionLobby(t, isekai, school);
        const before = await recognitionCache(f.page, isekai), count = f.requests.length;
        await submitLobbyForm(f.page, '?s=Battle&ss=iw');
        assert.deepEqual(await recognitionCache(f.page, isekai), before, 'entering Item World does not change equipped items');
        assert.equal(f.requests.length, count, 'entry does not start another character lookup');
        await f.navigate({ ...f.options, quickbar: [], noWeaponSkill: true });
        const info = await f.page.evaluate(() => __spellBattle.info());
        assert.equal(info.style, 'DW_Mage'); assert.equal(info.element, school);
        const result = await f.page.evaluate(() => __spellBattle.run());
        assert.equal(result.active, true); assert.equal(result.clicks.at(-1), schools[school][0]);
        await f.navigate({ ...f.options, round: 2, quickbar: [], noWeaponSkill: true });
        assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, school);
        assert.deepEqual(f.combatRequests, []); assert.deepEqual(f.errors, []);
    });
}

for (const isekai of [false, true]) test('Item World exception retains other loadout invalidation: Isekai ' + isekai, async t => {
    for (const [query, id, invalidates] of [
        ['?s=Bazaar&ss=am&screen=modify', 'equipform', true],
        ['?s=Character&ss=eq', 'equipform', true],
        ['?s=Character&ss=ch', 'persona_form', true],
        ['?s=Character&ss=eq', 'unrelated-form', false]
    ]) {
        const f = await recognitionLobby(t, isekai);
        const before = await recognitionCache(f.page, isekai);
        await submitLobbyForm(f.page, query, id);
        const after = await recognitionCache(f.page, isekai), suffix = isekai ? '_isekai' : '';
        if (invalidates) {
            assert.equal(after['jpx_equipmentFamily_v1' + suffix], null);
            assert.equal(after['jpx_spellDamageBonus' + suffix], null);
            assert.equal(after['jpx_spellDamageBonus' + suffix + ':context'], null);
            assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, '');
        } else assert.deepEqual(after, before);
        assert.deepEqual(f.errors, []);
    }
});

for (const school of Object.keys(schools)) for (const [family, spec] of Object.entries(families)) for (const isekai of [false, true]) {
    test('character to equipment to battle: ' + school + ' / ' + family + ' / Isekai ' + isekai, async t => {
        const options = { school, family, isekai, bonus: 200, locked: true, quickbar: [school === 'wind' ? 'Smite' : 'Gale'] };
        const f = await enter(t, options), info = await f.page.evaluate(() => __spellBattle.info());
        assert.equal(info.element, school); assert.equal(info.style, spec[3]); assert.equal(info.detected, spec[3]);
        assert.equal(info.family, family);
        await f.page.evaluate(value => __spellBattle.ajax(value), markup(html({ round: 2 }), { ...options, quickbar: [] }));
        for (let tier = 1; tier <= 3; tier++) {
            const result = await f.page.evaluate(tier => __spellBattle.run('T' + tier), tier);
            assert.equal(result.active, true); assert.equal(result.ready, 0); assert.equal(result.clicks.at(-1), schools[school][tier - 1]);
        }
        await f.navigate({ ...options, round: 3, quickbar: [] });
        const restored = await f.page.evaluate(() => __spellBattle.info());
        assert.equal(restored.element, school); assert.equal(restored.style, spec[3]);
    });
}
for (const [family, spec] of Object.entries(families).filter(([family]) => family !== 'Staff')) for (const bonus of [0, spec[4], spec[4] + 0.1]) {
    test('physical and hybrid threshold: ' + family + ' / ' + bonus, async t => {
        const f = await enter(t, { school: 'dark', family, bonus });
        const info = await f.page.evaluate(() => __spellBattle.info());
        assert.equal(info.style, bonus > spec[4] ? spec[3] : family);
        assert.equal(info.detected, info.style);
        assert.equal(info.element, bonus ? 'dark' : '', 'zero bonuses do not establish a spell school');
    });
}

for (const armor of ['Phase', 'Cotton', 'Shade', 'Power']) test('armor is ignored: ' + armor, async t => {
    for (const bonus of [20, 150]) {
        const f=await enter(t,{family:'OneHanded',school:'holy',bonus,armor});
        assert.equal((await f.page.evaluate(()=>__spellBattle.info())).style,bonus>70?'1H_Mage':'OneHanded');
    }
});

test('missing weapon skills and a long battle do not expire the pre-battle recognition', async t => {
    const options={family:'NitenIchiryu',school:'dark',bonus:150,noWeaponSkill:true,quickbar:[]};
    const f=await enter(t,options);
    await f.page.evaluate(()=>__spellBattle.ageEquipment());
    await f.navigate({...options,round:3});
    assert.equal((await f.page.evaluate(()=>__spellBattle.info())).style,'NI_Mage');
    const result=await f.page.evaluate(()=>__spellBattle.run());
    assert.equal(result.active,true); assert.equal(result.clicks.at(-1),'Corruption');
});
for (const quickbar of [[], ['Smite'], ['Corruption'], ['Smite', 'Corruption']]) test('no pre-battle statistics, quickbar=' + quickbar.join(','), async t => {
    const saved = { ...storage(false), jpx_persona: 'Fixture Persona', jpx_personaId: '17',
        jpx_spellQuickbar_v1: JSON.stringify({ version: 1, world: 'Persistent', persona: 'Fixture Persona', personaId: '17', element: 'holy' }) };
    const f = await fixture(browser, t, { source: input, storage: saved, transform: markup, pageOptions: { quickbar }, observedEquipment: false });
    const info = await f.page.evaluate(() => __spellBattle.info());
    assert.equal(info.element, ''); assert.equal(info.family, ''); assert.equal(info.style, '');
    await f.page.evaluate(() => __spellBattle.ensure());
    const result = await f.page.evaluate(() => __spellBattle.run());
    assert.equal(result.active, false); assert.match(result.ready, /no scene or General strategy/);
    assert.deepEqual(result.clicks, []); assert.equal(result.targets, 0); assert.deepEqual(f.errors, []);
    assert.ok(f.requests.every(url => !url.includes('s=Character')));
});

test('equal highest bonuses do not invent a spell school', async t => {
    const f = await enter(t, { stats: { holy: 200, dark: 200 }, quickbar: ['Smite'] });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, '');
});

test('unavailable spells retain the existing action handling', async t => {
    const f = await enter(t, { school: 'holy', available: false });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, 'holy');
    const result = await f.page.evaluate(() => __spellBattle.run());
    assert.equal(result.active, false); assert.match(result.ready, /No available action/);
    assert.deepEqual(result.clicks, []); assert.equal(result.targets, 0);
});

test('switching equipment sets needs fresh statistics before the next battle', async t => {
    const f = await enter(t, { school: 'holy' });
    await f.navigate({ page: 'equipment', set: '2' });
    await f.navigate({ round: 2, quickbar: ['Smite'] });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, '');
    await f.navigate({ page: 'character', school: 'dark' });
    await f.navigate({ round: 3 });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, 'dark');
});

test('switching persona cannot reuse another persona attribute', async t => {
    const f = await enter(t, { school: 'holy' });
    await f.navigate({ page: 'equipment', persona: '18', personaName: 'Second Persona' });
    await f.navigate({ round: 2, quickbar: ['Smite'] });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, '');
    await f.navigate({ page: 'character', persona: '18', personaName: 'Second Persona', school: 'cold' });
    await f.navigate({ round: 3 });
    assert.equal((await f.page.evaluate(() => __spellBattle.info())).element, 'cold');
});

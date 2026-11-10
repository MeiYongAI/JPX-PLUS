'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'JPX-PLUS.user.js'), 'utf8');
const start = source.indexOf('function getJpxDetectionContext(');
const end = source.indexOf('\nfunction initDo() {', start);
assert.ok(start > 0 && end > start, 'production detection helpers exist');
const helpers = source.slice(start, end);

function fixture(options = {}) {
    const suffix = options.suffix || '';
    const data = options.data || new Map();
    if (!options.data) {
        data.set('jpx_persona' + suffix, 'Persona One');
        data.set('jpx_personaId' + suffix, '1');
        data.set('jpx_loadouts_v1' + suffix, JSON.stringify({current:{world:suffix?'Isekai':'Persistent',personaId:'1',setId:'1'}}));
    }
    const storage = {
        getItem: key => data.get(key) ?? null,
        setItem: (key, value) => data.set(key, String(value)),
        removeItem: key => data.delete(key)
    };
    const listeners = { document: {}, window: {} }, events = [];
    let select = null, labels = [], slots = [], actions = {}, battle = false;
    const metadata = {};
    const document = {
        querySelector: selector => selector === '#persona_form select' ? select : selector.includes('#textlog') && battle ? {} : selector === '#eqsb' && slots.length ? {} : null,
        querySelectorAll: selector => selector === '.spc' ? labels : selector === '#eqsb > .eqb' ? slots :
            selector === '.bts > div[onmouseover]' ? Object.keys(actions).map(name => ({getAttribute:()=>"set_infopane_spell('"+name+"', 'Fixture', '1001', 10, 0, 5)"})) : [],
        addEventListener: (name, callback) => { (listeners.document[name] ||= []).push(callback); }
    };
    const window = {
        dynjs_equip: metadata,
        dispatchEvent: event => { events.push(event.type); },
        addEventListener: (name, callback) => { (listeners.window[name] ||= []).push(callback); }
    };
    const context = vm.createContext({ document, window, localStorage: storage,
        prefix: 'jpx_', isekaiSuffix: suffix, log: null, battleStyle: 'TwoHanded', jpxLoadoutBusy: false,
        readJpxLoadoutCatalog: () => JSON.parse(data.get('jpx_loadouts_v1' + suffix) || '{}'), queueMicrotask,
        spellDamageBonus: { maxType: 'fire', maxValue: 0 },
        Event: class { constructor(type) { this.type = type; } },
        regExp: { spellInfo: /\('([\w\s-]+)'.*, '(\w+)', (\d+), (\d+), (\d+)\)/ },
        getActionCooldowns: () => { throw Error('Recognition must not depend on loaded cooldown statistics'); },
        fetch: () => { throw new Error('Battle detection must not fetch character pages'); },
        jpxUtils: { parseHVClasses: node => node?.nativeLabel || '' }
    });
    vm.runInContext(helpers + '\nglobalThis.api={context:getJpxDetectionContext,read:readJpxSpellDamageBonus,refresh:refreshJpxModeDetection,init:initJpxModeDetection,detect:getDetectedJpxBattleStyle,ensure:ensureJpxModeDetection,family:readJpxDetectedFamily,gear:getJpxEquippedStyleFamily};', context);
    const key = 'jpx_spellDamageBonus' + suffix;
    const plain = value => value === null ? null : JSON.parse(JSON.stringify(value));
    return {
        api: context.api, data, key, context, metadata, events,
        read: verified => plain(context.api.read(verified)),
        memory: () => plain(context.spellDamageBonus),
        cache(value, cacheContext = { version: 1, world: suffix ? 'Isekai' : 'Persistent', persona: 'Persona One', personaId: '1' }) {
            data.set(key, JSON.stringify(value));
            if (cacheContext) data.set(key + ':context', JSON.stringify(cacheContext));
            else data.delete(key + ':context');
        },
        persona(name, id = '1') {
            const selected = { textContent: name };
            select = { value: id, selectedOptions: [selected], selectedIndex: 1, options: [{ textContent: 'Old attribute-selected option' }, selected] };
        },
        stats(rows, translated = false) {
            labels = [{ textContent: translated ? 'translated heading' : 'Spell Damage Bonus',
                querySelector: () => ({ nativeLabel: 'Spell Damage Bonus' }),
                nextElementSibling: { querySelectorAll: () => rows.map(([value, type]) => ({ querySelectorAll: () => [{ textContent: String(value) }, { textContent: type }] })) } }];
        },
        clearStats() { labels = []; },
        battle(value = {}, useLog = true) { actions = value; battle = true; context.log = useLog ? {} : null; },
        lobby() { battle = false; context.log = null; },
        equipment(main, off) {
            const slot = (number, name) => {
                const id = name === '' ? '' : String(100 + number);
                if (name !== null && name !== '') metadata[id] = { n: name };
                return { getAttribute: attr => attr === 'onclick' ? 'location.href="?s=Character&ss=eq&equip_slot=' + number + '"' : null,
                    children: [{}, { dataset: id ? { eid: id } : {}, getAttribute: () => null, matches: selector => name === '' && selector === '.eqempty' }] };
            };
            slots = [slot(1, main), slot(2, off)];
        },
        dropOffhand() { slots.pop(); },
        disableOffhand(empty = true) {
            const off = slots[1]; off.getAttribute = () => null;
            off.matches = selector => selector === '.eqb.eqdisabled';
            off.children[1].matches = selector => empty && selector === '.eqempty';
            slots[0].nextElementSibling = off;
        },
        emit(target, name, event) { for (const callback of listeners[target][name] || []) callback(event); }
    };
}

test('invalid caches cannot crash startup and legacy values do not claim verified detection', () => {
    const h = fixture();
    for (const raw of ['{broken', 'null', '{"maxType":"fire","maxValue":"200"}', '{"maxType":"unknown","maxValue":200}', '{"maxType":"cold","maxValue":-1}']) {
        h.data.set(h.key, raw);
        assert.deepEqual(h.read(), { maxType: '', maxValue: 0 });
        assert.equal(h.read(true), null);
    }
    h.cache({ maxType: 'cold', maxValue: 123 }, null);
    assert.deepEqual(h.read(), { maxType: 'cold', maxValue: 123 }, 'legacy runtime cache shape is retained');
    assert.equal(h.read(true), null);
    h.battle({ 'Shield Bash': 0 });
    assert.equal(h.api.detect(), '');
});

test('current selected persona and character stats update memory and verified cache together', () => {
    const h = fixture();
    h.cache({ maxType: 'fire', maxValue: 15 });
    h.persona('Persona Two', '2');
    h.stats([[8, 'Fire'], [147.2, 'Cold'], ['bad', 'Holy'], [999, 'Unsupported']], true);
    h.api.refresh();
    assert.deepEqual(h.memory(), { maxType: 'cold', maxValue: 147.2 });
    assert.deepEqual(h.read(true), h.memory());
    assert.equal(h.data.get('jpx_persona'), 'Persona Two');
    assert.equal(h.data.get('jpx_personaId'), '2');
    assert.equal(JSON.parse(h.data.get(h.key + ':context')).personaId, '2');
    assert.deepEqual(h.events, ['jpx:mode-detected']);
    h.api.refresh();
    assert.equal(h.events.length, 1, 'unchanged readings do not repeatedly notify');
});

test('persona identity changes without visible stats invalidate old caches including duplicate names', () => {
    for (const [name, id] of [['Persona Two', '2'], ['Persona One', '2']]) {
        const h = fixture(); h.cache({ maxType: 'dark', maxValue: 250 });
        h.persona(name, id); h.api.refresh();
        assert.equal(h.data.has(h.key), false);
        assert.equal(h.read(true), null);
        assert.deepEqual(h.memory(), { maxType: '', maxValue: 0 });
    }
});

test('first observed persona ID preserves an unchanged native cache without promoting it to verified', () => {
    const h = fixture(); h.data.delete('jpx_personaId');
    h.cache({ maxType: 'cold', maxValue: 180 }, null);
    h.persona('Persona One', '1'); h.api.refresh();
    assert.deepEqual(h.memory(), { maxType: 'cold', maxValue: 180 });
    assert.equal(h.read(true), null);
    assert.equal(h.data.get('jpx_personaId'), '1');
});

test('verified stats are isolated by world and persona without changing battle configuration', () => {
    const h = fixture();
    const originalConfig = '{"battleVersion":20251216,"futureKey":{"unchanged":true}}';
    h.data.set('jpx_cfgBattle', originalConfig);
    h.cache({ maxType: 'wind', maxValue: 160 });
    assert.equal(h.read(true).maxValue, 160);
    for (const change of [{ world: 'Isekai' }, { persona: 'Other' }, { personaId: '2' }]) {
        h.cache({ maxType: 'wind', maxValue: 160 }, { version: 1, world: 'Persistent', persona: 'Persona One', personaId: '1', ...change });
        assert.equal(h.read(true), null);
        assert.deepEqual(h.read(), { maxType: '', maxValue: 0 });
    }
    const other = fixture({ suffix: '_isekai', data: h.data });
    assert.equal(other.read(true), null);
    assert.equal(h.data.get('jpx_cfgBattle'), originalConfig);
});

test('main/offhand equipment combines with the original spell-bonus thresholds', () => {
    for (const [main, off, melee, mage, limit] of [['Rapier', 'Force Shield', 'OneHanded', '1H_Mage', 70], ['Mace', '', 'TwoHanded', '2H_Mage', 100],
        ['Rapier', 'Wakizashi', 'DualWielding', 'DW_Mage', 100], ['Katana', 'Wakizashi', 'NitenIchiryu', 'NI_Mage', 100]]) {
        const h = fixture(); h.equipment('Legendary Shocking ' + main, off);
        h.cache({ maxType: '', maxValue: 0 }); assert.equal(h.api.detect(), melee);
        h.cache({ maxType: 'fire', maxValue: limit }); assert.equal(h.api.detect(), melee);
        h.cache({ maxType: 'fire', maxValue: limit + 0.1 }); assert.equal(h.api.detect(), mage);
    }
});

test('automatic routing follows detected physical or mage style despite sibling metadata', () => {
    const from = source.indexOf('function resolveJpxScene('), to = source.indexOf('function pauseForJpxConfigApplication(', from);
    const stylesFrom = source.indexOf('const BATTLE_STYLES ='), stylesTo = source.indexOf(';', stylesFrom);
    assert.ok(from > 0 && to > from && stylesFrom > 0);
    for (const [main, off, physical, mage, threshold] of [
        ['Rapier', 'Force Shield', 'OneHanded', '1H_Mage', 70], ['Mace', '', 'TwoHanded', '2H_Mage', 100],
        ['Rapier', 'Wakizashi', 'DualWielding', 'DW_Mage', 100], ['Katana', 'Wakizashi', 'NitenIchiryu', 'NI_Mage', 100]
    ]) {
        const h = fixture(); h.equipment(main, off);
        Object.assign(h.context, { cfgBattle: {}, battleType: 'Arena', selected: '', jpxSceneRuntime: { scenes: {} },
            getJpxSelectedBattleMode: () => h.context.selected,
            jpxConfigHasContent: value => !!value && !!(value.supports?.length || value.attacks?.length) });
        vm.runInContext(source.slice(stylesFrom, stylesTo + 1) + source.slice(from, to), h.context);
        const rules = style => ({ supports: [], attacks: [{ type: 'normalAttack' }], jpxPlusExecution: { style, element: 'auto' } });
        for (const style of [physical, mage]) {
            h.context.cfgBattle[style + '_General'] = rules(style);
            h.context.jpxSceneRuntime.scenes[style + '_General'] = { id: style + '-general', rules: rules(style) };
        }
        for (const [bonus, expected] of [[threshold + 1, mage], [threshold, physical], [threshold + 1, mage]]) {
            h.cache({ maxType: 'holy', maxValue: bonus }); h.context.battleStyle = h.api.detect();
            const effective = vm.runInContext('getManagedBattleStyle(battleStyle)', h.context);
            assert.equal(effective, expected);
            assert.equal(h.context.resolveJpxScene(effective, 'Arena').id, expected + '-general');
        }
        h.context.jpxSceneRuntime.scenes[mage + '_Arena'] = { id: 'mage-arena', rules: { supports: [], attacks: [{ type: 'spellDamage', name: 'T1' }] } };
        assert.equal(h.context.resolveJpxScene(h.context.getManagedBattleStyle(mage), 'Arena').id, 'mage-arena');
        h.context.jpxSceneRuntime.scenes = {};
        assert.equal(h.context.getManagedBattleStyle(mage), mage, 'native sibling metadata cannot override detection either');
        assert.equal(h.context.getManagedBattleStyle(''), '', 'stored rules cannot invent unknown equipment');
        h.context.selected = physical + '_General';
        assert.equal(h.context.getManagedBattleStyle(mage), physical, 'an explicitly fixed selection still wins');
    }
});

test('battle skills never invent or override pre-battle equipment recognition', () => {
    const h = fixture();
    h.equipment('Legendary Willow Staff', ''); h.api.refresh();
    h.battle({ 'Concussive Strike': '-' });
    assert.equal(h.api.detect(), 'Staff');
    h.context.battleStyle = 'OneHanded';
    assert.equal(h.api.detect(), 'Staff', 'applied or mocked runtime style cannot change actual recognition');
    h.battle({ 'Concussive Strike': 9 }, false);
    assert.equal(h.api.detect(), 'Staff', 'battle detection also works before log is assigned');
    for (const actions of [{}, { Fireball: 0 }, { 'Shield Bash': 0, 'Great Cleave': 0 }]) {
        h.battle(actions); assert.equal(h.api.detect(), 'Staff', 'missing or conflicting skills do not change the equipment observation');
        const unknown = fixture(); unknown.battle(actions); assert.equal(unknown.api.detect(), '');
    }
});

test('lobby recognition uses equipped English metadata and never assumes single-handed', () => {
    const cases = [['Legendary Rapier', 'Legendary Force Shield', 'OneHanded'], ['Legendary Estoc', '', 'TwoHanded'],
        ['Legendary Axe', 'Legendary Wakizashi', 'DualWielding'], ['Legendary Katana', 'Legendary Wakizashi', 'NitenIchiryu'],
        ['Legendary Oak Staff', '', 'Staff']];
    for (const [main, off, expected] of cases) {
        const h = fixture(); h.equipment(main, off); h.cache({ maxType: 'fire', maxValue: 10 });
        assert.equal(h.api.detect(), expected);
    }
    const unknown = fixture(); assert.equal(unknown.api.detect(), '');
    unknown.equipment('Legendary Rapier', null); assert.equal(unknown.api.detect(), '');
    unknown.dropOffhand(); assert.equal(unknown.api.detect(), '');
});

test('native disabled offhand without a slot link identifies staff and two-handed equipment', () => {
    for (const [name, expected] of [['Legendary Willow Staff', 'Staff'], ['Legendary Estoc', 'TwoHanded']]) {
        const h = fixture(); h.equipment(name, ''); h.disableOffhand();
        h.cache({ maxType: 'wind', maxValue: 20 });
        assert.equal(h.api.detect(), expected);
        h.disableOffhand(false);
        assert.equal(h.api.detect(), '', 'a disabled sibling without an explicit empty slot is not sufficient evidence');
    }
});

test('empty original-name metadata falls back to the native equipment title', () => {
    const h = fixture(); h.equipment('Legendary Willow Staff', ''); h.disableOffhand();
    h.metadata['101'] = { n: '', t: 'Legendary Willow Staff of Destruction' };
    assert.equal(h.api.detect(), 'Staff');
    h.metadata['101'] = { n: 'Legendary Willow Staff of Destruction', t: 'A personal equipment nickname' };
    assert.equal(h.api.detect(), 'Staff', 'a renamed weapon still uses its original native name');
});

test('native persona/equipment changes invalidate cache and publish a recognition event', () => {
    for (const [type, target] of [['change', { closest: () => ({}) }], ['submit', { matches: () => true }], ['click', { closest: () => ({}) }]]) {
        const h = fixture(); h.cache({ maxType: 'holy', maxValue: 150 }); h.api.init();
        h.emit('document', type, { target });
        assert.equal(h.read(true), null);
        assert.deepEqual(h.memory(), { maxType: '', maxValue: 0 });
        assert.ok(h.events.includes('jpx:mode-detected'));
    }
});

test('only verified equipment observations survive navigation and long battles', () => {
    const equip = fixture(); equip.equipment('Legendary Willow Staff', ''); equip.disableOffhand(); equip.api.refresh();
    assert.equal(fixture({ data: equip.data }).api.detect(), 'Staff', 'another page reads the verified equipment observation');
    const key = 'jpx_equipmentFamily_v1', saved = JSON.parse(equip.data.get(key)); saved.verifiedAt -= 86400000;
    equip.data.set(key, JSON.stringify(saved));
    const battle = fixture({data:equip.data}); battle.battle({});
    assert.equal(battle.api.detect(), 'Staff'); assert.equal(battle.api.family(true), '', 'stale evidence is refreshed outside combat');
    assert.equal(fixture({ data: equip.data, suffix: '_isekai' }).api.detect(), '', 'the other world never borrows the observation');
    const otherPersona = fixture({ data: equip.data }); otherPersona.persona('Different Persona', '2');
    assert.equal(otherPersona.api.detect(), '', 'a different persona never borrows the observation');
});

test('equipment invalidation cannot immediately cache the old DOM again', () => {
    const h = fixture(); h.equipment('Legendary Willow Staff', ''); h.disableOffhand(); h.api.init();
    assert.equal(h.api.detect(), 'Staff');
    h.emit('document', 'submit', { target: { matches: () => true } });
    assert.equal(h.api.detect(), '');
    assert.equal(fixture({ data: h.data }).api.detect(), '');
});

test('empty hands are distinct from missing or unrecognizable weapon data', () => {
    for (const [main, off, expected] of [['', '', 'Unarmed'], ['Legendary Rapier', '', 'OneHanded'],
        ['Legendary Fiery Rapier of Slaughter', 'Legendary Force Shield', 'OneHanded'],
        ['', 'Legendary Force Shield', ''], ['Legendary Staff', 'Legendary Rapier', '']]) {
        const h = fixture(); h.equipment(main, off); h.cache({maxType:'fire',maxValue:10});
        assert.equal(h.api.detect(), expected);
    }
    const h = fixture(); h.equipment('Legendary Staff', ''); h.metadata['101'] = {n:'',t:''};
    assert.equal(h.api.detect(), '', 'an unnamed item is not an empty mainhand');
});

test('weapon changes in the same set invalidate old spell bonuses', () => {
    const h = fixture(); h.equipment('Legendary Fiery Rapier', 'Legendary Force Shield'); h.cache({maxType:'fire',maxValue:170});
    assert.equal(h.api.detect(), '1H_Mage');
    h.equipment('Legendary Arctic Rapier', 'Legendary Force Shield');
    assert.equal(h.api.detect(), ''); assert.equal(h.read(true), null);
    h.cache({maxType:'cold',maxValue:25}); assert.equal(h.api.detect(), 'OneHanded');
});

test('equipment caches cannot cross sets or revive old battle-skill evidence', () => {
    const h = fixture(); h.equipment('Legendary Staff', ''); h.api.refresh();
    h.data.set('jpx_loadouts_v1', JSON.stringify({current:{world:'Persistent',personaId:'1',setId:'2'}}));
    assert.equal(fixture({data:h.data}).api.detect(), '');
    h.data.delete('jpx_equipmentFamily_v1');
    h.data.set('jpx_detectedWeaponFamily_v1', JSON.stringify({version:1,world:'Persistent',persona:'Persona One',personaId:'1',family:'Staff',verifiedAt:Date.now()}));
    const battle = fixture({data:h.data}); battle.battle({'Concussive Strike':0});
    assert.equal(battle.api.detect(), '');
});

test('old displayed attributes cannot revive after a persona or equipment change', () => {
    const h = fixture(); h.stats([[200, 'Wind']]); h.api.init();
    assert.equal(h.memory().maxType, 'wind');
    h.emit('document', 'submit', { target: { matches: () => true } }); h.api.refresh();
    assert.deepEqual(h.memory(), { maxType: '', maxValue: 0 }); assert.equal(h.read(true), null);
});

test('battle detection never attempts inaccessible character pages, including unknown skills', async () => {
    for (const skills of [{ 'Concussive Strike': 0 }, { 'Shield Bash': 0 }, {}]) {
        const h = fixture(); h.battle(skills);
        await h.api.ensure();
    }
});

test('cross-tab current-world cache updates refresh lobby memory but ignore unrelated worlds', () => {
    const h = fixture(); h.api.init();
    h.cache({ maxType: 'elec', maxValue: 120 });
    h.emit('window', 'storage', { key: h.key });
    assert.deepEqual(h.memory(), { maxType: 'elec', maxValue: 120 });
    assert.deepEqual(h.events, ['jpx:mode-detected']);
    h.emit('window', 'storage', { key: h.key + '_isekai' });
    assert.equal(h.events.length, 1);
});

test('the production boot refreshes detection before battle initialization without replacing configuration selection', () => {
    assert.ok(source.includes('let spellDamageBonus = readJpxSpellDamageBonus();'));
    assert.match(source, /loadBattleConfig\(\);\s+initJpxModeDetection\(\);\s+initJpxLoadoutBindings\(\);\s+\/\/Battle/);
    assert.ok(source.includes('battleStyle = getDetectedJpxBattleStyle();'));
    assert.equal(source.includes('getJpxBattleSkillFamily'), false);
    assert.equal(helpers.includes('cfgBattle'), false);
});

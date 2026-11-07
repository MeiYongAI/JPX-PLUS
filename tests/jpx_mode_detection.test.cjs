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
        querySelector: selector => selector === '#persona_form select' ? select : selector === '#textlog' && battle ? {} : selector === '#eqsb' && slots.length ? {} : null,
        querySelectorAll: selector => selector === '.spc' ? labels : selector === '#eqsb > .eqb' ? slots : [],
        addEventListener: (name, callback) => { (listeners.document[name] ||= []).push(callback); }
    };
    const window = {
        dynjs_equip: metadata,
        dispatchEvent: event => { events.push(event.type); },
        addEventListener: (name, callback) => { (listeners.window[name] ||= []).push(callback); }
    };
    const context = vm.createContext({ document, window, localStorage: storage,
        prefix: 'jpx_', isekaiSuffix: suffix, log: null, battleStyle: 'TwoHanded', jpxLoadoutBusy: false,
        spellDamageBonus: { maxType: 'fire', maxValue: 0 }, Event: class { constructor(type) { this.type = type; } },
        getActionCooldowns: () => ({ spellCooldowns: actions }),
        fetch: () => { throw new Error('Battle detection must not fetch character pages'); },
        jpxUtils: { parseHVClasses: node => node?.nativeLabel || '' }
    });
    vm.runInContext(helpers + '\nglobalThis.api={context:getJpxDetectionContext,read:readJpxSpellDamageBonus,refresh:refreshJpxModeDetection,init:initJpxModeDetection,detect:getDetectedJpxBattleStyle,ensure:ensureJpxModeDetection,family:getJpxBattleSkillFamily,gear:getJpxEquippedStyleFamily};', context);
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
                    children: [{}, { dataset: id ? { eid: id } : {}, getAttribute: () => null }] };
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
        assert.deepEqual(h.read(), { maxType: 'fire', maxValue: 0 });
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
        assert.deepEqual(h.memory(), { maxType: 'fire', maxValue: 0 });
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
        assert.deepEqual(h.read(), { maxType: 'fire', maxValue: 0 });
    }
    const other = fixture({ suffix: '_isekai', data: h.data });
    assert.equal(other.read(true), null);
    assert.equal(h.data.get('jpx_cfgBattle'), originalConfig);
});

test('zero magic bonus is valid and the original melee and battlemage thresholds are preserved', () => {
    const h = fixture(); h.persona('Persona One'); h.stats([[0, 'Fire']]); h.api.refresh();
    assert.deepEqual(h.read(true), { maxType: 'fire', maxValue: 0 });
    for (const [skill, melee, mage, limit] of [['Shield Bash', 'OneHanded', '1H_Mage', 70], ['Great Cleave', 'TwoHanded', '2H_Mage', 100],
        ['Iris Strike', 'DualWielding', 'DW_Mage', 100], ['Skyward Sword', 'NitenIchiryu', 'NI_Mage', 100]]) {
        h.battle({ [skill]: 0 });
        h.cache({ maxType: 'fire', maxValue: limit }); assert.equal(h.api.detect(), melee);
        h.cache({ maxType: 'fire', maxValue: limit + 0.1 }); assert.equal(h.api.detect(), mage);
    }
});

test('actual battle skills identify staff independently of cache or selected rules', () => {
    const h = fixture();
    h.battle({ 'Concussive Strike': '-' });
    assert.equal(h.api.detect(), 'Staff');
    h.context.battleStyle = 'OneHanded';
    assert.equal(h.api.detect(), 'Staff', 'applied or mocked runtime style cannot change actual recognition');
    h.battle({ 'Concussive Strike': 9 }, false);
    assert.equal(h.api.detect(), 'Staff', 'textlog DOM is sufficient when log has not been assigned');
    for (const actions of [{}, { Fireball: 0 }, { 'Shield Bash': 0, 'Great Cleave': 0 }]) {
        h.battle(actions); assert.equal(h.api.detect(), '', 'missing or conflicting skills stay unknown');
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
        assert.deepEqual(h.memory(), { maxType: 'fire', maxValue: 0 });
        assert.ok(h.events.includes('jpx:mode-detected'));
    }
});

test('verified equipment and battle observations survive navigation to pages without equipment DOM', () => {
    const equip = fixture(); equip.equipment('Legendary Willow Staff', ''); equip.disableOffhand(); equip.api.refresh();
    assert.equal(fixture({ data: equip.data }).api.detect(), 'Staff', 'another page reads the verified equipment observation');
    const battle = fixture(); battle.battle({ 'Concussive Strike': 0 }); battle.api.refresh();
    assert.equal(fixture({ data: battle.data }).api.detect(), 'Staff', 'a battle observation is also available after leaving combat');
    assert.equal(fixture({ data: battle.data, suffix: '_isekai' }).api.detect(), '', 'the other world never borrows the observation');
    const otherPersona = fixture({ data: battle.data }); otherPersona.persona('Different Persona', '2');
    assert.equal(otherPersona.api.detect(), '', 'a different persona never borrows the observation');
});

test('equipment invalidation cannot immediately cache the old DOM again', () => {
    const h = fixture(); h.equipment('Legendary Willow Staff', ''); h.disableOffhand(); h.api.init();
    assert.equal(h.api.detect(), 'Staff');
    h.emit('document', 'submit', { target: { matches: () => true } });
    assert.equal(h.api.detect(), '');
    assert.equal(fixture({ data: h.data }).api.detect(), '');
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
    assert.match(source, /const skillFamily = getJpxBattleSkillFamily\(getActionCooldowns\(\)\.spellCooldowns\);\s+battleStyle = getJpxStyleFromFamily\(skillFamily, spellDamageBonus\) \|\| 'Unarmed';/);
    assert.equal(helpers.includes('cfgBattle'), false);
});

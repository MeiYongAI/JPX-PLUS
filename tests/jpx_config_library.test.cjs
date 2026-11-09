'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/config-manager/library.js'), 'utf8');
const createJpxConfigLibrary = new Function(source + '\nreturn createJpxConfigLibrary;')();
const modes = ['OneHanded_General', 'OneHanded_Item', '1H_Mage_General', 'TwoHanded_General', 'TwoHanded_Arena'];
function setup() {
    const values = new Map();
    let deny = false;
    const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => { if (deny) throw Error('quota'); values.set(key, value); } };
    const options = { storage, key: 'library', modes, battleVersion: 20251216, statsVersion: 20260109 };
    return { library: createJpxConfigLibrary(options), values, storage, options, denyWrites: () => { deny = true; } };
}
function envelope(extra = {}) {
    return { schemaVersion: 1, kind: 'battle-mode', title: '日常', description: '', world: 'Persistent', mode: 'OneHanded_General',
        config: { battleVersion: 20251216, OneHanded_General: { supports: [{ type: 'spellSupport', name: 'Cure', conditions: [{ key: 'pHP', value: [0, .4] }] }], attacks: [{ type: 'normalAttack' }] } }, ...extra };
}
const isCode = code => error => error.code === code;
const snapshot = (entry, extra = {}) => ({ id: entry.id, revision: entry.revision,
    scopes: [entry.envelope.mode], config: entry.envelope.config, ...extra });

test('automatic selection keeps applied rules, and detach removes all references atomically', () => {
    const {library,values}=setup(), entry=library.save(envelope()), slot={world:'Persistent',personaId:'1',setId:'1'};
    library.setApplied('Persistent',snapshot(entry,{mode:entry.envelope.mode}),{activate:true});
    library.setBinding(slot,entry.id,entry.revision);
    assert.equal(library.references(entry.id).applied[0].selected,true);
    library.clearSelection('Persistent');
    assert.equal(library.readSelection('Persistent'),null);
    assert.ok(library.readState().applied.Persistent[entry.id]);
    const original=values.get('library');
    assert.throws(()=>library.detach(entry.id,999,true),isCode('libraryChanged'));
    assert.equal(values.get('library'),original);
    library.detach(entry.id,entry.revision,true);
    assert.equal(library.get(entry.id),null);
    assert.deepEqual(library.references(entry.id),{applied:[],bindings:[],scenes:[]});
});

test('scene assignments isolate worlds, snapshot revisions and validate references', () => {
    const {library,values}=setup();
    const entry=library.save(envelope({world:'Any'}));
    const route=library.assignScene('Persistent','OneHanded_Item',entry.id,entry.envelope.mode,entry.revision);
    assert.deepEqual(library.readRuntime('Persistent').scenes.OneHanded_Item,route);
    assert.deepEqual(library.readRuntime('Isekai').scenes,{});
    assert.throws(()=>library.remove(entry.id),isCode('appliedConfig'));
    assert.throws(()=>library.assignScene('Persistent','TwoHanded_Arena',entry.id,entry.envelope.mode,entry.revision),isCode('invalidConfig'));
    assert.throws(()=>library.assignScene('Persistent','OneHanded_Item',null,null,null,null),isCode('libraryChanged'));
    const edited=library.save(envelope({world:'Isekai',title:'Edited',config:{...entry.envelope.config,OneHanded_General:{supports:[],attacks:[]}}}),{id:entry.id});
    assert.deepEqual(library.readRuntime('Persistent').scenes.OneHanded_Item.rules,route.rules);
    assert.equal(library.readRuntime('Persistent').scenes.OneHanded_Item.revision,1);
    library.assignScene('Persistent','OneHanded_Item',null,null,null,route);
    assert.equal(library.readRuntime('Persistent').scenes.OneHanded_Item,null);
    const general=library.assignScene('Isekai','OneHanded_General',edited.id,edited.envelope.mode,edited.revision);
    library.rename(edited.id,'Renamed',edited.revision);
    assert.equal(library.readRuntime('Isekai').scenes.OneHanded_General.revision,general.revision+1);
    const before=values.get('library'),corrupt=JSON.parse(before);corrupt.scenes.Isekai.OneHanded_General.id='missing';
    values.set('library',JSON.stringify(corrupt));assert.throws(()=>library.readRuntime('Isekai'),isCode('storageCorrupt'));
    values.set('library',before);library.detach(edited.id,edited.revision+1,true);
    assert.equal(library.readRuntime('Isekai').scenes.OneHanded_General,null);
});

test('bindings isolate world, persona and set without touching native exports or rule revisions', () => {
    const { library } = setup(), entry = library.save(envelope()), before = library.get(entry.id);
    const slots = [
        { world: 'Persistent', personaId: '1', setId: '1' },
        { world: 'Persistent', personaId: '2', setId: '1' },
        { world: 'Isekai', personaId: '1', setId: '1' },
        { world: 'Persistent', personaId: '1', setId: '2' }
    ];
    for (const slot of slots) library.setBinding(slot, entry.id, entry.revision);
    assert.equal(library.readState().bindings.length, 4);
    assert.deepEqual(library.get(entry.id), before);
    assert.deepEqual(library.get(entry.id).envelope.config, envelope().config);
    const other = library.save(envelope({ title: 'Other' }));
    assert.throws(() => library.setBinding(slots[0], other.id, other.revision), isCode('libraryChanged'));
    library.setBinding(slots[0], other.id, other.revision, entry.id);
    assert.throws(() => library.removeBinding(slots[0], entry.id), isCode('libraryChanged'));
    library.removeBinding(slots[0], other.id);
    assert.equal(library.readState().bindings.length, 3);
    library.remove(entry.id);
    assert.deepEqual(library.readState().bindings, []);
});

test('binding trust survives rename but not rule edits; invalid and corrupt bindings are rejected', () => {
    const { library, values } = setup(), entry = library.save(envelope());
    const slot = { world: 'Persistent', personaId: '1', setId: '2' };
    library.setBinding(slot, entry.id, entry.revision);
    const renamed = library.rename(entry.id, 'Changed name', entry.revision);
    assert.equal(library.readState().bindings[0].trustedRevision, renamed.revision);
    const updated = library.save(envelope(), { id: entry.id });
    assert.equal(library.readState().bindings[0].trustedRevision, renamed.revision);
    assert.throws(() => library.setBinding(slot, entry.id, entry.revision, entry.id), isCode('libraryChanged'));
    for (const invalid of [{...slot, world:'Any'}, {...slot,personaId:'__proto__'}, {...slot,setId:'0'}])
        assert.throws(() => library.setBinding(invalid, entry.id, updated.revision, entry.id), isCode('invalidConfig'));
    const saved = values.get('library'), data = JSON.parse(saved);
    data.bindings.push(data.bindings[0]); values.set('library', JSON.stringify(data));
    assert.throws(() => library.readState(), isCode('storageCorrupt'));
    values.set('library',saved); data.bindings=[{...data.bindings[0],id:'missing'}]; values.set('library', JSON.stringify(data));
    assert.throws(() => library.readState(), isCode('storageCorrupt'));
});

test('manual ordering moves only selected entries and preserves rules, timestamps and active snapshots', () => {
    const { library, values } = setup();
    const entries = ['A','Hidden','B','C'].map(title => library.save(envelope({ title })));
    library.setApplied('Persistent', snapshot(entries[0], { mode: entries[0].envelope.mode }), { activate: true });
    const before = library.readState(), ids = entries.map(entry => entry.id);
    library.reorder([ids[3], ids[0], ids[2]], [ids[0], ids[2], ids[3]]);
    const after = library.readState();
    assert.deepEqual(after.entries.map(entry => entry.id), [ids[3], ids[1], ids[0], ids[2]]);
    assert.deepEqual(after.entries, [before.entries[3], before.entries[1], before.entries[0], before.entries[2]]);
    assert.deepEqual(after.applied, before.applied); assert.deepEqual(after.active, before.active);
    const raw = values.get('library'); library.reorder([ids[3], ids[0], ids[2]]); assert.equal(values.get('library'), raw);
    assert.deepEqual(library.save(envelope({ title: 'New' })).envelope.title, 'New');
    assert.deepEqual(library.list().slice(0,4), after.entries, 'new configs append after the saved order');
});

test('manual ordering rejects duplicates, deleted entries and stale order without changing storage', () => {
    const { library, values } = setup(); const a=library.save(envelope()), b=library.save(envelope({ title: 'B' }));
    const before=values.get('library');
    assert.throws(()=>library.reorder([a.id,a.id]),isCode('invalidConfig'));
    assert.throws(()=>library.reorder([a.id,'missing']),isCode('notFound'));
    assert.throws(()=>library.reorder([b.id,a.id],[b.id,a.id]),isCode('libraryChanged'));
    assert.equal(values.get('library'),before);
    library.reorder([b.id,a.id],[a.id,b.id]);
    const after=values.get('library'); assert.throws(()=>library.reorder([b.id,a.id],[a.id,b.id]),isCode('libraryChanged'));
    assert.equal(values.get('library'),after);
});

test('failed manual-order writes preserve the previous list', () => {
    const { library, values, denyWrites } = setup(); const a=library.save(envelope()), b=library.save(envelope({ title: 'B' }));
    const before=values.get('library'); denyWrites();
    assert.throws(()=>library.reorder([b.id,a.id],[a.id,b.id]),isCode('storageError'));
    assert.equal(values.get('library'),before); assert.deepEqual(library.list().map(entry=>entry.id),[a.id,b.id]);
});

test('validated reads reuse validation without sharing mutable state or masking external changes', () => {
    let validations = 0;
    const factory = new Function('validated', source.replace('const state = parse(raw);', 'validated(); const state = parse(raw);') + '\nreturn createJpxConfigLibrary;')(() => validations++);
    const { values, options } = setup(), library = factory(options);
    const entry = library.save(envelope());
    library.readState();
    const before = validations;
    const copy = library.readState();
    copy.entries[0].envelope.title = 'Do not leak';
    assert.equal(library.get(entry.id).envelope.title, '日常');
    assert.equal(validations, before, 'unchanged storage does not repeat deep validation');
    const external = JSON.parse(values.get('library'));
    external.entries[0].envelope.title = 'Another tab';
    values.set('library', JSON.stringify(external));
    assert.equal(library.get(entry.id).envelope.title, 'Another tab');
    assert.equal(validations, before + 1);
    values.set('library', '{broken');
    assert.throws(() => library.readState(), isCode('storageCorrupt'));
    values.delete('library');
    assert.deepEqual(library.list(), []);
});

test('reading an empty library does not write; save and every read have clone boundaries', () => {
    const { library, values } = setup();
    assert.deepEqual(library.list(), []);
    assert.equal(values.size, 0);
    const input = envelope(), first = library.save(input, { source: { repository: 'demo', id: 12 }, execution: { element: 'fire' } });
    input.config.OneHanded_General.supports[0].name = 'changed input';
    first.envelope.title = 'changed output';
    const read = library.get(first.id);
    assert.equal(read.envelope.title, '日常');
    assert.equal(read.envelope.config.OneHanded_General.supports[0].name, 'Cure');
    read.source.id = 99;
    library.list()[0].execution.element = 'cold';
    assert.deepEqual(library.get(first.id).source, { repository: 'demo', id: 12 });
    assert.deepEqual(library.get(first.id).execution, { element: 'fire' });
    assert.equal(library.get('missing'), null);
});

test('updating a saved copy increments revision without changing its applied snapshot', () => {
    const { library } = setup();
    const first = library.save(envelope(), { execution: { style: 'OneHanded' } });
    library.setApplied('Persistent', { id: first.id, revision: first.revision, scopes: [first.envelope.mode], config: first.envelope.config });
    const changed = envelope(); changed.config.OneHanded_General.supports[0].name = 'Full-Cure';
    const next = library.save(changed, { id: first.id });
    assert.equal(next.revision, 2);
    assert.equal(next.createdAt, first.createdAt);
    assert.deepEqual(next.execution, first.execution);
    assert.equal(library.readState().applied.Persistent[first.id].revision, 1);
    assert.equal(library.readState().applied.Persistent[first.id].config.OneHanded_General.supports[0].name, 'Cure');
});

test('renaming preserves active rules and advances only matching applied revisions', () => {
    const { library } = setup();
    const original = library.save(envelope(), { source: { repository: 'demo', id: 7 }, execution: { style: 'OneHanded' } });
    library.setApplied('Persistent', snapshot(original, { mode: original.envelope.mode }), { activate: true });
    library.setApplied('Isekai', snapshot(original));
    const edited = structuredClone(original.envelope); edited.config.OneHanded_General.supports[0].name = 'Full-Cure';
    const newer = library.save(edited, { id: original.id });
    library.setApplied('Persistent', snapshot(newer, { mode: newer.envelope.mode }), { activate: true });
    const before = library.readState(), renamed = library.rename(original.id, '  新名称  ', newer.revision), after = library.readState();
    assert.equal(renamed.envelope.title, '新名称');
    assert.equal(renamed.revision, 3);
    assert.equal(renamed.createdAt, original.createdAt);
    assert.deepEqual(renamed.source, original.source); assert.deepEqual(renamed.execution, original.execution);
    assert.deepEqual(renamed.envelope.config, newer.envelope.config);
    assert.deepEqual(after.active, before.active);
    assert.deepEqual(after.applied.Persistent[original.id], { ...before.applied.Persistent[original.id], revision: 3 });
    assert.deepEqual(after.applied.Isekai[original.id], before.applied.Isekai[original.id], 'already outdated rules stay outdated');
    renamed.envelope.title = 'do not leak'; assert.equal(library.get(original.id).envelope.title, '新名称');
});

test('rename rejects invalid names, stale edits and write failures without changing storage', () => {
    const { library, values, denyWrites } = setup(), first = library.save(envelope());
    const before = values.get('library');
    for (const name of ['', '  ', 'a'.repeat(101), 'a\nb', 'a\u0000b', null]) {
        assert.throws(() => library.rename(first.id, name, first.revision), isCode('invalidConfig'));
        assert.equal(values.get('library'), before);
    }
    assert.throws(() => library.rename('missing', 'valid', 1), isCode('notFound'));
    assert.throws(() => library.rename(first.id, 'valid', 0), isCode('libraryChanged'));
    denyWrites();
    assert.deepEqual(library.rename(first.id, '  日常  ', first.revision), first, 'unchanged name performs no write');
    assert.throws(() => library.rename(first.id, 'new name', first.revision), isCode('storageError'));
    assert.equal(values.get('library'), before);
    assert.deepEqual(library.get(first.id), first);
});

test('local normalization preserves complete legacy modes and nested extension data', () => {
    const { library } = setup();
    const raw = envelope({ kind: 'battle', config: { version: 20251216, unknownRoot: { keep: [1, '原文'] },
        Battlecaster_General: { supports: [
            { type: 'spellInstant', name: 'Cure', future: { unchanged: true } },
            { type: 'itemDuration', name: 'Mana Draught', conditions: [] }
        ], attacks: [{ type: 'target', bottomUp: true, future: ['x'] }, { type: 'smartDebuff', targetCount: '3' }],
        'kb_Ctrl+1': [{ type: 'spellDamage', name: 'Fiery Blast', conditions: [{ key: 'futureCondition', value: 'opaque', future: 9 }] }], futureMode: 5 },
        TwoHanded_General: { supports: [], attacks: [{ type: 'futureRule', future: { data: ['keep'] } }] }, OneHanded_Item: {} } });
    const before = structuredClone(raw), saved = library.save(raw).envelope.config;
    assert.deepEqual(raw, before, 'normalization never mutates caller data');
    assert.equal(saved.battleVersion, 20251216);
    assert.equal(Object.hasOwn(saved, 'version'), false);
    assert.equal(Object.hasOwn(saved, 'Battlecaster_General'), false);
    assert.equal(saved['1H_Mage_General'].supports[0].type, 'spellSupport');
    assert.equal(saved['1H_Mage_General'].supports[1].type, 'item');
    assert.equal(saved['1H_Mage_General'].attacks[0].priorityRule, 'Bottom Up');
    assert.equal(Object.hasOwn(saved['1H_Mage_General'].attacks[0], 'bottomUp'), false);
    assert.equal(saved['1H_Mage_General'].attacks[1].targetCount, 3);
    assert.deepEqual(saved['1H_Mage_General']['kb_Ctrl+1'], raw.config.Battlecaster_General['kb_Ctrl+1']);
    assert.deepEqual(saved.unknownRoot, raw.config.unknownRoot);
    assert.deepEqual(saved.TwoHanded_General, raw.config.TwoHanded_General);
    assert.deepEqual(saved.OneHanded_Item, {});
    assert.equal(saved['1H_Mage_General'].futureMode, 5);
});

test('multi-mode native fixtures retain their full mode inventory', () => {
    const fixtures = [
        { battleVersion: 20251216, OneHanded_General: { supports: [], attacks: [{type:'normalAttack'}] }, TwoHanded_Item: { supports: [{type:'stop',conditions:[]}], attacks: [] } },
        { battleVersion: 20251216, Staff_Tower: { supports: [], attacks: [{type:'normalAttack'}] }, DualWielding_General: { supports: [], attacks: [] } }
    ];
    for (const [index,input] of fixtures.entries()) {
        const name = 'generated native fixture ' + index;
        const modeNames = Object.keys(input).filter(key => /_(General|Arena|Encounter|Colosseum|Battle1000|Item|Tower)$/.test(key));
        const { options } = setup();
        options.modes = [...new Set([...modes, ...modeNames])];
        const lib = createJpxConfigLibrary(options);
        const saved = lib.save(envelope({ kind: 'battle', config: input })).envelope.config;
        for (const key of modeNames) assert.ok(Object.hasOwn(saved, key === 'Battlecaster_General' ? '1H_Mage_General' : key), name + ': ' + key);
    }
});

test('two mode slots and worlds can remain applied independently; overlapping scopes replace prior records', () => {
    const { library } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'second' })), c = library.save(envelope({ title: 'third' }));
    const apply = (world, entry, scopes) => library.setApplied(world, { id: entry.id, revision: entry.revision, scopes, config: entry.envelope.config });
    apply('Persistent', a, ['OneHanded_General']);
    apply('Persistent', b, ['TwoHanded_General']);
    apply('Isekai', a, ['OneHanded_General']);
    assert.equal(Object.keys(library.readState().applied.Persistent).length, 2);
    apply('Persistent', c, ['OneHanded_General']);
    let state = library.readState();
    assert.deepEqual(Object.keys(state.applied.Persistent).sort(), [b.id, c.id].sort());
    assert.ok(state.applied.Isekai[a.id]);
    apply('Persistent', a, ['*']);
    assert.deepEqual(Object.keys(library.readState().applied.Persistent), [a.id]);
    apply('Persistent', b, ['TwoHanded_General']);
    assert.deepEqual(Object.keys(library.readState().applied.Persistent), [b.id]);
});

test('deleting any applied revision is blocked, while a replaced copy is removable', () => {
    const { library } = setup();
    const a = library.save(envelope()), b = library.save(envelope());
    library.setApplied('Persistent', { id: a.id, revision: 1, scopes: ['OneHanded_General'], config: a.envelope.config });
    library.save(envelope({ title: 'changed' }), { id: a.id });
    assert.throws(() => library.remove(a.id), isCode('appliedConfig'));
    library.setApplied('Persistent', { id: b.id, revision: 1, scopes: ['OneHanded_General'], config: b.envelope.config });
    assert.equal(library.remove(a.id), true);
    assert.equal(library.get(a.id), null);
    assert.throws(() => library.remove('missing'), isCode('notFound'));
});

test('a stale applied record can be cleared without deleting its saved configuration or other worlds', () => {
    const { library, values } = setup();
    const a = library.save(envelope());
    for (const world of ['Persistent', 'Isekai']) library.setApplied(world, { id: a.id, revision: 1, scopes: ['OneHanded_General'], config: a.envelope.config });
    assert.equal(library.clearApplied('Persistent', a.id), true);
    assert.equal(library.readState().applied.Persistent, undefined);
    assert.ok(library.readState().applied.Isekai[a.id]);
    assert.ok(library.get(a.id));
    assert.throws(() => library.remove(a.id), isCode('appliedConfig'));
    assert.equal(library.clearApplied('Isekai', a.id), true);
    const before = values.get('library');
    assert.equal(library.clearApplied('Isekai', a.id), false);
    assert.equal(values.get('library'), before);
    assert.equal(library.remove(a.id), true);
});

test('world-independent battle configs preserve their scope until the user chooses an application world', () => {
    const { library } = setup();
    const a = library.save(envelope({ world: 'Any' }));
    assert.equal(a.envelope.world, 'Any');
    library.setApplied('Isekai', { id: a.id, revision: 1, scopes: [a.envelope.mode], config: a.envelope.config });
    assert.ok(library.readState().applied.Isekai[a.id]);
    assert.equal(library.readState().applied.Any, undefined);
});

test('old libraries and applications keep their shape until activation is explicitly requested', () => {
    const { library, values, options } = setup();
    assert.deepEqual(library.readState(), { schemaVersion: 1, entries: [], applied: {}, migrations: [] });
    const entry = library.save(envelope());
    library.setApplied('Persistent', snapshot(entry));
    const before = values.get('library');
    assert.equal(Object.hasOwn(library.readState(), 'active'), false);
    const second = createJpxConfigLibrary(options);
    assert.deepEqual(second.readState(), JSON.parse(before));
    assert.equal(values.get('library'), before, 'reading an old library does not migrate or rewrite it');
    library.setApplied('Persistent', snapshot(entry), { activate: false });
    assert.equal(Object.hasOwn(library.readState(), 'active'), false);
});

test('explicit selection replaces the active item atomically and remains isolated by world', () => {
    const { library, storage, options } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'Two-handed', mode: 'TwoHanded_General',
        config: { battleVersion: 20251216, TwoHanded_General: { supports: [], attacks: [] } } }));
    library.setApplied('Persistent', snapshot(a, { mode: a.envelope.mode }), { activate: true });
    library.setApplied('Isekai', snapshot(a), { activate: true });
    const writes = [], originalSet = storage.setItem;
    storage.setItem = (key, raw) => { writes.push({ key, state: JSON.parse(raw) }); originalSet(key, raw); };
    library.setApplied('Persistent', snapshot(b, { mode: b.envelope.mode }), { activate: true });
    assert.equal(writes.length, 1, 'snapshot and selection are committed together');
    assert.deepEqual(writes[0].state.active, { Persistent: b.id, Isekai: a.id });
    assert.equal(writes[0].state.applied.Persistent[b.id].mode, 'TwoHanded_General');
    const state = createJpxConfigLibrary(options).readState();
    assert.deepEqual(state.active, { Persistent: b.id, Isekai: a.id });
    assert.deepEqual(Object.keys(state.applied.Persistent).sort(), [a.id, b.id].sort());
    assert.ok(state.applied.Isekai[a.id]);
    state.active.Persistent = a.id;
    assert.equal(library.readState().active.Persistent, b.id, 'selection reads have clone boundaries');
    library.setApplied('Persistent', snapshot(a), { activate: true });
    assert.deepEqual(library.readState().active, { Persistent: a.id, Isekai: a.id });
});

test('saving or applying a separate slot does not activate it or refresh the selected snapshot', () => {
    const { library } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'Other', mode: 'TwoHanded_General',
        config: { battleVersion: 20251216, TwoHanded_General: { supports: [], attacks: [] } } }));
    library.setApplied('Persistent', snapshot(a, { mode: a.envelope.mode }), { activate: true });
    const applied = library.readState().applied.Persistent[a.id];
    const changed = envelope({ title: 'Edited' }); changed.config.OneHanded_General.supports[0].name = 'Full-Cure';
    library.save(changed, { id: a.id });
    library.save(envelope({ title: 'New copy' }));
    library.setApplied('Persistent', snapshot(b));
    assert.deepEqual(library.readState().active, { Persistent: a.id });
    assert.deepEqual(library.readState().applied.Persistent[a.id], applied);
    assert.equal(library.get(a.id).revision, 2);
    assert.throws(() => library.remove(a.id), isCode('appliedConfig'));
});

test('overwriting or clearing applications removes only dangling active selections', () => {
    const { library } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'Replacement' })),
        c = library.save(envelope({ title: 'Other slot', mode: 'TwoHanded_General',
            config: { battleVersion: 20251216, TwoHanded_General: { supports: [], attacks: [] } } }));
    library.setApplied('Persistent', snapshot(a), { activate: true });
    library.setApplied('Isekai', snapshot(a), { activate: true });
    library.setApplied('Persistent', snapshot(b));
    assert.deepEqual(library.readState().active, { Isekai: a.id });
    assert.equal(library.readState().applied.Persistent[a.id], undefined);
    library.setApplied('Persistent', snapshot(b), { activate: true });
    library.setApplied('Persistent', snapshot(c));
    library.clearApplied('Persistent', c.id);
    assert.deepEqual(library.readState().active, { Persistent: b.id, Isekai: a.id });
    library.clearApplied('Persistent', b.id);
    assert.deepEqual(library.readState().active, { Isekai: a.id });
    assert.throws(() => library.remove(a.id), isCode('appliedConfig'));
    library.clearApplied('Isekai', a.id);
    assert.equal(Object.hasOwn(library.readState(), 'active'), false);
    assert.equal(library.remove(a.id), true);
});

test('an activated full configuration may omit mode and uses the unchanged automatic mode grouping', () => {
    const { library } = setup();
    const entry = library.save(envelope({ kind: 'battle' }));
    const applied = library.setApplied('Persistent', snapshot(entry, { scopes: ['*'] }), { activate: true });
    assert.equal(Object.hasOwn(applied, 'mode'), false);
    assert.equal(Object.hasOwn(library.readState().applied.Persistent[entry.id], 'mode'), false);
    assert.deepEqual(library.readState().active, { Persistent: entry.id });
});

test('failed activation preserves the previous snapshot and selection', () => {
    const { library, values, denyWrites } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'Replacement' }));
    library.setApplied('Persistent', snapshot(a, { mode: a.envelope.mode }), { activate: true });
    const before = values.get('library');
    assert.throws(() => library.setApplied('Persistent', snapshot(b, { mode: 'Unknown_General' }), { activate: true }), isCode('invalidConfig'));
    assert.equal(values.get('library'), before);
    denyWrites();
    assert.throws(() => library.setApplied('Persistent', snapshot(b), { activate: true }), isCode('storageError'));
    assert.equal(values.get('library'), before);
    assert.deepEqual(library.readState().active, { Persistent: a.id });
    assert.throws(() => library.clearApplied('Persistent', a.id), isCode('storageError'));
    assert.equal(values.get('library'), before);
});

test('invalid explicit snapshot modes are rejected without writing', () => {
    const { library, values } = setup();
    const entry = library.save(envelope());
    library.setApplied('Persistent', snapshot(entry), { activate: true });
    const before = values.get('library');
    for (const extra of [
        { mode: null }, { mode: 1 }, { mode: '' }, { mode: 'Unknown_General' },
        { mode: 'OneHanded_General', scopes: ['TwoHanded_General'] },
        { mode: 'OneHanded_General', scopes: ['*'] },
        { mode: 'TwoHanded_General', scopes: ['TwoHanded_General'] },
        { mode: 'OneHanded_General', config: { battleVersion: 20251216 } }
    ]) {
        assert.throws(() => library.setApplied('Persistent', snapshot(entry, extra), { activate: true }), isCode('invalidConfig'));
        assert.equal(values.get('library'), before);
    }
});

test('invalid stored active selections and modes fail closed and preserve raw data', () => {
    const { library, values } = setup();
    const a = library.save(envelope()), b = library.save(envelope({ title: 'Unapplied' }));
    library.setApplied('Persistent', snapshot(a), { activate: true });
    const good = values.get('library');
    const corruptions = [
        state => { state.active = null; }, state => { state.active = []; },
        state => { state.active = { Unknown: a.id }; }, state => { state.active = { Persistent: 12 }; },
        state => { state.active = { Persistent: b.id }; }, state => { state.active = { Isekai: a.id }; },
        state => { state.active = { Persistent: 'missing' }; },
        ...[null, 12, '', 'Unknown_General', 'TwoHanded_General'].map(mode => state => { state.applied.Persistent[a.id].mode = mode; }),
        state => { state.applied.Persistent[a.id].mode = 'OneHanded_General'; state.applied.Persistent[a.id].scopes = ['*']; },
        state => { state.applied.Persistent[a.id].mode = 'OneHanded_General'; state.applied.Persistent[a.id].config = {}; }
    ];
    for (const corrupt of corruptions) {
        const state = JSON.parse(good); corrupt(state); const raw = JSON.stringify(state); values.set('library', raw);
        for (const op of [() => library.readState(), () => library.save(envelope()),
            () => library.setApplied('Persistent', snapshot(a), { activate: true }), () => library.clearApplied('Persistent', a.id)]) {
            assert.throws(op, isCode('storageCorrupt'));
            assert.equal(values.get('library'), raw);
        }
    }
});

test('legacy backpack migration preserves IDs, dates and source metadata and is idempotent', () => {
    const { library, values } = setup();
    const existing = library.save(envelope());
    const rawBefore = values.get('library');
    const legacy = [{ id: '55941b6a-1e02-4ea7-8b4d-64acd4bccf10', savedAt: '2026-11-01T12:00:00.000Z', envelope: envelope({ title: 'legacy' }), source: { entryId: 42 } }];
    const state = library.migrate(legacy, 'gm-backpack-v1');
    const entry = state.entries.find(item => item.id === legacy[0].id);
    assert.equal(entry.createdAt, legacy[0].savedAt);
    assert.equal(entry.updatedAt, legacy[0].savedAt);
    assert.deepEqual(entry.source, legacy[0].source);
    assert.ok(state.entries.find(item => item.id === existing.id));
    assert.equal(JSON.parse(values.get('library:backup')).raw, rawBefore);
    const after = values.get('library');
    library.migrate(legacy, 'gm-backpack-v1');
    assert.equal(values.get('library'), after);
    library.backup();
    assert.equal(JSON.parse(values.get('library:backup')).raw, rawBefore);
});

test('migration validates the whole batch before any write and preserves conflicting IDs', () => {
    const { library, values } = setup();
    const first = library.save(envelope()), before = values.get('library');
    assert.throws(() => library.migrate([{ id: 'legacy', envelope: envelope() }, { id: 'invalid', envelope: {} }], 'bad'), isCode('invalidConfig'));
    assert.equal(values.get('library'), before);
    assert.equal(values.has('library:backup'), false);
    library.migrate([{ id: first.id, envelope: envelope({ title: 'different' }) }], 'collision');
    assert.equal(library.get(first.id).envelope.title, '日常');
    assert.equal(library.get(first.id + '-migrated').envelope.title, 'different');
});

test('a migration into an empty library snapshots its absent raw value', () => {
    const { library, values } = setup();
    library.migrate([{ id: 'migrated', envelope: envelope() }], 'first');
    assert.equal(JSON.parse(values.get('library:backup')).raw, null);
    assert.equal(library.get('migrated').revision, 1);
});

test('seed migration commits entries, applications and marker in one write and preserves existing applications', () => {
    const { library, values, storage } = setup();
    const active = library.save(envelope({ title: 'chosen' }));
    library.setApplied('Persistent', { id: active.id, revision: 1, scopes: ['OneHanded_General'], config: active.envelope.config });
    const before = values.get('library'), originalSet = storage.setItem;
    let failOnce = true;
    storage.setItem = (key, raw) => {
        if (key === 'library' && failOnce) { failOnce = false; throw Error('quota'); }
        originalSet(key, raw);
    };
    const entries = [{ id: 'native-OneHanded', envelope: envelope() }, { id: 'native-TwoHanded', envelope: envelope({ title: 'two' }) }];
    const options = { applied: [{ world: 'Persistent', id: entries[0].id, scopes: ['OneHanded_General'] }, { world: 'Persistent', id: entries[1].id, scopes: ['TwoHanded_General'] }] };
    assert.throws(() => library.migrate(entries, 'native', options), isCode('storageError'));
    assert.equal(values.get('library'), before);
    const state = library.migrate(entries, 'native', options);
    assert.ok(state.migrations.includes('native'));
    assert.equal(state.entries.length, 3);
    assert.deepEqual(Object.keys(state.applied.Persistent).sort(), [active.id, 'native-TwoHanded'].sort());
    assert.equal(state.applied.Persistent['native-TwoHanded'].revision, 1);
    assert.deepEqual(state.applied.Persistent['native-TwoHanded'].config, entries[1].envelope.config);
});

test('corrupt or unsupported storage is preserved and every mutating operation fails closed', () => {
    for (const raw of ['{broken', JSON.stringify({ schemaVersion: 2, entries: [], applied: {}, migrations: [] }), '{"schemaVersion":1,"entries":[],"applied":{"__proto__":{}},"migrations":[]}']) {
        const { library, values } = setup();
        values.set('library', raw);
        for (const op of [() => library.list(), () => library.save(envelope()), () => library.migrate([], 'x'), () => library.backup(), () => library.remove('x')]) {
            assert.throws(op, isCode('storageCorrupt'));
            assert.equal(values.get('library'), raw);
            assert.equal(values.size, 1);
        }
    }
});

test('unsafe JSON, broken arrays, invalid versions and oversized payloads cannot reach storage', () => {
    const { library, values } = setup();
    const unsafe = envelope(); unsafe.config = JSON.parse('{"battleVersion":20251216,"constructor":{}}');
    const bad = envelope(); bad.config.OneHanded_General.attacks = 'not an array';
    const hole = envelope(); hole.config.OneHanded_General.attacks = new Array(1);
    const cycle = envelope(); cycle.config.ref = cycle;
    const getter = envelope(); Object.defineProperty(getter.config, 'data', { enumerable: true, get() { throw Error('getter executed'); } });
    for (const input of [unsafe, bad, hole, cycle, getter]) assert.throws(() => library.save(input), isCode('invalidConfig'));
    assert.throws(() => library.save(envelope({ config: { battleVersion: 1 } })), isCode('unsupportedVersion'));
    assert.throws(() => library.save(envelope({ description: 'x'.repeat(2 * 1024 * 1024) })), isCode('tooLarge'));
    assert.equal(values.size, 0);
});

test('storage failure leaves existing state intact and a second instance sees current saves', () => {
    const fixture = setup(), { library, values, options } = fixture;
    const second = createJpxConfigLibrary(options);
    library.save(envelope());
    second.save(envelope({ title: 'second instance' }));
    assert.equal(library.list().length, 2);
    const before = values.get('library');
    fixture.denyWrites();
    assert.throws(() => library.save(envelope()), isCode('storageError'));
    assert.equal(values.get('library'), before);
});

test('statistics and local code are kept as data without executing or sanitizing their content', () => {
    const { library } = setup();
    const stats = { schemaVersion: 1, kind: 'stats', world: 'Any', title: 'Stats', config: { statsVersion: 20260109,
        statsColumns: [{ id: 'turns', customName: '回合', styleText: 'color: red;', future: { keep: true } }], futureRoot: ['opaque'] } };
    assert.deepEqual(library.save(stats).envelope, stats);
    const code = envelope(); code.config.OneHanded_General.attacks = [{ type: 'kamisamaniNattaHi', code: 'throw new Error("must never run");' }];
    assert.deepEqual(library.save(code).envelope.config, code.config);
});

'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { webcrypto } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const libraryCode = fs.readFileSync(path.join(root, 'src/config-manager/library.js'), 'utf8');
const managerCode = fs.readFileSync(path.join(root, 'src/config-manager/manager.js'), 'utf8');
const nativeCode = fs.readFileSync(path.join(root, 'JPX-PLUS.user.js'), 'utf8');
const managerTop = managerCode.slice(0, managerCode.indexOf('// Explicit PLUS'));
const mergeCode = nativeCode.slice(nativeCode.indexOf('function mergeCfg('), nativeCode.indexOf('\nfunction renderSettings('));
const factory = new Function(libraryCode + ';return createJpxConfigLibrary;')();
const modes = ['OneHanded_General', 'TwoHanded_General'];
const native = () => ({ battleVersion: 20251216,
    OneHanded_General: { supports: [{ type: 'stop', customMessage: 'one' }], attacks: [{ type: 'normalAttack' }] },
    TwoHanded_General: { supports: [{ type: 'stop', customMessage: 'two' }], attacks: [{ type: 'normalAttack' }] } });
function setup({ stored = true } = {}) {
    const values = new Map(), storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    if (stored) values.set('jpx_cfgBattle', JSON.stringify(native()));
    const utils = { isEmpty: value => !value || !Object.keys(value).length, parseValue: value => typeof value === 'string' && value.trim() && !isNaN(value) ? Number(value) : value };
    const merge = new Function('BATTLE_MODES', 'jpxUtils', mergeCode + ';return mergeCfg;')(modes, utils);
    const window = { JPXPlus: { version: 'test' }, dispatchEvent() {} };
    const api = new Function('createJpxConfigLibrary', 'localStorage', 'prefix', 'isekaiSuffix', 'cfgBattle', 'defaultCfgBattle', 'defaultCfgStats', 'BATTLE_MODES', 't', 'window', 'mergeCfg', 'crypto', 'TextEncoder', managerTop + ';return {seed:seedJpxConfigLibrary,migrate:migrateJpxLegacyConfigs,library:getJpxConfigLibrary};')(
        factory, storage, 'jpx_', '', native(), native(), { statsVersion: 20260109 }, modes, key => key, window, merge, webcrypto, TextEncoder);
    return { values, storage, api };
}
const archive = (id, title) => ({ id, savedAt: '2026-11-01T12:00:00.000Z', envelope: { schemaVersion: 1, kind: 'battle', world: 'Persistent', title, description: '', config: native() } });

test('native seeding is per world and reruns preserve edited entries and application snapshots', () => {
    const { values, api } = setup();
    const library = api.seed();
    assert.deepEqual(library.readState().migrations, ['native-configs-v1:Persistent']);
    assert.equal(library.list().length, 2);
    const saved = library.get('native-Persistent-OneHanded_General');
    const edited = structuredClone(saved.envelope); edited.title = 'my edits';
    library.save(edited, { id: saved.id });
    values.set('jpx_cfgBattle_isekai', JSON.stringify(native()));
    api.seed();
    assert.equal(library.list().length, 4);
    assert.equal(library.get(saved.id).envelope.title, 'my edits');
    assert.equal(library.readState().applied.Persistent[saved.id].revision, 1);
    assert.ok(library.readState().migrations.includes('native-configs-v1:Isekai'));
});

test('obsolete and malformed saved worlds are preserved without inventing default library entries', () => {
    const { values, api } = setup();
    values.set('jpx_cfgBattle', '{broken');
    const old = JSON.stringify({ battleVersion: 1, OneHanded_General: { custom: 'old' } });
    values.set('jpx_cfgBattle_isekai', old);
    const library = api.seed();
    assert.equal(values.get('jpx_cfgBattle'), '{broken');
    assert.equal(values.get('jpx_cfgBattle_isekai'), old);
    assert.equal(library.list().length, 0);
    assert.deepEqual(library.readState().migrations, []);
});

test('an unsaved installation has no generated library entries and can seed after real settings are saved', () => {
    const { values, api } = setup({ stored: false });
    assert.deepEqual(api.seed().list(), []);
    assert.equal(values.size, 0);
    values.set('jpx_cfgBattle', JSON.stringify({ battleVersion: 20251216, OneHanded_General: native().OneHanded_General }));
    assert.deepEqual(api.seed().list().map(entry => entry.envelope.mode), ['OneHanded_General']);
});

test('native seeding skips empty slots but keeps keyboard-only and disabled saved rules', () => {
    const { values, api } = setup();
    values.set('jpx_cfgBattle', JSON.stringify({ battleVersion: 20251216,
        OneHanded_General: { supports: [], attacks: [], 'kb_x': [] },
        TwoHanded_General: { supports: [], attacks: [], 'kb_x': [{ type: 'normalAttack', disabled: true }] } }));
    const entries = api.seed().list();
    assert.deepEqual(entries.map(entry => entry.envelope.mode), ['TwoHanded_General']);
    assert.equal(entries[0].envelope.config.TwoHanded_General.kb_x[0].disabled, true);
});

test('a native seed write failure does not mark the world complete and retry restores every applied snapshot', () => {
    const { values, storage, api } = setup();
    const set = storage.setItem;
    let fail = true;
    storage.setItem = (key, value) => { if (key === 'jpx_configLibrary_v1' && fail) { fail = false; throw Error('quota'); } set(key, value); };
    assert.throws(() => api.seed(), error => error.code === 'storageError');
    assert.equal(values.has('jpx_configLibrary_v1'), false);
    const state = api.seed().readState();
    assert.equal(state.entries.length, 2);
    assert.equal(Object.keys(state.applied.Persistent).length, 2);
    assert.deepEqual(state.migrations, ['native-configs-v1:Persistent']);
});

test('legacy source revisions use bounded per-entry markers and never overwrite local edits', async () => {
    const { api } = setup();
    const records = Array.from({ length: 12 }, (_, index) => archive('legacy-' + index, 'first ' + index));
    await api.migrate(records);
    const library = api.library(), first = library.get('legacy-0');
    const edited = structuredClone(first.envelope); edited.title = 'local changes';
    library.save(edited, { id: first.id });
    records[1].envelope.title = 'updated source';
    await api.migrate(records);
    assert.equal(library.get('legacy-0').envelope.title, 'local changes');
    assert.equal(library.get('legacy-1').envelope.title, 'first 1');
    assert.equal(library.get('legacy-1-migrated').envelope.title, 'updated source');
    assert.equal(library.list().length, 13);
    await api.migrate(records);
    assert.equal(library.list().length, 13);
    assert.ok(library.readState().migrations.every(marker => marker.length < 200));
});

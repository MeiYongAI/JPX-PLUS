'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const source = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(__dirname, '../JPX-PLUS.user.js'), 'utf8');
const start = source.indexOf('function createSettingsChangeTracker(');
const end = source.indexOf('// Editing history is scoped', start);
assert.ok(start > 0 && end > start);
function setup() {
    const fields = [];
    const container = { querySelectorAll: () => fields };
    const context = vm.createContext({ container,
        cfgBattle: { A: { supports: [], attacks: [] }, B: { supports: [{ type: 'stop', customMessage: 'Keep draft', conditions: [] }], attacks: [] } },
        userKeybinds: {}, cfgStats: {}, prefix: 'jpx_', isekaiSuffix: '', KEYBINDS: {},
        localStorage: { getItem: () => null }, settingsChangeBindings: new WeakMap(),
        MutationObserver: class { observe() {} disconnect() {} }, t: key => key,
        document: { createElement() { return { className: '', classList: { contains: () => false }, dataset: {}, remove() { this.removed = true; } }; } }
    });
    vm.runInContext(source.slice(start, end), context);
    vm.runInContext('tracker = createSettingsChangeTracker(container, () => ({battle: JSON.stringify(cfgBattle), shortcuts: JSON.stringify(userKeybinds), stats: JSON.stringify(cfgStats)}))', context);
    function field(data) {
        const element = { dataset: {}, children: [], parentElement: { closest: () => null }, append(child) { this.children.push(child); } };
        fields.push(element); context.settingsChangeBindings.set(element, { data, key: null, item: true, badgeTarget: element }); return element;
    }
    return { context, field };
}
test('committing 3000 imported rules transfers identities without a quadratic rematch', () => {
    const { context, field } = setup();
    vm.runInContext("patch = { A: { supports: Array.from({length:3000}, (_,i) => ({type:'stop', customMessage:'Rule '+i, conditions:[]})), attacks:[] } }; Object.assign(cfgBattle, patch);", context);
    const marked = field(context.cfgBattle.A.supports[2999]);
    const comparisons = vm.runInContext([
        '(() => { const find = Array.prototype.find; let visits = 0;',
        'Array.prototype.find = function(predicate, self) { return find.call(this, (value,index,array) => { visits++; return predicate.call(self,value,index,array); }); };',
        "try { tracker.commit('battle', patch); return visits; } finally { Array.prototype.find = find; } })()"
    ].join('\n'), context);
    assert.ok(comparisons < 30000, 'expected linear work, observed ' + comparisons + ' predicate visits');
    assert.equal(marked.dataset.changeState, undefined);
});
test('applying one scope keeps unrelated draft changes and rule reorder markers', () => {
    const { context, field } = setup();
    const draft = field(context.cfgBattle.B.supports[0]);
    vm.runInContext("cfgBattle.B.supports[0].customMessage = 'Unsaved'; patch = { A: { supports: [{type:'stop',customMessage:'One',conditions:[]},{type:'stop',customMessage:'Two',conditions:[]}], attacks:[] } }; Object.assign(cfgBattle,patch);", context);
    const first = field(context.cfgBattle.A.supports[0]), second = field(context.cfgBattle.A.supports[1]);
    vm.runInContext("tracker.commit('battle',patch)", context);
    assert.equal(draft.dataset.changeState, 'modified');
    assert.equal(first.dataset.changeState, undefined); assert.equal(second.dataset.changeState, undefined);
    vm.runInContext('cfgBattle.A.supports.reverse(); tracker.refresh()', context);
    assert.equal(first.dataset.changeState, 'modified'); assert.equal(second.dataset.changeState, 'modified');
    assert.equal(draft.dataset.changeState, 'modified');
});

test('equivalent renderer-created empty containers do not break applied snapshots', () => {
    const { context, field } = setup();
    vm.runInContext("patch = { A: { supports: [{type:'stop',customMessage:'One',conditions:[]}], attacks:[] } }; cfgBattle.A = JSON.parse(JSON.stringify(patch.A)); cfgBattle.A.supports[0].extra = {}; cfgBattle.A.unused = [];", context);
    const item = field(context.cfgBattle.A.supports[0]);
    vm.runInContext("tracker.commit('battle',patch)", context);
    assert.equal(item.dataset.changeState, undefined);
    vm.runInContext("cfgBattle.A.supports[0].customMessage='Changed'; tracker.refresh()", context);
    assert.equal(item.dataset.changeState, 'modified');
});

test('duplicate applied rules retain distinct identities when one is edited and moved', () => {
    const { context, field } = setup();
    vm.runInContext("patch = { A: { supports: Array.from({length:2}, () => ({type:'stop',customMessage:'Same',conditions:[]})), attacks:[] } }; Object.assign(cfgBattle,patch);", context);
    const first = field(context.cfgBattle.A.supports[0]), second = field(context.cfgBattle.A.supports[1]);
    vm.runInContext("tracker.commit('battle',patch); cfgBattle.A.supports[1].customMessage='Changed'; tracker.refresh()", context);
    assert.equal(first.dataset.changeState, undefined); assert.equal(second.dataset.changeState, 'modified');
    vm.runInContext('cfgBattle.A.supports.reverse(); tracker.refresh()', context);
    assert.equal(first.dataset.changeState, 'modified'); assert.equal(second.dataset.changeState, 'modified');
});

for (const changed of [false, true]) test('reimporting 3000 ' + (changed ? 'changed' : 'identical') + ' saved rules avoids repeated full-list searches', () => {
    const { context, field } = setup();
    vm.runInContext("cfgBattle.A.supports = Array.from({length:3000}, (_,i) => ({type:'stop',customMessage:'Rule '+i,conditions:[]})); tracker.save(['battle']); cfgBattle.A = JSON.parse(JSON.stringify(cfgBattle.A));", context);
    if (changed) vm.runInContext("cfgBattle.A.supports.forEach(item=>item.customMessage += ' changed')", context);
    const item = field(context.cfgBattle.A.supports[2999]);
    const work = vm.runInContext([
        '(() => { const find = Array.prototype.find, indexOf = Array.prototype.indexOf; let visits = 0, indexWork = 0;',
        'Array.prototype.find = function(predicate, self) { return find.call(this, (value,index,array) => { visits++; return predicate.call(self,value,index,array); }); };',
        'Array.prototype.indexOf = function(...args) { indexWork += this.length; return indexOf.apply(this,args); };',
        'try { tracker.refresh(); return {visits,indexWork}; } finally { Array.prototype.find = find; Array.prototype.indexOf = indexOf; } })()'
    ].join(' '), context);
    assert.ok(work.visits < 30000, 'full-list predicate visits: ' + work.visits);
    assert.ok(work.indexWork < 30000, 'reorder lookup work: ' + work.indexWork);
    assert.equal(item.dataset.changeState, changed ? 'modified' : undefined);
});

test('recreated rules preserve content identity across object-key ordering and reordering', () => {
    const { context, field } = setup();
    vm.runInContext("cfgBattle.A.supports=[{type:'stop',customMessage:'One',conditions:[]},{type:'stop',customMessage:'Two',conditions:[]}];tracker.save(['battle']);cfgBattle.A.supports=[{conditions:[],customMessage:'Two',type:'stop'},{customMessage:'One',type:'stop'}]", context);
    const items = context.cfgBattle.A.supports.map(field);
    vm.runInContext('tracker.refresh()', context);
    assert.ok(items.every(item => item.dataset.changeState === 'modified'));
    vm.runInContext('cfgBattle.A.supports.reverse();tracker.refresh()', context);
    assert.ok(items.every(item => item.dataset.changeState === undefined));
});

test('content index preserves distinct duplicate rules and does not claim an existing identity', () => {
    const { context, field } = setup();
    vm.runInContext("cfgBattle.A.supports=[{type:'stop',customMessage:'Same'},{type:'stop',customMessage:'Same'}];tracker.save(['battle']);cfgBattle.A.supports.unshift(JSON.parse(JSON.stringify(cfgBattle.A.supports[0])))", context);
    const items = context.cfgBattle.A.supports.map(field);
    vm.runInContext('tracker.refresh()', context);
    assert.deepEqual(Array.from(items, item => item.dataset.changeState), ['added', undefined, undefined]);
});

test('content index verifies different empty containers and retains explicit shortcut groups', () => {
    const { context, field } = setup();
    vm.runInContext("cfgBattle.A.supports=[{type:'stop',customMessage:'Same',extra:[]},{type:'stop',customMessage:'Same',extra:{}}];tracker.save(['battle']);cfgBattle.A.supports=JSON.parse(JSON.stringify(cfgBattle.A.supports)).reverse()", context);
    const items = context.cfgBattle.A.supports.map(field);
    vm.runInContext('tracker.refresh()', context);
    assert.ok(items.every(item => item.dataset.changeState === 'modified'));
    vm.runInContext("cfgBattle.A.supports.reverse();tracker.refresh();cfgBattle.A.supports[0].kb_Test=[];tracker.refresh()", context);
    assert.equal(items[1].dataset.changeState, 'modified');
    assert.equal(items[0].dataset.changeState, undefined);
});

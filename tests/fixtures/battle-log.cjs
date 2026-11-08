'use strict';
// Test-only access to private log state. All browser traffic is intercepted by
// the owning performance/reload fixture; this never connects to a live account.
const { source } = require('./battle-performance.cjs');
function expose() {
    defaultCfgBattle.recordBattleLog = true;
    window.__log = {
        get key() { return prefix + 'battleLogRecord' + isekaiSuffix; },
        get record() { return battleLogRecord; },
        get checkpoint() { return typeof battleLogCheckpoint === 'undefined' ? null : battleLogCheckpoint; },
        replace(value) { battleLogRecord = value; },
        seed(value, stored = false) {
            battleLogRecord = value; battleLogRecordCurrent = []; cfgBattle.recordBattleLog = true;
            if (typeof battleLogCheckpoint !== 'undefined') battleLogCheckpoint = null;
            if (stored) localStorage.setItem(this.key, JSON.stringify(value));
        },
        recordBatch: battleLogRecorder,
        recordTurn: () => battleRecorder(),
        save: () => storeBattleLogRecord(),
        persist: () => storeTmp(),
        export: () => battleLogPlayer(),
        finish: () => recordFinalBattle(),
        html(markup, end = false) {
            log.querySelector('tbody').innerHTML = markup;
            document.getElementById('btcp')?.remove();
            if (end) { const panel = document.createElement('div'); panel.id = 'btcp'; document.getElementById('battle_main').append(panel); }
        },
        ajax(markup) {
            document.getElementById('battle_main').innerHTML = new DOMParser().parseFromString(markup, 'text/html').getElementById('battle_main').innerHTML;
            document.dispatchEvent(new Event('DOMContentLoaded'));
        },
        operations(task) {
            const stringify = JSON.stringify, get = Storage.prototype.getItem, set = Storage.prototype.setItem;
            const counts = { arrays: [], gets: 0, sets: 0 };
            const key = this.key;
            JSON.stringify = function(value, ...args) {
                if (Array.isArray(value) && value !== monsterData) counts.arrays.push({ length: value.length, full: value === battleLogRecord });
                return stringify.call(this, value, ...args);
            };
            Storage.prototype.getItem = function(name) { if (name === key) counts.gets++; return get.call(this, name); };
            Storage.prototype.setItem = function(name, value) { if (name === key) counts.sets++; return set.call(this, name, value); };
            try { task(); return counts; }
            finally { JSON.stringify = stringify; Storage.prototype.getItem = get; Storage.prototype.setItem = set; }
        }
    };
}
function instrument(input = source) {
    if (!input.includes('\ninitDo();')) throw Error('Missing startup anchor');
    return input.replace('\ninitDo();', '\n(' + expose.toString() + ')();\ninitDo();');
}
function history(size) { return Array.from({ length: size }, (_, i) => 'Turn ' + i + ': You hit Monster for 123 damage.'); }
const turn = '<tr><td>You hit Fixture Monster for 1234 slashing damage.</td></tr><tr><td>You attack Fixture Monster 0.</td></tr><tr><td class="tls"><hr></td></tr>';
module.exports = { instrument, history, turn };

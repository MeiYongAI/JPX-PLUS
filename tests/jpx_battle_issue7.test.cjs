'use strict';
// Local browser fixtures only. No split-view or real-network claim.
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, source } = require('./fixtures/battle-performance.cjs');
const { instrument, turn } = require('./fixtures/battle-log.cjs');
let browser;
before(async () => { browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true }); });
after(async () => browser?.close());
async function fixture(t, options = {}) {
    const context = await browser.newContext(); t.after(() => context.close());
    const expose = 'window.__issue7 = { throttle: jpxUtils.throttle, read: getBattleLogHTML, init: preDoBattle, stop: stopBattleUpdates };';
    const input = instrument(source).replace('\ninitDo();', '\ninitDo();\n' + expose);
    const f = await open(context, { source: input, rows: 0, ...options });
    t.after(() => assert.deepEqual(f.errors, [])); return f.page;
}
for (const recording of [false, true]) test('current action reads stay bounded with 10,000 prior actions; recording ' + recording, async t => {
    const page = await fixture(t);
    const actual = await page.evaluate(({ turn, recording }) => {
        __log.seed(['saved earlier']); __perf.options({ recordBattleLog: recording });
        const old = Array.from({length:10000}, (_,i) => '<tr><td class="tl">Old action ' + i + '</td></tr><tr><td class="tls"><hr></td></tr>').join('');
        __log.html(turn + old);
        const root = document.getElementById('textlog');
        const before = root.innerHTML, latest = __issue7.read(root, true);
        const inner = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        const outer = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML');
        const query = Element.prototype.querySelectorAll, descendants = Element.prototype.getElementsByTagName;
        const counts = { wholeLogReads:0, serializedChars:0, fullCollections:0 };
        Object.defineProperty(Element.prototype, 'innerHTML', {...inner, get() {
            const value = inner.get.call(this);
            if(this === root || this === root.firstElementChild) counts.wholeLogReads++;
            if(this === root || root.contains(this)) counts.serializedChars += value.length;
            return value;
        }});
        Object.defineProperty(Element.prototype, 'outerHTML', {...outer, get() {
            const value = outer.get.call(this); if(root.contains(this)) counts.serializedChars += value.length; return value;
        }});
        Element.prototype.querySelectorAll = function(...args) { if(this === root) counts.fullCollections++; return query.apply(this,args); };
        Element.prototype.getElementsByTagName = function(...args) { if(this === root) counts.fullCollections++; return descendants.apply(this,args); };
        try { __perf.process(); } finally {
            Object.defineProperty(Element.prototype, 'innerHTML',inner); Object.defineProperty(Element.prototype, 'outerHTML',outer);
            Element.prototype.querySelectorAll = query; Element.prototype.getElementsByTagName = descendants;
        }
        return {counts,latest,retained:root.innerHTML===before,log:__log.record,stats:__perf.snapshot()};
    }, {turn,recording});
    assert.equal(actual.counts.wholeLogReads,0); assert.equal(actual.counts.fullCollections,0);
    assert.ok(actual.counts.serializedChars < 2000, JSON.stringify(actual.counts));
    assert.ok(!actual.latest.includes('Old action')); assert.equal(actual.retained,true);
    assert.equal(actual.stats.action,1); assert.equal(actual.stats.combatRecords.physicalDealt.slashing,1234);
    assert.deepEqual(actual.log, recording ? ['saved earlier','-'.repeat(50),'You hit Fixture Monster for 1234 slashing damage.','You attack Fixture Monster 0.'] : ['saved earlier']);
});
for(const translation of ['before','after']) test('current action preserves nested Scan markup and identical later actions: '+translation, async t => {
    const page=await fixture(t,{translation});
    const result=await page.evaluate(() => {
        __perf.render();
        __log.seed([]);
        const scan='<tr><td><strong>Scanning</strong> <hv-battle-text>怪物 🐱</hv-battle-text><table><tbody><tr><td>Scan stat</td></tr></tbody></table> complete.</td></tr><tr><td class="tls"><hr></td></tr>';
        __log.html(scan+'<tr><td>Old turn</td></tr><tr><td class="tls"><hr></td></tr>');
        const read=__issue7.read(document.getElementById('textlog'),true);
        __log.recordTurn(); __log.recordTurn();
        return {read,log:__log.record,action:__perf.snapshot().action};
    });
    assert.ok(result.read.includes('<table>')); assert.ok(result.read.includes('Scan stat'));
    assert.ok(!result.read.includes('hv-battle-text')); assert.ok(!result.read.includes('Old turn'));
    assert.equal(result.action,2);
    assert.deepEqual(result.log,Array(2).fill(['-'.repeat(50),'Scanning 怪物 🐱 complete.','Scan stat']).flat());
});
test('an immediate call cancels an overdue trailing timer, including timer ID zero',async t=>{
    const page=await fixture(t);
    const result=await page.evaluate(()=>{
        const original={now:Date.now,set:window.setTimeout,clear:window.clearTimeout};
        let clock=1000,id=0; const jobs=new Map(),calls=[];
        Date.now=()=>clock; window.setTimeout=fn=>{const key=id++;jobs.set(key,fn);return key;};
        window.clearTimeout=key=>jobs.delete(key);
        try{
            const fn=__issue7.throttle(value=>calls.push(value),200,true);
            fn('first');clock=1050;fn('stale');clock=1060;fn('latest pending');
            const pending=jobs.size;clock=1500;fn('fresh after delay');
            for(const [key,job] of [...jobs]){jobs.delete(key);job();}
            clock=1520;fn('cancelled');fn.cancel();
            return {pending,calls,left:jobs.size};
        }finally{Date.now=original.now;window.setTimeout=original.set;window.clearTimeout=original.clear;}
    });
    assert.deepEqual(result,{pending:1,calls:['first','fresh after delay'],left:0});
});

test('timing samples are immutable snapshots and separate direct processing from queued updates', async t => {
    const page = await fixture(t);
    const result = await page.evaluate(async () => {
        const initial = JPXPlus.getBattleTiming();
        __perf.process();
        const direct = JPXPlus.getBattleTiming();
        __issue7.init();
        const now = Date.now, timeout = window.setTimeout, clear = window.clearTimeout;
        let clock = 1000, nextId = 10000; const jobs = new Map();
        Date.now = () => clock;
        window.setTimeout = (fn, delay) => { const id = nextId++; jobs.set(id, {fn, delay}); return id; };
        window.clearTimeout = id => { if (!jobs.delete(id)) clear(id); };
        const append = async () => { document.querySelector('#textlog tbody').insertRow(0).insertCell().textContent = 'Fixture update'; await Promise.resolve(); };
        try {
            await append();
            const observed = JPXPlus.getBattleTiming();
            clock += 20; await append();
            const beforeTrailing = JPXPlus.getBattleTiming();
            const trailing = [...jobs].find(([, job]) => job.delay === 180);
            if (!trailing) throw Error('No trailing update was queued');
            jobs.delete(trailing[0]); clock += 180; trailing[1].fn();
            const queued = JPXPlus.getBattleTiming();
            clock += 20; await append();
            __issue7.stop();
            __perf.process();
            const afterStop = JPXPlus.getBattleTiming();
            return { initial, direct, observed, beforeTrailing, queued, afterStop, frozen: Object.isFrozen(direct), remainingUpdates: [...jobs.values()].filter(job => job.delay === 180).length };
        } finally { __issue7.stop(); Date.now = now; window.setTimeout = timeout; window.clearTimeout = clear; }
    });
    assert.equal(result.initial.samples, 0);
    assert.equal(result.direct.samples, 1); assert.equal(result.direct.queueMs, null);
    assert.equal(result.frozen, true); assert.ok(result.direct.processingMs >= 0);
    assert.equal(result.direct.visibility, 'visible');
    assert.equal(result.observed.samples, 2); assert.ok(result.observed.queueMs >= 0);
    assert.equal(result.beforeTrailing.samples, 2);
    assert.equal(result.queued.samples, 3); assert.equal(result.queued.intervalMs, 200);
    assert.ok(result.queued.queueMs >= 0); assert.ok(result.queued.processingMs >= 0);
    assert.equal(result.afterStop.samples, 4); assert.equal(result.afterStop.queueMs, null);
    assert.equal(result.remainingUpdates, 0);
});

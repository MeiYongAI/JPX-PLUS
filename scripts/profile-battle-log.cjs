'use strict';
// Isolated Chrome, synthetic DOM and history, intercepted network. Timing is
// diagnostic, never a test threshold or a live throughput claim.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, source } = require('../tests/fixtures/battle-performance.cjs');
const { instrument, history, turn } = require('../tests/fixtures/battle-log.cjs');
const { fixture: freshDocument } = require('../tests/fixtures/battle-reload.cjs');
const baseline = process.env.JPX_PERF_BASELINE ? fs.readFileSync(process.env.JPX_PERF_BASELINE, 'utf8') : null;
const samples = Number(process.env.JPX_LOG_SAMPLES || 12), repeats = Number(process.env.JPX_LOG_REPEATS || 3);
const actions = Number(process.env.JPX_LOG_ACTIONS || 200);
const freshSamples = Number(process.env.JPX_LOG_FRESH_SAMPLES || 5);
const digest = text => createHash('sha256').update(text).digest('hex');
(async () => {
    const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
    const results = [], freshResults = [], equivalence = new Map();
    try {
        for (let repeat = 0; repeat < repeats; repeat++) {
            const variants = baseline ? (repeat % 2 ? [['current', source], ['baseline', baseline]] : [['baseline', baseline], ['current', source]]) : [['current', source]];
            for (const size of [1000, 10000, 100000]) for (const enabled of [true, false]) for (const [variant, input] of variants) {
                const context = await browser.newContext();
                try {
                    const { page, errors } = await open(context, { source: instrument(input), rows: 0 });
                    const data = await page.evaluate(async ({ initial, turn, samples, actions, enabled }) => {
                        __perf.render(); __log.html(turn); __log.seed(initial.slice(), true); __perf.options({ recordBattleLog: enabled });
                        __log.persist(); // Establish the same saved prefix before measured additions.
                        const times = [], warmup = 3;
                        for (let sample = -warmup; sample < samples; sample++) {
                            let start = performance.now();
                            for (let i = 0; i < actions; i++) __log.recordTurn();
                            const appendMs = performance.now() - start;
                            start = performance.now(); __log.persist(); const saveMs = performance.now() - start;
                            start = performance.now(); __log.persist(); const cleanSaveMs = performance.now() - start;
                            if (sample >= 0) times.push({ appendMs, saveMs, cleanSaveMs });
                            await new Promise(resolve => setTimeout(resolve, 0));
                        }
                        const unchanged = __log.operations(() => __log.persist());
                        const before = __log.record.length; __log.recordTurn();
                        const changed = __log.operations(() => __log.persist());
                        const raw = localStorage.getItem(__log.key), parsed = JSON.parse(raw);
                        const expected = initial.slice();
                        if (enabled) for (let i = 0; i < (samples + warmup) * actions + 1; i++) expected.push('-'.repeat(50), 'You hit Fixture Monster for 1234 slashing damage.', 'You attack Fixture Monster 0.');
                        if (JSON.stringify(parsed) !== JSON.stringify(expected) || JSON.stringify(__log.record) !== JSON.stringify(expected)) throw Error('Log content/order mismatch: ' + JSON.stringify({ enabled, actual: parsed.length, memory: __log.record.length, expected: expected.length, tail: parsed.slice(-6), expectedTail: expected.slice(-6) }));
                        const anchor = __log.export();
                        anchor.addEventListener('click', event => event.preventDefault()); anchor.click();
                        const exported = JSON.parse(await (await fetch(anchor.href)).text()); URL.revokeObjectURL(anchor.href);
                        if (JSON.stringify(exported) !== JSON.stringify(expected)) throw Error('Export mismatch');
                        const state = __perf.snapshot();
                        return { times, unchanged, changed, appendedLines: __log.record.length - before, length: parsed.length, storageChars: raw.length,
                            checkpointChars: __log.checkpoint?.json.length || 0, log: parsed,
                            counters: { action: state.action, turn: state.turn, combat: state.combatRecords, revenue: state.revenueRecords },
                            attacks: window.__attacks, casts: window.__casts };
                    }, { initial: history(size), turn, samples, actions, enabled });
                    assert.deepEqual(errors, []); assert.equal(data.attacks, 0); assert.equal(data.casts, 0);
                    assert.equal(data.counters.action, (samples + 3) * actions + 1);
                    const logSha256 = digest(JSON.stringify(data.log)); delete data.log;
                    const key = size + ':' + enabled, comparable = { logSha256, counters: data.counters };
                    if (equivalence.has(key)) assert.deepEqual(comparable, equivalence.get(key), 'baseline/current output equality');
                    else equivalence.set(key, comparable);
                    results.push({ repeat, variant, historyLines: size, recording: enabled, ...data, logSha256 });
                } finally { await context.close(); }
            }
        }
        // Real initDo restores the existing JSON. Measure the first save with an
        // unobserved final turn, then actually navigate to the next document.
        for (let repeat = 0; repeat < repeats; repeat++) {
            const variants = baseline ? (repeat % 2 ? [['current', source], ['baseline', baseline]] : [['baseline', baseline], ['current', source]]) : [['current', source]];
            for (const size of [1000, 10000, 100000]) for (let sample = 0; sample < freshSamples; sample++) for (const [variant, input] of variants) {
                const initial = history(size), raw = JSON.stringify(initial);
                const f = await freshDocument(browser, null, { source: instrument(input), storage: { jpx_battleLogRecord: raw } });
                try {
                    const measured = await f.page.evaluate(turn => {
                        const init = __reload.metrics().stages.initDo.ms;
                        __log.html(turn); const start = performance.now(); __log.persist(); const saveMs = performance.now() - start;
                        return { initMs: init, saveMs, length: __log.record.length, action: __reload.snapshot().timeRecords.action,
                            stored: JSON.parse(localStorage.getItem(__log.key)) };
                    }, turn);
                    const expected = initial.concat('-'.repeat(50), 'You hit Fixture Monster for 1234 slashing damage.', 'You attack Fixture Monster 0.');
                    assert.deepEqual(measured.stored, expected); delete measured.stored;
                    assert.equal(measured.action, 1);
                    await f.navigate({ round: 2 }, true);
                    const restored = await f.page.evaluate(() => ({ log: __log.record, state: __reload.snapshot() }));
                    assert.deepEqual(restored.log, expected); assert.equal(restored.state.timeRecords.action, 1);
                    assert.equal(restored.state.combatRecords.physicalDealt.slashing, 1234);
                    assert.equal(restored.state.attacks, 0); assert.equal(restored.state.casts, 0); assert.deepEqual(f.errors, []);
                    freshResults.push({ repeat, sample, variant, historyLines: size, ...measured });
                } finally { await f.context.close(); }
            }
        }
        const summary = [], freshSummary = [];
        for (const size of [1000, 10000, 100000]) for (const enabled of [true, false]) for (const variant of baseline ? ['baseline', 'current'] : ['current']) {
            const rows = results.filter(row => row.historyLines === size && row.recording === enabled && row.variant === variant);
            const metrics = {};
            for (const field of ['appendMs', 'saveMs', 'cleanSaveMs']) {
                const values = rows.flatMap(row => row.times.map(time => time[field])).sort((a, b) => a - b);
                metrics[field] = { median: values[Math.floor(values.length / 2)], p95: values[Math.floor(values.length * .95)] };
            }
            summary.push({ historyLines: size, recording: enabled, variant, ...metrics });
        }
        for (const size of [1000, 10000, 100000]) for (const variant of baseline ? ['baseline', 'current'] : ['current']) {
            const rows = freshResults.filter(row => row.historyLines === size && row.variant === variant), metrics = {};
            for (const field of ['initMs', 'saveMs']) {
                const values = rows.map(row => row[field]).sort((a, b) => a - b);
                metrics[field] = { median: values[Math.floor(values.length / 2)], p95: values[Math.floor(values.length * .95)] };
            }
            freshSummary.push({ historyLines: size, variant, ...metrics });
        }
        const report = { scope: 'offline synthetic Chrome; all traffic intercepted; actual recorder and storeTmp; first checkpoint excluded; full-string assembly/getItem comparison/setItem included; no live TPS or whole-page claims',
            samples, repeats, actionsPerSample: actions, measuredSamples: results.length * samples, freshSamples: freshResults.length,
            currentSha256: digest(source), baselineSha256: baseline && digest(baseline), completeLogsExportsAndCountersEqual: true, nativeReloadsEqual: true, summary, freshSummary, results, freshResults };
        if (process.env.JPX_LOG_OUTPUT) { const target = path.resolve(process.env.JPX_LOG_OUTPUT); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(report, null, 2)); }
        console.log(JSON.stringify({ scope: report.scope, measuredSamples: report.measuredSamples, freshSamples: report.freshSamples, completeLogsExportsAndCountersEqual: true, nativeReloadsEqual: true, summary, freshSummary }, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

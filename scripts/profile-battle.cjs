'use strict';
// Synthetic DOM + intercepted network, not live battle or a network/TPS benchmark.
// Keep diagnostics separate from deterministic correctness tests; no timing thresholds.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, mainHTML, source } = require('../tests/fixtures/battle-performance.cjs');
const baseline = process.env.JPX_PERF_BASELINE ? fs.readFileSync(process.env.JPX_PERF_BASELINE, 'utf8') : null;
const scenarios = [
    { name: 'replace-no-overlays', replace: true, visuals: false, rows: 100 },
    { name: 'replace-with-overlays', replace: true, visuals: true, rows: 100 },
    { name: 'retained-with-overlays', replace: false, visuals: true, rows: 100 },
    { name: 'long-log-with-overlays', replace: true, visuals: true, rows: 2000 }
];
const samples = Number(process.env.JPX_PERF_SAMPLES || 80), repeats = Number(process.env.JPX_PERF_REPEATS || 3);
(async () => {
    const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
    const results = [], firstSnapshots = new Map();
    try {
        for (let repeat = 0; repeat < repeats; repeat++) {
            const variants = baseline ? (repeat % 2 ? [['current', source], ['baseline', baseline]] : [['baseline', baseline], ['current', source]]) : [['current', source]];
            for (const scenario of scenarios) for (const [variant, input] of variants) {
                const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
                try {
                    const { page, errors } = await open(context, { source: input, rows: scenario.rows });
                    const main = mainHTML(scenario.rows);
                    const first = await page.evaluate(({ main, visuals }) => {
                        __perf.reset(main, visuals); __perf.process(); return __perf.snapshot();
                    }, { main, visuals: scenario.visuals });
                    const previous = firstSnapshots.get(scenario.name);
                    if (previous) assert.deepEqual(first, previous, 'first-update output equivalence: ' + scenario.name);
                    else firstSnapshots.set(scenario.name, first);
                    const session = await context.newCDPSession(page); await session.send('Performance.enable');
                    const before = (await session.send('Performance.getMetrics')).metrics;
                    const data = await page.evaluate(async ({ main, scenario, samples }) => {
                        __perf.profile(); __perf.reset(main, scenario.visuals);
                        const times = [], warmup = 15;
                        for (let i = 0; i < samples + warmup; i++) {
                            if (scenario.replace) __perf.reset(main, scenario.visuals);
                            // Exclude fixture construction; start each update with clean layout.
                            document.body.offsetHeight;
                            if (i === warmup) __perf.clearStages();
                            const start = performance.now(); __perf.process();
                            if (i >= warmup) times.push(performance.now() - start);
                            await new Promise(resolve => setTimeout(resolve, 0));
                        }
                        times.sort((a, b) => a - b);
                        const nodes = document.querySelectorAll('#battle_main *').length;
                        const stagesMs = Object.fromEntries(Object.entries(__perf.stages()).map(([key, value]) => [key, value / samples]));
                        const operations = __perf.measure();
                        return { medianMs: times[Math.floor(times.length / 2)], p95Ms: times[Math.floor(times.length * .95)],
                            meanMs: times.reduce((a, b) => a + b, 0) / times.length,
                            stagesMs, nodes, operations };
                    }, { main, scenario, samples });
                    const after = (await session.send('Performance.getMetrics')).metrics;
                    const metrics = Object.fromEntries(after.filter(m => ['LayoutCount', 'LayoutDuration', 'RecalcStyleCount', 'RecalcStyleDuration'].includes(m.name))
                        .map(m => [m.name, m.value - (before.find(old => old.name === m.name)?.value || 0)]));
                    assert.deepEqual(errors, []);
                    results.push({ repeat, variant, scenario: scenario.name, ...data, metrics });
                } finally { await context.close(); }
            }
        }
        const report = { scope: 'offline synthetic browser; fixture reset excluded from update timing; layout metrics include fixture reset', samples, repeats,
            currentSha256: createHash('sha256').update(source).digest('hex'), baselineSha256: baseline && createHash('sha256').update(baseline).digest('hex'),
            firstUpdateEquivalent: true, results };
        if (process.env.JPX_PERF_OUTPUT) {
            const target = path.resolve(process.env.JPX_PERF_OUTPUT); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(report, null, 2));
        }
        console.log(JSON.stringify(report, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

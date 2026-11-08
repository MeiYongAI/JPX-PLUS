'use strict';
// Offline synthetic battle and real import UI; never submits live game actions.
// Durations are diagnostics, not timing assertions or real-account TPS claims.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { open, source } = require('../tests/fixtures/battle-performance.cjs');
const baseline = process.env.JPX_PERF_BASELINE ? fs.readFileSync(process.env.JPX_PERF_BASELINE, 'utf8') : null;
function makeConfig(count, title = 'Import profile') {
    return { schemaVersion: 1, kind: 'battle-mode', title, description: '', world: 'Persistent', mode: 'TwoHanded_General',
        config: { battleVersion: 20251216, TwoHanded_General: {
            supports: Array.from({ length: count }, (_, i) => ({ type: 'stop', customMessage: 'Profile rule ' + i, disabled: true,
                conditions: [{ key: 'pHP', value: [0, .2] }] })),
            attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'normalAttack', conditions: [] }]
        } } };
}
function instrument() {
    let phase = null, started = 0, records = [], stages = {}, updates = 0, timer, running = false;
    const process = preProcessLog;
    preProcessLog = (...args) => { updates++; return process(...args); };
    const factory = createJpxConfigLibrary;
    createJpxConfigLibrary = options => {
        const library = factory(options);
        return Object.freeze(Object.fromEntries(Object.entries(library).map(([name, method]) => [name, (...args) => {
            if (!phase) return method(...args);
            const at = performance.now();
            try { return method(...args); } finally { const key = options.key === 'check' ? 'temporary.' + name : 'library.' + name;
                const row = stages[key] ||= { calls: 0, ms: 0 }; row.calls++; row.ms += performance.now() - at; }
        }])));
    };
    // The battle fixture may already have initialized the archive while routing.
    jpxConfigLibrary = null;
    const tracker = createSettingsChangeTracker;
    createSettingsChangeTracker = (...args) => {
        const result = tracker(...args);
        return Object.fromEntries(Object.entries(result).map(([name, method]) => [name, (...values) => {
            if (!phase) return method(...values);
            const at = performance.now();
            try { return method(...values); } finally { const row = stages['tracker.' + name] ||= { calls: 0, ms: 0 }; row.calls++; row.ms += performance.now() - at; }
        }]));
    };
    const longTasks = [];
    const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, ms: entry.duration }))));
    observer.observe({ type: 'longtask', buffered: false });
    cfgBattle.TwoHanded_General = { supports: [{ type: 'stop', customMessage: 'Initial', disabled: true, conditions: [] }],
        attacks: [{ type: 'target', priorityRule: 'Top Down', conditions: [] }, { type: 'normalAttack', conditions: [] }] };
    localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
    preDoBattle();
    const snapshot = () => ({ active: isActiveBattle, config: JSON.stringify(cfgBattle), native: localStorage.getItem(prefix + 'cfgBattle' + isekaiSuffix), mode: getBattleMode(), attacks: window.__attacks, updates });
    function tick() {
        if (!running) return;
        const row = log.insertRow(0); row.insertCell().textContent = 'Import profile log update';
        if (log.rows.length > 110) log.deleteRow(-1);
        timer = setTimeout(tick, 40);
    }
    window.__importPerf = {
        begin(name) { phase = name; stages = {}; started = performance.now(); },
        end() { records.push({ phase, start: started, ms: performance.now() - started, stages }); phase = null; },
        async setup({ saved, entry, existing }) {
            if (existing) {
                cfgBattle.TwoHanded_General = existing;
                localStorage.setItem(prefix + 'cfgBattle' + isekaiSuffix, JSON.stringify(cfgBattle));
            }
            const library = getJpxConfigLibrary();
            for (const envelope of saved) library.save(envelope);
            renderSettings(); document.getElementById('tab_configManager').click();
            if (entry === 'direct') document.getElementById('tab_battle').click();
            toggleActive(); running = true; tick();
        },
        snapshot,
        finish() { running = false; clearTimeout(timer); return { records, longTasks, state: snapshot(), libraryBytes: new TextEncoder().encode(localStorage.getItem(jpxConfigLibraryKey)).length }; }
    };
}
function harness(input) {
    let output = input.replace(/\r\n/g, '\n');
    const replace = (from, to) => { assert.equal(output.split(from).length, 2, 'unique instrumentation anchor: ' + from.slice(0, 65)); output = output.replace(from, to); };
    if (output.includes('const value = JSON.parse(await file.text(),'))
        replace('const value = JSON.parse(await file.text(),', "const rawFile = await file.text(); window.__importPerf.begin('parse'); const value = JSON.parse(rawFile,");
    else replace('const value = JSON.parse(fileText,', "window.__importPerf.begin('parse'); const value = JSON.parse(fileText,");
    replace('captureList(); showSettings(null,envelope);', 'captureList(); showSettings(null,envelope); window.__importPerf.end();');
    replace('let next = envelope ? jpxConfigClone(envelope)', "window.__importPerf.begin('save'); let next = envelope ? jpxConfigClone(envelope)");
    replace("if (!entry && !imported) chooseEditor(saved); else { showMine(); notify(tr(imported ? 'imported' : 'saved')); }", "if (!entry && !imported) chooseEditor(saved); else { showMine(); notify(tr(imported ? 'imported' : 'saved')); } window.__importPerf.end();");
    replace("const paused = commitJpxConfigEntry(entry, world, hooks.onApplied);", "window.__importPerf.begin('apply'); const paused = commitJpxConfigEntry(entry, world, hooks.onApplied);");
    replace("captureList();showMine();notify(tr(paused?'applyPaused':'applied'));", "captureList();showMine();notify(tr(paused?'applyPaused':'applied'));window.__importPerf.end();");
    const directStart = output.indexOf("id: 'import-button'");
    const directEnd = output.indexOf("id: 'save-button'", directStart);
    assert.ok(directStart > 0 && directEnd > directStart);
    const directBlock = output.slice(directStart, directEnd);
    replace(directBlock, directBlock
        .replace("editHistory.run(t('cGen.importConfig'),", "window.__importPerf.begin('direct-import'); editHistory.run(t('cGen.importConfig'),")
        .replace("resolve(t('cGen.imported!'));", "window.__importPerf.end(); resolve(t('cGen.imported!'));"));
    replace('\ninitDo();', '\ninitDo();\n(' + instrument.toString() + ')();');
    return output;
}
const scenarios = [
    { name: '20-rules', rules: 20, saved: 0 },
    { name: '500-rules', rules: 500, saved: 0 },
    { name: '3000-rules', rules: 3000, saved: 0 },
    { name: '500-rules-with-40-saved', rules: 500, saved: 40 },
    { name: '3000-rules-reimport-identical', rules: 3000, saved: 0, existing: 'identical' },
    { name: '3000-rules-reimport-changed', rules: 3000, saved: 0, existing: 'changed' }
];
const repeats = Number(process.env.JPX_IMPORT_REPEATS || 3);
(async () => {
    const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
    const results = [];
    try {
        for (let repeat = 0; repeat < repeats; repeat++) for (const entry of ['manager', 'direct']) for (const scenario of scenarios) {
            const variants = baseline ? repeat % 2 ? [['current', source], ['baseline', baseline]] : [['baseline', baseline], ['current', source]] : [['current', source]];
            for (const [variant, input] of variants) {
                const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
                try {
                    const { page, errors } = await open(context, { source: harness(input) }); page.setDefaultTimeout(15000);
                    const existing = scenario.existing ? makeConfig(scenario.rules).config.TwoHanded_General : null;
                    if (scenario.existing === 'changed') existing.supports.forEach(rule => { rule.customMessage = 'Old ' + rule.customMessage; });
                    await page.evaluate(options => __importPerf.setup(options), { entry, existing, saved: Array.from({ length: scenario.saved }, (_, i) => makeConfig(100, 'Saved ' + i)) });
                    await page.waitForTimeout(250);
                    const before = await page.evaluate(() => __importPerf.snapshot());
                    const data = makeConfig(scenario.rules), buffer = Buffer.from(JSON.stringify(entry === 'direct' ? data.config : data));
                    const chooser = page.waitForEvent('filechooser');
                    if (entry === 'direct') await page.locator('#import-button').click();
                    else await page.locator('.jpx-config-toolbar').getByRole('button', { name: 'Import', exact: true }).click();
                    await (await chooser).setFiles({ name: 'Profile.json', mimeType: 'application/json', buffer });
                    if (entry === 'manager') {
                        await page.locator('.jpx-config-form').getByRole('button', { name: 'Save', exact: true }).click();
                        const saved = await page.evaluate(() => __importPerf.snapshot());
                        assert.equal(saved.config, before.config, 'import/save does not replace running strategy');
                        assert.equal(saved.active, true);
                        const row = page.locator('.jpx-config-row').filter({ has: page.locator('.jpx-config-title strong', { hasText: /^Import profile$/ }) });
                        await row.getByRole('button', { name: 'Apply', exact: true }).click();
                    } else await page.waitForFunction(() => document.getElementById('import-button').disabled);
                    await page.waitForTimeout(250);
                    const measured = await page.evaluate(() => __importPerf.finish());
                    assert.equal(measured.state.active, entry === 'direct' && variant === 'baseline');
                    if (entry === 'direct') assert.equal(measured.state.native, before.native, 'direct import stays unsaved');
                    assert.equal(JSON.parse(measured.state.config).TwoHanded_General.supports.length, scenario.rules);
                    assert.ok(measured.state.updates > before.updates);
                    assert.deepEqual(errors, []);
                    const phases = measured.records.map(record => ({ ...record,
                        longTasks: measured.longTasks.filter(task => task.start < record.start + record.ms && task.start + task.ms > record.start) }));
                    results.push({ repeat, entry, variant, scenario: scenario.name, fileBytes: buffer.length, libraryBytes: measured.libraryBytes,
                        phases, battleUpdates: measured.state.updates, importedWithoutChangingStrategy: entry === 'manager', appliedPaused: !measured.state.active });
                    console.log(JSON.stringify({ repeat, entry, variant, scenario: scenario.name, fileBytes: buffer.length, phases: phases.map(p => ({ name: p.phase, ms: p.ms, longTasks: p.longTasks.map(t => t.ms) })) }));
                } finally { await context.close(); }
            }
        }
        const report = { scope: 'isolated Chrome, synthetic running battle, real file import and apply UI; phase timing excludes file I/O, picker and automation waits',
            repeats, currentSha256: createHash('sha256').update(source).digest('hex'), baselineSha256: baseline && createHash('sha256').update(baseline).digest('hex'), results };
        const target = path.resolve(process.env.JPX_IMPORT_OUTPUT || '.test-output/import-profile.json');
        fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(report, null, 2));
        console.log('Report: ' + target);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

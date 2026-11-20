'use strict';
// Offline ordinary-page injection, including script parsing. No Tampermonkey,
// game account, HVUT or network timing is modeled by this measurement.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const files = process.argv.slice(2);
if (files.length !== 2) throw Error('Usage: node scripts/profile-lobby-startup.cjs before.user.js after.user.js');
const inputs = files.map(file => fs.readFileSync(path.resolve(file), 'utf8'));
const repeats = Number(process.env.JPX_LOBBY_REPEATS || 10);
const cpuRate = Number(process.env.JPX_LOBBY_CPU_RATE || 4);
const rows = [];
(async () => {
    const browser = await chromium.launch({ headless: true });
    try {
        for (let repeat = 0; repeat < repeats; repeat++) for (const variant of repeat % 2 ? [1, 0] : [0, 1]) {
            const context = await browser.newContext();
            try {
                await context.route('**/*', route => route.request().isNavigationRequest()
                    ? route.fulfill({ contentType: 'text/html', body: '<!doctype html><body><div id="csp"><div id="navbar"></div><div id="mainpane"></div></div></body>' })
                    : route.fulfill({ status: 404, body: '' }));
                const page = await context.newPage(), errors = [];
                page.on('pageerror', error => errors.push(error.message));
                const cdp = await context.newCDPSession(page);
                await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuRate });
                await page.goto('https://hentaiverse.org/?s=Character&ss=ch');
                assert.ok(inputs[variant].includes('\ninitDo();'));
                const input = inputs[variant].replace('function jpxMain() {', 'function jpxMain() { performance.mark("jpx-main-start");')
                    .replace('\ninitDo();', '\ninitDo(); performance.mark("jpx-main-end");');
                await page.evaluate(source => {
                    // Model a preceding page script updating visible content in
                    // the same task immediately before JPX is injected.
                    document.getElementById('mainpane').textContent = 'Ordinary page ready to paint';
                    performance.mark('jpx-injection-start');
                    const script = document.createElement('script'); script.textContent = source;
                    document.head.append(script);
                    performance.mark('jpx-injection-end');
                }, input);
                await page.waitForFunction(() => performance.getEntriesByName('jpx-main-end').length && performance.getEntriesByName('first-contentful-paint').length);
                rows.push({ repeat, variant: variant ? 'after' : 'before', ...await page.evaluate(() => {
                    const at = name => performance.getEntriesByName(name)[0].startTime;
                    const injection = at('jpx-injection-start'), release = at('jpx-injection-end');
                    const mainStart = at('jpx-main-start'), mainEnd = at('jpx-main-end'), paint = at('first-contentful-paint');
                    return { injectionMs: release - injection, mainMs: mainEnd - mainStart, mainAfterInjectionMs: mainStart - release,
                        paintAfterInjectionStartMs: paint - injection, paintBeforeMainEnd: paint < mainEnd,
                        stylesBytes: new TextEncoder().encode(document.getElementById('jpx').textContent).length };
                }) });
                assert.deepEqual(errors, []);
            } finally { await context.close(); }
        }
        const median = values => { values.sort((a, b) => a - b); const i = Math.floor(values.length / 2); return values.length % 2 ? values[i] : (values[i - 1] + values[i]) / 2; };
        const summary = Object.fromEntries(['before', 'after'].map(variant => {
            const data = rows.filter(row => row.variant === variant);
            return [variant, { injectionMedianMs: median(data.map(row => row.injectionMs)),
                paintMedianMs: median(data.map(row => row.paintAfterInjectionStartMs)),
                paintBeforeMainEndCount: data.filter(row => row.paintBeforeMainEnd).length }];
        }));
        const report = { scope: 'Offline Chromium, fresh contexts, synthetic ordinary page and inline script injection; excludes Tampermonkey/storage transfer, HVUT and live network',
            cpuRate, repeats, files: files.map((file, i) => ({ path: path.resolve(file), sha256: createHash('sha256').update(inputs[i]).digest('hex') })), summary, rows };
        const output = path.join(root, '.test-output/lobby-startup-profile.json');
        fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(report, null, 2));
        console.log(JSON.stringify({ summary, output }, null, 2));
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });

'use strict';
// HVUT's character stats (~70 cells) must translate with one style read pass:
// alternating attribute writes and getComputedStyle forced a recalc per cell.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const translation = fs.readFileSync(path.join(__dirname, '../HentaiVerse-Chinese.user.js'), 'utf8');
const names = ['Strength', 'Dexterity', 'Agility', 'Endurance', 'Intelligence', 'Wisdom'];
const rows = Array.from({ length: 72 }, (_, i) => `<tr><td>${i}</td><td>${names[i % names.length]}</td><td>${i * 3}</td></tr>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>td{font-size:13px}</style><div id="csp"><div id="navbar"></div>
<div class="hvut-ch-expand"><div id="stats_scrollable"><table>${rows}</table></div></div></div>`;

test('HVUT stat cells translate with batched style reads and keep their text nodes', async t => {
    const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {});
    t.after(() => browser.close());
    const page = await browser.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().isNavigationRequest()
        ? route.fulfill({ contentType: 'text/html', body: html }) : route.fulfill({ status: 404, body: '' }));
    await page.goto('https://hentaiverse.org/?s=Character&ss=ch');
    await page.evaluate(() => {
        // Count computed-style reads that follow a pending attribute write.
        window.__forced = 0; let dirty = false;
        const set = Element.prototype.setAttribute, read = window.getComputedStyle;
        Element.prototype.setAttribute = function (...args) { if (args[0] === 'data-hv-direct-display') dirty = true; return set.apply(this, args); };
        window.getComputedStyle = function (...args) { if (dirty) window.__forced++; dirty = false; return read.apply(this, args); };
    });
    await page.addScriptTag({ content: translation });
    await page.waitForFunction(() => document.querySelectorAll('[data-hv-direct-display]').length === 72);
    const result = await page.evaluate(() => {
        const cells = [...document.querySelectorAll('#stats_scrollable td:nth-child(2)')];
        return {
            forced: window.__forced,
            textNodes: cells.every(cell => cell.childNodes.length === 1 && cell.firstChild.nodeType === 3),
            original: cells[0].textContent,
            shown: cells[0].getAttribute('data-hv-direct-display'),
            size: cells.every(cell => cell.style.getPropertyValue('--hv-source-font-size') === '13px')
        };
    });
    assert.deepEqual(errors, []);
    assert.equal(result.forced, 0, 'no style read after a pending write');
    assert.equal(result.textNodes, true, 'HVUT XPath still finds the original text node');
    assert.equal(result.original, 'Strength');
    assert.notEqual(result.shown, 'Strength');
    assert.equal(result.size, true);
});

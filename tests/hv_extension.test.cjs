'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const extension = path.resolve(__dirname, '../extensions/hv-zh-cn');
const userscript = fs.readFileSync(path.resolve(__dirname, '../HentaiVerse-Chinese.user.js'), 'utf8');

// Actually load the unpacked MV3 package in a fresh Chromium profile; no addScriptTag
// injection of the extension and no game/account/network access.
test('MV3 startup, streaming DOM, AJAX and compatible source text', async t => {
    const context = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true,
        args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
    t.after(() => context.close());
    const page = await context.newPage();
    page.setDefaultTimeout(8000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const html = `<!doctype html><meta charset=utf-8><body><nav id="navbar"><a>Character</a></nav>
        <script>requestAnimationFrame(() => window.firstFrame = document.querySelector('#navbar a').textContent)</script>
        <script src="/hold.js"></script>
        <div id="pane_log"><table id="textlog"><tbody></tbody></table></div><img id="attack" src="/y/battle/attack_n.png">
        <div class="hvut-ch-expand"><div id="stats_scrollable"><table><tr><td>1</td><td>Strength</td></tr></table></div></div>
        <div id="settings-container"><span>Equipment</span></div>`;
    let unblock;
    const held = new Promise(resolve => { unblock = resolve; });
    await context.route('**/*', async r => {
        if (r.request().isNavigationRequest()) return r.fulfill({contentType:'text/html; charset=utf-8', body:html});
        if (r.request().url().endsWith('/hold.js')) {
            await held;
            return r.fulfill({contentType:'text/javascript', body:''});
        }
        return r.fulfill({status:404, body:''});
    });
    try {
        await page.goto('https://hentaiverse.org/?s=Character&ss=ch', {waitUntil:'commit'});
        await page.waitForFunction(() => window.firstFrame);
        assert.deepEqual(await page.evaluate(() => [document.readyState, firstFrame]), ['loading', '角色']);
    } finally { unblock(); }
    await page.waitForLoadState();
    assert.equal(await page.locator('#logTransToggleBtn').count(), 1);
    assert.match(await page.locator('#attack').evaluate(el => getComputedStyle(el).content), /data:image\/svg/);
    const stat = page.locator('#stats_scrollable td:nth-child(2)');
    assert.equal(await stat.textContent(), 'Strength');
    assert.equal(await stat.getAttribute('data-hv-direct-display'), '力量');
    assert.equal(await page.locator('#settings-container span').textContent(), 'Equipment');

    await page.evaluate(() => {
        const a = document.querySelector('#navbar a');
        a.firstChild.data = 'Training';
        a.addEventListener('click', () => window.clicked = true);
        a.setAttribute('title', 'Settings');
    });
    assert.equal(await page.locator('#navbar a').textContent(), '训练');
    assert.equal(await page.locator('#navbar a').getAttribute('title'), '设置');
    await page.locator('#navbar a').click();
    assert.ok(await page.evaluate(() => window.clicked));
    await page.evaluate(() => { document.querySelector('#navbar').innerHTML = '<a>Abilities</a>'; });
    assert.equal(await page.locator('#navbar a').textContent(), '技能');

    const appendLog = () => {
        const row = document.querySelector('#textlog tbody').insertRow();
        row.insertCell().textContent = 'You gain 321 EXP.';
    };
    await page.evaluate(appendLog);
    await page.locator('#textlog hv-battle-text').waitFor();
    assert.equal(await page.locator('#textlog td').textContent(), 'You gain 321 EXP.');
    await page.getByRole('button', {name:'日志汉化: 开'}).click();
    await page.getByRole('button', {name:'日志汉化: 关'}).waitFor();
    await page.evaluate(appendLog);
    await page.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
    assert.equal(await page.locator('#textlog hv-battle-text').count(), 0);

    // Loading the matching userscript later must not install another set of hooks/buttons.
    await page.addScriptTag({content:userscript});
    assert.equal(await page.locator('button').filter({hasText:/^中$/}).count(), 1);
    assert.equal(await page.locator('#hv-img-translate-style').count(), 1);
    const dialog = page.waitForEvent('dialog').then(async d => { const message = d.message(); await d.dismiss(); return message; });
    await page.evaluate(() => alert('No item selected'));
    assert.equal(await dialog, '没有选中物品');

    await page.getByRole('button', {name:'中', exact:true}).click();
    await page.getByRole('button', {name:'英', exact:true}).waitFor();
    assert.equal(await page.locator('#navbar a').textContent(), 'Character');
    assert.equal(await page.locator('#hv-img-translate-style').count(), 0);
    await page.getByRole('button', {name:'英', exact:true}).click();
    await page.getByRole('button', {name:'中', exact:true}).waitFor();
    assert.equal(await page.locator('#navbar a').textContent(), '角色');
    await page.goto('https://alt.hentaiverse.org/isekai/?s=Character&ss=ch');
    assert.equal(await page.locator('#navbar a').textContent(), '角色');
    await page.goto('https://example.org/');
    assert.equal(await page.locator('#navbar a').textContent(), 'Character');
    assert.equal(await page.locator('[data-hv-zh-runtime]').count(), 0);
    assert.deepEqual(errors, []);
});

test('forum lots and auction listings match the userscript on initial and inserted rows', async t => {
    const ext = await chromium.launchPersistentContext('', { channel: 'chromium', headless: true,
        args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] });
    t.after(() => ext.close());
    const browser = await chromium.launch({channel:'chromium'});
    t.after(() => browser.close());
    const reference = await browser.newContext();
    const equipment = 'Legendary Rapier of Slaughter';
    const href = 'https://hentaiverse.org/equip/123/abcdef';
    for (const [url, kind] of [
        ['https://forums.e-hentai.org/index.php?showtopic=123&st=20', 'forum'],
        ['https://forums.e-hentai.org/index.php?act=Print&client=printer&t=123', 'forum'],
        ['https://reasoningtheory.net/viewauction.php', 'listing'],
        ['https://lisieuxing.com/', 'native'], ['https://auction.ngnl.host/', 'native']
    ]) {
        const row = `<div><a href="${href}" class="item-title" title="${equipment}">${kind === 'forum' ? '<b>Legendary</b> Ra<span>pier</span> of Slaughter' : equipment}</a></div>`;
        const html = `<!doctype html><meta charset=utf-8><script>
            // Inspect the rendered forum text without changing the extension's closed shadow roots.
            const roots = new WeakMap(), attach = Element.prototype.attachShadow;
            Element.prototype.attachShadow = function(opts) {const root = attach.call(this, opts); roots.set(this, root); return root;};
            function visible(n) {if (n.nodeType === 3) return n.data;
                if (n.hasAttribute('data-hv-equipment-empty')) return '';
                return [...(roots.get(n)?.querySelector('.display') || n).childNodes].map(visible).join('');}
            function colors(a) {return [...a.querySelectorAll('*')].flatMap(el => [...(roots.get(el)?.querySelectorAll('mark') || [])]).map(m => getComputedStyle(m).backgroundColor);}
        </script><body><div id="lots" class="postcolor">${row}</div><input id="amount" value="50k"><button class="NAE_lot" onclick="this.dataset.clicked='yes'">Bid</button>`;
        const snapshots = [];
        for (const ctx of [reference, ext]) {
            const page = await ctx.newPage();
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            await page.route('**/*', r => r.request().isNavigationRequest() ? r.fulfill({contentType:'text/html',body:html}) : r.abort());
            await page.goto(url);
            if (ctx === reference) await page.addScriptTag({content:userscript});
            await page.evaluate(row => document.querySelector('#lots').insertAdjacentHTML('beforeend', row), row);
            await page.waitForFunction(() => [...document.querySelectorAll('.item-title')].every(a => visible(a).includes('杀戮')), null, {timeout:8000});
            const snapshot = await page.locator('.item-title').evaluateAll(links => links.map(a => ({
                display:visible(a), source:a.textContent, href:a.href, title:a.title, colors:colors(a),
                highlighted:[...CSS.highlights.values()].some(h => [...h].some(r => a.contains(r.startContainer)))
            })));
            for (const lot of snapshot) {
                assert.match(lot.display, /传奇.*西洋剑.*杀戮/, url);
                assert.equal(lot.href, href);
                if (kind === 'forum') {assert.equal(lot.source, equipment); assert.ok(lot.colors.length);}
                if (kind === 'native') {assert.match(lot.title, /西洋剑/); assert.ok(lot.highlighted);}
            }
            await page.getByRole('button', {name:'Bid', exact:true}).click();
            assert.equal(await page.locator('.NAE_lot').getAttribute('data-clicked'), 'yes');
            assert.equal(await page.locator('#amount').inputValue(), '50k');
            assert.deepEqual(errors, []);
            snapshots.push(snapshot);
            await page.close();
        }
        assert.deepEqual(snapshots[1], snapshots[0], url);
    }
    const page = await ext.newPage();
    await page.route('**/*', r => r.fulfill({contentType:'text/html', body:'<!doctype html><body>Forum index'}));
    await page.goto('https://forums.e-hentai.org/index.php?showforum=77');
    assert.equal(await page.locator('[data-hv-zh-runtime]').count(), 0);
});

for (const mode of ['extension', 'userscript']) test(`${mode}: HVEA upgrade increments keep the Chinese label and the direct English text`, async t => {
    const context = await chromium.launchPersistentContext('', {channel:'chromium', headless:true,
        args: mode === 'extension' ? [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`] : []});
    t.after(() => context.close());
    const page = await context.newPage();
    const html = '<!doctype html><meta charset="utf-8"><div class="hvut-ch-expand"><div id="stats_scrollable"><table>'
        + '<tr><td>584.8</td><td>Accuracy</td></tr><tr><td>10.0%</td><td>Attack Speed Bonus<span class="hv-panel-increment" style="font-size:7pt">+0.02%</span></td></tr></table></div></div>';
    await page.route('**/*', r => r.request().isNavigationRequest() ? r.fulfill({contentType:'text/html', body:html}) : r.abort());
    await page.goto('https://hentaiverse.org/?s=Character&ss=eq');
    if (mode === 'userscript') await page.addScriptTag({content:userscript});
    const label = page.locator('tr').first().locator('td').nth(1);
    const existing = page.locator('tr').nth(1).locator('td').nth(1);
    // A generated label must precede the colored increment, not follow it or wrap the XPath key.
    async function check(cell, english, chinese) {
        const view = await cell.evaluate(el => {
            const shown = getComputedStyle(el, el.querySelector('.hv-panel-increment') ? '::before' : '::after');
            return [el.firstChild.nodeValue, shown.content, shown.fontSize, getComputedStyle(el).fontSize];
        });
        assert.equal(view[0], english); assert.equal(view[1], JSON.stringify(chinese));
        assert.ok(parseFloat(view[2]) > 0); assert.equal(parseFloat(view[3]), 0);
    }
    await check(existing, 'Attack Speed Bonus', '攻击速度加成');
    await label.evaluate(el => {
        window.originalLabel = el.firstChild;
        const inc = document.createElement('span'); inc.className = 'hv-panel-increment';
        inc.style.cssText = 'color:#0a0;font-size:7pt;display:inline-block'; inc.textContent = '+0.52'; inc.title = '装备升级 +0.52'; el.append(inc);
    });
    await check(label, 'Accuracy', '命中值');
    const inc = label.locator('.hv-panel-increment');
    assert.equal(await inc.textContent(), '+0.52'); assert.equal(await inc.getAttribute('title'), '装备升级 +0.52');
    assert.equal(await inc.evaluate(el => getComputedStyle(el).color), 'rgb(0, 170, 0)');
    await label.evaluate(el => { el.lastChild.remove(); el.append(document.createElement('span')); el.lastChild.className='hv-panel-increment'; el.lastChild.textContent='-0.04'; originalLabel.data='Mana Cost Modifier'; });
    await check(label, 'Mana Cost Modifier', '魔力消耗率');
    await inc.evaluate(el => el.remove());
    await check(label, 'Mana Cost Modifier', '魔力消耗率');
    assert.ok(await label.evaluate(el => el.childNodes.length === 1 && el.firstChild === originalLabel));
});

test('toolbar popup, automatic checks, new version badge and offline failure', async t => {
    const context = await chromium.launchPersistentContext('', {channel:'chromium',headless:true,
        args:[`--disable-extensions-except=${extension}`,`--load-extension=${extension}`,'--no-proxy-server','--host-resolver-rules=MAP raw.githubusercontent.com ~NOTFOUND']});
    t.after(() => context.close());
    const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const page = await context.newPage();
    await page.goto(new URL('popup.html', worker.url()).href);
    await page.waitForFunction(async () => !!(await chrome.storage.local.get('result')).result);
    assert.ok(await page.evaluate(() => chrome.alarms.get('hv-check-version')));
    assert.equal(await page.locator('#version').getAttribute('href'), 'https://github.com/MeiYongAI/JPX-PLUS');
    assert.ok(await page.locator('#interval').isHidden());
    await page.locator('#settings').click();
    await page.locator('#interval').selectOption('6');
    await page.waitForFunction(async () => (await chrome.alarms.get('hv-check-version'))?.periodInMinutes === 360);
    await page.reload(); await page.locator('#settings').click();
    assert.equal(await page.locator('#interval').inputValue(), '6');
    await page.locator('#interval').selectOption('0');
    await page.waitForFunction(async () => !await chrome.alarms.get('hv-check-version'));
    await page.locator('#back').click();
    await worker.evaluate(() => {self.fetch = async () => Response.json({version:'1.10.0'});});
    await page.locator('#check').click();
    await page.getByText('有新版本', {exact:true}).waitFor();
    assert.match(await page.locator('#download').getAttribute('href'), /hv-zh-cn-1\.10\.0\.zip$/);
    assert.equal(await page.evaluate(() => chrome.action.getBadgeText({})), 'NEW');
    await worker.evaluate(() => {self.fetch = async () => Response.json({version:chrome.runtime.getManifest().version});});
    await page.evaluate(() => chrome.runtime.sendMessage('check')); await page.getByText('已是最新版本').waitFor();
    assert.ok(await page.locator('#download').isHidden());
    await worker.evaluate(() => {self.fetch = async () => {throw Error('offline')};});
    await page.locator('#check').click(); await page.getByText('检查失败，可重试').waitFor();
    await page.reload(); await page.getByText('检查失败，可重试').waitFor();
    await page.locator('#settings').click();
    assert.equal(await page.locator('#interval').inputValue(), '0');
    await page.locator('#interval').selectOption('12');
    await page.waitForFunction(async () => (await chrome.alarms.get('hv-check-version'))?.periodInMinutes === 720);
});

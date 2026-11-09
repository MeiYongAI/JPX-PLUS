'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const translation = fs.readFileSync(path.join(root, 'HentaiVerse-Chinese.user.js'), 'utf8');
const darkSource = fs.readFileSync(path.join(root, 'HV-Dark.user.css'), 'utf8');
const darkCSS = darkSource.match(/@-moz-document[^\{]*\{([\s\S]*)\}\s*$/)[1];

// Native DOM/CSS inspected on the reported modify page on 2026-11-09.
// No account requests: all navigation is fulfilled by this local fixture.
const nativeCSS = `
body{font:8pt verdana;color:#5c0d11;background:#e3e0d1;padding:2px;margin:0;text-align:center}
div{margin:0;padding:0}p{padding:3px 1px;margin:1px}table{border-collapse:collapse}
a{color:inherit}#csp{background:#edebdf;border:1px solid #5c0d12;width:1236px;height:702px;position:relative}
#mainpane{width:1228px;height:670px;padding:2px 0 2px 8px;overflow:hidden}
#armory_outer{display:flex;flex-flow:row;align-items:stretch;justify-content:start;height:100%;user-select:none}
#armory_left{display:flex;flex-flow:column;align-items:stretch;justify-content:start;padding-top:50px}
#armory_left>div,#armory_left>a>div{border-right:1px solid #5c0d11}
#armory_left>div:last-of-type{flex-grow:1}#armory_left a,#armory_right a{text-decoration:none}
#armory_right{display:flex;flex-flow:column;align-items:stretch;justify-content:start;flex-grow:1}
.armory_tab{padding:15px 5px;font-weight:bold;font-size:14px;font-family:verdana;cursor:pointer;border-radius:9px 0 0 9px;border:1px solid transparent}
.armory_cur{border:1px solid #5c0d11;border-right:1px solid transparent!important}
#filterbar{padding:5px 15px;font:bold 14px verdana;display:flex;align-items:center}
#filterbar>a{flex-grow:1;text-decoration:none}#filterbar>a>div{padding:5px;border:1px solid;border-radius:9px 9px 0 0}
#equipmodify_outer{display:flex;align-items:stretch;height:630px;width:100%}
#equipmodify_left{padding:10px 20px;flex:1}#equipmodify_left>p{font-weight:bold;font-size:9pt}
#equipmodify_middle{padding:10px 20px;flex:1}#equipmodify_right{width:440px}
#charmslots{margin:-7px 0 -1px}
.eqcharm{width:300px;height:52px;margin:9px auto;padding:6px 1px 5px;border:1px solid #5c0d11;border-radius:9px}
.eqcharm>div{text-align:center;font-size:10pt;font-weight:bold}.eqcharm>div:last-child{padding-top:2px}
.eqcharm table{margin:2px auto 0;text-align:center;font-size:10pt;font-weight:bold;width:280px}
.eqcharm td:first-child{text-align:left;padding-left:50px}.eqcharm td:last-child{text-align:right;padding-right:50px}
.eqce{color:#9c9c9c;margin-top:7px}.fc4{display:inline;height:12px;font-size:12pt}.fc4>div{font-weight:bold}
.hvut-am-side{position:absolute;width:85px}
`;
const labels = ['Organize', 'Modify', 'Repair', 'Soulbind', 'Purchase', 'Sell', 'Salvage'];
const charmNames = ['Archmage (Greater)', 'Penetrator (Greater)', 'Spellweaver (Lesser)'];
function fixture({ hvutSide = false, allOccupied = false } = {}) {
    const cards = Array.from({ length: 6 }, (_, i) => `<div class="eqcharm" data-slot="${i + 1}" onclick="window.__clickedSlot=${i + 1}">
        <div><div class="fc4 fac fcb"><div>Charm Slot ${i + 1}</div></div></div>
        ${i < 3 || allOccupied ? `<table><tr><th colspan="2">${charmNames[i % 3]}</th></tr>
        <tr><td>100%</td><td>${i % 3 === 2 ? 'Kevlar' : 'Mithril'} Pouch</td></tr></table>` : '<div class="eqce">(empty)</div>'}</div>`).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><style>${nativeCSS}</style></head><body>
        <div id="csp"><div style="height:26px"></div><div id="mainpane"><div id="armory_outer">
        <div id="armory_left">${labels.map((label, i) => `<a href="?s=Bazaar&ss=am&screen=${label.toLowerCase()}&filter=equipped"><div class="armory_tab${i === 1 ? ' armory_cur' : ''}">${label}</div></a>`).join('')}<div>${hvutSide ? '<div class="hvut-am-side">HVUT</div>' : ''}</div></div>
        <div id="armory_right"><div id="filterbar">${['Equipped', 'New', 'One-Handed'].map(text => `<a href="#"><div>${text}</div></a>`).join('')}</div>
        <div id="equipmodify_outer"><div id="equipmodify_left"><div id="charmslots">${cards}</div><p>Charm Points: 85 / 85</p></div><div id="equipmodify_middle"></div><div id="equipmodify_right"></div></div></div></div></div></div>
        <div id="outside-card" class="eqcharm"><div>Unrelated card</div></div></body></html>`;
}
const measure = page => page.evaluate(() => {
    const zoom = Number(document.body.style.zoom) || 1;
    const rect = selector => document.querySelector(selector).getBoundingClientRect();
    const cards = [...document.querySelectorAll('#charmslots > .eqcharm')].map(card => {
        const r = card.getBoundingClientRect();
        const descendants = [...card.querySelectorAll('div,table,th,td')].map(n => n.getBoundingClientRect());
        return { height:r.height/zoom, overflow:Math.max(0, ...descendants.map(d => (d.bottom-r.bottom)/zoom)),
            horizontalOverflow:Math.max(0, ...descendants.map(d => Math.max(d.right-r.right, r.left-d.left)/zoom)) };
    });
    const points = rect('#equipmodify_left > p'), pane = rect('#mainpane');
    return { sidebar:rect('#armory_left').width/zoom, cards,
        pointsOverflow:Math.max(0,(points.bottom-pane.bottom)/zoom),
        outsideHeight:rect('#outside-card').height/zoom,
        labels:[...document.querySelectorAll('#armory_left .armory_tab')].map(n=>n.textContent),
        heading:document.querySelector('#charmslots .fc4').textContent,
        pouch:document.querySelector('#charmslots td:last-child').textContent };
});

test('translated armory keeps readable sidebar width and charm contents within their cards', async t => {
    const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome',headless:true});
    t.after(() => browser.close());
    const out = path.join(root, '.test-output/armory-layout');
    fs.mkdirSync(out, {recursive:true});
    const reports = [];
    const cases = [
        {name:'light',zoom:1},
        {name:'dark',zoom:1,dark:true},
        {name:'dark-125',zoom:1.25,dark:true},
        {name:'dark-150',zoom:1.5,dark:true},
        {name:'hvut-150',zoom:1.5,dark:true,hvutSide:true},
        {name:'six-charms',zoom:1,dark:true,allOccupied:true},
        {name:'larger-font',zoom:1,dark:true,allOccupied:true,large:true},
        {name:'narrow-viewport',zoom:1,dark:true,width:768},
        {name:'long-name',zoom:1,dark:true,long:true}
    ];
    for (const options of cases) {
        const page = await browser.newPage({viewport:{width:options.width || 1920,height:1180},deviceScaleFactor:1.5});
        const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.route('**/*', route => route.request().isNavigationRequest()
            ? route.fulfill({contentType:'text/html',body:fixture(options)}) : route.abort());
        await page.goto('https://hentaiverse.org/?s=Bazaar&ss=am&screen=modify&filter=equipped');
        await page.evaluate(zoom => {document.body.style.zoom = zoom;}, options.zoom);
        const english = await measure(page);
        await page.addScriptTag({content:translation});
        await page.waitForFunction(() => document.querySelector('#charmslots .fc4').textContent.includes('护符栏'));
        if (options.dark) await page.addStyleTag({content:darkCSS});
        if (options.large) await page.addStyleTag({content:'#charmslots .eqcharm table{font-size:16px}#charmslots .fc4{font-size:20px}'});
        if (options.long) await page.locator('#charmslots th').first().evaluate(n => {n.textContent='大型魔力消耗减免护符（附加说明与较长名称换行检查）';});
        if (options.name === 'dark') {
            // Historical behavior: content-sized sidebar and fixed-height cards with normal CJK line boxes.
            const legacy = await page.addStyleTag({content:'#armory_left{min-width:0!important}#charmslots>.eqcharm{height:52px;line-height:normal}'});
            const broken = await measure(page);
            assert.ok(broken.sidebar < 50, 'reproduce the narrow two-character menu');
            // Headless font fallback differs slightly from the live Windows page.
            assert.ok(broken.cards[0].overflow > 1, 'reproduce CJK third-row overflow: ' + JSON.stringify(broken));
            await page.locator('#csp').screenshot({path:path.join(out,'before.png')});
            reports.push({case:'legacy',...broken});
            await legacy.evaluate(n => n.remove());
        }
        const actual = await measure(page);
        assert.ok(actual.sidebar >= 84.9, `${options.name}: sidebar remains at least 85px`);
        assert.ok(actual.cards.every(card => card.overflow < 0.1 && card.horizontalOverflow < 0.1), JSON.stringify({options,actual}));
        assert.equal(actual.pointsOverflow, 0, `${options.name}: all six slots and points fit inside the native panel`);
        assert.ok(Math.abs(actual.outsideHeight-english.outsideHeight) < 0.1, 'unrelated cards retain native dimensions');
        assert.deepEqual(actual.labels, ['管理','改装','修理','绑定','购买','出售','分解']);
        assert.match(actual.pouch, /秘银护符袋/);
        await page.locator('#charmslots > .eqcharm').first().click();
        assert.equal(await page.evaluate(() => window.__clickedSlot), 1, 'card click handler remains active');
        assert.deepEqual(errors, []);
        if (options.name === 'dark') await page.locator('#csp').screenshot({path:path.join(out,'after.png')});
        reports.push({case:options.name,...actual});
        await page.close();
    }
    fs.writeFileSync(path.join(out,'measurements.json'), JSON.stringify(reports,null,2)+'\n');
});

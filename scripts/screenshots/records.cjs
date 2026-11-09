'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const repo = path.resolve(__dirname, '../..');
const output = path.join(repo, 'docs/images');
const english = process.env.JPX_DOC_LANGUAGE === 'en';
const fileName = name => name + (english ? '-en' : '') + '.png';
const source = fs.readFileSync(path.join(repo, 'JPX-PLUS.user.js'), 'utf8');
const pack = fs.readFileSync(path.join(repo, 'JPX-PLUS-ZhCN.user.js'), 'utf8');
function expose() {
    initDoI18n(); loadBattleConfig(); applyJpxTheme();
    cfgStats = JSON.parse(JSON.stringify(defaultCfgStats));
    const visible = new Set(['date','world','battleType','round','deltaTime','turns','tps','finalProfit','credit','eqL','eqM','seed']);
    cfgStats.statsColumns.forEach(column => {column.disabled = !visible.has(column.id);});
    jpxMarket.getMarketPrice = async () => ({'Energy Drink': 10000, 'Health Draught': 10, 'Mana Draught': 20, 'World Seed': 500, 'Chaos Token': 2000, 'Crystal of Flames': 8});
    window.__readme = {
        render: () => renderBattleRecordsPage(window),
        theme: (value) => {localStorage.setItem('jpx_theme', value);applyJpxTheme();},
        seed: async () => {
            const db = await openDB();
            await new Promise((resolve, reject) => {
                const tx = db.transaction('battleRecords', 'readwrite');
                const store = tx.objectStore('battleRecords');
                store.clear();
                const definitions = [
                    ['2026-11-08 14:30:00', 'Persistent', 'Arena', 100, 1500, 300, 4000, 7, 2],
                    ['2026-11-08 13:10:00', 'Persistent', 'Item', 60, 920, 184, 2100, 4, 1],
                    ['2026-11-08 11:20:00', 'Persistent', 'Battle1000', 1000, 12500, 2500, 28000, 32, 6],
                    ['2026-11-08 10:40:00', 'Isekai', 'Tower', 20, 320, 80, 900, 2, 0],
                    ['2026-11-04 19:20:00', 'Persistent', 'Arena', 125, 2010, 402, 5300, 9, 3],
                    ['2026-11-04 16:10:00', 'Persistent', 'Item', 80, 1210, 242, 2900, 5, 1],
                    ['2026-11-04 14:00:00', 'Persistent', 'Encounter', 1, 38, 8, 350, 1, 0],
                    ['2026-11-03 17:30:00', 'Persistent', 'Arena', 100, 1600, 320, 4100, 6, 2]
                ];
                definitions.forEach(([timestamp, world, battleType, rounds, turns, seconds, credit, seeds, equipment], i) => {
                    const combat = jpxUtils.createCombatRecords(), revenue = jpxUtils.createRevenueRecords();
                    const k = turns / 1500;
                    Object.assign(combat.physicalDealt, {slashing: Math.round(345678*k), fire: Math.round(125000*k), damagePlus: Math.round(1000*k), hit: Math.round(900*k), crit: Math.round(120*k), miss: Math.round(4*k), crit2: Math.round(30*k)});
                    Object.assign(combat.magicalDealt, {cold: Math.round(234567*k), dark: Math.round(45678*k), hit: Math.round(300*k), crit: Math.round(80*k), resist: Math.round(5*k)});
                    Object.assign(combat.physicalTaken, {crushing: Math.round(12345*k), slashing: Math.round(6789*k), hit: Math.round(210*k), crit: Math.round(12*k), block: Math.round(40*k)});
                    Object.assign(combat.magicalTaken, {fire: Math.round(4567*k), cold: Math.round(2345*k), hit: Math.round(35*k), crit: Math.round(3*k), resist: Math.round(9*k)});
                    combat.use = {Cure: 7, Regen: 4, 'Health Draught': 3, Imperil: 12};
                    revenue.exp = Math.round(1500000*k); revenue.credit = credit;
                    revenue.consumable = {'World Seed': {drop: seeds, use: 0, balance: seeds}, 'Health Draught': {drop: 0, use: 3, balance: -3}, profit: seeds*500-30};
                    revenue.equipment = {Legendary: Array.from({length: equipment}, (_, n) => ['Legendary Arctic Wakizashi of Slaughter', 'Legendary Shocking Estoc of Balance', 'Legendary Radiant Phase Robe of Freyr'][n%3]), Magnificent: ['Magnificent Ruby Cotton Cap of the Elementalist']};
                    revenue.proficiency = {OneHanded: 0.128, Divine: 0.031};
                    revenue.staminaCost = 0; revenue.totalProfit = credit+revenue.consumable.profit; revenue.finalProfit = revenue.totalProfit;
                    store.put({timestamp, date:timestamp.slice(0,10), world, battleType, difficulty:20, result:'Victory', playerLevel:400, persona:'示例配置', worldLevel:0, towerFloor:0, roundInfo:{current:rounds,total:rounds}, turns, deltaSeconds:seconds, deltaTime:jpxUtils.secondsToTime(seconds,true), tps:Math.round(turns/seconds*100)/100, riddle:rounds>=100?2:0, combatRecords:combat, revenueRecords:revenue});
                });
                tx.oncomplete = resolve; tx.onerror = () => reject(tx.error);
            });
            db.close();
        }
    };
}
const harness = source.replace('\ninitDo();', '\n(' + (english ? expose.toString().replaceAll('示例配置', 'Example profile') : expose.toString()) + ')();');
assert.notEqual(harness, source);
(async () => {
    fs.mkdirSync(output,{recursive:true});
    const browser = await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL ? {channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});
    const context = await browser.newContext({viewport:{width:1440,height:850},deviceScaleFactor:1,locale:'zh-CN'});
    const errors=[],blocked=[];
    context.on('page', p=>p.on('pageerror',e=>errors.push(e.message)));
    await context.route('**/*', route=>{
        if(route.request().isNavigationRequest()&&route.request().url()==='https://hentaiverse.org/') return route.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="csp"><div id="navbar"></div></div></body></html>'});
        blocked.push(route.request().url()); return route.abort();
    });
    try {
        const page = await context.newPage();
        await page.goto('https://hentaiverse.org/');
        if (!english) await page.addScriptTag({content:pack}); await page.addScriptTag({content:harness});
        await page.evaluate(async()=>{await __readme.seed();__readme.render();});
        await page.waitForFunction(()=>document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy')==='false');
        await page.mouse.move(1438,848);
        const rows=await page.locator('#battleStatsTable tbody tr').count();
        const tableBounds=await page.locator('#battleStatsTable').boundingBox();
        await page.screenshot({path:path.join(output,fileName('desktop-records')),clip:{x:0,y:0,width:1440,height:Math.min(850,Math.ceil(tableBounds.y+tableBounds.height+16))}});
        const popup=page.waitForEvent('popup');
        await page.locator('#battleStatsTable tbody tr:not([data-summary]) .jpx-records-detail').first().click();
        const detail=await popup;
        await detail.setViewportSize({width:1380,height:1000});
        await detail.locator('.jpx-record-detail-page').waitFor();
        await detail.mouse.move(1378,998);
        const detailBounds=await detail.locator('.jpx-record-detail-page').boundingBox();
        await detail.screenshot({path:path.join(output,fileName('desktop-detail')),clip:{x:0,y:0,width:1380,height:Math.min(1000,Math.ceil(detailBounds.height))}});
        await page.evaluate(()=>__readme.theme('dark'));
        await detail.waitForFunction(()=>document.documentElement.dataset.jpxTheme==='dark');
        await page.screenshot({path:path.join(output,fileName('desktop-records-dark')),clip:{x:0,y:0,width:1440,height:Math.min(850,Math.ceil(tableBounds.y+tableBounds.height+16))}});
        await detail.screenshot({path:path.join(output,fileName('desktop-detail-dark')),clip:{x:0,y:0,width:1380,height:Math.min(1000,Math.ceil(detailBounds.height))}});
        assert.deepEqual(errors,[]);
        assert.doesNotMatch(await detail.locator('#info-records-div').innerText(), /undefined/i);
        assert.equal(await detail.locator('body').innerText().then(t=>t.includes(String.fromCharCode(0xfffd))),false);
        console.log(JSON.stringify({rows,tableBounds,detailBounds,errors,blocked,files:['desktop-records.png','desktop-detail.png']}));
    } finally {await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

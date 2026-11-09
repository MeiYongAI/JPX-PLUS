'use strict';
// Isolated browser, synthetic battle DOM, every network request intercepted.
// Timing is diagnostic evidence, never a pass/fail performance threshold.
const fs = require('node:fs'), path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = fs.readFileSync(process.env.JPX_TEST_SOURCE || path.join(__dirname, '../JPX-PLUS.user.js'), 'utf8');
const html = '<!doctype html><meta charset="utf-8"><style>body{font:12px Arial;background:#edebdf}#csp{width:1200px;margin:auto}.btm1{display:block;width:230px;height:85px;border:1px solid #987}.btm2,.btm3{display:flex}.btm6{display:flex}.btm6>img{width:24px;height:24px}#battle_right{float:right;width:250px}#battle_left{width:900px}#quickbar,.bts{display:flex;flex-wrap:wrap}.btqs{position:relative;width:30px;height:32px}.bts>div{width:90px;height:18px}#pane_effects{display:flex}#pane_effects>div{position:relative;width:40px;height:24px}table{border-collapse:collapse}</style><div id="csp"><div id="navbar"></div><div id="battle_main"></div></div>';
function expose() {
    initDoI18n(); cfgBattle = JSON.parse(JSON.stringify(defaultCfgBattle));
    if (typeof ensureJpxStyle === 'function') ensureJpxStyle();
    battleStyle = 'TwoHanded'; battleType = 'General'; roundInfo = {current:1,total:100};
    timeRecords = jpxUtils.createTimeRecords(); combatRecords = jpxUtils.createCombatRecords(); revenueRecords = jpxUtils.createRevenueRecords();
    window.__bench = { reset(visuals = true, rows = 100) {
        const image = '/y/fixture.png';
        const effect = (name, turns) => '<img src="'+image+'" onmouseover="show(\''+name+'\', \'Effect\', '+turns+')">';
        const spells = ['Cure','Regen','Haste','Great Cleave', ...Array.from({length:60},(_,i)=>'Test Spell '+i)];
        const logRows = '<tr><td class="tl">You hit Fixture Monster for 1234 slashing damage.</td></tr><tr><td class="tl">You attack Fixture Monster.</td></tr><tr><td class="tls"></td></tr>' + Array.from({length:rows},(_,i)=>'<tr><td class="tl">Fixture monster '+i+' hits you for 10 crushing damage.</td></tr>').join('');
        document.getElementById('battle_main').innerHTML = '<div id="pane_vitals"><img src="/y/bar_green.png" style="width:400px"><span id="vrhb">10000</span><img src="/y/bar_blue.png" style="width:180px"><span id="vrm">900</span><img src="/y/bar_red.png" style="width:180px"><span id="vrs">700</span></div><img id="ckey_spirit" src="/y/spirit_n.png"><div id="pane_effects">'+['Haste','Regen','Heartseeker','Protection','Spark of Life','Spirit Shield'].map(n=>'<div>'+effect(n,15)+'</div>').join('')+'</div><div id="battle_right">'+Array.from({length:10},(_,i)=>'<div class="btm1" id="mkey_'+((i+1)%10)+'" onclick="void 0"><div class="btm2"><div><img src="'+image+'"></div><div>400</div></div><div class="btm3"><div><div>Fixture Monster '+i+'</div></div></div><div class="btm4"><img src="/y/s/nbargreen.png" style="width:110px"><img src="/y/s/nbarblue.png" style="width:90px"><img src="/y/s/nbarred.png" style="width:90px"></div><div class="btm6">'+['Imperil','Weaken','Slow','Searing Skin'].map(n=>effect(n,10)).join('')+'</div></div>').join('')+'</div><div id="battle_left"><div class="bts">'+spells.map(n=>'<div onclick="void 0" onmouseover="show(\''+n+'\', \'spell\', 10, 0, 4)">'+n+'</div>').join('')+'</div><div id="quickbar"></div><table id="textlog"><tbody>'+logRows+'</tbody></table></div>';
        log = document.getElementById('textlog');
        monsterData = Array.from({length:10},(_,i)=>({id:i+1,maxHP:20000,level:400,name:'Fixture Monster '+i}));
        allMonsterInfo = {}; monstersEffects = {}; isActiveBattle = false;
        for(const key of ['showDurations','showCooldowns','showMonsterInfo','showMonsterIndex','showMonsterHP']) cfgBattle[key]=visuals;
        cfgBattle.quickbarExtend = visuals ? spells.slice(0,12) : [];
        if (!jpxPanelManager.ctrlWidget) jpxPanelManager.createCtrlWidget('battle');
    }, run:preProcessLog, counters:()=>({turn:timeRecords.turn,action:timeRecords.action}), stages:{} };
    for (const name of ['battleRecorder','getActionCooldowns','getVitals','getMonsters','updateMonsterEffects','getEffectDuration','preRender']) {
        const original = eval(name);
        eval(name+' = function(...args) { const start = performance.now(); try { return original(...args); } finally { __bench.stages[name] = (__bench.stages[name] || 0) + performance.now() - start; } }');
    }
}
(async()=>{
    const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome',headless:true});
    try {
        const results=[];
        for(const candidate of [false,true])for(const visuals of [false,true]){
            const context=await browser.newContext({viewport:{width:1440,height:1100}}),page=await context.newPage();
            const errors=[];page.on('pageerror',e=>errors.push(e.message));
            await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:html}):route.fulfill({status:204,body:''}));
            await page.goto('https://hentaiverse.org/');
            let input=source;
            if(candidate){const start=input.indexOf('function getVitals()'),end=input.indexOf('function getSpiritStatus()',start);input=input.slice(0,start)+input.slice(start,end).replaceAll('.innerText','.textContent')+input.slice(end);}
            await page.addScriptTag({content:input.replace('\ninitDo();','\n('+expose.toString()+')();')});
            const session=await context.newCDPSession(page);await session.send('Performance.enable');
            const result=await page.evaluate(async visuals=>{
                const times=[];
                for(let i=0;i<150;i++){
                    __bench.reset(visuals);document.body.offsetHeight;
                    if(i===20)__bench.stages={};
                    const start=performance.now();__bench.run();const duration=performance.now()-start;
                    if(i>=20)times.push(duration);
                    await new Promise(resolve=>setTimeout(resolve,0));
                }
                times.sort((a,b)=>a-b);
                return {median:times[Math.floor(times.length/2)],p95:times[Math.floor(times.length*.95)],mean:times.reduce((a,b)=>a+b,0)/times.length,stages:Object.fromEntries(Object.entries(__bench.stages).map(([k,v])=>[k,v/times.length])),counters:__bench.counters()};
            },visuals);
            const metrics=(await session.send('Performance.getMetrics')).metrics.filter(v=>['LayoutCount','LayoutDuration','RecalcStyleCount','RecalcStyleDuration','ScriptDuration','TaskDuration'].includes(v.name));
            results.push({candidate,visuals,...result,metrics,errors});await context.close();
        }
        console.log(JSON.stringify(results,null,2));
    }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

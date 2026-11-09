'use strict';
// Fresh documents and real initDo(); intercepted responses, no live account.
const { source, mainHTML } = require('./battle-performance.cjs');
function html({ round = 1, floor = 1, rows = 100, marker = true, monsters = true, puzzle = false, finished = false } = {}) {
    const header = '<!doctype html><meta charset="utf-8"><style>body{font:12px Arial}.btm1{width:230px;height:85px}.btm6{display:flex}#quickbar{display:flex}</style><div id="csp"><div id="navbar"></div>';
    if (puzzle) return header + '<div id="riddlemaster"><button id="riddlesubmit">Submit</button></div></div>';
    const log = (marker ? '<tr><td>Initializing The Tower (Floor ' + floor + ') (Round ' + round + ' / 100) ...</td></tr>' : '') +
        (monsters ? Array.from({ length: 10 }, (_, i) => '<tr><td>MID=' + (round * 100 + i) + ' (Fixture Monster ' + i + ') LV=400 HP=' + (20000 + round) + '</td></tr>').join('') : '');
    let main = mainHTML(rows).replace('<tbody>', '<tbody>' + log);
    main = main.replace('<div class="bts">', '<div class="bts"><div onmouseover="set_infopane_spell(\'Great Cleave\', \'Fixture\', \'1001\', 10, 0, 5)" onclick="window.__casts++">Great Cleave</div>');
    return header + '<div id="battle_main">' + main + (finished ? '<div id="btcp"><img src="/y/finishbattle.png"></div>' : '') + '</div></div>';
}
function instrumentation() {
    const metrics = { stages: {}, gets: {}, sets: {}, logReads: 0, processed: 0, databaseReads: 0, requests: 0, longTasks: [] };
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    Storage.prototype.getItem = function(key) { metrics.gets[key] = (metrics.gets[key] || 0) + 1; return get.call(this, key); };
    Storage.prototype.setItem = function(key, value) { metrics.sets[key] = (metrics.sets[key] || 0) + 1; return set.call(this, key, value); };
    window.__attacks = 0; window.__casts = 0;
    window.GM_xmlhttpRequest = () => { metrics.requests++; throw Error('Unexpected live request'); };
    window.HVMonsterDB = { getCurrentMonstersInformation() { metrics.databaseReads++; return {}; } };
    const readLog = getBattleLogHTML; getBattleLogHTML = (...args) => { metrics.logReads++; return readLog(...args); };
    const process = preProcessLog; preProcessLog = (...args) => { metrics.processed++; return process(...args); };
    for (const name of ['initDo', 'loadBattleConfig', 'initDoI18n', 'initJpxModeDetection', 'initJpxLoadoutBindings', 'initDoBattle', 'preDoBattle', 'preRender', 'getActionCooldowns', 'refreshJpxSelectedConfig', 'storeTmp']) {
        const original = eval(name);
        eval(name + ' = function(...args) { const at = performance.now(); try { return original(...args); } finally { const row = metrics.stages[name] ||= {calls:0,ms:0}; row.calls++; row.ms += performance.now()-at; } }');
    }
    new PerformanceObserver(list => metrics.longTasks.push(...list.getEntries().map(item => ({ start: item.startTime, ms: item.duration })))).observe({ type: 'longtask' });
    const clone = value => JSON.parse(JSON.stringify(value));
    window.__reload = {
        metrics: () => clone(metrics),
        snapshot: () => clone({ roundInfo, towerFloor, battleType, battleStyle, timeRecords, combatRecords, revenueRecords, monsterData,
            config: cfgBattle, active: isActiveBattle, ready: readyNext, mode: getBattleMode(), attacks: window.__attacks, casts: window.__casts }),
        defaults: () => clone({ battle: defaultCfgBattle, time: jpxUtils.createTimeRecords(), combat: jpxUtils.createCombatRecords(), revenue: jpxUtils.createRevenueRecords() }),
        seedLibrary(count, rules = 100) {
            const library = getJpxConfigLibrary();
            for (let i=0;i<count;i++) library.save({ schemaVersion:1, kind:'battle-mode', title:'Saved '+i, world:jpxConfigWorld(), mode:'TwoHanded_General',
                config:{battleVersion:defaultCfgBattle.battleVersion,TwoHanded_General:{supports:Array.from({length:rules},(_,j)=>({type:'stop',customMessage:'Saved '+i+' rule '+j,disabled:true,conditions:[]})),attacks:[{type:'normalAttack'}]}} });
        },
        setRecords() { timeRecords.action=40;timeRecords.turn=38;timeRecords.lastUse.Cure=37;combatRecords.use.Attack=25;revenueRecords.credit=1234; },
        applySelection() {
            const mode='1H_Mage_Tower', config={battleVersion:defaultCfgBattle.battleVersion,[mode]:{supports:[{type:'stop',customMessage:'Selected tower rules',conditions:[]}],attacks:[]}};
            const entry=getJpxConfigLibrary().save({schemaVersion:1,kind:'battle-mode',title:'Selected tower',world:jpxConfigWorld(),mode,config});
            commitJpxConfigEntry(entry,jpxConfigWorld());return mode;
        },
        toggle: toggleActive, goNext, persist: storeTmp, open: renderSettings, reinit: preDoBattle,
        options: values=>Object.assign(cfgBattle,values),
        stats: () => clone({ spellCooldowns, itemCooldowns, monsters:monstersObj?.monsters.map(item=>({name:item.name,hp:item.hpPercentage})), playerEffectsObj }),
        append() { const row=log.insertRow(0);row.insertCell().textContent='You attack Fixture Monster 0.'; },
        endRound(url, auto = true) {
            const panel=document.createElement('div');panel.id='btcp';panel.onclick=()=>{window.__nextClicks=(window.__nextClicks||0)+1;if(url)location.href=url;};
            document.getElementById('battle_main').append(panel);cfgBattle.advanceToNextRound=auto;cfgBattle.ajaxRound=false;
            monstersObj={monsters:[],activeMonsters:[]};isActiveBattle=true;goNext();
        }
    };
}
async function fixture(browser, t, { source: input = source, isekai = false, pageOptions = {}, storage = {}, transform = value => value } = {}) {
    const context = await browser.newContext({ viewport:{width:1440,height:1100}, reducedMotion:'reduce' });
    if (t) t.after(()=>context.close());
    const page = await context.newPage(), errors=[], requests=[];
    page.setDefaultTimeout(8000);page.on('pageerror',error=>errors.push(error.message));
    let next = pageOptions;
    await context.route('**/*', route => {
        if (route.request().isNavigationRequest()) return route.fulfill({contentType:'text/html',body:transform(html(next), next)});
        requests.push(route.request().url());return route.fulfill({status:204,body:''});
    });
    const base='https://hentaiverse.org/'+(isekai?'isekai/':'');
    await page.goto(base);
    await page.evaluate(values=>{for(const [key,value] of Object.entries(values))localStorage.setItem(key,value);},storage);
    const harness=input.replace('\ninitDo();','\n('+instrumentation.toString()+')();\ninitDo();');
    async function inject() { await page.addScriptTag({content:harness}); await page.waitForTimeout(30); }
    await inject();
    return {page,context,errors,requests,base,
        async navigate(options={},viaButton=false) {next=options;const url=base+'?fixtureRound='+(options.round||1)+'&floor='+(options.floor||1);
            if(viaButton) {await Promise.all([page.waitForURL(url),page.evaluate(url=>__reload.endRound(url),url)]);} else await page.goto(url);
            await inject();
        }
    };
}
module.exports={fixture,source,html};

'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { fixture } = require('./fixtures/battle-reload.cjs');
const { configArchive } = require('./fixtures/config-archive.cjs');
let browser;
before(async()=>{browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});});
after(async()=>browser?.close());
const snapshot=page=>page.evaluate(()=>__reload.snapshot());
async function setup(t,options) {const f=await fixture(browser,t,options);t.after(()=>assert.deepEqual(f.errors,[]));return f;}

for(const isekai of [false,true]) test('native round navigation preserves records and replaces monsters, Isekai '+isekai,async t=>{
    const f=await setup(t,{isekai});
    await f.page.evaluate(()=>__reload.setRecords());
    const before=await snapshot(f.page);
    await f.navigate({round:2,floor:7},true);
    const after=await snapshot(f.page);
    assert.equal(after.roundInfo.current,2);assert.equal(Number(after.towerFloor),7);
    assert.equal(after.battleType,'Tower');assert.equal(after.battleStyle,'TwoHanded');
    assert.deepEqual(after.timeRecords,before.timeRecords);
    assert.deepEqual(after.combatRecords,before.combatRecords);assert.deepEqual(after.revenueRecords,before.revenueRecords);
    assert.equal(after.monsterData.length,10);assert.ok(after.monsterData.every(item=>item.id>=200 && item.id<210));
    assert.equal(after.active,false);assert.equal(after.attacks,0);
    assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_difficulty'+(location.pathname.includes('isekai')?'_isekai':''))),'Hard');
});

test('manual reload in the same round retains counters without recounting the old log',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>{__reload.setRecords();__reload.persist();});const before=await snapshot(f.page);
    await f.navigate({marker:false,monsters:false});const after=await snapshot(f.page);
    assert.deepEqual(after.roundInfo,before.roundInfo);assert.deepEqual(after.monsterData,before.monsterData);
    assert.deepEqual(after.timeRecords,before.timeRecords);assert.equal(after.active,false);
    assert.equal((await f.page.evaluate(()=>__reload.metrics())).processed,0);
});

test('non-AJAX auto-next submits the native transition only once while navigation is pending',async t=>{
    const f=await setup(t);
    const clicks=await f.page.evaluate(()=>{__reload.endRound(null);__reload.goNext();__reload.goNext();return window.__nextClicks;});
    assert.equal(clicks,1);
});

test('full-page startup avoids repeated log serialization and cooldown scans',async t=>{
    const f=await setup(t,{pageOptions:{rows:2000}});const metrics=await f.page.evaluate(()=>__reload.metrics());
    t.diagnostic(JSON.stringify(metrics));
    assert.ok(metrics.logReads<=2,'startup log reads: '+metrics.logReads);
    assert.equal(metrics.stages.getActionCooldowns.calls,1);
});

test('round startup profile with a larger local archive remains functionally paused',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>__reload.seedLibrary(40,100));
    await f.navigate({round:2});const state=await snapshot(f.page);const metrics=await f.page.evaluate(()=>__reload.metrics());
    t.diagnostic(JSON.stringify(metrics));assert.equal(state.active,false);assert.equal(state.attacks,0);
    assert.equal(metrics.requests,0);assert.ok(f.requests.every(url=>!url.includes('s=Character')));
});

test('same-document reinitialization does not duplicate parsed monster rows',async t=>{
    const f=await setup(t);const before=await snapshot(f.page);
    await f.page.evaluate(()=>{__reload.reinit();__reload.reinit();});const after=await snapshot(f.page);
    assert.deepEqual(after.monsterData,before.monsterData);assert.equal(after.monsterData.length,10);
});

test('a new round without monster log rows never reuses previous-round monster IDs',async t=>{
    const f=await setup(t);await f.navigate({round:2,monsters:false},true);
    const after=await snapshot(f.page);assert.equal(after.monsterData.length,10);
    assert.ok(after.monsterData.every(item=>item.id===0),'must use unknown-HP fallback instead of old monsters');
});

test('repeated full-page rounds retain records once and use one active log observer',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>__reload.setRecords());
    for(let round=2;round<=5;round++) {
        await f.navigate({round,floor:round+5},true);
        const before=await snapshot(f.page);assert.equal(before.monsterData.length,10);assert.equal(before.active,false);
        const count=await f.page.evaluate(()=>__reload.metrics().processed);
        await f.page.evaluate(()=>__reload.append());
        await f.page.waitForFunction(value=>__reload.metrics().processed>value,count);
        await f.page.waitForTimeout(250);
        assert.equal(await f.page.evaluate(()=>__reload.metrics().processed),count+1);
        const after=await snapshot(f.page);assert.equal(after.timeRecords.action,before.timeRecords.action+1);
    }
    assert.equal((await snapshot(f.page)).timeRecords.action,44);
});

test('manual-next mode and paused combat do not invoke native navigation',async t=>{
    const f=await setup(t);
    await f.page.evaluate(()=>{__reload.endRound(null,false);__reload.goNext();});
    assert.equal(await f.page.evaluate(()=>window.__nextClicks||0),0);
    await f.page.evaluate(()=>{__reload.toggle();__reload.goNext();});
    assert.equal(await f.page.evaluate(()=>window.__nextClicks||0),0);
});

test('riddle page and return navigation preserve solve counts without enabling combat',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>__reload.setRecords());
    await f.navigate({round:2,puzzle:true},true);
    assert.equal((await snapshot(f.page)).active,false);
    await f.page.locator('#riddlesubmit').click();
    await f.navigate({round:2,floor:7});
    const state=await snapshot(f.page);assert.equal(state.timeRecords.riddle.solved,1);
    assert.equal(state.timeRecords.action,40);assert.equal(state.active,false);assert.equal(state.attacks,0);
});

test('restored cooldowns are calculated only after previous-round counters load',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>__reload.setRecords());
    await f.navigate({round:2},true);
    const state=await f.page.evaluate(()=>__reload.stats());assert.equal(state.spellCooldowns.Cure,4);
    const cache=await f.page.evaluate(()=>JSON.parse(localStorage.getItem('jpx_detectedWeaponFamily_v1')));
    assert.equal(cache.family,'TwoHanded');
});

test('leaving while a throttled log update is pending persists the final action exactly once',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>__reload.setRecords());
    await f.page.evaluate(async()=>{
        __reload.append();await Promise.resolve();
        __reload.append();await Promise.resolve();
        __reload.persist();__reload.persist();
    });
    const stored=await f.page.evaluate(()=>JSON.parse(localStorage.getItem('jpx_timeRecords')));
    assert.equal(stored.action,42);
    await f.page.waitForTimeout(260);
    assert.equal((await snapshot(f.page)).timeRecords.action,42);
    await f.navigate({round:2},true);
    assert.equal((await snapshot(f.page)).timeRecords.action,42);
});

test('leaving before the log observer callback runs persists that action once',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>{__reload.setRecords();__reload.append();__reload.persist();__reload.persist();});
    const stored=await f.page.evaluate(()=>JSON.parse(localStorage.getItem('jpx_timeRecords')));
    assert.equal(stored.action,41);
    await f.page.waitForTimeout(260);
    assert.equal((await snapshot(f.page)).timeRecords.action,41);
});

test('explicitly applied rules remain selected after full-page round and floor navigation',async t=>{
    const f=await setup(t);const selected=await f.page.evaluate(()=>__reload.applySelection());
    await f.navigate({round:2,floor:14},true);
    const state=await snapshot(f.page);assert.equal(state.mode,selected);assert.equal(state.active,false);
    assert.equal(state.config[selected].supports[0].customMessage,'Selected tower rules');
    assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_difficulty')),'Nightmare');
});

test('fresh pages reload persisted user options without inheriting active combat',async t=>{
    const f=await setup(t);
    await f.page.evaluate(()=>{const config=__reload.snapshot().config;config.ctrlWidgetMouseEnter=true;config.showMonsterHP=true;config.recordBattleLog=true;localStorage.setItem('jpx_cfgBattle',JSON.stringify(config));});
    await f.navigate({round:2},true);
    const state=await snapshot(f.page);assert.equal(state.config.ctrlWidgetMouseEnter,true);assert.equal(state.config.recordBattleLog,true);
    assert.equal(state.active,false);assert.equal(state.attacks,0);
    assert.equal(await f.page.locator('.monster-hp').count(),10);
});

test('pre-navigation flush only persists statistics and never schedules an attack',async t=>{
    const f=await setup(t);await f.page.evaluate(()=>{__reload.setRecords();__reload.append();__reload.persist();});
    const state=await snapshot(f.page);assert.equal(state.active,false);assert.equal(state.attacks,0);assert.equal(state.casts,0);
    await f.page.waitForTimeout(260);assert.equal((await snapshot(f.page)).attacks,0);
});

test('final-result page does not invoke next-round navigation while auto-next is enabled',async t=>{
    const f=await setup(t,{pageOptions:{finished:true}});
    const clicks=await f.page.evaluate(()=>{document.querySelector('#btcp').remove();__reload.endRound(null,false);document.querySelector('#btcp').innerHTML='<img src="/y/finishbattle.png">';__reload.options({advanceToNextRound:true});__reload.goNext();return window.__nextClicks||0;});
    assert.equal(clicks,0);assert.equal((await snapshot(f.page)).attacks,0);
});

for(const isekai of [false,true]) test('large selected archive survives reload and stays outside repeated turn reads, Isekai '+isekai,async t=>{
    const data=configArchive({world:isekai?'Isekai':'Persistent'}),f=await setup(t,{isekai,storage:data.storage});
    assert.equal((await snapshot(f.page)).mode,data.mode);
    const before=await f.page.evaluate(()=>__reload.metrics());
    await f.page.evaluate(()=>{for(let i=0;i<20;i++){__reload.stats();__reload.snapshot();}__reload.reinit();});
    await f.page.evaluate(()=>__reload.append());
    await f.page.waitForFunction(()=>__reload.metrics().processed>0);
    const after=await f.page.evaluate(()=>__reload.metrics());
    assert.equal(after.gets.jpx_configLibrary_v1,before.gets.jpx_configLibrary_v1);
    assert.equal(after.stages.refreshJpxSelectedConfig.calls,1);
    await f.navigate({round:2,floor:10},true);
    const state=await snapshot(f.page);assert.equal(state.mode,data.mode);assert.equal(state.active,false);
    assert.equal(state.attacks,0);assert.equal(state.casts,0);
    assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_configLibrary_v1')),data.raw);
});

test('replacing native rules invalidates selection without trusting the saved library snapshot',async t=>{
    const data=configArchive(),f=await setup(t,{isekai:true,storage:data.storage});
    assert.equal((await snapshot(f.page)).mode,data.mode);
    await f.page.evaluate(mode=>__reload.options({[mode]:{supports:[{type:'stop',customMessage:'changed',conditions:[]}],attacks:[]}}),data.mode);
    assert.equal((await snapshot(f.page)).mode,'TwoHanded_General');
    assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_configLibrary_v1')),data.raw);
});

test('corrupt unrelated saved rules cannot activate a selected mode on fresh battle startup',async t=>{
    const data=configArchive(),state=JSON.parse(data.raw);state.entries.at(-1).envelope.config[data.mode].supports='broken';
    const raw=JSON.stringify(state),f=await setup(t,{isekai:true,storage:{...data.storage,jpx_configLibrary_v1:raw}});
    const current=await snapshot(f.page);assert.equal(current.mode,'TwoHanded_General');assert.equal(current.active,false);
    assert.equal(current.attacks,0);assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_configLibrary_v1')),raw);
});

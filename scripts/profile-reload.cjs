'use strict';
// Real fresh-document navigation with synthetic responses. Timings cover the
// synchronous userscript initialization, not network, parsing or live-game TPS.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture,source}=require('../tests/fixtures/battle-reload.cjs');
const baseline=process.env.JPX_PERF_BASELINE?fs.readFileSync(process.env.JPX_PERF_BASELINE,'utf8'):null;
const repeats=Number(process.env.JPX_RELOAD_REPEATS||3),rounds=Number(process.env.JPX_RELOAD_ROUNDS||5);
const scenarios=[{name:'ordinary-round',rows:100,saved:0},{name:'long-log',rows:2000,saved:0},{name:'40-saved-configs',rows:100,saved:40}];
(async()=>{
    const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});const results=[];
    try{
        for(let repeat=0;repeat<repeats;repeat++) for(const scenario of scenarios){
            const variants=baseline?(repeat%2?[['current',source],['baseline',baseline]]:[['baseline',baseline],['current',source]]):[['current',source]];
            for(const [variant,input]of variants){
                const f=await fixture(browser,null,{source:input,pageOptions:{rows:scenario.rows}});
                try{
                    await f.page.evaluate(count=>{__reload.setRecords();if(count)__reload.seedLibrary(count,100);},scenario.saved);
                    const initial=await f.page.evaluate(()=>__reload.snapshot());
                    for(let round=2;round<=rounds+1;round++){
                        await f.navigate({round,floor:round+5,rows:scenario.rows},true);
                        const state=await f.page.evaluate(()=>__reload.snapshot());
                        const metrics=await f.page.evaluate(()=>__reload.metrics());
                        assert.deepEqual(state.timeRecords,initial.timeRecords);assert.deepEqual(state.combatRecords,initial.combatRecords);assert.deepEqual(state.revenueRecords,initial.revenueRecords);
                        assert.equal(state.roundInfo.current,round);assert.equal(Number(state.towerFloor),round+5);
                        assert.equal(state.active,false);assert.equal(state.attacks,0);assert.equal(state.monsterData.length,10);assert.equal(state.battleStyle,'TwoHanded');
                        assert.ok(state.monsterData.every(item=>item.id>=round*100&&item.id<round*100+10));
                        assert.equal(metrics.requests,0);assert.deepEqual(f.errors,[]);
                        results.push({repeat,variant,scenario:scenario.name,round,metrics,recordsPreserved:true,paused:true});
                    }
                    console.log(JSON.stringify({repeat,variant,scenario:scenario.name,initMs:results.slice(-rounds).map(row=>row.metrics.stages.initDo.ms)}));
                }finally{await f.context.close();}
            }
        }
        const report={scope:'isolated desktop Chrome, synthetic battle responses, real native document navigation and production initDo; no live account, network latency or script parsing measured',repeats,rounds,
            currentSha256:createHash('sha256').update(source).digest('hex'),baselineSha256:baseline&&createHash('sha256').update(baseline).digest('hex'),results};
        const output=path.resolve(process.env.JPX_RELOAD_OUTPUT||'.test-output/reload-profile.json');
        fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log('Report: '+output);
    }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

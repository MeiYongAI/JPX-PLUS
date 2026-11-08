'use strict';
// Full production initialization in isolated Chrome with intercepted synthetic
// responses. No live account, real server latency, or userscript parsing measured.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {fixture,source}=require('../tests/fixtures/battle-reload.cjs');
const {configArchive}=require('../tests/fixtures/config-archive.cjs');
const baseline=process.env.JPX_PERF_BASELINE?fs.readFileSync(process.env.JPX_PERF_BASELINE,'utf8'):null;
const repeats=Number(process.env.JPX_CONFIG_READ_REPEATS||3),rounds=Number(process.env.JPX_CONFIG_READ_ROUNDS||5);
const scenarios=[{name:'992KiB-simple-no-selection',complex:false,active:false},{name:'992KiB-simple-selected',complex:false},
 {name:'992KiB-conditions-no-selection',active:false},{name:'992KiB-conditions-selected'},
 {name:'2MiB-conditions-bindings',count:80,size:2*1024*1024,bindings:2000}];
const median=values=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
(async()=>{
 const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});
 const results=[],equivalent=new Map();
 try{
  for(let repeat=0;repeat<repeats;repeat++)for(const scenario of scenarios){
   const data=configArchive(scenario);
   const variants=baseline?(repeat%2?[['current',source],['baseline',baseline]]:[['baseline',baseline],['current',source]]):[['current',source]];
   for(const [variant,input] of variants){
    const f=await fixture(browser,null,{source:input,isekai:true,storage:data.storage});
    try{
     for(let round=1;round<=rounds;round++){
      if(round>1)await f.navigate({round,floor:round+5},true);
      const state=await f.page.evaluate(()=>__reload.snapshot()),metrics=await f.page.evaluate(()=>__reload.metrics());
      assert.equal(state.active,false);assert.equal(state.attacks,0);assert.equal(state.casts,0);
      assert.equal(state.mode,scenario.active===false?'TwoHanded_General':data.mode);
      assert.equal(metrics.stages.refreshJpxSelectedConfig.calls,1);assert.equal(metrics.gets.jpx_configLibrary_v1,1);
      assert.equal(await f.page.evaluate(()=>localStorage.getItem('jpx_configLibrary_v1')),data.raw,'startup must not rewrite the archive');
      assert.equal(metrics.requests,0);assert.deepEqual(f.errors,[]);
      const key=scenario.name+':'+round;if(equivalent.has(key))assert.deepEqual(state,equivalent.get(key));else equivalent.set(key,state);
      results.push({scenario:scenario.name,repeat,variant,round,chars:data.raw.length,padding:data.padding,metrics});
     }
     console.log(JSON.stringify({repeat,variant,scenario:scenario.name,selectionMs:results.slice(-rounds).map(row=>row.metrics.stages.refreshJpxSelectedConfig.ms)}));
    }finally{await f.context.close();}
   }
  }
  const summary=scenarios.map(s=>({scenario:s.name,...Object.fromEntries((baseline?['baseline','current']:['current']).map(variant=>{
   const rows=results.filter(row=>row.scenario===s.name&&row.variant===variant);
   return[variant,{samples:rows.length,selectionMedianMs:median(rows.map(row=>row.metrics.stages.refreshJpxSelectedConfig.ms)),initMedianMs:median(rows.map(row=>row.metrics.stages.initDo.ms))}];
  }))}));
  const report={scope:'isolated Chrome, synthetic archives and battle DOM, real initDo and native round navigation; no live account or network/TPS claim',
   repeats,rounds,outputEquivalent:true,currentSha256:createHash('sha256').update(source).digest('hex'),baselineSha256:baseline&&createHash('sha256').update(baseline).digest('hex'),summary,results};
  const output=path.resolve(process.env.JPX_CONFIG_READ_OUTPUT||'.test-output/config-read-profile.json');
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2));console.log(JSON.stringify(summary,null,2));console.log('Report: '+output);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});

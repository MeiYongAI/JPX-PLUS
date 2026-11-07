'use strict';
// Actual record calculation, IndexedDB transaction and native click bubbling;
// offline profiles only, no live battle or real navigation.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(process.env.JPX_TEST_SOURCE||path.join(root,'JPX-PLUS.user.js'),'utf8');
function expose(){
 initDoI18n();loadBattleConfig();ensureJpxStyle();
 let release,stores=0,commits=0,fail=false;
 const realStore=storeBattleRecords;
 storeBattleRecords=async record=>{stores++;await new Promise(resolve=>{release=resolve;});if(fail)throw new Error('fixture write failure');const result=await realStore(record);commits++;return result;};
 jpxMarket.getMarketPrice=async()=>({'Energy Drink':1000});
 const warnings=[];jpxUtils.createToast=message=>warnings.push(message);
 window.__finish={
  open:renderSettings,theme:toggleJpxTheme,config:()=>JSON.parse(JSON.stringify(cfgBattle)),
  prepare({enabled=false,result='Victory',final=true,type='Item',handler='parent'}={}){
   cfgBattle.autoFinishBattle=enabled;cfgStats=JSON.parse(JSON.stringify(defaultCfgStats));
   log=document.createElement('table');log.id='textlog';
   const messages={Victory:'You are Victorious!',Defeat:'You have been defeated.',Flee:'You have escaped from the battle.'};
   log.innerHTML='<tbody><tr><td>'+messages[result]+'</td></tr></tbody>';document.querySelector('#csp').append(log);
   battleType=type;roundInfo={current:2,total:2};timeRecords={...jpxUtils.createTimeRecords(),startTime:Date.now()-60000,action:20};
   combatRecords=jpxUtils.createCombatRecords();revenueRecords=jpxUtils.createRevenueRecords();revenueRecords.credit=123;
   monstersObj={activeMonsters:[]};
   for(const key of ['battleLogRecord','timeRecords','combatRecords','revenueRecords'])localStorage.setItem(prefix+key+isekaiSuffix,'{"kept":true}');
   const panel=document.createElement('div');panel.id='btcp';
   panel.innerHTML=final?'<button><img src="/y/battle/finishbattle.png"></button>':'<button>Next round</button>';
   document.querySelector('#csp').append(panel);window.__clicks=0;window.__commitOnClick=0;
   const target=handler==='image'?panel.querySelector('img'):handler==='button'?panel.querySelector('button'):panel;
   target.onclick=()=>{window.__clicks++;window.__commitOnClick=commits;};
  },
  start(){preProcessLog();return recordFinalBattle.pending;},
  loadFinal(){jpxPanelManager.createCtrlWidget=()=>{};preDoBattle();return recordFinalBattle.pending;},
  again(){preProcessLog();goNext();return recordFinalBattle();},
  record:recordFinalBattle,database:exportIndexedDB,
  release(){release();},fail(){fail=true;},enable(value){cfgBattle.autoFinishBattle=value;},
  round(autoNext){cfgBattle.advanceToNextRound=autoNext;cfgBattle.ajaxRound=false;isActiveBattle=true;jpxPanelManager.setBackground=()=>{};goNext();},
  state:()=>({stores,commits,clicks:window.__clicks,commitOnClick:window.__commitOnClick,warnings,
   pendingKeys:['battleLogRecord','timeRecords','combatRecords','revenueRecords'].filter(key=>localStorage.getItem(prefix+key+isekaiSuffix)),
   panels:document.querySelectorAll('#jpx-final-combat,#jpx-final-revenue').length})
 };
}
let browser;
before(async()=>{browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});});
after(async()=>browser?.close());
async function fixture(t,{isekai=false,language='',width=1440,dark=false}={}){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',isMobile:width<600,hasTouch:width<600});t.after(()=>context.close());
 const page=await context.newPage(),errors=[];page.setDefaultTimeout(8000);page.on('pageerror',error=>errors.push(error.message));
 await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="csp"><div id="navbar"></div></div>'}):route.abort());
 await page.goto('https://hentaiverse.org/'+(isekai?'isekai/':''));
 if(language)await page.addScriptTag({content:fs.readFileSync(path.join(root,'JPX-PLUS-'+language+'.user.js'),'utf8')});
 await page.addScriptTag({content:source.replace('\ninitDo();','\n('+expose.toString()+')();')});
 if(dark)await page.evaluate(()=>__finish.theme());
 return {page,errors};
}
async function begin(page,options){await page.evaluate(options=>{__finish.prepare(options);void __finish.start();},options);await page.waitForFunction(()=>__finish.state().stores===1);}
async function complete(page){return page.evaluate(()=>{__finish.release();return __finish.record();});}
for(const isekai of [false,true])for(const result of ['Victory','Defeat','Flee'])test('auto finish saves then exits once: '+(isekai?'Isekai ':'Persistent ')+result,async t=>{
 const {page,errors}=await fixture(t,{isekai});await begin(page,{enabled:true,result});
 assert.deepEqual(await page.evaluate(()=>__finish.state()),{stores:1,commits:0,clicks:0,commitOnClick:0,warnings:[],pendingKeys:['battleLogRecord','timeRecords','combatRecords','revenueRecords'],panels:0});
 await page.evaluate(()=>{void __finish.again();void __finish.again();});
 assert.equal(await complete(page),true);await page.evaluate(()=>__finish.again());
 const state=await page.evaluate(()=>__finish.state());assert.equal(state.clicks,1);assert.equal(state.commitOnClick,1);assert.equal(state.stores,1);assert.equal(state.panels,0);assert.deepEqual(state.pendingKeys,[]);
 const data=await page.evaluate(()=>__finish.database());assert.equal(data.stores.battleRecords.length,1);assert.equal(data.stores.battleRecords[0].result,result);assert.equal(data.stores.battleRecords[0].world,isekai?'Isekai':'Persistent');assert.equal(data.stores.battleRecords[0].revenueRecords.credit,123);assert.deepEqual(errors,[]);
});
test('default off and legacy configs retain results',async t=>{
 const {page,errors}=await fixture(t);assert.equal(await page.evaluate(()=>__finish.config().autoFinishBattle),false);
 await begin(page,{});assert.equal((await page.evaluate(()=>__finish.state())).panels,2);await complete(page);assert.equal((await page.evaluate(()=>__finish.state())).clicks,0);assert.deepEqual(errors,[]);
});
test('a final page loaded by navigation also saves and exits',async t=>{
 const {page,errors}=await fixture(t);await page.evaluate(()=>{__finish.prepare({enabled:true});void __finish.loadFinal();});
 await page.waitForFunction(()=>__finish.state().stores===1);await complete(page);assert.equal((await page.evaluate(()=>__finish.state())).clicks,1);assert.deepEqual(errors,[]);
});
test('failed statistics stay on page with visible results and retained temporary records',async t=>{
 const {page,errors}=await fixture(t);await begin(page,{enabled:true});await page.evaluate(()=>__finish.fail());assert.equal(await complete(page),false);
 const state=await page.evaluate(()=>__finish.state());assert.equal(state.clicks,0);assert.equal(state.panels,2);assert.equal(state.pendingKeys.length,4);assert.equal(state.warnings.length,1);assert.equal(state.commits,0);assert.deepEqual(errors,[]);
});
test('turning auto finish off while saving keeps the result',async t=>{
 const {page,errors}=await fixture(t);await begin(page,{enabled:true});await page.evaluate(()=>__finish.enable(false));await complete(page);
 const state=await page.evaluate(()=>__finish.state());assert.equal(state.clicks,0);assert.equal(state.panels,2);assert.deepEqual(errors,[]);
});
for(const handler of ['image','button'])test('native finish handler on '+handler+' remains in control',async t=>{
 const {page,errors}=await fixture(t);await begin(page,{enabled:true,handler});await complete(page);assert.equal((await page.evaluate(()=>__finish.state())).clicks,1);assert.deepEqual(errors,[]);
});
for(const obstacle of ['removed','puzzle'])test('no finish click after '+obstacle,async t=>{
 const {page,errors}=await fixture(t);await begin(page,{enabled:true});await page.evaluate(obstacle=>{if(obstacle==='removed')document.querySelector('#btcp').remove();else{const panel=document.createElement('div');panel.id='riddlemaster';document.body.append(panel);}},obstacle);await complete(page);assert.equal((await page.evaluate(()=>__finish.state())).clicks,0);assert.deepEqual(errors,[]);
});
test('auto finish does not enable next round',async t=>{
 const {page,errors}=await fixture(t);await page.evaluate(()=>{__finish.prepare({enabled:true,final:false});__finish.round(false);});assert.equal((await page.evaluate(()=>__finish.state())).clicks,0);
 await page.evaluate(()=>__finish.round(true));assert.equal((await page.evaluate(()=>__finish.state())).clicks,1);assert.equal((await page.evaluate(()=>__finish.state())).stores,0);assert.deepEqual(errors,[]);
});
for(const [language,label,width,dark]of [['','Auto finish battle',1440,false],['ZhTrans','自动结束战斗',320,true],['ZhTW','自動結束戰鬥',768,false],['ZhHK','自動結束戰鬥',1024,true],['Ja','戦闘後に自動で戻る',320,false],['Ko','전투 종료 후 자동으로 나가기',320,true]])test('general battle control saves and exports: '+(language||'English'),async t=>{
 const {page,errors}=await fixture(t,{language,width,dark});await page.evaluate(()=>__finish.open());
 assert.equal(await page.getByRole('checkbox',{name:label,exact:true}).isChecked(),false);
 const control=page.locator('[data-field-key="autoFinishBattle"] input[type="checkbox"]');
 const fields=await page.locator('[data-field-key="battleControls"] [data-field-key]').evaluateAll(nodes=>nodes.map(node=>node.dataset.fieldKey));assert.equal(fields.indexOf('autoFinishBattle'),fields.indexOf('advanceToNextRound')+1);
 await control.focus();await page.keyboard.press('Space');assert.equal(await control.isChecked(),true);await page.locator('#save-button').click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('jpx_cfgBattle')).autoFinishBattle),true);
 const bounds=await control.locator('..').evaluate(el=>{const r=el.getBoundingClientRect();return{left:r.left,right:r.right,viewport:innerWidth};});assert.ok(bounds.left>=0&&bounds.right<=bounds.viewport);
 await page.locator('#export-button').click();await page.locator('[data-export-scope=all]').click();const downloading=page.waitForEvent('download');await page.locator('.jpx-export-submit').click();const download=await downloading;
 assert.equal(JSON.parse(fs.readFileSync(await download.path(),'utf8')).autoFinishBattle,true);assert.deepEqual(errors,[]);
 if(language==='ZhTrans'){fs.mkdirSync(path.join(root,'.test-output/auto-finish'),{recursive:true});await page.locator('#settings-container').screenshot({path:path.join(root,'.test-output/auto-finish/mobile-settings.png')});}
});

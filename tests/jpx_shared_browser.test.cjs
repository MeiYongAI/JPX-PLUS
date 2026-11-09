'use strict';
// Actual script on isolated main/alt origins; GM is a test transport, no account.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const source=fs.readFileSync(path.join(__dirname,'../JPX-PLUS.user.js'),'utf8');
let browser;
before(async()=>{browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});});
after(async()=>browser?.close());
function expose(){
 initDoI18n();loadBattleConfig();ensureJpxStyle();jpxMarket.getMarketPrice=async()=>({'Energy Drink':1000});
 let recordReads=0;const originalRead=getBattleRecordsRender;getBattleRecordsRender=(...args)=>{recordReads++;return originalRead(...args);};
 window.__share={enabled:jpxShared.enabled,get:key=>localStorage.getItem(key),set:(key,value)=>localStorage.setItem(key,value),
 cfg:()=>JSON.parse(JSON.stringify(cfgBattle)),active:()=>isActiveBattle,activate:()=>{log=document.createElement('table');log.id='textlog';document.getElementById('csp').append(log);isActiveBattle=true;},migrate:ensureJpxSharedRecords,
 export:exportIndexedDB,import:importIndexedDB,store:storeBattleRecords,preview:previewJpxRecordsCleanup,remove:deleteJpxRecordsCleanup,
 usage:world=>jpxShared.usage(world),open:()=>renderStatsDataActions(document.body),backups:()=>jpxShared.backups(),render:()=>renderBattleRecordsPage(window),
 settings:()=>{loadStatsSettingsConfig();renderSettings();},theme:toggleJpxTheme,
 recordReads:()=>recordReads,
 seedLibrary:seedJpxConfigLibrary,renameLibrary(){const library=getJpxConfigLibrary(),entry=library.readState().entries[0];library.rename(entry.id,'Renamed',entry.revision);},
 async finish(timestamp){
 cfgStats=JSON.parse(JSON.stringify(defaultCfgStats));log=document.createElement('table');log.id='textlog';log.innerHTML='<tbody><tr><td>You are Victorious!</td></tr></tbody>';
 document.getElementById('csp').append(log);const panel=document.createElement('div');panel.id='btcp';panel.innerHTML='<img src="/finishbattle.png">';document.getElementById('csp').append(panel);
 battleType='Item';roundInfo={current:100,total:100};timeRecords={...jpxUtils.createTimeRecords(),startTime:timestamp,action:100};combatRecords=jpxUtils.createCombatRecords();revenueRecords=jpxUtils.createRevenueRecords();revenueRecords.credit=123;
 monstersObj={activeMonsters:[]};preProcessLog();await recordFinalBattle.pending;return (await exportIndexedDB()).stores.battleRecords;
 }};
}
async function fixture(t){
 const context=await browser.newContext();const store=new Map(),pages=[],errors=[];let jobs=Promise.resolve();
 t.after(async()=>{await flush();await context.close();await jobs.catch(error=>{if(!String(error).includes('closed'))throw error;});});
 await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><div id="csp"><div id="navbar"></div></div>'}):route.fulfill({status:204,body:''}));
 await context.exposeBinding('__gmSend',({page},change)=>{const old=store.get(change.key);if(change.remove)store.delete(change.key);else store.set(change.key,change.value);
 jobs=jobs.then(async()=>{for(const other of pages)if(other!==page&&!other.isClosed())await other.evaluate(({change,old})=>{if(change.remove)window.__gmValues.delete(change.key);else window.__gmValues.set(change.key,change.value);for(const callback of window.__gmListeners.get(change.key)||[])callback(change.key,old,change.value,true);},{change,old});});});
 async function page(host,seed={},legacy=[],runStartup=false){
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto('https://'+host+'/');pages.push(p);
 await p.evaluate(async({values,seed,legacy})=>{for(const [key,value]of Object.entries(seed))localStorage.setItem(key,value);window.__gmValues=new Map(values);window.__gmListeners=new Map();
 window.GM_getValue=(key,fallback)=>window.__gmValues.has(key)?structuredClone(window.__gmValues.get(key)):fallback;
 window.GM_setValue=(key,value)=>{window.__gmValues.set(key,structuredClone(value));void window.__gmSend({key,value});};window.GM_deleteValue=key=>{window.__gmValues.delete(key);void window.__gmSend({key,remove:true});};
 window.GM_listValues=()=>[...window.__gmValues.keys()];window.GM_addValueChangeListener=(key,callback)=>{const list=window.__gmListeners.get(key)||[];list.push(callback);window.__gmListeners.set(key,list);};
 await new Promise((resolve,reject)=>{const req=indexedDB.open('jpx',1);req.onupgradeneeded=()=>req.result.createObjectStore('battleRecords',{keyPath:'timestamp'}).createIndex('date','date');req.onsuccess=()=>{const db=req.result,tx=db.transaction('battleRecords','readwrite');for(const row of legacy)tx.objectStore('battleRecords').put(row);tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};req.onerror=()=>reject(req.error);});},{values:[...store],seed,legacy});
 const nl=String.fromCharCode(10);await p.addScriptTag({content:source.replace(nl+'initDo();',nl+'('+expose.toString()+')();'+(runStartup?'initDo();':''))});return p;
 }
 async function flush(){for(let i=0;i<4;i++){await jobs;await new Promise(resolve=>setTimeout(resolve,20));}}
 return {page,flush,store,errors};
}
const rec=(timestamp='2026-11-08 10:00:00',world='Persistent')=>({world,timestamp,date:timestamp.slice(0,10),battleType:'Item',roundInfo:{current:1,total:1},combatRecords:{},revenueRecords:{totalProfit:100,finalProfit:100,staminaCost:0}});
test('actual script shares configs, pauses active other-host battle and preserves native backups',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,dailyStaminaQuotaPlus:7})});await f.flush();
 const b=await f.page('alt.hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,dailyStaminaQuotaPlus:11})});await f.flush();assert.equal(await b.evaluate(()=>__share.cfg().dailyStaminaQuotaPlus),7);
 await a.evaluate(()=>__share.activate());await b.evaluate(()=>__share.set('jpx_cfgBattle',JSON.stringify({...__share.cfg(),dailyStaminaQuotaPlus:13})));await f.flush();
 assert.equal(await a.evaluate(()=>__share.cfg().dailyStaminaQuotaPlus),13);assert.equal(await a.evaluate(()=>__share.active()),false);assert.equal(await b.evaluate(()=>JSON.parse(window.localStorage.getItem('jpx_cfgBattle')).dailyStaminaQuotaPlus),11);
 assert.equal(await a.evaluate(()=>__share.backups().length),2);assert.deepEqual(f.errors,[]);
});
test('actual primary and alt archive APIs share migration, import, export and confirmed deletion',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org',{},[rec()]);await a.evaluate(()=>__share.migrate());await f.flush();const b=await f.page('alt.hentaiverse.org',{},[rec(),rec('2026-11-08 10:01:00','Isekai')]);await b.evaluate(()=>__share.migrate());await f.flush();assert.equal((await a.evaluate(()=>__share.export())).stores.battleRecords.length,2);
 await b.evaluate(row=>__share.import({stores:{battleRecords:[row]}},true),rec('2026-11-08 10:02:00'));await f.flush();assert.equal((await a.evaluate(()=>__share.export())).stores.battleRecords.length,3);
 await a.evaluate(async()=>__share.remove(await __share.preview({world:'Isekai',battleType:'',from:'',to:''})));await f.flush();const records=(await b.evaluate(()=>__share.export())).stores.battleRecords;assert.equal(records.length,2);assert.ok(records.every(x=>x.world==='Persistent'));
 await assert.rejects(a.evaluate(()=>__share.import({stores:{battleRecords:[{timestamp:'bad'}]}},true)));assert.deepEqual(f.errors,[]);
});
test('real final settlement charges once across hosts and shared recovery UI renders',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org');await f.flush();const b=await f.page('alt.hentaiverse.org');await f.flush();const timestamp=Date.now()-60000;
 await a.evaluate(ts=>__share.finish(ts),timestamp);await f.flush();await b.evaluate(ts=>__share.finish(ts),timestamp);await f.flush();assert.equal((await a.evaluate(()=>__share.export())).stores.battleRecords.length,1);
 assert.equal(await a.evaluate(()=>__share.usage('Persistent').staminaCost),3);assert.equal(await b.evaluate(()=>__share.usage('Persistent').staminaCost),3);
 await a.evaluate(()=>__share.open());assert.equal(await a.locator('.jpx-shared-data').count(),1);assert.equal(await a.locator('[data-shared-stamina]').count(),2);assert.deepEqual(f.errors,[]);
});
test('idle startup migrates legacy records without opening statistics',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org',{},[rec()],true);await a.waitForFunction(()=>[...window.__gmValues.keys()].some(key=>key.includes('recordsMigrated:')));await f.flush();
 const b=await f.page('alt.hentaiverse.org');assert.equal((await b.evaluate(()=>__share.export())).stores.battleRecords.length,1);assert.deepEqual(f.errors,[]);
});
test('renaming an unused archive does not pause a battle on the other host',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,OneHanded_General:{supports:[],attacks:[{type:'normalAttack'}]}})});await a.evaluate(()=>__share.seedLibrary());await f.flush();
 const b=await f.page('alt.hentaiverse.org');await f.flush();await a.evaluate(()=>__share.activate());await b.evaluate(()=>__share.renameLibrary());await f.flush();assert.equal(await a.evaluate(()=>__share.active()),true);assert.deepEqual(f.errors,[]);
});
test('shared archive viewer and narrow recovery controls render without errors',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org');await a.evaluate(ts=>__share.finish(ts),Date.now()-60000);await f.flush();await a.evaluate(()=>__share.render());await a.waitForTimeout(100);assert.equal(await a.locator('body').innerText().then(text=>text.includes('Could not load records')),false);
 await a.setViewportSize({width:390,height:844});await a.evaluate(()=>{document.body.replaceChildren();__share.open();});
 const dimensions=await a.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));assert.ok(dimensions.scroll<=dimensions.width+1,JSON.stringify(dimensions));
 const dir=path.join(__dirname,'../.test-output/alt-shared');fs.mkdirSync(dir,{recursive:true});await a.screenshot({path:path.join(dir,'recovery-mobile.png'),fullPage:true});assert.deepEqual(f.errors,[]);
});

test('record category preferences are shared across primary and alt without rereading archives',async t=>{
 const f=await fixture(t),a=await f.page('hentaiverse.org'),b=await f.page('alt.hentaiverse.org');
 await f.flush();await a.evaluate(()=>__share.render());await b.evaluate(()=>__share.render());
 for(const page of [a,b])await page.waitForFunction(()=>document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy')==='false');
 await f.flush();const reads=await b.evaluate(()=>__share.recordReads());
 await a.locator('[data-records-panel=columns]').click();await a.locator('input[data-column-group=drops]').uncheck();await f.flush();
 assert.equal(await b.locator('input[data-column-group=drops]').isChecked(),false);
 assert.equal(await b.locator('th[data-column=eqL]').count(),0);
 assert.equal(await b.evaluate(()=>__share.recordReads()),reads);
 assert.equal(JSON.parse(await b.evaluate(()=>__share.get('jpx_cfgStats'))).columnGroups.drops,false);assert.deepEqual(f.errors,[]);
});

async function dataSettings(page){await page.evaluate(()=>__share.settings());if(!await page.locator('#tab_stats').isVisible())await page.locator('#jpx-settings-menu-button').click();await page.locator('#tab_stats').click();await page.locator('[data-stats-section=data]').click();}
for(const width of [320,390,1440])for(const dark of [false,true])test('data manager uses compact task groups at '+width+' '+dark,async t=>{
 const f=await fixture(t),page=await f.page('hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,dailyStaminaQuotaPlus:7})});await f.flush();await page.setViewportSize({width,height:900});
 if(width!==320)await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../JPX-PLUS-ZhTrans.user.js'),'utf8')});await page.evaluate(()=>__share.set('jpx_cfgBattle',JSON.stringify({...__share.cfg(),dailyStaminaQuotaPlus:8})));await f.flush();await dataSettings(page);if(dark)await page.evaluate(()=>__share.theme());
 const panel=page.locator('#jpx-stats-data');assert.equal(await panel.locator('.jpx-shared-data').evaluate(n=>n.open),false);assert.equal(await panel.locator('p').count(),0);
 assert.deepEqual(await panel.locator('.jpx-stats-data-section > .jpx-stats-toolbar > button').evaluateAll(n=>n.map(b=>b.id)),['export-db-button','import-db-button','clear-records-button']);
 assert.equal(await panel.locator('.jpx-stats-data-maintenance #cleanup-data-button').count(),1);assert.equal(await panel.locator('.jpx-stats-data-maintenance #reset-cfgStats-button').count(),1);
 const output=path.join(__dirname,'../.test-output/stats-data');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,width+'-'+(dark?'dark':'light')+'-closed.png')});
 await panel.locator('.jpx-shared-data > summary').click();const frames=await panel.locator('.jpx-shared-data').evaluate(async n=>{const root=n.closest('.jpx-stats-data'),frames=[];for(let i=0;i<20;i++){await new Promise(requestAnimationFrame);frames.push({client:root.clientWidth,scroll:root.scrollWidth});if(i>1&&!n.getAnimations({subtree:true}).length)break;}await Promise.all(n.getAnimations({subtree:true}).map(a=>a.finished));return frames;});assert.ok(frames.every(g=>g.scroll<=g.client+1),JSON.stringify(frames));assert.equal(await panel.locator('[data-shared-stamina]').count(),2);assert.equal(await panel.locator('[data-shared-stamina]').first().isVisible(),true);assert.equal(await panel.locator('.jpx-shared-data-revision').count(),1);if(width<650){const targets=await panel.locator('button,input,select').evaluateAll(nodes=>nodes.map(n=>({height:n.getBoundingClientRect().height,label:n.textContent||n.type})));assert.ok(targets.every(n=>n.height>=44),JSON.stringify(targets));}
 await page.screenshot({path:path.join(output,width+'-'+(dark?'dark':'light')+'-open.png')});
 const geometry=await panel.locator('.jpx-stats-data').evaluate(n=>({client:n.clientWidth,scroll:n.scrollWidth,overflow:[...n.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>n.getBoundingClientRect().right+1).map(e=>({tag:e.tagName,class:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right,margin:getComputedStyle(e).margin}))}));assert.ok(geometry.scroll<=geometry.client+1,JSON.stringify(geometry));
 const before=await page.evaluate(()=>__share.export());page.once('dialog',d=>d.dismiss());await panel.locator('#cleanup-data-button').click();assert.deepEqual(await page.evaluate(()=>__share.export()),before);assert.deepEqual(f.errors,[]);
});
test('data manager imports only after preview confirmation and exports the current archive',async t=>{
 const f=await fixture(t),page=await f.page('hentaiverse.org',{},[rec()]);await f.flush();await dataSettings(page);const before=await page.evaluate(()=>__share.export());
 const waitFile=page.waitForEvent('filechooser');await page.locator('#import-db-button').click();const chooser=await waitFile;await chooser.setFiles({name:'records.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...before,stores:{battleRecords:[rec('2026-11-08 11:00:00')]}}))});
 await page.locator('.jpx-stats-transfer').waitFor();assert.equal(await page.locator('.jpx-stats-data-section > .jpx-stats-transfer').count(),1);assert.deepEqual(await page.evaluate(()=>__share.export()),before);
 await page.locator('.jpx-stats-transfer .jpx-stats-toolbar button').first().click();await page.locator('.jpx-stats-transfer').waitFor({state:'detached'});assert.equal((await page.evaluate(()=>__share.export())).stores.battleRecords.length,2);
 const download=page.waitForEvent('download');await page.locator('#export-db-button').click();const file=await download;assert.equal(await file.failure(),null);assert.equal(JSON.parse(fs.readFileSync(await file.path(),'utf8')).stores.battleRecords.length,2);
 assert.deepEqual(f.errors,[]);
});

for (const locale of ['', 'ZhTrans', 'ZhTW', 'ZhHK', 'Ja', 'Ko']) test('shared data uses the selected language on desktop and phone: '+(locale||'English'), async t=>{
 const f=await fixture(t),page=await f.page('hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,dailyStaminaQuotaPlus:7})});
 await f.flush();
 if(locale) await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../JPX-PLUS-'+locale+'.user.js'),'utf8')});
 const expected=locale ? await page.evaluate(()=>window.jpxI18N.cShared) : JSON.parse(fs.readFileSync(path.join(__dirname,'../src/shared-ui-en.json'),'utf8'));
 await page.evaluate(()=>__share.set('jpx_cfgBattle',JSON.stringify({...__share.cfg(),dailyStaminaQuotaPlus:8})));await f.flush();
 await dataSettings(page);const panel=page.locator('.jpx-shared-data');
 assert.equal(await panel.locator('summary').innerText(),expected.title);
 await panel.locator('summary').click();
 assert.deepEqual(await panel.locator('h4').allTextContents(),[expected.backupSection,expected.historySection,expected.quotaShort+' · '+new Date().toISOString().slice(0,10)+' UTC']);
 assert.equal(await panel.locator('.jpx-shared-data-stamina button').first().textContent(),expected.save);
 const before=await page.evaluate(()=>__share.cfg());let restoreMessage;
 page.once('dialog',async dialog=>{restoreMessage=dialog.message();await dialog.dismiss();});
 await panel.locator('.jpx-shared-data-row').first().getByRole('button',{name:expected.restoreAction,exact:true}).click();
 assert.equal(restoreMessage,expected.confirm);assert.deepEqual(await page.evaluate(()=>__share.cfg()),before);
 let cleanupMessage;page.once('dialog',async dialog=>{cleanupMessage=dialog.message();await dialog.dismiss();});
 await page.locator('#cleanup-data-button').click();assert.ok(cleanupMessage.includes(expected.resetScope));
 for(const width of [320,1440]){
  await page.setViewportSize({width,height:900});
  if(width===320)await page.locator('.jpx-settings-sidebar').waitFor({state:'hidden'});
  for(const dark of [false,true]){
   if(dark)await page.evaluate(()=>__share.theme());
   const geometry=await panel.evaluate(node=>({width:node.clientWidth,scroll:node.scrollWidth,viewport:innerWidth,right:node.getBoundingClientRect().right}));
   assert.ok(geometry.scroll<=geometry.width+1&&geometry.right<=geometry.viewport+1,JSON.stringify({locale,width,dark,geometry}));
   if(width===320&&dark){const out=path.join(__dirname,'../.test-output/language-audit');fs.mkdirSync(out,{recursive:true});await page.locator('#settings-container').screenshot({path:path.join(out,'shared-'+(locale||'en')+'.png')});}
  }
  await page.evaluate(()=>__share.theme());
 }
 assert.deepEqual(f.errors,[]);
});
test('compact shared recovery preserves confirmation and stamina correction',async t=>{
 const f=await fixture(t),page=await f.page('hentaiverse.org',{jpx_cfgBattle:JSON.stringify({battleVersion:20251216,dailyStaminaQuotaPlus:7})});await f.flush();await dataSettings(page);await page.locator('.jpx-shared-data > summary').click();
 const first=page.locator('.jpx-shared-data-row').filter({has:page.locator('.jpx-shared-data-source')}).first(),before=await page.evaluate(()=>__share.cfg());
 page.once('dialog',d=>d.dismiss());await first.locator('button').last().click();assert.deepEqual(await page.evaluate(()=>__share.cfg()),before);
 const download=page.waitForEvent('download');await first.locator('button').first().click();assert.equal(await (await download).failure(),null);
 const stamina=page.locator('[data-shared-stamina=Persistent]');await stamina.fill('12.5');await stamina.locator('..').locator('..').locator('button').click();await f.flush();assert.equal(await page.evaluate(()=>__share.usage('Persistent').staminaCost),12.5);
 assert.equal(await page.evaluate(()=>__share.usage('Isekai').staminaCost),0);assert.deepEqual(f.errors,[]);
});

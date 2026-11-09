'use strict';
// Isolated Chrome pages with simulated userscript injection and shared GM storage.
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
const shell=fs.readFileSync(path.join(root,'docs/records.html'),'utf8');
const entry='https://meiyongai.github.io/JPX-PLUS/records.html',nl=String.fromCharCode(10);
const isHV=url=>/(^|\.)hentaiverse\.org$/.test(new URL(url).hostname);
let browser;
before(async()=>{browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{})});});
after(async()=>browser?.close());
function gmSetup(values){
 window.__gmValues=new Map(values);window.__gmListeners=new Map();
 window.GM_getValue=(key,fallback)=>window.__gmValues.has(key)?structuredClone(window.__gmValues.get(key)):fallback;
 window.GM_setValue=(key,value)=>{window.__gmValues.set(key,structuredClone(value));void window.__gmSend({key,value});};
 window.GM_deleteValue=key=>{window.__gmValues.delete(key);void window.__gmSend({key,remove:true});};
 window.GM_listValues=()=>[...window.__gmValues.keys()];
 window.GM_addValueChangeListener=(key,callback)=>{const list=window.__gmListeners.get(key)||[];list.push(callback);window.__gmListeners.set(key,list);};
}
async function fixture(t,{language='',packFirst=false,width=1440,dark=false,inject=true}={}){
 const context=await browser.newContext({viewport:{width,height:900}}),errors=[],requests=[],store=new Map();let jobs=Promise.resolve();
 if(dark)store.set('jpx_shared_v1:setting:jpx_theme',{value:'dark'});
 context.on('page',page=>page.on('pageerror',error=>errors.push(error.message)));
 context.on('request',request=>requests.push(request.url()));
 await context.exposeBinding('__gmSend',({page},change)=>{
  const old=store.get(change.key);if(change.remove)store.delete(change.key);else store.set(change.key,change.value);
  jobs=jobs.then(async()=>{for(const other of context.pages())if(other!==page&&!other.isClosed()){
   try{await other.evaluate(({change,old})=>{
    if(!window.__gmValues)return;
    if(change.remove)window.__gmValues.delete(change.key);else window.__gmValues.set(change.key,change.value);
    for(const callback of window.__gmListeners.get(change.key)||[])callback(change.key,old,change.value,true);
   },{change,old});}catch(error){if(!/closed|destroyed|navigation/i.test(String(error)))throw error;}
  }});
 });
 const measured=source.replace(nl+'initDo();',nl+'window.__recordsTest={migrate:ensureJpxSharedRecords,import:importIndexedDB,export:exportIndexedDB,stats:()=>JSON.parse(JSON.stringify(cfgStats)),set:(key,value)=>localStorage.setItem(key,value)};'+nl+'initDo();');
 const pack=language?fs.readFileSync(path.join(root,'JPX-PLUS-'+language+'.user.js'),'utf8'):'';
 await context.route('**/*',async route=>{
  if(!route.request().isNavigationRequest())return route.fulfill({status:204,body:''});
  const records=new URL(route.request().url()).origin==='https://meiyongai.github.io';
  const script='('+gmSetup.toString()+')('+JSON.stringify([...store])+');'+nl+(packFirst?pack:'')+nl+measured+nl+(packFirst?'':pack);
  const startup=inject?'<script>'+script.replace(/<\/script/gi,'<\\/script')+'</script>':'';
  const html=records?shell:'<!doctype html><html><head><meta charset="utf-8"></head><body><div id="native-homepage"><div id="csp"><div id="navbar"></div><h1>HV homepage</h1></div></div><script>window.__nativeHomeRan=true;</script></body></html>';
  return route.fulfill({contentType:'text/html',body:html.replace('<head>','<head>'+startup)});
 });
 async function flush(){for(let i=0;i<4;i++){await jobs;await new Promise(resolve=>setTimeout(resolve,20));}}
 t.after(async()=>{await flush();await context.close();await jobs;assert.deepEqual(errors,[]);});
 return {page:await context.newPage(),context,requests,store,flush};
}
async function ready(page){
 await page.waitForFunction(()=>document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy')==='false',null,{polling:25});
 assert.equal(await page.locator('.jpx-records-page').isVisible(),true);assert.equal(await page.locator('#native-homepage').count(),0);
}
const row=(world='Persistent',timestamp='2026-11-09 10:00:00')=>({timestamp,date:timestamp.slice(0,10),world,battleType:'Arena',result:'Victory',difficulty:20,playerLevel:400,roundInfo:{current:1,total:1},turns:10,deltaSeconds:5,deltaTime:'00:00:05',tps:2,combatRecords:{},revenueRecords:{totalProfit:50,finalProfit:50}});
async function seedLegacy(page,record){
 await page.evaluate(async record=>{
  await new Promise((resolve,reject)=>{const req=indexedDB.open('jpx',1);
   req.onupgradeneeded=()=>req.result.createObjectStore('battleRecords',{keyPath:'timestamp'}).createIndex('date','date');
   req.onsuccess=()=>{const db=req.result,tx=db.transaction('battleRecords','readwrite');tx.objectStore('battleRecords').put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};req.onerror=()=>reject(req.error);
  });
 },record);
}
for(const host of ['hentaiverse.org','alt.hentaiverse.org'])for(const world of ['Persistent','Isekai']){
 test('Z, reload and source close never navigate statistics through HV: '+host+' '+world,async t=>{
  const f=await fixture(t,{language:'ZhCN',width:world==='Isekai'?390:1440,dark:world==='Isekai'});
  await f.page.goto('https://'+host+(world==='Isekai'?'/isekai/':'/'));
  await f.page.evaluate(record=>__recordsTest.import({stores:{battleRecords:[record]}},true),row(world));await f.flush();
  const before=f.requests.filter(isHV),event=f.page.waitForEvent('popup');await f.page.keyboard.press('z');const records=await event;await ready(records);
  assert.equal(records.url(),entry+(world==='Isekai'?'#isekai':''));assert.equal(await records.evaluate(()=>window.opener),null);
  assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(),1);
  assert.deepEqual(await records.locator('#filter-world input:checked').evaluateAll(nodes=>nodes.map(node=>node.value)),[world]);
  await records.reload();await ready(records);const beforeClose=[...f.requests];await f.page.close();await records.waitForTimeout(100);
  assert.deepEqual(f.requests,beforeClose,'closing the game needs no takeover navigation');
  await records.reload();await ready(records);await records.locator('[data-records-panel=filters]').click();
  assert.equal(await records.locator('#jpx-records-sheet').evaluate(node=>node.open),true);
  assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(),1);
  assert.deepEqual(f.requests.filter(isHV),before,'opening and refreshing statistics must not contact any HV URL');
 });
}
for(const language of ['ZhCN','ZhTW','ZhHK','Ja','Ko'])for(const packFirst of [false,true]){
 test('independent statistics preserve translations across reload: '+language+' packFirst='+packFirst,async t=>{
  const f=await fixture(t,{language,packFirst,width:390});await f.page.goto(entry);await ready(f.page);
  assert.equal(await f.page.locator('.jpx-records-heading h1').textContent(),await f.page.evaluate(()=>window.jpxI18N.sP.jpxStats));
  await f.page.reload();await ready(f.page);
  assert.equal(await f.page.locator('.jpx-records-heading h1').textContent(),await f.page.evaluate(()=>window.jpxI18N.sP.jpxStats));
  assert.deepEqual(f.requests.filter(isHV),[]);
  assert.ok(![...f.store.keys()].some(key=>/(?:legacy|Migrated).*github/i.test(key)),'Pages never becomes a legacy migration source');
 });
}
test('independent statistics share records and settings, then survive game navigation',async t=>{
 const f=await fixture(t);await f.page.goto('https://hentaiverse.org/');
 const event=f.page.waitForEvent('popup');await f.page.keyboard.press('z');const records=await event;await ready(records);
 await f.page.evaluate(record=>__recordsTest.import({stores:{battleRecords:[record]}},true),row());await f.flush();
 await records.waitForFunction(()=>document.querySelectorAll('#battleStatsTable tbody tr:not([data-summary])').length===1);
 const saved=await records.evaluate(()=>__recordsTest.stats());saved.columnGroups={...saved.columnGroups,drops:false};
 await f.page.evaluate(saved=>__recordsTest.set('jpx_cfgStats',JSON.stringify(saved)),saved);await f.flush();
 await records.waitForFunction(()=>!document.querySelector('th[data-column=eqL]'));
 const before=f.requests.filter(url=>new URL(url).hostname==='meiyongai.github.io');await f.page.reload();await f.flush();
 assert.deepEqual(f.requests.filter(url=>new URL(url).hostname==='meiyongai.github.io'),before);
 await records.reload();await ready(records);assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(),1);
 assert.equal(await records.locator('th[data-column=eqL]').count(),0);
});
for(const pathname of ['/','/isekai/'])test('old HV statistics bookmark migrates records then leaves HV: '+pathname,async t=>{
 const f=await fixture(t);await f.page.goto('https://hentaiverse.org'+pathname);
 await seedLegacy(f.page,row(pathname==='/'?'Persistent':'Isekai'));await f.flush();
 f.store.delete('jpx_shared_v1:recordsMigrated:https%3A%2F%2Fhentaiverse.org');
 await f.page.goto('https://hentaiverse.org'+pathname+'#jpx-records');await f.page.reload({waitUntil:'commit'});
 await f.page.waitForURL(entry+(pathname==='/'?'':'#isekai'));await ready(f.page);
 assert.equal(await f.page.locator('#battleStatsTable tbody tr:not([data-summary])').count(),1);
 const before=f.requests.filter(isHV);await f.page.reload();await ready(f.page);assert.deepEqual(f.requests.filter(isHV),before);
});
test('blocked popups leave the original game unchanged',async t=>{
 const f=await fixture(t);await f.page.goto('https://hentaiverse.org/');await f.page.evaluate(()=>{window.open=()=>null;});
 const before=[...f.requests];await f.page.keyboard.press('z');await f.flush();assert.deepEqual(f.requests,before);assert.equal(await f.page.locator('#native-homepage').isVisible(),true);
});
test('Z waits for legacy migration before opening the independent page',async t=>{
 const f=await fixture(t);await f.page.goto('https://hentaiverse.org/');await seedLegacy(f.page,row());await f.flush();
 f.store.delete('jpx_shared_v1:recordsMigrated:https%3A%2F%2Fhentaiverse.org');
 await f.page.addInitScript(()=>{window.requestIdleCallback=()=>0;});await f.page.reload();
 const before=f.requests.filter(isHV),event=f.page.waitForEvent('popup');await f.page.keyboard.press('z');const records=await event;await ready(records);
 assert.equal(await records.locator('#battleStatsTable tbody tr:not([data-summary])').count(),1);
 assert.deepEqual(f.requests.filter(isHV),before);
 assert.equal(f.store.get('jpx_shared_v1:legacyRecords:https%3A%2F%2Fhentaiverse.org').records.length,1);
});
test('failed legacy migration keeps the game and never opens an empty archive',async t=>{
 const f=await fixture(t);await f.page.addInitScript(()=>{window.requestIdleCallback=()=>0;});await f.page.goto('https://hentaiverse.org/');
 await f.page.evaluate(()=>{indexedDB.open=()=>{throw Error('legacy archive unavailable');};});
 const before=[...f.requests],event=f.page.waitForEvent('popup');await f.page.keyboard.press('z');const records=await event;
 if(!records.isClosed())await records.waitForEvent('close');await f.flush();
 assert.deepEqual(f.requests,before);assert.equal(await f.page.locator('#native-homepage').isVisible(),true);
 assert.ok(!f.store.has('jpx_shared_v1:recordsMigrated:https%3A%2F%2Fhentaiverse.org'));
});
test('statistics shell has no web scripts or data endpoint',async t=>{
 const f=await fixture(t,{inject:false});await f.page.goto(entry);assert.equal(await f.page.locator('script').count(),0);
 assert.equal(await f.page.locator('a').getAttribute('href'),'https://raw.githubusercontent.com/MeiYongAI/JPX-PLUS/main/JPX-PLUS.user.js');assert.deepEqual(f.requests,[entry]);
});

'use strict';
const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'JPX-PLUS.user.js'),'utf8');
let browser;
before(async()=>{browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'chrome'});});
after(async()=>browser?.close());
function expose(){
 initDoI18n();loadBattleConfig();loadStatsSettingsConfig();
 const copy=value=>JSON.parse(JSON.stringify(value));
 jpxMarket.getMarketPrice=async()=>({'Energy Drink':1000});
 const originalRead=getBattleRecordsRender;let reads=0,hold=false,pending=[];
 getBattleRecordsRender=async(...args)=>{reads++;const result=await originalRead(...args);if(hold)await new Promise(resolve=>pending.push(resolve));return result;};
 window.__groups={
  async seed(){const db=await openDB();await new Promise((resolve,reject)=>{const tx=db.transaction('battleRecords','readwrite');const store=tx.objectStore('battleRecords');for(let i=0;i<35;i++){const combat=jpxUtils.createCombatRecords(),revenue=jpxUtils.createRevenueRecords();combat.use={Cure:3,Imperil:5};revenue.credit=123;revenue.totalProfit=123;revenue.finalProfit=123;revenue.consumable={'Health Draught':{drop:4,use:1,balance:3}};store.put({timestamp:'2026-11-08 12:00:'+String(i).padStart(2,'0'),date:'2026-11-08',world:'Persistent',battleType:'Arena',result:'Victory',difficulty:20,playerLevel:400,persona:'Fixture',roundInfo:{current:100,total:100},turns:500,deltaSeconds:100,deltaTime:'00:01:40',tps:5,combatRecords:combat,revenueRecords:revenue});}tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();},
  render:()=>renderBattleRecordsPage(window), reads:()=>reads, theme:toggleJpxTheme,
  config:()=>copy(cfgStats), saved:()=>JSON.parse(localStorage.getItem(prefix+'cfgStats')||'null'),
  use(columns,groups){cfgStats.statsColumns=columns;if(groups)cfgStats.columnGroups=groups;localStorage.setItem(prefix+'cfgStats',JSON.stringify(cfgStats));},
  savedEdit(){const saved=JSON.parse(localStorage.getItem(prefix+'cfgStats'));saved.statsColumns.find(c=>c.id==='credit').customName='Another tab';saved.futureMeta={preserve:true};localStorage.setItem(prefix+'cfgStats',JSON.stringify(saved));},
  reload(){cfgStats={};renderBattleRecordsPage(window);},
  schema:()=>({groups:copy(STATS_COLUMN_GROUPS),fields:STATS_FIELDS.map(f=>f.id)}),
  hold(){hold=true;},pending:()=>pending.length,release(){hold=false;pending.splice(0).forEach(fn=>fn());},
  quota(){const native=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key===prefix+'cfgStats'){Storage.prototype.setItem=native;throw new DOMException('Fixture quota','QuotaExceededError');}return native.call(this,key,value);};},
  async image(){const blob=await createRecordImageBlob(document.getElementById('battleStatsTable'));return {type:blob.type,size:blob.size};},
  validate(value){validateStatsConfig(value);const memory=new Map();const lib=createJpxConfigLibrary({storage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},key:'fixture',modes:BATTLE_MODES,battleVersion:defaultCfgBattle.battleVersion,statsVersion:defaultCfgStats.statsVersion});return lib.save({schemaVersion:1,kind:'stats',title:'Groups',world:'Any',config:value}).envelope.config;},
 };
}
async function fixture(t,{width=1440,dark=false,language=''}={}){
 const context=await browser.newContext({viewport:{width,height:900},isMobile:width<600,hasTouch:width<600,reducedMotion:'reduce'});t.after(()=>context.close());
 await context.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:'<!doctype html><html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body><div id="csp"><div id="navbar"></div></div></body></html>'}):route.abort());
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));t.after(()=>assert.deepEqual(errors,[]));
 await page.goto('https://hentaiverse.org/');if(language)await page.addScriptTag({content:fs.readFileSync(path.join(root,'JPX-PLUS-'+language+'.user.js'),'utf8')});
 await page.addScriptTag({content:source.replace(String.fromCharCode(10)+'initDo();',String.fromCharCode(10)+'('+expose.toString()+')();')});
 await page.evaluate(async()=>{await __groups.seed();__groups.render();});await ready(page);if(dark)await page.evaluate(()=>__groups.theme());return page;
}
async function ready(page){await page.waitForFunction(()=>document.querySelector('.jpx-records-table-scroll')?.getAttribute('aria-busy')==='false');}
async function openColumns(page){if(!await page.locator('#jpx-records-sheet').evaluate(n=>n.open))await page.locator('[data-records-panel=columns]').click();}
const toggle=(page,group)=>{const input=page.locator('.jpx-records-column-groups input[data-column-group='+group+']');return {check:async()=>{await openColumns(page);await input.check();},uncheck:async()=>{await openColumns(page);await input.uncheck();},focus:async()=>{await openColumns(page);await input.focus();},isChecked:()=>input.isChecked()};};
const fields=page=>page.locator('#battleStatsTable thead tr:last-child th').evaluateAll(nodes=>nodes.map(n=>n.dataset.column));
test('all statistics fields belong to exactly one of eight groups',async t=>{const page=await fixture(t);const data=await page.evaluate(()=>__groups.schema());assert.equal(data.groups.length,8);assert.deepEqual(data.groups.flatMap(g=>g.fields).sort(),data.fields.sort());});
test('group headers span visible columns and preserve ordering within groups',async t=>{
 const page=await fixture(t);const columns=[{id:'credit',customName:'Custom credits',styleText:'color:rgb(1,2,3)'},{id:'date'},{id:'hp',disabled:true},{id:'world'},{id:'finalProfit'}];
 await page.evaluate(columns=>{__groups.use(columns);__groups.render();},columns);await ready(page);
 assert.deepEqual(await fields(page),['date','world','credit','finalProfit']);
 assert.deepEqual(await page.locator('.jpx-records-group-header th').evaluateAll(nodes=>nodes.map(n=>[n.dataset.columnGroup,n.colSpan,n.scope])),[['basic',2,'colgroup'],['earnings',2,'colgroup']]);
 assert.equal(await page.locator('th[data-column=credit]').textContent(),'Custom credits');assert.deepEqual((await page.evaluate(()=>__groups.saved())).statsColumns,columns);
});
test('group hide and restore retains item selections and never rereads history',async t=>{
 const page=await fixture(t);const before=await fields(page),reads=await page.evaluate(()=>__groups.reads());
 await toggle(page,'potions').uncheck();assert.equal((await fields(page)).includes('hd'),false);
 await toggle(page,'potions').check();assert.deepEqual(await fields(page),before);assert.equal(await page.evaluate(()=>__groups.reads()),reads);
 await page.locator('[data-expand-group=potions]').click();await page.locator('input[data-column-field=hp]').uncheck();await toggle(page,'potions').uncheck();await toggle(page,'potions').check();assert.equal((await fields(page)).includes('hp'),false);
 const saved=await page.evaluate(()=>__groups.saved());assert.equal(saved.statsColumns.find(c=>c.id==='hp').disabled,true);assert.equal(saved.columnGroups.potions,true);
 await page.evaluate(()=>__groups.reload());await ready(page);assert.equal((await fields(page)).includes('hp'),false);
});
test('all categories can be hidden without losing controls or fetching records',async t=>{const page=await fixture(t),reads=await page.evaluate(()=>__groups.reads());for(const group of (await page.evaluate(()=>__groups.schema())).groups)await toggle(page,group.id).uncheck();assert.equal(await page.locator('#battleStatsTable').count(),0);assert.equal(await page.locator('.jpx-records-message').isVisible(),true);await toggle(page,'basic').check();assert.ok((await fields(page)).includes('date'));assert.equal(await page.evaluate(()=>__groups.reads()),reads);});
test('column changes preserve latest stored metadata and recover from quota failure',async t=>{
 const page=await fixture(t);await toggle(page,'drops').uncheck();await page.evaluate(()=>__groups.savedEdit());await toggle(page,'potions').uncheck();
 const saved=await page.evaluate(()=>__groups.saved());assert.equal(saved.statsColumns.find(c=>c.id==='credit').customName,'Another tab');assert.deepEqual(saved.futureMeta,{preserve:true});
 await page.evaluate(()=>__groups.quota());
 await page.evaluate(()=>{const input=document.querySelector('input[data-column-group=scrolls]');input.checked=false;input.dispatchEvent(new Event('change'));});
 assert.equal(await toggle(page,'scrolls').isChecked(),true);assert.equal(await page.locator('.jpx-records-column-status').getAttribute('role'),'alert');assert.deepEqual(await page.evaluate(()=>__groups.saved()),saved);
 await toggle(page,'scrolls').uncheck();assert.equal(await toggle(page,'scrolls').isChecked(),false);assert.equal(await page.locator('.jpx-records-column-status').getAttribute('role'),'status');
});
test('display changes during pending refresh use newest selected columns',async t=>{const page=await fixture(t);await page.evaluate(()=>{__groups.hold();window.dispatchEvent(new Event('jpx:records-changed'));});await page.waitForFunction(()=>__groups.pending()===1);await toggle(page,'drops').uncheck();await page.evaluate(()=>__groups.release());await ready(page);assert.equal((await fields(page)).includes('eqL'),false);});
test('another tab changes display preferences without a new record read',async t=>{const page=await fixture(t);const reads=await page.evaluate(()=>__groups.reads());await page.evaluate(()=>{const config=__groups.config();config.columnGroups={drops:false};localStorage.setItem('jpx_cfgStats',JSON.stringify(config));window.dispatchEvent(new StorageEvent('storage',{key:'jpx_cfgStats'}));});assert.equal((await fields(page)).includes('eqL'),false);assert.equal(await toggle(page,'drops').isChecked(),false);assert.equal(await page.evaluate(()=>__groups.reads()),reads);});
test('configuration validation and library export retain groups and reject invalid types',async t=>{const page=await fixture(t);await toggle(page,'skills').uncheck();const saved=await page.evaluate(()=>__groups.saved());assert.deepEqual(await page.evaluate(value=>__groups.validate(value),saved),saved);for(const groups of [null,[],{basic:'false'}])assert.equal(await page.evaluate(groups=>{try{__groups.validate({...__groups.config(),columnGroups:groups});return false;}catch{return true;}},groups),true);});
test('category edits preserve totals, averages, consumable balances and detail buttons',async t=>{
 const page=await fixture(t);const credit=await page.locator('td[data-column=credit]').allTextContents(),potions=await page.locator('td[data-column=hd]').allTextContents();
 assert.equal(credit[0],'4,305');assert.equal(credit[1],'123');assert.equal(potions[2],'3');
 await toggle(page,'earnings').uncheck();await toggle(page,'earnings').check();
 assert.deepEqual(await page.locator('td[data-column=credit]').allTextContents(),credit);assert.deepEqual(await page.locator('td[data-column=hd]').allTextContents(),potions);
 assert.equal(await page.locator('.jpx-records-detail').count(),37);
 await page.locator('[data-expand-group=earnings]').click();await page.locator('input[data-column-field=credit]').uncheck();
 assert.equal(await page.locator('.jpx-records-group-header th[data-column-group=earnings]').getAttribute('colspan'),'3');
});
for(const language of ['ZhTW','ZhHK','Ja','Ko'])test('localized category controls render without missing labels: '+language,async t=>{
 const page=await fixture(t,{width:320,dark:true,language});await openColumns(page);
 assert.equal(await page.locator('.jpx-records-column-groups input[data-column-group]').count(),8);
 const text=await page.locator('.jpx-records-columns').textContent();assert.equal(text.includes('group_'),false);assert.equal(text.includes('$'+'{'),false);assert.equal(text.includes('Show categories'),false);
});
test('sticky headers stay aligned and image export succeeds',async t=>{const page=await fixture(t);await page.locator('.jpx-records-table-scroll').evaluate(node=>{node.scrollTop=250;node.scrollLeft=350;});await page.waitForTimeout(30);const pos=await page.locator('#battleStatsTable').evaluate(table=>{const parent=table.parentElement.getBoundingClientRect(),rows=table.tHead.rows;return {parent:parent.top,group:rows[0].getBoundingClientRect().top,field:rows[1].getBoundingClientRect().top,groupBottom:rows[0].getBoundingClientRect().bottom};});assert.ok(Math.abs(pos.group-pos.parent)<3,JSON.stringify(pos));assert.ok(pos.field>=pos.groupBottom-1);const image=await page.evaluate(()=>__groups.image());assert.equal(image.type,'image/png');assert.ok(image.size>1000);});
for(const width of [320,768,1024,1440])for(const dark of [false,true])test('group controls fit '+width+' '+(dark?'dark':'light'),async t=>{
 const page=await fixture(t,{width,dark,language:'ZhTrans'});await openColumns(page);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 await toggle(page,'earnings').focus();await page.keyboard.press('Space');assert.equal(await toggle(page,'earnings').isChecked(),false);await page.keyboard.press('Space');
 const geometry=await page.locator('.jpx-records-sheet-body').evaluate(node=>({client:node.clientWidth,scroll:node.scrollWidth,height:node.clientHeight,viewport:innerHeight}));assert.ok(geometry.scroll<=geometry.client+1);assert.ok(geometry.height<geometry.viewport*.9,JSON.stringify(geometry));
 if(width===320||width===1440){const output=path.join(root,'.test-output/stats-groups');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,width+'-'+(dark?'dark':'light')+'-editor.png')});await page.keyboard.press('Escape');await page.screenshot({path:path.join(output,width+'-'+(dark?'dark':'light')+'-table.png')});}
});

test('toolbar stays compact, exposes named icon targets and leaves data in the first viewport',async t=>{
 for(const width of [320,390,768,1440]){
  const page=await fixture(t,{width,language:'ZhTrans'});
  const data=await page.evaluate(()=>({top:document.querySelector('.jpx-records-table-scroll').getBoundingClientRect().top,open:document.querySelector('dialog').open,buttons:[...document.querySelectorAll('.jpx-records-actions button')].map(b=>({text:b.textContent,label:b.getAttribute('aria-label'),width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,svg:!!b.querySelector('svg'),radius:parseFloat(getComputedStyle(b).borderRadius)}))}));
  assert.ok(data.top<100,JSON.stringify(data));assert.equal(data.open,false);assert.equal(data.buttons.length,3);
  for(const button of data.buttons){assert.equal(button.text,'');assert.ok(button.label);assert.ok(button.svg);assert.ok(button.width>=44&&button.height>=44);assert.ok(button.radius<=2);}
  assert.equal(await page.locator('.jpx-records-count').textContent(),'35 条记录');
 }
});
test('modal contains keyboard focus, closes with Escape and preserves expanded fields',async t=>{
 const page=await fixture(t,{width:390});const reads=await page.evaluate(()=>__groups.reads());
 await openColumns(page);await page.locator('[data-expand-group=potions]').click();await page.locator('input[data-column-field=hp]').uncheck();
 for(let i=0;i<18;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>!!document.activeElement.closest('#jpx-records-sheet')),true);}
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#jpx-records-sheet').open);
 assert.equal(await page.locator('[data-records-panel=columns]').evaluate(n=>n===document.activeElement),true);
 await openColumns(page);assert.equal(await page.locator('[data-expand-group=potions]').getAttribute('aria-expanded'),'true');assert.equal(await page.locator('input[data-column-field=hp]').isChecked(),false);
 assert.equal(await page.evaluate(()=>__groups.reads()),reads);
 await page.setViewportSize({width:844,height:390});const box=await page.locator('#jpx-records-sheet').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=391);
 await page.keyboard.press('Escape');await page.locator('[data-records-panel=image]').click();assert.equal(await page.locator('[data-image-action=download]').isVisible(),true);
});
test('filter sheet survives redraw and resizing without resetting filters',async t=>{
 const page=await fixture(t,{width:390});await page.locator('[data-records-panel=filters]').click();
 const input=page.locator('#filtersDiv input[type=number]').first();await input.fill('50');await input.dispatchEvent('change');await ready(page);
 await page.evaluate(()=>__groups.render());await ready(page);assert.equal(await input.inputValue(),'50');assert.equal(await page.locator('#jpx-records-sheet').evaluate(n=>n.open),true);
 await page.setViewportSize({width:1440,height:900});assert.equal(await input.inputValue(),'50');
 await page.mouse.click(5,5);await page.waitForFunction(()=>!document.querySelector('#jpx-records-sheet').open);
 assert.equal(await page.locator('[data-records-panel=filters]').getAttribute('aria-expanded'),'false');
});

test('image actions download PNG and surface clipboard failures inside the sheet',async t=>{
 const page=await fixture(t,{width:390,language:'ZhTrans'});await page.locator('[data-records-panel=image]').click();
 const download=page.waitForEvent('download');await page.locator('[data-image-action=download]').click();const file=await download;assert.match(file.suggestedFilename(),/\.png$/);assert.equal(await file.failure(),null);
 await page.waitForFunction(()=>document.querySelector('.jpx-record-image-toast')?.textContent.includes('图片已下载'));
 assert.equal(await page.locator('#jpx-records-sheet .jpx-record-image-toast').isVisible(),true);assert.equal(await page.locator('[data-image-action=download]').isDisabled(),false);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{write:async()=>{throw new DOMException('Fixture denied','NotAllowedError');}}}));
 await page.locator('[data-image-action=copy]').click();await page.waitForFunction(()=>!document.querySelector('.jpx-record-image-actions').hasAttribute('aria-busy'));
 assert.equal(await page.locator('#jpx-records-sheet .jpx-record-image-toast').isVisible(),true);assert.equal(await page.locator('[data-image-action=copy]').isDisabled(),false);assert.match(await page.locator('.jpx-record-image-toast').textContent(),/复制失败/);
 await page.keyboard.press('Escape');assert.equal(await page.locator('[data-records-panel=image]').evaluate(n=>n===document.activeElement),true);
});
test('filter sheets fit small portrait and landscape without page scrolling',async t=>{
 const output=path.join(root,'.test-output/stats-groups');fs.mkdirSync(output,{recursive:true});
 for(const [width,height] of [[320,568],[390,844],[844,390]])for(const dark of [false,true]){
  const page=await fixture(t,{width:390,dark,language:'ZhTrans'});await page.setViewportSize({width,height});await page.locator('[data-records-panel=filters]').click();
  const g=await page.locator('#jpx-records-sheet').evaluate(n=>{const r=n.getBoundingClientRect(),b=n.querySelector('.jpx-records-sheet-body');return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight,scroll:b.scrollWidth,client:b.clientWidth};});
  assert.ok(g.x>=0&&g.y>=0&&g.right<=g.width+1&&g.bottom<=g.height+1,JSON.stringify(g));assert.ok(g.scroll<=g.client+1,JSON.stringify(g));
  await page.screenshot({path:path.join(output,width+'-'+(dark?'dark':'light')+'-filters.png')});
  await page.locator('.jpx-records-clear').scrollIntoViewIfNeeded();assert.equal(await page.locator('.jpx-records-clear').isVisible(),true);
  await page.locator('.jpx-records-clear').click();await page.locator('#jpx-records-cleanup-dialog').waitFor();await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#jpx-records-cleanup-dialog'));assert.equal(await page.locator('#jpx-records-sheet').evaluate(n=>n.open),true);
  await page.locator('.jpx-records-sheet-body').evaluate(n=>n.scrollTop=10000);assert.equal(await page.evaluate(()=>scrollY),0);
  await page.locator('.jpx-records-sheet-close').click();assert.equal(await page.locator('[data-records-panel=filters]').evaluate(n=>n===document.activeElement),true);
 }
});

test('display save toast is transient, coalesces edits and does not shift the sheet',async t=>{
 const page=await fixture(t,{width:390});await openColumns(page);assert.equal(await page.locator('.jpx-records-column-help').count(),0);
 const before=await page.locator('#jpx-records-sheet').boundingBox();await toggle(page,'drops').uncheck();await toggle(page,'potions').uncheck();
 assert.equal(await page.locator('.jpx-records-save-toast').count(),1);assert.equal(await page.locator('.jpx-records-save-toast').getAttribute('role'),'status');
 assert.equal(await page.locator('.jpx-records-column-status').textContent(),'');assert.deepEqual(await page.locator('#jpx-records-sheet').boundingBox(),before);
 await page.locator('.jpx-records-save-toast').waitFor({state:'detached',timeout:4000});
 await toggle(page,'drops').check();await page.evaluate(()=>__groups.quota());await page.evaluate(()=>{const input=document.querySelector('input[data-column-group=scrolls]');input.checked=false;input.dispatchEvent(new Event('change'));});
 assert.equal(await page.locator('.jpx-records-save-toast').count(),0);assert.equal(await page.locator('.jpx-records-column-status').getAttribute('role'),'alert');assert.ok(await page.locator('.jpx-records-column-status').textContent());
 await toggle(page,'scrolls').uncheck();assert.equal(await page.locator('.jpx-records-column-status').textContent(),'');assert.equal(await page.locator('.jpx-records-save-toast').count(),1);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.jpx-records-save-toast'));await openColumns(page);assert.equal(await page.locator('.jpx-records-save-toast').count(),0);
 await toggle(page,'drops').uncheck();await page.evaluate(()=>__groups.render());await ready(page);assert.equal(await page.locator('.jpx-records-save-toast').count(),0);
});
